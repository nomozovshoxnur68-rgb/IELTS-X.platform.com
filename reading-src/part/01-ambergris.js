/* Ambergris — Reading Passage 1, Questions 1–13 (from 01_Ambergris_P1.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'ambergris',
  title: 'Ambergris – what is it and where does it come from?',
  passageLabel: 'Passage 1',
  cardTypes: ['Matching Features', 'Flow-chart Completion', 'True False Not Given'],
  passage: `
The waxy grey substance that was once worth its weight in gold

In the ancient world, the waxy, grey substance we now refer to as ambergris was highly prized for its medicinal properties and was widely used as a spice, which was believed to be an aphrodisiac when added to food or wine. Ambergris itself is pleasantly aromatic, especially when warmed, and it was also highly valued as a fixing agent in the making of perfume, since it enabled a scent to retain its fragrance for much longer than might otherwise have been possible. Most ambergris was found in the form of lumps floating on the surface of the sea or washed up on the shores of tropical and temperate oceans. At one time, ambergris was worth its weight in gold, but there was much confusion about its origins.

Ambergris was known to the Arabs as 'anbar' and was originally called amber in the West in the Middle Ages. This eventually led to further confusion in the popular mind between ambergris and true amber, the mineral known to mineralogists as succinite, which is actually fossilised tree resin, and generally yellow in colour. Both substances were rare and costly, and both were associated with the sea, largely because for Europeans, the most common source of amber was the shores of the Baltic. In Chapter 92 of Moby Dick, the American writer Herman Melville pours scorn on those who believed the two substances to be the same: 'Though the word ambergris is the French compound for grey amber, yet the two substances are quite distinct. For amber, though at times found on the seacoast, is also dug up in some far inland soils, whereas ambergris is never found except upon the sea. Besides, amber is a hard, transparent, brittle, odorless substance, used for mouth-pieces to pipes, for beads and ornaments; but ambergris is soft, waxy, and so highly fragrant that it is largely used in perfumery.'

Moby Dick was published in 1851, by which time the mystery of the origins of ambergris had been resolved by the scientific community. In 1783, the botanist Joseph Banks, who had accompanied Captain James Cook on his voyages of discovery in the Pacific, presented a paper to the Royal Society of London by the German physician Dr. Franz Xavier Schwediawer in which it was conclusively proved that ambergris came from sperm whales. In this, he was confirming an observation made in the 13th century by the great Venetian traveller Marco Polo, who, while on the island of Socotra in the Indian Ocean, had witnessed a sperm whale vomiting up ambergris. But whereas Marco Polo imagined that the whale had swallowed the lump in the depths of the sea, Schwediawer showed that the origin of the material was inside the whale itself.

The sperm whale is the largest of the odontocetes, or toothed whales. Males can grow up to 20 meters in length. Melville described the sperm whale as 'the king of whales', and his novel Moby Dick is based on the pursuit of one such creature. Sperm whales are renowned for their ability to dive to great depths, possibly as far as 3,000 metres below the surface, and for remaining underwater for periods of two hours or more in pursuit of their favourite prey, the giant squid.

It is from the problems the whales have in digesting the beaks of such creatures that ambergris has its origins. The beak is sharp and irritates the lower intestine, which responds by producing a black, foul-smelling liquid. It is not clear to scientists whether this secretion should be considered a normal response by the whale's digestive system or a pathological one, but from time to time large quantities of the liquid are vomited up by the whale. Once outside the whale's body and exposed to air, the substance hardens, acquiring the waxy, greyish and pleasantly aromatic characteristics of ambergris. Often, the beaks of squid are still found embedded in lumps of ambergris, some of which can weigh several hundred kilograms. Melville took some delight in contrasting the origins of ambergris with the high value placed upon it by refined society: 'Who would think, then, that such fine ladies and gentlemen should regale themselves with an essence found in the inglorious bowels of a sick whale!'

Sperm whales were ruthlessly pursued by commercial whalers in the 19th and 20th centuries. In 1963-64 alone, almost 30,000 individuals were killed, and only the imposition of a ban on the hunting of sperm whales in 1984 saved the species from extinction. Ambergris was by far the most valuable product to be extracted during the processing of the whales' carcasses, and over 90 per cent of the annual worldwide total was acquired in this way, as a by-product of commercial whaling. However, even before the ban on hunting sperm whales was imposed, the 1972 Marine Mammal Protection Act had prohibited trade in ambergris. Just as petroleum and plastic products were replacing other natural products of whaling, so ambergris was supplanted in the making of perfume by other materials, some natural and some synthetic in origin. Nevertheless, it is possible that, as sperm whale populations recover to their former numbers in the wild, so the sight of lumps of ambergris washed ashore along the tide line will once again become a familiar one to beachcombers the world over.
`,
  groups: [
    { type: 'matching', title: 'List of Categories',
      group: 'Classify the following facts as referring to ambergris, amber, both or neither. Write the correct letter, A, B, C or D, in boxes 1–6 on your answer sheet. NB You may use any letter more than once.',
      options: ['A. ambergris only', 'B. amber only', 'C. both ambergris and amber', 'D. neither ambergris nor amber'],
      items: [
        { q: 'very expensive', a: 'C', ev: 'Both substances were rare and costly',
          en: 'Paragraph 2 says "Both substances were rare and costly": both ambergris and amber were very expensive.' },
        { q: 'a food flavouring', a: 'A', ev: 'was widely used as a spice',
          en: 'Only ambergris "was widely used as a spice" and was added "to food or wine".' },
        { q: 'used as currency', a: 'D', ev: 'At one time, ambergris was worth its weight in gold',
          en: 'Neither substance is said to have been used as money. "Worth its weight in gold" describes how valuable ambergris was, not a use as currency.' },
        { q: 'sweet-smelling', a: 'A', ev: ['Ambergris itself is pleasantly aromatic', 'amber is a hard, transparent, brittle, odorless substance'],
          en: 'Ambergris is "pleasantly aromatic" and "highly fragrant", while Melville calls amber "odorless".' },
        { q: 'referred to by Herman Melville', a: 'C', ev: 'Herman Melville pours scorn on those who believed the two substances to be the same',
          en: 'In Moby Dick Melville writes about both: "the two substances are quite distinct".' },
        { q: 'can be seen through', a: 'B', ev: 'amber is a hard, transparent, brittle, odorless substance',
          en: '"Transparent" means it can be seen through, and Melville says this of amber only.' }
      ] },
    { type: 'completion', title: 'How ambergris is formed',
      group: 'Complete the flow-chart below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 7–9 on your answer sheet.',
      items: [
        { q: 'Ambergris is formed in whales because of problems digesting the ____ of giant squid.', a: 'beaks',
          ev: 'the problems the whales have in digesting the beaks of such creatures',
          en: 'Ambergris "has its origins" in "the problems the whales have in digesting the beaks" of the giant squid.' },
        { q: 'Black liquid is produced and is ____ from time to time.', a: 'vomited|vomited up',
          ev: 'from time to time large quantities of the liquid are vomited up by the whale',
          en: '"From time to time large quantities of the liquid are vomited up by the whale."' },
        { q: 'The liquid ____ on contact with the air.', a: 'hardens',
          ev: "Once outside the whale's body and exposed to air, the substance hardens",
          en: '"Exposed to air" = on contact with the air: "the substance hardens".' }
      ] },
    { type: 'tfng',
      group: 'Do the following statements agree with the information given in Reading Passage 1? In boxes 10–13 on your answer sheet, write',
      items: [
        { q: "In the 20th century, most of the world's ambergris came from processing dead whales.", a: 'TRUE',
          ev: 'over 90 per cent of the annual worldwide total was acquired in this way, as a by-product of commercial whaling',
          en: 'Ambergris was extracted "during the processing of the whales\' carcasses", and "over 90 per cent of the annual worldwide total" came this way, i.e. most of it.' },
        { q: 'The value of ambergris has increased recently.', a: 'NOT GIVEN',
          en: 'The passage says ambergris was once "worth its weight in gold", but nothing about its value today or a recent rise.' },
        { q: 'Ambergris remains an important ingredient in perfume.', a: 'FALSE',
          ev: 'ambergris was supplanted in the making of perfume by other materials',
          en: '"Supplanted" means replaced: other materials have taken its place in perfume, so it is no longer an important ingredient.' },
        { q: 'New uses have recently been found for ambergris.', a: 'NOT GIVEN',
          en: 'The last paragraph only says lumps of ambergris may again be seen on beaches. No new uses are mentioned.' }
      ] }
  ]
};
