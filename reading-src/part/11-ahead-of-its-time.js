/* Ahead of its time — Reading Passage 1, Questions 1–13 (from Ahead_of_its_time_P1.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'ahead-of-its-time',
  title: 'Ahead of its time',
  passageLabel: 'Passage 1',
  cardTypes: ['True False Not Given', 'Flow-chart Completion', 'Note Completion'],
  passage: `
A chance discovery in New Zealand has challenged the country’s recorded history

One October afternoon, a young New Zealander, Sam Tobin, called his dogs and went for a walk down to the nearby Ruamahanga River. Having been very high for days, the river had at last fallen, and Tobin was eager to see what changes the floods had brought. The family farm borders the river, and a four-metre-high flood bank testifies to its natural tendency to flood.

Tobin stepped out onto a broad shoulder of river sand, where he noticed what he initially took to be a whitish rock, lit by the sun. Then, getting closer, he realised it was a bone. Such a thing was not uncommon in these parts – he had often come home with fragments, or even whole skeletons, of cows and sheep. But as he scraped aside a stone he realized that it was a human bone, something quite new in his experience. As he picked it up, he saw it was a skull, discoloured with age.

Tobin replaced the skull and hurried home to tell his mother what the river had delivered to their doorstep. It would prove to be a spectacular find, setting in motion an investigation by some of the country’s most respected specialists, and ultimately challenging our most firmly held assertions about the human settlement of New Zealand.

The police were immediately called, but despite a thorough search they could find nothing that might shed light on the identity of the Ruamahanga skull, or the circumstances of its sudden appearance. The skull was then taken north to be examined by forensic pathologist Dr Ferris at Auckland Hospital. Despite being hampered by its damaged and incomplete condition – the jawbone and lower left portion of the cranium were missing – Dr Ferris determined that the skull was that of a female. He then consulted with a colleague, Dr Koelmeyer, who believed that the deterioration of the bone placed the time of death ‘before living memory’ and, most significantly as it would turn out, the skull appeared to be European in origin.

Wellington-based forensic anthropologist Dr Watt also examined the skull, and suggested it belonged to a 40–45-year-old. He believed that it could be the remains of an old farm burial, but was not certain, and proposed the use of radiocarbon dating to make sure it wasn’t a recent death. As a result, the Institute of Geological and Nuclear Sciences (GNS) in Lower Hutt was contacted, and provided with a sample of bone that had originated in the top of the skull. In a little over three weeks, the seemingly astonishing results from the GNS laboratory came back. Cutting through the bewildering complexity of the scientific analysis was a single line reading: conventional radiocarbon age approximately 296 years. This was staggering, for the skull was about 200 years older than Dr Koelmeyer had believed.

Of course, a skull of this age wasn’t particularly unusual in New Zealand. The Maori people have been living in the country for at least 800 years and scientists frequently come across human remains of considerable age. The fascinating question, however, was how a skull of this race, let alone this gender, had reached these remote islands in the South Pacific at such a time, long before the arrival of the explorer Captain Cook in 1769, and perhaps even before the very first European landfall – the fleeting visit of the Dutch explorer Tasman in 1642 – neither of whom had women among their crews.

The first known European women in the Pacific came with a doomed colonising venture which sailed from Peru in 1595 under the command of Spanish captain Mendana. However, it is unlikely the Ruamahanga skull originated from this expedition because no evidence of Mendana’s ships has ever been found in New Zealand, while a team of archaeologists working in the Solomon Islands in 1970 did discover the remains of European vessels dating from the 16th century.

Two centuries were to pass before the first recorded European females arrived in New Zealand, both having escaped from prison in Australia. Kathleen Hagerty and Charlotte Edgar are known to have reached the country in 1806. How then do we account for the Ruamahanga skull, which appears to be about 100 years older than that? It is impossible to say with certainty, but the most likely explanation is that a Spanish or Portuguese trading ship was washed onto these wild shores as a result of a shipwreck and a woman got ashore. Implausible, perhaps, but the Ruamahanga skull, today resting in the Wellington Museum, could be the kind of concrete evidence that demands such a drastic re-evaluation of history.
`,
  groups: [
    { type: 'tfng',
      group: 'Do the following statements agree with the information given in Reading Passage 1? In boxes 1–4 on your answer sheet, write',
      items: [
        { q: 'The Ruamahanga River often floods.', a: 'TRUE',
          ev: 'a four-metre-high flood bank testifies to its natural tendency to flood',
          en: 'The flood bank "testifies to its natural tendency to flood".' },
        { q: 'When Tobin first found the object in the river, he mistook it for something else.', a: 'TRUE',
          ev: 'he noticed what he initially took to be a whitish rock',
          en: 'He "initially took" it "to be a whitish rock", then realised it was a bone.' },
        { q: 'Tobin could not decide what part of the body the bone came from.', a: 'FALSE',
          ev: 'As he picked it up, he saw it was a skull',
          en: 'He knew it was human, and "as he picked it up, he saw it was a skull".' },
        { q: 'Tobin’s mother was surprised that the skull caused debate among specialists.', a: 'NOT GIVEN',
          en: 'Tobin told his mother about the find, but her reaction to the specialists\' investigation is not described.' }
      ] },
    { type: 'completion', title: 'The events after the river flooded',
      group: 'Complete the flow-chart below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer. Write your answers in boxes 5–9 on your answer sheet.',
      items: [
        { q: 'Tobin found a human skull ↓ The ____ were initially involved in trying to explain the presence of the skull.', a: 'police|the police',
          ev: 'The police were immediately called, but despite a thorough search they could find nothing',
          en: '"The police were immediately called", but they could find nothing about the skull.' },
        { q: '↓ Dr Ferris believed the skull belonged to a female ↓ Dr Koelmeyer suggested it was a ____ skull.', a: 'European',
          ev: 'the skull appeared to be European in origin',
          en: 'Dr Koelmeyer believed "the skull appeared to be European in origin".' },
        { q: '↓ Dr Watt recommended ____ to establish the skull’s age.', a: 'radiocarbon dating',
          ev: 'proposed the use of radiocarbon dating to make sure it wasn’t a recent death',
          en: 'Dr Watt "proposed the use of radiocarbon dating to make sure it wasn\'t a recent death".' },
        { q: '↓ A bone ____ was sent to the GNS.', a: 'sample|a sample',
          ev: 'provided with a sample of bone that had originated in the top of the skull',
          en: 'The GNS was "provided with a sample of bone".' },
        { q: '↓ The age of the skull was about ____ years.', a: '296',
          ev: 'conventional radiocarbon age approximately 296 years',
          en: 'The result: "conventional radiocarbon age approximately 296 years".' }
      ] },
    { type: 'completion', title: 'Problem of the skull’s origins',
      group: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 10–13 on your answer sheet.',
      items: [
        { q: 'Old bone is common in NZ – Maori living there for 800 years. The Ruamahanga skull is surprising because of its age, its ____ and its gender.', a: 'race',
          ev: 'how a skull of this race, let alone this gender, had reached these remote islands',
          en: 'The question was "how a skull of this race, let alone this gender, had reached these remote islands".' },
        { q: 'Mendana expedition: a possible source of the skull, but the expedition probably did not visit NZ. Evidence of this expedition was found elsewhere by ____.', a: 'archaeologists',
          ev: 'a team of archaeologists working in the Solomon Islands in 1970 did discover the remains of European vessels',
          en: '"A team of archaeologists working in the Solomon Islands in 1970 did discover the remains of European vessels."' },
        { q: 'New Zealand: the first European explorer arrived in 1642. Hagerty and Edgar arrived in 1806 from ____ where they had been imprisoned.', a: 'Australia',
          ev: 'both having escaped from prison in Australia',
          en: 'The first European women arrived "having escaped from prison in Australia".' },
        { q: 'Possible solution: the Ruamahanga skull may have reached NZ in the 17th century after a ____.', a: 'shipwreck',
          ev: 'was washed onto these wild shores as a result of a shipwreck and a woman got ashore',
          en: 'The most likely explanation: a ship "was washed onto these wild shores as a result of a shipwreck".' }
      ] }
  ]
};
