/* A new look for Talbot Park — Reading Passage 2, Questions 14–26 (from A new look for Talbot Park.pdf). Format: reading-src/part/index.js */
module.exports = {
  key: 'talbot-park',
  title: 'A new look for Talbot Park',
  passageLabel: 'Passage 2',
  cardTypes: ['Matching Headings', 'Matching Features', 'Summary Completion'],
  passage: `
A The new Talbot Park is immediately eye-catching because the buildings look quite different to other state housing* projects in Auckland. ‘There is no reason why state housing should look cheap in my view,’ says architect Neil Cotton, one of the design team. ‘In fact, I was anticipating a backlash by those who objected to the quality of what is provided with government money.’ The tidy brick and wood apartments and townhouses would not look out of place in some of the city’s most affluent suburbs and this is a central theme of the Talbot Park philosophy.

B Talbot Park is a triangle of government-owned land, which in the early 1960s was developed for state housing built around a linear garden that ran through the middle. Initially, there was a strong sense of neighbourhoodness. Former residents recall how the garden played a big part in their childhoods – a place where kids came together to play softball, cricket and bullrush. ‘We had respect for our neighbours and addressed them by title – Mr and Mrs so-and-so,’ recalls Georgie Thompson, who grew up there in the 1960s.

C Exactly what went wrong with Talbot Park is unclear. The community began to change in the late 1970s as more immigrants moved in. The new arrivals didn’t always integrate with the community and a ‘them and us’ mentality developed. In the process, standards dropped and the neighbourhood began to look shabbier. The buildings themselves were also deteriorating and becoming run down, petty crime was on the rise and the garden was considered unsafe. In 2002, Housing New Zealand decided the properties needed upgrading. The question was, how to avoid repeating the mistakes of the past?

D One controversial aspect of the upgrade is that the new development has actually made the density of housing in Talbot Park greater, putting 52 more homes on the same site. Doing this required a fresh approach that can be summed up as ‘mix and match’. The first priority was to mix up the housing by employing a variety of plans by different architects: some of the accommodation is free-standing houses, some semi-detached, some low level, multi-apartment blocks. By doing this, the development avoids the uniform appearance of so many state housing projects, which residents complain denies them any sense of individual identity. The next goal was to prevent overspending by using efficient designs to maximise the sense of space from minimum room sizes. There was also a no-frills, industrial approach to kitchens, bathrooms and flooring, to optimise durability and ensure the project did not go over budget. Architecturally, the buildings are relatively conservative: fairly plain houses standing in a small garden. There’s a slight reflection of the traditional Pacific beach house (a fale) but it’s not overplayed. ‘It seems to us that low-cost housing is about getting as much amenity as you can for the money,’ says architect Michael Thompson. Another key aspect of the ‘mix and match’ approach is openness: one that not only lets residents see what is going on but also lets them know they are seen. The plan ensures there are no cul-de-sacs or properties hidden from view, that the gardens are not enclosed by trees and that most boundary fences are see-through – a community contained but without walls.

E The population today is cosmopolitan: 50% Pacific Islanders, 20% Maori, 15% Asian, 10% New Zealand European and the rest composed of immigrants from Russia, Ukraine and Iran. ‘It was important that the buildings were sufficiently flexible to cater for the needs of people from a wide variety of cultural backgrounds,’ explains designer James Lundy.

F Despite the quality of the buildings, however, there should be no doubt that Talbot Park and its surrounding suburb of Tamaki are low socio-economic areas. Of the 5,000 houses there, 55% are state houses, 28% privately owned (compared to about 65% nationally) and 17% private rental. The area has a high density of households with incomes in the $5,000 to $15,000 range and very few with an income over $70,000. That’s in sharp contrast to the more affluent suburbs in Auckland.

G Another important part of the new development is what Housing New Zealand calls ‘intensive tenancy management’. Opponents of the project call it social control. ‘The focus is on frequent inspections and setting clear guidelines and boundaries regarding the sort of behaviour we expect from tenants,’ says Graham Bodman, Housing New Zealand’s regional manager. The result is a code of sometimes strict rules: no loud parties after 10pm; no washing hung over balcony rails and a requirement to mow lawns and keep the property tidy. The Tenancy Manager walks the site every day, knows everyone by name and deals with problems quickly. ‘It’s all based on the intensification,’ says project manager Stuart Bracey. ‘We acknowledge that if you are going to ask people to live in these quite tightly-packed communities, you have to actually help them to get to know each other by organising morning teas and street barbecues.’ So far it seems to be working and many involved in the project believe Talbot Park represents the way forward for state housing.

* state housing: government subsidised accommodation for people who cannot pay market rents
`,
  groups: [
    { type: 'matching',
      group: 'Reading Passage 2 has seven paragraphs, A–G. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–x, in boxes 14–20 on your answer sheet.',
      options: ['i. Some of the problems that developed at Talbot Park', 'ii. Where the residents lived while the work was being completed', 'iii. The ethnic makeup of the new Talbot Park',
        'iv. The unexpectedly high standard of the housing', 'v. Financial hardship in Talbot Park and a neighbouring community', 'vi. The experiences of one family living at Talbot Park today',
        'vii. How to co-ordinate and assist the people who live at Talbot Park', 'viii. Raising the money to pay for the makeover', 'ix. A close community in the original Talbot Park development',
        'x. Details of the style of buildings used in the makeover'],
      items: [
        { q: 'Paragraph A', a: 'iv', ev: 'There is no reason why state housing should look cheap in my view',
          en: 'The new buildings "look quite different to other state housing" and "would not look out of place in some of the city\'s most affluent suburbs" – an unexpectedly high standard.' },
        { q: 'Paragraph B', a: 'ix', ev: 'Initially, there was a strong sense of neighbourhoodness',
          en: 'In the 1960s "there was a strong sense of neighbourhoodness": children played together and neighbours respected each other.' },
        { q: 'Paragraph C', a: 'i', ev: 'petty crime was on the rise and the garden was considered unsafe',
          en: 'Paragraph C lists what went wrong: a "them and us" mentality, run-down buildings, "petty crime was on the rise".' },
        { q: 'Paragraph D', a: 'x', ev: 'Architecturally, the buildings are relatively conservative: fairly plain houses standing in a small garden',
          en: 'Paragraph D describes the "mix and match" style: different plans, plain houses, see-through fences.' },
        { q: 'Paragraph E', a: 'iii', ev: 'The population today is cosmopolitan: 50% Pacific Islanders',
          en: '"The population today is cosmopolitan": Pacific Islanders, Maori, Asian, European and other immigrants.' },
        { q: 'Paragraph F', a: 'v', ev: 'Talbot Park and its surrounding suburb of Tamaki are low socio-economic areas',
          en: '"Talbot Park and its surrounding suburb of Tamaki are low socio-economic areas", with many low incomes.' },
        { q: 'Paragraph G', a: 'vii', ev: 'The Tenancy Manager walks the site every day, knows everyone by name and deals with problems quickly',
          en: 'Paragraph G is about "intensive tenancy management": rules, inspections, and help to "get to know each other".' }
      ] },
    { type: 'matching', title: 'List of Ideas',
      group: 'Look at the following people (Questions 21–23) and the list of ideas below. Match each person with the correct idea, A–F. Write the correct letter, A–F, in boxes 21–23 on your answer sheet.',
      options: ['A. Good tenant management involves supervision and regulation.', 'B. State housing must be built at minimum expense to the public.', 'C. Organising social events helps tenants to live close together.',
        'D. Mixed-race communities require adaptable and responsive designs.', 'E. Complaints were expected about the high standard of the development.', 'F. Too many rules and regulations will cause resentment from tenants.'],
      items: [
        { q: 'James Lundy', a: 'D', ev: 'the buildings were sufficiently flexible to cater for the needs of people from a wide variety of cultural backgrounds',
          en: 'Lundy: the buildings had to be "sufficiently flexible to cater for the needs of people from a wide variety of cultural backgrounds".' },
        { q: 'Graham Bodman', a: 'A', ev: 'The focus is on frequent inspections and setting clear guidelines and boundaries',
          en: 'Bodman: "frequent inspections" (supervision) and "clear guidelines and boundaries" (regulation).' },
        { q: 'Stuart Bracey', a: 'C', ev: 'you have to actually help them to get to know each other by organising morning teas and street barbecues',
          en: 'Bracey: in "tightly-packed communities" you help people "get to know each other by organising morning teas and street barbecues".' }
      ] },
    { type: 'completion', title: 'The ‘mix and match’ strategy',
      group: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 24–26 on your answer sheet.',
      items: [
        { q: 'One aspect of the Talbot Park project that some critics are concerned about is that the higher ____ of accommodation would lead to the old social problems returning.', a: 'density',
          ev: 'the new development has actually made the density of housing in Talbot Park greater',
          en: '"One controversial aspect" is that the development "made the density of housing in Talbot Park greater".' },
        { q: 'To prevent this, a team of various ____ worked on the project to ensure the buildings were not uniform.', a: 'architects',
          ev: 'employing a variety of plans by different architects',
          en: 'They mixed up the housing "by employing a variety of plans by different architects", which "avoids the uniform appearance".' },
        { q: 'Further, they created pleasant, functional interiors that could still be built within their ____. Finally, the absence of walls means Talbot Park is characterised by openness, making it easier to regulate behaviour within the community.', a: 'budget',
          ev: 'ensure the project did not go over budget',
          en: 'Efficient designs and a "no-frills" approach were used to "ensure the project did not go over budget".' }
      ] }
  ]
};
