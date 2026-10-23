/*
 * IELTSX — Full Tests catalog (assets/js/full-tests-data.js)
 *
 * This is the ONE place that describes the Full Listening / Reading / Writing /
 * Speaking pages: which packs exist, which section ("Recent Exams", "Practice" …)
 * they sit in, and which tests are inside each pack.
 *
 * ADD A PACK   -> add an object to  packs.<skill>  and put its slug in a group.
 * ADD A TEST   -> add an object to  tests  of that pack:
 *                    { source: 'Original Exams | Test 4', tags: ['Gap Filling'], href: '/full-tests/reading/test-5', premium: true }
 *                 The title ("Test 1", "Test 2" …) is numbered automatically.
<<<<<<< HEAD
=======
 * WHO CAN OPEN IT -> `premium: true` = locked (any paid plan), `premium: false` = free. Add `minPlan: 'max'` to require the Max plan.
 *                 The admin panel (Access) overrides all of this per pack and per test, no code needed.
>>>>>>> fb33267 (Initial commit)
 * NO CODE?     -> tests added in the Admin panel (Reading / Listening / Writing) show up here by themselves:
 *                 type the pack name in the admin form ("Pack 5", "Volume 9" …). A pack name that does not
 *                 exist yet gets its own card under "Practice".
 *
 * Pack pages live at  /full-tests/<skill>/<slug>   e.g. /full-tests/reading/pack-5
 */
(function () {
    'use strict';

    var SKILLS = {
        listening: {
            title: 'Listening Full Tests', crumb: 'Listening Full Tests', word: 'Listening', color: 'amber',
            subtitle: 'Complete IELTS Listening tests with 4 sections and 40 questions',
            icon: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>'
        },
        reading: {
            title: 'Reading Full Tests', crumb: 'Reading Full Tests', word: 'Reading', color: 'emerald',
            subtitle: 'Complete IELTS Reading tests with 3 passages and 40 questions',
            icon: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'
        },
        writing: {
            title: 'Writing Full Tests', crumb: 'Writing Full Tests', word: 'Writing', color: 'blue', sourcePrefix: 'Source: ',
            subtitle: 'Complete IELTS Writing tests with Task 1 and Task 2',
            icon: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>'
        },
        speaking: {
            title: 'Speaking Full Tests', crumb: 'Speaking Full Tests', word: 'Speaking', color: 'rose',
            subtitle: 'Complete IELTS Speaking tests with Parts 1, 2 and 3',
            icon: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>'
        }
    };

    var DESC = 'Practice tests to improve your skills';

    /* sections of each listing page, in order. "packs" are slugs from the lists below */
    var GROUPS = {
        reading: [
            { title: 'Recent Exams', packs: ['pack-4', 'pack-5', 'pack-6', 'volume-8', 'volume-9'] },
            { title: 'Practice', packs: ['pack-1', 'pack-2', 'pack-3'] }
        ],
        listening: [
            { title: 'Recent Exams', packs: ['pack-5', 'pack-6'] },
            { title: 'Practice', packs: ['pack-1', 'pack-2', 'pack-3'] }
        ],
        writing: [
            { title: 'Focus Writing', packs: ['09_02-16_02'] }
        ],
        speaking: [
            { title: 'Speaking Topics', packs: ['jan-august', 'sep-dec'] }
        ]
    };

    var PACKS = {
        reading: [
            { slug: 'pack-4', title: 'Pack 4', tier: 'Tier 3', plan: 'MAX', premium: true, tests: [] },
            { slug: 'pack-5', title: 'Pack 5', tier: 'Tier 3', plan: 'MAX', premium: true, tests: [
                { source: 'Full Reading Test 11', tags: ['Matching Headings', 'True False Not Given', 'Summary Completion'], href: '/full-tests/reading/test-3', premium: true },
                { source: 'Full Reading Test 14', tags: ['Multiple Choice', 'Matching Information', 'Sentence Completion'], href: '/full-tests/reading/test-4', premium: true }
            ] },
            { slug: 'pack-6', title: 'Pack 6', tier: 'Tier 3', plan: 'MAX', premium: true, tests: [] },
            { slug: 'volume-8', title: 'Volume 8', tier: 'Tier 2', plan: 'MAX', premium: true, tests: [
                { source: 'Full Reading Test 8', tags: ['True False Not Given', 'Matching Headings', 'Sentence Completion'], href: '/full-tests/reading/test-1', premium: true }
            ] },
            { slug: 'volume-9', title: 'Volume 9', tier: 'Tier 2', plan: 'MAX', premium: true, tests: [
                { source: 'Full Reading Test 9', tags: ['Matching Information', 'Multiple Choice', 'Summary Completion'], href: '/full-tests/reading/test-2', premium: true }
            ] },
            { slug: 'pack-1', title: 'Pack 1', tier: 'Tier 1', plan: 'MAX', premium: true, tests: [
                { source: 'Full Reading Test 9', tags: ['Matching Information', 'Multiple Choice', 'Summary Completion'], href: '/full-tests/reading/test-5', premium: true },
                { source: 'Full Reading Test 11', tags: ['Matching Headings', 'True False Not Given', 'Summary Completion'], href: '/full-tests/reading/test-6', premium: true }
            ] },
            { slug: 'pack-2', title: 'Pack 2', tier: 'Tier 1', plan: 'MAX', premium: true, tests: [] },
            { slug: 'pack-3', title: 'Pack 3', tier: 'Tier 1', plan: 'MAX', premium: true, tests: [] }
        ],
        listening: [
            { slug: 'pack-5', title: 'Pack 5', tier: 'Tier 3', premium: true, tests: [
                { source: 'Listening Test 7', tags: ['Gap Filling', 'Multiple Choice', 'Map Labeling'], href: '/full-tests/listening/test-1', premium: true }
            ] },
            { slug: 'pack-6', title: 'Pack 6', tier: 'Tier 3', premium: true, tests: [] },
            { slug: 'pack-1', title: 'Pack 1', tier: 'Tier 1', premium: true, tests: [] },
            { slug: 'pack-2', title: 'Pack 2', tier: 'Tier 1', premium: true, tests: [] },
            { slug: 'pack-3', title: 'Pack 3', tier: 'Tier 1', premium: true, tests: [] }
        ],
        writing: [
            { slug: '09_02-16_02', title: '09_02-16_02', tier: 'Tier 1', plan: 'MAX', premium: true, tests: [
                { number: 9, source: 'Focus Writing 09.02 - 16.02', tags: ['Agree Disagree', 'Line Graph'], href: '/part/practice/writing', premium: true },
                { number: 8, source: 'Focus Writing 09.02 - 16.02', tags: ['Agree Disagree', 'Bar Chart'], href: '/part/practice/writing', premium: true },
                { number: 7, source: 'Focus Writing 09.02 - 16.02', tags: ['Two Part', 'Table'], href: '/part/practice/writing', premium: true },
                { number: 6, source: 'Focus Writing 09.02 - 16.02', tags: ['Discussion', 'Bar Chart'], href: '/part/practice/writing', premium: true },
                { number: 5, source: 'Focus Writing 09.02 - 16.02', tags: ['Agree Disagree', 'Pie Chart'], href: '/part/practice/writing', premium: true },
                { number: 4, source: 'Focus Writing 09.02 - 16.02', tags: ['Agree Disagree', 'Map'], href: '/part/practice/writing', premium: true }
            ] }
        ],
        speaking: [
            { slug: 'jan-august', title: 'Jan-August', tier: 'Tier 3', plan: 'MAX', premium: true, tests: [
                { number: 23, source: 'Speaking Parts 1, 2 & 3', tags: ['Health', 'Lifestyle', 'Wellness'], href: '/part/practice/speaking', premium: true },
                { number: 19, source: 'Speaking Parts 1, 2 & 3', tags: ['Environment Nature', 'Urban Life Places'], href: '/part/practice/speaking', premium: true },
                { number: 16, source: 'Speaking Parts 1, 2 & 3', tags: ['Education Work', 'Media Entertainment Creativity'], href: '/part/practice/speaking', premium: true }
            ] },
            { slug: 'sep-dec', title: 'Sep-Dec', tier: 'Tier 2', plan: 'MAX', premium: true, tests: [
                { number: 24, source: 'Speaking Parts 1, 2 & 3', tags: ['Technology', 'Communication', 'Relationships'], href: '/part/practice/speaking', premium: true },
                { number: 22, source: 'Speaking Parts 1, 2 & 3', tags: ['Travel', 'Culture', 'Adventure'], href: '/part/practice/speaking', premium: true },
                { number: 21, source: 'Speaking Parts 1, 2 & 3', tags: ['Technology', 'Education', 'Daily Life'], href: '/part/practice/speaking', premium: true }
            ] }
        ]
    };

    window.IELTSX_FULL_TESTS = { skills: SKILLS, groups: GROUPS, packs: PACKS, description: DESC };
})();
