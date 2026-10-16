import {j as e, u as t, b as s, a as r} from "./query-DsA5-mxg.js";
import {R as n, a as o} from "./router-gAN6ztYq.js";
import {y as a, x as i, R as c, r as u, aN as l, a5 as p, aO as d} from "./index-HS6_bSfL.js";
import {o as h, p as m, q as g, r as f} from "./usePracticeTests-CoVQL7Sl.js";
const N = t => t.split(/(\*\*.*?\*\*)/g).map( (t, s) => t.startsWith("**") && t.endsWith("**") ? e.jsx("strong", {
    children: t.substring(2, t.length - 2)
}, s) : e.jsx(n.Fragment, {
    children: t
}, s))
  , T = e => /\*\*[A-Z][^*]*\*\*/.test(e) ? e : e.replace(/(\b[A-Z](?:\s*[-–]\s*[A-Z]|\s*,\s*[A-Z](?:\s*,\s*[A-Z])*(?:\s+or\s+[A-Z])?)\b)/, "**$1**")
  , I = e => {
    let t = e.trim();
    t = t.replace(/\bperson or people\b/i, "person"),
    t = t.replace(/\bpeople\b/i, "person");
    const s = t.split(/\s+/);
    return 0 === s.length ? t : (s[s.length - 1] = (e => {
        const t = e.toLowerCase()
          , s = {
            people: "person",
            men: "man",
            women: "woman",
            children: "child",
            feet: "foot",
            teeth: "tooth",
            geese: "goose",
            mice: "mouse",
            oxen: "ox"
        };
        return s[t] ? s[t] : /ies$/i.test(e) && t.length > 3 ? e.slice(0, -3) + "y" : !/ses$/i.test(e) || /ies|ees|oes$/i.test(e) || ["species", "series"].includes(t) ? /s$/i.test(e) && !/ss$/i.test(e) && t.length > 1 ? e.slice(0, -1) : e : e.slice(0, -2)
    }
    )(s[s.length - 1]),
    s.join(" "))
}
  , y = (e, t, s, r) => {
    const n = (e => {
        if ("string" != typeof e)
            return "";
        const t = e.trim();
        return t ? t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]") ? "" : t : ""
    }
    )(t)
      , o = s ? " from the text" : ""
      , a = {
        NOTE_COMPLETION: `Complete the notes. Write **{instruction}**${o} for each answer.`,
        FORM_COMPLETION: `Complete the form. Write **{instruction}**${o} for each answer.`,
        TABLE_COMPLETION: `Complete the table. Write **{instruction}**${o} for each answer.`,
        SUMMARY_COMPLETION: `Complete the summary. Write **{instruction}**${o} for each answer.`,
        SUMMARY_COMPLETION_OPTIONS: "Complete the summary using the list of words. Choose the correct answer and move it into the gap.",
        SENTENCE_COMPLETION: `Complete the sentences. Write **{instruction}**${o} for each answer.`,
        DIAGRAM_COMPLETION: `Complete the diagram. Write **{instruction}**${o} for each answer.`,
        SHORT_ANSWER_COMPLETION: `Answer the questions. Write **{instruction}**${o} for each answer.`,
        FLOW_CHART_COMPLETION: `Complete the flow-chart. Write **{instruction}**${o} for each answer.`,
        MULTIPLE_CHOICE: "Choose the correct answer.",
        MULTIPLE_CHOICE_MANY: "Choose **{instruction}** correct answers.",
        TRUE_FALSE_NOT_GIVEN: "Choose **TRUE** if the statement agrees with the information given in the text, choose **FALSE** if the statement contradicts the information, or choose **NOT GIVEN** if there is no information on this.",
        YES_NO_NOT_GIVEN: "Choose **YES** if the statement agrees with the information given in the text, choose **NO** if the statement contradicts the information, or choose **NOT GIVEN** if there is no information on this.",
        MATCHING: "{instruction} Choose the correct answer and move it into the gap.",
        MATCHING_NAMES: "{instruction} Choose the correct answer and move it into the gap.",
        MATCHING_FEATURES: "__MATCHING_FEATURES__",
        MATCHING_SENTENCE_ENDINGS: "Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.",
        MATCHING_HEADINGS: "{instruction}Choose the correct heading for each section and move it into the gap.",
        MATCHING_INFORMATION: "{instruction}Which paragraph contains the following information?",
        DIAGRAM_LABELING: "Label the map. Choose the correct letter, **{instruction}**, for each label.",
        FLOW_CHART_MATCHING: "Complete the flow-chart. Choose the correct answer and move it into the gap.",
        GAP_FILLING: `Fill in the gaps in the text. Write **{instruction}**${o} for each answer.`
    }[e] || "";
    if (!a)
        return n;
    const i = e => {
        if (!e?.content)
            return "A–H";
        const t = e.content;
        if (t.options && Array.isArray(t.options)) {
            const e = t.options.length;
            return `A–${String.fromCharCode(65 + e - 1)}`
        }
        if (t.headings && Array.isArray(t.headings)) {
            const e = t.headings.length;
            return `A–${String.fromCharCode(65 + e - 1)}`
        }
        if (t.features && Array.isArray(t.features)) {
            const e = t.features[0]?.id
              , s = t.features[t.features.length - 1]?.id;
            if (e && s)
                return `${e}–${s}`;
            const r = t.features.length;
            return `A–${String.fromCharCode(65 + r - 1)}`
        }
        if (t.labels && Array.isArray(t.labels)) {
            const e = t.labels[0]
              , s = t.labels[t.labels.length - 1];
            if (e && s)
                return `${e}–${s}`;
            const r = t.labels.length;
            return `A–${String.fromCharCode(65 + r - 1)}`
        }
        return "A–H"
    }
    ;
    if (["TRUE_FALSE_NOT_GIVEN", "YES_NO_NOT_GIVEN", "MULTIPLE_CHOICE", "SUMMARY_COMPLETION_OPTIONS", "MATCHING_SENTENCE_ENDINGS", "FLOW_CHART_MATCHING"].includes(e))
        return a;
    if ("MULTIPLE_CHOICE_MANY" === e) {
        const e = r?.content
          , t = e?.answersToChoose || 2
          , s = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"][t] || t.toString();
        return a.replace("{instruction}", s)
    }
    if ("MATCHING_HEADINGS" === e) {
        const e = r?.content
          , t = e?.questions?.length || 4
          , s = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][t] || t.toString();
        return a.replace("{instruction}", `The text has ${s} sections. `)
    }
    if ("MATCHING_INFORMATION" === e) {
        const e = r?.content
          , t = e.labels.length || 8
          , s = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][t] || t.toString()
          , o = i(r)
          , c = a.replace("{instruction}", `The text has ${s} paragraphs, **${o}**. `)
          , u = n.match(/(?:You may|You can)[^.]*\./i)?.[0]?.trim();
        return u ? `${c} ${u}` : c
    }
    if (["DIAGRAM_LABELING"].includes(e) && (!n || n.match(/^[A-Z]–[A-Z]$/))) {
        const e = i(r);
        return a.replace("{instruction}", e)
    }
    if ("MATCHING_FEATURES" === e) {
        return ( (e, t) => {
            if (!e)
                return `Choose the correct option, **${t}**, for each item.`;
            const s = e.match(/(?:You may|You can)[^.]*\./i)
              , r = s?.[0]?.trim()
              , n = r ? e.replace(r, "").replace(/\s+/g, " ").trim() : e
              , o = n.match(/Match each ([\w\s]+?) with the correct (.+?),\s*([A-Z][^.\n]*?)(?:\.|$)/i);
            if (o) {
                const [,e,t,s] = o
                  , n = s.trim().replace(/[.,]$/, "");
                let a = `Choose the correct ${I(t)}, **${n}**, for each ${e.trim()}.`;
                return r && (a += ` ${r}`),
                a
            }
            if (/^Choose the correct .+?, .+?, for each .+?\./i.test(n)) {
                const e = n.match(/^Choose the correct (.+?), (.+?), for each (.+?)\./i);
                if (e) {
                    const [,t,s,n] = e;
                    let o = `Choose the correct ${I(t)}, **${s.replace(/^\*\*|\*\*$/g, "")}**, for each ${n}.`;
                    return r && !o.includes(r) && (o += ` ${r}`),
                    o
                }
                let t = T(n);
                return r && !t.includes(r) && (t += ` ${r}`),
                t
            }
            if (e.split(/\s+/).length <= 3) {
                let e = `Choose the correct option, **${t}**, for each item.`;
                return r && (e += ` ${r}`),
                e
            }
            return T(e)
        }
        )(n, i(r))
    }
    return n ? n.length > 110 || n.includes("Write") || n.includes("for each answer") || n.includes("answers from the box") ? n : "MATCHING" === e || "MATCHING_NAMES" === e ? a.replace("{instruction}", n) : a.startsWith("{instruction}") && !n.match(/^(ONE WORD ONLY|TWO WORDS|THREE WORDS|NO MORE THAN \w+ WORDS?|ONE|TWO|THREE|FOUR|FIVE|[A-Z]–[A-Z])$/i) ? a.replace("{instruction}", `${n.toUpperCase()} `) : a.replace("{instruction}", n) : a.replace(/{instruction}/g, "").replace(/\s+/g, " ").trim()
}
  , b = ({questionGroup: t, showContentTitle: s=!0}) => {
    const r = y(t.type, t.instruction, !!t.passageId, t);
    return e.jsxs("div", {
        className: "space-y-2",
        children: [e.jsxs("h5", {
            className: "font-semibold",
            children: ["Questions ", t.from, "–", t.to]
        }), r && e.jsx("p", {
            children: N(r)
        })]
    })
}
  , E = o.createContext(void 0)
  , w = () => {
    const e = o.useContext(E);
    if (!e)
        throw new Error("useHighlight must be used within HighlightProvider");
    return e
}
  , A = ({children: t}) => {
    const [s,r] = o.useState([])
      , [n,a] = o.useState({
        visible: !1,
        regionId: null,
        segmentId: null,
        x: 0,
        y: 0,
        currentNote: ""
    })
      , i = o.useRef(new Set)
      , c = o.useCallback( (e, t, s, n, o) => {
        const a = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return r(r => [...r, {
            id: a,
            regionId: e,
            startOffset: t,
            endOffset: s,
            text: n,
            color: "#820747",
            note: o
        }]),
        a
    }
    , [])
      , u = o.useCallback(e => {
        r(t => t.filter(t => t.id !== e))
    }
    , [])
      , l = o.useCallback( (e, t) => {
        r(s => s.map(s => s.id === e ? {
            ...s,
            note: t.trim() || void 0
        } : s))
    }
    , [])
      , p = o.useCallback( () => {
        const e = window.getSelection();
        e && e.removeAllRanges()
    }
    , [])
      , d = o.useCallback( () => {
        i.current.forEach(e => e())
    }
    , [])
      , h = o.useCallback(e => (i.current.add(e),
    () => {
        i.current.delete(e)
    }
    ), [])
      , m = o.useCallback( (e, t, r) => {
        const n = s.find(s => s.regionId === e && s.id === t);
        n && l(n.id, r)
    }
    , [s, l])
      , g = {
        highlights: s,
        addHighlight: c,
        removeHighlight: u,
        updateNote: l,
        clearSelection: p,
        closeAllMenus: d,
        registerMenuCloser: h,
        noteEditor: n,
        setNoteEditor: a,
        updateSegmentNote: m
    };
    return e.jsx(E.Provider, {
        value: g,
        children: t
    })
}
  , C = () => {
    const {examLayout: e} = a()
      , {userPlan: t} = i()
      , s = c(t)
      , r = s ? "ieltsx" === e ? "ieltsx" : "inspera" === e ? "inspera" : "ieltsx" : "ieltsx";
    return {
        layout: r,
        useIELTSXLayout: "ieltsx" === r,
        useInsperaLayout: "inspera" === r,
        examLayout: e,
        canChangeStyle: s
    }
}
;
const S = e => e.trim().split(/\s+/).filter(e => e.length > 0).length
  , O = e => {
    for (let t = 1; t <= 4; t++) {
        const s = e[`part${t}`];
        if (Array.isArray(s) && s.length > 0)
            return t
    }
    return 1
}
  , _ = e => {
    for (let t = 1; t <= 3; t++) {
        const s = e[`part${t}`];
        if (s && s.question && s.question.length > 0)
            return t
    }
    return 1
}
  , $ = (e=[]) => {
    const t = [];
    for (const s of e) {
        const e = s.fromNumber
          , r = s.toNumber;
        if (void 0 !== e && void 0 !== r)
            if ("MULTIPLE_CHOICE_MANY" === s.questionType && s.content?.answersToChoose) {
                const n = s.content.answersToChoose;
                for (let s = e; s < r; s += n) {
                    const e = [];
                    for (let t = s; t < s + n && t <= r; t++)
                        e.push(t.toString());
                    t.push(e.join("-"))
                }
            } else
                for (let s = e; s <= r; s++)
                    t.push(s.toString())
    }
    return t
}
  , L = [{
    partNumber: 1,
    totalQuestions: 13,
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]
}, {
    partNumber: 2,
    totalQuestions: 13,
    numbers: ["14", "15", "16", "17", "18, 19", "20, 21", "22, 23", "24", "25", "26"]
}, {
    partNumber: 3,
    totalQuestions: 14,
    numbers: ["27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"]
}]
  , q = {
    1: 15,
    2: 20,
    3: 30
}
  , M = (e, t=[]) => {
    if ("FULL" === (e || "FULL").toUpperCase())
        return 60;
    const s = t.map(e => e.passageNumber).filter(e => "number" == typeof e && !isNaN(e)).sort( (e, t) => e - t)[0] ?? 1;
    return q[s] ?? 20
}
  , R = e => {
    const t = h(e)
      , s = m(e)
      , n = g(e)
      , o = t.isSuccess && s.isSuccess && n.isSuccess
      , a = [t.error, s.error, n.error].find(l);
    return {
        ...r({
            queryKey: ["complete-reading-test", e],
            queryFn: async () => {
                const [e,r,o] = [t.data, s.data, n.data];
                if (!e || !r || !o)
                    throw new Error("Required test data not available");
                const a = o.reduce( (e, t) => {
                    if (!t.passageId)
                        return e;
                    const s = t.passageId;
                    return e[s] = e[s] || [],
                    e[s].push(t),
                    e
                }
                , {});
                Object.values(a).forEach(e => e.sort( (e, t) => (e.fromNumber || 0) - (t.fromNumber || 0)));
                const i = r.map(e => ({
                    id: e.id,
                    title: e.title,
                    subtitle: e.subtitle,
                    imageUrl: e.imageUrl,
                    content: e.content,
                    isLabeled: e.isLabeled,
                    passageNumber: e.passageNumber
                }))
                  , c = (e=[]) => e.map(e => ({
                    id: e.id,
                    type: e.questionType,
                    instruction: e.instruction || "",
                    description: e.title || "",
                    from: e.fromNumber || 1,
                    to: e.toNumber || 2,
                    passageId: e.passageId,
                    content: e.content
                }))
                  , u = i.find(e => 1 === e.passageNumber)
                  , l = i.find(e => 2 === e.passageNumber)
                  , p = i.find(e => 3 === e.passageNumber)
                  , d = [u, l, p].map( (e, t) => {
                    const s = e && a[e.id] || [];
                    return {
                        partNumber: t + 1,
                        totalQuestions: s.reduce( (e, t) => t.fromNumber && t.toNumber ? e + (t.toNumber - t.fromNumber + 1) : t.fromNumber ? e + 1 : e, 0),
                        numbers: $(s)
                    }
                }
                ).filter(e => e.totalQuestions > 0);
                return {
                    id: `reading-test-${e.id}`,
                    name: e.title,
                    source: e.source || "",
                    packName: e.packName,
                    packId: e.packId,
                    description: e.description,
                    testType: e.testType,
                    duration: M(e.testType, i),
                    parts: d,
                    part1: {
                        passage: u,
                        question: c(u ? a[u.id] : [])
                    },
                    part2: {
                        passage: l,
                        question: c(l ? a[l.id] : [])
                    },
                    part3: {
                        passage: p,
                        question: c(p ? a[p.id] : [])
                    }
                }
            }
            ,
            enabled: o
        }),
        proLockedError: a,
        subQueryStates: [{
            isLoading: t.isLoading,
            error: t.error
        }, {
            isLoading: s.isLoading,
            error: s.error
        }, {
            isLoading: n.isLoading,
            error: n.error
        }]
    }
}
  , k = () => {
    const e = t()
      , {createReadingTest: r} = function() {
        const [e,t] = o.useState(!1)
          , [s,r] = o.useState(null)
          , {uploadFile: n, linkFileWithReadingPassage: a} = function() {
            const [e,t] = o.useState(!1)
              , [s,r] = o.useState(null)
              , n = async e => {
                try {
                    return r(null),
                    await u.post(e),
                    {
                        success: !0
                    }
                } catch (t) {
                    const e = t instanceof Error ? t.message : "Operation failed";
                    return r(e),
                    {
                        success: !1,
                        error: e
                    }
                }
            }
            ;
            return {
                isUploading: e,
                error: s,
                uploadFile: async (e, s) => {
                    if (!e)
                        return r("No file provided for upload"),
                        null;
                    try {
                        t(!0),
                        r(null);
                        const n = new FormData;
                        return n.append("file", e),
                        n.append("fileType", s),
                        (await u.post("/files/upload", n)).data
                    } catch (n) {
                        return r(n instanceof Error ? n.message : "Failed to upload file"),
                        null
                    } finally {
                        t(!1)
                    }
                }
                ,
                linkFileWithPracticeTest: async (e, t) => (await n(`/files/${e}/practice-test/${t}`)).success,
                linkFileWithReadingPassage: async (e, t) => (await n(`/files/${e}/reading-passage/${t}`)).success,
                linkFileWithTestQuestion: async (e, t) => (await n(`/files/${e}/test-question/${t}`)).success
            }
        }()
          , i = async (e, t) => {
            const s = []
              , r = {};
            try {
                for (const o of e) {
                    if (!o.title && !o.content)
                        continue;
                    const e = {
                        title: o.title,
                        subtitle: o.subtitle,
                        imageUrl: o.imageUrl,
                        isLabeled: o.isLabeled,
                        passageNumber: o.passageNumber,
                        content: o.content || {
                            paragraphs: ""
                        }
                    }
                      , i = (await u.post("/passages", e)).data;
                    s.push(i.id),
                    r[o.id] = i.id;
                    const c = t?.find(e => e.passageId === o.id);
                    if (c?.image) {
                        const e = await n(c.image, d.IMAGE);
                        e && await a(e.id, i.id)
                    }
                }
                return {
                    passageIds: s,
                    passageMapping: r
                }
            } catch (o) {
                if (s.length > 0) {
                    const e = s.map(e => u.delete(`/passages/${e}`));
                    await Promise.allSettled(e)
                }
                throw o
            }
        }
          , c = async (e, t) => {
            const s = [];
            try {
                for (const r of e) {
                    const e = t[r.passageId || ""];
                    if (!e)
                        continue;
                    const n = {
                        title: r.title || `Question ${r.fromNumber}-${r.toNumber}`,
                        instruction: r.instruction || "",
                        questionType: r.questionType,
                        partNumber: r.partNumber,
                        fromNumber: r.fromNumber,
                        toNumber: r.toNumber,
                        content: r.content || {},
                        passageId: e
                    }
                      , o = (await u.post("/questions", n)).data;
                    s.push(o.id)
                }
                return s
            } catch (r) {
                if (s.length > 0) {
                    const e = s.map(e => u.delete(`/questions/${e}`));
                    await Promise.allSettled(e)
                }
                throw r
            }
        }
          , l = async e => {
            const s = []
              , n = [];
            let o = null
              , a = {};
            try {
                t(!0),
                r(null);
                const l = await i(e.passages, e.batchFiles);
                s.push(...l.passageIds),
                a = l.passageMapping;
                const d = await c(e.questions, a);
                n.push(...d),
                e.answers && Object.keys(e.answers).length > 0 && (o = await f(e.answers));
                const h = {
                    title: e.title,
                    source: e.source,
                    testOrder: "number" == typeof e.testOrder ? e.testOrder : void 0,
                    categoryNames: e.categoryNames,
                    section: p.READING,
                    completed: !1,
                    passageIds: s,
                    questionIds: n,
                    answerKeyId: o,
                    testType: e.testType.toUpperCase(),
                    packId: e.packId,
                    coverImageUrl: e.coverImageUrl
                };
                return (await u.post("/practice-tests", h)).data
            } catch (l) {
                o && await u.delete(`/answer-keys/${o}`).catch(e => {}
                );
                const e = l instanceof Error ? l.message : "Failed to create reading test";
                throw r(e),
                l
            } finally {
                t(!1)
            }
        }
        ;
        return {
            isSubmitting: e,
            error: s,
            createReadingTest: l
        }
    }();
    return s({
        mutationFn: async e => r(e),
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["practice-tests"]
            })
        }
    })
}
  , G = () => {
    const e = t();
    return s({
        mutationFn: async ({testId: e, testData: t}) => {
            const {data: s} = await u.put(`/reading-tests/${e}`, t);
            return s
        }
        ,
        onSuccess: (t, s) => {
            e.invalidateQueries({
                queryKey: ["practice-tests"]
            }),
            e.invalidateQueries({
                queryKey: ["practice-tests", s.testId]
            })
        }
    })
}
;
const v = (e, t) => {
    if ("FULL" === (e || "FULL").toUpperCase())
        return 60;
    const s = t.some(e => "WRITING_TASK1" === e.questionType)
      , r = t.some(e => "WRITING_TASK2" === e.questionType);
    return s && !r ? 20 : !s && r ? 40 : 60
}
  , F = e => {
    const t = h(e)
      , s = g(e);
    return {
        ...r({
            queryKey: ["complete-writing-test", e],
            queryFn: async () => {
                if (!t.data || !s.data)
                    throw new Error("Test or passages data not available");
                const e = t.data
                  , r = s.data
                  , n = r.filter(e => e?.content).map( (t, s) => ({
                    id: t.id,
                    type: t.questionType,
                    duration: "WRITING_TASK1" === t.questionType ? 20 : 40,
                    content: {
                        question: t.content.question || "",
                        task: t.content.task || "",
                        imgUrl: t.content.imgUrl
                    },
                    source: e.source
                }));
                return n.sort( (e, t) => "WRITING_TASK1" === e.type && "WRITING_TASK2" === t.type ? -1 : "WRITING_TASK2" === e.type && "WRITING_TASK1" === t.type ? 1 : 0),
                {
                    id: e.id,
                    name: e.title,
                    source: e.source,
                    packName: e.packName,
                    packId: e.packId,
                    description: e.description,
                    testType: e.testType,
                    time: v(e.testType, r),
                    instructions: {
                        title: e.title,
                        instruction: e.description
                    },
                    parts: n
                }
            }
            ,
            enabled: t.isSuccess && s.isSuccess
        }),
        subQueryStates: [t, s]
    }
}
  , W = () => {
    const e = t()
      , {createWritingTest: r} = function() {
        const [e,t] = o.useState(!1)
          , [s,r] = o.useState(null)
          , n = async (e, t, s, r) => {
            const n = JSON.parse(t);
            return (await u.post("/questions", {
                title: e,
                instruction: n.task || n.question,
                questionType: s,
                partNumber: r,
                fromNumber: r,
                toNumber: r,
                content: n
            })).data.id
        }
          , a = async e => {
            try {
                t(!0),
                r(null);
                const s = [];
                for (const t of e.questions)
                    if (t.content) {
                        const e = await n(t.title || `Task ${t.partNumber}`, JSON.stringify(t.content), t.questionType, t.partNumber || 1);
                        s.push(e)
                    }
                const o = {
                    title: e.title,
                    source: e.source,
                    testOrder: "number" == typeof e.testOrder ? e.testOrder : void 0,
                    categoryNames: e.categoryNames || [],
                    testType: e.testType || "FULL",
                    section: e.section,
                    completed: !1,
                    questionIds: s,
                    packId: e.packId,
                    coverImageUrl: e.coverImageUrl
                }
                  , a = await u.post("/practice-tests", o);
                return a.data
            } catch (s) {
                const e = s instanceof Error ? s.message : "Failed to create writing test";
                return r(e),
                null
            } finally {
                t(!1)
            }
        }
        ;
        return {
            createWritingTest: a,
            isSubmitting: e,
            error: s
        }
    }();
    return s({
        mutationFn: e => r(e),
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["practice-tests"]
            })
        }
    })
}
;
const U = e => {
    const t = h(e)
      , s = g(e);
    return r({
        queryKey: ["complete-speaking-test", e],
        queryFn: async () => {
            if (!t.data || !s.data)
                throw new Error("Test or questions data not available");
            const e = t.data
              , r = s.data.reduce( (e, t) => {
                const s = t.partNumber || 1;
                return e[s] = e[s] || [],
                e[s].push(t),
                e
            }
            , {});
            return {
                id: `speaking-test-${e.id}`,
                name: e.title,
                source: e.source,
                packName: e.packName,
                packId: e.packId,
                description: e.description,
                useAiAnswers: !1,
                part1: r[1]?.map(e => e.content) || [],
                part2: r[2]?.[0]?.content || {
                    task: "",
                    questions: []
                },
                part3: r[3]?.map(e => e.content) || [],
                topics: {
                    part1: r[1]?.[0]?.title || "Introduction and Interview",
                    part2: r[2]?.[0]?.title || "Individual Long Turn",
                    part3: r[3]?.[0]?.title || "Two-way Discussion"
                }
            }
        }
        ,
        enabled: t.isSuccess && s.isSuccess
    })
}
  , H = () => {
    const e = t()
      , {createSpeakingTest: r} = function() {
        const [e,t] = o.useState(!1)
          , [s,r] = o.useState(null)
          , n = async e => {
            try {
                t(!0),
                r(null);
                const s = []
                  , n = JSON.parse(e.parts.part1)
                  , o = JSON.parse(e.parts.part2)
                  , a = JSON.parse(e.parts.part3);
                let i = 1;
                for (const e of n) {
                    const t = i
                      , r = t + e.questions.length - 1
                      , n = await u.post("/questions", {
                        title: `Part 1: ${e.topic}`,
                        instruction: "The examiner will ask you questions about familiar topics.",
                        questionType: "SPEAKING_PART1",
                        partNumber: 1,
                        fromNumber: t,
                        toNumber: r,
                        content: {
                            topic: e.topic,
                            questions: e.questions
                        }
                    });
                    s.push(n.data.id),
                    i = r + 1
                }
                const c = i
                  , l = i + o.questions.length - 1
                  , d = await u.post("/questions", {
                    title: `Part 2: ${o.topic}`,
                    instruction: "You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say.",
                    questionType: "SPEAKING_PART2",
                    partNumber: 2,
                    fromNumber: c,
                    toNumber: l,
                    content: {
                        topic: o.topic,
                        questions: o.questions
                    }
                });
                s.push(d.data.id),
                i = l + 1;
                for (const e of a) {
                    const t = i
                      , r = t + e.questions.length - 1
                      , n = await u.post("/questions", {
                        title: `Part 3: ${e.topic}`,
                        instruction: "The examiner will ask you more detailed questions related to the topic in Part 2.",
                        questionType: "SPEAKING_PART3",
                        partNumber: 3,
                        fromNumber: t,
                        toNumber: r,
                        content: {
                            topic: e.topic,
                            questions: e.questions
                        }
                    });
                    s.push(n.data.id),
                    i = r + 1
                }
                const h = {
                    title: e.title,
                    source: e.source,
                    testOrder: e.testOrder || 15,
                    categoryNames: e.categoryNames || ["real_exam"],
                    testType: e.testType || "FULL",
                    section: p.SPEAKING,
                    completed: e.completed || !1,
                    questionIds: s,
                    packId: e.packId,
                    coverImageUrl: e.coverImageUrl
                }
                  , m = (await u.post("/practice-tests", h)).data;
                return e.useAiAnswers && await u.post("/speaking-answers/generate", {
                    practiceTestId: m.id
                }),
                m
            } catch (s) {
                const e = s instanceof Error ? s.message : "Failed to create speaking test";
                return r(e),
                null
            } finally {
                t(!1)
            }
        }
        ;
        return {
            createSpeakingTest: n,
            isSubmitting: e,
            error: s
        }
    }();
    return s({
        mutationFn: e => r(e),
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["practice-tests"]
            })
        }
    })
}
;
export {A as H, b as Q, W as a, H as b, C as c, w as d, G as e, R as f, $ as g, _ as h, L as i, S as j, F as k, U as l, O as m, N as r, k as u};
