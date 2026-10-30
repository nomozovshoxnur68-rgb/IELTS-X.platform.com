/* William Gilbert and Magnetism — Reading Passage 1, Questions 1–13 (from William Gilbert and Magnetism - Passage 1.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'william-gilbert',
  title: 'William Gilbert and Magnetism',
  passageLabel: 'Passage 1',
  cardTypes: ['Matching Headings', 'True False Not Given', 'Multiple Choice Many'],
  passage: `
The Elizabethan physician who founded the study of electricity and magnetism

A The 16th and 17th centuries saw two great pioneers of modern science: Galileo and Gilbert. The impact of their findings is eminent. Gilbert was the first modern scientist, also the accredited father of the science of electricity and magnetism, an Englishman of learning and a physician at the court of Elizabeth. Prior to him, all that was known of electricity and magnetism was what the ancients knew, nothing more than that the lodestone possessed magnetic properties and that amber and jet, when rubbed, would attract bits of paper or other substances of small specific gravity. However, he is less well known than he deserves.

B Gilbert’s birth pre-dated Galileo. Born in an eminent local family in Colchester County in the UK, on May 24, 1544, he went to grammar school, and then studied medicine at St John’s College, Cambridge, graduating in 1573. Later he travelled in the continent and eventually settled down in London.

C He was a very successful and eminent doctor. All this culminated in his election to the president of the Royal Science Society. He was also appointed personal physician to the Queen (Elizabeth I), and later knighted by the Queen. He faithfully served her until her death. However, he didn’t outlive the Queen for long and died on November 30, 1603, only a few months after his appointment as personal physician to King James.

D Gilbert was first interested in chemistry but later changed his focus due to the large portion of mysticism of alchemy involved (such as the transmutation of metal). He gradually developed his interest in physics after the great minds of the ancient, particularly about the knowledge the ancient Greeks had about lodestones, strange minerals with the power to attract iron. In the meantime, Britain became a major seafaring nation in 1588 when the Spanish Armada was defeated, opening the way to British settlement of America. British ships depended on the magnetic compass, yet no one understood why it worked. Did the Pole Star attract it, as Columbus once speculated; or was there a magnetic mountain at the pole, as described in Odyssey, which ships would never approach, because the sailors thought its pull would yank out all their iron nails and fittings? For nearly 20 years, William Gilbert conducted ingenious experiments to understand magnetism. His works include On the Magnet, Magnetic Bodies, and the Great Magnet of the Earth.

E Gilbert’s discovery was so important to modern physics. He investigated the nature of magnetism and electricity. He even coined the word “electric”. Though the early beliefs of magnetism were also largely entangled with superstitions such as that rubbing garlic on lodestone can neutralise its magnetism, one example being that sailors even believed the smell of garlic would even interfere with the action of compass, which is why helmsmen were forbidden to eat it near a ship’s compass. Gilbert also found that metals can be magnetised by rubbing materials such as fur, plastic or the like on them. He named the ends of a magnet “north pole” and “south pole”. The magnetic poles can attract or repel, depending on polarity. In addition, however, ordinary iron is always attracted to a magnet. Though he started to study the relationship between magnetism and electricity, sadly he didn’t complete it. His research of static electricity using amber and jet only demonstrated that objects with electrical charges can work like magnets attracting small pieces of paper and stuff. It is a French guy named du Fay that discovered that there are actually two electrical charges, positive and negative.

F He also questioned the traditional astronomical beliefs. Though a Copernican, he didn’t express in his quintessential beliefs whether the earth is at the centre of the universe or in orbit around the sun. However, he believed that stars are not equidistant from the earth but have their own earth-like planets orbiting around them. The earth itself is like a giant magnet, which is also why compasses always point north. They spin on an axis that is aligned with the earth’s polarity. He even likened the polarity of the magnet to the polarity of the earth and built an entire magnetic philosophy on this analogy. In his explanation, magnetism is the soul of the earth. Thus a perfectly spherical lodestone, when aligned with the earth’s poles, would wobble all by itself in 24 hours. Further, he also believed that the sun and other stars wobble just like the earth does around a crystal core, and speculated that the moon might also be a magnet caused to orbit by its magnetic attraction to the earth. This was perhaps the first proposal that a force might cause a heavenly orbit.

G His research method was revolutionary in that he used experiments rather than pure logic and reasoning like the ancient Greek philosophers did. It was a new attitude towards scientific investigation. Until then, scientific experiments were not in fashion. It was because of this scientific attitude, together with his contribution to our knowledge of magnetism, that a unit of magneto motive force, also known as magnetic potential, was named Gilbert in his honour. His approach of careful observation and experimentation rather than the authoritative opinion or deductive philosophy of others had laid the very foundation for modern science.
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 1 has seven paragraphs, A–G. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–x, in boxes 1–7 on your answer sheet.',
      options: ['i. Early years of Gilbert', 'ii. What was new about his scientific research method', 'iii. The development of chemistry', 'iv. Questioning traditional astronomy', 'v. Pioneers of early science',
        'vi. Professional and social recognition', 'vii. Becoming President of the Royal Science Society', 'viii. The great works of Gilbert', 'ix. His discovery of magnetism', 'x. His change of focus'],
      items: [
        { q: 'Paragraph A', a: 'v', ev: 'The 16th and 17th centuries saw two great pioneers of modern science: Galileo and Gilbert',
          en: 'Paragraph A introduces "two great pioneers of modern science: Galileo and Gilbert".' },
        { q: 'Paragraph B', a: 'i', ev: 'he went to grammar school, and then studied medicine at St John’s College, Cambridge',
          en: 'Paragraph B covers his birth, school and university – his early years.' },
        { q: 'Paragraph C', a: 'vi', ev: 'He was also appointed personal physician to the Queen (Elizabeth I), and later knighted by the Queen',
          en: 'A successful doctor, president of a society, physician to the Queen and knighted: recognition. vii is only one detail of the paragraph.' },
        { q: 'Paragraph D', a: 'x', ev: 'Gilbert was first interested in chemistry but later changed his focus',
          en: '"Gilbert was first interested in chemistry but later changed his focus" to physics and magnetism.' },
        { q: 'Paragraph E', a: 'ix', ev: 'He investigated the nature of magnetism and electricity',
          en: 'Paragraph E describes what he found about magnetism: magnetised metals, north and south poles.' },
        { q: 'Paragraph F', a: 'iv', ev: 'He also questioned the traditional astronomical beliefs',
          en: '"He also questioned the traditional astronomical beliefs": stars, the earth as a magnet, the moon\'s orbit.' },
        { q: 'Paragraph G', a: 'ii', ev: 'His research method was revolutionary in that he used experiments rather than pure logic and reasoning',
          en: '"His research method was revolutionary": experiments "rather than pure logic and reasoning".' }
      ] },
    { type: 'tfng',
      group: 'Do the following statements agree with the information given in Reading Passage 1? In boxes 8–10 on your answer sheet, write',
      items: [
        { q: 'He is less famous than he should be.', a: 'TRUE',
          ev: 'he is less well known than he deserves',
          en: '"He is less well known than he deserves."' },
        { q: 'He was famous as a doctor before he was employed by the Queen.', a: 'TRUE',
          ev: 'He was a very successful and eminent doctor',
          en: '"He was a very successful and eminent doctor", and this "culminated" in his appointment as the Queen\'s physician.' },
        { q: 'He lost faith in the medical theories of his time.', a: 'NOT GIVEN',
          en: 'He moved away from chemistry because of the mysticism of alchemy; nothing is said about medical theories.' }
      ] },
    { type: 'mcq-multi',
      group: 'Choose THREE letters, A–F. Write your answers in boxes 11–13 on your answer sheet. NB Your answers may be given in any order.',
      items: [
        { q: 'Which THREE of the following are parts of Gilbert’s discovery?', a: 'C,D,E',
          opts: ['A. Metals can be transformed into other metals.', 'B. Garlic can remove magnetism.', 'C. Metals can be magnetised.', 'D. Stars are at different distances from the Earth.', 'E. The Earth wobbles on its axis.', 'F. There are two charges of electricity.'],
          ev: ['metals can be magnetised by rubbing materials such as fur, plastic or the like on them', 'he believed that stars are not equidistant from the earth', 'the sun and other stars wobble just like the earth does'],
          en: 'C: "metals can be magnetised". D: stars "are not equidistant from the earth". E: stars "wobble just like the earth does". A is alchemy, B a superstition, F was du Fay\'s discovery.' }
      ] }
  ]
};
