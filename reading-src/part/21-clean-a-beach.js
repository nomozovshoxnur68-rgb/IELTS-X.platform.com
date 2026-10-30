/* How to Clean a Beach — Reading Passage 3, Questions 27–40 (from How to Clean a Beach - Passage 3.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'clean-a-beach',
  title: 'How to Clean a Beach',
  passageLabel: 'Passage 3',
  cardTypes: ['Yes No Not Given', 'Summary Completion', 'Multiple Choice'],
  passage: `
Oil spills such as the disaster in the Gulf of Mexico serve to remind us of the potential dangers of various commercial activities for our fragile oceanic environments

After the oil tanker Prestige spilt her cargo just off north-west Spain in November 2002, the beautiful beaches of the Galician coastline were covered by a metre-deep mixture of oil and seawater. The Prestige was only one incident in a long series of accidents involving oil tankers. But while each new incident, including that of the Prestige, brings environmental destruction and financial loss, it also improves our understanding of how to deal with oil spills. This knowledge is hard-won, as people have often learned from mistakes made in dealing with oil spills. Aggressive clean-ups have sometimes caused more damage than the oil. But such difficulties apart, a rough consensus on how to deal with the issues involved in clearing up oil spills has begun to emerge.

Oil is much less damaging at sea than on shore, so the best option is to skim the spilled oil off the surface of the water using specially equipped ships. A series of wooden booms floating on the surface of the water can also be used to protect the coastline. But the sea around the Prestige was too rough for the former, and much of the coast too exposed for booms to work, so there was little that could be done except watch the oil wash up onto the beaches.

When oil arrives onshore, the question becomes how best to save affected plants and animals, while minimising damage to the surrounding ecosystem, without running up a huge bill. In large spills, leaving nature to do the job is a bad idea. Even the oiliest shore will return to normal, but without human intervention this can take many years. In the case of the Prestige, both the volume of oil spilt and the wildlife, fishing and tourist value of the Galician coast demanded action by specialists.

To decide what to do, specialists combined their own professional experience with local knowledge in an assessment process known as ‘net environmental benefit analysis’. Factors taken into account include possible environmental destruction, such as damage to an oiled beach which is home to a breeding colony of seals or seabirds. Less immediate socio-economic repercussions also come into play: local people may rely on shellfish beds, for example, or an affected beach could be a tourist destination. And such practical realities as the cost incurred by a particular clean-up option and how easy it will be to implement are also assessed.

Every intensive clean-up option has its drawbacks. When oil from the Exxon Valdez polluted the Alaskan shoreline in 1989, hot water applied under high pressure was used to scrub the beaches. But the parts of the shoreline that got this treatment recovered more slowly than those that did not. In Spain, this technique has so far been used only on man-made structures such as harbour walls.

Other methods have been even more aggressive than this. When the Torrey Canyon ran aground off the south coast of England in March 1967, oiled beaches were treated with 10,000 tonnes of chemical sprays. These turned out to be more toxic than the oil: many seashore invertebrates died, and the nutrients in the dispersants caused an explosion of seaweed growth.

In Galicia, local people wanted heavy machinery to come in and remove large quantities of oil quickly. But this has its own environmental cost. There were no tracks to the worst-affected beaches and it was feared that building them would harm the surrounding landscape. But in one of the areas affected, oil on the surface of the beaches was likely to be washed into the pipe that supplied water to a large fish farm. In the end, the desire to safeguard the farm tipped the balance in favour of building tracks for bulldozers and earthmovers, which scooped up the oil from the beach. Such equipment was not used in all areas affected by the Prestige spill, however. Salt-marshes and estuaries are such delicate terrain that almost any activity does more damage than the oil.

After the Amoco Cadiz disaster in 1978, when nearly a quarter of a million tonnes of oil were spilt off the coast of north-western France, heavy equipment was sent in to some polluted salt-marshes, where it scraped up the top half-metre of sediment. Twelve years later, these areas had still not recovered, whereas the oiled marshes that went uncleaned seemed in good shape.

After a short period of time, the Prestige spill moved from the emergency phase – high profile, high pressure – to a long-term painstaking project. Cleaning the beaches, for example, was a huge task. At Carnota, one of the most heavily affected areas of Galicia, dozens of volunteers and soldiers worked their way along six kilometres of sand on hands and knees, scraping up the small lumps of solidified oil. At other beaches nearby, people sifted the sand and combed seaside plants by hand to remove the oil and stop it becoming buried.

Once workers there had done all they could, stubborn patches still remained on rocks and in crevices. A possibility was to move oily rocks down the beach into the surf since this accelerates the natural cleaning process, as can ‘flushing’ – i.e. pumping seawater over the shore and sifting the oil out of the run-off. But as the coastline became cleaner, the clean-up started to cost more for progressively less reward and more environmental damage. The Galicians were then faced with perhaps their most difficult decision: when to stop. As with most such operations, this decision is usually taken by local politicians rather than by environmentalists.
`,
  groups: [
    { type: 'ynng',
      group: 'Do the following statements agree with the claims of the writer in Reading Passage 3? In boxes 27–31 on your answer sheet, write',
      items: [
        { q: 'Each new oil spill improves our understanding of how to deal with such incidents.', a: 'YES',
          ev: 'it also improves our understanding of how to deal with oil spills',
          en: 'Each new incident "also improves our understanding of how to deal with oil spills".' },
        { q: 'Aggressive clean-ups have sometimes caused more damage than the oil itself.', a: 'YES',
          ev: 'Aggressive clean-ups have sometimes caused more damage than the oil',
          en: '"Aggressive clean-ups have sometimes caused more damage than the oil."' },
        { q: 'The Prestige disaster caused more damage than any previous oil spill in the region.', a: 'NOT GIVEN',
          en: 'The Prestige was "only one incident in a long series of accidents"; it is never compared with earlier spills in the region.' },
        { q: 'It is best to let nature clean up large oil spills without any human intervention.', a: 'NO',
          ev: 'In large spills, leaving nature to do the job is a bad idea',
          en: '"In large spills, leaving nature to do the job is a bad idea."' },
        { q: 'Most oil spills are caused by poor maintenance of tankers.', a: 'NOT GIVEN',
          en: 'The causes of oil spills are not discussed.' }
      ] },
    { type: 'completion', title: 'Deciding how to respond to an oil spill',
      group: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 32–36 on your answer sheet.',
      items: [
        { q: 'When specialists have to decide how to react to an oil spill, they use a process called ‘net environmental benefit analysis’. In this process, they combine their professional experience with ____.', a: 'local knowledge|knowledge',
          ev: 'specialists combined their own professional experience with local knowledge',
          en: '"Specialists combined their own professional experience with local knowledge."' },
        { q: 'They consider the possible environmental destruction, as well as less immediate ____ effects on the local community.', a: 'socio-economic|socioeconomic',
          ev: 'Less immediate socio-economic repercussions also come into play',
          en: '"Less immediate socio-economic repercussions also come into play": shellfish beds, tourism.' },
        { q: 'Practical issues, including the ____ of each option, are assessed too.', a: 'cost',
          ev: 'such practical realities as the cost incurred by a particular clean-up option',
          en: '"Such practical realities as the cost incurred by a particular clean-up option ... are also assessed."' },
        { q: 'Every intensive clean-up method has disadvantages. Following the Exxon Valdez spill, ____ under high pressure was used on the beaches, but this slowed their recovery.', a: 'hot water',
          ev: 'hot water applied under high pressure was used to scrub the beaches',
          en: '"Hot water applied under high pressure was used to scrub the beaches", and those parts "recovered more slowly".' },
        { q: 'After the Torrey Canyon ran aground, the beaches were treated with ____, which proved to be more toxic than the oil itself.', a: 'chemical sprays|chemical spray',
          ev: 'oiled beaches were treated with 10,000 tonnes of chemical sprays',
          en: 'Beaches "were treated with 10,000 tonnes of chemical sprays. These turned out to be more toxic than the oil".' }
      ] },
    { type: 'mcq',
      group: 'Choose the correct letter, A, B, C or D. Write your answers in boxes 37–40 on your answer sheet.',
      items: [
        { q: 'Why did the authorities decide to build tracks for heavy machinery in one part of Galicia?', a: 'B',
          opts: ['A. Local residents demanded that the oil be removed quickly.', 'B. They wanted to protect the water supply to a fish farm.', 'C. The beaches there were too exposed for other methods.', 'D. It was the cheapest available way to remove the oil.'],
          ev: 'the desire to safeguard the farm tipped the balance in favour of building tracks for bulldozers and earthmovers',
          en: 'Oil might wash into "the pipe that supplied water to a large fish farm", and "the desire to safeguard the farm tipped the balance".' },
        { q: 'What did the Amoco Cadiz disaster demonstrate about salt-marshes?', a: 'A',
          opts: ['A. Leaving them untouched can be better than cleaning them.', 'B. They recover from oil pollution within a few years.', 'C. Heavy machinery is the most effective way to clean them.', 'D. They are less sensitive to oil than other environments.'],
          ev: 'whereas the oiled marshes that went uncleaned seemed in good shape',
          en: 'Scraped marshes "had still not recovered" after twelve years, "whereas the oiled marshes that went uncleaned seemed in good shape".' },
        { q: 'How was the oil mainly removed from the beaches at Carnota?', a: 'B',
          opts: ['A. by pumping seawater over the shore', 'B. by hand', 'C. using bulldozers and earthmovers', 'D. by moving oily rocks into the surf'],
          ev: 'worked their way along six kilometres of sand on hands and knees, scraping up the small lumps of solidified oil',
          en: 'Volunteers and soldiers worked "on hands and knees, scraping up the small lumps of solidified oil".' },
        { q: 'According to the writer, who usually decides when to stop a clean-up operation?', a: 'B',
          opts: ['A. environmental specialists', 'B. local politicians', 'C. the owners of the tankers', 'D. the central government'],
          ev: 'this decision is usually taken by local politicians rather than by environmentalists',
          en: '"This decision is usually taken by local politicians rather than by environmentalists."' }
      ] }
  ]
};
