/* The Pearl — Reading Passage 1, Questions 1–13 (from The_Pearl_P1.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'the-pearl',
  title: 'The Pearl',
  passageLabel: 'Passage 1',
  cardTypes: ['Matching Information', 'Summary Completion', 'True False Not Given'],
  passage: `
Natural, cultured and imitation pearls – and how to tell them apart

A The pearl has always had a special status among the rich and powerful all through history. For instance, women from ancient Rome went to bed with pearls on them, so that they could remind themselves how wealthy they were after waking up. Pearls used to have more commercial value than diamonds until jewellers learnt to cut gems. In the eastern countries like Persia, ground pearl powders could be used as a medicine to cure anything including heart diseases and epilepsy.

B Pearls can generally be divided into three categories: natural, cultured and imitation. When an irritant (such as a grain of sand) gets inside a certain type of oyster, mussel, or clam, the mollusc will secrete a fluid as a means of defence to coat the irritant. Gradually, layers are accumulated around the irritant until a lustrous natural pearl is formed.

C A cultured pearl undergoes the same process. There is only one difference between cultured pearls and natural ones: in cultured pearls, the irritant is a bead called ‘mother of pearl’ and is placed in the oyster through surgical implantation. This results in much larger cores in cultivated pearls than those in natural pearls. As long as there are enough layers of nacre (the secreted fluid covering the irritant) to create a gorgeous, gem-quality pearl, the size of the nucleus wouldn’t make a difference to beauty or durability.

D Pearls can come from both salt and freshwater sources. Typically, pearls from salt water usually have high quality, although several freshwater pearls are considered high in quality, too. In addition, freshwater pearls often have irregular shapes, with a puffed rice appearance. Nevertheless, it is the individual merits that determine the pearl’s value more than the sources of pearls. Saltwater pearl oysters are usually cultivated in protected lagoons or volcanic atolls, while most freshwater cultured pearls sold today come from China. There are a number of options for producing cultured pearls: use fresh water or sea water shells, transplant the graft into the mantle or into the gonad, add a spherical bead or do it non-beaded.

E No matter which method is used to get pearls, the process usually takes several years. Mussels must reach a mature age, which may take up almost three years, and then be transplanted an irritant. When the irritant is put in place, it takes approximately another three years for a pearl to reach its full size. Sometimes, the irritant may be rejected. As a result, the pearl may be seriously deformed, or the oyster may directly die from such numerous complications as diseases. At the end of a 5- to 10-year circle, only half of the oysters may have made it through. Among the pearls that are actually produced in the end, only about 5% of them will be high-quality enough for the jewellery makers.

F Imitation pearls are another different story. The Island of Mallorca in Spain is renowned for its imitation pearl industry. In most cases, a bead is dipped into a solution made from fish scales. But this coating is quite thin and often wears off. One way to distinguish the imitation pearls is to have a bite on it. Fake pearls glide through your teeth, while the layers of nacre on the real pearls feel gritty.

G Several factors are taken into account to evaluate a pearl: size, shape, colour, the quality of surface and lustre. Generally, the three types of pearls come in such order (with the value decreasing): natural pearls, cultured pearls and imitation pearls (which basically are worthless). For jewellers, one way to tell whether a pearl is natural or cultured is to send it to a gem lab and perform an X-ray on it. High-quality natural pearls are extremely rare. Japan’s Akoya pearls are one of the glossiest pearls out there, while the south sea water of Australia is a cradle to bigger pearls.

H Historically, the pearls with the highest quality around the globe are found in the Persian Gulf, particularly around Bahrain. These pearls have to be hand-harvested by divers with no advanced equipment. Unfortunately, when the large reserve of oil was discovered in the early 1930s, the Persian Gulf’s natural pearl industry came to a sudden end because the contaminated water destroyed the once pristine pearls. In the present days, India probably has the largest stock of natural pearls. However, it is quite an irony that a large part of India’s stock of natural pearls is originally from Bahrain.
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 1 has eight paragraphs, A–H. Which paragraph contains the following information? Write the correct letter, A–H, in boxes 1–4 on your answer sheet.',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      items: [
        { q: 'ancient stories around pearls and their customers', a: 'A',
          ev: 'women from ancient Rome went to bed with pearls on them',
          en: 'Paragraph A: "women from ancient Rome went to bed with pearls on them" to remember how wealthy they were.' },
        { q: 'difficulties in the cultivating process', a: 'E',
          ev: 'Sometimes, the irritant may be rejected',
          en: 'Paragraph E: the irritant "may be rejected", pearls may be "deformed", oysters may die, and "only half of the oysters may have made it through".' },
        { q: 'factors which decide the value of natural pearls', a: 'G',
          ev: 'Several factors are taken into account to evaluate a pearl: size, shape, colour, the quality of surface and lustre',
          en: 'Paragraph G: "Several factors are taken into account to evaluate a pearl: size, shape, colour ...".' },
        { q: 'a growth mechanism that distinguishes cultured pearls from natural ones', a: 'C',
          ev: 'There is only one difference between cultured pearls and natural ones',
          en: 'Paragraph C: "There is only one difference": in cultured pearls the irritant is a bead placed "through surgical implantation".' }
      ] },
    { type: 'completion', title: 'Pearls around the world',
      group: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 5–10 on your answer sheet.',
      items: [
        { q: 'In history, pearls had great importance among men of wealth and power, and were treated as gems for women in ____.', a: 'ancient Rome|Rome',
          ev: 'women from ancient Rome went to bed with pearls on them',
          en: '"Women from ancient Rome went to bed with pearls on them."' },
        { q: 'Pearls were even used as a medicine for people in ____.', a: 'Persia',
          ev: 'In the eastern countries like Persia, ground pearl powders could be used as a medicine',
          en: '"In the eastern countries like Persia, ground pearl powders could be used as a medicine."' },
        { q: 'There are essentially three types of pearls: natural, cultured and imitation. Most freshwater cultured pearls sold today come from China, while ____ Island is famous for its imitation pearl industry.', a: 'Mallorca',
          ev: 'The Island of Mallorca in Spain is renowned for its imitation pearl industry',
          en: '"The Island of Mallorca in Spain is renowned for its imitation pearl industry" (renowned = famous).' },
        { q: 'Good-quality natural pearls are exceedingly unusual. ____ often produces some of the glossiest pearls,', a: 'Japan',
          ev: 'Japan’s Akoya pearls are one of the glossiest pearls out there',
          en: '"Japan\'s Akoya pearls are one of the glossiest pearls out there."' },
        { q: 'while ____ produces larger ones because of the favourable environment along its coastline.', a: 'Australia',
          ev: 'the south sea water of Australia is a cradle to bigger pearls',
          en: '"The south sea water of Australia is a cradle to bigger pearls."' },
        { q: 'In the past, ____ in the Persian Gulf produced the world’s best pearls. Nowadays, the major remaining suppliers of natural pearls are in India.', a: 'Bahrain',
          ev: 'the pearls with the highest quality around the globe are found in the Persian Gulf, particularly around Bahrain',
          en: '"Historically, the pearls with the highest quality ... are found in the Persian Gulf, particularly around Bahrain."' }
      ] },
    { type: 'tfng',
      group: 'Do the following statements agree with the information given in Reading Passage 1? In boxes 11–13 on your answer sheet, write',
      items: [
        { q: 'Generally speaking, the centre of a cultured pearl is significantly larger than that of a natural pearl.', a: 'TRUE',
          ev: 'This results in much larger cores in cultivated pearls than those in natural pearls',
          en: '"This results in much larger cores in cultivated pearls than those in natural pearls" (core = centre).' },
        { q: 'Sometimes, fake pearls can be more expensive.', a: 'NOT GIVEN',
          ev: 'imitation pearls (which basically are worthless)',
          en: 'Imitation pearls are called "basically ... worthless"; the passage never says that they can sometimes cost more.' },
        { q: 'The size of the pearls produced in Japan is usually smaller than those in Australia.', a: 'TRUE',
          ev: 'the south sea water of Australia is a cradle to bigger pearls',
          en: 'Japan\'s Akoya pearls are glossy, "while the south sea water of Australia is a cradle to bigger pearls" – Australian pearls are bigger.' }
      ] }
  ]
};
