/* All in the Family — Reading Passage 3, Questions 27–40 (from All in the Family.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'all-in-the-family',
  title: 'All in the Family',
  passageLabel: 'Passage 3',
  cardTypes: ['Yes No Not Given', 'Multiple Choice', 'Summary Completion'],
  passage: `
A person’s brothers and sisters can have a powerful effect on their adult behaviour

We can choose our friends, the saying goes, but we cannot choose our family of origin. Our parents provide the genetic material and make powerful early role models, but even more influential in determining what kind of adult we will become are our brothers and sisters — our siblings. They occupy a position of unique intimacy in our lives and cast a longer shadow than many recognize or are prepared to acknowledge. By turns enraging and lovable, familiar and mysterious, our brothers and sisters are the human beings who people our first social relationships. And a sibling relationship is the most enduring relationship many of us will ever have, less emotionally intense than the bonds we form with our spouses and our own children if only because they started when we were so young.

Surprising new research by Dr Gene Brody found that having older children who do well in school and are well liked by other children leads to parental 'basking' — increasing mothers' self-esteem. It is clear that in turn this is associated with more positive parenting of younger children, who display fewer behavioural problems as a result. Conversely, parents who get a difficult first child may in turn experience a negative spiral of household tension.

International sports star Piri Weepu is a rugby hard man, but at least some of his tough temperament was forged long ago in the family home. His older brother Billy started rugby-tackling little Piri when he was just four — to 'harden him up'. It seemed to work: Piri followed his brother in playing for the under-sevens league before he even started school. There are as many such stories as there are families: in the formative hothouse of the family, siblings interact in complex ways with the powerful force fields of parents, genetics and personality already at work. It starts with birth order, which determines play roles: the firstborn leader, the middle-child mediator and the rebellious youngest. These are roles that can stick for life.

Clinical psychologist Claire Cartwright says she has clients who believe, and it might not have been true, that they were treated differently from their siblings, that one child in the family was preferred over others. They are quite convinced that the parental judgments on them all those years ago were harsher, and that they were the ones who always got into trouble. Later, in the workplace, such a person might be particularly defensive, and so behave in a way more prone to attracting harsh judgements.

However, the research shows that being Mummy or Daddy's favourite has its own traps. If you were the easy-going, co-operative child at home, you probably excelled at pleasing parents and, later, bosses. But you might, as an adult, find it hard to be assertive with authority figures and lack direction. On the other hand, the sibling who is disruptive and annoying as a child may be able to reinterpret that role later, turning those attention-seeking characteristics into strengths like determination and leadership.

How is it that full siblings, despite sharing DNA, can turn out so differently? One answer is that, in fact, each sibling grows up in a different family, a unique micro-culture. For example, the firstborn is, for a while, an only child, and therefore has a completely different experience of the parents than those born later. The parents themselves are growing up too, weathering hardship or good fortune, so one sibling might experience stability and closeness while another might be raised in the midst of crisis.

Of course, there are many positive aspects of sibling relationships. Annette Henderson, a lecturer in psychology, says firstborn children learn vocabulary more quickly than their siblings because they are not competing to spend one-on-one time with parents. But younger children in turn benefit from unintentional instruction from their bigger brothers and sisters, acquiring entire phrases and an understanding of social concepts such as politeness. Similarly, a Cambridge University study of 140 children found that even when there is a great deal of conflict, siblings will still create a rich world of play and make-believe that extends them developmentally. Love-hate relationships were common among the children, but even those who fought the most had as many positive interactions as the other sibling pairs. It is also true that children compete for parental attention by making themselves different from their brothers and sisters, particularly if they are close in age. A 2003 research paper studied adolescents from 185 families over two years, finding that those who changed, to differentiate themselves from their siblings, increased the amount of warmth they gained from parents, and also developed stronger personalities and a better sense of their own identity.

Another consideration is that many families today are smaller and more intimate than their historical counterparts. This may be advantageous because siblings tend to know each other better and remain lifelong friends compared to children from bigger or more widely spaced families, who perhaps lose touch with one another after leaving home. Then there was a 2010 American study which found that having a sister, whether younger or older, meant that 10- to 14-year-olds were less likely to feel lonely, unloved, self-conscious or fearful. The same study found that having a loving sibling of either gender promoted good deeds, such as helping a neighbor around the house or helping other children at school.
`,
  groups: [
    { type: 'ynng',
      group: 'Do the following statements agree with the views of the writer in Reading Passage 3? In boxes 27–30 on your answer sheet, write',
      items: [
        { q: 'Parents and siblings play equal roles in shaping people’s adult personalities.', a: 'NO',
          ev: 'but even more influential in determining what kind of adult we will become are our brothers and sisters',
          en: 'Siblings are "even more influential" than parents in deciding "what kind of adult we will become" – not equal.' },
        { q: 'People’s first social relationships tend to be with siblings of their own gender.', a: 'NOT GIVEN',
          en: 'Siblings are "the human beings who people our first social relationships", but their gender is not mentioned.' },
        { q: 'People’s relationships with their siblings tend to receive less attention when they marry.', a: 'NOT GIVEN',
          en: 'The bond with siblings is compared with the bond with spouses, but nothing is said about it getting less attention after marriage.' },
        { q: 'Parental ‘basking’ is advantageous for later siblings.', a: 'YES',
          ev: 'this is associated with more positive parenting of younger children',
          en: 'Basking "is associated with more positive parenting of younger children, who display fewer behavioural problems".' }
      ] },
    { type: 'mcq',
      group: 'Choose the correct letter, A, B, C or D. Write the correct letter in boxes 31–34 on your answer sheet.',
      items: [
        { q: 'What point does the writer make about birth order in the third paragraph?', a: 'B',
          opts: ['A. Its role is underestimated by parents.', 'B. It may shape the characteristics of adults.', 'C. Its importance decreases as children grow up.', 'D. It has more influence on personality than genetics.'],
          ev: 'These are roles that can stick for life',
          en: 'Birth order "determines play roles" – leader, mediator, rebel – and "these are roles that can stick for life".' },
        { q: 'What are we told about some of Claire Cartwright’s clients?', a: 'C',
          opts: ['A. Their parents treated them fairly.', 'B. They were treated harshly by their siblings.', 'C. Their perceptions of childhood may be inaccurate.', 'D. They have closer relations with their siblings as adults.'],
          ev: 'she has clients who believe, and it might not have been true, that they were treated differently from their siblings',
          en: 'They believe they were treated differently, "and it might not have been true".' },
        { q: 'What is the writer’s main point about siblings in the fifth paragraph?', a: 'C',
          opts: ['A. Parents tend to repeat their own parents’ mistakes.', 'B. Favoured children are likely to make good leaders as adults.', 'C. Negative characteristics in children can become positive in adults.', 'D. Attention-seeking children are unlikely to please bosses in later life.'],
          ev: 'may be able to reinterpret that role later, turning those attention-seeking characteristics into strengths',
          en: 'A disruptive child may later turn "attention-seeking characteristics into strengths like determination and leadership".' },
        { q: 'Which of the following best summarises the writer’s argument in the sixth paragraph?', a: 'D',
          opts: ['A. Many children have a favourite parent.', 'B. Parenting skills improve with later children.', 'C. Siblings are born with different personalities.', 'D. The family environment may change over time.'],
          ev: 'each sibling grows up in a different family, a unique micro-culture',
          en: '"Each sibling grows up in a different family": the parents change, and one child may know "stability" while another grows up "in the midst of crisis".' }
      ] },
    { type: 'matching', title: 'List of Words',
      group: 'Complete the summary (The positive aspects of sibling relationships) using the list of words, A–K, below. Write the correct letter, A–K, in boxes 35–40 on your answer sheet.',
      options: ['A. parental love', 'B. imaginative games', 'C. physical development', 'D. generous behaviour', 'E. strong marriages', 'F. greater individuality', 'G. learning experiences',
        'H. career success', 'I. closer relationships', 'J. healthy competition', 'K. mental well-being'],
      items: [
        { q: 'Annette Henderson suggests that young children’s interactions with older siblings involve ____.', a: 'G',
          ev: 'younger children in turn benefit from unintentional instruction from their bigger brothers and sisters',
          en: 'Younger children "benefit from unintentional instruction" and learn phrases and social concepts – learning experiences.' },
        { q: 'Also, a Cambridge study found that siblings still enjoy ____ even when they have a tendency to fight.', a: 'B',
          ev: 'siblings will still create a rich world of play and make-believe',
          en: 'Even with conflict, "siblings will still create a rich world of play and make-believe".' },
        { q: 'Research conducted in 2003 suggests that children develop ____ as a result of seeking attention.', a: 'F',
          ev: 'developed stronger personalities and a better sense of their own identity',
          en: 'Those who made themselves different "developed stronger personalities and a better sense of their own identity".' },
        { q: 'Another factor is the trend for smaller families, which may mean that today’s siblings enjoy ____ as adults.', a: 'I',
          ev: 'siblings tend to know each other better and remain lifelong friends',
          en: 'In smaller families "siblings tend to know each other better and remain lifelong friends".' },
        { q: 'A 2010 American study linked having a sister with ____ among children aged 10-14.', a: 'K',
          ev: 'were less likely to feel lonely, unloved, self-conscious or fearful',
          en: 'Children with a sister "were less likely to feel lonely, unloved, self-conscious or fearful".' },
        { q: 'Finally, having a sibling may promote ____, according to the same study.', a: 'D',
          ev: 'having a loving sibling of either gender promoted good deeds',
          en: 'A loving sibling "promoted good deeds, such as helping a neighbor".' }
      ] }
  ]
};
