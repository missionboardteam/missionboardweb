import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dailyQuestions,gradeAnswers,practiceDate,SUBJECTS} from './daily-practice.server';
test('each Class 10 subject has 10 distinct daily questions',()=>{for(const subject of SUBJECTS){const q=dailyQuestions(subject,'2026-10-06');assert.equal(q.length,10);assert.equal(new Set(q.map(x=>x.id)).size,10);}});
test('each correct answer is worth 5 points, maximum 50 per subject',()=>{const q=dailyQuestions('science','2026-10-06');assert.equal(gradeAnswers(q,q.map(x=>x.correct)),50);const a=q.map(x=>(x.correct+1)%4);a[0]=q[0].correct;assert.equal(gradeAnswers(q,a),5);});
test('combined four-subject daily maximum is 200 points',()=>{assert.equal(SUBJECTS.reduce((sum,s)=>{const q=dailyQuestions(s,'2026-10-06');return sum+gradeAnswers(q,q.map(x=>x.correct));},0),200);});
test('daily set changes at midnight India time',()=>{assert.equal(practiceDate(new Date('2026-10-06T18:29:59Z')),'2026-10-06');assert.equal(practiceDate(new Date('2026-10-06T18:30:00Z')),'2026-10-07');assert.notDeepEqual(dailyQuestions('english','2026-10-06').map(q=>q.id),dailyQuestions('english','2026-10-07').map(q=>q.id));});
test('incomplete and invalid answers cannot be graded',()=>{const q=dailyQuestions('maths','2026-10-06');assert.throws(()=>gradeAnswers(q,[0]));assert.throws(()=>gradeAnswers(q,Array(10).fill(4)));});
