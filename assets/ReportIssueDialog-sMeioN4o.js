import {j as e} from "./query-DsA5-mxg.js";
import {y as s, B as r, u as t, b as a, Y as i, Z as n, _ as l, $ as d, a1 as o, a2 as c, a3 as m} from "./index-HS6_bSfL.js";
import {c as x} from "./useSpeakingTests-CMINX9XJ.js";
import {e as h, a as u} from "./router-gAN6ztYq.js";
import {i as f, A as j, z as p, ae as b, U as g, a5 as N} from "./icons-IGaB-7H7.js";
import {c as v, d as w, e as y, f as k, g as I} from "./ExamRoutes-CxPlFRVv.js";
import {b as C} from "./useIssueReports-DGrG-FEN.js";
const T = ({title: t, time: a, instructions: i, information: n, alertMessage: l, onStartTest: d, startButtonText: o="Start Test", startButtonDisabled: c=!1, footer: m}) => {
    const u = h()
      , {examLayout: g, setExamLayout: N} = s()
      , {canChangeStyle: v, layout: w} = x()
      , y = e => {
        v ? N(e) : "inspera" === e && u("/pricing")
    }
    ;
    return e.jsx("div", {
        className: "flex items-baseline justify-center flex-grow mt-4",
        children: e.jsx("div", {
            className: "w-3/5 flex flex-col rounded-md shadow-md shadow-gray-400 mx-4",
            children: e.jsxs("div", {
                className: "px-3 py-4 bg-card",
                children: [e.jsx("div", {
                    className: "mb-4",
                    children: e.jsx("p", {
                        className: "font-bold",
                        children: t
                    })
                }), a && e.jsx("div", {
                    className: "mb-4",
                    children: e.jsxs("p", {
                        className: "",
                        children: ["Time: ", a]
                    })
                }), i && e.jsxs("div", {
                    className: "mb-6",
                    children: [e.jsx("h3", {
                        className: "font-bold mb-2",
                        children: "Instruction"
                    }), i]
                }), n && e.jsxs("div", {
                    className: "mb-6",
                    children: [e.jsx("h3", {
                        className: "font-bold mb-2",
                        children: "Note"
                    }), n]
                }), e.jsxs("div", {
                    className: "mb-6 border-t pt-6",
                    children: [e.jsx("h3", {
                        className: "font-bold mb-4 text-foreground",
                        children: "Choose Exam Interface Style"
                    }), e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                        children: [e.jsxs("div", {
                            onClick: () => y("inspera"),
                            className: `relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${"inspera" === w ? "border-red-600 bg-red-50/10 dark:bg-red-950/5 shadow-md shadow-red-500/10" : "border-border bg-card hover:border-gray-400 dark:hover:border-gray-700"} ${v ? "" : "hover:border-rose-300"}`,
                            children: [e.jsx("div", {
                                className: "absolute -top-3 right-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow-sm tracking-wider uppercase",
                                children: "100% Simulation"
                            }), e.jsxs("div", {
                                className: "flex items-start space-x-3 mt-1",
                                children: [e.jsx("div", {
                                    className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors " + ("inspera" === w ? "border-red-600 bg-red-600 text-white" : "border-muted-foreground"),
                                    children: "inspera" === w ? e.jsx(f, {
                                        className: "h-3 w-3"
                                    }) : v ? null : e.jsx(j, {
                                        className: "h-2.5 w-2.5 text-muted-foreground"
                                    })
                                }), e.jsxs("div", {
                                    children: [e.jsxs("h4", {
                                        className: "font-bold text-sm text-foreground flex items-center gap-1.5",
                                        children: ["Real Exam Interface", !v && e.jsx(j, {
                                            className: "h-3.5 w-3.5 text-rose-500"
                                        })]
                                    }), e.jsx("p", {
                                        className: "text-xs text-muted-foreground mt-1 leading-relaxed",
                                        children: "100% simulation of the computer-based exam, helping you get familiar with real exam features."
                                    })]
                                })]
                            })]
                        }), e.jsx("div", {
                            onClick: () => y("ieltsx"),
                            className: "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 " + ("ieltsx" === w ? "border-red-600 bg-red-50/10 dark:bg-red-950/5 shadow-md shadow-red-500/10" : "border-border bg-card hover:border-gray-400 dark:hover:border-gray-700"),
                            children: e.jsxs("div", {
                                className: "flex items-start space-x-3 mt-1",
                                children: [e.jsx("div", {
                                    className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors " + ("ieltsx" === w ? "border-red-600 bg-red-600 text-white" : "border-muted-foreground"),
                                    children: "ieltsx" === w && e.jsx(f, {
                                        className: "h-3 w-3"
                                    })
                                }), e.jsxs("div", {
                                    children: [e.jsx("h4", {
                                        className: "font-bold text-sm text-foreground",
                                        children: "Practice Interface"
                                    }), e.jsx("p", {
                                        className: "text-xs text-muted-foreground mt-1 leading-relaxed",
                                        children: "It is easier to navigate and complete tests, Perfect for daily practice."
                                    })]
                                })]
                            })
                        })]
                    }), !v && e.jsxs("div", {
                        className: "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/10 dark:to-rose-950/5 border border-red-200 dark:border-red-900/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "bg-red-100 dark:bg-red-950/30 p-2 rounded-lg text-red-600 dark:text-red-400 shrink-0",
                                children: e.jsx(j, {
                                    className: "h-5 w-5 animate-pulse"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("p", {
                                    className: "text-sm font-semibold text-red-950 dark:text-red-100",
                                    children: "Unlock Real Exam Interface"
                                }), e.jsx("p", {
                                    className: "text-xs text-red-700 dark:text-red-300",
                                    children: "The simulated exam interface is only available to Premium users. Please upgrade to unlock."
                                })]
                            })]
                        }), e.jsxs(r, {
                            onClick: () => {
                                u("/pricing")
                            }
                            ,
                            className: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0",
                            children: [e.jsx(p, {
                                className: "mr-1.5 h-3.5 w-3.5"
                            }), "Get Access"]
                        })]
                    })]
                }), l && e.jsxs("div", {
                    className: "flex justify-center items-center mb-4",
                    children: [e.jsx(b, {
                        className: "size-5 mr-2"
                    }), e.jsx("p", {
                        children: l
                    })]
                }), e.jsx("div", {
                    className: "flex items-center justify-center",
                    children: e.jsx(r, {
                        onClick: d,
                        disabled: c,
                        children: o
                    })
                }), m && e.jsx("div", {
                    className: "mt-3 flex items-center justify-center",
                    children: m
                })]
            })
        })
    })
}
;
function S({userInfoContent: s, button: r, children: t}) {
    return e.jsxs("div", {
        className: "flex flex-col h-screen bg-blue-50",
        children: [e.jsx(v, {
            userInfoContent: s,
            button: r
        }), t]
    })
}
const E = ({candidateInfo: s}) => {
    const {user: r} = t()
      , a = Boolean(s?.candidateId) && !s?.email && !s?.phone && !s?.name
      , i = a ? s?.candidateId : s?.email || s?.phone || r?.email
      , n = a ? null : s?.name || (r ? `${r.firstName} ${r.lastName}` : null);
    return a ? e.jsx("div", {
        className: "flex text-lime-100 items-center px-2 py-1 min-w-0",
        children: i && e.jsx("span", {
            className: "text-sm font-bold truncate",
            children: i
        })
    }) : e.jsxs("div", {
        className: "flex text-lime-100 items-center gap-1 px-2 py-1 min-w-0",
        children: [e.jsx(g, {
            size: 14,
            className: "shrink-0"
        }), (i || n) && e.jsxs(e.Fragment, {
            children: [i && e.jsx("span", {
                className: "text-sm font-bold truncate",
                children: i
            }), n && e.jsxs("span", {
                className: "text-sm font-light truncate",
                children: ["- ", n]
            })]
        })]
    })
}
;
function R({instruction: s, audioPlayer: r}) {
    return e.jsx("div", {
        className: "p-3",
        children: e.jsx("div", {
            className: "p-4 bg-white shadow-sm shadow-gray-400",
            children: e.jsxs("div", {
                className: "flex justify-between items-start gap-4",
                children: [e.jsxs("div", {
                    className: "min-w-0 flex-[0.8]",
                    children: [e.jsx("p", {
                        className: "font-bold",
                        children: s.title
                    }), e.jsx("p", {
                        className: "",
                        children: s.instruction
                    })]
                }), r && e.jsx("div", {
                    className: "w-full max-w-5xl flex-[2]",
                    children: r
                })]
            })
        })
    })
}
const $ = () => {
    const {useIELTSXLayout: e, useInsperaLayout: s} = x();
    return {
        ExamHeader: v,
        ExamUserInfo: s ? k : e ? I : E,
        ExamQuestionPageTitle: s ? w : e ? y : R
    }
}
  , P = ({title: s, description: r}) => e.jsx("div", {
    className: "border border-border fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm",
    children: e.jsx("div", {
        className: "rounded-lg bg-popover p-8 shadow-lg max-w-md w-full",
        children: e.jsxs("div", {
            className: "flex flex-col items-center justify-center",
            children: [e.jsx(N, {
                className: "h-8 w-8 animate-spin text-primary mb-4"
            }), e.jsx("h2", {
                className: "text-xl font-semibold text-center",
                children: s
            }), e.jsx("p", {
                className: "mt-4 text-center text-muted-foreground",
                children: r
            })]
        })
    })
})
  , L = /\s*[-–—:()]?\s*passage\s*\d+\s*[)]?/gi
  , z = e => e.replace(/\s+/g, " ").trim()
  , B = (e, s) => {
    const r = z(e || "")
      , t = (e => {
        if (!e)
            return "";
        const s = e.replace(L, " ").replace(/\s*[-–—:]\s*$/g, " ").trim();
        return z(s)
    }
    )(s);
    return r && t ? `[${r}] ${t}` : t || (r ? `[${r}]` : "")
}
;
function O({open: s, onOpenChange: t, testId: x, userTestResultId: h}) {
    const [f,j] = u.useState("")
      , [p,b] = u.useState(!1)
      , {toast: g} = a()
      , {submitReport: N, pending: v} = C();
    return e.jsxs(e.Fragment, {
        children: [e.jsx(i, {
            open: s,
            onOpenChange: t,
            children: e.jsxs(n, {
                children: [e.jsxs(l, {
                    children: [e.jsx(d, {
                        children: "Report Issue"
                    }), e.jsx(o, {
                        children: "Tell us if something is missing, broken, or incorrect. This will not submit or finish your exam."
                    })]
                }), e.jsx("div", {
                    className: "py-4",
                    children: e.jsx(c, {
                        placeholder: "Describe the issue",
                        value: f,
                        onChange: e => j(e.target.value),
                        rows: 4,
                        className: "w-full"
                    })
                }), e.jsxs(m, {
                    children: [e.jsx(r, {
                        variant: "outline",
                        onClick: () => t(!1),
                        children: "Cancel"
                    }), e.jsx(r, {
                        onClick: () => {
                            x && N({
                                testId: x,
                                userTestResultId: h,
                                comment: f.trim() || "Issue reported during an unfinished exam."
                            }, {
                                onSuccess: () => {
                                    t(!1),
                                    b(!0),
                                    j("")
                                }
                                ,
                                onError: () => {
                                    g({
                                        title: "Report failed",
                                        description: "Please try again or contact support if the issue continues.",
                                        variant: "destructive"
                                    })
                                }
                            })
                        }
                        ,
                        disabled: v || !x,
                        children: v ? "Submitting..." : "Submit Report"
                    })]
                })]
            })
        }), e.jsx(i, {
            open: p,
            onOpenChange: b,
            children: e.jsxs(n, {
                children: [e.jsxs(l, {
                    children: [e.jsx(d, {
                        children: "Thanks for the report"
                    }), e.jsx(o, {
                        children: "Our team will review it. You can continue the exam or leave from the menu."
                    })]
                }), e.jsx(m, {
                    children: e.jsx(r, {
                        onClick: () => b(!1),
                        children: "Close"
                    })
                })]
            })
        })]
    })
}
export {S as E, P, O as R, T as a, B as b, $ as u};
