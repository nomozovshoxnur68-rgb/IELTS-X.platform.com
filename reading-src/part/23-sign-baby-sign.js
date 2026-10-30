/* Sign, Baby, Sign! — Reading Passage 3, Questions 27–40 (from Sign Baby Sign - Passage 3.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'sign-baby-sign',
  title: 'Sign, Baby, Sign!',
  passageLabel: 'Passage 3',
  cardTypes: ['Matching Information', 'True False Not Given'],
  passage: `
Why hearing children, as well as deaf ones, may gain from learning to sign

A Language is a powerful tool that humans use for a wide variety of purposes – from expressing emotions and sharing ideas to passing down cultural values and acquiring knowledge. It is not limited to spoken words; gestures, facial expressions and even posture all contribute to how we communicate. Language, whether signed or spoken, plays a vital role in how we engage with the world around us.

B In recent years, many American schools have begun to recognise American Sign Language (ASL) as a valid foreign language credit, just like Spanish or French. This change has opened the door for hearing students to choose ASL as an academic subject, which not only gives them a practical skill but also increases their awareness of and empathy toward the Deaf community. Some educators believe this early exposure may even influence students to pursue careers in special education, speech therapy or interpreting.

C One clear benefit of learning ASL for hearing children is the opportunity for broader social interaction. Children who understand ASL can communicate with deaf peers, making their social circles more inclusive. Additionally, they may find it easier to express complex ideas or emotions non-verbally, which is helpful in noisy environments or when verbal speech isn’t possible.

D Dr Marilyn Daniels, a researcher and advocate for baby sign language, has spent over two decades studying the impact of signing on early communication. While she promotes the use of sign language with infants, she emphasises that there is no need for parents to invent their own signs. Instead, she suggests that parents use ASL or another standardised system to ensure consistency and eventual recognition by others.

E Very young children often develop motor skills before verbal skills. Dr Daniels notes that even babies as young as six months can learn to use simple signs like ‘milk’ or ‘more’ with their hands, long before they can articulate those words. This early form of communication can reduce frustration – for both babies and their parents – and may even accelerate speech development.

F Studies have shown that hearing children exposed to sign language from an early age tend to have stronger reading skills by the time they enter primary school. It is believed that learning sign language can strengthen understanding of symbolic representation and grammar, both of which are foundational to literacy. These cognitive advantages suggest that signing benefits not only communication but academic success as well.

G There remains some debate about the best approach to language instruction for deaf children. Some educators argue that speech and lip reading should come first, while others advocate for immediate exposure to sign language. Dr Daniels believes the latter is more effective and less frustrating for the child. She calls the idea that children must learn to lip-read before learning sign language ‘an outdated notion’. She, along with other advocates, stresses that deaf children have a right to a full, accessible language from birth – and that language is often sign.
`,
  groups: [
    { type: 'matching',
      group: 'The text has seven paragraphs, A–G. Which paragraph contains the following information? Write the correct letter, A–G, in boxes 27–33 on your answer sheet. NB You may use any letter more than once.',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      items: [
        { q: 'a statement about the different things people use language for', a: 'A',
          ev: 'Language is a powerful tool that humans use for a wide variety of purposes',
          en: 'Paragraph A: language is used "for a wide variety of purposes – from expressing emotions and sharing ideas ...".' },
        { q: 'how knowing ASL may benefit students in their future subject choices', a: 'B',
          ev: 'this early exposure may even influence students to pursue careers in special education, speech therapy or interpreting',
          en: 'Paragraph B: ASL "may even influence students to pursue careers in special education, speech therapy or interpreting".' },
        { q: 'an assertion that deaf children have a right to be taught a sign language', a: 'G',
          ev: 'deaf children have a right to a full, accessible language from birth',
          en: 'Paragraph G: "deaf children have a right to a full, accessible language from birth – and that language is often sign".' },
        { q: 'an observation regarding the ability of small children to use their hands', a: 'E',
          ev: 'even babies as young as six months can learn to use simple signs like ‘milk’ or ‘more’ with their hands',
          en: 'Paragraph E: "babies as young as six months can learn to use simple signs ... with their hands".' },
        { q: 'the advantage for hearing children of knowing ASL for wider social interaction', a: 'C',
          ev: 'One clear benefit of learning ASL for hearing children is the opportunity for broader social interaction',
          en: 'Paragraph C: "the opportunity for broader social interaction" with deaf peers.' },
        { q: 'different views on when deaf children should be taught to speak', a: 'G',
          ev: 'Some educators argue that speech and lip reading should come first, while others advocate for immediate exposure to sign language',
          en: 'Paragraph G: some say "speech and lip reading should come first", others want sign language at once.' },
        { q: 'an observation about the reading ability of primary-school-age hearing children who have been taught ASL', a: 'F',
          ev: 'hearing children exposed to sign language from an early age tend to have stronger reading skills by the time they enter primary school',
          en: 'Paragraph F: they "tend to have stronger reading skills by the time they enter primary school".' }
      ] },
    { type: 'tfng',
      group: 'Do the following statements agree with the information given in Reading Passage 3? In boxes 34–40 on your answer sheet, write',
      items: [
        { q: 'Dr Daniels believes that parents should make up their own gestures to communicate with their babies.', a: 'FALSE',
          ev: 'she emphasises that there is no need for parents to invent their own signs',
          en: 'Daniels says "there is no need for parents to invent their own signs" and suggests ASL instead.' },
        { q: 'American Sign Language is the most widely used sign language in the world.', a: 'NOT GIVEN',
          en: 'ASL is discussed only in American schools; how widely it is used in the world is not mentioned.' },
        { q: 'For hearing children in America, learning American Sign Language is an equivalent option to learning a foreign language.', a: 'TRUE',
          ev: 'recognise American Sign Language (ASL) as a valid foreign language credit, just like Spanish or French',
          en: 'Schools "recognise American Sign Language (ASL) as a valid foreign language credit, just like Spanish or French".' },
        { q: 'Brain research indicates that vocabulary is more easily learned than grammar.', a: 'NOT GIVEN',
          en: 'Grammar is mentioned only as part of literacy; no brain research compares vocabulary and grammar.' },
        { q: 'First and second languages are stored on different sides of the brain.', a: 'NOT GIVEN',
          en: 'The passage says nothing about where languages are stored in the brain.' },
        { q: 'Children have less difficulty learning to make signs than learning to make sounds.', a: 'TRUE',
          ev: 'Very young children often develop motor skills before verbal skills',
          en: 'Children "develop motor skills before verbal skills" and can sign "long before they can articulate those words".' },
        { q: 'According to Dr Daniels, the view that deaf children must learn lip reading before sign language is old fashioned.', a: 'TRUE',
          ev: 'She calls the idea that children must learn to lip-read before learning sign language ‘an outdated notion’',
          en: 'She calls this idea "an outdated notion" (outdated = old fashioned).' }
      ] }
  ]
};
