/* Science and Filmmaking — Reading Passage 3, Questions 27–40 (from Science_and_Filmmaking_P3.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'science-and-filmmaking',
  title: 'Science and Filmmaking',
  passageLabel: 'Passage 3',
  cardTypes: ['Multiple Choice', 'Yes No Not Given', 'Summary Completion'],
  passage: `
How a Stanford computer graphics team won an Oscar for making digital skin look real

1 Every year the film academy in the USA celebrates the outstanding achievements of the year in a ceremony known as the Oscars. An increasingly important component of the ceremony is the presentation of the Scientific and Technical awards. In 2004 a notable event took place: the academic world met the cinematographic world when researchers from Stanford University in the USA were awarded an Oscar. These researchers, led by Steve Marschner, were from the field of Computer Graphics at Stanford. They were part of a growing cohort of computer scientists that has become fundamental to moviemaking.

2 Films have shown that it is possible to use CGI to make actors look younger, older, weaker or stronger than they actually are in a surprisingly realistic manner. At least, it is possible if the altered actors are not filmed too closely. This is because the difficulty of recreating the textures of both skin and fabric means that the effect is less convincing when seen close up. The work of Marschner and his colleagues has greatly improved the accurate and realistic modeling of both skin and fabric. They recognised that one of the difficulties of creating lifelike characters in the computer world is that in CGI the characters' skin is opaque (two-dimensional) whereas real skin is in fact translucent (three-dimensional), that is to say it is semi-transparent.

3 Marschner and his colleagues received the Oscar for their work in successfully producing a CGI model that simulates translucency; this is when light penetrates skin and then scatters below the skin's surface before re-emerging. This is called subsurface scattering, and the mathematics for the model goes back many decades to the time when it was used in astrophysics. Because human skin is naturally translucent, it was necessary to be able to create this artificially in order to simulate the soft appearance of real skin. Previous CGI models, which assumed that skin was entirely opaque, resulted in characters with a plastic appearance. The scientists' new model of CGI was so important in bringing digital characters to life that, within two years of their original research paper, all the major special-effects studios had incorporated it into their digital rendering systems.

4 However, despite their award, the scientists, with admirable tenacity, continued their search for perfection, as they still did not feel that they had yet satisfactorily recreated the subtle ways light is reflected. To do this, they began to look in detail at the way skins and fabrics reflect light differently according to their make-up: the exact arrangement of fibres in fabric and the network of fibres in skin. Marschner and his team chose to do this by using computerised tomography — which is most familiar as a medical technique for examining people's internal organs. Like classical radiology it uses X-rays, but because the image is constructed inside a computer using exposures taken from many different positions, rather than a single exposure on photographic film, it can capture fine details that are invisible in classical radiography.

5 Unfortunately, the scientists understood that at this point in time they could not use computerised tomography on skin, because a very high intensity X-ray is needed to show the kind of detail they wanted and this would be very dangerous for human skin. They have, however, had some success with fabric. Using this new method of imaging, they are able to accurately record the three-dimensional structure of all the fibres in a number of small pieces of fabric. These same pieces of fabric, through the use of CGI, can then be patched together to form an entire garment inside a computer, in the same way that a small group of actors can be made to look like hundreds of people gathered together. A garment created through CGI is therefore made up of pieces of fabric whose internal structure has been pre-recorded. This means that the way light is reflected by the garment can be calculated far more realistically than if the scientists just made a computer model of what they thought the interior of the fabric looked like. Cinematography will benefit from this because, although it may take some years to be able to use computerised tomographic imaging of skin, for the moment the movement of a virtual cloak or the lifting of a computerised hat should look far more realistic.

6 In the meantime, according to Marschner's colleague Kavita Bala, the technology might have an application in online retailing. At the moment people buying clothes over the internet have only a standard photograph to help them choose their purchases. It is hoped that if online shoppers can view items which have been presented through the use of computerised tomography graphics, they will have a much better understanding of what the material the item is made of is really like.

7 Marschner is now working on the way light is scattered from individual hairs. He says, 'I feel lucky to be working in this niche. I'm a visual person and to be able to spend my time scrutinizing the world around me, trying to understand why it looks the way it does, is very rewarding.'
`,
  groups: [
    { type: 'mcq',
      group: 'Choose the correct letter, A, B, C or D. Write your answers in boxes 27–32 on your answer sheet.',
      items: [
        { q: 'What is the writer’s main point in the first paragraph?', a: 'D',
          opts: ['A. Computer scientists are rarely represented at the Oscars.', 'B. Film industry awards hold little interest for computer scientists.', 'C. The USA rewards film actors more than computer scientists.', 'D. Computer scientists are becoming a vital part of the film industry.'],
          ev: 'a growing cohort of computer scientists that has become fundamental to moviemaking',
          en: 'The researchers were "part of a growing cohort of computer scientists that has become fundamental to moviemaking" (fundamental = vital).' },
        { q: 'When describing the way computer-generated imagery changes actors’ appearance, what does the writer suggest?', a: 'A',
          opts: ['A. CGI looks best from a distance.', 'B. CGI interferes with actors’ facial expressions.', 'C. Audiences expect too much of CGI.', 'D. The scientists had hoped for more convincing results.'],
          ev: 'the effect is less convincing when seen close up',
          en: 'It works "if the altered actors are not filmed too closely"; "the effect is less convincing when seen close up".' },
        { q: 'What does the writer suggest about the scientists’ attitude to their work in the fourth paragraph?', a: 'A',
          opts: ['A. They were motivated to get as near to reality as possible.', 'B. They were interested in gaining recognition for their work.', 'C. They thought it could have medical applications.', 'D. They hoped to receive further funding for their research.'],
          ev: 'continued their search for perfection',
          en: 'Despite the award they "continued their search for perfection", as they had not yet "satisfactorily recreated the subtle ways light is reflected".' },
        { q: 'What are we told about computerised tomography?', a: 'B',
          opts: ['A. It has only recently been used by doctors.', 'B. It is similar to X-rays in the way it works.', 'C. Filmmakers have used it for many years for special lighting effects.', 'D. It can be administered using traditional radiography machines.'],
          ev: 'Like classical radiology it uses X-rays',
          en: '"Like classical radiology it uses X-rays", though the image is built inside a computer.' },
        { q: 'Which of these advantages does the writer attribute to the current use of computerised tomography?', a: 'B',
          opts: ['A. It is most effective when used to create images of skin.', 'B. It can make a few people seem like a crowd.', 'C. It allows clothes designers to create new designs.', 'D. It is practical because of the time it takes.'],
          ev: 'a small group of actors can be made to look like hundreds of people gathered together',
          en: 'Small pieces of fabric are joined into a garment "in the same way that a small group of actors can be made to look like hundreds of people". A is wrong: it cannot yet be used on skin.' },
        { q: 'The writer mentions Kavita Bala in order to', a: 'D',
          opts: ['A. comment on the success of CGI in commercial contexts.', 'B. highlight the link between CGI and photography.', 'C. show that Marschner’s team are uncertain about the future of CGI.', 'D. demonstrate a use for CGI outside the film industry.'],
          ev: 'the technology might have an application in online retailing',
          en: 'Bala says "the technology might have an application in online retailing" – a use outside films.' }
      ] },
    { type: 'ynng',
      group: 'Do the following statements agree with the views of the writer in Reading Passage 3? In boxes 33–36 on your answer sheet, write',
      items: [
        { q: 'It used to be unusual for university researchers to receive a cinematography award.', a: 'YES',
          ev: 'In 2004 a notable event took place: the academic world met the cinematographic world',
          en: 'The award to Stanford researchers is called "a notable event": "the academic world met the cinematographic world".' },
        { q: 'CGI is popular among ageing actors.', a: 'NOT GIVEN',
          en: 'CGI can "make actors look younger, older", but nothing is said about which actors like it.' },
        { q: 'The scientists’ success in generating images of complete CGI garments has won them many awards.', a: 'NOT GIVEN',
          en: 'Their only award mentioned is the Oscar for skin translucency; nothing is said about awards for garments.' },
        { q: 'It will be a long time before computerised tomographic fabric is used by filmmakers.', a: 'NO',
          ev: 'for the moment the movement of a virtual cloak or the lifting of a computerised hat should look far more realistic',
          en: 'It is skin that "may take some years"; fabric can be used already – "for the moment the movement of a virtual cloak ... should look far more realistic".' }
      ] },
    { type: 'matching', title: 'List of Words',
      group: 'Complete the summary (Bringing digital characters to life) using the list of words, A–I, below. Write the correct letter, A–I, in boxes 37–40 on your answer sheet. NB There are more words than gaps.',
      options: ['A. light', 'B. transparency', 'C. age', 'D. use', 'E. astrophysics', 'F. mathematics', 'G. improvement', 'H. colour', 'I. translucency'],
      items: [
        { q: 'For many years, CGI characters did not appear entirely lifelike, as their skin appeared plastic. Marschner and his colleagues were the first to apply an understanding of how ____ interacts with human skin.', a: 'A',
          ev: 'this is when light penetrates skin and then scatters below the skin\'s surface before re-emerging',
          en: 'Their model simulates translucency: "light penetrates skin and then scatters below the skin\'s surface".' },
        { q: 'Their CGI model is based on a novel application of principles of ____ which had previously been applied in other scientific research.', a: 'F',
          ev: 'the mathematics for the model goes back many decades to the time when it was used in astrophysics',
          en: '"The mathematics for the model goes back many decades to the time when it was used in astrophysics" (astrophysics is the other research, not the principle).' },
        { q: 'The importance of CGI to the film industry has led to the ____ of Marschner’s model by special-effects studios.', a: 'D',
          ev: 'all the major special-effects studios had incorporated it into their digital rendering systems',
          en: '"All the major special-effects studios had incorporated it" – they use the model.' },
        { q: 'Marschner’s model has led to the ____ of cinematography.', a: 'G',
          ev: 'Cinematography will benefit from this',
          en: '"Cinematography will benefit from this": the model improves it.' }
      ] }
  ]
};
