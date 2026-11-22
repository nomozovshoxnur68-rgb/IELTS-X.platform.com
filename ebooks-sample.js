'use strict';
/*
 * IELTSX — the sample e-books (Admin → E-books → "Add a sample e-book"): the starter workbook in the website's look, and
 * (below) a course book, a workbook and a vocabulary book in the designs of their books. Original texts written for IELTSX, so the
 * e-book reader, the exercises and the teachers' progress view can be tried at once. It is an ordinary book after it
 * is added: change, hide or delete it like any other. Server only (it holds the answers).
 */
const starter = {
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

/* ───────── the books in the designs of the Books page (every text written for IELTSX) ───────── */const course = {
  style: 'course',
  book: {
    title: 'IELTS Course Book · Bands 5–6.5 (sample)', author: 'IELTSX Team', category: 'Course book', level: 'B1–B2',
    description: 'A sample unit in the style of an IELTS course book: Starting off, Listening, Reading, Vocabulary and Key grammar, with "Exam advice" boxes and exercises that are checked for you one by one.'
  },
  units: [
    {
      title: 'City life', kind: 'lesson', minutes: 45,
      summary: 'Moving to a big city: form completion, multiple choice, True / False / Not Given, table completion and comparisons.',
      content: `# Starting off
::: task Work in pairs. Match the people (1–4) with their reasons for moving to a big city.
@match
1 Aziz wants a better-paid job. = more career opportunities
2 Lola loves concerts and the theatre. = a lively cultural scene
3 Timur is starting a degree course. = higher education
4 Malika would like to make new friends. = a wider social circle
:::
::: task Now discuss these questions.
- Would you rather live in a big city or a small town? Why?
- What problems do people often have when they first move to a city?
:::

# Listening | Section 1
::: info
- You hear a conversation between two people about an everyday situation.
- In this section only, you are given an example at the beginning.
- You write your answers on the question paper while you listen.
:::
::: note Recording script (this sample has no recording: read the conversation instead)
**Receptionist:** Good morning, City Sports Centre. How can I help?
**Daniel:** Hi, I'd like to join the centre. I've just moved here.
**Receptionist:** Of course. Can I have your name, please?
**Daniel:** Daniel Okafor — that's O-K-A-F-O-R.
**Receptionist:** And how old are you, Daniel?
**Daniel:** Twenty-four.
**Receptionist:** What's your address?
**Daniel:** 18 Mill Lane. It's near the river.
**Receptionist:** And a phone number?
**Daniel:** It's 07936 551 208.
**Receptionist:** Which activities are you interested in?
**Daniel:** Swimming, mainly. And maybe tennis.
**Receptionist:** Fine. The pool is open from six in the morning, and we have a group swim every Thursday evening. Membership is thirty-two pounds a month, but students pay twenty-five.
**Daniel:** I'm not a student any more, so the full price. Does it include the gym?
**Receptionist:** It does — the gym and the pool. Tennis courts are extra.
:::
::: task Read the questions, then read the script and answer them.
Questions 1–4
Complete the form below.
Write ONE WORD AND/OR A NUMBER for each answer.

### CITY SPORTS CENTRE — MEMBERSHIP FORM
| Name: | Daniel [Okafor] |
| Age: | [=24] |
| Address: | [18] Mill Lane |
| Phone: | [07936 551 208|07936551208] |
| Main interest: | [swimming] |
:::
::: advice Form completion
- While you read the questions, think about what type of information you need for each gap.
- You will often hear someone spell a name or say a number: make sure you know how to say letters and numbers in English.
- Write numbers as figures, not words.
:::
::: task Now answer Questions 5–7.
Questions 5–7
Choose the correct letter, A, B or C.
5 When is the group swim?
A every morning at six
B on Thursday evenings *
C at the weekend
6 How much will Daniel pay each month?
A £25
B £32 *
C £57
7 What does the membership include?
A the pool and the gym *
B the pool and the tennis courts
C the gym only
Why: The receptionist says "the gym and the pool. Tennis courts are extra."
:::
::: advice Multiple choice
- Before you listen, __underline__ the key idea in each question.
- The correct answer is often expressed using different words from the words in the question.
:::

# Reading | Section 1
::: passage Gardens on the rooftops
In many crowded cities, flat roofs that were once empty are being turned into gardens. A roof garden needs a strong roof, a layer that stops water from passing through, and a light kind of soil. Because of this, most new roof gardens are built on buildings that are less than thirty years old.

Supporters say that roof gardens keep buildings cooler in summer, so less electricity is used for air conditioning. They also hold rainwater for a while, which means the city drains are less likely to overflow after a storm. Birds and insects, especially bees, quickly find these new green spaces.

Not everybody is convinced, however. Some building owners point out that a roof garden costs more to build than an ordinary roof, and that the plants need regular care. In one city, a survey found that a third of roof gardens were no longer looked after five years after they were planted.
Source: written for IELTSX
:::
::: task Read the passage and answer Questions 1–5.
Questions 1–5
Do the following statements agree with the information given in the reading passage?
1 Most new roof gardens are on buildings that are less than thirty years old. = T
2 Roof gardens make buildings warmer in summer. = F
3 Roof gardens reduce the risk of drains overflowing after heavy rain. = T
4 The first roof gardens in Europe were built on schools. = NG
Why: The passage never says where or when the first roof gardens were built.
5 Roof gardens are cheaper to build than ordinary roofs. = F
:::
::: advice True / False / Not Given
- If the passage expresses the same information, write TRUE.
- If the passage expresses the opposite information, write FALSE.
- If the passage does not include the information, write NOT GIVEN.
:::
::: task Look at Questions 6–10. Then read the passage again and complete the table.
Questions 6–10
Complete the table below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.

| | What roof gardens give | What they need |
|---|---|---|
| The building | it stays [cooler] in summer | a [strong roof] |
| The city | fewer problems with [drains|the drains] | — |
| Nature | a home for birds and [insects|bees] | regular [care] |
:::

# Vocabulary | Problem or trouble?
::: note A learner's dictionary says
**problem** — a situation that causes difficulties and needs to be dealt with. It is countable: *a problem, a few problems.*
**trouble** — problems, difficulties or worries in general. It is almost always uncountable: *We had some trouble.*
:::
::: task Circle the correct word in each sentence.
1 Moving abroad can cause a few {problems*|troubles} at first.
2 We had some {problem|trouble*} finding a flat near the centre.
3 What's the {problem*|trouble} with your new phone?
4 My neighbours went to a lot of {problem|trouble*} to help me move in.
:::
::: task Find and correct the mistake in each sentence.
1 The noise of the traffic effects my sleep. = affects
2 Living far from parks has a bad affect on children. = effect
3 Many newcomers have troubles with the language. = problems|difficulties
:::

# Key grammar | Making comparisons
::: task Complete the sentences with the correct form of the adjective in brackets.
1 Life in the capital is [more expensive] (expensive) than life in my home town.
2 This is the [busiest] (busy) street in the whole city.
3 The metro is usually [faster|quicker] (fast) than the bus.
4 For many people, finding a flat is the [hardest] (hard) part of moving.
5 August is the [worst] (bad) month to look for a room near the university.
:::
::: panel Remember
- one syllable: *cheap → cheaper → the cheapest*
- two syllables ending in -y: *busy → busier → the busiest*
- two or more syllables: *expensive → more expensive → the most expensive*
- irregular: *good → better → the best · bad → worse → the worst*
:::`
    },
    {
      title: 'Working from home', kind: 'reading', minutes: 30,
      summary: 'Matching headings, Yes / No / Not Given, a flow-chart and a Writing Task 2 plan.',
      content: `# Reading | Section 2
::: passage The kitchen-table office
**A** When offices closed for several months, millions of people suddenly began to work at their kitchen tables. Many expected to return to the office as soon as they could. Instead, a large number discovered that they preferred to stay at home for at least part of the week.

**B** The most obvious gain is time. A worker who used to travel for an hour each way now has ten extra hours every week. Some use this time to sleep longer; others spend it with their families or on exercise.

**C** Yet working from home has a cost. Younger employees in particular say they miss learning from experienced colleagues simply by listening to them. Short conversations by the coffee machine, which once seemed unimportant, turn out to be the way many ideas begin.

**D** In my view, the answer is not to choose one place over the other. The companies that will do best are those that use the office for meeting and learning, and the home for quiet, focused work.
Source: written for IELTSX
:::
::: task Answer Questions 1–4.
Questions 1–4
The passage has four paragraphs, A–D. Choose the correct heading for each paragraph from the list of headings below.
@match
A An unexpected preference
B Learning that does not happen
C A mix of both places
D The hours that come back
E The price of office rent
1 Paragraph A = A
2 Paragraph B = D
3 Paragraph C = B
4 Paragraph D = C
:::
::: advice Matching headings
- Read the headings first, then read each paragraph and decide its main idea.
- There are more headings than paragraphs: you will not use all of them.
:::
::: task Answer Questions 5–7.
Questions 5–7
Do the following statements agree with the claims of the writer?
5 Most people who started working at home wanted to go back to the office at once. = N
6 Young employees lose an important way of learning when they work from home. = Y
7 Companies should pay for the furniture their staff use at home. = NG
:::
::: task Complete the flow-chart. Use ONE WORD from the passage for each answer.
@flow
Offices close and people work at their kitchen [tables]
Many find they [prefer] to stay at home for part of the week
Companies use the office for meeting and [learning] and the home for quiet work
:::

# Writing | Task 2
::: task Put the parts of this body paragraph in the right order. Write 1–4.
@labels 1, 2, 3, 4
a For example, someone who used to travel for an hour each way gains ten hours a week. = 3
b Working from home gives employees a great deal of extra time. = 1
c This is because they no longer have to travel to an office every day. = 2
d As a result, many people are healthier and less tired. = 4
:::
::: task Discuss with a partner, then write a plan for this task.
> Some people say that working from home is better for both employees and companies. To what extent do you agree or disagree?
- How many body paragraphs will you write?
- What is the main idea of each one?
- What example will you give in each paragraph?
:::`
    }
  ]
};

const workbook = {
  style: 'workbook',
  book: {
    title: 'IELTS Workbook · Bands 5–6.5 (sample)', author: 'IELTSX Team', category: 'Workbook', level: 'B1–B2',
    description: 'Extra practice in the style of an IELTS workbook: a reading text with exam tasks, vocabulary and grammar. Every exercise is checked for you.'
  },
  units: [
    {
      title: 'City life', kind: 'reading', minutes: 35,
      summary: 'Matching information, sentence completion, a box of words and verb forms.',
      content: `# Reading | Section 1
::: task Read the title and the first paragraph of the text below. What is it mainly about? Choose A, B or C.
1 The text is mainly about
A how cities plan new parks.
B why some people feel lonely in big cities. *
C how to find a flat in a new city.
:::
::: passage Alone in a crowd
**A** It seems strange that a person can feel lonely in a city of ten million people, yet surveys show that loneliness is often higher in large cities than in villages. Newcomers are especially likely to feel it during their first year.

**B** One reason is the size of the city itself. People live further from their families and spend long hours travelling. Neighbours change often, so there is little chance to get to know the people next door.

**C** Some cities have started to take the problem seriously. In one capital, the city council pays for free evening classes where neighbours can learn a skill together, such as cooking or repairing bicycles. Another city has opened "talking benches" in its parks, where anyone who sits down is happy to chat.

**D** Experts say the most effective solution is simple: regular contact. Seeing the same faces every week — at a sports club, a choir or a language café — slowly turns strangers into friends.
Source: written for IELTSX
:::
::: task Now read the whole text and answer Questions 1–4.
Questions 1–4
The text has four paragraphs, A–D. Which paragraph contains the following information?
@match
A Paragraph A
B Paragraph B
C Paragraph C
D Paragraph D
1 examples of projects paid for by a city = C
2 a comparison between cities and villages = A
3 the advice of experts = D
4 a reason connected with travelling = B
:::
::: task Answer Questions 5–8.
Questions 5–8
Complete the sentences below.
Choose NO MORE THAN TWO WORDS from the text for each answer.
5 Loneliness is often worse during a newcomer's [first year].
6 Because neighbours change often, people rarely know the people [next door].
7 One council pays for free [evening classes].
8 Strangers slowly become friends through [regular contact].
:::

# Vocabulary
::: task Complete the sentences with words from the box. There is one word you do not need.
Box: crowded, rent, commute, neighbourhood, facilities, lonely
1 My daily [commute] takes almost an hour each way.
2 The [rent] for a one-room flat in the centre is very high.
3 It's a quiet [neighbourhood] with a lot of small shops.
4 The buses are always [crowded] in the morning.
5 The new sports centre has excellent [facilities].
:::

# Grammar | Present simple or present continuous?
::: task Circle the correct form.
1 I {live*|am living} in Tashkent, but I {stay|am staying*} with my aunt in London this month.
2 The city {grows|is growing*} very fast at the moment.
3 Most people {travel*|are travelling} to work by metro.
:::`
    }
  ]
};

const inuse = {
  style: 'inuse',
  book: {
    title: 'Collocations for IELTS (sample)', author: 'IELTSX Team', category: 'Vocabulary', level: 'B2–C1',
    description: 'Collocations in the style of a vocabulary "In Use" book: the explanation on a green page (A, B, C), then the exercises 1.1, 1.2 … — every one checked for you.'
  },
  units: [
    {
      title: 'Studying and learning', kind: 'vocabulary', minutes: 25,
      summary: 'Verbs and adjectives that go with study words, and the most common mistakes.',
      content: `# [A] Verbs that go with study words
Some verbs go naturally with words about studying. We **take** or **sit** an exam, and then we **pass** or **fail** it. We do not *make* an exam.
- She **did a degree** in economics and then **did research** on rural transport.
- You have to **meet the deadline** — late essays lose marks.
- I **took notes** during the lecture, but I didn't **attend** the seminar.
- Each student **gives a presentation** at the end of the course.

# [B] Adjectives and nouns
| collocation | example | comment |
| a steep learning curve | The first month at university was a steep learning curve. | = a lot to learn in a short time |
| a heavy workload | Final-year students have a heavy workload. | NOT a big workload |
| in-depth knowledge | The job needs in-depth knowledge of the law. | = very detailed knowledge |
| a broad education | A broad education includes science and the arts. | the opposite is a narrow education |
| a sound grasp of | He has a sound grasp of statistics. | formal: = a good understanding of |

# [C] Common mistakes
Learners often choose the wrong verb with these words:
- I want to **take** (NOT ~~make~~) a course in design.
- She **made** (NOT ~~did~~) a lot of progress this term.
- Please **pay attention** (NOT ~~give attention~~) to the instructions.

# Exercises
::: task Match the two parts of these collocations.
@match
1 meet = the deadline
2 sit = an exam
3 take = notes
4 give = a presentation
5 do = research
6 pay = attention
Extra: a mistake
:::
::: task Circle the correct word in each sentence.
1 You will {make|get|gain*} in-depth knowledge of marketing on this course.
2 Most first-year students have a very {heavy*|big|strong} workload.
3 Learning to drive in the city was a {high|steep*|tall} learning curve.
4 She has a {sound*|healthy|safe} grasp of grammar.
:::
::: task Correct the collocation errors. Write the correct verb.
1 I made an exam last Friday. = took|sat|did
2 He did a lot of progress in the second term. = made
3 Please give attention to the safety rules. = pay
:::
::: task Write F (formal), I (informal) or N (neutral) for each sentence.
@labels F, I, N
1 Applicants must have a sound grasp of statistics. = F
2 I totally bombed my maths exam! = I
3 She passed all her exams last year. = N
:::
::: task Complete the text with collocations from this unit. Use one word in each gap.
I started my degree last October. The first term was a steep learning [curve]: we had a heavy [workload] and every Friday we had to [meet] a deadline for an essay. Now I [take] notes in every lecture, and next month I will [give] my first presentation.
:::`
    },
    {
      title: 'Describing change', kind: 'vocabulary', minutes: 20,
      summary: 'Collocations for graphs and charts in Writing Task 1.',
      content: `# [A] Verbs and adverbs
| collocation | example | comment |
| rise sharply | Prices rose sharply in 2020. | a big, fast change |
| fall slightly | The number of visitors fell slightly in May. | a small change |
| increase steadily | Sales increased steadily for ten years. | at the same speed |
| fluctuate wildly | The price of fuel fluctuated wildly. | went up and down a lot |
| remain stable | Membership remained stable at 200. | = did not change |

# [B] Adjectives and nouns
A verb takes an adverb, but a noun takes an adjective:
> Prices **rose sharply**. → There was a **sharp rise** in prices.
> Sales **increased steadily**. → There was a **steady increase** in sales.
We also say **reach a peak**, **hit a low** and **level off**.

# Exercises
::: task Circle the correct word.
1 There was a {sharp*|sharply} rise in the price of rice.
2 The number of students increased {steady|steadily*} from 2015 to 2020.
3 Visitor numbers {reached*|made|did} a peak in August.
4 After 2018, the figures {levelled*|stayed|kept} off.
:::
::: task Rewrite the sentences with a noun. Complete the gaps.
1 Prices rose dramatically. → There was a [dramatic] [rise|increase] in prices.
2 Sales fell slightly. → There was a [slight] [fall|drop|decrease] in sales.
:::
::: task Complete the description with words from the box.
Box: peak, stable, fluctuated, gradual
Visitor numbers [fluctuated] between 2010 and 2014, and then there was a [gradual] increase until 2019, when they reached a [peak] of 40,000. Since then, they have remained [stable].
:::`
    }
  ]
};

module.exports = { ...starter, samples: { course, workbook, inuse } };
