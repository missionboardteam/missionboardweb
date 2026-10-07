export type PracticeAnswer = number | string;

export function countWords(answer: string): number {
 return answer.trim().match(/\S+/gu)?.length ?? 0;
}

export function validWrittenAnswer(answer: PracticeAnswer | undefined, min: number, max: number): boolean {
 if (typeof answer !== 'string') return false;
 const count = countWords(answer);
 return count >= min && count <= max;
}