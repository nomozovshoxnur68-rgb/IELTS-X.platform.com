/* Termite Mounds — Reading Passage 3, Questions 27–40 (from 07_Termite_Mounds_P3.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'termite-mounds',
  title: 'Termite Mounds',
  passageLabel: 'Passage 3',
  cardTypes: ['Matching Headings', 'Table Completion', 'Yes No Not Given'],
  passage: `
Could the vast towers of mud constructed by insects in sub-Saharan Africa hold the key to our energy-efficient building of the future?

A To most of us, termites are destructive insects which can cause damage on a devastating scale. But according to Dr Rupert Soar of Loughborough University’s School of Mechanical and Manufacturing Engineering, these pests may serve a useful purpose for us after all. His multi-disciplinary team of British and American engineers and biologists has set out to investigate the giant mounds built by termites in Namibia, in sub-Saharan Africa, as part of the most extensive study of these structures ever undertaken.

B Termite mounds are impressive for their size alone; typically they are three metres high, and some as tall as eight metres have been found. They also reach far into the earth, where the insects ‘mine’ their building materials, carefully selecting each grain of sand they use. The termites’ nest is contained in the central cavity of the mound, safely protected from the harsh environment outside. The mound itself is formed of an intricate lattice of tunnels, which split into smaller and smaller tunnels, much like a person’s blood vessels.

C This complex system of tunnels draws in air from the outside, capturing wind energy to drive it through the mound. It also serves to expel spent respiratory gases from the nest to prevent the termites from suffocating, so ensuring them a continuous provision of fresh, breathable air. So detailed is the design that the nest stays within three degrees of a constant temperature, despite variations on the outside of up to 50 °C, from blistering heat in the daytime to below freezing on the coldest nights. The mound also automatically regulates moisture in the air, by means of both its underground ‘cellar’ and evaporation from the top of the mound. Some colonies even have ‘chimneys’ rising to a height of 20 metres to control moisture loss in the hottest regions of sub-Saharan Africa.

D Furthermore, the termites have evolved in such a way as to outsource some of their biological functions. Part of their digestive process is carried out by a fungus, which they farm inside the mound. This fungus, which is found nowhere else on earth, thrives in the constant and optimum environment of the mound. The termites feed the fungus with slightly chewed wood pulp, which the fungus then breaks down into a digestible sugary food to provide the insects with energy, and cellulose which they use for building. And, although the termites must generate waste, none ever leaves the structure, indicating that there is also some kind of internal waste-recycling system.

E Scientists are so excited by the mounds that they have labelled them a ‘super organism’ because, in Soar’s words, ‘They dance on the edge of what we would perceive to be alive. If you are too hot you need to cool down, or if you are too cold you need to warm up, so that your body is kept in the state in which it can thrive: that’s called homeostasis. What the termites have done is to move homeostatic function away from their body, into the structure in which they live.’ As more information comes to light about the unique features of termite mounds, we may ultimately need to redefine our understanding of what constitutes a ‘living’ organism.

F To reveal the structure of the mounds, Soar’s team begins by filling and covering them with plaster of Paris, a chalky white paste based on the mineral gypsum, which becomes rock-solid when dry. The researchers then carve the resulting cast into half-millimetre-thick slices, and photograph them sequentially. Once the pictures are digitally scanned, computer technology is able to recreate complex three-dimensional images of the mounds. These models have enabled the team to map termite architecture at a level of detail never before attained.

G Soar hopes that the models will explain how termite mounds create a self-regulating living environment which manages to respond to changing internal and external conditions without drawing on any outside source of power. If they do, the findings could be invaluable in informing future architectural design, and could inspire buildings that are self-sufficient, environmentally friendly and cheap to run. ‘As we approach a world of climate change, we can expect temperatures to rise,’ he explains. ‘There will not be enough fuel to drive air conditioners around the world.’ ‘It is hoped,’ says Soar, ‘that the findings will provide clues that aid the ultimate development of new kinds of human habitats, suitable for a variety of arid, hostile environments not only on the earth but maybe one day on the moon and beyond.’
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 3 has seven paragraphs, A–G. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–ix, in boxes 27–33 on your answer sheet.',
      options: ['i. Methods used to investigate termite mound formation', 'ii. Challenging our assumptions about the nature of life', 'iii. Reconsidering the termite’s reputation',
        'iv. Principal functions of the termite mound', 'v. Distribution of termite mounds in sub-Saharan Africa', 'vi. Some potential benefits of understanding termite architecture',
        'vii. The astonishing physical dimensions of the termite mound', 'viii. Termite mounds under threat from global climate change', 'ix. A mutually beneficial relationship'],
      items: [
        { q: 'Paragraph A', a: 'iii', ev: 'these pests may serve a useful purpose for us after all',
          en: 'Termites are usually seen as "destructive insects", but "these pests may serve a useful purpose for us after all".' },
        { q: 'Paragraph B', a: 'vii', ev: 'Termite mounds are impressive for their size alone',
          en: '"Termite mounds are impressive for their size alone"; some are "as tall as eight metres".' },
        { q: 'Paragraph C', a: 'iv', ev: 'It also serves to expel spent respiratory gases from the nest',
          en: 'Paragraph C lists what the mound does: draws in air, expels "spent respiratory gases", keeps the temperature constant and "regulates moisture".' },
        { q: 'Paragraph D', a: 'ix', ev: 'The termites feed the fungus with slightly chewed wood pulp',
          en: 'Termites farm a fungus: they feed it "wood pulp" and it gives them "a digestible sugary food" – both sides benefit.' },
        { q: 'Paragraph E', a: 'ii', ev: 'we may ultimately need to redefine our understanding of what constitutes a ‘living’ organism',
          en: 'The mounds are a "super organism", and "we may ultimately need to redefine our understanding of what constitutes a \'living\' organism".' },
        { q: 'Paragraph F', a: 'i', ev: 'To reveal the structure of the mounds, Soar’s team begins by filling and covering them with plaster of Paris',
          en: 'Paragraph F describes the method: plaster casts, thin slices, photographs and 3-D computer images.' },
        { q: 'Paragraph G', a: 'vi', ev: 'the findings could be invaluable in informing future architectural design',
          en: '"The findings could be invaluable in informing future architectural design" and inspire cheap, self-sufficient buildings.' }
      ] },
    { type: 'completion', title: 'Inside a termite mound',
      group: 'Complete the table below, which summarises the parts of a termite mound and what they do. Write ONE WORD ONLY from the passage for each answer. Write your answers in boxes 34–37 on your answer sheet.',
      items: [
        { q: 'Part of the mound: network of ____', a: 'tunnels',
          ev: 'The mound itself is formed of an intricate lattice of tunnels',
          en: '"The mound itself is formed of an intricate lattice of tunnels" (lattice = network).' },
        { q: 'What the network does: helps to give the termites a constant ____ supply and to maintain a limited temperature range', a: 'air',
          ev: 'ensuring them a continuous provision of fresh, breathable air',
          en: 'The tunnels ensure "a continuous provision of fresh, breathable air", and the nest "stays within three degrees of a constant temperature".' },
        { q: 'Cellar: aids control of ____ levels', a: 'moisture',
          ev: 'The mound also automatically regulates moisture in the air, by means of both its underground ‘cellar’',
          en: 'The mound "regulates moisture in the air, by means of both its underground \'cellar\' and evaporation from the top".' },
        { q: 'Top of the mound: permits ____', a: 'evaporation',
          ev: 'evaporation from the top of the mound',
          en: 'Moisture is controlled by "evaporation from the top of the mound".' }
      ] },
    { type: 'ynng',
      group: 'Do the following statements agree with the claims of the writer in Reading Passage 3? In boxes 38–40 on your answer sheet, write',
      items: [
        { q: 'The termite mound appears to process its refuse material internally.', a: 'YES',
          ev: 'there is also some kind of internal waste-recycling system',
          en: 'No waste "ever leaves the structure, indicating that there is also some kind of internal waste-recycling system".' },
        { q: 'Dr Soar’s reconstruction involves scanning a single photograph of a complete mound into a computer.', a: 'NO',
          ev: 'carve the resulting cast into half-millimetre-thick slices, and photograph them sequentially',
          en: 'The cast is cut into "half-millimetre-thick slices" which are photographed "sequentially" – many photographs, not one.' },
        { q: 'New information about termite architecture could help people deal with future energy crises.', a: 'YES',
          ev: 'There will not be enough fuel to drive air conditioners around the world',
          en: 'Soar warns "there will not be enough fuel to drive air conditioners", and termite-inspired buildings would be "cheap to run".' }
      ] }
  ]
};
