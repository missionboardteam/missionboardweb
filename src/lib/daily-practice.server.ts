export const SUBJECTS = ['english', 'maths', 'science', 'social'] as const;
export type Subject = typeof SUBJECTS[number];
export type Question = { id: string; prompt: string; options: string[]; correct: number; explanation: string };
export const QUESTIONS_PER_DAY = 10;
export const POINTS_PER_QUESTION = 5;
export function practiceDate(now = new Date()) {
 return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
const bank: Record<Subject, Question[]> = { english: [], maths: [], science: [], social: [] };
function add(subject: Subject, prompt: string, answer: string, distractors: string[], explanation = answer) {
 const id = `${subject}-${bank[subject].length}`;
 const offset = bank[subject].length % 4;
 const options = [...distractors]; options.splice(offset, 0, answer);
 bank[subject].push({ id, prompt, options, correct: offset, explanation });
}
const english: [string,string,string[]][] = [
 ['Choose the correct verb: Neither of the boys ___ absent.', 'is', ['are','were','have']],
 ['Complete: If I had studied, I ___ passed.', 'would have', ['will have','would','had']],
 ['Choose the passive form of “She writes a letter.”', 'A letter is written by her.', ['A letter wrote her.','A letter was written by her.','A letter has written her.']],
 ['Choose the reported form: He said, “I am tired.”', 'He said that he was tired.', ['He said that I am tired.','He says he was tired.','He said that he is tiring.']],
 ['Choose the correct article: He is ___ honest man.', 'an', ['a','the','no article']],
 ['Complete: She has lived here ___ 2020.', 'since', ['for','from','during']],
 ['Which word means “brief”?', 'Concise', ['Verbose','Endless','Lengthy']],
 ['What is the antonym of “optimistic”?', 'Pessimistic', ['Hopeful','Confident','Cheerful']],
 ['Complete: You ___ obey traffic rules.', 'must', ['might','would','could have']],
 ['Choose the correct phrase.', 'A piece of advice', ['An advice','Many advices','A advice']],
 ['In “Dust of Snow”, what bird shakes the snow?', 'A crow', ['A sparrow','An eagle','A dove']],
 ['Who wrote “Fire and Ice”?', 'Robert Frost', ['Walt Whitman','William Wordsworth','John Keats']],
 ['In “A Letter to God”, what destroys Lencho’s crop?', 'A hailstorm', ['A drought','A flood','A fire']],
 ['In “The Ball Poem”, the lost ball represents what?', 'Loss and growing responsibility', ['A reward','A victory','A holiday']],
 ['Who is the author of “A Letter to God”?', 'G. L. Fuentes', ['Ruskin Bond','Robert Frost','H. G. Wells']],
 ['Choose the correct verb: Each of the students ___ a book.', 'has', ['have','are having','were']],
 ['Complete: I prefer tea ___ coffee.', 'to', ['than','over than','from']],
 ['Identify the figure of speech: “The wind whispered.”', 'Personification', ['Simile','Oxymoron','Pun']],
 ['Choose the correct question tag: She is coming, ___?', 'isn’t she', ['is she','does she','didn’t she']],
 ['In “A Tiger in the Zoo”, where is the tiger confined?', 'A concrete cell', ['A forest','A garden','A village']],
];
english.forEach(([p,a,d]) => add('english',p,a,d));
for (let n=2;n<=11;n++) {
 add('maths', `The zeroes of x² − ${n+1}x + ${n} are:`, `1 and ${n}`, [`−1 and −${n}`, `0 and ${n}`, `1 and −${n}`]);
 add('maths', `An AP has first term ${n} and common difference 3. What is its tenth term?`, String(n+27), [String(n+30),String(n+24),String(n+9)]);
 add('maths', `What is the distance between (0, 0) and (${3*n}, ${4*n})?`, String(5*n), [String(7*n),String(n),String(25*n)]);
}
const science: [string,string,string[]][] = [
 ['What gas is released when an acid reacts with a metal?', 'Hydrogen', ['Oxygen','Nitrogen','Carbon dioxide']],
 ['What is the pH of a neutral aqueous solution at 25°C?', '7', ['0','14','1']],
 ['Which acid is present in vinegar?', 'Acetic acid', ['Hydrochloric acid','Sulphuric acid','Nitric acid']],
 ['What is the chemical formula of baking soda?', 'NaHCO₃', ['Na₂CO₃','NaCl','CaCO₃']],
 ['Which process breaks glucose down to release energy in cells?', 'Respiration', ['Transpiration','Photosynthesis','Diffusion']],
 ['Which tissue transports water in plants?', 'Xylem', ['Phloem','Epidermis','Muscle']],
 ['Which organ filters blood to produce urine?', 'Kidney', ['Heart','Lung','Stomach']],
 ['What is the functional unit of the nervous system?', 'Neuron', ['Nephron','Alveolus','Platelet']],
 ['Which hormone regulates blood sugar?', 'Insulin', ['Adrenaline','Thyroxine','Growth hormone']],
 ['What is the SI unit of electric resistance?', 'Ohm', ['Volt','Ampere','Watt']],
 ['Which formula expresses Ohm’s law?', 'V = IR', ['V = I/R','R = VI','I = VR']],
 ['Which mirror is usually used as a vehicle rear-view mirror?', 'Convex mirror', ['Concave mirror','Plane mirror only','Parabolic mirror']],
 ['Which lens corrects myopia?', 'Concave lens', ['Convex lens','Cylindrical lens only','Plane glass']],
 ['What is the SI unit of electric power?', 'Watt', ['Joule','Coulomb','Ohm']],
 ['Which organisms form the first trophic level?', 'Producers', ['Herbivores','Carnivores','Top predators']],
 ['Which layer protects Earth from harmful ultraviolet radiation?', 'Ozone layer', ['Cloud layer','Water vapour layer','Dust layer']],
 ['What is the usual valency of carbon?', '4', ['1','2','3']],
 ['What type of reaction combines two substances into one product?', 'Combination', ['Decomposition','Displacement','Double displacement']],
 ['What carries hereditary information?', 'DNA', ['Starch','Fat','Water']],
 ['Which process causes increasing toxin concentration at higher trophic levels?', 'Biomagnification', ['Biodegradation','Evaporation','Fermentation']],
];
science.forEach(([p,a,d]) => add('science',p,a,d));
const social: [string,string,string[]][] = [
 ['In which year did the French Revolution begin?', '1789', ['1815','1848','1917']],
 ['Who led the Salt March in 1930?', 'Mahatma Gandhi', ['Jawaharlal Nehru','Subhas Chandra Bose','Bhagat Singh']],
 ['Where did the Salt March end?', 'Dandi', ['Delhi','Champaran','Amritsar']],
 ['Which treaty recognised Greece as an independent nation in 1832?', 'Treaty of Constantinople', ['Treaty of Versailles','Treaty of Vienna','Treaty of Paris 1763']],
 ['What does federalism divide?', 'Power between levels of government', ['Only land','Only wealth','Only language groups']],
 ['Which country is a key example of accommodation in power sharing?', 'Belgium', ['Sri Lanka','North Korea','Saudi Arabia']],
 ['How many subjects were originally in India’s Union List?', '97', ['66','47','22']],
 ['Which level of government is a Gram Panchayat?', 'Local government', ['State government','Union government','International government']],
 ['Which soil is especially suitable for growing cotton?', 'Black soil', ['Laterite soil','Desert soil','Mountain soil']],
 ['Which crop is a major kharif crop?', 'Rice', ['Wheat','Gram','Mustard']],
 ['Which crop is a major rabi crop?', 'Wheat', ['Rice','Jute','Cotton']],
 ['Which energy source is renewable?', 'Solar energy', ['Coal','Petroleum','Natural gas']],
 ['Which sector includes agriculture?', 'Primary sector', ['Secondary sector','Tertiary sector','Information sector']],
 ['Which sector includes manufacturing?', 'Secondary sector', ['Primary sector','Tertiary sector','Agricultural sector']],
 ['What is GDP?', 'Value of final goods and services produced within a country in a year', ['Total exports only','Total government taxes','Total population income from abroad only']],
 ['Which institution issues currency notes in India (other than one-rupee notes)?', 'Reserve Bank of India', ['State Bank of India','World Bank','Finance Commission']],
 ['What is collateral?', 'An asset pledged as security for a loan', ['The interest rate','A cash gift','A savings account fee']],
 ['What connects production across countries?', 'Globalisation', ['Isolation','Protection alone','Subsistence farming']],
 ['Which organisation sets rules for international trade?', 'WTO', ['WHO','UNICEF','UNESCO']],
 ['What is the main purpose of consumer protection?', 'Protect consumers against unfair practices', ['Stop all trade','Set every wage','Abolish all taxes']],
];
social.forEach(([p,a,d]) => add('social',p,a,d));
export function dailyQuestions(subject: Subject, date: string): Question[] {
 const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000);
 const list = bank[subject];
 return Array.from({length: QUESTIONS_PER_DAY}, (_, i) => list[((day * 7 + i) % list.length + list.length) % list.length]);
}
export function gradeAnswers(questions: Question[], answers: number[]) {
 if (answers.length !== QUESTIONS_PER_DAY || questions.length !== QUESTIONS_PER_DAY || answers.some(a => !Number.isInteger(a) || a < 0 || a > 3)) throw new Error('Answer all 10 questions before submitting.');
 return questions.reduce((score, q, i) => score + (answers[i] === q.correct ? POINTS_PER_QUESTION : 0), 0);
}
