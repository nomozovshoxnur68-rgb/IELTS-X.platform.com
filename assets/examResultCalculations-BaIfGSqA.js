const r = ["MATCHING", "MATCHING_NAMES", "SUMMARY_COMPLETION_OPTIONS"];
function t(r) {
    const t = r.replace(/,/g, "").trim();
    return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null
}
const e = [{
    min: 39,
    score: 9
}, {
    min: 37,
    score: 8.5
}, {
    min: 35,
    score: 8
}, {
    min: 32,
    score: 7.5
}, {
    min: 30,
    score: 7
}, {
    min: 26,
    score: 6.5
}, {
    min: 23,
    score: 6
}, {
    min: 18,
    score: 5.5
}, {
    min: 16,
    score: 5
}, {
    min: 13,
    score: 4.5
}, {
    min: 11,
    score: 4
}, {
    min: 0,
    score: 0
}]
  , s = [{
    min: 39,
    score: 9
}, {
    min: 37,
    score: 8.5
}, {
    min: 35,
    score: 8
}, {
    min: 33,
    score: 7.5
}, {
    min: 30,
    score: 7
}, {
    min: 27,
    score: 6.5
}, {
    min: 23,
    score: 6
}, {
    min: 19,
    score: 5.5
}, {
    min: 15,
    score: 5
}, {
    min: 13,
    score: 4.5
}, {
    min: 10,
    score: 4
}, {
    min: 8,
    score: 3.5
}, {
    min: 6,
    score: 3
}, {
    min: 4,
    score: 2.5
}, {
    min: 0,
    score: 0
}];
function n(r) {
    const t = r.trim();
    if (t.includes(","))
        return t.split(",").map(r => r.trim()).filter(r => r.length > 0);
    if (!t.includes("-"))
        return [t];
    const e = t.split("-").map(r => r.trim());
    if (2 === e.length) {
        const r = parseInt(e[0])
          , s = parseInt(e[1]);
        if (isNaN(r) || isNaN(s))
            return [t];
        const n = [];
        for (let t = r; t <= s; t++)
            n.push(t.toString());
        return n
    }
    return e.every(r => !isNaN(parseInt(r))) ? e : [t]
}
function o(e, s, n, o, i, c) {
    if (Array.isArray(s) || "string" == typeof s && s.startsWith("[") && s.endsWith("]"))
        return function(e, s, n, o) {
            const i = (e || "").trim().toLowerCase().replace(/\s+/g, " ");
            let c;
            c = Array.isArray(s) ? s.map(String).map(r => r.trim()) : function(r) {
                if (r.startsWith("[") && r.endsWith("]")) {
                    try {
                        const t = JSON.parse(r);
                        if (Array.isArray(t))
                            return t.map(r => String(r).trim())
                    } catch {}
                    return r.slice(1, -1).split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)(?=(?:[^']*'[^']*')*[^']*$)/).map(r => r.trim().replace(/^['"]|['"]$/g, "").trim()).filter(r => r.length > 0)
                }
                return [r.trim()]
            }(s);
            const a = c.some(e => {
                const s = String(e).trim().toLowerCase().replace(/\s+/g, " ");
                if (s === i)
                    return !0;
                const n = t(s)
                  , c = t(i);
                return null !== n && null !== c ? n === c : !!r.includes(o) && (i.startsWith(s) || s.startsWith(i))
            }
            )
              , u = n.map(r => ({
                questionNumber: r,
                userAnswer: e || "No answer",
                correctAnswer: c.join(" / "),
                questionType: o,
                isCorrect: a
            }));
            return {
                correct: a ? n.length : 0,
                incorrect: a ? 0 : n.length,
                details: u
            }
        }(e, s, n, o);
    if ("string" == typeof s && s.includes("/"))
        return function(r, t, e, s) {
            const n = (r || "").trim().toLowerCase()
              , o = Array.isArray(t) ? t.join("/") : String(t)
              , i = o.split("/").map(r => r.trim().toLowerCase())
              , c = i.includes(n)
              , a = e.map(t => ({
                questionNumber: t,
                userAnswer: r || "No answer",
                correctAnswer: o,
                questionType: s,
                isCorrect: c
            }));
            return {
                correct: c ? e.length : 0,
                incorrect: c ? 0 : e.length,
                details: a
            }
        }(e, s, n, o);
    const a = Array.isArray(s) ? s.join("") : String(s);
    if (1 === n.length && "MULTIPLE_CHOICE_MANY" !== o) {
        const s = (e || "").trim().toLowerCase()
          , i = a.trim().toLowerCase();
        let c = !1;
        if (s && i)
            if (r.includes(o))
                c = s.startsWith(i) || i.startsWith(s);
            else {
                const r = t(s)
                  , e = t(i);
                c = null !== r && null !== e ? r === e : s === i
            }
        return {
            correct: c ? 1 : 0,
            incorrect: c ? 0 : 1,
            details: [{
                questionNumber: n[0],
                userAnswer: e || "No answer",
                correctAnswer: a,
                questionType: o,
                isCorrect: c
            }]
        }
    }
    let u = (e || "").toUpperCase().replace(/\s+/g, "");
    const p = a.toUpperCase().replace(/\s+/g, "");
    if (!u && n.length > 1) {
        const r = [];
        let t = !1;
        n.forEach(e => {
            const s = i[e];
            s ? (r.push(s.toUpperCase().trim()),
            t = !0) : r.push("")
        }
        ),
        t && (u = r.join(""))
    }
    const m = u.split("")
      , l = p.split("");
    let f = 0
      , h = 0;
    const d = [];
    if ("MULTIPLE_CHOICE_MANY" === o) {
        const r = new Set(l)
          , t = new Set;
        n.forEach( (e, s) => {
            const n = m[s] || "";
            let i = !1;
            n && r.has(n) && !t.has(n) ? (i = !0,
            f++,
            t.add(n)) : h++,
            d.push({
                questionNumber: e,
                userAnswer: n || "No answer",
                correctAnswer: `Any of: ${l.join(", ")}`,
                questionType: o,
                isCorrect: i
            })
        }
        )
    } else
        n.forEach( (t, e) => {
            const s = m[e] || ""
              , n = l[e] || "";
            let i = !1;
            s && n && (i = r.includes(o) ? s.toLowerCase().startsWith(n.toLowerCase()) || n.toLowerCase().startsWith(s.toLowerCase()) : s === n),
            i ? f++ : h++,
            d.push({
                questionNumber: t,
                userAnswer: s || "No answer",
                correctAnswer: n,
                questionType: o,
                isCorrect: i
            })
        }
        );
    return {
        correct: f,
        incorrect: h,
        details: d
    }
}
const i = (r, t, i, c) => {
    const a = "listening" === i
      , u = function(r) {
        const t = new Set;
        return r.parts.forEach(r => {
            r.numbers.forEach(r => {
                n(r).forEach(r => {
                    t.add(r)
                }
                )
            }
            )
        }
        ),
        t
    }(c)
      , p = function(r, t) {
        const e = new Map;
        return r.parts.forEach(r => {
            const s = t ? `part_${r.partNumber}` : `Passage ${r.partNumber}`;
            r.numbers.forEach(r => {
                n(r).forEach(r => {
                    e.has(r) || e.set(r, s)
                }
                )
            }
            )
        }
        ),
        e
    }(c, a)
      , m = function(r, t, e) {
        const s = new Map
          , n = function(r, t) {
            return t ? [...r.part1, ...r.part2, ...r.part3, ...r.part4] : [...r.part1.question, ...r.part2.question, ...r.part3.question]
        }(r, t);
        return n.forEach(r => {
            const t = new Set;
            if (void 0 !== r.from && void 0 !== r.to)
                for (let e = r.from; e <= r.to; e++)
                    t.add(String(e));
            if ("MULTIPLE_CHOICE_MANY" === r.type) {
                const e = r.content;
                e?.questions?.forEach(r => {
                    r.questionNumbers?.length ? r.questionNumbers.forEach(r => t.add(String(r))) : void 0 !== r.id && null !== r.id && t.add(String(r.id))
                }
                )
            }
            t.forEach(t => {
                e.has(t) && !s.has(t) && s.set(t, r.type)
            }
            )
        }
        ),
        s
    }(c, a, u)
      , l = u.size;
    let f = 0
      , h = 0;
    const d = []
      , g = {}
      , w = {}
      , N = {}
      , y = {}
      , A = {}
      , C = a ? [0, 0, 0, 0] : void 0;
    c.parts.forEach(r => {
        const t = a ? `part_${r.partNumber}` : `Passage ${r.partNumber}`;
        N[t] = 0,
        y[t] = 0,
        A[t] = 0
    }
    ),
    Object.entries(t.answers).forEach( ([t,e]) => {
        const s = n(t).filter(r => u.has(r));
        if (0 === s.length)
            return;
        const i = r[t] || ""
          , c = s[0]
          , l = p.get(c) || "Unknown"
          , h = m.get(c) || "Unknown";
        if (s.length > 1) {
            const t = o(i, e, s, h, r);
            if (f += t.correct,
            A[l] = (A[l] || 0) + s.length,
            y[l] = (y[l] || 0) + t.correct,
            N[l] = (N[l] || 0) + t.incorrect,
            a && /^part_\d+$/i.test(l)) {
                const r = parseInt(l.replace(/^part_/i, ""), 10) - 1;
                r >= 0 && r < C.length && (C[r] += t.incorrect)
            }
            t.details.forEach(r => {
                r.isCorrect || (a ? d.push(parseInt(r.questionNumber)) : d.push(r.questionNumber),
                w[r.questionNumber] = r.userAnswer,
                g[h] = (g[h] || 0) + 1)
            }
            )
        } else {
            const t = s[0];
            A[l] = (A[l] || 0) + 1;
            if (o(i, e, s, h, r).correct > 0)
                f++,
                y[l] = (y[l] || 0) + 1;
            else {
                if (N[l] = (N[l] || 0) + 1,
                g[h] = (g[h] || 0) + 1,
                a) {
                    if (d.push(parseInt(t)),
                    /^part_\d+$/i.test(l)) {
                        const r = parseInt(l.replace(/^part_/i, ""), 10) - 1;
                        r >= 0 && r < C.length && C[r]++
                    }
                } else
                    d.push(t);
                w[t] = i || "No answer"
            }
        }
    }
    ),
    h = l - f;
    const E = {};
    Object.keys(A).forEach(r => {
        const t = A[r]
          , e = y[r] || 0;
        E[r] = t > 0 ? Math.round(e / t * 100) : 0
    }
    );
    const b = ( (r, t, n) => {
        if (t <= 0)
            return 0;
        const o = t < 40 ? Math.round(r / t * 40) : r
          , i = (n ? e : s).find(r => o >= r.min);
        return i ? i.score : 0
    }
    )(f, l, a)
      , q = {
        totalCorrectAnswers: f,
        totalIncorrectAnswers: h,
        totalQuestions: l,
        bandScore: b,
        mistakesByQuestionType: g,
        mistakesByQuestionNumber: w,
        mistakesByPart: N,
        correctByPart: y,
        totalByPart: A,
        percentageByPart: E
    };
    return a ? {
        ...q,
        incorrectQuestions: d,
        partSummary: C
    } : {
        ...q,
        incorrectQuestions: d
    }
}
  , c = (r, t, e) => i(r, t, "listening", e)
  , a = (r, t, e) => i(r, t, "reading", e);
export {c as a, a as b};
