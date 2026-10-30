/* Growing More for Less — Reading Passage 2, Questions 14–26 (from 04_Growing_More_for_Less_P2.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'growing-more-for-less',
  title: 'Growing More for Less',
  passageLabel: 'Passage 2',
  cardTypes: ['Matching Information', 'Multiple Choice Many', 'Sentence Completion'],
  passage: `
Satellite technology is helping farmers boost crop yields

A For farmers, working out the optimal amount of seed, fertiliser, pesticide and water to scatter on a field can make, or break, the subsequent harvest. Regular laboratory analyses of soil and plant samples from various parts of the field can help — but such expertise is costly, and often unavailable. However, a new and cheaper method of doing this analysis is now on offer. Precise prescriptions for growing crops can be obtained quickly, and less expensively, by calculating the amount of electron-magnetic radiation reflected from agricultural land. The data is collected by orbiting satellites.

B Examining the wavelength of the radiation that is reflected can reveal, with surprising precision, the properties of the soil, the quantity of crop being grown, and the levels in those crops of chlorophyll, various minerals, moisture and other indicators of their quality. If recent and forecast weather data is added to the mix, detailed maps can be produced indicating exactly how, where and when crops should be grown. The service usually costs less than US $15 per hectare for a handful of readings a year, and can increase yields by as much as 10%.

C Such precision farming using satellite-based intelligence is a relatively new technique. Even so, it is catching on quickly. Five times a year, for example, a French cereal-growers' co-operative called Sevepi purchases satellite data and makes it available to its members in the form of maps of their fields, divided into three or four colour-coded zones per hectare. For each zone, one of about 50 fertiliser formulas is recommended. On top of this, if the wheat in the field has already grown quite high early in the season, and heavy showers are expected, an appropriate dose of growth regulator is recommended for each zone. (Lone, fragile stems break more easily in downpours.) Then, farm vehicles equipped with global-positioning system locators automatically mix and apply the prescribed dose to each area.

D France is the pioneer in this sort of surveillance. More farmland is analysed by satellite there than in any other country, according to Infoterra (a subsidiary of EADS Astrium), the firm that is France's largest provider of such information, supplying data to companies such as Sevepi. Moreover, Henri Douche, head of Infoterra's agriculture sales in Toulouse, reckons the amount of monitored farmland will increase as weather patterns change and farmers can no longer rely on the past as a guide to the future. When confounded by the yield variations that these new weather patterns will bring, even farmers who are afraid of new technology will sign up, he says.

E Inexpensive data on the productivity of land is advantageous to governments, too. Areas where fertilisers and pesticides are being applied excessively can be pinpointed, studied and regulated by environmental and land-use agencies. Guy Lafond, an agronomist with Agriculture and Agri-food Canada, a government agency, says the satellite data it purchases is providing useful for the study of fields with declining productivity in the province of Saskatchewan. Overkill with nitrate fertilisers (which are also a source of greenhouse gases) appears partly responsible. And according to RapidEye, a German satellite operator, insurance companies are also studying satellite data with a view to selling insurance policies to governments of famine-prone countries that might be threatened by crop failure.

F In March, RapidEye began selling data that helps forecast harvest. "Too often, farmers limit productivity by managing fields uniformly," says Fredrick Jung-Rothenhauser, head of product development at the firm's headquarters in Brandenburg an der Havel. "Our satellites are the first commercial satellites to include the Red-Edge band of the light spectrum, which is sensitive to changes in chlorophyll content. More research will be necessary to realise the full potential of the Red-Edge band. However, this band can assist in monitoring vegetation health, improving species separation and also help in measuring protein and nitrogen content in biomass." The company's data, which comes from both Europe and the Americas, breaks field productivity down into patches just five metres square.

G The advantage that satellite technology provides in terms of precision farming do not have to be restricted to rich countries. In Africa, where many soils have become badly depleted of nutrients, better fertiliser management would greatly improve the situation. As a consequence, the charitable trust World Agroforestry Centre, in the city of Nairobi, in Kenya, has begun to build up a catalogue of the radiation patterns derived from around 100,000 samples of African soils. The information is the key to understanding the potential of these soils to be more agriculturally productive. Once passed on to the International Center for Tropical Agriculture, based in Colombia, South America, it is intended that the information be used to build a database called the "Digital Soil Map". When ready, this will provide farmers with free forecasts, developed with regularly updated satellite imagery, across farmland in a number of countries in Africa. This is information which will almost certainly assist in improving crop yield. For a hunger-ravaged continent, that is good news indeed.
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 2 has seven paragraphs, A–G. Which paragraph contains the following information? Write the correct letter, A–G, in boxes 14–20 on your answer sheet. NB You may use any letter more than once.',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      items: [
        { q: 'an example of how farmers in one country are now using satellite data to determine fertiliser use', a: 'C',
          ev: 'For each zone, one of about 50 fertiliser formulas is recommended',
          en: 'Paragraph C: the French co-operative Sevepi gives its members satellite maps, and "for each zone, one of about 50 fertiliser formulas is recommended".' },
        { q: 'a reference to climate change and its effects', a: 'D',
          ev: 'as weather patterns change and farmers can no longer rely on the past as a guide to the future',
          en: 'Paragraph D: "weather patterns change" and bring "yield variations".' },
        { q: 'a reference to the effect on the soil of using too much fertiliser', a: 'E',
          ev: 'Overkill with nitrate fertilisers (which are also a source of greenhouse gases) appears partly responsible',
          en: 'Paragraph E: fields with "declining productivity" – "overkill with nitrate fertilisers ... appears partly responsible".' },
        { q: 'an example of information that will be shared between different countries', a: 'G',
          ev: 'Once passed on to the International Center for Tropical Agriculture, based in Colombia, South America',
          en: 'Paragraph G: soil data collected in Kenya will be "passed on to the International Center for Tropical Agriculture, based in Colombia".' },
        { q: 'a mention of the country which is the leader in agricultural technology', a: 'D',
          ev: 'France is the pioneer in this sort of surveillance',
          en: 'Paragraph D: "France is the pioneer in this sort of surveillance" (pioneer = leader).' },
        { q: 'a description of an innovation in satellite imaging which requires further study', a: 'F',
          ev: 'More research will be necessary to realise the full potential of the Red-Edge band',
          en: 'Paragraph F: the new "Red-Edge band" – "More research will be necessary to realise the full potential".' },
        { q: 'evidence of the cost effectiveness of using satellite technology in agriculture', a: 'B',
          ev: 'The service usually costs less than US $15 per hectare for a handful of readings a year, and can increase yields by as much as 10%',
          en: 'Paragraph B: it "costs less than US $15 per hectare" and "can increase yields by as much as 10%".' }
      ] },
    { type: 'mcq-multi',
      group: 'Choose TWO letters, A–E. Write the correct letters in boxes 21 and 22 on your answer sheet.',
      items: [
        { q: 'Which TWO companies obtain information directly from satellites?', a: 'B,D',
          opts: ['A. Sevepi', 'B. Infoterra', 'C. Agriculture and Agri-food Canada', 'D. RapidEye', 'E. World Agroforestry Centre'],
          ev: ['the firm that is France\'s largest provider of such information, supplying data to companies such as Sevepi', 'RapidEye, a German satellite operator'],
          en: 'Infoterra is the "provider of such information, supplying data to companies such as Sevepi", and RapidEye is "a German satellite operator" with its own satellites. Sevepi and the Canadian agency buy the data.' }
      ] },
    { type: 'completion',
      group: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 23–26 on your answer sheet.',
      items: [
        { q: 'Initially, orbiting satellites are used to measure ____ coming from farmland.', a: 'electron-magnetic radiation|electromagnetic radiation',
          ev: 'calculating the amount of electron-magnetic radiation reflected from agricultural land',
          en: 'Prescriptions come from "calculating the amount of electron-magnetic radiation reflected from agricultural land"; "the data is collected by orbiting satellites".' },
        { q: '____ believes that confusion about irregular weather will cause more farmers to use satellite technology.', a: 'Henri Douche|Douche',
          ev: 'even farmers who are afraid of new technology will sign up, he says',
          en: 'Henri Douche of Infoterra: "When confounded by the yield variations that these new weather patterns will bring, even farmers who are afraid of new technology will sign up".' },
        { q: 'As a result of satellite technology, it may become possible to insure against the risk of ____.', a: 'crop failure',
          ev: 'with a view to selling insurance policies to governments of famine-prone countries that might be threatened by crop failure',
          en: 'Insurance companies study satellite data "with a view to selling insurance policies" to countries "threatened by crop failure".' },
        { q: 'In Africa, much of the soil suffers from the loss of ____.', a: 'nutrients',
          ev: 'many soils have become badly depleted of nutrients',
          en: '"In Africa, where many soils have become badly depleted of nutrients" (depleted = lost).' }
      ] }
  ]
};
