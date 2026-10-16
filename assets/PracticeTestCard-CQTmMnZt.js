import {u as e, j as a} from "./query-BoogBOpP.js";
import {e as s, a as t} from "./router-oTa00OWi.js";
import {x as r, bp as l, bt as i, C as o, m as n, o as d, R as c, bu as m, g as x, br as p, B as u, bk as h, bj as N, bl as g} from "./index-CgPgTAA2.js";
import {a0 as b, q as f, Y as v, a1 as j, O as k, s as w, r as I, H as T} from "./icons-Dm46cpbd.js";
const y = {
    LISTENING: "bg-gradient-to-br from-amber-500/80 via-orange-500/70 to-yellow-600/80 dark:from-amber-600/60 dark:via-orange-600/50 dark:to-yellow-700/60",
    READING: "bg-gradient-to-br from-emerald-500/80 via-green-500/70 to-teal-600/80 dark:from-emerald-600/60 dark:via-green-600/50 dark:to-teal-700/60",
    WRITING: "bg-gradient-to-br from-blue-500/80 via-indigo-500/70 to-violet-600/80 dark:from-blue-600/60 dark:via-indigo-600/50 dark:to-violet-700/60",
    WRITING_TASK1: "bg-gradient-to-br from-blue-500/80 via-cyan-500/70 to-sky-600/80 dark:from-blue-600/60 dark:via-cyan-600/50 dark:to-sky-700/60",
    WRITING_TASK2: "bg-gradient-to-br from-indigo-500/80 via-purple-500/70 to-violet-600/80 dark:from-indigo-600/60 dark:via-purple-600/50 dark:to-violet-700/60",
    SPEAKING: "bg-gradient-to-br from-rose-500/80 via-pink-500/70 to-red-600/80 dark:from-rose-600/60 dark:via-pink-600/50 dark:to-red-700/60"
}
  , S = {
    LISTENING: a.jsx(T, {
        className: "w-8 h-8 text-white/90"
    }),
    READING: a.jsx(f, {
        className: "w-8 h-8 text-white/90"
    }),
    WRITING: a.jsx(I, {
        className: "w-8 h-8 text-white/90"
    }),
    WRITING_TASK1: a.jsx(I, {
        className: "w-8 h-8 text-white/90"
    }),
    WRITING_TASK2: a.jsx(I, {
        className: "w-8 h-8 text-white/90"
    }),
    SPEAKING: a.jsx(w, {
        className: "w-8 h-8 text-white/90"
    })
}
  , A = e => e.replace(/_/g, " ").replace(/\b\w/g, e => e.toUpperCase())
  , R = ({test: w, index: I, packCoverImage: T, simplifyTitle: R=!1}) => {
    const P = s()
      , _ = e()
      , {userPlan: G} = r()
      , [C,E] = t.useState(!1)
      , K = l(G, w.planType)
      , q = w.coverImageUrl || T
      , W = !!q
      , D = (L = w.partLabel) ? {
        PART_1: "Part 1",
        PART_2: "Part 2",
        PART_3: "Part 3",
        PART_4: "Part 4",
        PASSAGE_1: "Passage 1",
        PASSAGE_2: "Passage 2",
        PASSAGE_3: "Passage 3",
        TASK_1: "Task 1",
        TASK_2: "Task 2",
        SECTION_1: "Section 1",
        SECTION_2: "Section 2",
        SECTION_3: "Section 3",
        SECTION_4: "Section 4"
    }[L] || L : "";
    var L;
    const $ = (w.categoryNames || []).filter(e => {
        const a = e.toLowerCase();
        return !a.includes("passage_") && !a.includes("part_") && !a.includes("task_")
    }
    )
      , z = w.section?.toUpperCase() || "READING"
      , Q = y[z] || y.READING
      , O = S[z] || S.READING
      , U = e => e.toLowerCase().replace(/-/g, "_")
      , F = R ? (e => {
        const a = e.match(/^(?:\[?(?:Volume|Vol\.?)\s+\d+\]?\s*)?(?:Test\s+\d+\s+)?-\s*(?:P\d+|Part\s+\d+|Passage\s+\d+|Section\s+\d+):\s*(.+)$/i);
        return a && a[1] ? a[1].trim() : e
    }
    )(w.title) : w.title
      , V = R && w.packName ? w.packName : w.source || "Practice";
    return a.jsx(i.div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: .3,
            delay: .05 * I
        },
        className: "h-full",
        children: a.jsxs(o, {
            className: "group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border h-full flex flex-col",
            children: [a.jsxs("div", {
                className: "relative w-full aspect-[4/3] overflow-hidden bg-muted",
                children: [W ? a.jsxs(a.Fragment, {
                    children: [a.jsx("img", {
                        src: q,
                        alt: w.title,
                        className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    }), a.jsx("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    })]
                }) : a.jsxs("div", {
                    className: n("absolute inset-0 w-full h-full flex flex-col items-center justify-center", Q),
                    children: [O, w.packName && a.jsx("span", {
                        className: "mt-2 text-white/90 font-medium text-sm text-center px-4 line-clamp-2",
                        children: w.packName
                    })]
                }), a.jsx("div", {
                    className: "absolute top-3 left-3 z-10",
                    children: w.isCompleted ? a.jsxs(d, {
                        className: "bg-emerald-500/90 text-white border-0 text-xs font-medium shadow-md hover:bg-emerald-600 transition-colors",
                        children: [a.jsx(b, {
                            className: "w-3 h-3 mr-1"
                        }), "Done"]
                    }) : "MAX" === w.planType || "ULTRA" === w.planType ? a.jsx(c, {
                        plan: w.planType,
                        size: "md"
                    }) : a.jsx(m, {
                        size: "md"
                    })
                }), D && a.jsx("div", {
                    className: "absolute top-3 right-3 z-10",
                    children: a.jsx(d, {
                        className: "bg-black/60 dark:bg-black/80 backdrop-blur-sm text-white border-white/20 dark:border-white/30 text-xs font-medium shadow-md hover:bg-black/70 dark:hover:bg-black/90 transition-colors",
                        children: D
                    })
                })]
            }), a.jsxs(x, {
                className: "p-4 flex flex-col flex-1 gap-3",
                children: [a.jsxs("div", {
                    className: "flex flex-col gap-3 flex-1",
                    children: [a.jsx("h3", {
                        className: "font-semibold text-base leading-6 break-words text-foreground group-hover:text-primary transition-colors",
                        title: F,
                        children: F
                    }), a.jsx("div", {
                        className: "text-xs text-muted-foreground",
                        children: a.jsxs("span", {
                            className: "flex items-center gap-1",
                            title: V,
                            children: [a.jsx(f, {
                                className: "w-3.5 h-3.5 flex-shrink-0"
                            }), a.jsx("span", {
                                className: "truncate",
                                children: V
                            })]
                        })
                    }), $.length > 0 && a.jsxs("div", {
                        className: "flex flex-wrap gap-1",
                        children: [(C ? $ : $.slice(0, 2)).map( (e, s) => a.jsx(d, {
                            variant: "secondary",
                            className: "text-xs",
                            children: A(e)
                        }, s)), $.length > 2 && a.jsx(d, {
                            variant: "secondary",
                            className: "text-xs text-muted-foreground hover:bg-muted cursor-pointer transition-colors",
                            onClick: () => E(!C),
                            children: C ? "Show less" : `+${$.length - 2} more`
                        })]
                    }), w.attempt > 0 && a.jsx("div", {
                        className: "text-xs text-muted-foreground",
                        children: a.jsxs("span", {
                            className: "flex items-center gap-1",
                            children: [a.jsx(v, {
                                className: "w-3.5 h-3.5"
                            }), w.attempt, " ", 1 === w.attempt ? "attempt" : "attempts"]
                        })
                    })]
                }), a.jsx("div", {
                    className: "flex gap-2 pt-1",
                    children: K ? a.jsx(p, {
                        reason: "plan",
                        requiredPlan: w.planType,
                        className: "w-full"
                    }) : a.jsxs(a.Fragment, {
                        children: [w.isCompleted && w.testResultId && a.jsxs(u, {
                            onClick: () => {
                                if (w.testResultId) {
                                    const e = U(w.section);
                                    P(`/exam/${e}/${w.id}/review/${w.testResultId}`)
                                }
                            }
                            ,
                            variant: "outline",
                            size: "sm",
                            className: "flex border-blue-500/50 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400",
                            children: [a.jsx(j, {
                                className: "w-3.5 h-3.5 mr-1.5"
                            }), "Review"]
                        }), (null == w.attempt || w.attempt < 3) && a.jsx(u, {
                            onClick: () => {
                                _.invalidateQueries({
                                    queryKey: ["userTestResults"]
                                }),
                                _.invalidateQueries({
                                    queryKey: ["practice-tests"]
                                }),
                                _.invalidateQueries({
                                    queryKey: ["complete-writing-test"]
                                }),
                                _.invalidateQueries({
                                    queryKey: ["complete-listening-test"]
                                }),
                                _.invalidateQueries({
                                    queryKey: ["complete-reading-test"]
                                }),
                                _.invalidateQueries({
                                    queryKey: ["userTestData"]
                                });
                                const e = w.section?.toUpperCase();
                                "READING" === e ? h(w.id) : "LISTENING" === e ? N(w.id) : "WRITING" !== e && "WRITING_TASK1" !== e && "WRITING_TASK2" !== e || g(w.id);
                                const a = U(w.section);
                                P(`/exam/${a}/${w.id}`, {
                                    state: {
                                        packName: w.packName
                                    }
                                })
                            }
                            ,
                            size: "sm",
                            variant: w.isCompleted ? "outline" : "default",
                            className: n("flex", w.isCompleted && "border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"),
                            children: w.isCompleted ? a.jsxs(a.Fragment, {
                                children: [a.jsx(v, {
                                    className: "w-3.5 h-3.5 mr-1.5"
                                }), "Retake"]
                            }) : a.jsxs(a.Fragment, {
                                children: [a.jsx(k, {
                                    className: "w-3.5 h-3.5 mr-1.5"
                                }), "Start Practice"]
                            })
                        })]
                    })
                })]
            })]
        })
    })
}
;
export {R as P};
