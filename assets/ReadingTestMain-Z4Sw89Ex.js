import {j as e} from "./query-DsA5-mxg.js";
import {a as t, R as s, h as n, u as i, e as r} from "./router-gAN6ztYq.js";
import {E as a, a as o, u as l, C as c, b as u} from "./ExamRoutes-CxPlFRVv.js";
import {b7 as d, b8 as m, a5 as p, b4 as x, b as f, aN as g, V as h, b6 as v} from "./index-HS6_bSfL.js";
import {R as b, a as y} from "./ReadingPassageRenderer-b5t5LADt.js";
import {h as j, H as k, i as w, f as C} from "./useSpeakingTests-CMINX9XJ.js";
import {i as E, j as I, u as S, p as N, D as T, k as D, P as R} from "./Reading-FlowChartCompletionTest-DgfIVHmB.js";
import {E as P} from "./ExamReadingDivider-DxMFdbe6.js";
import {u as L, E as Q, a as A, b as q, P as M, R as G} from "./ReportIssueDialog-sMeioN4o.js";
import {b as z} from "./examResultCalculations-BaIfGSqA.js";
import {t as B} from "./usePracticeTests-CoVQL7Sl.js";
const F = ({children: n, transformedContent: i, examStore: r}) => {
    const a = E(I(R, {
        activationConstraint: {
            distance: 8
        }
    }))
      , {options: o, activeId: l, setActiveId: c, selectedQuestionId: u, handleDragEnd: d, handleQuestionClick: m, handleQuestionDoubleClick: p, answers: x} = S(i, r)
      , [f,g] = t.useState(void 0)
      , h = t.useCallback(e => {
        const t = String(e.active.id);
        c(t);
        const s = i?.options || [];
        let n;
        const r = s.find(e => e.id === t);
        if (r)
            n = r.text;
        else {
            const e = x[t]
              , i = s.find(t => t.id === e);
            n = i?.text
        }
        g(n)
    }
    , [c, i, x])
      , v = t.useCallback(e => {
        d(e),
        c(null),
        g(void 0)
    }
    , [d, c])
      , b = t.useCallback(e => N(e), [])
      , y = s.Children.map(n, e => s.isValidElement(e) && e.type === O ? s.cloneElement(e, {
        answers: x,
        onQuestionClick: m,
        onQuestionDoubleClick: p,
        selectedQuestionId: u || void 0,
        isDragDropEnabled: !0,
        availableOptions: o.map(e => "string" == typeof e ? {
            id: e,
            text: e
        } : e)
    }) : e);
    return e.jsxs(T, {
        sensors: a,
        collisionDetection: b,
        onDragStart: h,
        onDragEnd: v,
        autoScroll: !1,
        children: [y, e.jsx(D, {
            activeId: l,
            activeOption: f
        })]
    })
}
  , O = ({currentPartData: t, transformedContent: s, dividerPosition: n, handleDividerPointerDown: i, examStore: r, answers: a={}, onQuestionClick: o, onQuestionDoubleClick: l, selectedQuestionId: c, isDragDropEnabled: u=!1, availableOptions: d=[]}) => {
    const m = {
        "--reading-passage-size": `${n}%`,
        "--reading-question-size": 100 - n + "%"
    };
    return e.jsxs("div", {
        id: "reading-container",
        className: "test-content relative flex h-full min-h-0 flex-col lg:flex-row",
        style: m,
        children: [e.jsx("div", {
            className: "h-[var(--reading-passage-size)] min-h-0 w-full overflow-y-auto px-3 pt-4 pb-8 lg:h-full lg:w-[var(--reading-passage-size)] lg:px-2 lg:pt-5 lg:pb-20",
            "data-exam-integrity-reading-passage": !0,
            children: e.jsx(b, {
                passage: t.passage,
                answers: a,
                onQuestionClick: o || ( () => {}
                ),
                onQuestionDoubleClick: l || ( () => {}
                ),
                selectedQuestionId: c,
                isDragDropEnabled: u,
                headings: s?.options || [],
                toggleQuestionFlag: r.toggleQuestionFlag,
                flaggedQuestions: r.flaggedQuestions,
                section: r.section
            })
        }), e.jsx(P, {
            orientation: "horizontal",
            onPointerDown: i,
            className: "lg:hidden"
        }), e.jsx(P, {
            orientation: "vertical",
            onPointerDown: i,
            className: "hidden lg:block"
        }), e.jsx("div", {
            className: "h-[var(--reading-question-size)] min-h-0 w-full overflow-y-auto bg-white p-4 pb-16 lg:h-full lg:w-[var(--reading-question-size)] lg:p-5 lg:pb-36",
            children: e.jsx("div", {
                className: "space-y-8",
                children: t.question.map(t => e.jsx("div", {
                    "data-exam-integrity-question-group": !0,
                    "data-exam-integrity-question-type": t.type,
                    children: e.jsx(y, {
                        questionGroup: t,
                        examStore: r,
                        dndOptions: "MATCHING_HEADINGS" === t.type ? d : void 0
                    })
                }, t.id))
            })
        })]
    })
}
  , U = ({onComplete: s, examStore: n, examContent: i, onExit: r, hideExit: l=!1, hideFullscreen: c=!1, isMockExam: u=!1, candidateInfo: d, onReportIssueClick: m}) => {
    const {timeLeft: p} = n
      , [x,f] = t.useState(j(i))
      , [g,h] = t.useState(50)
      , v = t.useRef(!1)
      , b = t.useRef("vertical")
      , y = t.useCallback(e => f(e), [])
      , C = t.useCallback( () => s(), [s])
      , E = t.useMemo( () => ( (e, t) => {
        const s = (1 === e ? t.part1 : 2 === e ? t.part2 : t.part3).question;
        return {
            title: `Part ${e}`,
            instruction: `Read the text and answer questions ${s[0]?.content?.from ?? 1}–${s[s.length - 1]?.content?.to ?? 40}.`
        }
    }
    )(x, i), [x, i])
      , I = t.useCallback(e => {
        if (!v.current)
            return;
        const t = document.getElementById("reading-container");
        if (!t)
            return;
        const s = t.getBoundingClientRect()
          , n = "horizontal" === b.current
          , i = n ? s.height : s.width;
        if (i <= 0)
            return;
        const r = n ? e.clientY - s.top : e.clientX - s.left;
        var a;
        h((a = r / i * 100,
        Math.min(Math.max(a, 30), 70)))
    }
    , [])
      , S = t.useCallback( () => {
        v.current = !1,
        document.removeEventListener("pointermove", I),
        document.removeEventListener("pointerup", S),
        document.removeEventListener("pointercancel", S)
    }
    , [I])
      , N = t.useCallback(e => {
        e.preventDefault(),
        b.current = "undefined" == typeof window || window.matchMedia("(min-width: 1024px)").matches ? "vertical" : "horizontal",
        v.current = !0,
        e.currentTarget.setPointerCapture?.(e.pointerId),
        document.addEventListener("pointermove", I),
        document.addEventListener("pointerup", S),
        document.addEventListener("pointercancel", S)
    }
    , [I, S]);
    t.useEffect( () => () => {
        document.removeEventListener("pointermove", I),
        document.removeEventListener("pointerup", S),
        document.removeEventListener("pointercancel", S)
    }
    , [I, S]);
    const T = t.useCallback( () => {
        switch (x) {
        case 1:
        default:
            return i.part1;
        case 2:
            return i.part2;
        case 3:
            return i.part3
        }
    }
    , [x, i])()
      , D = t.useMemo( () => T.question.find(e => "MATCHING_HEADINGS" === e.type), [T])
      , R = !!D
      , P = t.useMemo( () => {
        if (!D)
            return null;
        const e = D.content;
        return {
            title: e.title,
            questionsTitle: e.questionsTitle || "Questions",
            questions: e.questions.map(e => ({
                questionNumber: String(e.questionNumber),
                text: e.text,
                answerId: null
            })),
            optionsTitle: e.optionsTitle || "Headings",
            options: e.headings
        }
    }
    , [D])
      , L = e.jsx(O, {
        currentPartData: T,
        transformedContent: P,
        dividerPosition: g,
        handleDividerPointerDown: N,
        examStore: n
    });
    return e.jsx(k, {
        children: e.jsx(a, {
            sectionInstruction: E,
            timeLeft: p || 0,
            parts: i.parts || w,
            currentPart: x,
            onPartChange: y,
            onSubmitClick: C,
            examStore: n,
            candidateInfo: d,
            isMockExam: u,
            button: e.jsx(o, {
                onSubmitClick: C,
                onBackClick: r,
                hideExit: l,
                hideFullscreen: c,
                onReportIssueClick: m
            }),
            children: R ? e.jsx(F, {
                transformedContent: P,
                examStore: n,
                children: L
            }) : L
        })
    })
}
  , H = ({onStartTest: t}) => {
    const {ExamUserInfo: s} = L();
    return e.jsx(Q, {
        userInfoContent: e.jsx(s, {}),
        children: e.jsx(A, {
            title: "IELTS Reading",
            time: "60 minutes",
            instructions: e.jsxs("ul", {
                className: "ml-10 list-disc list-inside space-y-1 text-sm text-foreground",
                children: [e.jsx("li", {
                    children: "Practice first without dictionaries"
                }), e.jsx("li", {
                    children: "After completing exam, review your mistakes"
                }), e.jsx("li", {
                    children: "You can use answer location and explanations to understand why is this"
                }), e.jsx("li", {
                    children: "You can use vocabularies section to learn new words"
                })]
            }),
            information: e.jsxs("ul", {
                className: "ml-10 list-disc list-inside space-y-1 text-sm text-foreground",
                children: [e.jsx("li", {
                    children: "We strongly recommend not to use chatGpt tools while you are in exam"
                }), e.jsx("li", {
                    children: "If you still want to use GPT or third party tools, only copy only part you need"
                })]
            }),
            alertMessage: "Do not click 'Start test' until you are told to do so.",
            onStartTest: () => {
                t && t()
            }
        })
    })
}
  , _ = ({testId: s, onComplete: a, isMockExam: o=!1}) => {
    const {testId: b} = n()
      , y = s || b
      , [j,k] = t.useState(void 0)
      , [w,E] = t.useState(60)
      , I = d(y || "1", w)
      , {refetch: S} = B(y || "", {
        enabled: !1
    })
      , {examStep: N, setExamStep: T, setUserInfo: D, answers: R, resetExam: P, userTestResult: L, setUserTestResult: Q, timeLeft: A, setTimeLeft: F} = I()
      , [O,_] = t.useState(null);
    t.useEffect( () => {
        o && N === m.Instructions && T(m.Test)
    }
    , [o, N, T]);
    const Y = {
        ...I(),
        testId: y || void 0,
        section: p.READING,
        userTestResult: L || void 0,
        setUserTestResult: Q,
        answerKeys: O
    }
      , [$,J] = t.useState(!1)
      , [K,V] = t.useState(!1)
      , [W,X] = t.useState(!1)
      , Z = i().state
      , ee = t.useMemo( () => {
        if (o)
            return;
        const e = q(Z?.packName || j?.packName, j?.name);
        return e ? {
            candidateId: e
        } : void 0
    }
    , [o, Z?.packName, j?.packName, j?.name])
      , {data: te, subQueryStates: se=[]} = C(y || "1")
      , {reportSubmissionIntegrity: ne} = l({
        enabled: !o && N === m.Test,
        section: p.READING,
        testId: y,
        testTitle: j?.name,
        mockPackId: j?.packId,
        mockPackName: Z?.packName || j?.packName
    })
      , ie = x()
      , {toast: re} = f();
    t.useEffect( () => {
        se.some(e => e.error && !g(e.error))
    }
    , [se]);
    const ae = r()
      , oe = async () => {
        J(!1),
        V(!0);
        try {
            const {data: e, isError: t} = await S();
            if (t || !e)
                return re({
                    title: "Error",
                    description: "Failed to load answer keys. Please try again.",
                    variant: "destructive"
                }),
                void V(!1);
            if (!te)
                return re({
                    title: "Error",
                    description: "Test data is missing. Cannot process results.",
                    variant: "destructive"
                }),
                void V(!1);
            const s = z(R, e, te);
            ne({
                answers: R,
                answerKeys: e,
                score: s.bandScore,
                totalDurationSeconds: 60 * w,
                timeLeftSeconds: A
            });
            const n = {
                testId: y || "",
                section: p.READING,
                score: s.bandScore,
                maxScore: 9,
                isCompleted: !0,
                mistakesByQuestionType: s.mistakesByQuestionType,
                mistakesByQuestionNumber: s.mistakesByQuestionNumber,
                mistakesByPart: s.mistakesByPart,
                userAnswers: JSON.stringify(R),
                totalCorrectAnswers: s.totalCorrectAnswers,
                totalIncorrectAnswers: s.totalIncorrectAnswers,
                feedback: JSON.stringify(s)
            }
              , i = await ie.mutateAsync(n);
            if (i?.id) {
                const t = {
                    ...n,
                    id: i.id
                };
                Q(t),
                _(e),
                o && a ? a(t) : T(m.Results)
            }
        } catch (e) {
            re({
                title: "Error",
                description: v(e, "Failed to save test results"),
                variant: "destructive"
            })
        } finally {
            V(!1)
        }
    }
    ;
    t.useEffect( () => {
        te && (k(te),
        "number" != typeof te.duration || isNaN(te.duration) || E(te.duration))
    }
    , [y, te]),
    t.useEffect( () => {
        const e = "FULL" === j?.testType?.toUpperCase();
        if (A <= 0 && N === m.Test)
            return e ? void oe() : void F(0);
        if (N !== m.Test)
            return;
        const t = setInterval( () => {
            F(A - 1)
        }
        , 1e3);
        return () => clearInterval(t)
    }
    , [N, A, j, F]),
    t.useEffect( () => {
        j && "number" == typeof j.duration && !isNaN(j.duration) && N === m.Instructions && F(60 * j.duration)
    }
    , [j, N, F]);
    const le = se.find(e => g(e.error));
    if (le) {
        const t = le.error.proLockedMessage;
        return e.jsx("div", {
            className: "h-screen flex items-center justify-center p-4",
            children: e.jsx(h, {
                isLocked: !0,
                requiredPlan: "STANDARD",
                section: "reading",
                title: "Get Access to Reading Tests",
                description: t || "Get access to IELTS reading tests and improve your reading skills with practice materials.",
                benefits: ["Access reading passages and tests", "Get detailed explanations and answer keys"],
                variant: "card",
                children: e.jsx("div", {})
            })
        })
    }
    if (se.some(e => e.isLoading))
        return e.jsxs("div", {
            className: "flex h-screen items-center justify-center",
            children: [e.jsx("div", {
                className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            }), e.jsx("span", {
                className: "ml-2",
                children: "Loading reading test..."
            })]
        });
    const ce = se.find(e => e.error && !g(e.error));
    if (ce)
        return e.jsxs("div", {
            className: "flex h-screen flex-col items-center justify-center",
            children: [e.jsx("p", {
                className: "text-red-500",
                children: ce.error?.message || "Test not found"
            }), e.jsx("button", {
                className: "mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600",
                onClick: () => ae(-1),
                children: "Go Back"
            })]
        });
    if (!(te && te.part1 && te.part2 && te.part3))
        return e.jsxs("div", {
            className: "flex h-screen flex-col items-center justify-center",
            children: [e.jsx("p", {
                className: "text-red-500",
                children: "Not Found Test Content"
            }), e.jsx("button", {
                className: "mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600",
                onClick: () => ae(-1),
                children: "Go Back"
            })]
        });
    const ue = () => {
        de()
    }
      , de = () => {
        T(N + 1)
    }
      , me = () => {
        J(!0)
    }
      , pe = () => {
        P(),
        ae(-1)
    }
      , xe = () => {
        P(),
        ae(-1)
    }
      , fe = te;
    return e.jsxs(e.Fragment, {
        children: [( () => {
            switch (N) {
            case m.Instructions:
                return e.jsx(H, {
                    onStartTest: ue
                });
            case m.Test:
                return e.jsx(U, {
                    examStore: Y,
                    examContent: fe,
                    onComplete: me,
                    onExit: xe,
                    hideExit: o,
                    isMockExam: o,
                    candidateInfo: ee,
                    onReportIssueClick: o ? void 0 : () => X(!0)
                });
            case m.Results:
                return e.jsx(u, {
                    examStore: Y,
                    onFinish: pe,
                    userTestResult: Y.userTestResult
                });
            default:
                return null
            }
        }
        )(), $ && e.jsx(c, {
            title: "Submit Test",
            description: "Are you sure you want to submit your test? You cannot change your answers after submission.",
            onConfirm: oe,
            onCancel: () => {
                J(!1)
            }
            ,
            confirmText: "Submit"
        }), K && e.jsx(M, {
            title: "Processing Your Test",
            description: "Please wait while we calculate your results..."
        }), e.jsx(G, {
            open: W,
            onOpenChange: X,
            testId: y,
            userTestResultId: Y.userTestResult?.id
        })]
    })
}
  , Y = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: _
}, Symbol.toStringTag, {
    value: "Module"
}));
export {H as R, _ as a, Y as b};
