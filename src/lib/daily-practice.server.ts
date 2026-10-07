import { validWrittenAnswer, type PracticeAnswer } from './practice-answers';
export const SUBJECTS = ['english', 'maths', 'science', 'social'] as const;
export type Subject = typeof SUBJECTS[number];
export type Question = { id: string; prompt: string; kind: 'mcq' | 'short' | 'long'; options: string[]; correct: number; explanation: string; minWords?: number; maxWords?: number; rubric?: string[][] };
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
 bank[subject].push({ id, prompt, kind: 'mcq', options, correct: offset, explanation });
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
type WrittenTopic = { prompt: string; explanation: string; rubric: string[][] };
const writtenBank: Record<Subject, { short: WrittenTopic[]; long: WrittenTopic[] }> = {
 english: {
  short: [
   {prompt:'How does the incident in “Dust of Snow” change the poet’s mood?', explanation:'A crow shakes snow from a hemlock tree onto the poet. This small natural event changes his sad mood and saves part of a day he had regretted.',rubric:[['crow'],['snow'],['hemlock','tree'],['mood','sad','regret'],['change','saved','positive','happy']]},
   {prompt:'Why does Lencho call the post office employees “a bunch of crooks” in “A Letter to God”?',explanation:'Lencho asks God for one hundred pesos but receives only seventy. His unquestioning faith in God makes him blame the postal employees for stealing the missing thirty pesos.',rubric:[['god'],['hundred','100'],['seventy','70'],['thirty','30','missing'],['stole','steal','stolen','dishonest']]},
  ],
  long: [
   {prompt:'Discuss how “The Ball Poem” presents loss, responsibility and growing up. Explain the boy’s reaction and why the poet does not simply replace the ball.',explanation:'The lost ball represents childhood memories and personal loss. The boy grieves, learns that possessions cannot restore memories, and begins accepting responsibility in a world where loss is unavoidable.',rubric:[['loss','lost'],['childhood','memories'],['grief','sad','sorrow'],['money','replace','buy'],['responsibility','accept','growing']]},
   {prompt:'Explain the contrast between the tiger’s life in captivity and its imagined life in the forest in “A Tiger in the Zoo”. Discuss the poem’s message about freedom.',explanation:'The tiger is confined to a concrete cell, pacing in quiet rage and ignoring visitors. In the forest it would stalk prey near water and move freely. The contrast criticises captivity and the denial of freedom.',rubric:[['cell','cage','concrete'],['rage','anger','angry'],['forest','wild'],['prey','deer','water'],['freedom','captivity']]},
  ],
 },
 maths: {
  short: [
   {prompt:'Explain how to find the zeroes of x² − 5x + 6 by factorisation and verify the relationship between the zeroes and coefficients.',explanation:'Factorise as (x − 2)(x − 3). The zeroes are 2 and 3. Their sum is 5 = −b/a and their product is 6 = c/a.',rubric:[['factor'],['2'],['3'],['sum','5'],['product','6']]},
   {prompt:'An arithmetic progression has first term 3 and common difference 2. Explain how to find its tenth term and why the formula works.',explanation:'Use a_n = a + (n − 1)d. Nine equal increments of 2 follow the first term 3, so a_10 = 3 + 9 × 2 = 21.',rubric:[['first','3'],['difference','2'],['nine','9'],['21'],['term','formula']]},
  ],
  long: [
   {prompt:'Explain the substitution method for solving x + y = 7 and 2x − y = 2. Show the steps in words and equations, verify the solution in both equations, and interpret it geometrically.',explanation:'From x + y = 7, y = 7 − x. Substitute into 2x − y = 2 to get 3x = 9, so x = 3 and y = 4. Both equations hold. The two lines intersect at (3, 4), giving a unique solution.',rubric:[['substitut'],['3'],['4'],['verify','check','satisf'],['intersect','unique','lines']]},
   {prompt:'Explain how the distance formula follows from Pythagoras’ theorem. Apply it to A(1, 2) and B(4, 6), and discuss why the distance is unchanged when the points are reversed.',explanation:'The horizontal and vertical differences are 3 and 4. They form perpendicular sides of a right triangle. Pythagoras gives distance √(3² + 4²) = 5. Reversing the points changes signs but not squared differences.',rubric:[['pythagor'],['horizontal','vertical','perpendicular'],['5'],['square','squared','²'],['reverse','sign','unchanged']]},
  ],
 },
 science: {
  short: [
   {prompt:'Explain why an acid reacting with a metal usually produces hydrogen gas. Describe a test for the gas and give one example reaction.',explanation:'A reactive metal displaces hydrogen from dilute acid, forming a salt and hydrogen gas. Hydrogen burns with a pop when tested with a burning splint. Zinc and hydrochloric acid form zinc chloride and hydrogen.',rubric:[['hydrogen'],['salt'],['pop'],['splint','flame','burn'],['zinc','magnesium','zn','mg']]},
   {prompt:'Explain the role of xylem in plants and how transpiration helps water move from roots to leaves.',explanation:'Xylem transports water and minerals from roots to leaves. Water evaporating through stomata creates transpiration pull, helping draw a continuous water column upwards.',rubric:[['xylem'],['water','mineral'],['root'],['stomata','evaporat'],['pull','transpiration']]},
  ],
  long: [
   {prompt:'Describe the pathway of blood through the human heart. Explain double circulation and why separating oxygenated and deoxygenated blood is important.',explanation:'Deoxygenated blood enters the right atrium, then the right ventricle pumps it to the lungs through the pulmonary artery. Oxygenated blood returns by pulmonary veins to the left atrium and left ventricle, then travels through the aorta to the body. Two circuits prevent mixing and support efficient oxygen delivery.',rubric:[['right atrium','right ventricle'],['lung','pulmonary'],['left atrium','left ventricle'],['aorta','body'],['mix','separat','oxygen delivery']]},
   {prompt:'Explain Ohm’s law and describe an experiment to verify it. Include the circuit arrangement, measurements, expected graph, and the importance of keeping temperature constant.',explanation:'At constant temperature, V = IR. Connect an ammeter in series and a voltmeter in parallel across a resistor. Vary the potential difference, record current, and plot V against I. A straight line through the origin confirms constant resistance. Heating changes resistance and affects the result.',rubric:[['v = ir','v=ir','voltage','potential'],['ammeter','series'],['voltmeter','parallel'],['straight','origin'],['temperature','heat']]},
  ],
 },
 social: {
  short: [
   {prompt:'Explain what federalism means and describe how the Indian Constitution divides powers between levels of government.',explanation:'Federalism divides authority between central and state governments. India distributes subjects through the Union, State and Concurrent Lists, with constitutional protection for each level’s powers.',rubric:[['central','union'],['state'],['concurrent'],['constitution'],['power','authority']]},
   {prompt:'Explain why black soil is suitable for cotton cultivation. Include its water-holding capacity and one other characteristic.',explanation:'Black soil retains moisture and is rich in clay. It develops cracks in hot weather, helping aeration, and supports cotton cultivation in the Deccan region.',rubric:[['cotton'],['moisture','water'],['clay'],['crack','aeration'],['deccan','mineral']]},
  ],
  long: [
   {prompt:'Explain the causes, course and significance of the Salt March of 1930 in India’s freedom struggle. How did it contribute to the Civil Disobedience Movement?',explanation:'Gandhi opposed the British salt tax and monopoly. He marched from Sabarmati to Dandi in 1930 and broke the salt law. This accessible issue mobilised people across India, encouraged civil disobedience and challenged colonial authority.',rubric:[['gandhi'],['tax','monopoly'],['sabarmati','dandi'],['1930'],['civil disobedience','mass','mobilis','mobiliz']]},
   {prompt:'Compare the primary, secondary and tertiary sectors with examples. Explain their interdependence and why a rise in service-sector employment does not always mean all workers have secure jobs.',explanation:'The primary sector obtains natural resources, such as farming. The secondary sector manufactures goods. The tertiary sector provides services such as transport and banking. Sectors depend on one another, but informal service work may lack stable wages, social protection and job security.',rubric:[['farm','agricultur','natural'],['manufactur','factory'],['transport','bank','service'],['depend','connect'],['informal','security','secure','protection']]},
  ],
 },
};
export function dailyQuestions(subject: Subject, date: string): Question[] {
 const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000);
 const list = bank[subject];
 return Array.from({length: QUESTIONS_PER_DAY}, (_, i) => {
  if(i === 3 || i === 4) {
   const kind = i === 3 ? 'short' : 'long';
   const topics = writtenBank[subject][kind];
   const index = ((day % topics.length) + topics.length) % topics.length;
   return { ...topics[index], id: `${subject}-${kind}-${index}`, kind, options: [], correct: -1, minWords: kind === 'short' ? 40 : 100, maxWords: kind === 'short' ? 50 : 120 };
  }
  return list[((day * 7 + i) % list.length + list.length) % list.length];
 });
}
export function gradeAnswers(questions: Question[], answers: PracticeAnswer[]) {
 if (answers.length !== QUESTIONS_PER_DAY || questions.length !== QUESTIONS_PER_DAY) throw new Error('Answer all 10 questions before submitting.');
 return questions.reduce((score, q, i) => {
  const answer = answers[i];
  if (q.kind === 'mcq') {
   if(typeof answer !== 'number' || !Number.isInteger(answer) || answer < 0 || answer > 3) throw new Error('Select an option for each multiple-choice question.');
   return score + (answer === q.correct ? POINTS_PER_QUESTION : 0);
  }
  if(!validWrittenAnswer(answer, q.minWords ?? 0, q.maxWords ?? 0) || typeof answer !== 'string') throw new Error(`Question ${i+1} requires ${q.minWords}–${q.maxWords} words.`);
  // Key-point grading stays private; length alone never earns points.
  const normal = answer.toLowerCase().replace(/[^\p{L}\p{N}²=]+/gu, ' ').trim();
  const matches = q.rubric?.filter(group => group.some(term => normal.includes(term.toLowerCase()))).length ?? 0;
  const passed = matches >= Math.ceil((q.rubric?.length ?? 5) * 0.8);
  return score + (passed ? POINTS_PER_QUESTION : 0);
 }, 0);
}
