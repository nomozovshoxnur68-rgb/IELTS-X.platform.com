/* Dark Chocolate's Health-giving Benefits — Reading Passage 2, Questions 14–26 (from 02_Dark_Chocolate_P2.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'dark-chocolate',
  title: 'Dark Chocolate’s Health-giving Benefits',
  passageLabel: 'Passage 2',
  cardTypes: ['Matching Information', 'Matching Features', 'Sentence Completion'],
  passage: `
Researchers are investigating whether taking dark chocolate daily can reduce the risk of heart disease and stroke

A Dark chocolate is gaining a reputation as a heart-healthy food, and research suggests that there might be some substance behind those claims. Ginger Hultin, owner of Champagne Nutrition in Seattle and a spokesperson for the Academy of Nutrition and Dietetics says 'Cocoa contains antioxidants in addition to magnesium, potassium, zinc, and iron. Plus, studies have shown that there could be some benefit to consuming chocolate or cocoa for the cardiovascular system, including potentially lowering blood pressure.'

B Dark chocolate's health benefits come from its cocoa – specifically its cocoa flavanols. Flavanols are a type of polyphenol, and polyphenols are one group of phytochemicals. Many fruits and vegetables contain flavanols, but they are especially rich in tea, wine, and cocoa. During digestion, cocoa is broken down into smaller chemical compounds. Some research suggests that these compounds have anti-inflammatory and antioxidant properties and may help protect against cardiovascular disease, which affects both the heart and brain. For example, research has found that even two weeks of eating dark chocolate or other flavanol-rich cocoa products is better than a placebo for lowering blood pressure in people who already have high blood pressure, although not to normal levels. In 2013, the European Food Safety Authority approved the claim that cocoa flavanols help maintain normal blood pressure, which means that the cost involved in future medical treatment may be less than scientists previously predicted.

C Researchers have also pointed out that people may digest cocoa differently. Variations in gut bacteria can influence how flavanols are processed and absorbed in the body. As a result, the health effects of cocoa may differ from person to person, depending on individual digestive systems and dietary habits.

D Data from the long-running Physicians' Health Study suggests that chocolate intake is associated with a reduced risk of developing Type 2 diabetes in younger and normal-weight men. However, take those findings with a grain of salt, because they were based on a single question about average yearly intake of chocolate that didn't ask what type of chocolate — white, milk, or dark — says Howard Sesso, an associate professor of preventive medicine at Brigham and Woman's Hospital in Boston. 'If we assume that any benefits from cocoa are attributable to its flavanol content, then dark chocolate should in theory confer greater benefits than milk chocolate.' Sesso and other researchers are investigating whether taking daily supplements of 600 mg of cocoa flavanols — not chocolate itself — reduces the risk for developing heart disease and stroke, as well as cancer. However, they have yet to determine how much people need to consume to reap benefits.

E What does that mean for the average person who enjoys chocolate and hopes they're getting some health benefit from it? Sadly, results from the large European Prospective Investigation of Cancer, EPIC-Norfolk study suggest that the amount of flavanols that the average person in Europe or the United States consumes is unlikely to do much to reduce risk of cardiovascular disease compared with taking medicine. The research also suggested that certain groups, particularly overweight individuals, may not receive the same protective effects from chocolate consumption as younger and normal-weight men.

F Even though cocoa is a key ingredient in milk and dark chocolate, you can't really be sure how many flavanols you're getting. 'Product packaging does not specify amounts of cocoa flavanols, only percent cacao,' Sesso says. 'Variable processing of the cocoa bean makes it difficult to equate percent cacao with cocoa flavanol content.' White chocolate contains no cocoa solids, milk chocolate contains relatively small amounts of cocoa, while dark chocolate contains a much higher percentage of cocoa. Cocoa may also appear in the form of cocoa powder, cocoa butter, or concentrated cocoa extracts.

G In the meantime, remember that chocolate products are typically high in calories and fats; therefore, Sesso says it's best not to think of dark chocolate as a health food. 'Moderation is key; if someone enjoys eating chocolate, it should be done in moderation along with other foods.' So for now, it's best not to put all your flavanol eggs in a dark chocolate basket. 'We get different phytochemicals and antioxidants from a wide variety of foods,' Hultin says. 'Including different colors of fruits, vegetables, whole grains and beans is the best way to gain access to fiber that could support health.' That said, she does recommend enjoying a bit of chocolate or cocoa. 'I put cocoa powder in my smoothies for an added boost of flavor, nutrients and antioxidants.'
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 2 has seven paragraphs, A–G. Which paragraph contains the following information? Write the correct letter, A–G, in boxes 14–18 on your answer sheet.',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      items: [
        { q: 'a description of different kinds of cocoa used in chocolate production', a: 'F',
          ev: 'Cocoa may also appear in the form of cocoa powder, cocoa butter, or concentrated cocoa extracts',
          en: 'Paragraph F lists the forms cocoa takes: "cocoa powder, cocoa butter, or concentrated cocoa extracts".' },
        { q: 'an explanation that chemicals produced during cocoa digestion may reduce the risks of diseases', a: 'B',
          ev: 'these compounds have anti-inflammatory and antioxidant properties and may help protect against cardiovascular disease',
          en: 'Paragraph B: during digestion cocoa becomes "smaller chemical compounds" which "may help protect against cardiovascular disease".' },
        { q: 'a reference to a group of people who may not benefit from eating chocolate', a: 'E',
          ev: 'particularly overweight individuals, may not receive the same protective effects',
          en: 'Paragraph E: "certain groups, particularly overweight individuals, may not receive the same protective effects".' },
        { q: 'an example of a specific way cocoa can be added into beverage', a: 'G',
          ev: 'I put cocoa powder in my smoothies',
          en: 'Paragraph G: Hultin says "I put cocoa powder in my smoothies" (a smoothie is a drink).' },
        { q: 'information about differences in the way people digest cocoa', a: 'C',
          ev: 'people may digest cocoa differently',
          en: 'Paragraph C: "people may digest cocoa differently" because of "variations in gut bacteria".' }
      ] },
    { type: 'matching', title: 'List of People or Organisations',
      group: 'Look at the following statements (Questions 19–22) and the list of people or organisations below. Match each statement with the correct person or organisation, A–D. Write the correct letter, A–D, in boxes 19–22 on your answer sheet.',
      options: ['A. Ginger Hultin', 'B. European Food Safety Authority', 'C. Howard Sesso', 'D. EPIC-Norfolk'],
      items: [
        { q: 'Eating cocoa together with dietary fibre may improve health.', a: 'A',
          ev: 'is the best way to gain access to fiber that could support health',
          en: 'Hultin recommends a wide variety of foods as "the best way to gain access to fiber that could support health", and she still adds cocoa to her smoothies.' },
        { q: 'Dark chocolate consumption could reduce medical spending in the future.', a: 'B',
          ev: 'the cost involved in future medical treatment may be less than scientists previously predicted',
          en: 'After the European Food Safety Authority approved the flavanol claim, "the cost involved in future medical treatment may be less".' },
        { q: 'Dark chocolate should not be considered a replacement for medicine.', a: 'D',
          ev: 'is unlikely to do much to reduce risk of cardiovascular disease compared with taking medicine',
          en: 'The EPIC-Norfolk study found the usual amount of flavanols "is unlikely to do much ... compared with taking medicine".' },
        { q: 'The amount of cocoa required for health benefits remains uncertain.', a: 'C',
          ev: 'they have yet to determine how much people need to consume to reap benefits',
          en: 'Sesso and his colleagues "have yet to determine how much people need to consume to reap benefits".' }
      ] },
    { type: 'completion',
      group: 'Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 23–26 on your answer sheet.',
      items: [
        { q: 'The digestive process turns cocoa into less complex chemical ____.', a: 'compounds',
          ev: 'cocoa is broken down into smaller chemical compounds',
          en: '"During digestion, cocoa is broken down into smaller chemical compounds" (smaller = less complex).' },
        { q: 'The ____ would vary according to chocolate type, with dark chocolate outperforming milk chocolate.', a: 'benefits',
          ev: 'dark chocolate should in theory confer greater benefits than milk chocolate',
          en: 'Sesso: "dark chocolate should in theory confer greater benefits than milk chocolate".' },
        { q: 'Dark chocolate should not be regarded as healthy due to its richness of calories and ____.', a: 'fats',
          ev: 'chocolate products are typically high in calories and fats',
          en: '"Chocolate products are typically high in calories and fats", so it is "best not to think of dark chocolate as a health food".' },
        { q: 'In Hultin’s view, dietary diversity is the best strategy for acquiring ____.', a: 'fiber|fibre',
          ev: 'is the best way to gain access to fiber',
          en: 'Eating "different colors of fruits, vegetables, whole grains and beans is the best way to gain access to fiber".' }
      ] }
  ]
};
