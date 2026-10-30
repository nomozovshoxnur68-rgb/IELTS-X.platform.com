/* Walking and shoes in eighteenth-century London — Reading Passage 2, Questions 14–26 (from Walking_and_shoes_P2.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'walking-and-shoes',
  title: 'Walking and shoes in eighteenth-century London',
  passageLabel: 'Passage 2',
  cardTypes: ['Matching Information', 'Summary Completion', 'Multiple Choice'],
  passage: `
A look at changing fashions in footwear and leisure

A It was difficult to get about in eighteenth-century London. During the first half of that century, the physical mobility of the upper classes in the city had been considerably restricted: the poor condition of the streets did not allow walking for pleasure outside private parks or pleasure gardens. Streets were dirty, rubbish was everywhere and the British climate made matters worse. Walking could be a risky business. The terrible state of roads, always flooded and muddy, led to the employment of cleaners and street sweepers.

B References to walking are not abundant in early eighteenth-century literature, except for writing about the countryside, where conditions were far better. Walking in London was regarded as inconvenient and even dangerous. For Londoners who wanted to travel, choices were limited to the use of boats and coaches. Walking in urban areas was generally associated with the poor, especially those who could not afford a coach.

C This situation began to change in the mid-eighteenth century, with measures implementing the provision of public paving. The first legislation concerning paving in London was passed in 1762, and during the following decades, similar measures were enacted in many cities. By the end of the century, areas for walking were commonplace, and far more people were enjoying the pastime than before. Sophie von la Roche writes about metropolitan street life in the diary of her visit to London of 1786. She comments on how many more pedestrians there were on the broad, clean pavements, alongside the houses where, she says, “many thousands of neatly clad people, eminent men and dressy women, pursue their way safe from the carriages, horses and dirt”. Although the pavements were not yet a continuous feature of London’s streets, their introduction marked a profound shift in how the city was experienced. Walking was no longer solely a necessity for the poor but had become a respectable activity for the upper classes.

D The transformation of London’s streets had significant implications for footwear. In the early part of the century, shoes were designed primarily for protection rather than comfort or style. They were typically made of stout leather with thick soles, intended to keep the wearer’s feet dry and clean when negotiating muddy, refuse-strewn thoroughfares. Pattens—overshoes with raised iron rings—were commonly worn by women to lift their delicate footwear above the filth. These contraptions were noisy and awkward, clattering against the stones and requiring a mincing gait to avoid tripping. For men, sturdy riding boots were the norm, even when walking, as they provided the best defence against the mire.

E As paving spread and streets became cleaner, shoe design evolved to reflect new possibilities. Lighter materials, including softer leathers and even silk and satin for evening wear, became fashionable. Heels grew more delicate, and soles thinner. This was particularly evident in women’s footwear, where shoes became objects of display rather than mere utility. The French fashion for ornate buckles, often set with paste jewels, was widely adopted by London’s elite. Men’s shoes also became more refined, with the heavy riding boot giving way to the buckled court shoe for those not obliged to travel on horseback. This was not merely a matter of aesthetics; it represented a fundamental change in how Londoners inhabited their city. To walk in comfort and style was to announce one’s participation in the new urban order.

F The rise of promenading as a social ritual further accelerated these trends. By the 1780s, certain London spaces had become established venues for the display of fashionable clothing, including footwear. Parks such as St James’s and Kensington Gardens attracted crowds of strollers during the season, their circuits providing opportunities for social encounter and the mutual inspection of attire. Shoemakers responded to this demand by producing ever more varied and decorative styles. The craft of shoemaking itself was transformed, with specialist lasts—the forms around which shoes were shaped—being developed for left and right feet, a refinement not universally applied in earlier decades. This improved fit and comfort, encouraging yet more walking.

G The new culture of walking also had its critics. Moralists complained that the freedom to stroll encouraged idleness and frivolous display. Young people of both sexes, it was feared, might use the promenade as an opportunity for unsuitable liaisons. The very anonymity of the crowd, so different from the close-knit community of the village, was seen by some as a threat to social order. Yet such complaints were themselves a testament to how thoroughly walking had been transformed. What had once been a dangerous necessity for the poor had become a leisure activity pursued by all ranks of society, accompanied by its own etiquette, its own spaces, and its own distinctive footwear. The pedestrian had become a familiar figure in the London scene, and the shoe had become far more than a mere protection for the foot.
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 2 has seven sections, A–G. Which section contains the following information? Write the correct letter, A–G, in boxes 14–19 on your answer sheet. NB You may use any letter more than once.',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      items: [
        { q: 'A reference to the employment of people to keep streets clean.', a: 'A',
          ev: 'led to the employment of cleaners and street sweepers',
          en: 'Section A: the muddy roads "led to the employment of cleaners and street sweepers".' },
        { q: 'Examples of the specific locations where fashionable people gathered to walk.', a: 'F',
          ev: 'Parks such as St James’s and Kensington Gardens attracted crowds of strollers during the season',
          en: 'Section F names "St James\'s and Kensington Gardens", which "attracted crowds of strollers".' },
        { q: 'An account of the awkward devices women used to protect their shoes from dirt.', a: 'D',
          ev: 'Pattens—overshoes with raised iron rings—were commonly worn by women to lift their delicate footwear above the filth',
          en: 'Section D: women wore "pattens" to lift their shoes "above the filth"; "these contraptions were noisy and awkward".' },
        { q: 'Mention of the first laws introduced to improve the condition of streets.', a: 'C',
          ev: 'The first legislation concerning paving in London was passed in 1762',
          en: 'Section C: "The first legislation concerning paving in London was passed in 1762".' },
        { q: 'Criticism of the new culture of walking from those concerned about morality.', a: 'G',
          ev: 'Moralists complained that the freedom to stroll encouraged idleness and frivolous display',
          en: 'Section G: "Moralists complained that the freedom to stroll encouraged idleness".' },
        { q: 'A comparison between walking in the city and walking in the countryside.', a: 'B',
          ev: 'except for writing about the countryside, where conditions were far better',
          en: 'Section B: in the countryside "conditions were far better", while walking in London "was regarded as inconvenient and even dangerous".' }
      ] },
    { type: 'completion', title: 'Walking and footwear in London',
      group: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 20–23 on your answer sheet.',
      items: [
        { q: 'In the early eighteenth century, walking in London was associated mainly with people who were ____.', a: 'poor',
          ev: 'Walking in urban areas was generally associated with the poor',
          en: '"Walking in urban areas was generally associated with the poor."' },
        { q: 'Sophie von la Roche observed that pedestrians could walk safely because pavements kept them away from carriages, horses, and ____.', a: 'dirt',
          ev: 'safe from the carriages, horses and dirt',
          en: 'She wrote that people "pursue their way safe from the carriages, horses and dirt".' },
        { q: 'In the early part of the century, shoes were made from thick ____ to protect the feet.', a: 'leather',
          ev: 'They were typically made of stout leather with thick soles',
          en: 'Shoes "were typically made of stout leather with thick soles" (stout = thick).' },
        { q: 'The development of specialist lasts for left and right feet improved the ____ of shoes.', a: 'fit',
          ev: 'This improved fit and comfort, encouraging yet more walking',
          en: 'Lasts for left and right feet: "This improved fit and comfort".' }
      ] },
    { type: 'mcq',
      group: 'Choose the correct letter, A, B, C or D. Write your answers in boxes 24–26 on your answer sheet.',
      items: [
        { q: 'What was the main reason for the change in shoe design in the late eighteenth century?', a: 'B',
          opts: ['A. French fashion became more influential in London.', 'B. The improved condition of streets allowed for lighter footwear.', 'C. Shoemakers developed new techniques for mass production.', 'D. The upper classes wanted shoes that were suitable for horse riding.'],
          ev: 'As paving spread and streets became cleaner, shoe design evolved to reflect new possibilities',
          en: '"As paving spread and streets became cleaner, shoe design evolved", and "lighter materials ... became fashionable".' },
        { q: 'According to the passage, the introduction of paving in London', a: 'C',
          opts: ['A. was completed throughout the city by 1762.', 'B. was opposed by the poor who could not afford new shoes.', 'C. made walking a respectable activity for all social classes.', 'D. led to an immediate decrease in the use of coaches.'],
          ev: 'Walking was no longer solely a necessity for the poor but had become a respectable activity for the upper classes',
          en: 'Walking "had become a respectable activity for the upper classes", not only "a necessity for the poor". A is wrong: pavements "were not yet a continuous feature".' },
        { q: 'What is the main purpose of section G?', a: 'C',
          opts: ['A. to describe the etiquette of promenading in London parks', 'B. to explain how shoemakers responded to new fashions', 'C. to show that not everyone approved of the changes in walking culture', 'D. to compare village communities with city life in the eighteenth century'],
          ev: 'The new culture of walking also had its critics',
          en: 'Section G opens with "The new culture of walking also had its critics" and gives the moralists\' complaints.' }
      ] }
  ]
};
