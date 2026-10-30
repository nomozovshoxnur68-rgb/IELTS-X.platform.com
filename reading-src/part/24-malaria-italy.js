/* The Conquest of Malaria in Italy — Reading Passage 2, Questions 14–26 (from The Conquest of Malaria in Italy - Passage 2.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'malaria-italy',
  title: 'The Conquest of Malaria in Italy',
  passageLabel: 'Passage 2',
  cardTypes: ['Summary Completion', 'True False Not Given', 'Matching Information'],
  passage: `
A review of Frank Snowden’s history of how Italy was declared malaria-free by 1962

A The word ‘malaria’ means ‘bad air’ in Italian, and this terrible disease marked the life of the people of that country for thousands of years. Yet by 1962, Italy was officially declared malaria-free, and it has remained so ever since. Frank Snowden’s study of this successful endeavour is a remarkable piece of historical work. Original, crystal clear, analytical and passionate, Snowden takes us to areas historians have rarely visited before.

B Everybody now knows that malaria is carried by mosquitoes. But in the 19th century most experts subscribed to the theory of ‘miasma’ or ‘poisoning of the air’. Others made a link between swamps, water and malaria, but did not make the further leap towards insects. The consequence of these theories was that little was done to combat the disease before the end of that century. The situation was so serious that from a total population of 25m Italians, 11m were ‘permanently at risk’. In warm, damp, malarial zones, the life expectancy of land workers was a terrifying 22.5 years. The economic impact of the disease was immense. Epidemics were blamed on people who originated from the hotter parts of Italy, given the widespread belief that malaria was hereditary.

C One of the first breakthroughs in the war against malaria came in 1898 when the zoologist Giovanni Battista Grassi demonstrated that the micro-organisms causing the disease were carried in the digestive tract of the mosquito. By releasing mosquitoes into rooms to drink the blood of healthy human volunteers, Grassi was able to make the direct link between the insects and the disease. Definitive proof of this theory was obtained after an extraordinary series of experiments in Italy, where healthy people were introduced into malarial zones but kept free of mosquito bites – and remained well. The recently formed Italian state at last had the necessary information to begin tackling the disease.

D A complicated approach was adopted, which made use of quinine – a drug obtained from tree bark which had long been used to combat fever, but had now been seen as a crucial part of the war on malaria. Italy introduced a quinine law and a quinine tax in 1904, and the drug was administered to large numbers of rural workers. Despite its often terrible side effects, the drug was successful in limiting the spread of the disease, and in breaking cycles of infection. In addition, Italy set up rural health centres and invested heavily in education programmes. Malaria, as Snowden shows, was not just a medical problem, but a social and regional issue, and could only be defeated through multi-layered strategies.

E It was originally decided to give quinine to all those in vulnerable regions – even healthy people. However, peasants were often suspicious of medicine being forced upon them, and doctors were frequently met with hostility and stubborn refusal to accept the treatment offered. But despite the refusals, the strategy as a whole was hugely successful. Deaths from malaria fell by some 80% in the first decade of the 20th century and some areas escaped altogether from the scourge of the disease.

F The 1915-18 war delayed the campaign, as funds were diverted to the battlefields. In the 1920s and 1930s the draining of the damp, unhealthy marshlands around Rome had a certain impact on the spread of malaria. However, as war swept through the drained lands in the 1940s, the disease returned with a vengeance. Yet the country’s leading malariologist Alberto Missiroli refused to order the distribution of quinine, so allowing the epidemic to spread unchecked. According to Snowden, he did this in order to create the ideal conditions for a new strategy, supported by the US Rockefeller Foundation – a massive experiment involving the extermination of mosquitoes with the chemical DDT. It is estimated that more than a third of the inhabitants in the affected area contracted malaria and countless thousands died.

G With the end of the war in 1945, the US government and the Rockefeller Foundation were free to experiment. DDT was sprayed from the air, and 3m Italians had their bodies covered with the chemical. The effects were immense, and by 1962 malaria was more or less gone from the whole country. One of the final victims to die of the disease in Italy was the popular cyclist, Fausto Coppi. He had contracted malaria in Africa in 1960, and the failure of doctors in Italy to spot the disease was a sign of the times. A few decades earlier, they would have immediately noticed the telltale signs; it was later claimed that a small dose of quinine would have saved his life.

H As there are still more than 1m deaths every year from malaria worldwide, Snowden’s book also has contemporary relevance. This is a disease that affects every level of the societies where it is rampant. The economic miracle of the 1950s and 1960s which made Italy into a modern industrial nation would not have been possible without the eradication of malaria. Moreover, this book convincingly argues that the disease was ‘an integral part of the big picture of modern Italian history’. This magnificent study, beautifully written and impeccably documented, deserves an audience beyond specialists in history, or in Italy.
`,
  groups: [
    { type: 'completion', title: 'Malaria in 19th-century Italy',
      group: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 14–17 on your answer sheet.',
      items: [
        { q: 'Up until the late nineteenth century, experts failed to make the connection between malaria and ____.', a: 'mosquitoes|mosquito',
          ev: 'Others made a link between swamps, water and malaria, but did not make the further leap towards insects',
          en: '"Everybody now knows that malaria is carried by mosquitoes", but in the 19th century experts "did not make the further leap towards insects".' },
        { q: 'The most popular belief at the time was the ____ theory, which held that diseases were carried by unclean air.', a: 'miasma',
          ev: 'most experts subscribed to the theory of ‘miasma’ or ‘poisoning of the air’',
          en: '"Most experts subscribed to the theory of \'miasma\' or \'poisoning of the air\'."' },
        { q: 'Another common idea was that malaria was a ____ disease, so people from certain regions were blamed for epidemics.', a: 'hereditary',
          ev: 'given the widespread belief that malaria was hereditary',
          en: 'Epidemics were blamed on people from hotter parts of Italy, "given the widespread belief that malaria was hereditary".' },
        { q: 'Malaria was particularly widespread in rural regions, where ____ could be extremely short.', a: 'life expectancy',
          ev: 'the life expectancy of land workers was a terrifying 22.5 years',
          en: '"The life expectancy of land workers was a terrifying 22.5 years."' }
      ] },
    { type: 'tfng',
      group: 'Do the following statements agree with the information given in Reading Passage 2? In boxes 18–20 on your answer sheet, write',
      items: [
        { q: 'The volunteers in Giovanni Battista Grassi’s research came from all parts of Italy.', a: 'NOT GIVEN',
          en: 'Grassi used "healthy human volunteers", but where they came from is not said.' },
        { q: 'Experiments in Italy proved that it was possible to remain healthy despite being in malarial zones.', a: 'TRUE',
          ev: 'healthy people were introduced into malarial zones but kept free of mosquito bites – and remained well',
          en: 'People in malarial zones who were "kept free of mosquito bites" "remained well".' },
        { q: 'In the early twentieth century, quinine was successfully administered to all inhabitants of vulnerable regions.', a: 'FALSE',
          ev: 'doctors were frequently met with hostility and stubborn refusal to accept the treatment offered',
          en: 'The plan was to give quinine to everybody, but peasants were suspicious and doctors met "stubborn refusal to accept the treatment".' }
      ] },
    { type: 'matching',
      group: 'Reading Passage 2 has eight paragraphs, A–H. Which paragraph contains the following information? Write the correct letter, A–H, in boxes 21–26 on your answer sheet.',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      items: [
        { q: 'a figure showing the dramatic results of an anti-malarial drug programme', a: 'E',
          ev: 'Deaths from malaria fell by some 80% in the first decade of the 20th century',
          en: 'Paragraph E: "Deaths from malaria fell by some 80%" after quinine was given out.' },
        { q: 'a reference to an important scientific discovery that changed the course of the fight', a: 'C',
          ev: 'Grassi demonstrated that the micro-organisms causing the disease were carried in the digestive tract of the mosquito',
          en: 'Paragraph C: "one of the first breakthroughs" – Grassi showed that mosquitoes carry the disease.' },
        { q: 'an explanation of how the First World War affected the anti-malarial campaign', a: 'F',
          ev: 'The 1915-18 war delayed the campaign, as funds were diverted to the battlefields',
          en: 'Paragraph F: "The 1915-18 war delayed the campaign, as funds were diverted to the battlefields."' },
        { q: 'an assessment of the significance of the book for non-Italian readers', a: 'H',
          ev: 'deserves an audience beyond specialists in history, or in Italy',
          en: 'Paragraph H: the book "deserves an audience beyond specialists in history, or in Italy".' },
        { q: 'a mention of widespread theories that prevented effective action', a: 'B',
          ev: 'The consequence of these theories was that little was done to combat the disease before the end of that century',
          en: 'Paragraph B: because of the miasma and swamp theories "little was done to combat the disease".' },
        { q: 'a description of measures taken that went beyond the supply of medicine', a: 'D',
          ev: 'In addition, Italy set up rural health centres and invested heavily in education programmes',
          en: 'Paragraph D: besides quinine, "Italy set up rural health centres and invested heavily in education programmes".' }
      ] }
  ]
};
