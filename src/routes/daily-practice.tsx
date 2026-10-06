import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useQuery, useQueryClient, useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Calculator, FlaskConical, Globe, Trophy, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getDailyQuestions, getPracticeScores, submitPractice } from '@/lib/daily-practice.functions';
import { toast } from 'sonner';
const subjects = [
 {id:'english',name:'English',icon:BookOpen},
 {id:'maths',name:'Maths',icon:Calculator},
 {id:'science',name:'Science',icon:FlaskConical},
 {id:'social',name:'Social Science',icon:Globe},
] as const;
type Subject = typeof subjects[number]['id'];
const questionsOptions=(subject:Subject)=>queryOptions({queryKey:['daily-practice-questions',subject],queryFn:()=>getDailyQuestions({data:{subject}}),staleTime:0});
export const Route = createFileRoute('/daily-practice')({
 head:()=>({meta:[
  {title:'Daily Practice 🎯 — Mission Board Class 10'},
  {name:'description',content:'Attempt daily English, Maths, Science and Social Science Class 10 questions and track your combined points.'},
  {property:'og:title',content:'Daily Practice 🎯 — Mission Board Class 10'},
  {property:'og:description',content:'Ten daily questions per subject, five points per correct answer, and the Mission Board leaderboard.'},
  {property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'},
 ]}),
 loader:({context})=>context.queryClient.ensureQueryData(questionsOptions('english')),
 errorComponent:()=> <div className="mx-auto max-w-3xl px-5 py-12"><h1 className="text-xl font-bold">Practice couldn’t load</h1><p className="mt-2 text-muted-foreground">Please refresh and try again.</p><Link to="/batches" className="mt-4 block text-primary">Back to Batches</Link></div>,
 notFoundComponent:()=> <div className="p-8">Practice not found. <Link to="/batches">Back to Batches</Link></div>,
 component:DailyPracticePage,
});
function DailyPracticePage(){
 const [subject,setSubject]=useState<Subject>('english');
 const [tab,setTab]=useState<'practice'|'leaderboard'>('practice');
 const {user}=useAuth();
 const fetchScores=useServerFn(getPracticeScores);
 const scores=useQuery({queryKey:['practice-scores',user?.id],queryFn:()=>fetchScores(),enabled:!!user});
 const total=scores.data?.attempts.reduce((s,a)=>s+a.score,0)??0;
 return <main className="mx-auto max-w-3xl px-5 pt-7 pb-36 font-sans">
  <Button asChild variant="ghost" className="mb-6 px-0"><Link to="/batches"><ArrowLeft/>Batches</Link></Button>
  <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 text-xs font-bold uppercase text-primary">Class 10 · Daily challenge</p><h1 className="font-display text-3xl font-extrabold sm:text-4xl">Daily Practice 🎯</h1><p className="mt-3 text-sm text-muted-foreground">10 questions per subject · 5 points each</p><p className="mt-1 text-xs text-muted-foreground">New set at midnight IST · One scored attempt per subject daily</p></div>
  {user && <div className="border-l-2 border-primary pl-4"><span className="block text-xs text-muted-foreground">Your total points</span><strong className="text-3xl text-accent">{total}</strong></div>}</div>
  <div className="mt-8 flex gap-3 border-b border-border pb-3"><Button variant={tab==='practice'?'default':'ghost'} onClick={()=>setTab('practice')}><BookOpen/>Practice</Button><Button variant={tab==='leaderboard'?'default':'ghost'} onClick={()=>setTab('leaderboard')}><Trophy/>Leaderboard</Button></div>
  {!user && <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5"><p className="text-sm text-muted-foreground">Sign in to submit answers and save your points.</p><Button asChild variant="outline"><Link to="/auth">Sign in</Link></Button></div>}
  {scores.isError && <div role="alert" className="mt-4 text-sm text-destructive">Scores couldn’t load. <Button variant="link" onClick={()=>scores.refetch()}>Retry</Button></div>}
  {tab==='practice' ? <>
   <div className="my-6 grid grid-cols-2 gap-2 sm:grid-cols-4">{subjects.map(s=>{const done=scores.data?.attempts.find(a=>a.practice_date===scores.data.date&&a.subject===s.id);return <Button key={s.id} variant={subject===s.id?'default':'secondary'} className="h-14 flex-col gap-1" onClick={()=>setSubject(s.id)}><span className="flex items-center gap-1.5"><s.icon/>{s.name}</span><span className="text-[10px]">{done?`${done.score}/50 points`:'50 points'}</span></Button>})}</div>
   <QuestionSet key={subject} subject={subject} completed={scores.data?.attempts.find(a=>a.practice_date===scores.data.date&&a.subject===subject)?.score} canSubmit={!!user&&!scores.isLoading&&!scores.isError}/>
  </> : <section className="mt-6"><h2 className="font-display text-xl font-bold">All-subject leaderboard</h2><p className="mt-1 text-xs text-muted-foreground">All-time combined English, Maths, Science and Social Science points</p>
   {scores.isLoading?<Loader2 className="my-8 animate-spin"/>:user&&scores.data?.leaderboard.length?<ol className="mt-5 divide-y divide-border">{scores.data.leaderboard.map((row,i)=><li key={row.user_id} className="flex items-center gap-4 py-4"><span className="w-8 shrink-0 text-xl font-bold text-accent">{i+1}</span><div className="min-w-0 flex-1"><p className="break-words font-bold">{row.display_name}{row.user_id===user.id?' (You)':''}</p><p className="text-xs text-muted-foreground">{row.subjects_completed} subjects completed</p></div><strong className="shrink-0 text-lg text-primary">{row.total_points} <span className="text-xs">pts</span></strong></li>)}</ol>:<p className="py-10 text-sm text-muted-foreground">{user?'No scores yet. Complete a subject to join the leaderboard.':'Sign in to view the leaderboard.'}</p>}
  </section>}
 </main>;
}
function QuestionSet({subject,completed,canSubmit}:{subject:Subject;completed?:number;canSubmit:boolean}){
 const {data}=useSuspenseQuery(questionsOptions(subject));
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [busy,setBusy]=useState(false);
 const [result,setResult]=useState<Awaited<ReturnType<typeof submitPractice>>|null>(null);
 const submit=useServerFn(submitPractice);
 const qc=useQueryClient();
 const locked=completed!==undefined||result!==null;
 const count=data.questions.filter(q=>answers[q.id]!==undefined).length;
 async function finish(){
  setBusy(true);
  try{const response=await submit({data:{subject,date:data.date,answers:data.questions.map(q=>answers[q.id])}});setResult(response);await qc.invalidateQueries({queryKey:['practice-scores']});toast.success('Your score has been saved.');}
  catch(e){toast.error(e instanceof Error?e.message:'Could not submit answers.');}
  finally{setBusy(false);}
 }
 return <section><div className="mb-5 flex justify-between text-xs text-muted-foreground"><span>{data.date} · Class 10</span><span>{count}/10 answered</span></div>
  {locked&&<div role="status" className="mb-6 flex items-center gap-3 border-y border-border bg-secondary/40 px-4 py-5"><CheckCircle2 className="text-accent"/><div><strong className="text-lg">{result?.score??completed}/50 points</strong><p className="text-xs text-muted-foreground">Saved for today. Next set arrives at midnight IST.</p></div></div>}
  <div className="space-y-8">{data.questions.map((q,i)=>{const review=result?.review.find(r=>r.id===q.id);return <fieldset key={`${data.date}-${q.id}`} disabled={locked||busy} className="border-b border-border pb-7"><legend className="mb-4 flex gap-3 text-sm font-semibold leading-relaxed"><span className="text-primary">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="grid gap-2 sm:grid-cols-2">{q.options.map((option,j)=><label key={j} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm ${review?.correct===j?'border-accent bg-accent/10':answers[q.id]===j?'border-primary bg-primary/10':'border-border bg-card'}`}><input type="radio" name={q.id} value={j} checked={answers[q.id]===j} onChange={()=>setAnswers(a=>({...a,[q.id]:j}))} className="h-4 w-4 shrink-0 accent-primary"/><span className="break-words">{option}</span>{review?.correct===j&&<CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-accent"/>}</label>)}</div>{review&&<p className="mt-3 text-xs text-muted-foreground">Correct answer: {review.explanation}</p>}</fieldset>})}</div>
  {!locked&&<div className="mt-7 flex flex-wrap items-center justify-between gap-4"><span className="text-xs text-muted-foreground">Maximum 50 points · No negative marking</span><Button disabled={!canSubmit||count!==10||busy} onClick={finish}>{busy?<Loader2 className="animate-spin"/>:<ArrowRight/>}Submit answers</Button></div>}
 </section>;
}
