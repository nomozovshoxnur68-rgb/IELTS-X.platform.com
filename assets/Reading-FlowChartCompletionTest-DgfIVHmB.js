import {j as e} from "./query-DsA5-mxg.js";
import {d as t, Q as n} from "./useSpeakingTests-CMINX9XJ.js";
import {Q as r} from "./QuestionFlagButton-Dxm-MG9l.js";
import {aq as s, aM as i, aN as o} from "./icons-IGaB-7H7.js";
import {a, R as l, b as c} from "./router-gAN6ztYq.js";
const d = (e, t) => ({
    left: `${e}px`,
    top: t - 16 + "px",
    transform: "translateX(-50%)"
})
  , u = ({className: t}) => e.jsxs("svg", {
    viewBox: "0 0 28 24",
    "aria-hidden": "true",
    className: t,
    children: [e.jsx("path", {
        fill: "currentColor",
        d: "M3.5 2.5h21a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H13.3l-6.1 4.1c-.7.5-1.7-.2-1.4-1l1.2-3.1H3.5A2.5 2.5 0 0 1 1 16V5a2.5 2.5 0 0 1 2.5-2.5Z"
    }), e.jsx("circle", {
        cx: "9.2",
        cy: "10.4",
        r: "1.7",
        fill: "white"
    }), e.jsx("circle", {
        cx: "14",
        cy: "10.4",
        r: "1.7",
        fill: "white"
    }), e.jsx("circle", {
        cx: "18.8",
        cy: "10.4",
        r: "1.7",
        fill: "white"
    })]
})
  , h = ({className: t}) => e.jsxs("svg", {
    viewBox: "0 0 28 28",
    "aria-hidden": "true",
    className: t,
    children: [e.jsx("path", {
        fill: "currentColor",
        d: "m17.6 2.7 7.7 7.7-3.5 3.5-7.7-7.7 3.5-3.5Zm-5 5 7.7 7.7-7.3 7.3-5.8-1.9-1.9-5.8 7.3-7.3Zm-8.7 16h15.8v2.1H3.9v-2.1Z"
    }), e.jsx("path", {
        fill: "white",
        d: "m16.2 5.7 1.5-1.5 6.1 6.1-1.5 1.5-6.1-6.1Z",
        opacity: "0.9"
    })]
})
  , f = ({x: t, y: n, children: r, dataAttribute: s, onMouseDown: i}) => e.jsxs("div", {
    [`data-${s}`]: "true",
    className: "fixed z-[10000] flex min-h-[56px] min-w-[144px] items-stretch rounded-[5px] border border-[#7a7a7a] bg-white text-primary shadow-[0_1px_5px_rgba(15,23,42,0.28)]",
    style: d(t, n),
    onMouseDown: i,
    children: [e.jsx("div", {
        className: "relative z-10 flex flex-1 items-stretch overflow-hidden rounded-[4px]",
        children: r
    }), e.jsx("span", {
        className: "absolute -bottom-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[#7a7a7a] bg-white"
    })]
})
  , p = ({icon: t, label: n, iconClassName: r, onClick: s, title: i}) => e.jsxs("button", {
    type: "button",
    className: "relative z-10 flex w-[72px] flex-col items-center justify-center gap-1 border-none bg-transparent px-1.5 py-1.5 text-sm font-medium leading-none text-primary transition-colors hover:bg-[#f4f7fb]",
    onClick: s,
    title: i,
    children: [e.jsx(t, {
        className: `h-5 w-5 ${r}`
    }), e.jsx("span", {
        children: n
    })]
})
  , m = ({x: t, y: n, onHighlight: r, onNote: s}) => e.jsxs(f, {
    x: t,
    y: n,
    dataAttribute: "tooltip",
    onMouseDown: e => e.preventDefault(),
    children: [e.jsx(p, {
        icon: u,
        label: "Note",
        iconClassName: "text-black",
        onClick: s,
        title: "Highlight & Add Note"
    }), e.jsx(p, {
        icon: h,
        label: "Highlight",
        iconClassName: "text-black",
        onClick: r,
        title: "Highlight"
    })]
})
  , g = ({x: t, y: n, hasNote: r, onEditNote: o, onRemove: a}) => e.jsxs(f, {
    x: t,
    y: n,
    dataAttribute: "menu",
    children: [e.jsx(p, {
        icon: s,
        label: "Remove",
        iconClassName: "text-[#dc2626]",
        onClick: a,
        title: "Remove Highlight"
    }), e.jsx(p, {
        icon: i,
        label: r ? "Edit Note" : "Add Note",
        iconClassName: "text-primary",
        onClick: o,
        title: r ? "Edit Note" : "Add Note"
    })]
})
  , x = ({note: t, onNoteChange: n, onSave: r, onCancel: s}) => e.jsxs("div", {
    "data-menu": "true",
    className: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-4 rounded shadow-xl z-[10001] border border-gray-200 dark:border-gray-700 min-w-[300px]",
    children: [e.jsx("div", {
        className: "mb-3 text-sm font-medium text-gray-900 dark:text-gray-100",
        children: t ? "Edit Note" : "Add Note"
    }), e.jsx("textarea", {
        autoFocus: !0,
        value: t,
        onChange: e => n(e.target.value),
        onKeyDown: e => {
            "Enter" !== e.key || e.shiftKey || (e.preventDefault(),
            r()),
            "Escape" === e.key && s()
        }
        ,
        className: "w-full h-24 p-2.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        placeholder: "Type your note here..."
    }), e.jsxs("div", {
        className: "mt-3 flex gap-2 justify-end",
        children: [e.jsx("button", {
            className: "px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 cursor-pointer text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
            onClick: s,
            children: "Cancel"
        }), e.jsx("button", {
            className: "px-4 py-2 bg-blue-500 text-white border-none rounded cursor-pointer text-xs font-medium hover:bg-blue-600 transition-colors",
            onClick: r,
            children: "Save Note"
        })]
    })]
})
  , v = ({regionId: n, text: r, className: s="", as: i="span", italicRanges: o}) => {
    const {highlights: l, addHighlight: c, removeHighlight: d, updateNote: u, clearSelection: h, closeAllMenus: f, registerMenuCloser: p} = t()
      , v = a.useRef(null)
      , b = i
      , [y,w] = a.useState(null)
      , [N,j] = a.useState(null)
      , [C,S] = a.useState(null);
    a.useEffect( () => p( () => {
        w(null),
        S(null)
    }
    ), [p]);
    const E = l.filter(e => e.regionId === n);
    a.useEffect( () => {
        const e = e => {
            if (e.target.closest("[data-tooltip]") || e.target.closest("[data-menu]") || "INPUT" === e.target.tagName || "TEXTAREA" === e.target.tagName || e.target.closest("input") || e.target.closest("textarea"))
                return;
            const t = window.getSelection();
            if (!t || t.isCollapsed)
                return w(null),
                S(null),
                void (N || h());
            const n = t.getRangeAt(0);
            if (!v.current || !v.current.contains(n.commonAncestorContainer))
                return;
            const r = t.toString().trim();
            if (!r)
                return;
            const s = document.createRange();
            s.selectNodeContents(v.current),
            s.setEnd(n.startContainer, n.startOffset);
            const i = s.toString().length
              , o = i + r.length;
            f();
            const a = n.getClientRects();
            if (a.length > 0) {
                const e = a[0];
                w({
                    x: e.left + e.width / 2,
                    y: e.top - 45,
                    selection: {
                        startOffset: i,
                        endOffset: o,
                        text: r
                    }
                })
            }
        }
        ;
        return document.addEventListener("mouseup", e),
        () => document.removeEventListener("mouseup", e)
    }
    , [y]);
    const q = a.useCallback( (e, t) => {
        t.stopPropagation();
        const n = window.getSelection();
        if (n && !n.isCollapsed && n.toString().trim())
            return;
        w(null),
        h();
        const r = t.currentTarget.getBoundingClientRect();
        S({
            id: e.id,
            x: r.left + r.width / 2,
            y: r.top - 45
        })
    }
    , [h])
      , k = a.useCallback( () => {
        y && (c(n, y.selection.startOffset, y.selection.endOffset, y.selection.text),
        h(),
        w(null))
    }
    , [y, n, c, h])
      , D = a.useCallback( () => {
        if (!y)
            return;
        const e = c(n, y.selection.startOffset, y.selection.endOffset, y.selection.text);
        j({
            id: e,
            note: ""
        }),
        w(null)
    }
    , [y, n, c])
      , R = (e, t) => {
        if (e.length !== t.length)
            return !1;
        for (let n = 0; n < e.length; n++)
            if (e[n] !== t[n])
                return !1;
        return !0
    }
    ;
    return a.useEffect( () => {
        const e = e => {
            const t = e.target;
            t.closest("[data-menu]") || t.closest("[data-tooltip]") || "INPUT" === t.tagName || "TEXTAREA" === t.tagName || t.closest("input") || t.closest("textarea") || (S(null),
            N || h())
        }
        ;
        if (C)
            return document.addEventListener("mousedown", e),
            () => document.removeEventListener("mousedown", e)
    }
    , [C, N, h]),
    e.jsxs(e.Fragment, {
        children: [e.jsx(b, {
            ref: v,
            className: `select-text ${s}`,
            children: ( () => {
                const t = [];
                for (let e = 0; e < r.length; e++)
                    t.push({
                        char: r[e],
                        highlightIds: [],
                        italic: !1
                    });
                o && o.forEach( ({start: e, end: n}) => {
                    for (let s = e; s < n && s < r.length; s++)
                        t[s].italic = !0
                }
                ),
                E.forEach(e => {
                    for (let n = e.startOffset; n < e.endOffset && n < r.length; n++)
                        t[n].highlightIds.push(e.id)
                }
                );
                const n = [];
                let s = 0;
                for (; s < t.length; ) {
                    const i = t[s].highlightIds
                      , o = t[s].italic;
                    if (0 === i.length) {
                        let i = s + 1;
                        for (; i < t.length && 0 === t[i].highlightIds.length && t[i].italic === o; )
                            i++;
                        const a = r.substring(s, i);
                        n.push(e.jsx("span", {
                            className: "text-gray-900 dark:text-gray-100",
                            children: o ? e.jsx("em", {
                                children: a
                            }) : a
                        }, `text-${s}`)),
                        s = i
                    } else {
                        let a = s + 1;
                        for (; a < t.length && R(t[a].highlightIds, i) && t[a].italic === o; )
                            a++;
                        const c = l.find(e => e.id === i[i.length - 1]);
                        if (c) {
                            const t = i.length > 1 ? "!bg-[#e601e4] dark:!bg-[#c218c0] text-white dark:text-white" : "!bg-[#820747] text-white dark:text-white"
                              , l = r.substring(s, a);
                            n.push(e.jsxs("span", {
                                "data-highlight": "true",
                                className: `cursor-pointer relative ${t}`,
                                onClick: e => q(c, e),
                                title: c.note || "Click for options",
                                children: [o ? e.jsx("em", {
                                    children: l
                                }) : l, c.note && s === c.startOffset && e.jsx("span", {
                                    className: "inline-block ml-0.5 text-xs align-super cursor-pointer select-none opacity-80",
                                    children: "📝"
                                })]
                            }, `highlight-${s}-${c.id}`))
                        }
                        s = a
                    }
                }
                return n
            }
            )()
        }), y && !N && e.jsx(m, {
            x: y.x,
            y: y.y,
            onHighlight: k,
            onNote: D,
            onClose: () => {
                w(null),
                h()
            }
        }), C && !N && e.jsx(g, {
            x: C.x,
            y: C.y,
            highlightId: C.id,
            hasNote: !!l.find(e => e.id === C.id)?.note,
            onEditNote: () => {
                const e = l.find(e => e.id === C.id);
                e && (j({
                    id: e.id,
                    note: e.note || ""
                }),
                S(null))
            }
            ,
            onRemove: () => {
                d(C.id),
                S(null)
            }
            ,
            onClose: () => S(null)
        }), N && e.jsx(x, {
            note: N.note,
            onNoteChange: e => j({
                ...N,
                note: e
            }),
            onSave: () => {
                u(N.id, N.note),
                j(null),
                h()
            }
            ,
            onCancel: () => {
                j(null),
                h()
            }
        })]
    })
}
  , b = {
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
  , y = ({questionGroup: t, examStore: s, onAnswerChange: i= () => {}
}) => {
    const {answers: o={}, activeQuestionId: a, setAnswer: l, setActiveQuestion: c, toggleQuestionFlag: d, flaggedQuestions: u={}, section: h} = s
      , f = t.content
      , p = t.type;
    return e.jsxs("div", {
        className: "space-y-4",
        children: [e.jsx(n, {
            questionGroup: t,
            showContentTitle: !1
        }), f.title && e.jsx("div", {
            className: "mb-6 text-center",
            children: e.jsx("h4", {
                className: "font-bold",
                children: e.jsx(v, {
                    regionId: `multiple-choice-title-${t.id}`,
                    text: f.title,
                    as: "span"
                })
            })
        }), e.jsx("div", {
            className: "flex flex-col gap-2",
            children: f.questions.map(t => {
                const n = String(t.questionNumber)
                  , s = a === n
                  , h = Boolean(u[n])
                  , f = b[p] ?? t.options;
                return e.jsxs("div", {
                    id: `question-${t.questionNumber}`,
                    className: "py-2 gap-2",
                    children: [e.jsxs("div", {
                        className: "flex flex-row gap-1 items-center justify-between w-full",
                        children: [e.jsxs("div", {
                            className: "flex flex-row gap-2 items-center flex-1",
                            children: [e.jsx("div", {
                                className: "font-semibold justify-items-center rounded-sm cursor-pointer " + (s ? "border-2 border-blue-500" : "border-2 border-transparent"),
                                onClick: () => (e => {
                                    window.getSelection()?.toString() || c?.(e)
                                }
                                )(n),
                                children: e.jsx("p", {
                                    className: "mx-1",
                                    children: `${t.questionNumber}`
                                })
                            }), e.jsx("div", {
                                className: "flex-1",
                                onMouseDown: e => e.stopPropagation(),
                                children: e.jsx(v, {
                                    regionId: `multiple-choice-${t.questionNumber}`,
                                    text: t.text,
                                    as: "span"
                                })
                            })]
                        }), d && e.jsx(r, {
                            questionId: n,
                            isFlagged: h,
                            isActive: s,
                            onClick: e => {
                                e.preventDefault(),
                                e.stopPropagation(),
                                d(n)
                            }
                        })]
                    }), e.jsx("div", {
                        className: "flex flex-col py-3 space-y-1",
                        children: f.map(r => {
                            const s = r.id
                              , a = o[n] === s;
                            return e.jsxs("label", {
                                className: "flex items-center p-2 rounded-sm cursor-pointer\n                        " + (a ? "bg-blue-100" : "dark:hover:bg-blue-100 hover:bg-gray-100"),
                                children: [e.jsx("input", {
                                    type: "radio",
                                    name: `question${t.questionNumber}`,
                                    checked: a,
                                    value: s,
                                    className: "w-4 h-4 mr-2 text-blue-600 focus:ring-0 focus:ring-offset-0 flex-shrink-0",
                                    onChange: e => ( (e, t, n) => {
                                        n.stopPropagation(),
                                        setTimeout( () => {
                                            c?.(e),
                                            i(e, t),
                                            l?.(e, t)
                                        }
                                        , 0)
                                    }
                                    )(n, e.target.value, e)
                                }), e.jsx("div", {
                                    className: "flex-1 min-w-0",
                                    onMouseDown: e => e.stopPropagation(),
                                    children: e.jsx(v, {
                                        regionId: `multiple-choice-${t.questionNumber}-option-${r.id}`,
                                        text: r.text,
                                        as: "span"
                                    })
                                })]
                            }, r.id)
                        }
                        )
                    })]
                }, t.questionNumber)
            }
            )
        })]
    })
}
  , w = ({questionGroup: t, examStore: s, onAnswerChange: i= () => {}
}) => {
    const {answers: o={}, activeQuestionId: a, setAnswer: l, setActiveQuestion: c, toggleQuestionFlag: d, flaggedQuestions: u={}, section: h} = s
      , f = t.content
      , p = f.answersToChoose;
    return e.jsxs("div", {
        className: "space-y-4",
        children: [e.jsx(n, {
            questionGroup: t
        }), e.jsx("div", {
            className: "flex flex-col gap-2",
            children: f.questions.map(n => {
                const s = n.questionNumbers.join("-")
                  , h = a === s
                  , f = Boolean(u[s]);
                return e.jsxs("div", {
                    id: `question-${s}`,
                    className: "py-2 gap-2",
                    children: [e.jsxs("div", {
                        className: "flex flex-row gap-1 items-center justify-between w-full",
                        children: [e.jsxs("div", {
                            className: "flex flex-row gap-2 items-center flex-1",
                            children: [e.jsx("div", {
                                className: "font-semibold justify-items-center rounded-sm " + (h ? "border-2 border-blue-500" : "border-2 border-transparent"),
                                onClick: () => c?.(s),
                                children: e.jsx("p", {
                                    className: "mx-1",
                                    children: s
                                })
                            }), e.jsx("div", {
                                className: "flex-1",
                                children: e.jsx(v, {
                                    regionId: `multiple-choice-many-${s}`,
                                    text: n.text,
                                    as: "span"
                                })
                            })]
                        }), d && e.jsx(r, {
                            questionId: s,
                            isFlagged: f,
                            isActive: h,
                            onClick: e => {
                                e.preventDefault(),
                                e.stopPropagation(),
                                d(s)
                            }
                        })]
                    }), e.jsx("div", {
                        className: "flex flex-col py-3 space-y-1",
                        children: n.options.map( (n, r) => {
                            const a = n.id
                              , d = o[s]?.includes(a) || !1;
                            return e.jsx("div", {
                                className: "flex items-center",
                                children: e.jsxs("label", {
                                    className: "flex items-center p-2 rounded-sm cursor-pointer w-full\n                          " + (d ? "bg-blue-100" : "dark:hover:bg-blue-100 hover:bg-gray-100"),
                                    children: [e.jsx("input", {
                                        type: "checkbox",
                                        name: `question-${s}`,
                                        value: a,
                                        checked: d,
                                        className: "w-4 h-4 mr-2 text-blue-600 focus:ring-0 focus:ring-offset-0 flex-shrink-0",
                                        onChange: e => {
                                            c?.(s);
                                            let t = o[s] || "";
                                            const n = e.target.value;
                                            e.target.checked ? t.length < p && (t = (t + n).split("").sort().join("")) : t = t.replace(n, ""),
                                            i(s, t),
                                            l?.(s, t)
                                        }
                                    }), e.jsx("div", {
                                        className: "flex-1 min-w-0",
                                        children: e.jsx(v, {
                                            regionId: `multiple-choice-many-${t.id}-${s}-option-${r}-${n.id}`,
                                            text: n.text,
                                            as: "span"
                                        })
                                    })]
                                })
                            }, `${s}-${n.id}`)
                        }
                        )
                    })]
                }, s)
            }
            )
        })]
    })
}
  , N = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement;
function j(e) {
    const t = Object.prototype.toString.call(e);
    return "[object Window]" === t || "[object global]" === t
}
function C(e) {
    return "nodeType"in e
}
function S(e) {
    var t, n;
    return e ? j(e) ? e : C(e) && null != (t = null == (n = e.ownerDocument) ? void 0 : n.defaultView) ? t : window : window
}
function E(e) {
    const {Document: t} = S(e);
    return e instanceof t
}
function q(e) {
    return !j(e) && e instanceof S(e).HTMLElement
}
function k(e) {
    return e instanceof S(e).SVGElement
}
function D(e) {
    return e ? j(e) ? e.document : C(e) ? E(e) ? e : q(e) || k(e) ? e.ownerDocument : document : document : document
}
const R = N ? a.useLayoutEffect : a.useEffect;
function I(e) {
    const t = a.useRef(e);
    return R( () => {
        t.current = e
    }
    ),
    a.useCallback(function() {
        for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
            n[r] = arguments[r];
        return null == t.current ? void 0 : t.current(...n)
    }, [])
}
function T(e, t) {
    void 0 === t && (t = [e]);
    const n = a.useRef(e);
    return R( () => {
        n.current !== e && (n.current = e)
    }
    , t),
    n
}
function $(e, t) {
    const n = a.useRef();
    return a.useMemo( () => {
        const t = e(n.current);
        return n.current = t,
        t
    }
    , [...t])
}
function A(e) {
    const t = I(e)
      , n = a.useRef(null)
      , r = a.useCallback(e => {
        e !== n.current && (null == t || t(e, n.current)),
        n.current = e
    }
    , []);
    return [n, r]
}
function O(e) {
    const t = a.useRef();
    return a.useEffect( () => {
        t.current = e
    }
    , [e]),
    t.current
}
let M = {};
function L(e, t) {
    return a.useMemo( () => {
        if (t)
            return t;
        const n = null == M[e] ? 0 : M[e] + 1;
        return M[e] = n,
        e + "-" + n
    }
    , [e, t])
}
function Q(e) {
    return function(t) {
        for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++)
            r[s - 1] = arguments[s];
        return r.reduce( (t, n) => {
            const r = Object.entries(n);
            for (const [s,i] of r) {
                const n = t[s];
                null != n && (t[s] = n + e * i)
            }
            return t
        }
        , {
            ...t
        })
    }
}
const F = Q(1)
  , P = Q(-1);
function B(e) {
    if (!e)
        return !1;
    const {KeyboardEvent: t} = S(e.target);
    return t && e instanceof t
}
function G(e) {
    if (function(e) {
        if (!e)
            return !1;
        const {TouchEvent: t} = S(e.target);
        return t && e instanceof t
    }(e)) {
        if (e.touches && e.touches.length) {
            const {clientX: t, clientY: n} = e.touches[0];
            return {
                x: t,
                y: n
            }
        }
        if (e.changedTouches && e.changedTouches.length) {
            const {clientX: t, clientY: n} = e.changedTouches[0];
            return {
                x: t,
                y: n
            }
        }
    }
    return function(e) {
        return "clientX"in e && "clientY"in e
    }(e) ? {
        x: e.clientX,
        y: e.clientY
    } : null
}
const z = Object.freeze({
    Translate: {
        toString(e) {
            if (!e)
                return;
            const {x: t, y: n} = e;
            return "translate3d(" + (t ? Math.round(t) : 0) + "px, " + (n ? Math.round(n) : 0) + "px, 0)"
        }
    },
    Scale: {
        toString(e) {
            if (!e)
                return;
            const {scaleX: t, scaleY: n} = e;
            return "scaleX(" + t + ") scaleY(" + n + ")"
        }
    },
    Transform: {
        toString(e) {
            if (e)
                return [z.Translate.toString(e), z.Scale.toString(e)].join(" ")
        }
    },
    Transition: {
        toString(e) {
            let {property: t, duration: n, easing: r} = e;
            return t + " " + n + "ms " + r
        }
    }
})
  , H = "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";
function W(e) {
    return e.matches(H) ? e : e.querySelector(H)
}
const U = {
    display: "none"
};
function V(e) {
    let {id: t, value: n} = e;
    return l.createElement("div", {
        id: t,
        style: U
    }, n)
}
function X(e) {
    let {id: t, announcement: n, ariaLiveType: r="assertive"} = e;
    return l.createElement("div", {
        id: t,
        style: {
            position: "fixed",
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            margin: -1,
            border: 0,
            padding: 0,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            clipPath: "inset(100%)",
            whiteSpace: "nowrap"
        },
        role: "status",
        "aria-live": r,
        "aria-atomic": !0
    }, n)
}
const Y = a.createContext(null);
const K = {
    draggable: "\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  "
}
  , _ = {
    onDragStart(e) {
        let {active: t} = e;
        return "Picked up draggable item " + t.id + "."
    },
    onDragOver(e) {
        let {active: t, over: n} = e;
        return n ? "Draggable item " + t.id + " was moved over droppable area " + n.id + "." : "Draggable item " + t.id + " is no longer over a droppable area."
    },
    onDragEnd(e) {
        let {active: t, over: n} = e;
        return n ? "Draggable item " + t.id + " was dropped over droppable area " + n.id : "Draggable item " + t.id + " was dropped."
    },
    onDragCancel(e) {
        let {active: t} = e;
        return "Dragging was cancelled. Draggable item " + t.id + " was dropped."
    }
};
function J(e) {
    let {announcements: t=_, container: n, hiddenTextDescribedById: r, screenReaderInstructions: s=K} = e;
    const {announce: i, announcement: o} = function() {
        const [e,t] = a.useState("");
        return {
            announce: a.useCallback(e => {
                null != e && t(e)
            }
            , []),
            announcement: e
        }
    }()
      , d = L("DndLiveRegion")
      , [u,h] = a.useState(!1);
    if (a.useEffect( () => {
        h(!0)
    }
    , []),
    function(e) {
        const t = a.useContext(Y);
        a.useEffect( () => {
            if (!t)
                throw new Error("useDndMonitor must be used within a children of <DndContext>");
            return t(e)
        }
        , [e, t])
    }(a.useMemo( () => ({
        onDragStart(e) {
            let {active: n} = e;
            i(t.onDragStart({
                active: n
            }))
        },
        onDragMove(e) {
            let {active: n, over: r} = e;
            t.onDragMove && i(t.onDragMove({
                active: n,
                over: r
            }))
        },
        onDragOver(e) {
            let {active: n, over: r} = e;
            i(t.onDragOver({
                active: n,
                over: r
            }))
        },
        onDragEnd(e) {
            let {active: n, over: r} = e;
            i(t.onDragEnd({
                active: n,
                over: r
            }))
        },
        onDragCancel(e) {
            let {active: n, over: r} = e;
            i(t.onDragCancel({
                active: n,
                over: r
            }))
        }
    }), [i, t])),
    !u)
        return null;
    const f = l.createElement(l.Fragment, null, l.createElement(V, {
        id: r,
        value: s.draggable
    }), l.createElement(X, {
        id: d,
        announcement: o
    }));
    return n ? c.createPortal(f, n) : f
}
var Z, ee;
function te() {}
function ne(e, t) {
    return a.useMemo( () => ({
        sensor: e,
        options: null != t ? t : {}
    }), [e, t])
}
function re() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
        t[n] = arguments[n];
    return a.useMemo( () => [...t].filter(e => null != e), [...t])
}
(ee = Z || (Z = {})).DragStart = "dragStart",
ee.DragMove = "dragMove",
ee.DragEnd = "dragEnd",
ee.DragCancel = "dragCancel",
ee.DragOver = "dragOver",
ee.RegisterDroppable = "registerDroppable",
ee.SetDroppableDisabled = "setDroppableDisabled",
ee.UnregisterDroppable = "unregisterDroppable";
const se = Object.freeze({
    x: 0,
    y: 0
});
function ie(e, t) {
    return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2))
}
function oe(e, t) {
    const n = G(e);
    if (!n)
        return "0 0";
    return (n.x - t.left) / t.width * 100 + "% " + (n.y - t.top) / t.height * 100 + "%"
}
function ae(e, t) {
    let {data: {value: n}} = e
      , {data: {value: r}} = t;
    return n - r
}
function le(e, t) {
    let {data: {value: n}} = e
      , {data: {value: r}} = t;
    return r - n
}
function ce(e) {
    let {left: t, top: n, height: r, width: s} = e;
    return [{
        x: t,
        y: n
    }, {
        x: t + s,
        y: n
    }, {
        x: t,
        y: n + r
    }, {
        x: t + s,
        y: n + r
    }]
}
function de(e, t) {
    if (!e || 0 === e.length)
        return null;
    const [n] = e;
    return n[t]
}
function ue(e, t, n) {
    return void 0 === t && (t = e.left),
    void 0 === n && (n = e.top),
    {
        x: t + .5 * e.width,
        y: n + .5 * e.height
    }
}
const he = e => {
    let {collisionRect: t, droppableRects: n, droppableContainers: r} = e;
    const s = ue(t, t.left, t.top)
      , i = [];
    for (const o of r) {
        const {id: e} = o
          , t = n.get(e);
        if (t) {
            const n = ie(ue(t), s);
            i.push({
                id: e,
                data: {
                    droppableContainer: o,
                    value: n
                }
            })
        }
    }
    return i.sort(ae)
}
;
function fe(e, t) {
    const n = Math.max(t.top, e.top)
      , r = Math.max(t.left, e.left)
      , s = Math.min(t.left + t.width, e.left + e.width)
      , i = Math.min(t.top + t.height, e.top + e.height)
      , o = s - r
      , a = i - n;
    if (r < s && n < i) {
        const n = t.width * t.height
          , r = e.width * e.height
          , s = o * a;
        return Number((s / (n + r - s)).toFixed(4))
    }
    return 0
}
const pe = e => {
    let {collisionRect: t, droppableRects: n, droppableContainers: r} = e;
    const s = [];
    for (const i of r) {
        const {id: e} = i
          , r = n.get(e);
        if (r) {
            const n = fe(r, t);
            n > 0 && s.push({
                id: e,
                data: {
                    droppableContainer: i,
                    value: n
                }
            })
        }
    }
    return s.sort(le)
}
;
function me(e, t) {
    const {top: n, left: r, bottom: s, right: i} = t;
    return n <= e.y && e.y <= s && r <= e.x && e.x <= i
}
const ge = e => {
    let {droppableContainers: t, droppableRects: n, pointerCoordinates: r} = e;
    if (!r)
        return [];
    const s = [];
    for (const i of t) {
        const {id: e} = i
          , t = n.get(e);
        if (t && me(r, t)) {
            const n = ce(t).reduce( (e, t) => e + ie(r, t), 0)
              , o = Number((n / 4).toFixed(4));
            s.push({
                id: e,
                data: {
                    droppableContainer: i,
                    value: o
                }
            })
        }
    }
    return s.sort(ae)
}
;
function xe(e, t) {
    return e && t ? {
        x: e.left - t.left,
        y: e.top - t.top
    } : se
}
function ve(e) {
    return function(t) {
        for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++)
            r[s - 1] = arguments[s];
        return r.reduce( (t, n) => ({
            ...t,
            top: t.top + e * n.y,
            bottom: t.bottom + e * n.y,
            left: t.left + e * n.x,
            right: t.right + e * n.x
        }), {
            ...t
        })
    }
}
const be = ve(1);
function ye(e) {
    if (e.startsWith("matrix3d(")) {
        const t = e.slice(9, -1).split(/, /);
        return {
            x: +t[12],
            y: +t[13],
            scaleX: +t[0],
            scaleY: +t[5]
        }
    }
    if (e.startsWith("matrix(")) {
        const t = e.slice(7, -1).split(/, /);
        return {
            x: +t[4],
            y: +t[5],
            scaleX: +t[0],
            scaleY: +t[3]
        }
    }
    return null
}
const we = {
    ignoreTransform: !1
};
function Ne(e, t) {
    void 0 === t && (t = we);
    let n = e.getBoundingClientRect();
    if (t.ignoreTransform) {
        const {transform: t, transformOrigin: r} = S(e).getComputedStyle(e);
        t && (n = function(e, t, n) {
            const r = ye(t);
            if (!r)
                return e;
            const {scaleX: s, scaleY: i, x: o, y: a} = r
              , l = e.left - o - (1 - s) * parseFloat(n)
              , c = e.top - a - (1 - i) * parseFloat(n.slice(n.indexOf(" ") + 1))
              , d = s ? e.width / s : e.width
              , u = i ? e.height / i : e.height;
            return {
                width: d,
                height: u,
                top: c,
                right: l + d,
                bottom: c + u,
                left: l
            }
        }(n, t, r))
    }
    const {top: r, left: s, width: i, height: o, bottom: a, right: l} = n;
    return {
        top: r,
        left: s,
        width: i,
        height: o,
        bottom: a,
        right: l
    }
}
function je(e) {
    return Ne(e, {
        ignoreTransform: !0
    })
}
function Ce(e, t) {
    const n = [];
    return e ? function r(s) {
        if (null != t && n.length >= t)
            return n;
        if (!s)
            return n;
        if (E(s) && null != s.scrollingElement && !n.includes(s.scrollingElement))
            return n.push(s.scrollingElement),
            n;
        if (!q(s) || k(s))
            return n;
        if (n.includes(s))
            return n;
        const i = S(e).getComputedStyle(s);
        return s !== e && function(e, t) {
            void 0 === t && (t = S(e).getComputedStyle(e));
            const n = /(auto|scroll|overlay)/;
            return ["overflow", "overflowX", "overflowY"].some(e => {
                const r = t[e];
                return "string" == typeof r && n.test(r)
            }
            )
        }(s, i) && n.push(s),
        function(e, t) {
            return void 0 === t && (t = S(e).getComputedStyle(e)),
            "fixed" === t.position
        }(s, i) ? n : r(s.parentNode)
    }(e) : n
}
function Se(e) {
    const [t] = Ce(e, 1);
    return null != t ? t : null
}
function Ee(e) {
    return N && e ? j(e) ? e : C(e) ? E(e) || e === D(e).scrollingElement ? window : q(e) ? e : null : null : null
}
function qe(e) {
    return j(e) ? e.scrollX : e.scrollLeft
}
function ke(e) {
    return j(e) ? e.scrollY : e.scrollTop
}
function De(e) {
    return {
        x: qe(e),
        y: ke(e)
    }
}
var Re, Ie;
function Te(e) {
    return !(!N || !e) && e === document.scrollingElement
}
function $e(e) {
    const t = {
        x: 0,
        y: 0
    }
      , n = Te(e) ? {
        height: window.innerHeight,
        width: window.innerWidth
    } : {
        height: e.clientHeight,
        width: e.clientWidth
    }
      , r = {
        x: e.scrollWidth - n.width,
        y: e.scrollHeight - n.height
    };
    return {
        isTop: e.scrollTop <= t.y,
        isLeft: e.scrollLeft <= t.x,
        isBottom: e.scrollTop >= r.y,
        isRight: e.scrollLeft >= r.x,
        maxScroll: r,
        minScroll: t
    }
}
(Ie = Re || (Re = {}))[Ie.Forward = 1] = "Forward",
Ie[Ie.Backward = -1] = "Backward";
const Ae = {
    x: .2,
    y: .2
};
function Oe(e, t, n, r, s) {
    let {top: i, left: o, right: a, bottom: l} = n;
    void 0 === r && (r = 10),
    void 0 === s && (s = Ae);
    const {isTop: c, isBottom: d, isLeft: u, isRight: h} = $e(e)
      , f = {
        x: 0,
        y: 0
    }
      , p = {
        x: 0,
        y: 0
    }
      , m = t.height * s.y
      , g = t.width * s.x;
    return !c && i <= t.top + m ? (f.y = Re.Backward,
    p.y = r * Math.abs((t.top + m - i) / m)) : !d && l >= t.bottom - m && (f.y = Re.Forward,
    p.y = r * Math.abs((t.bottom - m - l) / m)),
    !h && a >= t.right - g ? (f.x = Re.Forward,
    p.x = r * Math.abs((t.right - g - a) / g)) : !u && o <= t.left + g && (f.x = Re.Backward,
    p.x = r * Math.abs((t.left + g - o) / g)),
    {
        direction: f,
        speed: p
    }
}
function Me(e) {
    if (e === document.scrollingElement) {
        const {innerWidth: e, innerHeight: t} = window;
        return {
            top: 0,
            left: 0,
            right: e,
            bottom: t,
            width: e,
            height: t
        }
    }
    const {top: t, left: n, right: r, bottom: s} = e.getBoundingClientRect();
    return {
        top: t,
        left: n,
        right: r,
        bottom: s,
        width: e.clientWidth,
        height: e.clientHeight
    }
}
function Le(e) {
    return e.reduce( (e, t) => F(e, De(t)), se)
}
function Qe(e, t) {
    if (void 0 === t && (t = Ne),
    !e)
        return;
    const {top: n, left: r, bottom: s, right: i} = t(e);
    Se(e) && (s <= 0 || i <= 0 || n >= window.innerHeight || r >= window.innerWidth) && e.scrollIntoView({
        block: "center",
        inline: "center"
    })
}
const Fe = [["x", ["left", "right"], function(e) {
    return e.reduce( (e, t) => e + qe(t), 0)
}
], ["y", ["top", "bottom"], function(e) {
    return e.reduce( (e, t) => e + ke(t), 0)
}
]];
class Pe {
    constructor(e, t) {
        this.rect = void 0,
        this.width = void 0,
        this.height = void 0,
        this.top = void 0,
        this.bottom = void 0,
        this.right = void 0,
        this.left = void 0;
        const n = Ce(t)
          , r = Le(n);
        this.rect = {
            ...e
        },
        this.width = e.width,
        this.height = e.height;
        for (const [s,i,o] of Fe)
            for (const e of i)
                Object.defineProperty(this, e, {
                    get: () => {
                        const t = o(n)
                          , i = r[s] - t;
                        return this.rect[e] + i
                    }
                    ,
                    enumerable: !0
                });
        Object.defineProperty(this, "rect", {
            enumerable: !1
        })
    }
}
class Be {
    constructor(e) {
        this.target = void 0,
        this.listeners = [],
        this.removeAll = () => {
            this.listeners.forEach(e => {
                var t;
                return null == (t = this.target) ? void 0 : t.removeEventListener(...e)
            }
            )
        }
        ,
        this.target = e
    }
    add(e, t, n) {
        var r;
        null == (r = this.target) || r.addEventListener(e, t, n),
        this.listeners.push([e, t, n])
    }
}
function Ge(e, t) {
    const n = Math.abs(e.x)
      , r = Math.abs(e.y);
    return "number" == typeof t ? Math.sqrt(n ** 2 + r ** 2) > t : "x"in t && "y"in t ? n > t.x && r > t.y : "x"in t ? n > t.x : "y"in t && r > t.y
}
var ze, He, We, Ue;
function Ve(e) {
    e.preventDefault()
}
function Xe(e) {
    e.stopPropagation()
}
(He = ze || (ze = {})).Click = "click",
He.DragStart = "dragstart",
He.Keydown = "keydown",
He.ContextMenu = "contextmenu",
He.Resize = "resize",
He.SelectionChange = "selectionchange",
He.VisibilityChange = "visibilitychange",
(Ue = We || (We = {})).Space = "Space",
Ue.Down = "ArrowDown",
Ue.Right = "ArrowRight",
Ue.Left = "ArrowLeft",
Ue.Up = "ArrowUp",
Ue.Esc = "Escape",
Ue.Enter = "Enter",
Ue.Tab = "Tab";
const Ye = {
    start: [We.Space, We.Enter],
    cancel: [We.Esc],
    end: [We.Space, We.Enter, We.Tab]
}
  , Ke = (e, t) => {
    let {currentCoordinates: n} = t;
    switch (e.code) {
    case We.Right:
        return {
            ...n,
            x: n.x + 25
        };
    case We.Left:
        return {
            ...n,
            x: n.x - 25
        };
    case We.Down:
        return {
            ...n,
            y: n.y + 25
        };
    case We.Up:
        return {
            ...n,
            y: n.y - 25
        }
    }
}
;
class _e {
    constructor(e) {
        this.props = void 0,
        this.autoScrollEnabled = !1,
        this.referenceCoordinates = void 0,
        this.listeners = void 0,
        this.windowListeners = void 0,
        this.props = e;
        const {event: {target: t}} = e;
        this.props = e,
        this.listeners = new Be(D(t)),
        this.windowListeners = new Be(S(t)),
        this.handleKeyDown = this.handleKeyDown.bind(this),
        this.handleCancel = this.handleCancel.bind(this),
        this.attach()
    }
    attach() {
        this.handleStart(),
        this.windowListeners.add(ze.Resize, this.handleCancel),
        this.windowListeners.add(ze.VisibilityChange, this.handleCancel),
        setTimeout( () => this.listeners.add(ze.Keydown, this.handleKeyDown))
    }
    handleStart() {
        const {activeNode: e, onStart: t} = this.props
          , n = e.node.current;
        n && Qe(n),
        t(se)
    }
    handleKeyDown(e) {
        if (B(e)) {
            const {active: t, context: n, options: r} = this.props
              , {keyboardCodes: s=Ye, coordinateGetter: i=Ke, scrollBehavior: o="smooth"} = r
              , {code: a} = e;
            if (s.end.includes(a))
                return void this.handleEnd(e);
            if (s.cancel.includes(a))
                return void this.handleCancel(e);
            const {collisionRect: l} = n.current
              , c = l ? {
                x: l.left,
                y: l.top
            } : se;
            this.referenceCoordinates || (this.referenceCoordinates = c);
            const d = i(e, {
                active: t,
                context: n.current,
                currentCoordinates: c
            });
            if (d) {
                const t = P(d, c)
                  , r = {
                    x: 0,
                    y: 0
                }
                  , {scrollableAncestors: s} = n.current;
                for (const n of s) {
                    const s = e.code
                      , {isTop: i, isRight: a, isLeft: l, isBottom: c, maxScroll: u, minScroll: h} = $e(n)
                      , f = Me(n)
                      , p = {
                        x: Math.min(s === We.Right ? f.right - f.width / 2 : f.right, Math.max(s === We.Right ? f.left : f.left + f.width / 2, d.x)),
                        y: Math.min(s === We.Down ? f.bottom - f.height / 2 : f.bottom, Math.max(s === We.Down ? f.top : f.top + f.height / 2, d.y))
                    }
                      , m = s === We.Right && !a || s === We.Left && !l
                      , g = s === We.Down && !c || s === We.Up && !i;
                    if (m && p.x !== d.x) {
                        const e = n.scrollLeft + t.x
                          , i = s === We.Right && e <= u.x || s === We.Left && e >= h.x;
                        if (i && !t.y)
                            return void n.scrollTo({
                                left: e,
                                behavior: o
                            });
                        r.x = i ? n.scrollLeft - e : s === We.Right ? n.scrollLeft - u.x : n.scrollLeft - h.x,
                        r.x && n.scrollBy({
                            left: -r.x,
                            behavior: o
                        });
                        break
                    }
                    if (g && p.y !== d.y) {
                        const e = n.scrollTop + t.y
                          , i = s === We.Down && e <= u.y || s === We.Up && e >= h.y;
                        if (i && !t.x)
                            return void n.scrollTo({
                                top: e,
                                behavior: o
                            });
                        r.y = i ? n.scrollTop - e : s === We.Down ? n.scrollTop - u.y : n.scrollTop - h.y,
                        r.y && n.scrollBy({
                            top: -r.y,
                            behavior: o
                        });
                        break
                    }
                }
                this.handleMove(e, F(P(d, this.referenceCoordinates), r))
            }
        }
    }
    handleMove(e, t) {
        const {onMove: n} = this.props;
        e.preventDefault(),
        n(t)
    }
    handleEnd(e) {
        const {onEnd: t} = this.props;
        e.preventDefault(),
        this.detach(),
        t()
    }
    handleCancel(e) {
        const {onCancel: t} = this.props;
        e.preventDefault(),
        this.detach(),
        t()
    }
    detach() {
        this.listeners.removeAll(),
        this.windowListeners.removeAll()
    }
}
function Je(e) {
    return Boolean(e && "distance"in e)
}
function Ze(e) {
    return Boolean(e && "delay"in e)
}
_e.activators = [{
    eventName: "onKeyDown",
    handler: (e, t, n) => {
        let {keyboardCodes: r=Ye, onActivation: s} = t
          , {active: i} = n;
        const {code: o} = e.nativeEvent;
        if (r.start.includes(o)) {
            const t = i.activatorNode.current;
            return (!t || e.target === t) && (e.preventDefault(),
            null == s || s({
                event: e.nativeEvent
            }),
            !0)
        }
        return !1
    }
}];
class et {
    constructor(e, t, n) {
        var r;
        void 0 === n && (n = function(e) {
            const {EventTarget: t} = S(e);
            return e instanceof t ? e : D(e)
        }(e.event.target)),
        this.props = void 0,
        this.events = void 0,
        this.autoScrollEnabled = !0,
        this.document = void 0,
        this.activated = !1,
        this.initialCoordinates = void 0,
        this.timeoutId = null,
        this.listeners = void 0,
        this.documentListeners = void 0,
        this.windowListeners = void 0,
        this.props = e,
        this.events = t;
        const {event: s} = e
          , {target: i} = s;
        this.props = e,
        this.events = t,
        this.document = D(i),
        this.documentListeners = new Be(this.document),
        this.listeners = new Be(n),
        this.windowListeners = new Be(S(i)),
        this.initialCoordinates = null != (r = G(s)) ? r : se,
        this.handleStart = this.handleStart.bind(this),
        this.handleMove = this.handleMove.bind(this),
        this.handleEnd = this.handleEnd.bind(this),
        this.handleCancel = this.handleCancel.bind(this),
        this.handleKeydown = this.handleKeydown.bind(this),
        this.removeTextSelection = this.removeTextSelection.bind(this),
        this.attach()
    }
    attach() {
        const {events: e, props: {options: {activationConstraint: t, bypassActivationConstraint: n}}} = this;
        if (this.listeners.add(e.move.name, this.handleMove, {
            passive: !1
        }),
        this.listeners.add(e.end.name, this.handleEnd),
        e.cancel && this.listeners.add(e.cancel.name, this.handleCancel),
        this.windowListeners.add(ze.Resize, this.handleCancel),
        this.windowListeners.add(ze.DragStart, Ve),
        this.windowListeners.add(ze.VisibilityChange, this.handleCancel),
        this.windowListeners.add(ze.ContextMenu, Ve),
        this.documentListeners.add(ze.Keydown, this.handleKeydown),
        t) {
            if (null != n && n({
                event: this.props.event,
                activeNode: this.props.activeNode,
                options: this.props.options
            }))
                return this.handleStart();
            if (Ze(t))
                return this.timeoutId = setTimeout(this.handleStart, t.delay),
                void this.handlePending(t);
            if (Je(t))
                return void this.handlePending(t)
        }
        this.handleStart()
    }
    detach() {
        this.listeners.removeAll(),
        this.windowListeners.removeAll(),
        setTimeout(this.documentListeners.removeAll, 50),
        null !== this.timeoutId && (clearTimeout(this.timeoutId),
        this.timeoutId = null)
    }
    handlePending(e, t) {
        const {active: n, onPending: r} = this.props;
        r(n, e, this.initialCoordinates, t)
    }
    handleStart() {
        const {initialCoordinates: e} = this
          , {onStart: t} = this.props;
        e && (this.activated = !0,
        this.documentListeners.add(ze.Click, Xe, {
            capture: !0
        }),
        this.removeTextSelection(),
        this.documentListeners.add(ze.SelectionChange, this.removeTextSelection),
        t(e))
    }
    handleMove(e) {
        var t;
        const {activated: n, initialCoordinates: r, props: s} = this
          , {onMove: i, options: {activationConstraint: o}} = s;
        if (!r)
            return;
        const a = null != (t = G(e)) ? t : se
          , l = P(r, a);
        if (!n && o) {
            if (Je(o)) {
                if (null != o.tolerance && Ge(l, o.tolerance))
                    return this.handleCancel();
                if (Ge(l, o.distance))
                    return this.handleStart()
            }
            return Ze(o) && Ge(l, o.tolerance) ? this.handleCancel() : void this.handlePending(o, l)
        }
        e.cancelable && e.preventDefault(),
        i(a)
    }
    handleEnd() {
        const {onAbort: e, onEnd: t} = this.props;
        this.detach(),
        this.activated || e(this.props.active),
        t()
    }
    handleCancel() {
        const {onAbort: e, onCancel: t} = this.props;
        this.detach(),
        this.activated || e(this.props.active),
        t()
    }
    handleKeydown(e) {
        e.code === We.Esc && this.handleCancel()
    }
    removeTextSelection() {
        var e;
        null == (e = this.document.getSelection()) || e.removeAllRanges()
    }
}
const tt = {
    cancel: {
        name: "pointercancel"
    },
    move: {
        name: "pointermove"
    },
    end: {
        name: "pointerup"
    }
};
class nt extends et {
    constructor(e) {
        const {event: t} = e
          , n = D(t.target);
        super(e, tt, n)
    }
}
nt.activators = [{
    eventName: "onPointerDown",
    handler: (e, t) => {
        let {nativeEvent: n} = e
          , {onActivation: r} = t;
        return !(!n.isPrimary || 0 !== n.button) && (null == r || r({
            event: n
        }),
        !0)
    }
}];
const rt = {
    move: {
        name: "mousemove"
    },
    end: {
        name: "mouseup"
    }
};
var st, it;
(it = st || (st = {}))[it.RightClick = 2] = "RightClick";
(class extends et {
    constructor(e) {
        super(e, rt, D(e.event.target))
    }
}
).activators = [{
    eventName: "onMouseDown",
    handler: (e, t) => {
        let {nativeEvent: n} = e
          , {onActivation: r} = t;
        return n.button !== st.RightClick && (null == r || r({
            event: n
        }),
        !0)
    }
}];
const ot = {
    cancel: {
        name: "touchcancel"
    },
    move: {
        name: "touchmove"
    },
    end: {
        name: "touchend"
    }
};
var at, lt, ct, dt;
function ut(e) {
    let {acceleration: t, activator: n=at.Pointer, canScroll: r, draggingRect: s, enabled: i, interval: o=5, order: l=ct.TreeOrder, pointerCoordinates: c, scrollableAncestors: d, scrollableAncestorRects: u, delta: h, threshold: f} = e;
    const p = function(e) {
        let {delta: t, disabled: n} = e;
        const r = O(t);
        return $(e => {
            if (n || !r || !e)
                return ht;
            const s = {
                x: Math.sign(t.x - r.x),
                y: Math.sign(t.y - r.y)
            };
            return {
                x: {
                    [Re.Backward]: e.x[Re.Backward] || -1 === s.x,
                    [Re.Forward]: e.x[Re.Forward] || 1 === s.x
                },
                y: {
                    [Re.Backward]: e.y[Re.Backward] || -1 === s.y,
                    [Re.Forward]: e.y[Re.Forward] || 1 === s.y
                }
            }
        }
        , [n, t, r])
    }({
        delta: h,
        disabled: !i
    })
      , [m,g] = function() {
        const e = a.useRef(null);
        return [a.useCallback( (t, n) => {
            e.current = setInterval(t, n)
        }
        , []), a.useCallback( () => {
            null !== e.current && (clearInterval(e.current),
            e.current = null)
        }
        , [])]
    }()
      , x = a.useRef({
        x: 0,
        y: 0
    })
      , v = a.useRef({
        x: 0,
        y: 0
    })
      , b = a.useMemo( () => {
        switch (n) {
        case at.Pointer:
            return c ? {
                top: c.y,
                bottom: c.y,
                left: c.x,
                right: c.x
            } : null;
        case at.DraggableRect:
            return s
        }
    }
    , [n, s, c])
      , y = a.useRef(null)
      , w = a.useCallback( () => {
        const e = y.current;
        if (!e)
            return;
        const t = x.current.x * v.current.x
          , n = x.current.y * v.current.y;
        e.scrollBy(t, n)
    }
    , [])
      , N = a.useMemo( () => l === ct.TreeOrder ? [...d].reverse() : d, [l, d]);
    a.useEffect( () => {
        if (i && d.length && b) {
            for (const e of N) {
                if (!1 === (null == r ? void 0 : r(e)))
                    continue;
                const n = d.indexOf(e)
                  , s = u[n];
                if (!s)
                    continue;
                const {direction: i, speed: a} = Oe(e, s, b, t, f);
                for (const e of ["x", "y"])
                    p[e][i[e]] || (a[e] = 0,
                    i[e] = 0);
                if (a.x > 0 || a.y > 0)
                    return g(),
                    y.current = e,
                    m(w, o),
                    x.current = a,
                    void (v.current = i)
            }
            x.current = {
                x: 0,
                y: 0
            },
            v.current = {
                x: 0,
                y: 0
            },
            g()
        } else
            g()
    }
    , [t, w, r, g, i, o, JSON.stringify(b), JSON.stringify(p), m, d, N, u, JSON.stringify(f)])
}
(class extends et {
    constructor(e) {
        super(e, ot)
    }
    static setup() {
        return window.addEventListener(ot.move.name, e, {
            capture: !1,
            passive: !1
        }),
        function() {
            window.removeEventListener(ot.move.name, e)
        }
        ;
        function e() {}
    }
}
).activators = [{
    eventName: "onTouchStart",
    handler: (e, t) => {
        let {nativeEvent: n} = e
          , {onActivation: r} = t;
        const {touches: s} = n;
        return !(s.length > 1) && (null == r || r({
            event: n
        }),
        !0)
    }
}],
(lt = at || (at = {}))[lt.Pointer = 0] = "Pointer",
lt[lt.DraggableRect = 1] = "DraggableRect",
(dt = ct || (ct = {}))[dt.TreeOrder = 0] = "TreeOrder",
dt[dt.ReversedTreeOrder = 1] = "ReversedTreeOrder";
const ht = {
    x: {
        [Re.Backward]: !1,
        [Re.Forward]: !1
    },
    y: {
        [Re.Backward]: !1,
        [Re.Forward]: !1
    }
};
var ft, pt, mt;
(pt = ft || (ft = {}))[pt.Always = 0] = "Always",
pt[pt.BeforeDragging = 1] = "BeforeDragging",
pt[pt.WhileDragging = 2] = "WhileDragging",
(mt || (mt = {})).Optimized = "optimized";
const gt = new Map;
function xt(e, t) {
    return $(n => e ? n || ("function" == typeof t ? t(e) : e) : null, [t, e])
}
function vt(e) {
    let {callback: t, disabled: n} = e;
    const r = I(t)
      , s = a.useMemo( () => {
        if (n || "undefined" == typeof window || void 0 === window.ResizeObserver)
            return;
        const {ResizeObserver: e} = window;
        return new e(r)
    }
    , [n]);
    return a.useEffect( () => () => null == s ? void 0 : s.disconnect(), [s]),
    s
}
function bt(e) {
    return new Pe(Ne(e),e)
}
function yt(e, t, n) {
    void 0 === t && (t = bt);
    const [r,s] = a.useState(null);
    function i() {
        s(r => {
            if (!e)
                return null;
            var s;
            if (!1 === e.isConnected)
                return null != (s = null != r ? r : n) ? s : null;
            const i = t(e);
            return JSON.stringify(r) === JSON.stringify(i) ? r : i
        }
        )
    }
    const o = function(e) {
        let {callback: t, disabled: n} = e;
        const r = I(t)
          , s = a.useMemo( () => {
            if (n || "undefined" == typeof window || void 0 === window.MutationObserver)
                return;
            const {MutationObserver: e} = window;
            return new e(r)
        }
        , [r, n]);
        return a.useEffect( () => () => null == s ? void 0 : s.disconnect(), [s]),
        s
    }({
        callback(t) {
            if (e)
                for (const n of t) {
                    const {type: t, target: r} = n;
                    if ("childList" === t && r instanceof HTMLElement && r.contains(e)) {
                        i();
                        break
                    }
                }
        }
    })
      , l = vt({
        callback: i
    });
    return R( () => {
        i(),
        e ? (null == l || l.observe(e),
        null == o || o.observe(document.body, {
            childList: !0,
            subtree: !0
        })) : (null == l || l.disconnect(),
        null == o || o.disconnect())
    }
    , [e]),
    r
}
const wt = [];
function Nt(e, t) {
    void 0 === t && (t = []);
    const n = a.useRef(null);
    return a.useEffect( () => {
        n.current = null
    }
    , t),
    a.useEffect( () => {
        const t = e !== se;
        t && !n.current && (n.current = e),
        !t && n.current && (n.current = null)
    }
    , [e]),
    n.current ? P(e, n.current) : se
}
function jt(e) {
    return a.useMemo( () => e ? function(e) {
        const t = e.innerWidth
          , n = e.innerHeight;
        return {
            top: 0,
            left: 0,
            right: t,
            bottom: n,
            width: t,
            height: n
        }
    }(e) : null, [e])
}
const Ct = [];
function St(e) {
    if (!e)
        return null;
    if (e.children.length > 1)
        return e;
    const t = e.children[0];
    return q(t) ? t : e
}
const Et = [{
    sensor: nt,
    options: {}
}, {
    sensor: _e,
    options: {}
}]
  , qt = {
    current: {}
}
  , kt = {
    draggable: {
        measure: je
    },
    droppable: {
        measure: je,
        strategy: ft.WhileDragging,
        frequency: mt.Optimized
    },
    dragOverlay: {
        measure: Ne
    }
};
class Dt extends Map {
    get(e) {
        var t;
        return null != e && null != (t = super.get(e)) ? t : void 0
    }
    toArray() {
        return Array.from(this.values())
    }
    getEnabled() {
        return this.toArray().filter(e => {
            let {disabled: t} = e;
            return !t
        }
        )
    }
    getNodeFor(e) {
        var t, n;
        return null != (t = null == (n = this.get(e)) ? void 0 : n.node.current) ? t : void 0
    }
}
const Rt = {
    activatorEvent: null,
    active: null,
    activeNode: null,
    activeNodeRect: null,
    collisions: null,
    containerNodeRect: null,
    draggableNodes: new Map,
    droppableRects: new Map,
    droppableContainers: new Dt,
    over: null,
    dragOverlay: {
        nodeRef: {
            current: null
        },
        rect: null,
        setRef: te
    },
    scrollableAncestors: [],
    scrollableAncestorRects: [],
    measuringConfiguration: kt,
    measureDroppableContainers: te,
    windowRect: null,
    measuringScheduled: !1
}
  , It = {
    activatorEvent: null,
    activators: [],
    active: null,
    activeNodeRect: null,
    ariaDescribedById: {
        draggable: ""
    },
    dispatch: te,
    draggableNodes: new Map,
    over: null,
    measureDroppableContainers: te
}
  , Tt = a.createContext(It)
  , $t = a.createContext(Rt);
function At() {
    return {
        draggable: {
            active: null,
            initialCoordinates: {
                x: 0,
                y: 0
            },
            nodes: new Map,
            translate: {
                x: 0,
                y: 0
            }
        },
        droppable: {
            containers: new Dt
        }
    }
}
function Ot(e, t) {
    switch (t.type) {
    case Z.DragStart:
        return {
            ...e,
            draggable: {
                ...e.draggable,
                initialCoordinates: t.initialCoordinates,
                active: t.active
            }
        };
    case Z.DragMove:
        return null == e.draggable.active ? e : {
            ...e,
            draggable: {
                ...e.draggable,
                translate: {
                    x: t.coordinates.x - e.draggable.initialCoordinates.x,
                    y: t.coordinates.y - e.draggable.initialCoordinates.y
                }
            }
        };
    case Z.DragEnd:
    case Z.DragCancel:
        return {
            ...e,
            draggable: {
                ...e.draggable,
                active: null,
                initialCoordinates: {
                    x: 0,
                    y: 0
                },
                translate: {
                    x: 0,
                    y: 0
                }
            }
        };
    case Z.RegisterDroppable:
        {
            const {element: n} = t
              , {id: r} = n
              , s = new Dt(e.droppable.containers);
            return s.set(r, n),
            {
                ...e,
                droppable: {
                    ...e.droppable,
                    containers: s
                }
            }
        }
    case Z.SetDroppableDisabled:
        {
            const {id: n, key: r, disabled: s} = t
              , i = e.droppable.containers.get(n);
            if (!i || r !== i.key)
                return e;
            const o = new Dt(e.droppable.containers);
            return o.set(n, {
                ...i,
                disabled: s
            }),
            {
                ...e,
                droppable: {
                    ...e.droppable,
                    containers: o
                }
            }
        }
    case Z.UnregisterDroppable:
        {
            const {id: n, key: r} = t
              , s = e.droppable.containers.get(n);
            if (!s || r !== s.key)
                return e;
            const i = new Dt(e.droppable.containers);
            return i.delete(n),
            {
                ...e,
                droppable: {
                    ...e.droppable,
                    containers: i
                }
            }
        }
    default:
        return e
    }
}
function Mt(e) {
    let {disabled: t} = e;
    const {active: n, activatorEvent: r, draggableNodes: s} = a.useContext(Tt)
      , i = O(r)
      , o = O(null == n ? void 0 : n.id);
    return a.useEffect( () => {
        if (!t && !r && i && null != o) {
            if (!B(i))
                return;
            if (document.activeElement === i.target)
                return;
            const e = s.get(o);
            if (!e)
                return;
            const {activatorNode: t, node: n} = e;
            if (!t.current && !n.current)
                return;
            requestAnimationFrame( () => {
                for (const e of [t.current, n.current]) {
                    if (!e)
                        continue;
                    const t = W(e);
                    if (t) {
                        t.focus();
                        break
                    }
                }
            }
            )
        }
    }
    , [r, t, s, o, i]),
    null
}
function Lt(e, t) {
    let {transform: n, ...r} = t;
    return null != e && e.length ? e.reduce( (e, t) => t({
        transform: e,
        ...r
    }), n) : n
}
const Qt = a.createContext({
    ...se,
    scaleX: 1,
    scaleY: 1
});
var Ft, Pt;
(Pt = Ft || (Ft = {}))[Pt.Uninitialized = 0] = "Uninitialized",
Pt[Pt.Initializing = 1] = "Initializing",
Pt[Pt.Initialized = 2] = "Initialized";
const Bt = a.memo(function(e) {
    var t, n, r, s;
    let {id: i, accessibility: o, autoScroll: d=!0, children: u, sensors: h=Et, collisionDetection: f=pe, measuring: p, modifiers: m, ...g} = e;
    const x = a.useReducer(Ot, void 0, At)
      , [v,b] = x
      , [y,w] = function() {
        const [e] = a.useState( () => new Set)
          , t = a.useCallback(t => (e.add(t),
        () => e.delete(t)), [e]);
        return [a.useCallback(t => {
            let {type: n, event: r} = t;
            e.forEach(e => {
                var t;
                return null == (t = e[n]) ? void 0 : t.call(e, r)
            }
            )
        }
        , [e]), t]
    }()
      , [j,C] = a.useState(Ft.Uninitialized)
      , E = j === Ft.Initialized
      , {draggable: {active: k, nodes: D, translate: I}, droppable: {containers: O}} = v
      , M = null != k ? D.get(k) : null
      , Q = a.useRef({
        initial: null,
        translated: null
    })
      , P = a.useMemo( () => {
        var e;
        return null != k ? {
            id: k,
            data: null != (e = null == M ? void 0 : M.data) ? e : qt,
            rect: Q
        } : null
    }
    , [k, M])
      , B = a.useRef(null)
      , [z,H] = a.useState(null)
      , [W,U] = a.useState(null)
      , V = T(g, Object.values(g))
      , X = L("DndDescribedBy", i)
      , K = a.useMemo( () => O.getEnabled(), [O])
      , _ = (ee = p,
    a.useMemo( () => ({
        draggable: {
            ...kt.draggable,
            ...null == ee ? void 0 : ee.draggable
        },
        droppable: {
            ...kt.droppable,
            ...null == ee ? void 0 : ee.droppable
        },
        dragOverlay: {
            ...kt.dragOverlay,
            ...null == ee ? void 0 : ee.dragOverlay
        }
    }), [null == ee ? void 0 : ee.draggable, null == ee ? void 0 : ee.droppable, null == ee ? void 0 : ee.dragOverlay]));
    var ee;
    const {droppableRects: te, measureDroppableContainers: ne, measuringScheduled: re} = function(e, t) {
        let {dragging: n, dependencies: r, config: s} = t;
        const [i,o] = a.useState(null)
          , {frequency: l, measure: c, strategy: d} = s
          , u = a.useRef(e)
          , h = function() {
            switch (d) {
            case ft.Always:
                return !1;
            case ft.BeforeDragging:
                return n;
            default:
                return !n
            }
        }()
          , f = T(h)
          , p = a.useCallback(function(e) {
            void 0 === e && (e = []),
            f.current || o(t => null === t ? e : t.concat(e.filter(e => !t.includes(e))))
        }, [f])
          , m = a.useRef(null)
          , g = $(t => {
            if (h && !n)
                return gt;
            if (!t || t === gt || u.current !== e || null != i) {
                const t = new Map;
                for (let n of e) {
                    if (!n)
                        continue;
                    if (i && i.length > 0 && !i.includes(n.id) && n.rect.current) {
                        t.set(n.id, n.rect.current);
                        continue
                    }
                    const e = n.node.current
                      , r = e ? new Pe(c(e),e) : null;
                    n.rect.current = r,
                    r && t.set(n.id, r)
                }
                return t
            }
            return t
        }
        , [e, i, n, h, c]);
        return a.useEffect( () => {
            u.current = e
        }
        , [e]),
        a.useEffect( () => {
            h || p()
        }
        , [n, h]),
        a.useEffect( () => {
            i && i.length > 0 && o(null)
        }
        , [JSON.stringify(i)]),
        a.useEffect( () => {
            h || "number" != typeof l || null !== m.current || (m.current = setTimeout( () => {
                p(),
                m.current = null
            }
            , l))
        }
        , [l, h, p, ...r]),
        {
            droppableRects: g,
            measureDroppableContainers: p,
            measuringScheduled: null != i
        }
    }(K, {
        dragging: E,
        dependencies: [I.x, I.y],
        config: _.droppable
    })
      , ie = function(e, t) {
        const n = null != t ? e.get(t) : void 0
          , r = n ? n.node.current : null;
        return $(e => {
            var n;
            return null == t ? null : null != (n = null != r ? r : e) ? n : null
        }
        , [r, t])
    }(D, k)
      , oe = a.useMemo( () => W ? G(W) : null, [W])
      , ae = function() {
        const e = !1 === (null == z ? void 0 : z.autoScrollEnabled)
          , t = "object" == typeof d ? !1 === d.enabled : !1 === d
          , n = E && !e && !t;
        if ("object" == typeof d)
            return {
                ...d,
                enabled: n
            };
        return {
            enabled: n
        }
    }()
      , le = function(e, t) {
        return xt(e, t)
    }(ie, _.draggable.measure);
    !function(e) {
        let {activeNode: t, measure: n, initialRect: r, config: s=!0} = e;
        const i = a.useRef(!1)
          , {x: o, y: l} = "boolean" == typeof s ? {
            x: s,
            y: s
        } : s;
        R( () => {
            if (!o && !l || !t)
                return void (i.current = !1);
            if (i.current || !r)
                return;
            const e = null == t ? void 0 : t.node.current;
            if (!e || !1 === e.isConnected)
                return;
            const s = xe(n(e), r);
            if (o || (s.x = 0),
            l || (s.y = 0),
            i.current = !0,
            Math.abs(s.x) > 0 || Math.abs(s.y) > 0) {
                const t = Se(e);
                t && t.scrollBy({
                    top: s.y,
                    left: s.x
                })
            }
        }
        , [t, o, l, r, n])
    }({
        activeNode: null != k ? D.get(k) : null,
        config: ae.layoutShiftCompensation,
        initialRect: le,
        measure: _.draggable.measure
    });
    const ce = yt(ie, _.draggable.measure, le)
      , ue = yt(ie ? ie.parentElement : null)
      , he = a.useRef({
        activatorEvent: null,
        active: null,
        activeNode: ie,
        collisionRect: null,
        collisions: null,
        droppableRects: te,
        draggableNodes: D,
        draggingNode: null,
        draggingNodeRect: null,
        droppableContainers: O,
        over: null,
        scrollableAncestors: [],
        scrollAdjustedTranslate: null
    })
      , fe = O.getNodeFor(null == (t = he.current.over) ? void 0 : t.id)
      , me = function(e) {
        let {measure: t} = e;
        const [n,r] = a.useState(null)
          , s = vt({
            callback: a.useCallback(e => {
                for (const {target: n} of e)
                    if (q(n)) {
                        r(e => {
                            const r = t(n);
                            return e ? {
                                ...e,
                                width: r.width,
                                height: r.height
                            } : r
                        }
                        );
                        break
                    }
            }
            , [t])
        })
          , i = a.useCallback(e => {
            const n = St(e);
            null == s || s.disconnect(),
            n && (null == s || s.observe(n)),
            r(n ? t(n) : null)
        }
        , [t, s])
          , [o,l] = A(i);
        return a.useMemo( () => ({
            nodeRef: o,
            rect: n,
            setRef: l
        }), [n, o, l])
    }({
        measure: _.dragOverlay.measure
    })
      , ge = null != (n = me.nodeRef.current) ? n : ie
      , ve = E ? null != (r = me.rect) ? r : ce : null
      , ye = Boolean(me.nodeRef.current && me.rect)
      , we = xe(je = ye ? null : ce, xt(je));
    var je;
    const qe = jt(ge ? S(ge) : null)
      , ke = function(e) {
        const t = a.useRef(e)
          , n = $(n => e ? n && n !== wt && e && t.current && e.parentNode === t.current.parentNode ? n : Ce(e) : wt, [e]);
        return a.useEffect( () => {
            t.current = e
        }
        , [e]),
        n
    }(E ? null != fe ? fe : ie : null)
      , Re = function(e, t) {
        void 0 === t && (t = Ne);
        const [n] = e
          , r = jt(n ? S(n) : null)
          , [s,i] = a.useState(Ct);
        function o() {
            i( () => e.length ? e.map(e => Te(e) ? r : new Pe(t(e),e)) : Ct)
        }
        const l = vt({
            callback: o
        });
        return R( () => {
            null == l || l.disconnect(),
            o(),
            e.forEach(e => null == l ? void 0 : l.observe(e))
        }
        , [e]),
        s
    }(ke)
      , Ie = Lt(m, {
        transform: {
            x: I.x - we.x,
            y: I.y - we.y,
            scaleX: 1,
            scaleY: 1
        },
        activatorEvent: W,
        active: P,
        activeNodeRect: ce,
        containerNodeRect: ue,
        draggingNodeRect: ve,
        over: he.current.over,
        overlayNodeRect: me.rect,
        scrollableAncestors: ke,
        scrollableAncestorRects: Re,
        windowRect: qe
    })
      , $e = oe ? F(oe, I) : null
      , Ae = function(e) {
        const [t,n] = a.useState(null)
          , r = a.useRef(e)
          , s = a.useCallback(e => {
            const t = Ee(e.target);
            t && n(e => e ? (e.set(t, De(t)),
            new Map(e)) : null)
        }
        , []);
        return a.useEffect( () => {
            const t = r.current;
            if (e !== t) {
                i(t);
                const o = e.map(e => {
                    const t = Ee(e);
                    return t ? (t.addEventListener("scroll", s, {
                        passive: !0
                    }),
                    [t, De(t)]) : null
                }
                ).filter(e => null != e);
                n(o.length ? new Map(o) : null),
                r.current = e
            }
            return () => {
                i(e),
                i(t)
            }
            ;
            function i(e) {
                e.forEach(e => {
                    const t = Ee(e);
                    null == t || t.removeEventListener("scroll", s)
                }
                )
            }
        }
        , [s, e]),
        a.useMemo( () => e.length ? t ? Array.from(t.values()).reduce( (e, t) => F(e, t), se) : Le(e) : se, [e, t])
    }(ke)
      , Oe = Nt(Ae)
      , Me = Nt(Ae, [ce])
      , Qe = F(Ie, Oe)
      , Fe = ve ? be(ve, Ie) : null
      , Be = P && Fe ? f({
        active: P,
        collisionRect: Fe,
        droppableRects: te,
        droppableContainers: K,
        pointerCoordinates: $e
    }) : null
      , Ge = de(Be, "id")
      , [ze,He] = a.useState(null)
      , We = function(e, t, n) {
        return {
            ...e,
            scaleX: t && n ? t.width / n.width : 1,
            scaleY: t && n ? t.height / n.height : 1
        }
    }(ye ? Ie : F(Ie, Me), null != (s = null == ze ? void 0 : ze.rect) ? s : null, ce)
      , Ue = a.useRef(null)
      , Ve = a.useCallback( (e, t) => {
        let {sensor: n, options: r} = t;
        if (null == B.current)
            return;
        const s = D.get(B.current);
        if (!s)
            return;
        const i = e.nativeEvent
          , o = new n({
            active: B.current,
            activeNode: s,
            event: i,
            options: r,
            context: he,
            onAbort(e) {
                if (!D.get(e))
                    return;
                const {onDragAbort: t} = V.current
                  , n = {
                    id: e
                };
                null == t || t(n),
                y({
                    type: "onDragAbort",
                    event: n
                })
            },
            onPending(e, t, n, r) {
                if (!D.get(e))
                    return;
                const {onDragPending: s} = V.current
                  , i = {
                    id: e,
                    constraint: t,
                    initialCoordinates: n,
                    offset: r
                };
                null == s || s(i),
                y({
                    type: "onDragPending",
                    event: i
                })
            },
            onStart(e) {
                const t = B.current;
                if (null == t)
                    return;
                const n = D.get(t);
                if (!n)
                    return;
                const {onDragStart: r} = V.current
                  , s = {
                    activatorEvent: i,
                    active: {
                        id: t,
                        data: n.data,
                        rect: Q
                    }
                };
                c.unstable_batchedUpdates( () => {
                    null == r || r(s),
                    C(Ft.Initializing),
                    b({
                        type: Z.DragStart,
                        initialCoordinates: e,
                        active: t
                    }),
                    y({
                        type: "onDragStart",
                        event: s
                    }),
                    H(Ue.current),
                    U(i)
                }
                )
            },
            onMove(e) {
                b({
                    type: Z.DragMove,
                    coordinates: e
                })
            },
            onEnd: a(Z.DragEnd),
            onCancel: a(Z.DragCancel)
        });
        function a(e) {
            return async function() {
                const {active: t, collisions: n, over: r, scrollAdjustedTranslate: s} = he.current;
                let o = null;
                if (t && s) {
                    const {cancelDrop: a} = V.current;
                    if (o = {
                        activatorEvent: i,
                        active: t,
                        collisions: n,
                        delta: s,
                        over: r
                    },
                    e === Z.DragEnd && "function" == typeof a) {
                        await Promise.resolve(a(o)) && (e = Z.DragCancel)
                    }
                }
                B.current = null,
                c.unstable_batchedUpdates( () => {
                    b({
                        type: e
                    }),
                    C(Ft.Uninitialized),
                    He(null),
                    H(null),
                    U(null),
                    Ue.current = null;
                    const t = e === Z.DragEnd ? "onDragEnd" : "onDragCancel";
                    if (o) {
                        const e = V.current[t];
                        null == e || e(o),
                        y({
                            type: t,
                            event: o
                        })
                    }
                }
                )
            }
        }
        Ue.current = o
    }
    , [D])
      , Xe = function(e, t) {
        return a.useMemo( () => e.reduce( (e, n) => {
            const {sensor: r} = n;
            return [...e, ...r.activators.map(e => ({
                eventName: e.eventName,
                handler: t(e.handler, n)
            }))]
        }
        , []), [e, t])
    }(h, a.useCallback( (e, t) => (n, r) => {
        const s = n.nativeEvent
          , i = D.get(r);
        if (null !== B.current || !i || s.dndKit || s.defaultPrevented)
            return;
        const o = {
            active: i
        };
        !0 === e(n, t.options, o) && (s.dndKit = {
            capturedBy: t.sensor
        },
        B.current = r,
        Ve(n, t))
    }
    , [D, Ve]));
    !function(e) {
        a.useEffect( () => {
            if (!N)
                return;
            const t = e.map(e => {
                let {sensor: t} = e;
                return null == t.setup ? void 0 : t.setup()
            }
            );
            return () => {
                for (const e of t)
                    null == e || e()
            }
        }
        , e.map(e => {
            let {sensor: t} = e;
            return t
        }
        ))
    }(h),
    R( () => {
        ce && j === Ft.Initializing && C(Ft.Initialized)
    }
    , [ce, j]),
    a.useEffect( () => {
        const {onDragMove: e} = V.current
          , {active: t, activatorEvent: n, collisions: r, over: s} = he.current;
        if (!t || !n)
            return;
        const i = {
            active: t,
            activatorEvent: n,
            collisions: r,
            delta: {
                x: Qe.x,
                y: Qe.y
            },
            over: s
        };
        c.unstable_batchedUpdates( () => {
            null == e || e(i),
            y({
                type: "onDragMove",
                event: i
            })
        }
        )
    }
    , [Qe.x, Qe.y]),
    a.useEffect( () => {
        const {active: e, activatorEvent: t, collisions: n, droppableContainers: r, scrollAdjustedTranslate: s} = he.current;
        if (!e || null == B.current || !t || !s)
            return;
        const {onDragOver: i} = V.current
          , o = r.get(Ge)
          , a = o && o.rect.current ? {
            id: o.id,
            rect: o.rect.current,
            data: o.data,
            disabled: o.disabled
        } : null
          , l = {
            active: e,
            activatorEvent: t,
            collisions: n,
            delta: {
                x: s.x,
                y: s.y
            },
            over: a
        };
        c.unstable_batchedUpdates( () => {
            He(a),
            null == i || i(l),
            y({
                type: "onDragOver",
                event: l
            })
        }
        )
    }
    , [Ge]),
    R( () => {
        he.current = {
            activatorEvent: W,
            active: P,
            activeNode: ie,
            collisionRect: Fe,
            collisions: Be,
            droppableRects: te,
            draggableNodes: D,
            draggingNode: ge,
            draggingNodeRect: ve,
            droppableContainers: O,
            over: ze,
            scrollableAncestors: ke,
            scrollAdjustedTranslate: Qe
        },
        Q.current = {
            initial: ve,
            translated: Fe
        }
    }
    , [P, ie, Be, Fe, D, ge, ve, te, O, ze, ke, Qe]),
    ut({
        ...ae,
        delta: I,
        draggingRect: Fe,
        pointerCoordinates: $e,
        scrollableAncestors: ke,
        scrollableAncestorRects: Re
    });
    const Ye = a.useMemo( () => ({
        active: P,
        activeNode: ie,
        activeNodeRect: ce,
        activatorEvent: W,
        collisions: Be,
        containerNodeRect: ue,
        dragOverlay: me,
        draggableNodes: D,
        droppableContainers: O,
        droppableRects: te,
        over: ze,
        measureDroppableContainers: ne,
        scrollableAncestors: ke,
        scrollableAncestorRects: Re,
        measuringConfiguration: _,
        measuringScheduled: re,
        windowRect: qe
    }), [P, ie, ce, W, Be, ue, me, D, O, te, ze, ne, ke, Re, _, re, qe])
      , Ke = a.useMemo( () => ({
        activatorEvent: W,
        activators: Xe,
        active: P,
        activeNodeRect: ce,
        ariaDescribedById: {
            draggable: X
        },
        dispatch: b,
        draggableNodes: D,
        over: ze,
        measureDroppableContainers: ne
    }), [W, Xe, P, ce, b, X, D, ze, ne]);
    return l.createElement(Y.Provider, {
        value: w
    }, l.createElement(Tt.Provider, {
        value: Ke
    }, l.createElement($t.Provider, {
        value: Ye
    }, l.createElement(Qt.Provider, {
        value: We
    }, u)), l.createElement(Mt, {
        disabled: !1 === (null == o ? void 0 : o.restoreFocus)
    })), l.createElement(J, {
        ...o,
        hiddenTextDescribedById: X
    }))
})
  , Gt = a.createContext(null)
  , zt = "button";
function Ht(e) {
    let {id: t, data: n, disabled: r=!1, attributes: s} = e;
    const i = L("Draggable")
      , {activators: o, activatorEvent: l, active: c, activeNodeRect: d, ariaDescribedById: u, draggableNodes: h, over: f} = a.useContext(Tt)
      , {role: p=zt, roleDescription: m="draggable", tabIndex: g=0} = null != s ? s : {}
      , x = (null == c ? void 0 : c.id) === t
      , v = a.useContext(x ? Qt : Gt)
      , [b,y] = A()
      , [w,N] = A()
      , j = function(e, t) {
        return a.useMemo( () => e.reduce( (e, n) => {
            let {eventName: r, handler: s} = n;
            return e[r] = e => {
                s(e, t)
            }
            ,
            e
        }
        , {}), [e, t])
    }(o, t)
      , C = T(n);
    R( () => (h.set(t, {
        id: t,
        key: i,
        node: b,
        activatorNode: w,
        data: C
    }),
    () => {
        const e = h.get(t);
        e && e.key === i && h.delete(t)
    }
    ), [h, t]);
    return {
        active: c,
        activatorEvent: l,
        activeNodeRect: d,
        attributes: a.useMemo( () => ({
            role: p,
            tabIndex: g,
            "aria-disabled": r,
            "aria-pressed": !(!x || p !== zt) || void 0,
            "aria-roledescription": m,
            "aria-describedby": u.draggable
        }), [r, p, g, x, m, u.draggable]),
        isDragging: x,
        listeners: r ? void 0 : j,
        node: b,
        over: f,
        setNodeRef: y,
        setActivatorNodeRef: N,
        transform: v
    }
}
const Wt = {
    timeout: 25
};
function Ut(e) {
    let {animation: t, children: n} = e;
    const [r,s] = a.useState(null)
      , [i,o] = a.useState(null)
      , c = O(n);
    return n || r || !c || s(c),
    R( () => {
        if (!i)
            return;
        const e = null == r ? void 0 : r.key
          , n = null == r ? void 0 : r.props.id;
        null != e && null != n ? Promise.resolve(t(n, i)).then( () => {
            s(null)
        }
        ) : s(null)
    }
    , [t, r, i]),
    l.createElement(l.Fragment, null, n, r ? a.cloneElement(r, {
        ref: o
    }) : null)
}
const Vt = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1
};
function Xt(e) {
    let {children: t} = e;
    return l.createElement(Tt.Provider, {
        value: It
    }, l.createElement(Qt.Provider, {
        value: Vt
    }, t))
}
const Yt = {
    position: "fixed",
    touchAction: "none"
}
  , Kt = e => B(e) ? "transform 250ms ease" : void 0
  , _t = a.forwardRef( (e, t) => {
    let {as: n, activatorEvent: r, adjustScale: s, children: i, className: o, rect: a, style: c, transform: d, transition: u=Kt} = e;
    if (!a)
        return null;
    const h = s ? d : {
        ...d,
        scaleX: 1,
        scaleY: 1
    }
      , f = {
        ...Yt,
        width: a.width,
        height: a.height,
        top: a.top,
        left: a.left,
        transform: z.Transform.toString(h),
        transformOrigin: s && r ? oe(r, a) : void 0,
        transition: "function" == typeof u ? u(r) : u,
        ...c
    };
    return l.createElement(n, {
        className: o,
        style: f,
        ref: t
    }, i)
}
)
  , Jt = {
    duration: 250,
    easing: "ease",
    keyframes: e => {
        let {transform: {initial: t, final: n}} = e;
        return [{
            transform: z.Transform.toString(t)
        }, {
            transform: z.Transform.toString(n)
        }]
    }
    ,
    sideEffects: (e => t => {
        let {active: n, dragOverlay: r} = t;
        const s = {}
          , {styles: i, className: o} = e;
        if (null != i && i.active)
            for (const [e,a] of Object.entries(i.active))
                void 0 !== a && (s[e] = n.node.style.getPropertyValue(e),
                n.node.style.setProperty(e, a));
        if (null != i && i.dragOverlay)
            for (const [e,a] of Object.entries(i.dragOverlay))
                void 0 !== a && r.node.style.setProperty(e, a);
        return null != o && o.active && n.node.classList.add(o.active),
        null != o && o.dragOverlay && r.node.classList.add(o.dragOverlay),
        function() {
            for (const [e,t] of Object.entries(s))
                n.node.style.setProperty(e, t);
            null != o && o.active && n.node.classList.remove(o.active)
        }
    }
    )({
        styles: {
            active: {
                opacity: "0"
            }
        }
    })
};
function Zt(e) {
    let {config: t, draggableNodes: n, droppableContainers: r, measuringConfiguration: s} = e;
    return I( (e, i) => {
        if (null === t)
            return;
        const o = n.get(e);
        if (!o)
            return;
        const a = o.node.current;
        if (!a)
            return;
        const l = St(i);
        if (!l)
            return;
        const {transform: c} = S(i).getComputedStyle(i)
          , d = ye(c);
        if (!d)
            return;
        const u = "function" == typeof t ? t : function(e) {
            const {duration: t, easing: n, sideEffects: r, keyframes: s} = {
                ...Jt,
                ...e
            };
            return e => {
                let {active: i, dragOverlay: o, transform: a, ...l} = e;
                if (!t)
                    return;
                const c = {
                    x: o.rect.left - i.rect.left,
                    y: o.rect.top - i.rect.top
                }
                  , d = {
                    scaleX: 1 !== a.scaleX ? i.rect.width * a.scaleX / o.rect.width : 1,
                    scaleY: 1 !== a.scaleY ? i.rect.height * a.scaleY / o.rect.height : 1
                }
                  , u = {
                    x: a.x - c.x,
                    y: a.y - c.y,
                    ...d
                }
                  , h = s({
                    ...l,
                    active: i,
                    dragOverlay: o,
                    transform: {
                        initial: a,
                        final: u
                    }
                })
                  , [f] = h
                  , p = h[h.length - 1];
                if (JSON.stringify(f) === JSON.stringify(p))
                    return;
                const m = null == r ? void 0 : r({
                    active: i,
                    dragOverlay: o,
                    ...l
                })
                  , g = o.node.animate(h, {
                    duration: t,
                    easing: n,
                    fill: "forwards"
                });
                return new Promise(e => {
                    g.onfinish = () => {
                        null == m || m(),
                        e()
                    }
                }
                )
            }
        }(t);
        return Qe(a, s.draggable.measure),
        u({
            active: {
                id: e,
                data: o.data,
                node: a,
                rect: s.draggable.measure(a)
            },
            draggableNodes: n,
            dragOverlay: {
                node: i,
                rect: s.dragOverlay.measure(l)
            },
            droppableContainers: r,
            measuringConfiguration: s,
            transform: d
        })
    }
    )
}
let en = 0;
const tn = l.memo(e => {
    let {adjustScale: t=!1, children: n, dropAnimation: r, style: s, transition: i, modifiers: o, wrapperElement: c="div", className: d, zIndex: u=999} = e;
    const {activatorEvent: h, active: f, activeNodeRect: p, containerNodeRect: m, draggableNodes: g, droppableContainers: x, dragOverlay: v, over: b, measuringConfiguration: y, scrollableAncestors: w, scrollableAncestorRects: N, windowRect: j} = a.useContext($t)
      , C = a.useContext(Qt)
      , S = (E = null == f ? void 0 : f.id,
    a.useMemo( () => {
        if (null != E)
            return en++,
            en
    }
    , [E]));
    var E;
    const q = Lt(o, {
        activatorEvent: h,
        active: f,
        activeNodeRect: p,
        containerNodeRect: m,
        draggingNodeRect: v.rect,
        over: b,
        overlayNodeRect: v.rect,
        scrollableAncestors: w,
        scrollableAncestorRects: N,
        transform: C,
        windowRect: j
    })
      , k = xt(p)
      , D = Zt({
        config: r,
        draggableNodes: g,
        droppableContainers: x,
        measuringConfiguration: y
    })
      , R = k ? v.setRef : void 0;
    return l.createElement(Xt, null, l.createElement(Ut, {
        animation: D
    }, f && S ? l.createElement(_t, {
        key: S,
        id: f.id,
        ref: R,
        as: c,
        activatorEvent: h,
        adjustScale: t,
        className: d,
        transition: i,
        rect: k,
        style: {
            zIndex: u,
            ...s
        },
        transform: q
    }, n) : null))
}
)
  , nn = ({id: t, children: n, isOptionArea: r}) => {
    const {attributes: s, listeners: i, setNodeRef: o, transform: a, isDragging: l} = Ht({
        id: t
    })
      , c = a ? {
        transform: `translate3d(${a.x}px, ${a.y}px, 0)`
    } : void 0;
    return e.jsx("div", {
        ref: o,
        style: c,
        ...i,
        ...s,
        className: `${"px-2 rounded-md cursor-move transition-colors text-start " + (r ? "w-fit" : "w-full")} ${l ? "border shadow-lg z-10 bg-gray-100 border-gray-400" : "bg-background border border-gray-300"} hover:border-sky-500 hover:shadow-sm hover:shadow-gray-300`,
        children: n
    })
}
  , rn = ({id: t, children: n, isOptionArea: r, isEmpty: s}) => {
    const {isOver: i, setNodeRef: o} = function(e) {
        let {data: t, disabled: n=!1, id: r, resizeObserverConfig: s} = e;
        const i = L("Droppable")
          , {active: o, dispatch: l, over: c, measureDroppableContainers: d} = a.useContext(Tt)
          , u = a.useRef({
            disabled: n
        })
          , h = a.useRef(!1)
          , f = a.useRef(null)
          , p = a.useRef(null)
          , {disabled: m, updateMeasurementsFor: g, timeout: x} = {
            ...Wt,
            ...s
        }
          , v = T(null != g ? g : r)
          , b = vt({
            callback: a.useCallback( () => {
                h.current ? (null != p.current && clearTimeout(p.current),
                p.current = setTimeout( () => {
                    d(Array.isArray(v.current) ? v.current : [v.current]),
                    p.current = null
                }
                , x)) : h.current = !0
            }
            , [x]),
            disabled: m || !o
        })
          , y = a.useCallback( (e, t) => {
            b && (t && (b.unobserve(t),
            h.current = !1),
            e && b.observe(e))
        }
        , [b])
          , [w,N] = A(y)
          , j = T(t);
        return a.useEffect( () => {
            b && w.current && (b.disconnect(),
            h.current = !1,
            b.observe(w.current))
        }
        , [w, b]),
        a.useEffect( () => (l({
            type: Z.RegisterDroppable,
            element: {
                id: r,
                key: i,
                disabled: n,
                node: w,
                rect: f,
                data: j
            }
        }),
        () => l({
            type: Z.UnregisterDroppable,
            key: i,
            id: r
        })), [r]),
        a.useEffect( () => {
            n !== u.current.disabled && (l({
                type: Z.SetDroppableDisabled,
                id: r,
                key: i,
                disabled: n
            }),
            u.current.disabled = n)
        }
        , [r, i, n, l]),
        {
            active: o,
            rect: f,
            isOver: (null == c ? void 0 : c.id) === r,
            node: w,
            over: c,
            setNodeRef: N
        }
    }({
        id: t
    });
    return e.jsx("div", {
        ref: o,
        className: "flex-1 rounded-md transition-colors text-center " + (r ? "w-fit " + (i ? "bg-gray-200" : "") : "border border-dashed border-gray-400 bg-background " + (i ? "border bg-gray-300 " + (s ? "bg-gray-300 border-sky-500" : "border-background") : s ? "" : "border-secondary")),
        children: n
    })
}
  , sn = ({activeId: t, activeOption: n}) => e.jsx(tn, {
    children: t && n ? e.jsx("div", {
        className: "\n          px-2 border cursor-move transition-colors rounded-md\n          bg-gray-500 border-gray-400 shadow-sm\n        ",
        children: n
    }) : null
});
function on(e) {
    if (!e)
        return !1;
    const t = e.data.current;
    return !!(t && "sortable"in t && "object" == typeof t.sortable && "containerId"in t.sortable && "items"in t.sortable && "index"in t.sortable)
}
const an = [We.Down, We.Right, We.Up, We.Left]
  , ln = (e, t) => {
    let {context: {active: n, collisionRect: r, droppableRects: s, droppableContainers: i, over: o, scrollableAncestors: a}} = t;
    if (an.includes(e.code)) {
        if (e.preventDefault(),
        !n || !r)
            return;
        const t = [];
        i.getEnabled().forEach(n => {
            if (!n || null != n && n.disabled)
                return;
            const i = s.get(n.id);
            if (i)
                switch (e.code) {
                case We.Down:
                    r.top < i.top && t.push(n);
                    break;
                case We.Up:
                    r.top > i.top && t.push(n);
                    break;
                case We.Left:
                    r.left > i.left && t.push(n);
                    break;
                case We.Right:
                    r.left < i.left && t.push(n)
                }
        }
        );
        const l = (e => {
            let {collisionRect: t, droppableRects: n, droppableContainers: r} = e;
            const s = ce(t)
              , i = [];
            for (const o of r) {
                const {id: e} = o
                  , t = n.get(e);
                if (t) {
                    const n = ce(t)
                      , r = s.reduce( (e, t, r) => e + ie(n[r], t), 0)
                      , a = Number((r / 4).toFixed(4));
                    i.push({
                        id: e,
                        data: {
                            droppableContainer: o,
                            value: a
                        }
                    })
                }
            }
            return i.sort(ae)
        }
        )({
            collisionRect: r,
            droppableRects: s,
            droppableContainers: t
        });
        let c = de(l, "id");
        if (c === (null == o ? void 0 : o.id) && l.length > 1 && (c = l[1].id),
        null != c) {
            const e = i.get(n.id)
              , t = i.get(c)
              , o = t ? s.get(t.id) : null
              , l = null == t ? void 0 : t.node.current;
            if (l && o && e && t) {
                const n = Ce(l).some( (e, t) => a[t] !== e)
                  , s = cn(e, t)
                  , i = function(e, t) {
                    if (!on(e) || !on(t))
                        return !1;
                    if (!cn(e, t))
                        return !1;
                    return e.data.current.sortable.index < t.data.current.sortable.index
                }(e, t)
                  , c = n || !s ? {
                    x: 0,
                    y: 0
                } : {
                    x: i ? r.width - o.width : 0,
                    y: i ? r.height - o.height : 0
                }
                  , d = {
                    x: o.left,
                    y: o.top
                };
                return c.x && c.y ? d : P(d, c)
            }
        }
    }
}
;
function cn(e, t) {
    return !(!on(e) || !on(t)) && e.data.current.sortable.containerId === t.data.current.sortable.containerId
}
const dn = (e, t) => {
    const {answers: n={}, setAnswer: r, activeQuestionId: s, setActiveQuestion: i} = t
      , [o,l] = a.useState({})
      , [c,d] = a.useState([])
      , [u,h] = a.useState(null)
      , [f,p] = a.useState(null);
    a.useEffect( () => {
        p(null != s ? String(s) : null)
    }
    , [s]);
    const m = e => String(e)
      , g = e => "object" == typeof e ? e.id : e;
    a.useEffect( () => {
        if (!e)
            return l({}),
            void d([]);
        const t = {}
          , r = new Set;
        e.questions.forEach(e => {
            const s = m(e.questionNumber)
              , i = n[s] || n[e.questionNumber];
            i && (t[s] = i,
            r.add(i))
        }
        );
        const s = e.options.filter(e => {
            const t = g(e);
            return !r.has(t)
        }
        );
        l(t),
        d(s)
    }
    , [e, n]);
    const x = re(ne(nt, {
        activationConstraint: {
            distance: 8
        }
    }), ne(_e, {
        coordinateGetter: ln
    }))
      , v = a.useCallback(t => {
        if (!e)
            return;
        const n = e.options.find(e => g(e) === t);
        n && d(r => {
            const s = e.options.findIndex(e => g(e) === t)
              , i = [...r];
            return i.splice(s, 0, n),
            i
        }
        )
    }
    , [e])
      , b = a.useCallback(e => {
        const t = m(e);
        p(e => {
            const n = e === t ? null : t;
            return i && i(n),
            n
        }
        )
    }
    , [i]);
    return {
        answers: o,
        options: c,
        activeId: u,
        selectedQuestionId: f,
        sensors: x,
        handleDragEnd: t => {
            const {active: n, over: s} = t;
            if (!s || !e)
                return;
            if (n.id === s.id)
                return void h(null);
            const a = String(n.id)
              , c = m(s.id)
              , u = e.options.some(e => g(e) === a)
              , f = e.questions.some(e => m(e.questionNumber) === c)
              , x = e.questions.some(e => m(e.questionNumber) === m(a));
            u && f ? ( () => {
                const e = m(s.id)
                  , t = String(n.id);
                o[e] && v(o[e]),
                r?.(e, t),
                l(n => ({
                    ...n,
                    [e]: t
                })),
                d(e => e.filter(e => g(e) !== t))
            }
            )() : x && "options" === s.id ? ( () => {
                const e = m(n.id)
                  , t = o[e];
                t && (r?.(e, ""),
                v(t),
                l(t => {
                    const n = {
                        ...t
                    };
                    return delete n[e],
                    n
                }
                ))
            }
            )() : x && f && ( () => {
                const e = m(n.id)
                  , t = m(s.id)
                  , i = o[e];
                o[t] && v(o[t]),
                l(n => {
                    const r = {
                        ...n
                    };
                    return delete r[e],
                    {
                        ...r,
                        [t]: i
                    }
                }
                ),
                r?.(t, i),
                r?.(e, "")
            }
            )(),
            h(null),
            p(null),
            i && i(null)
        }
        ,
        handleQuestionClick: b,
        handleQuestionDoubleClick: t => {
            if (!e)
                return;
            const n = m(t)
              , s = o[n];
            s && (r?.(n, ""),
            v(s),
            l(e => {
                const t = {
                    ...e
                };
                return delete t[n],
                t
            }
            ))
        }
        ,
        setActiveId: h
    }
}
  , un = ({questionNumber: t, answeredOption: n, isSelected: r, dynamicWidth: s, onClick: i, onDoubleClick: o}) => e.jsx(rn, {
    id: t,
    isOptionArea: !1,
    isEmpty: !n,
    children: e.jsx("div", {
        id: `question-${t}`,
        onClick: i,
        onDoubleClick: o,
        style: ( () => {
            if (s)
                return {
                    width: `${s}px`
                }
        }
        )(),
        className: `\n          select-none h-6 inline-flex items-center justify-center rounded-md\n          ${r ? "border-2 border-sky-500 border-dashed" : ""}\n        `,
        children: n ? e.jsx(nn, {
            id: t,
            children: n
        }) : e.jsx("span", {
            className: "font-semibold",
            children: t
        })
    })
})
  , hn = ({optionsTitle: t="", options: n, orientation: r="vertical", allOptions: s}) => {
    const i = "vertical" === r
      , o = s || n
      , a = new Set(n.map(e => "object" == typeof e ? e.id : e));
    return e.jsxs(e.Fragment, {
        children: [t && e.jsx("h4", {
            className: "text-md font-semibold pb-5",
            children: t
        }), e.jsx(rn, {
            id: "options",
            isOptionArea: !0,
            children: e.jsx("div", {
                className: "select-none min-w-40 flex flex-wrap gap-2 " + (i ? "flex-col" : "flex-row"),
                children: o.map(t => {
                    const n = "object" == typeof t ? t.id : t
                      , r = "object" == typeof t ? t.text : t
                      , s = a.has(n);
                    return e.jsx("div", {
                        className: i ? "flex-shrink-0" : "",
                        children: s ? e.jsx(nn, {
                            id: n,
                            isOptionArea: !0,
                            children: r
                        }) : e.jsx("div", {
                            className: "invisible pointer-events-none",
                            children: e.jsx(nn, {
                                id: n,
                                isOptionArea: !0,
                                children: r
                            })
                        })
                    }, n)
                }
                )
            })
        })]
    })
}
  , fn = ({questionGroup: t, examStore: n, children: s}) => {
    const {flaggedQuestions: i={}, toggleQuestionFlag: o, activeQuestionId: a} = n
      , c = l.useRef(null)
      , [d,u] = l.useState({})
      , h = l.useMemo( () => {
        const e = [];
        for (let n = t.from; n <= t.to; n++)
            e.push(n.toString());
        return e
    }
    , [t.from, t.to]);
    l.useEffect( () => {
        if (!o)
            return;
        const e = () => {
            const e = c.current;
            if (!e)
                return;
            const t = e.getBoundingClientRect()
              , n = {};
            h.forEach(e => {
                const r = document.getElementById(`question-${e}`);
                if (r) {
                    const s = r.getBoundingClientRect()
                      , i = s.top - t.top + (s.height - 28) / 2;
                    n[e] = i
                }
            }
            ),
            u(n)
        }
        ;
        e();
        const t = new ResizeObserver( () => {
            e()
        }
        )
          , n = c.current;
        n && t.observe(n);
        const r = setTimeout(e, 150);
        return () => {
            t.disconnect(),
            clearTimeout(r)
        }
    }
    , [h, o, a]);
    const f = l.useMemo( () => {
        const e = [];
        return h.filter(e => void 0 !== d[e]).sort( (e, t) => d[e] - d[t]).forEach(t => {
            const n = d[t]
              , r = e.find(e => Math.abs(e.top - n) < 8);
            r ? r.qNums.push(t) : e.push({
                top: n,
                qNums: [t]
            })
        }
        ),
        e
    }
    , [h, d])
      , p = l.useMemo( () => 0 === f.length ? 1 : Math.max(...f.map(e => e.qNums.length)), [f])
      , m = 24 * Math.max(1, p);
    return e.jsxs("div", {
        ref: c,
        className: "relative flex items-start w-full",
        children: [e.jsx("div", {
            className: "flex-1 min-w-0",
            children: s
        }), o && e.jsx("div", {
            className: "relative self-stretch select-none flex-shrink-0 transition-all duration-150",
            style: {
                width: `${m}px`
            },
            "aria-hidden": "true",
            children: f.map( (t, n) => e.jsx("div", {
                className: "absolute flex flex-row items-center gap-0.5 transition-all duration-150",
                style: {
                    top: `${t.top}px`,
                    left: 0
                },
                children: t.qNums.map(t => {
                    const n = Boolean(i[t])
                      , s = a === t;
                    return e.jsx(r, {
                        questionId: t,
                        isFlagged: n,
                        isActive: s,
                        onClick: e => {
                            e.stopPropagation(),
                            o(t)
                        }
                    }, t)
                }
                )
            }, n))
        })]
    })
}
  , pn = e => {
    if (!Array.isArray(e) || 0 === e.length)
        return 120;
    let t = 0;
    e.forEach(e => {
        const n = "object" == typeof e ? e.text : e;
        if (n) {
            const e = mn(n);
            e > t && (t = e)
        }
    }
    );
    const n = t + 35
      , r = Math.max(n, 120);
    return 5 * Math.ceil(r / 5)
}
  , mn = e => {
    let t = 0;
    for (let n = 0; n < e.length; n++) {
        const r = e[n];
        /[mwMW@%]/.test(r) ? t += 11 : /[ABCDEFGHIJKLNOPQRSTUVWXYZ0-9&#]/.test(r) ? t += 8.5 : /[abcdefghknopqrsuvwxyz]/.test(r) ? t += 8 : t += " " === r ? 6 : 7
    }
    return t
}
  , gn = ({questionGroup: t, examStore: r}) => {
    const s = t.content
      , i = "sections"in s
      , a = i ? function(e) {
        const t = [];
        return e.sections.forEach(e => {
            e.items.forEach(e => {
                e.questionNumber && t.push({
                    questionNumber: e.questionNumber,
                    text: e.text || "",
                    prefix: e.prefix,
                    suffix: e.suffix,
                    answerId: null
                })
            }
            )
        }
        ),
        {
            questionsTitle: e.questionsTitle || "",
            questions: t,
            optionsTitle: e.optionsTitle,
            options: e.options
        }
    }(s) : s
      , {options: l, activeId: c, selectedQuestionId: d, sensors: u, handleDragEnd: h, handleQuestionClick: f, handleQuestionDoubleClick: p, answers: m} = dn(a, r)
      , {activeQuestionId: g, toggleQuestionFlag: x, flaggedQuestions: b={}, section: y} = r
      , w = e => "object" == typeof e ? e.text : e
      , N = e => "object" == typeof e ? e.id : e
      , j = a.options.find(e => N(e) === c)
      , C = j ? w(j) : void 0
      , S = (n, r, s, i) => {
        const o = n.questionNumber ? `q-${n.questionNumber}` : `item-${i}-${r}`
          , l = ( (e, t) => e.listStyle || t.listStyle || "plain")(n, s)
          , c = (e => {
            switch (e) {
            case "dash":
                return "list-none pl-8";
            case "plain":
                return "list-none";
            default:
                return "list-disc pl-5"
            }
        }
        )(l)
          , u = D()
          , h = ( (t, n) => {
            if (t.questionNumber) {
                const r = String(t.questionNumber)
                  , s = m[r]
                  , i = a.options.find(e => N(e) === s)
                  , o = i ? w(i) : void 0
                  , l = e.jsx(un, {
                    questionNumber: r,
                    answeredOption: o,
                    dynamicWidth: pn(a.options),
                    isSelected: d === r,
                    onClick: () => f(r),
                    onDoubleClick: () => p(r)
                });
                return e.jsx("span", {
                    className: "flex flex-row items-center justify-between w-full gap-2",
                    children: e.jsxs("span", {
                        className: "inline-flex flex-wrap gap-1 items-center flex-1",
                        children: [t.prefix && e.jsx(v, {
                            regionId: `${n}-prefix`,
                            text: t.prefix,
                            as: "span"
                        }), l, t.suffix && e.jsx(v, {
                            regionId: `${n}-suffix`,
                            text: t.suffix,
                            as: "span"
                        })]
                    })
                })
            }
            return e.jsx(v, {
                regionId: n,
                text: t.text || "",
                as: "span"
            })
        }
        )(n, `flowchart-${t.id}-s${i}-i${r}`);
        return "dash" === l ? e.jsx("li", {
            className: "list-none",
            children: e.jsxs("div", {
                className: `flex items-start gap-2 ${R()}`,
                children: [e.jsx("span", {
                    children: "–"
                }), e.jsx("div", {
                    className: `min-w-0 ${u}`,
                    children: h
                })]
            })
        }, o) : e.jsx("li", {
            className: `${c} ${u}`,
            children: h
        }, o)
    }
      , E = (n, r) => {
        const s = D();
        return e.jsxs("div", {
            className: "border border-slate-200 shadow-sm p-3 rounded-lg w-full max-w-full",
            children: [n.title && e.jsx("h5", {
                className: `font-bold mb-3 ${s}`,
                children: e.jsx(v, {
                    regionId: `flowchart-section-${t.id}-${r}`,
                    text: n.title,
                    as: "span"
                })
            }), n.items && n.items.length > 0 && e.jsx("ul", {
                className: `list-inside space-y-2 ${s}`,
                children: n.items.map( (e, t) => S(e, t, n, r))
            })]
        }, `section-${r}`)
    }
    ;
    if (!i)
        return function(t, r, s, i) {
            const {options: a, activeId: l, selectedQuestionId: c, sensors: d, handleDragEnd: u, handleQuestionClick: h, handleQuestionDoubleClick: f, answers: p, activeOptionText: m, getOptionText: g, getOptionId: x} = i
              , {activeQuestionId: b, toggleQuestionFlag: y, flaggedQuestions: w={}, section: N} = r;
            return e.jsxs("div", {
                className: "space-y-8",
                children: [e.jsx(n, {
                    questionGroup: t
                }), e.jsxs(Bt, {
                    sensors: d,
                    collisionDetection: he,
                    onDragEnd: u,
                    autoScroll: !1,
                    children: [e.jsxs("div", {
                        className: "flex gap-10 lg:gap-16",
                        children: [e.jsx("div", {
                            className: "flex-grow max-w-2xl",
                            children: e.jsxs(fn, {
                                questionGroup: t,
                                examStore: r,
                                children: [e.jsx("h2", {
                                    className: "text-md font-semibold pb-6",
                                    children: s.questionsTitle
                                }), e.jsx("div", {
                                    children: s.questions.map( (n, r) => {
                                        const i = n.prefix || n.suffix
                                          , a = String(n.questionNumber)
                                          , l = () => {
                                            const o = ( () => {
                                                const e = p[a]
                                                  , t = s.options.find(t => x(t) === e);
                                                return t ? g(t) : void 0
                                            }
                                            )()
                                              , l = e.jsx(un, {
                                                questionNumber: a,
                                                answeredOption: o,
                                                dynamicWidth: pn(s.options),
                                                isSelected: c === a,
                                                onClick: () => h(a),
                                                onDoubleClick: () => f(a)
                                            });
                                            return i ? e.jsxs(e.Fragment, {
                                                children: [n.prefix && e.jsx(v, {
                                                    regionId: `flowchart-completion-${t.id}-${r}-prefix`,
                                                    text: n.prefix,
                                                    as: "span"
                                                }), n.text && e.jsx(v, {
                                                    regionId: `flowchart-completion-${t.id}-${r}`,
                                                    text: n.text,
                                                    as: "span"
                                                }), e.jsx("div", {
                                                    children: l
                                                }), n.suffix && e.jsx(v, {
                                                    regionId: `flowchart-completion-${t.id}-${r}-suffix`,
                                                    text: n.suffix,
                                                    as: "span"
                                                })]
                                            }) : n.text ? e.jsxs(e.Fragment, {
                                                children: [e.jsx(v, {
                                                    regionId: `flowchart-completion-${t.id}-${r}`,
                                                    text: n.text,
                                                    as: "span"
                                                }), e.jsx("div", {
                                                    children: l
                                                })]
                                            }) : e.jsx("div", {
                                                children: l
                                            })
                                        }
                                        ;
                                        return e.jsxs("div", {
                                            className: "relative",
                                            children: [e.jsx("div", {
                                                className: "flex flex-row items-center justify-between w-full gap-2 border border-slate-200 shadow-sm p-3 rounded-lg",
                                                children: e.jsx("div", {
                                                    className: "flex flex-wrap gap-2 items-center flex-1",
                                                    children: l()
                                                })
                                            }), r < s.questions.length - 1 && e.jsx("div", {
                                                className: "my-2 w-full flex justify-center items-center",
                                                children: e.jsx(o, {
                                                    size: 25,
                                                    strokeWidth: 3
                                                })
                                            })]
                                        }, n.questionNumber)
                                    }
                                    )
                                })]
                            })
                        }), e.jsx("div", {
                            className: "w-1/4",
                            children: e.jsx("div", {
                                className: "sticky top-24",
                                children: e.jsx(hn, {
                                    optionsTitle: s.optionsTitle,
                                    options: a,
                                    allOptions: s.options
                                })
                            })
                        })]
                    }), e.jsx(sn, {
                        activeId: l,
                        activeOption: m
                    })]
                })]
            })
        }(t, r, a, {
            options: l,
            activeId: c,
            selectedQuestionId: d,
            sensors: u,
            handleDragEnd: h,
            handleQuestionClick: f,
            handleQuestionDoubleClick: p,
            answers: m,
            activeOptionText: C,
            getOptionText: w,
            getOptionId: N
        });
    const q = s
      , k = () => {
        const e = q.align || "left";
        return "center" === e || "right" === e ? e : "left"
    }
      , D = () => {
        switch (k()) {
        case "left":
            return "text-left";
        case "right":
            return "text-right";
        default:
            return "text-center"
        }
    }
      , R = () => {
        switch (k()) {
        case "left":
            return "justify-start";
        case "right":
            return "justify-end";
        default:
            return "justify-center"
        }
    }
    ;
    return e.jsxs("div", {
        className: "space-y-8",
        children: [e.jsx(n, {
            questionGroup: t
        }), e.jsxs(Bt, {
            sensors: u,
            collisionDetection: he,
            onDragEnd: h,
            autoScroll: !1,
            children: [e.jsxs("div", {
                className: "flex gap-10 lg:gap-16",
                children: [e.jsx("div", {
                    className: "flex-grow max-w-2xl",
                    children: e.jsxs(fn, {
                        questionGroup: t,
                        examStore: r,
                        children: [q.questionsTitle && e.jsx("h2", {
                            className: "text-md font-semibold pb-6",
                            children: q.questionsTitle
                        }), e.jsx("div", {
                            children: e.jsx("div", {
                                className: `grid w-fit max-w-full ${( () => {
                                    switch (k()) {
                                    case "left":
                                        return "mr-auto";
                                    case "right":
                                        return "ml-auto";
                                    default:
                                        return "mx-auto"
                                    }
                                }
                                )()}`,
                                children: q.sections.map( (t, n) => e.jsxs("div", {
                                    className: "w-full",
                                    children: [E(t, n), n < q.sections.length - 1 && e.jsx("div", {
                                        className: "my-2 w-full flex justify-center items-center",
                                        children: e.jsx(o, {
                                            size: 25,
                                            strokeWidth: 3
                                        })
                                    })]
                                }, `section-${n}`))
                            })
                        })]
                    })
                }), e.jsx("div", {
                    className: "w-1/4",
                    children: e.jsx("div", {
                        className: "sticky top-24",
                        children: e.jsx(hn, {
                            optionsTitle: q.optionsTitle,
                            options: l,
                            allOptions: a.options
                        })
                    })
                })]
            }), e.jsx(sn, {
                activeId: c,
                activeOption: C
            })]
        })]
    })
}
;
const xn = ({questionGroup: t, examStore: s}) => {
    const i = t.content
      , {options: o, activeId: a, selectedQuestionId: l, sensors: c, handleDragEnd: d, handleQuestionClick: u, handleQuestionDoubleClick: h, answers: f} = dn(i, s)
      , {activeQuestionId: p, toggleQuestionFlag: m, flaggedQuestions: g={}, section: x} = s
      , b = e => "object" == typeof e ? e.text : e
      , y = e => "object" == typeof e ? e.id : e
      , w = i.options.find(e => y(e) === a)
      , N = w ? b(w) : void 0
      , j = (e => !!e.passageId)(t)
      , C = ( (e, t) => {
        if (e.passageId) {
            const e = t.questions.some(e => e.text && e.text.length > 40)
              , n = t.options.some(e => {
                const t = "object" == typeof e ? e.text : e;
                return t && t.length > 50
            }
            );
            return e || n
        }
        return t.questions.some(e => e.text && e.text.length > 70)
    }
    )(t, i);
    if (!i || !i.questions || !i.options)
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsx(n, {
                questionGroup: t
            }), e.jsx("div", {
                className: "text-red-500",
                children: "Invalid matching question content"
            })]
        });
    const S = () => e.jsxs("div", {
        children: [i.questionsTitle && e.jsx("h5", {
            className: "font-bold pb-5",
            children: i.questionsTitle
        }), e.jsx("div", {
            className: "space-y-4",
            children: i.questions.map(n => {
                const s = String(n.questionNumber)
                  , o = f[s]
                  , a = i.options.find(e => y(e) === o)
                  , c = a ? b(a) : void 0
                  , d = p === s || l === s
                  , x = Boolean(g[s]);
                return e.jsxs("div", {
                    className: "flex flex-row items-center justify-between w-full gap-5",
                    children: [e.jsxs("div", {
                        className: C ? "space-y-1 flex-1" : "flex items-center gap-5 flex-1",
                        children: [e.jsx("div", {
                            children: e.jsx(v, {
                                regionId: `matching-question-${t.id}-${n.questionNumber}`,
                                text: n.text,
                                as: "span"
                            })
                        }), e.jsx("div", {
                            className: C ? "w-fit" : "",
                            children: e.jsx(un, {
                                questionNumber: s,
                                answeredOption: c,
                                isSelected: l === s,
                                dynamicWidth: pn(i.options),
                                onClick: () => u(s),
                                onDoubleClick: () => h(s)
                            })
                        })]
                    }), m && e.jsx(r, {
                        questionId: s,
                        isFlagged: x,
                        isActive: d,
                        onClick: e => {
                            e.preventDefault(),
                            e.stopPropagation(),
                            m(s)
                        }
                    })]
                }, n.questionNumber)
            }
            )
        })]
    })
      , E = () => e.jsx("div", {
        children: e.jsx(hn, {
            optionsTitle: i.optionsTitle,
            options: o,
            allOptions: i.options,
            orientation: "vertical"
        })
    });
    return e.jsxs("div", {
        className: "space-y-8",
        children: [e.jsx(n, {
            questionGroup: t
        }), e.jsxs(Bt, {
            sensors: c,
            collisionDetection: e => ge(e),
            onDragEnd: d,
            autoScroll: !1,
            children: [j ? e.jsxs("div", {
                className: "space-y-8",
                children: [S(), E()]
            }) : e.jsxs("div", {
                className: "flex gap-20 min-h-96",
                children: [S(), E()]
            }), e.jsx(sn, {
                activeId: a,
                activeOption: N
            })]
        })]
    })
}
  , vn = ({prefix: t="", suffix: n="", questionNumber: r, value: s="", size: i="md", setValue: o= () => {}
, examStore: l}) => {
    const {activeQuestionId: c, flaggedQuestions: d={}, setActiveQuestion: u, toggleQuestionFlag: h, section: f} = l
      , [p,m] = a.useState(!1)
      , [g,x] = a.useState(!s)
      , [b,y] = a.useState(s)
      , w = a.useRef(null);
    a.useEffect( () => {
        x(!b && !p)
    }
    , [b, p]),
    a.useEffect( () => {
        y(s)
    }
    , [s]);
    Boolean(d[r]);
    const N = (e => {
        switch (e) {
        case "lg":
            return 22;
        case "md":
            return 18;
        case "sm":
            return 10;
        default:
            return 14
        }
    }
    )(i);
    return e.jsxs("span", {
        className: "text-base cursor-text",
        children: [t && t.trim() && e.jsx(v, {
            regionId: `exam-input-${r}-prefix`,
            text: t.trim(),
            as: "span"
        }), e.jsx("span", {
            className: "inline-flex items-center gap-1 align-middle mx-2",
            children: e.jsxs("span", {
                className: "relative inline-grid",
                style: {
                    gridTemplateColumns: "minmax(0, 1fr)",
                    minWidth: `${N}ch`
                },
                children: [e.jsxs("span", {
                    className: "invisible whitespace-pre px-2 pointer-events-none text-base",
                    style: {
                        gridArea: "1 / 1"
                    },
                    children: [b || r, " "]
                }), e.jsx("input", {
                    id: `question-${r}`,
                    ref: w,
                    spellCheck: "false",
                    type: "text",
                    inputMode: "text",
                    autoComplete: "off",
                    autoCapitalize: "off",
                    autoCorrect: "off",
                    value: b,
                    onChange: e => {
                        y(e.target.value),
                        o(e.target.value)
                    }
                    ,
                    onFocus: () => {
                        u?.(r),
                        m(!0),
                        x(!1)
                    }
                    ,
                    onBlur: () => {
                        m(!1),
                        x(!w.current?.value)
                    }
                    ,
                    onClick: e => {
                        e.preventDefault(),
                        e.stopPropagation(),
                        w.current && (w.current.focus(),
                        w.current.click())
                    }
                    ,
                    className: `           \n              h-6 max-w-full border border-blue-500 rounded px-2 bg-background focus:outline-none w-full\n              ${p ? "ring-2 ring-inset ring-sky-600 border-sky-600" : "border-gray-500"}\n            `,
                    style: {
                        WebkitTapHighlightColor: "transparent",
                        WebkitUserSelect: "text",
                        gridArea: "1 / 1"
                    }
                }), g && e.jsx("span", {
                    className: "\n                absolute inset-0 flex items-center justify-center\n                pointer-events-none text-primary font-semibold\n              ",
                    style: {
                        WebkitTapHighlightColor: "transparent",
                        WebkitUserSelect: "none"
                    },
                    children: r
                })]
            })
        }), n && n.trim() && e.jsx(v, {
            regionId: `exam-input-${r}-suffix`,
            text: n.trim(),
            as: "span"
        })]
    })
}
  , bn = ({questionGroup: t, children: r, showHeaderContentTitle: s=!0}) => e.jsxs("div", {
    className: "space-y-4",
    children: [e.jsx(n, {
        questionGroup: t,
        showContentTitle: s
    }), r]
})
  , yn = ({questionGroup: t, examStore: n}) => {
    const r = t.content
      , {answers: s={}, setAnswer: i} = n
      , o = (e, t) => {
        i?.(e.toString(), t)
    }
    ;
    return e.jsx(fn, {
        questionGroup: t,
        examStore: n,
        children: e.jsxs(bn, {
            questionGroup: t,
            showHeaderContentTitle: !1,
            children: [r.title && e.jsx("div", {
                className: "mb-6 text-center",
                children: e.jsx("h4", {
                    className: "font-bold",
                    children: e.jsx(v, {
                        regionId: `summary-completion-title-${t.id}`,
                        text: r.title,
                        as: "span"
                    })
                })
            }), r.imageUrl && e.jsx("div", {
                className: "mb-4",
                children: e.jsx("img", {
                    src: r.imageUrl,
                    alt: "Summary diagram",
                    className: "max-w-full h-auto"
                })
            }), e.jsx("div", {
                className: "text-base leading-relaxed",
                children: ( () => {
                    const i = r.summaryText.split(/(\[\d+])/g);
                    return i.map( (r, a) => {
                        const c = r.match(/\[(\d+)]/);
                        if (c) {
                            const t = parseInt(c[1])
                              , r = s[t.toString()] || "";
                            return e.jsx(vn, {
                                questionNumber: t.toString(),
                                value: r,
                                setValue: e => o(t, e),
                                examStore: n
                            }, a)
                        }
                        const d = r.split("\n\n")
                          , u = a > 0
                          , h = a < i.length - 1;
                        return e.jsx(l.Fragment, {
                            children: d.map( (n, r) => {
                                let s = n;
                                return 0 === r && u && (s = s.trimStart()),
                                r === d.length - 1 && h && (s = s.trimEnd()),
                                e.jsx(l.Fragment, {
                                    children: 2 == d.length && 1 == r ? e.jsxs("span", {
                                        children: [e.jsx("br", {}), e.jsx("br", {}), e.jsx(v, {
                                            regionId: `summary-completion-${t.from}-${t.to}-part-${a}-p-${r}`,
                                            text: s,
                                            as: "span"
                                        })]
                                    }, `span-${a}-${r}`) : e.jsx(v, {
                                        regionId: `summary-completion-${t.from}-${t.to}-part-${a}-p-${r}`,
                                        text: s,
                                        as: "span"
                                    }, `span-${a}-${r}`)
                                }, `paragraph-${a}-${r}`)
                            }
                            )
                        }, a)
                    }
                    )
                }
                )()
            }), r.sections && r.sections.map(t => e.jsxs("div", {
                className: "",
                children: [t.title && e.jsx("h3", {
                    className: "font-semibold text-lg",
                    children: t.title
                }), e.jsx("div", {
                    className: "text-base leading-relaxed",
                    children: t.fields.map(t => {
                        if (t.isStatic && t.staticText)
                            return e.jsxs("span", {
                                children: [t.staticText, " "]
                            }, t.id);
                        const r = t.questionNumber;
                        if (!r)
                            return null;
                        const i = s[r.toString()] || "";
                        return e.jsx(vn, {
                            prefix: t.prefix || "",
                            suffix: t.suffix || "",
                            questionNumber: r.toString(),
                            value: i,
                            setValue: e => o(r, e),
                            examStore: n
                        }, t.id)
                    }
                    )
                })]
            }, t.id))]
        })
    })
}
  , wn = ({firstColumnHeader: t, firstColumnMinWidth: n, columns: s, rows: i, answers: o, activeQuestionId: a, onCellClick: c, onRowClick: d, toggleQuestionFlag: u, flaggedQuestions: h={}, section: f}) => {
    const p = l.useRef(null)
      , m = l.useRef({})
      , [g,x] = l.useState({});
    return l.useEffect( () => {
        if (!u)
            return;
        const e = () => {
            const e = {}
              , t = p.current;
            if (!t)
                return;
            const n = t.getBoundingClientRect();
            i.forEach(t => {
                const r = m.current[t.questionId];
                if (r) {
                    const s = r.getBoundingClientRect();
                    e[t.questionId] = {
                        top: s.top - n.top,
                        height: s.height
                    }
                }
            }
            ),
            x(e)
        }
        ;
        e();
        const t = new ResizeObserver( () => {
            e()
        }
        )
          , n = p.current;
        return n && t.observe(n),
        i.forEach(e => {
            const n = m.current[e.questionId];
            n && t.observe(n)
        }
        ),
        () => {
            t.disconnect()
        }
    }
    , [i, u, a]),
    e.jsxs("div", {
        ref: p,
        className: "relative flex gap-2 items-start w-fit max-w-5xl",
        children: [e.jsx("div", {
            className: "overflow-x-auto flex-1",
            children: e.jsx("div", {
                className: "w-fit max-w-4xl p-4 border border-gray-500 h-fit py-6",
                children: e.jsxs("table", {
                    className: "h-full w-full border-collapse",
                    children: [e.jsx("thead", {
                        children: e.jsxs("tr", {
                            children: [e.jsx("th", {
                                className: `whitespace-nowrap border-primary dark:border-white px-3 py-2 ${n || ""}`,
                                children: t
                            }), s.map( (t, n) => e.jsx("th", {
                                className: "whitespace-nowrap border-primary dark:border-white p-3 text-center " + (0 === n ? "border-l-2" : "border-l"),
                                children: t.id
                            }, t.id))]
                        })
                    }), e.jsx("tbody", {
                        children: i.map( (t, n) => {
                            const r = a === t.questionId;
                            return e.jsxs("tr", {
                                ref: e => {
                                    m.current[t.questionId] = e
                                }
                                ,
                                className: "border-primary dark:border-white h-full " + (0 === n ? "border-t-2" : "border-t"),
                                onClick: () => {
                                    window.getSelection()?.toString() || d?.(t.questionId)
                                }
                                ,
                                children: [e.jsx("td", {
                                    className: "flex p-2 items-center flex-1 justify-between",
                                    children: e.jsxs("div", {
                                        className: "flex gap-2 items-center flex-1",
                                        children: [e.jsx("div", {
                                            id: `question-${t.questionId}`,
                                            className: "font-bold border whitespace-nowrap rounded-[4px] min-w-7 px-1 flex items-center justify-center " + (r ? "border-2 border-blue-500" : "border-2 border-transparent"),
                                            children: t.questionNumber
                                        }), e.jsx("div", {
                                            className: "flex-1",
                                            onMouseDown: e => e.stopPropagation(),
                                            children: e.jsx(v, {
                                                regionId: t.highlightRegionId,
                                                text: t.text,
                                                as: "span"
                                            })
                                        })]
                                    })
                                }), s.map( (n, r) => {
                                    const s = o[t.questionId] === n.id;
                                    return e.jsx("td", {
                                        className: "border-0 border-primary dark:border-white h-full p-0 " + (0 === r ? "border-l-2" : "border-l"),
                                        children: e.jsx("div", {
                                            role: "radio",
                                            "aria-checked": s,
                                            className: "w-full min-h-full flex items-center justify-center duration-200 cursor-pointer p-2.5 min-w-12 h-full flex-1 " + (s ? "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/60 dark:hover:bg-blue-800/80" : "hover:bg-[#e4e4e4] dark:hover:bg-white/10"),
                                            onClick: e => {
                                                e.stopPropagation(),
                                                c(t.questionId, n.id)
                                            }
                                            ,
                                            children: e.jsx("input", {
                                                type: "radio",
                                                className: "w-3.5 h-3.5 cursor-pointer pointer-events-none",
                                                checked: s,
                                                readOnly: !0,
                                                "aria-label": `Question ${t.questionId} answer ${n.id}`
                                            })
                                        })
                                    }, `${t.questionId}-${n.id}`)
                                }
                                )]
                            }, t.questionId)
                        }
                        )
                    })]
                })
            })
        }), u && e.jsx("div", {
            className: "w-4 relative self-stretch select-none flex-shrink-0",
            "aria-hidden": "true",
            children: i.map(t => {
                const n = g[t.questionId];
                if (!n)
                    return null;
                const s = Boolean(h[t.questionId])
                  , i = a === t.questionId;
                return e.jsx("div", {
                    className: "absolute",
                    style: {
                        top: `${n.top + (n.height - 28) / 2}px`,
                        left: 0
                    },
                    children: e.jsx(r, {
                        questionId: t.questionId,
                        isFlagged: s,
                        isActive: i,
                        onClick: e => {
                            e.stopPropagation(),
                            u(t.questionId)
                        }
                    })
                }, t.questionId)
            }
            )
        })]
    })
}
  , Nn = ({questionGroup: t, examStore: r}) => {
    const {answers: s={}, activeQuestionId: i, setAnswer: o, setActiveQuestion: a, toggleQuestionFlag: l, flaggedQuestions: c={}, section: d} = r
      , u = t.content
      , {items: h, questions: f, questionsTitle: p, itemsTitle: m} = "features"in (g = u) ? {
        items: g.features,
        questions: g.questions,
        questionsTitle: g.questionsTitle,
        itemsTitle: g.featuresTitle || g.featureTitle
    } : {
        items: g.headings,
        questions: g.questions,
        questionsTitle: g.questionsTitle,
        itemsTitle: g.optionsTitle
    };
    var g;
    return e.jsxs("div", {
        className: "space-y-6",
        children: [e.jsx(n, {
            questionGroup: t
        }), e.jsx(wn, {
            firstColumnHeader: p || "Items",
            firstColumnMinWidth: "min-w-[300px]",
            columns: h.map(e => ({
                id: e.id
            })),
            rows: f.map(e => ({
                questionId: e.questionNumber.toString(),
                questionNumber: e.questionNumber,
                text: e.text,
                highlightRegionId: `matching-features-question-${t.id}-${e.questionNumber}`
            })),
            activeQuestionId: i,
            answers: s,
            onCellClick: (e, t) => {
                setTimeout( () => {
                    a?.(e);
                    const n = s[e] === t ? "" : t;
                    o?.(e, n)
                }
                , 0)
            }
            ,
            onRowClick: a,
            toggleQuestionFlag: l,
            flaggedQuestions: c,
            section: d
        }), e.jsx("div", {
            className: "w-fit",
            children: e.jsxs("table", {
                className: "border-collapse",
                children: [e.jsx("thead", {
                    children: e.jsx("tr", {
                        children: e.jsx("th", {
                            colSpan: 2,
                            className: "border border-primary px-4 py-3 font-bold text-center whitespace-nowrap",
                            children: m || ("features"in u ? "List of Features" : "List of Headings")
                        })
                    })
                }), e.jsx("tbody", {
                    children: h.map(n => e.jsxs("tr", {
                        children: [e.jsx("td", {
                            className: "border border-primary p-2 font-bold text-center align-middle",
                            children: n.id
                        }), e.jsx("td", {
                            className: "border border-primary px-4 py-2 align-middle",
                            children: e.jsx(v, {
                                regionId: `matching-items-${t.id}-${n.id}`,
                                text: n.text,
                                as: "span"
                            })
                        })]
                    }, n.id))
                })]
            })
        })]
    })
}
  , jn = ({questionGroup: t, examStore: r}) => {
    const {answers: s={}, setAnswer: i} = r
      , o = t.content
      , a = (n, o, a, l) => {
        const c = `table-cell-${t.id}-${a}-${l}-${o}`;
        return void 0 !== n.questionNumber ? e.jsx(vn, {
            prefix: n.prefix || "",
            suffix: n.suffix || "",
            questionNumber: n.questionNumber.toString(),
            value: s[n.questionNumber] || "",
            setValue: e => i?.(n.questionNumber?.toString(), e),
            examStore: r
        }) : void 0 !== n.text ? e.jsx(v, {
            regionId: c,
            text: n.text,
            as: "span"
        }) : null
    }
      , l = (t, n, r) => {
        const s = (e => e.listStyle ?? o.listStyle ?? "bullet")(t);
        if (1 === t.items.length)
            return a(t.items[0], 0, n, r);
        const i = (e => {
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
        return e.jsx("ul", {
            className: `list-inside space-y-2 ${i}`,
            children: t.items.map( (t, i) => {
                const o = a(t, i, n, r);
                return "dash" === s || "nested" === s ? e.jsx("li", {
                    className: "list-none",
                    children: e.jsxs("div", {
                        className: "flex items-start",
                        children: [e.jsx("span", {
                            className: "mr-2",
                            children: "–"
                        }), e.jsx("div", {
                            className: "flex-1",
                            children: o
                        })]
                    })
                }, i) : e.jsx("li", {
                    children: o
                }, i)
            }
            )
        })
    }
      , c = (n, o, a) => {
        switch (n.type) {
        case "QUESTION":
            return e.jsx(vn, {
                prefix: n.prefix || "",
                suffix: n.suffix || "",
                questionNumber: n.questionNumber.toString(),
                value: s[n.questionNumber] || "",
                setValue: e => i?.(n.questionNumber.toString(), e),
                examStore: r
            });
        case "ROW_HEADER":
        case "STATIC":
            {
                const r = `table-cell-${t.id}-${o}-${a}`;
                return e.jsx(v, {
                    regionId: r,
                    text: n.text || "",
                    as: "span"
                })
            }
        case "CELL_GROUP":
            return l(n, o, a);
        default:
            return null
        }
    }
    ;
    return e.jsx(fn, {
        questionGroup: t,
        examStore: r,
        children: e.jsxs("div", {
            className: "space-y-4 w-full",
            children: [e.jsx(n, {
                questionGroup: t
            }), e.jsx("div", {
                className: "overflow-x-auto w-full",
                children: e.jsx("div", {
                    className: "w-full max-w-4xl",
                    children: e.jsxs("table", {
                        className: "w-full border-collapse",
                        children: [o.title && e.jsx("caption", {
                            className: "p-3 font-bold text-center border border-b-0 border-primary",
                            children: e.jsx(v, {
                                regionId: `table-title-${t.id}`,
                                text: o.title,
                                as: "span"
                            })
                        }), e.jsx("thead", {
                            children: e.jsx("tr", {
                                children: o.headers && o.headers.map( (n, r) => e.jsx("th", {
                                    className: "p-3 border border-primary font-semibold text-left",
                                    children: e.jsx(v, {
                                        regionId: `table-header-${t.id}-${r}`,
                                        text: n.text,
                                        as: "span"
                                    })
                                }, r))
                            })
                        }), e.jsx("tbody", {
                            children: o.rows.map( (t, n) => e.jsx("tr", {
                                children: t.map( (t, r) => "ROW_HEADER" === t.type ? e.jsx("th", {
                                    scope: "row",
                                    className: "p-3 border border-primary font-semibold text-left align-top",
                                    children: c(t, n, r)
                                }, r) : e.jsx("td", {
                                    className: "p-3 border border-primary align-top",
                                    children: c(t, n, r)
                                }, r))
                            }, n))
                        })]
                    })
                })
            })]
        })
    })
}
  , Cn = ({questionGroup: t, examStore: n, hideHeader: r=!1}) => {
    const s = t.content
      , {answers: i={}, setAnswer: o} = n
      , a = "SENTENCE_COMPLETION" === t.type
      , l = (t, n) => {
        if (!n)
            return null;
        return n.split(/(\*\*[^*]+\*\*)/g).map( (n, r) => n.startsWith("**") && n.endsWith("**") ? e.jsx("span", {
            className: "font-semibold",
            children: n.slice(2, -2)
        }, r) : e.jsx(v, {
            regionId: t,
            text: n,
            as: "span"
        }, r))
    }
      , c = (r, a, c, d) => {
        const u = ( (e, t, n, r) => e.questionNumber ? `q-${e.questionNumber}` : `item-${t.title || r}-${n}`)(r, c, a, d)
          , h = ( (e, t) => e.listStyle || t.listStyle || s.listStyle || "bullet")(r, c)
          , f = (e => {
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
        )(h)
          , p = ( (t, r) => t.questionNumber ? e.jsx(vn, {
            prefix: t.prefix || "",
            suffix: t.suffix || "",
            questionNumber: t.questionNumber.toString(),
            value: i[t.questionNumber] || "",
            setValue: e => o?.(t.questionNumber.toString(), e),
            examStore: n
        }) : e.jsx("span", {
            children: l(r, t.text)
        }))(r, `general-completion-${t.id}-section-${d}-${u}`);
        return "dash" === h ? e.jsx("li", {
            className: f,
            children: e.jsxs("div", {
                className: "flex items-start",
                children: [e.jsx("span", {
                    className: "mr-2",
                    children: "–"
                }), e.jsx("div", {
                    className: "flex-1",
                    children: p
                })]
            })
        }, u) : e.jsx("li", {
            className: f,
            children: p
        }, u)
    }
      , d = (r, s) => r.questionNumber ? e.jsx("div", {
        className: "font-semibold",
        children: e.jsx(vn, {
            prefix: r.prefix || "",
            suffix: r.suffix || "",
            questionNumber: r.questionNumber.toString(),
            value: i[r.questionNumber] || "",
            setValue: e => o?.(r.questionNumber.toString(), e),
            examStore: n
        })
    }) : r.title ? e.jsx("h5", {
        className: "font-semibold",
        children: e.jsx(v, {
            regionId: `general-completion-section-${t.id}-${s}`,
            text: r.title,
            as: "span"
        })
    }) : null
      , u = () => e.jsxs("div", {
        className: "space-y-6",
        children: [s.title && e.jsx("div", {
            className: "mb-6 text-center",
            children: e.jsx("h4", {
                className: "font-bold",
                children: e.jsx(v, {
                    regionId: `general-completion-title-${t.id}`,
                    text: s.title,
                    as: "span"
                })
            })
        }), e.jsx("div", {
            className: a ? "space-y-4" : "space-y-6",
            children: Array.isArray(s.sections) && s.sections.map( (t, n) => ( (t, n) => {
                const r = `section-${n}`
                  , s = t.title || t.questionNumber;
                return e.jsxs("div", {
                    className: "mb-6",
                    children: [s && e.jsx("div", {
                        className: "mb-3",
                        children: d(t, n)
                    }), t.items && e.jsx("ul", {
                        className: "list-inside space-y-3",
                        children: t.items.map( (e, r) => c(e, r, t, n))
                    })]
                }, r)
            }
            )(t, n))
        })]
    });
    return e.jsx(fn, {
        questionGroup: t,
        examStore: n,
        children: r ? u() : e.jsx(bn, {
            questionGroup: t,
            showHeaderContentTitle: !1,
            children: u()
        })
    })
}
  , Sn = ({questionGroup: t, examStore: r}) => {
    const {answers: s={}, activeQuestionId: i, setActiveQuestion: o, setAnswer: a, toggleQuestionFlag: l, flaggedQuestions: c={}, section: d} = r
      , {imageUrl: u, itemsToLabel: h, labels: f, title: p} = t.content;
    return e.jsxs("div", {
        className: "space-y-6",
        children: [e.jsx(n, {
            questionGroup: t
        }), e.jsxs("div", {
            className: "flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-6",
            children: [u && e.jsx("div", {
                className: "w-full max-w-[650px] mx-auto xl:mx-0 xl:flex-none xl:w-[680px]",
                children: e.jsx("img", {
                    src: u,
                    alt: p || "Diagram",
                    className: "w-full h-auto max-h-[550px] object-contain"
                })
            }), e.jsx("div", {
                className: "w-full xl:flex-1",
                children: e.jsx(wn, {
                    firstColumnHeader: p,
                    firstColumnMinWidth: "min-w-[300px]",
                    columns: f.map(e => ({
                        id: e
                    })),
                    rows: h.map(e => ({
                        questionId: e.questionNumber.toString(),
                        questionNumber: e.questionNumber,
                        text: e.text,
                        highlightRegionId: `diagram-labeling-${t.id}-${e.questionNumber}`
                    })),
                    answers: s,
                    activeQuestionId: i,
                    onCellClick: (e, t) => {
                        setTimeout( () => {
                            o?.(e);
                            const n = s[e] === t ? "" : t;
                            a?.(e, n)
                        }
                        , 0)
                    }
                    ,
                    onRowClick: o,
                    toggleQuestionFlag: l,
                    flaggedQuestions: c,
                    section: d
                })
            })]
        })]
    })
}
  , En = ({questionGroup: t, examStore: r}) => {
    const s = t.content
      , i = !!t.passageId;
    return e.jsxs("div", {
        className: "space-y-4",
        children: [e.jsx(n, {
            questionGroup: t
        }), e.jsxs("div", {
            className: i ? "space-y-6" : "flex flex-row gap-8",
            children: [e.jsx("div", {
                className: i ? "flex justify-center" : "overflow-hidden",
                children: s.imageUrl && e.jsx("img", {
                    src: s.imageUrl,
                    alt: s.title || "Diagram",
                    className: i ? "max-w-full h-auto max-h-[550px] object-contain" : "w-[550px] h-[550px] object-contain"
                })
            }), e.jsx("div", {
                className: i ? "" : "flex-1 space-y-6",
                children: e.jsx("div", {
                    className: "space-y-4",
                    children: e.jsx(Cn, {
                        questionGroup: t,
                        examStore: r,
                        hideHeader: !0
                    })
                })
            })]
        })]
    })
}
  , qn = ({questionGroup: t, examStore: r}) => {
    const {answers: s={}, setAnswer: i} = r
      , a = t.content
      , l = () => {
        const e = a.align || "center";
        return "left" === e || "right" === e ? e : "center"
    }
      , c = () => {
        switch (l()) {
        case "left":
            return "text-left";
        case "right":
            return "text-right";
        default:
            return "text-center"
        }
    }
      , d = () => {
        switch (l()) {
        case "left":
            return "justify-start";
        case "right":
            return "justify-end";
        default:
            return "justify-center"
        }
    }
      , u = (n, o, a, l) => {
        const u = n.questionNumber ? `q-${n.questionNumber}` : `item-${l}-${o}`
          , h = ( (e, t) => e.listStyle || t.listStyle || "plain")(n, a)
          , f = (e => {
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
        )(h)
          , p = c()
          , m = ( (t, n) => void 0 !== t.questionNumber ? e.jsx(vn, {
            prefix: t.prefix || "",
            suffix: t.suffix || "",
            questionNumber: t.questionNumber.toString(),
            value: s[t.questionNumber] || "",
            setValue: e => i?.(t.questionNumber.toString(), e),
            examStore: r
        }) : e.jsx(v, {
            regionId: n,
            text: t.text || "",
            as: "span"
        }))(n, `flowchart-completion-${t.id}-s${l}-i${o}`);
        return "dash" === h ? e.jsx("li", {
            className: "list-none",
            children: e.jsxs("div", {
                className: `flex items-start gap-2 ${d()}`,
                children: [e.jsx("span", {
                    children: "–"
                }), e.jsx("div", {
                    className: `min-w-0 ${p}`,
                    children: m
                })]
            })
        }, u) : e.jsx("li", {
            className: `${f} ${p}`,
            children: m
        }, u)
    }
      , h = (n, r) => {
        const s = c();
        return e.jsxs("div", {
            className: "border border-gray-300 p-4 rounded-lg w-full max-w-full",
            children: [n.title && e.jsx("h5", {
                className: `font-bold mb-3 ${s}`,
                children: e.jsx(v, {
                    regionId: `flowchart-completion-section-${t.id}-${r}`,
                    text: n.title,
                    as: "span"
                })
            }), n.items && n.items.length > 0 && e.jsx("ul", {
                className: `list-inside space-y-2 ${s}`,
                children: n.items.map( (e, t) => u(e, t, n, r))
            })]
        }, `section-${r}`)
    }
    ;
    return e.jsx(fn, {
        questionGroup: t,
        examStore: r,
        children: e.jsxs("div", {
            className: "space-y-8 w-full",
            children: [e.jsx(n, {
                questionGroup: t
            }), e.jsxs("div", {
                className: "flex flex-col gap-6 max-w-4xl w-full",
                children: [a.questionsTitle && e.jsx("h2", {
                    className: "text-md font-semibold",
                    children: e.jsx(v, {
                        regionId: `flowchart-completion-title-${t.id}`,
                        text: a.questionsTitle,
                        as: "span"
                    })
                }), e.jsx("div", {
                    className: "space-y-4 w-full",
                    children: e.jsx("div", {
                        className: `grid w-fit max-w-full ${( () => {
                            switch (l()) {
                            case "left":
                                return "mr-auto";
                            case "right":
                                return "ml-auto";
                            default:
                                return "mx-auto"
                            }
                        }
                        )()}`,
                        children: a.sections.map( (t, n) => e.jsxs("div", {
                            className: "w-full",
                            children: [h(t, n), n < a.sections.length - 1 && e.jsx("div", {
                                className: "my-2 w-full flex justify-center items-center",
                                children: e.jsx(o, {
                                    size: 28,
                                    strokeWidth: 3
                                })
                            })]
                        }, `section-${n}`))
                    })
                })]
            })]
        })
    })
}
;
export {bn as B, fn as C, Bt as D, qn as F, Cn as G, v as H, wn as M, hn as O, nt as P, un as Q, yn as S, jn as T, Nn as a, En as b, pn as c, Sn as d, xn as e, gn as f, w as g, y as h, re as i, ne as j, sn as k, ge as p, pe as r, dn as u};
