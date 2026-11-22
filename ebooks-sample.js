'use strict';
/*
 * IELTSX — the sample e-book (Admin → E-books → "Add the sample e-book"). Original texts written for IELTSX, so the
 * e-book reader, the exercises and the teachers' progress view can be tried at once. It is an ordinary book after it
 * is added: change, hide or delete it like any other. Server only (it holds the answers).
 */
module.exports = {
  book: {
    title: 'IELTS Starter Workbook',
    author: 'IELTSX Team',
    category: 'General',
    level: 'B1',
    description: 'A short interactive workbook: one unit for each skill of the exam, with exercises that are checked for you. Your progress is saved, so you always see how much is done and what is left.'
  },
  units: [
    {
      title: 'Listening: names, numbers and dates', kind: 'listening', minutes: 10,
      summary: 'Part 1 of the Listening test checks that you can write down details correctly.',
      content: [
        '## What Part 1 tests',
        'In Part 1 you hear an everyday conversation, for example somebody booking a room or joining a club. Most answers are **details**: a name that is spelled out, a phone number, a date, a price or an address.',
        '',
        '- Spelling counts: a name with one wrong letter is a wrong answer.',
        '- Numbers are often said in groups: *oh-seven-seven, double four, nine-one*.',
        '- Speakers often correct themselves: *on Monday… sorry, Tuesday*. The second word is the answer.',
        '',
        '## Numbers that sound alike',
        '| You hear | Stress | You write |',
        '| thir**teen** | on the end: thir-TEEN | 13 |',
        '| **thir**ty | on the start: THIR-ty | 30 |',
        '| fif**teen** | fif-TEEN | 15 |',
        '| **fif**ty | FIF-ty | 50 |',
        '',
        '## Letters and dates',
        '- *double s* = ss, *double o* = oo',
        '- *oh* in a phone number = 0',
        '- 3 June, June 3 and 3rd June are all fine, as long as the day and month are right.',
        '',
        '! Read the questions before the recording starts: you know which kind of word to listen for.'
      ].join('\n'),
      exercises: [
        { type: 'gap', q: 'You hear: "My surname is Browne — that\'s B-R-O-W-N-E." Write the surname: ____', answer: 'Browne', explain: 'The final E is part of the name; without it the answer is wrong.' },
        { type: 'gap', q: 'You hear: "My number is oh-seven-seven, double four, nine-one." Write the number: ____', answer: '0774491|077 4491|077-4491', explain: '"oh" = 0 and "double four" = 44.' },
        { type: 'choice', q: 'A speaker says "thir-TEEN", with the stress at the end. Which number is it?', options: ['13', '30', '3'], answer: '13', explain: 'Numbers ending in -teen are stressed on the end; -ty numbers on the start.' },
        { type: 'choice', q: 'You hear: "The class starts on Monday… no, sorry, on Tuesday." What do you write?', options: ['Monday', 'Tuesday', 'Monday or Tuesday'], answer: 'Tuesday', explain: 'When a speaker corrects themselves, the corrected word is the answer.' },
        { type: 'gap', q: 'You hear: "It\'s spelled M-O-double-R-I-S." Write the name: ____', answer: 'Morris', explain: '"double R" = RR.' }
      ]
    },
    {
      title: 'Reading: True, False or Not Given', kind: 'reading', minutes: 15,
      summary: 'How to decide between False and Not Given — with a short passage to practise on.',
      content: [
        '## The three answers',
        '- **True**: the passage says the same thing, often in other words.',
        '- **False**: the passage says the opposite.',
        '- **Not Given**: the passage does not say whether it is true or not.',
        '',
        '! If you cannot find the information anywhere, the answer is usually Not Given — do not use your own knowledge.',
        '',
        '## Practice passage: Gardens on the roof',
        'In many crowded cities, flat roofs are being turned into gardens. A roof garden needs a strong roof, a layer that stops water from going through, and light soil. Because of this, most new roof gardens are built on buildings that are less than thirty years old.',
        '',
        'Supporters say roof gardens keep buildings cooler in summer, so less electricity is used for air conditioning. They also hold rainwater for a while, which means the city drains are less likely to overflow after a storm.',
        '',
        'Not everybody is convinced. Some building owners point out that a roof garden costs more to build than a normal roof, and that plants need regular care. In one city, a survey found that a third of roof gardens were no longer looked after five years after they were planted.',
        '',
        '> Tip for the questions: underline the key words of each sentence, then find the same idea in the passage.'
      ].join('\n'),
      exercises: [
        { type: 'tfng', q: 'Most new roof gardens are on buildings that are less than thirty years old.', answer: 'True', explain: 'Paragraph 1 says exactly this.' },
        { type: 'tfng', q: 'Roof gardens make buildings warmer in summer.', answer: 'False', explain: 'The passage says they keep buildings cooler.' },
        { type: 'tfng', q: 'Roof gardens reduce the risk of city drains overflowing after heavy rain.', answer: 'True', explain: 'They hold rainwater for a while, so the drains are less likely to overflow.' },
        { type: 'tfng', q: 'Roof gardens are cheaper to build than normal roofs.', answer: 'False', explain: 'Building owners say a roof garden costs more.' },
        { type: 'tfng', q: 'The first roof gardens were built in Europe.', answer: 'Not Given', explain: 'The passage never says where the first ones were built.' },
        { type: 'tfng', q: 'In one city, about a third of roof gardens were not being looked after five years later.', answer: 'True', explain: 'The survey in the last paragraph found this.' }
      ]
    },
    {
      title: 'Vocabulary: describing change', kind: 'vocabulary', minutes: 10,
      summary: 'The words you need for graphs and charts in Writing Task 1.',
      content: [
        '## Going up and going down',
        '| Up | Down | No change |',
        '| rise, increase, grow, climb | fall, decrease, decline, drop | remain stable, stay the same, level off |',
        '',
        '- **peak** = reach the highest point',
        '- **fluctuate** = go up and down',
        '',
        '## How much and how fast',
        '- big change: *sharply, dramatically, significantly*',
        '- small change: *slightly, marginally*',
        '- steady change: *steadily, gradually*',
        '',
        '> Sales rose **sharply** in 2020 and then **levelled off**.',
        '> There was a **slight decrease** in the number of visitors.',
        '',
        '! A verb takes an adverb (rose sharply); a noun takes an adjective (a sharp rise).'
      ].join('\n'),
      exercises: [
        { type: 'choice', q: 'The price went up and down many times during the year. The price ____.', options: ['peaked', 'fluctuated', 'levelled off'], answer: 'fluctuated' },
        { type: 'choice', q: 'Which word describes a very small change?', options: ['dramatically', 'marginally', 'significantly'], answer: 'marginally' },
        { type: 'gap', q: 'Complete with an adjective: There was a ____ (sharp / sharply) rise in prices.', answer: 'sharp', explain: '"rise" is a noun here, so it takes an adjective.' },
        { type: 'gap', q: 'Complete with an adverb: Prices rose ____ (steady / steadily) for ten years.', answer: 'steadily', explain: '"rose" is a verb, so it takes an adverb.' },
        { type: 'choice', q: 'The number of students reached its highest point in May. It ____ in May.', options: ['peaked', 'declined', 'remained stable'], answer: 'peaked' }
      ]
    },
    {
      title: 'Writing Task 2: building a paragraph', kind: 'writing', minutes: 15,
      summary: 'A clear body paragraph in four steps, and the linking words that hold it together.',
      content: [
        '## Four steps',
        '1. **Point**: one sentence with the main idea of the paragraph.',
        '2. **Explain**: say why the point is true.',
        '3. **Example**: give a real or a typical example.',
        '4. **Link**: show how this answers the question.',
        '',
        '## Linking words',
        '| To add | To contrast | To give a result | To give an example |',
        '| moreover, in addition | however, on the other hand | therefore, as a result | for example, for instance |',
        '',
        '> **Point**: Working from home can make employees more productive. **Explain**: They do not lose time travelling to work. **Example**: For instance, someone who used to commute for an hour can start work fresh at nine. **Link**: Therefore, companies may benefit when staff work from home.',
        '',
        '! Every body paragraph has ONE main idea. Two ideas = two paragraphs.'
      ].join('\n'),
      exercises: [
        { type: 'choice', q: 'Which sentence is the best first (topic) sentence of a paragraph?', options: ['For example, my uncle works from home.', 'Working from home can save employees a lot of time.', 'Therefore, it is a good idea.'], answer: 'Working from home can save employees a lot of time.', explain: 'The topic sentence gives the main idea; examples and results come later.' },
        { type: 'choice', q: 'Online courses are cheap. ____, students may find it hard to stay motivated.', options: ['However', 'Moreover', 'For instance'], answer: 'However', explain: 'The second sentence contrasts with the first.' },
        { type: 'choice', q: 'Public transport reduces traffic. ____, the air in cities becomes cleaner.', options: ['On the other hand', 'As a result', 'For example'], answer: 'As a result' },
        { type: 'gap', q: 'Complete: Many cities have built cycle lanes. ____ instance, Copenhagen has hundreds of kilometres of them.', answer: 'For|for', explain: '"For instance" gives an example.' },
        { type: 'yng', q: 'The writer of this unit says one body paragraph should develop two main ideas.', answer: 'No', explain: 'The tip says every body paragraph has ONE main idea.' }
      ]
    },
    {
      title: 'Speaking Part 1: longer answers', kind: 'speaking', minutes: 8,
      summary: 'Turn short answers into full ones with a simple pattern. Read it, then say the examples aloud.',
      content: [
        '## Answer + reason + detail',
        'In Part 1 the examiner asks simple questions about you. "Yes" or "No" is too short; a whole speech is too long. Aim for two or three sentences:',
        '',
        '1. **Answer** the question directly.',
        '2. Give a **reason**.',
        '3. Add a **detail** or an example.',
        '',
        '> *Do you like reading?* — Yes, I do, mostly in the evenings. It helps me relax after a long day. At the moment I am reading a detective story that a friend lent me.',
        '> *Do you prefer the morning or the evening?* — I would say the morning. I feel more awake, so I do my hardest tasks before lunch.',
        '',
        '## Useful starts',
        '- *To be honest, …*',
        '- *I would say …*',
        '- *It depends. If …, then …*',
        '',
        '! Practise aloud: record yourself answering three Part 1 questions and listen for the reason and the detail.'
      ].join('\n'),
      exercises: []
    }
  ]
};
