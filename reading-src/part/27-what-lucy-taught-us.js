/* What Lucy Taught Us — Reading Passage 1, Questions 1–13 (from What Lucy Taught Us - Passage 1.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'what-lucy-taught-us',
  title: 'What Lucy Taught Us',
  passageLabel: 'Passage 1',
  cardTypes: ['True False Not Given', 'Sentence Completion'],
  passage: `
A scientific finding in East Africa has changed our understanding of how humans have developed

On a Sunday morning in late November 1974, a team of scientists was digging in an isolated spot in the Afar region of Ethiopia. Surveying the area, palaeoanthropologist Donald Johanson spotted a small piece of bone. Straight away, he recognised it as coming from the elbow of a human ancestor. And there were plenty more. ‘As I looked up the slopes to my left, I saw bits of the skull, a chunk of jaw, a couple of vertebrae,’ says Johanson.

It was immediately obvious that the skeleton was a significant find because the sediments at the site were known to be 3.5 million years old. ‘I realised this was part of a skeleton that was older than three million years,’ says Johanson. It was the most ancient early human ever found. Later it became apparent that it was also the most complete – 40% of the skeleton had been preserved.

At the group’s campsite that night, Johanson played a Beatles song called ‘Lucy in the Sky with Diamonds’, and, as the feeling was that the skeleton was female due to its size, someone suggested calling it Lucy. The name stuck and Johanson says, ‘All of a sudden, she became a person.’ But the morning after the discovery, the discussion was dominated by questions. How old was Lucy when she died? Did she have children? And might she be our direct ancestor? Nowadays, we’re starting to get the answers to some of these questions.

According to Johanson, Lucy had an incredible combination of primitive and derived features, which had not been seen before. Her skull and jaws were more ape-like than those of other groups of early humans. Her braincase was also very small, no bigger than that of a chimp. She had a hefty jaw, a low forehead and long dangly arms.

For Johanson, it was immediately apparent that Lucy walked upright. That’s because the shape and positioning of her pelvis reflected a fully upright gait. Lucy’s knee and ankle were also preserved and seemed to reflect bipedal walking. Later studies of feet offer even more evidence. As an upright walker, Lucy strengthened the idea that walking was one of the selective pressures driving human evolution forward. Early humans did not need bigger brains to take defining steps away from apes. Extra brainpower only came over a million years later with the arrival of the species Homo erectus, meaning upright man. Though big brains would clearly be important later, walking remains one of the traits that makes us uniquely human.

She may have walked like a human, but Lucy spent at least some of her time up in the trees, as chimpanzees and orangutans still do today. It may be that upright walking evolved in the trees, as a way to walk along branches that would otherwise be too flexible. It’s not clear why Lucy left the safety of the trees. It is thought that savannahs were gradually opening up, so trees were spaced further apart. But hunting for food may have been the real reason for heading to the ground, says Chris Stringer of the Natural History Museum in London. In line with this idea, recent evidence suggests that the diet of early humans was changing at that time.

Studies of the remains of food trapped on preserved human teeth indicate that several species, including Lucy’s, were expanding their diet around 3.5 million years ago. Instead of mostly eating fruit from trees, they began to include grasses and possibly meat. This change in diet may have allowed them to range more widely and to travel around more efficiently in a changing environment. Fossilised crocodile and turtle eggs were found near her skeleton, suggesting that Lucy died while foraging for them in a nearby lake.

How did early humans process all these new foods? Later species, like Homo erectus, are known to have used simple stone tools, but no tools have ever been found from this far back. However, in 2010 archaeologists uncovered animal bones with scratches that seem to have been made by stone tools. This suggests that Lucy and her relatives used stone tools to eat meat. There have since been heated debates over whether or not the marks were really made by tools. But if they were, it is not surprising, says Fred Spoor of the Max Planck Institute for Evolutionary Anthropology in Leipzig, Germany.

It also seems that Lucy’s childhood was much briefer than ours and that she had to fend for herself from a young age. We know that Lucy was a full-grown adult because she had wisdom teeth and her bones had fused. But unlike modern humans, she seems to have grown to full size very quickly, and her time of death was when she was around 12 years old. In line with that, a recent study of a 3-year-old early human suggested that their brains matured much earlier than ours do.
`,
  groups: [
    { type: 'tfng',
      group: 'Do the following statements agree with the information given in Reading Passage 1? In boxes 1–5 on your answer sheet, write',
      items: [
        { q: 'Donald Johanson was uncertain about the nature of the elbow bone he found in Afar.', a: 'FALSE',
          ev: 'Straight away, he recognised it as coming from the elbow of a human ancestor',
          en: '"Straight away, he recognised it as coming from the elbow of a human ancestor" – he was certain.' },
        { q: 'Several bones were found by Donald Johanson at the same site in Afar.', a: 'TRUE',
          ev: 'I saw bits of the skull, a chunk of jaw, a couple of vertebrae',
          en: '"And there were plenty more": "bits of the skull, a chunk of jaw, a couple of vertebrae".' },
        { q: 'The experts realised the importance of the discovery at Afar.', a: 'TRUE',
          ev: 'It was immediately obvious that the skeleton was a significant find',
          en: '"It was immediately obvious that the skeleton was a significant find."' },
        { q: 'It was the upper part of the skeleton that had suffered the least damage.', a: 'NOT GIVEN',
          en: '"40% of the skeleton had been preserved", but which part was least damaged is not said.' },
        { q: 'The skeleton’s measurements helped Johanson’s team to decide if it was male or female.', a: 'TRUE',
          ev: 'as the feeling was that the skeleton was female due to its size',
          en: '"The feeling was that the skeleton was female due to its size."' }
      ] },
    { type: 'completion',
      group: 'Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 6–13 on your answer sheet.',
      items: [
        { q: 'Upright movement possibly started among the ____ of trees.', a: 'branches|branch',
          ev: 'as a way to walk along branches that would otherwise be too flexible',
          en: 'Upright walking may have "evolved in the trees, as a way to walk along branches".' },
        { q: 'Lucy probably moved to the ____ in search of food.', a: 'ground',
          ev: 'But hunting for food may have been the real reason for heading to the ground',
          en: '"Hunting for food may have been the real reason for heading to the ground."' },
        { q: 'Analysis of food in the ____ of the skeletons of early humans shows changes in their diet.', a: 'teeth',
          ev: 'Studies of the remains of food trapped on preserved human teeth',
          en: '"Studies of the remains of food trapped on preserved human teeth" show the diet was "expanding".' },
        { q: 'It is likely that meat and grasses were substituted for ____.', a: 'fruit',
          ev: 'Instead of mostly eating fruit from trees, they began to include grasses and possibly meat',
          en: '"Instead of mostly eating fruit from trees, they began to include grasses and possibly meat."' },
        { q: '____ that were located close to Lucy suggest these were also part of her diet.', a: 'eggs|egg',
          ev: 'Fossilised crocodile and turtle eggs were found near her skeleton',
          en: '"Fossilised crocodile and turtle eggs were found near her skeleton", so she may have died "foraging for them".' },
        { q: '____ that were found had marks on them, possibly made by tools used for eating.', a: 'bones|bone',
          ev: 'archaeologists uncovered animal bones with scratches that seem to have been made by stone tools',
          en: 'In 2010 "archaeologists uncovered animal bones with scratches that seem to have been made by stone tools".' },
        { q: 'Modern-day humans have a longer ____ than Lucy did.', a: 'childhood',
          ev: 'Lucy’s childhood was much briefer than ours',
          en: '"Lucy\'s childhood was much briefer than ours."' },
        { q: 'The ____ of modern-day humans appear to develop later than Lucy’s did.', a: 'brains|brain',
          ev: 'their brains matured much earlier than ours do',
          en: 'Early humans\' "brains matured much earlier than ours do".' }
      ] }
  ]
};
