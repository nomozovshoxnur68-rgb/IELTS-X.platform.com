const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = [
    "assets/ListeningTestMain-FpxeafAl.js",
    "assets/query-BlWuWw0b.js",
    "assets/router-Btp1bBHd.js",
    "assets/ReportIssueDialog-NI7EAf4t.js",
    "assets/index-BDFOk--9.js",
    "assets/ui-DGs5TuBx.js",
    "assets/icons-DgpXasbc.js",
    "assets/index-D8Vb1vTK.css",
    "assets/useSpeakingTests-Bqipeg_Z.js",
    "assets/usePracticeTests-DUhWGOKf.js",
    "assets/useIssueReports-DqPtRa6S.js",
    "assets/ListeningQuestionRenderer-CeGz1f_n.js",
    "assets/FlowChartCompletionTest-CHEQFra9.js",
    "assets/useListeningTests-BrVeUJgM.js",
    "assets/examResultCalculations-BaIfGSqA.js",
    "assets/ReadingTestMain-D29tb5iw.js",
    "assets/ReadingPassageRenderer-wfgOJ1wI.js",
    "assets/WritingTestMain-kjK60sEQ.js",
    "assets/SpeakingTestMain-C1RW-Ffl.js",
    "assets/MarkdownRenderer-BDNE5UgZ.js",
    "assets/formatters-D_CuouuD.js",
    "assets/index-vxLYeKGP.js",
    "assets/useTestSolution-Brzw8Mgr.js",
    "assets/fuzzyTextMatching-BDgWYSW1.js",
    "assets/examIntegrityApi-BG2YrMEp.js",
    "assets/ListeningTestReview-BMQb_2px.js",
    "assets/MockTestExecution-Crwcgw6s.js",
    "assets/MockExamResults-B0pnKFp4.js",
    "assets/MockTestReview-BxQdx2Sh.js"
]))) => i.map(i => d[i]);

import {
    a as e, l as s, k as t, B as r, u as n, y as a, W as i, _ as l, X as o, Y as c, Z as d, r as m, C as u,
    e as x, f as h, p, g as b, b as f, aZ as g, a_ as j, $ as N, a0 as y, a1 as v, I as w, a3 as k, T as S,
    z as C, D as T, E as A, a$ as I
} from "./index-BDFOk--9.js";
import { j as E, b as q, u as R } from "./query-BlWuWw0b.js";
import { a as _, R as P, e as L, u as O, h as M, i as $, j as G } from "./router-Btp1bBHd.js";
import { d as W, Q as F, r as K, f as D, h as Q, i as U, H as B, j as H, k as z, l as V } from "./useSpeakingTests-Bqipeg_Z.js";
import {
    ar as Y, K as J, i as X, U as Z, ae as ee, $ as se, S as te, a as re, b as ne, aW as ae, T as ie,
    M as le, aX as oe, aY as ce, h as de, aO as me, X as ue, y as xe, C as he, B as pe, a9 as be, s as fe,
    a7 as ge, q as je, a2 as Ne, J as ye, z as ve
} from "./icons-DgpXasbc.js";
import { t as we } from "./usePracticeTests-DUhWGOKf.js";
import { M as ke } from "./MarkdownRenderer-BDNE5UgZ.js";
import { b as Se } from "./useIssueReports-DqPtRa6S.js";
import { t as Ce, g as Te } from "./formatters-D_CuouuD.js";
import { u as Ae } from "./index-vxLYeKGP.js";
import { n as Ie, s as Ee, c as qe } from "./useTestSolution-Brzw8Mgr.js";
import { h as Re, s as _e, f as Pe, a as Le } from "./fuzzyTextMatching-BDgWYSW1.js";
import { e as Oe } from "./examIntegrityApi-BG2YrMEp.js";

function Me({ userInfoContent: r, timeContent: n, button: a }) {
    const i = e(),
        { useInsperaLayout: l } = W(),
        o = !r && !n && !a;
    return l ? E.jsxs("header", {
        className: "relative px-4 py-1 flex justify-between items-center border-b border-b-gray-300 " + (o ? "h-7" : ""),
        children: [
            E.jsxs("div", {
                className: "flex items-center gap-2 min-w-0 max-w-[30%]",
                children: [
                    E.jsx("img", { className: "h-7 shrink-0", src: "light" === i ? s : t, alt: "IELTS Logo" }),
                    E.jsx("div", { className: "min-w-0 overflow-hidden", children: r })
                ]
            }),
            E.jsx("div", { className: "absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4", children: n }),
            E.jsx("div", { className: "flex items-center gap-2", children: a })
        ]
    }) : E.jsxs("header", {
        className: "bg-gradient-to-t from-black via-[#444d52] to-[#0f202d] px-2 py-1 flex justify-between items-center " + (o ? "h-7" : ""),
        children: [
            E.jsx("div", { className: "flex items-center gap-2 min-w-0 max-w-[30%] overflow-hidden", children: r }),
            E.jsx("div", { className: "absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4", children: n }),
            E.jsx("div", { className: "flex items-center gap-2", children: a })
        ]
    })
}

const $e = e => {
    const s = document.getElementById(`question-${e}`);
    s && (s.scrollIntoView({ behavior: "smooth", block: "center" }), s.focus())
};

const Ge = ({ parts: e, currentPart: s, examStore: t, onPartChange: n }) => {
    const { answers: a = {}, activeQuestionId: i, setActiveQuestion: l } = t,
        o = _.useMemo(() => {
            const s = {};
            return e.forEach(e => {
                let t = 0;
                e.numbers.forEach(e => {
                    const s = a[e];
                    t += ((e, s) => {
                        if (!s || "" === s.trim()) return 0;
                        if (e.includes("-")) {
                            const t = e.split("-").map(e => parseInt(e, 10)).length;
                            return Math.min(s.trim().length, t)
                        }
                        return 1
                    })(e, s)
                }), s[e.partNumber] = { isCompleted: t === e.totalQuestions, completedCount: t }
            }), s
        }, [a, e]),
        c = _.useMemo(() => e.find(e => e.partNumber === s), [e, s]),
        d = _.useCallback(e => { n(e) }, [n]),
        m = _.useCallback(e => { l && (l(e), $e(e)) }, [l]),
        u = _.useCallback(e => {
            if (!c || !l) return;
            const { numbers: s } = c;
            let t;
            if (i) {
                const r = s.indexOf(i);
                t = "next" === e ? r === s.length - 1 ? s[0] : s[r + 1] : 0 === r ? s[s.length - 1] : s[r - 1]
            } else t = s[0];
            l(t), $e(t)
        }, [c, i, l]),
        x = _.useCallback(() => { u("next") }, [u]),
        h = _.useCallback(() => { u("previous") }, [u]),
        p = e => {
            const s = a[e],
                t = void 0 !== s && "" !== s,
                r = e === i;
            return E.jsx("div", {
                className: "border-t-[3px] flex items-center h-full flex-shrink-0 " + (t ? "border-green-500" : "border-gray-400"),
                children: E.jsx("button", {
                    className: "h-7 min-w-[28px] px-1 text-sm text-foreground shadow-none border-2 rounded-sm \n hover:border-blue-500 hover:font-semibold transition-colors " + (r ? "border-blue-500 font-semibold" : "border-transparent"),
                    onClick: s => { s.stopPropagation(), m(e) },
                    "aria-label": `Question ${e}${t ? " (answered)" : ""}`,
                    children: e
                })
            }, e)
        },
        b = e => {
            const { isCompleted: s } = o[e.partNumber];
            return E.jsxs("div", {
                className: "flex items-center h-full flex-shrink-0",
                children: [
                    E.jsxs("button", {
                        className: "h-full text-sm text-foreground font-medium justify-center border-t-[3px] \n rounded-none shadow-none px-4 flex items-center transition-colors " + (s ? "border-t-green-500" : "border-gray-400"),
                        onClick: () => d(e.partNumber),
                        "aria-label": `Part ${e.partNumber}${s ? " (completed)" : ""}`,
                        children: ["Part ", e.partNumber]
                    }),
                    E.jsx("div", { className: "h-full flex flex-row items-center space-x-1 ml-2 overflow-x-auto pr-2", children: e.numbers.map(p) })
                ]
            })
        },
        f = e => {
            const { isCompleted: s, completedCount: t } = o[e.partNumber];
            return E.jsx(r, {
                variant: "ghost",
                className: "h-full border-t-[3px] text-sm text-primary flex-grow flex-basis-0 font-medium \n rounded-none justify-center transition-colors " + (s ? "border-t-green-500" : "border-transparent"),
                onClick: () => d(e.partNumber),
                "aria-label": `Part ${e.partNumber}, ${t} of ${e.totalQuestions} completed`,
                children: E.jsxs("div", {
                    className: "flex flex-col items-center sm:flex-row sm:items-center sm:justify-center sm:gap-2 text-md px-1",
                    children: [
                        s && E.jsx(X, { size: 20, strokeWidth: 3, className: "text-green-500 hidden sm:block", "aria-hidden": "true" }),
                        E.jsxs("span", { children: ["Part ", e.partNumber] }),
                        E.jsxs("span", { className: "text-xs sm:text-sm text-muted-foreground", children: [t, "/", e.totalQuestions] })
                    ]
                })
            })
        },
        g = e.length > 0 && i;
    return E.jsxs("footer", {
        className: "bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex justify-between items-center",
        "aria-label": "Exam navigation",
        children: [
            E.jsx("div", {
                className: "flex-grow min-w-0 h-[48px] flex items-center bg-white gap-1",
                children: e.map(e => e.numbers && 0 !== e.numbers.length ? E.jsx(P.Fragment, { children: s === e.partNumber ? b(e) : f(e) }, e.partNumber) : null)
            }),
            g && E.jsxs("div", {
                className: "hidden lg:flex items-center space-x-2 mx-2 flex-shrink-0",
                children: [
                    E.jsx(r, { variant: "outline", size: "sm", className: "h-10 w-10 p-0 border border-gray-500", onClick: h, "aria-label": "Previous question", children: E.jsx(Y, { strokeWidth: 3 }) }),
                    E.jsx(r, { variant: "outline", size: "sm", className: "h-10 w-10 p-0 border-gray-500", onClick: x, "aria-label": "Next question", children: E.jsx(J, { strokeWidth: 3 }) })
                ]
            })
        ]
    })
};

const We = ({ timeLeft: e }) => {
    const [s, t] = _.useState(!1), { useInsperaLayout: r } = W();
    if (null == e || e < 0) return null;
    const n = Math.floor(e / 60), a = e % 60, i = e <= 300;
    return E.jsx("div", {
        className: `${r ? "" : "text-sm text-yellow-100"} ${i ? "text-red-500" : ""} font-semibold`,
        onMouseEnter: () => t(!0),
        onMouseLeave: () => t(!1),
        children: s || i ? `${n.toString().padStart(2, "0")}:${a.toString().padStart(2, "0")} left` : n > 0 ? `${n} minute${n > 1 ? "s" : ""} left` : `${a} second${1 !== a ? "s" : ""} left`
    })
};