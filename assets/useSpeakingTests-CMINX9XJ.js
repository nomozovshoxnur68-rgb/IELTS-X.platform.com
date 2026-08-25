import { j as t, u as e, b as s, a as r } from "./query-BlWuWw0b.js";
import { R as n, a } from "./router-Btp1bBHd.js";
import { y as o, x as i, r as c, aL as u, a3 as l, aM as p } from "./index-BDFOk--9.js";
import { o as d, p as m, q as h, r as g } from "./usePracticeTests-DUhWGOKf.js";

const f = (e) =>
  e.split(/(\*\*.*?\*\*)/g).map((e, s) =>
    e.startsWith("**") && e.endsWith("**")
      ? t.jsx("strong", { children: e.substring(2, e.length - 2) }, s)
      : t.jsx(n.Fragment, { children: e }, s)
  );

const N = ({ questionGroup: e, showContentTitle: s = !0 }) => {
  const r = ((t, e, s, r) => {
    const n = ((t) => {
      if ("string" != typeof t) return "";
      const e = t.trim();
      return e
        ? (e.startsWith("{") && e.endsWith("}")) || (e.startsWith("[") && e.endsWith("]"))
          ? ""
          : e
        : "";
    })(e);
    
    const a = s ? " from the text" : "";
    
    const o = {
      NOTE_COMPLETION: `Complete the notes. Write **{instruction}**${a} for each answer.`,
      FORM_COMPLETION: `Complete the form. Write **{instruction}**${a} for each answer.`,
      TABLE_COMPLETION: `Complete the table. Write **{instruction}**${a} for each answer.`,
      SUMMARY_COMPLETION: `Complete the summary. Write **{instruction}**${a} for each answer.`,
      SUMMARY_COMPLETION_OPTIONS: "Complete the summary using the list of words. Choose the correct answer and move it into the gap.",
      SENTENCE_COMPLETION: `Complete the sentences. Write **{instruction}**${a} for each answer.`,
      DIAGRAM_COMPLETION: `Complete the diagram. Write **{instruction}**${a} for each answer.`,
      SHORT_ANSWER_COMPLETION: `Answer the questions. Write **{instruction}**${a} for each answer.`,
      FLOW_CHART_COMPLETION: `Complete the flow-chart. Write **{instruction}**${a} for each answer.`,
      MULTIPLE_CHOICE: "Choose the correct answer.",
      MULTIPLE_CHOICE_MANY: "Choose **{instruction}** correct answers.",
      TRUE_FALSE_NOT_GIVEN: "Choose **TRUE** if the statement agrees with the information given in the text, choose **FALSE** if the statement contradicts the information, or choose **NOT GIVEN** if there is no information on this.",
      YES_NO_NOT_GIVEN: "Choose **YES** if the statement agrees with the information given in the text, choose **NO** if the statement contradicts the information, or choose **NOT GIVEN** if there is no information on this.",
      MATCHING: "{instruction} Choose the correct answer and move it into the gap.",
      MATCHING_NAMES: "{instruction} Choose the correct answer and move it into the gap.",
      MATCHING_FEATURES: "Choose the correct group, **{instruction}**, for each item. You may choose any group more than once.",
      MATCHING_SENTENCE_ENDINGS: "Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.",
      MATCHING_HEADINGS: "{instruction}Choose the correct heading for each section and move it into the gap.",
      MATCHING_INFORMATION: "{instruction}Which paragraph contains the following information? Choose the correct letter, **${range}**. You may choose any letter more than once.",
      DIAGRAM_LABELING: "Label the map. Choose the correct letter, **{instruction}**, for each label.",
      FLOW_CHART_MATCHING: "Complete the flow-chart. Choose the correct answer and move it into the gap.",
      GAP_FILLING: `Fill in the gaps in the text. Write **{instruction}**${a} for each answer.`
    }[t] || "";

    if (!o) return n;

    const i = (t) => {
      if (!t?.content) return "A–H";
      const e = t.content;
      if (e.options && Array.isArray(e.options)) {
        const t = e.options.length;
        return `A–${String.fromCharCode(65 + t - 1)}`;
      }
      if (e.headings && Array.isArray(e.headings)) {
        const t = e.headings.length;
        return `A–${String.fromCharCode(65 + t - 1)}`;
      }
      if (e.features && Array.isArray(e.features)) {
        const t = e.features[0]?.id,
          s = e.features[e.features.length - 1]?.id;
        if (t && s) return `${t}–${s}`;
        const r = e.features.length;
        return `A–${String.fromCharCode(65 + r - 1)}`;
      }
      if (e.labels && Array.isArray(e.labels)) {
        const t = e.labels[0],
          s = e.labels[e.labels.length - 1];
        if (t && s) return `${t}–${s}`;
        const r = e.labels.length;
        return `A–${String.fromCharCode(65 + r - 1)}`;
      }
      return "A–H";
    };

    if (["TRUE_FALSE_NOT_GIVEN", "YES_NO_NOT_GIVEN", "MULTIPLE_CHOICE", "SUMMARY_COMPLETION_OPTIONS", "MATCHING_SENTENCE_ENDINGS", "FLOW_CHART_MATCHING"].includes(t)) return o;

    if ("MULTIPLE_CHOICE_MANY" === t) {
      const t = r?.content,
        e = t?.answersToChoose || 2,
        s = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"][e] || e.toString();
      return o.replace("{instruction}", s);
    }
    if ("MATCHING_HEADINGS" === t) {
      const t = r?.content,
        e = t?.questions?.length || 4,
        s = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][e] || e.toString();
      return o.replace("{instruction}", `The text has ${s} sections. `);
    }
    if ("MATCHING_INFORMATION" === t) {
      const t = r?.content,
        e = t.labels.length || 8,
        s = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][e] || e.toString(),
        n = i(r);
      return o.replace("{instruction}", `The text has ${s} sections labeled **${n}**. `).replace("{range}", n);
    }
    if (["DIAGRAM_LABELING", "MATCHING_FEATURES"].includes(t) && (!n || n.match(/^[A-Z]–[A-Z]$/))) {
      const t = i(r);
      return o.replace("{instruction}", t);
    }
    if ("MATCHING_FEATURES" === t) {
      const t = i(r);
      return o.replace("{instruction}", t);
    }
    return n
      ? n.length > 110 || n.includes("Write") || n.includes("for each answer") || n.includes("answers from the box")
        ? n
        : "MATCHING" === t || "MATCHING_NAMES" === t
        ? o.replace("{instruction}", n)
        : o.startsWith("{instruction}") && !n.match(/^(ONE WORD ONLY|TWO WORDS|THREE WORDS|NO MORE THAN \w+ WORDS?|ONE|TWO|THREE|FOUR|FIVE|[A-Z]–[A-Z])$/i)
        ? o.replace("{instruction}", `${n.toUpperCase()} `)
        : o.replace("{instruction}", n)
      : o.replace(/{instruction}/g, "").replace(/\s+/g, " ").trim();
  })(e.type, e.instruction, !!e.passageId, e);

  return t.jsxs("div", {
    className: "space-y-2",
    children: [
      t.jsxs("h5", {
        className: "font-semibold",
        children: ["Questions ", e.from, "–", e.to]
      }),
      r && t.jsx("p", { children: f(r) })
    ]
  });
};

const T = a.createContext(void 0);

const I = () => {
  const t = a.useContext(T);
  if (!t) throw new Error("useHighlight must be used within HighlightProvider");
  return t;
};

const y = ({ children: e }) => {
  const [s, r] = a.useState([]),
    [n, o] = a.useState({ visible: !1, regionId: null, segmentId: null, x: 0, y: 0, currentNote: "" }),
    i = a.useRef(new Set()),
    c = a.useCallback((t, e, s, n, a) => {
      const o = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return r((r) => [...r, { id: o, regionId: t, startOffset: e, endOffset: s, text: n, color: "#720000", note: a }]), o;
    }, []),
    u = a.useCallback((t) => {
      r((e) => e.filter((e) => e.id !== t));
    }, []),
    l = a.useCallback((t, e) => {
      r((s) => s.map((s) => (s.id === t ? { ...s, note: e.trim() || void 0 } : s)));
    }, []),
    p = a.useCallback(() => {
      const t = window.getSelection();
      t && t.removeAllRanges();
    }, []),
    d = a.useCallback(() => {
      i.current.forEach((t) => t());
    }, []),
    m = a.useCallback((t) => (i.current.add(t), () => { i.current.delete(t); }), []),
    h = a.useCallback((t, e, r) => {
      const n = s.find((s) => s.regionId === t && s.id === e);
      n && l(n.id, r);
    }, [s, l]),
    g = {
      highlights: s,
      addHighlight: c,
      removeHighlight: u,
      updateNote: l,
      clearSelection: p,
      closeAllMenus: d,
      registerMenuCloser: m,
      noteEditor: n,
      setNoteEditor: o,
      updateSegmentNote: h
    };
  return t.jsx(T.Provider, { value: g, children: e });
};

const b = () => {
  const { examLayout: t } = o(),
    { userPlan: e } = i();
  return { useInsperaLayout: "inspera" === t || "standard" !== t, examLayout: t, isPro: "DEMO" !== e };
};

const E = (t) => t.trim().split(/\s+/).filter((t) => t.length > 0).length;

const w = (t) => {
  for (let e = 1; e <= 4; e++) {
    const s = t[`part${e}`];
    if (Array.isArray(s) && s.length > 0) return e;
  }
  return 1;
};

const A = (t) => {
  for (let e = 1; e <= 3; e++) {
    const s = t[`part${e}`];
    if (s && s.question && s.question.length > 0) return e;
  }
  return 1;
};

const C = (t = []) => {
  const e = [];
  for (const s of t) {
    const t = s.fromNumber,
      r = s.toNumber;
    if (void 0 !== t && void 0 !== r) {
      if ("MULTIPLE_CHOICE_MANY" === s.questionType && s.content?.answersToChoose) {
        const n = s.content.answersToChoose;
        for (let s = t; s < r; s += n) {
          const t = [];
          for (let e = s; e < s + n && e <= r; e++) t.push(e.toString());
          e.push(t.join("-"));
        }
      } else {
        for (let s = t; s <= r; s++) e.push(s.toString());
      }
    }
  }
  return e;
};

const S = [
  { partNumber: 1, totalQuestions: 13, numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"] },
  { partNumber: 2, totalQuestions: 13, numbers: ["14", "15", "16", "17", "18, 19", "20, 21", "22, 23", "24", "25", "26"] },
  { partNumber: 3, totalQuestions: 14, numbers: ["27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"] }
];

const O = { 1: 15, 2: 20, 3: 30 };

const _ = (t, e = []) => {
  if ("FULL" === (t || "FULL").toUpperCase()) return 60;
  const s = e.map((t) => t.passageNumber).filter((t) => "number" == typeof t && !isNaN(t)).sort((t, e) => t - e)[0] ?? 1;
  return O[s] ?? 20;
};

const q = (t) => {
  const e = d(t),
    s = m(t),
    n = h(t),
    a = e.isSuccess && s.isSuccess && n.isSuccess,
    o = [e.error, s.error, n.error].find(u);
  return {
    ...r({
      queryKey: ["complete-reading-test", t],
      queryFn: async () => {
        const [t, r, a] = [e.data, s.data, n.data];
        if (!t || !r || !a) throw new Error("Required test data not available");
        const o = a.reduce((t, e) => {
          if (!e.passageId) return t;
          const s = e.passageId;
          return (t[s] = t[s] || []), t[s].push(e), t;
        }, {});
        Object.values(o).forEach((t) => t.sort((t, e) => (t.fromNumber || 0) - (e.fromNumber || 0)));
        const i = r.map((t) => ({ id: t.id, title: t.title, subtitle: t.subtitle, imageUrl: t.imageUrl, content: t.content, isLabeled: t.isLabeled, passageNumber: t.passageNumber })),
          c = (t = []) => t.map((t) => ({ id: t.id, type: t.questionType, instruction: t.instruction || "", description: t.title || "", from: t.fromNumber || 1, to: t.toNumber || 2, passageId: t.passageId, content: t.content })),
          u = i.find((t) => 1 === t.passageNumber),
          l = i.find((t) => 2 === t.passageNumber),
          p = i.find((t) => 3 === t.passageNumber),
          d = [u, l, p].map((t, e) => {
            const s = (t && o[t.id]) || [];
            return { partNumber: e + 1, totalQuestions: s.reduce((t, e) => (e.fromNumber && e.toNumber ? t + (e.toNumber - e.fromNumber + 1) : e.fromNumber ? t + 1 : t), 0), numbers: C(s) };
          }).filter((t) => t.totalQuestions > 0);
        return { id: `reading-test-${t.id}`, name: t.title, source: t.source || "", packName: t.packName, packId: t.packId, description: t.description, testType: t.testType, duration: _(t.testType, i), parts: d, part1: { passage: u, question: c(u ? o[u.id] : []) }, part2: { passage: l, question: c(l ? o[l.id] : []) }, part3: { passage: p, question: c(p ? o[p.id] : []) } };
      },
      enabled: a
    }),
    proLockedError: o,
    subQueryStates: [{ isLoading: e.isLoading, error: e.error }, { isLoading: s.isLoading, error: s.error }, { isLoading: n.isLoading, error: n.error }]
  };
};

const L = () => {
  const t = e(),
    { createReadingTest: r } = (() => {
      const [t, e] = a.useState(!1),
        [s, r] = a.useState(null),
        { uploadFile: n, linkFileWithReadingPassage: o } = (() => {
          const [t, e] = a.useState(!1),
            [s, r] = a.useState(null),
            n = async (t) => {
              try {
                return r(null), await c.post(t), { success: !0 };
              } catch (e) {
                const t = e instanceof Error ? e.message : "Operation failed";
                return r(t), { success: !1, error: t };
              }
            };
          return {
            isUploading: t,
            error: s,
            uploadFile: async (t, s) => {
              if (!t) return r("No file provided for upload"), null;
              try {
                e(!0), r(null);
                const n = new FormData();
                return n.append("file", t), n.append("fileType", s), (await c.post("/files/upload", n)).data;
              } catch (n) {
                return r(n instanceof Error ? n.message : "Failed to upload file"), null;
              } finally {
                e(!1);
              }
            },
            linkFileWithPracticeTest: async (t, e) => (await n(`/files/${t}/practice-test/${e}`)).success,
            linkFileWithReadingPassage: async (t, e) => (await n(`/files/${t}/reading-passage/${e}`)).success,
            linkFileWithTestQuestion: async (t, e) => (await n(`/files/${t}/test-question/${e}`)).success
          };
        })(),
        i = async (t, e) => {
          const s = [],
            r = {};
          try {
            for (const a of t) {
              if (!a.title && !a.content) continue;
              const t = { title: a.title, subtitle: a.subtitle, imageUrl: a.imageUrl, isLabeled: a.isLabeled, passageNumber: a.passageNumber, content: a.content || { paragraphs: "" } },
                i = (await c.post("/passages", t)).data;
              s.push(i.id), (r[a.id] = i.id);
              const u = e?.find((t) => t.passageId === a.id);
              if (u?.image) {
                const t = await n(u.image, p.IMAGE);
                t && (await o(t.id, i.id));
              }
            }
            return { passageIds: s, passageMapping: r };
          } catch (a) {
            if (s.length > 0) {
              const t = s.map((t) => c.delete(`/passages/${t}`));
              await Promise.allSettled(t);
            }
            throw a;
          }
        },
        u = async (t, e) => {
          const s = [];
          try {
            for (const r of t) {
              const t = e[r.passageId || ""];
              if (!t) continue;
              const n = { title: r.title || `Question ${r.fromNumber}-${r.toNumber}`, instruction: r.instruction || "", questionType: r.questionType, partNumber: r.partNumber, fromNumber: r.fromNumber, toNumber: r.toNumber, content: r.content || {}, passageId: t },
                a = (await c.post("/questions", n)).data;
              s.push(a.id);
            }
            return s;
          } catch (r) {
            if (s.length > 0) {
              const t = s.map((t) => c.delete(`/questions/${t}`));
              await Promise.allSettled(t);
            }
            throw r;
          }
        },
        d = async (t) => {
          const s = [],
            n = [];
          let a = null,
            o = {};
          try {
            e(!0), r(null);
            const p = await i(t.passages, t.batchFiles);
            s.push(...p.passageIds), (o = p.passageMapping);
            const d = await u(t.questions, o);
            n.push(...d), t.answers && Object.keys(t.answers).length > 0 && (a = await g(t.answers));
            const m = { title: t.title, source: t.source, testOrder: "number" == typeof t.testOrder ? t.testOrder : void 0, categoryNames: t.categoryNames, section: l.READING, completed: !1, passageIds: s, questionIds: n, answerKeyId: a, testType: t.testType.toUpperCase(), packId: t.packId, coverImageUrl: t.coverImageUrl };
            return (await c.post("/practice-tests", m)).data;
          } catch (p) {
            a && (await c.delete(`/answer-keys/${a}`).catch((t) => {}));
            const t = p instanceof Error ? p.message : "Failed to create reading test";
            throw r(t), p;
          } finally {
            e(!1);
          }
        };
      return { isSubmitting: t, error: s, createReadingTest: d };
    })();
  return s({
    mutationFn: async (t) => r(t),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: ["practice-tests"] });
    }
  });
};

const M = () => {
  const t = e();
  return s({
    mutationFn: async ({ testId: t, testData: e }) => {
      const { data: s } = await c.put(`/reading-tests/${t}`, e);
      return s;
    },
    onSuccess: (e, s) => {
      t.invalidateQueries({ queryKey: ["practice-tests"] }), t.invalidateQueries({ queryKey: ["practice-tests", s.testId] });
    }
  });
};

const R = (t, e) => {
  if ("FULL" === (t || "FULL").toUpperCase()) return 60;
  const s = e.some((t) => "WRITING_TASK1" === t.questionType),
    r = e.some((t) => "WRITING_TASK2" === t.questionType);
  return s && !r ? 20 : !s && r ? 40 : 60;
};

const k = (t) => {
  const e = d(t),
    s = h(t);
  return {
    ...r({
      queryKey: ["complete-writing-test", t],
      queryFn: async () => {
        if (!e.data || !s.data) throw new Error("Test or passages data not available");
        const t = e.data,
          r = s.data,
          n = r.filter((t) => t?.content).map((e, s) => ({ id: e.id, type: e.questionType, duration: "WRITING_TASK1" === e.questionType ? 20 : 40, content: { question: e.content.question || "", task: e.content.task || "", imgUrl: e.content.imgUrl }, source: t.source }));
        return n.sort((t, e) => ("WRITING_TASK1" === t.type && "WRITING_TASK2" === e.type ? -1 : "WRITING_TASK2" === t.type && "WRITING_TASK1" === e.type ? 1 : 0)), { id: t.id, name: t.title, source: t.source, packName: t.packName, packId: t.packId, description: t.description, testType: t.testType, time: R(t.testType, r), instructions: { title: t.title, instruction: t.description }, parts: n };
      },
      enabled: e.isSuccess && s.isSuccess
    }),
    subQueryStates: [e, s]
  };
};

const G = () => {
  const t = e(),
    { createWritingTest: r } = (() => {
      const [t, e] = a.useState(!1),
        [s, r] = a.useState(null),
        n = async (t, e, s, r) => {
          const n = JSON.parse(e);
          return (await c.post("/questions", { title: t, instruction: n.task || n.question, questionType: s, partNumber: r, fromNumber: r, toNumber: r, content: n })).data.id;
        },
        o = async (t) => {
          try {
            e(!0), r(null);
            const s = [];
            for (const e of t.questions) {
              if (e.content) {
                const t = await n(e.title || `Task ${e.partNumber}`, JSON.stringify(e.content), e.questionType, e.partNumber || 1);
                s.push(t);
              }
            }
            const a = { title: t.title, source: t.source, testOrder: "number" == typeof t.testOrder ? t.testOrder : void 0, categoryNames: t.categoryNames || [], testType: t.testType || "FULL", section: t.section, completed: !1, questionIds: s, packId: t.packId, coverImageUrl: t.coverImageUrl },
              o = await c.post("/practice-tests", a);
            return o.data;
          } catch (s) {
            const t = s instanceof Error ? s.message : "Failed to create writing test";
            return r(t), null;
          } finally {
            e(!1);
          }
        };
      return { createWritingTest: o, isSubmitting: t, error: s };
    })();
  return s({
    mutationFn: (t) => r(t),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: ["practice-tests"] });
    }
  });
};

const v = (t) => {
  const e = d(t),
    s = h(t);
  return r({
    queryKey: ["complete-speaking-test", t],
    queryFn: async () => {
      if (!e.data || !s.data) throw new Error("Test or questions data not available");
      const t = e.data,
        r = s.data.reduce((t, e) => {
          const s = e.partNumber || 1;
          return (t[s] = t[s] || []), t[s].push(e), t;
        }, {});
      return { id: `speaking-test-${t.id}`, name: t.title, source: t.source, packName: t.packName, packId: t.packId, description: t.description, useAiAnswers: !1, part1: r[1]?.map((t) => t.content) || [], part2: r[2]?.[0]?.content || { task: "", questions: [] }, part3: r[3]?.map((t) => t.content) || [], topics: { part1: r[1]?.[0]?.title || "Introduction and Interview", part2: r[2]?.[0]?.title || "Individual Long Turn", part3: r[3]?.[0]?.title || "Two-way Discussion" } };
    },
    enabled: e.isSuccess && s.isSuccess
  });
};

const $ = () => {
  const t = e(),
    { createSpeakingTest: r } = (() => {
      const [t, e] = a.useState(!1),
        [s, r] = a.useState(null),
        n = async (t) => {
          try {
            e(!0), r(null);
            const s = [],
              n = JSON.parse(t.parts.part1),
              a = JSON.parse(t.parts.part2),
              o = JSON.parse(t.parts.part3);
            let i = 1;
            for (const t of n) {
              const e = i,
                r = e + t.questions.length - 1,
                n = await c.post("/questions", { title: `Part 1: ${t.topic}`, instruction: "The examiner will ask you questions about familiar topics.", questionType: "SPEAKING_PART1", partNumber: 1, fromNumber: e, toNumber: r, content: { topic: t.topic, questions: t.questions } });
              s.push(n.data.id), (i = r + 1);
            }
            const u = i,
              p = i + a.questions.length - 1,
              d = await c.post("/questions", { title: `Part 2: ${a.topic}`, instruction: "You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say.", questionType: "SPEAKING_PART2", partNumber: 2, fromNumber: u, toNumber: p, content: { topic: a.topic, questions: a.questions } });
            s.push(d.data.id), (i = p + 1);
            for (const t of o) {
              const e = i,
                r = e + t.questions.length - 1,
                n = await c.post("/questions", { title: `Part 3: ${t.topic}`, instruction: "The examiner will ask you more detailed questions related to the topic in Part 2.", questionType: "SPEAKING_PART3", partNumber: 3, fromNumber: e, toNumber: r, content: { topic: t.topic, questions: t.questions } });
              s.push(n.data.id), (i = r + 1);
            }
            const m = { title: t.title, source: t.source, testOrder: t.testOrder || 15, categoryNames: t.categoryNames || ["real_exam"], testType: t.testType || "FULL", section: l.SPEAKING, completed: t.completed || !1, questionIds: s, packId: t.packId, coverImageUrl: t.coverImageUrl },
              h = (await c.post("/practice-tests", m)).data;
            return t.useAiAnswers && (await c.post("/speaking-answers/generate", { practiceTestId: h.id })), h;
          } catch (s) {
            const t = s instanceof Error ? s.message : "Failed to create speaking test";
            return r(t), null;
          } finally {
            e(!1);
          }
        };
      return { createSpeakingTest: n, isSubmitting: t, error: s };
    })();
  return s({
    mutationFn: (t) => r(t),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: ["practice-tests"] });
    }
  });
};

export { y as H, N as Q, G as a, $ as b, I as c, b as d, M as e, q as f, C as g, A as h, S as i, E as j, k, v as l, w as m, f as r, L as u };