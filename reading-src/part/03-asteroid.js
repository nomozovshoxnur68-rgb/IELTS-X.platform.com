/* The plan to bring an asteroid to Earth — Reading Passage 2, Questions 14–26 (from 03_Asteroid_P2.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'asteroid',
  title: 'The plan to bring an asteroid to Earth',
  passageLabel: 'Passage 2',
  cardTypes: ['Matching Headings', 'Matching Features', 'Summary Completion'],
  passage: `
Moving in orbit around our sun are millions of rocks known as asteroids. Now scientists have plans to capture one

A Send a robot into space, catch an asteroid and bring it back to Earth's orbit. This may sound like science fiction, but it is being taken seriously by scientists and engineers at the California Institute of Technology (Caltech). A four-day workshop was dedicated to investigating the feasibility of capturing a near-Earth asteroid, bringing it closer to our planet and using it as a base for future manned spaceflight missions.

This is not something the scientists are imagining could be done some day off in the future. It is possible with the technology we have today and could be accomplished within a decade. A robotic probe could anchor to an asteroid with simple magnets, or with a specialized spacecraft with claws. Alternatively, a large spacecraft could use its gravitational field to shift the orbit of a larger asteroid, sending it towards Earth.

'Once you get over the initial reaction – You want to go what?! – it actually starts to seem like a reasonable idea,' said project leader John Brophy, who helped organize the workshop. In fact, many of these ideas have been on the drawing board for years as part of the NASA planetary defense program, which is aimed at large space-based objects that might threaten Earth. There's no shortage of potential targets. NASA estimates there are 19,500 asteroids at least 100 meters wide within 45 million kilometers of Earth.

B Though rearranging the heavens may seem an excessive undertaking, the US mission has its merits. The US already has plans to send astronauts to a near-Earth asteroid, a mission that would mean confining them in a tiny capsule for three to six months and involve all the risks of deep-space voyage. Instead, robots could bring an asteroid close enough for them to get there in just a month.

An asteroid would provide a stationary base from which to launch missions farther into space. There are several advantages to this. For one, launching missions carrying materials from Earth requires a lot of power, fuel, and consequently money, because of our planet's strong force of gravity. Since this would be far weaker on an asteroid, materials mined there could be more easily taken off the asteroid and shuttled around the solar system.

And many asteroids have a lot to offer. Some are full of metals, which can be mined and used to build space-based habitats, or brought back to Earth. Others are up to one-quarter water, which would either be used for life-support or broken down into hydrogen and oxygen to make fuel. And astronomers would have the chance to get a close-up look at one of the solar system's earliest relics, generating important scientific data.

'Executing the asteroid retrieval plan would help demonstrate and greatly expand mankind's space-based engineering capabilities,' says engineer Louis Friedman, another co-organizer of the Caltech workshop. 'For instance, the mission would teach engineers how to capture an uncooperative target, which could be useful practice for planetary defense missions in the event of a threat from a meteoroid or comet from space approaching our planet,' he adds.

C Former astronaut Rusty Schweickart, cofounder of the B612 Foundation, an organization dedicated to protecting Earth from asteroid strikes, points out that though it would be technically feasible, shifting such a hefty and substantial target would not be easy: "You're moving the largest mother lode imaginable," he says.

Engineers would need to be absolutely certain they could control such a potentially dangerous object. "It's the opposite of planetary defense, if you do something wrong you have a Tunguska event," says engineer Marco Tantardini from the Planetary Society, referring to the powerful 1908 explosion above a remote Russian region thought to have been caused by a meteoroid or comet.

D Still, these obstacles only add to the appeal of the project for engineers, who love to go over every potential difficulty in order to solve it. And if the challenges for a large asteroid seem too daunting, researchers could always start with a smaller asteroid perhaps 2 to 10 meters across. Last year, Brophy helped conduct a study to look at the feasibility of bringing a two-meter, 1,000 kilogram asteroid – of which there might conceivably be millions – to the International Space Station. The study suggested the asteroid could be captured robotically in something as simple as a large bag. Of course, such a small object might not have the same emotional impact as a larger target. 'NASA isn't going to want to go to something that is smaller than our spaceships,' says engineer Dan Mazanek from NASA Langley Research Center.

E No matter the size of the asteroid, these plans would require hefty investments. Even capturing a small asteroid would consume at least a billion dollars. Convincing taxpayers to foot such a bill could be difficult. However, private industry might be interested in getting involved. One possibility would be to push the asteroid to near Earth orbit and then invite anyone who wants to develop the capabilities to reach and mine the object.

However, though the undertaking might be scientifically exciting, and provide great insight into the solar system formation, this is not enough on its own to justify the expense of bringing an asteroid to Earth. Investigations of asteroids can be done much more cheaply with an unmanned spacecraft, says chemist Joseph A Nuth from NASA's Goddard Space Flight Center. According to Brophy, ultimately, we would be working towards bringing an asteroid closer to Earth in order to help move out into the solar system.
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 2 has five sections, A–E. Choose the correct heading for each section from the list of headings below. Write the correct number, i–viii, in boxes 14–18 on your answer sheet.',
      options: ['i. The need for skill and care', 'ii. Choosing the richest asteroid', 'iii. The safest way to protect an asteroid', 'iv. Obtaining support for the project',
        'v. An achievable goal, not an impossible dream', 'vi. The need for global cooperation', 'vii. Beginning with a less challenging task', 'viii. Practical, economic and research justifications'],
      items: [
        { q: 'Paragraph A', a: 'v', ev: 'It is possible with the technology we have today and could be accomplished within a decade',
          en: 'It "may sound like science fiction", but "it is possible with the technology we have today": an achievable goal.' },
        { q: 'Paragraph B', a: 'viii', ev: ['the US mission has its merits', 'generating important scientific data'],
          en: 'Section B gives the "merits": a shorter trip for astronauts (practical), less fuel and money (economic) and "important scientific data" (research).' },
        { q: 'Paragraph C', a: 'i', ev: 'Engineers would need to be absolutely certain they could control such a potentially dangerous object',
          en: 'Moving the asteroid "would not be easy" and engineers "would need to be absolutely certain they could control" it: skill and care.' },
        { q: 'Paragraph D', a: 'vii', ev: 'researchers could always start with a smaller asteroid',
          en: 'If a large asteroid is "too daunting, researchers could always start with a smaller asteroid".' },
        { q: 'Paragraph E', a: 'iv', ev: ['Convincing taxpayers to foot such a bill could be difficult', 'private industry might be interested in getting involved'],
          en: 'Section E is about paying for it: "Convincing taxpayers to foot such a bill could be difficult", but "private industry might be interested".' }
      ] },
    { type: 'matching', title: 'List of Statements',
      group: 'Look at the following experts (Questions 19–22) and the list of statements below. Match each expert with the correct statement, A–G. Write the correct letter, A–G, in boxes 19–22 on your answer sheet.',
      options: ['A. A mistake could have serious consequences for Earth.', 'B. It might be difficult to arouse interest in an asteroid of limited size.', 'C. The project could be an early step in space exploration.',
        'D. An asteroid’s weight makes the project extremely challenging.', 'E. The skill gained could save Earth from future danger.', 'F. An asteroid could be a useful landing place for a spaceship.',
        'G. Capturing an asteroid would not be an efficient method of research.'],
      items: [
        { q: 'Louis Friedman', a: 'E', ev: 'which could be useful practice for planetary defense missions in the event of a threat',
          en: 'Friedman: learning to "capture an uncooperative target" would be "useful practice for planetary defense missions".' },
        { q: 'Rusty Schweickart', a: 'D', ev: "shifting such a hefty and substantial target would not be easy",
          en: 'Schweickart says "shifting such a hefty and substantial target would not be easy": its weight makes it hard.' },
        { q: 'Dan Mazanek', a: 'B', ev: "NASA isn't going to want to go to something that is smaller than our spaceships",
          en: 'Mazanek: "NASA isn\'t going to want to go to something that is smaller than our spaceships".' },
        { q: 'Joseph A Nuth', a: 'G', ev: 'Investigations of asteroids can be done much more cheaply with an unmanned spacecraft',
          en: 'Nuth: "Investigations of asteroids can be done much more cheaply with an unmanned spacecraft", so capturing one is not efficient.' }
      ] },
    { type: 'completion', title: 'The merits of the US mission',
      group: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 23–26 on your answer sheet.',
      items: [
        { q: 'Capture of an asteroid would reduce the time that astronauts travelling to it needed to spend in space. An asteroid could also act as a ____ for further space travel and exploration.', a: 'base',
          ev: 'An asteroid would provide a stationary base from which to launch missions farther into space',
          en: '"An asteroid would provide a stationary base from which to launch missions farther into space."' },
        { q: 'The fact that an asteroid would have weaker ____ would allow easier movement of resources.', a: 'gravity',
          ev: 'Since this would be far weaker on an asteroid',
          en: 'Earth has a "strong force of gravity", and "this would be far weaker on an asteroid", so materials could be "more easily taken off".' },
        { q: 'These resources include ____ which could be used in space or on Earth', a: 'metals',
          ev: 'Some are full of metals, which can be mined and used to build space-based habitats, or brought back to Earth',
          en: 'Metals "can be mined and used to build space-based habitats, or brought back to Earth".' },
        { q: 'and ____ which could be consumed or used as a source of power.', a: 'water',
          ev: 'Others are up to one-quarter water, which would either be used for life-support or broken down into hydrogen and oxygen to make fuel',
          en: 'Water could be "used for life-support" (consumed) or "broken down ... to make fuel" (a source of power).' }
      ] }
  ]
};
