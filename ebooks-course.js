'use strict';
/*
 * IELTSX — the ready e-book "IELTSX Course Book · Bands 5–6.5": 10 units in the design of a course book. Every unit has
 * Starting off, Reading, Listening (with its script: the book has no recordings), Vocabulary, Key grammar and Writing or
 * Speaking, with "Exam advice" boxes and exercises that are checked one by one. Every text and exercise was written for
 * IELTSX. The text is in the import format of ebook-doc.js ("=== unit"). ebooks.js puts the book on the Books page once
 * (the setting "ebook-builtin"); after that it is an ordinary book: change, hide or delete it in the admin panel.
 * Its partner is ebooks-workbook.js (the same ten topics). Server only (it holds the answers).
 */
const doc = require('./ebook-doc');

const TEXT = `
=== Home and neighbourhood
kind: lesson
minutes: 60
summary: Where people live: True / False / Not Given, sentence completion, form completion, words for places, present tenses and Speaking Part 1.
---
# Starting off
::: task Match the words (1–5) with their meanings.
@match
@cols
1 spacious = with a lot of room
2 cramped = too small for the people in it
3 convenient = near the things you need
4 lively = full of people and activity
5 run-down = old and in bad condition
Extra: expensive to rent
:::
::: task Work in pairs. Discuss these questions.
- What do you like most about the place where you live?
- Would you prefer to live in the centre of a city or in the suburbs? Why?
:::

# Reading | Section 1
::: passage The return of the corner shop
**A** For most of the last century, small neighbourhood shops were disappearing. Large supermarkets on the edge of town offered lower prices and free parking, and families began to do one big shop a week by car. In some countries, the number of independent grocers fell by more than half in thirty years.

**B** Recently, however, the trend has started to change. Many people now live alone or work long hours, so they buy smaller amounts of food more often. Instead of driving to a supermarket, they want a shop they can walk to on the way home. The big supermarket chains have noticed this, and several of them have opened small "express" stores in city centres.

**C** Independent shopkeepers say they offer something that large stores cannot: personal service. Owners often know their customers by name, and many will order a particular product if a customer asks for it. Some shops have also become meeting places, with a notice board for local events or a small table where older residents can sit and talk.

**D** Not every corner shop will survive. Rents in city centres are rising quickly, and online delivery services can bring groceries to the door within an hour. The shop owners who do well are usually those who find a special role, such as selling fresh bread from a local bakery or staying open late when other shops are closed.
Source: written for IELTSX
:::
::: task Read the passage and answer Questions 1–5.
Questions 1–5
Do the following statements agree with the information given in the reading passage?
1 Supermarkets outside towns attracted customers with cheaper prices. = T
2 People who live alone tend to shop less often than families. = F
Why: Paragraph B says they buy smaller amounts "more often".
3 Some supermarket chains have opened smaller shops in city centres. = T
4 Express stores are more expensive than large supermarkets. = NG
Why: The passage does not compare the prices of express stores and large supermarkets.
5 Many independent shopkeepers refuse to order special products for customers. = F
:::
::: advice True / False / Not Given
- The statements follow the order of the information in the passage.
- Look for words with the same meaning, not only the same words: *lower prices* = *cheaper*.
- Choose NOT GIVEN when the passage says nothing about the idea. Do not use your own knowledge of the world.
:::
::: task Answer Questions 6–10.
Questions 6–10
Complete the sentences below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
6 In the past, many families did one [big shop] a week by car.
7 Today people want a shop they can walk to on the way [home].
8 Some corner shops have a [notice board] for local events.
9 Online delivery services can bring groceries within [an hour|one hour].
10 Successful shop owners usually find a [special role].
:::

# Listening | Section 1
::: info
- You hear a conversation between two people about an everyday situation, for example booking a room or renting a flat.
- Most answers are details: names, numbers, dates, prices and addresses.
:::
::: chat Recording script — renting a flat (this book has no recording: read the conversation, then answer)
Agent: Good afternoon, Greenway Lettings. How can I help you?
Sara: Hello. I saw your advert for a flat on Station Road. Is it still available?
Agent: The one-bedroom flat? Yes, it is. Can I take your name first?
Sara: Sara Petrova. That's P-E-T-R-O-V-A.
Agent: Thank you. And what's the best number to call you on?
Sara: My mobile: 07814 302 966.
Agent: Great. The flat is on the third floor, and there's a lift. The rent is six hundred and fifty pounds a month.
Sara: Does that include bills?
Agent: It includes water, but not electricity or the internet.
Sara: I see. Is there anywhere to keep a bike?
Agent: Yes, there's a storage room in the basement. Cars are a problem, though — there's no parking.
Sara: That's fine, I don't drive. When could I see the flat?
Agent: Would Wednesday at five thirty suit you?
Sara: I'm afraid I finish work at six on weekdays. Could we make it Saturday morning?
Agent: Saturday at ten?
Sara: Perfect.
Agent: And just one more thing — how did you hear about us?
Sara: A colleague recommended you.
:::
::: task Read the script and answer Questions 1–8.
Questions 1–8
Complete the form below.
Write ONE WORD AND/OR A NUMBER for each answer.

### GREENWAY LETTINGS — ENQUIRY FORM
| Name: | Sara [Petrova] |
| Phone: | [07814 302 966|07814302966] |
| Flat: | one bedroom, on the [third|3rd] floor |
| Rent per month: | £[650] |
| Included in the rent: | [water] |
| Storage for: | a [bike|bicycle] |
| Viewing: | [Saturday] at 10 a.m. |
| Heard about the agency from: | a [colleague] |
:::
::: advice Form completion
- Before you listen, decide what kind of answer each gap needs: a name, a number, a day …
- Listen for changes: a speaker may suggest one time or day and then agree on another.
- Check your spelling, especially of names that are spelled out.
:::

# Vocabulary | Describing where you live
::: task Circle the correct word in each sentence.
1 Our flat is quite small, but the kitchen is surprisingly {spacious*|crowded}.
2 The streets near the market are always {crowded*|spacious} on Saturdays.
3 It's a very {convenient*|comfortable} location — the metro station is two minutes away.
4 Nobody has repaired the old houses on our street, so they look quite {run-down*|well-kept}.
5 I grew up in a quiet {suburb*|downtown} about ten kilometres from the centre.
:::
::: task Complete the sentences with words from the box. There are two words you do not need.
Box: commute, neighbours, rent, residents, facilities, landlord, outskirts
1 Our [landlord] has promised to repair the heating before winter.
2 Many [residents] of the area want a new park.
3 We live on the [outskirts] of the city, where houses are cheaper.
4 The [rent] went up by ten per cent this year.
5 My [neighbours] are very friendly; they often bring us food.
:::

# Key grammar | Present simple and present continuous
::: panel Remember
- Present simple: habits, facts and things that are always true — *I live with my parents. Rents rise every year.*
- Present continuous: actions happening now or around now, and changing situations — *I'm looking for a flat. Prices are rising.*
- Stative verbs (*know, want, belong, own, prefer, seem*) are not usually used in continuous forms: *I know the area well*, NOT ~~I am knowing~~.
:::
::: task Circle the correct form of the verbs.
1 My parents {own*|are owning} a small house near the river.
2 Look! They {build|are building*} a new school opposite our flat.
3 More and more young people {move|are moving*} to the capital these days.
4 The number 12 bus usually {stops*|is stopping} outside the library.
5 I {stay|am staying*} with my cousin this month until I find a new flat.
6 This area {seems*|is seeming} much quieter than the city centre.
:::
::: task Complete the sentences with the present simple or present continuous form of the verbs in brackets.
1 At the moment I [am looking|'m looking] (look) for a cheaper flat.
2 My sister [lives] (live) in Samarkand, but this week she is in Tashkent for a conference.
3 Rents in this city [are rising|'re rising] (rise) quickly this year.
4 We [don't know|do not know] (not know) many people in our new neighbourhood yet.
:::

# Speaking | Part 1
::: info
- Part 1 lasts 4–5 minutes. The examiner asks you questions about familiar topics such as your home, your studies or your work.
- Give a full answer: answer the question, then add a reason or an example.
:::
::: task Read two answers to the question *Do you live in a house or a flat?*
1 Which answer is better for Speaking Part 1?
A "A flat."
B "I live in a flat on the fifth floor of a fairly new building. It's not very big, but it's in a convenient area, so I can walk to most places." *
Why: Answer B answers the question, then adds details and a reason. One or two words are too short for Part 1.
:::
::: task Match the questions (1–4) with the best answers (A–D).
@match
A I'd change the kitchen. It's quite dark, so I'd like a bigger window.
B About ten years. My parents moved there when I started school.
C Yes, especially in the evenings, because the park nearby is full of families.
D My bedroom, definitely, because I can study there without interruptions.
1 How long have you lived there? = B
2 Which room do you like best? = D
3 Is there anything you would like to change about your home? = A
4 Is your neighbourhood a lively place? = C
:::
::: you
Answer these questions about your home. Give a reason or an example in every answer.
- Do you live in a house or a flat?
- What do you like most about your neighbourhood?
- Would you like to live somewhere else in the future?
:::

=== Learning for life
kind: lesson
minutes: 65
summary: How we learn and remember: matching headings, multiple choice, a discussion between students, study words, past simple and present perfect, and a table in Writing Task 1.
---
# Starting off
::: task Which of these ways of learning do you use? Which do you think works best? Discuss with a partner.
- reading your notes again and again
- testing yourself with flashcards
- explaining a topic to a friend
- watching video lessons
:::

# Reading | Section 2
::: passage Learning that lasts
**A** Most students know the feeling: you study hard the night before an exam, you remember enough to pass, and a month later almost everything has gone. In the 1880s, the German researcher Hermann Ebbinghaus measured this loss by teaching himself lists of nonsense syllables and testing how many he could recall over time. His results showed that most of what we learn is forgotten within days unless we review it.

**B** The good news is that forgetting can be slowed down. When information is reviewed several times, with longer and longer gaps between the reviews, it stays in the memory for much longer. This method is known as spaced practice. A student who studies a topic for one hour on three different days usually remembers far more than one who studies for three hours in a single evening.

**C** A second technique is even simpler: testing yourself. Many learners read their notes again and again, which feels productive because the material becomes familiar. However, recognising information is not the same as being able to recall it. Trying to answer questions without looking at your notes is harder, but this effort is exactly what makes the memory stronger.

**D** Despite this evidence, surveys suggest that few students use these methods. One reason is that they do not produce quick results: after a single session, re-reading often seems to work better. Teachers can help by building short quizzes into their lessons and by returning to old topics later in the course instead of moving on for good.
Source: written for IELTSX
:::
::: task Answer Questions 1–4.
Questions 1–4
The passage has four paragraphs, A–D. Choose the correct heading for each paragraph.
@match
1 Paragraph A = An early study of forgetting
2 Paragraph B = Spreading the work over time
3 Paragraph C = Why harder can be better
4 Paragraph D = A method that is rarely used
Extra: The best time of day to study, How teachers mark exams
:::
::: advice Matching headings
- Read each paragraph and ask yourself: what is the main idea? Do not choose a heading just because it contains a word from the paragraph.
- There are more headings than paragraphs, so you will not use all of them.
:::
::: task Answer Questions 5–7.
Questions 5–7
Choose the correct letter, A, B or C.
5 What did Ebbinghaus use in his research?
A lists of words from several languages
B syllables with no meaning *
C the exam results of his students
6 According to the writer, spaced practice means
A studying for longer periods each evening.
B reviewing information with longer and longer gaps between sessions. *
C studying several different subjects on the same day.
7 Why do many students like re-reading their notes?
A It makes the material feel familiar. *
B Their teachers recommend it.
C It takes less time than other methods.
Why: Paragraph C: re-reading "feels productive because the material becomes familiar".
:::
::: task Answer Questions 8–9.
Questions 8–9
Choose TWO letters, A–E.
8 Which TWO things does the writer suggest teachers should do?
A give students more homework
B include short quizzes in lessons *
C allow students to use their notes in tests
D come back to topics taught earlier in the course *
E teach fewer topics in each course
:::

# Listening | Section 3
::: info
- In Section 3 you hear two or three people, often students and a tutor, discussing a piece of work.
- The questions are often about their opinions and what they decide to do.
:::
::: chat Recording script — planning a presentation (read the conversation, then answer)
Tutor: So, Maya and Leo, have you decided on a topic for your presentation?
Maya: We have. We want to look at how students in our year prepare for exams.
Leo: At first we thought about comparing different universities, but that would mean too much travelling.
Tutor: Sensible. How will you collect your information?
Maya: We're going to do an online questionnaire. We thought about interviews, but they take too long to organise.
Tutor: And how many students will you ask?
Leo: We're hoping for about eighty replies.
Tutor: Good. What will be the hardest part, do you think?
Maya: Probably analysing the results. Neither of us has used the statistics software before.
Tutor: The library runs a short course on that. I'd recommend it.
Leo: Great. And for the presentation itself, we'd like to use a short video rather than lots of slides.
Tutor: That could work, but keep it under two minutes.
:::
::: task Answer Questions 1–5.
Questions 1–5
Choose the correct letter, A, B or C.
1 Why did the students decide not to compare universities?
A It would involve too much travel. *
B The tutor did not like the idea.
C There was not enough information available.
2 How will the students collect their data?
A by interviewing students
B with an online questionnaire *
C by asking teachers for exam results
3 What do the students think will be most difficult?
A finding enough students
B writing the questionnaire
C analysing the results *
4 What does the tutor suggest?
A asking a classmate for help
B taking a course at the library *
C choosing a different topic
5 What does the tutor say about the video?
A It should be short. *
B It should replace the slides completely.
C It must be checked by the tutor first.
Why: The tutor says "keep it under two minutes".
:::
::: advice Multiple choice in Section 3
- The speakers often mention all three options. Wait until you are sure which one they agree on before you choose.
- The words in the options are usually different from the words you hear.
:::

# Vocabulary | Study and education
::: task Circle the correct verb.
1 She {did*|made} a lot of research before she wrote her essay.
2 I need to {make*|do} a decision about which course to take.
3 He {attended*|assisted} every lecture in the first term.
4 Please {hand*|give} in your assignment by Friday.
5 Don't worry if you {fail*|lose} the test — you can take it again.
6 We have to {meet*|catch} the deadline for the project.
:::
::: task Complete the sentences with one word in each gap.
1 I'm going to [take|sit] an English exam next month.
2 My brother is studying for a [degree|diploma] in engineering.
3 You can borrow books from the university [library].
4 She got very good [marks|grades|results] in her final exams.
:::

# Key grammar | Past simple and present perfect
::: panel Remember
- Past simple: a finished action at a finished time — *I started school in 2012. He failed the test last week.*
- Present perfect: an experience, or a past action that is connected to now — *I have taken three IELTS tests. She has just finished her essay.*
- Use *for* with a period of time and *since* with a point in time: *for six months, since January.*
:::
::: task Circle the correct form.
1 I {learned*|have learned} to swim when I was seven.
2 My English {improved|has improved*} a lot since I started this course.
3 {Did you ever study|Have you ever studied*} abroad?
4 Ebbinghaus {published*|has published} his research in 1885.
5 We {knew|have known*} each other since we were at primary school.
:::
::: task Complete the sentences with *for* or *since*.
1 I have studied English [for] six years.
2 She has lived in the student hall [since] September.
3 They haven't seen their teacher [since] the summer.
4 We have waited [for] almost an hour.
:::

# Writing | Task 1
::: info
- In Writing Task 1 you describe information from a graph, chart, table or diagram in at least 150 words.
- You have about 20 minutes. Do not give your opinion: report what the information shows.
:::
The table below shows the percentage of adults in one country who took an online course, by age group, in 2015 and 2025.

| Age group | 2015 | 2025 |
|---|---|---|
| 18–24 | 21% | 48% |
| 25–44 | 15% | 39% |
| 45–64 | 6% | 22% |
| 65 and over | 2% | 11% |

::: task Read the model answer and complete it. Write ONE word in each gap.

The table [compares|shows] the percentage of adults in four age groups who took an online course in 2015 and 2025.
Overall, the figures [rose|increased|grew] in every age group, and young adults were the most likely to study online in both years.
In 2015, 21% of people aged 18–24 took an online course, compared with only 2% of those aged 65 and [over]. Ten years later, the figure for the youngest group had more than [doubled], reaching 48%.
The [proportion|percentage] of 25- to 44-year-olds also grew significantly, from 15% to 39%. Although the oldest group remained the [lowest|smallest], its figure rose more than fivefold, to 11%.
:::
::: advice Writing Task 1
- Start by saying what the table shows in your own words: *shows* → *compares*, *percentage* → *proportion*.
- Write an overview: the main trend and the biggest difference.
- Support what you say with numbers from the table.
:::
::: task Now write your own answer in your notebook. Describe the figures for the 45–64 age group and compare them with the other groups. Write at least 150 words.
:::

=== The world of work
kind: lesson
minutes: 65
summary: Jobs and working life: matching information, Yes / No / Not Given, note completion in a talk, work words, countable and uncountable nouns, and Speaking Part 2.
---
# Starting off
::: task Which of these are most important to you in a job? Put them in order, then compare with a partner.
- a high salary
- friendly colleagues
- flexible hours
- the chance to learn new skills
- a short journey to work
:::

# Reading | Section 2
::: passage Four days a week
**A** For more than a century, the standard working week in many countries has been five days long. Recently, however, a number of companies have tested a different model: staff work four days a week but receive the same salary as before. In most of these trials, employees were expected to complete the same amount of work in less time.

**B** Supporters of the idea point to several benefits. Workers who took part in trials often reported lower levels of stress and said they slept better. Many used the extra day for family, hobbies or household tasks that had previously filled their weekends. Some employers found that fewer staff took sick days and that it became easier to keep experienced employees.

**C** The model does not suit every business, though. A hospital or a shop cannot simply close for an extra day, so these employers need more complicated rotas in which different staff have different days off. Critics also warn that squeezing five days of work into four can make each working day longer and more tiring.

**D** In my opinion, the four-day week is worth trying, but it is not a magic solution. It works best where managers are willing to cut unnecessary meetings and where success is measured by results rather than by the number of hours people spend at their desks. Companies that simply remove a day without changing how they work are likely to be disappointed.
Source: written for IELTSX
:::
::: task Answer Questions 1–4.
Questions 1–4
The passage has four paragraphs, A–D. Which paragraph contains the following information?
@match
A Paragraph A
B Paragraph B
C Paragraph C
D Paragraph D
1 a reason why some businesses find the idea difficult = C
2 a description of what usually happens in a trial = A
3 the writer's personal view = D
4 benefits for the health of workers = B
:::
::: task Answer Questions 5–8.
Questions 5–8
Do the following statements agree with the claims of the writer?
5 The four-day week is suitable for every kind of business. = N
6 Companies should hold fewer unnecessary meetings if they introduce a four-day week. = Y
7 The number of hours spent at work is the best measure of success. = N
8 Most companies that try a four-day week keep it after the trial. = NG
Why: The writer does not say what most companies do after a trial.
:::
::: advice Yes / No / Not Given
- These questions are about the writer's opinions, not facts. Look for phrases such as *In my opinion*, *I believe* or *should*.
- Choose NO if the writer says the opposite, and NOT GIVEN if the writer does not give an opinion on the idea.
:::

# Listening | Section 2
::: info
- In Section 2 you hear one speaker talking about an everyday subject, for example a guided tour or the plan of an event.
:::
::: note Recording script — a talk at a careers fair (read it, then answer)
Good morning, everyone, and welcome to the City Careers Fair. I'm Daniel Reyes, and I'll quickly explain how the day is organised.

The fair is in two halls. In the Main Hall you'll find around forty employers, mostly from banking, engineering and retail. If you're interested in health or education, go to the smaller Blue Hall, next to the café.

Throughout the day there are short talks in Room 3. The most popular one is usually "Writing a CV that works", which starts at eleven fifteen, so I'd advise you to get there early.

If you'd like someone to look at your CV, our advisers are at the information desk by the main entrance. Each meeting lasts about ten minutes, and you'll need to book a time slot when you arrive.

Finally, please remember to collect a free bag at the exit. Inside you'll find a map of the fair and a list of companies that are offering internships this summer.
:::
::: task Answer Questions 1–7.
Questions 1–7
Complete the notes below.
Write ONE WORD AND/OR A NUMBER for each answer.

### City Careers Fair
- Main Hall: about [40|forty] employers (banking, engineering, retail)
- Blue Hall: jobs in health and [education]; next to the [café|cafe]
- Short talks: in Room [3|three]
- "Writing a CV that works" starts at [11.15|11:15|eleven fifteen]
- CV advice: book a time slot at the information [desk]
- Free bag: a map and a list of companies offering [internships]
:::
::: advice Note completion
- Look at the words before and after each gap: they tell you what kind of word is missing.
- The information in the notes comes in the same order as in the recording.
:::

# Vocabulary | Work and jobs
::: note Words that are often confused
**work** is usually uncountable: *I have a lot of work today.* **job** is countable: *She has a new job.*
**salary** — money paid every month, often for professional jobs. **wage** — money paid every week or for every hour.
**employer** — a person or company that gives people work. **employee** — a person who is paid to work for someone.
:::
::: task Circle the correct word.
1 My cousin is looking for a {job*|work} in marketing.
2 I can't come out tonight — I have too much {work*|job}.
3 Cleaners in this hotel are paid an hourly {wage*|salary}.
4 The company is a large {employer*|employee}: it has over 2,000 staff.
5 She {applied*|asked} for a position at the bank last week.
:::
::: task Complete the sentences with words from the box. There is one word you do not need.
Box: promoted, colleagues, retire, part-time, overtime, unemployed
1 My father plans to [retire] when he is sixty-five.
2 She was [promoted] to manager after only two years.
3 I work [part-time] while I'm at university — just twelve hours a week.
4 We often have to work [overtime] in December because the shop is so busy.
5 I get on very well with my [colleagues]: we often have lunch together.
:::

# Key grammar | Countable and uncountable nouns
::: panel Remember
- Countable nouns have a plural and can follow *a/an*: *a job, two jobs, many colleagues*.
- Uncountable nouns have no plural: *work, advice, information, equipment, research, furniture*.
- With uncountable nouns use *much, a little, some* or *a piece of*: *a piece of advice*, NOT ~~an advice~~.
:::
::: task Circle the correct words.
1 Could you give me some {advice*|advices} about my CV?
2 We don't have {much*|many} information about the new manager.
3 There are {a few*|a little} jobs available in the IT department.
4 The office has new {equipment*|equipments}.
5 How {many*|much} employees work for the company?
:::

# Speaking | Part 2
::: info
- In Part 2 the examiner gives you a card with a topic. You have one minute to prepare, then you speak for one to two minutes.
- Use the minute to make short notes about every point on the card.
:::
::: panel Describe a job you would like to do in the future.
You should say:
- what the job is
- what skills you would need
- how you could get this job
and explain why you would like to do it.
:::
::: task Read part of a candidate's answer and complete it. Write ONE word in each gap.

I'd like to talk about a job I've wanted to do for a long time: an architect. I've always been interested in buildings, and I [enjoy|like|love] drawing, so I think it would suit me.
To do this job, you need to be good at maths, and you also need to be creative. Architects work in teams, so you have to be able to communicate [with] other people.
I'd need to get a [degree|qualification] in architecture, which takes about five years, and then gain some practical experience in a company.
The main [reason] I'd like to do this job is that I want to design buildings that make people's lives better.
:::
::: you
Now prepare your own answer to the task card. Make notes for one minute, then speak for two minutes. Record yourself and listen: did you cover every point?
:::

=== Healthy habits
kind: lesson
minutes: 65
summary: Health and everyday life: multiple choice, summary completion with a box, a lecture with notes, health words, modal verbs and an advantages / disadvantages essay.
---
# Starting off
::: task Are these statements true for you? Discuss with a partner.
- I sleep at least seven hours a night.
- I walk or cycle for at least 30 minutes on most days.
- I usually eat breakfast.
- I spend more than six hours a day sitting down.
:::

# Reading | Section 1
::: passage The trouble with sitting
**A** Modern life involves a great deal of sitting. We sit to travel to work, we sit at a desk all day, and in the evening we sit in front of a screen. Many office workers spend most of their waking hours in a chair, often without moving for long periods.

**B** Long periods of sitting slow down the body's use of energy. The muscles in the legs, which are among the largest in the body, are hardly used, and blood flows more slowly. Over many years, people who sit for most of the day have a higher risk of heart disease and certain other illnesses, even if they exercise regularly.

**C** The solution is not necessarily to spend more time at the gym. Studies suggest that breaking up sitting time is just as important. Standing up for two or three minutes every half an hour, walking to a colleague's desk instead of sending a message, or holding meetings on foot can all make a difference.

**D** Some employers now provide desks that can be raised so that staff can work standing up. These desks are popular, but experts warn that standing all day is not ideal either, as it can cause back and foot pain. The best approach seems to be to change position often and to move whenever possible.
Source: written for IELTSX
:::
::: task Answer Questions 1–3.
Questions 1–3
Choose the correct letter, A, B or C.
1 What does the writer say about the leg muscles?
A They become stronger when we sit.
B They are not used much when we sit. *
C They need less energy than other muscles.
2 According to the passage, people who exercise regularly
A are not affected by long periods of sitting.
B may still be at risk if they sit for most of the day. *
C usually sit less than other people.
3 What do experts say about desks for standing?
A They should be used for no more than two hours a day.
B Standing all day can also cause problems. *
C They are too expensive for most companies.
:::
::: task Answer Questions 4–9.
Questions 4–9
Complete the summary using the words in the box.
Box: break up, gym, energy, position, message, blood, meetings, pain

When we sit for a long time, the body uses less [energy] and [blood] moves more slowly. Experts say it is important to [break up] periods of sitting, for example by walking to a colleague instead of sending a [message]. Standing all day can lead to back and foot [pain], so the best advice is to change [position] often.
:::
::: advice Summary completion with a box
- Read the summary first and decide what kind of word fits each gap: a noun, a verb, an adjective?
- There are more words in the box than gaps, and the words in the box are often different from the words in the passage.
:::

# Listening | Section 4
::: info
- Section 4 is a talk by one speaker on an academic subject, like a short lecture. There is no break in the middle.
:::
::: note Lecture script — why we need sleep (read it, then answer)
Today I'd like to look at sleep, something we all do but rarely think about.

Most adults need between seven and nine hours of sleep a night, while teenagers need even more — around nine hours. Yet surveys in many countries show that a large number of people regularly sleep less than six hours.

Why does sleep matter? First, it is essential for memory. While we sleep, the brain organises and stores the information we took in during the day. Students who sleep well after studying tend to remember more than those who stay up late.

Second, sleep affects our appetite. People who are short of sleep often feel hungrier and are more likely to choose sugary food.

So what can we do to sleep better? The most common advice is to keep a regular schedule — going to bed and getting up at the same time every day, even at weekends. It also helps to keep the bedroom cool and dark, and to avoid screens for about an hour before bed, because the light from phones makes the brain more alert.
:::
::: task Answer Questions 1–7.
Questions 1–7
Complete the notes below.
Write ONE WORD AND/OR A NUMBER for each answer.

### Sleep
- Teenagers need about [9|nine] hours a night.
- Many people regularly sleep less than [6|six] hours.
- During sleep the brain organises and stores [information] from the day.
- Lack of sleep can make people feel [hungrier|hungry] and choose sugary food.
- Advice: keep a regular [schedule]
- Keep the bedroom cool and [dark]
- Avoid [screens] for about an hour before bed
:::
::: advice Section 4
- Read all the questions before the talk starts, as there is no pause.
- Use the headings in the notes to follow the talk, and listen for signposts such as *First*, *Second* and *So what can we do?*
:::

# Vocabulary | Health and fitness
::: task Match the verbs (1–5) with the words they go with.
@match
@cols
1 do = exercise
2 go on = a diet
3 lose = weight
4 catch = a cold
5 make = an appointment
Extra: a temperature
:::
::: task Circle the correct word.
1 Eating too much sugar is {bad*|wrong} for your teeth.
2 My grandfather {keeps*|stays} fit by swimming every morning.
3 Smoking {does*|makes} serious harm to your lungs.
4 You should {take*|make} regular breaks when you work at a computer.
5 The doctor {prescribed*|described} some medicine for my cough.
:::

# Key grammar | Modal verbs: obligation and advice
::: panel Remember
- *must* / *have to* — something is necessary: *You must wear a helmet. Nurses have to work at night.*
- *don't have to* — something is not necessary: *You don't have to pay; it's free.*
- *mustn't* — something is not allowed: *You mustn't smoke here.*
- *should* / *shouldn't* — advice: *You should drink more water.*
:::
::: task Circle the correct option.
1 The gym is free for students, so you {don't have to*|mustn't} pay.
2 You {mustn't*|don't have to} use your phone in the swimming pool area: it's against the rules.
3 I think you {should*|have to} see a doctor about that cough.
4 In many hospitals, doctors {have to*|should} work long night shifts.
5 You {shouldn't*|don't have to} eat so much fast food — it's bad for you.
:::

# Writing | Task 2
::: info
- In Writing Task 2 you write an essay of at least 250 words in about 40 minutes.
- Task 2 is worth twice as many marks as Task 1.
:::
::: panel Writing task
More and more people work in offices and spend most of the day sitting down.
What are the advantages and disadvantages of this way of working?
:::
::: task Put the paragraphs of the essay plan in the correct order. Write 1–4.
@labels 1, 2, 3, 4
a Disadvantages: health risks of sitting; less physical activity; tired eyes from screens = 3
b Introduction: more office work today; the essay will look at both sides = 1
c Conclusion: the advantages are real, but workers need to move more during the day = 4
d Advantages: comfortable, safe work; easy to work with computers and colleagues = 2
:::
::: task Complete the useful phrases for this kind of essay. Write ONE word in each gap.
1 [On] the one hand, office work is safe and comfortable.
2 On the [other] hand, sitting all day can damage our health.
3 One [advantage|benefit] of working in an office is that colleagues are close by.
4 The main [disadvantage|drawback] is the lack of physical activity.
5 In [conclusion], the benefits are clear, but so are the risks.
:::
::: task Now write the essay in your notebook. Use the plan and at least three phrases from this page.
:::

=== Connected lives
kind: lesson
minutes: 65
summary: Technology and communication: True / False / Not Given, a flow-chart, form completion, technology words, relative clauses and comparing figures in Writing Task 1.
---
# Starting off
::: task How do you use your phone? Put these activities in order, from the one you do most often to the one you do least often. Then compare with a partner.
- sending messages
- watching videos
- making phone calls
- reading the news
- studying
- playing games
:::

# Reading | Section 1
::: passage Cables under the sea
**A** When you send a message to a friend on another continent, it is easy to imagine that it travels through space. In fact, the vast majority of international internet traffic travels along cables that lie on the ocean floor. There are several hundred of these cables in use around the world, and together they are more than a million kilometres long.

**B** A modern cable is surprisingly thin — in deep water, often no wider than a garden hose. Inside, the information is carried as pulses of light along glass fibres. Near the coast, where the cable could be damaged by ships' anchors or fishing nets, it is protected by extra layers of steel and is often buried under the sea floor.

**C** Laying a cable is a slow process. First, engineers survey the route to avoid underwater mountains and other hazards. Then a specialised ship carrying the cable sails slowly along the route, lowering it to the bottom. Finally, the ends of the cable are connected to stations on land, where the signal is passed into national networks.

**D** Cables do break, usually because of accidents near the shore. Since most countries are connected by more than one cable, users rarely notice, as the traffic is simply sent another way. Repair ships, however, may need several days to find the damaged section and lift it to the surface.
Source: written for IELTSX
:::
::: task Read the passage and answer Questions 1–5.
Questions 1–5
Do the following statements agree with the information given in the reading passage?
1 Most international internet traffic is sent through space. = F
2 Cables in deep water are thicker than cables near the coast. = F
Why: Near the coast the cable has "extra layers of steel", so it is thicker there.
3 Fishing equipment can damage cables near the coast. = T
4 The first undersea cable was laid in the nineteenth century. = NG
Why: The passage does not talk about the history of undersea cables.
5 Internet users usually notice when a cable breaks. = F
:::
::: task Answer Questions 6–9.
Questions 6–9
Complete the flow-chart below.
Choose ONE WORD ONLY from the passage for each answer.
@flow
Engineers [survey] the route to avoid hazards such as underwater mountains
The cable is lowered to the bottom from a slow-moving [ship]
The ends of the cable are connected to [stations] on land
The signal is passed into national [networks]
:::
::: advice Flow-chart completion
- The steps of a flow-chart usually follow the order of the passage.
- Check the word limit: if it says ONE WORD ONLY, an answer of two words is wrong.
:::

# Listening | Section 1
::: chat Recording script — booking a phone repair (read the conversation, then answer)
Assistant: Hello, FixFast Repairs. How can I help?
Omar: Hi. The screen on my phone is broken, and I'd like to book a repair.
Assistant: Certainly. What make and model is it?
Omar: It's a Novaphone X7.
Assistant: Thanks. And when did it happen?
Omar: Last Sunday. I dropped it on the stairs.
Assistant: OK. A new screen for that model costs eighty-five pounds, and it takes about two hours.
Omar: Can you also check the battery? It runs out very quickly.
Assistant: We can test it for free while we change the screen.
Omar: Great. Could I bring it in tomorrow?
Assistant: Tomorrow's full, I'm afraid. The earliest is Friday at nine fifteen.
Omar: That's fine.
Assistant: Can I have your name?
Omar: Omar Haddad. That's H-A-D-D-A-D.
Assistant: And a contact number?
Omar: It's 07522 418 093.
:::
::: task Answer Questions 1–7.
Questions 1–7
Complete the form below.
Write ONE WORD AND/OR A NUMBER for each answer.

### FIXFAST REPAIRS — BOOKING
| Customer name: | Omar [Haddad] |
| Phone model: | Novaphone [X7] |
| Problem: | broken [screen] |
| Cost: | £[85] |
| Also check: | the [battery] |
| Appointment: | [Friday] at 9.15 a.m. |
| Contact number: | [07522 418 093|07522418093] |
:::

# Vocabulary | Technology
::: task Match the words (1–6) with their meanings.
@match
1 download = copy a file from the internet to your device
2 update = install a newer version of a program
3 device = a phone, tablet or computer
4 password = a secret word that lets you use an account
5 wireless = working without cables
6 app = a program that you use on your phone
Extra: a person who designs websites
:::
::: task Complete the sentences with the correct form of the word in brackets.
1 The internet has made communication much [easier] (easy).
2 This laptop is very [reliable] (rely): it has never broken down.
3 There have been many [improvements] (improve) in mobile phones in the last ten years.
4 She works as a software [developer] (develop).
5 Online banking is very [convenient] (convenience).
:::

# Key grammar | Relative clauses
::: panel Remember
- Use *who* for people, *which* for things, *where* for places and *whose* for possession.
- *That* can replace *who* or *which* in defining relative clauses: *the phone that I bought*.
- Non-defining clauses give extra information and have commas. Do not use *that* in them: *My laptop, which is five years old, is still fast.*
:::
::: task Complete the sentences with *who*, *which*, *where* or *whose*.
1 An engineer is a person [who|that] designs or builds machines.
2 This is the shop [where] I bought my phone.
3 The app, [which] was launched last year, now has ten million users.
4 I have a friend [whose] brother works for a technology company.
5 The cable [which|that] connects the two countries was damaged by an anchor.
:::

# Writing | Task 1
The table below shows the average number of hours per day that people in three age groups spent online in 2010 and 2025.

| Age group | 2010 | 2025 |
|---|---|---|
| 16–24 | 3.5 hours | 6.2 hours |
| 25–49 | 2.1 hours | 4.5 hours |
| 50 and over | 0.9 hours | 3.1 hours |

::: task Circle the correct words in this model answer.
The table {shows*|is showing} how many hours per day people in three age groups spent online in 2010 and 2025. Overall, time online {increased*|decreased} in all three groups, and the youngest people spent the {most*|least} time online in both years. In 2010, people aged 16–24 spent 3.5 hours a day online, {while*|because} those aged 50 and over spent less than one hour. By 2025, the figure for the oldest group had more than {tripled*|halved}, reaching 3.1 hours.
:::
::: task Complete the sentences. Write ONE word in each gap.
1 The [figure|number] for the middle group rose from 2.1 to 4.5 hours.
2 People aged 25–49 spent [more|longer] time online than the oldest group, but [less] than the youngest.
3 The largest increase in hours was in the [youngest] group.
:::
::: advice Comparing figures
- Use *while* and *whereas* to compare two groups in one sentence.
- Use *more than doubled*, *tripled* and *rose fivefold* for big changes.
:::
::: task Now write a full answer of at least 150 words in your notebook. Begin with an overview and compare the three groups.
:::

=== Our planet
kind: lesson
minutes: 65
summary: The environment: matching headings, sentence endings, a talk about a beach clean-up, environment words, future forms and Speaking Part 3.
---
# Starting off
::: task Which of these things do you do to help the environment? Tell a partner.
- recycle paper and plastic
- use public transport
- avoid buying bottled water
- switch off lights when you leave a room
:::

# Reading | Section 2
::: passage Bringing back the wetlands
**A** For centuries, wetlands were seen as useless land. Marshes and swamps were difficult to farm, and they were often associated with disease. As a result, huge areas were drained and turned into fields, roads and towns. In some regions, more than half of the original wetlands have disappeared.

**B** Scientists now understand that wetlands do a great deal of valuable work. They act like giant sponges, soaking up water during heavy rain and releasing it slowly, which reduces flooding in nearby towns. They also clean water naturally, as plants and soil remove pollution before it reaches rivers and lakes.

**C** Wetlands are also home to a remarkable variety of wildlife. Many species of birds depend on them for food and as resting places during long migrations, and they provide safe areas where young fish can grow. When a wetland is drained, these animals usually disappear from the area within a few years.

**D** In many countries, projects are now under way to restore damaged wetlands. Often this is surprisingly simple: blocking old drainage channels allows water to return, and plants and animals soon follow. However, restoration can cause conflict with farmers, who may lose land that their families have used for generations. The most successful projects pay landowners fairly and involve local people from the start.
Source: written for IELTSX
:::
::: task Answer Questions 1–4.
Questions 1–4
The passage has four paragraphs, A–D. Choose the correct heading for each paragraph.
@match
1 Paragraph A = A history of destruction
2 Paragraph B = Natural protection and cleaning
3 Paragraph C = A home for many creatures
4 Paragraph D = Repairing the damage
Extra: The cost of building new towns, Why farmers prefer wetlands
:::
::: task Answer Questions 5–8.
Questions 5–8
Complete each sentence with the correct ending, A–F.
@match
A because they hold water and release it slowly.
B because they were hard to farm.
C because they offer protection to young fish.
D because farmers may lose land.
E because wetlands produce too much rain.
F because the plants and soil remove pollution.
5 In the past, wetlands were drained = B
6 Wetlands reduce the risk of floods = A
7 Water that passes through wetlands becomes cleaner = F
8 Restoration projects can lead to disagreements = D
:::
::: advice Sentence endings
- First read the beginnings of the sentences and find the part of the passage they refer to.
- The ending you choose must be correct according to the passage AND make a correct sentence.
:::

# Listening | Section 2
::: note Recording script — a beach clean-up day (read it, then answer)
Hello, and thanks for volunteering for this Saturday's beach clean-up. I'm Grace, one of the organisers, and I'll explain the plan.

We'll meet at nine o'clock in the car park next to the lifeboat station. Please don't go to the old pier — it's closed for repairs this month.

You don't need to bring any equipment. We'll give everyone gloves, a bag and a litter picker. What you should bring is a bottle of water and sun cream, as there's very little shade on the beach.

Last year, the most common item we collected wasn't plastic bottles, as most people expect — it was cigarette ends, followed by food wrappers. This year we're also recording every item we find, so that a university team can study where the litter comes from.

We'll finish at twelve thirty, and then there's a free lunch at the sailing club for all volunteers. Children are welcome, but anyone under fourteen must come with an adult.
:::
::: task Answer Questions 1–5.
Questions 1–5
Choose the correct letter, A, B or C.
1 Where will the volunteers meet?
A at the old pier
B in a car park *
C outside the sailing club
2 What should volunteers bring?
A gloves
B a bag
C water *
Why: The organisers give everyone gloves and a bag; volunteers should bring water and sun cream.
3 What was the most common item collected last year?
A plastic bottles
B cigarette ends *
C food wrappers
4 Why will volunteers record every item this year?
A to help researchers *
B to win a competition
C to send a report to the council
5 Children under fourteen
A cannot take part.
B must come with an adult. *
C must register online first.
:::

# Vocabulary | The environment
::: task Complete the sentences with words from the box.
Box: footprint, species, energy, waste, warming, emissions
1 Solar and wind power are examples of renewable [energy].
2 The snow leopard is an endangered [species].
3 Flying less is one way to reduce your carbon [footprint|emissions].
4 Factories must cut their [emissions] of harmful gases.
5 The rise in temperatures around the world is known as global [warming].
6 Every household produces a lot of [waste], and much of it could be recycled.
:::
::: task Circle the correct word.
1 Plastic bags take hundreds of years to {break down*|break up}.
2 We should {protect*|prevent} rare animals and the places where they live.
3 Heavy rain caused serious {flooding*|drought} in the valley.
4 The air in the city centre is badly {polluted*|pollution}.
5 Old phones should be {recycled*|rescued} rather than thrown away.
:::

# Key grammar | Future forms
::: panel Remember
- *will* — predictions based on opinion, and decisions made at the moment of speaking: *I think sea levels will rise. I'll carry that bag for you.*
- *going to* — plans and intentions, and predictions based on what we can see now: *We're going to plant trees. Look at those clouds — it's going to rain.*
- Present continuous — arrangements with a fixed time or place: *We're meeting at the car park at nine.*
:::
::: task Circle the most suitable form.
1 Look at that dark sky! It {is going to*|will} rain.
2 "The recycling bin is full." "Don't worry, I {will*|am going to} empty it."
3 We {are meeting*|meet} the other volunteers at nine tomorrow — it's all arranged.
4 I think electric cars {will*|are going to} be cheaper than petrol cars one day.
5 My sister has bought some seeds. She {is going to*|will} plant a vegetable garden.
:::

# Speaking | Part 3
::: info
- In Part 3 the examiner asks more general and abstract questions connected to the topic of Part 2. It lasts 4–5 minutes.
- Give your opinion, explain it and, if possible, mention another point of view.
:::
::: chat Model answer
Examiner: Do you think individuals or governments can do more to protect the environment?
Candidate: I'd say governments can do more, mainly because they can make laws that affect everyone. For example, if a government bans single-use plastic bags, millions of people change their habits overnight. That said, individuals still matter, because governments usually act when enough people demand change.
:::
::: task Look at the model answer again. Match the phrases (1–4) with their purpose.
@match
1 I'd say = giving an opinion
2 mainly because = giving a reason
3 For example = giving an example
4 That said = showing another point of view
:::
::: you
Answer these Part 3 questions. Give an opinion, a reason and an example each time.
- Why do some people not recycle their rubbish?
- Will people travel less in the future to protect the environment?
:::

=== On the move
kind: lesson
minutes: 65
summary: Travel and tourism: Yes / No / Not Given, multiple choice, matching in a discussion, travel words, conditionals and an opinion essay.
---
# Starting off
::: task Discuss these questions with a partner.
- What is the best journey you have ever taken?
- Do you prefer to plan every detail of a trip or to decide things as you go?
:::

# Reading | Section 3
::: passage In praise of slow travel
**A** I used to measure holidays by how much I could see. On one trip I visited six cities in ten days, spending more time in airports and on trains than in any of the places themselves. I came home exhausted, with hundreds of photographs and very few real memories.

**B** These days I travel differently. Instead of rushing between famous sights, I choose one place and stay there for a week or more. I rent a room rather than staying in a hotel, shop at the local market and walk everywhere. By the end of the week, the man at the bakery knows my order, and I have discovered cafés and parks that no guidebook mentions.

**C** This approach, often called slow travel, has other advantages. Travelling overland by train or bus produces far less pollution than flying. Money spent in small, family-run businesses tends to stay in the local economy rather than going to international companies. And staying longer in one place reduces the pressure on the few famous sights that are already overcrowded.

**D** I accept that slow travel is not possible for everyone. Many people have only a few days of holiday a year, and they understandably want to make the most of them. But even on a short break, it is worth asking whether seeing less might mean experiencing more.
Source: written for IELTSX
:::
::: task Answer Questions 1–5.
Questions 1–5
Do the following statements agree with the claims of the writer?
1 The trip to six cities left the writer with many lasting memories. = N
2 Renting a room is cheaper than staying in a hotel. = NG
Why: The writer rents a room but never compares its price with a hotel.
3 Travelling by train causes less pollution than travelling by plane. = Y
4 International companies should not be allowed to run hotels. = NG
5 People with very little holiday time are wrong to want to see a lot. = N
Why: The writer says they "understandably want to make the most of them".
:::
::: task Answer Question 6.
Question 6
Choose the correct letter, A, B or C.
6 What is the writer's main purpose?
A to describe a holiday in one particular city
B to encourage readers to consider a different way of travelling *
C to compare the costs of different types of transport
:::
::: advice The writer's purpose
- A question about the writer's purpose is about the whole passage, so think about every paragraph, not only one.
- Wrong options often describe only one detail of the passage.
:::

# Listening | Section 3
::: chat Recording script — a project on tourism (read the conversation, then answer)
Tutor: Right, Amira and Ben, let's look at the plan for your project. You're studying how tourism affects one town?
Amira: Yes — Harbourside. We've divided the work into four areas.
Tutor: Who's doing what?
Ben: I'm looking at jobs. Tourism creates a lot of work there, but most of it is seasonal, so I want to find out what people do in winter.
Amira: And I'm covering housing. A lot of homes in the old town are now rented to visitors, and local families say they can't afford to live there.
Tutor: What about transport?
Ben: We'll do that together. There are traffic problems in summer, and the council is planning a park-and-ride scheme.
Tutor: And the fourth area?
Amira: The environment — mainly litter on the beaches. Ben's going to interview the beach cleaning team.
Ben: Actually, I think it'd be better if you did that, Amira. You've already met their manager.
Amira: True. Fine, I'll do it.
:::
::: task Answer Questions 1–4.
Questions 1–4
Who will research each area of the project? Choose A, B or C.
@match
A Amira
B Ben
C both students
1 jobs = B
2 housing = A
3 transport = C
4 the environment = A
Why: Ben was going to do the interview at first, but in the end Amira agrees to do it.
:::
::: advice Matching in Section 3
- The speakers may change their minds, so listen to the end of each part of the conversation before you choose.
:::

# Vocabulary | Travel, trip or journey?
::: note Words that are often confused
**travel** is usually a verb or an uncountable noun: *I love to travel. Air travel is expensive.*
**trip** — a visit to a place and back again: *a business trip, a day trip.*
**journey** — the act of going from one place to another, especially a long way: *The journey took six hours.*
:::
::: task Circle the correct word.
1 The train {journey*|travel} from Tashkent to Samarkand takes about two hours.
2 We went on a day {trip*|journey} to the mountains.
3 {Travel*|Trip} broadens the mind.
4 Did you have a good {trip*|travel}?
5 My father is away on a business {trip*|journey} this week.
:::
::: task Complete the sentences with words from the box. There is one word you do not need.
Box: destination, sightseeing, accommodation, luggage, delayed, souvenirs
1 Our flight was [delayed] for three hours because of fog.
2 The hotel was full, so we had to find other [accommodation].
3 We spent the whole day [sightseeing] in the old town.
4 Bukhara has become a popular tourist [destination].
5 Please do not leave your [luggage] unattended.
:::

# Key grammar | Conditionals
::: panel Remember
- Zero conditional — general truths: *If you travel in August, prices are higher.*
- First conditional — real possibilities in the future: *If the train is late, we'll miss the connection.*
- Second conditional — imaginary or unlikely situations: *If I had more time, I would travel by train.*
:::
::: task Complete the sentences with the correct form of the verbs in brackets.
1 If it [rains] (rain) tomorrow, we will visit the museum instead.
2 If I [had] (have) more money, I would travel around the world.
3 If you heat ice, it [melts] (melt).
4 We [will miss|'ll miss] (miss) the flight if we don't leave now.
5 If I [were|was] (be) you, I would book the tickets early.
:::

# Writing | Task 2
::: panel Writing task
Some people think that tourism does more harm than good to the places that tourists visit.
To what extent do you agree or disagree?
:::
::: advice Opinion essays
- Make your opinion clear in the introduction and keep it the same throughout the essay.
- Each body paragraph should have one main idea, supported by an explanation and an example.
:::
::: task Read the introduction of an essay, then answer the question.
> (1) Tourism has become one of the world's largest industries. (2) While it brings money and jobs, it can also damage the environment and the lives of local people. (3) In my view, tourism does more good than harm, as long as it is carefully managed.
1 Which sentence gives the writer's opinion?
A sentence (1)
B sentence (2)
C sentence (3) *
:::
::: task Complete the topic sentences. Write ONE or TWO words in each gap.
1 [Firstly|First], tourism creates jobs for people who might otherwise be unemployed.
2 [Another|A second|One more] benefit is that visitors' money can be used to protect historic buildings.
3 [However], too many visitors can damage fragile natural areas.
:::
::: task Now write the essay in your notebook. Write at least 250 words.
:::

=== Food for thought
kind: lesson
minutes: 65
summary: Food and farming: table completion, matching features, a lecture with notes, food words, the passive and describing a process in Writing Task 1.
---
# Starting off
::: task Discuss these questions with a partner.
- How has the food people eat in your country changed in the last thirty years?
- Do you know where the fruit and vegetables you buy are grown?
:::

# Reading | Section 2
::: passage Farms in the sky
**A** By 2050, around two thirds of the world's population is expected to live in cities. Feeding all these people will be a challenge, especially as good farmland is limited and much of it is far from the cities where the food is eaten. One possible answer is vertical farming: growing crops indoors on shelves stacked one above another, often inside old warehouses or purpose-built towers.

**B** Vertical farms do not use soil. Instead, the roots of the plants sit in water containing all the nutrients they need, and LED lights replace the sun. Because conditions are controlled by computer, crops can be harvested all year round, and no pesticides are needed. Supporters claim that these farms use up to 95% less water than traditional fields, since the water is recycled.

**C** The main disadvantage is energy. Lighting and climate control are expensive, which is why most vertical farms grow salad leaves and herbs: they grow quickly and sell for a high price. Crops such as wheat and rice, which need much more space and light, are not yet profitable to grow indoors.

**D** Experts disagree about the future of the industry. Dr Lena Fischer, an agricultural economist, believes vertical farms will remain a small, specialist business unless the cost of electricity falls significantly. Professor Kenji Mori, an engineer, argues that new, more efficient lights are already reducing costs. A third researcher, Dr Ana Ruiz, points out that the greatest benefit may be freshness: food grown in the city can reach the shops within hours of being picked.
Source: written for IELTSX
:::
::: task Answer Questions 1–5.
Questions 1–5
Complete the table below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.

| Vertical farms | |
|---|---|
| Where crops grow | on [shelves] inside buildings |
| What replaces soil | water with [nutrients] |
| What replaces the sun | [LED lights] |
| Main problem | the cost of [energy|electricity] |
| Most common crops | salad leaves and [herbs] |
:::
::: task Answer Questions 6–8.
Questions 6–8
Look at the following statements and the list of people below. Match each statement with the correct person, A, B or C.
@match
A Dr Lena Fischer
B Professor Kenji Mori
C Dr Ana Ruiz
6 Better technology is already making vertical farming cheaper. = B
7 The biggest advantage of vertical farms is how fresh their food is. = C
8 Vertical farming will stay small if energy prices do not fall. = A
:::
::: advice Matching features
- Find the names in the passage first and __underline__ them: then you only need to read the sentences around each name.
- The statements use different words from the passage.
:::

# Listening | Section 4
::: note Lecture script — the story of salt (read it, then answer)
In today's lecture I'm going to talk about salt — a substance so common today that we hardly notice it, but one that has shaped history.

For thousands of years, salt was the main way of preserving food. Before refrigerators, meat and fish could be kept for months if they were covered in salt. This made salt extremely valuable, and in many places it was traded like money.

Some of the most famous trade routes crossed the Sahara Desert, where camels carried blocks of salt south to the cities of West Africa. It is often said that in some markets salt was exchanged for gold.

Salt was also an important source of income for governments. Many rulers placed a tax on it, because everyone needed it and it was easy to control where it was produced. In some countries these taxes were so unpopular that they led to protests.

Today, most of the salt produced in the world is not eaten at all. It is used in the chemical industry and, in cold countries, it is spread on roads in winter to stop ice from forming.
:::
::: task Answer Questions 1–7.
Questions 1–7
Complete the notes below.
Write ONE WORD ONLY for each answer.

### The history of salt
- Before refrigerators: salt was used to [preserve] meat and fish
- Very valuable: in many places it was traded like [money]
- Across the Sahara: salt was carried by [camels]
- In some markets it was said to be exchanged for [gold]
- Governments put a [tax] on salt, which sometimes led to [protests]
- Today: used mostly in industry and on [roads] in winter
:::

# Vocabulary | Food and cooking
::: task Match the cooking verbs (1–5) with their meanings.
@match
@cols
1 boil = cook in very hot water
2 fry = cook in hot oil
3 bake = cook in an oven, like bread
4 grill = cook under or over strong direct heat
5 chop = cut into small pieces
Extra: mix two things together
:::
::: task Circle the correct word.
1 This soup is far too {salty*|salted} — I can't eat it.
2 Would you like a {slice*|bar} of bread?
3 Fast food is often high {in*|of} fat and sugar.
4 Fresh fruit is a good {source*|resource} of vitamins.
5 We {grow*|rise} our own tomatoes in the garden.
:::

# Key grammar | The passive
::: panel Remember
- Form: *be* + past participle — *Salt is used in industry. The crops were harvested in May.*
- Use the passive when the action is more important than who does it, and in descriptions of processes.
- Use *by* only when it is important to say who or what does the action: *The salt was carried by camels.*
:::
::: task Complete the sentences with the passive form of the verbs in brackets.
1 Rice [is grown] (grow) in many parts of Asia.
2 The first vertical farm in our city [was opened] (open) in 2019.
3 Most of the world's salt [is used] (use) in the chemical industry.
4 The vegetables [are picked] (pick) early in the morning.
5 Last year, over 2,000 tonnes of fruit [were exported] (export).
:::

# Writing | Task 1 — a process
::: info
- Some Writing Task 1 tasks show a process: how something is made or how something works.
- Describe every stage in order and use sequencing words. The passive is very common in these descriptions.
:::
::: panel The process: making olive oil
1. Olives are picked from the trees in late autumn.
2. They are washed to remove leaves and dirt.
3. The olives are crushed into a paste.
4. The paste is mixed slowly for 30–40 minutes.
5. The oil is separated from the water and solids.
6. The oil is stored in dark bottles.
:::
::: task Complete the description. Write ONE word in each gap.

The steps above show how olive oil is [made|produced].
[First|Firstly], the olives are picked from the trees in late autumn. They are then [washed] to remove leaves and dirt.
[Next|Then|Secondly], the olives are crushed into a paste, which is mixed slowly for 30–40 minutes. [After] this, the oil is separated from the water and solids.
[Finally|Lastly], the oil is stored in dark bottles.
:::
::: task Now describe the process of making bread in your notebook. Use the passive and sequencing words, and write at least 150 words.
- the flour, water, salt and yeast are mixed
- the dough is left to rise for an hour
- the loaves are shaped
- they are baked for 30 minutes
- the bread is left to cool
:::

=== Discovery and invention
kind: lesson
minutes: 65
summary: Science and invention: matching information, summary completion, form completion, science words, comparisons with much, far and slightly, and Speaking Part 2.
---
# Starting off
::: task Which of these inventions would you find it hardest to live without? Put them in order and explain your choice to a partner.
- the refrigerator
- the internet
- the washing machine
- the bicycle
- electric light
:::

# Reading | Section 1
::: passage Happy accidents
**A** Many important discoveries were not planned. In 1928, the Scottish scientist Alexander Fleming returned from a holiday to find that mould had grown on one of his dishes of bacteria — and that the bacteria around the mould had died. The substance produced by the mould became penicillin, the first antibiotic. However, it took more than ten years before other scientists found a way to produce it in large quantities.

**B** The microwave oven also began with an accident. In the 1940s, an American engineer named Percy Spencer was working on radar equipment when he noticed that a chocolate bar in his pocket had melted. Curious, he placed some corn near the equipment, and it began to pop. The first microwave ovens were the size of a refrigerator and were used mainly in restaurants.

**C** Not every accident leads to success straight away. In 1968, a researcher who was trying to develop a very strong glue produced one that was surprisingly weak: it could stick to surfaces but was easy to remove. For years nobody could think of a use for it. The answer came when a colleague needed bookmarks that would not fall out of his songbook, and the sticky note was born.

**D** What these stories have in common is not luck alone. In each case, the person who noticed the accident had the knowledge to understand that something unusual had happened, and the curiosity to investigate it. As the French scientist Louis Pasteur put it, chance favours only the prepared mind.
Source: written for IELTSX
:::
::: task Answer Questions 1–4.
Questions 1–4
The passage has four paragraphs, A–D. Which paragraph contains the following information?
@match
A Paragraph A
B Paragraph B
C Paragraph C
D Paragraph D
1 a discovery made after the scientist had been away = A
2 an invention that was first used mainly by businesses = B
3 a product that failed at its original purpose = C
4 a general explanation of why some accidents lead to discoveries = D
:::
::: task Answer Questions 5–9.
Questions 5–9
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.

Percy Spencer was working with [radar] equipment when a chocolate bar in his pocket [melted]. He then tested the idea with corn, which began to [pop]. The first microwave ovens were as large as a [refrigerator|fridge] and were mostly found in [restaurants].
:::

# Listening | Section 1
::: chat Recording script — booking a school visit (read the conversation, then answer)
Assistant: Good morning, Riverside Science Museum, group bookings.
Teacher: Hello, I'm a teacher at Northfield School. I'd like to book a visit for my class.
Assistant: Of course. How many students?
Teacher: Twenty-eight, and three teachers.
Assistant: And how old are the students?
Teacher: They're fourteen.
Assistant: Which date were you thinking of?
Teacher: The twelfth of March, if possible.
Assistant: Let me see … yes, that's fine. Would you like to book a workshop? We have one on robots and one on space.
Teacher: Robots, please. The students are building one in class this term.
Assistant: Good choice. Tickets are six pounds per student; teachers go free. Lunch can be eaten in the picnic room on the ground floor.
Teacher: Perfect. Can I give you my name?
Assistant: Yes, please.
Teacher: It's Helen Brooks — that's B-R-O-O-K-S.
:::
::: task Answer Questions 1–8.
Questions 1–8
Complete the form below.
Write ONE WORD AND/OR A NUMBER for each answer.

### RIVERSIDE SCIENCE MUSEUM — GROUP BOOKING
| School: | [Northfield] School |
| Number of students: | [28|twenty-eight] |
| Age of students: | [14|fourteen] |
| Date: | [12 March|12th March|March 12|March 12th|the twelfth of March|twelfth of March] |
| Workshop: | [robots|robot|robotics] |
| Cost per student: | £[6|six] |
| Lunch: | in the [picnic] room |
| Teacher's name: | Helen [Brooks] |
:::

# Vocabulary | Science and invention
::: task Circle the correct word.
1 Fleming {discovered*|invented} penicillin by accident.
2 The telephone was {invented*|discovered} in the nineteenth century.
3 Scientists are {developing*|discovering} a new vaccine.
4 The researchers {carried out*|made out} a series of experiments.
5 The results of the study were {published*|printed out} in a scientific journal.
:::
::: task Complete the table of word families.
| Verb | Noun (thing or idea) | Noun (person) |
|---|---|---|
| invent | [invention] | [inventor] |
| develop | [development] | [developer] |
| analyse | [analysis] | [analyst] |
:::

# Key grammar | Comparisons
::: panel Remember
- Big differences: *much, far, a lot* + comparative — *Modern phones are far more powerful than early computers.*
- Small differences: *slightly, a little, a bit* — *The new model is slightly cheaper.*
- The same: *as … as*; not the same: *not as … as* — *The first microwaves were not as small as today's.*
:::
::: task Circle the correct words.
1 Today's computers are {far*|very} faster than those of the 1980s.
2 The new battery lasts {slightly*|a slightly} longer than the old one.
3 Electric cars are not as noisy {as*|than} petrol cars.
4 This is {by far*|very far} the most popular invention of the decade.
5 Smartphones are {much*|many} more useful than old mobile phones.
:::
::: task Complete the second sentence so that it means the same as the first. Write NO MORE THAN THREE WORDS in each gap.
1 The old model was more expensive than the new one. → The new model is not [as expensive as] the old one.
2 The car is a much more recent invention than the bicycle. → The bicycle is [much older|far older|a lot older] than the car.
3 Train travel is a little slower than flying. → Flying is [slightly faster|a little faster|a bit faster|slightly quicker] than train travel.
:::

# Speaking | Part 2
::: panel Describe a piece of technology that you find very useful.
You should say:
- what it is
- when you got it
- how often you use it
and explain why it is so useful to you.
:::
::: advice Speaking Part 2
- Use the points on the card to organise your talk, but you do not have to follow them in exactly the same order.
- If you finish early, add an example or a short story about a time you used the thing you are describing.
:::
::: task Put the parts of this talk in the correct order. Write 1–4.
@labels 1, 2, 3, 4
a I got it two years ago as a birthday present from my parents. = 2
b The piece of technology I'd like to talk about is my e-reader. = 1
c The main reason it's so useful is that I can carry hundreds of books in my bag. = 4
d I use it almost every day, usually on the bus on my way to university. = 3
:::
::: you
Now prepare and give your own talk about the task card above. Speak for two minutes.
:::

=== Culture and the arts
kind: lesson
minutes: 65
summary: Arts, media and culture: True / False / Not Given, matching headings, a talk about a festival, arts words, linking words of contrast and a discussion essay.
---
# Starting off
::: task Discuss these questions with a partner.
- When did you last go to a museum, a concert or the theatre?
- Should every child learn music or art at school? Why? / Why not?
:::

# Reading | Section 3
::: passage Museums go digital
**A** Not long ago, the only way to see a famous painting was to travel to the museum that owned it. Today, many of the world's great collections can be explored online. High-resolution photographs allow viewers to zoom in on details that are difficult to see even when standing in front of the original, and virtual tours let people walk through galleries on the other side of the world.

**B** Museums have several reasons for putting their collections online. Most of their objects are never on display: there is simply not enough wall space, so the majority of items stay in storage. Digital copies allow researchers and the public to see these hidden treasures. Online collections also reach people who cannot visit because of distance, cost or disability.

**C** Some museum directors were at first worried that free online images would reduce the number of visitors. In practice, this does not seem to have happened. Many museums report that people who explore a collection online are more likely to visit in person, as seeing a picture on a screen makes them want to see the real thing.

**D** Digital collections are not without problems, however. Photographing and cataloguing millions of objects is slow and expensive, and technology changes so quickly that files may need to be converted to new formats every few years. There are also difficult questions about objects that were taken from other countries in the past: putting them online makes them more visible, and has increased calls for them to be returned.
Source: written for IELTSX
:::
::: task Read the passage and answer Questions 1–5.
Questions 1–5
Do the following statements agree with the information given in the reading passage?
1 Online images can show details that are hard to see in the original painting. = T
2 Most of the objects owned by museums are on display. = F
3 Virtual tours are more popular with young people than with older people. = NG
4 Putting collections online has led to fewer people visiting museums. = F
5 Digital files may have to be changed to new formats regularly. = T
:::
::: task Answer Questions 6–9.
Questions 6–9
The passage has four paragraphs, A–D. Choose the correct heading for each paragraph.
@match
6 Paragraph A = Art without travelling
7 Paragraph B = Showing what is usually hidden
8 Paragraph C = A fear that did not come true
9 Paragraph D = Costs and difficult questions
Extra: The history of the first museums, Why light damages old paintings
:::

# Listening | Section 2
::: note Recording script — a summer arts festival (read it, then answer)
Good evening, and welcome to this preview of the Lakeside Arts Festival, which runs from the fourth to the eleventh of July.

This year's festival opens with a concert by the City Youth Orchestra on the main stage in the park. Entry to the opening concert is free, but you'll need to collect a ticket from the festival office, as space is limited.

On Saturday and Sunday the riverside will be full of craft stalls, where local artists sell pottery, jewellery and hand-made clothes.

For families, there's a puppet theatre in the library garden every morning at ten. And for the first time, we're offering painting workshops for adults in the old fire station. These cost twelve pounds, and all materials are included.

The festival closes with a fireworks display over the lake. Please note that the car park by the lake will be closed that evening, so we strongly recommend coming by bus.
:::
::: task Answer Questions 1–6.
Questions 1–6
Complete the notes below.
Write ONE WORD AND/OR A NUMBER for each answer.

### Lakeside Arts Festival: 4–11 July
- Opening concert: free, but get a [ticket] from the festival office
- Weekend: craft stalls by the [river|riverside] selling pottery, jewellery and clothes
- Puppet theatre: in the library [garden] every morning at 10
- Painting workshops for adults: £[12|twelve], all materials included
- Closing event: [fireworks] over the lake
- Advice: travel to the closing event by [bus]
:::

# Vocabulary | Arts and media
::: task Match the words (1–6) with their meanings.
@match
1 exhibition = a public show of paintings or objects
2 audience = the people who watch a performance
3 performance = an occasion when someone acts, sings or plays music for people
4 review = an article that gives an opinion of a film, book or show
5 sculpture = a work of art made from stone, metal or wood
6 documentary = a film that gives facts about a real subject
Extra: a person who paints pictures
:::
::: task Circle the correct word.
1 The {audience*|spectators} clapped loudly at the end of the play.
2 The film {received*|took} excellent reviews.
3 The gallery is holding an {exhibition*|audience} of modern photography.
4 She is a {talented*|talent} young musician.
5 Tickets for the concert {sold out*|sold off} in two hours.
:::

# Key grammar | Linking words: contrast
::: panel Remember
- *although* / *even though* + a clause: *Although the tickets were expensive, the concert was full.*
- *despite* / *in spite of* + a noun or -ing: *Despite the rain, the festival went ahead.*
- *however* usually starts a new sentence and is followed by a comma: *The museum is free. However, the exhibitions cost extra.*
- *while* / *whereas* compare two different facts: *Some people prefer films, whereas others prefer books.*
:::
::: task Circle the correct linking word.
1 {Although*|Despite} it was raining, thousands of people came to the festival.
2 {Despite*|Although} the high price, the tickets sold quickly.
3 The museum is popular with tourists. {However*|Although}, few local people visit it.
4 My brother loves classical music, {whereas*|despite} I prefer jazz.
5 {In spite of*|Even though} being very young, she won the competition.
:::

# Writing | Task 2 — a discussion essay
::: panel Writing task
Some people think governments should spend money on the arts, such as museums and theatres. Others believe this money should be spent on other public services.
Discuss both these views and give your own opinion.
:::
::: advice Discussion essays
- Write one body paragraph for each view, and give your own opinion in the introduction and the conclusion.
- Present both views fairly, even the one you disagree with.
:::
::: task Complete the paragraph with linking words from the box. There is one word you do not need.
Box: Although, For example, However, whereas, In addition

[Although] health and education are clearly important, there are good reasons for governments to support the arts. Museums and theatres attract tourists, who spend money in local businesses. [In addition], art can bring communities together. [For example], a free summer festival gives people of all ages and backgrounds the chance to share an experience. [However], critics argue that public money should go to hospitals first.
:::
::: task Now write the essay in your notebook. Write at least 250 words.
:::
`;

const units = doc.unitsFromText(TEXT);

module.exports = {
  key: 'bands-course-1',
  id: 'b-be5c0001',
  unitId: (n) => 'u-be5c0' + ('00' + (n + 1)).slice(-3),
  style: 'course',
  book: {
    title: 'IELTSX Course Book · Bands 5–6.5',
    author: 'IELTSX Team',
    category: 'Course book',
    level: 'B1–B2',
    plan: 'free',
    description: 'A complete course for Bands 5–6.5 in 10 units: Reading, Listening (with the scripts), Vocabulary, Key grammar, Writing and Speaking in every unit, with "Exam advice" boxes and exercises that are checked for you. Its partner is the IELTSX Workbook · Bands 5–6.5.'
  },
  units
};
