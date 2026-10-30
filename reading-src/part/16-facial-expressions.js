/* The purpose of facial expressions — Reading Passage 2, Questions 14–26 (from The purpose of facial expressions.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'facial-expressions',
  title: 'The purpose of facial expressions',
  passageLabel: 'Passage 2',
  cardTypes: ['Matching Information', 'Matching Features', 'Sentence Completion'],
  passage: `
A The use of facial expressions for measuring people's emotions has dominated psychology since the late 1960s. This was when Paul Ekman of the University of California pioneered the idea that, by carefully measuring facial expression, he could evaluate people's true emotions. Ekman carried out experiments in which people were asked to label photos of basic facial expressions - such as a smile, frown or scowl - with words for emotions. He found, for example, that a smile represented joy and a scowl represented anger. In fact, since the 1970s Ekman has dominated the field of emotion research with his theory that when an emotion occurs, a large number of electrical impulses also occur, creating specific facial expressions and other physiological changes, such as increased or decreased heart rate or heightened blood pressure.

B Many took Ekman's work to imply that facial expressions precisely indicated people's feelings. However, this theory has been attacked by a number of psychologists, such as Alan Fridlund of the University of California, who claim that there is no one-to-one correspondence between facial expressions and emotions. Expressions evolved to set off certain behaviors in other people, says Fridlund. So a smile may prompt people to approach, a scowl may warn them to stay away, and a look of sadness may elicit words of sympathy and reassurance. In other words, in Fridlund's view, facial expressions are inherently social - they involve not one, but two or more people. Even when people are alone they are holding a dialog with another person internally, or imagining themselves in a social situation.

C Thus Fridlund thinks of facial expressions as tools for influencing social interactions, a view which, he claims, enables us to begin predicting when certain facial expressions will occur. This in turn will allow more precise theories about social interactions. His studies find that expressions occur most often during pivotal points, the turning points in social interactions - during greetings, social crises, or times of appeasement, for example. At these pivotal points there is an approach, or closeness, or more intimacy, and facial expressions, as well as gestures, open up the possibilities of various social interactions.

D Although much work on the emotions relies on a link between facial expression and emotions, psychologist James Russell, of the University of British Columbia, says there is very little evidence supporting such a connection. 'There's some sense in which faces express emotion, but only in the sense that everything expresses emotion,' says Russell, a long-time critic of the expression-emotion link. 'Music does, posture does, words do, tone of voice does, your behavior does. The real question is, "Is there anything special about faces?" And there we really do not know much. What is more likely, argues Russell, is that facial expressions tell others something about a person's overall mood and context, rather than provide details about specific emotions.

E Others, including Ekman, argue that the face can display information about emotions, but they admit that it is not reliable one hundred percent of the time. And those who only examine faces when trying to study emotion will jump to false conclusions. But according to Ekman, to say, as Fridlund does, that there is the connection at all between facial expressions and emotions is simply wrong. There is a link between facial expression and emotion," agrees developmental psychologist Linda Camras of DePaul University, 'but it's not a one-to-one kind of relationship as many once thought.' She believes there are many situations where emotion is experienced, yet no basic facial expression is displayed. And there are times when a facial expression appears with no corresponding emotion.

F Ekman's theory states that if the emotion comes on slowly or is rather weak, the feeling might not be strong enough to trigger the expression. This would explain why there can sometimes be emotion without expression, he argues. In addition, cultural rules - which determine when and whether people of certain cultures display emotional expressions - can prevent this otherwise automatic process from being completed. Facial expressions evolved in humans as signals to others about how they feel, says Ekman. At times, though, it may be uncomfortable or inconvenient for us to let others know our emotions. But in the long run, over the course of evolution, it was useful to us as signalers: an angry look on someone's face may be a warning that they are preparing to behave in an angry fashion.

G Although Fridlund disagrees with Ekman on certain matters, the two basically share the opinion that facial expressions indicate people's future actions. The area of dispute between Fridlund and Ekman draws attention away from their major areas of agreement, says Joseph Campos of the University of California. Indeed, he says, 'there is profound agreement that the face, along with the voice, body posture and hand gestures, forecasts to outside observers what people will do next.' He goes on to say, 'The face is a component [of emotion], but to make it the center of study of the human being experiencing an emotion is like saying the only thing you need to study in a car is the transmission. Not that the transmission is unimportant, but it's only part of an entire system.'
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 2 has seven paragraphs, A–G. Which paragraph contains the following information? Write the correct letter, A–G, in boxes 14–18 on your answer sheet.',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      items: [
        { q: 'a recognition that facial expressions do not always provide a true guide to feelings', a: 'E',
          ev: 'it is not reliable one hundred percent of the time',
          en: 'Paragraph E: the face can show emotions, "but they admit that it is not reliable one hundred percent of the time".' },
        { q: 'examples of ways that a person’s facial expression can affect someone else’s actions', a: 'B',
          ev: 'So a smile may prompt people to approach, a scowl may warn them to stay away',
          en: 'Paragraph B: "a smile may prompt people to approach, a scowl may warn them to stay away".' },
        { q: 'a reference to reasons for hiding emotions', a: 'F',
          ev: 'At times, though, it may be uncomfortable or inconvenient for us to let others know our emotions',
          en: 'Paragraph F: it "may be uncomfortable or inconvenient for us to let others know our emotions".' },
        { q: 'examples of times when facial expressions are used especially frequently', a: 'C',
          ev: 'His studies find that expressions occur most often during pivotal points',
          en: 'Paragraph C: expressions "occur most often during pivotal points" – "greetings, social crises, or times of appeasement".' },
        { q: 'examples of changes inside the body when an emotion is felt', a: 'A',
          ev: 'such as increased or decreased heart rate or heightened blood pressure',
          en: 'Paragraph A: "physiological changes, such as increased or decreased heart rate or heightened blood pressure".' }
      ] },
    { type: 'matching', title: 'List of Researchers',
      group: 'Look at the following statements (Questions 19–23) and the list of researchers below. Match each statement with the correct researcher, A–E. Write the correct letter, A–E, in boxes 19–23 on your answer sheet. NB You may use any letter more than once.',
      options: ['A. Paul Ekman', 'B. Alan Fridlund', 'C. James Russell', 'D. Linda Camras', 'E. Joseph Campos'],
      items: [
        { q: 'Focusing on the face in researching emotions is similar to researching a large structure by looking at just one small unit of it.', a: 'E',
          ev: 'is like saying the only thing you need to study in a car is the transmission',
          en: 'Campos: studying only the face "is like saying the only thing you need to study in a car is the transmission".' },
        { q: 'Facial expressions developed in order to encourage other people to react in particular ways.', a: 'B',
          ev: 'Expressions evolved to set off certain behaviors in other people, says Fridlund',
          en: '"Expressions evolved to set off certain behaviors in other people, says Fridlund."' },
        { q: 'Although certain researchers have different opinions about various points, they share some important ideas.', a: 'E',
          ev: 'The area of dispute between Fridlund and Ekman draws attention away from their major areas of agreement, says Joseph Campos',
          en: 'Campos: the dispute "draws attention away from their major areas of agreement".' },
        { q: 'Both emotion and expression can exist independently of each other in certain circumstances.', a: 'D',
          ev: 'She believes there are many situations where emotion is experienced, yet no basic facial expression is displayed',
          en: 'Camras: emotion can come with "no basic facial expression", and an expression can appear "with no corresponding emotion".' },
        { q: 'It cannot be proved that there is a connection between facial expression and real emotion.', a: 'C',
          ev: 'there is very little evidence supporting such a connection',
          en: 'Russell "says there is very little evidence supporting such a connection".' }
      ] },
    { type: 'completion',
      group: 'Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 24–26 on your answer sheet.',
      items: [
        { q: 'In Fridlund’s view, a ____ on someone’s face may be intended as an invitation to come nearer.', a: 'smile',
          ev: 'So a smile may prompt people to approach',
          en: 'Fridlund: "a smile may prompt people to approach" (approach = come nearer).' },
        { q: 'According to Fridlund, when we are by ourselves we still use facial expressions because we are having a ____ with someone in our minds.', a: 'dialog|dialogue',
          ev: 'Even when people are alone they are holding a dialog with another person internally',
          en: '"Even when people are alone they are holding a dialog with another person internally."' },
        { q: 'Fridlund considers facial expressions to be ____ that can affect our contact with other people.', a: 'tools',
          ev: 'Fridlund thinks of facial expressions as tools for influencing social interactions',
          en: '"Fridlund thinks of facial expressions as tools for influencing social interactions."' }
      ] }
  ]
};
