import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dailyQuestions,gradeAnswers,practiceDate,SUBJECTS} from './daily-practice.server';
import {countWords, type PracticeAnswer} from './practice-answers';
function correctAnswers(q: ReturnType<typeof dailyQuestions>): PracticeAnswer[] {
 return q.map(x=>{
  if(x.kind==='mcq') return x.correct;
  let answer=x.explanation;
  while(countWords(answer)<(x.minWords??0)) answer+=' This explains the topic clearly';
  return answer;
 });
}
test('each Class 10 subject has 10 distinct daily questions',()=>{for(const subject of SUBJECTS){const q=dailyQuestions(subject,'2026-10-06');assert.equal(q.length,10);assert.equal(new Set(q.map(x=>x.id)).size,10);}});
test('each correct answer is worth 5 points, maximum 50 per subject',()=>{const q=dailyQuestions('science','2026-10-06');assert.equal(gradeAnswers(q,correctAnswers(q)),50);const a=q.map(x=>x.kind==='mcq'?(x.correct+1)%4:Array(x.minWords).fill('unrelated').join(' '));a[0]=q[0].correct;assert.equal(gradeAnswers(q,a),5);});
test('combined four-subject daily maximum is 200 points',()=>{assert.equal(SUBJECTS.reduce((sum,s)=>{const q=dailyQuestions(s,'2026-10-06');return sum+gradeAnswers(q,correctAnswers(q));},0),200);});
test('daily set changes at midnight India time',()=>{assert.equal(practiceDate(new Date('2026-10-06T18:29:59Z')),'2026-10-06');assert.equal(practiceDate(new Date('2026-10-06T18:30:00Z')),'2026-10-07');assert.notDeepEqual(dailyQuestions('english','2026-10-06').map(q=>q.id),dailyQuestions('english','2026-10-07').map(q=>q.id));});
test('incomplete and invalid answers cannot be graded',()=>{const q=dailyQuestions('maths','2026-10-06');assert.throws(()=>gradeAnswers(q,[0]));assert.throws(()=>gradeAnswers(q,Array(10).fill(4)));});
test('Q4 is a 40–50-word short answer in every subject each day',()=>{for(const s of SUBJECTS)for(const day of ['2026-10-07','2026-10-08']){const q=dailyQuestions(s,day);assert.equal(q[3].kind,'short');assert.equal(q[3].minWords,40);assert.equal(q[3].maxWords,50);assert.equal(q[3].options.length,0);for(const n of [39,51]){const a=correctAnswers(q);a[3]=Array(n).fill('word').join(' ');assert.throws(()=>gradeAnswers(q,a),/Question 4 requires 40–50 words/);}for(const n of [40,50]){const a=correctAnswers(q);a[3]=Array(n).fill('word').join(' ');assert.doesNotThrow(()=>gradeAnswers(q,a));}}});
test('Q5 is a 100–120-word long answer in every subject each day',()=>{for(const s of SUBJECTS)for(const day of ['2026-10-07','2026-10-08']){const q=dailyQuestions(s,day);assert.equal(q[4].kind,'long');assert.equal(q[4].minWords,100);assert.equal(q[4].maxWords,120);assert.equal(q[4].options.length,0);for(const n of [99,121]){const a=correctAnswers(q);a[4]=Array(n).fill('word').join(' ');assert.throws(()=>gradeAnswers(q,a),/Question 5 requires 100–120 words/);}for(const n of [100,120]){const a=correctAnswers(q);a[4]=Array(n).fill('word').join(' ');assert.doesNotThrow(()=>gradeAnswers(q,a));}}});
