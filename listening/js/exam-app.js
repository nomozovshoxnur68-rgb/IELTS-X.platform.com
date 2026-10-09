'use strict';
const ExamApp=(function(){

// DATA
/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  EDIT PER TEST · ANSWER KEY  —  see BUILD_INSTRUCTIONS.md §5a           ║
   ║  One entry per question 1–40. Grading: trim + lowercase, '|' = alts.   ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
const LISTENING_ANSWERS = {
  "1":"B",
  "2":"C",
  "3":"15 minute|15 minutes|fifteen minute|fifteen minutes",
  "4":"third year|3rd year|third|3rd",
  "5":"first Tuesday|1st Tuesday",
  "6":"25%|25 per cent|25 percent|twenty-five per cent",
  "7":"room 12",
  "8":"Waddell|Mrs Waddell",
  "9":"window dressing|dress windows",
  "10":"black skirt",
  "11":"C",
  "12":"B",
  "13":"C",
  "14":"A",
  "15":"D",
  "16":"75|£75",
  "17":"evening|evenings",
  "18":"dinner|4-course dinner|four-course dinner",
  "19":"52|£52",
  "20":"golf club",
  "21":"weather|weather conditions",
  "22":"Environment Agency|Environmental Agency",
  "23":"B",
  "24":"A",
  "25":"C",
  "26":"B",
  "27":"B",
  "28":"C",
  "29":"A",
  "30":"A",
  "31":"Australia",
  "32":"speed|flight speed|flying speed|speed of flight",
  "33":"looking for food|searching for food",
  "34":"start to fly|begin to fly|start flying|begin flying",
  "35":"full size|adult size|full adult size|fully grown|full grown",
  "36":"leave nest|leave the nest|leave their nest|leave the nests|leave their nests|leave nests",
  "37":"die",
  "38":"attach rings|attach identification rings|attach ID rings|attach aluminium rings|attach aluminum rings",
  "39":"note sex|note the sex",
  "40":"health|general health"
};



// ── TRANSCRIPT DATA ──────────────────────────────────────
/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  EDIT PER TEST · ANSWER TIMES  —  see BUILD_INSTRUCTIONS.md §5b         ║
   ║  Second in the audio when each answer 1–40 is spoken (review jumps).   ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
const ANSWER_TIMES={
};

/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  EDIT PER TEST · TRANSCRIPT  —  see BUILD_INSTRUCTIONS.md §5c           ║
   ║  {t,sp,tx}=speech · add answers:[id],aw:"substring" on answer lines ·   ║
   ║  {t,type:"break",label:"..."}=divider. Cover the whole audio.          ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
const TRANSCRIPT=[
  {t:92.09,type:"break",label:"Part 1 · Questions 1–10"},
  {t:92.09,e:97.8,sp:"Speaker",tx:"You will hear the manager of a shop talking to a new employee called Penny. (Knocking)"},
  {t:97.8,e:99.93,sp:"M",tx:"Come in. Good morning. It’s …"},
  {t:99.93,e:104.12,sp:"P",tx:"Penny Marne."},
  {t:104.12,e:108.25,sp:"M",tx:"Ah yes … Penny. Do sit down."},
  {t:108.25,e:118.87,sp:"M",tx:"Now I know a lot of things emerged during your interview last week, but I thought it was worth going over the essential stuff again."},
  {t:118.87,e:119.58,sp:"P",tx:"Yes, absolutely."},
  {t:119.58,e:121.01,sp:"P",tx:"That’ll be very helpful."},
  {t:121.01,e:131.19,sp:"M",tx:"The first thing is that given your interest in fashions we’ve decided to put you in the Dress Department."},
  {t:131.19,e:133.58,sp:"P",tx:"Oh that’s great."},
  {t:133.58,e:136.07,sp:"P",tx:"Is that next to the children’s section?"},
  {t:136.07,e:136.67,sp:"M",tx:"Yes."},
  {t:136.43,e:139.64,sp:"M",tx:"Now we’ve given the section a new name actually."},
  {t:139.64,e:143.56,sp:"M",tx:"From next week it’s going to be called the Young Set.",answers:[1]},
  {t:143.56,e:144.16,sp:"P",tx:"Youngster?"},
  {t:143.91,e:147.88,sp:"M",tx:"No."},
  {t:147.88,e:151.66,sp:"M",tx:"Two words – the Young Set."},
  {t:151.66,e:152.37,sp:"P",tx:"Right, sorry."},
  {t:152.37,e:158.72,sp:"M",tx:"Now, you’ll be required to work a five and a half day week."},
  {t:158.72,e:161.93,sp:"M",tx:"We’re closed on Wednesday afternoon and Sunday, of course.",answers:[2]},
  {t:161.93,e:164.06,sp:"P",tx:"Do we get overtime for Saturday?"},
  {t:164.06,e:172.97,sp:"M",tx:"Well, actually, we used to give an extra $2 an hour, but then we decided to make it a flat rate of $6.50 an hour."},
  {t:172.97,e:173.69,sp:"P",tx:"OK fine."},
  {t:173.69,e:175.11,sp:"P",tx:"And the actual hours?"},
  {t:175.11,e:179.74,sp:"M",tx:"9 – 5 with an hour for lunch and 15 minute coffee breaks.",answers:[3]},
  {t:179.74,e:181.17,sp:"P",tx:"And what about holidays?"},
  {t:181.17,e:188.3,sp:"M",tx:"Well, it’s three weeks in the first year and that rises to four weeks in your third year with us."},
  {t:188.3,e:195.07,sp:"M",tx:"Now we do give you on-the-job training which we conduct during normal hours, so you’ll be paid for that.",answers:[4]},
  {t:195.07,e:195.78,sp:"P",tx:"Which day?"},
  {t:195.78,e:198.63,sp:"M",tx:"It’s on the first Tuesday of every month.",answers:[5]},
  {t:198.63,e:207.54,sp:"M",tx:"Now, in addition to your basic pay I should explain that you’re entitled to some staff perks which our assistants do find a valuable benefit."},
  {t:207.54,e:209.32,sp:"P",tx:"Do we get a discount?"},
  {t:209.32,e:217.87,sp:"M",tx:"That’s right – 25% off everything in the store, although we do make an exception for sale goods, which I’m afraid have no discount.",answers:[6]},
  {t:217.87,e:218.59,sp:"P",tx:"Yeah, fine."},
  {t:218.59,e:221.08,sp:"P",tx:"And I was wondering about pension arrangements?"},
  {t:221.08,e:227.85,sp:"M",tx:"You get a good company pension, which our Personnel Manager will be able to explain to you in detail.",answers:[7]},
  {t:227.85,e:231.77,sp:"M",tx:"She’s in Room 12 – worth going along to see her."},
  {t:231.77,e:238.86,sp:"P",tx:"And who will I be working under – Mr Appleby?"},
  {t:238.86,e:241.71,sp:"M",tx:"The manager of your section is Mrs Waddell."},
  {t:241.71,e:243.14,sp:"M",tx:"That’s W-A-D-D-E-double L …",answers:[8]},
  {t:243.14,e:243.85,sp:"P",tx:"Mrs Waddell."},
  {t:243.85,e:277.19,sp:"P",tx:"OK, and apart from serving the customers, will I have any other duties?"},
  {t:277.19,e:277.9,sp:"M",tx:"Good question."},
  {t:277.9,e:281.11,sp:"M",tx:"We do ask you to do the window dressing.",answers:[9]},
  {t:281.11,e:282.53,sp:"P",tx:"Oh, I’ll enjoy that."},
  {t:282.53,e:288.95,sp:"M",tx:"And one of the biggest worries in the boutique is shoplifters, so you have to check for them."},
  {t:288.95,e:291.09,sp:"P",tx:"Will I receive training on that?"},
  {t:291.09,e:291.8,sp:"M",tx:"Yes, certainly."},
  {t:291.8,e:294.65,sp:"M",tx:"That’ll be one of the sessions next month."},
  {t:294.65,e:297.86,sp:"M",tx:"Oh, and we’ll be asking you to check stock."},
  {t:297.86,e:299.28,sp:"P",tx:"Right … yes, course."},
  {t:299.28,e:302.85,sp:"P",tx:"And is there a particular dress code in the shop?"},
  {t:302.85,e:312.47,sp:"M",tx:"Right … well, we’re quite flexible, but what we’d do is ask you to wear a black skirt and the shop will give you a red blouse.",answers:[10]},
  {t:312.47,e:317.46,sp:"M",tx:"We’ll also give you a name badge which you must wear all the time."},
  {t:317.46,e:318.52,sp:"P",tx:"Yeah, of course."},
  {t:318.52,e:319.12,sp:"M",tx:"Right."},
  {t:318.88,e:323.36,sp:"M",tx:"Is there anything else you’d like to ask me?"},
  {t:323.36,e:325.5,sp:"P",tx:"No, that’s very comprehensive. Thank you."},
  {t:325.5,e:326.1,sp:"M",tx:"Good."},
  {t:325.85,e:327.99,sp:"M",tx:"So we’ll see you on Monday."},
  {t:327.99,e:329.42,sp:"P",tx:"Yes, thank you. Goodbye."},
  {t:329.42,e:330.02,sp:"M",tx:"Goodbye."},
  {t:355.77,type:"break",label:"Part 2 · Questions 11–20"},
  {t:355.77,e:360.05,sp:"Speaker",tx:"You will hear a recorded message giving information about an English hotel."},
  {t:360.05,e:362.54,sp:"Speaker",tx:"Welcome to the Bridge Hotel Information Line."},
  {t:362.54,e:372.88,sp:"Speaker",tx:"The Bridge Hotel is part of the Compact Group, which is a large association of family-owned hotels offering a warm friendly atmosphere and high quality service at competitive prices."},
  {t:372.88,e:382.05,sp:"Speaker",tx:"All of them cater for a wide range of people – from business to leisure clients."},
  {t:382.05,e:428.69,sp:"Speaker",tx:"Set in a quiet residential area on the attractive outskirts of Belford, about three miles from the city centre, the Bridge Hotel is a popular choice for conferences.",answers:[11,12]},
  {t:428.69,e:468.89,sp:"Speaker",tx:"After recent refurbishment and expansion, it now has 25 double rooms and 20 singles."},
  {t:468.89,e:476.67,sp:"Speaker",tx:"All 45 are en suite with TV and coffee- and tea-making facilities."},
  {t:476.67,e:484.51,sp:"Speaker",tx:"The Bridge Hotel is set in three and a half hectares of grounds with an open-air swimming pool and four tennis courts.",answers:[13]},
  {t:484.51,e:492.0,sp:"Speaker",tx:"There is also a newly opened gym with fitness suite, which is considered one of the best equipped in the area."},
  {t:492.0,e:493.42,sp:"Speaker",tx:"Non-resident membership is available."},
  {t:493.42,e:504.49,sp:"Speaker",tx:"We have a fully licensed restaurant for residents and non-residents, which provides a wide range of dishes with a particular focus on dishes from around the world."},
  {t:504.49,e:510.55,sp:"Speaker",tx:"For the discerning business customer, we have designated business rooms with phone links allowing full internet access."},
  {t:510.55,e:520.53,sp:"Speaker",tx:"Our conference facilities cater for up to 200 delegates and we are able to offer transport to guests to and from Birmingham Airport at a small extra cost."},
  {t:520.53,e:524.61,sp:"Speaker",tx:"There now follows information about short break packages."},
  {t:524.61,e:527.82,sp:"Speaker",tx:"Welcome to the Bridge Hotel Short Breaks Information Line."},
  {t:527.82,e:530.67,sp:"Speaker",tx:"We offer three packages: 2-day, 3-day and 5-day."},
  {t:530.67,e:536.37,sp:"Speaker",tx:"The 2-day costs £75 per person per night and includes full cooked breakfast and evening entertainment.",answers:[16,17]},
  {t:536.37,e:538.15,sp:"Speaker",tx:"Very popular for weekend getaways."},
  {t:538.15,e:547.45,sp:"Speaker",tx:"The 3-day break costs £60 per person per night and in addition to offers for the 2-day break, includes one 4-course dinner.",answers:[18]},
  {t:547.45,e:552.64,sp:"Speaker",tx:"This allows guests to enjoy the full range of hotel facilities."},
  {t:552.64,e:565.11,sp:"Speaker",tx:"The 5-day break costs £52 per person per night and, in addition to offers from the 2- and 3-day breaks, includes free beauty therapy on two days and a full-day pass to a golf club.",answers:[19,20]},
  {t:565.11,e:569.74,sp:"Speaker",tx:"This package is particularly popular with couples who want a completely relaxing break."},
  {t:569.74,e:606.59,sp:"Speaker",tx:"If you would like more information about these special packages, call extension 3469 to speak to our Customer Service Manager, John Martin."},
  {t:606.59,e:613.26,sp:"Speaker",tx:"Thank you for calling the Bridge Hotel Information Line."},
  {t:646.38,type:"break",label:"Part 3 · Questions 21–30"},
  {t:646.38,e:652.44,sp:"Speaker",tx:"You will hear two students called Katy and Harry, discussing a project they are both working on."},
  {t:652.44,e:653.16,sp:"K",tx:"Hi, Harry."},
  {t:653.16,e:653.87,sp:"H",tx:"Katy, hi."},
  {t:653.87,e:664.13,sp:"H",tx:"Look, let’s sit down and work out what we’ve got to do for this next project we’ve got for the geography course."},
  {t:664.13,e:666.27,sp:"H",tx:"I’m glad we’re doing it together."},
  {t:666.27,e:673.09,sp:"H",tx:"We should be able to split it between us so it’s not too much work!"},
  {t:673.09,e:685.48,sp:"K",tx:"Yes, Harry – I had quite a long chat about it with Dr Smith yesterday, so I’ve got quite a good idea of how we should be organising it."},
  {t:685.48,e:729.69,sp:"K",tx:"Now, he said we’ve got to move on from the general project we did on soil erosion and look specifically at coastal change."},
  {t:729.69,e:737.29,sp:"K",tx:"I think that’ll be interesting, don’t you?"},
  {t:737.29,e:737.89,sp:"H",tx:"Yeah."},
  {t:737.65,e:745.13,sp:"H",tx:"I was thinking about it last night because we’ll have to make sure we pick our days to visit the beaches.",answers:[21]},
  {t:745.13,e:784.04,sp:"H",tx:"It seems there’s a reasonable train service to White Sands Bay but the weather could stop us from getting all the samples we need."},
  {t:784.04,e:790.38,sp:"H",tx:"It could take us longer than we think."},
  {t:790.38,e:798.58,sp:"K",tx:"Hmmm – yeah, but we could save ourselves some time if we try to get hold of any information that’s already been collected."},
  {t:798.58,e:804.99,sp:"K",tx:"I know several post-graduates who have done stuff in White Sands Bay this year, though on other topics."},
  {t:804.99,e:812.12,sp:"K",tx:"We could check out what the Marine Biology Unit have got – they’re bound to have something we could use."},
  {t:812.12,e:817.82,sp:"H",tx:"OK – let’s do that this week and arrange to go to the beach next week."},
  {t:817.82,e:820.32,sp:"H",tx:"I think we’ll need about three days.",answers:[22]},
  {t:820.32,e:826.02,sp:"H",tx:"If we book ahead, we can probably stay in the University lodge when we’re down there."},
  {t:826.02,e:836.0,sp:"H",tx:"The other thing is, we must go to the Environment Agency and get permission to take the samples, just in case anyone challenges us when we’re down there."},
  {t:836.0,e:839.92,sp:"H",tx:"I think we’ll have to fill out a form or something."},
  {t:839.92,e:848.82,sp:"K",tx:"Right, Harry, now let’s work out who’s going to do what first, because we have to get it done by the end of this month."},
  {t:848.82,e:853.1,sp:"K",tx:"I think we ought to divide up the data collection between us."},
  {t:853.1,e:853.7,sp:"H",tx:"What?"},
  {t:853.46,e:857.73,sp:"H",tx:"So only one of us goes to the beach, do you mean?"},
  {t:857.73,e:865.93,sp:"K",tx:"No, I think we both ought to get a picture of what’s involved, but there’s no need for us both to do everything.",answers:[23]},
  {t:865.93,e:876.98,sp:"K",tx:"I mean, when we’re at the beach you could go to both ends and make sure we have the set of shots we need to illustrate where erosion has taken place."},
  {t:876.98,e:877.69,sp:"H",tx:"OK, fine."},
  {t:877.69,e:883.75,sp:"K",tx:"And I’ll move up the beach and pick up the different stones and put sand in bags."},
  {t:883.75,e:885.88,sp:"K",tx:"Does that seem fair to you?",answers:[24]},
  {t:885.88,e:886.6,sp:"H",tx:"Yeah, OK."},
  {t:886.6,e:888.73,sp:"H",tx:"Then what about the other stuff?"},
  {t:888.73,e:894.08,sp:"H",tx:"Do you want me to go and do the questionnaires while you’re on the beach?"},
  {t:894.08,e:896.22,sp:"H",tx:"We’ll get more people that way."},
  {t:896.22,e:899.43,sp:"H",tx:"Or is it better if we do them together?"},
  {t:899.43,e:901.56,sp:"K",tx:"I think that would be better."},
  {t:901.56,e:904.77,sp:"K",tx:"We could set aside a whole day for it.",answers:[25]},
  {t:904.77,e:909.76,sp:"H",tx:"What about the lab work – looking at what we’ve collected and testing it?"},
  {t:909.76,e:912.97,sp:"K",tx:"I don’t mind doing it, but I’m pretty slow."},
  {t:912.97,e:913.57,sp:"H",tx:"OK."},
  {t:913.32,e:915.46,sp:"H",tx:"You can leave that to me.",answers:[26]},
  {t:915.46,e:916.06,sp:"K",tx:"Fine."},
  {t:915.82,e:922.94,sp:"H",tx:"Then that leaves us two weeks to write it up ready for the presentation to the class on the 29th."},
  {t:922.94,e:925.08,sp:"H",tx:"Shall we do the presentation together?",answers:[27]},
  {t:925.08,e:928.65,sp:"H",tx:"Like you do the first bit and me the second?"},
  {t:928.65,e:933.63,sp:"H",tx:"Actually, no – I think that can be a bit muddling for the class."},
  {t:933.63,e:937.2,sp:"H",tx:"I’d like to do the presentation, if you don’t mind."},
  {t:937.2,e:938.27,sp:"K",tx:"Fine by me."},
  {t:938.27,e:950.03,sp:"H",tx:"It’s just that it won’t affect the marks that you get – I mean it’s not like I get more for actually doing it – the tutor will judge it as a whole."},
  {t:950.03,e:999.58,sp:"H",tx:"But I think I remember them saying at the beginning of the year that we were expected to do three before the end of the year in order to get a satisfactory mark, and I’m one behind, whereas you’ve already done yours, haven’t you?"},
  {t:999.58,e:1010.48,sp:"H",tx:"I can see why they put them into the course, because most interviews for jobs demand you do a presentation nowadays."},
  {t:1010.48,e:1011.08,sp:"K",tx:"Yeah."},
  {t:1010.83,e:1014.04,sp:"K",tx:"Does that mean I have to write it up?"},
  {t:1014.04,e:1017.25,sp:"K",tx:"I think it’ll be impossible to do that together."},
  {t:1017.25,e:1017.85,sp:"H",tx:"Yes."},
  {t:1017.6,e:1019.38,sp:"H",tx:"You’re very good at that."},
  {t:1019.38,e:1020.1,sp:"K",tx:"Oh yes!"},
  {t:1020.1,e:1023.3,sp:"K",tx:"Typical that I get landed with it as usual."},
  {t:1023.3,e:1024.73,sp:"K",tx:"Actually, I don’t mind."},
  {t:1024.73,e:1028.29,sp:"K",tx:"I know we haven’t got very long but that’s OK.",answers:[28]},
  {t:1028.29,e:1033.28,sp:"K",tx:"Often I write better when I’m pushed for time – it focuses the mind!"},
  {t:1033.28,e:1044.33,sp:"K",tx:"But I’ll have to have a think about how we present the data, because that won’t be straightforward like the rest, so I’d like a bit of help with that …"},
  {t:1044.33,e:1045.04,sp:"H",tx:"Yeah, sure."},
  {t:1045.04,e:1056.09,sp:"H",tx:"Anyway, I was thinking – after we’ve done the presentation I think it’d be a good idea if we asked our classmates to tell us what they think of our conclusions."},
  {t:1056.09,e:1057.16,sp:"K",tx:"Well, I dunno."},
  {t:1057.16,e:1061.79,sp:"K",tx:"They won’t have done the research, so whatever they say would be uninformed."},
  {t:1061.79,e:1062.86,sp:"H",tx:"I don’t agree."},
  {t:1062.86,e:1072.12,sp:"H",tx:"I mean, they’ve all worked on something similar, so they know what’s involved and it would be useful to see how they think ours stands up.",answers:[29]},
  {t:1072.12,e:1079.61,sp:"H",tx:"We’ll have to be sure of our ground – make sure we don’t make any mistakes in our results or whatever."},
  {t:1079.61,e:1087.09,sp:"H",tx:"I don’t mean I think they’re going to tell us anything new – just give us their thoughts on the process."},
  {t:1087.09,e:1087.69,sp:"K",tx:"OK."},
  {t:1087.45,e:1090.65,sp:"K",tx:"Then I’ll deal with the questions at the end."},
  {t:1090.65,e:1102.06,sp:"K",tx:"Dr Smith said we would have to prepare thoroughly for this and I’ll probably get lots of background stuff in the process of writing up, so I’ll be prepared for any surprises!",answers:[30]},
  {t:1102.06,e:1105.98,sp:"K",tx:"If he’s impressed by your presentation then we should do well."},
  {t:1105.98,e:1106.58,sp:"H",tx:"Right."},
  {t:1132.33,type:"break",label:"Part 4 · Questions 31–40"},
  {t:1132.33,e:1139.46,sp:"Speaker",tx:"You will hear a talk by a university lecturer in Australia on a type of bird called a peregrine falcon."},
  {t:1139.46,e:1146.59,sp:"Speaker",tx:"I’m Professor Sam Richards, and I’ve come as the third guest lecturer on this course in Australian birds of prey."},
  {t:1146.59,e:1198.6,sp:"Speaker",tx:"My job is to keep a watchful scientific eye on the state of Tasmanian peregrines, so I’ll start by giving you some background to these magnificent birds of prey before I speak briefly on my own project."},
  {t:1198.6,e:1204.19,sp:"Speaker",tx:"Peregrine falcons are found on all continents with the exception of Antarctica."},
  {t:1204.19,e:1207.75,sp:"Speaker",tx:"So don’t go looking for them at the South Pole.",answers:[31]},
  {t:1207.75,e:1277.82,sp:"Speaker",tx:"They are found almost everywhere in Australia and it’s interesting to note that the name, peregrine, implies that they are wanderers – that they move from place to place following the seasons – and indeed, in most parts of the world they are migratory birds."},
  {t:1277.82,e:1282.45,sp:"Speaker",tx:"But not in Australia, however, where they prefer to stay in one place."},
  {t:1282.45,e:1293.38,sp:"Speaker",tx:"They are known to be the world’s fastest creature and they have been tracked by radar diving down towards the ground at 180 km an hour.",answers:[32]},
  {t:1293.38,e:1305.14,sp:"Speaker",tx:"However, a number of textbooks claim that their flight speed can go as high as 350 km an hour, so there is still some dispute about just how fast they can actually fly."},
  {t:1305.14,e:1318.07,sp:"Speaker",tx:"Female peregrine falcons, like all other Australian falcons, are larger than their male counterparts; in fact the female is almost a third larger than the male in the case of peregrines.",answers:[33]},
  {t:1318.07,e:1326.26,sp:"Speaker",tx:"While she stays close to the nest to protect the eggs and the young chicks, the male is mostly occupied looking for food."},
  {t:1326.26,e:1337.67,sp:"Speaker",tx:"Peregrines typically lay two or three eggs per nest and, after the eggs have hatched, when the chicks are about 20 days old, they start to fly.",answers:[34,35,36,37]},
  {t:1337.67,e:1340.52,sp:"Speaker",tx:"So they fly at a very young age."},
  {t:1340.52,e:1348.71,sp:"Speaker",tx:"By the time they are just 28 days old, they have already reached full adult size; in other words, they are fully grown."},
  {t:1348.71,e:1355.13,sp:"Speaker",tx:"Soon after this, at about two months after hatching from the egg, they leave the nest for good."},
  {t:1355.13,e:1360.15,sp:"Speaker",tx:"From this point on they’re on their own."},
  {t:1360.15,e:1370.48,sp:"Speaker",tx:"Unlike their parents, which have learned how to hunt, the young falcons are not good at feeding themselves and so during the first year about 60% of them die."},
  {t:1370.48,e:1381.59,sp:"Speaker",tx:"Once the birds have managed to live to breeding age, at two years old, they generally go on to live for another six or seven years."},
  {t:1381.59,e:1391.65,sp:"Speaker",tx:"When we come across nests with young chicks, the first thing we do is catch the chicks before they are able to fly.",answers:[38,39,40]},
  {t:1391.65,e:1394.86,sp:"Speaker",tx:"We have to catch them at an early age."},
  {t:1394.86,e:1399.67,sp:"Speaker",tx:"We then attach identification rings to their legs."},
  {t:1399.67,e:1412.35,sp:"Speaker",tx:"These rings are made of colour-coded aluminium and they allow us to identify the birds through binoculars later in their lives."},
  {t:1412.35,e:1420.91,sp:"Speaker",tx:"Thirdly, because we need to know how many males and how many female chicks are being born, we note the sex of the chicks."},
  {t:1420.91,e:1427.32,sp:"Speaker",tx:"Noting the sex of the birds is a vital part of our research, as I will discuss later."},
  {t:1427.32,e:1432.31,sp:"Speaker",tx:"The next thing to do is to take a blood sample from the chicks."},
  {t:1432.31,e:1438.37,sp:"Speaker",tx:"We take the blood sample so that we can check the level of pesticide in their bodies."},
  {t:1438.37,e:1449.06,sp:"Speaker",tx:"Peregrine falcons can build dangerous quantities of pesticides in their blood stream by feeding on smaller mammals which in turn feed on crops, grown on farms where pesticides are used."},
  {t:1449.06,e:1454.05,sp:"Speaker",tx:"Finally we check the birds thoroughly, really checking the birds for their general health."},
  {t:1454.05,e:1465.09,sp:"Speaker",tx:"This whole process only takes a few minutes; in fact, most of our time in the field is actually spent trying to find the nests, not on the data collection itself."},
  {t:1465.09,e:1467.94,sp:"Speaker",tx:"Well, that’s all I have for you today."},
  {t:1467.94,e:1472.43,sp:"Speaker",tx:"If you’d like to do some further reading …"}
];

/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  EDIT PER TEST · IDS  —  see BUILD_INSTRUCTIONS.md §3                   ║
   ║  STORAGE_KEY MUST be unique per test or saved progress collides.       ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
const STORAGE_KEY="cdi_listening_prem_007";   // trailing digits also set CERT_TEST_NO

/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  EDIT PER TEST · SECTION CONTENT  —  see BUILD_INSTRUCTIONS.md §6       ║
   ║  buildSection1..4 each return one section's HTML (IDs S1:1-10 S2:11-20 ║
   ║  S3:21-30 S4:31-40). Mix any block type per §4: gap-fill / MCQ /       ║
   ║  drag-match / map-label. Keep all data-q / data-lq / data-dm / data-   ║
   ║  val / data-pool attributes. MAP = swap image + labels + letters only. ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
// QUESTION BUILDERS
/* The note block is ONE inline flow (§7): bare text nodes, <br> line breaks and
   runs of &nbsp; for indentation, at line-height 24px. gapInput() therefore emits
   an INLINE span with no wrapper row, no padding and no stray whitespace — the
   whitespace either side of the input has to come from the surrounding text. */
function nb(n){var o='';while(n-->0)o+='&nbsp;';return o;}
function gapInput(id){
  return '<span class="gap-field" id="lq-row-'+id+'">'+
    '<input type="text" id="lq-'+id+'" class="gap-input" data-lq="'+id+'" oninput="ExamApp.onListeningInput('+id+')" '+
    'autocomplete="off" spellcheck="false" size="10" maxlength="500" tabindex="0" aria-label="Insert answer" placeholder="'+id+'">'+
    '<span class="feedback-pill" id="lfb-'+id+'"></span></span>';
}

/* measured option row: 1154 x 43.2, #fff, no border, padding 9.6px 8px 9.6px 32px,
   16px/24px Arial, with the radio inside the 32px left pad. The official Listening
   MCQ rows carry no A/B/C letter — the letter is kept in the DOM for grading only. */
function mcqOption(qid,letter,text) {
  return `<label class="option"><input type="radio" name="lq-${qid}" value="${letter}" tabindex="0" data-q="${qid}"><span class="opt-letter" aria-hidden="true">${letter}</span>${text}</label>`;
}

function mcqCard(qid,qText,options) {
  return `<div class="q-card" id="lq-card-${qid}">
    <div class="q-row">
      <span class="q-pill" data-qnum="${qid}">${qid}</span>
      <div class="q-text">${qText}</div>
      <span class="feedback-pill" id="lfb-${qid}"></span>
    </div>
    <div class="options">${options.map(o=>mcqOption(qid,o.letter,o.text)).join('')}</div>
  </div>`;
}


/* ── CATALOGUE HELPERS (2026-09-02) — one per widget the official player renders ── */
/* The "⌨ Help" link every drag question carries on the official player. Native
   <details>, so it needs no engine code. */
function kbHelp(){
  return '<details class="kb-help"><summary><svg viewBox="0 0 20 14" aria-hidden="true"><rect x="0.5" y="0.5" width="19" height="13" rx="1.5" fill="none" stroke="currentColor"/><g fill="currentColor"><rect x="3" y="3" width="2" height="2"/><rect x="7" y="3" width="2" height="2"/><rect x="11" y="3" width="2" height="2"/><rect x="15" y="3" width="2" height="2"/><rect x="3" y="6.5" width="2" height="2"/><rect x="7" y="6.5" width="2" height="2"/><rect x="11" y="6.5" width="2" height="2"/><rect x="15" y="6.5" width="2" height="2"/><rect x="5" y="10" width="10" height="2"/></g></svg>Help</summary>'+
    '<div class="kb-help-text">Drag an answer into a gap. To change an answer, drag it to another gap or back to the list. An answer can be used once unless the instructions say otherwise.</div></details>';
}
/* An inline drop zone inside running text (summary, notes, sentence or flow-chart
   completion "from the box"). Same contract as the row drops: data-q on the zone,
   hidden input with data-lq + data-dm, pill lfb-N, wrapper lq-row-N for the jump button. */
function dropInline(id){
  return '<span class="gap-field" id="lq-row-'+id+'"><span class="drag-drop drag-drop-inline" id="drop-'+id+'" data-q="'+id+'"><span class="drag-num-hint">'+id+'</span></span>'+
    '<input type="hidden" id="lq-'+id+'" data-lq="'+id+'" data-dm="1"><span class="feedback-pill" id="lfb-'+id+'"></span></span>';
}
/* A drop zone positioned on a plan / map / diagram. x,y are percentages of the stage. */
function mapZone(id,x,y){
  return '<div class="map-zone" id="lq-row-'+id+'" style="left:'+x+'%;top:'+y+'%"><div class="drag-drop" id="drop-'+id+'" data-q="'+id+'"><span class="drag-num-hint">'+id+'</span></div>'+
    '<input type="hidden" id="lq-'+id+'" data-lq="'+id+'" data-dm="1"><span class="feedback-pill" id="lfb-'+id+'"></span></div>';
}
function poolChips(poolId,words){
  return words.map((w,i)=>'<div class="drag-chip" id="dchip-'+poolId+'-'+i+'" data-val="'+w+'" data-pool="pool-'+poolId+'">'+w+'</div>').join('');
}
function flowArrow(){return '<div class="flow-arrow"><svg viewBox="0 0 22 28" aria-hidden="true"><path d="M8 0h6v15h6L11 28 2 15h6z" fill="#000"/></svg></div>';}
/* Flow-chart: boxes joined by arrows. Each box is a string; a gap is either a typed
   ${gapInput(n)} or a dragged ${dropInline(n)} — the caller decides. */
function flowChart(title,boxes){
  return (title?'<div class="flow-title">'+title+'</div>':'')+'<div class="flow-chart">'+boxes.map((b,i)=>(i?flowArrow():'')+'<div class="flow-box">'+b+'</div>').join('')+'</div>';
}
/* "Choose TWO letters": one card, two ids, checkbox rows on the measured .option row. */
function msCard(a,b,question,opts){
  const optHTML=opts.map(([l,t])=>'<label class="option ms-option"><input type="checkbox" class="ms-box" value="'+l+'"><span class="opt-letter" aria-hidden="true">'+l+'</span><span>'+t+'</span></label>').join('');
  return '<div class="q-card ms-group" id="lq-card-'+a+'" data-ms-ids="'+a+','+b+'"><div class="q-row"><span class="q-pill" data-qnum="'+a+'">'+a+'–'+b+'</span><div class="q-text">'+question+'</div><span class="feedback-pill" id="lfb-'+a+'"></span></div>'+
    '<div class="ms-hint">Choose TWO letters.</div><div class="options ms-options">'+optHTML+'</div></div>';
}
/* Row-per-item drag match (the official "IELTS Matching"): label, zone, chips on the right. */
function matchRows(items,small){
  return items.map(([id,name])=>'<div class="drag-item-row" id="lq-row-'+id+'"><span class="drag-item-label">'+name+'</span><div class="drag-drop'+(small?' drag-drop-sm':'')+'" id="drop-'+id+'" data-q="'+id+'"><span class="drag-num-hint">'+id+'</span></div>'+
    '<input type="hidden" id="lq-'+id+'" data-lq="'+id+'" data-dm="1"><span class="feedback-pill" id="lfb-'+id+'"></span></div>').join('');
}

/* ══════════════════ PART 1 · notes (typed) ══════════════════ */
function buildSection1() {
  const mcqs=[
    [1,"What kind of shop is it?",[{letter:'A',text:'a ladies&rsquo; dress shop'},{letter:'B',text:'a department store'},{letter:'C',text:'a children&rsquo;s clothes shop'}]],
    [2,"What is the name of the section Penny will be working in?",[{letter:'A',text:'the Youngster'},{letter:'B',text:'the Youngset'},{letter:'C',text:'the Young Set'}]]
  ];
  return `<div class="section-block" id="listening-part-1">
    <div class="section-head">
      <div class="num">Questions 1 and 2</div>
      <div class="instruction">Choose the correct letter, <em>A, B or C</em>.</div>
    </div>
    ${mcqs.map(([id,q,o])=>mcqCard(id,q,o)).join('')}
    <div class="section-head" style="margin-top:24px">
      <div class="num">Questions 3&ndash;10</div>
      <div class="instruction">Complete the notes below. Write <em>NO MORE THAN TWO WORDS AND/OR A NUMBER</em> for each answer.</div>
    </div>
    <div class="note-flow"><b>Pay:</b> $6.50 an hour<br>
      <br><b>Breaks:</b> one hour for lunch and ${gapInput(3)} coffee breaks<br>
      <br><b>Holidays:</b> three weeks a year in the first two years<br>
      <br>${nb(12)}four weeks a year in the ${gapInput(4)}<br>
      <br><b>Staff training:</b> held on the ${gapInput(5)} of every month<br>
      <br><b>Special staff benefits or &lsquo;perks&rsquo;:</b> staff discount of ${gapInput(6)} on everything except sale goods<br>
      <br><b>Information on pension:</b> see Personnel Manager, office in ${gapInput(7)}<br>
      <br><b>Boss&rsquo;s name:</b> ${gapInput(8)}<br>
      <br><b>Duties:</b> serve customers<br>
      <br>${nb(12)}${gapInput(9)}<br>
      <br>${nb(12)}check for shoplifters<br>
      <br>${nb(12)}check the stock<br>
      <br><b>Expected to wear:</b> a ${gapInput(10)} , a red blouse, and a name badge</div>
  </div>`;
}

/* ══════════════════ PART 2 · MCQ + choose TWO + table ══════════════════ */
function buildSection2() {
  const mcqs=[
    [11,"The Bridge Hotel is located in",[{letter:'A',text:'the city centre.'},{letter:'B',text:'the country.'},{letter:'C',text:'the suburbs.'}]],
    [12,"The newest sports facility in the hotel is",[{letter:'A',text:'a swimming pool.'},{letter:'B',text:'a fitness centre.'},{letter:'C',text:'a tennis court.'}]],
    [13,"The hotel restaurant specialises in",[{letter:'A',text:'healthy food.'},{letter:'B',text:'local food.'},{letter:'C',text:'international food.'}]]
  ];
  const twoOpts=[['A','internet access'],['B','mobile phone hire'],['C','audio-visual facilities'],['D','airport transport'],['E','translation services']];

  return `<div class="section-block" id="listening-part-2">
    <div class="section-head">
      <div class="num">Questions 11&ndash;13</div>
      <div class="instruction">Choose the correct letter, <em>A, B or C</em>.</div>
    </div>
    ${mcqs.map(([id,q,o])=>mcqCard(id,q,o)).join('')}
    <div class="section-head" style="margin-top:24px">
      <div class="num">Questions 14 and 15</div>
      <div class="instruction">Choose <em>TWO</em> letters, <em>A&ndash;E</em>.</div>
    </div>
    ${msCard(14,15,'Which <em>TWO</em> business facilities are mentioned?',twoOpts)}
    <div class="section-head" style="margin-top:24px">
      <div class="num">Questions 16&ndash;20</div>
      <div class="instruction">Complete the table below. Write <em>NO MORE THAN TWO WORDS AND/OR A NUMBER</em> for each answer.</div>
      <h2>SHORT BREAK PACKAGES</h2>
    </div>
    <table class="ielts-table">
      <tr><th>Length of stay</th><th>Cost (per person per night)</th><th>Special features</th></tr>
      <tr><td>2 days</td><td>&pound; ${gapInput(16)}</td><td>Full cooked breakfast<br>Entertainment in the ${gapInput(17)}</td></tr>
      <tr><td>3 days</td><td>&pound;60</td><td>As above, plus:<br>&ndash; a ${gapInput(18)}</td></tr>
      <tr><td>5 days</td><td>&pound; ${gapInput(19)}</td><td>As above, plus:<br>&ndash; free beauty therapy on two of the days<br>&ndash; full-day membership of a ${gapInput(20)}</td></tr>
    </table>
  </div>`;
}

/* ══════════════════ PART 3 · sentences + who-does-what + MCQ ══════════════════ */
function buildSection3() {
  const items=[[23,'take photographs'],[24,'collect samples'],[25,'interview people'],[26,'analyse data']];
  const opts=[['A','Katy'],['B','Harry'],['C','Both Katy and Harry']];
  const poolHTML=opts.map(([l,t],i)=>'<div class="drag-chip" id="dchip-who-'+i+'" data-val="'+l+'" data-pool="pool-who"><b>'+l+'</b>&nbsp;&nbsp;'+t+'</div>').join('');
  const mcqs=[
    [27,"Why does Harry want to do the presentation?",[{letter:'A',text:'to practise skills for his future career'},{letter:'B',text:'to catch up with his course requirements'},{letter:'C',text:'to get a better mark than for his last presentation'}]],
    [28,"What is Katy&rsquo;s attitude to writing up the project?",[{letter:'A',text:'She is worried about the time available for writing.'},{letter:'B',text:'She thinks it is unfair if she has to do all the writing.'},{letter:'C',text:'She is concerned that some parts will be difficult.'}]],
    [29,"Why does Harry want to involve the other students at the end of the presentation?",[{letter:'A',text:'to get their opinions about the conclusions'},{letter:'B',text:'to help him and Katy reach firm conclusions'},{letter:'C',text:'to see if they have reached similar conclusions'}]],
    [30,"Katy agrees to deal with any questions because",[{letter:'A',text:'she feels she will be confident about the material.'},{letter:'B',text:'Harry will be doing the main presentation.'},{letter:'C',text:'she has already told Dr Smith she will do this.'}]]
  ];

  return `<div class="section-block" id="listening-part-3">
    <div class="section-head">
      <div class="num">Questions 21 and 22</div>
      <div class="instruction">Complete the sentences below. Write <em>NO MORE THAN TWO WORDS</em> for each answer.</div>
      <h2>Research Project</h2>
    </div>
    <div class="note-flow">-${nb(1)}Harry and Katy have to concentrate on coastal change for their next project.<br>
      <br><b>21</b>${nb(2)}Their work could be delayed by the ${gapInput(21)} .<br>
      <br>-${nb(1)}They plan to get help from the Marine Biology Unit.<br>
      <br><b>22</b>${nb(2)}Before they go to the beach, they need to visit the ${gapInput(22)} .</div>
    <div class="section-head" style="margin-top:24px">
      <div class="num">Questions 23&ndash;26</div>
      <div class="instruction">Who will do each of the following tasks? Move the correct letter, <em>A, B or C</em>, into the gaps next to questions 23&ndash;26. You can use any letter more than once.</div>
    </div>
    ${kbHelp()}
    <div class="drag-match-layout">
      <div class="drag-left">
        <div class="drag-col-hdr">Tasks</div>
        <div class="drag-items">${matchRows(items)}</div>
      </div>
      <div class="drag-right">
        <div class="drag-col-hdr">People</div>
        <div class="drag-pool" id="pool-who" data-pool="pool-who" data-reuse="1">${poolHTML}</div>
      </div>
    </div>
    <div class="section-head" style="margin-top:24px">
      <div class="num">Questions 27&ndash;30</div>
      <div class="instruction">Choose the correct letter, <em>A, B or C</em>.</div>
    </div>
    ${mcqs.map(([id,q,o])=>mcqCard(id,q,o)).join('')}
  </div>`;
}

/* ══════════════════ PART 4 · sentences + table + notes ══════════════════ */
function buildSection4() {
  return `<div class="section-block" id="listening-part-4">
    <div class="section-head">
      <div class="num">Questions 31&ndash;33</div>
      <div class="instruction">Complete the sentences below. Write <em>NO MORE THAN THREE WORDS</em> for each answer.</div>
      <h2>Peregrine Falcons</h2>
    </div>
    <div class="note-flow"><b>31</b>${nb(2)}The Peregrine falcons found in ${gapInput(31)} are not migratory birds.<br>
      <br><b>32</b>${nb(2)}There is disagreement about their maximum ${gapInput(32)} .<br>
      <br><b>33</b>${nb(2)}When the female is guarding the nest, the male spends most of his time ${gapInput(33)} .</div>
    <div class="section-head" style="margin-top:24px">
      <div class="num">Questions 34&ndash;37</div>
      <div class="instruction">Complete the table below. Write <em>NO MORE THAN THREE WORDS</em> for each answer.</div>
    </div>
    <table class="ielts-table">
      <tr><th>Age of falcons</th><th>What occurs</th></tr>
      <tr><td>20 days old</td><td>The falcons ${gapInput(34)}</td></tr>
      <tr><td>28 days old</td><td>The falcons are ${gapInput(35)}</td></tr>
      <tr><td>2 months old</td><td>The falcons ${gapInput(36)} permanently</td></tr>
      <tr><td>1&ndash;12 months old</td><td>More than half of falcons ${gapInput(37)}</td></tr>
    </table>
    <div class="section-head" style="margin-top:24px">
      <div class="num">Questions 38&ndash;40</div>
      <div class="instruction">Complete the notes below. Write <em>NO MORE THAN THREE WORDS</em> for each answer.</div>
      <h2>Procedures used for field research on Peregrine falcon chicks</h2>
    </div>
    <div class="note-flow">First: catch chicks<br>
      <br>Second: ${gapInput(38)} to legs<br>
      <br>Third: ${gapInput(39)} of chicks<br>
      <br>Fourth: take blood sample to assess level of pesticide<br>
      <br>Fifth: check the ${gapInput(40)} of the birds</div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════
   HIGHLIGHTS + ANCHORED NOTES - ported from the Reading master.
   Annotations are stored as character offsets into #listening-render, so
   they survive buildSectionN() re-rendering the part. restoreAnnotations()
   is called at the end of renderSection().
   ══════════════════════════════════════════════════════════════════ */
let activeNoteSpan = null;
const USER_HL_CLASSES = ['hl-y','hl-g','hl-p','hl-note'];

function partRoot() {
  return document.getElementById('listening-render');
}

function annoTextNodes(root) {
  if (!root) return [];
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (n.parentElement && n.parentElement.closest(
            '.section-head, select, input, textarea, button, .drag-chip, .drag-drop, .gap-input, .feedback-pill, .q-pill, .ms-hint')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let n;
  while ((n = walker.nextNode())) out.push(n);
  return out;
}

function offsetOfPoint(root, node, offset) {
  const nodes = annoTextNodes(root);
  let total = 0;
  for (const n of nodes) {
    if (n === node) return total + offset;
    total += n.nodeValue.length;
  }
  return -1;
}

function rangeFromOffsets(root, start, end) {
  const nodes = annoTextNodes(root);
  const range = document.createRange();
  let total = 0, started = false;
  for (const n of nodes) {
    const len = n.nodeValue.length;
    if (!started && start >= total && start <= total + len) {
      range.setStart(n, start - total);
      started = true;
    }
    if (started && end >= total && end <= total + len) {
      range.setEnd(n, end - total);
      return range;
    }
    total += len;
  }
  return null;
}

// Wrap a range that crosses element boundaries, one text node at a time.
// surroundContents() throws on such ranges, so this is the fallback path.
function wrapRangeSegments(range, className, noteText) {
  const made = [];
  const root = partRoot();
  if (!root) return made;
  // Snapshot the affected nodes and their slice bounds BEFORE mutating, since
  // splitText() inserts new siblings and would invalidate a live walk.
  const jobs = [];
  annoTextNodes(root).forEach(n => {
    if (!range.intersectsNode(n)) return;
    const s = (n === range.startContainer) ? range.startOffset : 0;
    const e = (n === range.endContainer)   ? range.endOffset   : n.nodeValue.length;
    if (e > s) jobs.push({ node: n, s: s, e: e });
  });
  jobs.forEach(j => {
    let target = j.node;
    if (j.s > 0) target = target.splitText(j.s);
    if (target.nodeValue.length > (j.e - j.s)) target.splitText(j.e - j.s);
    const span = document.createElement('span');
    span.className = 'hl ' + className;
    if (className === 'hl-note') {
      span.setAttribute('data-note', noteText || '');
      span.onclick = function(ev) { ExamApp.openNote(this, ev); };
    }
    target.parentNode.insertBefore(span, target);
    span.appendChild(target);
    made.push(span);
  });
  return made;
}

// Unwrap every user annotation, leaving the passage text untouched. This is what
// makes restore idempotent: without it, a second render wraps already-wrapped
// spans, and each save then doubles the stored list.
function clearUserAnnotations(root) {
  if (!root) return;
  let guard = 0;
  let spans = [...root.querySelectorAll('span.hl')].filter(
    s => USER_HL_CLASSES.some(c => s.classList.contains(c)));
  while (spans.length && guard++ < 500) {
    spans.forEach(span => {
      const p = span.parentNode;
      if (!p) return;
      while (span.firstChild) p.insertBefore(span.firstChild, span);
      p.removeChild(span);
    });
    spans = [...root.querySelectorAll('span.hl')].filter(
      s => USER_HL_CLASSES.some(c => s.classList.contains(c)));
  }
  root.normalize();   // stitch the split text nodes back together
}

// Collapse duplicates, and merge touching/overlapping plain highlights of the
// same colour. Notes are never merged — each one carries its own text.
function tidyAnnotations(list) {
  const seen = new Set();
  const uniq = [];
  list.forEach(a => {
    const k = a.s + ':' + a.e + ':' + a.c + ':' + (a.n || '');
    if (seen.has(k)) return;
    seen.add(k);
    uniq.push(a);
  });
  const notes = uniq.filter(a => a.c === 'hl-note');
  const marks = uniq.filter(a => a.c !== 'hl-note').sort((x, y) => x.s - y.s || x.e - y.e);
  const merged = [];
  marks.forEach(a => {
    const last = merged[merged.length - 1];
    if (last && last.c === a.c && a.s <= last.e) last.e = Math.max(last.e, a.e);
    else merged.push({ s: a.s, e: a.e, c: a.c, n: '' });
  });
  // Longest first so wider marks restore before narrower ones nest inside.
  return merged.concat(notes).sort((a, b) => (b.e - b.s) - (a.e - a.s));
}

// Re-derive the stored annotation list from whatever is currently in the DOM.
function syncAnnotations() {
  const root = partRoot();
  if (!root || state.stage !== 'listening') return;
  const p = state.currentSection;
  const list = [];
  root.querySelectorAll('span.hl').forEach(span => {
    const cls = USER_HL_CLASSES.find(c => span.classList.contains(c));
    if (!cls) return;                       // skip review-mode explanation spans
    // Nested marks are kept on purpose: re-highlighting part of an existing
    // highlight in another colour is a real thing students do. Restore paints
    // widest-first, so the inner mark ends up on top exactly as drawn.
    const first = annoTextNodes(span)[0];
    if (!first) return;
    const start = offsetOfPoint(root, first, 0);
    if (start < 0) return;
    list.push({ s: start, e: start + span.textContent.length, c: cls,
                n: span.getAttribute('data-note') || '',
                t: span.textContent.slice(0, 90) });
  });
  state.annotations[p] = tidyAnnotations(list);
  saveState();
}

function restoreAnnotations(passageNum) {
  const root = partRoot();
  if (!root) return;
  const list = (state.annotations && state.annotations[passageNum]) || [];
  clearUserAnnotations(root);          // idempotent: never wrap twice
  if (!list.length) return;
  tidyAnnotations(list).forEach(a => {
    try {
      const range = rangeFromOffsets(root, a.s, a.e);
      if (!range) return;
      const span = document.createElement('span');
      span.className = 'hl ' + a.c;
      if (a.c === 'hl-note') {
        span.setAttribute('data-note', a.n || '');
        span.setAttribute('title', a.n || 'Empty note — click to edit');
        span.onclick = function(ev) { ExamApp.openNote(this, ev); };
      }
      try {
        range.surroundContents(span);
      } catch (e) {
        wrapRangeSegments(range, a.c, a.n);
      }
    } catch (e) { /* a single unrestorable mark must never break the render */ }
  });
}

function addNote() {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return;
  
  const range = sel.getRangeAt(0);
  let span = null;
  try {
    span = document.createElement('span');
    span.className = 'hl hl-note';
    span.onclick = function(e) { ExamApp.openNote(this, e); };
    range.surroundContents(span);
  } catch(e) {
    // Selection crosses element boundaries — wrap per node and anchor the note
    // to the first fragment, matching the behaviour of applyHighlight.
    span = (wrapRangeSegments(range, 'hl-note', '') || [])[0] || null;
  }
  sel.removeAllRanges();
  const popup = document.getElementById('hl-popup');
  if (popup) popup.classList.remove('show');
  if (!span) { toast('Could not add a note there', 'error'); return; }

  const rect = span.getBoundingClientRect();
  openNote(span, { pageX: rect.left + window.scrollX + (rect.width/2),
                   pageY: rect.bottom + window.scrollY });
}

function openNote(span, e) {
  activeNoteSpan = span;
  const modal = document.getElementById('note-modal');
  const ta = document.getElementById('note-textarea');
  ta.value = span.getAttribute('data-note') || '';
  
  // Clamp inside the viewport — notes near the right edge or the bottom of a
  // passage were previously positioned off-screen and looked like a dead button.
  modal.classList.add('show');
  const w = modal.offsetWidth  || 290;
  const h = modal.offsetHeight || 190;
  const maxL = window.scrollX + window.innerWidth  - w - 14;
  const maxT = window.scrollY + window.innerHeight - h - 14;
  modal.style.left = Math.max(window.scrollX + 10, Math.min(e.pageX - w/2, maxL)) + 'px';
  modal.style.top  = Math.max(window.scrollY + 10, Math.min(e.pageY + 10,  maxT)) + 'px';
  setTimeout(() => ta.focus(), 60);
}

function saveNote() {
  if (activeNoteSpan) {
    const ta = document.getElementById('note-textarea');
    const val = ta.value.trim();
    activeNoteSpan.setAttribute('data-note', val);
    activeNoteSpan.setAttribute('title', val || 'Empty note — click to edit');
  }
  closeNote();
  syncAnnotations();
  renderNotesDrawer();
}

// V3: a note with nothing in it is just a highlight the student can't remove.
function deleteNote() {
  if (activeNoteSpan) {
    const p = activeNoteSpan.parentNode;
    while (activeNoteSpan.firstChild) p.insertBefore(activeNoteSpan.firstChild, activeNoteSpan);
    p.removeChild(activeNoteSpan);
    p.normalize();
  }
  closeNote();
  syncAnnotations();
}

function closeNote() {
  const m = document.getElementById('note-modal');
  if (m) m.classList.remove('show');
  activeNoteSpan = null;
}

function allNotes() {
  const out = [];
  [1, 2, 3, 4].forEach(p => ((state.annotations && state.annotations[p]) || [])
    .forEach((a, i) => { if (a.c === 'hl-note' && (a.n || '').trim()) out.push({ ...a, p, i }); }));
  return out;
}

function renderNotesDrawer() {
  const body = document.getElementById('anno-drawer-body');
  const badge = document.getElementById('anno-count');
  if (!body) return;
  const notes = allNotes();

  if (badge) { badge.hidden = notes.length === 0; badge.textContent = notes.length; }

  if (!notes.length) {
    // wording taken verbatim from the official sidebar's empty state
    body.innerHTML = `<div class="nd-empty">
        <b>Your private notes will show here</b>
        <span>Select text to highlight or create a note.</span>
      </div>`;
    return;
  }
  let html = '', lastP = null;
  notes.forEach(n => {
    if (n.p !== lastP) { html += `<div class="nd-group">Part ${n.p}</div>`; lastP = n.p; }
    html += `<div class="nd-item" onclick="ExamApp.jumpToNote(${n.p},${n.s})">
        <button class="nd-del" title="Delete note"
                onclick="event.stopPropagation();ExamApp.deleteNoteAt(${n.p},${n.s})">&times;</button>
        <div class="nd-quote">${escapeHtml(n.t || '')}</div>
        <div class="nd-text">${escapeHtml(n.n)}</div>
      </div>`;
  });
  body.innerHTML = html;
}

function toggleAnnoDrawer(force) {
  const d = document.getElementById('anno-drawer');
  if (!d) return;
  const open = (force === undefined) ? !d.classList.contains('open') : !!force;
  d.classList.toggle('open', open);
  d.setAttribute('aria-hidden', open ? 'false' : 'true');
  document.body.classList.toggle('anno-open', open);
  if (open) renderNotesDrawer();
}

function jumpToNote(passage, start) {
  const go = () => {
    const root = partRoot();
    if (!root) return;
    const span = [...root.querySelectorAll('span.hl-note')].find(s => {
      const first = annoTextNodes(s)[0];
      return first && offsetOfPoint(root, first, 0) === start;
    });
    if (!span) return;
    span.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
    span.classList.add('note-flash');
    setTimeout(() => span.classList.remove('note-flash'), 1200);
  };
  if (state.currentSection !== passage) { renderSection(passage); setTimeout(go, 260); }
  else go();
}

function deleteNoteAt(passage, start) {
  const list = (state.annotations && state.annotations[passage]) || [];
  state.annotations[passage] = list.filter(a => !(a.c === 'hl-note' && a.s === start));
  saveState();
  if (state.currentSection === passage) restoreAnnotations(passage);
  renderNotesDrawer();
}


// STATE
const state={student:{name:''},stage:'registration',startedAt:null,finishedAt:null,listeningAnswers:{},listeningFlags:{},annotations:{1:[],2:[],3:[],4:[]},timers:{listening:40*60},currentSection:1,activeQuestion:null,timerHidden:false,warnings:0};
let timerInterval=null;
let _tpIdx=-1;
/* Progress is deliberately NOT persisted. A sitting lives in memory only:
   reload and the paper restarts, which is what the Cosmos build already
   implied by removing the resume sheet. Preferences (theme, text size,
   notes) are unaffected — those are stored under their own keys.
   STORAGE_KEY stays because its trailing digits set the test number. */
function saveState(){/* no-op — progress is not saved */}
function loadState(){return false;}   /* nothing is ever restored */

// STAGE NAV
const STAGES=['registration','listening-intro','listening','completion','results'];
function goToStage(name){
  STAGES.forEach(s=>{const el=document.getElementById('stage-'+s);if(el)el.classList.remove('active');});
  const t=document.getElementById('stage-'+name);
  if(t)t.classList.add('active');
  // The cosmic stages re-run their entrance every time they are shown; the exam
  // screen and the certificate never get one.
  if(t&&['registration','listening-intro','completion'].includes(name)){
    t.classList.remove('cdi-enter');
    requestAnimationFrame(()=>t.classList.add('cdi-enter'));
  }
  // the resume sheet can never outlive the question it asked
  const _rs=document.getElementById('ch-resume');if(_rs)_rs.classList.remove('show');
  state.stage=name;saveState();window.scrollTo(0,0);
  if(name!=='listening')document.body.classList.remove('notes-open');
  // Hand-off to the particle layer in the SAME tick as the stage swap, so the
  // white exam screen never inherits a frame of the shell.
  try{if(window.CDIAtmosphere&&window.CDIAtmosphere.sync)window.CDIAtmosphere.sync();}catch(e){}
}

// FULLSCREEN + ANTI-CHEAT
function enterFullscreen(){const el=document.documentElement;const req=el.requestFullscreen||el.webkitRequestFullscreen||el.mozRequestFullScreen||el.msRequestFullscreen;if(req){try{const p=req.call(el);if(p&&typeof p.catch==='function')return p.catch(()=>{});}catch(e){}}return Promise.resolve();}
function exitFullscreen(){if(!document.fullscreenElement&&!document.webkitFullscreenElement)return;const ex=document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen;if(ex)ex.call(document);}
function toggleFullscreen(){if(!document.fullscreenElement&&!document.webkitFullscreenElement)enterFullscreen();else exitFullscreen();}
// TEST HARNESS: ?test=1 disables proctoring so automated visual QA can drive the exam
// across tabs without tripping integrity warnings. Has no effect in normal use.
const TEST_MODE=(function(){try{return new URLSearchParams(location.search).has('test');}catch(e){return false;}})();
/* Anything worth losing: an unfinished paper, and equally a finished one whose
   certificate is on screen. A reload ends the sitting, so the browser's own
   "leave site?" is the last place the candidate can still change their mind. */
function hasLiveAttempt(){if(TEST_MODE)return false;if(window.__cdiIntentionalReload)return false;return !!(state.stage&&state.stage!=='registration');}
function isInExamMode(){if(TEST_MODE)return false;if(document.body.classList.contains('review-mode'))return false;return['listening','listening-intro'].includes(state.stage);}
// A page that is being closed fires visibilitychange->hidden on its way out.
// That is not a candidate switching tabs, and banking a strike for it also
// re-wrote the saved session a moment after it had been cleared.
let _unloading=false;
function recordViolation(reason){
  if(_unloading||!isInExamMode())return;
  state.warnings=Math.min(state.warnings+1,3);saveState();
  document.querySelectorAll('#strike-counter .strike').forEach((s,i)=>s.classList.toggle('on',i<state.warnings));
  document.getElementById('warning-body').textContent=reason;
  document.getElementById('warning-strikes-text').innerHTML=state.warnings>=3
    ?'<strong style="color:#ff5e78">Final warning reached.</strong> The test has been terminated.'
    :'Warning <strong>'+state.warnings+' of 3</strong> — the test will be terminated on the third violation.';
  document.getElementById('warning-overlay').classList.add('show');
  if(state.warnings>=3)setTimeout(()=>{document.getElementById('warning-overlay').classList.remove('show');forceTerminate();},3500);
}
function dismissWarning(){document.getElementById('warning-overlay').classList.remove('show');if(state.warnings<3&&isInExamMode())enterFullscreen();}
function forceTerminate(){toast('Test terminated due to integrity violations','error');pauseTimer();stopAudio();document.body.classList.remove('no-select');goToStage('completion');exitFullscreen();}
function setupAntiCheat(){
  window.addEventListener('pagehide',()=>{_unloading=true;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&isInExamMode())recordViolation('You switched tabs or minimised the window. The test must remain visible at all times — and the recording does not stop.');});
  function fsHandler(){const fs=document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement;if(!fs&&isInExamMode())recordViolation('You left full-screen mode. The test must run in full-screen from start to finish.');}
  document.addEventListener('fullscreenchange',fsHandler);document.addEventListener('webkitfullscreenchange',fsHandler);
  /* one class, so the full-screen glyph can show enter vs exit */
  const fsClass=function(){document.body.classList.toggle('is-fullscreen',!!(document.fullscreenElement||document.webkitFullscreenElement));};
  document.addEventListener('fullscreenchange',fsClass);document.addEventListener('webkitfullscreenchange',fsClass);fsClass();
  document.addEventListener('contextmenu',(e)=>{if(e.target.tagName!=='INPUT'&&e.target.tagName!=='TEXTAREA')e.preventDefault();});
  document.addEventListener('keydown',(e)=>{if(e.key==='F12')e.preventDefault();if((e.ctrlKey||e.metaKey)&&e.shiftKey&&['I','i','J','j'].includes(e.key))e.preventDefault();if((e.ctrlKey||e.metaKey)&&['u','U','s','S'].includes(e.key))e.preventDefault();if((e.ctrlKey||e.metaKey)&&['p','P'].includes(e.key)&&state.stage!=='results')e.preventDefault();});
  window.addEventListener('beforeunload',(e)=>{if(hasLiveAttempt()){e.preventDefault();e.returnValue='Are you sure?';return e.returnValue;}});
}

// TIMER
function fmt(s){if(s<0)s=0;return Math.floor(s/60).toString().padStart(2,'0')+':'+(s%60).toString().padStart(2,'0');}
/* The official Listening player has no timer in the DOM at any point (§1.5). This
   is the practice product's own clock, shown in the header in the candidate block's
   type. The bug it replaces: a SILENT 40-minute countdown that called finishExam()
   with no element to display it and no warning of any kind. It now warns. */
let _expireCb=null,_tuTimer=null;
function startTimer(section,onExpire){pauseTimer();function tick(){state.timers[section]--;updateTimerDisplay(section);if(state.timers[section]%5===0)saveState();if(state.timers[section]<=0){pauseTimer();timeUp(onExpire);}}updateTimerDisplay(section);timerInterval=setInterval(tick,1000);}
function updateTimerDisplay(section){
  const el=document.getElementById('timer-'+section),box=document.getElementById('hdr-clock');
  const t=Math.max(0,state.timers[section]);
  if(el)el.textContent=fmt(t);
  if(box){box.classList.toggle('warn',t<=300&&t>60);box.classList.toggle('crit',t<=60);box.classList.toggle('hidden',!!state.timerHidden&&t>300);}
  if(t<=300)state.timerHidden=false;
}
function pauseTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null;}}
function toggleTimer(){if(state.timers.listening<=300)return;state.timerHidden=!state.timerHidden;updateTimerDisplay('listening');saveState();}
function timeUp(onExpire){
  _expireCb=onExpire||finishExam;
  const d=document.getElementById('time-up');
  if(!d){const cb=_expireCb;_expireCb=null;cb();return;}
  d.classList.add('open');
  if(_tuTimer)clearTimeout(_tuTimer);
  _tuTimer=setTimeout(timeUpAck,25000);
}
function timeUpAck(){
  if(_tuTimer){clearTimeout(_tuTimer);_tuTimer=null;}
  const d=document.getElementById('time-up');if(d)d.classList.remove('open');
  const cb=_expireCb;_expireCb=null;if(cb)cb();
}

// TOAST
const TOAST_ICON={
  error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 2.8 20h18.4L12 4.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg>',
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 9.5 17 19 7"/></svg>',
  warn:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5"/><path d="M12 16h.01"/></svg>',
  info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.8h.01"/></svg>'
};
let toastTimeout=null;
function toast(msg,type,duration){
  const el=document.getElementById('toast');
  el.setAttribute('role',type==='error'?'alert':'status');
  el.innerHTML='<span class="t-ic" aria-hidden="true">'+(TOAST_ICON[type]||TOAST_ICON.info)+'</span>'
             +'<span class="t-msg">'+escapeHtml(msg)+'</span>';
  el.className='toast show'+(type?' '+type:'');
  clearTimeout(toastTimeout);
  toastTimeout=setTimeout(()=>el.classList.remove('show'),duration||3200);
}

// RENDER
const BUILDERS=[null,buildSection1,buildSection2,buildSection3,buildSection4];
function renderListening(){renderSection(state.currentSection||1);}
function renderSection(n){
  state.currentSection=n;
  const root=document.getElementById('listening-render');
  root.innerHTML=BUILDERS[n]();
  attachHandlers();
  const [a,b]=NAV_RANGES[n];
  for(let i=a;i<=b;i++){if(state.listeningAnswers[i])setInput(i,state.listeningAnswers[i]);if(state.listeningFlags[i])applyFlagToPill(i);}restoreMultiGroups();
  const ranges={1:'1–10',2:'11–20',3:'21–30',4:'31–40'};
  const pt=document.getElementById('pbar-title'),pd=document.getElementById('pbar-desc');
  if(pt)pt.textContent='Part '+n;if(pd)pd.textContent='Listen and answer questions '+(ranges[n]||'')+'.';
  const area=document.getElementById('listening-area');if(area)area.scrollTop=0;
  document.querySelectorAll('#listening-render .gap-input').forEach(gapAutoGrow);
  updateListeningNav();saveState();
  restoreAnnotations(n);   // bring highlights/notes back after the re-render
  if(document.body.classList.contains('review-mode')){setTimeout(()=>{applyReviewReveal();reviewMultiGroups();addJumpButtons();},50);}
}
function setInput(qid,ans){const inp=document.getElementById('lq-'+qid);if(inp&&inp.dataset.dm){dmRestore(qid,ans);return;}if(inp&&(inp.tagName==='INPUT'||inp.tagName==='SELECT')){inp.value=ans;return;}const radios=document.getElementsByName('lq-'+qid);if(radios.length)radios.forEach(r=>{if(r.value===ans){r.checked=true;const opt=r.closest('.option');if(opt){opt.parentElement.querySelectorAll('.option').forEach(o=>o.classList.remove('selected'));opt.classList.add('selected');}}});}
function attachHandlers(){
  attachMultiHandlers();
  document.querySelectorAll('input[type="radio"][data-q]').forEach(r=>{
    r.addEventListener('change',()=>{const q=r.dataset.q;const opt=r.closest('.option');if(opt){opt.parentElement.querySelectorAll('.option').forEach(o=>o.classList.remove('selected'));opt.classList.add('selected');}state.listeningAnswers[q]=r.value;state.activeQuestion=parseInt(q,10);updateListeningNav();saveState();});
    r.addEventListener('focus',()=>{state.activeQuestion=parseInt(r.dataset.q,10);updateListeningNav();});
  });
  // clicking into a box makes that question the active scorable item, exactly as
  // clicking a footer number box does
  document.querySelectorAll('#listening-render .gap-input').forEach(inp=>{
    inp.addEventListener('focus',()=>{state.activeQuestion=parseInt(inp.dataset.lq,10);updateListeningNav();});
  });
}
/* THE AUTO-GROW. The official rewrites the input's inline width from a hidden
   mirror span (span.textEntry__shadowElement, font 16px/24px Arial, white-space
   pre): "" -> 20px, "round" -> 60.92px, "extraordinarily" -> 120.484px, with
   min-width:104px and max-width:100% doing the clamping. */
function gapAutoGrow(el){
  if(!el)return;
  const cs=getComputedStyle(el);
  let m=gapAutoGrow._m;
  if(!m){m=gapAutoGrow._m=document.createElement('span');m.className='gap-mirror';m.style.cssText='position:absolute;top:-9999px;left:-9999px;visibility:hidden;white-space:pre;height:0;overflow:hidden';document.body.appendChild(m);}
  m.style.font=cs.font||(cs.fontStyle+' '+cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily);
  m.style.letterSpacing=cs.letterSpacing;
  m.textContent=el.value||'';
  const extra=(parseFloat(cs.paddingLeft)||0)+(parseFloat(cs.paddingRight)||0)+
              (parseFloat(cs.borderLeftWidth)||0)+(parseFloat(cs.borderRightWidth)||0);
  el.style.width=(m.getBoundingClientRect().width+extra+2)+'px';
}
function onListeningInput(qid){const el=document.getElementById('lq-'+qid);if(!el)return;gapAutoGrow(el);state.listeningAnswers[qid]=el.value.trim();state.activeQuestion=parseInt(qid,10);updateListeningNav();saveState();}
function setDragAnswer(qid,val){if(val){state.listeningAnswers[qid]=val;}else{delete state.listeningAnswers[qid];}updateListeningNav();saveState();}
function toggleFlag(qid){state.listeningFlags[qid]=!state.listeningFlags[qid];applyFlagToPill(qid);updateListeningNav();saveState();}
function applyFlagToPill(qid){document.querySelectorAll('.q-pill[data-flag="'+qid+'"]').forEach(p=>p.classList.toggle('flagged',!!state.listeningFlags[qid]));}

// NAV

// ── ADDED: multi-select 'choose TWO' (sorted picks -> per-id matcher) ──
function msSync(g,changed){
  var ids=g.dataset.msIds.split(',').map(function(s){return s.trim();});
  var max=ids.length;
  var boxes=[].slice.call(g.querySelectorAll('.ms-box'));
  var checked=boxes.filter(function(b){return b.checked;});
  if(checked.length>max&&changed){changed.checked=false;checked=boxes.filter(function(b){return b.checked;});}
  boxes.forEach(function(b){var o=b.closest('.ms-option');if(o)o.classList.toggle('selected',b.checked);});
  var vals=checked.map(function(b){return b.value;}).sort();
  ids.forEach(function(id,i){setDragAnswer(id,vals[i]||'');});
}
function attachMultiHandlers(){
  document.querySelectorAll('.ms-group').forEach(function(g){
    g.querySelectorAll('.ms-box').forEach(function(b){
      b.addEventListener('change',function(){msSync(g,b);});
    });
  });
}
function restoreMultiGroups(){
  document.querySelectorAll('.ms-group').forEach(function(g){
    var ids=g.dataset.msIds.split(',').map(function(s){return s.trim();});
    var vals=ids.map(function(id){return state.listeningAnswers[id];}).filter(Boolean);
    g.querySelectorAll('.ms-box').forEach(function(b){
      var on=vals.indexOf(b.value)>=0;b.checked=on;
      var o=b.closest('.ms-option');if(o)o.classList.toggle('selected',on);
    });
  });
}
function reviewMultiGroups(){
  document.querySelectorAll('.ms-group').forEach(function(g){
    var ids=g.dataset.msIds.split(',').map(function(s){return s.trim();});
    var cset={};
    ids.forEach(function(id){String(LISTENING_ANSWERS[id]||'').split('|').forEach(function(c){if(c.trim())cset[c.trim().toUpperCase()]=1;});});
    var correct=Object.keys(cset);
    g.querySelectorAll('.ms-box').forEach(function(b){
      var o=b.closest('.ms-option');if(!o)return;
      if(cset[b.value.toUpperCase()])o.classList.add('correct');
      else if(b.checked)o.classList.add('wrong');
    });
    var got=[].slice.call(g.querySelectorAll('.ms-box')).filter(function(b){return b.checked;}).map(function(b){return b.value.toUpperCase();});
    var nRight=got.filter(function(v){return cset[v];}).length;
    var ok=(nRight===correct.length&&got.length===correct.length);
    var fb=document.getElementById('lfb-'+ids[0]);
    if(fb){fb.className='feedback-pill show '+(ok?'correct':'wrong');
      fb.innerHTML=feedbackHTML(ok,escapeHtml(correct.join(', ')));}
  });
}

const NAV_RANGES={1:[1,10],2:[11,20],3:[21,30],4:[31,40]};
const NAV_GROUPS={1:[[1],[2],[3],[4],[5],[6],[7],[8],[9],[10]],2:[[11],[12],[13],[14],[15],[16],[17],[18],[19],[20]],3:[[21],[22],[23],[24],[25],[26],[27],[28],[29],[30]],4:[[31],[32],[33],[34],[35],[36],[37],[38],[39],[40]]};
function isAnswered(i){return !!(state.listeningAnswers[i]&&state.listeningAnswers[i].toString().trim()!=='');}
function groupAnswered(g){return g.every(isAnswered);}
function sectionComplete(s){const [a,b]=NAV_RANGES[s];for(let i=a;i<=b;i++)if(!isAnswered(i))return false;return true;}
function firstUnanswered(s){const [a,b]=NAV_RANGES[s];for(let i=a;i<=b;i++)if(!isAnswered(i))return i;return b;}
function navScoreLabel(s){const [a,b]=NAV_RANGES[s];let c=0;for(let i=a;i<=b;i++)if(isAnswered(i))c++;return c+' of '+(b-a+1);}
/* THE FOUR-CELL FOOTER (§8). Every cell is flex:1 1 0% with min-width:auto — the
   growth rule. The selected cell shows its ten number boxes and is justified to
   flex-start; the other three centre a "Part N   n of 10" label. The 3px rail is
   the ::before on the label and on each number-box wrapper; an ATTEMPTED question
   turns its own segment #358E14 and the box itself does not change. */
function isSubmitting(){const st=document.getElementById('stage-listening');return !!(st&&st.classList.contains('submitting'));}
function updateListeningNav(){
  const nav=document.getElementById('listening-nav');if(!nav)return;
  const submitting=isSubmitting();
  const cur=state.currentSection||1,curQ=state.activeQuestion||firstUnanswered(cur);
  function partLabel(s){return '<span class="section-prefix">Part&nbsp;</span><span class="sectionNr">'+s+'</span>';}
  function sH(s){
    const groups=NAV_GROUPS[s];
    if(s===cur&&!submitting){
      let pills='';
      groups.forEach(g=>{
        const label=g[0],answered=isAnswered(g[0]);
        let cls='qpill';if(g[0]===curQ)cls+=' current';if(state.listeningFlags[g[0]])cls+=' flagged';
        pills+='<div class="qpill-wrap'+(answered?' answered':'')+'"><div class="'+cls+'" onclick="ExamApp.jumpToListening('+g[0]+')">'+label+'</div></div>';
      });
      return '<div class="bnav-section sel"><div class="bnav-part cur"><div class="bnav-row"><span class="bnav-plabel" onclick="ExamApp.jumpToListeningPart('+s+')">'+partLabel(s)+'</span><div class="bnav-pills">'+pills+'</div></div></div></div>';
    }
    return '<div class="bnav-section"><div class="bnav-part other" onclick="ExamApp.jumpToListeningPart('+s+')"><span class="bnav-plabel2">'+partLabel(s)+'<span class="bnav-pscore">'+navScoreLabel(s)+'</span></span></div></div>';
  }
  const submitBtn=!document.body.classList.contains('review-mode')?'<button id="sub-btn"'+(submitting?' class="active"':'')+' onclick="LSN.deliverClick()" title="Go to submission page" aria-label="Go to submission page"><svg class="fa-glyph" width="19" height="19" viewBox="0 0 1792 1792" aria-hidden="true" focusable="false"><g transform="translate(0,1536) scale(1,-1)"><path fill="currentColor" d="M1671 970q0 -40 -28 -68l-724 -724l-136 -136q-28 -28 -68 -28t-68 28l-136 136l-362 362q-28 28 -28 68t28 68l136 136q28 28 68 28t68 -28l294 -295l656 657q28 28 68 28t68 -28l136 -136q28 -28 28 -68z"/></g></svg></button>':'<button id="sub-btn" onclick="ExamApp.backToResults()" style="font-size:14px;width:auto;max-width:none;padding:0 16px;">← Results</button>';
  nav.innerHTML=sH(1)+sH(2)+sH(3)+sH(4)+submitBtn;
  document.querySelectorAll('#listening-render .q-pill').forEach(function(pl){
    pl.classList.toggle('current',parseInt(pl.dataset.qnum,10)===curQ);
  });
  document.querySelectorAll('#listening-render .drag-drop').forEach(function(dz){
    dz.classList.toggle('dm-active-q',parseInt(dz.dataset.q,10)===curQ);
  });
  // the practice clock is exam furniture only; review has the transport strip there
  const clk=document.getElementById('hdr-clock');
  if(clk)clk.style.display=document.body.classList.contains('review-mode')?'none':'';
  updateArrowState();
}
/* the official previous arrow is #dddddd — DISABLED — at Part 1, and only turns
   #4C4C4C once there is somewhere to go back to. It is never faded. */
function updateArrowState(){
  const cur=state.currentSection||1,submitting=isSubmitting();
  const prev=document.querySelector('#qnav-arrows .prev'),next=document.querySelector('#qnav-arrows .next');
  if(prev)prev.disabled=submitting?false:(cur<=1);
  if(next)next.disabled=submitting?true:(cur>=4);
}
function nextSection(){if(isSubmitting())return;const cur=state.currentSection||1;if(cur<4)jumpToListeningPart(cur+1);}

/* ══════════════════════════════════════════════════════════════════════════
   EXAM-SCREEN CHROME — Options page, Messages page, Notes sidebar, submission
   page. Exposed on window.LSN rather than on ExamApp's frozen public API.
   ══════════════════════════════════════════════════════════════════════════ */
var LSN=(function(){
  function stage(){return document.getElementById('stage-listening');}

  /* ---- Options: a full-screen replacement page, three rows, no volume,
          no speed, no theme picker, no full-screen toggle ---- */
  function openOptions(){const p=document.getElementById('opt-page');if(!p)return;optionsRoot();p.classList.add('open');}
  function closeOptions(){const p=document.getElementById('opt-page');if(p){p.classList.remove('open');optionsRoot();}}
  function optionsRoot(){optionsView('root');}
  function optionsView(v){
    const p=document.getElementById('opt-page');if(!p)return;
    p.setAttribute('data-view',v);
    const t=document.getElementById('opt-title');
    if(t)t.textContent=v==='contrast'?'Contrast':(v==='zoom'?'Text size':'Options');
    syncOptionTicks();
  }
  function syncOptionTicks(){
    const st=stage();
    const contrast=!st?'light':(st.classList.contains('yob')?'yob':(document.body.classList.contains('dark-mode')?'dark':'light'));
    document.querySelectorAll('#opt-page [data-contrast]').forEach(b=>b.classList.toggle('sel',b.dataset.contrast===contrast));
    document.querySelectorAll('#opt-page [data-size]').forEach(b=>b.classList.toggle('sel',b.dataset.size===_textSize));
  }
  /* the official Contrast page: Black on white / White on black / Yellow on black.
     Yellow-on-black is scoped to #stage-listening so it cannot leak into the
     wrapper stages, which carry their own skin. */
  function setContrast(v){
    const st=stage();
    if(v==='yob'){ExamApp.setTheme('dark');if(st)st.classList.add('yob');}
    else{if(st)st.classList.remove('yob');ExamApp.setTheme(v==='dark'?'dark':'light');}
    try{localStorage.setItem('cdi_listening_contrast',v);}catch(e){}
    syncOptionTicks();
  }
  /* the official Text size page: Regular / Large / Extra large, which swap
     --app--font-size-medium 16 -> 19 -> 22 on the app root */
  var _textSize='regular';
  function setTextSize(v){
    _textSize=v;
    const px=v==='large'?3:(v==='xlarge'?6:0);
    document.documentElement.style.setProperty('--text-zoom',px+'px');
    try{localStorage.setItem('cdi_listening_textsize',v);}catch(e){}
    syncOptionTicks();
    document.querySelectorAll('#listening-render .gap-input').forEach(gapAutoGrow);
  }
  function restorePrefs(){
    try{
      const c=localStorage.getItem('cdi_listening_contrast');if(c)setContrast(c);
      const z=localStorage.getItem('cdi_listening_textsize');if(z)setTextSize(z);
    }catch(e){}
  }

  /* ---- Messages: an empty white full-screen page, standard chrome ---- */
  function openMessages(){const p=document.getElementById('msg-page');if(p)p.classList.add('open');}
  function closeMessages(){const p=document.getElementById('msg-page');if(p)p.classList.remove('open');}

  /* ---- Notes: a 300px sidebar docked at x=1140 that SQUEEZES the exam ---- */
  function buildNotes(){
    const panel=document.getElementById('notes-panel');
    if(!panel||panel._lsn)return;
    panel._lsn=1;
    panel.innerHTML=
      '<div class="np-hdr"><span class="np-title">Notes</span>'+
      '<button type="button" class="np-close" onclick="LSN.toggleNotes(false)" aria-label="Hide notes">&#10005;</button></div>'+
      '<div class="np-body">'+
      '<div class="np-empty"><b>Your private notes will<br>show here</b>'+
      '<i>Select text to highlight or create a note.</i></div>'+
      '<textarea id="notes-area" spellcheck="false" aria-label="Notes"></textarea></div>';
    const ta=document.getElementById('notes-area');
    try{ta.value=localStorage.getItem('cdi_listening_notes')||'';}catch(e){}
    document.body.classList.toggle('notes-typed',!!ta.value);
    ta.addEventListener('input',function(){
      try{localStorage.setItem('cdi_listening_notes',ta.value);}catch(e){}
      document.body.classList.toggle('notes-typed',!!ta.value);
    });
  }
  function toggleNotes(force){
    buildNotes();
    const open=(force===undefined)?!document.body.classList.contains('notes-open'):!!force;
    document.body.classList.toggle('notes-open',open);
    const b=document.getElementById('notes-btn');
    if(b)b.setAttribute('aria-label',open?'Hide notes':'Show notes');
    if(open)setTimeout(function(){const ta=document.getElementById('notes-area');if(ta)try{ta.focus();}catch(e){}},0);
  }

  /* ---- Submission page (§13). The audio keeps playing throughout; the back
          arrow returns to the exam with the audio still running. ---- */
  function goToSubmission(){
    closeOptions();
    const st=stage();if(!st)return;
    st.classList.add('submitting');
    updateListeningNav();
    const a=document.getElementById('listening-area');if(a)a.scrollTop=0;
  }
  function backFromSubmission(){
    const st=stage();if(!st)return;
    st.classList.remove('submitting');
    updateListeningNav();
  }
  function deliverClick(){if(isSubmitting())backFromSubmission();else goToSubmission();}
  function submitConfirm(){ExamApp.finishExam();}

  return {openOptions,closeOptions,optionsRoot,optionsView,setContrast,setTextSize,
          openMessages,closeMessages,toggleNotes,buildNotes,
          goToSubmission,backFromSubmission,deliverClick,submitConfirm,
          timeUpAck:function(){timeUpAck();},restorePrefs};
})();
window.LSN=LSN;
function prevSection(){if(isSubmitting()){LSN.backFromSubmission();return;}const cur=state.currentSection||1;if(cur>1)jumpToListeningPart(cur-1);}
function jumpToListeningPart(n){if(isSubmitting())LSN.backFromSubmission();state.activeQuestion=null;renderSection(n);updateArrowState();}
function jumpToListening(qid){
  const numId=parseInt(qid);let s=1;if(numId>=11&&numId<=20)s=2;else if(numId>=21&&numId<=30)s=3;else if(numId>=31)s=4;
  state.activeQuestion=numId;
  if(s!==state.currentSection){renderSection(s);updateArrowState();setTimeout(()=>doScrollTo(numId),80);}
  else{doScrollTo(numId);updateListeningNav();}
}
function doScrollTo(qid){
  const area=document.getElementById('listening-area');if(!area)return;
  const el=document.getElementById('lq-card-'+qid)||document.getElementById('lq-row-'+qid)||
           (document.getElementById('lq-'+qid)&&document.getElementById('lq-'+qid).closest('.q-card,.gap-line'));
  if(!el)return;
  const areaRect=area.getBoundingClientRect(),elRect=el.getBoundingClientRect();
  area.scrollTo({top:area.scrollTop+(elRect.top-areaRect.top)-102,behavior:'smooth'});
  const inp=document.getElementById('lq-'+qid);
  if(inp&&inp.tagName==='INPUT'&&inp.type==='text')setTimeout(()=>{try{inp.focus();}catch(e){}},260);
}

// AUDIO
var FA_VOLUME_UP_SVG='<svg class="fa-glyph" width="12.3828" height="13.3333" viewBox="0 0 1664 1792" aria-hidden="true" focusable="false"><g transform="translate(0,1536) scale(1,-1)"><path fill="currentColor" d="M768 1184v-1088q0 -26 -19 -45t-45 -19t-45 19l-333 333h-262q-26 0 -45 19t-19 45v384q0 26 19 45t45 19h262l333 333q19 19 45 19t45 -19t19 -45zM1152 640q0 -76 -42.5 -141.5t-112.5 -93.5q-10 -5 -25 -5q-26 0 -45 18.5t-19 45.5q0 21 12 35.5t29 25t34 23t29 36t12 56.5t-12 56.5t-29 36t-34 23t-29 25t-12 35.5q0 27 19 45.5t45 18.5q15 0 25 -5q70 -27 112.5 -93t42.5 -142zM1408 640q0 -153 -85 -282.5t-225 -188.5q-13 -5 -25 -5q-27 0 -46 19t-19 45q0 39 39 59q56 29 76 44q74 54 115.5 135.5t41.5 173.5t-41.5 173.5t-115.5 135.5q-20 15 -76 44q-39 20 -39 59q0 26 19 45t45 19q13 0 26 -5q140 -59 225 -188.5t85 -282.5zM1664 640q0 -230 -127 -422.5t-338 -283.5q-13 -5 -26 -5q-26 0 -45 19t-19 45q0 36 39 59q7 4 22.5 10.5t22.5 10.5q46 25 82 51q123 91 192 227t69 289t-69 289t-192 227q-36 26 -82 51q-7 4 -22.5 10.5t-22.5 10.5q-39 23 -39 59q0 26 19 45t45 19q13 0 26 -5q211 -91 338 -283.5t127 -422.5z"/></g></svg>';
function startLockedAudio(){if(startLockedAudio._done){showAudioGate();return;}startLockedAudio._done=1;
  const audio=document.getElementById('exam-audio'),badge=document.getElementById('audio-state-badge'),hdrBadge=document.getElementById('audio-hdr-badge'),overlay=document.getElementById('audio-click-overlay');if(!audio)return;
  // review mode only. The exam screen must never expose a seek or replay affordance.
  overlay&&overlay.addEventListener('click',(e)=>{if(!document.body.classList.contains('review-mode'))return;const track=document.getElementById('audio-progress-track');if(track&&audio.duration){const rect=track.getBoundingClientRect();audio.currentTime=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width))*audio.duration;audio.play().catch(()=>{});}});
  audio.addEventListener('play',()=>{if(badge){badge.textContent='● PLAYING';badge.style.color='var(--emerald)';}if(hdrBadge){hdrBadge.innerHTML=FA_VOLUME_UP_SVG+'<span class="ttid-sub-title">Audio is Playing</span>';}const b=document.getElementById('pp-btn');if(b)b.textContent='⏸';});
  audio.addEventListener('ended',()=>{if(badge){badge.textContent='■ FINISHED';badge.style.color='var(--ink-mute)';}if(hdrBadge){hdrBadge.innerHTML='';}const b=document.getElementById('pp-btn');if(b)b.textContent='▶';});
  const resumeGuard=function(){const g=document.getElementById('audio-gate');return isExamActive()&&!audio.ended&&state.stage==='listening'&&!document.body.classList.contains('review-mode')&&!(g&&g.classList.contains('show'));};
  audio.addEventListener('pause',()=>{const b=document.getElementById('pp-btn');if(b&&!audio.ended)b.textContent='▶';if(resumeGuard())setTimeout(()=>{if(resumeGuard())audio.play().catch(()=>{});},50);});
  if(badge){badge.textContent='◌ LOADING';badge.className='';badge.style.color='';}if(hdrBadge){hdrBadge.innerHTML='';}
  wireTransport(audio);
  audio.load();showAudioGate();
}
function wireTransport(audio){
  // Idempotent, and called from BOTH startLockedAudio and reviewExam: the
  // display wiring used to live only in startLockedAudio, so reloading
  // straight into review left the scrub bar and clock permanently dead.
  if(!audio||audio._transportWired)return;
  audio._transportWired=1;
  const badge=document.getElementById('audio-state-badge');
  audio.addEventListener('timeupdate',()=>{const fill=document.getElementById('audio-progress-fill'),disp=document.getElementById('audio-time-display');if(audio.duration){const pct=(audio.currentTime/audio.duration*100);const trk=document.getElementById('audio-progress-track');if(trk)trk.style.setProperty('--pp',pct+'%');if(fill)fill.style.width=pct+'%';if(disp){const cm=Math.floor(audio.currentTime/60).toString().padStart(2,'0'),cs=Math.floor(audio.currentTime%60).toString().padStart(2,'0'),dm=Math.floor(audio.duration/60).toString().padStart(2,'0'),ds=Math.floor(audio.duration%60).toString().padStart(2,'0');disp.textContent=cm+':'+cs+' / '+dm+':'+ds;}}});
  // The badge used to be written only by `play` and `ended`, so a track that
  // never loads sat on LOADING forever with no explanation.
  var setBadge=function(txt,cls){if(badge){badge.textContent=txt;badge.className=cls||'';}};
  audio.addEventListener('canplay',function(){if(audio.paused)setBadge('● READY','is-ready');});
  audio.addEventListener('waiting',function(){setBadge('◌ BUFFERING','');});
  audio.addEventListener('stalled',function(){setBadge('◌ STALLED','');});
  audio.addEventListener('error',function(){setBadge('✕ NO AUDIO','is-error');});
  audio.addEventListener('progress',function(){
    var b=document.getElementById('audio-buffered');
    if(b&&audio.duration&&audio.buffered.length){
      b.style.width=(audio.buffered.end(audio.buffered.length-1)/audio.duration*100)+'%';
    }
  });
}

function stopAudio(){hideAudioGate();const audio=document.getElementById('exam-audio');if(audio){try{audio.pause();audio.removeAttribute('src');audio.load();}catch(e){}}}
function showAudioGate(){if(document.body.classList.contains('review-mode'))return;/* the gate belongs to the running paper only: a rejected play() promise can land after the test has been submitted, and at z-index 1000 it would sit over the score sheet and swallow every click. */if(state.stage!=='listening'||document.body.classList.contains('pre-entry'))return;const g=document.getElementById('audio-gate');if(!g)return;g.classList.add('show');const b=document.getElementById('ag-play-btn');if(b)setTimeout(function(){try{b.focus();}catch(e){}},0);}
function hideAudioGate(){const g=document.getElementById('audio-gate');if(g)g.classList.remove('show');}
function startGatedAudio(){const audio=document.getElementById('exam-audio');hideAudioGate();if(!audio)return;const p=audio.play();if(p&&p.catch)p.catch(function(){showAudioGate();});}
function setVolume(val){const audio=document.getElementById('exam-audio');if(audio)audio.volume=parseFloat(val);}
function setPlaybackRate(val){const audio=document.getElementById('exam-audio');if(audio)audio.playbackRate=parseFloat(val);}
function seekAudio(delta){const audio=document.getElementById('exam-audio');if(!audio||!audio.duration)return;audio.currentTime=Math.max(0,Math.min(audio.duration,audio.currentTime+delta));}
function togglePlayPause(){const audio=document.getElementById('exam-audio'),btn=document.getElementById('pp-btn');if(!audio)return;if(audio.paused){audio.play().catch(()=>{});if(btn)btn.textContent='⏸';}else{audio.pause();if(btn)btn.textContent='▶';}}
function isExamActive(){return state.stage==='listening';}

// HIGHLIGHTER
function applyHighlight(colorClass) {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  try {
    const span = document.createElement('span');
    span.className = 'hl ' + colorClass;
    range.surroundContents(span);
  } catch(e) {
    // Selection spans element boundaries — wrap each text node separately.
    try { wrapRangeSegments(range, colorClass, ''); }
    catch(e2) { toast('Could not highlight that selection', 'error'); }
  }
  sel.removeAllRanges();
  const popup = document.getElementById('hl-popup');
  if (popup) popup.classList.remove('show');
  syncAnnotations();
}

function clearHighlight() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  
  const range = sel.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const parentElement = container.nodeType === 1 ? container : container.parentNode;
  
  const highlights = parentElement.querySelectorAll ? parentElement.querySelectorAll('.hl') : [];
  highlights.forEach(hl => {
    if (sel.containsNode(hl, true)) {
      const p = hl.parentNode;
      while (hl.firstChild) p.insertBefore(hl.firstChild, hl);
      p.removeChild(hl);
    }
  });

  let node = sel.anchorNode;
  while (node && node !== document.body) {
    if (node.nodeType === 1 && node.classList.contains('hl')) {
      const p = node.parentNode;
      while (node.firstChild) p.insertBefore(node.firstChild, node);
      p.removeChild(node);
      break;
    }
    node = node.parentNode;
  }
  
  sel.removeAllRanges();
  const popup = document.getElementById('hl-popup');
  if (popup) popup.classList.remove('show');
  syncAnnotations();
}

function setupHighlighter() {
  const popup = document.getElementById('hl-popup');
  if (!popup) return;

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) {
      popup.classList.remove('show');
    }
  });

  document.addEventListener('mouseup', (e) => {
    const g = document.getElementById('audio-gate');
    if (g && g.classList.contains('show')) return;
    // ONLY allow highlighter during the active test. Disable in Review Mode.
    if (state.stage !== 'listening' || document.body.classList.contains('review-mode')) {
        return;
    }

    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel.rangeCount || sel.isCollapsed) return;
      
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // The official adder carries only Note and Highlight. Clear is ours, and
      // it is revealed only when the selection already lies on a highlight —
      // otherwise the resting toolbar is wider than the real one.
      let onHl = false;
      try {
        const n = range.commonAncestorContainer;
        const el = n.nodeType === 1 ? n : n.parentElement;
        onHl = !!(el && el.closest('span.hl'));
        if (!onHl) {
          const scope = (n.nodeType === 1 ? n : n.parentElement);
          if (scope && scope.querySelectorAll) {
            onHl = [...scope.querySelectorAll('span.hl')].some(h => sel.containsNode(h, true));
          }
        }
      } catch (e) { onHl = false; }
      popup.classList.toggle('has-hl', onHl);

      popup.style.top = (rect.bottom + window.scrollY) + 'px';
      popup.style.left = (rect.left + window.scrollX + (rect.width / 2)) + 'px';
      popup.classList.add('show');
    }, 10);
  });
}

// ====================================================================
// FLOW CONTROL
// ====================================================================

function validateStart(){
  const nameEl=document.getElementById('start-name');
  const field=document.getElementById('start-field');
  const hint=document.getElementById('start-hint-text');
  const name=nameEl.value.trim();
  if(name.length<2){
    // A designed inline error rather than a toast: the fault is in the field,
    // so the correction belongs beside the field.
    if(field){field.classList.remove('is-invalid');void field.offsetWidth;field.classList.add('is-invalid');}
    if(hint)hint.textContent=name
      ?'That looks a little short — please enter your full name.'
      :'Enter your name to begin. It appears on your band-score certificate.';
    nameEl.focus();
    return;
  }
  if(field)field.classList.remove('is-invalid');
  if(hint)hint.textContent='Appears on your band\u2011score certificate.';
  state.student.name=name;saveState();updateHeaderName(name);
  // the briefing greets the candidate by first name — the one place in the
  // whole shell where the product speaks to a person rather than a user
  const greet=document.getElementById('intro-greet');
  if(greet){
    const first=name.split(/\s+/)[0];
    greet.textContent=first.length<=18?'Ready when you are, '+first+'.':'Ready when you are.';
  }
  beginExam();
}
function beginExam(){state.startedAt=new Date().toISOString();saveState();const p=enterFullscreen();const advance=()=>{document.body.classList.add('no-select');goToStage('listening-intro');};if(p&&typeof p.finally==='function')p.finally(advance);else advance();}
function beginListening(){
  // Curtain: dim the particle layer and drop the briefing card *before* the
  // stage swap, so the plain white exam never inherits a frame of the shell.
  if(window.CDIAtmosphere&&window.CDIAtmosphere.dim)window.CDIAtmosphere.dim();
  document.body.classList.add('cdi-exit');
  const go=()=>{
    goToStage('listening');renderListening();
    startTimer('listening',()=>{toast('Time is up — well done!','success');finishExam();});
    startLockedAudio();
    setTimeout(function () { document.body.classList.remove('cdi-exit'); }, 240);
  };
  if(window.__cdiReduced)go();else setTimeout(go, 260);
}
function confirmSubmit(btn){if(btn&&btn.id==='sub-btn'){if(!btn.dataset.confirm){btn.dataset.confirm='1';btn.style.background='var(--crimson)';btn.style.color='#fff';toast('Click ✓ again to submit your test','warn');setTimeout(()=>{btn.dataset.confirm='';btn.style.background='';btn.style.color='';},3000);return;}finishExam();return;}finishExam();}
function backToResults(){
  // Move audio controls back to pbar
  const audioEl=document.getElementById('pbar-audio');
  const pbarInner=document.getElementById('pbar-inner');
  if(audioEl&&pbarInner)pbarInner.appendChild(audioEl);
  document.body.classList.remove('tp-active');
  goToStage('results');window.scrollTo(0,0);
}
/* The submission page is a state of the RUNNING exam: `.submitting` hides the
   whole question sheet and raises the "Click next to continue" bar in its
   place. Nothing used to take it off, and the class outlived the exam — so
   review, which re-shows #stage-listening, re-showed it still wearing the
   submission page: a blank sheet under a toc bar, with the transcript beside
   it working perfectly. It comes off here, at the moment the exam stops,
   rather than in review, which is only where the damage happened to surface. */
function finishExam(){
  pauseTimer();
  try{stopAudio();}catch(e){}
  state.finishedAt=new Date().toISOString();saveState();
  document.body.classList.remove('no-select');
  const st=document.getElementById('stage-listening');if(st)st.classList.remove('submitting');
  try{updateListeningNav();updateArrowState();}catch(e){}
  try{exitFullscreen();}catch(e){}
  goToStage('results');
  renderResults();
}
function unlockResults(){goToStage('results');renderResults();}
function resetExam(){
  /* The confirmation sheet lived on the registration card and went with it, so
     the question is asked plainly instead of silently taking the safe path. */
  if(!window.confirm('Clear this test and start again?\n\nYour answers, your band score and the marked transcript for this attempt are erased.'))return;
  window.__cdiIntentionalReload=true;wipeSession();location.reload();
}
function resetExamLegacy(){
  chSheet({
    eyebrow:'Start over',
    title:'Clear this test and start again?',
    body:'Your answers, your band score and the marked transcript for this attempt are erased. There is no way back to them.',
    goLabel:'Start a fresh test',
    ghostLabel:'Keep my results',
    onGo:function(){window.__cdiIntentionalReload=true;wipeSession();location.reload();}
  });
}
function setTheme(name){document.body.classList.remove('dark-mode','theme-sepia');if(name==='dark')document.body.classList.add('dark-mode');else if(name==='sepia')document.body.classList.add('theme-sepia');document.querySelectorAll('.theme-dot').forEach(d=>d.classList.toggle('active',d.dataset.theme===name));localStorage.setItem('cdi_reading_theme',name);}
let currentTextZoom=0;
function zoomText(step){currentTextZoom+=step;if(currentTextZoom<-3)currentTextZoom=-3;if(currentTextZoom>8)currentTextZoom=8;document.documentElement.style.setProperty('--text-zoom',currentTextZoom+'px');}

// GRADING
function checkAnswerMatch(given,correct){if(!given)return false;const g=given.toString().trim().toLowerCase();return correct.toString().toLowerCase().split('|').some(a=>a.trim()===g);}
/* Q1–10 are Part 1, 11–20 Part 2, and so on: the paper is four ten-mark
   sections and every downstream breakdown hangs off that. */
function partOf(id){return id<=10?1:id<=20?2:id<=30?3:4;}
function mmss(sec){if(sec==null||isNaN(sec))return'';const s=Math.max(0,Math.round(sec));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
/* The single source of truth for every marked number in the app: the score
   report, the print report and review mode all read this one object.
   The shape only ever grows — `detail[i].{id,ua,ca,given,correct,isCorrect,
   status}` is what review mode binds to and must never move. Added on top:
   `part`, `at` (the second in the recording where the answer is spoken) and
   `atLabel`, plus per-part tallies and the band on the envelope.          */
function gradeListening(){
  let score=0;const detail=[];
  const parts=[1,2,3,4].map(n=>({part:n,from:(n-1)*10+1,to:n*10,total:0,correct:0,wrong:0,skipped:0}));
  for(let i=1;i<=40;i++){
    const correct=LISTENING_ANSWERS[i];
    const given=(state.listeningAnswers[i]||'').toString().trim();
    let isCorrect=false;
    if(correct!==undefined){isCorrect=checkAnswerMatch(given,correct);if(isCorrect)score++;}
    const status=(correct===undefined)?(given?'unmarked':'skipped'):(given?(isCorrect?'correct':'wrong'):'skipped');
    const pn=partOf(i);
    const p=parts[pn-1];p.total++;p[status]++;
    let at=null;
    try{if(typeof ANSWER_TIMES!=='undefined'&&ANSWER_TIMES[i]!=null)at=ANSWER_TIMES[i];}catch(e){}
    /* `cause` is added, never substituted: review mode binds to id/ua/ca/
       status and must not move. Only a typed question can carry one. */
    let cause=null;
    if(status==='wrong'&&listeningIsTyped(i))cause=classifyMiss(given,correct,listeningWordLimit(i));
    detail.push({id:i,ua:given,ca:correct?correct.replace(/\|/g,' / '):'',given,correct:correct?correct.replace(/\|/g,' / '):'',
                 isCorrect,status,part:pn,at:at,atLabel:mmss(at),cause:cause});
  }
  const nCorrect=detail.filter(q=>q.status==='correct').length;
  const nWrong=detail.filter(q=>q.status==='wrong').length;
  const nSkipped=detail.filter(q=>q.status==='skipped').length;
  return {score,total:40,detail,band:bandFor(score),nCorrect,nWrong,nSkipped,parts};
}
/* ── Why a mark was actually lost ────────────────────────────────────────
   Ported from the Reading engine, which is the half of the report that changes
   what a candidate does next: "6 marks went on plurals" is an evening's work,
   "6 marks went on comprehension" is months of it. Two things are adapted for
   a recording rather than a page.

   ONE. Only Q1–10 and Q31–40 are typed. The rest are dragged chips and A–H
   map letters, where a plural or a spelling slip is not a thing that can
   happen — misclassifying those as "fixable" would flatter the candidate.

   TWO. Reading also prints a per-passage pace block. That is deliberately NOT
   here: Reading is self-paced, so time spent is a candidate's decision and
   worth reporting. Listening runs at the recording's speed for everyone, so
   the same block would report a choice nobody made. */
function levenshtein(a,b){
  const m=a.length,n=b.length;
  if(!m)return n; if(!n)return m;
  let prev=Array.from({length:n+1},(_,j)=>j),cur=new Array(n+1);
  for(let i=1;i<=m;i++){
    cur[0]=i;
    for(let j=1;j<=n;j++){
      cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
    }
    [prev,cur]=[cur,prev];
  }
  return prev[n];
}
/* Which questions are TYPED, and their word limit, are read off the paper itself: each
   section is rendered once into a detached element, every gap-input is a typed question,
   and its limit is the nearest instruction above it ("ONE WORD AND/OR A NUMBER" → 1,
   "NO MORE THAN TWO WORDS" → 2). This used to be the ID range 1–10 / 31–40, which is
   only true of one particular paper — a Part 4 matching task would have had its letters
   scored for spelling slips. */
const _typedLimits={};let _typedScanned=false;
function parseWordLimit(t){const m=/(ONE|TWO|THREE)\s+WORDS?/.exec(String(t||'').toUpperCase());return m?({ONE:1,TWO:2,THREE:3})[m[1]]:null;}
function scanTypedQuestions(){
  if(_typedScanned)return;_typedScanned=true;
  const d=document.createElement('div');
  [1,2,3,4].forEach(function(n){
    try{d.innerHTML=BUILDERS[n]();}catch(e){return;}
    let cur=null;
    d.querySelectorAll('.instruction, input.gap-input[data-lq]').forEach(function(el){
      if(el.classList.contains('instruction')){const l=parseWordLimit(el.textContent);if(l!=null)cur=l;return;}
      _typedLimits[+el.dataset.lq]=cur==null?2:cur;
    });
  });
}
function listeningWordLimit(id){scanTypedQuestions();return (id in _typedLimits)?_typedLimits[id]:null;}
function listeningIsTyped(id){scanTypedQuestions();return id in _typedLimits;}

function classifyMiss(given,correct,limit){
  const g=String(given||'').trim().toLowerCase();
  if(!g)return null;
  if(limit&&g.split(/\s+/).filter(Boolean).length>limit)return 'limit';
  const variants=String(correct||'').toLowerCase().split('|').map(x=>x.trim());
  for(const c of variants){
    if(!c||g===c)continue;
    if(g===c+'s'||c===g+'s'||g===c+'es'||c===g+'es')return 'plural';
    const d=levenshtein(g,c);
    if(d>0&&d<=2&&c.length>=4&&Math.abs(g.length-c.length)<=2)return 'spelling';
  }
  return null;
}

function lossAnalysis(qs){
  const missed=qs.filter(q=>q.status==='wrong');
  const blank=qs.filter(q=>q.status==='skipped');
  const plural=missed.filter(q=>q.cause==='plural').length;
  const spelling=missed.filter(q=>q.cause==='spelling').length;
  const limitOv=missed.filter(q=>q.cause==='limit').length;
  const fixable=plural+spelling+limitOv;
  const real=missed.length-fixable;
  const lost=missed.length+blank.length;
  let lead;
  if(!lost)lead='Every one of the forty marks was scored. There is nothing to diagnose on this paper.';
  else if(blank.length&&missed.length)
    lead='You lost '+lost+' marks — '+blank.length+' left blank, '+missed.length+' answered wrong.';
  else if(blank.length)
    lead='You lost '+lost+' mark'+(lost>1?'s':'')+', every one of them left blank. The recording plays once, so a half-caught guess is always worth more than an empty box.';
  else if(fixable)
    lead='You lost '+lost+' mark'+(lost>1?'s':'')+' — but '+fixable+' of them '+(fixable>1?'were':'was')+' a slip, not a mishearing.';
  else
    lead='You lost '+lost+' mark'+(lost>1?'s':'')+', and all of them were genuine mishearings.';
  const notes=[];
  if(fixable)notes.push('You heard the answer on '+fixable+' of these — it just did not reach the box in the form the key wanted. That is spelling and grammar, and it is the cheapest band you will ever gain.');
  if(blank.length>=5)notes.push(blank.length+' blanks is the single biggest thing standing between you and a higher band. There is no penalty for a wrong answer in IELTS Listening, so never leave one empty.');
  return {missed:missed.length,blank:blank.length,plural,spelling,limitOv,fixable,real,lost,lead,notes};
}

function bandFor(score){if(score>=39)return 9.0;if(score>=37)return 8.5;if(score>=35)return 8.0;if(score>=33)return 7.5;if(score>=30)return 7.0;if(score>=27)return 6.5;if(score>=23)return 6.0;if(score>=19)return 5.5;if(score>=15)return 5.0;if(score>=13)return 4.5;if(score>=10)return 4.0;if(score>=8)return 3.5;if(score>=6)return 3.0;if(score>0)return 2.5;return 0;}
function bandLabel(b){if(b>=8.5)return'Expert user';if(b>=7.5)return'Very good user';if(b>=6.5)return'Good user';if(b>=5.5)return'Competent user';if(b>=4.5)return'Modest user';if(b>0)return'Limited user';return'No score';}
/* Chrome tier for the whole document, driven by the band only. Identical
   thresholds to the Writing report so a 7.0 lights the same way in both. */
function bandTier(b){if(b>=8)return'high';if(b>=7)return'good';if(b>=5.5)return'mid';return'low';}
/* Score colour ramp. Deliberately calm: a weak section is graphite, never
   red — the certificate reports, it does not scold. The --cv-* tokens are
   defined on both #stage-results .cert and #print-report, and the literal
   fallbacks keep the call honest anywhere else. */
function bandColorVar(b){
  if(b>=7)return'var(--cv-strong,#1f7a43)';
  if(b>=5.5)return'var(--cv-mid,#a97f34)';
  if(b>0)return'var(--cv-low,#78818f)';
  return'var(--cv-none,#b3ada4)';
}
/* Council-of-Europe equivalence — what an admissions page quotes back. */
function cefrOf(b){if(b>=8.5)return'C2';if(b>=7.0)return'C1';if(b>=5.5)return'B2';if(b>=4.0)return'B1';if(b>0)return'A2';return'—';}
/* What the band actually buys the candidate: the one honest sentence that
   keeps a 5.5 from feeling like a dead end and an 8.5 from feeling flat. */
const BAND_TARGETS=[
  {b:5.5,why:'the usual floor for foundation and pathway courses'},
  {b:6.0,why:'the common entry point for undergraduate study'},
  {b:6.5,why:'the level most undergraduate programmes ask for'},
  {b:7.0,why:'the level most postgraduate programmes ask for'},
  {b:7.5,why:'the level competitive courses and many visa routes ask for'},
  {b:8.0,why:'the level asked for by medicine, law and permanent-residency routes'}
];
function bandMilestone(band){
  if(band<=0)return'No answers were submitted, so no band could be awarded.';
  const next=BAND_TARGETS.find(t=>t.b>band+0.001);
  if(!next)return'<b>Band '+band.toFixed(1)+'</b> sits at or above what virtually every university and visa route requires.';
  const gap=Math.round((next.b-band)*10)/10;
  return'<b>'+gap.toFixed(1)+' to go</b> to Band '+next.b.toFixed(1)+' — '+next.why+'.';
}
/* The official IELTS band description for the awarded level. Public
   wording, not personalised feedback, so it belongs on the certificate. */
function bandDescriptor(b){
  if(b>=8.5)return{n:'Expert user',t:'Has fully operational command of the language: appropriate, accurate and fluent, with complete understanding.'};
  if(b>=7.5)return{n:'Very good user',t:'Has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriacies. Handles complex, detailed argumentation well.'};
  if(b>=6.5)return{n:'Good user',t:'Has operational command of the language, though with occasional inaccuracies, inappropriacies and misunderstandings in some situations. Generally handles complex language well.'};
  if(b>=5.5)return{n:'Competent user',t:'Has generally effective command of the language despite some inaccuracies, inappropriacies and misunderstandings. Can use fairly complex language, particularly in familiar situations.'};
  if(b>=4.5)return{n:'Modest user',t:'Has partial command of the language and copes with overall meaning in most situations, though is likely to make many mistakes. Should be able to handle basic communication in their own field.'};
  if(b>0)return{n:'Limited user',t:'Basic competence is limited to familiar situations. Has frequent problems in understanding and expression, and is not yet able to use complex language.'};
  return{n:'No score',t:'No assessable response was submitted, so no band could be awarded for this attempt.'};
}
function bandDescHeading(b,screen){
  if(b<=0)return'No band was awarded';
  return screen?'What Band '+b.toFixed(1)+' means · '+bandDescriptor(b).n
               :'Band '+b.toFixed(1)+' · '+bandDescriptor(b).n;
}
function escapeHtml(s){if(s==null)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function formatDate(iso){if(!iso)return'—';try{const d=new Date(iso);return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});}catch(e){return iso;}}

// RESULTS
/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  EDIT PER TEST · REPORT NUMBER  —  used in CDI-L<n>-<date>-<initials> ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
/* The test number is DERIVED from STORAGE_KEY's trailing digits, exactly as the
   Reading engine derives it — so there is one thing to change per test, not two.
   It used to be a hardcoded 1 buried here in the engine, which the build guide
   never mentioned: you could follow that guide to the letter and ship test 2
   branded, numbered and filed as test 1. If your key does not end in digits,
   every certificate says 1. */
const CERT_TEST_NO=+((String(STORAGE_KEY).match(/(\d+)\s*$/)||[0,'1'])[1].replace(/^0+/,'')||'1');
function testName(){return'Listening test 7';}
/* The four parts of an IELTS Listening paper never change shape, so these
   labels are structural, not test-specific — nothing to re-edit per test. */
const PART_META=[
  {n:1,kind:'Conversation · everyday social context'},
  {n:2,kind:'Monologue · everyday social context'},
  {n:3,kind:'Discussion · education or training'},
  {n:4,kind:'Monologue · academic subject'}
];
function certDate(){return state.startedAt?new Date(state.startedAt):new Date();}
function certDateStr(d){try{return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});}catch(e){return'—';}}
/* A stable-looking reference number. Purely cosmetic, but it is what makes
   a sheet of paper read as a record rather than a screenshot. */
function certId(name,d){
  const src=(name||'candidate')+'|'+d.toDateString()+'|'+CERT_TEST_NO;
  let h=2166136261;
  for(let i=0;i<src.length;i++){h^=src.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
  const ini=((name||'').trim().split(/\s+/).map(w=>w[0]).join('')||'C').toUpperCase().slice(0,2).padEnd(2,'X');
  const ymd=String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  return'CDI-L'+CERT_TEST_NO+'-'+ymd+'-'+ini+(h%9000+1000);
}
function timeTakenStr(){
  const e=(state.startedAt&&state.finishedAt)?Math.round((new Date(state.finishedAt)-new Date(state.startedAt))/1000):(40*60-state.timers.listening);
  const s=Math.max(0,e);
  return Math.floor(s/60)+'m '+String(s%60).padStart(2,'0')+'s';
}
/* Which part carried the candidate, and which one cost them. Judged on the
   whole row, and silent when the profile is flat or nothing was answered —
   a level profile has no headline. */
function partTags(parts){
  const out=parts.map(()=>'');
  if(!parts.some(p=>p.correct>0))return out;
  let hi=0,lo=0;
  parts.forEach((p,i)=>{if(p.correct>parts[hi].correct)hi=i;if(p.correct<parts[lo].correct)lo=i;});
  if(hi===lo||parts[hi].correct===parts[lo].correct)return out;
  out[hi]='<span class="cc-tag best">Strongest</span>';
  out[lo]='<span class="cc-tag focus">Focus</span>';
  return out;
}
/* The accepted answer, with the alternative wordings kept but set back so
   the eye lands on one form rather than on a list. */
function acceptedHTML(ca){
  const parts=String(ca||'').split(' / ');
  if(!parts[0])return'';
  return escapeHtml(parts[0])+(parts.length>1?'<span class="alt"> / '+parts.slice(1).map(escapeHtml).join(' / ')+'</span>':'');
}
/* The answer record. Every mark the grader produced is printed: what was
   typed, what was accepted, and the second in the recording where the
   answer was spoken. */
function renderCol(qs){
  return'<table class="answer-table"><thead><tr><th>#</th><th>Your answer</th><th>Accepted</th><th style="text-align:right">Heard at</th><th></th></tr></thead><tbody>'+
    qs.map((q,i)=>'<tr class="'+(i%2===1?'alt ':'')+(q.id%10===1&&q.id>1?'pbreak':'')+'">'+
      '<td class="td-num">'+q.id+'</td>'+
      '<td class="td-user '+(q.status==='wrong'?'wrong':'')+'">'+(q.ua?escapeHtml(q.ua):'<span class="empty">no answer</span>')+'</td>'+
      '<td class="td-correct">'+(q.status!=='correct'?acceptedHTML(q.ca):'<span class="dash">—</span>')+'</td>'+
      '<td class="td-at">'+(q.atLabel||'—')+'</td>'+
      '<td class="td-status '+q.status+'">'+(q.status==='correct'?'✓':q.status==='wrong'?'✗':'–')+'</td>'+
    '</tr>').join('')+'</tbody></table>';
}

/* ── THE SCORE SHEET ──────────────────────────────────────────────────
   Deliberately plain: raw score, band, and every one of the forty answers
   next to what was typed for it. Everything that explains *why* a mark was
   lost lives one click away, on the paper itself, with the transcript
   docked beside it — which is what the button at the foot opens. */
function renderResults(){
  const rd=gradeListening();
  const pct=Math.round(rd.score/rd.total*100);
  const nm=(state.student.name||'').trim();

  const pillRow='<div class="rs-pills">'+
    '<span class="rs-pill"><i class="ok"></i>'+rd.nCorrect+' correct</span>'+
    '<span class="rs-pill"><i class="no"></i>'+rd.nWrong+' wrong</span>'+
    '<span class="rs-pill"><i class="sk"></i>'+rd.nSkipped+' not answered</span>'+
  '</div>';

  const partCells=rd.parts.map(function(p){
    const w=function(v){return (v/p.total*100).toFixed(1)+'%';};
    return '<div class="rs-part">'+
      '<div class="pl">Part '+p.part+' &middot; Q'+p.from+'&ndash;'+p.to+'</div>'+
      '<div class="pv">'+p.correct+' <small>/ '+p.total+'</small></div>'+
      '<div class="pbar"><i class="ok" style="width:'+w(p.correct)+'"></i>'+
        '<i class="no" style="width:'+w(p.wrong)+'"></i>'+
        '<i class="sk" style="width:'+w(p.skipped)+'"></i></div>'+
    '</div>';
  }).join('');

  let rows='',lastPart=0;
  rd.detail.forEach(function(q){
    if(q.part!==lastPart){
      lastPart=q.part;
      rows+='<tr class="part-sep"><td colspan="4">Part '+q.part+
            ' &nbsp;&middot;&nbsp; Questions '+((q.part-1)*10+1)+'&ndash;'+(q.part*10)+'</td></tr>';
    }
    const ua=q.status==='skipped'
      ? '<td class="ua skip">not answered</td>'
      : '<td class="ua'+(q.status==='wrong'?' bad':'')+'">'+escapeHtml(q.ua)+'</td>';
    const mark=q.status==='correct'?'<td class="mk ok">&#10003;</td>'
             :q.status==='wrong'  ?'<td class="mk no">&#10007;</td>'
             :                     '<td class="mk sk">&ndash;</td>';
    rows+='<tr class="'+(q.status==='correct'?'':'row-no')+'">'+
          '<td class="q">'+q.id+'</td>'+ua+
          '<td class="ca">'+escapeHtml(q.ca)+'</td>'+mark+'</tr>';
  });

  document.getElementById('results-content').innerHTML=
  '<div class="rs-sheet">'+
    '<div class="rs-card">'+
      '<div class="rs-card-h">Your result</div>'+
      '<div class="rs-head">'+
        '<div class="rs-score"><div class="n">'+rd.score+'<small> / '+rd.total+'</small></div>'+
          '<div class="l">Raw score &middot; '+pct+'%</div></div>'+
        '<div class="rs-band"><div class="n">'+rd.band.toFixed(1)+'</div>'+
          '<div class="l">Band score</div></div>'+
        '<div class="rs-who">'+
          (nm?'<div>Candidate: <b>'+escapeHtml(nm)+'</b></div>':'')+
          '<div>Module: <b>Academic Listening</b></div>'+
          '<div>Paper: <b>Listening test 7</b></div>'+
        '</div>'+
      '</div>'+
      pillRow+
      '<div class="rs-parts">'+partCells+'</div>'+
    '</div>'+
    '<div class="rs-card">'+
      '<div class="rs-card-h">Answer key &middot; every question marked</div>'+
      '<table class="rs-table"><thead><tr>'+
        '<th>Q</th><th>Your answer</th><th>Correct answer</th><th></th>'+
      '</tr></thead><tbody>'+rows+'</tbody></table>'+
      '<div class="rs-cta">'+
        '<div class="rs-cta-txt"><b>Back to the listening test</b>'+
          'The paper reopens with your answers marked and the transcript docked on the right. '+
          'Play, pause or jump ten seconds from the bar at the top, and click any line to hear it again.</div>'+
        '<button class="rs-btn primary" type="button" onclick="ExamApp.reviewExam()">Back to the listening test &rarr;</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function renderResultsLegacy(){
  const rd=gradeListening(),band=rd.band,qs=rd.detail;
  const nC=rd.nCorrect,nW=rd.nWrong,nS=rd.nSkipped,tot=rd.total;
  const tier=bandTier(band);
  const d=certDate(),dateStr=certDateStr(d),rid=certId(state.student.name,d);
  const pct=(band/9*100).toFixed(1)+'%';
  const ticks=[0,1,2,3,4,5,6,7,8,9].map(n=>
    '<span class="'+(Math.floor(band)===n&&band>0?'hit':'')+'">'+n+'</span>').join('');

  const tally=(label,n,note)=>'<div class="tally">'+
    '<div class="tally-top"><span class="tally-title">'+label+'</span><span class="tally-n">'+n+'</span></div>'+
    '<div class="tally-track"><div class="tally-fill" data-w="'+(n/tot*100).toFixed(1)+'%" style="width:0"></div></div>'+
    '<div class="tally-note">'+note+'</div></div>';

  const tags=partTags(rd.parts);
  /* A part band is that part's ten marks scaled to the full forty and put
     through the same table — the move the Reading form makes per passage, so
     the two reports can be read the same way. */
  const ccBandCell=(b,delay)=>'<div class="cc-cell"><div class="cc-track">'+
    '<div class="cc-fill" data-w="'+(b/9*100).toFixed(1)+'%" style="width:0;background:'+bandColorVar(b)+';transition-delay:'+delay+'s"></div></div>'+
    '<span class="cc-val" style="color:'+bandColorVar(b)+'">'+b.toFixed(1)+'</span></div>';
  const partRows=rd.parts.map((p,i)=>{
    const meta=PART_META[i];
    const w=v=>(v/p.total*100).toFixed(1)+'%';
    const pb=bandFor(p.correct*4);
    return'<div class="cc-row">'+
      '<div class="cc-name">Part '+p.part+' <em>Questions '+p.from+'–'+p.to+'</em>'+tags[i]+'</div>'+
      '<div class="cc-cell"><div class="cc-track">'+
        '<i class="cc-seg ok" data-w="'+w(p.correct)+'" style="width:0"></i>'+
        '<i class="cc-seg no" data-w="'+w(p.wrong)+'" style="width:0"></i>'+
        '<i class="cc-seg sk" data-w="'+w(p.skipped)+'" style="width:0"></i>'+
      '</div><span class="cc-val" style="color:'+bandColorVar(pb)+'">'+p.correct+' <small>/ '+p.total+'</small></span></div>'+
      ccBandCell(pb,(0.30+i*0.06).toFixed(2))+
    '</div>';
  }).join('')+
  '<div class="cc-row cc-total"><div class="cc-name">Whole paper <em>'+tot+' questions</em></div>'+
    '<div class="cc-cell"><div class="cc-track">'+
      '<i class="cc-seg ok" data-w="'+(nC/tot*100).toFixed(1)+'%" style="width:0"></i>'+
      '<i class="cc-seg no" data-w="'+(nW/tot*100).toFixed(1)+'%" style="width:0"></i>'+
      '<i class="cc-seg sk" data-w="'+(nS/tot*100).toFixed(1)+'%" style="width:0"></i>'+
    '</div><span class="cc-val" style="color:'+bandColorVar(band)+'">'+nC+' <small>/ '+tot+'</small></span></div>'+
    ccBandCell(band,'0.56')+
  '</div>';

  const L=lossAnalysis(qs);
  const causeCard=(n,label,cls)=>n?'<div class="cause-card '+cls+'"><b>'+n+'</b><span>'+label+'</span></div>':'';
  const causeCards=[
    causeCard(L.plural,'Singular / plural','fixable'),
    causeCard(L.spelling,'Spelling slip','fixable'),
    causeCard(L.limitOv,'Over the word limit','fixable'),
    causeCard(L.real,'Comprehension','real'),
    causeCard(L.blank,'Left blank','blank')
  ].join('');
  const insightHTML='';   /* COSMOS: section cut */

  const bubbles=qs.map(q=>'<div class="q-bubble '+q.status+'" title="Q'+q.id+' · '+(q.ua?escapeHtml(q.ua).replace(/"/g,'')+' → ':'')+
    (q.status==='correct'?'correct':escapeHtml(q.ca).replace(/"/g,''))+(q.atLabel?' · heard at '+q.atLabel:'')+'">'+q.id+'</div>').join('');

  document.getElementById('results-content').innerHTML=
  '<div class="cert" data-tier="'+tier+'">'+
    '<div class="cert-header">'+
      '<div class="cert-logo">'+
        '<div class="logo-mark" role="img" aria-label="CDI Materials"></div>'+
        '<div><div class="cert-logo-name">CDI Materials</div>'+
        '<div class="cert-logo-sub">IELTS Academic · Listening</div></div>'+
      '</div>'+
      '<div class="cert-title-block">'+
        '<div class="cert-type-tag">'+escapeHtml(testName())+'</div>'+
        '<div class="cert-title-main">Test Report Form</div>'+
        '<div class="cert-date-val">Issued '+dateStr+'</div>'+
      '</div>'+
    '</div>'+
    '<div class="student-row">'+
      '<div><div class="field-label">Candidate</div><div class="field-value">'+escapeHtml(state.student.name||'—')+'</div></div>'+
      '<div><div class="field-label">Test date</div><div class="field-value">'+dateStr+'</div></div>'+
      '<div><div class="field-label">Module</div><div class="field-value">Academic Listening</div></div>'+
      '<div><div class="field-label">Report no.</div><div class="field-value" style="font-size:12px;letter-spacing:.04em">'+rid+'</div></div>'+
    '</div>'+
    '<div class="score-section">'+
      '<div class="band-card">'+
        '<div class="band-lbl">Overall band</div>'+
        '<div class="band-fig"><span class="band-num" data-band="'+band+'">'+band.toFixed(1)+'</span><span class="band-of">of 9</span></div>'+
        '<div class="band-level">'+bandLabel(band)+'</div>'+
        '<div class="band-formula"><b>'+nC+' of '+tot+'</b> correct, converted on the IELTS Listening raw-score band table</div>'+
      '</div>'+
      '<div class="band-side">'+
        '<div class="band-scale">'+
          '<div class="band-scale-top"><span class="band-scale-cap">Position on the IELTS scale</span>'+
          '<span class="band-scale-note">CEFR <b>'+cefrOf(band)+'</b></span></div>'+
          '<div class="band-scale-track">'+
            '<div class="band-scale-fill" data-w="'+pct+'" style="width:0"></div>'+
            '<div class="band-scale-dot" data-left="'+pct+'" style="left:0"></div>'+
          '</div>'+
          '<div class="band-scale-ticks">'+ticks+'</div>'+
        '</div>'+
        '<div class="band-verdict">'+bandMilestone(band)+'</div>'+
        '<div class="tally-grid">'+
          tally('Correct',nC,'<b>'+Math.round(nC/tot*100)+'%</b> of the paper')+
          tally('Incorrect',nW,'<b>'+Math.round(nW/tot*100)+'%</b> of the paper')+
          tally('Unanswered',nS,'<b>'+Math.round(nS/tot*100)+'%</b> of the paper')+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="band-desc"><div class="band-desc-h">'+bandDescHeading(band,true)+'</div>'+
    '<p>'+bandDescriptor(band).t+'</p></div>'+
    insightHTML+
    '<div class="section-heading"><span>Answer record</span></div>'+
    '<div class="answer-section">'+
      '<div class="q-grid">'+bubbles+'</div>'+
      '<div class="answer-cols">'+renderCol(qs.slice(0,20))+renderCol(qs.slice(20))+'</div>'+
      '<p class="answer-note"><b>Heard at</b> is the point in the recording where the answer is spoken — the audio runs '+mmss(1778)+' end to end. '+
      'Where several wordings are accepted they are separated by a slash.</p>'+
    '</div>'+
    '<div class="review-cta">'+
      '<div><div class="review-cta-title">Hear exactly where each mark went</div>'+
      '<div class="review-cta-sub">Every question re-opens beside the timed transcript, so you can play back the seconds that decided it.</div></div>'+
      '<button class="btn btn-primary" onclick="ExamApp.reviewExam()">Review Test &amp; Transcript &rarr;</button>'+
    '</div>'+
    '<div class="cert-footer">'+
      '<span>CDI Materials · @READING_CDI</span>'+
      '<span class="cert-id">'+rid+'</span>'+
      '<span>Practice score — not an official IELTS result</span>'+
    '</div>'+
  '</div>';

  applyBrandLogo();
  playCertReveal(document.getElementById('results-content'));
  buildPrintReport();
}

/* ── the reveal ─────────────────────────────────────────────────
   The band counts up, the ruler and every bar grow from zero. All of it
   degrades to the finished state instantly when motion is reduced. */
function certReduced(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
function playCertReveal(root){
  if(!root)return;
  const reduce=certReduced();
  const num=root.querySelector('.band-num');
  const target=num?parseFloat(num.getAttribute('data-band')):NaN;
  const settle=()=>{
    root.querySelectorAll('[data-w]').forEach(el=>{el.style.width=el.getAttribute('data-w');});
    const dot=root.querySelector('.band-scale-dot');
    if(dot)dot.style.left=dot.getAttribute('data-left');
    const sc=root.querySelector('.band-scale');
    if(sc)sc.classList.add('on');
  };
  if(reduce){if(num&&!isNaN(target))num.textContent=target.toFixed(1);settle();return;}
  requestAnimationFrame(()=>requestAnimationFrame(settle));
  if(!num||isNaN(target))return;
  num.textContent='0.0';
  const dur=1150,t0=performance.now()+220;
  const step=now=>{
    const t=Math.max(0,Math.min(1,(now-t0)/dur));
    const e=1-Math.pow(1-t,3);
    num.textContent=(target*e).toFixed(1);
    if(t<1)requestAnimationFrame(step);else num.textContent=target.toFixed(1);
  };
  requestAnimationFrame(step);
}

// Paint the REAL logo (the base64 PNG already on the registration card) onto
// the results topbar mark, the certificate header mark and the printed
// report. Referenced, never copied - duplicating the data URI would add
// ~42KB and three places to update.
function certLogoSrc(){var i=document.querySelector('.brand-logo');return i?i.getAttribute('src'):'';}
function applyBrandLogo(){
  var url=certLogoSrc();
  if(!url)return;
  var marks=document.querySelectorAll('#stage-results .logo-mark');
  for(var i=0;i<marks.length;i++){
    var el=marks[i];
    el.textContent='';
    el.style.backgroundImage='url("'+url+'")';
    el.style.backgroundColor='transparent';
    el.style.backgroundSize='contain';
    el.style.backgroundRepeat='no-repeat';
    el.style.backgroundPosition='center';
  }
}

// One builder for the answer-feedback chip (was three inline copies).
// `ans` must already be escaped by the caller.
function feedbackHTML(ok,ans){
  if(ok)return '<span class="fb-badge fb-ok" aria-hidden="true">✓</span>';
  return '<span class="fb-badge fb-no" aria-hidden="true">✗</span>'+
         '<span class="fb-ans">'+ans+'</span>';
}

// ====================================================================
// PRINTABLE REPORT — two A4 pages:
//   1 · the Test Report Form   2 · the full answer record
// Typeset in ink, not a screenshot of the dark score panel. The whole
// stylesheet ships inside #print-report so the sheet cannot inherit the
// chamber ground, a dark theme or the on-screen animations.
// ====================================================================
function printStylesheet(){
  /* NB: no @page here. The single @page rule for the document lives in the
     head stylesheet; two of them is what broke A4. */
  return'<style>'+
    '@media print{'+
      'html,body{background:#fff!important;overflow:visible!important;height:auto!important}'+
      /* every body-level overlay the app can leave open; the sheet carries the report and nothing else */
      '.stage,.warning-overlay,.toast,#audio-gate,#hl-popup,#cdi-webgl,'+
      '#notes-panel,#menu-dropdown,#notif-popup,#transcript-panel{display:none!important}'+
      '#print-report{display:block!important;background:#fff!important}'+
      '#print-report *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;'+
        'box-shadow:none!important;text-shadow:none!important;filter:none!important;animation:none!important;transition:none!important}'+
      '#print-report .print-page{break-after:page;page-break-after:always}'+
      '#print-report .print-page:last-child{break-after:auto;page-break-after:auto}'+
      '#print-report .pr-id,#print-report .pr-score,#print-report .pr-tally,#print-report .pr-desc,'+
      '#print-report .pr-notes,#print-report .pr-cause,#print-report table.pr-crit tr,#print-report .pr-sec{break-inside:avoid;page-break-inside:avoid}'+
      '#print-report table.pr-ans thead{display:table-header-group}'+
      '#print-report a{color:inherit!important;text-decoration:none!important}'+
    '}'+
    '#print-report{font-family:var(--pw-ui);color:#151310;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
    '#print-report .print-page{position:relative;box-sizing:border-box;padding:0 1mm;font-size:10.5pt;line-height:1.5;'+
      /* A4 minus 14mm top and 12mm bottom is 271mm of usable height; 265mm fills
         the sheet (the page foot is margin-top:auto) with 6mm of headroom, so a
         long name or a longer band descriptor cannot tip a page into a fourth. */
      'min-height:265mm;display:flex;flex-direction:column}'+
    '#print-report .pr-rule{height:2.6pt;background:linear-gradient(90deg,#17356a,#2c5fa8 58%,#c9a24f);border-radius:2pt}'+
    '#print-report .pr-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12mm;padding:5mm 0 4mm}'+
    '#print-report .pr-brand{display:flex;align-items:center;gap:3mm}'+
    '#print-report .pr-brand img{width:12mm;height:12mm;border-radius:3mm;display:block}'+
    '#print-report .pr-brand-name{font-family:var(--pw-display);font-weight:700;font-size:13pt;letter-spacing:-.01em;line-height:1.1}'+
    '#print-report .pr-brand-sub{font-size:6.5pt;font-weight:800;letter-spacing:.18em;color:#7b7062;margin-top:1mm}'+
    '#print-report .pr-headr{text-align:right}'+
    '#print-report .pr-kicker{font-size:6.5pt;font-weight:800;letter-spacing:.2em;color:#2c5fa8;text-transform:uppercase}'+
    '#print-report .pr-title{font-family:var(--pw-display);font-size:19pt;font-weight:700;letter-spacing:-.03em;line-height:1.1;margin-top:1mm}'+
    '#print-report .pr-date{font-size:8pt;color:#7b7062;margin-top:1mm}'+
    '#print-report .pr-id{display:grid;grid-template-columns:repeat(4,1fr);border:0.6pt solid #cdc6bb;border-radius:2mm;overflow:hidden}'+
    '#print-report .pr-id > div{padding:2.6mm 4mm;border-left:0.6pt solid #cdc6bb}'+
    '#print-report .pr-id > div:first-child{border-left:none}'+
    '#print-report .pr-id .l{font-size:6pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a7f70}'+
    '#print-report .pr-id .v{font-size:10.5pt;font-weight:700;margin-top:1mm;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '#print-report .pr-id .v.mod{font-size:9.6pt}'+
    '#print-report .pr-score{display:grid;grid-template-columns:53mm 1fr;gap:0;border:0.6pt solid #cdc6bb;border-top:1.6pt solid #17356a;border-radius:0 0 2mm 2mm;margin-top:5mm;background:#fbfaf7}'+
    '#print-report .pr-band{padding:4mm 4mm 4mm 5mm;border-right:0.6pt solid #cdc6bb;text-align:center}'+
    '#print-report .pr-band-lbl{font-size:6pt;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#7b7062}'+
    '#print-report .pr-band-num{font-family:var(--pw-display);font-size:46pt;font-weight:700;line-height:.95;letter-spacing:-.04em;color:#17356a;margin-top:1mm}'+
    '#print-report .pr-band-lvl{font-family:var(--pw-display);font-size:10.5pt;font-weight:600;margin-top:1.5mm;letter-spacing:-.01em}'+
    '#print-report .pr-band-f{font-size:7pt;color:#7b7062;margin-top:1.5mm;line-height:1.35}'+
    '#print-report .pr-side{padding:4mm 5mm}'+
    '#print-report .pr-scale-cap{font-size:6pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a7f70;margin-bottom:2mm}'+
    '#print-report .pr-scale{position:relative;height:3.4mm;border:0.6pt solid #cdc6bb;border-radius:99px;background:#f1ece3;overflow:hidden}'+
    '#print-report .pr-scale i{position:absolute;top:0;bottom:0;left:0;background:#2c5fa8;border-radius:99px;display:block}'+
    '#print-report{--cv-strong:#1f7a43;--cv-mid:#a97f34;--cv-low:#78818f;--cv-none:#b3ada4;--st-no:#ad3a2c}'+
    '#print-report .pr-ticks{display:flex;justify-content:space-between;margin-top:1.2mm}'+
    '#print-report .pr-ticks span{font-size:6pt;color:#9c9284}'+
    '#print-report .pr-ticks span.hit{color:#17356a;font-weight:800}'+
    '#print-report .pr-note-line{font-size:8pt;color:#5a5045;margin-top:2.5mm;line-height:1.45}'+
    '#print-report .pr-tally{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:3.5mm}'+
    '#print-report .pr-t{border:0.6pt solid #cdc6bb;border-radius:2mm;padding:2.4mm 3mm;background:#fff}'+
    '#print-report .pr-t-top{display:flex;align-items:baseline;justify-content:space-between;gap:2mm}'+
    '#print-report .pr-t-l{font-size:6.5pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#7b7062}'+
    '#print-report .pr-t-n{font-family:var(--pw-display);font-size:16pt;font-weight:700;line-height:1;letter-spacing:-.03em}'+
    '#print-report .pr-t-w{font-size:7pt;color:#8a7f70;margin-top:1.2mm}'+
    '#print-report .pr-sec{display:flex;align-items:center;gap:3mm;margin:6mm 0 3mm;font-size:6.5pt;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#2c5fa8}'+
    '#print-report .pr-sec::before,#print-report .pr-sec::after{content:"";flex:1;height:0.6pt;background:#ddd6ca}'+
    '#print-report table.pr-crit{width:100%;border-collapse:collapse;border:0.6pt solid #cdc6bb}'+
    '#print-report table.pr-crit th,#print-report table.pr-crit td{border:0.6pt solid #ddd6ca;padding:3mm 3.5mm;text-align:left;vertical-align:middle}'+
    '#print-report table.pr-crit thead th{background:#f6f1e8;font-size:6.5pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#5a5045}'+
    '#print-report table.pr-crit thead th b{font-family:var(--pw-display);font-size:12pt;font-weight:700;letter-spacing:-.03em;float:right;line-height:.9}'+
    '#print-report table.pr-crit td.n{font-size:9.5pt;font-weight:600;color:#3d372e;width:44%}'+
    '#print-report table.pr-crit td.n em{font-style:normal;font-size:7.6pt;color:#8a7f70;margin-left:2mm}'+
    '#print-report table.pr-crit td.v{width:28%}'+
    '#print-report table.pr-crit tr.tot td{background:#f9f4ea;font-weight:800}'+
    '#print-report .pr-cause{margin-top:4.4mm;border:0.6pt solid #cdc6bb;border-radius:2mm;padding:3mm 4mm;background:#fff}'+
    '#print-report .pr-cause-lead{font-size:9.5pt;font-weight:600;color:#3d372e;line-height:1.45}'+
    '#print-report .pr-cause-row{display:flex;flex-wrap:wrap;gap:2mm 3mm;margin-top:2.5mm}'+
    '#print-report .pr-cause-row span{font-size:8pt;color:#5a5045;border:0.6pt solid #ddd6ca;border-radius:1.5mm;padding:1mm 2.5mm}'+
    '#print-report .pr-cause-row span b{font-weight:800;color:#17356a}'+
    '#print-report .pr-tag{display:inline-block;margin-left:2.5mm;font-size:5.8pt;font-weight:800;letter-spacing:.12em;'+
    'text-transform:uppercase;padding:0.6mm 1.6mm;border-radius:1mm;vertical-align:middle}'+
    '#print-report .pr-tag.best{color:#1f7a43;background:#e6f1ea}'+
    '#print-report .pr-tag.focus{color:#8f6f2c;background:#f6eeda}'+
    '#print-report .pr-cellwrap{display:flex;align-items:center;gap:3mm}'+
    '#print-report .pr-bar{flex:1;height:2.4mm;border-radius:99px;background:#ece6db;overflow:hidden;min-width:20mm;display:flex}'+
    '#print-report .pr-bar i{display:block;height:100%}'+
    '#print-report .pr-bar i.ok{background:#1f7a43}'+
    '#print-report .pr-bar i.no{background:#ad3a2c}'+
    '#print-report .pr-bar i.sk{background:#d8d0c3}'+
    '#print-report .pr-num{font-family:var(--pw-display);font-size:11pt;font-weight:700;letter-spacing:-.02em;min-width:12mm;text-align:right;white-space:nowrap}'+
    '#print-report .pr-num small{font-size:8pt;font-weight:600;color:#8a7f70}'+
    '#print-report .pr-legend{font-size:7.5pt;color:#8a7f70;line-height:1.5;margin-top:3mm}'+
    '#print-report .pr-desc{margin-top:5mm;border-left:2pt solid #2c5fa8;background:#f8f4ec;border-radius:0 2mm 2mm 0;padding:3mm 4mm}'+
    '#print-report .pr-desc-h{font-family:var(--pw-display);font-size:9.5pt;font-weight:700;letter-spacing:-.01em;color:#17356a}'+
    '#print-report .pr-desc p{margin:1.4mm 0 0;font-size:8.6pt;line-height:1.5;color:#4a4237}'+
    '#print-report .pr-notes{flex:1;display:flex;flex-direction:column;margin-top:5mm;min-height:30mm;'+
    'border:0.6pt solid #cdc6bb;border-radius:2mm;padding:3mm 4mm 2mm}'+
    '#print-report .pr-notes-h{font-size:6.2pt;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#8a7f70;margin-bottom:2mm}'+
    '#print-report .pr-notes-lines{flex:1;min-height:20mm;background-image:repeating-linear-gradient(180deg,transparent 0 7.3mm,#d6cdbd 7.3mm 7.6mm)}'+
    '#print-report .pr-foot{margin-top:auto;display:flex;justify-content:space-between;gap:6mm;padding-top:2.5mm;'+
    'border-top:0.6pt solid #ddd6ca;font-size:6.8pt;color:#8a7f70;letter-spacing:.04em}'+
    /* page 2 — the answer record */
    '#print-report .print-head{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1.2pt solid #17356a;padding-bottom:2mm;margin-bottom:5mm}'+
    '#print-report .print-brand{font-family:var(--pw-display);font-weight:700;font-size:11pt;color:#17356a;letter-spacing:-.01em}'+
    '#print-report .print-task-tag{font-size:7pt;font-weight:800;text-transform:uppercase;letter-spacing:.18em;color:#7b7062}'+
    '#print-report .pr-ans-cols{border:0.6pt solid #cdc6bb;border-radius:2mm;overflow:hidden}'+
    '#print-report table.pr-ans{width:100%;border-collapse:collapse;font-size:8.4pt}'+
    '#print-report table.pr-ans th{background:#f6f1e8;text-align:left;font-size:5.8pt;font-weight:800;letter-spacing:.15em;'+
    'text-transform:uppercase;color:#8a7f70;padding:2mm 2.6mm;border-bottom:0.6pt solid #cdc6bb;white-space:nowrap}'+
    '#print-report table.pr-ans td{padding:1.5mm 3mm;border-top:0.6pt solid #eae4d9;vertical-align:baseline;line-height:1.32}'+
    '#print-report table.pr-ans tr:first-child td{border-top:none}'+
    '#print-report table.pr-ans tr.alt td{background:#faf7f1}'+
    '#print-report table.pr-ans .n{width:9mm;font-size:7.4pt;font-weight:700;color:#9c9284}'+
    '#print-report table.pr-ans .u{width:34%;font-weight:600;color:#2b251d;overflow-wrap:break-word}'+
    '#print-report table.pr-ans .u.bad{color:#ad3a2c;font-weight:700}'+
    '#print-report table.pr-ans .u em{color:#a9a196;font-style:italic;font-weight:500}'+
    '#print-report table.pr-ans .c{color:#1f7a43;font-weight:600;overflow-wrap:break-word}'+
    '#print-report table.pr-ans .u,#print-report table.pr-ans .c{hyphens:none}'+
    '#print-report table.pr-ans .c .alt{color:#9c9284;font-weight:500}'+
    '#print-report table.pr-ans tr.pbreak td{border-top:0.6pt solid #cdc6bb}'+
    '#print-report table.pr-ans .t{width:16mm;text-align:right;font-size:7.4pt;color:#9c9284;white-space:nowrap}'+
    '#print-report table.pr-ans .s{width:7mm;text-align:center;font-weight:800}'+
    '#print-report table.pr-ans .s.correct{color:#1f7a43}'+
    '#print-report table.pr-ans .s.wrong{color:#ad3a2c}'+
    '#print-report table.pr-ans .s.skipped{color:#c3bbae}'+
    '#print-report .pr-pagefoot{margin-top:auto;border-top:0.6pt solid #ddd6ca;padding-top:2.5mm;'+
    'display:flex;justify-content:space-between;gap:6mm;font-size:6.8pt;color:#9c9284;letter-spacing:.04em}'+
    '</style>';
}

function printCertPage(rd,d,rid){
  const band=rd.band,tot=rd.total,nC=rd.nCorrect,nW=rd.nWrong,nS=rd.nSkipped;
  const ticks=[0,1,2,3,4,5,6,7,8,9].map(n=>
    '<span class="'+(Math.floor(band)===n&&band>0?'hit':'')+'">'+n+'</span>').join('');
  const head='<div class="pr-rule"></div><div class="pr-head">'+
    '<div class="pr-brand"><img src="'+certLogoSrc()+'" alt=""><div>'+
    '<div class="pr-brand-name">CDI Materials</div><div class="pr-brand-sub">IELTS ACADEMIC · LISTENING</div></div></div>'+
    '<div class="pr-headr"><div class="pr-kicker">'+escapeHtml(testName())+'</div>'+
    '<div class="pr-title">Test Report Form</div><div class="pr-date">'+certDateStr(d)+'</div></div></div>'+
    '<div class="pr-id">'+
    '<div><div class="l">Candidate</div><div class="v">'+escapeHtml(state.student.name||'—')+'</div></div>'+
    '<div><div class="l">Test date</div><div class="v">'+certDateStr(d)+'</div></div>'+
    '<div><div class="l">Module</div><div class="v mod">Academic Listening</div></div>'+
    '<div><div class="l">Report no.</div><div class="v" style="font-size:8.2pt;letter-spacing:.03em;white-space:nowrap">'+rid+'</div></div></div>';
  const t=(l,n,w)=>'<div class="pr-t"><div class="pr-t-top"><span class="pr-t-l">'+l+'</span>'+
    '<span class="pr-t-n">'+n+'</span></div><div class="pr-t-w">'+w+'</div></div>';
  const tags=partTags(rd.parts);
  /* A part band is that part's ten marks scaled to the full forty and put
     through the same table, so the four parts can be compared with each other
     and with the paper — exactly the move the Reading form makes per passage. */
  const bandCell=(b)=>{const col=bandColorVar(b);
    return'<td class="v"><div class="pr-cellwrap"><div class="pr-bar"><i style="width:'+(b/9*100).toFixed(1)+'%;background:'+col+'"></i></div>'+
      '<span class="pr-num" style="color:'+col+'">'+b.toFixed(1)+'</span></div></td>';};
  const rows=rd.parts.map((p,i)=>{
    const meta=PART_META[i];
    const w=v=>(v/p.total*100).toFixed(1)+'%';
    const pb=bandFor(p.correct*4);
    /* One line per part, as the Reading sheet sets its passages. The part's
       kind ("Conversation · everyday social context") used to sit on a second
       line inside the cell, which made every row in this table twice the height
       of the same table on the Reading certificate — the two are meant to read
       as one artefact. The kind is still on the results screen. */
    return'<tr><td class="n">Part '+p.part+'<em>Q'+p.from+'–'+p.to+'</em>'+
      (tags[i].indexOf('best')>-1?'<span class="pr-tag best">Strongest</span>':tags[i].indexOf('focus')>-1?'<span class="pr-tag focus">Focus</span>':'')+
      '</td>'+
      '<td class="v"><div class="pr-cellwrap"><div class="pr-bar">'+
      '<i class="ok" style="width:'+w(p.correct)+'"></i><i class="no" style="width:'+w(p.wrong)+'"></i><i class="sk" style="width:'+w(p.skipped)+'"></i>'+
      '</div><span class="pr-num" style="color:'+bandColorVar(pb)+'">'+p.correct+' <small>/ '+p.total+'</small></span></div></td>'+
      bandCell(pb)+'</tr>';
  }).join('')+
  '<tr class="tot"><td class="n">Whole paper<em>'+tot+' questions</em></td>'+
    '<td class="v"><div class="pr-cellwrap"><div class="pr-bar">'+
    '<i class="ok" style="width:'+(nC/tot*100).toFixed(1)+'%"></i><i class="no" style="width:'+(nW/tot*100).toFixed(1)+'%"></i><i class="sk" style="width:'+(nS/tot*100).toFixed(1)+'%"></i>'+
    '</div><span class="pr-num" style="color:'+bandColorVar(band)+'">'+nC+' <small>/ '+tot+'</small></span></div></td>'+
    bandCell(band)+'</tr>';
  const L=lossAnalysis(rd.detail);
  const causeBits=[
    L.plural  ?'<span><b>'+L.plural  +'</b> singular / plural</span>':'',
    L.spelling?'<span><b>'+L.spelling+'</b> spelling slip</span>'    :'',
    L.limitOv ?'<span><b>'+L.limitOv +'</b> over the word limit</span>':'',
    L.real    ?'<span><b>'+L.real    +'</b> comprehension</span>'    :'',
    L.blank   ?'<span><b>'+L.blank   +'</b> left blank</span>'       :''
  ].join('');
  return'<div class="print-page pr-cert">'+head+
    '<div class="pr-score"><div class="pr-band">'+
    '<div class="pr-band-lbl">Overall band</div><div class="pr-band-num">'+band.toFixed(1)+'</div>'+
    '<div class="pr-band-lvl">'+bandLabel(band)+'</div>'+
    '<div class="pr-band-f" style="margin-top:1mm">CEFR '+cefrOf(band)+'</div>'+
    '<div class="pr-band-f">'+nC+' of '+tot+' correct, converted on<br>the IELTS Listening band table</div></div>'+
    '<div class="pr-side"><div class="pr-scale-cap">Position on the IELTS 0–9 scale</div>'+
    '<div class="pr-scale"><i style="width:'+(band/9*100).toFixed(1)+'%;background:'+bandColorVar(band)+'"></i></div>'+
    '<div class="pr-ticks">'+ticks+'</div>'+
    '<div class="pr-note-line">'+bandMilestone(band).replace(/<\/?b>/g,'')+'</div>'+
    '<div class="pr-tally">'+t('Correct',nC,Math.round(nC/tot*100)+'% of the paper')+
      t('Incorrect',nW,Math.round(nW/tot*100)+'% of the paper')+
      t('Unanswered',nS,Math.round(nS/tot*100)+'% of the paper')+'</div></div></div>'+
    '<div class="pr-desc"><div class="pr-desc-h">'+bandDescHeading(band)+'</div>'+
    '<p>'+bandDescriptor(band).t+'</p></div>'+
    '<div class="pr-foot"><span>CDI Materials · @READING_CDI · practice score, not an official IELTS result</span>'+
    '<span>'+rid+'</span></div></div>';
}

function printAnswerPage(rd,rid,from,to,pageNo){
  const qs=rd.detail.filter(q=>q.id>=from&&q.id<=to);
  const last=pageNo===3;
  return'<div class="print-page">'+
    '<div class="print-head"><span class="print-brand">'+escapeHtml(testName())+'</span>'+
    '<span class="print-task-tag">Answer record · Questions '+from+'–'+to+'</span></div>'+
    '<div class="pr-ans-cols"><table class="pr-ans"><thead><tr><th>#</th><th>Your answer</th><th>Accepted</th>'+
    '<th style="text-align:right">Heard at</th><th></th></tr></thead><tbody>'+
    qs.map((q,i)=>'<tr class="'+(i%2===1?'alt ':'')+(q.id%10===1&&q.id>from?'pbreak':'')+'">'+
      '<td class="n">'+q.id+'</td>'+
      '<td class="u '+(q.status==='wrong'?'bad':'')+'">'+(q.ua?escapeHtml(q.ua):'<em>no answer</em>')+'</td>'+
      '<td class="c">'+(q.status!=='correct'?acceptedHTML(q.ca):'—')+'</td>'+
      '<td class="t">'+(q.atLabel||'—')+'</td>'+
      '<td class="s '+q.status+'">'+(q.status==='correct'?'✓':q.status==='wrong'?'✗':'–')+'</td>'+
    '</tr>').join('')+'</tbody></table></div>'+
    '<p class="pr-legend"><b>Heard at</b> is the point in the recording where the answer is spoken; the audio runs '+mmss(1778)+' end to end. '+
    'Where several wordings are accepted they are separated by a slash; a dash in the Accepted column means the answer was marked correct as written.</p>'+
    (last?'<div class="pr-notes"><div class="pr-notes-h">Teacher’s notes</div><div class="pr-notes-lines"></div></div>':'')+
    '<div class="pr-pagefoot"><span>'+escapeHtml(testName())+' · '+escapeHtml(state.student.name||'Candidate')+'</span>'+
    '<span>Page '+pageNo+' of 3 · '+rid+'</span></div></div>';
}

/* Built with the certificate, and rebuilt on Cmd/Ctrl+P, so the sheet is
   always in the document whichever way the print is started. */
function buildPrintReport(){
  const host=document.getElementById('print-report');
  if(!host)return;
  const rd=gradeListening(),d=certDate(),rid=certId(state.student.name,d);
  /* ONE A4 sheet — see the note in the Reading engine. The two answer-record
     pages are gone; the same record is still on the results screen. */
  host.innerHTML=printStylesheet()+printCertPage(rd,d,rid);
}
try{window.addEventListener('beforeprint',buildPrintReport);}catch(e){/* non-fatal */}

/* The downloaded file is named for the certificate it contains: same wording,
   same order — V3-Reading-1-Islom-Kenjayev-20260902. The sitting date is what
   stops a re-sit silently overwriting the first attempt; without it the browser
   just appends "(1)" and the two are no longer tellable apart. */
function reportFileStem(){
  const d=certDate();
  const name=(state.student.name||'Candidate').replace(/[^\w\s-]/g,'').trim().replace(/\s+/g,'-');
  const ymd=String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  return 'Volume-10-Listening-Test-1-'+name+'-'+ymd;
}

/* ── How the report leaves the page ───────────────────────────────────────
   Two controls, and each label says exactly what it does.

   "Download PDF" is one click and a file on disk. PDFX — the block inlined
   just above this script — walks the three typeset sheets and re-emits them
   as PDF vector operators: real text objects, real paths, positioned by the
   browser's own layout so every line break and every box is the one the
   print route would have produced. The file is tens of kilobytes, its text
   is selectable, searchable and extractable, and it needs neither a print
   dialog nor a network. The only bitmap in it is the CDI logo, which is a
   picture and is embedded as one.

   The obvious alternative, jsPDF + html2canvas, was rejected: ~360KB of
   library to screenshot the report into a bitmap — a picture of text, which
   cannot be selected or searched, weighs megabytes and prints soft. PDFX
   costs about a tenth of that and keeps the type real.

   "Print" hands the same three sheets to the browser's own print engine.
   That is still the highest-fidelity route — it sets the report in the very
   faces it was designed in and embeds them — but it costs a trip through the
   print dialog and a destination choice, so it is not a download and is not
   called one. It is also the automatic fallback if the exporter ever fails.

   The page box below must stay identical to the document's single @page rule;
   it is what the exporter uses for the sheet size and the margins. */
const PDF_PAGE = { w: 210, h: 297, mt: 14, mr: 14, mb: 12, ml: 14 };   /* A4 · @page{size:A4 portrait;margin:14mm 14mm 12mm} */

function printReport() {
  buildPrintReport();
  toast('Choose “Save as PDF” as the destination to keep a copy.', 'info', 6000);
  setTimeout(function(){ try { window.print(); } catch (e) { toast('Your browser blocked printing.', 'error'); } }, 220);
}

/* PDFX walks whatever host it is given and treats each .print-page inside it as
   a sheet, so the export can simply be pointed at the real certificate. The node
   is tagged in place rather than cloned: cloning it out of #stage-results would
   stop `#stage-results .cert` matching and strip the whole design. */
function buildCertSheet() {
  var cert = document.querySelector('#results-content .cert');
  if (cert) cert.classList.add('print-page');
}

let pdfBusy = false;
/* The certificate, photographed rather than redrawn. A capture cannot drift
   from the screen the way a second typesetting can, and it fills the sheet
   instead of being shrunk to fit it. html2canvas and jsPDF are embedded above,
   so this needs no network; if either is somehow missing the vector exporter
   still answers. */
function downloadReport() {
  if (pdfBusy) return;
  var cert = document.querySelector('#results-content .cert');
  if (!cert || typeof html2canvas === 'undefined' || !window.jspdf) {
    return downloadReportVector();
  }
  pdfBusy = true;
  var btn = document.getElementById('results-download-btn');
  var was = btn ? btn.textContent : null;
  if (btn) { btn.disabled = true; btn.textContent = 'Building…'; }

  var settled = false;
  var done = function () {
    if (settled) return;
    settled = true;
    pdfBusy = false;
    if (btn) { btn.disabled = false; btn.textContent = was; }
  };

  /* A capture is CPU work with no timeout of its own: on a slow machine, or one
     without hardware acceleration, it can run long enough that the button looks
     dead — and if it never settles, it stays that way for the rest of the
     session. After twenty-five seconds the vector exporter answers instead, so
     the button always comes back and a PDF always arrives. */
  var watchdog = setTimeout(function () {
    if (settled) return;
    done();
    downloadReportVector();
  }, 25000);

  html2canvas(cert, {
    /* 1.6x lands about 200dpi once the image is placed at ~193mm wide — sharp
       in print, and appreciably less canvas to rasterise than 2x, which is
       what makes the difference on a machine without a GPU. */
    scale: 1.6,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    /* the star field is a live canvas behind the sheet, no part of the
       document; the CTA is a button, useless on paper — and it is the only
       thing here painted with color-mix(), which Chrome serialises to
       color(srgb …) and html2canvas 1.4.1 dies on */
    ignoreElements: function (el) {
      return el.id === 'cdi-stars-host' ||
             (el.classList && el.classList.contains('review-cta'));
    },
    onclone: function (doc) {
      var st = doc.createElement('style');
      st.textContent =
        /* the clone restarts the sheet's entrance keyframes and paints before
           they run, so every part would be caught at opacity 0 — a blank page */
        '*,*::before,*::after{animation:none!important;transition:none!important}' +
        /* the band score is gradient-filled text; html2canvas cannot clip a
           background to glyphs, so it painted the gradient and lost the number */
        '#stage-results .band-num{background:none!important;' +
        '-webkit-background-clip:border-box!important;background-clip:border-box!important;' +
        'color:#ffffff!important}';
      (doc.head || doc.documentElement).appendChild(st);
    }
  }).then(function (canvas) {
    clearTimeout(watchdog);
    if (settled) return;          /* the watchdog got there first */
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    var PW = 210, PH = 297, M = 8;
    var boxW = PW - M * 2, boxH = PH - M * 2;
    var s = Math.min(boxW / canvas.width, boxH / canvas.height);
    var w = canvas.width * s, h = canvas.height * s;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG',
                 M + (boxW - w) / 2, M + (boxH - h) / 2, w, h);
    var name = reportFileStem();
    if (!/\.pdf$/i.test(name)) name += '.pdf';
    pdf.save(name);
    try { toast('Certificate saved to your downloads.', 'success', 4200); } catch (e) {}
    done();
  }).catch(function () {
    clearTimeout(watchdog);
    if (settled) return;
    done();
    downloadReportVector();
  });
}

function downloadReportVector() {
  if (pdfBusy) return;
  if (typeof PDFX === 'undefined') { printReport(); return; }   /* never a dead button */
  pdfBusy = true;
  const btn = document.getElementById('results-download-btn');
  const was = btn ? btn.textContent : null;
  if (btn) { btn.disabled = true; btn.textContent = 'Building…'; }
  PDFX.save({
    hostId: 'results-content',
    page: PDF_PAGE,
    build: buildCertSheet,
    fileName: reportFileStem(),
    meta: { title: testName() + ' — ' + (state.student.name || 'Candidate'), author: 'CDI Materials', subject: 'IELTS Academic Listening · Test Report Form' }
  }).then(function (r) {
    toast('Report saved to your downloads — ' + r.pages.length + ' pages, ' +
          Math.max(1, Math.round(r.bytes / 1024)) + ' KB, with selectable text.', 'success', 5200);
  }).catch(function () {
    toast('Could not build the PDF here — opening the print dialog instead.', 'error', 5000);
    printReport();
  }).then(function () {
    pdfBusy = false;
    if (btn) { btn.disabled = false; btn.textContent = was; }
  });
}

// REVIEW
// ---------------------------------------------------------------------------
// The ORIGINAL review architecture, restored.
//
//   the exam sheet, in place, with every answer revealed
// + a transcript panel docked to the right, following the recording
// + the transport the exam withholds, in the header
// + a timecode on every question and every transcript line: press one and the
//   recording seeks there and the transcript scrolls to that moment.
//
// The timecode jump is the point of the screen. Everything else serves it.
// Nothing here touches #stage-listening's geometry or the audio gate: review
// is a body class, not a different screen.
// ---------------------------------------------------------------------------

/* Reveal the marks on the exam sheet itself: the field turns, the feedback
   chip opens with the correct answer, the right option is named. */
function applyReviewReveal(){gradeListening().detail.forEach(d=>{
  const fb=document.getElementById('lfb-'+d.id);
  if(fb){
    fb.className='feedback-pill show '+(d.isCorrect?'correct':'wrong');
    fb.innerHTML=feedbackHTML(d.isCorrect,escapeHtml(d.ca));
  }
  const el=document.getElementById('lq-'+d.id);
  if(el&&el.dataset&&el.dataset.dm){
    const drop=document.getElementById('drop-'+d.id);
    if(drop){drop.classList.remove('dm-correct','dm-wrong');drop.classList.add(d.isCorrect?'dm-correct':'dm-wrong');}
    return;
  }
  if(el&&(el.tagName==='INPUT'||el.tagName==='SELECT'))el.classList.add(d.isCorrect?'correct':'incorrect');
  const card=document.getElementById('lq-card-'+d.id);
  if(card)card.querySelectorAll('.option').forEach(opt=>{const ri=opt.querySelector('input[type=radio]');if(!ri)return;if(ri.value===d.ca)opt.classList.add('correct');else if(opt.classList.contains('selected')){opt.classList.remove('selected');opt.classList.add('wrong');}});
});}

function reviewExam(){
  document.body.classList.add('review-mode','tp-active');
  // the notes rail is exam furniture; the transcript takes that side now
  document.body.classList.remove('notes-open');
  // the play gate stays up when the stream never started; at z-index 1000 it
  // would float over review and swallow every click
  try{hideAudioGate();}catch(e){}
  // Move the transport into the header. It is display:none outside review, so
  // this is the only place in the app where it becomes visible.
  const audioEl=document.getElementById('pbar-audio');
  const hdrRight=document.getElementById('hdr-right');
  const wifiBtn=document.getElementById('wifi-btn');
  if(audioEl&&hdrRight){hdrRight.insertBefore(audioEl,wifiBtn||null);}
  renderListening(); // renderSection() schedules applyReviewReveal+addJumpButtons after 50ms
  updateListeningNav();
  goToStage('listening');
  // goToStage has just persisted stage:'listening'. The test is finished, and a
  // reload must not greet the candidate with "you left a test running" and offer
  // to resume it. Review is entered from the certificate, so that is where a
  // reload belongs; one click brings this screen straight back.
  state.stage='results';saveState();
  window.scrollTo(0,0);
  buildTranscriptPanel();
  const audio=document.getElementById('exam-audio');
  if(audio){
    wireTransport(audio);
    wireReviewAudio(audio);
    if(reviewExam._tu)audio.removeEventListener('timeupdate',reviewExam._tu);
    reviewExam._tu=function(){syncTranscriptPanel(audio.currentTime);};
    audio.addEventListener('timeupdate',reviewExam._tu);
  }
  // Sync is two-way: the transcript drives the audio as well as following it.
  const tpBody=document.getElementById('tp-body');
  if(tpBody&&!tpBody._seekWired){
    tpBody._seekWired=1;
    tpBody.addEventListener('click',function(e){
      const item=e.target.closest?e.target.closest('.tp-item'):null;
      if(!item||item.classList.contains('tp-break'))return;
      const t=parseFloat(item.getAttribute('data-t'));
      if(!isNaN(t))jumpToTime(t,{runup:0,from:item});
    });
    tpBody.addEventListener('keydown',function(e){
      if(e.key!=='Enter'&&e.key!==' ')return;
      const item=e.target.closest?e.target.closest('.tp-item'):null;
      if(!item||item.classList.contains('tp-break'))return;
      e.preventDefault();
      const t=parseFloat(item.getAttribute('data-t'));
      if(!isNaN(t))jumpToTime(t,{runup:0,from:item});
    });
  }
  _tpIdx=-1;
  syncTranscriptPanel(audio?(audio.currentTime||0):0);
}

/* The recording streams from the CDI server. With no connection it never
   arrives — and the screen must say so rather than look broken, because the
   transcript, the timecodes and the revealed answers are all still usable. */
function reviewAudioDown(on){
  document.body.classList.toggle('audio-down',!!on);
  const b=document.getElementById('audio-state-badge');
  if(on&&b){b.textContent='✕ NO AUDIO';b.className='is-error';}
  if(!on&&reviewAudioDown._wd){clearTimeout(reviewAudioDown._wd);reviewAudioDown._wd=null;}
}
function wireReviewAudio(audio){
  if(!audio)return;
  if(!audio._rvWired){
    audio._rvWired=1;
    const down=function(){reviewAudioDown(true);};
    const up=function(){reviewAudioDown(false);};
    audio.addEventListener('error',down);
    // `play` fires the instant play() is called — its promise rejects later —
    // so it is NOT proof the stream arrived. `playing` is.
    audio.addEventListener('playing',up);
    audio.addEventListener('canplay',up);
    audio.addEventListener('loadedmetadata',up);
    // wireTransport writes BUFFERING / STALLED on these; it registered first,
    // so re-asserting here wins and the badge stays honest while nothing loads.
    audio.addEventListener('waiting',function(){if(audio.readyState<1)down();});
    audio.addEventListener('stalled',function(){if(audio.readyState<1)down();});
    const src=audio.querySelector('source');
    if(src)src.addEventListener('error',down);
  }
  if(audio.readyState>=1){reviewAudioDown(false);return;}
  try{audio.load();}catch(e){}
  if(reviewAudioDown._wd)clearTimeout(reviewAudioDown._wd);
  reviewAudioDown._wd=setTimeout(function(){if(audio.readyState<1)reviewAudioDown(true);},9000);
}

// TRANSCRIPT
/* One transcript line, rendered as karaoke-able words with the answers it
   contains marked in place. The cursor advances by CHUNK (sentence), not by
   word: word timings would have to be a linear split of the line's duration,
   which is wrong for real speech — a phrase arriving early reads as pacing, a
   word does not. `ans` carries the verdict so the pill can wear its colour. */
function buildWordSpans(tx,aw,answers,verdicts){
  var pill=answers&&answers.length?answers.map(function(q){
    var st=(verdicts&&verdicts[q])||'skipped';
    return '<span class="tp-apill-i is-'+st+'" title="Question '+q+' — '+st+'">Q'+q+'</span>';
  }).join(''):'';
  var awIdx=aw?tx.toLowerCase().indexOf(aw.toLowerCase()):-1;
  var wi=0, ci=0, inChunk=0;
  function endChunk(){ if(inChunk>0){ ci++; inChunk=0; } }
  function wrapWords(str,cls){
    return str.split(/(\s+)/).map(function(tok){
      if(/^\s+$/.test(tok))return tok;
      var html='<span class="tp-w'+(cls?' '+cls:'')+'" data-wi="'+(wi++)+'" data-ci="'+ci+'">'+escapeHtml(tok||'')+'</span>';
      inChunk++;
      // sentence-final punctuation only — commas and clause breaks do not split
      if(/[.!?…]["')\]]?$/.test(tok)) endChunk();
      return html;
    }).join('');
  }
  if(awIdx<0){var only=wrapWords(tx,'');endChunk();return only+pill;}
  var before=tx.slice(0,awIdx);
  var matchedStr=tx.slice(awIdx, awIdx+aw.length);
  var after=tx.slice(awIdx+aw.length);
  var r='';
  if(before)r+=wrapWords(before,'');
  // no forced break here: the answer belongs to the sentence around it, and its
  // gold styling comes from .tp-ans-w rather than from being its own chunk
  r+='<mark class="tp-ans-mark">'+wrapWords(matchedStr,'tp-ans-w')+'</mark>'+pill;
  if(after)r+=wrapWords(after,'');
  endChunk();
  return r;
}

function buildTranscriptPanel(){
  const panel=document.getElementById('transcript-panel');
  if(!panel)return;
  const verdicts={};
  try{gradeListening().detail.forEach(function(d){verdicts[d.id]=d.status;});}catch(e){}
  let marked=0;
  let h='<div class="tp-hdr"><span class="tp-live-dot"></span>'+
        '<span class="tp-hdr-lbl">READING_CDI &middot; Transcript</span>'+
        '<span class="tp-hdr-count" id="tp-hdr-count"></span></div>';
  h+='<div class="tp-offline">'+
       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 8v5"/><path d="M12 16.5h.01"/><circle cx="12" cy="12" r="9"/></svg>'+
       '<span><b>The recording could not be loaded.</b> It is streamed, so it needs a connection. '+
       'The transcript, the timecodes and your marked answers below are all complete — only playback is unavailable.</span>'+
     '</div>';
  h+='<div class="tp-wrap">';
  h+='<div class="tp-fade-top"></div>';
  h+='<div class="tp-fade-bot"></div>';
  h+='<div class="tp-body" id="tp-body">';
  TRANSCRIPT.forEach(function(e,i){
    if(e.type==='break'){
      h+='<div class="tp-item tp-break" id="tpi-'+i+'" data-t="'+(e.t||0)+'"><div class="tp-br-line"></div>'+
         '<span class="tp-br-lbl">'+escapeHtml(e.label||'')+'</span><div class="tp-br-line"></div></div>';
    } else {
      var txHtml=buildWordSpans(e.tx,e.aw||null,e.answers||[],verdicts);
      if(e.answers&&e.answers.length)marked+=e.answers.length;
      h+='<div class="tp-item" id="tpi-'+i+'" data-t="'+(e.t||0)+'" data-sp="'+escapeHtml(e.sp||'')+'"'+
         '>'+
         '<div class="tp-sp">'+escapeHtml(e.sp||'')+
           ''+
         '</div>'+
         '<div class="tp-tx">'+txHtml+'</div></div>';
    }
  });
  h+='</div></div>';
  panel.innerHTML=h;
  const cnt=document.getElementById('tp-hdr-count');
  if(cnt)cnt.textContent=marked+' answers marked';
}

/* m:ss, the label every timecode in review wears. */
function tcLabel(t){
  t=Math.max(0,Math.round(+t||0));
  return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');
}

function syncTranscriptPanel(currentTime){
  return; /* plain transcript: no timecode sync */
  if(!Array.isArray(TRANSCRIPT)||!TRANSCRIPT.length)return;
  let idx=0;
  for(let i=0;i<TRANSCRIPT.length;i++){
    if(TRANSCRIPT[i].t<=currentTime)idx=i; else break;
  }
  if(idx!==_tpIdx){
    _tpIdx=idx;
    document.querySelectorAll('#transcript-panel .tp-item').forEach(function(el,i){
      el.classList.toggle('tp-past',i<idx);
      el.classList.toggle('tp-cur',i===idx);
    });
    document.querySelectorAll('#transcript-panel .tp-w-lit').forEach(function(w){w.classList.remove('tp-w-lit');});
    const cur=document.getElementById('tpi-'+idx);
    const body=document.getElementById('tp-body');
    if(cur&&body){
      const bRect=body.getBoundingClientRect(),cRect=cur.getBoundingClientRect();
      body.scrollTop=body.scrollTop+(cRect.top-bRect.top)-body.clientHeight/2+cRect.height/2;
    }
  }
  // karaoke: progressively light words in current entry
  const entry=TRANSCRIPT[idx];
  if(!entry||entry.type==='break')return;
  const next=TRANSCRIPT[idx+1];
  // `e` is the line's true spoken end. Without it the window would stretch across
  // the silence that follows the line - the 30s question-reading pauses - and the
  // words would light far slower than they are said. Cap the fallback for the same
  // reason: no line of speech runs longer than ~12s.
  let dur;
  if(typeof entry.e==='number'&&entry.e>entry.t){
    dur=entry.e-entry.t;
  }else{
    dur=next?(next.t-entry.t):8;
    if(dur>12)dur=12;
  }
  if(!(dur>0))dur=8;
  const prog=Math.min(1,Math.max(0,(currentTime-entry.t)/dur));
  const curEl=document.getElementById('tpi-'+idx);
  if(!curEl)return;
  const words=curEl.querySelectorAll('.tp-w');
  let chunks=0;
  words.forEach(function(w){var c=+(w.dataset.ci||0);if(c+1>chunks)chunks=c+1;});
  if(!chunks)chunks=1;
  // +1: a line is usually ONE sentence, and floor(prog*1) is 0 until the very
  // end — without this the current line would never light while being spoken.
  const litChunks=Math.min(chunks,Math.floor(prog*chunks)+1);
  words.forEach(function(w){w.classList.toggle('tp-w-lit',(+(w.dataset.ci||0))<litChunks);});
}

/* The timecode beside every question that has one. Pressing it seeks the
   recording to the moment that answer is spoken and pulls the transcript
   there with it. Colour carries the verdict, so the sheet reads at a glance. */
function addJumpButtons(){
  const grades={};gradeListening().detail.forEach(function(d){grades[d.id]=d.status;});
  for(let i=1;i<=40;i++){
    const t=(typeof ANSWER_TIMES!=='undefined'&&ANSWER_TIMES[i]!=null)?ANSWER_TIMES[i]:null;
    if(t==null)continue;
    const row=document.getElementById('lq-row-'+i);
    const card=document.getElementById('lq-card-'+i);
    const target=row||(card?card.querySelector('.q-row'):null)||card;
    if(!target||target.querySelector('.q-jump-btn'))continue;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='q-jump-btn is-'+(grades[i]||'skipped')+(row?'':' q-jump-btn-inline');
    btn.textContent=tcLabel(t);
    btn.title='Question '+i+' is answered at '+tcLabel(t)+' — play from there';
    btn.setAttribute('aria-label','Play the recording from '+tcLabel(t)+', where question '+i+' is answered');
    btn.onclick=function(ev){ev.preventDefault();jumpToTime(t,{from:btn});};
    target.appendChild(btn);
  }
}

/* Seek to a moment and take the transcript with it.
   opts.runup — seconds of lead-in (12s by default, so the question is heard
   as well as the answer); the transcript's own lines jump exactly.
   opts.from  — the control that was pressed, flashed so the click is answered. */
function jumpToTime(t,opts){
  opts=opts||{};
  const audio=document.getElementById('exam-audio');
  const runup=opts.runup==null?12:opts.runup;
  const seek=Math.max(0,(+t||0)-runup);
  if(opts.from){
    const el=opts.from;
    el.classList.add('is-jumping');
    setTimeout(function(){el.classList.remove('is-jumping');},420);
  }
  // No audio (offline, or the stream never arrived) is not a dead end: the
  // transcript still travels to the moment, which is what was asked for.
  _tpIdx=-1;
  syncTranscriptPanel(seek);
  if(!audio)return;
  try{audio.currentTime=seek;}catch(e){}
  const p=audio.play();
  if(p&&p.catch)p.catch(function(){});
  setTimeout(function(){_tpIdx=-1;syncTranscriptPanel(audio.currentTime||seek);},80);
}


/* ── the sheet that replaces confirm() ─────────────────────────────────────
   Two questions in this app are destructive, and the browser answered both of
   them in a system dialog that lands before the shell has drawn a frame and
   states the stakes in the flattest possible way. This is the same glass the
   entrance is made of, and it says what "start fresh" actually destroys. */
function wipeSession(){
  // A declined resume must leave NOTHING of the previous attempt behind — not
  // the answers, not the flags, not the scratch notes the candidate typed into
  // the pencil panel, which live under their own key.
  try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
  try{localStorage.removeItem('cdi_listening_notes');}catch(e){}
  const ta=document.getElementById('notes-area');if(ta)ta.value='';
  document.body.classList.remove('no-select','review-mode','notes-open','cdi-exit');
}
function chSheet(o){
  const el=document.getElementById('ch-resume');
  if(!el){ // no sheet in the DOM: never trap the candidate, just take the safe path
    if(o.onGhost)o.onGhost();else if(o.onGo)o.onGo();
    return;
  }
  el.querySelector('.ch-sheet-eyebrow').textContent=o.eyebrow||'Unfinished session';
  el.querySelector('#ch-resume-title').textContent=o.title||'';
  el.querySelector('#ch-resume-body').textContent=o.body||'';
  const go=el.querySelector('#ch-resume-go'),gh=el.querySelector('#ch-resume-fresh');
  go.querySelector('span').textContent=o.goLabel||'Resume test';
  gh.textContent=o.ghostLabel||'Start fresh';
  // Some questions have only one honest answer. A second button that leads
  // nowhere would be furniture pretending to be a choice.
  gh.style.display=o.solo?'none':'';
  const close=()=>{el.classList.remove('show');go.onclick=null;gh.onclick=null;};
  go.onclick=()=>{close();if(o.onGo)o.onGo();};
  gh.onclick=()=>{close();if(o.onGhost)o.onGhost();};
  el.classList.add('show');
  // the prelude does not detonate behind a modal
  try{if(window.__cdiReveal)window.__cdiReveal();}catch(e){}
  setTimeout(()=>{try{go.focus({preventScroll:true});}catch(e){}},60);
}

// INIT
function freshStart(){
  /* The briefing and completion screens are gone: entry card -> paper -> score
     sheet -> review. The paper is built here but stays behind the entry card
     until beginTest() is called, so the clock cannot run before Start. */
  wipeSession();
  Object.assign(state,{student:{name:''},stage:'listening',startedAt:null,finishedAt:null,listeningAnswers:{},listeningFlags:{},annotations:{1:[],2:[],3:[],4:[]},timers:{listening:40*60},currentSection:1,activeQuestion:null,timerHidden:false,warnings:0});
  document.body.classList.remove('cdi-booting','cdi-exit','review-mode','tp-active');
  goToStage('listening');
  renderListening();
  try{updateListeningNav();}catch(e){}
}
/* Called by the entry card once the candidate has a name and the recording has
   buffered. The click that got here is the user gesture the audio needs, so
   playback is attempted directly; the play gate is the fallback, not the rule. */
function beginTest(name){
  state.student.name=(name||'').trim();
  state.startedAt=new Date().toISOString();
  saveState();updateHeaderName(state.student.name);
  document.body.classList.remove('pre-entry');
  document.body.classList.add('entry-done','no-select');
  goToStage('listening');
  startTimer('listening',function(){toast('Time is up — well done!','success');finishExam();});
  startLockedAudio();
  try{startGatedAudio();}catch(e){}
}
function init(){
  setupAntiCheat();setupHighlighter();
  const savedTheme=localStorage.getItem('cdi_reading_theme')||'light';setTheme(savedTheme);
  applyBrandLogo();
  // TEST HARNESS: ?test=1&stage=<name>&part=<1-4> boots straight to a stage for visual QA.
  // Skips the resume sheet, fullscreen and proctoring so screenshots are deterministic.
  if(TEST_MODE){
    const p=new URLSearchParams(location.search);
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(state,{student:{name:p.get('name')||'Test Candidate'},stage:'registration',startedAt:Date.now(),finishedAt:null,listeningAnswers:{},listeningFlags:{},annotations:{1:[],2:[],3:[],4:[]},timers:{listening:40*60},currentSection:+(p.get('part')||1),activeQuestion:null,timerHidden:false,warnings:0});
    updateHeaderName(state.student.name);
    const st=p.get('stage')||'registration';
    renderListening();
    if(st==='results'){renderResults();}
    goToStage(st);
    if(st==='listening'){jumpToListeningPart(+(p.get('part')||1));updateListeningNav();if(p.has('gate'))startLockedAudio();}
    return;
  }
  const restored=loadState();
  // A reload ends the sitting. There is no picking a paper back up: the page
  // returns, says plainly what that cost, and opens the test again from the
  // beginning. Nothing is erased until the candidate acknowledges it, so
  // closing the tab on this sheet leaves the save exactly where it was.
  /* listening resume sheet: a reload restarts the paper */
  
  freshStart();
}
document.addEventListener('DOMContentLoaded',init);

return{validateStart,beginListening,beginTest,renderResults,finishExam,jumpToListening,jumpToListeningPart,prevSection,nextSection,toggleFlag,onListeningInput,setDragAnswer,applyHighlight,clearHighlight,addNote,openNote,saveNote,deleteNote,closeNote,toggleAnnoDrawer,jumpToNote,deleteNoteAt,renderNotesDrawer,setVolume,setPlaybackRate,seekAudio,togglePlayPause,dismissWarning,unlockResults,resetExam,reviewExam,confirmSubmit,backToResults,printReport,downloadReport,setTheme,zoomText,toggleFullscreen,toggleTimer,updateListeningNav,jumpToTime,startGatedAudio};
})();

// ── DRAG MATCH (pointer-based, robust) ──
let _dm=null; // {chip, ghost, ox, oy, home, lastOver}
function dmReturnHint(drop){
  if(drop.querySelector('.drag-num-hint'))return;
  const hint=document.createElement('span');hint.className='drag-num-hint';hint.textContent=drop.dataset.q;
  drop.appendChild(hint);
}
function dmClearDrop(drop){
  if(!drop)return;
  drop.classList.remove('dm-filled');
  dmReturnHint(drop);
  if(drop.dataset.q)ExamApp.setDragAnswer(drop.dataset.q,'');
}
function dmPlace(chip,drop){
  const oldDrop=chip.closest('.drag-drop');
  if(oldDrop&&oldDrop!==drop)dmClearDrop(oldDrop);
  const existing=drop.querySelector('.drag-chip');
  if(existing&&existing!==chip){
    if(existing.classList.contains('dm-reuse-chip')){existing.remove();}
    else{const pool=document.getElementById(existing.dataset.pool);if(pool)pool.appendChild(existing);}
  }
  drop.querySelectorAll('.drag-num-hint').forEach(h=>h.remove());
  drop.appendChild(chip);
  drop.classList.add('dm-filled');
  ExamApp.setDragAnswer(drop.dataset.q,chip.dataset.val);
}
function dmToPool(chip){
  const oldDrop=chip.closest('.drag-drop');
  if(oldDrop)dmClearDrop(oldDrop);
  if(chip.classList.contains('dm-reuse-chip')){chip.remove();return;}
  const pool=document.getElementById(chip.dataset.pool);
  if(pool)pool.appendChild(chip);
}
function dmDown(e){
  if(document.body.classList.contains('review-mode'))return;
  let chip=e.target.closest('.drag-chip');
  if(!chip)return;
  e.preventDefault();
  const r=chip.getBoundingClientRect();
  const srcPool=chip.closest('.drag-pool');
  if(srcPool&&srcPool.dataset.reuse){const cl=chip.cloneNode(true);cl.classList.add('dm-reuse-chip');chip=cl;}
  const ghost=chip.cloneNode(true);
  ghost.classList.add('dm-ghost');
  ghost.style.width=r.width+'px';ghost.style.height=r.height+'px';
  ghost.style.left=r.left+'px';ghost.style.top=r.top+'px';
  document.body.appendChild(ghost);
  chip.classList.add('dm-dragging');
  document.body.classList.add('dm-active');
  _dm={chip,ghost,ox:e.clientX-r.left,oy:e.clientY-r.top,lastOver:null};
  window.addEventListener('pointermove',dmMove);
  window.addEventListener('pointerup',dmUp);
}
function dmMove(e){
  if(!_dm)return;
  _dm.ghost.style.left=(e.clientX-_dm.ox)+'px';
  _dm.ghost.style.top=(e.clientY-_dm.oy)+'px';
  _dm.ghost.style.display='none';
  const el=document.elementFromPoint(e.clientX,e.clientY);
  _dm.ghost.style.display='';
  const drop=el?el.closest('.drag-drop'):null;
  if(_dm.lastOver&&_dm.lastOver!==drop)_dm.lastOver.classList.remove('dm-over');
  if(drop)drop.classList.add('dm-over');
  _dm.lastOver=drop;
}
function dmUp(e){
  if(!_dm)return;
  window.removeEventListener('pointermove',dmMove);
  window.removeEventListener('pointerup',dmUp);
  const el=(_dm.ghost.style.display='none',document.elementFromPoint(e.clientX,e.clientY));
  const drop=el?el.closest('.drag-drop'):null;
  const pool=el?el.closest('.drag-pool'):null;
  if(_dm.lastOver)_dm.lastOver.classList.remove('dm-over');
  if(drop){dmPlace(_dm.chip,drop);}
  else if(pool){dmToPool(_dm.chip);}
  // else: no valid target → leave chip where it was (snap back)
  _dm.chip.classList.remove('dm-dragging');
  _dm.ghost.remove();
  document.body.classList.remove('dm-active');
  _dm=null;
}
// delegate pointerdown for all current/future chips
document.addEventListener('pointerdown',dmDown);
(function(){
  function boot(){try{LSN.buildNotes();LSN.restorePrefs();}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);});
  else setTimeout(boot,0);
})();
function dmRestore(qid,val){
  const drop=document.getElementById('drop-'+qid);
  if(!drop)return;
  let chip=null;
  const tmpl=document.querySelector('.drag-pool[data-reuse] [data-val="'+CSS.escape(val)+'"]');
  if(tmpl){chip=tmpl.cloneNode(true);chip.classList.add('dm-reuse-chip');}
  else{chip=document.querySelector('[data-pool][data-val="'+CSS.escape(val)+'"]');}
  if(!chip)return;
  drop.querySelectorAll('.drag-num-hint').forEach(h=>h.remove());
  drop.appendChild(chip);drop.classList.add('dm-filled');
  const inp=document.getElementById('lq-'+qid);if(inp)inp.value=val;
}
