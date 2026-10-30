/* The Clipper Races — Reading Passage 1, Questions 1–13 (from The_Clipper_Races_P1.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'clipper-races',
  title: 'The Clipper Races: an era of competition between cargo ships',
  passageLabel: 'Passage 1',
  cardTypes: ['True False Not Given', 'Note Completion'],
  passage: `
During the seventeenth and eighteenth centuries, the British East India Company had the monopoly on trade with China and India. This meant that because no rival could legally import tea or other goods from these countries at this time, the company was rarely in a hurry to transport its merchandise. Instead, its priority was to minimise costs by carrying as much as possible on each ship. This meant that its ships – known as East Indiamen – were enormous, strong and very slow.

By 1800, the average East Indiaman could carry 1,200 tons of merchandise. The trading pattern for China tea usually meant the East Indiamen set sail from Britain in January, sailed round the Cape of Good Hope at the southernmost tip of Africa, and arrived in China in September. There they would load up that year’s tea harvest, set off again and, depending on the wind and weather, aim to arrive back by the following September, so even with favourable sailing conditions, the round trip lasted almost two years, and if anything went wrong it could take a lot longer.

However, by 1834 the company had lost its trading monopoly, and tea had become a freely traded item. Having no more use for its great ships, the company sold them off, and many were bought by merchants or their captains, who continued to plough the seas between Britain and China. But now that tea could be traded freely, a few smart sailors began to realise that whoever brought each new harvest of tea to Britain first stood to make the most money.

This was partly because if you were home first, you could sell your shipment of tea before your competitors even arrived, and partly because consumers in Britain in the nineteenth century believed that the fresher and earlier-picked the tea, the better the resulting drink. Tea traders now needed faster, sleeker ships to bring their precious cargo back. Nevertheless, in Britain this idea only caught on slowly, and while the 1840s saw a few faster ships launched, for the time being many merchants remained satisfied with the slow but reliable East Indiamen.

In fact it was the Americans who pioneered the first clipper ships. These vessels were fast and slender, with a narrow hull that was deeper at the back than at the front, and masses of sails on tall masts. They earned their name from the way that they ‘clipped off’ journey time. British merchants resolved to build their own clippers to rival the Americans, and the first British tea clipper, Stornaway, was built in Aberdeen in 1850. More tea clippers were designed and built in Britain throughout the 1850s and 1860s; they had a narrower beam than their American equivalents, making them less powerful during storms, but faster in calmer weather.

There was a great spirit of competition between the British and American ships plying the tea trade, but to begin with the Americans had the edge. Then in 1851 a British ship owner, Richard Green, built the aptly named clipper Challenger with the stated intention of beating the American ships. Loaded with tea, Challenger left China for London in 1852 at the same time as the American clipper Challenge, a much larger older ship, already greatly admired for its speed. Large sums were bet on which would complete the journey first. In the event, the British ship beat its rival to London by two days, amid much jubilation. From then on, such international races grew in popularity.

After 1855, American participation in the British tea trade gradually stopped. But even without the Anglo-American rivalry, the competitive spirit continued. It was really ignited when new ports were opened up for trade in China. These included Fouchow, which was much closer to the tea-producing areas than Canton, the port used previously. As a result, tea could be loaded on board earlier and fresher, and the clippers could set off in late May or early June – sometimes not even taking time to fill out the official paperwork – racing back to Britain whatever the difficulties.

They sped down through the South China Sea and into the Indian Ocean, then raced to get round the southernmost tip of Africa at the Cape of Good Hope. Then it was north across the vast Atlantic, past the Azores, through the English Channel and into the estuary of the River Thames. Once there, they would be towed by tugs, up the river and into the docks.

The cargo of the winning ship could earn a premium of up to sixpence per pound – and so the captain and crew were rewarded by the owners of the cargo. But the races were about more than just money: the crews, about 40 men on each clipper, were expert sailors, proud of their ships, and they delighted in competing against each other. Without their enthusiasm, the races would never have happened, since getting home as fast as possible required the crew to be totally dedicated and to sacrifice much of their rest for the duration of the race.
`,
  groups: [
    { type: 'tfng',
      group: 'Do the following statements agree with the information given in Reading Passage 1? In boxes 1–6 on your answer sheet, write',
      items: [
        { q: 'In the seventeenth and eighteenth centuries, the British East India Company faced a lot of competition.', a: 'FALSE',
          ev: 'the British East India Company had the monopoly on trade with China and India',
          en: 'The company "had the monopoly" and "no rival could legally import tea", so it had no competition.' },
        { q: 'Before 1800, cargo size was the most important consideration for the East India Company.', a: 'TRUE',
          ev: 'its priority was to minimise costs by carrying as much as possible on each ship',
          en: '"Its priority was to minimise costs by carrying as much as possible on each ship."' },
        { q: 'At best, voyages of the East Indiamen to China and back took nearly two years to complete.', a: 'TRUE',
          ev: 'so even with favourable sailing conditions, the round trip lasted almost two years',
          en: '"Even with favourable sailing conditions" (at best) "the round trip lasted almost two years".' },
        { q: 'Before 1834, voyages to and from China were considered to be highly dangerous.', a: 'NOT GIVEN',
          en: 'The passage says a trip could take longer "if anything went wrong", but nothing about voyages being seen as dangerous.' },
        { q: 'After 1834, the ships which had served the East India Company stopped being used for commercial purposes.', a: 'FALSE',
          ev: 'many were bought by merchants or their captains, who continued to plough the seas between Britain and China',
          en: 'The ships were sold to merchants "who continued to plough the seas between Britain and China" – they were still used for trade.' },
        { q: 'In the nineteenth century, British drinkers preferred tea made from mature leaves to that made from younger leaves.', a: 'FALSE',
          ev: 'the fresher and earlier-picked the tea, the better the resulting drink',
          en: 'Consumers believed "the fresher and earlier-picked the tea, the better" – they preferred young leaves.' }
      ] },
    { type: 'completion', title: 'Clipper races',
      group: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 7–13 on your answer sheet.',
      items: [
        { q: 'The ships: clipper ships were first used for trading by American merchants. The ships were remarkable for the number of ____ they had.', a: 'sails',
          ev: 'masses of sails on tall masts',
          en: 'Clippers had "masses of sails on tall masts".' },
        { q: 'The performance of British tea clippers was particularly affected when there were ____ at sea.', a: 'storms',
          ev: 'making them less powerful during storms',
          en: 'Their narrower beam made them "less powerful during storms".' },
        { q: 'The races: it was in a ship called ____ that the British first competed successfully against the Americans.', a: 'Challenger',
          ev: 'built the aptly named clipper Challenger with the stated intention of beating the American ships',
          en: 'Richard Green built "Challenger", which "beat its rival to London by two days".' },
        { q: 'Richard Green’s ship arrived two days ahead of its competitor. Competition increased when additional Chinese trading ____ were established.', a: 'ports',
          ev: 'It was really ignited when new ports were opened up for trade in China',
          en: 'The competitive spirit "was really ignited when new ports were opened up for trade in China".' },
        { q: 'Merchants were occasionally in such a hurry that they failed to complete the ____ before leaving China.', a: 'paperwork',
          ev: 'sometimes not even taking time to fill out the official paperwork',
          en: 'Clippers set off "sometimes not even taking time to fill out the official paperwork".' },
        { q: 'At the end of their journey, the ships needed the help of ____.', a: 'tugs',
          ev: 'they would be towed by tugs, up the river and into the docks',
          en: 'In the Thames "they would be towed by tugs, up the river and into the docks".' },
        { q: 'The rewards: the crews were motivated by both ____ and their enthusiasm for the competition.', a: 'money',
          ev: 'But the races were about more than just money',
          en: 'The crew were "rewarded by the owners", and "the races were about more than just money" – money and enthusiasm.' }
      ] }
  ]
};
