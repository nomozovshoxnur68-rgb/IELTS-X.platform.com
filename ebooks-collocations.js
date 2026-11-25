'use strict';
/*
 * IELTSX — the ready e-book "Advanced Collocations for IELTS": 24 units in the design of a vocabulary book ("In Use"): the
 * explanation on the green page (A, B, C), the exercises on the white one (1.1, 1.2 …). Every text, example and exercise was
 * written for IELTSX. The text is in the import format of ebook-doc.js ("== part", "=== unit"), so it is also an example of
 * a file for Admin → E-books → Import. ebooks.js puts the book on the Books page once (the setting "ebook-builtin"); after
 * that it is an ordinary book: change, hide or delete it in the admin panel. Server only (it holds the answers).
 */
const doc = require('./ebook-doc');

const TEXT = `
== Getting started

=== What are collocations?
kind: vocabulary
minutes: 25
summary: a narrow escape, settle an argument, vary considerably
---
# [A] Words that belong together
A collocation is a group of two or more words that people regularly use together. You can **drink strong coffee** and work on **a powerful computer**, but *powerful coffee* and *a strong computer* sound odd, although the two adjectives mean nearly the same.
Collocations come in several patterns:
| pattern | collocations | in a sentence |
| adjective + noun | **a narrow escape**, **a vague memory** | I have only a vague memory of my first school. |
| verb + noun | **keep a promise**, **settle an argument** | They asked their teacher to settle the argument. |
| adverb + adjective | **painfully slow**, **readily available** | Progress on the new bridge has been painfully slow. |
| verb + adverb | **vary considerably**, **apologise profusely** | Rents vary considerably from district to district. |
| noun + noun | **a surge of energy**, **a sense of humour** | After lunch I felt a sudden surge of energy. |

# [B] Why they matter in an exam
Natural combinations of words make your English easier to follow. They help you to:
- sound like a fluent speaker: prices **rise sharply**, they do not *rise strongly*;
- be exact: **a crucial factor** says more than *a very important thing*;
- read and listen faster: when you hear the words *reach a*, you already expect **reach a compromise** or **reach a conclusion**;
- avoid tired words such as *very, big, good* and *nice*: **a resounding success** is much stronger than *a very big success*.
::: mistakes
You **do research** and **make progress**, NOT ~~make research~~ or ~~do progress~~.
:::

# [C] How to learn them
Write down the whole partnership, not the single word: **put forward a theory**, not just *theory*. Add a short sentence of your own, because a collocation is easier to remember when it **tells a story**. Finally, **pay close attention** to the words on the left and on the right of a new noun whenever you read.
::: tip
Press any collocation in bold on this page to hear it and to keep it in your notebook. Your notebook turns into cards you can revise later.
:::

# Exercises
::: task Match the two parts of these collocations.
@match
@cols
1 a narrow = escape
2 settle = an argument
3 painfully = slow
4 apologise = profusely
5 a surge = of energy
6 reach = a compromise
Extra: a promise
:::
::: task Which pattern is it? Choose the right label for each collocation.
@labels adj + noun, verb + noun, adv + adj, verb + adv
1 keep a promise = verb + noun
2 readily available = adv + adj
3 a vague memory = adj + noun
4 vary considerably = verb + adv
5 a crucial factor = adj + noun
:::
::: task Circle the correct word in each sentence.
1 The concert was a {loud|resounding*|high} success.
2 House prices rose {sharply*|strongly|hardly} last spring.
3 Please {give|pay*|do} close attention to the safety video.
4 Several scientists have put {forward*|ahead|up} a new theory.
5 She has a wonderful {feeling|sense*|taste} of humour.
:::
::: task Find the wrong word in each sentence and write the correct one.
1 Our team is making research into sleep. = doing
2 You have done a lot of progress since September. = made
3 I have only a thin memory of that holiday. = vague
4 He never holds his promises. = keeps
:::
::: task Complete the paragraph with one word in each gap.
When I moved abroad, my first months were [painfully] slow: I understood single words but not whole sentences. Then my teacher told me to pay [close] attention to the words around a noun. I began to write down complete partnerships and after a few weeks I could feel I was making [progress]. At the end of the course I gave a short talk, which was a [resounding] success.
:::

=== Strong, weak and fixed partnerships
kind: vocabulary
minutes: 25
summary: a foregone conclusion, torrential rain, spick and span
---
# [A] Strong partnerships
In a strong collocation one word almost always brings the other with it. When you hear *torrential*, you expect **torrential rain**; *a foregone* is nearly always followed by *conclusion*.
| collocation | meaning |
| **a foregone conclusion** | a result everybody is sure of before it happens |
| **torrential rain** | very heavy rain |
| **a blunt refusal** | a direct and rather rude no |
| **insatiable curiosity** | a wish to know more that never stops |
| **wage war on** | fight hard against something, e.g. poverty or litter |
| **bode well for** | be a good sign for the future |
The election was **a foregone conclusion**, but the high turnout **bodes well for** democracy.

# [B] Weak partnerships
Some words are friendly with hundreds of others. *Wide* goes with **a wide range**, **a wide variety**, **a wide audience** and **a wide gap**. These collocations are easy to guess, yet learners often choose *big* instead.
::: help
With words like *big, good* or *get*, stop and ask: is there a more exact partner? Not *a big difference* but **a marked difference**; not *get a disease* but **contract a disease**.
:::

# [C] Fixed partnerships
Fixed expressions cannot be changed at all. You can say that a room is **spick and span**, that you visit your parents **now and again** and that a plan works **by and large**, but you cannot turn the words round. Fixed pairs often join two words with *and*: **peace and quiet**, **pros and cons**, **trial and error**, **first and foremost**.
::: mistakes
We weigh up the **pros and cons**, NOT ~~cons and pros~~.
:::

# Exercises
::: task Choose the only possible partner.
1 The result of the match was a foregone {conclusion*|result|decision}.
2 My request met with a blunt {reply|refusal*|yes}.
3 The village was flooded after two days of {torrential*|furious|thick} rain.
4 Early sales figures {say|bode*|look} well for the company.
5 Children have an {insatiable*|endlessly|unstopping} curiosity about the world.
:::
::: task Complete the fixed expressions.
@cols
1 spick and [span]
2 pros and [cons]
3 trial and [error]
4 now and [again|then]
5 first and [foremost]
6 peace and [quiet]
:::
::: task Replace the words in italics with a collocation with *wide*. Write two words.
1 The museum appeals to *all sorts of visitors*, a [wide audience] of all ages.
2 The shop sells *many different kinds* of tea, a [wide variety|wide range] from all over Asia.
3 There is *a large distance* between rich and poor, and this [wide gap] is growing.
:::
::: task Are these partnerships strong (S), weak (W) or fixed (F)?
@labels S, W, F
1 by and large = F
2 a wide range = W
3 torrential rain = S
4 a foregone conclusion = S
5 peace and quiet = F
6 a wide audience = W
:::
::: task Complete the news report. The first letter is given.
Health officials have decided to w[age] war on sugary drinks. They admit that there is a m[arked] difference between what people know and what they do. New labels were designed by t[rial] and error, and [by] and large shoppers seem to like them.
:::

=== Choosing the right register
kind: vocabulary
minutes: 25
summary: seek advice, hand in your notice, submit an application
---
# [A] Formal, neutral, informal
Two collocations may have the same meaning but belong to different situations.
| formal | neutral | informal |
| **seek advice** | ask for advice | **pick someone's brains** |
| **submit an application** | send in an application | – |
| **commence proceedings** | start | **get the ball rolling** |
| **tender one's resignation** | resign | **hand in your notice** |
| **be in receipt of** | have received | – |
| **consume alcohol** | drink | **go for a drink** |
| be exhausted | be very tired | **be dead on your feet** |

# [B] A formal letter and a friendly e-mail
::: letter Northgate Council
Dear Ms Osman,

We **acknowledge receipt** of your letter of 3 May. Before we can **reach a decision**, we must **conduct a survey** of the building. We will **notify you in writing** and we **regret any inconvenience** this delay may cause.

Yours sincerely,
D. Farrell
:::
::: email The flat!
From: Priya
To: Leo
Hi Leo,
Just **dropping you a line** to say the council has finally answered. They want to **have a look round** the place first, so I'll **keep you posted**. Fancy **grabbing a bite** on Friday? I'm **dying to hear** about your trip.
:::

# [C] Register in IELTS
In Writing Task 2 and in a formal letter choose neutral or formal collocations: **a considerable number of**, **it is widely believed that**, **play a vital role**. In the Speaking test a few informal ones sound natural: **I'm a big fan of**, **it's not my cup of tea**.
::: mistakes
Do not mix registers: NOT ~~The government should get its act together and implement legislation~~.
:::

# Exercises
::: task Write F (formal), I (informal) or N (neutral).
@labels F, I, N
1 Could I pick your brains about this? = I
2 Guests are kindly requested not to consume alcohol on the premises. = F
3 She asked her uncle for advice. = N
4 We are in receipt of your payment. = F
5 I was dead on my feet after the match. = I
6 He sent in an application last week. = N
:::
::: task Make the sentences more formal. Replace the words in italics with one word in each gap.
1 He has *handed in his notice*: he has [tendered] his resignation.
2 You should *ask for* legal advice: you should [seek] legal advice.
3 We *have got* your letter: we acknowledge [receipt] of your letter.
4 *Sorry about* the delay: we regret any [inconvenience] this delay may cause.
5 They will *tell you by letter*: they will notify you in [writing].
:::
::: task Complete the informal e-mail with words from the box.
Box: line, posted, bite, fan, cup
Hi Sam, just dropping you a [line] before I leave. The festival was great, although the jazz night was not really my [cup] of tea. You know I'm a big [fan] of rock! Shall we grab a [bite] on Sunday? I'll keep you [posted] about the time.
:::
::: task Circle the better collocation for a Task 2 essay.
1 Parents {play a vital role*|do a massive job} in a child's education.
2 {Loads of|A considerable number of*} commuters use the line every day.
3 {It is widely believed*|Everyone reckons} that exercise reduces stress.
4 The city {had a look at|conducted a survey of*} its older buildings.
:::

== Building blocks

=== Adverbs that turn the volume up or down
kind: vocabulary
minutes: 25
summary: bitterly cold, vaguely familiar, flatly refuse
---
# [A] Turning the volume up
Instead of *very*, good writers use an adverb that has its own favourite partners.
- **bitterly** cold · disappointed · opposed: It was **bitterly cold** and we were **bitterly disappointed**.
- **highly** unlikely · successful · qualified: a **highly qualified** nurse; it is **highly unlikely** that he will win
- **deeply** concerned · rooted · offended: traditions that are **deeply rooted** in the past
- **blissfully** happy · unaware: They were **blissfully unaware** of the danger.
- **fiercely** competitive · independent: the market is **fiercely competitive**
- **utterly** exhausted · ridiculous · convinced: After the climb we were **utterly exhausted**.

# [B] Turning the volume down
::: chat
Nora: Does the name ring a bell?
Adil: It sounds **vaguely familiar**, but I can't place it.
Nora: The film was only **mildly amusing**, wasn't it?
Adil: Well, the start was **moderately successful**. The end was **slightly disappointing**.
Nora: And the story was **loosely based on** a true event.
:::
These adverbs make a statement careful, which is useful in academic writing: the figures are **broadly similar**, the results are **partially explained by** the weather.

# [C] Adverbs with verbs
We **strongly recommend** a hotel, **sincerely hope** for the best, **thoroughly enjoy** a meal, **flatly refuse** to pay, **categorically deny** a rumour, **vividly remember** a day and **freely admit** a mistake.
::: mistakes
You can be **deeply offended** or **seriously injured**, NOT ~~highly offended~~ or ~~deeply injured~~.
:::

# Exercises
::: task Match the adverbs with their partners.
@match
@cols
1 bitterly = disappointed
2 blissfully = unaware
3 fiercely = competitive
4 deeply = rooted
5 highly = qualified
6 vaguely = familiar
Extra: injured
:::
::: task Complete the sentences with an adverb from this unit. The first letter is given.
1 The minister c[ategorically] denied the story.
2 I v[ividly] remember my first day at school.
3 We t[horoughly] enjoyed the tour of the old town.
4 He f[latly] refused to apologise.
5 I f[reely] admit that the mistake was mine.
:::
::: task Does the adverb make the meaning stronger (S) or weaker (W)?
@labels S, W
1 utterly ridiculous = S
2 mildly amusing = W
3 slightly disappointing = W
4 bitterly opposed = S
5 broadly similar = W
:::
::: task Circle the correct adverb.
1 It is {highly*|deeply|bitterly} unlikely that the museum will reopen this year.
2 The play is {vaguely|loosely*|lightly} based on a real trial.
3 Two passengers were {seriously*|deeply|strongly} injured.
4 We {highly|strongly*|utterly} recommend booking in advance.
5 Residents are {deeply*|fiercely|freely} concerned about the new road.
:::
::: task Rewrite the words in italics. Write one adverb in each gap.
The winter was *very* cold, in fact [bitterly] cold. We were *extremely* tired, or [utterly] exhausted, after the walk. The café was run by a *very* independent woman, a [fiercely] independent person. She said she was *completely* happy there: [blissfully] happy.
:::

=== Make, take, give and hold
kind: vocabulary
minutes: 25
summary: make an exception, take offence, give rise to, hold a grudge
---
# [A] Make and take
| make | take |
| **make an exception** | **take offence** |
| **make amends** | **take pride in** |
| **make allowances for** | **take the initiative** |
| **make a fuss** | **take issue with** |
| **make headway** | **take into account** |
Teachers **make allowances for** pupils who have been ill. If you hurt a friend, you try to **make amends**. Good managers **take the initiative** and **take pride in** their work, but some of them **take offence** too easily.

# [B] Give
::: news Old law gives rise to new questions
A law from 1920 has **given rise to** a fierce debate. Ministers **gave assurances** that nobody would lose a home, but they did not **give a straight answer** about the cost. Campaigners **gave evidence** to a committee on Monday, and several experts **gave their consent** to a public inquiry.
From the Morning Reader
:::
To **give someone the benefit of the doubt** is to believe them because you cannot be sure they are wrong.

# [C] Hold
- **hold a grudge** = stay angry about something in the past
- **hold a conversation** = be able to talk, e.g. in a foreign language
- **hold someone responsible** = say that they caused something
- **hold the key to** = be the thing that solves a problem
- **hold your breath** · **hold your nerve** · **hold true**
What **held true** ten years ago may not hold true today.
::: tip
When you learn a noun, always ask which verb comes before it. The verb is the part that learners usually get wrong.
:::

# Exercises
::: task Write the correct form of *make*, *take*, *give* or *hold*.
1 The manager agreed to [make] an exception for us.
2 She still [holds] a grudge against her old boss.
3 I [take] issue with the idea that homework is useless.
4 The new rule has [given] rise to a number of complaints.
5 Scientists believe this plant may [hold] the key to a new medicine.
6 We are finally [making] headway with the project.
:::
::: task Match the beginnings and the endings.
@match
1 She took offence = when nobody thanked her.
2 He made amends = by sending his sister some flowers.
3 I gave him the benefit of the doubt = because there was no proof.
4 They held the driver responsible = for the accident.
5 You should take the weather into account = before you plan the trip.
:::
::: task Circle the correct word.
1 He takes great {pride*|proud|honour} in his garden.
2 The witness gave {proof|evidence*|declaration} in court.
3 Don't make such a {fuss*|noise|mess} about a small mistake!
4 After a year she could {hold*|carry|run} a conversation in Japanese.
5 The company gave {assurances*|insurances|sureties} that jobs were safe.
:::
::: task Correct the mistakes. Write one word.
1 Please do an exception for my son. = make
2 The patient must make his consent in writing. = give
3 She made the initiative and called the bank. = took
4 I kept my breath under the water for a minute. = held
:::
::: task Complete the paragraph with one word in each gap.
My grandfather never holds a [grudge]. When a neighbour's tree fell on his fence, he did not [make] a fuss. He gave the man the benefit of the [doubt] and helped him to repair it. The neighbour wanted to make [amends], so he now takes great [pride] in painting the fence every spring.
:::

=== Phrasal verbs and their partners
kind: vocabulary
minutes: 25
summary: draw up a contract, iron out problems, stave off hunger
---
# [A] Verbs and the nouns they like
Many phrasal verbs have a small circle of nouns that they like best.
| collocation | example |
| **draw up a contract** | A lawyer drew up the contract in a day. |
| **carry out an experiment** | Students carry out a simple experiment. |
| **iron out problems** | We need a week to iron out the last problems. |
| **bring about change** | Can one law bring about real change? |
| **phase out plastic bags** | The chain will phase out plastic bags by 2030. |
| **stave off hunger** | A handful of nuts can stave off hunger. |
| **live up to expectations** | The sequel did not live up to expectations. |
| **wriggle out of a duty** | He always tries to wriggle out of the washing-up. |

# [B] At work
::: web the-shared-office.example / blog
When I **took over a business** from my aunt, I had to **take on staff** at once. We **ran up huge debts** in the first year, and twice we nearly **closed down the shop**. Then we **struck up a partnership** with a bakery next door and **built up a reputation** for good breakfasts.
:::

# [C] With feelings and ideas
You can **bottle up your feelings**, **come up with a solution**, **dream up an excuse**, **drum up support** for a campaign, **shrug off criticism** or **put up with noise**.
::: mistakes
You **come up with an idea**, NOT ~~come with an idea~~. You **carry out research**, NOT ~~carry on research~~.
:::

# Exercises
::: task Match the phrasal verbs with their partners.
@match
@cols
1 draw up = a contract
2 drum up = support
3 shrug off = criticism
4 stave off = hunger
5 run up = huge debts
6 iron out = problems
Extra: an experiment
:::
::: task Complete the sentences with one particle (*up, out, on, off, over, about*).
1 The new mayor wants to bring [about] change.
2 They took [over] a small hotel by the lake.
3 The factory is taking [on] fifty new workers.
4 Old buses will be phased [out] next year.
5 She tried to shrug [off] the criticism.
6 He dreamed [up] a clever excuse.
:::
::: task Replace the words in italics with a phrasal verb. Write two words.
1 The team will *do* an experiment, or [carry out] an experiment.
2 I can't *tolerate*, or [put up] with, the noise any longer.
3 You should not *hide* your feelings, or [bottle up] your feelings.
4 They have *developed* a good reputation, or [built up] a good reputation.
:::
::: task Circle the correct word.
1 The film didn't live up to my {expectations*|hopefulness|waiting}.
2 We struck up a {partnership*|contract|business} with a local farm.
3 He's always trying to wriggle out of his {duties*|musts|works}.
4 We still have to iron out a few {problems*|ideas|partners}.
:::
::: task Complete the conversation.
@chat
Maya: Have you [come] up with a name for the café yet?
Tom: Not yet. First the lawyer has to draw up the [contract].
Maya: I heard you are taking [on] staff.
Tom: Yes, two people. We are trying to [drum] up support among the neighbours as well.
:::

=== Pictures in words: metaphor
kind: vocabulary
minutes: 25
summary: a flood of complaints, shed light on, fan the flames
---
# [A] Light, water and fire
Many collocations paint a picture. New research may **shed light on** an old mystery, a project can **see the light of day**, and an explanation may leave you **in the dark**.
Water gives us **a flood of complaints**, **a stream of visitors**, **a drop in the ocean** and **pour cold water on** an idea. Fire gives us **a burning question**, **fan the flames** of an argument and **spark a debate**.
::: footnotes
1 *see the light of day*: to be published or to happen at last
2 *a drop in the ocean*: a very small part of what is needed
3 *pour cold water on*: to say that an idea will not work
4 *fan the flames*: to make a bad situation worse
:::

# [B] Journeys and buildings
| collocation | meaning |
| **be at a crossroads** | have to make an important choice |
| **reach a dead end** | be unable to go on with something |
| **pave the way for** | make something possible in the future |
| **lay the foundations for** | do the first important work |
| **break down barriers** | make it easier for people to understand each other |
| **a stumbling block** | a problem that stops progress |

# [C] Temperature and weight
A debate can become **a heated argument**; guests get **a warm welcome** or **a frosty reception**. Something can **carry weight** with people who **hold power**, and after an exam it may feel like **a weight off your mind**.
::: tip
Draw a small picture next to a metaphor in your notebook. A drawing of a bucket will help you to remember *pour cold water on*.
:::

# Exercises
::: task Match the two parts of the collocations.
@match
@cols
1 a flood = of complaints
2 pave = the way for
3 a frosty = reception
4 fan = the flames
5 a stumbling = block
6 spark = a debate
Extra: the light of day
:::
::: task Which picture is behind each collocation?
@labels light, water, fire, journey, building
1 a stream of visitors = water
2 a burning question = fire
3 reach a dead end = journey
4 lay the foundations for = building
5 shed light on = light
:::
::: task Complete the sentences with one word.
1 My savings are just a drop in the [ocean].
2 After three months the talks reached a dead [end].
3 When I heard my result, it was a [weight] off my mind.
4 Sport can break down [barriers] between communities.
5 Her opinion carries a lot of [weight] with the director.
:::
::: task Circle the correct word.
1 The report {sheds*|puts|opens} light on the causes of the fire.
2 My boss poured {cold*|cool|iced} water on the plan.
3 They had a {heated*|hot|boiling} argument about money.
4 The young country was at a {crossroads*|corner|turn}.
:::
::: task Rewrite the words in italics with a metaphor from this unit. Write the number of words in brackets.
1 The invention *made it possible to build* cheap phones: it [paved the way for] cheap phones. (4)
2 His diary was *finally published* in 1990: it finally [saw the light of day] in 1990. (5)
3 Language was the *main problem*: it was the main [stumbling block]. (2)
:::

== Study and work

=== At university
kind: vocabulary
minutes: 25
summary: enrol on a course, a packed timetable, pull an all-nighter
---
# [A] Starting a course
First you **meet the entry requirements**, **secure a place** and **enrol on a course**. Some students **win a scholarship**; others **take out a student loan**. During the **induction week** you **settle into** your room and **get to grips with** the library.
::: help
In Britain you **read law** or **study law**; *read* is rather formal and is used only of university subjects.
:::

# [B] Life as a student
::: email Week six already
From: Hana
To: Uncle Rob
Dear Uncle Rob,
I can hardly **keep on top of** my reading! On Mondays I **sit in on** a seminar for third-year students, and I have **a packed timetable** for the rest of the week. I **handed in an assignment** late, so the tutor **deducted marks**. On Thursday I **pulled an all-nighter** to finish the next one. Still, I'm **broadening my horizons** and I have **made lifelong friends**.
:::

# [C] Finishing
Final-year students **write a dissertation**, **sit their finals** and hope to **graduate with honours**. Some **drop out of** university, a few **fall behind with** their work, and many **carry on their studies** as **postgraduate students**.
::: mistakes
You **sit an exam** or **take an exam**, NOT ~~write an exam~~. You **get a good mark**, NOT ~~take a good mark~~.
:::

# Exercises
::: task Put the events in order: match the stage with what the student does.
@match
1 before the course = meet the entry requirements
2 in the first days = settle into a room
3 during the year = hand in assignments
4 in the last year = write a dissertation
5 at the very end = graduate with honours
:::
::: task Complete the sentences with a verb from the box in the correct form.
Box: enrol, deduct, secure, win, broaden, fall
1 She [won] a scholarship to study abroad.
2 Over 300 people have [enrolled] on the evening course.
3 If you are ill for a month, it is easy to [fall] behind with the work.
4 The examiner [deducted] marks for poor spelling.
5 A year abroad will [broaden] your horizons.
6 He has [secured] a place at a good university.
:::
::: task Circle the correct word.
1 I need a week to get to {grips*|hands|touch} with the new software.
2 We have a {packed*|crowded|tight-full} timetable this term.
3 May I sit {in*|up|down} on your lecture tomorrow?
4 Many students take {out*|off|up} a loan to pay the fees.
5 I can't keep on {top*|head|over} of my reading.
:::
::: task Correct the mistakes. Write the correct verb.
1 I have to write three exams in June. = sit|take
2 She took a very good mark in chemistry. = got
3 He went out of university after a year. = dropped
4 My cousin makes law at Leeds. = reads|studies
:::

=== Research and academic writing
kind: vocabulary
minutes: 30
summary: a growing body of evidence, draw a distinction, lend support to
---
# [A] Talking about studies
| collocation | example |
| **a growing body of evidence** | There is a growing body of evidence that sleep aids memory. |
| **conduct a study** | The team conducted a study of 400 families. |
| **gather data** | Data were gathered in two schools. |
| **yield results** | The first tests yielded surprising results. |
| **draw a conclusion** | It is too early to draw firm conclusions. |
| **cast doubt on** | Later work cast doubt on these findings. |
| **lend support to** | The survey lends support to this view. |

# [B] Building an argument
Writers **put forward a hypothesis**, **advance an argument** and **draw a distinction** between two ideas. They **raise the question** of why something happens, **address an issue**, **pose a challenge to** older theories and **provide compelling evidence**. In the end they **reach a consensus** or **agree to differ**.
::: passage A short model
**A** Recent studies **point to a link** between green spaces and health. However, few of them **take account of** income, which **plays a crucial role** in where people live.

**B** The present paper **fills a gap** in the literature. It **makes a case for** small parks in poor districts and **offers fresh insights** into how they are used.
:::

# [C] Being careful
Academic English avoids strong claims: the results **tend to suggest**, the effect is **statistically significant** but small, and the author **acknowledges the limitations** of the work.
::: mistakes
You **draw a conclusion** or **come to a conclusion**, NOT ~~make a conclusion~~ or ~~take a conclusion~~.
:::

# Exercises
::: task Match the verbs with their partners.
@match
@cols
1 gather = data
2 yield = results
3 reach = a consensus
4 fill = a gap
5 pose = a challenge
6 draw = a distinction
Extra: evidence
:::
::: task Complete the sentences with a suitable verb. The first letter is given.
1 New figures c[ast] doubt on the theory.
2 The study l[ends] support to what teachers have said for years.
3 The author a[cknowledges] the limitations of her method.
4 Our group c[onducted] a study of city traffic last year.
5 The paper o[ffers] fresh insights into the problem.
:::
::: task Circle the correct word.
1 There is a growing {body*|mass|head} of evidence that music helps patients.
2 Income {plays*|does|acts} a crucial role in health.
3 The results are {statistically*|numerally|mathematics} significant.
4 The chapter makes a {case*|word|cause} for shorter working hours.
5 Several studies point to a {link*|chain|knot} between diet and mood.
:::
::: task Correct the mistakes. Write one word.
1 It is too early to make firm conclusions. = draw
2 The author rises the question of cost. = raises
3 Few reports make account of the weather. = take
4 The figures give doubt on his claim. = cast
:::
::: task Complete the paragraph with one word in each gap.
This essay [addresses] the issue of working from home. There is a growing body of [evidence] that people who work at home are happier, and several studies [point] to a link with lower costs. Other experts, however, [cast] doubt on these findings. I will [draw] a distinction between short and long periods before I reach a [conclusion|consensus].
:::

=== Careers and job hunting
kind: vocabulary
minutes: 25
summary: land a job, a steep learning curve, carve out a niche
---
# [A] Looking for work
::: ad Harbour Media
Are you **a team player** with **a proven track record** in sales? Do you **thrive under pressure** and **meet tight deadlines**? We offer **a competitive salary**, **flexible working hours** and **excellent prospects for promotion**.
:::
You **fill in an application form**, **attend an interview**, **make a good first impression** and, if all goes well, **land a job**. Before that you may have to **go through a rigorous selection process** or be **short-listed for a post**.

# [B] Moving up
| collocation | meaning |
| **climb the career ladder** | get better and better jobs |
| **carve out a niche** | create a special place for yourself |
| **a glass ceiling** | an invisible limit that stops people from being promoted |
| **be passed over for promotion** | not get a promotion you hoped for |
| **hone your skills** | make your skills better with practice |
| **a steep learning curve** | a lot to learn in a short time |
| **job satisfaction** | the pleasure you get from your work |

# [C] Leaving
People **hand in their notice**, **take early retirement** or are **made redundant** when a company **lays off staff**. **A golden handshake** is a large payment for someone who leaves; **a dead-end job** is one without a future.
::: mistakes
You **apply for a job** and **do a job**, NOT ~~apply to a job~~ or ~~make a job~~. You **earn a living**, NOT ~~win a living~~.
:::

# Exercises
::: task Match the two parts.
@match
@cols
1 a proven = track record
2 a glass = ceiling
3 a golden = handshake
4 a steep = learning curve
5 a tight = deadline
6 a dead-end = job
Extra: satisfaction
:::
::: task Complete the sentences with one word.
1 After ten years she was [passed] over for promotion again.
2 He has carved out a [niche] as a designer of small gardens.
3 Two hundred workers were made [redundant] when the plant closed.
4 I want to [hone] my skills as a photographer.
5 Try to make a good first [impression] at the interview.
:::
::: task Circle the correct word.
1 She {landed*|fell|caught} a job with a film company.
2 I work well {under*|below|in} pressure.
3 The bank is laying {off*|out|down} staff.
4 He took {early*|quick|soon} retirement at 55.
5 They offer a {competitive*|competing|competition} salary.
:::
::: task Is it good news (G) or bad news (B) for the worker?
@labels G, B
1 You have been short-listed for the post. = G
2 You have been passed over for promotion. = B
3 You have excellent prospects. = G
4 You are being laid off. = B
:::
::: task Complete the conversation.
@chat
Iris: I've decided to hand in my [notice].
Dan: Really? I thought you had real job [satisfaction] there.
Iris: I did, but it has become a dead-end [job]. I'd like to climb the career [ladder].
Dan: Well, with your track [record] you will soon land something better.
:::

=== Business and the economy
kind: vocabulary
minutes: 30
summary: break even, a hostile takeover, corner the market
---
# [A] Companies
A young company has to **raise capital**, **launch a product** and **break even** before it can **turn a profit**. Some firms **corner the market**; others **face stiff competition**, **go bankrupt** or are the target of **a hostile takeover**.
| collocation | meaning |
| **break even** | earn exactly as much as you spend |
| **corner the market** | control almost all the sales of something |
| **cut corners** | do something cheaply and badly |
| **a niche market** | a small group of special customers |
| **brand loyalty** | the habit of buying the same make again |
| **a knock-on effect** | a result that causes other results |

# [B] The economy
::: news Recovery still fragile
After two years of recession there are signs of **economic recovery**. **Consumer spending** is up, **interest rates** have been cut and **unemployment has fallen**. But **a widening trade deficit** and **soaring energy prices** could **stifle growth**, warned the Central Bank. "We must **curb inflation** without **choking off** demand."
From a business page
:::

# [C] Money in everyday life
Households **live within their means**, **tighten their belts**, **make ends meet** or **get into debt**. If prices are **prohibitively expensive**, people **shop around** and look for something **reasonably priced**.
::: tip
Task 1 questions often deal with money. Learn the verbs in groups: prices **soar**, **rocket** and **shoot up**; they **plummet**, **plunge** and **slump**.
:::

# Exercises
::: task Match the verbs with their partners.
@match
@cols
1 raise = capital
2 corner = the market
3 curb = inflation
4 stifle = growth
5 launch = a product
6 turn = a profit
Extra: a deficit
:::
::: task Complete the sentences with words from the box.
Box: means, belts, even, corners, ends
1 In its third year the firm managed to break [even].
2 Families had to tighten their [belts] during the crisis.
3 It is hard to make [ends] meet on one salary.
4 The builders cut [corners], and the roof began to leak.
5 If you live within your [means], you will not get into debt.
:::
::: task Circle the correct word.
1 The shop faces {stiff*|thick|rough} competition from online stores.
2 {Interest*|Interesting|Interested} rates rose again in March.
3 The strike had a {knock-on*|knock-out|knock-off} effect on tourism.
4 Electric cars are still {prohibitively*|forbiddingly|impossibly} expensive for many buyers.
5 The company went {bankrupt*|bankruptcy|bank-broken} in 2019.
:::
::: task Do these verbs mean *go up* (U) or *go down* (D)?
@labels U, D
1 Prices soared. = U
2 Shares plummeted. = D
3 Profits slumped. = D
4 Rents rocketed. = U
5 Sales plunged. = D
:::
::: task Complete the paragraph with one word in each gap.
There are signs of economic [recovery]. Consumer [spending] has risen and unemployment has [fallen]. However, soaring energy [prices] may stifle [growth], and many small firms struggle to [break] even.
:::

== Life and leisure

=== Travel and tourism
kind: vocabulary
minutes: 25
summary: off the beaten track, a leisurely stroll, soak up the atmosphere
---
# [A] Before and during a trip
You **book in advance**, **draw up an itinerary**, **travel light** and **set off at dawn**. On a long-haul flight you may **break the journey** in another city, suffer from **jet lag** or have to **sit out a delay**.
::: web slowroads.example / diary
Day 3. We left the **well-trodden path** and drove **off the beaten track** to a **sleepy village** by a lake. The **breathtaking scenery** made up for the **winding roads**. In the evening we took **a leisurely stroll** to the harbour to **soak up the atmosphere** and **sample the local cuisine**.
:::

# [B] Places
| collocation | used about |
| **a bustling market** | a place full of noise and people |
| **a secluded beach** | a quiet beach far from others |
| **unspoilt countryside** | land that has not been changed by building |
| **a popular holiday destination** | a place many tourists choose |
| **within easy reach of** | not far from |
| **steeped in history** | with a long and interesting past |

# [C] Tourism as a topic
**Mass tourism** brings jobs but can **put a strain on** water and roads. **Sustainable tourism** tries to **leave a small footprint**, **preserve local traditions** and **boost the local economy**. Some islands have had to **impose a limit** on the number of visitors.
::: mistakes
You **go on a trip** and **go on a journey**, NOT ~~make a travel~~ or ~~do a travel~~. *Travel* is usually uncountable.
:::

# Exercises
::: task Match the adjectives with the nouns.
@match
@cols
1 a secluded = beach
2 a bustling = market
3 unspoilt = countryside
4 breathtaking = scenery
5 a leisurely = stroll
6 winding = roads
Extra: an itinerary
:::
::: task Complete the sentences with one word.
1 We always travel [light]: one small bag each.
2 The hotel is within easy [reach] of the airport.
3 The old town is [steeped] in history.
4 They love places off the beaten [track].
5 We sat in a café and [soaked] up the atmosphere.
:::
::: task Circle the correct word.
1 They went on a {trip*|travel|travelling} to the mountains.
2 We {set*|put|went} off at dawn to avoid the traffic.
3 Huge cruise ships put a {strain*|pull|push} on the harbour.
4 You need to book {in advance*|in front|in before} in summer.
5 I'd like to {sample*|probe|attempt} the local cuisine.
:::
::: task Are these effects of tourism positive (P) or negative (N)?
@labels P, N
1 It boosts the local economy. = P
2 It puts a strain on water supplies. = N
3 It helps to preserve local traditions. = P
4 It leaves a large carbon footprint. = N
:::
::: task Complete the postcard. The first letter is given.
Dear all, we left the w[ell-trodden] path and found a s[leepy] village with b[reathtaking] scenery. Every evening we take a l[eisurely] stroll and s[ample] the local cuisine. Home on Sunday!
:::

=== Health and fitness
kind: vocabulary
minutes: 25
summary: a balanced diet, come down with flu, a sedentary lifestyle
---
# [A] Staying well
Doctors advise us to **eat a balanced diet**, **take regular exercise**, **keep fit** and **get a good night's sleep**. Too many people **lead a sedentary lifestyle**, **put on weight** and **run out of breath** on the stairs.
::: chat
Coach: How do you **stay in shape**?
Lin: I **work up a sweat** on the rowing machine and I try to **cut down on** sugar.
Coach: Remember to **warm up** properly, or you may **pull a muscle**.
Lin: I know. Last month I **sprained my ankle** and it took weeks to **make a full recovery**.
:::

# [B] Being ill
| collocation | example |
| **come down with flu** | Half the class has come down with flu. |
| **a splitting headache** | I woke up with a splitting headache. |
| **a runny nose** | She has a runny nose and a cough. |
| **be on the mend** | He was very ill, but he is on the mend now. |
| **relieve the pain** | These tablets will relieve the pain. |
| **prescribe a course of antibiotics** | The doctor prescribed a course of antibiotics. |
| **a highly contagious disease** | Measles is a highly contagious disease. |

# [C] Public health
Governments **raise awareness of** risks, **launch health campaigns** and **provide free healthcare**. Vaccination helps to **eradicate diseases**. An ageing population **places a burden on** hospitals, while **a healthy lifestyle** can **reduce the risk of** heart disease and **increase life expectancy**.
::: mistakes
You **catch a cold**, but you **have an illness** or **suffer from an illness**, NOT ~~catch a headache~~.
:::

# Exercises
::: task Match the two parts.
@match
@cols
1 a splitting = headache
2 a balanced = diet
3 a sedentary = lifestyle
4 a full = recovery
5 life = expectancy
6 a runny = nose
Extra: exercise
:::
::: task Complete the sentences with a verb. The first letter is given.
1 You should c[ut] down on salt.
2 She s[prained] her ankle on the ice.
3 These drops will r[elieve] the pain.
4 The campaign r[aised] awareness of skin cancer.
5 Scientists hope to e[radicate] the disease.
:::
::: task Circle the correct word.
1 He came {down*|up|in} with flu on the first day of the holiday.
2 I worked {up*|out|off} a sweat in the gym.
3 Grandma is on the {mend*|repair|better} at last.
4 Walking reduces the {risk*|luck|odds} of heart disease.
5 Flu is a highly {contagious*|contacting|touching} disease.
:::
::: task Correct the mistakes. Write one word.
1 I caught a terrible headache last night. = had
2 You must make regular exercise. = take|get|do
3 She did a full recovery after the operation. = made
4 He leads a seated lifestyle. = sedentary
:::
::: task Complete the paragraph with one word in each gap.
An ageing population places a [burden] on hospitals. For this reason governments should [launch] health campaigns and encourage people to lead a healthy [lifestyle]. If everybody took regular [exercise] and ate a balanced [diet], life [expectancy] would increase.
:::

=== Food and eating out
kind: vocabulary
minutes: 25
summary: a hearty meal, an acquired taste, whet your appetite
---
# [A] Describing food
- **a hearty meal** = large and filling · **a light snack** = small
- **home-cooked food** · **fresh produce** · **locally sourced ingredients**
- **an acquired taste** = something you like only after you have tried it several times
- **rich food** = with a lot of butter, cream or eggs · **bland food** = without much taste
- **a subtle flavour** · **a pungent smell** · **a mouth-watering dish**
The walk will **work up an appetite**, and the smell of fresh bread will **whet your appetite** even more.

# [B] Eating out
::: ad The Olive Press
**Dine in style** in our garden. Choose from **a set menu** or order **à la carte**. Our chefs **cater for all tastes** and for anyone with **special dietary requirements**. **Book a table** before 6 p.m. and enjoy **a complimentary dessert**.
:::
Friends often **split the bill** or **go Dutch**; on a birthday somebody will offer to **pick up the bill**. If the service is good, you **leave a generous tip**.

# [C] Food as a topic
**Processed food** and **fizzy drinks** are blamed for **childhood obesity**. Schools can **ban junk food** and teach children to **develop healthy eating habits**. Others worry about **food miles**, **genetically modified crops** and the fact that a third of all food **goes to waste**.
::: mistakes
We **have breakfast**, **have lunch** and **have dinner**, NOT ~~take breakfast~~ or ~~eat a dinner~~ in everyday English.
:::

# Exercises
::: task Match the adjectives with the nouns.
@match
@cols
1 a hearty = meal
2 an acquired = taste
3 a pungent = smell
4 fresh = produce
5 a generous = tip
6 fizzy = drinks
Extra: the bill
:::
::: task Complete the sentences with one word.
1 Blue cheese is an acquired [taste].
2 The smell of the grill whetted my [appetite].
3 It was her birthday, so I picked up the [bill].
4 A third of the food we buy goes to [waste].
5 The restaurant caters for all [tastes].
:::
::: task Circle the correct word.
1 Let's {split*|break|cut} the bill: it was an expensive dinner.
2 The soup was rather {bland*|blind|blank}, so I added some pepper.
3 We use {locally*|localised|near} sourced ingredients.
4 Please tell us about any special dietary {requirements*|musts|obligations}.
5 I {have*|take|make} breakfast at seven.
:::
::: task Is the description positive (P) or negative (N)?
@labels P, N
1 a mouth-watering dish = P
2 bland food = N
3 fresh produce = P
4 home-cooked food = P
5 junk food = N
:::
::: task Complete the restaurant review. The first letter is given.
We went to The Olive Press with friends and decided to go D[utch]. The s[et] menu was excellent and the portions were large: a really h[earty] meal. The chef gave us a c[omplimentary] dessert, so we left a g[enerous] tip.
:::

=== Friends and relationships
kind: vocabulary
minutes: 25
summary: strike up a friendship, a bone of contention, clear the air
---
# [A] Making friends
You can **strike up a friendship**, **hit it off with** somebody at once, **have a lot in common** and **stay in touch**. **Close friends** **confide in** each other, **keep a secret** and **stick together** through **thick and thin**. A person you know only a little is **a casual acquaintance** or **a nodding acquaintance**.

# [B] When things go wrong
::: email Sorry!
From: Kim
To: Alex
Hi Alex,
I feel terrible that we **had a row** on Saturday. Money has always been **a bone of contention** between us, and I **lost my temper**. I don't want us to **drift apart** over something so small. Can we **clear the air** and **patch things up**? I promise not to **bear a grudge**!
:::
::: footnotes
1 *a bone of contention*: something people often argue about
2 *drift apart*: slowly become less close
3 *clear the air*: talk honestly to end a bad feeling
4 *patch things up*: become friends again
:::

# [C] Families and generations
**Immediate family** means parents, brothers and sisters, and children; **extended family** includes everybody else. Parents **set a good example**, **bring up children** and **provide a stable home**. **A close-knit family** can **bridge the generation gap** more easily. Some children **take after** a grandparent: they **bear a strong resemblance to** them.
::: mistakes
You **have a good relationship with** someone and **make friends with** them, NOT ~~do friends with~~.
:::

# Exercises
::: task Match the two parts.
@match
@cols
1 strike up = a friendship
2 bridge = the generation gap
3 set = a good example
4 bear = a grudge
5 clear = the air
6 lose = your temper
Extra: an acquaintance
:::
::: task Complete the sentences with one word.
1 We [hit] it off as soon as we met.
2 They have been friends through thick and [thin].
3 Politics is a bone of [contention] in our family.
4 She bears a strong [resemblance] to her grandmother.
5 Let's stay in [touch] after the course.
:::
::: task Circle the correct word.
1 I know him a little: he's a {nodding*|shaking|waving} acquaintance.
2 We come from a {close-knit*|near-tied|tight-sewn} family.
3 After school we slowly drifted {apart*|away of|off}.
4 They had a terrible {row*|line|rank} about the car.
5 You can confide {in*|to|with} me: I can keep a secret.
:::
::: task Does it mean things are getting better (B) or worse (W)?
@labels B, W
1 They patched things up. = B
2 They drifted apart. = W
3 They cleared the air. = B
4 They had a row. = W
:::
::: task Complete the conversation.
@chat
Rosa: How did you two [make] friends?
Will: We met on a train and [struck] up a conversation. We had so much in [common]!
Rosa: And have you ever [had] a row?
Will: Once. But I rang her the next day to [clear] the air.
:::

== The modern world

=== City life and transport
kind: vocabulary
minutes: 25
summary: urban sprawl, bumper-to-bumper traffic, the hustle and bustle
---
# [A] The city
Some people love **the hustle and bustle** of a city, its **vibrant nightlife** and **cultural diversity**. Others complain about **urban sprawl**, **high-rise buildings**, **sky-high rents** and **run-down areas**. Planners try to **regenerate inner-city areas**, **pedestrianise the centre** and create **green spaces**.
| collocation | meaning |
| **urban sprawl** | the spread of a city into the countryside |
| **a residential area** | a part of town where people live |
| **a thriving community** | a group of people that is doing well |
| **affordable housing** | homes that ordinary people can pay for |
| **the outskirts of the city** | the parts far from the centre |

# [B] Getting about
::: chat
Presenter: And how are the roads this morning?
Reporter: **Bumper-to-bumper traffic** on the ring road, I'm afraid. The centre is **gridlocked** and there are **lengthy delays** on the bridge.
Presenter: Any good news for **rail commuters**?
Reporter: Trains are **running on time**, but they are **packed like sardines** in **the rush hour**.
:::

# [C] Solutions
To **ease traffic congestion**, cities can **invest in public transport**, **introduce a congestion charge**, build **cycle lanes**, encourage **car sharing** and **stagger working hours**. These measures also **cut emissions** and **improve air quality**.
::: mistakes
We talk about **heavy traffic** and **light traffic**, NOT ~~big traffic~~ or ~~strong traffic~~.
:::

# Exercises
::: task Match the two parts.
@match
@cols
1 urban = sprawl
2 affordable = housing
3 the rush = hour
4 a congestion = charge
5 public = transport
6 cycle = lanes
Extra: sardines
:::
::: task Complete the sentences with one word.
1 I love the [hustle] and bustle of a big city.
2 The traffic was bumper-to-[bumper] all the way home.
3 We live on the [outskirts] of the city.
4 New lanes will [ease] traffic congestion.
5 The trains are running [on] time today.
:::
::: task Circle the correct word.
1 The traffic is very {heavy*|big|strong} in the evening.
2 The centre was completely {gridlocked*|locked-up|grid-closed}.
3 Firms could {stagger*|shake|stumble} working hours to spread the traffic.
4 This used to be a {run-down*|fallen-down|put-down} area.
5 The council wants to {regenerate*|rebirth|regrow} the old port.
:::
::: task Problem (P) or solution (S)?
@labels P, S
1 sky-high rents = P
2 car sharing = S
3 urban sprawl = P
4 pedestrianise the centre = S
5 lengthy delays = P
:::
::: task Complete the paragraph with one word in each gap.
Many cities suffer from traffic [congestion]. One answer is to [invest] in public transport, another is to introduce a congestion [charge]. Cycle [lanes] are cheap to build, and they help to cut [emissions] and improve air [quality].
:::

=== The environment
kind: vocabulary
minutes: 25
summary: a carbon footprint, on the brink of extinction, irreversible damage
---
# [A] Problems
| collocation | example |
| **cause irreversible damage** | Oil can cause irreversible damage to a coast. |
| **on the brink of extinction** | Several frogs are on the brink of extinction. |
| **rising sea levels** | Rising sea levels threaten small islands. |
| **deplete natural resources** | We are depleting natural resources too fast. |
| **dispose of waste** | Some factories dispose of waste illegally. |
| **emit greenhouse gases** | Cars emit greenhouse gases. |
| **loss of biodiversity** | Farming can lead to a loss of biodiversity. |
**Extreme weather events**, such as **prolonged droughts** and **flash floods**, are becoming more common.

# [B] Solutions
::: news Town goes green
Residents of Wexdale have decided to **reduce their carbon footprint**. They **harness solar power**, **recycle household waste** and have **phased out** plastic bags. "We can't **turn a blind eye to** **climate change**," said the mayor. "Everybody must **do their bit** to **protect the environment** and **conserve energy**."
From the Wexdale Post
:::

# [C] Discussing the environment
Writers speak of **a pressing issue**, **a matter of urgency** and **future generations**. Governments should **take drastic measures**, **impose a ban on** harmful products and **raise public awareness**. **Renewable energy** offers **a viable alternative to** **fossil fuels**.
::: tip
*Environment* goes with **protect, harm, damage, preserve**; *energy* goes with **save, conserve, waste, generate**.
:::

# Exercises
::: task Match the two parts.
@match
@cols
1 a carbon = footprint
2 fossil = fuels
3 renewable = energy
4 rising = sea levels
5 flash = floods
6 greenhouse = gases
Extra: extinction
:::
::: task Complete the sentences with a verb from the box in the correct form.
Box: harness, deplete, dispose, conserve, impose, emit
1 The law tells factories how to [dispose] of waste.
2 The village [harnesses] wind power to make electricity.
3 Old engines [emit] more gases than new ones.
4 We can [conserve] energy by switching off lights.
5 The city will [impose] a ban on plastic cups.
6 Overfishing [depletes] the oceans.
:::
::: task Circle the correct word.
1 The tiger is on the {brink*|border|line} of extinction.
2 We cannot turn a {blind*|closed|dark} eye to pollution.
3 Pollution is a {pressing*|pushing|squeezing} issue.
4 Solar power is a {viable*|living|lively} alternative to coal.
5 Everyone should do their {bit*|piece|slice}.
:::
::: task Harmful (H) or helpful (G) for the planet?
@labels H, G
1 recycling household waste = G
2 loss of biodiversity = H
3 conserving energy = G
4 depleting natural resources = H
:::
::: task Complete the paragraph with one word in each gap.
Climate [change] is a pressing [issue]. If we continue to burn fossil [fuels], we may cause [irreversible] damage to the planet. Governments should take drastic [measures], and each of us can reduce our carbon [footprint].
:::

=== Technology and the internet
kind: vocabulary
minutes: 25
summary: cutting-edge technology, go viral, the digital divide
---
# [A] New technology
**Cutting-edge technology** and **state-of-the-art equipment** are expensive at first. Later they become **commercially available** and **user-friendly**. A company may **pioneer a technique**, **develop a prototype** and **file a patent**. Other products become **obsolete** almost overnight: they have **a short shelf life**.

# [B] Online
::: web techtalk.example / safety
- **Back up your files** and **install updates** as soon as they come out.
- Choose **a strong password** and never **click on suspicious links**.
- Check your **privacy settings** before you **post a comment** or **upload a photo**.
- Remember that a careless message can **go viral** and leave **a digital footprint** for years.
:::
| collocation | meaning |
| **surf the net** | look at different sites |
| **stream a film** | watch it online without saving it |
| **a data breach** | when private data are stolen |
| **the digital divide** | the gap between people with and without access |
| **identity theft** | using another person's name and data |

# [C] For and against
Technology can **speed up communication**, **bridge distances**, **automate routine tasks** and **open up opportunities**. On the other hand, it may **invade our privacy**, **shorten attention spans**, **spread misinformation** and make us **overly dependent on** our phones. **Artificial intelligence** **poses a threat to** some jobs but **creates a demand for** others.
::: mistakes
You **use a computer** or **work on a computer**, NOT ~~work in a computer~~. You **do a search**, NOT ~~make a search~~ in everyday English.
:::

# Exercises
::: task Match the two parts.
@match
@cols
1 cutting-edge = technology
2 a data = breach
3 identity = theft
4 attention = spans
5 privacy = settings
6 a strong = password
Extra: a prototype
:::
::: task Complete the sentences with one word.
1 The video went [viral] and was seen by millions.
2 Always [back] up your files.
3 The laboratory has state-of-the-[art] equipment.
4 Some apps [invade] our privacy.
5 Machines can [automate] routine tasks.
:::
::: task Circle the correct word.
1 The firm {filed*|folded|filled} a patent for its battery.
2 Robots pose a {threat*|fear|warning} to some jobs.
3 The digital {divide*|division|separation} leaves poor areas behind.
4 False stories {spread*|put|spill} misinformation.
5 We are overly {dependent*|depending|depended} on our phones.
:::
::: task Advantage (A) or disadvantage (D)?
@labels A, D
1 It speeds up communication. = A
2 It shortens attention spans. = D
3 It opens up opportunities. = A
4 It invades our privacy. = D
:::
::: task Complete the conversation.
@chat
Ben: Someone has [posted] a nasty comment under my photo.
Zoe: Check your privacy [settings] and don't click on any suspicious [links].
Ben: I worry about my digital [footprint].
Zoe: Then think twice before you [upload] a photo!
:::

=== Crime and the law
kind: vocabulary
minutes: 25
summary: commit a crime, a lenient sentence, serve as a deterrent
---
# [A] From crime to court
A person who **commits a crime** may be **caught red-handed**. The police **make an arrest**, **take a statement** and **gather evidence**. In court the accused **pleads guilty** or **pleads not guilty**; witnesses **give evidence** and the jury **reaches a verdict**. The judge can then **pass sentence**.
| collocation | meaning |
| **petty crime** | crimes that are not serious |
| **be held in custody** | be kept by the police before a trial |
| **a lenient sentence** | a punishment that is not hard |
| **a custodial sentence** | time in prison |
| **community service** | unpaid work as a punishment |
| **be released on bail** | be free until the trial after money has been paid |

# [B] In the news
::: news Gang jailed after raid
Three men who **broke into** a museum last May were **found guilty** yesterday. They will **serve a sentence** of six years. A fourth man was **acquitted** because of **insufficient evidence**. Police are still looking for the woman believed to be **the mastermind behind** the raid.
From a local paper
:::

# [C] Discussing punishment
Some say that **harsh punishment** will **act as a deterrent** and **tackle crime**. Others believe that prison does not **address the root causes** and that offenders need **rehabilitation programmes** if they are not to **reoffend**. Children should learn to **abide by the law**, and those who **break the law** must **face the consequences**.
::: mistakes
You **commit a crime**, NOT ~~make a crime~~ or ~~do a crime~~.
:::

# Exercises
::: task Put the story in order: match the steps.
@match
1 first = commit a crime
2 then = be caught red-handed
3 next = be held in custody
4 in court = plead guilty
5 at the end = serve a sentence
:::
::: task Complete the sentences with one word.
1 The jury took two days to reach a [verdict].
2 He was [released] on bail until the trial.
3 Fines can act as a [deterrent].
4 She was acquitted because of [insufficient] evidence.
5 We all have to [abide] by the law.
:::
::: task Circle the correct word.
1 The thief was caught {red-handed*|red-faced|red-fingered}.
2 The judge passed {sentence*|punish|justice}.
3 Stealing a pen is a {petty*|tiny|small-sized} crime.
4 Schools can help to address the {root*|seed|leaf} causes of crime.
5 Six months was seen as a {lenient*|soften|lighted} sentence.
:::
::: task Correct the mistakes. Write one word.
1 He has never made a crime. = committed
2 The police did an arrest last night. = made
3 Two witnesses said evidence in court. = gave
4 The man pled not blame. = guilty
:::
::: task Complete the paragraph with one word in each gap.
Many people believe that [harsh] punishment will tackle crime. In my view it is better to address the root [causes]. Young people who break the [law] should do community [service] instead of being sent to prison, and rehabilitation [programmes] should be open to all.
:::

=== The media and the news
kind: vocabulary
minutes: 25
summary: hit the headlines, a vested interest, sensational coverage
---
# [A] How news is made
Reporters **cover a story**, **conduct an interview** and **verify the facts** before they **meet the deadline**. A big event **hits the headlines**, **makes the front page** and gets **blanket coverage**. A newspaper may **run a story**, **break the news** or **publish an exclusive interview**.

# [B] Good and bad journalism
| collocation | meaning |
| **an in-depth report** | a report with many details |
| **balanced coverage** | news that shows both sides |
| **a reliable source** | a person or text you can trust |
| **sensational headlines** | headlines meant to shock |
| **a vested interest** | a personal reason to want a result |
| **a biased view** | a view that is not fair |
| **take something out of context** | use words without what was around them |
::: chat
Editor: Are you sure about this? We can't **jump to conclusions**.
Writer: I have two **reliable sources**, and the minister **declined to comment**.
Editor: Fine, but don't **blow it out of proportion**.
:::

# [C] The media as a topic
The press can **shape public opinion**, **hold politicians to account** and **uncover corruption**. But celebrities complain about **invasion of privacy**, and **fake news** can **undermine trust in** every newspaper. Governments that **impose censorship** **restrict freedom of speech**.
::: mistakes
You **watch the news** and **read the news**, and *news* takes a singular verb: **the news is good**, NOT ~~the news are good~~.
:::

# Exercises
::: task Match the verbs with their partners.
@match
@cols
1 cover = a story
2 verify = the facts
3 shape = public opinion
4 hit = the headlines
5 impose = censorship
6 uncover = corruption
Extra: privacy
:::
::: task Complete the sentences with one word.
1 The actor [declined] to comment.
2 His words were taken out of [context].
3 The story made the front [page].
4 The owner has a vested [interest] in the project.
5 Let's not [jump] to conclusions.
:::
::: task Circle the correct word.
1 The match got {blanket*|cover|carpet} coverage on every channel.
2 The paper blew the story out of {proportion*|portion|measure}.
3 The news {is*|are|were} not good tonight.
4 Journalists should hold politicians to {account*|count|counting}.
5 We need a {reliable*|relying|trustful} source.
:::
::: task Good journalism (G) or bad journalism (B)?
@labels G, B
1 an in-depth report = G
2 sensational headlines = B
3 balanced coverage = G
4 a biased view = B
:::
::: task Complete the paragraph with one word in each gap.
Newspapers shape public [opinion], so they must [verify] the facts and rely on trustworthy [sources]. Fake [news] undermines trust in the press. At the same time, governments should not [restrict] freedom of speech or impose [censorship].
:::

== Ideas for writing and speaking

=== Describing trends and numbers
kind: writing
minutes: 30
summary: rise steadily, level off, account for the vast majority
---
# [A] Going up, going down, staying the same
| up | down | no change |
| **rise steadily** | **fall sharply** | **remain stable** |
| **a dramatic increase** | **a slight decrease** | **level off** |
| **reach a peak** | **hit a low** | **reach a plateau** |
| **a gradual upward trend** | **a steep decline** | **show little variation** |
Sales **rose steadily** until May, **reached a peak** of 400 and then **fell sharply** before **levelling off**.
::: help
Use adverb + verb or adjective + noun for variety: *prices rose sharply* → **there was a sharp rise in** prices.
:::

# [B] Amounts and proportions
Students **account for the vast majority** of visitors. **A significant proportion** comes from abroad and only **a tiny fraction** pays the full price. The figure is **roughly equivalent to** one in five; it is **just over half**, **well below average** or **twice as high as** in 2010.

# [C] Comparing
The two groups **follow a similar pattern**, but there is **a striking difference** in the last year. Women **outnumber men** by two to one. **By contrast**, the gap between the cities **narrowed considerably**; in the suburbs it **widened slightly**.
::: mistakes
Say **an increase of 10 per cent** but **an increase in sales**, NOT ~~an increase of sales~~.
:::

# Exercises
::: task Do these describe a rise (R), a fall (F) or no change (N)?
@labels R, F, N
1 Numbers levelled off. = N
2 There was a steep decline. = F
3 Costs reached a peak. = R
4 Sales hit a low. = F
5 The rate remained stable. = N
:::
::: task Change the verb into a noun phrase. Write one adjective.
1 Prices fell sharply. → a [sharp] fall in prices
2 Profits increased dramatically. → a [dramatic] increase in profits
3 The rate declined gradually. → a [gradual] decline in the rate
4 The number dropped slightly. → a [slight] drop in the number
:::
::: task Circle the correct word.
1 There was an increase {in*|of|on} car sales.
2 The figure rose {by*|in|on} ten per cent.
3 Young people account {for*|of|to} most of the visitors.
4 The total is twice as {high*|much high|higher} as in 2010.
5 The two lines {follow*|go|make} a similar pattern.
:::
::: task Complete the sentences with words from the box.
Box: fraction, majority, proportion, average, plateau
1 The vast [majority] of homes, 94 per cent, have internet access.
2 Only a tiny [fraction], under 1 per cent, use a typewriter.
3 A significant [proportion] of workers, about a third, travel by train.
4 Rainfall was well below [average] this year.
5 After 2015 the number reached a [plateau].
:::
::: task Complete the Task 1 paragraph with one word in each gap.
The graph shows that coffee sales rose [steadily] from 2000 to 2008, when they [reached] a peak of 60 tonnes. There was then a [sharp] fall, followed by a period in which the figure levelled [off] at 40 tonnes. By [contrast], tea sales [remained] stable throughout the period.
:::

=== Cause and effect
kind: writing
minutes: 25
summary: stem from, have far-reaching consequences, be a contributory factor
---
# [A] Talking about causes
| collocation | example |
| **stem from** | His fear stems from an accident. |
| **be rooted in** | The custom is rooted in farming life. |
| **trigger a reaction** | The news triggered an angry reaction. |
| **a contributory factor** | Stress is a contributory factor. |
| **the underlying cause** | We must find the underlying cause. |
| **provoke an outcry** | The plan provoked a public outcry. |
Something can be **attributed to** a single cause, or it can be the result of **a combination of factors**.

# [B] Talking about effects
Changes **have a profound effect on** people, **have far-reaching consequences** or **take their toll on** health. A decision may **bear fruit**, **backfire badly** or have **unforeseen consequences**. A small event can **set off a chain reaction** and **lead to widespread disruption**.
::: passage Why villages shrink
**A** Rural areas are losing people, and the reasons are closely **bound up with** work. Machines have **rendered** many farm jobs **unnecessary**, which **forces young people to** move.

**B** As a **direct consequence**, shops and schools close. This **sets a vicious circle in motion**: without schools, families have **little incentive to** stay.
:::

# [C] Linking words
Use **as a result of**, **owing to**, **on account of** before a noun; use **consequently**, **hence** and **as a consequence** to begin the result.
::: mistakes
Say **the reason for** the delay and **the cause of** the fire, NOT ~~the reason of~~ or ~~the cause for~~ the fire.
:::

# Exercises
::: task Match the two parts.
@match
@cols
1 a vicious = circle
2 far-reaching = consequences
3 a chain = reaction
4 the underlying = cause
5 a public = outcry
6 a contributory = factor
Extra: fruit
:::
::: task Complete the sentences with one word.
1 Many of his problems [stem] from his childhood.
2 Long hours take their [toll] on family life.
3 The delay was attributed [to] bad weather.
4 After years of work the project is bearing [fruit].
5 The plan [backfired] badly and sales dropped.
:::
::: task Circle the correct word.
1 What was the cause {of*|for|to} the fire?
2 The internet has had a {profound*|deepened|bottom} effect on education.
3 The news {triggered*|shot|pulled} an angry reaction.
4 The flight was late owing {to*|of|from} fog.
5 Poverty is a {contributory*|contributed|contribution} factor.
:::
::: task Is the phrase about a cause (C) or an effect (E)?
@labels C, E
1 is rooted in = C
2 has far-reaching consequences = E
3 stems from = C
4 takes its toll on = E
5 as a direct consequence = E
:::
::: task Complete the paragraph with one word in each gap.
Obesity is the result of a [combination] of factors. Lack of exercise is a contributory [factor], but the underlying [cause] is often poor diet. It has a [profound] effect on health and, as a [consequence|result], places a burden on hospitals.
:::

=== Opinions: agreeing and disagreeing
kind: speaking
minutes: 25
summary: hold the view that, see eye to eye, beg to differ
---
# [A] Giving an opinion
In writing you can **hold the view that**, **be of the opinion that**, **firmly believe** or **be inclined to think**. In conversation you might **have mixed feelings about** something, **feel strongly about** it or **sit on the fence**.
| collocation | meaning |
| **sit on the fence** | not choose a side |
| **have strong views on** | have firm opinions about |
| **a popular misconception** | a false idea many people have |
| **in my humble opinion** | a polite or playful way to begin |
| **a matter of opinion** | something people can disagree about |

# [B] Agreeing and disagreeing
::: chat
Omar: Tourism does more harm than good, don't you think?
Ella: I **agree up to a point**. It does **put pressure on** small towns.
Omar: So we **see eye to eye**, then?
Ella: Not quite. I **beg to differ** about jobs. I **take your point**, but the benefits **far outweigh** the problems.
Omar: Well, let's **agree to disagree**.
:::

# [C] In an essay
Essays **present both sides of the argument** and **draw attention to** weaknesses. An idea may **hold water**, **be open to question** or be **fundamentally flawed**. Opponents **raise objections**, **express concern** and **voice criticism**; supporters **make a convincing case** and **come out in favour of** a plan.
::: mistakes
Say **I agree** and **I agree with you**, NOT ~~I am agree~~. Say **in my opinion**, NOT ~~according to me~~.
:::

# Exercises
::: task Match the two parts.
@match
@cols
1 see = eye to eye
2 sit = on the fence
3 hold = water
4 raise = objections
5 beg = to differ
6 voice = criticism
Extra: opinion
:::
::: task Complete the sentences with one word.
1 I agree up to a [point].
2 Whether it is beautiful is a matter of [opinion].
3 I have mixed [feelings] about the new law.
4 His argument is fundamentally [flawed].
5 The advantages far [outweigh] the disadvantages.
:::
::: task Circle the correct word.
1 I {agree*|am agree|am agreeing} with the writer.
2 {In my opinion*|According to me|By my opinion}, the film is too long.
3 Many experts {hold*|take|carry} the view that sleep is vital.
4 The theory is open to {question*|asking|doubtful}.
5 The council came out in {favour*|like|side} of the plan.
:::
::: task Does the speaker agree (A), disagree (D) or neither (N)?
@labels A, D, N
1 I beg to differ. = D
2 We see eye to eye on this. = A
3 I'm sitting on the fence. = N
4 I couldn't have put it better myself. = A
:::
::: task Complete the conversation.
@chat
Jade: I [firmly] believe that homework should be banned.
Paul: I take your [point], but I'm not so sure.
Jade: So you don't [agree] with me?
Paul: Only up to a point. Let's agree to [disagree].
:::

=== Problems and solutions
kind: writing
minutes: 25
summary: tackle a problem head-on, a stopgap measure, nip in the bud
---
# [A] Problems
Problems can **arise**, **crop up**, **come to a head** or **get out of hand**. We speak of **a thorny issue**, **a long-standing problem**, **a setback** and **an insurmountable obstacle**. People **encounter difficulties**, **run into trouble**, **face a dilemma** or find themselves **in a tight corner**.

# [B] Solutions
| collocation | meaning |
| **tackle a problem head-on** | deal with it directly |
| **nip something in the bud** | stop it at an early stage |
| **a stopgap measure** | something used until a better answer is found |
| **a long-term solution** | an answer that will last |
| **find a way round** | avoid a problem cleverly |
| **take steps to** | begin to do something about it |
| **resolve a dispute** | end an argument |
To **get to the bottom of** a problem is to find out its real cause. A good answer is **cost-effective**; a bad one is only **a quick fix**.

# [C] A problem–solution paragraph
::: passage Model paragraph
**A** Litter is **a persistent problem** in many parks. Fines alone are **a quick fix**: they **do little to** change habits.

**B** **A more effective approach** would be to **take preventive measures**. If councils **provided adequate facilities** and schools **raised awareness**, the problem could be **nipped in the bud**. Such steps would **go a long way towards** cleaner cities.
:::
::: mistakes
You **solve a problem** and **find a solution to** it, NOT ~~find a solution of~~ a problem or ~~resolve a solution~~.
:::

# Exercises
::: task Match the two parts.
@match
@cols
1 a thorny = issue
2 a stopgap = measure
3 resolve = a dispute
4 face = a dilemma
5 a quick = fix
6 run into = trouble
Extra: the bottom
:::
::: task Complete the sentences with one word.
1 We must tackle the problem [head-on].
2 The doctor wanted to nip the infection in the [bud].
3 Several problems [cropped] up during the trip.
4 The police want to get to the [bottom] of the mystery.
5 The party got out of [hand] after midnight.
:::
::: task Circle the correct word.
1 We need to find a solution {to*|of|for} the problem of noise.
2 The talks suffered a {setback*|backset|set-down}.
3 A ban would go a long {way*|road|path} towards cleaner air.
4 The council has taken {steps*|walks|feet} to reduce litter.
5 Buying time is only a {stopgap*|gapstop|stopover} measure.
:::
::: task Is it a problem (P) or a solution (S)?
@labels P, S
1 an insurmountable obstacle = P
2 a cost-effective answer = S
3 preventive measures = S
4 a thorny issue = P
:::
::: task Complete the paragraph with one word in each gap.
Youth unemployment is a [long-standing|persistent] problem in our region. Short courses are only a quick [fix]. To find a long-term [solution], the government should [take] steps to create real jobs. This would go a long [way] towards solving the problem.
:::
::: you
Choose a problem in your town. Write one paragraph with at least five collocations from this unit.
:::
`;

const units = doc.unitsFromText(TEXT);

module.exports = {
  key: 'collocations-1',
  id: 'b-c0110ca7',
  unitId: (n) => 'u-c0110' + ('00' + (n + 1)).slice(-3),
  style: 'inuse',
  book: {
    title: 'Advanced Collocations for IELTS',
    author: 'IELTSX Team',
    category: 'Vocabulary',
    level: 'C1',
    plan: 'free',
    description: 'Natural English in 24 units: how words work together in study, work, travel, health, the city, the environment and in IELTS essays. The explanation is on the green page (A, B, C), the exercises are on the white one — every one is checked for you. With an A–Z index and a notebook of your own.'
  },
  units
};
