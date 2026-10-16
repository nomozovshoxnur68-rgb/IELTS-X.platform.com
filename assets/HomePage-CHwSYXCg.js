import { j as e } from "./query-BoogBOpP.js";
import { B as s, m as t, b as a, C as i, g as r, n as l, A as n, e as c, f as m, o, p as d } from "./index-CgPgTAA2.js";
import { u as x, a as h } from "./useCourses-DzYEcZ-T.js";
import { ac as j, n as p, j as u, X as g, A as N, H as f, q as w, r as b, $ as v, ab as y, h as k, u as T, _ as C, al as E } from "./icons-Dm46cpbd.js";
import { e as L, L as P } from "./router-oTa00OWi.js";
import { u as S, a as $, b as z } from "./useTeacher-Zm217srY.js";
import "./ui-DQFvSc6P.js";
const M = ({ className: a, size: i = "sm", children: r, onClick: l }) => {
    const n = L();
    return e.jsxs(s, {
        size: i,
        onClick: () => {
            l ? l() : n("/pricing")
        }
        ,
        className: t("bg-gradient-to-r from-purple-600 via-pink-600 to-red-600", "hover:from-purple-700 hover:via-pink-700 hover:to-red-700", "text-white border-0 shadow-lg hover:shadow-xl", "font-semibold", a),
        children: [e.jsx(j, {
            className: "w-3 h-3 mr-1"
        }), r || "Unlock"]
    })
}
    , A = () => {
        const { toast: t } = a()
            , { data: l } = S()
            , n = $()
            , c = z()
            , m = l?.invitations || [];
        if (0 === m.length)
            return null;
        return e.jsx("div", {
            className: "space-y-2",
            children: m.map(a => e.jsx(i, {
                className: "border-primary/20 bg-primary/5",
                children: e.jsxs(r, {
                    className: "flex items-center justify-between py-3 px-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx(p, {
                            className: "h-5 w-5 text-primary"
                        }), e.jsxs("div", {
                            children: [e.jsxs("p", {
                                className: "text-sm font-medium",
                                children: ["Teacher invitation from ", e.jsx("span", {
                                    className: "font-bold",
                                    children: a.teacherName
                                })]
                            }), e.jsx("p", {
                                className: "text-xs text-muted-foreground",
                                children: a.teacherEmail
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "flex gap-2",
                        children: [e.jsxs(s, {
                            size: "sm",
                            onClick: () => (async (e, s) => {
                                try {
                                    await n.mutateAsync(e),
                                        t({
                                            title: "Invitation accepted",
                                            description: `You are now connected with ${s}`
                                        })
                                } catch (a) {
                                    t({
                                        title: "Failed to accept invitation",
                                        description: a.response?.data?.message || "Something went wrong",
                                        variant: "destructive"
                                    })
                                }
                            }
                            )(a.id, a.teacherName),
                            disabled: n.isPending,
                            children: [e.jsx(u, {
                                className: "h-4 w-4 mr-1"
                            }), "Accept"]
                        }), e.jsx(s, {
                            size: "sm",
                            variant: "ghost",
                            onClick: () => (async e => {
                                try {
                                    await c.mutateAsync(e),
                                        t({
                                            title: "Invitation declined"
                                        })
                                } catch (s) {
                                    t({
                                        title: "Failed to decline invitation",
                                        variant: "destructive"
                                    })
                                }
                            }
                            )(a.id),
                            disabled: c.isPending,
                            children: e.jsx(g, {
                                className: "h-4 w-4"
                            })
                        })]
                    })]
                })
            }, a.id))
        })
    }
    , I = (s, t) => {
        switch (s) {
            case "Headphones":
            default:
                return e.jsx(f, {
                    className: `h-5 w-5 mr-2 ${t}`
                });
            case "BookOpen":
                return e.jsx(w, {
                    className: `h-5 w-5 mr-2 ${t}`
                });
            case "Pencil":
                return e.jsx(b, {
                    className: `h-5 w-5 mr-2 ${t}`
                });
            case "MessageCircle":
                return e.jsx(v, {
                    className: `h-5 w-5 mr-2 ${t}`
                });
            case "BarChart":
                return e.jsx(E, {
                    className: `h-5 w-5 mr-2 ${t}`
                });
            case "TargetIcon":
                return e.jsx(T, {
                    className: `h-5 w-5 mr-2 ${t}`
                })
        }
    }
    , O = () => {
        const t = L()
            , { data: a } = l()
            , j = "DEMO" === a?.subscriptionPlan.name
            , { data: p = [] } = x()
            , { data: u = [] } = h(!j)
            , g = j ? p : u;
        return e.jsxs(n, {
            pageTitle: "Home",
            children: [e.jsx(A, {}), j && e.jsx("section", {
                className: "mb-10",
                children: e.jsxs("div", {
                    className: "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-amber-100/50 p-6 md:p-8 shadow-sm",
                    children: [e.jsx("div", {
                        className: "absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-2xl"
                    }), e.jsx("div", {
                        className: "absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl"
                    }), e.jsxs("div", {
                        className: "relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
                        children: [e.jsxs("div", {
                            children: [e.jsxs("p", {
                                className: "inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3",
                                children: [e.jsx(N, {
                                    className: "h-3.5 w-3.5"
                                }), "Limited Time Offer"]
                            }), e.jsx("h2", {
                                className: "text-2xl md:text-3xl font-bold tracking-tight text-foreground",
                                children: "Get access to quality tests & practice materials and more!"
                            })]
                        }), e.jsx("div", {
                            className: "shrink-0",
                            children: e.jsx(M, {
                                className: "min-w-[160px]"
                            })
                        })]
                    })]
                })
            }), e.jsxs("section", {
                className: "mb-16",
                children: [e.jsx("h2", {
                    className: "text-2xl font-bold text-foreground mb-8",
                    children: "Test Packs"
                }), e.jsx("div", {
                    className: "grid md:grid-cols-3 gap-6",
                    children: [{
                        title: "Listening",
                        description: "Complete listening test with full timing.",
                        time: "30 minutes",
                        icon: f,
                        color: "text-yellow-500",
                        link: "/full-tests/listening"
                    }, {
                        title: "Reading",
                        description: "Full reading test with passages and questions.",
                        time: "60 minutes",
                        icon: w,
                        color: "text-green-500",
                        link: "/full-tests/reading"
                    }, {
                        title: "Writing",
                        description: "Full writing test with real prompts.",
                        time: "60 minutes",
                        icon: b,
                        color: "text-blue-500",
                        link: "/full-tests/writing"
                    }, {
                        title: "Speaking",
                        description: "Speaking test with complete part flow.",
                        time: "11-14 minutes",
                        icon: v,
                        color: "text-red-500",
                        link: "/full-tests/speaking"
                    }].map((t, a) => e.jsxs(i, {
                        className: "hover:shadow-lg transition-shadow",
                        children: [e.jsxs(c, {
                            className: "flex flex-row items-center justify-between space-y-0 pb-2",
                            children: [e.jsx(m, {
                                className: "text-md font-medium",
                                children: t.title
                            }), e.jsx(t.icon, {
                                className: `h-5 w-5 ${t.color}`
                            })]
                        }), e.jsxs(r, {
                            children: [e.jsx("p", {
                                className: "text-sm text-muted-foreground line-clamp-2 mb-2",
                                children: t.description
                            }), e.jsxs("div", {
                                className: "flex justify-between items-center",
                                children: [e.jsxs(o, {
                                    variant: "secondary",
                                    className: "text-xs",
                                    children: [e.jsx(y, {
                                        className: "w-3 h-3 mr-1"
                                    }), t.time]
                                }), e.jsx(s, {
                                    variant: "outline",
                                    size: "sm",
                                    asChild: !0,
                                    children: e.jsxs(P, {
                                        to: t.link,
                                        children: ["View Tests ", e.jsx(k, {
                                            className: "ml-2 h-4 w-4"
                                        })]
                                    })
                                })]
                            })]
                        })]
                    }, a))
                })]
            }), e.jsxs("section", {
                className: "mb-16",
                children: [e.jsx("h2", {
                    className: "text-2xl font-bold text-foreground mb-8",
                    children: "Part Practice"
                }), e.jsx("div", {
                    className: "grid md:grid-cols-3 gap-6",
                    children: [{
                        title: "Listening Sections",
                        description: "Sharpen listening comprehension with timed sections.",
                        time: "8 min",
                        icon: f,
                        color: "text-yellow-500",
                        link: "/practice/listening"
                    }, {
                        title: "Reading Passages",
                        description: "Build speed and accuracy with reading passages.",
                        time: "20-30 min",
                        icon: w,
                        color: "text-green-500",
                        link: "/practice/reading"
                    }, {
                        title: "Writing Tasks",
                        description: "Practice writing responses with real prompts.",
                        time: "20-40 min",
                        icon: b,
                        color: "text-blue-500",
                        link: "/practice/writing"
                    }, {
                        title: "Speaking Topics",
                        description: "Prepare for speaking with topic-based prompts.",
                        time: "11-14 min",
                        icon: v,
                        color: "text-red-500",
                        link: "/practice/speaking"
                    }].map((t, a) => e.jsxs(i, {
                        className: "hover:shadow-lg transition-shadow",
                        children: [e.jsxs(c, {
                            className: "flex flex-row items-center justify-between space-y-0 pb-2",
                            children: [e.jsx(m, {
                                className: "text-md font-medium",
                                children: t.title
                            }), e.jsx(t.icon, {
                                className: `h-5 w-5 ${t.color}`
                            })]
                        }), e.jsxs(r, {
                            children: [e.jsx("p", {
                                className: "text-sm text-muted-foreground line-clamp-2 mb-2",
                                children: t.description
                            }), e.jsxs("div", {
                                className: "flex justify-between items-center",
                                children: [e.jsxs(o, {
                                    variant: "secondary",
                                    className: "text-xs",
                                    children: [e.jsx(y, {
                                        className: "w-3 h-3 mr-1"
                                    }), t.time]
                                }), e.jsx(s, {
                                    variant: "outline",
                                    size: "sm",
                                    asChild: !0,
                                    children: e.jsxs(P, {
                                        to: t.link,
                                        children: ["View Tests ", e.jsx(k, {
                                            className: "ml-2 h-4 w-4"
                                        })]
                                    })
                                })]
                            })]
                        })]
                    }, a))
                })]
            }), e.jsxs("section", {
                className: "mb-16",
                children: [e.jsx("h2", {
                    className: "text-2xl font-bold text-foreground mb-8",
                    children: "Mock Exams"
                }), e.jsx("div", {
                    className: "grid md:grid-cols-1 gap-6",
                    children: e.jsxs(i, {
                        className: "hover:shadow-lg transition-shadow border-2",
                        children: [e.jsxs(c, {
                            className: "flex flex-row items-center justify-between space-y-0 pb-2",
                            children: [e.jsx(m, {
                                className: "text-lg font-semibold",
                                children: "Complete IELTS Mock Exams"
                            }), e.jsx(T, {
                                className: "h-6 w-6 text-emerald-600"
                            })]
                        }), e.jsxs(r, {
                            children: [e.jsx("p", {
                                className: "text-sm text-muted-foreground line-clamp-2 mb-4",
                                children: "Take full-length IELTS practice tests with Listening, Reading, and Writing sections. Get detailed feedback and band scores for complete exam simulation."
                            }), e.jsxs("div", {
                                className: "flex justify-between items-center",
                                children: [e.jsxs("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: [e.jsxs(o, {
                                        variant: "secondary",
                                        className: "text-xs",
                                        children: [e.jsx(y, {
                                            className: "w-3 h-3 mr-1"
                                        }), "2.5 hours"]
                                    }), e.jsxs(o, {
                                        variant: "secondary",
                                        className: "text-xs",
                                        children: [e.jsx(f, {
                                            className: "w-3 h-3 mr-1"
                                        }), "Listening"]
                                    }), e.jsxs(o, {
                                        variant: "secondary",
                                        className: "text-xs ",
                                        children: [e.jsx(w, {
                                            className: "w-3 h-3 mr-1"
                                        }), "Reading"]
                                    }), e.jsxs(o, {
                                        variant: "secondary",
                                        className: "text-xs ",
                                        children: [e.jsx(b, {
                                            className: "w-3 h-3 mr-1"
                                        }), "Writing"]
                                    })]
                                }), e.jsx(s, {
                                    variant: "outline",
                                    size: "sm",
                                    asChild: !0,
                                    className: "",
                                    children: e.jsxs(P, {
                                        to: "/practice/mock",
                                        children: ["Start Mock Exam ", e.jsx(k, {
                                            className: "ml-2 h-4 w-4"
                                        })]
                                    })
                                })]
                            })]
                        })]
                    })
                })]
            }), e.jsxs("section", {
                className: "mb-16",
                children: [e.jsx("h2", {
                    className: "text-2xl font-bold text-foreground mb-8",
                    children: "IELTS Courses"
                }), e.jsx("div", {
                    className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6",
                    children: g.map((a, l) => e.jsxs(i, {
                        className: "hover:shadow-lg transition-shadow",
                        children: [e.jsx(c, {
                            children: e.jsxs(m, {
                                className: "text-base flex items-center",
                                children: [I(a.icon, a.color), a.name]
                            })
                        }), e.jsxs(r, {
                            children: [e.jsx("p", {
                                className: "text-sm text-muted-foreground mb-4 h-10",
                                children: a.description
                            }), e.jsx("div", {
                                className: "flex justify-between items-center",
                                children: e.jsx("span", {
                                    className: "text-xs text-muted-foreground",
                                    children: e.jsxs(o, {
                                        variant: "secondary",
                                        className: "text-xs",
                                        children: [e.jsx(C, {
                                            className: "w-3 h-3 mr-1"
                                        }), a.totalModules || a.total_modules, " modules"]
                                    })
                                })
                            }), j ? e.jsx(M, {
                                className: "w-full mt-4"
                            }) : e.jsx(s, {
                                variant: "outline",
                                size: "sm",
                                className: d("w-full mt-4", "COMPLETED" === a.status && "border-emerald-500/50 hover:bg-emerald-500/10"),
                                onClick: () => {
                                    return e = a.id,
                                        void t(`/courses/${e}/modules`);
                                    var e
                                }
                                ,
                                children: void 0 === a.status || "NOT_STARTED" === a.status ? "Start" : "COMPLETED" === a.status ? "Revisit" : "Continue Learning"
                            })]
                        })]
                    }, l))
                })]
            })]
        })
    }
    ;
export { O as default };
