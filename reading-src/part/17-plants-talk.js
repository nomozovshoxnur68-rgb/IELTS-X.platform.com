/* How do plants talk to each other? — Reading Passage 2, Questions 14–26 (from How do plants talk to each other.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'plants-talk',
  title: 'How do plants talk to each other?',
  passageLabel: 'Passage 2',
  cardTypes: ['Matching Headings', 'Summary Completion', 'Matching Features'],
  passage: `
Research shows that plants communicate and interact with each other in surprisingly subtle and sophisticated ways

A In 1983, plant scientists Jack Schultz and Ian Baldwin reported that the leaves of young maple trees increased their defense systems when exposed to maples that had been damaged by plant-eating (herbivorous) insects. The injured trees, they suggested, were alerting neighbors to the presence of a predator by releasing chemical signals into the air. But the plant research community did not accept this. The results were difficult to replicate, critics pointed out. Many also questioned how it could be evolutionarily stable if it benefited neighboring plants but not the plant releasing the signal. By the late 1980s, most ecologists felt that Schultz and Baldwin’s idea had been discredited.

B A decade later, however, a number of more carefully designed experiments began to yield convincing indications to the contrary. In 2000, evolutionary ecologist Richard Karban showed that wild tobacco plants became resistant to herbivores when grown in close proximity to sagebrush plants whose leaves had been damaged by cutting. This change appeared to be in response to chemicals – known as volatile organic compounds or VOCs – released by the sagebrush plants. Other researchers soon reported similar VOC-induced defense responses in several other plants, including lima bean, broad bean, barley, and corn. And in 2006, Karban showed that VOCs released by damaged sagebrush induce herbivore resistance in plants growing at distances of up to 60 cm, well within the range of sagebrush neighbors in nature.

C But the question still remains: ‘Why should a plant waste valuable resources on a function which has no obvious advantage for it?’ One hypothesis is that external communication channels are merely an extension of within-plant signaling. In sagebrush, lima bean, and poplar, VOCs released from damaged parts of a plant induce resistance in intact sections of the same plant, suggesting that each individual plant uses the signals to coordinate its own physiological responses to protect itself. Karban agrees, saying: ‘The interplant signaling we see may be a result of plants co-opting that process.’ Alternatively, VOC-based signaling between plants may have been favored because it enhances the ‘extended fitness’ of the sender by aiding related plants of the same species: a strategy known as kin selection.

D Over the past few years, a team led by Ariel Novoplansky of Ben-Gurion University of the Negev in Israel seems to have found proof that distress signals can be passed through the plants’ roots. They planted garden pea plants in rows and subjected the first in each row to conditions similar to those experienced in a drought. They then evaluated the response by measuring the microscopic holes on leaves, known as pores, which react when there is a shortage of water. After fifteen minutes, the stressed plant was seen to be closing its pores, followed by all of its neighbors, one by one. Importantly, in a control setup where root contact between neighboring plants was blocked, pores stayed open. Meanwhile, David Johnson’s team at the University of Aberdeen in Scotland have been studying the labyrinths of hair-like fungi that occur around the roots of most plants. These fungi are involved in an important two-way relationship: in exchange for sugars, they provide plants with much-needed phosphorus and nitrogen. Research in which broad bean plants were infested with aphids – small herbivorous insects – revealed that these networks also served as a channel for warning neighboring plants of the infestation.

E Monica Gagliano of the University of Western Australia believes that plants may even use sounds to alert their neighbors. In one study, she demonstrated that chili plants growing next to fennel plants developed more quickly than seedlings grown with other chili plants. Gagliano and her colleagues suspect the chili plants were compensating for the presence of the fennel, which is known to release chemicals that inhibit the growth of other plants. Remarkably, however, when plant communication pathways – airborne volatiles, root contact, and common fungal networks – were blocked, the results begged for an alternative explanation. ‘We think this other channel of communication might be acoustic,’ says Gagliano. But behavioral ecologist Carel ten Cate of the University of Leiden in the Netherlands points out that taking advantage of such benefits would require sensory mechanisms yet to be described in plants. Despite widespread skepticism, Gagliano has received some encouragement. Richard Karban, for example, is cautiously enthusiastic. ‘Whether or not the explanation she favors is the right one,’ he says, ‘I think that she’s gotten results that, as a field, we need to come to grips with.’

F Researchers believe that knowledge of this phenomenon could eventually be applied to agriculture, and lead to the cultivation of hardier crops. But all agree that there is still much work to be done: applying our limited knowledge of plant-communication mechanisms to agriculture is a big jump, says Johnson, ‘but it is definitely on the horizon.’ Nevertheless, one message has emerged loud and clear from those studying this new realm of botanical interaction: despite not possessing eyes, ears, or a nervous system, plants are anything but uncommunicative. ‘When I started my PhD (in the late 1980s), all this stuff was considered very weird,’ recalls Ariel Novoplansky. ‘Today, there is no doubt. We now recognise that plants are capable of some very sophisticated exchanges of information with other plants. This idea is not strange anymore.’
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 2 has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–viii, in boxes 14–19 on your answer sheet.',
      options: ['i. Sending messages underground', 'ii. Potential advantages for farmers', 'iii. The widespread rejection of an idea', 'iv. One species accelerating growth in another',
        'v. Some obstacles to plant communication', 'vi. Evidence leading to renewed belief in a theory', 'vii. New technologies which helped researchers', 'viii. A suggested benefit to the sender of plant communication'],
      items: [
        { q: 'Paragraph A', a: 'iii', ev: 'But the plant research community did not accept this',
          en: '"The plant research community did not accept this", and by the late 1980s the idea "had been discredited".' },
        { q: 'Paragraph B', a: 'vi', ev: 'a number of more carefully designed experiments began to yield convincing indications to the contrary',
          en: 'A decade later, "more carefully designed experiments began to yield convincing indications to the contrary".' },
        { q: 'Paragraph C', a: 'viii', ev: 'it enhances the ‘extended fitness’ of the sender by aiding related plants of the same species',
          en: 'Paragraph C asks why a plant would signal and suggests it "enhances the \'extended fitness\' of the sender".' },
        { q: 'Paragraph D', a: 'i', ev: 'distress signals can be passed through the plants’ roots',
          en: 'Paragraph D: signals pass "through the plants\' roots" and through fungal networks in the soil.' },
        { q: 'Paragraph E', a: 'iv', ev: 'chili plants growing next to fennel plants developed more quickly than seedlings grown with other chili plants',
          en: 'Chili plants next to fennel "developed more quickly" – one species speeding up growth in another.' },
        { q: 'Paragraph F', a: 'ii', ev: 'could eventually be applied to agriculture, and lead to the cultivation of hardier crops',
          en: 'The knowledge "could eventually be applied to agriculture, and lead to the cultivation of hardier crops".' }
      ] },
    { type: 'completion', title: 'Plant communication research in Israel and Scotland',
      group: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 20–23 on your answer sheet.',
      items: [
        { q: 'Plants may send messages via their ____ according to Ariel Novoplansky of Ben-Gurion University in Israel.', a: 'roots',
          ev: 'distress signals can be passed through the plants’ roots',
          en: 'Novoplansky\'s team found "that distress signals can be passed through the plants\' roots".' },
        { q: 'In one study, Novoplansky’s team planted rows of garden peas, and created conditions like a ____ around the first plant in each row. The plants responded by closing the tiny holes on their leaf surfaces, known as pores.', a: 'drought',
          ev: 'subjected the first in each row to conditions similar to those experienced in a drought',
          en: 'The first plant in each row had "conditions similar to those experienced in a drought".' },
        { q: 'Research at the University of Aberdeen in Scotland, meanwhile, has focused on the networks of ____ which connect the plants beneath the soil.', a: 'fungi',
          ev: 'the labyrinths of hair-like fungi that occur around the roots of most plants',
          en: 'Johnson\'s team studies "the labyrinths of hair-like fungi that occur around the roots of most plants".' },
        { q: 'These structures, which extract sugars from the plants and supply them with phosphorus and nitrogen, also seem to play a key role in plant communication. Experiments involving broad bean plants and plant-eating insects called ____ have also produced some interesting results.', a: 'aphids',
          ev: 'broad bean plants were infested with aphids',
          en: '"Broad bean plants were infested with aphids – small herbivorous insects."' }
      ] },
    { type: 'matching', title: 'List of Researchers',
      group: 'Look at the following statements (Questions 24–26) and the list of researchers below. Match each statement with the correct researcher, A–E. Write the correct letter, A–E, in boxes 24–26 on your answer sheet.',
      options: ['A. Richard Karban', 'B. Ariel Novoplansky', 'C. David Johnson', 'D. Monica Gagliano', 'E. Carel ten Cate'],
      items: [
        { q: 'It is likely that research into plant communication will one day help to improve our food supply.', a: 'C',
          ev: 'but it is definitely on the horizon',
          en: 'Johnson: applying it to agriculture "is a big jump ... but it is definitely on the horizon".' },
        { q: 'Plant communication could occur as a consequence of internal mechanisms intended to help a single plant.', a: 'A',
          ev: 'The interplant signaling we see may be a result of plants co-opting that process',
          en: 'Karban agrees that signalling between plants "may be a result of plants co-opting" their own within-plant signalling.' },
        { q: 'Attitudes towards plant communication have changed greatly in recent decades.', a: 'B',
          ev: 'all this stuff was considered very weird',
          en: 'Novoplansky: in the late 1980s "all this stuff was considered very weird" – "Today, there is no doubt".' }
      ] }
  ]
};
