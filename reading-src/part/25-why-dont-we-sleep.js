/* Why don't we sleep? — Reading Passage 2, Questions 14–26 (from Why dont we sleep - Passage 2.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'why-dont-we-sleep',
  title: 'Why don’t we sleep?',
  passageLabel: 'Passage 2',
  cardTypes: ['Summary Completion', 'Matching Information', 'Matching Features'],
  passage: `
Insomnia costs billions, yet science still cannot say for certain what sleep is for

A Fifty-six million prescriptions for sleeping medication were handed out by doctors in America last year. Yet remarkably little is being done to understand insomnia’s root causes. Socially and economically, the undertreatment of sleeplessness is hugely expensive. The Institute of Medicine, an independent scientific advisory group, estimates nearly 20 per cent of all major accidents on the road are associated with driver sleepiness. The loss in terms of productivity within the workplace is even higher, costing billions. Then there are the softer costs which remain unmeasured but still exist; for example, the damaged relationships with others. If other medical problems were causing such widespread harm, governments would act, but US authorities contribute only about $230 million a year for the funding of sleep research, comparable to the amount that the manufacturers of popular sleeping pills spent in three months on advertising. Currently most medical school students get no more than four hours of training on sleep disorders; some get none.

B If we don’t know why we can’t sleep, it’s in part because we don’t really know why we need to sleep in the first place. We know that we divide it between periods of deep-wave sleep and rapid eye movement (REM) sleep, when the brain is as active as when we’re awake, but our voluntary muscles are paralysed. We know that all mammals sleep, and that there are some insects and reptiles that only half sleep, in order to remain aware of their environment and predators.

C The predominant theory of sleep is that the brain demands it. Recently, researchers at Harvard, led by Robert Stickgold, tested undergraduates on various aptitude tests, allowed them to nap, then tested them again. They found that those who had engaged in REM sleep subsequently performed better in pattern recognition tasks, such as grammar, while those who slept deeply were better at memorisation.

D Such studies suggest that memory consolidation may be one function of sleep. Giulio Tononi, a sleep researcher at the University of Wisconsin, published an interesting twist on this theory a few years ago. His study showed that the sleeping brain seems to delete redundant or unnecessary synapses or connections. So the purpose of sleep may be to help us remember what’s important, by letting us forget what’s not.

E Sleep is likely to have physiological purposes too. Some researchers have found that sleep deprivation impedes wound healing in rats, and others have suggested that sleep helps boost the immune system and control infection. But these studies are not conclusive. At Stanford University, William Dement, co-founder of the Stanford Sleep Medicine Center, explains what he knows after 50 years of research, about the reason we sleep. ‘As far as I know,’ he said, ‘the only reason we need to sleep that is really, really solid is because we get sleepy.’

F The Stanford clinic does more than 3,000 overnight sleep studies a year. Their main diagnostic tool is the polysomnogram, the main element of which is the electroencephalograph (EEG), which captures the electrical output from a patient’s brain. As the EEG records a person’s sleep patterns, the polysomnogram technicians also measure body temperature, muscle activity, eye movement and breathing. Then they look over the data for signs of abnormal sleep. When a person has narcolepsy, for instance, they plunge from wakefulness into REM sleep without any intermediate steps. However, Clete Kushida, the clinic director, told me he can spot most people’s sleep problems right at the intake interview. ‘There are those who cannot keep their eyes open, and those who just speak of their exhaustion but don’t actually fall asleep. The former often have sleep apnea where they stop breathing. The latter have true insomnia.’

G In sleep apnea, muscle relaxation allows the soft tissue of the throat to close, shutting off the sleeper’s air passage. When the brain realises it is not getting oxygen, it sends a signal to the body to wake up. The sleeper awakes, inhales, and sleep returns. Apnea is a serious problem but only indirectly a sleep disease. True insomniacs are people who either can’t get to, or can’t stay asleep for any evident reason.

H While apnea can be treated with a device that forces air down the sleeper’s throat to keep the airways open, the treatment of classic insomnia is not so clear cut. Acupuncture may help. It has long had this role in Asian medicine and is being studied at the University of Pittsburgh sleep center now. Typically in the US, insomnia is treated in two ways. First come the sleeping pills. Though safer than they once were, they can still lead to psychological addiction. ‘Many users complain that their sleeping-pill sleep seems different, and they feel unfocussed on waking. Sleeping pills are not a natural way to sleep,’ points out Charles Czeisler, director of the Harvard Health and Safety Group.

I The second step in treating insomniacs is usually cognitive behavioural therapy (CBT). In CBT, a psychologist teaches insomniacs to think about sleep problems as manageable, and to practise good ‘sleep hygiene’: sleep in a dark room, go to bed only when you are sleepy, don’t exercise beforehand. Studies have shown that CBT is more effective than sleeping pills at treating long-term insomnia, but many sufferers aren’t convinced. ‘Some people continue in my experience to struggle,’ says John Winkelman, another sleep center director. ‘They’re not super-satisfied with their sleep.’
`,
  groups: [
    { type: 'completion', title: 'Insomnia in the USA',
      group: 'Complete the summary below. Write ONE WORD ONLY from the passage for each answer. Write your answers in boxes 14–17 on your answer sheet.',
      items: [
        { q: 'Last year the high number of ____ highlighted the fact that insomnia is a serious issue in the USA.', a: 'prescriptions',
          ev: 'Fifty-six million prescriptions for sleeping medication were handed out by doctors in America last year',
          en: '"Fifty-six million prescriptions for sleeping medication were handed out ... last year."' },
        { q: 'It is evidently responsible for a number of serious traffic ____', a: 'accidents|accident',
          ev: 'nearly 20 per cent of all major accidents on the road are associated with driver sleepiness',
          en: '"Nearly 20 per cent of all major accidents on the road are associated with driver sleepiness."' },
        { q: 'and has a considerable effect on company ____, although there are no statistics on this. A lack of sleep can also have a harmful effect on different aspects of health.', a: 'productivity',
          ev: 'The loss in terms of productivity within the workplace is even higher',
          en: '"The loss in terms of productivity within the workplace is even higher."' },
        { q: 'Unfortunately, there is insufficient official funding given to research into sleep problems, and the ____ given at medical school is also insufficient to deal with insomnia.', a: 'training',
          ev: 'Currently most medical school students get no more than four hours of training on sleep disorders',
          en: 'Medical students "get no more than four hours of training on sleep disorders; some get none".' }
      ] },
    { type: 'matching',
      group: 'Reading Passage 2 has nine paragraphs, A–I. Which paragraph contains the following information? Write the correct letter, A–I, in boxes 18–23 on your answer sheet.',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      items: [
        { q: 'a mention of different cultural approaches to dealing with insomnia', a: 'H',
          ev: 'It has long had this role in Asian medicine',
          en: 'Paragraph H: acupuncture "has long had this role in Asian medicine", while in the US pills and CBT are used.' },
        { q: 'indications that sleep has a positive effect on health', a: 'E',
          ev: 'sleep helps boost the immune system and control infection',
          en: 'Paragraph E: lack of sleep slows wound healing and "sleep helps boost the immune system".' },
        { q: 'the effects of different kinds of sleep on mental performance', a: 'C',
          ev: 'those who had engaged in REM sleep subsequently performed better in pattern recognition tasks',
          en: 'Paragraph C: REM sleepers did better at pattern recognition, deep sleepers "were better at memorisation".' },
        { q: 'reasons why various species of animal sleep in different ways', a: 'B',
          ev: 'there are some insects and reptiles that only half sleep, in order to remain aware of their environment and predators',
          en: 'Paragraph B: some insects and reptiles "only half sleep, in order to remain aware of their environment and predators".' },
        { q: 'the suggestion that sleep allows us to get rid of insignificant information', a: 'D',
          ev: 'the sleeping brain seems to delete redundant or unnecessary synapses or connections',
          en: 'Paragraph D: sleep helps us "remember what\'s important, by letting us forget what\'s not".' },
        { q: 'a description of how the brain responds when a person stops breathing', a: 'G',
          ev: 'When the brain realises it is not getting oxygen, it sends a signal to the body to wake up',
          en: 'Paragraph G: "When the brain realises it is not getting oxygen, it sends a signal to the body to wake up."' }
      ] },
    { type: 'matching', title: 'List of People',
      group: 'Look at the following statements (Questions 24–26) and the list of people below. Match each statement with the correct person, A–E. Write the correct letter, A–E, in boxes 24–26 on your answer sheet.',
      options: ['A. Giulio Tononi', 'B. William Dement', 'C. Clete Kushida', 'D. Charles Czeisler', 'E. John Winkelman'],
      items: [
        { q: 'Research tells us that we sleep as a reaction to our body’s signals.', a: 'B',
          ev: 'the only reason we need to sleep that is really, really solid is because we get sleepy',
          en: 'Dement, after 50 years of research: "the only reason we need to sleep that is really, really solid is because we get sleepy".' },
        { q: 'People suffering from insomnia are easily recognisable.', a: 'C',
          ev: 'he can spot most people’s sleep problems right at the intake interview',
          en: 'Kushida "can spot most people\'s sleep problems right at the intake interview".' },
        { q: 'Therapy does not always enable people to achieve good quality sleep.', a: 'E',
          ev: 'Some people continue in my experience to struggle',
          en: 'Winkelman, about CBT: "Some people continue in my experience to struggle ... They\'re not super-satisfied with their sleep."' }
      ] }
  ]
};
