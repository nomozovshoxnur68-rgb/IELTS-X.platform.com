/* Practical Learning in the Classroom — Reading Passage 3, Questions 27–40 (from Practical Learning in the Classroom.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'practical-learning',
  title: 'Practical Learning in the Classroom',
  passageLabel: 'Passage 3',
  cardTypes: ['Multiple Choice', 'Summary Completion', 'Yes No Not Given'],
  passage: `
A teacher describes a case study involving middle school students and traditional earthen architecture

A The way we think about architecture in schools has come a long way. Once, studying architecture in the art class meant learning to appreciate great buildings art-history style, through slide presentations. In recent years, though, the American Institute of Architects has fostered the idea that the process of architectural design, not just the appreciation of architecture, is a beneficial aspect of the art curriculum (Sadler, 1989).

B The value of architectural design is that it is the concrete training ground for a broadly applicable creative process. Architectural training can help people design structures to meet needs. It can help farmers design crop rotations to meet needs. Furthermore, it provides hands-on experiences that reinforce learning in various other subjects, from math to social studies.

C In the ongoing dialogue about architecture in the middle school art curriculum, many believe students should actually build the structures they design in their courses. Although the technology and expertise required of modern architecture can prohibit students from actually realizing their designs, traditional architectural materials and methods remain quite accessible to the art classroom. Traditional architectural materials, such as earth, clay and straw, are cheap, easy to work with and readily available. Further, when students participate in the construction or preservation of a traditional earthen structure in their local community, they engage in a form of experiential learning and they are motivated to invest in the project. This is evident in a case study of an adobe conservation project with middle school students in the town of Zuni, New Mexico, in the Southwestern United States.

D Traditional architecture reaches back to preindustrial America, when local resources and cultures produced structures in styles unique to each region. In New Mexico, examples of hand-built earthen structures still abound. The region has seen some decline in traditional architecture as industrialization has brought new building codes and materials; however, the traditional, non-industrial home, either preserved from earlier generations or newly built, remains in use. Traditional building materials and the land that supplies them are so accessible that handcrafting a house still remains feasible.

E Thus, with no technical expertise and little cost, middle school students can participate in the construction or preservation of a traditional earthen structure. During the project, a student will get to know the materials, understand the chemistry, solve problems, work with classmates, and exercise muscles. The student can apply knowledge of design principles and the creative process while participating in a cooperative effort. But most significantly, this type of project-based activity motivates students to invest intellectually and emotionally in the outcome.

F The town of Zuni, where I taught art, was surrounded by adobe construction, new and old. Behind our main high school building there was a one-room adobe structure which was once used for teaching. Now it served as a place where old furniture could be kept. I sent my class home with the oral history assignment to ask their family, friends and neighbors questions to find out about that building. From their research we compiled a sketchy history: it began as a kindergarten classroom; it later became an art classroom; now it was full of broken desks.

G The building’s design kept it relatively warm in the winter, even without heating, due to its broad south face, and it stayed cool in the summer due to its spacious, ventilated attic and massive earthen walls. Because of this, my students agreed it was worth preserving and were enthusiastic about helping. Preservationist Shalie Gasper arrived in the fall to help with an assessment of the building’s needs. She recommended replacing the stucco that encased the original adobe walls with a traditional mud plaster. She showed us where to find local supplies of sand and clay soil for the plaster mix. We began work on the stucco removal in late fall. The next spring the students were ready to replaster. To teach the traditional skills, Gasper and other local specialists joined us. They gave my class three full mornings of intensive workshops on history and preservation as well as mud-plastering technique, and the building got a new coat of traditional mud plaster.

H Small design-and-build projects such as this can be seen through to the finish when working with earth in the art curriculum. A simple landscape feature such as a wall, entryway, or arch can draw students into important aspects of design that involve the structure’s interaction with people, the surrounding landscape, and natural elements. The same project may provide an opportunity to focus on the chemistry of soil or the structural dynamics of construction. Design goals might guide students to involve traditional forms, consider formal aspects, or integrate math skills of measuring and estimating.

I During our traditional architecture unit, the students realized that something old and almost forgotten is valuable and worth preserving. Many others in the community and around the country share this renewal of interest in traditional earthen technologies. It is the connection to a cultural heritage that interests some; the quality of living within massive, natural walls that attracts others; or for others, the sustainability of the process and the minimal energy spent in construction. The value of adobe in general is becoming more and more known, but little has been said about its value in the art curriculum until now. This experiment in adobe conservation with middle school students convinced me that traditional architecture deserves a place in the regular curriculum.
`,
  groups: [
    { type: 'mcq',
      group: 'Choose the correct letter, A, B, C or D. Write the correct letter in boxes 27–31 on your answer sheet.',
      items: [
        { q: 'What education initiative does the American Institute of Architects currently promote?', a: 'C',
          opts: ['A. multimedia presentation of information in classrooms', 'B. the study of monumental buildings throughout history', 'C. the practice of designing architectural structures', 'D. processes to add more art classes in schools'],
          ev: 'the process of architectural design, not just the appreciation of architecture, is a beneficial aspect of the art curriculum',
          en: 'The Institute "has fostered the idea that the process of architectural design ... is a beneficial aspect of the art curriculum".' },
        { q: 'In the third paragraph, what problem with teaching architecture on art courses does the writer note?', a: 'B',
          opts: ['A. Technology-based courses are unavailable.', 'B. Students cannot always construct their designs.', 'C. The curriculum is too traditional.', 'D. Students lack motivation.'],
          ev: 'the technology and expertise required of modern architecture can prohibit students from actually realizing their designs',
          en: 'Modern technology and expertise "can prohibit students from actually realizing their designs".' },
        { q: 'What is the greatest benefit for students that the writer sees in a traditional architecture project?', a: 'A',
          opts: ['A. personal connection to the end result', 'B. participation in a cooperative project', 'C. building of problem-solving skills', 'D. conservation of a traditional building'],
          ev: 'But most significantly, this type of project-based activity motivates students to invest intellectually and emotionally in the outcome',
          en: '"Most significantly", the project "motivates students to invest intellectually and emotionally in the outcome". B and C are mentioned, but not as the greatest benefit.' },
        { q: 'What is the purpose of the eighth paragraph?', a: 'B',
          opts: ['A. to explain why it is important that projects be small', 'B. to outline the multiple skills involved in one project', 'C. to discuss strategies for connecting content areas', 'D. to propose suggestions for traditional earth projects'],
          ev: 'A simple landscape feature such as a wall, entryway, or arch can draw students into important aspects of design',
          en: 'Paragraph H shows one small project involving design, soil chemistry, structural dynamics and math skills.' },
        { q: 'What does the writer say about traditional building and the general population?', a: 'D',
          opts: ['A. Earthen architecture is becoming a profitable business.', 'B. Earthen architecture is less feasible in some areas of the country.', 'C. Interest in earthen architecture varies from region to region.', 'D. People are attracted to earthen architecture for different reasons.'],
          ev: 'It is the connection to a cultural heritage that interests some',
          en: 'Some like "the connection to a cultural heritage", others "the quality of living within massive, natural walls", others "the sustainability".' }
      ] },
    { type: 'matching', title: 'List of Words',
      group: 'Complete the summary (The Zuni earthen architecture project) using the list of words, A–H, below. Write the correct letter, A–H, in boxes 32–36 on your answer sheet.',
      options: ['A. experts', 'B. location', 'C. design', 'D. storage', 'E. students', 'F. resources', 'G. training', 'H. businesses'],
      items: [
        { q: 'The students in Zuni chose to renovate an old building which was being used for ____.', a: 'D',
          ev: 'Now it served as a place where old furniture could be kept',
          en: '"Now it served as a place where old furniture could be kept" – storage.' },
        { q: 'They came to an agreement that the building was worthy of rehabilitation based on its functional ____.', a: 'C',
          ev: 'The building’s design kept it relatively warm in the winter',
          en: '"The building\'s design kept it relatively warm in the winter ... Because of this, my students agreed it was worth preserving."' },
        { q: 'At the beginning of the project, students were given the task of discovering the history of the building through interviews with local residents. During the course of the project, they learned where to locate ____ for the project.', a: 'F',
          ev: 'She showed us where to find local supplies of sand and clay soil for the plaster mix',
          en: 'Gasper "showed us where to find local supplies of sand and clay soil" – resources.' },
        { q: 'They also worked closely with a number of ____ on each step of the project.', a: 'A',
          ev: 'Gasper and other local specialists joined us',
          en: '"Gasper and other local specialists joined us" (specialists = experts).' },
        { q: 'During the project, students were also given ____ to build useful skills.', a: 'G',
          ev: 'They gave my class three full mornings of intensive workshops',
          en: 'They gave "three full mornings of intensive workshops" on history, preservation and mud-plastering – training.' }
      ] },
    { type: 'ynng',
      group: 'Do the following statements agree with the views of the writer in Reading Passage 3? In boxes 37–40 on your answer sheet, write',
      items: [
        { q: 'The price of materials is one drawback to using traditional architecture.', a: 'NO',
          ev: 'Traditional architectural materials, such as earth, clay and straw, are cheap, easy to work with and readily available',
          en: 'Traditional materials "are cheap", and students can work "with ... little cost".' },
        { q: 'Earthen structures can easily be built in all regions of the U.S.', a: 'NOT GIVEN',
          en: 'The writer talks about New Mexico only; other regions of the U.S. are not discussed.' },
        { q: 'Working with a traditional earthen structure can have physical benefits.', a: 'YES',
          ev: 'work with classmates, and exercise muscles',
          en: 'During the project a student will "work with classmates, and exercise muscles".' },
        { q: 'A traditional architecture curriculum is best suited to middle school level students.', a: 'NOT GIVEN',
          en: 'The project was with middle school students, but the writer never says this level suits it best.' }
      ] }
  ]
};
