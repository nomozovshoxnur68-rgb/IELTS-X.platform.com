import {j as e} from "./query-BoogBOpP.js";
import {i as a, u as l, a as s} from "./router-oTa00OWi.js";
import {x as i, a5 as t, a7 as r, bs as n, A as o, m as c, I as p, B as u, G as d, H as g, J as m, K as h, M as x, o as v, a9 as b} from "./index-CgPgTAA2.js";
import {C as j} from "./checkbox-D9DMgwRn.js";
import {P as N, a as f, b as y} from "./popover-QRQfhrX8.js";
import {P as T} from "./PracticeTestCard-CQTmMnZt.js";
import {K as _, X as C, F as w, Y as k, c as P, r as S, ap as M, q as A, H as O} from "./icons-Dm46cpbd.js";
import "./ui-DQFvSc6P.js";
const E = {
    listening: {
        title: "Listening Sections",
        description: "Practice individual listening parts to improve your skills",
        icon: e.jsx(O, {
            className: "w-5 h-5"
        }),
        color: "text-amber-500",
        testType: "part",
        apiSection: "listening",
        partOptions: [{
            value: "PART_1",
            label: "Section 1"
        }, {
            value: "PART_2",
            label: "Section 2"
        }, {
            value: "PART_3",
            label: "Section 3"
        }, {
            value: "PART_4",
            label: "Section 4"
        }],
        questionTypeOptions: [{
            value: "gap_filling",
            label: "Completion / Gap Fill",
            group: "Completion"
        }, {
            value: "diagram_labeling",
            label: "Map / Plan / Diagram",
            group: "Completion"
        }, {
            value: "multiple_choice",
            label: "Multiple Choice",
            group: "Multiple Choice"
        }, {
            value: "multiple_choice_many",
            label: "Multiple Choice (Many)",
            group: "Multiple Choice"
        }, {
            value: "matching_names",
            label: "Matching Names",
            group: "Matching"
        }, {
            value: "matching_features",
            label: "Matching Features",
            group: "Matching"
        }, {
            value: "matching_sentence_endings",
            label: "Matching Sentence Endings",
            group: "Matching"
        }, {
            value: "flow_chart_matching",
            label: "Flow Chart Matching",
            group: "Matching"
        }]
    },
    reading: {
        title: "Reading Passages",
        description: "Practice individual reading passages with various question types",
        icon: e.jsx(A, {
            className: "w-5 h-5"
        }),
        color: "text-emerald-500",
        testType: "part",
        apiSection: "reading",
        partOptions: [{
            value: "PASSAGE_1",
            label: "Passage 1"
        }, {
            value: "PASSAGE_2",
            label: "Passage 2"
        }, {
            value: "PASSAGE_3",
            label: "Passage 3"
        }],
        questionTypeOptions: [{
            value: "gap_filling",
            label: "Completion / Gap Fill",
            group: "Completion"
        }, {
            value: "gap_filling_options",
            label: "Summary with Options",
            group: "Completion"
        }, {
            value: "diagram_labeling",
            label: "Diagram Labeling",
            group: "Completion"
        }, {
            value: "multiple_choice",
            label: "Multiple Choice",
            group: "Multiple Choice"
        }, {
            value: "multiple_choice_many",
            label: "Multiple Choice (Many)",
            group: "Multiple Choice"
        }, {
            value: "true_false_not_given",
            label: "True / False / Not Given",
            group: "Multiple Choice"
        }, {
            value: "yes_no_not_given",
            label: "Yes / No / Not Given",
            group: "Multiple Choice"
        }, {
            value: "matching_headings",
            label: "Matching Headings",
            group: "Matching"
        }, {
            value: "matching_information",
            label: "Matching Information",
            group: "Matching"
        }, {
            value: "matching_names",
            label: "Matching Names",
            group: "Matching"
        }, {
            value: "matching_features",
            label: "Matching Features",
            group: "Matching"
        }, {
            value: "matching_sentence_endings",
            label: "Matching Sentence Endings",
            group: "Matching"
        }, {
            value: "flow_chart_matching",
            label: "Flow Chart Matching",
            group: "Matching"
        }]
    },
    "writing-task1": {
        title: "Writing Task 1",
        description: "Practice describing graphs, charts, diagrams, and processes",
        icon: e.jsx(M, {
            className: "w-5 h-5"
        }),
        color: "text-blue-500",
        testType: "part",
        apiSection: "writing",
        partOptions: [],
        questionTypeOptions: [{
            value: "line_graph",
            label: "Line Graph",
            group: "Charts"
        }, {
            value: "bar_chart",
            label: "Bar Chart",
            group: "Charts"
        }, {
            value: "pie_chart",
            label: "Pie Chart",
            group: "Charts"
        }, {
            value: "mixed_charts",
            label: "Mixed Charts",
            group: "Charts"
        }, {
            value: "table",
            label: "Table",
            group: "Diagrams"
        }, {
            value: "process_diagram",
            label: "Process / Diagram",
            group: "Diagrams"
        }, {
            value: "map",
            label: "Map",
            group: "Diagrams"
        }]
    },
    "writing-task2": {
        title: "Writing Task 2",
        description: "Practice essay writing on various topics",
        icon: e.jsx(S, {
            className: "w-5 h-5"
        }),
        color: "text-indigo-500",
        testType: "part",
        apiSection: "writing",
        partOptions: [],
        questionTypeOptions: [{
            value: "opinion",
            label: "Opinion",
            group: "Essay Types"
        }, {
            value: "discussion",
            label: "Discussion",
            group: "Essay Types"
        }, {
            value: "discuss_both_views",
            label: "Discuss Both Views",
            group: "Essay Types"
        }, {
            value: "advantages_disadvantages",
            label: "Advantages / Disadvantages",
            group: "Essay Types"
        }, {
            value: "problem_solution",
            label: "Problem / Solution",
            group: "Essay Types"
        }, {
            value: "agree_disagree",
            label: "Agree / Disagree",
            group: "Essay Types"
        }, {
            value: "positive_negative",
            label: "Positive / Negative",
            group: "Essay Types"
        }, {
            value: "two_part",
            label: "Two-Part Question",
            group: "Essay Types"
        }]
    },
    writing: {
        title: "Writing Tasks",
        description: "Practice both Task 1 (graphs, charts, diagrams) and Task 2 (essays)",
        icon: e.jsx(S, {
            className: "w-5 h-5"
        }),
        color: "text-blue-500",
        testType: "part",
        apiSection: "writing",
        partOptions: [{
            value: "TASK_1",
            label: "Task 1"
        }, {
            value: "TASK_2",
            label: "Task 2"
        }],
        questionTypeOptions: [{
            value: "line_graph",
            label: "Line Graph",
            group: "Task 1"
        }, {
            value: "bar_chart",
            label: "Bar Chart",
            group: "Task 1"
        }, {
            value: "pie_chart",
            label: "Pie Chart",
            group: "Task 1"
        }, {
            value: "mixed_charts",
            label: "Mixed Charts",
            group: "Task 1"
        }, {
            value: "table",
            label: "Table",
            group: "Task 1"
        }, {
            value: "process_diagram",
            label: "Process / Diagram",
            group: "Task 1"
        }, {
            value: "map",
            label: "Map",
            group: "Task 1"
        }, {
            value: "opinion",
            label: "Opinion",
            group: "Task 2"
        }, {
            value: "discussion",
            label: "Discussion",
            group: "Task 2"
        }, {
            value: "discuss_both_views",
            label: "Discuss Both Views",
            group: "Task 2"
        }, {
            value: "advantages_disadvantages",
            label: "Advantages / Disadvantages",
            group: "Task 2"
        }, {
            value: "problem_solution",
            label: "Problem / Solution",
            group: "Task 2"
        }, {
            value: "agree_disagree",
            label: "Agree / Disagree",
            group: "Task 2"
        }, {
            value: "positive_negative",
            label: "Positive / Negative",
            group: "Task 2"
        }, {
            value: "two_part",
            label: "Two-Part Question",
            group: "Task 2"
        }]
    },
    speaking: {
        title: "Speaking Topics",
        description: "Practice individual speaking parts with various topics",
        icon: e.jsx(P, {
            className: "w-5 h-5"
        }),
        color: "text-rose-500",
        testType: "part",
        apiSection: "speaking",
        partOptions: [{
            value: "PART_1",
            label: "Part 1"
        }, {
            value: "PART_2",
            label: "Part 2"
        }, {
            value: "PART_3",
            label: "Part 3"
        }],
        questionTypeOptions: []
    }
}
  , D = () => {
    const {section: P="reading"} = a()
      , S = l()
      , {userPlan: M} = i()
      , A = s.useMemo( () => {
        const e = S.pathname.split("/")
          , a = e[e.length - 1];
        return E[a] ? a : P
    }
    , [S.pathname, P])
      , O = E[A] || E.reading
      , [D,R] = s.useState("")
      , [q,G] = s.useState("")
      , [F,L] = s.useState([])
      , [I,K] = s.useState([])
      , [V,B] = s.useState("all")
      , [z,W] = s.useState("all")
      , [H,Q] = s.useState("all")
      , [$,U] = s.useState(0)
      , [Y,J] = s.useState(!1)
      , [X,Z] = s.useState(!1)
      , ee = [{
        value: "all",
        label: "All Plans"
    }, {
        value: "demo",
        label: "Demo (Free)"
    }, {
        value: "max",
        label: "Max"
    }]
      , ae = s.useMemo( () => "listening" === A ? t.LISTENING : "reading" === A ? t.READING : "speaking" === A ? t.SPEAKING : t.WRITING, [A])
      , {data: le=[]} = r(ae)
      , se = s.useMemo( () => le.filter(e => "PRIVATE" !== e.planType && ("ULTRA" !== e.planType || "ULTRA" === M)).sort( (e, a) => e.name.localeCompare(a.name, void 0, {
        sensitivity: "base"
    })), [le, M])
      , ie = "all" !== H ? H : void 0
      , te = s.useMemo( () => I.length > 0 ? Array.from(new Set(I)).join(",") : "all", [I])
      , re = s.useMemo( () => "writing-task1" === A ? "TASK_1" : "writing-task2" === A ? "TASK_2" : 1 === F.length ? F[0] : void 0, [A, F])
      , ne = "completed" === V || "pending" !== V && void 0
      , oe = "demo" === z ? "DEMO" : "max" === z ? "MAX" : void 0
      , {data: ce, isLoading: pe} = n(O.apiSection, O.testType, te, oe, void 0, ie, $, 12, ne, q || void 0, re);
    s.useEffect( () => {
        U(0)
    }
    , [F, I, V, z, H, q]),
    s.useEffect( () => {
        L([]),
        K([]),
        B("all"),
        W("all"),
        Q("all"),
        G(""),
        R(""),
        U(0)
    }
    , [A]),
    s.useEffect( () => {
        if ("all" === H)
            return;
        se.some(e => e.id === H) || Q("all")
    }
    , [se, H]),
    s.useEffect( () => {
        "" === D.trim() && "" !== q && G("")
    }
    , [D, q]);
    const ue = () => {
        G(D),
        U(0)
    }
      , de = e => {
        L(a => a.includes(e) ? a.filter(a => a !== e) : [...a, e])
    }
      , ge = e => {
        K(a => a.includes(e) ? a.filter(a => a !== e) : [...a, e])
    }
      , me = () => {
        L([]),
        K([]),
        B("all"),
        W("all"),
        Q("all"),
        R(""),
        G(""),
        U(0)
    }
      , he = F.length + I.length + ("all" !== V ? 1 : 0) + ("all" !== z ? 1 : 0) + ("all" !== H ? 1 : 0) + (q ? 1 : 0)
      , xe = ce?.userTestData || [];
    return e.jsx(o, {
        pageTitle: O.title,
        children: e.jsxs("div", {
            className: "space-y-6",
            children: [e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [e.jsx("span", {
                    className: c(O.color),
                    children: O.icon
                }), e.jsxs("div", {
                    children: [e.jsx("h1", {
                        className: "text-2xl font-bold text-foreground",
                        children: O.title
                    }), e.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children: O.description
                    })]
                })]
            }), e.jsx("div", {
                className: "bg-card border rounded-lg p-4",
                children: e.jsxs("div", {
                    className: "flex flex-col gap-4",
                    children: [e.jsxs("div", {
                        className: "flex gap-2",
                        children: [e.jsxs("div", {
                            className: "relative flex-1",
                            children: [e.jsx(_, {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                            }), e.jsx(p, {
                                placeholder: `Search ${O.title.toLowerCase()}...`,
                                value: D,
                                onChange: e => R(e.target.value),
                                onKeyDown: e => {
                                    "Enter" === e.key && ue()
                                }
                                ,
                                className: "pl-9 pr-8"
                            }), D && e.jsx("button", {
                                onClick: () => {
                                    R(""),
                                    G("")
                                }
                                ,
                                className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                                children: e.jsx(C, {
                                    className: "w-4 h-4"
                                })
                            })]
                        }), e.jsxs(u, {
                            onClick: ue,
                            className: "px-6",
                            children: [e.jsx(_, {
                                className: "w-4 h-4 mr-2"
                            }), "Search"]
                        })]
                    }), e.jsxs("div", {
                        className: "flex flex-wrap gap-2",
                        children: [O.partOptions.length > 0 && e.jsxs(N, {
                            open: Y,
                            onOpenChange: J,
                            children: [e.jsx(f, {
                                asChild: !0,
                                children: e.jsxs(u, {
                                    variant: "outline",
                                    size: "sm",
                                    className: c("h-9", F.length > 0 && "border-primary bg-primary/5 text-primary hover:bg-primary/10"),
                                    children: [0 === F.length ? "reading" === A ? "All Passages" : "writing" === A ? "All Tasks" : "listening" === A ? "All Sections" : "All Parts" : 1 === F.length ? O.partOptions.find(e => e.value === F[0])?.label || F[0] : `${F.length} selected`, e.jsx(w, {
                                        className: "w-4 h-4 ml-1"
                                    })]
                                })
                            }), e.jsx(y, {
                                className: "w-48 p-3",
                                align: "start",
                                children: e.jsx("div", {
                                    className: "space-y-2",
                                    children: O.partOptions.map(a => e.jsxs("label", {
                                        className: "flex items-center gap-2 cursor-pointer group",
                                        children: [e.jsx(j, {
                                            checked: F.includes(a.value),
                                            onCheckedChange: () => de(a.value)
                                        }), e.jsx("span", {
                                            className: "text-sm text-foreground",
                                            children: a.label
                                        })]
                                    }, a.value))
                                })
                            })]
                        }), e.jsxs(d, {
                            value: V,
                            onValueChange: B,
                            children: [e.jsx(g, {
                                className: c("w-auto h-9 min-w-[120px]", "all" !== V && "border-primary bg-primary/5 text-primary hover:bg-primary/10"),
                                children: e.jsx(m, {
                                    placeholder: "Status"
                                })
                            }), e.jsxs(h, {
                                children: [e.jsx(x, {
                                    value: "all",
                                    children: "All Status"
                                }), e.jsx(x, {
                                    value: "pending",
                                    children: "Not Completed"
                                }), e.jsx(x, {
                                    value: "completed",
                                    children: "Completed"
                                })]
                            })]
                        }), O.questionTypeOptions.length > 0 && e.jsxs(N, {
                            open: X,
                            onOpenChange: Z,
                            children: [e.jsx(f, {
                                asChild: !0,
                                children: e.jsxs(u, {
                                    variant: "outline",
                                    size: "sm",
                                    className: c("h-9", I.length > 0 && "border-primary bg-primary/5 text-primary hover:bg-primary/10"),
                                    children: [0 === I.length ? "All Types" : 1 === I.length ? O.questionTypeOptions.find(e => e.value === I[0])?.label || I[0] : `${I.length} types`, e.jsx(w, {
                                        className: "w-4 h-4 ml-1"
                                    })]
                                })
                            }), e.jsx(y, {
                                className: "w-[440px] p-4",
                                align: "start",
                                children: e.jsxs("div", {
                                    className: "flex flex-col gap-4",
                                    children: [e.jsxs("div", {
                                        className: "flex items-center justify-between",
                                        children: [e.jsx("h4", {
                                            className: "font-medium text-sm text-foreground",
                                            children: "Question Types"
                                        }), I.length > 0 && e.jsx(u, {
                                            variant: "ghost",
                                            size: "sm",
                                            className: "h-auto p-0 text-xs text-muted-foreground hover:text-foreground",
                                            onClick: () => K([]),
                                            children: "Clear all"
                                        })]
                                    }), e.jsx("div", {
                                        className: "max-h-[60vh] overflow-y-auto px-1 -mx-1",
                                        children: ( () => {
                                            if (!O.questionTypeOptions.some(e => e.group))
                                                return e.jsx("div", {
                                                    className: "grid grid-cols-2 gap-3 pb-2",
                                                    children: O.questionTypeOptions.map(a => e.jsxs("label", {
                                                        className: "flex items-start gap-2.5 cursor-pointer group",
                                                        children: [e.jsx(j, {
                                                            checked: I.includes(a.value),
                                                            onCheckedChange: () => ge(a.value),
                                                            className: "mt-0.5"
                                                        }), e.jsx("span", {
                                                            className: "text-sm text-foreground leading-tight",
                                                            children: a.label
                                                        })]
                                                    }, a.value))
                                                });
                                            const a = O.questionTypeOptions.reduce( (e, a) => {
                                                const l = a.group || "Other";
                                                return e[l] || (e[l] = []),
                                                e[l].push(a),
                                                e
                                            }
                                            , {});
                                            return e.jsx("div", {
                                                className: "flex flex-col gap-5 pb-2",
                                                children: Object.entries(a).map( ([a,l]) => e.jsxs("div", {
                                                    className: "flex flex-col gap-2.5",
                                                    children: [e.jsx("h5", {
                                                        className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                                                        children: a
                                                    }), e.jsx("div", {
                                                        className: "grid grid-cols-2 gap-y-3 gap-x-4",
                                                        children: l.map(a => e.jsxs("label", {
                                                            className: "flex items-start gap-2.5 cursor-pointer group",
                                                            children: [e.jsx(j, {
                                                                checked: I.includes(a.value),
                                                                onCheckedChange: () => ge(a.value),
                                                                className: "mt-0.5"
                                                            }), e.jsx("span", {
                                                                className: "text-sm text-foreground leading-tight",
                                                                children: a.label
                                                            })]
                                                        }, a.value))
                                                    })]
                                                }, a))
                                            })
                                        }
                                        )()
                                    })]
                                })
                            })]
                        }), e.jsxs(d, {
                            value: z,
                            onValueChange: W,
                            children: [e.jsx(g, {
                                className: c("w-auto h-9 min-w-[120px]", "all" !== z && "border-primary bg-primary/5 text-primary hover:bg-primary/10"),
                                children: e.jsx(m, {
                                    placeholder: "Plan"
                                })
                            }), e.jsx(h, {
                                children: ee.map(a => e.jsx(x, {
                                    value: a.value,
                                    children: a.label
                                }, a.value))
                            })]
                        }), se.length > 0 && e.jsxs(d, {
                            value: H,
                            onValueChange: Q,
                            children: [e.jsx(g, {
                                className: c("w-auto h-9 min-w-[150px]", "all" !== H && "border-primary bg-primary/5 text-primary hover:bg-primary/10"),
                                children: e.jsx(m, {
                                    placeholder: "Pack"
                                })
                            }), e.jsxs(h, {
                                children: [e.jsx(x, {
                                    value: "all",
                                    children: "All Packs"
                                }), se.map(a => e.jsx(x, {
                                    value: a.id,
                                    children: a.name
                                }, a.id))]
                            })]
                        }), he > 0 && e.jsxs(u, {
                            variant: "ghost",
                            size: "sm",
                            onClick: me,
                            className: "h-9 text-muted-foreground hover:text-foreground",
                            children: [e.jsx(k, {
                                className: "w-4 h-4 mr-1"
                            }), "Clear all"]
                        })]
                    }), he > 0 && e.jsxs("div", {
                        className: "flex flex-wrap gap-2 pt-2 border-t",
                        children: [q && e.jsxs(v, {
                            variant: "secondary",
                            className: "gap-1 pl-2",
                            children: ['Search: "', q, '"', e.jsx("button", {
                                onClick: () => {
                                    R(""),
                                    G("")
                                }
                                ,
                                className: "ml-1 hover:bg-muted rounded-full p-0.5",
                                children: e.jsx(C, {
                                    className: "w-3 h-3"
                                })
                            })]
                        }), F.map(a => e.jsxs(v, {
                            variant: "secondary",
                            className: "gap-1 pl-2",
                            children: [O.partOptions.find(e => e.value === a)?.label || a, e.jsx("button", {
                                onClick: () => de(a),
                                className: "ml-1 hover:bg-muted rounded-full p-0.5",
                                children: e.jsx(C, {
                                    className: "w-3 h-3"
                                })
                            })]
                        }, a)), I.map(a => e.jsxs(v, {
                            variant: "secondary",
                            className: "gap-1 pl-2",
                            children: [O.questionTypeOptions.find(e => e.value === a)?.label || a, e.jsx("button", {
                                onClick: () => ge(a),
                                className: "ml-1 hover:bg-muted rounded-full p-0.5",
                                children: e.jsx(C, {
                                    className: "w-3 h-3"
                                })
                            })]
                        }, a)), "all" !== V && e.jsxs(v, {
                            variant: "secondary",
                            className: "gap-1 pl-2",
                            children: ["completed" === V ? "Completed" : "Not Completed", e.jsx("button", {
                                onClick: () => B("all"),
                                className: "ml-1 hover:bg-muted rounded-full p-0.5",
                                children: e.jsx(C, {
                                    className: "w-3 h-3"
                                })
                            })]
                        }), "all" !== z && e.jsxs(v, {
                            variant: "secondary",
                            className: "gap-1 pl-2",
                            children: [ee.find(e => e.value === z)?.label || z, e.jsx("button", {
                                onClick: () => W("all"),
                                className: "ml-1 hover:bg-muted rounded-full p-0.5",
                                children: e.jsx(C, {
                                    className: "w-3 h-3"
                                })
                            })]
                        }), "all" !== H && e.jsxs(v, {
                            variant: "secondary",
                            className: "gap-1 pl-2",
                            children: [se.find(e => e.id === H)?.name || "Pack", e.jsx("button", {
                                onClick: () => Q("all"),
                                className: "ml-1 hover:bg-muted rounded-full p-0.5",
                                children: e.jsx(C, {
                                    className: "w-3 h-3"
                                })
                            })]
                        })]
                    })]
                })
            }), e.jsxs("div", {
                children: [!pe && xe.length > 0 && e.jsxs("p", {
                    className: "text-sm text-muted-foreground mb-4",
                    children: ["Showing ", xe.length, " of ", ce?.totalRecords || 0, " tests"]
                }), pe ? e.jsx("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch",
                    children: [...Array(6)].map( (a, l) => e.jsxs("div", {
                        className: "bg-card rounded-lg border animate-pulse h-full flex flex-col",
                        children: [e.jsx("div", {
                            className: "h-44 bg-muted rounded-t-lg flex-shrink-0"
                        }), e.jsxs("div", {
                            className: "p-4 space-y-3 flex-1",
                            children: [e.jsx("div", {
                                className: "h-5 bg-muted rounded w-3/4"
                            }), e.jsx("div", {
                                className: "h-4 bg-muted rounded w-1/2"
                            }), e.jsx("div", {
                                className: "h-9 bg-muted rounded mt-auto"
                            })]
                        })]
                    }, l))
                }) : 0 === xe.length ? e.jsxs("div", {
                    className: "text-center py-16 bg-card border rounded-lg",
                    children: [e.jsx("div", {
                        className: c("mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4", O.color),
                        children: O.icon
                    }), e.jsx("h2", {
                        className: "text-xl font-semibold text-foreground mb-2",
                        children: "No tests found"
                    }), e.jsx("p", {
                        className: "text-muted-foreground mb-4",
                        children: "Try adjusting your filters or search criteria"
                    }), he > 0 && e.jsxs(u, {
                        variant: "outline",
                        onClick: me,
                        children: [e.jsx(k, {
                            className: "w-4 h-4 mr-2"
                        }), "Clear Filters"]
                    })]
                }) : e.jsxs(e.Fragment, {
                    children: [e.jsx("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch",
                        children: xe.map( (a, l) => e.jsx(T, {
                            test: a,
                            index: l
                        }, a.id))
                    }), ce && ce.totalRecords > 12 && e.jsx("div", {
                        className: "mt-8",
                        children: e.jsx(b, {
                            currentPage: $,
                            totalPages: Math.ceil(ce.totalRecords / 12),
                            onPageChange: U
                        })
                    })]
                })]
            })]
        })
    })
}
;
export {D as default};
