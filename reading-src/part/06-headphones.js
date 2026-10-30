/* Some views on the use of headphones — Reading Passage 3, Questions 27–40 (from 06_Headphones_P3.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'headphones',
  title: 'Some views on the use of headphones',
  passageLabel: 'Passage 3',
  cardTypes: ['Yes No Not Given', 'Multiple Choice', 'Summary Completion'],
  passage: `
Whether wearing headphones at work, or in other areas of everyday life, is a good thing or a bad thing has generated a lot of research and opinion

To visit a typical modern office today is to walk into a room with possibly a dozen songs playing simultaneously but to hear none of them. Up to half of younger workers listen to music on their headphones, and nearly all of them think it makes them better at their jobs. In survey after survey, people report with confidence that music makes them happier, better at concentrating, and more productive.

Scientists do not share this belief; they maintain that listening to music hurts people’s ability to recall other things they should be doing, and any pop song, loud or soft, reduces overall performance for both extroverts and introverts. A Taiwanese study linked music that has lyrics to lower marks on concentration tests for college students, and other research has shown music with lyrics scrambles our brains’ verbal-processing skills. ‘As silence has the best overall performance, it would still be advisable that people work in silence,’ another reporter dryly concluded.

The question is therefore: if headphones are so bad for productivity, why do so many people at work have them? One factor to consider is that countries like the USA have moved from a farming and manufacturing economy to a service economy, with an emphasis on jobs in offices that require higher levels of concentration, reflection and creativity. As an estimated 70 per cent of office workers work in open-plan office spaces, it is more important to create one’s own enclosing bubble of sound. Lending strength to the argument for headphones at work is evidence that music relaxes our muscles, improves our mood, and may even moderately reduce blood pressure, heart rate and anxiety.

The story of headphones began in 1910, when the US Navy received an odd letter written in purple ink on blue-and-pink paper. The letter writer, an eccentric inventor and repairman named Nathaniel Baldwin, from the US state of Utah, made what at the time was an astonishing claim: he had built, in his kitchen, a new kind of headset that could amplify sound. This was an opportune invention for the Navy, who asked for a sound test and then enthusiastically adopted the headsets, later called headphones, and used them in World War I for naval radio communication.

The purpose of headphones is to concentrate a quiet and private sound in the ear of the listener, which is a radical departure from music’s social purpose in history. ‘Music, together with dance, co-evolved biologically and culturally to serve as a technology of social bonding,’ Nills L Wallin and Bjorn Merker wrote in The Origins of Music. Songs don’t leave behind fossils, but evidence of musical notation dates back to Sumeria, 3,500 years ago, and in 1995 archaeologists discovered a bone flute in southern Europe estimated to be 44,000 years old. If music evolved as a social glue for the species, as a way to make groups and keep them together, headphones have done what writing and literacy did for language – they made music private.

Author and columnist Stephen Marche wrote that separation from other people is one of the first things ordinary Americans spend their money achieving. It is ‘a by-product of a long-standing national appetite for independence,’ he said. Americans are not alone in their desire for personal independence and privacy. Marche is right; wealth can buy – and modern technology can deliver – personal independence, and it is this that people have always sought.

Dr Michael Bull, an expert on personal music devices from the University of Sussex in the UK, has repeatedly made the larger point that personal music devices change how we relate to public spaces. Controlling our public spaces is more important now that more people are moving from the edges of cities to live in urban centres. ‘With the urban space, the more it’s inhabited, the safer you feel,’ Bull says. ‘You feel safe if you can feel people there, but you don’t want to interact with them.’ Headphones create shields for wearers, separating them from other people and their surroundings. Headphones have their own rules of good manners; they are like wearing a ‘Do not disturb’ sign. We assume that people wearing them are busy and we should respect their privacy, so now people wear them to appear busy. In fact, it is now becoming quite common for people not to listen to anything at all, but just to wear headphones.

However, as pointed out at the beginning of this piece, although scientists have stated that headphones are bad for productivity, people still wear them at work. It is not just that headphones create privacy out of public areas, but also that music causes people to relax and reflect and pause. The outcome of relaxation, reflection and pausing at work won’t be captured in minute-to-minute productivity metrics. What must be considered is that in moments of extreme focus, our attention radiates outward, toward the problem, rather than inward, on how to solve the problem. However, with music ‘When our minds are at ease, we’re more likely to direct the spotlight of attention inward,’ Jonah Lehrer wrote in his book Imagine: How Creativity Works. ‘The answers have been there all along. We just weren’t listening.’ In a crowded world, real estate is the ultimate scarce resource, and a headphone is a small invisible fence around our minds – making space, creating separation, and helping us listen to ourselves.
`,
  groups: [
    { type: 'ynng',
      group: 'Do the following statements agree with the claims of the writer in Reading Passage 3? In boxes 27–31 on your answer sheet, write',
      items: [
        { q: 'Young people are easily persuaded by surveys that listening to music is beneficial.', a: 'NOT GIVEN',
          en: 'Young workers themselves report in surveys that music helps them; the writer never says that surveys persuade them.' },
        { q: 'Different studies share the same conclusions about the desirability of working in silence.', a: 'NO',
          ev: 'it would still be advisable that people work in silence',
          en: 'Surveys say music makes people "more productive", while scientists conclude "it would still be advisable that people work in silence": the conclusions differ.' },
        { q: 'Some doctors recommend wearing headphones to lower blood pressure.', a: 'NOT GIVEN',
          en: 'Music "may even moderately reduce blood pressure", but no doctors are said to recommend headphones.' },
        { q: 'Nathaniel Baldwin was a respected government researcher.', a: 'NO',
          ev: 'an eccentric inventor and repairman named Nathaniel Baldwin',
          en: 'Baldwin was "an eccentric inventor and repairman" who built the headset "in his kitchen", not a government researcher.' },
        { q: 'The effect of the invention of headphones is comparable to the effect of the invention of writing.', a: 'YES',
          ev: 'headphones have done what writing and literacy did for language – they made music private',
          en: '"Headphones have done what writing and literacy did for language – they made music private."' }
      ] },
    { type: 'mcq',
      group: 'Choose the correct letter, A, B, C or D. Write the correct letter in boxes 32–36 on your answer sheet.',
      items: [
        { q: 'What does the writer suggest about a service economy?', a: 'A',
          opts: ['A. The work is mentally demanding.', 'B. It provides employment for younger workers.', 'C. It is a small part of a country’s economy.', 'D. Workers have to live in urban centres.'],
          ev: 'jobs in offices that require higher levels of concentration, reflection and creativity',
          en: 'A service economy has "jobs in offices that require higher levels of concentration, reflection and creativity", i.e. mentally demanding work.' },
        { q: 'When the writer mentions the historical evidence for early music he is', a: 'C',
          opts: ['A. emphasizing the diversity of musical forms.', 'B. expressing his frustration with the limited archaeological evidence uncovered.', 'C. lending support to the view that music has been important in human history.', 'D. creating a geographical map of the evolution of music.'],
          ev: 'evidence of musical notation dates back to Sumeria, 3,500 years ago',
          en: 'Notation from Sumeria and a 44,000-year-old bone flute support the idea that music "co-evolved" as "a technology of social bonding".' },
        { q: 'What does the writer say about the social effects of listening to music through headphones?', a: 'D',
          opts: ['A. It has caused a reduction in the number of people who listen to music.', 'B. It has increased people’s participation in music events.', 'C. It has reduced the global variation of music styles.', 'D. It has changed the traditional role of music in society.'],
          ev: 'which is a radical departure from music’s social purpose in history',
          en: 'Private listening "is a radical departure from music\'s social purpose in history".' },
        { q: 'What does the writer say about personal independence?', a: 'B',
          opts: ['A. Americans are unique in their desire for personal independence.', 'B. Personal independence is something that can be purchased.', 'C. Striving for personal independence is a recent phenomenon.', 'D. Personal independence destroys social connections.'],
          ev: 'wealth can buy – and modern technology can deliver – personal independence',
          en: '"Wealth can buy ... personal independence". A is wrong: "Americans are not alone"; C is wrong: people "have always sought" it.' },
        { q: 'Why does the writer quote Jonah Lehrer in the last paragraph?', a: 'A',
          opts: ['A. to support the writer’s own view', 'B. to draw attention to an authoritative book about music', 'C. to raise awareness of people’s loss of listening skills', 'D. to illustrate how music brings people closer to each other'],
          ev: 'When our minds are at ease, we’re more likely to direct the spotlight of attention inward',
          en: 'The writer argues that music helps people "relax and reflect and pause", and Lehrer\'s words back this up.' }
      ] },
    { type: 'matching', title: 'List of Words',
      group: 'Complete the summary (Headphones and city living) using the list of words, A–I, below. Write the correct letter, A–I, in boxes 37–40 on your answer sheet.',
      options: ['A. courtesy', 'B. relationship', 'C. difficulty', 'D. countryside', 'E. suburbs', 'F. language', 'G. barriers', 'H. obstacles', 'I. disapproval'],
      items: [
        { q: 'Dr Michael Bull believes that listening to music through headphones has changed the ____ the wearers of headphones have with public spaces.', a: 'B',
          ev: 'personal music devices change how we relate to public spaces',
          en: 'Bull: "personal music devices change how we relate to public spaces" – how we relate = our relationship.' },
        { q: 'Living in the centre of cities is becoming popular, as people become less keen on living in the ____.', a: 'E',
          ev: 'more people are moving from the edges of cities to live in urban centres',
          en: 'People are "moving from the edges of cities" (the suburbs) "to live in urban centres".' },
        { q: 'In densely populated city centres, headphones form ____ that isolate people from fellow citizens and from their environment.', a: 'G',
          ev: 'Headphones create shields for wearers, separating them from other people and their surroundings',
          en: '"Headphones create shields for wearers, separating them from other people" – shields = barriers.' },
        { q: 'Wearers of headphones are treated with ____ that other people do not receive. This is because if we see someone wearing headphones, we believe they must be occupied in some way and should not be interrupted.', a: 'A',
          ev: 'Headphones have their own rules of good manners',
          en: '"Headphones have their own rules of good manners" and "we should respect their privacy" – good manners = courtesy.' }
      ] }
  ]
};
