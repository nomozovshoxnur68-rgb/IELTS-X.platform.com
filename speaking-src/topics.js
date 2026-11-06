'use strict';
/*
 * Built-in Speaking tests: six topics, each as three Part practice cards (one part each) and one Full test (Parts 1-3).
 * The questions were written for IELTSX in the style of the exam.
 *
 * They are not pages. The server adds each of them ONCE to the admin panel as an ordinary test (seedBuiltinTests() in
 * server.js). From then on the copy in the admin panel IS the test: edit, lock, hide or remove it there. Changing this
 * file later does not change that copy, and a test removed in the panel is not added again.
 *
 *   free  the three Part cards of this topic are open to everybody (a topic's Full test always needs a plan)
 *   key   of a LIST entry: never change it (it is how the server knows the test was added)
 */
const PART1 = 'Part 1 · Introduction and interview';
const PART2 = 'Part 2 · Long turn (cue card)';
const PART3 = 'Part 3 · Discussion';
const cue = (topic, points, end) => `${topic}.\nYou should say:\n${points.map((p) => '- ' + p).join('\n')}\nand explain ${end}.`;

const TOPICS = [
  { no: 19, pack: 'Jan-August', free: true, tags: ['Environment Nature', 'Urban Life Places'], name: 'Environment and places',
    p1: { title: 'Museum', qs: ['Do you like visiting museums? Why or why not?', 'What kind of museum is most popular in your country?', 'When did you last go to a museum?', 'Did you go to museums when you were a child?', 'Do you think museums should be free for everyone?'] },
    p2: { title: 'Describe a person who encouraged you to protect the nature', prompt: cue('Describe a person who encouraged you to protect nature', ['who this person is', 'how you know this person', 'what this person told you or showed you'], 'how this person changed the way you treat nature') },
    p3: { title: 'Environmental protection', qs: ['Why do some people not care about the environment?', 'What can ordinary families do to reduce their waste?', 'Should governments or companies be more responsible for protecting nature?', 'How can schools teach children to respect the environment?', 'Do you think cities will become greener in the future? Why?'] } },
  { no: 16, pack: 'Jan-August', tags: ['Education Work', 'Media Entertainment Creativity'], name: 'Work and films',
    p1: { title: 'Work/study', qs: ['Do you work or are you a student?', 'What do you like most about your work or studies?', 'What is the most difficult part of your day?', 'Would you like to change your job or subject in the future?', 'Do you prefer working alone or with other people?'] },
    p2: { title: 'Describe a film you watched and enjoyed', prompt: cue('Describe a film you watched and enjoyed', ['what the film was', 'when and where you watched it', 'what it was about'], 'why you enjoyed it') },
    p3: { title: 'Films', qs: ['Why do people enjoy watching films?', 'Do you think cinemas will disappear because of streaming services?', 'What can young people learn from films?', 'Should films that are based on real events be completely accurate?', 'How have films changed since your parents were young?'] } },
  { no: 21, pack: 'Sep-Dec', tags: ['Technology', 'Education', 'Daily Life'], name: 'Technology in daily life',
    p1: { title: 'Smartphones', qs: ['How often do you use your smartphone?', 'What do you use your phone for most?', 'Have you ever lost your phone? What happened?', 'Do you think people spend too much time on their phones?', 'At what age should children have their own phone?'] },
    p2: { title: 'Describe a useful app you use', prompt: cue('Describe a useful app you use', ['what the app is', 'how you found it', 'how often you use it and what you use it for'], 'why it is useful to you') },
    p3: { title: 'Technology in education', qs: ['How has technology changed the way students learn?', 'Can online lessons ever be as good as lessons in a classroom?', 'Do students depend too much on the internet for answers?', 'What skills should teachers have in the age of artificial intelligence?', 'Will schools still exist in fifty years? Why or why not?'] } },
  { no: 22, pack: 'Sep-Dec', tags: ['Travel', 'Culture', 'Adventure'], name: 'Travel and holidays',
    p1: { title: 'Holidays', qs: ['What do you usually do during the holidays?', 'Do you prefer to spend your holidays at home or away?', 'Who do you like to go on holiday with?', 'What was your favourite holiday as a child?', 'Do you plan your holidays carefully or decide at the last minute?'] },
    p2: { title: 'Describe a memorable trip', prompt: cue('Describe a memorable trip you have taken', ['where you went', 'who you went with', 'what you did there'], 'why this trip was so memorable') },
    p3: { title: 'Travel and tourism', qs: ['Why do people like to travel to other countries?', 'What are the benefits of tourism for a local community?', 'Can tourism damage a place? In what ways?', 'How is travelling today different from travelling in the past?', 'Do you think virtual tours could replace real travel?'] } },
  { no: 23, pack: 'Jan-August', tags: ['Health', 'Lifestyle', 'Wellness'], name: 'Health and lifestyle',
    p1: { title: 'Exercise', qs: ['Do you do any exercise?', 'What kind of exercise did you do when you were younger?', 'Do you prefer exercising indoors or outdoors?', 'Is it easy to find a place to exercise where you live?', 'What would make you exercise more often?'] },
    p2: { title: 'Describe a healthy habit', prompt: cue('Describe a healthy habit you have', ['what the habit is', 'when you started it', 'how you keep doing it'], 'how it has helped you') },
    p3: { title: 'Health and fitness', qs: ['Why do so many people find it hard to live a healthy life?', 'Should governments control unhealthy food and drinks?', 'Are people healthier today than they were fifty years ago?', 'How can workplaces help their employees stay healthy?', 'What is more important for health: diet or exercise?'] } },
  { no: 24, pack: 'Sep-Dec', tags: ['Technology', 'Communication', 'Relationships'], name: 'Social media and friendship',
    p1: { title: 'Online friendships', qs: ['Do you have any friends you know only online?', 'How do you usually keep in touch with your friends?', 'Is it easy to make friends on the internet?', 'Do you prefer talking to friends online or face to face?', 'Have you ever met an online friend in person?'] },
    p2: { title: 'Describe a social media platform', prompt: cue('Describe a social media platform you often use', ['what the platform is', 'how long you have used it', 'what you usually do on it'], 'whether you think it has a good or bad effect on you') },
    p3: { title: 'Social media', qs: ['How has social media changed the way people communicate?', 'Why do some people share so much about their private lives online?', 'Should there be an age limit for using social media?', 'Can information on social media be trusted?', 'Do you think people will use social media less in the future?'] } }
];

const part1 = (t) => ({ title: PART1, prompt: `Let's talk about: ${t.p1.title}.`, questions: t.p1.qs, prepSeconds: 0, speakSeconds: 0 });
const part2 = (t) => ({ title: PART2, prompt: t.p2.prompt, questions: [], prepSeconds: 60, speakSeconds: 120 });
const part3 = (t) => ({ title: PART3, prompt: `Let's discuss: ${t.p3.title}.`, questions: t.p3.qs, prepSeconds: 0, speakSeconds: 0 });

// the order of the cards on the page, newest first: the Part cards of each topic P3, P2, P1
const LIST = [];
TOPICS.forEach((t) => {
  LIST.push({ key: `t${t.no}-p3`, mode: 'part', title: `Topic ${t.no} - P3: ${t.p3.title}`, pack: t.pack, free: !!t.free, tags: t.tags, parts: [part3(t)] });
  LIST.push({ key: `t${t.no}-p2`, mode: 'part', title: `Topic ${t.no} - P2: ${t.p2.title}`, pack: t.pack, free: !!t.free, tags: t.tags, parts: [part2(t)] });
  LIST.push({ key: `t${t.no}-p1`, mode: 'part', title: `Topic ${t.no} - P1: ${t.p1.title}`, pack: t.pack, free: !!t.free, tags: t.tags, parts: [part1(t)] });
});
TOPICS.forEach((t) => LIST.push({ key: `t${t.no}-full`, mode: 'full', title: `Topic ${t.no}: ${t.name}`, pack: t.pack, free: false, tags: t.tags, parts: [part1(t), part2(t), part3(t)] }));

/* one entry -> the test as the admin panel saves it (POST /api/admin/materials) */
function toMaterial(x) {
  return { type: 'speaking', title: x.title, pack: x.pack, description: '', premium: !x.free, published: true, data: { mode: x.mode, cardTypes: x.tags, parts: x.parts } };
}

module.exports = { LIST, toMaterial, TOPICS };
