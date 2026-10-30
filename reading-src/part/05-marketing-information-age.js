/* Marketing and the information age — Reading Passage 3, Questions 27–40 (from 05_Marketing_Information_Age_P3.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'marketing-information-age',
  title: 'Marketing and the information age',
  passageLabel: 'Passage 3',
  cardTypes: ['Matching Information', 'Yes No Not Given', 'Flow-chart Completion'],
  passage: `
Why gathering, storing and using information has become the marketer’s most valuable tool

A For the early practitioners of marketing in the late 19th and early 20th centuries, the business of selling was simply a matter of continually finding new customers. By contrast, marketing managers in the current era recognise the importance of gathering information about the market and potential customers. They recognise that if companies are to be profitable, customers must gain and retain their perceptions of value from the brands they buy over a long time frame, rather than from a single transaction. This also means that customers must see value in returning continually to the stores where they shop, as well as to the service providers they deal with.

B Marketing practitioners and marketing scientists have never worked more closely than they currently do. There are many reasons for this, including the fact that this is the information age where the convergence in telecommunications, media and technology is causing old ways to be challenged, and new methods and tools to be tested. Customer expectations have risen as new technologies allow for new approaches. For instance, the subscriber-TV music channel Channel [V] encourages its viewers to sign up for text messages and email alerts that tell them when their favourite artists and songs are about to be broadcast. Competitive advantage lies in being able to recognise which customers can be given greater attention, not just because they demand it but because it makes commercial sense to provide high levels of product quality and service.

C Modern marketing information systems rely on information technology to enable marketing intelligence to be gathered and to store and analyse marketing research information. While some of the information used is gathered by government bodies such as the Australian Bureau of Statistics and Statistics New Zealand, most of it is purposefully gathered by marketing organisations for client companies. In the process, computer technology is used to manipulate the data and then to present the information in such a way that allows executives to readily identify any problems or issues, and quickly arrive at solutions.

D In order to produce superior value and satisfaction for customers, marketing managers need information at almost every turn. They need information about customers both end-users and resellers – as well as competitors and other forces in the marketplace. One marketing executive put it this way: “To manage a business well is to manage its future; and to manage the future is to manage information.” Increasingly, marketers are viewing information not just as an input for making better decisions but also as an important strategic asset and marketing tool. As household incomes increase, choice widens and buyers become better discriminating, so sellers need information about how buyers respond to different products and advertising campaigns.

E The supply of information has also increased greatly. It has been suggested by the futurist and best-selling author John Naisbitt that the United States and, by observation, developed countries such as Australia, New Zealand and Singapore are moving from industrial to information-based economies. These post-industrial economies earn 70- 80% of their Gross Domestic Product from services, and have entered what some commentators have termed the ‘Information Age’ or the ‘Information Technology Era’.

F One study found that with all the information now available through supermarket scanners, a packaged goods product controller is bombarded with one million to one billion new numbers each week. As Naisbitt points out: “Running out of information is not a problem, but drowning in it is.” Yet marketers frequently complain that they lack information of the right kind but have plenty of the wrong kind, or they claim that marketing information is so widely spread throughout the organisation that it takes great effort to locate even simple facts. In addition, subordinates may withhold information they believe will reflect badly on their performance and important information often arrives too late to be useful, or on-time information is not accurate. So marketing managers need better information. Although marketing organisations have greater capacity to provide managers with information, they often do not use it well. As a result, many marketing organisations are now studying their managers’ information needs and designing information systems specifically to meet those needs.

G One solution is to use a Marketing Information System (MIS). This consists of people, equipment and procedures which, when put together, are able to gather, analyse, evaluate and distribute needed, timely and accurate information to marketing decision-makers. The MIS begins and ends with marketing managers. First, it interacts with these managers to assess the information needs they have. Next, it develops the needed information from internal records, marketing intelligence activities and the research process. The analysis unit processes the data to make it more useful and, finally, the MIS distributes it to managers in the right form and at the right time to help them make better marketing decisions.

H However, the costs of obtaining, processing, storing and delivering information can mount quickly. In some cases, additional information will do little to change or improve a manager’s decision, or the costs of acquiring the information will exceed the returns from the improved decision. For example, if an organisation estimates that launching a new product without any further information will yield a profit of $500,000, then it would be foolish to spend $30,000 for additional information that would increase the profit to only $525,000. By itself information is valueless – its value comes from its use.
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 3 has eight paragraphs, A–H. Which paragraph contains the following information? Write the correct letter, A–H, in boxes 27–31 on your answer sheet.',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      items: [
        { q: 'the fact that there may be too much information to cope with', a: 'F',
          ev: 'Running out of information is not a problem, but drowning in it is',
          en: 'Paragraph F: a product controller "is bombarded with one million to one billion new numbers each week" – "drowning in it is" the problem.' },
        { q: 'the relevance of generating repeat business', a: 'A',
          ev: 'customers must see value in returning continually to the stores where they shop',
          en: 'Paragraph A: value must come "over a long time frame, rather than from a single transaction", and customers must keep "returning continually".' },
        { q: 'an example of personalised marketing', a: 'B',
          ev: 'tell them when their favourite artists and songs are about to be broadcast',
          en: 'Paragraph B: Channel [V] sends alerts that "tell them when their favourite artists and songs are about to be broadcast".' },
        { q: 'an illustration of a situation where commissioning new information research might not be advisable', a: 'H',
          ev: 'it would be foolish to spend $30,000 for additional information that would increase the profit to only $525,000',
          en: 'Paragraph H: "it would be foolish to spend $30,000 for additional information" that adds only $25,000 of profit.' },
        { q: 'how the greater wealth of customers enables them to select from a broader range of products', a: 'D',
          ev: 'As household incomes increase, choice widens',
          en: 'Paragraph D: "As household incomes increase, choice widens and buyers become better discriminating".' }
      ] },
    { type: 'ynng',
      group: 'Do the following statements agree with the views of the writer in Reading Passage 3? In boxes 32–36 on your answer sheet, write',
      items: [
        { q: 'The majority of marketing statistics are gathered by government agencies.', a: 'NO',
          ev: 'most of it is purposefully gathered by marketing organisations for client companies',
          en: 'Some information comes from government bodies, but "most of it is purposefully gathered by marketing organisations".' },
        { q: 'The move from an industrial to an information-based economy has happened more quickly in New Zealand than in Australia.', a: 'NOT GIVEN',
          en: 'Australia and New Zealand are both named as moving to information-based economies, but their speed is never compared.' },
        { q: 'Employees sometimes hide information that gives a poor impression of them.', a: 'YES',
          ev: 'subordinates may withhold information they believe will reflect badly on their performance',
          en: '"Subordinates may withhold information they believe will reflect badly on their performance" (withhold = hide).' },
        { q: 'Managers frequently fail to make good use of the information they receive.', a: 'YES',
          ev: 'they often do not use it well',
          en: 'Organisations can give managers more information, but "they often do not use it well".' },
        { q: 'Marketing information has to be used to be valuable.', a: 'YES',
          ev: 'By itself information is valueless – its value comes from its use',
          en: '"By itself information is valueless – its value comes from its use."' }
      ] },
    { type: 'completion', title: 'The Marketing Information System (MIS)',
      group: 'Complete the flow-chart below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 37–40 on your answer sheet.',
      items: [
        { q: 'The MIS starts and finishes with the ____.', a: 'marketing managers|managers',
          ev: 'The MIS begins and ends with marketing managers',
          en: '"The MIS begins and ends with marketing managers."' },
        { q: '↓ Find out their ____.', a: 'information needs|needs',
          ev: 'it interacts with these managers to assess the information needs they have',
          en: 'First "it interacts with these managers to assess the information needs they have".' },
        { q: '↓ Information developed through: ____ • marketing intelligence activities • the research process', a: 'internal records|records',
          ev: 'it develops the needed information from internal records, marketing intelligence activities and the research process',
          en: 'Next "it develops the needed information from internal records, marketing intelligence activities and the research process".' },
        { q: '↓ Processed by the ____ ↓ Timely and accurate data distributed to decision-makers', a: 'analysis unit',
          ev: 'The analysis unit processes the data to make it more useful',
          en: '"The analysis unit processes the data", and then the MIS distributes it to managers.' }
      ] }
  ]
};
