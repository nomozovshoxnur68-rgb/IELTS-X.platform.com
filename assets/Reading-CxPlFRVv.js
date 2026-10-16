const __vite__mapDeps = (i, m=__vite__mapDeps, d=(m.f || (m.f = ["assets/ListeningTestMain-BsjmEFSg.js", "assets/query-DsA5-mxg.js", "assets/router-gAN6ztYq.js", "assets/ReportIssueDialog-sMeioN4o.js", "assets/index-HS6_bSfL.js", "assets/ui-IJSLl_ge.js", "assets/icons-IGaB-7H7.js", "assets/index-jZY7BBkC.css", "assets/useSpeakingTests-CMINX9XJ.js", "assets/usePracticeTests-CoVQL7Sl.js", "assets/useIssueReports-DGrG-FEN.js", "assets/ListeningQuestionRenderer-CutB7Euv.js", "assets/FlowChartCompletionTest-DgfIVHmB.js", "assets/QuestionFlagButton-Dxm-MG9l.js", "assets/useListeningTests-CMfeUt4m.js", "assets/examResultCalculations-BaIfGSqA.js", "assets/ReadingTestMain-Z4Sw89Ex.js", "assets/ReadingPassageRenderer-b5t5LADt.js", "assets/ExamReadingDivider-DxMFdbe6.js", "assets/WritingTestMain-Nm2IgS3B.js", "assets/SpeakingTestMain-D9msO2lt.js", "assets/MarkdownRenderer-Dwaxn6N7.js", "assets/formatters-D_CuouuD.js", "assets/index-CoGgt-Sd.js", "assets/useTestSolution-EqkI6sxw.js", "assets/fuzzyTextMatching-BDgWYSW1.js", "assets/examIntegrityApi-CZ1znFt4.js", "assets/ListeningTestReview-BH-1P5tW.js", "assets/MockTestExecution-Bh_HzHMN.js", "assets/MockExamResults-CC4jdjDz.js", "assets/MockTestReview-ChckWAc3.js"]))) => i.map(i => d[i]);
import {a as e, l as s, k as t, B as r, u as n, y as a, Y as i, a0 as o, Z as l, _ as c, $ as d, r as m, C as u, e as x, f as h, p, g as b, b as f, a$ as g, b0 as j, a1 as N, a2 as v, a3 as w, I as y, a5 as k, T as S, z as C, D as T, E as A, b1 as I} from "./index-HS6_bSfL.js";
import {j as E, b as R, u as q} from "./query-DsA5-mxg.js";
import {a as _, R as P, c as L, e as $, u as O, h as M, i as G, j as W} from "./router-gAN6ztYq.js";
import {i as F, aO as Q, ar as K, K as z, aW as D, aX as U, aY as B, aZ as H, a_ as V, ae as Y, $ as J, S as X, a as Z, b as ee, a$ as se, b0 as te, T as re, v as ne, h as ae, b1 as ie, b2 as oe, aj as le, X as ce, M as de, aN as me, y as ue, C as xe, B as he, a9 as pe, s as be, a7 as fe, q as ge, a2 as je, J as Ne, z as ve} from "./icons-IGaB-7H7.js";
import {c as we, Q as ye, r as ke, f as Se, h as Ce, i as Te, H as Ae, j as Ie, k as Ee, l as Re} from "./useSpeakingTests-CMINX9XJ.js";
import {t as qe} from "./usePracticeTests-CoVQL7Sl.js";
import {M as _e} from "./MarkdownRenderer-Dwaxn6N7.js";
import {b as Pe} from "./useIssueReports-DGrG-FEN.js";
import {t as Le, g as $e} from "./formatters-D_CuouuD.js";
import {u as Oe} from "./index-CoGgt-Sd.js";
import {n as Me, s as Ge, c as We} from "./useTestSolution-EqkI6sxw.js";
import {h as Fe, s as Qe, f as Ke, a as ze} from "./fuzzyTextMatching-BDgWYSW1.js";
import {e as De} from "./examIntegrityApi-CZ1znFt4.js";
function Ue({userInfoContent: r, timeContent: n, button: a, className: i}) {
    const o = e()
      , l = !r && !n && !a;
    return E.jsxs("header", {
        className: `grid shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(2.5rem,1fr)] items-center gap-2 border-b border-b-gray-300 px-2 py-1 sm:px-4 ${l ? "min-h-7" : "min-h-10"} ${i || ""}`,
        children: [E.jsxs("div", {
            className: "flex min-w-0 items-center gap-2",
            children: [E.jsx("img", {
                className: "h-6 shrink-0 sm:h-7",
                src: "light" === o ? s : t,
                alt: "IELTS Logo"
            }), E.jsx("div", {
                className: "min-w-0 overflow-hidden",
                children: r
            })]
        }), E.jsx("div", {
            className: "flex min-w-0 items-center justify-center gap-2 whitespace-nowrap",
            children: n
        }), E.jsx("div", {
            className: "flex min-w-0 items-center justify-end gap-2",
            children: a
        })]
    })
}
const Be = e => {
    const s = document.getElementById(`question-${e}`);
    s && (s.scrollIntoView({
        behavior: "smooth",
        block: "center"
    }),
    s.focus())
}
  , He = ({parts: e, currentPart: s, examStore: t, onPartChange: n, renderBefore: a, renderAfter: i}) => {
    const {answers: o={}, flaggedQuestions: l={}, activeQuestionId: c, setActiveQuestion: d} = t
      , m = _.useMemo( () => {
        const s = {};
        return e.forEach(e => {
            let t = 0;
            e.numbers.forEach(e => {
                t += ( (e, s) => {
                    if (!s || "" === s.trim())
                        return 0;
                    if (e.includes("-")) {
                        const t = e.split("-").map(e => parseInt(e, 10));
                        return Math.min(s.trim().length, t.length)
                    }
                    return 1
                }
                )(e, o[e])
            }
            ),
            s[e.partNumber] = {
                isCompleted: t === e.totalQuestions,
                completedCount: t
            }
        }
        ),
        s
    }
    , [o, e])
      , u = _.useMemo( () => e.find(e => e.partNumber === s), [e, s])
      , x = _.useCallback(e => {
        d && (d(e),
        Be(e))
    }
    , [d])
      , h = _.useCallback(e => {
        if (!u || !d || 0 === u.numbers.length)
            return;
        const {numbers: s} = u;
        let t;
        if (c) {
            const r = s.indexOf(c);
            t = -1 === r ? s[0] : "next" === e ? r === s.length - 1 ? s[0] : s[r + 1] : 0 === r ? s[s.length - 1] : s[r - 1]
        } else
            t = s[0];
        d(t),
        Be(t)
    }
    , [u, c, d])
      , p = _.useCallback( () => {
        h("next")
    }
    , [h])
      , b = _.useCallback( () => {
        h("previous")
    }
    , [h])
      , f = t => {
        const {isCompleted: r} = m[t.partNumber];
        return E.jsxs("div", {
            className: "flex h-full min-w-max flex-shrink-0 items-center",
            children: [E.jsxs("button", {
                type: "button",
                className: "h-full text-base text-foreground font-semibold justify-center border-t-[3px]\n            rounded-none shadow-none px-2 sm:px-4 flex items-center transition-colors " + (r ? "border-t-green-500" : "border-gray-400"),
                onClick: () => n(t.partNumber),
                "aria-label": `Part ${t.partNumber}${r ? " (completed)" : ""}`,
                children: ["Part ", t.partNumber]
            }), E.jsx("div", {
                className: "flex h-full max-w-[calc(100vw-9rem)] flex-row items-center space-x-1 overflow-x-auto sm:ml-2 sm:max-w-none sm:pr-2",
                children: t.numbers.map( (t, r) => ( (t, r) => {
                    const n = o[t]
                      , a = void 0 !== n && "" !== n
                      , i = t === c
                      , d = Boolean(l[t])
                      , m = t.length > 5 && !/^\d+-\d+$/.test(t) ? (e.filter(e => e.partNumber < s).reduce( (e, s) => e + s.numbers.length, 0) + r + 1).toString() : t;
                    return E.jsxs("div", {
                        className: "relative border-t-[3px] flex h-full flex-shrink-0 items-center justify-center " + (a ? "border-green-500" : "border-gray-400"),
                        children: [d && E.jsx(Q, {
                            className: "pointer-events-none absolute left-1/2 top-0 z-10 h-3.5 w-3.5 -translate-x-1/2 text-red-600",
                            fill: "currentColor",
                            strokeWidth: 2.5,
                            "aria-hidden": "true"
                        }), E.jsx("button", {
                            type: "button",
                            className: "h-7 min-w-6 text-base text-foreground shadow-none border-2 rounded-sm\n            hover:border-blue-500 hover:font-semibold transition-colors " + (i ? "border-blue-500 font-semibold" : "border-transparent"),
                            onClick: e => {
                                e.stopPropagation(),
                                x(t)
                            }
                            ,
                            "aria-label": `Question ${m}${a ? " (answered)" : ""}${d ? " (flagged)" : ""}`,
                            children: m
                        })]
                    }, t)
                }
                )(t, r))
            })]
        })
    }
      , g = e => {
        const {isCompleted: s, completedCount: t} = m[e.partNumber];
        return E.jsx(r, {
            variant: "ghost",
            className: "h-full min-w-16 flex-none border-t-[3px] text-base font-normal\n          rounded-none justify-center transition-colors sm:min-w-28 sm:flex-1 sm:basis-0 " + (s ? "border-t-green-500" : "border-transparent"),
            onClick: () => n(e.partNumber),
            "aria-label": `Part ${e.partNumber}, ${t} of ${e.totalQuestions} completed`,
            children: E.jsxs("div", {
                className: "flex flex-col items-center px-1 text-base sm:flex-row sm:items-center sm:justify-center sm:gap-2",
                children: [s && E.jsx(F, {
                    size: 20,
                    strokeWidth: 3,
                    className: "text-green-500 hidden sm:block",
                    "aria-hidden": "true"
                }), E.jsxs("span", {
                    children: ["Part ", e.partNumber]
                }), E.jsxs("span", {
                    className: "text-xs sm:text-sm text-muted-foreground",
                    children: [t, "/", e.totalQuestions]
                })]
            })
        }, e.partNumber)
    }
      , j = {
        showNavigation: Boolean(e.length > 0 && u),
        onPreviousQuestion: b,
        onNextQuestion: p
    };
    return E.jsxs(E.Fragment, {
        children: [a?.(j), E.jsx("div", {
            className: "flex h-[53px] min-w-0 flex-1 items-center gap-1 overflow-x-auto bg-white",
            children: e.map(e => e.numbers && 0 !== e.numbers.length ? E.jsx(P.Fragment, {
                children: s === e.partNumber ? f(e) : g(e)
            }, e.partNumber) : null)
        }), i?.(j)]
    })
}
  , Ve = ({parts: e, currentPart: s, examStore: t, onPartChange: n}) => E.jsx("footer", {
    className: "flex min-w-0 items-center justify-between overflow-hidden border-t border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
    "aria-label": "Exam navigation",
    children: E.jsx(He, {
        parts: e,
        currentPart: s,
        examStore: t,
        onPartChange: n,
        renderAfter: ({showNavigation: e, onPreviousQuestion: s, onNextQuestion: t}) => e ? E.jsxs("div", {
            className: "hidden lg:flex items-center space-x-2 mx-2 flex-shrink-0",
            children: [E.jsx(r, {
                variant: "outline",
                size: "sm",
                className: "h-10 w-10 p-0 border border-gray-500",
                onClick: s,
                "aria-label": "Previous question",
                children: E.jsx(K, {
                    strokeWidth: 3
                })
            }), E.jsx(r, {
                variant: "outline",
                size: "sm",
                className: "h-10 w-10 p-0 border border-gray-500",
                onClick: t,
                "aria-label": "Next question",
                children: E.jsx(z, {
                    strokeWidth: 3
                })
            })]
        }) : null
    })
})
  , Ye = ({timeLeft: e}) => {
    const [s,t] = _.useState(!1)
      , {useIELTSXLayout: r, useInsperaLayout: n} = we();
    if (null == e || e < 0)
        return null;
    const a = Math.floor(e / 60)
      , i = e % 60
      , o = e <= 300;
    return E.jsxs("div", {
        className: `whitespace-nowrap ${r || n ? "text-xs sm:text-sm" : "text-sm text-yellow-100"} ${o ? "text-red-500" : ""} ${n ? "font-normal" : "font-semibold"}`,
        onMouseEnter: () => !n && t(!0),
        onMouseLeave: () => !n && t(!1),
        children: [E.jsx("span", {
            className: "sm:hidden",
            children: o || 0 === a ? `${a.toString().padStart(2, "0")}:${i.toString().padStart(2, "0")}` : `${a}m left`
        }), E.jsx("span", {
            className: "hidden sm:inline",
            children: ( () => {
                const e = "remaining";
                return o || !n && s ? a > 0 && i > 0 ? `${a} minute${1 !== a ? "s" : ""}, ${i} second${1 !== i ? "s" : ""} ${e}` : a > 0 ? `${a} minute${1 !== a ? "s" : ""} ${e}` : `${i} second${1 !== i ? "s" : ""} ${e}` : a > 0 ? `${a} minute${a > 1 ? "s" : ""} ${e}` : `${i} second${1 !== i ? "s" : ""} ${e}`
            }
            )()
        })]
    })
}
  , Je = ({candidateInfo: e}) => {
    const {user: s} = n()
      , t = e?.email || e?.phone || e?.candidateId || s?.email;
    return E.jsx("div", {
        className: "ml-1 min-w-0 text-xs sm:ml-3 sm:text-sm text-primary",
        children: t && E.jsx("span", {
            className: "font-semibold truncate block",
            children: t
        })
    })
}
;
function Xe({instruction: e, audioPlayer: s}) {
    return E.jsx("div", {
        className: "p-2 sm:p-3",
        children: E.jsx("div", {
            className: "rounded border border-gray-300 bg-[#F1F2EC] p-2 dark:bg-secondary sm:p-3",
            children: E.jsxs("div", {
                className: "flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-4",
                children: [E.jsxs("div", {
                    className: "min-w-0 flex-[0.8] text-sm sm:text-base",
                    children: [E.jsx("p", {
                        className: "font-bold",
                        children: e.title
                    }), E.jsx("p", {
                        className: "",
                        children: e.instruction
                    })]
                }), s && E.jsx("div", {
                    className: "w-full max-w-5xl flex-[2]",
                    children: s
                })]
            })
        })
    })
}
const Ze = ({sectionInstruction: e, timeLeft: s, children: t, parts: r, currentPart: n, onPartChange: a, examStore: i, button: o, audioPlayer: l, candidateInfo: c, isAudioPlaying: d}) => {
    const m = null != s && s <= 60 && s > 0;
    return E.jsxs("div", {
        className: "flex h-[100dvh] flex-col overflow-hidden bg-white",
        onContextMenu: e => {
            e.preventDefault()
        }
        ,
        children: [E.jsx(Ue, {
            userInfoContent: E.jsx(Je, {
                candidateInfo: c
            }),
            timeContent: E.jsx("div", {
                className: "flex items-center gap-4",
                children: E.jsx(Ye, {
                    timeLeft: s
                })
            }),
            button: o,
            className: m ? "!bg-[#f8d7da] border-b-[#f5c6cb]" : ""
        }), E.jsxs("main", {
            className: "flex min-h-0 flex-1 flex-col overflow-hidden bg-white px-1 mt-2 sm:mt-4",
            children: [E.jsx("div", {
                className: "shrink-0 border-gray-200",
                children: E.jsx(Xe, {
                    instruction: e,
                    audioPlayer: l
                })
            }), E.jsx("section", {
                className: "min-h-0 flex-1 text-content",
                children: E.jsx("div", {
                    id: "exam-content",
                    className: "test-content h-full overflow-y-auto bg-white",
                    children: t
                })
            })]
        }), E.jsx("div", {
            className: "shrink-0 border-t border-gray-200 bg-white",
            children: E.jsx(Ve, {
                parts: r,
                currentPart: n,
                onPartChange: a,
                examStore: i
            })
        })]
    })
}
;
function es({userInfoContent: e, timeContent: t, audioContent: r, button: n, volume: a=.5, onVolumeChange: i, isMockExam: o=!1, className: l}) {
    const [c,d] = _.useState(!1)
      , [m,u] = _.useState(a)
      , [x,h] = _.useState(!1)
      , p = _.useRef(null)
      , [b,f] = _.useState(!1);
    _.useEffect( () => {
        const e = () => {
            f(!!document.fullscreenElement)
        }
        ;
        return document.addEventListener("fullscreenchange", e),
        () => {
            document.removeEventListener("fullscreenchange", e)
        }
    }
    , []);
    _.useEffect( () => {
        u(a),
        h(0 === a)
    }
    , [a]),
    _.useEffect( () => {
        const e = e => {
            p.current && !p.current.contains(e.target) && d(!1)
        }
        ;
        return document.addEventListener("mousedown", e),
        () => document.removeEventListener("mousedown", e)
    }
    , []);
    return E.jsxs("header", {
        className: `flex min-h-12 shrink-0 items-center justify-between gap-2 border-b border-gray-300 px-2 py-1 text-primary sm:h-14 sm:px-4 transition-colors duration-200 ${l || "bg-white"}`,
        children: [E.jsxs("div", {
            className: "flex min-w-0 flex-1 items-center gap-2 sm:gap-4",
            children: [E.jsx("img", {
                className: "h-7 w-auto shrink-0 sm:h-8",
                src: s,
                alt: "IELTSX"
            }), E.jsxs("div", {
                className: "flex min-w-0 flex-col justify-center leading-tight",
                children: [E.jsx("div", {
                    className: "min-w-0",
                    children: e
                }), (r || t) && E.jsxs("div", {
                    className: "flex min-w-0 items-center gap-3 text-[13px] text-primary sm:text-[14px]",
                    children: [t, r]
                })]
            })]
        }), E.jsxs("div", {
            className: "flex shrink-0 items-center gap-1 text-primary sm:gap-6",
            children: [o ? E.jsx("div", {
                className: "flex h-10 w-10 items-center justify-center rounded-full text-primary",
                title: "Network status",
                "aria-label": "Network status",
                role: "img",
                children: E.jsx(D, {
                    className: "h-6 w-6",
                    strokeWidth: 2
                })
            }) : E.jsx("button", {
                type: "button",
                className: "flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors",
                onClick: () => {
                    document.fullscreenElement ? document.exitFullscreen().catch( () => {}
                    ) : document.documentElement.requestFullscreen().catch( () => {}
                    )
                }
                ,
                title: b ? "Exit fullscreen" : "Enter fullscreen",
                "aria-label": b ? "Exit fullscreen" : "Enter fullscreen",
                children: b ? E.jsx(U, {
                    className: "h-6 w-6",
                    strokeWidth: 2
                }) : E.jsx(B, {
                    className: "h-6 w-6",
                    strokeWidth: 2
                })
            }), E.jsxs("div", {
                ref: p,
                className: "relative flex items-center",
                children: [E.jsx("button", {
                    type: "button",
                    className: "flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors",
                    onClick: () => d(!c),
                    title: "Adjust volume",
                    "aria-label": "Adjust volume",
                    children: x || 0 === m ? E.jsx(H, {
                        className: "h-6 w-6",
                        strokeWidth: 2
                    }) : E.jsx(V, {
                        className: "h-6 w-6",
                        strokeWidth: 2
                    })
                }), c && E.jsxs("div", {
                    className: "absolute right-0 top-12 z-50 flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg",
                    children: [E.jsx("button", {
                        type: "button",
                        onClick: () => {
                            x ? (h(!1),
                            i?.(m || .5)) : (h(!0),
                            i?.(0))
                        }
                        ,
                        className: "text-primary hover:text-gray-600 transition-colors",
                        children: x || 0 === m ? E.jsx(H, {
                            size: 18
                        }) : E.jsx(V, {
                            size: 18
                        })
                    }), E.jsx("input", {
                        type: "range",
                        min: "0",
                        max: "1",
                        step: "0.01",
                        value: x ? 0 : m,
                        onChange: e => {
                            const s = parseFloat(e.target.value);
                            u(s),
                            i?.(s),
                            h(!(s > 0))
                        }
                        ,
                        className: "w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600",
                        style: {
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${100 * (x ? 0 : m)}%, #e5e7eb ${100 * (x ? 0 : m)}%, #e5e7eb 100%)`
                        }
                    })]
                })]
            }), n]
        })]
    })
}
const ss = ({parts: e, currentPart: s, examStore: t, onPartChange: r, onSubmitClick: n}) => E.jsx("footer", {
    className: "relative flex min-w-0 items-center justify-between border-t border-gray-300",
    "aria-label": "Exam navigation",
    children: E.jsx(He, {
        parts: e,
        currentPart: s,
        examStore: t,
        onPartChange: r,
        renderBefore: ({showNavigation: e, onPreviousQuestion: s, onNextQuestion: t}) => e ? E.jsxs("div", {
            className: "absolute bottom-[calc(100%+0.75rem)] right-2 z-20 flex items-center gap-1.5 sm:bottom-[calc(100%+2rem)] sm:right-10",
            children: [E.jsx("button", {
                type: "button",
                className: "flex h-10 w-10 items-center justify-center rounded bg-[#4c4c4c] dark:bg-secondary text-white dark:text-secondary-foreground transition-colors hover:bg-[#3d3d3d] dark:hover:bg-secondary/80 sm:h-14 sm:w-14",
                onClick: s,
                "aria-label": "Previous question",
                children: E.jsx(K, {
                    className: "h-6 w-6 sm:h-8 sm:w-8",
                    strokeWidth: 5
                })
            }), E.jsx("button", {
                type: "button",
                className: "flex h-10 w-10 items-center justify-center rounded bg-black dark:bg-secondary text-white dark:text-secondary-foreground transition-colors hover:bg-[#262626] dark:hover:bg-secondary/80 sm:h-14 sm:w-14",
                onClick: t,
                "aria-label": "Next question",
                children: E.jsx(z, {
                    className: "h-6 w-6 sm:h-8 sm:w-8",
                    strokeWidth: 5
                })
            })]
        }) : null,
        renderAfter: () => E.jsx("button", {
            type: "button",
            className: "group flex h-[53px] w-14 shrink-0 items-center justify-center bg-[#efefef] dark:bg-secondary transition-colors hover:bg-[#262626] dark:hover:bg-primary sm:w-20 md:ml-5",
            onClick: n,
            "aria-label": "Submit exam section",
            children: E.jsx(F, {
                className: "h-5 w-5 text-gray-600 dark:text-secondary-foreground group-hover:text-white dark:group-hover:text-primary-foreground",
                strokeWidth: 6
            })
        })
    })
})
  , ts = ({candidateInfo: e}) => {
    const {user: s} = n()
      , t = e?.email || e?.phone || e?.candidateId || s?.email;
    return E.jsx("div", {
        className: "min-w-0 text-sm leading-5 sm:text-base text-primary",
        children: t && E.jsx("span", {
            className: "block truncate font-semibold",
            children: t
        })
    })
}
;
function rs({instruction: e, audioPlayer: s}) {
    return E.jsx("div", {
        className: "p-2 sm:p-3",
        children: E.jsx("div", {
            className: "rounded border border-gray-300 bg-[#F1F2EC] p-2 dark:bg-secondary sm:p-3",
            children: E.jsxs("div", {
                className: "flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-4",
                children: [E.jsxs("div", {
                    className: "min-w-0 flex-[0.8] text-sm sm:text-base",
                    children: [E.jsx("p", {
                        className: "font-bold",
                        children: e.title
                    }), E.jsx("p", {
                        className: "",
                        children: e.instruction
                    })]
                }), s && E.jsx("div", {
                    className: "w-full max-w-5xl flex-[2]",
                    children: s
                })]
            })
        })
    })
}
const ns = ({sectionInstruction: e, timeLeft: s, children: t, parts: r, currentPart: n, onPartChange: a, onSubmitClick: i, examStore: o, button: l, audioContent: c, audioPlayer: d, candidateInfo: m, volume: u, onVolumeChange: x, isAudioPlaying: h, isMockExam: p=!1}) => {
    const b = null != s && s <= 60 && s > 0;
    return E.jsxs("div", {
        className: "flex h-[100dvh] flex-col overflow-hidden bg-white layout-inspera",
        style: {
            fontFamily: "Arial, sans-serif"
        },
        onContextMenu: e => {
            e.preventDefault()
        }
        ,
        children: [E.jsx(es, {
            userInfoContent: E.jsx(ts, {
                candidateInfo: m
            }),
            timeContent: E.jsx("div", {
                className: "flex items-center gap-2",
                children: E.jsx(Ye, {
                    timeLeft: s
                })
            }),
            audioContent: c,
            button: l,
            volume: u,
            onVolumeChange: x,
            isMockExam: p,
            className: b ? "!bg-[#f8d7da] border-b-[#f5c6cb]" : ""
        }), E.jsxs("main", {
            className: "flex min-h-0 flex-1 flex-col overflow-hidden bg-white px-1",
            children: [E.jsx("div", {
                className: "shrink-0 border-gray-200",
                children: E.jsx(rs, {
                    instruction: e,
                    audioPlayer: d
                })
            }), E.jsx("section", {
                className: "min-h-0 flex-1 text-content",
                children: E.jsx("div", {
                    id: "exam-content",
                    className: "test-content h-full overflow-y-auto bg-white",
                    children: t
                })
            })]
        }), E.jsx("div", {
            className: "shrink-0 bg-white",
            children: E.jsx(ss, {
                parts: r,
                currentPart: n,
                onPartChange: a,
                examStore: o,
                onSubmitClick: i
            })
        })]
    })
}
  , as = e => {
    const {layout: s} = we()
      , t = "inspera" === s ? ns : Ze;
    return E.jsx(t, {
        ...e
    })
}
  , is = ({onConfirm: e, onCancel: s, title: t, description: n, confirmText: a="Confirm", cancelText: i="Cancel"}) => E.jsx("div", {
    className: "border border-border fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm",
    children: E.jsxs("div", {
        className: "rounded-lg bg-popover p-8 shadow-lg max-w-md w-full",
        children: [E.jsxs("div", {
            className: "flex items-center justify-center",
            children: [E.jsx(Y, {
                className: "mr-2 h-6 w-6 text-yellow-500"
            }), E.jsx("h2", {
                className: "text-xl font-semibold",
                children: t
            })]
        }), E.jsx("p", {
            className: "mt-4 text-center text-muted-foreground",
            children: n
        }), E.jsxs("div", {
            className: "mt-6 flex justify-center gap-4",
            children: [E.jsx(r, {
                variant: "outline",
                onClick: s,
                children: i
            }), E.jsx(r, {
                onClick: e,
                children: a
            })]
        })]
    })
})
  , os = [.75, 1, 1.25, 1.5, 2]
  , ls = e => 1 === e ? "Normal" : `${e.toFixed(2).replace(/\.?0+$/, "")}x`
  , cs = ({children: e, onBackClick: s, hideExit: t=!1, onReportIssueClick: r, audioSpeed: n=1, onAudioSpeedChange: m}) => {
    const {theme: u, setTheme: x, textSize: h, setTextSize: p} = a()
      , [b,f] = _.useState(!1)
      , [g,j] = _.useState(!1)
      , N = e => ["p-2 rounded border flex items-center gap-2 text-sm", u === e ? "bg-muted border-border text-foreground" : "bg-background border-border text-muted-foreground hover:bg-muted", "transition-colors"].join(" ")
      , v = e => ["p-2 rounded border flex items-center gap-2 text-sm", h === e ? "bg-muted border-border text-foreground" : "bg-background border-border text-muted-foreground hover:bg-muted", "transition-colors"].join(" ")
      , w = e => ["p-2 rounded border flex items-center justify-center gap-2 text-sm", n === e ? "bg-muted border-border text-foreground" : "bg-background border-border text-muted-foreground hover:bg-muted", "transition-colors"].join(" ");
    return E.jsxs(i, {
        open: g,
        onOpenChange: j,
        children: [E.jsx(o, {
            asChild: !0,
            children: e
        }), E.jsxs(l, {
            className: "max-w-lg",
            children: [E.jsx(c, {
                children: E.jsxs(d, {
                    className: "flex items-center gap-2",
                    children: [E.jsx(J, {
                        size: 20
                    }), "Exam Settings"]
                })
            }), E.jsxs("div", {
                className: "space-y-6",
                children: [E.jsxs("div", {
                    children: [E.jsxs("h3", {
                        className: "text-sm font-medium text-foreground mb-3 flex items-center gap-2",
                        children: [E.jsx(X, {
                            size: 16
                        }), "Theme"]
                    }), E.jsxs("div", {
                        className: "grid grid-cols-1 gap-2",
                        children: [E.jsxs("button", {
                            className: N("light"),
                            onClick: () => x("light"),
                            children: [E.jsx(X, {
                                size: 16
                            }), "Light"]
                        }), E.jsxs("button", {
                            className: N("dark"),
                            onClick: () => x("dark"),
                            children: [E.jsx(Z, {
                                size: 16
                            }), "Dark"]
                        }), E.jsxs("button", {
                            className: N("system"),
                            onClick: () => x("system"),
                            children: [E.jsx(ee, {
                                size: 16
                            }), "System"]
                        })]
                    })]
                }), E.jsxs("div", {
                    children: [E.jsxs("h3", {
                        className: "text-sm font-medium text-foreground mb-3 flex items-center gap-2",
                        children: [E.jsx(se, {
                            size: 16
                        }), "Text Size"]
                    }), E.jsxs("div", {
                        className: "grid grid-cols-1 gap-2",
                        children: [E.jsx("button", {
                            className: v("default"),
                            onClick: () => p("default"),
                            children: E.jsx("span", {
                                className: "text-sm",
                                children: "Default"
                            })
                        }), E.jsx("button", {
                            className: v("large"),
                            onClick: () => p("large"),
                            children: E.jsx("span", {
                                className: "text-base",
                                children: "Large"
                            })
                        }), E.jsx("button", {
                            className: v("extra-large"),
                            onClick: () => p("extra-large"),
                            children: E.jsx("span", {
                                className: "text-lg",
                                children: "Extra Large"
                            })
                        })]
                    })]
                }), m && E.jsxs("div", {
                    children: [E.jsxs("h3", {
                        className: "text-sm font-medium text-foreground mb-3 flex items-center gap-2",
                        children: [E.jsx(te, {
                            size: 16
                        }), "Audio Speed"]
                    }), E.jsx("div", {
                        className: "grid grid-cols-5 gap-2",
                        children: os.map(e => E.jsx("button", {
                            className: w(e),
                            onClick: () => m(e),
                            children: E.jsx("span", {
                                children: ls(e)
                            })
                        }, e))
                    }), E.jsx("p", {
                        className: "mt-2 text-xs text-muted-foreground",
                        children: "Playback speed only affects practice audio."
                    })]
                }), r && E.jsx("div", {
                    children: E.jsxs("button", {
                        className: "group w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-amber-900/50 dark:bg-amber-950/30 dark:hover:bg-amber-950/50",
                        onClick: () => {
                            j(!1),
                            r()
                        }
                        ,
                        children: [E.jsxs("span", {
                            className: "flex items-center gap-2 text-sm font-medium text-foreground",
                            children: [E.jsx(re, {
                                size: 16,
                                className: "text-amber-600 dark:text-amber-400"
                            }), "Report Issue"]
                        }), E.jsx("span", {
                            className: "mt-1 block text-xs text-muted-foreground",
                            children: "Tell us if something is missing, broken, or incorrect."
                        })]
                    })
                }), s && !t && E.jsx("div", {
                    children: E.jsxs("button", {
                        className: "group w-full rounded-lg border border-border bg-card/60 px-4 py-3 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        onClick: () => {
                            j(!1),
                            f(!0)
                        }
                        ,
                        children: [E.jsxs("span", {
                            className: "flex items-center gap-2 text-sm font-medium text-foreground",
                            children: [E.jsx(K, {
                                size: 16,
                                className: "text-muted-foreground group-hover:text-foreground"
                            }), "Leave Test Without Saving"]
                        }), E.jsx("span", {
                            className: "mt-1 block text-xs text-muted-foreground",
                            children: "Return to the tests page."
                        })]
                    })
                })]
            })]
        }), b && E.jsx(is, {
            title: "Leave Test",
            description: "Are you sure you want to exit? Your progress will not be saved and you'll return to the tests page.",
            confirmText: "Leave Test",
            cancelText: "Keep Working",
            onConfirm: () => {
                f(!1),
                s?.()
            }
            ,
            onCancel: () => f(!1)
        })]
    })
}
  , ds = [.75, 1, 1.25, 1.5, 2]
  , ms = ({children: e, onSubmitClick: s, onBackClick: t, hideExit: r=!1, onReportIssueClick: n, audioSpeed: i=1, onAudioSpeedChange: o}) => {
    const {theme: l, setTheme: c, textSize: d, setTextSize: m} = a()
      , [u,x] = _.useState(!1)
      , [h,p] = _.useState(!1)
      , [b,f] = _.useState("main")
      , g = () => {
        p(!1)
    }
      , j = [{
        id: "light",
        label: "Black on white",
        preview: E.jsxs("div", {
            className: "w-10 h-6 border border-gray-300 rounded bg-white flex flex-col justify-center gap-[3px] p-[3px] shrink-0",
            children: [E.jsx("div", {
                className: "w-full h-[2px] bg-gray-600 rounded-xs"
            }), E.jsx("div", {
                className: "w-4/5 h-[2px] bg-gray-600 rounded-xs"
            }), E.jsx("div", {
                className: "w-full h-[2px] bg-gray-600 rounded-xs"
            })]
        })
    }, {
        id: "dark",
        label: "White on black",
        preview: E.jsxs("div", {
            className: "w-10 h-6 border border-neutral-700 rounded bg-black flex flex-col justify-center gap-[3px] p-[3px] shrink-0",
            children: [E.jsx("div", {
                className: "w-full h-[2px] bg-white rounded-xs"
            }), E.jsx("div", {
                className: "w-4/5 h-[2px] bg-white rounded-xs"
            }), E.jsx("div", {
                className: "w-full h-[2px] bg-white rounded-xs"
            })]
        })
    }]
      , N = (e, s) => E.jsxs("div", {
        className: "flex h-16 shrink-0 items-center justify-between px-6 border-b border-border bg-background",
        children: [E.jsx("div", {
            className: "w-24",
            children: s && E.jsxs("button", {
                onClick: () => f("main"),
                className: "flex items-center gap-1 text-[16px] font-semibold text-foreground hover:opacity-75 transition-opacity",
                children: [E.jsx(le, {
                    size: 20,
                    strokeWidth: 2.5,
                    className: "text-foreground"
                }), "Options"]
            })
        }), E.jsx("h2", {
            className: "text-[20px] font-bold text-foreground",
            children: e
        }), E.jsx("div", {
            className: "w-24 flex justify-end",
            children: E.jsx("button", {
                onClick: g,
                className: "p-2 hover:bg-muted rounded-full transition-colors text-foreground animate-none",
                "aria-label": "Close menu",
                children: E.jsx(ce, {
                    className: "h-6 w-6 text-foreground",
                    strokeWidth: 2.5
                })
            })
        })]
    });
    return E.jsxs(E.Fragment, {
        children: [P.cloneElement(e, {
            onClick: () => {
                f("main"),
                p(!0)
            }
        }), h && L.createPortal(E.jsxs("div", {
            className: "fixed inset-0 m-0 h-screen w-screen bg-background flex flex-col z-[9999] overflow-y-auto text-foreground",
            children: ["main" === b && E.jsxs(E.Fragment, {
                children: [N("Options", !1), E.jsx("div", {
                    className: "flex-1 flex flex-col items-center pt-[8vh] px-4 bg-background",
                    children: E.jsxs("div", {
                        className: "w-full max-w-[480px] bg-card border border-border rounded-lg overflow-hidden shadow-sm divide-y divide-border",
                        children: [E.jsxs("button", {
                            onClick: () => {
                                p(!1),
                                s?.()
                            }
                            ,
                            className: "w-full flex items-center justify-between p-4 bg-[#e31c3d] hover:bg-[#c91834] text-white font-medium transition-colors",
                            children: [E.jsxs("div", {
                                className: "flex items-center gap-4",
                                children: [E.jsx(ne, {
                                    size: 18,
                                    className: "transform rotate-45 text-white"
                                }), E.jsx("span", {
                                    className: "text-white",
                                    children: "Go to submission page"
                                })]
                            }), E.jsx(ae, {
                                size: 18,
                                className: "text-white"
                            })]
                        }), E.jsxs("button", {
                            onClick: () => f("contrast"),
                            className: "w-full flex items-center justify-between p-4 bg-card hover:bg-muted text-foreground font-medium transition-colors",
                            children: [E.jsxs("div", {
                                className: "flex items-center gap-4",
                                children: [E.jsx(ie, {
                                    size: 18,
                                    className: "text-muted-foreground"
                                }), E.jsx("span", {
                                    className: "text-foreground",
                                    children: "Contrast"
                                })]
                            }), E.jsx(ae, {
                                size: 18,
                                className: "text-muted-foreground"
                            })]
                        }), E.jsxs("button", {
                            onClick: () => f("text-size"),
                            className: "w-full flex items-center justify-between p-4 bg-card hover:bg-muted text-foreground font-medium transition-colors",
                            children: [E.jsxs("div", {
                                className: "flex items-center gap-4",
                                children: [E.jsx(oe, {
                                    size: 18,
                                    className: "text-muted-foreground"
                                }), E.jsx("span", {
                                    className: "text-foreground",
                                    children: "Text size"
                                })]
                            }), E.jsx(ae, {
                                size: 18,
                                className: "text-muted-foreground"
                            })]
                        }), o && E.jsxs("button", {
                            onClick: () => f("audio-speed"),
                            className: "w-full flex items-center justify-between p-4 bg-card hover:bg-muted text-foreground font-medium transition-colors",
                            children: [E.jsxs("div", {
                                className: "flex items-center gap-4",
                                children: [E.jsx(te, {
                                    size: 18,
                                    className: "text-muted-foreground"
                                }), E.jsx("span", {
                                    className: "text-foreground",
                                    children: "Audio speed"
                                })]
                            }), E.jsx(ae, {
                                size: 18,
                                className: "text-muted-foreground"
                            })]
                        }), n && E.jsxs("button", {
                            onClick: () => {
                                p(!1),
                                n()
                            }
                            ,
                            className: "w-full flex items-center justify-between p-4 bg-card hover:bg-muted text-foreground font-medium transition-colors",
                            children: [E.jsxs("div", {
                                className: "flex items-center gap-4",
                                children: [E.jsx(re, {
                                    size: 18,
                                    className: "text-muted-foreground"
                                }), E.jsx("span", {
                                    className: "text-foreground",
                                    children: "Report issue"
                                })]
                            }), E.jsx(ae, {
                                size: 18,
                                className: "text-muted-foreground"
                            })]
                        }), t && !r && E.jsxs("button", {
                            onClick: () => {
                                p(!1),
                                x(!0)
                            }
                            ,
                            className: "w-full flex items-center justify-between p-4 bg-card hover:bg-muted text-foreground font-medium transition-colors",
                            children: [E.jsxs("div", {
                                className: "flex items-center gap-4",
                                children: [E.jsx(K, {
                                    size: 18,
                                    className: "text-muted-foreground"
                                }), E.jsx("span", {
                                    className: "text-foreground",
                                    children: "Leave test without saving"
                                })]
                            }), E.jsx(ae, {
                                size: 18,
                                className: "text-muted-foreground"
                            })]
                        })]
                    })
                })]
            }), "contrast" === b && E.jsxs(E.Fragment, {
                children: [N("Contrast", !0), E.jsx("div", {
                    className: "flex-1 flex flex-col items-center pt-[8vh] px-4 overflow-y-auto bg-background",
                    children: E.jsx("div", {
                        className: "w-full max-w-[480px] bg-card border border-border rounded-lg overflow-hidden shadow-sm divide-y divide-border",
                        children: j.map(e => {
                            const s = l === e.id || "light" === e.id && "system" === l;
                            return E.jsxs("button", {
                                onClick: () => c(e.id),
                                className: "w-full flex items-center justify-between p-4 bg-card hover:bg-muted transition-colors text-foreground",
                                children: [E.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [E.jsx("div", {
                                        className: "w-5 flex items-center justify-center",
                                        children: s && E.jsx(F, {
                                            size: 18,
                                            className: "text-foreground font-bold",
                                            strokeWidth: 3
                                        })
                                    }), E.jsx("span", {
                                        className: "text-foreground font-medium",
                                        children: e.label
                                    })]
                                }), e.preview]
                            }, e.id)
                        }
                        )
                    })
                })]
            }), "text-size" === b && E.jsxs(E.Fragment, {
                children: [N("Text size", !0), E.jsx("div", {
                    className: "flex-1 flex flex-col items-center pt-[8vh] px-4 overflow-y-auto bg-background",
                    children: E.jsx("div", {
                        className: "w-full max-w-[480px] bg-card border border-border rounded-lg overflow-hidden shadow-sm divide-y divide-border",
                        children: [{
                            id: "default",
                            label: "Regular"
                        }, {
                            id: "large",
                            label: "Large"
                        }, {
                            id: "extra-large",
                            label: "Extra large"
                        }].map(e => {
                            const s = d === e.id;
                            return E.jsxs("button", {
                                onClick: () => m(e.id),
                                className: "w-full flex items-center justify-start p-4 bg-card hover:bg-muted transition-colors text-foreground",
                                children: [E.jsx("div", {
                                    className: "w-5 flex items-center justify-center mr-3",
                                    children: s && E.jsx(F, {
                                        size: 18,
                                        className: "text-foreground font-bold",
                                        strokeWidth: 3
                                    })
                                }), E.jsx("span", {
                                    className: "text-foreground font-medium",
                                    children: e.label
                                })]
                            }, e.id)
                        }
                        )
                    })
                })]
            }), "audio-speed" === b && o && E.jsxs(E.Fragment, {
                children: [N("Audio speed", !0), E.jsx("div", {
                    className: "flex-1 flex flex-col items-center pt-[8vh] px-4 overflow-y-auto bg-background",
                    children: E.jsx("div", {
                        className: "w-full max-w-[480px] bg-card border border-border rounded-lg overflow-hidden shadow-sm divide-y divide-border",
                        children: ds.map(e => {
                            const s = i === e
                              , t = 1 === e ? "1.00x (Normal)" : `${e.toFixed(2)}x`;
                            return E.jsxs("button", {
                                onClick: () => o(e),
                                className: "w-full flex items-center justify-start p-4 bg-card hover:bg-muted transition-colors text-foreground",
                                children: [E.jsx("div", {
                                    className: "w-5 flex items-center justify-center mr-3",
                                    children: s && E.jsx(F, {
                                        size: 18,
                                        className: "text-foreground font-bold",
                                        strokeWidth: 3
                                    })
                                }), E.jsx("span", {
                                    className: "text-foreground font-medium",
                                    children: t
                                })]
                            }, e)
                        }
                        )
                    })
                })]
            })]
        }), document.body), u && E.jsx(is, {
            title: "Leave Test",
            description: "Are you sure you want to exit? Your progress will not be saved and you'll return to the tests page.",
            confirmText: "Leave Test",
            cancelText: "Keep Working",
            onConfirm: () => {
                x(!1),
                t?.()
            }
            ,
            onCancel: () => x(!1)
        })]
    })
}
;
function us({buttonStyle: e}) {
    const [s,t] = _.useState(!1)
      , r = _.useCallback( () => {
        t(!!document.fullscreenElement)
    }
    , []);
    _.useEffect( () => (document.addEventListener("fullscreenchange", r),
    () => document.removeEventListener("fullscreenchange", r)), [r]);
    return E.jsx("button", {
        type: "button",
        onClick: () => {
            document.fullscreenElement ? document.exitFullscreen().catch( () => {}
            ) : document.documentElement.requestFullscreen().catch( () => {}
            )
        }
        ,
        className: `${e} flex items-center gap-1`,
        title: s ? "Exit fullscreen" : "Enter fullscreen",
        children: s ? E.jsx(U, {
            size: 20
        }) : E.jsx(B, {
            size: 20
        })
    })
}
const xs = ({onSubmitClick: e, onBackClick: s, isReviewMode: t=!1, hideExit: r=!1, hideFullscreen: n=!1, onReportIssueClick: a, audioSpeed: i, onAudioSpeedChange: o}) => {
    const {useIELTSXLayout: l, useInsperaLayout: c} = we()
      , [d,m] = _.useState(!1)
      , u = l ? "px-2 py-0.5 bg-secondary border border-gray-400 hover:bg-gray-200 text-primary rounded text-xs sm:px-4 sm:text-sm" : "px-2 py-0.5 bg-blue-300 hover:bg-blue-500 text-black rounded text-xs sm:px-4 sm:text-sm";
    return c ? E.jsx("div", {
        className: "flex items-center",
        children: E.jsx(ms, {
            onSubmitClick: e,
            onBackClick: s,
            hideExit: r,
            onReportIssueClick: a,
            audioSpeed: i,
            onAudioSpeedChange: o,
            children: E.jsx("button", {
                type: "button",
                className: "flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800",
                title: "Open exam menu",
                "aria-label": "Open exam menu",
                children: E.jsx(de, {
                    className: "h-7 w-7",
                    strokeWidth: 2.25
                })
            })
        })
    }) : E.jsxs("div", {
        className: "flex items-center gap-2 py-0.5",
        children: [!n && E.jsx(us, {
            buttonStyle: u
        }), l ? E.jsx(cs, {
            onBackClick: s,
            hideExit: r,
            onReportIssueClick: a,
            audioSpeed: i,
            onAudioSpeedChange: o,
            children: E.jsx("button", {
                type: "button",
                className: `${u} flex items-center gap-1`,
                children: E.jsx(de, {
                    size: 20
                })
            })
        }) : E.jsx("button", {
            onClick: () => {
                m(!0)
            }
            ,
            type: "button",
            className: `${u} flex items-center gap-1`,
            children: "Back"
        }), E.jsx("button", {
            onClick: e,
            type: "button",
            className: u,
            children: t ? "Finish" : "Submit"
        }), d && E.jsx(is, {
            title: "Exit Exam",
            description: "Are you sure you want to exit? Your progress will not be saved and you'll return to the tests page.",
            confirmText: "Yes, Exit",
            cancelText: "Continue Exam",
            onConfirm: () => {
                s?.()
            }
            ,
            onCancel: () => m(!1)
        })]
    })
}
  , hs = ({questionNumber: e, explanation: s, userAnswer: t, correctAnswer: n}) => {
    const [a,o] = _.useState(!1)
      , m = t?.toLowerCase().trim()
      , u = m === (Array.isArray(n) ? JSON.stringify(n).toLowerCase() : n.toLowerCase().trim())
      , x = Array.isArray(n) ? JSON.stringify(n) : n;
    return E.jsxs(E.Fragment, {
        children: [E.jsxs(r, {
            variant: "ghost",
            size: "sm",
            onClick: () => o(!0),
            className: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950",
            children: ["Explain More", E.jsx(ae, {
                className: "w-4 h-4 ml-1"
            })]
        }), E.jsx(i, {
            open: a,
            onOpenChange: o,
            children: E.jsxs(l, {
                className: "max-w-2xl max-h-[80vh] overflow-y-auto",
                children: [E.jsx(c, {
                    children: E.jsxs(d, {
                        children: ["Question ", e, " - Explanation"]
                    })
                }), E.jsxs("div", {
                    className: "space-y-4 pt-4",
                    children: [E.jsx("div", {
                        className: "bg-gray-50 dark:bg-gray-800 p-4 rounded-lg",
                        children: E.jsxs("div", {
                            className: "flex gap-4 text-sm flex-wrap",
                            children: [E.jsxs("span", {
                                className: "font-medium " + (u ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"),
                                children: ["Your answer: ", t || "(not answered)"]
                            }), !u && E.jsxs("span", {
                                className: "font-medium text-green-600 dark:text-green-400",
                                children: ["Correct: ", x]
                            })]
                        })
                    }), E.jsxs("div", {
                        children: [E.jsx("h4", {
                            className: "font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2",
                            children: "Relevant Text:"
                        }), E.jsx("div", {
                            className: "bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700",
                            children: E.jsxs("p", {
                                className: "text-sm text-gray-600 dark:text-gray-400 italic",
                                children: ['"', s.excerpt, '"']
                            })
                        })]
                    }), E.jsxs("div", {
                        children: [E.jsx("h4", {
                            className: "font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2",
                            children: "Explanation:"
                        }), E.jsx("div", {
                            className: "text-sm text-gray-800 dark:text-gray-200 leading-relaxed",
                            children: (h = s.explanation,
                            h.split(/(\*\*.*?\*\*)/g).map( (e, s) => {
                                if (e.startsWith("**") && e.endsWith("**")) {
                                    const t = e.slice(2, -2);
                                    return E.jsx("strong", {
                                        className: "font-semibold text-gray-900 dark:text-gray-100",
                                        children: t
                                    }, s)
                                }
                                return E.jsx("span", {
                                    children: e
                                }, s)
                            }
                            ))
                        })]
                    })]
                })]
            })
        })]
    });
    var h
}
  , ps = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , o = (e, i) => {
        if (void 0 !== e.questionNumber) {
            const i = e.questionNumber.toString()
              , o = t[i] || ""
              , l = s.answers[i]
              , c = void 0 !== r[e.questionNumber] || !o
              , d = n?.[i];
            return E.jsxs(E.Fragment, {
                children: [e.prefix && E.jsxs("span", {
                    children: [e.prefix, " "]
                }), E.jsx("span", {
                    className: "font-semibold rounded-sm px-1 text-white cursor-pointer " + (c ? "border-2 border-red-500 bg-red-500" : "border-2 border-green-500 bg-green-500"),
                    onClick: () => a?.(i),
                    children: e.questionNumber
                }), " ", E.jsx("span", {
                    className: `font-semibold ${c ? "text-red-500" : "text-green-500"} ${c && o ? "line-through" : ""}`,
                    children: o || "✗"
                }), e.suffix && E.jsxs("span", {
                    children: [" ", e.suffix]
                }), c && l && E.jsxs("span", {
                    className: "font-semibold text-green-600",
                    children: [" → ", l]
                }), d && E.jsxs(E.Fragment, {
                    children: [" ", E.jsx(hs, {
                        questionNumber: i,
                        explanation: d,
                        userAnswer: o,
                        correctAnswer: l
                    })]
                })]
            })
        }
        return void 0 !== e.text ? E.jsx("span", {
            children: e.text
        }) : null
    }
      , l = e => {
        const s = (e => e.listStyle ?? i.listStyle ?? "bullet")(e);
        if (1 === e.items.length)
            return o(e.items[0]);
        const t = (e => {
            switch (e) {
            case "dash":
            case "nested":
                return "list-none pl-8";
            case "plain":
            case "none":
                return "list-none";
            default:
                return "list-disc pl-5"
            }
        }
        )(s);
        return E.jsx("ul", {
            className: `list-inside space-y-2 ${t}`,
            children: e.items.map( (e, t) => {
                const r = o(e);
                return "dash" === s || "nested" === s ? E.jsx("li", {
                    className: "list-none",
                    children: E.jsxs("div", {
                        className: "flex items-start",
                        children: [E.jsx("span", {
                            className: "mr-2",
                            children: "–"
                        }), E.jsx("div", {
                            className: "flex-1",
                            children: r
                        })]
                    })
                }, t) : E.jsx("li", {
                    children: r
                }, t)
            }
            )
        })
    }
      , c = e => {
        switch (e.type) {
        case "QUESTION":
            {
                const i = e.questionNumber.toString()
                  , o = t[i] || ""
                  , l = s.answers[i]
                  , c = void 0 !== r[e.questionNumber] || !o
                  , d = n?.[i];
                return E.jsxs("span", {
                    className: "inline-flex items-center gap-2 flex-wrap",
                    children: [E.jsxs("span", {
                        className: "inline-flex items-baseline space-x-2 flex-wrap",
                        children: [e.prefix && E.jsx("span", {
                            children: e.prefix
                        }), E.jsx("span", {
                            className: "font-semibold rounded-sm px-1 text-white cursor-pointer " + (c ? "border-2 border-red-500 bg-red-500" : "border-2 border-green-500 bg-green-500"),
                            onClick: () => a?.(i),
                            children: e.questionNumber
                        }), E.jsx("span", {
                            className: `font-semibold ${c ? "text-red-500" : "text-green-500"} ${c && o ? "line-through" : ""}`,
                            children: o || "✗"
                        }), e.suffix && E.jsx("span", {
                            children: e.suffix
                        }), c && l && E.jsxs("span", {
                            className: "font-semibold text-green-600",
                            children: ["→ ", l]
                        })]
                    }), d && E.jsx(hs, {
                        questionNumber: i,
                        explanation: d,
                        userAnswer: o,
                        correctAnswer: l
                    })]
                })
            }
        case "ROW_HEADER":
        case "STATIC":
            return E.jsx("span", {
                children: e.text
            });
        case "CELL_GROUP":
            return l(e);
        default:
            return null
        }
    }
    ;
    return E.jsxs("div", {
        className: "space-y-4",
        children: [E.jsx(ye, {
            questionGroup: e
        }), E.jsx("div", {
            className: "overflow-x-auto",
            children: E.jsxs("table", {
                className: "w-3/4 min-w-[600px] border-collapse border border-gray-700",
                children: [i.title && E.jsx("caption", {
                    className: "p-3 text-lg font-bold text-center border border-b-0 border-gray-700",
                    children: i.title
                }), E.jsx("thead", {
                    children: E.jsx("tr", {
                        className: "bg-blue-100",
                        children: i.headers && i.headers.map( (e, s) => E.jsx("th", {
                            className: "p-3 border border-gray-700 font-semibold text-left",
                            children: e.text
                        }, s))
                    })
                }), E.jsx("tbody", {
                    children: i.rows.map( (e, s) => E.jsx("tr", {
                        className: "border-b border-gray-700",
                        children: e.map( (e, s) => "ROW_HEADER" === e.type ? E.jsx("th", {
                            scope: "row",
                            className: "p-3 border border-gray-700 font-semibold text-left align-top",
                            children: c(e)
                        }, s) : E.jsx("td", {
                            className: "p-3 border border-gray-700 align-top",
                            children: c(e)
                        }, s))
                    }, s))
                })]
            })
        })]
    })
}
  , bs = {
    TRUE_FALSE_NOT_GIVEN: [{
        id: "TRUE",
        text: "TRUE"
    }, {
        id: "FALSE",
        text: "FALSE"
    }, {
        id: "NOT GIVEN",
        text: "NOT GIVEN"
    }],
    YES_NO_NOT_GIVEN: [{
        id: "YES",
        text: "YES"
    }, {
        id: "NO",
        text: "NO"
    }, {
        id: "NOT GIVEN",
        text: "NOT GIVEN"
    }]
}
  , fs = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , o = e.type;
    return E.jsxs("div", {
        className: "space-y-4",
        children: [E.jsx(ye, {
            questionGroup: e,
            showContentTitle: !1
        }), E.jsxs("div", {
            className: "space-y-6",
            children: [i.title && E.jsx("div", {
                className: "mb-6 text-center",
                children: E.jsx("h4", {
                    className: "font-semibold",
                    children: i.title
                })
            }), E.jsx("div", {
                className: "flex flex-col gap-4",
                children: i.questions.map(e => {
                    const i = String(e.questionNumber)
                      , l = (e => void 0 !== r[e] || !t[e])(i)
                      , c = s.answers[i]
                      , d = bs[o] ?? e.options
                      , m = n?.[i];
                    return E.jsxs("div", {
                        id: `question-${e.questionNumber}`,
                        className: "py-3 gap-2",
                        children: [E.jsxs("div", {
                            className: "flex flex-row gap-1 items-center",
                            children: [E.jsx("div", {
                                className: "font-semibold justify-items-center rounded-sm mr-1 cursor-pointer " + (l ? "border-2 border-red-500 bg-red-500 text-white" : "border-2 border-green-500 bg-green-500 text-white"),
                                onClick: () => a?.(i),
                                children: E.jsx("p", {
                                    className: "mx-1",
                                    children: e.questionNumber
                                })
                            }), E.jsx("p", {
                                children: e.text
                            })]
                        }), E.jsx("div", {
                            className: "flex flex-col py-3 space-y-1",
                            children: d.map(r => {
                                const n = r.id
                                  , a = ( (e, r) => {
                                    const n = t[e]
                                      , a = s.answers[e]
                                      , i = Array.isArray(a) ? a[0] : a;
                                    return i ? n ? r.toUpperCase() === i.toUpperCase() ? "correct" : r.toUpperCase() === n.toUpperCase() ? "incorrect" : "neutral" : r === a ? "correct" : "neutral" : "neutral"
                                }
                                )(i, n);
                                return E.jsxs("label", {
                                    className: "flex items-center p-2 rounded-sm",
                                    children: [E.jsx("input", {
                                        type: "radio",
                                        name: `question-${e.questionNumber}`,
                                        checked: t[i] === n,
                                        value: n,
                                        className: "w-4 h-4 mr-2",
                                        disabled: !0
                                    }), E.jsx("span", {
                                        className: "" + ("incorrect" === a ? "text-red-500" : "correct" === a ? l ? "text-green-700" : "text-green-500" : ""),
                                        children: r.text
                                    })]
                                }, r.id)
                            }
                            )
                        }), E.jsxs("div", {
                            className: "inline-flex items-center gap-2 flex-wrap mt-2",
                            children: [l && c && E.jsxs("span", {
                                className: "font-semibold text-green-600",
                                children: ["→ ", c]
                            }), m && E.jsx(hs, {
                                questionNumber: i,
                                explanation: m,
                                userAnswer: t[i],
                                correctAnswer: c
                            })]
                        })]
                    }, e.questionNumber)
                }
                )
            })]
        })]
    })
}
  , gs = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content;
    return E.jsxs("div", {
        className: "space-y-4",
        children: [E.jsx(ye, {
            questionGroup: e
        }), E.jsx("div", {
            className: "flex flex-col gap-4",
            children: i.questions.map(e => {
                const r = e.questionNumbers.join("-")
                  , i = (e => {
                    const r = t[e] || ""
                      , n = s.answers[e];
                    if (!n)
                        return !0;
                    if (!r)
                        return !0;
                    const a = Array.isArray(r) ? [...r].sort() : r.split("").sort()
                      , i = Array.isArray(n) ? [...n].sort() : n.split("").sort();
                    return a.length !== i.length || !a.every( (e, s) => e === i[s])
                }
                )(r)
                  , o = s.answers[r]
                  , l = Array.isArray(o) ? o[0] : o || ""
                  , c = l ? l.split("").map(s => e.options.find(e => e.id === s)?.text || s).join(", ") : ""
                  , d = n?.[r] || n?.[String(e.questionNumbers[0])];
                return E.jsxs("div", {
                    id: `question-${r}`,
                    className: "py-3 gap-2",
                    children: [E.jsxs("div", {
                        className: "flex flex-row gap-1 items-center",
                        children: [E.jsx("div", {
                            className: "font-semibold justify-items-center rounded-sm mr-1 cursor-pointer " + (i ? "border-2 border-red-500 bg-red-500 text-white" : "border-2 border-green-500 bg-green-500 text-white"),
                            onClick: () => a?.(r),
                            children: E.jsx("p", {
                                className: "mx-1",
                                children: r
                            })
                        }), E.jsx("span", {
                            children: e.text
                        })]
                    }), E.jsx("div", {
                        className: "flex flex-col py-3 space-y-1",
                        children: e.options.map(e => {
                            const n = e.id
                              , a = ( (e, r) => {
                                const n = t[e] || ""
                                  , a = s.answers[e];
                                if (!a)
                                    return "neutral";
                                if (!n)
                                    return "neutral";
                                const i = Array.isArray(n) ? n : n.split("")
                                  , o = Array.isArray(a) ? a : a.split("")
                                  , l = i.includes(r)
                                  , c = o.includes(r);
                                return c && l ? "correct-selected" : c && !l ? "correct-unselected" : !c && l ? "incorrect-selected" : "neutral"
                            }
                            )(r, n)
                              , i = (t[r] || "").includes(n);
                            let o = "text-gray-800 dark:text-gray-200";
                            return "correct-selected" === a ? o = "text-green-600 font-semibold" : "correct-unselected" === a ? o = "text-green-700" : "incorrect-selected" === a && (o = "text-red-600 line-through"),
                            E.jsxs("label", {
                                className: "flex items-center p-2 rounded-sm cursor-pointer",
                                children: [E.jsx("input", {
                                    type: "checkbox",
                                    name: `question-${r}`,
                                    checked: i,
                                    value: n,
                                    className: "w-4 h-4 mr-2",
                                    disabled: !0
                                }), E.jsx("span", {
                                    className: o,
                                    children: e.text
                                })]
                            }, e.id)
                        }
                        )
                    }), E.jsxs("div", {
                        className: "inline-flex items-center gap-2 flex-wrap mt-2",
                        children: [i && l && E.jsxs("span", {
                            className: "font-semibold text-green-600",
                            children: ["→ ", l.toUpperCase(), " (", c, ")"]
                        }), d && E.jsx(hs, {
                            questionNumber: r,
                            explanation: d,
                            userAnswer: t[r],
                            correctAnswer: o
                        })]
                    })]
                }, r)
            }
            )
        })]
    })
}
  , js = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , o = "sections"in i
      , l = e => "object" == typeof e ? e.text : e
      , c = e => "object" == typeof e ? e.id : e
      , d = i.options
      , m = e => {
        if (!e)
            return null;
        const s = d.find(s => c(s) === e);
        if (s)
            return l(s);
        const t = d.find(s => {
            const t = l(s);
            return t.trim().toUpperCase().startsWith(`${e.toUpperCase()}.`) || t.trim().toUpperCase().startsWith(`${e.toUpperCase()})`)
        }
        );
        return t ? l(t) : null
    }
      , u = () => {
        if (!o)
            return "center";
        const e = i.align || "left";
        return "center" === e || "right" === e ? e : "left"
    }
      , x = () => {
        switch (u()) {
        case "left":
            return "text-left";
        case "right":
            return "text-right";
        default:
            return "text-center"
        }
    }
      , h = () => {
        switch (u()) {
        case "left":
            return "justify-start";
        case "right":
            return "justify-end";
        default:
            return "justify-center"
        }
    }
      , p = (e, i, o, l) => {
        const c = e.questionNumber ? `q-${e.questionNumber}` : `item-${l}-${i}`
          , d = ( (e, s) => e.listStyle || s.listStyle || "plain")(e, o)
          , u = (e => {
            switch (e) {
            case "dash":
                return "list-none pl-8";
            case "plain":
            case "none":
                return "list-none";
            default:
                return "list-disc pl-5"
            }
        }
        )(d)
          , p = x()
          , b = e.questionNumber ? ( (e, i, o, l) => {
            const c = e.toString()
              , d = t[c] || ""
              , u = s.answers[c] || ""
              , x = !r[e]
              , h = m(d)
              , p = m(Array.isArray(u) ? u[0] : u)
              , b = n?.[c];
            return E.jsxs("span", {
                className: "inline-flex flex-wrap gap-2 items-center",
                children: [i && E.jsx("span", {
                    children: i
                }), !i && l && E.jsx("span", {
                    children: l
                }), E.jsx("span", {
                    className: "font-semibold rounded-sm px-1 text-white cursor-pointer " + (x ? "border-2 border-green-500 bg-green-500" : "border-2 border-red-500 bg-red-500"),
                    onClick: () => a?.(c),
                    children: e
                }), d ? E.jsx("span", {
                    className: `font-semibold ${x ? "text-green-500" : "text-red-500"} ${x ? "" : "line-through"}`,
                    children: h || d
                }) : E.jsx("span", {
                    className: "font-semibold text-red-500",
                    children: "✗"
                }), o && E.jsx("span", {
                    children: o
                }), !x && E.jsxs("span", {
                    className: "font-semibold text-green-600",
                    children: ["→", " ", p || (Array.isArray(u) ? u[0] : u)]
                }), b && E.jsx(hs, {
                    questionNumber: c,
                    explanation: b,
                    userAnswer: d,
                    correctAnswer: u
                })]
            })
        }
        )(e.questionNumber, e.prefix, e.suffix, e.text) : E.jsx("span", {
            children: e.text
        });
        return "dash" === d ? E.jsx("li", {
            className: "list-none",
            children: E.jsxs("div", {
                className: `flex items-start gap-2 ${h()}`,
                children: [E.jsx("span", {
                    children: "–"
                }), E.jsx("div", {
                    className: `min-w-0 ${p}`,
                    children: b
                })]
            })
        }, c) : E.jsx("li", {
            className: `${u} ${p}`,
            children: b
        }, c)
    }
      , b = (e, s) => {
        const t = x();
        return E.jsxs("div", {
            className: "border border-slate-200 shadow-sm p-3 rounded-lg w-full max-w-full",
            children: [e.title && E.jsx("h5", {
                className: `font-bold mb-3 ${t}`,
                children: e.title
            }), e.items && e.items.length > 0 && E.jsx("ul", {
                className: `list-inside space-y-2 ${t}`,
                children: e.items.map( (t, r) => p(t, r, e, s))
            })]
        }, `section-${s}`)
    }
    ;
    if (!o)
        return function(e, s, t, r, n, a, i, o, l, c) {
            return E.jsxs("div", {
                className: "space-y-8",
                children: [E.jsx(ye, {
                    questionGroup: e
                }), E.jsxs("div", {
                    className: "flex gap-10 lg:gap-16",
                    children: [E.jsxs("div", {
                        className: "flex-grow max-w-5xl",
                        children: [s.questionsTitle && E.jsx("h5", {
                            className: "text-md font-semibold pb-6",
                            children: s.questionsTitle
                        }), E.jsx("div", {
                            className: "space-y-4",
                            children: s.questions.map( (e, l) => {
                                const c = e.questionNumber.toString()
                                  , d = r[c] || ""
                                  , m = t.answers[c] || ""
                                  , u = !n[e.questionNumber]
                                  , x = o?.(d)
                                  , h = o?.(Array.isArray(m) ? m[0] : m)
                                  , p = a?.[c];
                                return E.jsxs("div", {
                                    className: "relative",
                                    children: [E.jsx("div", {
                                        className: "flex gap-1 border border-slate-200 shadow-sm p-3 rounded-lg space-x-2",
                                        children: E.jsxs("div", {
                                            className: "flex items-center gap-2 flex-wrap",
                                            children: [e.prefix && E.jsx("span", {
                                                children: e.prefix
                                            }), !e.prefix && e.text && E.jsx("span", {
                                                children: e.text
                                            }), E.jsx("span", {
                                                className: "font-semibold mr-1 rounded-sm px-1 text-white cursor-pointer " + (u ? "border-2 border-green-500 bg-green-500" : "border-2 border-red-500 bg-red-500"),
                                                onClick: () => i?.(c),
                                                children: e.questionNumber
                                            }), d ? E.jsx("span", {
                                                className: `font-semibold ${u ? "text-green-500" : "text-red-500"} ${u ? "" : "line-through"}`,
                                                children: x || d
                                            }) : E.jsx("span", {
                                                className: "font-semibold text-red-500",
                                                children: "✗"
                                            }), e.suffix && E.jsx("span", {
                                                children: e.suffix
                                            }), !u && E.jsxs("span", {
                                                className: "font-semibold text-green-600",
                                                children: ["→", " ", h || (Array.isArray(m) ? m[0] : m)]
                                            }), p && E.jsx(hs, {
                                                questionNumber: c,
                                                explanation: p,
                                                userAnswer: d,
                                                correctAnswer: m
                                            })]
                                        })
                                    }), l < s.questions.length - 1 && E.jsx("div", {
                                        className: "my-1 w-full flex justify-center items-center",
                                        children: E.jsx(me, {
                                            size: 25,
                                            strokeWidth: 3
                                        })
                                    })]
                                }, e.questionNumber)
                            }
                            )
                        })]
                    }), E.jsx("div", {
                        className: "w-1/4",
                        children: E.jsxs("div", {
                            className: "sticky top-24",
                            children: [E.jsx("h5", {
                                className: "font-bold mb-4",
                                children: s.optionsTitle
                            }), E.jsx("div", {
                                className: "space-y-2",
                                children: s.options.map( (e, s) => {
                                    const t = l?.(e)
                                      , r = c?.(e);
                                    return E.jsxs("div", {
                                        className: "p-2",
                                        children: [E.jsx("span", {
                                            className: "font-semibold",
                                            children: t
                                        }), " - ", r]
                                    }, t || s)
                                }
                                )
                            })]
                        })
                    })]
                })]
            })
        }(e, i, s, t, r, n, a, m, c, l);
    const f = i;
    return E.jsxs("div", {
        className: "space-y-8",
        children: [E.jsx(ye, {
            questionGroup: e
        }), E.jsxs("div", {
            className: "flex gap-10 lg:gap-16",
            children: [E.jsxs("div", {
                className: "flex-grow max-w-5xl",
                children: [f.questionsTitle && E.jsx("h5", {
                    className: "text-md font-semibold pb-6",
                    children: f.questionsTitle
                }), E.jsx("div", {
                    className: "space-y-4",
                    children: E.jsx("div", {
                        className: `grid w-fit max-w-full ${( () => {
                            switch (u()) {
                            case "left":
                                return "mr-auto";
                            case "right":
                                return "ml-auto";
                            default:
                                return "mx-auto"
                            }
                        }
                        )()}`,
                        children: f.sections.map( (e, s) => E.jsxs("div", {
                            className: "w-full",
                            children: [b(e, s), s < f.sections.length - 1 && E.jsx("div", {
                                className: "my-1 w-full flex justify-center items-center",
                                children: E.jsx(me, {
                                    size: 25,
                                    strokeWidth: 3
                                })
                            })]
                        }, `section-${s}`))
                    })
                })]
            }), E.jsx("div", {
                className: "w-1/4",
                children: E.jsxs("div", {
                    className: "sticky top-24",
                    children: [E.jsx("h5", {
                        className: "font-bold mb-4",
                        children: f.optionsTitle
                    }), E.jsx("div", {
                        className: "space-y-2",
                        children: d.map( (e, s) => {
                            const t = c(e)
                              , r = l(e);
                            return E.jsxs("div", {
                                className: "p-2",
                                children: [E.jsx("span", {
                                    className: "font-semibold",
                                    children: t
                                }), " - ", r]
                            }, t || s)
                        }
                        )
                    })]
                })
            })]
        })]
    })
}
;
const Ns = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , o = () => {
        const e = i.align || "center";
        return "left" === e || "right" === e ? e : "center"
    }
      , l = () => {
        switch (o()) {
        case "left":
            return "text-left";
        case "right":
            return "text-right";
        default:
            return "text-center"
        }
    }
      , c = () => {
        switch (o()) {
        case "left":
            return "justify-start";
        case "right":
            return "justify-end";
        default:
            return "justify-center"
        }
    }
      , d = (e, i, o, d) => {
        const m = e.questionNumber ? `q-${e.questionNumber}` : `item-${d}-${i}`
          , u = ( (e, s) => e.listStyle || s.listStyle || "plain")(e, o)
          , x = (e => {
            switch (e) {
            case "dash":
                return "list-none pl-8";
            case "plain":
            case "none":
                return "list-none";
            default:
                return "list-disc pl-5"
            }
        }
        )(u)
          , h = l()
          , p = e.questionNumber ? (e => {
            const i = e.questionNumber.toString()
              , o = t[i] || ""
              , l = s.answers[i] || ""
              , c = Array.isArray(l) ? l[0] : l
              , d = void 0 !== r[i] || !o
              , m = n?.[i];
            return E.jsxs("span", {
                className: "inline-flex items-center gap-2 flex-wrap",
                children: [e.prefix && E.jsx("span", {
                    children: e.prefix
                }), E.jsx("span", {
                    className: "font-semibold rounded-sm px-1 text-white cursor-pointer " + (d ? "border-2 border-red-500 bg-red-500" : "border-2 border-green-500 bg-green-500"),
                    onClick: () => a?.(i),
                    children: i
                }), E.jsx("span", {
                    className: `font-semibold ${d ? "text-red-500" : "text-green-500"} ${d && o ? "line-through" : ""}`,
                    children: o || "✗"
                }), e.suffix && E.jsx("span", {
                    children: e.suffix
                }), d && c && E.jsxs("span", {
                    className: "font-semibold text-green-600",
                    children: ["→ ", c]
                }), m && E.jsx(hs, {
                    questionNumber: i,
                    explanation: m,
                    userAnswer: o,
                    correctAnswer: l
                })]
            })
        }
        )(e) : E.jsx("span", {
            children: e.text
        });
        return "dash" === u ? E.jsx("li", {
            className: "list-none",
            children: E.jsxs("div", {
                className: `flex items-start gap-2 ${c()}`,
                children: [E.jsx("span", {
                    children: "–"
                }), E.jsx("div", {
                    className: `min-w-0 ${h}`,
                    children: p
                })]
            })
        }, m) : E.jsx("li", {
            className: `${x} ${h}`,
            children: p
        }, m)
    }
      , m = (e, s) => {
        const t = l();
        return E.jsxs("div", {
            className: "border border-gray-300 p-4 rounded-lg w-full max-w-full",
            children: [e.title && E.jsx("h5", {
                className: `font-bold mb-3 ${t}`,
                children: e.title
            }), e.items && e.items.length > 0 && E.jsx("ul", {
                className: `list-inside space-y-2 ${t}`,
                children: e.items.map( (t, r) => d(t, r, e, s))
            })]
        }, `section-${s}`)
    }
    ;
    return E.jsxs("div", {
        className: "space-y-8",
        children: [E.jsx(ye, {
            questionGroup: e
        }), E.jsxs("div", {
            className: "flex flex-col gap-6 max-w-4xl",
            children: [i.questionsTitle && E.jsx("h2", {
                className: "text-md font-semibold",
                children: i.questionsTitle
            }), E.jsx("div", {
                className: "space-y-4",
                children: E.jsx("div", {
                    className: `grid w-fit max-w-full ${( () => {
                        switch (o()) {
                        case "left":
                            return "mr-auto";
                        case "right":
                            return "ml-auto";
                        default:
                            return "mx-auto"
                        }
                    }
                    )()}`,
                    children: i.sections.map( (e, s) => E.jsxs("div", {
                        className: "w-full",
                        children: [m(e, s), s < i.sections.length - 1 && E.jsx("div", {
                            className: "my-2 w-full flex justify-center items-center",
                            children: E.jsx(me, {
                                size: 28,
                                strokeWidth: 3
                            })
                        })]
                    }, `section-${s}`))
                })
            })]
        })]
    })
}
  , vs = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , o = e => "object" == typeof e ? e.text : e
      , l = e => "object" == typeof e ? e.id : e
      , c = e => {
        if (!e)
            return null;
        const s = i.options.find(s => l(s) === e);
        if (s)
            return o(s);
        const t = i.options.find(s => {
            const t = o(s);
            return t.trim().toUpperCase().startsWith(`${e.toUpperCase()}.`) || t.trim().toUpperCase().startsWith(`${e.toUpperCase()})`)
        }
        );
        return t ? o(t) : null
    }
    ;
    return E.jsxs("div", {
        className: "space-y-8",
        children: [E.jsx(ye, {
            questionGroup: e
        }), E.jsxs("div", {
            className: "flex gap-20",
            children: [E.jsxs("div", {
                children: [E.jsx("h2", {
                    className: "font-bold mb-10",
                    children: i.questionsTitle
                }), E.jsx("div", {
                    className: "space-y-6",
                    children: i.questions.map(e => {
                        const i = e.questionNumber.toString()
                          , o = t[i] || ""
                          , l = s.answers[i] || ""
                          , d = void 0 !== r[e.questionNumber] || !o
                          , m = c(o)
                          , u = c(Array.isArray(l) ? l[0] : l)
                          , x = n?.[i];
                        return E.jsxs("div", {
                            className: "flex flex-col gap-",
                            children: [E.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [E.jsx("span", {
                                    className: "font-semibold mr-1 rounded-sm px-1 text-white cursor-pointer " + (d ? "border-2 border-red-500 bg-red-500" : "border-2 border-green-500 bg-green-500"),
                                    onClick: () => a?.(i),
                                    children: e.questionNumber
                                }), E.jsx("span", {
                                    children: e.text
                                }), o ? E.jsx("span", {
                                    className: "font-semibold text-red-500",
                                    children: m || o
                                }) : E.jsx("span", {
                                    className: "font-semibold text-red-500",
                                    children: "x"
                                })]
                            }), E.jsxs("div", {
                                className: "pl-8 inline-flex items-center gap-2 flex-wrap",
                                children: [d ? E.jsxs("span", {
                                    className: "font-bold text-green-700",
                                    children: ["Answer : ", u || l]
                                }) : E.jsx("span", {
                                    className: "font-semibold text-green-500",
                                    children: u || l
                                }), x && E.jsx(hs, {
                                    questionNumber: i,
                                    explanation: x,
                                    userAnswer: o,
                                    correctAnswer: l
                                })]
                            })]
                        }, e.questionNumber)
                    }
                    )
                })]
            }), E.jsxs("div", {
                className: "w-1/4",
                children: [E.jsx("h2", {
                    className: "font-bold mb-4",
                    children: i.optionsTitle
                }), E.jsx("div", {
                    className: "space-y-2",
                    children: i.options.map( (e, s) => E.jsx("div", {
                        className: "p-2 border rounded",
                        children: l(e) && l(e) !== o(e) ? `${l(e)}: ${o(e)}` : o(e)
                    }, l(e) || s))
                })]
            })]
        })]
    })
}
  , ws = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , {items: o, questions: l, questionsTitle: c, itemsTitle: d} = "features"in (m = i) ? {
        items: m.features,
        questions: m.questions,
        questionsTitle: m.questionsTitle,
        itemsTitle: m.featuresTitle || m.featureTitle
    } : {
        items: m.headings,
        questions: m.questions,
        questionsTitle: m.questionsTitle,
        itemsTitle: m.optionsTitle
    };
    var m;
    return E.jsxs("div", {
        className: "space-y-6",
        children: [E.jsx(ye, {
            questionGroup: e
        }), E.jsx("div", {
            className: "overflow-x-auto",
            children: E.jsx("div", {
                className: "w-full max-w-4xl p-4 border border-gray-500 h-fit flex-1",
                children: E.jsxs("table", {
                    className: "h-full w-full border-collapse",
                    children: [E.jsx("thead", {
                        children: E.jsxs("tr", {
                            children: [E.jsx("th", {
                                className: "whitespace-nowrap border-black dark:border-gray-300 px-3 py-2 min-w-[300px]",
                                children: c || "Items"
                            }), o.map( (e, s) => E.jsx("th", {
                                className: "whitespace-nowrap border-black dark:border-gray-300 p-3 text-center " + (0 === s ? "border-l-2" : "border-l"),
                                children: e.id
                            }, e.id))]
                        })
                    }), E.jsx("tbody", {
                        children: l.map( (e, i) => {
                            const l = e.questionNumber.toString()
                              , c = t[l] || ""
                              , d = s.answers[l] || ""
                              , m = !(void 0 !== r[e.questionNumber] || !c)
                              , u = n?.[l];
                            return E.jsxs("tr", {
                                className: "border-black dark:border-gray-300 h-full " + (0 === i ? "border-t-2" : "border-t"),
                                children: [E.jsxs("td", {
                                    className: "flex gap-2 p-3 md:mr-5 items-center",
                                    children: [E.jsx("span", {
                                        className: "font-semibold mr-1 rounded-sm px-1 cursor-pointer " + (m ? "border-2 border-green-500 bg-green-500 text-white" : "border-2 border-red-500 bg-red-500 text-white"),
                                        onClick: () => a?.(l),
                                        children: e.questionNumber
                                    }), E.jsx("span", {
                                        children: e.text
                                    }), u && E.jsx(hs, {
                                        questionNumber: l,
                                        explanation: u,
                                        userAnswer: c,
                                        correctAnswer: d
                                    })]
                                }), o.map( (s, t) => {
                                    const r = c === s.id
                                      , n = d === s.id;
                                    return E.jsx("td", {
                                        className: "border-0 border-black dark:border-gray-300 h-full p-0 " + (0 === t ? "border-l-2" : "border-l"),
                                        children: E.jsxs("div", {
                                            className: "w-full min-h-full flex items-center justify-center p-2.5 min-w-12 h-full flex-1 " + (r || n ? "bg-blue-100 dark:bg-blue-900/60" : ""),
                                            children: [r && n && E.jsx(F, {
                                                size: 25,
                                                strokeWidth: 3,
                                                className: "text-green-500"
                                            }), r && !n && E.jsx(ce, {
                                                size: 25,
                                                strokeWidth: 3,
                                                className: "text-red-500"
                                            }), !r && n && E.jsx(F, {
                                                size: 25,
                                                strokeWidth: 3,
                                                className: "text-green-700 opacity-60"
                                            })]
                                        })
                                    }, `${e.questionNumber}-${s.id}`)
                                }
                                )]
                            }, e.questionNumber)
                        }
                        )
                    })]
                })
            })
        }), E.jsxs("div", {
            className: "w-fit border border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-800",
            children: [d && E.jsx("h4", {
                className: "mb-3 font-medium text-gray-900 dark:text-gray-100",
                children: d
            }), !d && E.jsx("h4", {
                className: "mb-3 font-medium text-gray-900 dark:text-gray-100",
                children: "features"in i ? "List of Features" : "List of Headings"
            }), E.jsx("div", {
                className: "space-y-1.5",
                children: o.map(e => E.jsxs("div", {
                    className: "flex gap-3",
                    children: [E.jsx("span", {
                        className: "font-medium text-gray-900 dark:text-gray-100",
                        children: e.id
                    }), E.jsx("span", {
                        children: e.text
                    })]
                }, e.id))
            })]
        })]
    })
}
  , ys = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , o = e => {
        if (!e)
            return null;
        return e.split(/(\*\*[^*]+\*\*)/g).map( (e, s) => e.startsWith("**") && e.endsWith("**") ? E.jsx("span", {
            className: "font-semibold",
            children: e.slice(2, -2)
        }, s) : E.jsx("span", {
            children: e
        }, s))
    }
      , l = (e, i, o) => {
        const l = String(e)
          , c = t[l] || ""
          , d = s.answers[l] || ""
          , m = void 0 !== r[l] || !c
          , u = n?.[l];
        return E.jsx("div", {
            className: "inline-flex items-center gap-2 flex-wrap",
            children: E.jsxs("span", {
                className: "inline-flex items-baseline space-x-2 flex-wrap cursor-pointer",
                onClick: () => a?.(l),
                children: [E.jsx("span", {
                    className: "font-semibold rounded-sm px-1 text-white " + (m ? "border-2 border-red-500 bg-red-500" : "border-2 border-green-500 bg-green-500"),
                    children: l
                }), i && E.jsx("span", {
                    children: i
                }), E.jsx("span", {
                    className: `font-semibold ${m ? "text-red-500" : "text-green-500"} ${m && c ? "line-through" : ""}`,
                    children: c || "✗"
                }), o && E.jsx("span", {
                    children: o
                }), m && d && E.jsxs("span", {
                    className: "font-semibold text-green-600",
                    children: ["→ ", d]
                }), u && E.jsx(hs, {
                    questionNumber: l,
                    explanation: u,
                    userAnswer: c,
                    correctAnswer: d
                })]
            })
        })
    }
      , c = (e, s) => {
        const t = `section-${s}`
          , r = e.title || e.questionNumber;
        return E.jsxs("div", {
            className: "mb-6",
            children: [r && E.jsx("div", {
                className: "mb-3",
                children: e.questionNumber ? E.jsx("div", {
                    className: "font-semibold",
                    children: l(e.questionNumber, e.prefix, e.suffix)
                }) : E.jsx("h3", {
                    className: "font-semibold",
                    children: e.title
                })
            }), e.items && E.jsx("ul", {
                className: "list-inside space-y-2",
                children: e.items.map( (s, t) => ( (e, s, t) => {
                    const r = e.questionNumber ? `q-${e.questionNumber}` : `item-${t.title || s}-${s}`
                      , n = e.listStyle || t.listStyle || i.listStyle || "disc";
                    let a;
                    switch (n) {
                    case "nested":
                        a = "list-none pl-8";
                        break;
                    case "none":
                        a = "list-none";
                        break;
                    default:
                        a = "list-disc pl-5"
                    }
                    const c = e.questionNumber ? l(e.questionNumber, e.prefix, e.suffix) : E.jsx("span", {
                        children: o(e.text)
                    });
                    return E.jsx("li", {
                        className: a,
                        children: "nested" === n ? E.jsxs("div", {
                            className: "flex items-start",
                            children: [E.jsx("span", {
                                className: "mr-2",
                                children: "–"
                            }), E.jsx("div", {
                                className: "flex-1",
                                children: c
                            })]
                        }) : c
                    }, r)
                }
                )(s, t, e))
            })]
        }, t)
    }
    ;
    return E.jsxs("div", {
        className: "space-y-4",
        children: [E.jsx(ye, {
            questionGroup: e,
            showContentTitle: !1
        }), E.jsxs("div", {
            className: "space-y-6",
            children: [i.title && E.jsx("div", {
                className: "mb-6 text-center",
                children: E.jsx("h4", {
                    className: "font-semibold",
                    children: i.title
                })
            }), E.jsx("div", {
                className: "space-y-6",
                children: Array.isArray(i.sections) && i.sections.map( (e, s) => c(e, s))
            })]
        })]
    })
}
  , ks = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , o = e => {
        if (!e)
            return null;
        return e.split(/(\*\*[^*]+\*\*)/g).map( (e, s) => e.startsWith("**") && e.endsWith("**") ? E.jsx("span", {
            className: "font-semibold",
            children: e.slice(2, -2)
        }, s) : E.jsx("span", {
            children: e
        }, s))
    }
      , l = (e, i, o) => {
        const l = String(e)
          , c = t[l] || ""
          , d = s.answers[l] || ""
          , m = void 0 !== r[l] || !c
          , u = n?.[l];
        return E.jsxs("span", {
            className: "inline-flex items-baseline space-x-2 flex-wrap",
            children: [E.jsxs("span", {
                className: "inline-flex items-baseline space-x-2 flex-wrap cursor-pointer",
                onClick: () => a?.(l),
                children: [E.jsx("span", {
                    className: "font-semibold rounded-sm px-1 text-white " + (m ? "border-2 border-red-500 bg-red-500" : "border-2 border-green-500 bg-green-500"),
                    children: l
                }), i && E.jsx("span", {
                    children: i
                }), E.jsx("span", {
                    className: `font-semibold ${m ? "text-red-500" : "text-green-500"} ${m && c ? "line-through" : ""}`,
                    children: c || "✗"
                }), o && E.jsx("span", {
                    children: o
                }), m && d && E.jsxs("span", {
                    className: "font-semibold text-green-600",
                    children: ["→ ", d]
                })]
            }), u && E.jsx(hs, {
                questionNumber: l,
                explanation: u,
                userAnswer: c,
                correctAnswer: d
            })]
        })
    }
      , c = (e, s) => {
        const t = `section-${s}`
          , r = e.title || e.questionNumber;
        return E.jsxs("div", {
            className: "mb-6",
            children: [r && E.jsx("div", {
                className: "mb-3",
                children: e.questionNumber ? E.jsx("div", {
                    className: "font-semibold",
                    children: l(e.questionNumber, e.prefix, e.suffix)
                }) : E.jsx("h3", {
                    className: "font-semibold",
                    children: e.title
                })
            }), e.items && E.jsx("ul", {
                className: "list-inside space-y-2",
                children: e.items.map( (s, t) => ( (e, s, t) => {
                    const r = e.questionNumber ? `q-${e.questionNumber}` : `item-${t.title || s}-${s}`
                      , n = e.listStyle || t.listStyle || i.listStyle || "disc";
                    let a;
                    switch (n) {
                    case "nested":
                        a = "list-none pl-8";
                        break;
                    case "none":
                        a = "list-none";
                        break;
                    default:
                        a = "list-disc pl-5"
                    }
                    const c = e.questionNumber ? l(e.questionNumber, e.prefix, e.suffix) : E.jsx("span", {
                        children: o(e.text)
                    });
                    return E.jsx("li", {
                        className: a,
                        children: "nested" === n ? E.jsxs("div", {
                            className: "flex items-start",
                            children: [E.jsx("span", {
                                className: "mr-2",
                                children: "–"
                            }), E.jsx("div", {
                                className: "flex-1",
                                children: c
                            })]
                        }) : c
                    }, r)
                }
                )(s, t, e))
            })]
        }, t)
    }
    ;
    return E.jsxs("div", {
        className: "space-y-4",
        children: [E.jsx(ye, {
            questionGroup: e
        }), i.imageUrl && E.jsx("div", {
            className: "w-full max-w-[650px] mx-auto",
            children: E.jsx("img", {
                src: i.imageUrl,
                alt: i.title || "Diagram",
                className: "w-full h-auto max-h-[500px] object-contain"
            })
        }), i.title && E.jsx("h2", {
            className: "font-semibold text-lg text-center",
            children: i.title
        }), E.jsx("div", {
            className: "space-y-6",
            children: Array.isArray(i.sections) && i.sections.map( (e, s) => c(e, s))
        })]
    })
}
  , Ss = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content;
    return E.jsxs("div", {
        className: "space-y-4",
        children: [E.jsx(ye, {
            questionGroup: e,
            showContentTitle: !1
        }), i.title && E.jsx("div", {
            className: "mb-6 text-center",
            children: E.jsx("h4", {
                className: "font-bold",
                children: i.title
            })
        }), i.imageUrl && E.jsx("div", {
            className: "mb-4",
            children: E.jsx("img", {
                src: i.imageUrl,
                alt: "Summary diagram",
                className: "max-w-full h-auto"
            })
        }), E.jsx("div", {
            className: "text-base leading-relaxed",
            children: i.summaryText.split(/(\[\d+\])/g).map( (e, i) => {
                const o = e.match(/\[(\d+)\]/);
                if (o) {
                    const e = parseInt(o[1])
                      , l = e.toString()
                      , c = t[l] || ""
                      , d = s.answers[l]
                      , m = void 0 !== r[e] || !c
                      , u = n?.[l];
                    return E.jsxs("span", {
                        className: "inline-flex items-baseline space-x-2 flex-wrap",
                        children: [E.jsxs("span", {
                            className: "inline-flex items-baseline space-x-2 flex-wrap cursor-pointer",
                            onClick: () => a?.(l),
                            children: [E.jsx("span", {
                                className: "font-semibold rounded-sm px-1 text-white " + (m ? "border-2 border-red-500 bg-red-500" : "border-2 border-green-500 bg-green-500"),
                                children: e
                            }), E.jsx("span", {
                                className: `font-semibold ${m ? "text-red-500" : "text-green-500"} ${m && c ? "line-through" : ""}`,
                                children: c || "✗"
                            }), m && d && E.jsxs("span", {
                                className: "font-semibold text-green-600",
                                children: ["→ ", d]
                            })]
                        }), u && E.jsx(hs, {
                            questionNumber: l,
                            explanation: u,
                            userAnswer: c,
                            correctAnswer: d
                        })]
                    }, i)
                }
                return E.jsx("span", {
                    children: e
                }, i)
            }
            )
        }), i.sections && i.sections.map(e => E.jsxs("div", {
            className: "mt-6",
            children: [e.title && E.jsx("h3", {
                className: "font-semibold text-lg mb-2",
                children: e.title
            }), E.jsx("div", {
                className: "text-base leading-relaxed",
                children: e.fields.map(e => {
                    if (e.isStatic && e.staticText)
                        return E.jsxs("span", {
                            children: [e.staticText, " "]
                        }, e.id);
                    const i = e.questionNumber;
                    if (!i)
                        return null;
                    const o = i.toString()
                      , l = t[o] || ""
                      , c = s.answers[o]
                      , d = !(void 0 !== r[i] || !l)
                      , m = n?.[o];
                    return E.jsxs("span", {
                        className: "inline-flex items-center gap-2 flex-wrap mx-1",
                        children: [E.jsxs("span", {
                            className: "inline-flex items-baseline space-x-2 flex-wrap cursor-pointer",
                            onClick: () => a?.(o),
                            children: [e.prefix && E.jsx("span", {
                                children: e.prefix
                            }), E.jsx("span", {
                                className: "font-semibold rounded-sm px-1 text-white " + (d ? "border-2 border-green-500 bg-green-500" : "border-2 border-red-500 bg-red-500"),
                                children: i
                            }), E.jsx("span", {
                                className: `font-semibold ${d ? "text-green-500" : "text-red-500"} ${!d && l ? "line-through" : ""}`,
                                children: l || "✗"
                            }), e.suffix && E.jsx("span", {
                                children: e.suffix
                            }), !d && c && E.jsxs("span", {
                                className: "font-semibold text-green-600",
                                children: ["→ ", c]
                            })]
                        }), m && E.jsx(hs, {
                            questionNumber: o,
                            explanation: m,
                            userAnswer: l,
                            correctAnswer: c
                        })]
                    }, e.id)
                }
                )
            })]
        }, e.id))]
    })
}
  , Cs = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, questions: n, headerSection: a, explanations: i, onQuestionClick: o}) => E.jsxs("div", {
    className: "space-y-4",
    children: [E.jsx(ye, {
        questionGroup: e
    }), a, E.jsx("div", {
        className: "space-y-4 mt-6",
        children: n.map(e => {
            const n = String(e.questionNumber)
              , a = t[n] || ""
              , l = s.answers[n]
              , c = void 0 !== r[n] || !a
              , d = i?.[n];
            return E.jsxs("div", {
                className: "flex items-center space-x-2 flex-wrap",
                children: [E.jsx("span", {
                    className: "font-semibold mr-1 rounded-sm px-1 text-white cursor-pointer " + (c ? "border-2 border-red-500 bg-red-500" : "border-2 border-green-500 bg-green-500"),
                    onClick: () => o?.(n),
                    children: e.questionNumber
                }), E.jsx("div", {
                    children: ke(e.text)
                }), E.jsxs("div", {
                    className: "flex flex-row space-x-3",
                    children: [E.jsx("span", {
                        className: `font-semibold ${c ? "text-red-500" : "text-green-500"} ${c && a ? "line-through" : ""}`,
                        children: a || "✗"
                    }), c && E.jsxs("span", {
                        className: "font-semibold text-green-600",
                        children: ["→ ", l]
                    }), d && E.jsx(hs, {
                        questionNumber: n,
                        explanation: d,
                        userAnswer: a,
                        correctAnswer: l
                    })]
                })]
            }, e.questionNumber)
        }
        )
    })]
})
  , Ts = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , o = E.jsxs("div", {
        className: "border border-gray-300 p-4",
        children: ["MATCHING_FEATURES" === e.type ? E.jsx("h4", {
            className: "mb-3",
            children: "List of Features"
        }) : E.jsx("h4", {
            className: "mb-3",
            children: "List of Headings"
        }), E.jsx("div", {
            className: "space-y-1.5",
            children: i.headings.map(e => E.jsxs("div", {
                className: "flex gap-3",
                children: [E.jsx("span", {
                    className: "font-medium",
                    children: e.id
                }), E.jsx("span", {
                    children: e.text
                })]
            }, e.id))
        })]
    });
    return E.jsx(Cs, {
        questionGroup: e,
        answerKeys: s,
        userAnswers: t,
        mistakesByQuestionNumber: r,
        questions: i.questions,
        headerSection: o,
        explanations: n,
        onQuestionClick: a
    })
}
  , As = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , {questions: o=[], labels: l=[]} = i;
    return E.jsxs("div", {
        className: "space-y-6",
        children: [E.jsx(ye, {
            questionGroup: e
        }), E.jsx("div", {
            className: "overflow-x-auto",
            children: E.jsx("div", {
                className: "w-full max-w-4xl p-4 border border-gray-500 h-fit flex-1",
                children: E.jsxs("table", {
                    className: "h-full w-full border-collapse",
                    children: [E.jsx("thead", {
                        children: E.jsxs("tr", {
                            children: [E.jsx("th", {
                                className: "whitespace-nowrap border-black dark:border-gray-300 px-3 py-2 min-w-[360px]",
                                children: "Information"
                            }), l.map( (e, s) => E.jsx("th", {
                                className: "whitespace-nowrap border-black dark:border-gray-300 p-3 text-center " + (0 === s ? "border-l-2" : "border-l"),
                                children: e
                            }, e))]
                        })
                    }), E.jsx("tbody", {
                        children: o.map( (e, i) => {
                            const o = e.questionNumber.toString()
                              , c = t[o] || ""
                              , d = s.answers[o] || ""
                              , m = !(void 0 !== r[o] || !c)
                              , u = n?.[o];
                            return E.jsxs("tr", {
                                className: "border-black dark:border-gray-300 h-full " + (0 === i ? "border-t-2" : "border-t"),
                                children: [E.jsxs("td", {
                                    className: "flex gap-2 p-3 md:mr-5 items-center",
                                    children: [E.jsx("span", {
                                        className: "font-semibold mr-1 rounded-sm px-1 cursor-pointer " + (m ? "border-2 border-green-500 bg-green-500 text-white" : "border-2 border-red-500 bg-red-500 text-white"),
                                        onClick: () => a?.(o),
                                        children: e.questionNumber
                                    }), E.jsx("span", {
                                        children: ke(e.text)
                                    }), u && E.jsx(hs, {
                                        questionNumber: o,
                                        explanation: u,
                                        userAnswer: c,
                                        correctAnswer: d
                                    })]
                                }), l.map( (s, t) => {
                                    const r = c === s
                                      , n = d === s;
                                    return E.jsx("td", {
                                        className: "border-0 border-black dark:border-gray-300 h-full p-0 " + (0 === t ? "border-l-2" : "border-l"),
                                        children: E.jsxs("div", {
                                            className: "w-full min-h-full flex items-center justify-center p-2.5 min-w-12 h-full flex-1 " + (r || n ? "bg-blue-100 dark:bg-blue-900/60" : ""),
                                            children: [r && n && E.jsx(F, {
                                                size: 25,
                                                strokeWidth: 3,
                                                className: "text-green-500"
                                            }), r && !n && E.jsx(ce, {
                                                size: 25,
                                                strokeWidth: 3,
                                                className: "text-red-500"
                                            }), !r && n && E.jsx(F, {
                                                size: 25,
                                                strokeWidth: 3,
                                                className: "text-green-700 opacity-60"
                                            })]
                                        })
                                    }, `${e.questionNumber}-${s}`)
                                }
                                )]
                            }, e.questionNumber)
                        }
                        )
                    })]
                })
            })
        })]
    })
}
  , Is = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, explanations: n, onQuestionClick: a}) => {
    const i = e.content
      , o = e => "object" == typeof e ? e.text : e
      , l = e => "object" == typeof e ? e.id : e
      , c = e => i.options.find(s => l(s) === e);
    return E.jsxs("div", {
        className: "space-y-8",
        children: [E.jsx(ye, {
            questionGroup: e,
            showContentTitle: !1
        }), E.jsxs("div", {
            className: "flex flex-col gap-5",
            children: [E.jsxs("div", {
                className: "flex-1",
                children: [i.title && E.jsx("div", {
                    className: "mb-6 text-center",
                    children: E.jsx("h4", {
                        className: "font-bold",
                        children: i.title
                    })
                }), E.jsx("div", {
                    className: "text-base leading-relaxed",
                    children: i.summaryText.split(/(\[\d+\])/g).map( (e, i) => {
                        const l = e.match(/\[(\d+)\]/);
                        if (l) {
                            const e = parseInt(l[1])
                              , d = e.toString()
                              , m = t[d] || ""
                              , u = s.answers[d]
                              , x = void 0 !== r[e] || !m
                              , h = n?.[d]
                              , p = m ? c(m) : null
                              , b = p ? o(p) : ""
                              , f = u ? c(Array.isArray(u) ? u[0] : String(u)) : null
                              , g = f ? o(f) : "";
                            return E.jsxs("span", {
                                className: "inline-flex items-center gap-2 flex-wrap mx-1",
                                children: [E.jsxs("span", {
                                    className: "inline-flex items-baseline space-x-2 flex-wrap cursor-pointer",
                                    onClick: () => a?.(d),
                                    children: [E.jsx("span", {
                                        className: "font-semibold rounded-sm px-1 text-white " + (x ? "border-2 border-red-500 bg-red-500" : "border-2 border-green-500 bg-green-500"),
                                        children: e
                                    }), E.jsx("span", {
                                        className: `font-semibold ${x ? "text-red-500" : "text-green-500"} ${x && b ? "line-through" : ""}`,
                                        children: b || "✗"
                                    }), x && g && E.jsxs("span", {
                                        className: "font-semibold text-green-600",
                                        children: ["→ ", g]
                                    })]
                                }), h && E.jsx(hs, {
                                    questionNumber: d,
                                    explanation: h,
                                    userAnswer: m,
                                    correctAnswer: u
                                })]
                            }, i)
                        }
                        return E.jsx("span", {
                            children: e
                        }, i)
                    }
                    )
                }), i.sections && i.sections.map(e => E.jsxs("div", {
                    className: "mt-6",
                    children: [e.title && E.jsx("h3", {
                        className: "font-semibold text-lg mb-2",
                        children: e.title
                    }), E.jsx("div", {
                        className: "text-base leading-relaxed",
                        children: e.fields.map(e => {
                            if (e.isStatic && e.staticText)
                                return E.jsxs("span", {
                                    children: [e.staticText, " "]
                                }, e.id);
                            const i = e.questionNumber;
                            if (!i)
                                return null;
                            const l = i.toString()
                              , d = t[l] || ""
                              , m = s.answers[l]
                              , u = !(void 0 !== r[i] || !d)
                              , x = n?.[l]
                              , h = d ? c(d) : null
                              , p = h ? o(h) : ""
                              , b = m ? c(Array.isArray(m) ? m[0] : String(m)) : null
                              , f = b ? o(b) : "";
                            return E.jsxs("span", {
                                className: "inline-flex items-center gap-2 flex-wrap mx-1",
                                children: [E.jsxs("span", {
                                    className: "inline-flex items-baseline space-x-2 flex-wrap cursor-pointer",
                                    onClick: () => a?.(l),
                                    children: [e.prefix && E.jsx("span", {
                                        children: e.prefix
                                    }), E.jsx("span", {
                                        className: "font-semibold rounded-sm px-1 text-white " + (u ? "border-2 border-green-500 bg-green-500" : "border-2 border-red-500 bg-red-500"),
                                        children: i
                                    }), E.jsx("span", {
                                        className: `font-semibold ${u ? "text-green-500" : "text-red-500"} ${!u && p ? "line-through" : ""}`,
                                        children: p || "✗"
                                    }), e.suffix && E.jsx("span", {
                                        children: e.suffix
                                    }), !u && f && E.jsxs("span", {
                                        className: "font-semibold text-green-600",
                                        children: ["→ ", f]
                                    })]
                                }), x && E.jsx(hs, {
                                    questionNumber: l,
                                    explanation: x,
                                    userAnswer: d,
                                    correctAnswer: m
                                })]
                            }, e.id)
                        }
                        )
                    })]
                }, e.id))]
            }), E.jsxs("div", {
                className: "w-full",
                children: [E.jsx("h5", {
                    className: "font-bold mb-4",
                    children: "Options"
                }), E.jsx("div", {
                    className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
                    children: i.options.map( (e, s) => E.jsxs("div", {
                        className: "p-2 border rounded text-sm",
                        children: [E.jsxs("span", {
                            className: "font-bold mr-2",
                            children: [l(e), "."]
                        }), o(e)]
                    }, l(e) || s))
                })]
            })]
        })]
    })
}
  , Es = ({questionGroup: e, answerKeys: s, userAnswers: t, mistakesByQuestionNumber: r, answerLocations: n, explanations: a, onQuestionClick: i}) => {
    const o = {
        questionGroup: e,
        answerKeys: s,
        userAnswers: t,
        mistakesByQuestionNumber: r,
        answerLocations: n,
        explanations: a,
        onQuestionClick: i
    };
    switch (e.type) {
    case "NOTE_COMPLETION":
    case "FORM_COMPLETION":
    case "SENTENCE_COMPLETION":
    case "SHORT_ANSWER_COMPLETION":
        return E.jsx(ys, {
            ...o
        });
    case "TABLE_COMPLETION":
        return E.jsx(ps, {
            ...o
        });
    case "MULTIPLE_CHOICE":
    case "TRUE_FALSE_NOT_GIVEN":
    case "YES_NO_NOT_GIVEN":
        return E.jsx(fs, {
            ...o
        });
    case "MULTIPLE_CHOICE_MANY":
        return E.jsx(gs, {
            ...o
        });
    case "FLOW_CHART_MATCHING":
        return E.jsx(js, {
            ...o
        });
    case "FLOW_CHART_COMPLETION":
        return E.jsx(Ns, {
            ...o
        });
    case "DIAGRAM_COMPLETION":
        return E.jsx(ks, {
            ...o
        });
    case "MATCHING":
    case "MATCHING_NAMES":
    case "MATCHING_SENTENCE_ENDINGS":
        return E.jsx(vs, {
            ...o
        });
    case "SUMMARY_COMPLETION":
        return E.jsx(Ss, {
            ...o
        });
    case "MATCHING_HEADINGS":
        return E.jsx(Ts, {
            ...o
        });
    case "MATCHING_INFORMATION":
        return E.jsx(As, {
            ...o
        });
    case "SUMMARY_COMPLETION_OPTIONS":
        return E.jsx(Is, {
            ...o
        });
    case "MATCHING_FEATURES":
        return E.jsx(ws, {
            ...o
        });
    default:
        return E.jsxs("div", {
            children: ["Unsupported question type: ", e.type]
        })
    }
}
  , Rs = () => R({
    mutationFn: async e => {
        const {data: s} = await m.post("/ai/evaluate", e);
        return s
    }
})
  , qs = () => R({
    mutationFn: async e => {
        const {data: s} = await m.post("/ai/evaluate/deep", e);
        return s
    }
})
  , _s = () => R({
    mutationFn: async ({testResultId: e, recordingMeta: s, audioFiles: t}) => {
        const r = new FormData;
        r.append("testResultId", e),
        r.append("recordingMeta", JSON.stringify(s)),
        t.forEach( (e, s) => {
            r.append("audioFiles", e, `segment-${s + 1}.webm`)
        }
        );
        const {data: n} = await m.post("/ai/evaluate/speaking", r);
        return n
    }
})
  , Ps = e => {
    const s = e - Math.floor(e);
    return Math.abs(s - .25) < .001 ? Math.floor(e) + .5 : Math.abs(s - .75) < .001 ? Math.floor(e) + 1 : Math.round(2 * e) / 2
}
  , Ls = e => e >= 8 ? "text-green-600 dark:text-green-400" : e >= 7 ? "text-blue-600 dark:text-blue-400" : e >= 6 ? "text-yellow-600 dark:text-yellow-300" : e >= 5 ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400"
  , $s = ({score: e, label: s, className: t=""}) => E.jsxs("div", {
    className: `text-center ${t}`,
    children: [E.jsx("h2", {
        className: "text-2xl font-bold mb-2",
        children: s
    }), E.jsx("div", {
        className: `text-6xl font-bold mb-2 ${Ls(e)}`,
        children: e
    })]
})
  , Os = {
    taskResponse: {
        name: "Task Achievement/Response",
        icon: E.jsx(be, {
            className: "h-4 w-4"
        })
    },
    coherenceCohesion: {
        name: "Coherence & Cohesion",
        icon: E.jsx(pe, {
            className: "h-4 w-4"
        })
    },
    lexicalResource: {
        name: "Lexical Resource",
        icon: E.jsx(he, {
            className: "h-4 w-4"
        })
    },
    grammaticalAccuracy: {
        name: "Grammatical Range & Accuracy",
        icon: E.jsx(xe, {
            className: "h-4 w-4"
        })
    },
    default: {
        name: "Criterion",
        icon: E.jsx(ue, {
            className: "h-4 w-4"
        })
    }
}
  , Ms = ({criterionKey: e, criterion: s}) => {
    const t = Os[e] || Os.default;
    return E.jsxs(u, {
        children: [E.jsx(x, {
            className: "pb-3",
            children: E.jsxs(h, {
                className: "flex items-center gap-2 text-lg",
                children: [t.icon, t.name, E.jsxs(p, {
                    className: `ml-auto ${Ls(s.score)} border-current`,
                    variant: "outline",
                    children: ["Band ", s.score]
                })]
            })
        }), E.jsx(b, {
            children: E.jsx(_e, {
                content: s.feedback
            })
        })]
    })
}
  , Gs = ({results: e, isWritingCheck: s=!1}) => {
    if (!Object.keys(e).length)
        return null;
    let t, r;
    Object.entries(e).forEach( ([e,s]) => {
        s && "number" == typeof s.overallScore && ("WRITING_TASK1" === e ? t = s.overallScore : "WRITING_TASK2" === e && (r = s.overallScore))
    }
    );
    const n = void 0 !== t && void 0 !== r
      , a = n ? ( (e, s) => {
        if (e && s)
            return Ps(1 * e / 3 + 2 * s / 3);
        return e ? Ps(e) : s ? Ps(s) : 0
    }
    )(t, r) : void 0;
    return E.jsxs("div", {
        className: "space-y-6",
        children: [n && a && E.jsx(u, {
            className: "bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border-green-200 dark:border-green-800",
            children: E.jsxs(b, {
                className: "pt-6",
                children: [E.jsx($s, {
                    score: a,
                    label: "Overall Writing Band Score"
                }), E.jsx("div", {
                    className: "text-center mt-2",
                    children: E.jsx(p, {
                        variant: "secondary",
                        className: s ? "bg-gradient-to-r from-green-500/10 to-blue-500/10" : "bg-gradient-to-r from-purple-500/10 to-blue-500/10",
                        children: s ? "✅ Writing Check Complete" : "✨ Premium Deep Evaluation Complete"
                    })
                })]
            })
        }), Object.entries(e).map( ([e,t]) => E.jsxs("div", {
            className: "space-y-6",
            children: [E.jsxs("div", {
                className: "text-center",
                children: [E.jsxs("h3", {
                    className: "text-2xl font-bold mb-2 flex items-center justify-center gap-2",
                    children: [E.jsx(fe, {
                        className: "h-6 w-6 text-yellow-500"
                    }), "WRITING_TASK1" === e ? "Task 1" : "Task 2", " ", s ? "Writing Check" : "Deep Check Evaluation"]
                }), E.jsx(p, {
                    variant: "secondary",
                    className: "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-200 dark:border-yellow-800",
                    children: s ? "✅ AI-Powered Analysis" : "⚡ Premium AI Analysis"
                })]
            }), E.jsx(u, {
                className: "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800",
                children: E.jsxs(b, {
                    className: "pt-6",
                    children: [E.jsx($s, {
                        score: t.overallScore,
                        label: ("WRITING_TASK1" === e ? "Task 1" : "Task 2") + " Band Score",
                        className: "mb-4"
                    }), E.jsx(_e, {
                        content: t.overallFeedback
                    })]
                })
            }), t.evaluation ? E.jsx("div", {
                className: "grid md:grid-cols-2 gap-4",
                children: Object.entries(t.evaluation).map( ([e,s]) => E.jsx(Ms, {
                    criterionKey: e,
                    criterion: s
                }, e))
            }) : E.jsx(u, {
                className: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
                children: E.jsxs(b, {
                    className: "pt-6",
                    children: [E.jsxs("div", {
                        className: "flex items-center gap-2 text-yellow-700 dark:text-yellow-300",
                        children: [E.jsx(Y, {
                            className: "h-5 w-5"
                        }), E.jsx("span", {
                            className: "font-medium",
                            children: "Detailed evaluation unavailable"
                        })]
                    }), E.jsx("p", {
                        className: "text-sm text-yellow-600 dark:text-yellow-400 mt-2",
                        children: "The detailed criteria breakdown could not be generated due to a processing error, but your overall score and feedback are available above."
                    })]
                })
            }), t.specificProblemsAndImprovements && E.jsxs(u, {
                children: [E.jsx(x, {
                    children: E.jsxs(h, {
                        className: "flex items-center gap-2",
                        children: [E.jsx(Y, {
                            className: "h-5 w-5"
                        }), "Specific Problems & Improvements"]
                    })
                }), E.jsx(b, {
                    children: E.jsx(_e, {
                        content: t.specificProblemsAndImprovements
                    })
                })]
            }), t.sampleAnswer && E.jsxs(u, {
                children: [E.jsx(x, {
                    children: E.jsxs(h, {
                        className: "flex items-center gap-2",
                        children: [E.jsx(ue, {
                            className: "h-5 w-5"
                        }), "Sample High-Band Answer"]
                    })
                }), E.jsxs(b, {
                    children: [E.jsx(_e, {
                        content: t.sampleAnswer
                    }), E.jsxs("div", {
                        className: "mt-4 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 flex items-center gap-2",
                        children: [E.jsx(re, {
                            className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"
                        }), E.jsx("p", {
                            className: "text-sm text-amber-800 dark:text-amber-200",
                            children: "AI sample answers are not always 100% accurate. Use them as a reference."
                        })]
                    })]
                })]
            }), t.improvementPlan && E.jsxs(u, {
                children: [E.jsx(x, {
                    children: E.jsxs(h, {
                        className: "flex items-center gap-2",
                        children: [E.jsx(be, {
                            className: "h-5 w-5"
                        }), "Personalized Improvement Plan"]
                    })
                }), E.jsx(b, {
                    children: E.jsx(_e, {
                        content: t.improvementPlan
                    })
                })]
            })]
        }, e))]
    })
}
  , Ws = ({userTestResult: e, examStore: s, writingContent: t, onUserTestResultUpdate: n, onReview: a, onFinish: m}) => {
    const {toast: u} = f()
      , x = $();
    qs(),
    g();
    const [h,p] = _.useState({})
      , [b,y] = _.useState(!1)
      , [k,S] = _.useState(e)
      , [C,T] = _.useState(!1)
      , [A,I] = _.useState(!1)
      , [R,q] = _.useState("")
      , [P,L] = _.useState(!1)
      , {submitReport: O, pending: M} = Pe()
      , {data: G, refetch: W} = j(e.id || "", {
        enabled: !!e.id,
        refetchInterval: !1
    });
    _.useEffect( () => {
        S(e)
    }
    , [e]),
    _.useEffect( () => {
        G && G.id === e.id && (S(G),
        n && n(G))
    }
    , [G, e.id, n]),
    _.useEffect( () => {
        const s = setTimeout( () => {
            !e.id || k.feedback && "{}" !== k.feedback || W()
        }
        , 1e3);
        return () => clearTimeout(s)
    }
    , [e.id, k.feedback, W]);
    const F = _.useMemo( () => k?.score && k.score > 0, [k?.score])
      , Q = _.useMemo( () => {
        try {
            return k?.feedback && "{}" !== k.feedback && Object.keys(JSON.parse(k.feedback || "{}")).length > 0
        } catch {
            return !1
        }
    }
    , [k?.feedback])
      , K = _.useMemo( () => {
        try {
            if (!k?.feedback)
                return !1;
            const e = JSON.parse(k.feedback)
              , s = e.WRITING_TASK1 && e.WRITING_TASK1.evaluation
              , t = e.WRITING_TASK2 && e.WRITING_TASK2.evaluation;
            return s || t
        } catch {
            return !1
        }
    }
    , [k?.feedback]);
    _.useMemo( () => Q && !F, [Q, F]),
    _.useEffect( () => {
        if (e?.feedback && "{}" !== e.feedback)
            try {
                const s = JSON.parse(e.feedback)
                  , t = {};
                let r = !1;
                s.WRITING_TASK1 && s.WRITING_TASK1.evaluation && (t.WRITING_TASK1 = s.WRITING_TASK1,
                r = !0),
                s.WRITING_TASK2 && s.WRITING_TASK2.evaluation && (t.WRITING_TASK2 = s.WRITING_TASK2,
                r = !0),
                r && (p(t),
                y(!0))
            } catch (s) {}
    }
    , [e?.feedback]);
    const z = _.useMemo( () => {
        if (!k.feedback)
            return null;
        try {
            const e = JSON.parse(k.feedback);
            if ("object" == typeof e) {
                const s = [];
                return e.WRITING_TASK1 && s.push(`## Writing Task 1 Feedback\n\n${e.WRITING_TASK1}`),
                e.WRITING_TASK2 && s.push(`## Writing Task 2 Feedback\n\n${e.WRITING_TASK2}`),
                s.join("\n\n---\n\n")
            }
            return "string" == typeof e ? e : JSON.stringify(e)
        } catch (e) {
            return k.feedback
        }
    }
    , [k.feedback]);
    return E.jsxs("div", {
        className: "space-y-6",
        children: [E.jsxs("div", {
            className: "text-center",
            children: [E.jsx("h2", {
                className: "text-3xl font-bold mb-2",
                children: "Exam Results"
            }), E.jsx("div", {
                className: "inline-flex items-center px-4 py-2 bg-secondary rounded-full",
                children: E.jsxs("span", {
                    className: "text-sm text-blue-600 font-medium",
                    children: [e.section.toUpperCase(), " Section"]
                })
            })]
        }), (s?.usageLimitReached || C) && E.jsxs("div", {
            className: "bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-6",
            children: [E.jsxs("div", {
                className: "flex items-center gap-3 mb-3",
                children: [E.jsx("div", {
                    className: "flex-shrink-0",
                    children: E.jsx("svg", {
                        className: "h-6 w-6 text-orange-600",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: E.jsx("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 6.5c-.77.833.192 2.5 1.732 2.5z"
                        })
                    })
                }), E.jsxs("div", {
                    className: "flex-1",
                    children: [E.jsx("h3", {
                        className: "text-lg font-semibold text-orange-900 dark:text-orange-100",
                        children: "Usage Limit Reached"
                    }), E.jsx("p", {
                        className: "text-sm text-orange-700 dark:text-orange-200 mt-1",
                        children: "You've reached your usage limit for AI-powered feedback. Upgrade to Standard to get unlimited access to writing feedback and deep evaluations."
                    })]
                })]
            }), E.jsx("div", {
                className: "flex gap-3",
                children: E.jsx("button", {
                    onClick: () => x("/pricing"),
                    className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    children: "Upgrade to Standard"
                })
            })]
        }), b && E.jsx(Gs, {
            results: h
        }), !b && K && E.jsx(Gs, {
            results: JSON.parse(k.feedback || "{}"),
            isWritingCheck: !0
        }), !b && Q && !K && z && E.jsxs("div", {
            className: "bg-white dark:bg-card p-6 rounded-lg border shadow-sm",
            children: [E.jsx("h3", {
                className: "text-xl font-semibold mb-4",
                children: "Writing Feedback"
            }), E.jsx(_e, {
                content: z
            })]
        }), !Q && !b && E.jsxs("div", {
            className: "bg-white dark:bg-card p-8 rounded-lg border shadow-sm text-center",
            children: [E.jsx("h3", {
                className: "text-xl font-semibold mb-2",
                children: "No Feedback Available"
            }), E.jsx("p", {
                className: "text-muted-foreground",
                children: "Your test has been submitted successfully. Feedback was not generated during submission."
            })]
        }), E.jsxs("div", {
            className: "flex justify-center gap-4 mt-8 pt-6 border-t",
            children: [E.jsxs(i, {
                open: A,
                onOpenChange: I,
                children: [E.jsx(o, {
                    asChild: !0,
                    children: E.jsx(r, {
                        variant: "outline",
                        className: "px-6",
                        children: "Report Issue"
                    })
                }), E.jsxs(l, {
                    children: [E.jsxs(c, {
                        children: [E.jsx(d, {
                            children: "Report an Issue"
                        }), E.jsx(N, {
                            children: "Help us improve by reporting any issues you found with this test. Your feedback is valuable to us."
                        })]
                    }), E.jsx("div", {
                        className: "py-4",
                        children: E.jsx(v, {
                            placeholder: "Describe the issue (optional)",
                            value: R,
                            onChange: e => q(e.target.value),
                            rows: 4,
                            className: "w-full"
                        })
                    }), E.jsxs(w, {
                        children: [E.jsx(r, {
                            variant: "outline",
                            onClick: () => I(!1),
                            children: "Cancel"
                        }), E.jsx(r, {
                            onClick: () => {
                                e.id && O({
                                    testId: e.testId,
                                    userTestResultId: e.id,
                                    comment: R || void 0
                                }, {
                                    onSuccess: () => {
                                        u({
                                            title: "Report submitted successfully",
                                            description: "Thank you for your feedback!"
                                        }),
                                        I(!1),
                                        q(""),
                                        L(!0)
                                    }
                                    ,
                                    onError: e => {
                                        u({
                                            title: "Error",
                                            description: e instanceof Error ? e.message : "Failed to submit report",
                                            variant: "destructive"
                                        })
                                    }
                                })
                            }
                            ,
                            disabled: M,
                            children: M ? "Submitting..." : "Submit Report"
                        })]
                    })]
                })]
            }), E.jsx(i, {
                open: P,
                onOpenChange: L,
                children: E.jsxs(l, {
                    children: [E.jsxs(c, {
                        children: [E.jsx(d, {
                            children: "Thanks for your feedback"
                        }), E.jsx(N, {
                            children: "We appreciate you helping us improve. Our team will review your report shortly."
                        })]
                    }), E.jsx(w, {
                        children: E.jsx(r, {
                            onClick: () => L(!1),
                            children: "Close"
                        })
                    })]
                })
            }), E.jsx(r, {
                variant: "outline",
                onClick: a,
                className: "px-6",
                children: "Review Mistakes"
            }), E.jsx(r, {
                onClick: m,
                className: "px-6",
                children: "Finish"
            })]
        })]
    })
}
  , Fs = e => {
    if (!e)
        return {};
    if ("object" == typeof e)
        return e;
    if ("string" == typeof e)
        try {
            return JSON.parse(e)
        } catch (s) {
            return {}
        }
    return {}
}
  , Qs = [{
    key: "fluencyCoherence",
    label: "Fluency & Coherence",
    shortLabel: "FC",
    icon: E.jsx(pe, {
        className: "h-4 w-4"
    })
}, {
    key: "lexicalResource",
    label: "Lexical Resource",
    shortLabel: "LR",
    icon: E.jsx(he, {
        className: "h-4 w-4"
    })
}, {
    key: "grammaticalAccuracy",
    label: "Grammatical Range & Accuracy",
    shortLabel: "GRA",
    icon: E.jsx(xe, {
        className: "h-4 w-4"
    })
}]
  , Ks = ({userTestResult: e, onReview: s, onFinish: t}) => {
    const n = _.useMemo( () => {
        const s = Fs(e.feedback);
        return s?.SPEAKING || {}
    }
    , [e.feedback])
      , a = n?.status
      , i = "SKIPPED" === a
      , o = "FAILED" === a
      , l = Boolean(n?.evaluation || n?.overallScore || n?.overallFeedback || n?.answerFeedback || e.score > 0)
      , c = n?.overallScore ?? e.score ?? 0
      , d = n?.overallFeedback;
    return E.jsxs("div", {
        className: "space-y-6",
        children: [E.jsxs("div", {
            className: "text-center",
            children: [E.jsx("h2", {
                className: "text-3xl font-bold text-foreground mb-2",
                children: "Speaking Results"
            }), E.jsxs("div", {
                className: "inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 dark:bg-red-950/30 rounded-full border border-red-200 dark:border-red-900/50",
                children: [E.jsx(ge, {
                    className: "w-4 h-4 text-red-600 dark:text-red-400"
                }), E.jsx("span", {
                    className: "text-sm font-medium text-red-600 dark:text-red-400",
                    children: "Speaking Section"
                })]
            })]
        }), E.jsxs("div", {
            className: "rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 flex items-center gap-2",
            children: [E.jsx(re, {
                className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"
            }), E.jsxs("p", {
                className: "text-sm text-amber-800 dark:text-amber-200",
                children: [E.jsx("span", {
                    className: "font-semibold",
                    children: "Note:"
                }), " AI speaking evaluation is not always accurate. Use it as guidance, and do not feel demotivated if the score is lower than expected."]
            })]
        }), i && E.jsx("div", {
            className: "rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 p-6",
            children: E.jsxs("div", {
                className: "flex items-start gap-3",
                children: [E.jsx(re, {
                    className: "w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
                }), E.jsxs("div", {
                    children: [E.jsx("h3", {
                        className: "text-lg font-semibold text-amber-900 dark:text-amber-100",
                        children: "Speaking evaluation was skipped"
                    }), E.jsx("p", {
                        className: "text-sm text-amber-800 dark:text-amber-200 mt-1",
                        children: n?.message || "Microphone access was unavailable, so no AI speaking evaluation was generated."
                    })]
                })]
            })
        }), o && E.jsx("div", {
            className: "rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 p-6",
            children: E.jsxs("div", {
                className: "flex items-start gap-3",
                children: [E.jsx(je, {
                    className: "w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                }), E.jsxs("div", {
                    children: [E.jsx("h3", {
                        className: "text-lg font-semibold text-red-900 dark:text-red-100",
                        children: "Speaking evaluation failed"
                    }), E.jsx("p", {
                        className: "text-sm text-red-700 dark:text-red-300 mt-1",
                        children: n?.error || "We could not evaluate your speaking response this time."
                    })]
                })]
            })
        }), !i && !o && !l && E.jsxs("div", {
            className: "rounded-xl border border-border bg-card p-8 text-center",
            children: [E.jsx(ge, {
                className: "w-10 h-10 text-muted-foreground/40 mx-auto mb-3"
            }), E.jsx("h3", {
                className: "text-lg font-semibold text-foreground",
                children: "No speaking evaluation available"
            }), E.jsx("p", {
                className: "text-sm text-muted-foreground mt-2",
                children: "No recordings were submitted, so transcript and speaking feedback are not available."
            })]
        }), l && E.jsxs(E.Fragment, {
            children: [E.jsx(u, {
                className: "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800",
                children: E.jsxs(b, {
                    className: "pt-6",
                    children: [E.jsxs("div", {
                        className: "text-center",
                        children: [E.jsx("h3", {
                            className: "text-2xl font-bold mb-2",
                            children: "Overall Speaking Band Score"
                        }), E.jsx("div", {
                            className: `text-6xl font-bold mb-2 ${Ls(c)}`,
                            children: c.toFixed(1)
                        })]
                    }), E.jsx("div", {
                        className: "text-center mt-2",
                        children: E.jsx(p, {
                            variant: "secondary",
                            className: "bg-gradient-to-r from-red-500/10 to-rose-500/10",
                            children: "AI-Powered Speaking Analysis"
                        })
                    })]
                })
            }), Le(d) && E.jsx(u, {
                className: "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800",
                children: E.jsx(b, {
                    className: "pt-6",
                    children: E.jsx("div", {
                        className: "text-sm text-foreground leading-relaxed",
                        children: E.jsx(_e, {
                            content: Le(d)
                        })
                    })
                })
            }), n?.evaluation && Object.keys(n.evaluation).length > 0 && E.jsx("div", {
                className: "grid md:grid-cols-3 gap-4",
                children: Qs.map(e => {
                    const s = n.evaluation?.[e.key]
                      , t = s?.score;
                    return E.jsxs(u, {
                        children: [E.jsx(x, {
                            className: "pb-3",
                            children: E.jsxs(h, {
                                className: "flex items-center gap-2 text-lg",
                                children: [e.icon, e.label, E.jsx(p, {
                                    className: `ml-auto ${null != t ? Ls(t) : "text-muted-foreground"} border-current`,
                                    variant: "outline",
                                    children: null != t ? `Band ${t.toFixed(1)}` : "-"
                                })]
                            })
                        }), E.jsx(b, {
                            children: E.jsx("div", {
                                className: "text-sm text-muted-foreground leading-relaxed",
                                children: Le(s?.feedback) ? E.jsx(_e, {
                                    content: Le(s.feedback)
                                }) : E.jsx("span", {
                                    className: "italic",
                                    children: "No feedback provided."
                                })
                            })
                        })]
                    }, e.key)
                }
                )
            }), Le(n?.specificProblemsAndImprovements) && E.jsxs(u, {
                children: [E.jsx(x, {
                    children: E.jsxs(h, {
                        className: "flex items-center gap-2",
                        children: [E.jsx(Y, {
                            className: "h-5 w-5"
                        }), "Specific Problems & Improvements"]
                    })
                }), E.jsx(b, {
                    children: E.jsx(_e, {
                        content: Le(n.specificProblemsAndImprovements)
                    })
                })]
            }), Le(n?.improvementPlan) && E.jsxs(u, {
                children: [E.jsx(x, {
                    children: E.jsxs(h, {
                        className: "flex items-center gap-2",
                        children: [E.jsx(be, {
                            className: "h-5 w-5"
                        }), "Personalized Improvement Plan"]
                    })
                }), E.jsx(b, {
                    children: E.jsx(_e, {
                        content: Le(n.improvementPlan)
                    })
                })]
            })]
        }), E.jsxs("div", {
            className: "flex justify-center gap-4 pt-4",
            children: [E.jsx(r, {
                variant: "outline",
                onClick: s,
                className: "px-6",
                children: "Review Transcript"
            }), E.jsx(r, {
                onClick: t,
                className: "px-6 bg-red-600 hover:bg-red-700 text-white",
                children: "Finish"
            })]
        })]
    })
}
  , zs = ({onFinish: e, onReview: s, examStore: t, userTestResult: n, writingContent: a, onUserTestResultUpdate: m, isMock: u}) => {
    const x = $()
      , h = O()
      , [p,b] = _.useState(!1)
      , [f,g] = _.useState("")
      , [j,y] = _.useState(!1)
      , {submitReport: k, pending: S} = Pe()
      , C = {
        title: "Exam Results"
    }
      , T = e => {
        if (!e)
            return null;
        return e.toLowerCase().replace(/-/g, "_")
    }
    ;
    if (!n)
        return E.jsxs("div", {
            className: "flex h-screen flex-col items-center justify-center",
            children: [E.jsx("p", {
                className: "text-red-500",
                children: "Test results not found"
            }), E.jsx(r, {
                onClick: () => x(-1),
                children: "Go Back"
            })]
        });
    const A = () => {
        if (s)
            return void s();
        const e = T(n.section);
        n.id && e && n.testId && x(`/exam/${e}/${n.testId}/review/${n.id}`)
    }
      , I = () => {
        if (e)
            e();
        else if (u)
            x("/tests/mock");
        else {
            const e = h.state?.from;
            x(e || (e => {
                const s = T(e);
                return s ? "writing_task1" === s ? "/tests/writing-task1" : "writing_task2" === s ? "/tests/writing-task2" : `/tests/${s}` : "/tests"
            }
            )(n.section))
        }
    }
    ;
    if ("WRITING" === n.section.toUpperCase() || "WRITING_TASK1" === n.section.toUpperCase() || "WRITING_TASK2" === n.section.toUpperCase())
        return E.jsx(as, {
            sectionInstruction: C,
            timeLeft: 0,
            parts: [],
            currentPart: 1,
            onPartChange: () => {}
            ,
            onSubmitClick: () => {}
            ,
            examStore: t,
            button: null,
            children: E.jsx(Ws, {
                userTestResult: n,
                examStore: t,
                writingContent: a,
                onUserTestResultUpdate: m,
                onReview: A,
                onFinish: I
            })
        });
    if ("SPEAKING" === n.section.toUpperCase())
        return E.jsx(as, {
            sectionInstruction: C,
            timeLeft: 0,
            parts: [],
            currentPart: 1,
            onPartChange: () => {}
            ,
            onSubmitClick: () => {}
            ,
            examStore: t,
            button: null,
            children: E.jsx(Ks, {
                userTestResult: n,
                onReview: A,
                onFinish: I
            })
        });
    const R = Fs(n.mistakesByQuestionType)
      , q = Fs(n.mistakesByQuestionNumber)
      , P = Fs(n.mistakesByPart)
      , L = n.totalCorrectAnswers + n.totalIncorrectAnswers
      , M = n.totalCorrectAnswers
      , G = L > 0 ? Math.round(M / L * 100) : 0
      , W = Object.keys(q);
    return E.jsx(as, {
        sectionInstruction: C,
        timeLeft: 0,
        parts: [],
        currentPart: 1,
        onPartChange: () => {}
        ,
        onSubmitClick: () => {}
        ,
        examStore: t,
        button: null,
        children: E.jsxs("div", {
            className: "space-y-6 pb-20",
            children: [E.jsxs("div", {
                className: "text-center",
                children: [E.jsx("h2", {
                    className: "text-3xl font-bold mb-2",
                    children: "Exam Results"
                }), E.jsx("div", {
                    className: "inline-flex items-center px-3 py-2 bg-secondary rounded-full",
                    children: E.jsxs("span", {
                        className: "text-sm text-blue-600 font-medium",
                        children: [n.section.toUpperCase(), " Section"]
                    })
                })]
            }), E.jsx("div", {
                className: "bg-secondary p-6 rounded-xl border shadow-sm",
                children: E.jsxs("div", {
                    className: "text-center",
                    children: [E.jsx("h3", {
                        className: "text-lg font-semibold mb-2",
                        children: "Your Band Score"
                    }), E.jsx("div", {
                        className: "text-4xl font-bold text-blue-600 mb-1",
                        children: n.score
                    }), E.jsxs("div", {
                        className: "text-sm",
                        children: ["out of ", n.maxScore]
                    }), E.jsxs("div", {
                        className: "mt-2 text-sm text-gray-500",
                        children: [G, "% (", M, "/", L, " correct)"]
                    })]
                })
            }), W.length > 0 && E.jsxs("div", {
                className: "bg-white p-6 rounded-lg border shadow-sm",
                children: [E.jsx("h4", {
                    className: "text-lg font-semibold mb-4",
                    children: "Incorrect Questions"
                }), E.jsx("div", {
                    className: "flex flex-wrap gap-2",
                    children: W.map(e => E.jsxs("span", {
                        className: "px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium",
                        children: ["Question ", e]
                    }, e))
                })]
            }), E.jsxs("div", {
                className: "p-6 rounded-lg border shadow-sm",
                children: [E.jsx("h4", {
                    className: "text-lg font-semibold mb-4",
                    children: "Performance by Part"
                }), Object.keys(P).length > 0 ? E.jsx("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                    children: Object.entries(P).map( ([e,s]) => {
                        const t = /^part_(\d+)$/i.test(e) ? `Part ${e.match(/^part_(\d+)$/i)[1]}` : e.replace(/_/g, " ").replace(/\b\w/g, e => e.toUpperCase());
                        return E.jsxs("div", {
                            className: "flex justify-between items-center p-3 bg-secondary rounded-lg",
                            children: [E.jsx("span", {
                                className: "font-medium",
                                children: t
                            }), E.jsxs("div", {
                                className: "text-right",
                                children: [E.jsx("span", {
                                    className: "text-red-600 font-semibold",
                                    children: s
                                }), E.jsxs("span", {
                                    className: "text-sm ml-1",
                                    children: ["mistake", 1 !== s ? "s" : ""]
                                })]
                            })]
                        }, e)
                    }
                    )
                }) : E.jsxs("div", {
                    className: "text-center py-4",
                    children: [E.jsx("div", {
                        className: "text-green-600 font-semibold",
                        children: "🎉 Perfect Performance!"
                    }), E.jsx("p", {
                        className: "text-gray-600",
                        children: "No mistakes in any part."
                    })]
                })]
            }), E.jsxs("div", {
                className: "p-6 rounded-lg border shadow-sm",
                children: [E.jsx("h4", {
                    className: "text-lg font-semibold mb-4",
                    children: "Mistakes by Question Type"
                }), Object.keys(R).length > 0 ? E.jsx("div", {
                    className: "space-y-2",
                    children: Object.entries(R).map( ([e,s]) => {
                        const t = "unknown" === e ? "Unanswered Questions" : e.toLowerCase().split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ");
                        return E.jsxs("div", {
                            className: "flex justify-between items-center p-3 bg-secondary rounded-lg",
                            children: [E.jsx("span", {
                                className: "font-medium capitalize",
                                children: t
                            }), E.jsxs("div", {
                                className: "text-right",
                                children: [E.jsx("span", {
                                    className: "text-red-600 font-semibold",
                                    children: s
                                }), E.jsxs("span", {
                                    className: "text-sm ml-1",
                                    children: ["mistake", 1 !== s ? "s" : ""]
                                })]
                            })]
                        }, e)
                    }
                    )
                }) : E.jsxs("div", {
                    className: "text-center py-4",
                    children: [E.jsx("div", {
                        className: "text-green-600 font-semibold",
                        children: "🎉 Perfect Score!"
                    }), E.jsx("p", {
                        children: "No mistakes by question type."
                    })]
                })]
            }), E.jsxs("div", {
                className: "flex justify-center gap-4 mt-8 pt-6 border-t",
                children: [E.jsxs(i, {
                    open: p,
                    onOpenChange: b,
                    children: [E.jsx(o, {
                        asChild: !0,
                        children: E.jsx(r, {
                            variant: "outline",
                            className: "px-6",
                            children: "Report Issue"
                        })
                    }), E.jsxs(l, {
                        children: [E.jsxs(c, {
                            children: [E.jsx(d, {
                                children: "Report an Issue"
                            }), E.jsx(N, {
                                children: "Help us improve by reporting any issues you found with this test. Your feedback is valuable to us."
                            })]
                        }), E.jsx("div", {
                            className: "py-4",
                            children: E.jsx(v, {
                                placeholder: "Describe the issue",
                                value: f,
                                onChange: e => g(e.target.value),
                                rows: 4,
                                className: "w-full",
                                required: !0
                            })
                        }), E.jsxs(w, {
                            children: [E.jsx(r, {
                                variant: "outline",
                                onClick: () => b(!1),
                                children: "Cancel"
                            }), E.jsx(r, {
                                onClick: () => {
                                    n && n.id && k({
                                        testId: n.testId,
                                        userTestResultId: n.id,
                                        comment: f || void 0
                                    }, {
                                        onSuccess: () => {
                                            Oe.success("Report submitted successfully. Thank you for your feedback!"),
                                            b(!1),
                                            g(""),
                                            y(!0)
                                        }
                                        ,
                                        onError: e => {
                                            Oe.error(e instanceof Error ? e.message : "Failed to submit report")
                                        }
                                    })
                                }
                                ,
                                disabled: S || !f.trim(),
                                children: S ? "Submitting..." : "Submit Report"
                            })]
                        })]
                    })]
                }), E.jsx(i, {
                    open: j,
                    onOpenChange: y,
                    children: E.jsxs(l, {
                        children: [E.jsxs(c, {
                            children: [E.jsx(d, {
                                children: "Thanks for your feedback"
                            }), E.jsx(N, {
                                children: "We appreciate you helping us improve. Our team will review your report shortly."
                            })]
                        }), E.jsx(w, {
                            children: E.jsx(r, {
                                onClick: () => y(!1),
                                children: "Close"
                            })
                        })]
                    })
                }), E.jsx(r, {
                    variant: "outline",
                    onClick: A,
                    className: "px-6",
                    children: "Review Mistakes"
                }), E.jsx(r, {
                    onClick: I,
                    className: "px-6",
                    children: "Finish"
                })]
            })]
        })
    })
}
  , Ds = e => {
    const s = _.useRef(new Map);
    _.useEffect( () => {
        if (e && s.current.has(e)) {
            const t = s.current.get(e);
            t && t.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            })
        }
    }
    , [e]);
    return {
        highlightText: (e, t) => {
            if (0 === t.length)
                return e;
            const r = [];
            if (t.forEach( ({excerpt: s, isCurrent: t, questionNum: n}) => {
                if (s)
                    if (Fe(s)) {
                        const a = Qe(s);
                        let i = 0
                          , o = !0;
                        const l = [];
                        for (const s of a) {
                            const t = Ke(e, s, i);
                            if (!t) {
                                o = !1;
                                break
                            }
                            l.push(t),
                            i = t.end
                        }
                        (o ? l : ze(e, s)).forEach(e => {
                            r.push({
                                start: e.start,
                                end: e.end,
                                isCurrent: t,
                                questionNum: n
                            })
                        }
                        )
                    } else {
                        const a = Ke(e, s, 0);
                        a && r.push({
                            start: a.start,
                            end: a.end,
                            isCurrent: t,
                            questionNum: n
                        })
                    }
            }
            ),
            0 === r.length)
                return e;
            const n = Array.from(new Set(r.flatMap(e => [e.start, e.end]))).sort( (e, s) => e - s)
              , a = [];
            for (let s = 0; s < n.length - 1; s++) {
                const e = n[s]
                  , t = n[s + 1];
                if (e >= t)
                    continue;
                const i = r.filter(s => s.start < t && s.end > e);
                if (0 === i.length)
                    continue;
                const o = new Map;
                i.forEach(e => {
                    const s = o.get(e.questionNum);
                    (!s || !s.isCurrent && e.isCurrent) && o.set(e.questionNum, {
                        questionNum: e.questionNum,
                        isCurrent: e.isCurrent
                    })
                }
                );
                const l = Array.from(o.values()).sort( (e, s) => parseInt(e.questionNum) - parseInt(s.questionNum));
                a.push({
                    start: e,
                    end: t,
                    questions: l,
                    hasCurrent: l.some(e => e.isCurrent)
                })
            }
            const i = [];
            let o = 0
              , l = ""
              , c = -1
              , d = [];
            const m = new Set;
            return a.forEach( (t, r) => {
                t.start > o && i.push(e.substring(o, t.start));
                const n = t.questions
                  , a = n.length > 1
                  , u = n.map(e => e.questionNum)
                  , x = u.filter(e => !d.includes(e))
                  , h = n.map(e => `${e.questionNum}:${e.isCurrent ? "1" : "0"}`).join("|")
                  , p = t.start !== c || h !== l
                  , b = p ? n.filter(e => !d.includes(e.questionNum)) : []
                  , f = p ? b : [];
                a && p && (0 === d.length ? x.slice(1).forEach(e => m.add(e)) : x.forEach(e => m.add(e)));
                const g = p && f.length > 0 ? f.map(e => E.jsxs("span", {
                    ref: t => {
                        t && s.current.set(e.questionNum, t)
                    }
                    ,
                    className: `font-bold ${e.isCurrent ? "text-green-900 dark:text-green-100 bg-green-400 dark:bg-green-600" : m.has(e.questionNum) ? "text-orange-950 dark:text-orange-100 bg-orange-300 dark:bg-orange-700" : "bg-yellow-400 dark:bg-yellow-500 text-black"} px-1 py-0.5 rounded text-xs mr-1`,
                    children: ["Q", e.questionNum]
                }, `badge-${t.start}-${e.questionNum}`)) : null
                  , j = t.hasCurrent ? "bg-green-200 dark:bg-green-800/50 border-b-2 border-green-500 dark:border-green-400" : a ? "bg-orange-100 dark:bg-orange-900/50 border-b-2 border-orange-400 dark:border-orange-500" : "bg-yellow-100 dark:bg-yellow-900/50 border-b-2 border-yellow-400 dark:border-yellow-500";
                i.push(E.jsxs("span", {
                    ref: e => {
                        e && n.forEach(t => {
                            s.current.has(t.questionNum) || s.current.set(t.questionNum, e)
                        }
                        )
                    }
                    ,
                    className: `${j} pr-1 py-0.5 transition-colors duration-200`,
                    title: `Answer for Question${n.length > 1 ? "s" : ""} ${n.map(e => e.questionNum).join(", ")}`,
                    children: [g, e.substring(t.start, t.end)]
                }, `highlight-${r}`)),
                o = t.end,
                c = t.end,
                l = h,
                d = u
            }
            ),
            o < e.length && i.push(e.substring(o)),
            E.jsx(E.Fragment, {
                children: i
            })
        }
        ,
        highlightRefs: s
    }
}
  , Us = ({passage: e, answerLocations: s, currentQuestionNumber: t}) => {
    const {highlightText: r} = Ds(t)
      , n = Me(s);
    return E.jsxs("div", {
        className: "max-w-none space-y-6",
        children: [E.jsx("h2", {
            className: "text-2xl font-semibold text-foreground text-center",
            children: e.title
        }), e.subtitle && E.jsx("p", {
            className: "text-lg italic text-gray-800 dark:text-gray-200 mb-8 text-center",
            children: e.subtitle
        }), E.jsx("div", {
            className: "whitespace-pre-wrap",
            children: E.jsx("div", {
                className: "space-y-8",
                children: e.content.map( (e, s) => {
                    const a = "object" == typeof e
                      , i = a ? e.text || e.content || "" : e
                      , o = a ? e.label : void 0
                      , l = ( (e, s, r) => {
                        const a = []
                          , i = new Set;
                        return Object.entries(n).forEach( ([n,o]) => {
                            o.forEach(o => {
                                if (!Ge(o, e, r, s))
                                    return;
                                const l = `${n}::${o.excerpt}`;
                                i.has(l) || (i.add(l),
                                a.push({
                                    questionNum: n,
                                    excerpt: o.excerpt || "",
                                    isCurrent: n === t
                                }))
                            }
                            )
                        }
                        ),
                        a
                    }
                    )(s, o, i);
                    return E.jsxs("div", {
                        className: o ? "flex gap-2" : "block",
                        children: [o && E.jsx("span", {
                            className: "font-bold text-lg min-w-[24px]",
                            children: o
                        }), E.jsx("div", {
                            className: o ? "flex-1" : "block",
                            children: E.jsx("p", {
                                className: "text-foreground leading-7",
                                children: r(i, l)
                            })
                        })]
                    }, s)
                }
                )
            })
        })]
    })
}
  , Bs = ({vocabulary: e}) => {
    const [s,t] = _.useState("")
      , r = e.filter(e => e.word.toLowerCase().includes(s.toLowerCase()) || e.definition.toLowerCase().includes(s.toLowerCase()));
    return E.jsxs(u, {
        className: "w-full",
        children: [E.jsx(x, {
            children: E.jsxs(h, {
                className: "flex items-center justify-between",
                children: [E.jsxs("span", {
                    children: ["Vocabulary (", e.length, " words)"]
                }), E.jsxs("div", {
                    className: "relative w-64",
                    children: [E.jsx(Ne, {
                        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4"
                    }), E.jsx(y, {
                        type: "text",
                        placeholder: "Search vocabulary...",
                        value: s,
                        onChange: e => t(e.target.value),
                        className: "pl-10"
                    })]
                })]
            })
        }), E.jsx(b, {
            children: E.jsx("div", {
                className: "space-y-4",
                children: 0 === r.length ? E.jsx("p", {
                    className: "text-center text-gray-500 dark:text-gray-400 py-8",
                    children: s ? "No vocabulary items found matching your search" : "No vocabulary items available"
                }) : r.map(e => E.jsxs("div", {
                    className: "border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0",
                    children: [E.jsxs("div", {
                        className: "flex items-start justify-between mb-2",
                        children: [E.jsx("h4", {
                            className: "text-lg font-semibold text-gray-900 dark:text-gray-100",
                            children: e.word
                        }), e.partOfSpeech && E.jsx(p, {
                            variant: "secondary",
                            className: "ml-2",
                            children: e.partOfSpeech
                        })]
                    }), E.jsx("p", {
                        className: "text-gray-700 dark:text-gray-300 mb-2",
                        children: e.definition
                    }), e.example && E.jsxs("p", {
                        className: "text-sm text-gray-600 dark:text-gray-400 italic mb-2",
                        children: ['Example: "', e.example, '"']
                    }), e.sourceContext && E.jsxs("p", {
                        className: "text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded",
                        children: ["Context: ", e.sourceContext]
                    })]
                }, e.id))
            })
        })]
    })
}
  , Hs = 15e3
  , Vs = .25
  , Ys = .6
  , Js = "examIntegrity:viewportBeforeRefresh"
  , Xs = 3e4
  , Zs = "examIntegrity:contextMenuBeforeRefresh"
  , et = 12e4
  , st = 6e5
  , tt = .1;
function rt() {
    return navigator.platform || navigator.userAgent || "unknown"
}
function nt(e) {
    return e.replace(/\s+/g, " ").trim().length
}
function at({answers: e, answerKeys: s}) {
    const t = s?.answers ? Object.keys(s.answers) : []
      , r = Object.keys(e)
      , n = t.length > 0 ? t.length : r.length
      , a = (t.length > 0 ? t : r).filter(s => {
        return t = e[s],
        Array.isArray(t) ? t.some(e => e.trim().length > 0) : "string" == typeof t && t.trim().length > 0;
        var t
    }
    ).length;
    return {
        totalAnswers: n,
        filledAnswers: a,
        answerFillRate: n > 0 ? a / n : 0
    }
}
function it(e, s) {
    return Array.from(document.querySelectorAll(s)).reduce( (s, t) => {
        const r = nt(t.innerText);
        if (r <= 0)
            return s;
        const n = nt(function(e, s) {
            const t = [];
            for (let r = 0; r < e.rangeCount; r += 1) {
                const n = e.getRangeAt(r);
                if (!n.intersectsNode(s))
                    continue;
                const a = document.createRange();
                a.selectNodeContents(s);
                const i = n.cloneRange();
                i.compareBoundaryPoints(Range.START_TO_START, a) < 0 && i.setStart(a.startContainer, a.startOffset),
                i.compareBoundaryPoints(Range.END_TO_END, a) > 0 && i.setEnd(a.endContainer, a.endOffset),
                t.push(i.toString()),
                i.detach(),
                a.detach()
            }
            return t.join(" ")
        }(e, t));
        if (n <= 0)
            return s;
        const a = n / r;
        return !s || a > s.selectedRatio ? {
            element: t,
            elementCharacters: r,
            selectedCharacters: n,
            selectedRatio: a
        } : s
    }
    , null)
}
function ot({enabled: e, section: s, testId: t, testTitle: r, mockPackId: n, mockPackName: a, reviewMode: i=!1}) {
    const o = q()
      , l = _.useRef({})
      , c = _.useRef(0)
      , d = _.useRef(0)
      , m = _.useRef([])
      , u = _.useRef(null)
      , x = _.useRef(null)
      , h = _.useRef([])
      , p = _.useRef(null)
      , b = _.useRef(0)
      , f = _.useRef(0)
      , g = _.useRef(null)
      , j = _.useRef([])
      , N = _.useRef(null)
      , v = _.useRef(null)
      , w = _.useRef(null)
      , y = _.useRef({
        width: "undefined" != typeof window ? window.innerWidth : 0,
        height: "undefined" != typeof window ? window.innerHeight : 0
    })
      , k = _.useCallback(s => {
        if (!e)
            return;
        const t = `${s.eventType}:${s.section ?? ""}:${"string" == typeof s.metadata?.shortcut ? s.metadata.shortcut : ""}`
          , r = Date.now();
        return r - (l.current[t] ?? 0) < 1500 ? void 0 : (l.current[t] = r,
        De.reportEvent(s).catch( () => {}
        ))
    }
    , [e])
      , S = _.useCallback( (e, i) => ("DEVTOOLS_SHORTCUT_ATTEMPT" !== e && "SCREENSHOT_ATTEMPT" !== e && "DEVTOOLS_SEQUENCE_THREAT" !== e && "SCRAPING_SEQUENCE_THREAT" !== e && "WHOLE_PASSAGE_COPY_ATTEMPT" !== e && "WHOLE_TRANSCRIPT_COPY_ATTEMPT" !== e && "WHOLE_QUESTION_GROUP_COPY_ATTEMPT" !== e && "SELECT_ALL_COPY_ATTEMPT" !== e || (c.current = Date.now(),
    g.current = {
        at: Date.now(),
        eventType: e,
        metadata: i
    }),
    k({
        eventType: e,
        section: s,
        testId: t,
        testTitle: r,
        mockPackId: n,
        mockPackName: a,
        metadata: i
    })), [n, a, k, s, t, r])
      , C = _.useCallback(e => {
        e && e.finally( () => {
            o.invalidateQueries({
                queryKey: ["notifications", "active"]
            })
        }
        )
    }
    , [o])
      , T = _.useCallback( (e, s) => {
        const t = Date.now();
        return f.current = t,
        g.current = {
            at: t,
            eventType: "COPY_SIGNAL",
            metadata: {
                ...s,
                copyScope: e
            }
        },
        j.current = [...j.current.filter(e => t - e.at <= st), {
            scope: e,
            at: t,
            metadata: s
        }],
        j.current
    }
    , [])
      , A = _.useCallback(t => {
        if (!e)
            return;
        const r = Date.now()
          , n = j.current.filter(e => r - e.at <= st)
          , a = new Set(n.map(e => e.scope))
          , i = at(t)
          , o = a.has("reading_passage")
          , l = a.has("reading_question_group");
        "READING" === s && o && l && i.totalAnswers > 0 && i.answerFillRate <= tt && S("SCRAPING_SEQUENCE_THREAT", {
            ...i,
            threshold: tt,
            copiedScopes: Array.from(a),
            copySignalCount: n.length,
            firstCopyMillisecondsAgo: r - Math.min(...n.map(e => e.at)),
            latestCopyMillisecondsAgo: r - Math.max(...n.map(e => e.at))
        });
        const c = g.current
          , d = c ? r - c.at : Number.POSITIVE_INFINITY
          , m = c && d <= 6e5
          , u = t.totalDurationSeconds ?? 0
          , x = u > 0 && "number" == typeof t.timeLeftSeconds ? Math.max(0, u - t.timeLeftSeconds) : void 0
          , h = u > 0 && "number" == typeof x ? x / u : void 0
          , p = "number" == typeof t.score && t.score <= 4
          , b = i.totalAnswers > 0 && i.answerFillRate <= tt
          , f = p && "number" == typeof h && h <= .2;
        m && (p || b || f) && S("LOW_EFFORT_AFTER_SUSPICIOUS_ACTIVITY", {
            ...i,
            score: t.score,
            lowScore: p,
            lowScoreThreshold: 4,
            lowAnswerFill: b,
            lowAnswerFillThreshold: tt,
            fastLowScore: f,
            elapsedSeconds: x,
            totalDurationSeconds: u,
            elapsedDurationRatio: h,
            fastSubmissionDurationRatio: .2,
            latestSuspiciousActivityType: c.eventType,
            latestSuspiciousActivityMetadata: c.metadata,
            millisecondsSinceSuspiciousActivity: d,
            copiedScopes: Array.from(a),
            copySignalCount: n.length
        })
    }
    , [e, S, s]);
    return _.useEffect( () => {
        if (!e)
            return;
        const o = performance.getEntriesByType("navigation")[0]
          , l = "reload" === o?.type
          , f = sessionStorage.getItem(Zs)
          , j = sessionStorage.getItem(Js);
        let k = null
          , A = null;
        if (l && f)
            try {
                const e = JSON.parse(f)
                  , s = "number" == typeof e.lastContextMenuAt ? e.lastContextMenuAt : 0;
                Date.now() - s <= 3e4 && (k = e)
            } catch {}
        if (sessionStorage.removeItem(Zs),
        l && j)
            try {
                const e = JSON.parse(j)
                  , s = "number" == typeof e.lastSuspiciousViewportAt ? e.lastSuspiciousViewportAt : 0;
                Date.now() - s <= Xs && (A = e)
            } catch {}
        if (sessionStorage.removeItem(Js),
        A) {
            const e = "string" == typeof A.trigger ? A.trigger : "browser_refresh_after_viewport_shrink";
            S("DEVTOOLS_SEQUENCE_THREAT", {
                ...A,
                ...k ? {
                    contextMenu: k
                } : {},
                detectedAfterReload: !0,
                trigger: k ? "context_menu_viewport_shrink_refresh" : e
            })
        }
        const I = () => {
            if ("WRITING" === s)
                return;
            const e = window.getSelection()
              , t = (e?.toString() ?? "").trim().length;
            if (!e || t <= 0)
                return;
            const r = u.current;
            if (r && Date.now() - r.at <= 15e3 && (T("select_all", {
                selectedCharacters: t
            }),
            S("SELECT_ALL_COPY_ATTEMPT", {
                shortcut: r.shortcut,
                selectedCharacters: t,
                millisecondsSinceSelectAll: Date.now() - r.at
            })),
            "READING" === s || "LISTENING" === s) {
                let r = !1;
                if ("READING" === s) {
                    const s = it(e, "[data-exam-integrity-reading-passage]");
                    if (s && s.selectedRatio >= .8 && s.selectedCharacters >= 800) {
                        const e = {
                            copyScope: "reading_passage",
                            copyAllowed: !0,
                            selectedCharacters: t,
                            selectedScopeCharacters: s.selectedCharacters,
                            scopeCharacters: s.elementCharacters,
                            selectedRatio: s.selectedRatio,
                            reviewMode: i
                        };
                        T("reading_passage", e);
                        const n = S("WHOLE_PASSAGE_COPY_ATTEMPT", e);
                        C(n),
                        r = !0
                    }
                }
                if ("LISTENING" === s) {
                    const s = it(e, "[data-exam-integrity-listening-transcript]");
                    if (s && s.selectedRatio >= .8 && s.selectedCharacters >= 600) {
                        const e = {
                            copyScope: "listening_transcript",
                            copyAllowed: !0,
                            selectedCharacters: t,
                            selectedScopeCharacters: s.selectedCharacters,
                            scopeCharacters: s.elementCharacters,
                            selectedRatio: s.selectedRatio,
                            reviewMode: i
                        };
                        T("listening_transcript", e);
                        const n = S("WHOLE_TRANSCRIPT_COPY_ATTEMPT", e);
                        C(n),
                        r = !0
                    }
                }
                const n = "READING" === s ? "reading_question_group" : "listening_question_group"
                  , a = it(e, "[data-exam-integrity-question-group]");
                if (a && a.selectedRatio >= .75 && a.selectedCharacters >= 120) {
                    const e = {
                        copyScope: n,
                        copyAllowed: !0,
                        questionType: a.element.dataset.examIntegrityQuestionType,
                        selectedCharacters: t,
                        selectedScopeCharacters: a.selectedCharacters,
                        scopeCharacters: a.elementCharacters,
                        selectedRatio: a.selectedRatio,
                        reviewMode: i
                    };
                    T(n, e);
                    const s = S("WHOLE_QUESTION_GROUP_COPY_ATTEMPT", e);
                    return void C(s)
                }
                if (r)
                    return
            }
            const n = document.body.innerText.length
              , a = n > 0 ? t / n : 0
              , o = {
                copyScope: "large_copy",
                copyAllowed: !0,
                selectedCharacters: t,
                pageCharacters: n,
                selectedRatio: a,
                reviewMode: i
            };
            if ("READING" === s && a >= .8) {
                T("reading_passage", {
                    ...o,
                    copyScope: "reading_passage",
                    fallbackScope: "whole_page"
                });
                const e = S("WHOLE_PASSAGE_COPY_ATTEMPT", o);
                return void C(e)
            }
        }
          , E = e => {
            const s = Date.now();
            d.current = s,
            m.current = [...m.current.filter(e => s - e.at <= 1e4), {
                x: e.clientX,
                y: e.clientY,
                at: s
            }],
            m.current.length > 3 && (m.current = m.current.slice(-3))
        }
          , R = e => {
            const s = e.key.toLowerCase()
              , t = e.ctrlKey || e.metaKey
              , r = function(e) {
                return [e.metaKey ? "Cmd" : null, e.ctrlKey ? "Ctrl" : null, e.altKey ? "Alt" : null, e.shiftKey ? "Shift" : null, 1 === e.key.length ? e.key.toUpperCase() : e.key].filter(Boolean).join("+")
            }(e)
              , n = function(e, s) {
                const t = e.key.toLowerCase()
                  , r = e.code.toLowerCase()
                  , n = rt()
                  , a = /mac|iphone|ipad|ipod/i.test(n)
                  , i = e.metaKey && e.shiftKey && (["3", "4", "5"].includes(t) || ["digit3", "digit4", "digit5"].includes(r));
                return "PrintScreen" === e.key || "PrintScreen" === e.code ? {
                    shortcut: s || "PrintScreen",
                    screenshotMethod: "print_screen_key",
                    platformHint: n
                } : a && i ? {
                    shortcut: s,
                    screenshotMethod: "macos_screenshot_shortcut",
                    platformHint: n
                } : a || !e.metaKey || !e.shiftKey || "s" !== t && "keys" !== r ? null : {
                    shortcut: s,
                    screenshotMethod: "windows_snipping_shortcut",
                    platformHint: n
                }
            }(e, r)
              , a = "F12" === e.key || "F12" === e.code
              , o = t && e.shiftKey && ["i", "j", "c"].includes(s) || e.metaKey && e.altKey && ["i", "j", "c"].includes(s)
              , l = a || o;
            if (!i && n)
                return void ( (e, s) => {
                    const t = Date.now()
                      , r = x.current;
                    if (r && r.shortcut === e.shortcut && r.method === e.screenshotMethod && t - r.at <= 1500)
                        return;
                    x.current = {
                        at: t,
                        shortcut: e.shortcut,
                        method: e.screenshotMethod
                    };
                    const n = [...h.current.filter(e => t - e.at <= et), {
                        at: t,
                        shortcut: e.shortcut,
                        method: e.screenshotMethod,
                        trigger: s
                    }];
                    if (h.current = n,
                    n.length < 2)
                        return;
                    const a = n[n.length - 2];
                    S("SCREENSHOT_ATTEMPT", {
                        ...e,
                        trigger: s,
                        screenshotAttemptCount: n.length,
                        screenshotAttemptWindowMs: et,
                        previousScreenshotShortcut: a?.shortcut,
                        previousScreenshotMethod: a?.method,
                        millisecondsSincePreviousScreenshot: a ? t - a.at : void 0
                    })
                }
                )(n, e.type);
            const d = x.current;
            if (!i && t && "c" === s && d && Date.now() - d.at <= 3e4 && h.current.length >= 2)
                return void S("SCREENSHOT_ATTEMPT", {
                    shortcut: r,
                    screenshotMethod: "screenshot_clipboard_followup",
                    previousScreenshotShortcut: d.shortcut,
                    previousScreenshotMethod: d.method,
                    millisecondsSinceScreenshotShortcut: Date.now() - d.at,
                    platformHint: rt(),
                    trigger: e.type
                });
            if (l) {
                const s = Date.now()
                  , t = a ? "f12" : "devtools_combo";
                return c.current = s,
                p.current = {
                    at: s,
                    shortcut: r || e.key || e.code,
                    shortcutType: t
                },
                void (o && S("DEVTOOLS_SHORTCUT_ATTEMPT", {
                    shortcut: r || e.key || e.code,
                    shortcutType: t,
                    trigger: "devtools_keyboard_shortcut",
                    platformHint: rt()
                }))
            }
            const m = "F5" === e.key || t && "r" === s
              , b = w.current;
            m && (v.current = {
                shortcut: r,
                trigger: "keyboard_refresh_after_viewport_shrink"
            }),
            m && b && Date.now() - b.at <= Xs || (t && "a" === s ? u.current = {
                at: Date.now(),
                shortcut: r
            } : t && "p" === s ? S("PRINT_SHORTCUT_ATTEMPT", {
                shortcut: r
            }) : t && "s" === s && S("SAVE_SHORTCUT_ATTEMPT", {
                shortcut: r
            }))
        }
          , q = () => {
            const e = y.current
              , s = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            y.current = s;
            const t = Math.abs(s.width - e.width)
              , r = Math.abs(s.height - e.height)
              , n = e.width > 0 ? (e.width - s.width) / e.width : 0
              , a = e.height > 0 ? (e.height - s.height) / e.height : 0
              , i = e.width * e.height
              , o = s.width * s.height
              , l = i > 0 ? (i - o) / i : 0
              , m = Date.now() - c.current <= Hs
              , u = Date.now() - d.current <= Hs
              , x = p.current && Date.now() - p.current.at <= Hs
              , h = function(e, s, t) {
                const r = Math.max(e, s, t);
                return r >= Ys ? "severe" : r >= .4 ? "high" : r >= Vs ? "moderate" : "low"
            }(n, a, l)
              , f = n >= Vs || a >= Vs || l >= Vs
              , j = n >= Ys || a >= Ys || l >= Ys
              , N = t >= 160 || r >= 160
              , v = a >= Vs ? "bottom" : n >= Vs ? "side" : "unknown";
            if (f || N && (m || u)) {
                const c = {
                    previous: e,
                    current: s,
                    widthDelta: t,
                    heightDelta: r,
                    widthShrinkRatio: n,
                    heightShrinkRatio: a,
                    areaShrinkRatio: l,
                    previousArea: i,
                    currentArea: o,
                    recentHighRiskSignal: m,
                    recentContextMenuSignal: u,
                    recentPotentialDevtoolsShortcut: Boolean(x),
                    shortcut: x ? p.current?.shortcut : void 0,
                    shortcutType: x ? p.current?.shortcutType : void 0,
                    significantShrink: f,
                    severeShrink: j,
                    shrinkSeverity: h,
                    largeResize: N,
                    likelyDevtoolsDockPosition: v
                };
                w.current = {
                    at: Date.now(),
                    metadata: c
                },
                g.current = {
                    at: Date.now(),
                    eventType: "VIEWPORT_SIGNAL",
                    metadata: c
                },
                (x || u) && Date.now() - b.current > 1e4 && (b.current = Date.now(),
                S(x ? "DEVTOOLS_SEQUENCE_THREAT" : "VIEWPORT_SUSPICIOUS_CHANGE", {
                    ...c,
                    trigger: x ? "shortcut_followed_by_viewport_shrink" : "context_menu_followed_by_viewport_shrink"
                }))
            }
        }
          , _ = () => {
            N.current && window.clearTimeout(N.current),
            N.current = window.setTimeout( () => {
                N.current = null,
                q()
            }
            , 300)
        }
          , P = () => {
            const e = Date.now();
            if (N.current && (window.clearTimeout(N.current),
            N.current = null,
            q()),
            e - d.current <= 3e4) {
                const i = {
                    lastContextMenuAt: d.current,
                    millisecondsSinceContextMenu: e - d.current,
                    contextMenuAttemptCount: m.current.length,
                    recentContextMenuAttempts: m.current,
                    section: s,
                    testId: t,
                    testTitle: r,
                    mockPackId: n,
                    mockPackName: a
                };
                sessionStorage.setItem(Zs, JSON.stringify(i))
            }
            const i = w.current;
            i && e - i.at <= Xs && sessionStorage.setItem(Js, JSON.stringify({
                ...i.metadata,
                ...v.current,
                lastSuspiciousViewportAt: i.at,
                millisecondsSinceSuspiciousViewport: e - i.at,
                section: s,
                testId: t,
                testTitle: r,
                mockPackId: n,
                mockPackName: a
            }))
        }
        ;
        return document.addEventListener("copy", I, !0),
        document.addEventListener("contextmenu", E, !0),
        window.addEventListener("keydown", R, !0),
        window.addEventListener("keyup", R, !0),
        window.addEventListener("resize", _),
        window.addEventListener("beforeunload", P),
        () => {
            document.removeEventListener("copy", I, !0),
            document.removeEventListener("contextmenu", E, !0),
            window.removeEventListener("keydown", R, !0),
            window.removeEventListener("keyup", R, !0),
            window.removeEventListener("resize", _),
            window.removeEventListener("beforeunload", P),
            N.current && (window.clearTimeout(N.current),
            N.current = null)
        }
    }
    , [T, e, n, a, S, C, i, s, t, r]),
    {
        reportSubmissionIntegrity: A
    }
}
const lt = 0
  , ct = 1
  , dt = {
    question: [],
    passage: {
        id: "",
        title: "",
        content: []
    }
}
  , mt = ({examStore: e, examContent: s}) => {
    const {testId: t, testResultId: r} = M()
      , n = $()
      , {toast: a} = f()
      , [i,o] = _.useState(lt)
      , [l,c] = P.useState({
        currentPart: 1,
        timeLeft: 0,
        answers: {}
    })
      , [d,m] = _.useState()
      , {data: u, isLoading: x} = Se(t || "1")
      , {data: h, isLoading: p} = j(r || "")
      , {data: b, isLoading: g} = qe(t || "")
      , {data: N, isLoading: v} = We(t)
      , [w,y] = _.useState({})
      , [I,R] = _.useState(50)
      , [q,L] = _.useState()
      , O = _.useRef(!1);
    ot({
        enabled: i === lt && Boolean(t && h),
        section: k.READING,
        testId: t,
        testTitle: d?.name,
        mockPackId: d?.packId,
        mockPackName: d?.packName,
        reviewMode: !0
    }),
    _.useEffect( () => {
        s ? m(s) : u && m(u)
    }
    , [t, u, s]),
    _.useEffect( () => {
        if (h)
            try {
                h.userAnswers && y(JSON.parse(h.userAnswers));
                const e = JSON.parse(h.userAnswers);
                c(s => ({
                    ...s,
                    answers: e
                }))
            } catch (e) {
                a({
                    title: "Error",
                    description: "Failed to load test results",
                    variant: "destructive"
                })
            }
    }
    , [h, a]);
    const G = () => {
        h ? o(ct) : n(-1)
    }
      , W = e || l
      , F = d
      , [Q,K] = _.useState(1);
    _.useEffect( () => {
        if (F) {
            const e = Ce(F);
            K(e)
        }
    }
    , [F]);
    const z = {
        title: `Reading Passage ${D = Q} Review`,
        instruction: `Review your answers for questions ${1 === D ? "1–13" : 2 === D ? "14–26" : "27–40"}.`
    };
    var D;
    const U = _.useCallback(e => {
        K && K(e)
    }
    , [K])
      , B = _.useCallback(e => {
        if (!O.current)
            return;
        const s = document.getElementById("reading-container");
        if (!s)
            return;
        const t = s.getBoundingClientRect()
          , r = (e.clientX - t.left) / t.width * 100
          , n = Math.min(Math.max(r, 30), 70);
        R(n)
    }
    , [])
      , H = _.useCallback( () => {
        O.current = !1,
        document.removeEventListener("mousemove", B),
        document.removeEventListener("mouseup", H)
    }
    , [B])
      , V = u
      , Y = () => {
        switch (Q) {
        case 1:
            return F?.part1 || dt;
        case 2:
            return F?.part2 || dt;
        case 3:
            return F?.part3 || dt;
        default:
            return dt
        }
    }
      , J = V?.parts || Te
      , X = P.useMemo( () => {
        const e = new Map;
        return N?.solutions?.forEach(s => {
            s.passageId && e.set(s.passageId, s)
        }
        ),
        e
    }
    , [N?.solutions])
      , Z = Y()?.passage
      , ee = Z?.id ? X.get(Z.id) : void 0
      , se = N?.vocabulary;
    return x || g || p || v ? E.jsxs("div", {
        className: "flex h-screen items-center justify-center",
        children: [E.jsx("div", {
            className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        }), E.jsx("span", {
            className: "ml-2",
            children: "Loading test data..."
        })]
    }) : u && b && h ? i === ct ? E.jsx(zs, {
        examStore: W,
        userTestResult: h,
        onReview: () => o(lt)
    }) : E.jsx(Ae, {
        children: E.jsx(as, {
            sectionInstruction: z,
            parts: J,
            currentPart: Q,
            onPartChange: U,
            onSubmitClick: G,
            examStore: W,
            button: E.jsx(xs, {
                onSubmitClick: G,
                isReviewMode: !0
            }),
            children: E.jsxs("div", {
                id: "reading-container",
                className: "flex h-full ative",
                children: [Y().passage.id && E.jsxs(E.Fragment, {
                    children: [E.jsx("div", {
                        className: "overflow-y-auto p-4",
                        style: {
                            width: `${I}%`
                        },
                        "data-exam-integrity-reading-passage": !0,
                        children: E.jsx(Us, {
                            passage: Y().passage,
                            answerLocations: ee?.answerLocations || {},
                            currentQuestionNumber: q
                        })
                    }), E.jsx("div", {
                        className: "w-1 bg-gray-200 cursor-col-resize relative",
                        onMouseDown: () => {
                            O.current = !0,
                            document.addEventListener("mousemove", B),
                            document.addEventListener("mouseup", H)
                        }
                        ,
                        children: E.jsx("div", {
                            className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                            children: E.jsx("button", {
                                className: "w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors",
                                children: "⋮"
                            })
                        })
                    })]
                }), E.jsx("div", {
                    className: "overflow-y-auto p-4",
                    style: {
                        width: Y().passage.id ? 100 - I + "%" : "100%"
                    },
                    children: se && se.items && se.items.length > 0 ? E.jsxs(S, {
                        defaultValue: "questions",
                        className: "w-full",
                        children: [E.jsxs(C, {
                            className: "grid w-full grid-cols-2 mb-4",
                            children: [E.jsx(T, {
                                value: "questions",
                                children: "Questions Review"
                            }), E.jsxs(T, {
                                value: "vocabulary",
                                children: ["Vocabulary (", se.items.length, ")"]
                            })]
                        }), E.jsx(A, {
                            value: "questions",
                            className: "mt-0",
                            children: E.jsx("div", {
                                className: "space-y-20 pb-20",
                                children: Y().question.map( (e, s) => E.jsx("div", {
                                    "data-exam-integrity-question-group": !0,
                                    "data-exam-integrity-question-type": e.type,
                                    children: E.jsx(Es, {
                                        questionGroup: e,
                                        answerKeys: b,
                                        userAnswers: w,
                                        mistakesByQuestionNumber: h.mistakesByQuestionNumber,
                                        answerLocations: ee?.answerLocations,
                                        explanations: ee?.explanations,
                                        onQuestionClick: L
                                    })
                                }, `${e.id}-${s}`))
                            })
                        }), E.jsx(A, {
                            value: "vocabulary",
                            className: "mt-0",
                            children: E.jsx(Bs, {
                                vocabulary: se.items
                            })
                        })]
                    }) : E.jsx("div", {
                        className: "space-y-20 pb-20",
                        children: Y().question.map( (e, s) => E.jsx("div", {
                            "data-exam-integrity-question-group": !0,
                            "data-exam-integrity-question-type": e.type,
                            children: E.jsx(Es, {
                                questionGroup: e,
                                answerKeys: b,
                                userAnswers: w,
                                mistakesByQuestionNumber: h.mistakesByQuestionNumber,
                                answerLocations: ee?.answerLocations,
                                explanations: ee?.explanations,
                                onQuestionClick: L
                            })
                        }, `${e.id}-${s}`))
                    })
                })]
            })
        })
    }) : E.jsxs("div", {
        className: "flex h-screen flex-col items-center justify-center",
        children: [E.jsx("p", {
            className: "text-red-500",
            children: "Error: Test content or results could not be loaded."
        }), E.jsx("button", {
            className: "mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600",
            onClick: () => n(-1),
            children: "Go Back"
        })]
    })
}
  , ut = ({questionData: e, userAnswers: s, taskEvaluation: t}) => {
    if (!e?.content)
        return E.jsx("div", {
            className: "flex h-full items-center justify-center text-red-500",
            children: E.jsx("p", {
                children: "Error: Question content is not available"
            })
        });
    const {question: r="", task: n="", imgUrl: a} = e.content
      , i = ( () => {
        if (e.id && s[e.id])
            return s[e.id];
        const t = "WRITING_TASK1" === e.type ? "1" : "2";
        return s[t] || ""
    }
    )();
    return E.jsxs("div", {
        className: "h-full flex flex-col gap-4 text-sm",
        children: [E.jsxs("div", {
            className: "grid grid-cols-2 gap-4 flex-shrink-0",
            children: [E.jsx("div", {
                className: "overflow-y-auto pr-2",
                children: E.jsxs("div", {
                    className: "space-y-4",
                    children: ["WRITING_TASK2" === e.type && E.jsx("p", {
                        className: "pb-2",
                        children: "Write about the following topic:"
                    }), E.jsx("p", {
                        className: "pb-2 font-semibold",
                        children: r
                    }), E.jsx("p", {
                        className: "pb-2 font-semibold",
                        children: "WRITING_TASK1" === e.type ? "Summarise the information by selecting and reporting the main features, and make comparisons where relevant." : n
                    }), "WRITING_TASK2" === e.type && E.jsx("p", {
                        className: "pb-2",
                        children: "Give reasons for your answer and include any relevant examples from your knowledge or experience."
                    }), a && E.jsx("div", {
                        className: "mt-4",
                        children: E.jsx("img", {
                            src: a,
                            alt: "Task 1 Chart",
                            className: "h-auto max-h-[70vh] max-w-full border border-gray-300"
                        })
                    })]
                })
            }), E.jsxs("div", {
                className: "flex flex-col h-full",
                children: [E.jsx("div", {
                    className: "flex-1 p-4 border border-blue-500 dark:border-gray-700 bg-white dark:bg-primary-foreground whitespace-pre-wrap overflow-y-auto",
                    children: i || "No answer provided"
                }), E.jsxs("div", {
                    className: "mt-2 text-md",
                    children: ["Word count: ", i && Ie(i)]
                })]
            })]
        }), t && E.jsxs("div", {
            className: "space-y-3",
            children: [t.overallFeedback && E.jsxs("div", {
                className: "p-3 border rounded-md bg-muted/30",
                children: [E.jsx("p", {
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1",
                    children: "Overall Feedback"
                }), E.jsx(_e, {
                    content: t.overallFeedback
                })]
            }), t.evaluation && E.jsx("div", {
                className: "grid md:grid-cols-2 gap-3",
                children: Object.entries(t.evaluation).map( ([e,s]) => {
                    const t = Os[e] || Os.default;
                    return E.jsxs("div", {
                        className: "p-3 border rounded-md",
                        children: [E.jsx("p", {
                            className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1",
                            children: t.name
                        }), E.jsx(_e, {
                            content: s.feedback
                        })]
                    }, e)
                }
                )
            }), t.specificProblemsAndImprovements && E.jsxs("div", {
                className: "p-3 border rounded-md",
                children: [E.jsx("p", {
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1",
                    children: "Specific Problems & Improvements"
                }), E.jsx(_e, {
                    content: t.specificProblemsAndImprovements
                })]
            }), t.sampleAnswer && E.jsxs("div", {
                className: "p-3 border rounded-md",
                children: [E.jsx("p", {
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 ",
                    children: "Sample High-Band Answer"
                }), E.jsx(_e, {
                    content: t.sampleAnswer
                })]
            })]
        })]
    })
}
  , xt = 0
  , ht = 1
  , pt = {
    title: "Writing Task 1 Review",
    instruction: "Review your answer for Writing Task 1."
}
  , bt = {
    title: "Writing Task 2 Review",
    instruction: "Review your answer for Writing Task 2."
}
  , ft = ({examStore: e, examContent: s}) => {
    const {testId: t, testResultId: r} = M()
      , n = $()
      , {toast: a} = f()
      , [i,o] = _.useState(xt)
      , [l,c] = P.useState({
        currentPart: 1,
        timeLeft: 0,
        answers: {}
    })
      , [d,m] = _.useState(void 0)
      , [u,x] = _.useState([])
      , [h,p] = _.useState(0)
      , {data: b, isLoading: g} = Ee(t || "1")
      , {data: N, isLoading: v} = j(r || "")
      , [w,y] = _.useState({});
    _.useEffect( () => {
        s ? (m(s),
        x([s])) : b && b.parts && (x(b.parts),
        m(b.parts[0]))
    }
    , [t, b, s]),
    _.useEffect( () => {
        if (N)
            try {
                N.userAnswers && y(JSON.parse(N.userAnswers));
                const e = N.mistakesByQuestionNumber;
                c(s => ({
                    ...s,
                    answers: e
                }))
            } catch (e) {
                a({
                    title: "Error",
                    description: "Failed to load test results",
                    variant: "destructive"
                })
            }
    }
    , [N, a]);
    const k = () => {
        N ? o(ht) : n(-1)
    }
      , S = e || l
      , C = d;
    if (g || v)
        return E.jsxs("div", {
            className: "flex h-screen items-center justify-center",
            children: [E.jsx("div", {
                className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            }), E.jsx("span", {
                className: "ml-2",
                children: "Loading test data..."
            })]
        });
    if (!C)
        return E.jsxs("div", {
            className: "flex h-screen flex-col items-center justify-center",
            children: [E.jsx("p", {
                className: "text-red-500",
                children: "Test not found"
            }), E.jsx("button", {
                className: "mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600",
                onClick: k,
                children: "Go Back"
            })]
        });
    if (i === ht)
        return E.jsx(zs, {
            examStore: S,
            userTestResult: N,
            writingContent: b,
            onReview: () => o(xt)
        });
    const T = u.map( (e, s) => ({
        partNumber: s + 1,
        totalQuestions: 1,
        numbers: [(s + 1).toString()]
    }));
    return E.jsx(as, {
        sectionInstruction: "WRITING_TASK1" === C.type ? pt : bt,
        parts: T,
        currentPart: h + 1,
        onPartChange: e => {
            var s;
            (s = e - 1) >= 0 && s < u.length && (p(s),
            m(u[s]),
            c(e => ({
                ...e,
                currentPart: s + 1
            })))
        }
        ,
        onSubmitClick: k,
        examStore: S,
        button: E.jsx(xs, {
            onSubmitClick: k,
            isReviewMode: !0
        }),
        children: E.jsx("div", {
            className: "space-y-4 pb-20",
            children: E.jsx(ut, {
                questionData: C,
                userAnswers: w,
                taskEvaluation: (e => {
                    if (N?.feedback)
                        try {
                            const s = JSON.parse(N.feedback);
                            return s[e]?.evaluation ? s[e] : void 0
                        } catch {
                            return
                        }
                }
                )(C.type)
            })
        })
    })
}
;
function gt(e) {
    return e && Array.isArray(e) ? e.map( (e, s) => void 0 !== e.questionNumber && e.text ? {
        questionNumber: e.questionNumber,
        text: e.text
    } : e.question ? {
        questionNumber: e.id || s + 1,
        text: e.question
    } : "string" == typeof e ? {
        questionNumber: s + 1,
        text: e
    } : {
        questionNumber: s + 1,
        text: String(e)
    }) : []
}
function jt(e) {
    const s = (Array.isArray(e.part1) ? e.part1 : []).map( (e, s) => ({
        id: `part1-${s}`,
        type: "SPEAKING_PART1",
        partNumber: 1,
        content: {
            topic: String(e.topic || "Introduction"),
            questions: gt(e.questions)
        }
    }))
      , t = e.part2 || {
        topic: "",
        questions: []
    }
      , r = e.part3 || {
        topic: "",
        questions: []
    }
      , n = (Array.isArray(r) ? r : [r]).map( (e, s) => ({
        id: `part3-${s}`,
        type: "SPEAKING_PART3",
        partNumber: 3,
        content: {
            topic: String(e.topic || "Discussion"),
            questions: gt(e.questions)
        }
    }));
    return {
        id: e.id,
        title: e.name,
        source: e.source,
        packName: e.packName,
        packId: e.packId,
        description: e.description,
        testOrder: 15,
        instructions: {
            title: "Speaking Test",
            instruction: "Answer the questions in each part."
        },
        part1: s,
        part2: {
            id: "part2",
            type: "SPEAKING_PART2",
            partNumber: 2,
            content: {
                topic: String(t.topic || ""),
                questions: (a = t.questions,
                a && Array.isArray(a) ? a.map(e => "string" == typeof e ? e : e.text || e.question || String(e)) : [])
            }
        },
        part3: n,
        parts: [{
            partNumber: 1,
            totalQuestions: s.length,
            numbers: ["1"]
        }, {
            partNumber: 2,
            totalQuestions: 1,
            numbers: ["Cue Card"]
        }, {
            partNumber: 3,
            totalQuestions: n.length,
            numbers: ["3"]
        }]
    };
    var a
}
const Nt = 30
  , vt = 120
  , wt = 45
  , yt = e => {
    const s = [];
    let t = 1;
    e.part1?.forEach(e => {
        const r = e.content;
        r.questions?.forEach(e => {
            s.push({
                questionKey: String(t),
                partNumber: 1,
                questionText: e.text,
                durationCapSec: Nt
            }),
            t += 1
        }
        )
    }
    );
    const r = e.part2?.content
      , n = Boolean(r?.topic?.trim() || r?.questions?.length)
      , a = [r?.topic?.trim() || "Cue Card", ...r?.questions || []].filter(Boolean).join("\n");
    return n && s.push({
        questionKey: "Cue Card",
        partNumber: 2,
        questionText: a || "Cue Card",
        durationCapSec: vt
    }),
    e.part3?.forEach(e => {
        const r = e.content;
        r.questions?.forEach(e => {
            s.push({
                questionKey: String(t),
                partNumber: 3,
                questionText: e.text,
                durationCapSec: wt
            }),
            t += 1
        }
        )
    }
    ),
    s
}
  , kt = (e, s) => e.filter(e => e.partNumber === s)
  , St = (e, s) => {
    const t = e.filter(e => s[e.questionKey]);
    return {
        recordingMeta: t.map(e => {
            const t = s[e.questionKey];
            return {
                questionKey: t.questionKey,
                partNumber: t.partNumber,
                questionText: t.questionText,
                durationSec: t.durationSec,
                mimeType: t.mimeType
            }
        }
        ),
        audioFiles: t.map(e => s[e.questionKey].blob)
    }
}
  , Ct = {
    title: "Speaking Part 1 Review",
    instruction: "Review your transcripts for Speaking Part 1 - Introduction and Interview."
}
  , Tt = {
    title: "Speaking Part 2 Review",
    instruction: "Review your transcript for Speaking Part 2 - Individual Long Turn."
}
  , At = {
    title: "Speaking Part 3 Review",
    instruction: "Review your transcripts for Speaking Part 3 - Two-way Discussion."
}
  , It = [{
    key: "fluencyCoherence",
    label: "Fluency & Coherence",
    shortLabel: "FC"
}, {
    key: "lexicalResource",
    label: "Lexical Resource",
    shortLabel: "LR"
}, {
    key: "grammaticalAccuracy",
    label: "Grammatical Range & Accuracy",
    shortLabel: "GRA"
}]
  , Et = ({transcript: e, answerFeedbackItem: s}) => {
    const t = Le(s?.feedback)
      , r = Le(s?.improvedAnswer);
    return E.jsxs("div", {
        className: "mt-3 space-y-3",
        children: [E.jsxs("div", {
            className: "rounded-lg border border-border bg-muted/50 dark:bg-muted/20 p-3.5 text-sm",
            children: [E.jsx("p", {
                className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5",
                children: "Your Response"
            }), E.jsx("p", {
                className: "text-foreground/80 whitespace-pre-wrap leading-relaxed",
                children: e?.trim() || E.jsx("span", {
                    className: "italic text-muted-foreground",
                    children: "No transcript available for this question."
                })
            })]
        }), t && E.jsxs("div", {
            className: "rounded-lg border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 text-sm",
            children: [E.jsx("p", {
                className: "text-[11px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-1.5",
                children: "Feedback"
            }), E.jsx("p", {
                className: "text-foreground/80 leading-relaxed",
                children: t
            })]
        }), r && E.jsxs("div", {
            className: "rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 text-sm",
            children: [E.jsxs("p", {
                className: "text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5",
                children: [E.jsx(ve, {
                    className: "w-3.5 h-3.5"
                }), "Improved Version"]
            }), E.jsx("p", {
                className: "text-foreground/80 whitespace-pre-wrap leading-relaxed italic",
                children: r
            })]
        })]
    })
}
  , Rt = ({partLabel: e, partEvaluation: s}) => s ? E.jsxs("div", {
    className: "mb-5 rounded-xl border border-red-200/60 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-4",
    children: [E.jsxs("p", {
        className: "text-sm font-semibold text-red-700 dark:text-red-300 mb-3",
        children: [e, " Evaluation"]
    }), E.jsx("div", {
        className: "grid grid-cols-3 gap-3",
        children: It.map(t => {
            const r = s?.[t.key]?.score;
            return E.jsxs("div", {
                className: "flex flex-col items-center rounded-lg bg-background/60 dark:bg-background/30 p-2.5 border border-border/50",
                children: [E.jsx("span", {
                    className: "text-[11px] text-muted-foreground font-medium mb-1",
                    children: t.shortLabel
                }), E.jsx("span", {
                    className: `text-lg font-bold ${null != r ? $e(r) : "text-muted-foreground"}`,
                    children: null != r ? r.toFixed(1) : "-"
                })]
            }, `${e}-${t.key}`)
        }
        )
    })]
}) : null
  , qt = ({examStore: e}) => {
    const {testId: s, testResultId: t} = M();
    $();
    const [r,n] = _.useState(0)
      , [a,i] = P.useState({
        currentPart: 1,
        timeLeft: 0,
        answers: {}
    })
      , [o,l] = _.useState(void 0)
      , {data: c, isLoading: d} = Re(s || "1")
      , {data: m, isLoading: u} = j(t || "")
      , x = _.useMemo( () => m?.userAnswers ? Fs(m.userAnswers) : {}, [m?.userAnswers])
      , h = _.useMemo( () => {
        if (!m?.feedback)
            return {};
        const e = Fs(m.feedback);
        return e?.SPEAKING || {}
    }
    , [m?.feedback])
      , p = _.useMemo( () => o ? yt(o) : [], [o]);
    _.useEffect( () => {
        c && l(jt(c))
    }
    , [c]),
    _.useEffect( () => {
        m && i(e => ({
            ...e,
            answers: x
        }))
    }
    , [m, x]);
    const b = () => {
        n(1)
    }
      , f = e || a
      , g = _.useMemo( () => {
        const e = p.filter(e => 1 === e.partNumber)
          , s = p.filter(e => 2 === e.partNumber)
          , t = p.filter(e => 3 === e.partNumber)
          , r = [];
        return e.length > 0 && r.push({
            partNumber: 1,
            totalQuestions: e.length,
            numbers: e.map(e => e.questionKey)
        }),
        s.length > 0 && r.push({
            partNumber: 2,
            totalQuestions: s.length,
            numbers: s.map(e => e.questionKey)
        }),
        t.length > 0 && r.push({
            partNumber: 3,
            totalQuestions: t.length,
            numbers: t.map(e => e.questionKey)
        }),
        r
    }
    , [p]);
    if (_.useEffect( () => {
        g.length > 0 && i(e => ({
            ...e,
            currentPart: g[0].partNumber
        }))
    }
    , [g]),
    d || u)
        return E.jsxs("div", {
            className: "flex h-screen items-center justify-center bg-background",
            children: [E.jsx("div", {
                className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"
            }), E.jsx("span", {
                className: "ml-2 text-muted-foreground",
                children: "Loading test data..."
            })]
        });
    if (!o)
        return E.jsxs("div", {
            className: "flex h-screen flex-col items-center justify-center bg-background",
            children: [E.jsx("p", {
                className: "text-red-600 dark:text-red-400 font-medium",
                children: "Test not found"
            }), E.jsx("button", {
                className: "mt-4 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 px-5 py-2 text-white font-medium transition-colors",
                onClick: b,
                children: "Go Back"
            })]
        });
    if (1 === r)
        return E.jsx(zs, {
            examStore: f,
            userTestResult: m,
            onReview: () => n(0)
        });
    const N = h?.parts || {}
      , v = h?.answerFeedback || {}
      , w = f.currentPart || 1;
    return E.jsx(as, {
        sectionInstruction: 1 === w ? Ct : 2 === w ? Tt : At,
        parts: g,
        currentPart: w,
        onPartChange: e => {
            e >= 1 && e <= 3 && i(s => ({
                ...s,
                currentPart: e
            }))
        }
        ,
        onSubmitClick: b,
        examStore: f,
        button: E.jsx(xs, {
            onSubmitClick: b,
            isReviewMode: !0
        }),
        children: E.jsxs("div", {
            className: "space-y-6 pb-20",
            children: [E.jsxs("div", {
                className: "rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 flex items-center gap-2",
                children: [E.jsx(re, {
                    className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"
                }), E.jsx("p", {
                    className: "text-sm text-amber-800 dark:text-amber-200",
                    children: "AI speaking evaluation is not always accurate. Use it as guidance, and do not feel demotivated if the score is lower than expected."
                })]
            }), 1 === w ? ( () => {
                let e = 1;
                return E.jsxs("div", {
                    className: "space-y-6",
                    children: [E.jsx(Rt, {
                        partLabel: "Part 1",
                        partEvaluation: N?.PART_1
                    }), o.part1?.map( (s, t) => {
                        const r = s.content
                          , n = e;
                        return e += r.questions.length,
                        E.jsxs("div", {
                            className: "rounded-lg border border-border bg-card p-4",
                            children: [E.jsx("h4", {
                                className: "font-bold mb-3 text-lg text-foreground",
                                children: r.topic
                            }), E.jsx("ul", {
                                className: "space-y-4",
                                children: r.questions.map( (e, s) => {
                                    const t = String(n + s)
                                      , r = x?.[t];
                                    return E.jsxs("li", {
                                        children: [E.jsxs("div", {
                                            className: "font-medium text-foreground",
                                            children: [n + s, ". ", e.text]
                                        }), E.jsx(Et, {
                                            transcript: r,
                                            answerFeedbackItem: v[t]
                                        })]
                                    }, e.questionNumber)
                                }
                                )
                            })]
                        }, t)
                    }
                    )]
                })
            }
            )() : 2 === w ? ( () => {
                const e = o.part2.content
                  , s = x?.["Cue Card"];
                return E.jsxs("div", {
                    className: "space-y-4",
                    children: [E.jsx(Rt, {
                        partLabel: "Part 2",
                        partEvaluation: N?.PART_2
                    }), E.jsxs("div", {
                        className: "rounded-lg border border-border bg-card p-4",
                        children: [E.jsx("h4", {
                            className: "font-bold mb-3 text-lg text-foreground",
                            children: e.topic
                        }), E.jsx("p", {
                            className: "mb-2 font-medium text-muted-foreground",
                            children: "You should say:"
                        }), E.jsx("ul", {
                            className: "list-disc pl-5 space-y-2",
                            children: e.questions.map( (e, s) => E.jsx("li", {
                                className: "text-foreground/80",
                                children: e
                            }, s))
                        }), E.jsx(Et, {
                            transcript: s,
                            answerFeedbackItem: v["Cue Card"]
                        })]
                    })]
                })
            }
            )() : ( () => {
                let e = (o.part1?.reduce( (e, s) => e + (s.content.questions?.length || 0), 0) || 0) + 1;
                return E.jsxs("div", {
                    className: "space-y-6",
                    children: [E.jsx(Rt, {
                        partLabel: "Part 3",
                        partEvaluation: N?.PART_3
                    }), o.part3?.map( (s, t) => {
                        const r = s.content
                          , n = e;
                        return e += r.questions.length,
                        E.jsxs("div", {
                            className: "rounded-lg border border-border bg-card p-4",
                            children: [E.jsx("h4", {
                                className: "font-bold mb-3 text-lg text-foreground",
                                children: r.topic
                            }), E.jsx("ul", {
                                className: "space-y-4",
                                children: r.questions.map( (e, s) => {
                                    const t = String(n + s)
                                      , r = x?.[t];
                                    return E.jsxs("li", {
                                        children: [E.jsxs("div", {
                                            className: "font-medium text-foreground",
                                            children: [n + s, ". ", e.text]
                                        }), E.jsx(Et, {
                                            transcript: r,
                                            answerFeedbackItem: v[t]
                                        })]
                                    }, e.questionNumber)
                                }
                                )
                            })]
                        }, t)
                    }
                    )]
                })
            }
            )(), Le(h?.overallFeedback) && E.jsxs("div", {
                className: "rounded-lg border border-red-200/60 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-4",
                children: [E.jsx("h4", {
                    className: "font-semibold mb-2 text-red-700 dark:text-red-300",
                    children: "Overall Speaking Feedback"
                }), E.jsx("div", {
                    className: "text-sm text-foreground/80",
                    children: E.jsx(_e, {
                        content: Le(h.overallFeedback)
                    })
                })]
            }), Le(h?.specificProblemsAndImprovements) && E.jsxs("div", {
                className: "rounded-lg border border-border bg-card p-4",
                children: [E.jsx("h4", {
                    className: "font-semibold mb-2 text-foreground",
                    children: "Specific Problems & Improvements"
                }), E.jsx("div", {
                    className: "text-sm text-foreground/80",
                    children: E.jsx(_e, {
                        content: Le(h.specificProblemsAndImprovements)
                    })
                })]
            }), Le(h?.improvementPlan) && E.jsxs("div", {
                className: "rounded-lg border border-border bg-card p-4",
                children: [E.jsx("h4", {
                    className: "font-semibold mb-2 text-foreground",
                    children: "Personalized Improvement Plan"
                }), E.jsx("div", {
                    className: "text-sm text-foreground/80",
                    children: E.jsx(_e, {
                        content: Le(h.improvementPlan)
                    })
                })]
            })]
        })
    })
}
  , _t = _.lazy( () => I( () => import("./ListeningTestMain-BsjmEFSg.js").then(e => e.a), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])))
  , Pt = _.lazy( () => I( () => import("./ReadingTestMain-Z4Sw89Ex.js").then(e => e.b), __vite__mapDeps([16, 1, 2, 4, 5, 6, 7, 17, 12, 8, 9, 13, 18, 3, 10, 15])))
  , Lt = _.lazy( () => I( () => import("./WritingTestMain-Nm2IgS3B.js").then(e => e.b), __vite__mapDeps([19, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 18, 13])))
  , $t = _.lazy( () => I( () => import("./SpeakingTestMain-D9msO2lt.js"), __vite__mapDeps([20, 1, 2, 4, 5, 6, 7, 3, 8, 9, 10, 21, 22, 23, 24, 25, 26])))
  , Ot = _.lazy( () => I( () => import("./ListeningTestReview-BH-1P5tW.js"), __vite__mapDeps([27, 1, 2, 4, 5, 6, 7, 8, 9, 14, 24, 25, 21, 10, 22, 23, 26])))
  , Mt = _.lazy( () => I( () => import("./MockTestExecution-Bh_HzHMN.js"), __vite__mapDeps([28, 1, 2, 4, 5, 6, 7, 29, 3, 8, 9, 10, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26])))
  , Gt = _.lazy( () => I( () => import("./MockTestReview-ChckWAc3.js"), __vite__mapDeps([30, 1, 2, 29, 4, 5, 6, 7, 8, 9, 21, 10, 22, 23, 24, 25, 26])));
const Wt = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: function() {
        return E.jsxs(G, {
            children: [E.jsx(W, {
                path: "mock/:mockSetId",
                element: E.jsx(Mt, {})
            }), E.jsx(W, {
                path: "mock/:mockSetId/review",
                element: E.jsx(Gt, {})
            }), E.jsx(W, {
                path: "listening/:testId",
                element: E.jsx(_t, {})
            }), E.jsx(W, {
                path: "reading/:testId",
                element: E.jsx(Pt, {})
            }), E.jsx(W, {
                path: "writing/:testId",
                element: E.jsx(Lt, {})
            }), E.jsx(W, {
                path: "speaking/:testId",
                element: E.jsx($t, {})
            }), E.jsx(W, {
                path: "listening/:testId/review/:testResultId",
                element: E.jsx(Ot, {})
            }), E.jsx(W, {
                path: "reading/:testId/review/:testResultId",
                element: E.jsx(mt, {})
            }), E.jsx(W, {
                path: "writing_task1/:testId/review/:testResultId",
                element: E.jsx(ft, {})
            }), E.jsx(W, {
                path: "writing_task2/:testId/review/:testResultId",
                element: E.jsx(ft, {})
            }), E.jsx(W, {
                path: "writing/:testId/review/:testResultId",
                element: E.jsx(ft, {})
            }), E.jsx(W, {
                path: "speaking/:testId/review/:testResultId",
                element: E.jsx(qt, {})
            }), E.jsx(W, {
                path: "writing_task1/:testId",
                element: E.jsx(Lt, {})
            }), E.jsx(W, {
                path: "writing_task2/:testId",
                element: E.jsx(Lt, {})
            })]
        })
    }
}, Symbol.toStringTag, {
    value: "Module"
}));
export {is as C, ks as D, as as E, Ns as F, ys as G, ws as M, Ss as S, ps as T, Bs as V, xs as a, zs as b, Ue as c, rs as d, Xe as e, ts as f, Je as g, Rs as h, kt as i, _s as j, yt as k, St as l, hs as m, vs as n, js as o, gs as p, fs as q, Ds as r, qs as s, jt as t, ot as u, Wt as v};
