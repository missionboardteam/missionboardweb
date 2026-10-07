import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
const subjectSchema = z.enum(['english','maths','science','social']);
export const getDailyQuestions = createServerFn({method:'GET'})
 .inputValidator((data: unknown) => z.object({subject:subjectSchema}).parse(data))
 .handler(async ({data}) => {
  const {dailyQuestions,practiceDate} = await import('./daily-practice.server');
  const date = practiceDate();
  return {date, questions:dailyQuestions(data.subject,date).map(({correct,explanation,rubric,...q}) => q)};
 });
export const getPracticeScores = createServerFn({method:'GET'}).middleware([requireSupabaseAuth])
 .handler(async ({context}) => {
  const {practiceDate} = await import('./daily-practice.server');
  const date = practiceDate();
  const [attempts, leaderboard] = await Promise.all([
   context.supabase.from('daily_practice_attempts').select('subject,score,practice_date').eq('user_id',context.userId).order('practice_date',{ascending:false}),
   context.supabase.rpc('daily_practice_leaderboard'),
  ]);
  if(attempts.error) throw new Error(attempts.error.message);
  if(leaderboard.error) throw new Error(leaderboard.error.message);
  return {date,attempts:attempts.data,leaderboard:leaderboard.data};
 });
export const submitPractice = createServerFn({method:'POST'}).middleware([requireSupabaseAuth])
 .inputValidator((data: unknown) => z.object({subject:subjectSchema,date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),answers:z.array(z.union([z.number().int().min(0).max(3),z.string().max(4000)])).length(10)}).parse(data))
 .handler(async ({data,context}) => {
  const {practiceDate,dailyQuestions,gradeAnswers} = await import('./daily-practice.server');
  const date=practiceDate();
  if(data.date !== date) throw new Error('A new practice day has started. Refresh to get today’s questions.');
  const questions=dailyQuestions(data.subject,date);
  const score=gradeAnswers(questions,data.answers);
  // Privileged insert follows validated identity and server-side grading. Clients cannot write scores.
  const {supabaseAdmin} = await import('@/integrations/supabase/client.server');
  const {error} = await supabaseAdmin.from('daily_practice_attempts').insert({user_id:context.userId,practice_date:date,subject:data.subject,answers:data.answers,score});
  if(error?.code === '23505') throw new Error('You have already completed this subject today.');
  if(error) throw new Error('Could not save your score. Please try again.');
  return {score,review:questions.map(q => ({id:q.id,correct:q.correct,explanation:q.explanation}))};
 });
