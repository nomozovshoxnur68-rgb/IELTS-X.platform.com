'use strict';
/*
 * IELTSX — the ready e-book "IELTSX Workbook · Bands 5–6.5": extra practice for the ten units of the IELTSX Course Book
 * (ebooks-course.js) in the design of a workbook — a new reading text with exam tasks, vocabulary, grammar and a short
 * writing task in every unit — and a review after Units 1–5 and 6–10. Every text and exercise was written for IELTSX.
 * The text is in the import format of ebook-doc.js ("== part", "=== unit"). ebooks.js puts the book on the Books page
 * once (the setting "ebook-builtin"); after that it is an ordinary book. Server only (it holds the answers).
 */
const doc = require('./ebook-doc');

const TEXT = `
== Units 1–5

=== Home and neighbourhood
kind: lesson
minutes: 35
summary: Tiny houses: True / False / Not Given and sentence completion; words for homes; present simple and present continuous.
---
# Reading | Section 1
::: passage Living small
**A** In many cities, young people cannot afford a flat of their own, so some are choosing a very different option: the tiny house. These homes usually measure less than 40 square metres, and many are built on wheels so that they can be moved from place to place.

**B** Owners say the main attraction is cost. A tiny house can cost a small fraction of the price of a typical home, and heating and electricity bills are much lower. Many owners also enjoy owning fewer things and spending less time cleaning.

**C** Life in a tiny house is not always easy, though. There is little space for guests, and families with children often find the homes too cramped. In some places, local rules do not allow people to live permanently in a home on wheels.
Source: written for IELTSX
:::
::: task Answer Questions 1–4.
Questions 1–4
Do the following statements agree with the information given in the text?
1 Tiny houses are usually smaller than 40 square metres. = T
2 All tiny houses can be moved. = F
Why: The text says "many" are built on wheels, not all of them.
3 Energy bills are lower in a tiny house. = T
4 Most people who own tiny houses are retired. = NG
:::
::: task Answer Questions 5–7.
Questions 5–7
Complete the sentences below.
Choose ONE WORD ONLY from the text for each answer.
5 Many owners like having fewer [things] and cleaning less.
6 Families with children may find tiny houses too [cramped].
7 In some places, people cannot live [permanently] in a home on wheels.
:::

# Vocabulary
::: task Complete the sentences with words from the box. There is one word you do not need.
Box: spacious, cramped, suburbs, landlord, neighbourhood, residents
1 Our kitchen is so [cramped] that only one person can cook at a time.
2 We moved to the [suburbs] because we wanted a garden.
3 The new flat is very [spacious]: it has three large bedrooms.
4 The [residents] of our building meet once a month.
5 I asked the [landlord] to fix the broken window.
:::

# Grammar | Present simple and present continuous
::: task Complete the text with the present simple or present continuous form of the verbs in brackets.

My name is Dilnoza and I [live] (live) in a small flat in the centre of Tashkent. At the moment I [am studying|'m studying] (study) for my final exams, so I [spend] (spend) most evenings at home. My flatmate usually [cooks] (cook) dinner, but this week she [is visiting|'s visiting] (visit) her parents.
:::
::: task Find the mistake in each sentence and write the correct verb form.
1 I am knowing this area very well. = know
2 Look! The children play in the garden. = are playing
3 My brother is wanting to buy a house. = wants
:::

# Writing
::: task Write a short paragraph of 80–100 words about your neighbourhood in your notebook. Say what you like about it and what you would change.
:::

=== Learning for life
kind: lesson
minutes: 35
summary: A language café: multiple choice; study verbs; past simple and present perfect; for and since; describing a change in numbers.
---
# Reading | Section 1
::: passage The language café
**A** Every Thursday evening, a café near the university turns into a classroom without a teacher. The tables are labelled with flags — Spanish, Korean, Arabic, English — and anyone can sit down and practise a language with native speakers.

**B** The idea is simple: people take turns. For half an hour, two partners speak one language; then they switch to the other. Nobody pays to take part, but everyone is expected to buy a drink to support the café.

**C** Regular visitors say the relaxed atmosphere helps them to stop worrying about mistakes. "In class I hardly said a word," says one student of Spanish. "Here, after a month, I was chatting for an hour."
Source: written for IELTSX
:::
::: task Answer Questions 1–4.
Questions 1–4
Choose the correct letter, A, B or C.
1 What happens at the café every Thursday?
A Teachers give free language lessons.
B People practise languages with each other. *
C Students take language exams.
2 How long do partners speak one language before they switch?
A fifteen minutes
B thirty minutes *
C one hour
3 What must people do to take part?
A pay a small fee
B buy a drink *
C bring a dictionary
4 According to regular visitors, the café helps them to
A worry less about making mistakes. *
B learn grammar more quickly.
C find a private teacher.
:::

# Vocabulary
::: task Circle the correct word.
1 I {took*|made} notes during the lecture.
2 She {passed*|succeeded} all her exams with high marks.
3 You need to {revise*|repeat} for the test next week.
4 He {dropped*|fell} out of university after one year.
5 Our teacher gives us a lot of {homework*|homeworks}.
:::

# Grammar | Past simple and present perfect
::: task Complete the sentences with the past simple or present perfect form of the verbs in brackets.
1 I [have studied|'ve studied] (study) English since I was ten.
2 We [visited] (visit) the science museum last weekend.
3 She [has never failed|'s never failed] (never fail) a test.
4 When I was a child, I [didn't like|did not like] (not like) reading.
5 They [have just finished|'ve just finished] (just finish) their project.
:::
::: task Circle *for* or *since*.
1 I've known my best friend {for*|since} twelve years.
2 She hasn't been home {since*|for} last summer.
3 We've lived in this city {since*|for} 2019.
:::

# Writing | Describing numbers
The table below shows the number of students who took online courses at one college.

| Year | Students |
|---|---|
| 2020 | 1,200 |
| 2022 | 2,500 |
| 2024 | 4,100 |

::: task Complete the sentences. Write ONE word in each gap.
1 Between 2020 and 2022, the number of students more than [doubled].
2 The number [rose|increased|grew] by 1,600 between 2022 and 2024.
3 By 2024, the figure had [reached] 4,100.
:::

=== The world of work
kind: lesson
minutes: 35
summary: Part-time jobs for teenagers: matching information and sentence completion; work words; countable and uncountable nouns; a job application email.
---
# Reading | Section 1
::: passage A first job
**A** For many teenagers, a part-time job is their first experience of the world of work. In many countries it is common for secondary school students to work a few hours a week, usually in shops, cafés or restaurants.

**B** The most obvious benefit is money, but employers and teachers mention other advantages too. Young workers learn to arrive on time, follow instructions and deal politely with customers — skills that are difficult to teach in a classroom.

**C** There are risks, however. Students who work more than about fifteen hours a week often find it hard to keep up with their studies, and some feel too tired to concentrate in lessons. For this reason, many experts advise that teenagers should work mainly at weekends or during the holidays.
Source: written for IELTSX
:::
::: task Answer Questions 1–3.
Questions 1–3
The text has three paragraphs, A–C. Which paragraph contains the following information?
@match
A Paragraph A
B Paragraph B
C Paragraph C
1 advice about when students should work = C
2 skills that school cannot easily teach = B
3 the kind of places where students often work = A
:::
::: task Answer Questions 4–6.
Questions 4–6
Complete the sentences below.
Choose ONE WORD ONLY from the text for each answer.
4 Young workers learn to deal [politely] with customers.
5 Working too many hours can make it hard to keep up with [studies].
6 Some students feel too [tired] to concentrate in lessons.
:::

# Vocabulary
::: task Circle the correct word.
1 I start {work*|job} at eight o'clock.
2 Factory workers are paid a weekly {wage*|salary}.
3 He's looking for a new {job*|work}.
4 Unemployment {rose*|raised} last year.
:::
::: task Match the words (1–4) with their meanings.
@match
1 employer = the person or company you work for
2 employee = a person who works for a company
3 applicant = a person who asks for a job
4 interview = a meeting to decide if someone is right for a job
Extra: a person who has lost their job
:::

# Grammar | Countable and uncountable nouns
::: task Circle the correct words.
1 Can you give me {some*|an} information about the job?
2 I need {a piece of*|an} advice.
3 How {much*|many} experience do you have?
4 There aren't {many*|much} vacancies at the moment.
5 We bought some new {furniture*|furnitures} for the office.
:::

# Writing | An email
::: task Complete the email. Write ONE word in each gap.

Dear Ms Hall,
I am writing to apply [for] the position of shop assistant which was advertised on your website.
I have worked part-time in a bookshop for two years, so I have experience [of|in] dealing with customers.
I would be grateful if you could send me more information [about] the working hours.
I look forward to hearing [from] you.
Yours sincerely,
Aziz Karimov
:::

=== Healthy habits
kind: lesson
minutes: 35
summary: Walking: True / False / Not Given; health collocations; must, mustn't, should and don't have to; advantages and disadvantages.
---
# Reading | Section 1
::: passage The power of a walk
**A** Walking is the simplest form of exercise. It needs no equipment, costs nothing and can be done almost anywhere. Doctors in many countries recommend at least 150 minutes of moderate activity a week, and a brisk walk of just over 20 minutes a day is enough to meet this target.

**B** Regular walking strengthens the heart, helps to control weight and can improve sleep. It also benefits mental health: studies have found that people who walk outdoors, especially in green spaces, often report feeling calmer and happier afterwards.

**C** One popular target is 10,000 steps a day. Interestingly, this number did not come from medical research; it was used in Japan in the 1960s to advertise a step counter. Recent studies suggest that the health benefits begin at much lower numbers of steps.
Source: written for IELTSX
:::
::: task Answer Questions 1–5.
Questions 1–5
Do the following statements agree with the information given in the text?
1 Walking requires special equipment. = F
2 A brisk walk of just over 20 minutes a day meets the recommended amount of activity. = T
3 Walking in green spaces can improve people's mood. = T
4 The target of 10,000 steps was based on medical research. = F
5 Most people in Japan walk 10,000 steps a day. = NG
:::

# Vocabulary
::: task Complete the sentences. Write ONE word in each gap.
1 I try to keep [fit] by cycling to work.
2 He decided to go on a [diet] to lose weight.
3 You should [take|have] regular breaks from your computer.
4 I've caught a [cold], so I'm staying at home today.
:::

# Grammar | Modal verbs
::: task Complete the sentences with *must*, *mustn't*, *should* or *don't have to*.
1 You [mustn't|must not] swim here — it's dangerous.
2 It's free, so you [don't have to|do not have to] pay.
3 I think you [should] go to bed earlier.
4 It's the law: all drivers [must] wear a seat belt.
:::

# Writing | Advantages and disadvantages
::: task Is each point an advantage (A) or a disadvantage (D) of working in an office?
@labels A, D
1 You can meet colleagues face to face. = A
2 Sitting all day can cause back pain. = D
3 A long journey to work wastes time. = D
4 Offices have good equipment and fast internet. = A
:::
::: task Now write a paragraph in your notebook about one advantage and one disadvantage of working from home.
:::

=== Connected lives
kind: lesson
minutes: 35
summary: A week without smartphones: multiple choice and sentence completion; technology verbs; relative clauses; words for describing trends.
---
# Reading | Section 1
::: passage Switching off
**A** For one week, a group of forty university students agreed to an unusual experiment: no smartphones. They could use a computer for their studies and a basic phone for calls, but no social media, games or messaging apps.

**B** The first two days were the hardest. Several students said they kept reaching for a phone that was not there, and many felt anxious about missing news from friends. By the end of the week, however, most reported sleeping better and having longer conversations with the people around them.

**C** When the experiment ended, only a few students went back to their old habits completely. Most decided to make small changes, such as turning off notifications or leaving their phone in another room while studying.
Source: written for IELTSX
:::
::: task Answer Questions 1–2.
Questions 1–2
Choose the correct letter, A, B or C.
1 During the experiment, the students were allowed to use
A social media for one hour a day.
B a computer for their studies. *
C messaging apps at weekends.
2 When was the experiment most difficult?
A at the beginning *
B in the middle
C at the end
:::
::: task Answer Questions 3–5.
Questions 3–5
Complete the sentences below.
Choose NO MORE THAN TWO WORDS from the text for each answer.
3 By the end of the week, most students were [sleeping better].
4 After the experiment, most students decided to make [small changes].
5 Some students now turn off [notifications].
:::

# Vocabulary
::: task Complete the sentences with words from the box.
Box: charge, download, update, log in, offline
1 My battery is almost empty — I need to [charge] my phone.
2 You can [download] the app for free.
3 You need a password to [log in].
4 Please [update] your software to the latest version.
5 The website is [offline] at the moment because of technical problems.
:::

# Grammar | Relative clauses
::: task Join the two sentences. Complete the new sentence with *who*, *which*, *where* or *whose*.
1 That's the engineer. She designed the new app. → That's the engineer [who|that] designed the new app.
2 This is the café. We first met there. → This is the café [where] we first met.
3 I bought a laptop. It was very cheap. → The laptop [which|that] I bought was very cheap.
4 He's the student. His phone was stolen. → He's the student [whose] phone was stolen.
:::

# Writing | Describing trends
::: task Circle the correct word.
1 The chart {shows*|is showing} the number of people who used the internet.
2 The number of users {rose*|raised} sharply between 2000 and 2010.
3 There was a {slight*|slightly} fall in 2020.
4 Prices increased {dramatically*|dramatic}.
:::

=== Review: Units 1–5
kind: review
minutes: 25
summary: Vocabulary and grammar from Units 1–5: homes, study, work, health and technology.
---
# Review | Units 1–5
::: task Circle the correct word.
1 The flat is small but very {convenient*|cramped} — it's next to the metro.
2 I {have lived*|live} here since 2020.
3 Could you give me some {advice*|advices}?
4 You {don't have to*|mustn't} bring food — lunch is provided.
5 The man {who*|which} repaired my phone was very helpful.
6 She {made*|did} a decision to change jobs.
:::
::: task Complete the sentences. Write ONE word in each gap.
1 My brother works [part-time] while he studies.
2 I need to [meet] the deadline for my essay.
3 The rent [includes] water but not electricity.
4 You should [take|have] regular breaks from your computer.
5 Please [update] the app to the latest version.
:::
::: task Complete the words. The first letters are given.
1 Our neighbours are very fri[endly].
2 She got a pro[motion] after two years.
3 Regular exe[rcise] is good for your heart.
4 This phone has a very long-lasting bat[tery].
:::
::: task Complete the sentences with the correct form of the verbs in brackets.
1 Look! It [is snowing|'s snowing] (snow).
2 We [moved] (move) to Tashkent in 2018.
3 Have you ever [failed] (fail) an exam?
4 The app, which [was launched] (launch) last year, is very popular.
:::

== Units 6–10

=== Our planet
kind: lesson
minutes: 35
summary: Plastic waste: matching headings and True / False / Not Given; environment collocations; future forms; giving an opinion.
---
# Reading | Section 1
::: passage The plastic problem
**A** Plastic is cheap, light and strong, which is why it is used for almost everything. However, the qualities that make it so useful also make it a serious environmental problem: most plastic does not break down naturally and can remain in the environment for hundreds of years.

**B** Large amounts of plastic end up in the sea, carried there by rivers and the wind. Sea birds, turtles and fish can mistake pieces of plastic for food, and many become trapped in old fishing nets.

**C** Many countries have now introduced rules to reduce plastic waste. Some have banned single-use plastic bags, while others make customers pay a small fee for them. In several places, these fees have led to a sharp fall in the number of bags used.
Source: written for IELTSX
:::
::: task Answer Questions 1–3.
Questions 1–3
The text has three paragraphs, A–C. Choose the correct heading for each paragraph.
@match
1 Paragraph A = Useful but long-lasting
2 Paragraph B = A danger to sea life
3 Paragraph C = Action by governments
Extra: Cleaning the oceans with robots
:::
::: task Answer Questions 4–7.
Questions 4–7
Do the following statements agree with the information given in the text?
4 Plastic usually breaks down within a few years. = F
5 Rivers carry plastic into the sea. = T
6 Charging for plastic bags has reduced their use in some places. = T
7 Paper bags are worse for the environment than plastic bags. = NG
:::

# Vocabulary
::: task Match the two parts of the collocations.
@match
@cols
1 climate = change
2 renewable = energy
3 endangered = species
4 carbon = footprint
5 natural = habitat
Extra: rain
:::

# Grammar | Future forms
::: task Circle the most suitable form.
1 "There's no milk." "OK, I {will*|am going to} buy some."
2 We {are going to*|will} plant trees in the park next weekend — we planned it months ago.
3 Look at the river! It {is going to*|will} flood.
4 We {are meeting*|meet} the volunteers at the beach at nine tomorrow.
:::

# Speaking | Giving an opinion
::: task Complete the answer. Write ONE word in each gap.

I'd [say] that individuals can make a real difference. [For] example, if everyone stopped buying bottled water, millions of plastic bottles would be saved. That [said], governments also need to act.
:::

=== On the move
kind: lesson
minutes: 35
summary: Night trains: True / False / Not Given; travel words; conditionals; phrases for giving an opinion.
---
# Reading | Section 1
::: passage The return of the night train
**A** Twenty years ago, night trains seemed to be disappearing from Europe. Cheap flights were faster, and many railway companies stopped running overnight services because they lost money.

**B** Recently, however, several new routes have opened. Many travellers now choose the train because it produces far less pollution than flying. Others like the fact that they can fall asleep in one city and wake up in the centre of another, without going through airport security.

**C** Night trains still face problems. Sleeping carriages carry fewer passengers than ordinary seats, so tickets can be expensive, and delays on one country's railway can affect the whole journey.
Source: written for IELTSX
:::
::: task Answer Questions 1–5.
Questions 1–5
Do the following statements agree with the information given in the text?
1 Many night train services stopped because they lost money. = T
2 Night trains are faster than planes. = F
3 Some passengers like avoiding airport security. = T
4 Night train tickets are always cheaper than flights. = F
Why: The text says the tickets "can be expensive".
5 Most night train passengers are business travellers. = NG
:::

# Vocabulary
::: task Circle the correct word.
1 How long was your {journey*|travel} home?
2 We booked our {accommodation*|accommodations} online.
3 Our flight was {cancelled*|missed} because of the storm.
4 I always buy {souvenirs*|memories} for my family when I travel.
5 We spent the afternoon {sightseeing*|sightsee}.
:::

# Grammar | Conditionals
::: task Complete the sentences with the correct form of the verbs in brackets.
1 If we [take] (take) the night train, we will save money on a hotel.
2 If I [lived] (live) near the sea, I would swim every day.
3 If you [press] (press) this button, the door opens.
4 I [would travel|'d travel] (travel) more if I had more free time.
5 What [would you do] (you / do) if you lost your passport?
:::

# Writing | Giving your opinion
::: task Complete the phrases. Write ONE word in each gap.
1 In my [opinion|view], tourism brings more benefits than problems.
2 I strongly [believe|feel] that tourists should respect local customs.
3 I [agree] that cities should limit the number of tourists.
4 [Personally], I prefer travelling by train.
:::

=== Food for thought
kind: lesson
minutes: 35
summary: Food waste: summary completion and multiple choice; cooking verbs; the passive; the stages of a process.
---
# Reading | Section 1
::: passage Food waste
**A** Around a third of all the food produced in the world is lost or wasted — enough to feed hundreds of millions of people. Waste happens at every stage, from farms and factories to shops and homes.

**B** In richer countries, much of the waste takes place in the home. People buy more than they need, store food badly, or throw it away because they misunderstand the dates on the packaging. A "best before" date is about quality, not safety: food is often perfectly safe to eat after this date. A "use by" date, however, is about safety and should always be followed.

**C** Some shops are trying new ideas, such as selling "ugly" fruit and vegetables at lower prices, or giving unsold food to charities. Apps now allow restaurants to sell leftover meals cheaply at the end of the day.
Source: written for IELTSX
:::
::: task Answer Questions 1–6.
Questions 1–6
Complete the summary using the words in the box.
Box: quality, safety, charities, packaging, farms, cheaply, prices

In rich countries, a lot of food is wasted at home. People are often confused by the dates on the [packaging]. A "best before" date is about [quality], while a "use by" date is about [safety]. Some shops sell ugly vegetables at lower [prices] or give unsold food to [charities], and some restaurants sell leftover meals [cheaply].
:::
::: task Answer Question 7.
Question 7
Choose the correct letter, A, B or C.
7 According to the text, where does most food waste in richer countries take place?
A on farms
B in factories
C in homes *
:::

# Vocabulary
::: task Complete the recipe with the verbs from the box.
Box: chop, boil, fry, add, serve

First, [chop] the onions into small pieces. Then [fry] them in a little oil for five minutes. Meanwhile, [boil] the rice in a large pan of water. [Add] the tomatoes to the onions and cook for ten minutes. Finally, [serve] the sauce with the rice.
:::

# Grammar | The passive
::: task Complete the second sentence with the passive.
1 Farmers grow tea in the mountains. → Tea [is grown] in the mountains.
2 Someone stole my bike yesterday. → My bike [was stolen] yesterday.
3 They make this cheese from goat's milk. → This cheese [is made] from goat's milk.
4 The chef cooked the meal in ten minutes. → The meal [was cooked] in ten minutes.
:::

# Writing | A process
::: task Put the stages of making black tea in the correct order. Write 1–5.
@labels 1, 2, 3, 4, 5
a The leaves are rolled to release their juices. = 3
b The leaves are picked by hand. = 1
c The dry tea is packed into boxes. = 5
d The leaves are spread out to lose some water. = 2
e The leaves are dried in hot air. = 4
:::

=== Discovery and invention
kind: lesson
minutes: 35
summary: The history of the bicycle: matching information and a flow-chart; word families; comparisons; a short talk.
---
# Reading | Section 1
::: passage The bicycle: two hundred years of change
**A** The first machine like a bicycle was built in Germany in 1817 by Karl Drais. It had two wheels but no pedals: riders pushed themselves along with their feet.

**B** Pedals were added in the 1860s, but they were attached directly to the front wheel. To go faster, makers made the front wheel bigger and bigger, which led to the "penny-farthing", a bicycle that was fast but dangerous, as riders sat high above the ground.

**C** The "safety bicycle", introduced in the 1880s, had two wheels of the same size and a chain that connected the pedals to the back wheel. Together with air-filled tyres, which appeared soon afterwards, this design made cycling comfortable and safe, and it is still the basic shape of the bicycle today.
Source: written for IELTSX
:::
::: task Answer Questions 1–3.
Questions 1–3
The text has three paragraphs, A–C. Which paragraph contains the following information?
@match
A Paragraph A
B Paragraph B
C Paragraph C
1 a design that is still used today = C
2 a machine without pedals = A
3 a bicycle that was risky to ride = B
:::
::: task Answer Questions 4–7.
Questions 4–7
Complete the flow-chart below.
Choose ONE WORD ONLY from the text for each answer.
@flow
In 1817: riders pushed the machine along with their [feet]
In the 1860s: [pedals] were attached to the front wheel
Later: the penny-farthing, with a very large front [wheel]
In the 1880s: the safety bicycle, with a [chain] connecting the pedals to the back wheel
:::

# Vocabulary
::: task Complete the sentences with the correct form of the word in brackets.
1 The [invention] (invent) of the bicycle changed transport.
2 Karl Drais was a German [inventor] (invent).
3 The [discovery] (discover) of penicillin saved millions of lives.
4 The company is famous for its [scientific] (science) research.
:::

# Grammar | Comparisons
::: task Complete the second sentence so that it means the same as the first. Write NO MORE THAN THREE WORDS in each gap.
1 The penny-farthing was more dangerous than the safety bicycle. → The safety bicycle was [safer than|less dangerous than] the penny-farthing.
2 The new phone is a little heavier than the old one. → The old phone is [slightly lighter|a little lighter|a bit lighter] than the new one.
3 Trains are not as fast as planes. → Planes are [faster than|quicker than] trains.
:::

# Speaking | A short talk
::: task Complete the talk. Write ONE word in each gap.

The invention I'd like to talk [about] is the washing machine. Before it was invented, people [spent] hours every week washing clothes by hand. I think it's one of the most important inventions [because|as|since] it gave people much more free time.
:::

=== Culture and the arts
kind: lesson
minutes: 35
summary: Street art: True / False / Not Given; arts words; although, despite, however and whereas; a conclusion.
---
# Reading | Section 1
::: passage Street art: crime or culture?
**A** Painting on walls without permission is illegal in most cities, and many residents see graffiti as a sign that an area is neglected. Cleaning it off costs cities large amounts of money every year.

**B** Some street art, however, has become popular and even valuable. In several cities, colourful murals now attract tourists, and walking tours take visitors to see the best-known works.

**C** A number of councils have tried a middle way: they provide "legal walls" where artists can paint freely, or invite artists to decorate empty buildings. Supporters say this reduces illegal graffiti and brightens up dull areas; critics argue that art loses its energy when it is controlled.
Source: written for IELTSX
:::
::: task Answer Questions 1–4.
Questions 1–4
Do the following statements agree with the information given in the text?
1 Graffiti without permission is legal in most cities. = F
2 Some street art attracts tourists. = T
3 Street artists earn more money than other artists. = NG
4 Everyone agrees that legal walls are a good idea. = F
Why: Critics argue that art "loses its energy when it is controlled".
:::

# Vocabulary
::: task Circle the correct word.
1 The museum has a new {exhibition*|audience} of African art.
2 The {audience*|viewers} at the theatre stood up and clapped.
3 The film got terrible {reviews*|critics}.
4 She is a famous {sculptor*|sculpture} who works with metal.
:::

# Grammar | Linking words: contrast
::: task Complete the sentences with *although*, *despite*, *however* or *whereas*.
1 [Although|Even though] the tickets were expensive, the theatre was full.
2 [Despite] the bad weather, the concert went ahead.
3 The film was long. [However], it was never boring.
4 My sister loves opera, [whereas|while] I find it boring.
:::

# Writing | A conclusion
::: task Complete the conclusion of an essay. Write ONE word in each gap.

In [conclusion], although there are strong arguments for spending public money on hospitals and schools, I believe that the arts also deserve [support|funding|money]. [On] balance, a society that values culture is a richer place to live.
:::

=== Review: Units 6–10
kind: review
minutes: 25
summary: Vocabulary and grammar from Units 6–10: the environment, travel, food, invention and the arts.
---
# Review | Units 6–10
::: task Circle the correct word.
1 Look at those clouds! It {is going to*|will} rain.
2 If I {had*|have} more time, I would learn to paint.
3 Tea {is grown*|grows} in the hills.
4 Electric cars are {much*|very} quieter than petrol cars.
5 {Despite*|Although} the rain, the festival was a success.
6 Our train {journey*|travel} took ten hours.
:::
::: task Complete the sentences. Write ONE word in each gap.
1 The tiger is an endangered [species].
2 We spent the day [sightseeing] in the old city.
3 Fleming [discovered] penicillin in 1928.
4 The [audience] clapped for five minutes.
5 Fresh fruit is a good [source] of vitamins.
:::
::: task Complete the sentences with the correct form of the verbs in brackets.
1 If it [rains] (rain) tomorrow, the concert will be cancelled.
2 The first bicycle [was built] (build) in 1817.
3 Penicillin [was discovered] (discover) by accident.
4 If you heat water to 100°C, it [boils] (boil).
:::
`;

const units = doc.unitsFromText(TEXT);

module.exports = {
  key: 'bands-workbook-1',
  id: 'b-be5b0001',
  unitId: (n) => 'u-be5b0' + ('00' + (n + 1)).slice(-3),
  style: 'workbook',
  book: {
    title: 'IELTSX Workbook · Bands 5–6.5',
    author: 'IELTSX Team',
    category: 'Workbook',
    level: 'B1–B2',
    plan: 'free',
    description: 'Extra practice for the 10 units of the IELTSX Course Book · Bands 5–6.5: a new reading text with exam tasks, vocabulary, grammar and a short writing task in every unit, and a review after Units 5 and 10. Every exercise is checked for you.'
  },
  units
};
