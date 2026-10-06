import {test,expect} from 'bun:test';
import {dailyQuestions,gradeAnswers,practiceDate,SUBJECTS} from './daily-practice.server';
test('each Class 10 subject has 10 distinct daily questions',()=>{for(const subject of SUBJECTS){const q=dailyQuestions(subject,'2026-10-06');expect(q.length).toBe(10);expect(new Set(q.map(x=>x.id)).size).toBe(10);}});
test('each correct answer is worth 5 points, maximum 50 per subject',()=>{const q=dailyQuestions('science','2026-10-06');expect(gradeAnswers(q,q.map(x=>x.correct))).toBe(50);const a=q.map(x=>(x.correct+1)%4);a[0]=q[0].correct;expect(gradeAnswers(q,a)).toBe(5);});
test('combined four-subject daily maximum is 200 points',()=>{expect(SUBJECTS.reduce((sum,s)=>{const q=dailyQuestions(s,'2026-10-06');return sum+gradeAnswers(q,q.map(x=>x.correct));},0)).toBe(200);});
test('daily set changes at midnight India time',()=>{expect(practiceDate(new Date('2026-10-06T18:29:59Z'))).toBe('2026-10-06');expect(practiceDate(new Date('2026-10-06T18:30:00Z'))).toBe('2026-10-07');expect(dailyQuestions('english','2026-10-06').map(q=>q.id)).not.toEqual(dailyQuestions('english','2026-10-07').map(q=>q.id));});
test('incomplete and invalid answers cannot be graded',()=>{const q=dailyQuestions('maths','2026-10-06');expect(()=>gradeAnswers(q,[0])).toThrow();expect(()=>gradeAnswers(q,Array(10).fill(4))).toThrow();});
