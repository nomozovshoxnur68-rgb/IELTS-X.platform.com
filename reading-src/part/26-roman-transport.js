/* Transport and transport systems during the Roman Empire — Reading Passage 1, Questions 1–13 (from Transport during the Roman Empire - Passage 1.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'roman-transport',
  title: 'Transport and transport systems during the Roman Empire',
  passageLabel: 'Passage 1',
  cardTypes: ['True False Not Given', 'Note Completion'],
  passage: `
400,000 kilometres of road, relays of fresh horses and a seat on somebody else’s cargo ship

At the height of the Roman Empire in the 2nd century AD, it was not uncommon for Romans to travel long distances by road across Europe and beyond. In fact, it was actually quite easy to travel, thanks to the empire’s highly developed road and shipping networks. It has been calculated that Roman roads covered a total distance of over 400,000 kilometres, with more than 120,000 kilometres of this being of the type known as ‘public roads’ and a second system classified as ‘military roads’, both constructed by soldiers. The roads spread across the empire from Britain in the north to Morocco in the south, from Portugal in the west to Iraq in the east. Roads played a crucial role in the maintenance of the empire, allowing people and goods to move relatively swiftly. Tolls were charged for the use of many major roads, with stations where these tolls were paid often situated at bridges or at city gates.

Having the elaborate road network also meant that Roman troops could be sent rapidly to various parts of the empire in the event of emergencies, such as internal revolts or external threats. Therefore, the existence of these roads reduced the number of large and costly garrisons* needed throughout the empire.

Ordinary Romans would travel in a raeda, a carriage with four wooden wheels covered with iron and pulled by up to four horses. The raeda was the equivalent of the bus today. It had wooden benches inside for passengers, and a cloth top or sometimes no top at all. Rich Romans travelled in a carpentum, which was essentially a luxury vehicle for the wealthy. The carpentum had four wheels, a wooden arched rooftop and seats. It was pulled by many horses and was built incorporating a form of suspension to make the ride less bumpy and disagreeable. Romans also had a vehicle, called a plaustrum, that did not normally carry passengers – what would be considered a truck today. The plaustrum, constructed with a flat wooden base over four thick wheels and drawn by two oxen, was designed to carry heavy loads. It was very slow and could cover only 15 to 25 kilometres per day.

The fastest way to travel over heavily trafficked routes was by the cursus publicus. This was like a state-run postal service, but was also used to transport government or military officials. A certificate issued by the emperor was required in order to use the service. A series of stations with fresh horses were built at short regular intervals of approximately 12 kilometres along the major road systems. It has been estimated that a typical trip by relays of horses was made at a rate of 66 to 103 kilometres per day.

Because of their iron-shod wheels, Roman vehicles made a lot of noise and were therefore forbidden by law from entering the vicinity of big Roman cities during the day. Fortunately, many roads had stations, called mansiones, where Roman travellers could stop and break their journey, the equivalent of motorway rest areas today. These sometimes included inns where tired travellers could drink, eat and sleep. The stations were built by the government at regular intervals of 25 to 30 kilometres. One of the factors that meant such roads could be safely used for trade was the fact that they were patrolled by the Roman army. Merchants knew that they would usually be protected from bandits and highwaymen.

It was not uncommon for well-to-do Romans to travel as tourists to places relatively far away such as Greece and Egypt. For this, they would often have to sail across the Mediterranean Sea, but as there were no regular passenger services, they travelled on ships which were transporting goods. Tourists had to find a ship, get the captain’s approval and negotiate a price with him. Fortunately, there were many merchant ships going back and forth regularly along established routes in the Mediterranean, so tourists had little difficulty finding a ship going to their chosen destination. Most Roman tourists would travel on the open deck of the ship, sometimes with hundreds of people crowded together. Food was not included in the price of transport, so passengers had to supply their own. Certain merchant ships provided cabins at the rear that could accommodate the richer passengers. Meanwhile, the wealthiest Romans had their own ships and employed a crew to sail them, much like on big private yachts today.

Travelling by ship in Roman times was relatively fast. For example, going from Brindisium in Italy to Patrae in Greece would take about three days. Commercial navigation was suspended during particularly bad storms, when the Mediterranean was too rough and dangerous for ships to sail.

* garrison: a group of soldiers stationed in a fortress or town to defend it
`,
  groups: [
    { type: 'tfng',
      group: 'Do the following statements agree with the information given in Reading Passage 1? In boxes 1–7 on your answer sheet, write',
      items: [
        { q: 'The Roman military was responsible for building the ‘public roads’.', a: 'TRUE',
          ev: 'both constructed by soldiers',
          en: 'The \'public roads\' and the \'military roads\' were "both constructed by soldiers".' },
        { q: 'The Roman road network made it necessary to establish more garrisons.', a: 'FALSE',
          ev: 'the existence of these roads reduced the number of large and costly garrisons',
          en: 'Troops could move fast, so "the existence of these roads reduced the number of large and costly garrisons".' },
        { q: 'Travel by raeda was usually only for short distances.', a: 'NOT GIVEN',
          en: 'The raeda is compared to a bus, but the length of its journeys is not mentioned.' },
        { q: 'A carpentum was constructed with some consideration for passenger comfort.', a: 'TRUE',
          ev: 'built incorporating a form of suspension to make the ride less bumpy and disagreeable',
          en: 'It had "a form of suspension to make the ride less bumpy and disagreeable".' },
        { q: 'People wanting to use the cursus publicus service needed official permission.', a: 'TRUE',
          ev: 'A certificate issued by the emperor was required in order to use the service',
          en: '"A certificate issued by the emperor was required in order to use the service."' },
        { q: 'Mansiones were usually located where several main roads met.', a: 'NOT GIVEN',
          en: 'Mansiones were built "at regular intervals of 25 to 30 kilometres"; road junctions are not mentioned.' },
        { q: 'Private businessmen constructed the mansiones.', a: 'FALSE',
          ev: 'The stations were built by the government at regular intervals of 25 to 30 kilometres',
          en: '"The stations were built by the government", not by private businessmen.' }
      ] },
    { type: 'completion', title: 'Roman travel by ship',
      group: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 8–13 on your answer sheet.',
      items: [
        { q: 'Passengers normally travelled on ships used mostly for carrying goods. Passengers wishing to travel by ship had to discuss and agree on a ____ with its captain', a: 'price',
          ev: 'get the captain’s approval and negotiate a price with him',
          en: 'Tourists had to "get the captain\'s approval and negotiate a price with him".' },
        { q: 'the ships travelled frequently on fixed ____, so arranging a specific journey was relatively easy', a: 'routes|route',
          ev: 'going back and forth regularly along established routes in the Mediterranean',
          en: 'Merchant ships went "back and forth regularly along established routes" (established = fixed).' },
        { q: 'passengers on ships usually stayed on the ____', a: 'deck',
          ev: 'Most Roman tourists would travel on the open deck of the ship',
          en: '"Most Roman tourists would travel on the open deck of the ship."' },
        { q: 'some ships had ____ for those passengers who could afford them', a: 'cabins|cabin',
          ev: 'Certain merchant ships provided cabins at the rear that could accommodate the richer passengers',
          en: 'Some ships "provided cabins at the rear that could accommodate the richer passengers".' },
        { q: 'the very rich hired a ____ for their privately owned ships', a: 'crew',
          ev: 'the wealthiest Romans had their own ships and employed a crew to sail them',
          en: '"The wealthiest Romans had their own ships and employed a crew to sail them."' },
        { q: '____ could sometimes cause sailings to be cancelled', a: 'storms|storm',
          ev: 'Commercial navigation was suspended during particularly bad storms',
          en: '"Commercial navigation was suspended during particularly bad storms" (suspended = cancelled).' }
      ] }
  ]
};
