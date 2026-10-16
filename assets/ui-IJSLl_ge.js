import {a as e, R as t, b as n, c as r, $ as o} from "./router-gAN6ztYq.js";
import {j as i} from "./query-DsA5-mxg.js";
function a(e, t) {
    if ("function" == typeof e)
        return e(t);
    null != e && (e.current = t)
}
function s(...e) {
    return t => {
        let n = !1;
        const r = e.map(e => {
            const r = a(e, t);
            return n || "function" != typeof r || (n = !0),
            r
        }
        );
        if (n)
            return () => {
                for (let t = 0; t < r.length; t++) {
                    const n = r[t];
                    "function" == typeof n ? n() : a(e[t], null)
                }
            }
    }
}
function c(...t) {
    return e.useCallback(s(...t), t)
}
function u(e, t, {checkForDefaultPrevented: n=!0}={}) {
    return function(r) {
        if (e?.(r),
        !1 === n || !r.defaultPrevented)
            return t?.(r)
    }
}
function l(t, n=[]) {
    let r = [];
    const o = () => {
        const n = r.map(t => e.createContext(t));
        return function(r) {
            const o = r?.[t] || n;
            return e.useMemo( () => ({
                [`__scope${t}`]: {
                    ...r,
                    [t]: o
                }
            }), [r, o])
        }
    }
    ;
    return o.scopeName = t,
    [function(n, o) {
        const a = e.createContext(o)
          , s = r.length;
        r = [...r, o];
        const c = n => {
            const {scope: r, children: o, ...c} = n
              , u = r?.[t]?.[s] || a
              , l = e.useMemo( () => c, Object.values(c));
            return i.jsx(u.Provider, {
                value: l,
                children: o
            })
        }
        ;
        return c.displayName = n + "Provider",
        [c, function(r, i) {
            const c = i?.[t]?.[s] || a
              , u = e.useContext(c);
            if (u)
                return u;
            if (void 0 !== o)
                return o;
            throw new Error(`\`${r}\` must be used within \`${n}\``)
        }
        ]
    }
    , d(o, ...n)]
}
function d(...t) {
    const n = t[0];
    if (1 === t.length)
        return n;
    const r = () => {
        const r = t.map(e => ({
            useScope: e(),
            scopeName: e.scopeName
        }));
        return function(t) {
            const o = r.reduce( (e, {useScope: n, scopeName: r}) => ({
                ...e,
                ...n(t)[`__scope${r}`]
            }), {});
            return e.useMemo( () => ({
                [`__scope${n.scopeName}`]: o
            }), [o])
        }
    }
    ;
    return r.scopeName = n.scopeName,
    r
}
function f(t) {
    const n = p(t)
      , r = e.forwardRef( (t, r) => {
        const {children: o, ...a} = t
          , s = e.Children.toArray(o)
          , c = s.find(g);
        if (c) {
            const t = c.props.children
              , o = s.map(n => n === c ? e.Children.count(t) > 1 ? e.Children.only(null) : e.isValidElement(t) ? t.props.children : null : n);
            return i.jsx(n, {
                ...a,
                ref: r,
                children: e.isValidElement(t) ? e.cloneElement(t, void 0, o) : null
            })
        }
        return i.jsx(n, {
            ...a,
            ref: r,
            children: o
        })
    }
    );
    return r.displayName = `${t}.Slot`,
    r
}
function p(t) {
    const n = e.forwardRef( (t, n) => {
        const {children: r, ...o} = t;
        if (e.isValidElement(r)) {
            const t = function(e) {
                let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get
                  , n = t && "isReactWarning"in t && t.isReactWarning;
                if (n)
                    return e.ref;
                if (t = Object.getOwnPropertyDescriptor(e, "ref")?.get,
                n = t && "isReactWarning"in t && t.isReactWarning,
                n)
                    return e.props.ref;
                return e.props.ref || e.ref
            }(r)
              , i = function(e, t) {
                const n = {
                    ...t
                };
                for (const r in t) {
                    const o = e[r]
                      , i = t[r];
                    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...e) => {
                        const t = i(...e);
                        return o(...e),
                        t
                    }
                    : o && (n[r] = o) : "style" === r ? n[r] = {
                        ...o,
                        ...i
                    } : "className" === r && (n[r] = [o, i].filter(Boolean).join(" "))
                }
                return {
                    ...e,
                    ...n
                }
            }(o, r.props);
            return r.type !== e.Fragment && (i.ref = n ? s(n, t) : t),
            e.cloneElement(r, i)
        }
        return e.Children.count(r) > 1 ? e.Children.only(null) : null
    }
    );
    return n.displayName = `${t}.SlotClone`,
    n
}
var m = Symbol("radix.slottable");
function h(e) {
    const t = ({children: e}) => i.jsx(i.Fragment, {
        children: e
    });
    return t.displayName = `${e}.Slottable`,
    t.__radixId = m,
    t
}
function g(t) {
    return e.isValidElement(t) && "function" == typeof t.type && "__radixId"in t.type && t.type.__radixId === m
}
function v(e) {
    const n = e + "CollectionProvider"
      , [r,o] = l(n)
      , [a,s] = r(n, {
        collectionRef: {
            current: null
        },
        itemMap: new Map
    })
      , u = e => {
        const {scope: n, children: r} = e
          , o = t.useRef(null)
          , s = t.useRef(new Map).current;
        return i.jsx(a, {
            scope: n,
            itemMap: s,
            collectionRef: o,
            children: r
        })
    }
    ;
    u.displayName = n;
    const d = e + "CollectionSlot"
      , p = f(d)
      , m = t.forwardRef( (e, t) => {
        const {scope: n, children: r} = e
          , o = c(t, s(d, n).collectionRef);
        return i.jsx(p, {
            ref: o,
            children: r
        })
    }
    );
    m.displayName = d;
    const h = e + "CollectionItemSlot"
      , g = "data-radix-collection-item"
      , v = f(h)
      , y = t.forwardRef( (e, n) => {
        const {scope: r, children: o, ...a} = e
          , u = t.useRef(null)
          , l = c(n, u)
          , d = s(h, r);
        return t.useEffect( () => (d.itemMap.set(u, {
            ref: u,
            ...a
        }),
        () => {
            d.itemMap.delete(u)
        }
        )),
        i.jsx(v, {
            [g]: "",
            ref: l,
            children: o
        })
    }
    );
    return y.displayName = h,
    [{
        Provider: u,
        Slot: m,
        ItemSlot: y
    }, function(n) {
        const r = s(e + "CollectionConsumer", n);
        return t.useCallback( () => {
            const e = r.collectionRef.current;
            if (!e)
                return [];
            const t = Array.from(e.querySelectorAll(`[${g}]`));
            return Array.from(r.itemMap.values()).sort( (e, n) => t.indexOf(e.ref.current) - t.indexOf(n.ref.current))
        }
        , [r.collectionRef, r.itemMap])
    }
    , o]
}
var y = ["a", "button", "div", "form", "h2", "h3", "img", "input", "label", "li", "nav", "ol", "p", "select", "span", "svg", "ul"].reduce( (t, n) => {
    const r = f(`Primitive.${n}`)
      , o = e.forwardRef( (e, t) => {
        const {asChild: o, ...a} = e
          , s = o ? r : n;
        return "undefined" != typeof window && (window[Symbol.for("radix-ui")] = !0),
        i.jsx(s, {
            ...a,
            ref: t
        })
    }
    );
    return o.displayName = `Primitive.${n}`,
    {
        ...t,
        [n]: o
    }
}
, {});
function w(e, t) {
    e && n.flushSync( () => e.dispatchEvent(t))
}
function b(t) {
    const n = e.useRef(t);
    return e.useEffect( () => {
        n.current = t
    }
    ),
    e.useMemo( () => (...e) => n.current?.(...e), [])
}
var x, R = "dismissableLayer.update", E = "dismissableLayer.pointerDownOutside", C = "dismissableLayer.focusOutside", _ = e.createContext({
    layers: new Set,
    layersWithOutsidePointerEventsDisabled: new Set,
    branches: new Set
}), D = e.forwardRef( (t, n) => {
    const {disableOutsidePointerEvents: r=!1, onEscapeKeyDown: o, onPointerDownOutside: a, onFocusOutside: s, onInteractOutside: l, onDismiss: d, ...f} = t
      , p = e.useContext(_)
      , [m,h] = e.useState(null)
      , g = m?.ownerDocument ?? globalThis?.document
      , [,v] = e.useState({})
      , w = c(n, e => h(e))
      , D = Array.from(p.layers)
      , [M] = [...p.layersWithOutsidePointerEventsDisabled].slice(-1)
      , O = D.indexOf(M)
      , P = m ? D.indexOf(m) : -1
      , j = p.layersWithOutsidePointerEventsDisabled.size > 0
      , N = P >= O
      , T = function(t, n=globalThis?.document) {
        const r = b(t)
          , o = e.useRef(!1)
          , i = e.useRef( () => {}
        );
        return e.useEffect( () => {
            const e = e => {
                if (e.target && !o.current) {
                    let t = function() {
                        A(E, r, o, {
                            discrete: !0
                        })
                    };
                    const o = {
                        originalEvent: e
                    };
                    "touch" === e.pointerType ? (n.removeEventListener("click", i.current),
                    i.current = t,
                    n.addEventListener("click", i.current, {
                        once: !0
                    })) : t()
                } else
                    n.removeEventListener("click", i.current);
                o.current = !1
            }
              , t = window.setTimeout( () => {
                n.addEventListener("pointerdown", e)
            }
            , 0);
            return () => {
                window.clearTimeout(t),
                n.removeEventListener("pointerdown", e),
                n.removeEventListener("click", i.current)
            }
        }
        , [n, r]),
        {
            onPointerDownCapture: () => o.current = !0
        }
    }(e => {
        const t = e.target
          , n = [...p.branches].some(e => e.contains(t));
        N && !n && (a?.(e),
        l?.(e),
        e.defaultPrevented || d?.())
    }
    , g)
      , k = function(t, n=globalThis?.document) {
        const r = b(t)
          , o = e.useRef(!1);
        return e.useEffect( () => {
            const e = e => {
                if (e.target && !o.current) {
                    A(C, r, {
                        originalEvent: e
                    }, {
                        discrete: !1
                    })
                }
            }
            ;
            return n.addEventListener("focusin", e),
            () => n.removeEventListener("focusin", e)
        }
        , [n, r]),
        {
            onFocusCapture: () => o.current = !0,
            onBlurCapture: () => o.current = !1
        }
    }(e => {
        const t = e.target;
        [...p.branches].some(e => e.contains(t)) || (s?.(e),
        l?.(e),
        e.defaultPrevented || d?.())
    }
    , g);
    return function(t, n=globalThis?.document) {
        const r = b(t);
        e.useEffect( () => {
            const e = e => {
                "Escape" === e.key && r(e)
            }
            ;
            return n.addEventListener("keydown", e, {
                capture: !0
            }),
            () => n.removeEventListener("keydown", e, {
                capture: !0
            })
        }
        , [r, n])
    }(e => {
        P === p.layers.size - 1 && (o?.(e),
        !e.defaultPrevented && d && (e.preventDefault(),
        d()))
    }
    , g),
    e.useEffect( () => {
        if (m)
            return r && (0 === p.layersWithOutsidePointerEventsDisabled.size && (x = g.body.style.pointerEvents,
            g.body.style.pointerEvents = "none"),
            p.layersWithOutsidePointerEventsDisabled.add(m)),
            p.layers.add(m),
            S(),
            () => {
                r && 1 === p.layersWithOutsidePointerEventsDisabled.size && (g.body.style.pointerEvents = x)
            }
    }
    , [m, g, r, p]),
    e.useEffect( () => () => {
        m && (p.layers.delete(m),
        p.layersWithOutsidePointerEventsDisabled.delete(m),
        S())
    }
    , [m, p]),
    e.useEffect( () => {
        const e = () => v({});
        return document.addEventListener(R, e),
        () => document.removeEventListener(R, e)
    }
    , []),
    i.jsx(y.div, {
        ...f,
        ref: w,
        style: {
            pointerEvents: j ? N ? "auto" : "none" : void 0,
            ...t.style
        },
        onFocusCapture: u(t.onFocusCapture, k.onFocusCapture),
        onBlurCapture: u(t.onBlurCapture, k.onBlurCapture),
        onPointerDownCapture: u(t.onPointerDownCapture, T.onPointerDownCapture)
    })
}
);
D.displayName = "DismissableLayer";
var M = e.forwardRef( (t, n) => {
    const r = e.useContext(_)
      , o = e.useRef(null)
      , a = c(n, o);
    return e.useEffect( () => {
        const e = o.current;
        if (e)
            return r.branches.add(e),
            () => {
                r.branches.delete(e)
            }
    }
    , [r.branches]),
    i.jsx(y.div, {
        ...t,
        ref: a
    })
}
);
function S() {
    const e = new CustomEvent(R);
    document.dispatchEvent(e)
}
function A(e, t, n, {discrete: r}) {
    const o = n.originalEvent.target
      , i = new CustomEvent(e,{
        bubbles: !1,
        cancelable: !0,
        detail: n
    });
    t && o.addEventListener(e, t, {
        once: !0
    }),
    r ? w(o, i) : o.dispatchEvent(i)
}
M.displayName = "DismissableLayerBranch";
var O = D
  , P = M
  , j = globalThis?.document ? e.useLayoutEffect : () => {}
  , N = e.forwardRef( (t, n) => {
    const {container: o, ...a} = t
      , [s,c] = e.useState(!1);
    j( () => c(!0), []);
    const u = o || s && globalThis?.document?.body;
    return u ? r.createPortal(i.jsx(y.div, {
        ...a,
        ref: n
    }), u) : null
}
);
N.displayName = "Portal";
var T = t => {
    const {present: n, children: r} = t
      , o = function(t) {
        const [n,r] = e.useState()
          , o = e.useRef(null)
          , i = e.useRef(t)
          , a = e.useRef("none")
          , s = t ? "mounted" : "unmounted"
          , [c,u] = function(t, n) {
            return e.useReducer( (e, t) => n[e][t] ?? e, t)
        }(s, {
            mounted: {
                UNMOUNT: "unmounted",
                ANIMATION_OUT: "unmountSuspended"
            },
            unmountSuspended: {
                MOUNT: "mounted",
                ANIMATION_END: "unmounted"
            },
            unmounted: {
                MOUNT: "mounted"
            }
        });
        return e.useEffect( () => {
            const e = k(o.current);
            a.current = "mounted" === c ? e : "none"
        }
        , [c]),
        j( () => {
            const e = o.current
              , n = i.current;
            if (n !== t) {
                const r = a.current
                  , o = k(e);
                if (t)
                    u("MOUNT");
                else if ("none" === o || "none" === e?.display)
                    u("UNMOUNT");
                else {
                    u(n && r !== o ? "ANIMATION_OUT" : "UNMOUNT")
                }
                i.current = t
            }
        }
        , [t, u]),
        j( () => {
            if (n) {
                let e;
                const t = n.ownerDocument.defaultView ?? window
                  , r = r => {
                    const a = k(o.current).includes(CSS.escape(r.animationName));
                    if (r.target === n && a && (u("ANIMATION_END"),
                    !i.current)) {
                        const r = n.style.animationFillMode;
                        n.style.animationFillMode = "forwards",
                        e = t.setTimeout( () => {
                            "forwards" === n.style.animationFillMode && (n.style.animationFillMode = r)
                        }
                        )
                    }
                }
                  , s = e => {
                    e.target === n && (a.current = k(o.current))
                }
                ;
                return n.addEventListener("animationstart", s),
                n.addEventListener("animationcancel", r),
                n.addEventListener("animationend", r),
                () => {
                    t.clearTimeout(e),
                    n.removeEventListener("animationstart", s),
                    n.removeEventListener("animationcancel", r),
                    n.removeEventListener("animationend", r)
                }
            }
            u("ANIMATION_END")
        }
        , [n, u]),
        {
            isPresent: ["mounted", "unmountSuspended"].includes(c),
            ref: e.useCallback(e => {
                o.current = e ? getComputedStyle(e) : null,
                r(e)
            }
            , [])
        }
    }(n)
      , i = "function" == typeof r ? r({
        present: o.isPresent
    }) : e.Children.only(r)
      , a = c(o.ref, function(e) {
        let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get
          , n = t && "isReactWarning"in t && t.isReactWarning;
        if (n)
            return e.ref;
        if (t = Object.getOwnPropertyDescriptor(e, "ref")?.get,
        n = t && "isReactWarning"in t && t.isReactWarning,
        n)
            return e.props.ref;
        return e.props.ref || e.ref
    }(i));
    return "function" == typeof r || o.isPresent ? e.cloneElement(i, {
        ref: a
    }) : null
}
;
function k(e) {
    return e?.animationName || "none"
}
T.displayName = "Presence";
var I = o[" useInsertionEffect ".trim().toString()] || j;
function L({prop: t, defaultProp: n, onChange: r= () => {}
, caller: o}) {
    const [i,a,s] = function({defaultProp: t, onChange: n}) {
        const [r,o] = e.useState(t)
          , i = e.useRef(r)
          , a = e.useRef(n);
        return I( () => {
            a.current = n
        }
        , [n]),
        e.useEffect( () => {
            i.current !== r && (a.current?.(r),
            i.current = r)
        }
        , [r, i]),
        [r, o, a]
    }({
        defaultProp: n,
        onChange: r
    })
      , c = void 0 !== t
      , u = c ? t : i;
    {
        const n = e.useRef(void 0 !== t);
        e.useEffect( () => {
            const e = n.current;
            if (e !== c) {}
            n.current = c
        }
        , [c, o])
    }
    const l = e.useCallback(e => {
        if (c) {
            const n = function(e) {
                return "function" == typeof e
            }(e) ? e(t) : e;
            n !== t && s.current?.(n)
        } else
            a(e)
    }
    , [c, t, a, s]);
    return [u, l]
}
var F = o[" useId ".trim().toString()] || ( () => {}
)
  , W = 0;
function B(t) {
    const [n,r] = e.useState(F());
    return j( () => {
        r(e => e ?? String(W++))
    }
    , [t]),
    n ? `radix-${n}` : ""
}
var K = "focusScope.autoFocusOnMount"
  , $ = "focusScope.autoFocusOnUnmount"
  , H = {
    bubbles: !1,
    cancelable: !0
}
  , U = e.forwardRef( (t, n) => {
    const {loop: r=!1, trapped: o=!1, onMountAutoFocus: a, onUnmountAutoFocus: s, ...u} = t
      , [l,d] = e.useState(null)
      , f = b(a)
      , p = b(s)
      , m = e.useRef(null)
      , h = c(n, e => d(e))
      , g = e.useRef({
        paused: !1,
        pause() {
            this.paused = !0
        },
        resume() {
            this.paused = !1
        }
    }).current;
    e.useEffect( () => {
        if (o) {
            let e = function(e) {
                if (g.paused || !l)
                    return;
                const t = e.target;
                l.contains(t) ? m.current = t : X(m.current, {
                    select: !0
                })
            }
              , t = function(e) {
                if (g.paused || !l)
                    return;
                const t = e.relatedTarget;
                null !== t && (l.contains(t) || X(m.current, {
                    select: !0
                }))
            }
              , n = function(e) {
                if (document.activeElement === document.body)
                    for (const t of e)
                        t.removedNodes.length > 0 && X(l)
            };
            document.addEventListener("focusin", e),
            document.addEventListener("focusout", t);
            const r = new MutationObserver(n);
            return l && r.observe(l, {
                childList: !0,
                subtree: !0
            }),
            () => {
                document.removeEventListener("focusin", e),
                document.removeEventListener("focusout", t),
                r.disconnect()
            }
        }
    }
    , [o, l, g.paused]),
    e.useEffect( () => {
        if (l) {
            Y.add(g);
            const t = document.activeElement;
            if (!l.contains(t)) {
                const n = new CustomEvent(K,H);
                l.addEventListener(K, f),
                l.dispatchEvent(n),
                n.defaultPrevented || (!function(e, {select: t=!1}={}) {
                    const n = document.activeElement;
                    for (const r of e)
                        if (X(r, {
                            select: t
                        }),
                        document.activeElement !== n)
                            return
                }((e = V(l),
                e.filter(e => "A" !== e.tagName)), {
                    select: !0
                }),
                document.activeElement === t && X(l))
            }
            return () => {
                l.removeEventListener(K, f),
                setTimeout( () => {
                    const e = new CustomEvent($,H);
                    l.addEventListener($, p),
                    l.dispatchEvent(e),
                    e.defaultPrevented || X(t ?? document.body, {
                        select: !0
                    }),
                    l.removeEventListener($, p),
                    Y.remove(g)
                }
                , 0)
            }
        }
        var e
    }
    , [l, f, p, g]);
    const v = e.useCallback(e => {
        if (!r && !o)
            return;
        if (g.paused)
            return;
        const t = "Tab" === e.key && !e.altKey && !e.ctrlKey && !e.metaKey
          , n = document.activeElement;
        if (t && n) {
            const t = e.currentTarget
              , [o,i] = function(e) {
                const t = V(e)
                  , n = z(t, e)
                  , r = z(t.reverse(), e);
                return [n, r]
            }(t);
            o && i ? e.shiftKey || n !== i ? e.shiftKey && n === o && (e.preventDefault(),
            r && X(i, {
                select: !0
            })) : (e.preventDefault(),
            r && X(o, {
                select: !0
            })) : n === t && e.preventDefault()
        }
    }
    , [r, o, g.paused]);
    return i.jsx(y.div, {
        tabIndex: -1,
        ...u,
        ref: h,
        onKeyDown: v
    })
}
);
function V(e) {
    const t = []
      , n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
        acceptNode: e => {
            const t = "INPUT" === e.tagName && "hidden" === e.type;
            return e.disabled || e.hidden || t ? NodeFilter.FILTER_SKIP : e.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        }
    });
    for (; n.nextNode(); )
        t.push(n.currentNode);
    return t
}
function z(e, t) {
    for (const n of e)
        if (!G(n, {
            upTo: t
        }))
            return n
}
function G(e, {upTo: t}) {
    if ("hidden" === getComputedStyle(e).visibility)
        return !0;
    for (; e; ) {
        if (void 0 !== t && e === t)
            return !1;
        if ("none" === getComputedStyle(e).display)
            return !0;
        e = e.parentElement
    }
    return !1
}
function X(e, {select: t=!1}={}) {
    if (e && e.focus) {
        const n = document.activeElement;
        e.focus({
            preventScroll: !0
        }),
        e !== n && function(e) {
            return e instanceof HTMLInputElement && "select"in e
        }(e) && t && e.select()
    }
}
U.displayName = "FocusScope";
var Y = function() {
    let e = [];
    return {
        add(t) {
            const n = e[0];
            t !== n && n?.pause(),
            e = q(e, t),
            e.unshift(t)
        },
        remove(t) {
            e = q(e, t),
            e[0]?.resume()
        }
    }
}();
function q(e, t) {
    const n = [...e]
      , r = n.indexOf(t);
    return -1 !== r && n.splice(r, 1),
    n
}
var Z = 0;
function J() {
    e.useEffect( () => {
        const e = document.querySelectorAll("[data-radix-focus-guard]");
        return document.body.insertAdjacentElement("afterbegin", e[0] ?? Q()),
        document.body.insertAdjacentElement("beforeend", e[1] ?? Q()),
        Z++,
        () => {
            1 === Z && document.querySelectorAll("[data-radix-focus-guard]").forEach(e => e.remove()),
            Z--
        }
    }
    , [])
}
function Q() {
    const e = document.createElement("span");
    return e.setAttribute("data-radix-focus-guard", ""),
    e.tabIndex = 0,
    e.style.outline = "none",
    e.style.opacity = "0",
    e.style.position = "fixed",
    e.style.pointerEvents = "none",
    e
}
var ee = function() {
    return ee = Object.assign || function(e) {
        for (var t, n = 1, r = arguments.length; n < r; n++)
            for (var o in t = arguments[n])
                Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        return e
    }
    ,
    ee.apply(this, arguments)
};
function te(e, t) {
    var n = {};
    for (var r in e)
        Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
        var o = 0;
        for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
            t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]])
    }
    return n
}
function ne(e, t, n) {
    if (n || 2 === arguments.length)
        for (var r, o = 0, i = t.length; o < i; o++)
            !r && o in t || (r || (r = Array.prototype.slice.call(t, 0, o)),
            r[o] = t[o]);
    return e.concat(r || Array.prototype.slice.call(t))
}
"function" == typeof SuppressedError && SuppressedError;
var re = "right-scroll-bar-position"
  , oe = "width-before-scroll-bar";
function ie(e, t) {
    return "function" == typeof e ? e(t) : e && (e.current = t),
    e
}
var ae = "undefined" != typeof window ? e.useLayoutEffect : e.useEffect
  , se = new WeakMap;
function ce(t, n) {
    var r, o, i, a = (r = null,
    o = function(e) {
        return t.forEach(function(t) {
            return ie(t, e)
        })
    }
    ,
    (i = e.useState(function() {
        return {
            value: r,
            callback: o,
            facade: {
                get current() {
                    return i.value
                },
                set current(e) {
                    var t = i.value;
                    t !== e && (i.value = e,
                    i.callback(e, t))
                }
            }
        }
    })[0]).callback = o,
    i.facade);
    return ae(function() {
        var e = se.get(a);
        if (e) {
            var n = new Set(e)
              , r = new Set(t)
              , o = a.current;
            n.forEach(function(e) {
                r.has(e) || ie(e, null)
            }),
            r.forEach(function(e) {
                n.has(e) || ie(e, o)
            })
        }
        se.set(a, t)
    }, [t]),
    a
}
function ue(e) {
    return e
}
function le(e) {
    void 0 === e && (e = {});
    var t = function(e, t) {
        void 0 === t && (t = ue);
        var n = []
          , r = !1;
        return {
            read: function() {
                if (r)
                    throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
                return n.length ? n[n.length - 1] : e
            },
            useMedium: function(e) {
                var o = t(e, r);
                return n.push(o),
                function() {
                    n = n.filter(function(e) {
                        return e !== o
                    })
                }
            },
            assignSyncMedium: function(e) {
                for (r = !0; n.length; ) {
                    var t = n;
                    n = [],
                    t.forEach(e)
                }
                n = {
                    push: function(t) {
                        return e(t)
                    },
                    filter: function() {
                        return n
                    }
                }
            },
            assignMedium: function(e) {
                r = !0;
                var t = [];
                if (n.length) {
                    var o = n;
                    n = [],
                    o.forEach(e),
                    t = n
                }
                var i = function() {
                    var n = t;
                    t = [],
                    n.forEach(e)
                }
                  , a = function() {
                    return Promise.resolve().then(i)
                };
                a(),
                n = {
                    push: function(e) {
                        t.push(e),
                        a()
                    },
                    filter: function(e) {
                        return t = t.filter(e),
                        n
                    }
                }
            }
        }
    }(null);
    return t.options = ee({
        async: !0,
        ssr: !1
    }, e),
    t
}
var de = function(t) {
    var n = t.sideCar
      , r = te(t, ["sideCar"]);
    if (!n)
        throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    var o = n.read();
    if (!o)
        throw new Error("Sidecar medium not found");
    return e.createElement(o, ee({}, r))
};
function fe(e, t) {
    return e.useMedium(t),
    de
}
de.isSideCarExport = !0;
var pe = le()
  , me = function() {}
  , he = e.forwardRef(function(t, n) {
    var r = e.useRef(null)
      , o = e.useState({
        onScrollCapture: me,
        onWheelCapture: me,
        onTouchMoveCapture: me
    })
      , i = o[0]
      , a = o[1]
      , s = t.forwardProps
      , c = t.children
      , u = t.className
      , l = t.removeScrollBar
      , d = t.enabled
      , f = t.shards
      , p = t.sideCar
      , m = t.noRelative
      , h = t.noIsolation
      , g = t.inert
      , v = t.allowPinchZoom
      , y = t.as
      , w = void 0 === y ? "div" : y
      , b = t.gapMode
      , x = te(t, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"])
      , R = p
      , E = ce([r, n])
      , C = ee(ee({}, x), i);
    return e.createElement(e.Fragment, null, d && e.createElement(R, {
        sideCar: pe,
        removeScrollBar: l,
        shards: f,
        noRelative: m,
        noIsolation: h,
        inert: g,
        setCallbacks: a,
        allowPinchZoom: !!v,
        lockRef: r,
        gapMode: b
    }), s ? e.cloneElement(e.Children.only(c), ee(ee({}, C), {
        ref: E
    })) : e.createElement(w, ee({}, C, {
        className: u,
        ref: E
    }), c))
});
he.defaultProps = {
    enabled: !0,
    removeScrollBar: !0,
    inert: !1
},
he.classNames = {
    fullWidth: oe,
    zeroRight: re
};
function ge() {
    if (!document)
        return null;
    var e = document.createElement("style");
    e.type = "text/css";
    var t = function() {
        if ("undefined" != typeof __webpack_nonce__)
            return __webpack_nonce__
    }();
    return t && e.setAttribute("nonce", t),
    e
}
var ve = function() {
    var e = 0
      , t = null;
    return {
        add: function(n) {
            var r, o;
            0 == e && (t = ge()) && (o = n,
            (r = t).styleSheet ? r.styleSheet.cssText = o : r.appendChild(document.createTextNode(o)),
            function(e) {
                (document.head || document.getElementsByTagName("head")[0]).appendChild(e)
            }(t)),
            e++
        },
        remove: function() {
            !--e && t && (t.parentNode && t.parentNode.removeChild(t),
            t = null)
        }
    }
}
  , ye = function() {
    var t, n = (t = ve(),
    function(n, r) {
        e.useEffect(function() {
            return t.add(n),
            function() {
                t.remove()
            }
        }, [n && r])
    }
    );
    return function(e) {
        var t = e.styles
          , r = e.dynamic;
        return n(t, r),
        null
    }
}
  , we = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
}
  , be = function(e) {
    return parseInt(e || "", 10) || 0
}
  , xe = function(e) {
    if (void 0 === e && (e = "margin"),
    "undefined" == typeof window)
        return we;
    var t = function(e) {
        var t = window.getComputedStyle(document.body)
          , n = t["padding" === e ? "paddingLeft" : "marginLeft"]
          , r = t["padding" === e ? "paddingTop" : "marginTop"]
          , o = t["padding" === e ? "paddingRight" : "marginRight"];
        return [be(n), be(r), be(o)]
    }(e)
      , n = document.documentElement.clientWidth
      , r = window.innerWidth;
    return {
        left: t[0],
        top: t[1],
        right: t[2],
        gap: Math.max(0, r - n + t[2] - t[0])
    }
}
  , Re = ye()
  , Ee = "data-scroll-locked"
  , Ce = function(e, t, n, r) {
    var o = e.left
      , i = e.top
      , a = e.right
      , s = e.gap;
    return void 0 === n && (n = "margin"),
    "\n  .".concat("with-scroll-bars-hidden", " {\n   overflow: hidden ").concat(r, ";\n   padding-right: ").concat(s, "px ").concat(r, ";\n  }\n  body[").concat(Ee, "] {\n    overflow: hidden ").concat(r, ";\n    overscroll-behavior: contain;\n    ").concat([t && "position: relative ".concat(r, ";"), "margin" === n && "\n    padding-left: ".concat(o, "px;\n    padding-top: ").concat(i, "px;\n    padding-right: ").concat(a, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(s, "px ").concat(r, ";\n    "), "padding" === n && "padding-right: ".concat(s, "px ").concat(r, ";")].filter(Boolean).join(""), "\n  }\n  \n  .").concat(re, " {\n    right: ").concat(s, "px ").concat(r, ";\n  }\n  \n  .").concat(oe, " {\n    margin-right: ").concat(s, "px ").concat(r, ";\n  }\n  \n  .").concat(re, " .").concat(re, " {\n    right: 0 ").concat(r, ";\n  }\n  \n  .").concat(oe, " .").concat(oe, " {\n    margin-right: 0 ").concat(r, ";\n  }\n  \n  body[").concat(Ee, "] {\n    ").concat("--removed-body-scroll-bar-size", ": ").concat(s, "px;\n  }\n")
}
  , _e = function() {
    var e = parseInt(document.body.getAttribute(Ee) || "0", 10);
    return isFinite(e) ? e : 0
}
  , De = function(t) {
    var n = t.noRelative
      , r = t.noImportant
      , o = t.gapMode
      , i = void 0 === o ? "margin" : o;
    e.useEffect(function() {
        return document.body.setAttribute(Ee, (_e() + 1).toString()),
        function() {
            var e = _e() - 1;
            e <= 0 ? document.body.removeAttribute(Ee) : document.body.setAttribute(Ee, e.toString())
        }
    }, []);
    var a = e.useMemo(function() {
        return xe(i)
    }, [i]);
    return e.createElement(Re, {
        styles: Ce(a, !n, i, r ? "" : "!important")
    })
}
  , Me = !1;
if ("undefined" != typeof window)
    try {
        var Se = Object.defineProperty({}, "passive", {
            get: function() {
                return Me = !0,
                !0
            }
        });
        window.addEventListener("test", Se, Se),
        window.removeEventListener("test", Se, Se)
    } catch (ps) {
        Me = !1
    }
var Ae = !!Me && {
    passive: !1
}
  , Oe = function(e, t) {
    if (!(e instanceof Element))
        return !1;
    var n = window.getComputedStyle(e);
    return "hidden" !== n[t] && !(n.overflowY === n.overflowX && !function(e) {
        return "TEXTAREA" === e.tagName
    }(e) && "visible" === n[t])
}
  , Pe = function(e, t) {
    var n = t.ownerDocument
      , r = t;
    do {
        if ("undefined" != typeof ShadowRoot && r instanceof ShadowRoot && (r = r.host),
        je(e, r)) {
            var o = Ne(e, r);
            if (o[1] > o[2])
                return !0
        }
        r = r.parentNode
    } while (r && r !== n.body);
    return !1
}
  , je = function(e, t) {
    return "v" === e ? function(e) {
        return Oe(e, "overflowY")
    }(t) : function(e) {
        return Oe(e, "overflowX")
    }(t)
}
  , Ne = function(e, t) {
    return "v" === e ? [(n = t).scrollTop, n.scrollHeight, n.clientHeight] : function(e) {
        return [e.scrollLeft, e.scrollWidth, e.clientWidth]
    }(t);
    var n
}
  , Te = function(e) {
    return "changedTouches"in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0]
}
  , ke = function(e) {
    return [e.deltaX, e.deltaY]
}
  , Ie = function(e) {
    return e && "current"in e ? e.current : e
}
  , Le = function(e) {
    return "\n  .block-interactivity-".concat(e, " {pointer-events: none;}\n  .allow-interactivity-").concat(e, " {pointer-events: all;}\n")
}
  , Fe = 0
  , We = [];
function Be(e) {
    for (var t = null; null !== e; )
        e instanceof ShadowRoot && (t = e.host,
        e = e.host),
        e = e.parentNode;
    return t
}
const Ke = fe(pe, function(t) {
    var n = e.useRef([])
      , r = e.useRef([0, 0])
      , o = e.useRef()
      , i = e.useState(Fe++)[0]
      , a = e.useState(ye)[0]
      , s = e.useRef(t);
    e.useEffect(function() {
        s.current = t
    }, [t]),
    e.useEffect(function() {
        if (t.inert) {
            document.body.classList.add("block-interactivity-".concat(i));
            var e = ne([t.lockRef.current], (t.shards || []).map(Ie), !0).filter(Boolean);
            return e.forEach(function(e) {
                return e.classList.add("allow-interactivity-".concat(i))
            }),
            function() {
                document.body.classList.remove("block-interactivity-".concat(i)),
                e.forEach(function(e) {
                    return e.classList.remove("allow-interactivity-".concat(i))
                })
            }
        }
    }, [t.inert, t.lockRef.current, t.shards]);
    var c = e.useCallback(function(e, t) {
        if ("touches"in e && 2 === e.touches.length || "wheel" === e.type && e.ctrlKey)
            return !s.current.allowPinchZoom;
        var n, i = Te(e), a = r.current, c = "deltaX"in e ? e.deltaX : a[0] - i[0], u = "deltaY"in e ? e.deltaY : a[1] - i[1], l = e.target, d = Math.abs(c) > Math.abs(u) ? "h" : "v";
        if ("touches"in e && "h" === d && "range" === l.type)
            return !1;
        var f = window.getSelection()
          , p = f && f.anchorNode;
        if (!!p && (p === l || p.contains(l)))
            return !1;
        var m = Pe(d, l);
        if (!m)
            return !0;
        if (m ? n = d : (n = "v" === d ? "h" : "v",
        m = Pe(d, l)),
        !m)
            return !1;
        if (!o.current && "changedTouches"in e && (c || u) && (o.current = n),
        !n)
            return !0;
        var h = o.current || n;
        return function(e, t, n, r) {
            var o = function(e, t) {
                return "h" === e && "rtl" === t ? -1 : 1
            }(e, window.getComputedStyle(t).direction)
              , i = o * r
              , a = n.target
              , s = t.contains(a)
              , c = !1
              , u = i > 0
              , l = 0
              , d = 0;
            do {
                if (!a)
                    break;
                var f = Ne(e, a)
                  , p = f[0]
                  , m = f[1] - f[2] - o * p;
                (p || m) && je(e, a) && (l += m,
                d += p);
                var h = a.parentNode;
                a = h && h.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? h.host : h
            } while (!s && a !== document.body || s && (t.contains(a) || t === a));
            return (u && Math.abs(l) < 1 || !u && Math.abs(d) < 1) && (c = !0),
            c
        }(h, t, e, "h" === h ? c : u)
    }, [])
      , u = e.useCallback(function(e) {
        var t = e;
        if (We.length && We[We.length - 1] === a) {
            var r = "deltaY"in t ? ke(t) : Te(t)
              , o = n.current.filter(function(e) {
                return e.name === t.type && (e.target === t.target || t.target === e.shadowParent) && (n = e.delta,
                o = r,
                n[0] === o[0] && n[1] === o[1]);
                var n, o
            })[0];
            if (o && o.should)
                t.cancelable && t.preventDefault();
            else if (!o) {
                var i = (s.current.shards || []).map(Ie).filter(Boolean).filter(function(e) {
                    return e.contains(t.target)
                });
                (i.length > 0 ? c(t, i[0]) : !s.current.noIsolation) && t.cancelable && t.preventDefault()
            }
        }
    }, [])
      , l = e.useCallback(function(e, t, r, o) {
        var i = {
            name: e,
            delta: t,
            target: r,
            should: o,
            shadowParent: Be(r)
        };
        n.current.push(i),
        setTimeout(function() {
            n.current = n.current.filter(function(e) {
                return e !== i
            })
        }, 1)
    }, [])
      , d = e.useCallback(function(e) {
        r.current = Te(e),
        o.current = void 0
    }, [])
      , f = e.useCallback(function(e) {
        l(e.type, ke(e), e.target, c(e, t.lockRef.current))
    }, [])
      , p = e.useCallback(function(e) {
        l(e.type, Te(e), e.target, c(e, t.lockRef.current))
    }, []);
    e.useEffect(function() {
        return We.push(a),
        t.setCallbacks({
            onScrollCapture: f,
            onWheelCapture: f,
            onTouchMoveCapture: p
        }),
        document.addEventListener("wheel", u, Ae),
        document.addEventListener("touchmove", u, Ae),
        document.addEventListener("touchstart", d, Ae),
        function() {
            We = We.filter(function(e) {
                return e !== a
            }),
            document.removeEventListener("wheel", u, Ae),
            document.removeEventListener("touchmove", u, Ae),
            document.removeEventListener("touchstart", d, Ae)
        }
    }, []);
    var m = t.removeScrollBar
      , h = t.inert;
    return e.createElement(e.Fragment, null, h ? e.createElement(a, {
        styles: Le(i)
    }) : null, m ? e.createElement(De, {
        noRelative: t.noRelative,
        gapMode: t.gapMode
    }) : null)
});
var $e = e.forwardRef(function(t, n) {
    return e.createElement(he, ee({}, t, {
        ref: n,
        sideCar: Ke
    }))
});
$e.classNames = he.classNames;
var He = new WeakMap
  , Ue = new WeakMap
  , Ve = {}
  , ze = 0
  , Ge = function(e) {
    return e && (e.host || Ge(e.parentNode))
}
  , Xe = function(e, t, n, r) {
    var o = function(e, t) {
        return t.map(function(t) {
            if (e.contains(t))
                return t;
            var n = Ge(t);
            return n && e.contains(n) ? n : null
        }).filter(function(e) {
            return Boolean(e)
        })
    }(t, Array.isArray(e) ? e : [e]);
    Ve[n] || (Ve[n] = new WeakMap);
    var i = Ve[n]
      , a = []
      , s = new Set
      , c = new Set(o)
      , u = function(e) {
        e && !s.has(e) && (s.add(e),
        u(e.parentNode))
    };
    o.forEach(u);
    var l = function(e) {
        e && !c.has(e) && Array.prototype.forEach.call(e.children, function(e) {
            if (s.has(e))
                l(e);
            else
                try {
                    var t = e.getAttribute(r)
                      , o = null !== t && "false" !== t
                      , c = (He.get(e) || 0) + 1
                      , u = (i.get(e) || 0) + 1;
                    He.set(e, c),
                    i.set(e, u),
                    a.push(e),
                    1 === c && o && Ue.set(e, !0),
                    1 === u && e.setAttribute(n, "true"),
                    o || e.setAttribute(r, "true")
                } catch (d) {}
        })
    };
    return l(t),
    s.clear(),
    ze++,
    function() {
        a.forEach(function(e) {
            var t = He.get(e) - 1
              , o = i.get(e) - 1;
            He.set(e, t),
            i.set(e, o),
            t || (Ue.has(e) || e.removeAttribute(r),
            Ue.delete(e)),
            o || e.removeAttribute(n)
        }),
        --ze || (He = new WeakMap,
        He = new WeakMap,
        Ue = new WeakMap,
        Ve = {})
    }
}
  , Ye = function(e, t, n) {
    void 0 === n && (n = "data-aria-hidden");
    var r = Array.from(Array.isArray(e) ? e : [e])
      , o = function(e) {
        return "undefined" == typeof document ? null : (Array.isArray(e) ? e[0] : e).ownerDocument.body
    }(e);
    return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live], script"))),
    Xe(r, o, n, "aria-hidden")) : function() {
        return null
    }
}
  , qe = "Dialog"
  , [Ze,Je] = l(qe)
  , [Qe,et] = Ze(qe)
  , tt = t => {
    const {__scopeDialog: n, children: r, open: o, defaultOpen: a, onOpenChange: s, modal: c=!0} = t
      , u = e.useRef(null)
      , l = e.useRef(null)
      , [d,f] = L({
        prop: o,
        defaultProp: a ?? !1,
        onChange: s,
        caller: qe
    });
    return i.jsx(Qe, {
        scope: n,
        triggerRef: u,
        contentRef: l,
        contentId: B(),
        titleId: B(),
        descriptionId: B(),
        open: d,
        onOpenChange: f,
        onOpenToggle: e.useCallback( () => f(e => !e), [f]),
        modal: c,
        children: r
    })
}
;
tt.displayName = qe;
var nt = "DialogTrigger"
  , rt = e.forwardRef( (e, t) => {
    const {__scopeDialog: n, ...r} = e
      , o = et(nt, n)
      , a = c(t, o.triggerRef);
    return i.jsx(y.button, {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": Et(o.open),
        ...r,
        ref: a,
        onClick: u(e.onClick, o.onOpenToggle)
    })
}
);
rt.displayName = nt;
var ot = "DialogPortal"
  , [it,at] = Ze(ot, {
    forceMount: void 0
})
  , st = t => {
    const {__scopeDialog: n, forceMount: r, children: o, container: a} = t
      , s = et(ot, n);
    return i.jsx(it, {
        scope: n,
        forceMount: r,
        children: e.Children.map(o, e => i.jsx(T, {
            present: r || s.open,
            children: i.jsx(N, {
                asChild: !0,
                container: a,
                children: e
            })
        }))
    })
}
;
st.displayName = ot;
var ct = "DialogOverlay"
  , ut = e.forwardRef( (e, t) => {
    const n = at(ct, e.__scopeDialog)
      , {forceMount: r=n.forceMount, ...o} = e
      , a = et(ct, e.__scopeDialog);
    return a.modal ? i.jsx(T, {
        present: r || a.open,
        children: i.jsx(dt, {
            ...o,
            ref: t
        })
    }) : null
}
);
ut.displayName = ct;
var lt = f("DialogOverlay.RemoveScroll")
  , dt = e.forwardRef( (e, t) => {
    const {__scopeDialog: n, ...r} = e
      , o = et(ct, n);
    return i.jsx($e, {
        as: lt,
        allowPinchZoom: !0,
        shards: [o.contentRef],
        children: i.jsx(y.div, {
            "data-state": Et(o.open),
            ...r,
            ref: t,
            style: {
                pointerEvents: "auto",
                ...r.style
            }
        })
    })
}
)
  , ft = "DialogContent"
  , pt = e.forwardRef( (e, t) => {
    const n = at(ft, e.__scopeDialog)
      , {forceMount: r=n.forceMount, ...o} = e
      , a = et(ft, e.__scopeDialog);
    return i.jsx(T, {
        present: r || a.open,
        children: a.modal ? i.jsx(mt, {
            ...o,
            ref: t
        }) : i.jsx(ht, {
            ...o,
            ref: t
        })
    })
}
);
pt.displayName = ft;
var mt = e.forwardRef( (t, n) => {
    const r = et(ft, t.__scopeDialog)
      , o = e.useRef(null)
      , a = c(n, r.contentRef, o);
    return e.useEffect( () => {
        const e = o.current;
        if (e)
            return Ye(e)
    }
    , []),
    i.jsx(gt, {
        ...t,
        ref: a,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: u(t.onCloseAutoFocus, e => {
            e.preventDefault(),
            r.triggerRef.current?.focus()
        }
        ),
        onPointerDownOutside: u(t.onPointerDownOutside, e => {
            const t = e.detail.originalEvent
              , n = 0 === t.button && !0 === t.ctrlKey;
            (2 === t.button || n) && e.preventDefault()
        }
        ),
        onFocusOutside: u(t.onFocusOutside, e => e.preventDefault())
    })
}
)
  , ht = e.forwardRef( (t, n) => {
    const r = et(ft, t.__scopeDialog)
      , o = e.useRef(!1)
      , a = e.useRef(!1);
    return i.jsx(gt, {
        ...t,
        ref: n,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: e => {
            t.onCloseAutoFocus?.(e),
            e.defaultPrevented || (o.current || r.triggerRef.current?.focus(),
            e.preventDefault()),
            o.current = !1,
            a.current = !1
        }
        ,
        onInteractOutside: e => {
            t.onInteractOutside?.(e),
            e.defaultPrevented || (o.current = !0,
            "pointerdown" === e.detail.originalEvent.type && (a.current = !0));
            const n = e.target
              , i = r.triggerRef.current?.contains(n);
            i && e.preventDefault(),
            "focusin" === e.detail.originalEvent.type && a.current && e.preventDefault()
        }
    })
}
)
  , gt = e.forwardRef( (t, n) => {
    const {__scopeDialog: r, trapFocus: o, onOpenAutoFocus: a, onCloseAutoFocus: s, ...u} = t
      , l = et(ft, r)
      , d = e.useRef(null)
      , f = c(n, d);
    return J(),
    i.jsxs(i.Fragment, {
        children: [i.jsx(U, {
            asChild: !0,
            loop: !0,
            trapped: o,
            onMountAutoFocus: a,
            onUnmountAutoFocus: s,
            children: i.jsx(D, {
                role: "dialog",
                id: l.contentId,
                "aria-describedby": l.descriptionId,
                "aria-labelledby": l.titleId,
                "data-state": Et(l.open),
                ...u,
                ref: f,
                onDismiss: () => l.onOpenChange(!1)
            })
        }), i.jsxs(i.Fragment, {
            children: [i.jsx(Mt, {
                titleId: l.titleId
            }), i.jsx(St, {
                contentRef: d,
                descriptionId: l.descriptionId
            })]
        })]
    })
}
)
  , vt = "DialogTitle"
  , yt = e.forwardRef( (e, t) => {
    const {__scopeDialog: n, ...r} = e
      , o = et(vt, n);
    return i.jsx(y.h2, {
        id: o.titleId,
        ...r,
        ref: t
    })
}
);
yt.displayName = vt;
var wt = "DialogDescription"
  , bt = e.forwardRef( (e, t) => {
    const {__scopeDialog: n, ...r} = e
      , o = et(wt, n);
    return i.jsx(y.p, {
        id: o.descriptionId,
        ...r,
        ref: t
    })
}
);
bt.displayName = wt;
var xt = "DialogClose"
  , Rt = e.forwardRef( (e, t) => {
    const {__scopeDialog: n, ...r} = e
      , o = et(xt, n);
    return i.jsx(y.button, {
        type: "button",
        ...r,
        ref: t,
        onClick: u(e.onClick, () => o.onOpenChange(!1))
    })
}
);
function Et(e) {
    return e ? "open" : "closed"
}
Rt.displayName = xt;
var Ct = "DialogTitleWarning"
  , [_t,Dt] = function(t, n) {
    const r = e.createContext(n)
      , o = t => {
        const {children: n, ...o} = t
          , a = e.useMemo( () => o, Object.values(o));
        return i.jsx(r.Provider, {
            value: a,
            children: n
        })
    }
    ;
    return o.displayName = t + "Provider",
    [o, function(o) {
        const i = e.useContext(r);
        if (i)
            return i;
        if (void 0 !== n)
            return n;
        throw new Error(`\`${o}\` must be used within \`${t}\``)
    }
    ]
}(Ct, {
    contentName: ft,
    titleName: vt,
    docsSlug: "dialog"
})
  , Mt = ({titleId: t}) => {
    const n = Dt(Ct)
      , r = `\`${n.contentName}\` requires a \`${n.titleName}\` for the component to be accessible for screen reader users.\n\nIf you want to hide the \`${n.titleName}\`, you can wrap it with our VisuallyHidden component.\n\nFor more information, see https://radix-ui.com/primitives/docs/components/${n.docsSlug}`;
    return e.useEffect( () => {
        if (t) {
            document.getElementById(t)
        }
    }
    , [r, t]),
    null
}
  , St = ({contentRef: t, descriptionId: n}) => {
    const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Dt("DialogDescriptionWarning").contentName}}.`;
    return e.useEffect( () => {
        const e = t.current?.getAttribute("aria-describedby");
        if (n && e) {
            document.getElementById(n)
        }
    }
    , [r, t, n]),
    null
}
  , At = tt
  , Ot = rt
  , Pt = st
  , jt = ut
  , Nt = pt
  , Tt = yt
  , kt = bt
  , It = Rt
  , Lt = e.createContext(void 0);
function Ft(t) {
    const n = e.useContext(Lt);
    return t || n || "ltr"
}
var Wt = "rovingFocusGroup.onEntryFocus"
  , Bt = {
    bubbles: !1,
    cancelable: !0
}
  , Kt = "RovingFocusGroup"
  , [$t,Ht,Ut] = v(Kt)
  , [Vt,zt] = l(Kt, [Ut])
  , [Gt,Xt] = Vt(Kt)
  , Yt = e.forwardRef( (e, t) => i.jsx($t.Provider, {
    scope: e.__scopeRovingFocusGroup,
    children: i.jsx($t.Slot, {
        scope: e.__scopeRovingFocusGroup,
        children: i.jsx(qt, {
            ...e,
            ref: t
        })
    })
}));
Yt.displayName = Kt;
var qt = e.forwardRef( (t, n) => {
    const {__scopeRovingFocusGroup: r, orientation: o, loop: a=!1, dir: s, currentTabStopId: l, defaultCurrentTabStopId: d, onCurrentTabStopIdChange: f, onEntryFocus: p, preventScrollOnEntryFocus: m=!1, ...h} = t
      , g = e.useRef(null)
      , v = c(n, g)
      , w = Ft(s)
      , [x,R] = L({
        prop: l,
        defaultProp: d ?? null,
        onChange: f,
        caller: Kt
    })
      , [E,C] = e.useState(!1)
      , _ = b(p)
      , D = Ht(r)
      , M = e.useRef(!1)
      , [S,A] = e.useState(0);
    return e.useEffect( () => {
        const e = g.current;
        if (e)
            return e.addEventListener(Wt, _),
            () => e.removeEventListener(Wt, _)
    }
    , [_]),
    i.jsx(Gt, {
        scope: r,
        orientation: o,
        dir: w,
        loop: a,
        currentTabStopId: x,
        onItemFocus: e.useCallback(e => R(e), [R]),
        onItemShiftTab: e.useCallback( () => C(!0), []),
        onFocusableItemAdd: e.useCallback( () => A(e => e + 1), []),
        onFocusableItemRemove: e.useCallback( () => A(e => e - 1), []),
        children: i.jsx(y.div, {
            tabIndex: E || 0 === S ? -1 : 0,
            "data-orientation": o,
            ...h,
            ref: v,
            style: {
                outline: "none",
                ...t.style
            },
            onMouseDown: u(t.onMouseDown, () => {
                M.current = !0
            }
            ),
            onFocus: u(t.onFocus, e => {
                const t = !M.current;
                if (e.target === e.currentTarget && t && !E) {
                    const t = new CustomEvent(Wt,Bt);
                    if (e.currentTarget.dispatchEvent(t),
                    !t.defaultPrevented) {
                        const e = D().filter(e => e.focusable);
                        en([e.find(e => e.active), e.find(e => e.id === x), ...e].filter(Boolean).map(e => e.ref.current), m)
                    }
                }
                M.current = !1
            }
            ),
            onBlur: u(t.onBlur, () => C(!1))
        })
    })
}
)
  , Zt = "RovingFocusGroupItem"
  , Jt = e.forwardRef( (t, n) => {
    const {__scopeRovingFocusGroup: r, focusable: o=!0, active: a=!1, tabStopId: s, children: c, ...l} = t
      , d = B()
      , f = s || d
      , p = Xt(Zt, r)
      , m = p.currentTabStopId === f
      , h = Ht(r)
      , {onFocusableItemAdd: g, onFocusableItemRemove: v, currentTabStopId: w} = p;
    return e.useEffect( () => {
        if (o)
            return g(),
            () => v()
    }
    , [o, g, v]),
    i.jsx($t.ItemSlot, {
        scope: r,
        id: f,
        focusable: o,
        active: a,
        children: i.jsx(y.span, {
            tabIndex: m ? 0 : -1,
            "data-orientation": p.orientation,
            ...l,
            ref: n,
            onMouseDown: u(t.onMouseDown, e => {
                o ? p.onItemFocus(f) : e.preventDefault()
            }
            ),
            onFocus: u(t.onFocus, () => p.onItemFocus(f)),
            onKeyDown: u(t.onKeyDown, e => {
                if ("Tab" === e.key && e.shiftKey)
                    return void p.onItemShiftTab();
                if (e.target !== e.currentTarget)
                    return;
                const t = function(e, t, n) {
                    const r = function(e, t) {
                        return "rtl" !== t ? e : "ArrowLeft" === e ? "ArrowRight" : "ArrowRight" === e ? "ArrowLeft" : e
                    }(e.key, n);
                    return "vertical" === t && ["ArrowLeft", "ArrowRight"].includes(r) || "horizontal" === t && ["ArrowUp", "ArrowDown"].includes(r) ? void 0 : Qt[r]
                }(e, p.orientation, p.dir);
                if (void 0 !== t) {
                    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
                        return;
                    e.preventDefault();
                    let o = h().filter(e => e.focusable).map(e => e.ref.current);
                    if ("last" === t)
                        o.reverse();
                    else if ("prev" === t || "next" === t) {
                        "prev" === t && o.reverse();
                        const i = o.indexOf(e.currentTarget);
                        o = p.loop ? (r = i + 1,
                        (n = o).map( (e, t) => n[(r + t) % n.length])) : o.slice(i + 1)
                    }
                    setTimeout( () => en(o))
                }
                var n, r
            }
            ),
            children: "function" == typeof c ? c({
                isCurrentTabStop: m,
                hasTabStop: null != w
            }) : c
        })
    })
}
);
Jt.displayName = Zt;
var Qt = {
    ArrowLeft: "prev",
    ArrowUp: "prev",
    ArrowRight: "next",
    ArrowDown: "next",
    PageUp: "first",
    Home: "first",
    PageDown: "last",
    End: "last"
};
function en(e, t=!1) {
    const n = document.activeElement;
    for (const r of e) {
        if (r === n)
            return;
        if (r.focus({
            preventScroll: t
        }),
        document.activeElement !== n)
            return
    }
}
var tn = Yt
  , nn = Jt;
const rn = ["top", "right", "bottom", "left"]
  , on = Math.min
  , an = Math.max
  , sn = Math.round
  , cn = Math.floor
  , un = e => ({
    x: e,
    y: e
})
  , ln = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
}
  , dn = {
    start: "end",
    end: "start"
};
function fn(e, t, n) {
    return an(e, on(t, n))
}
function pn(e, t) {
    return "function" == typeof e ? e(t) : e
}
function mn(e) {
    return e.split("-")[0]
}
function hn(e) {
    return e.split("-")[1]
}
function gn(e) {
    return "x" === e ? "y" : "x"
}
function vn(e) {
    return "y" === e ? "height" : "width"
}
const yn = new Set(["top", "bottom"]);
function wn(e) {
    return yn.has(mn(e)) ? "y" : "x"
}
function bn(e) {
    return gn(wn(e))
}
function xn(e) {
    return e.replace(/start|end/g, e => dn[e])
}
const Rn = ["left", "right"]
  , En = ["right", "left"]
  , Cn = ["top", "bottom"]
  , _n = ["bottom", "top"];
function Dn(e, t, n, r) {
    const o = hn(e);
    let i = function(e, t, n) {
        switch (e) {
        case "top":
        case "bottom":
            return n ? t ? En : Rn : t ? Rn : En;
        case "left":
        case "right":
            return t ? Cn : _n;
        default:
            return []
        }
    }(mn(e), "start" === n, r);
    return o && (i = i.map(e => e + "-" + o),
    t && (i = i.concat(i.map(xn)))),
    i
}
function Mn(e) {
    return e.replace(/left|right|bottom|top/g, e => ln[e])
}
function Sn(e) {
    return "number" != typeof e ? function(e) {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            ...e
        }
    }(e) : {
        top: e,
        right: e,
        bottom: e,
        left: e
    }
}
function An(e) {
    const {x: t, y: n, width: r, height: o} = e;
    return {
        width: r,
        height: o,
        top: n,
        left: t,
        right: t + r,
        bottom: n + o,
        x: t,
        y: n
    }
}
function On(e, t, n) {
    let {reference: r, floating: o} = e;
    const i = wn(t)
      , a = bn(t)
      , s = vn(a)
      , c = mn(t)
      , u = "y" === i
      , l = r.x + r.width / 2 - o.width / 2
      , d = r.y + r.height / 2 - o.height / 2
      , f = r[s] / 2 - o[s] / 2;
    let p;
    switch (c) {
    case "top":
        p = {
            x: l,
            y: r.y - o.height
        };
        break;
    case "bottom":
        p = {
            x: l,
            y: r.y + r.height
        };
        break;
    case "right":
        p = {
            x: r.x + r.width,
            y: d
        };
        break;
    case "left":
        p = {
            x: r.x - o.width,
            y: d
        };
        break;
    default:
        p = {
            x: r.x,
            y: r.y
        }
    }
    switch (hn(t)) {
    case "start":
        p[a] -= f * (n && u ? -1 : 1);
        break;
    case "end":
        p[a] += f * (n && u ? -1 : 1)
    }
    return p
}
async function Pn(e, t) {
    var n;
    void 0 === t && (t = {});
    const {x: r, y: o, platform: i, rects: a, elements: s, strategy: c} = e
      , {boundary: u="clippingAncestors", rootBoundary: l="viewport", elementContext: d="floating", altBoundary: f=!1, padding: p=0} = pn(t, e)
      , m = Sn(p)
      , h = s[f ? "floating" === d ? "reference" : "floating" : d]
      , g = An(await i.getClippingRect({
        element: null == (n = await (null == i.isElement ? void 0 : i.isElement(h))) || n ? h : h.contextElement || await (null == i.getDocumentElement ? void 0 : i.getDocumentElement(s.floating)),
        boundary: u,
        rootBoundary: l,
        strategy: c
    }))
      , v = "floating" === d ? {
        x: r,
        y: o,
        width: a.floating.width,
        height: a.floating.height
    } : a.reference
      , y = await (null == i.getOffsetParent ? void 0 : i.getOffsetParent(s.floating))
      , w = await (null == i.isElement ? void 0 : i.isElement(y)) && await (null == i.getScale ? void 0 : i.getScale(y)) || {
        x: 1,
        y: 1
    }
      , b = An(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
        elements: s,
        rect: v,
        offsetParent: y,
        strategy: c
    }) : v);
    return {
        top: (g.top - b.top + m.top) / w.y,
        bottom: (b.bottom - g.bottom + m.bottom) / w.y,
        left: (g.left - b.left + m.left) / w.x,
        right: (b.right - g.right + m.right) / w.x
    }
}
function jn(e, t) {
    return {
        top: e.top - t.height,
        right: e.right - t.width,
        bottom: e.bottom - t.height,
        left: e.left - t.width
    }
}
function Nn(e) {
    return rn.some(t => e[t] >= 0)
}
const Tn = new Set(["left", "top"]);
function kn() {
    return "undefined" != typeof window
}
function In(e) {
    return Wn(e) ? (e.nodeName || "").toLowerCase() : "#document"
}
function Ln(e) {
    var t;
    return (null == e || null == (t = e.ownerDocument) ? void 0 : t.defaultView) || window
}
function Fn(e) {
    var t;
    return null == (t = (Wn(e) ? e.ownerDocument : e.document) || window.document) ? void 0 : t.documentElement
}
function Wn(e) {
    return !!kn() && (e instanceof Node || e instanceof Ln(e).Node)
}
function Bn(e) {
    return !!kn() && (e instanceof Element || e instanceof Ln(e).Element)
}
function Kn(e) {
    return !!kn() && (e instanceof HTMLElement || e instanceof Ln(e).HTMLElement)
}
function $n(e) {
    return !(!kn() || "undefined" == typeof ShadowRoot) && (e instanceof ShadowRoot || e instanceof Ln(e).ShadowRoot)
}
const Hn = new Set(["inline", "contents"]);
function Un(e) {
    const {overflow: t, overflowX: n, overflowY: r, display: o} = nr(e);
    return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && !Hn.has(o)
}
const Vn = new Set(["table", "td", "th"]);
function zn(e) {
    return Vn.has(In(e))
}
const Gn = [":popover-open", ":modal"];
function Xn(e) {
    return Gn.some(t => {
        try {
            return e.matches(t)
        } catch (n) {
            return !1
        }
    }
    )
}
const Yn = ["transform", "translate", "scale", "rotate", "perspective"]
  , qn = ["transform", "translate", "scale", "rotate", "perspective", "filter"]
  , Zn = ["paint", "layout", "strict", "content"];
function Jn(e) {
    const t = Qn()
      , n = Bn(e) ? nr(e) : e;
    return Yn.some(e => !!n[e] && "none" !== n[e]) || !!n.containerType && "normal" !== n.containerType || !t && !!n.backdropFilter && "none" !== n.backdropFilter || !t && !!n.filter && "none" !== n.filter || qn.some(e => (n.willChange || "").includes(e)) || Zn.some(e => (n.contain || "").includes(e))
}
function Qn() {
    return !("undefined" == typeof CSS || !CSS.supports) && CSS.supports("-webkit-backdrop-filter", "none")
}
const er = new Set(["html", "body", "#document"]);
function tr(e) {
    return er.has(In(e))
}
function nr(e) {
    return Ln(e).getComputedStyle(e)
}
function rr(e) {
    return Bn(e) ? {
        scrollLeft: e.scrollLeft,
        scrollTop: e.scrollTop
    } : {
        scrollLeft: e.scrollX,
        scrollTop: e.scrollY
    }
}
function or(e) {
    if ("html" === In(e))
        return e;
    const t = e.assignedSlot || e.parentNode || $n(e) && e.host || Fn(e);
    return $n(t) ? t.host : t
}
function ir(e) {
    const t = or(e);
    return tr(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Kn(t) && Un(t) ? t : ir(t)
}
function ar(e, t, n) {
    var r;
    void 0 === t && (t = []),
    void 0 === n && (n = !0);
    const o = ir(e)
      , i = o === (null == (r = e.ownerDocument) ? void 0 : r.body)
      , a = Ln(o);
    if (i) {
        const e = sr(a);
        return t.concat(a, a.visualViewport || [], Un(o) ? o : [], e && n ? ar(e) : [])
    }
    return t.concat(o, ar(o, [], n))
}
function sr(e) {
    return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null
}
function cr(e) {
    const t = nr(e);
    let n = parseFloat(t.width) || 0
      , r = parseFloat(t.height) || 0;
    const o = Kn(e)
      , i = o ? e.offsetWidth : n
      , a = o ? e.offsetHeight : r
      , s = sn(n) !== i || sn(r) !== a;
    return s && (n = i,
    r = a),
    {
        width: n,
        height: r,
        $: s
    }
}
function ur(e) {
    return Bn(e) ? e : e.contextElement
}
function lr(e) {
    const t = ur(e);
    if (!Kn(t))
        return un(1);
    const n = t.getBoundingClientRect()
      , {width: r, height: o, $: i} = cr(t);
    let a = (i ? sn(n.width) : n.width) / r
      , s = (i ? sn(n.height) : n.height) / o;
    return a && Number.isFinite(a) || (a = 1),
    s && Number.isFinite(s) || (s = 1),
    {
        x: a,
        y: s
    }
}
const dr = un(0);
function fr(e) {
    const t = Ln(e);
    return Qn() && t.visualViewport ? {
        x: t.visualViewport.offsetLeft,
        y: t.visualViewport.offsetTop
    } : dr
}
function pr(e, t, n, r) {
    void 0 === t && (t = !1),
    void 0 === n && (n = !1);
    const o = e.getBoundingClientRect()
      , i = ur(e);
    let a = un(1);
    t && (r ? Bn(r) && (a = lr(r)) : a = lr(e));
    const s = function(e, t, n) {
        return void 0 === t && (t = !1),
        !(!n || t && n !== Ln(e)) && t
    }(i, n, r) ? fr(i) : un(0);
    let c = (o.left + s.x) / a.x
      , u = (o.top + s.y) / a.y
      , l = o.width / a.x
      , d = o.height / a.y;
    if (i) {
        const e = Ln(i)
          , t = r && Bn(r) ? Ln(r) : r;
        let n = e
          , o = sr(n);
        for (; o && r && t !== n; ) {
            const e = lr(o)
              , t = o.getBoundingClientRect()
              , r = nr(o)
              , i = t.left + (o.clientLeft + parseFloat(r.paddingLeft)) * e.x
              , a = t.top + (o.clientTop + parseFloat(r.paddingTop)) * e.y;
            c *= e.x,
            u *= e.y,
            l *= e.x,
            d *= e.y,
            c += i,
            u += a,
            n = Ln(o),
            o = sr(n)
        }
    }
    return An({
        width: l,
        height: d,
        x: c,
        y: u
    })
}
function mr(e, t) {
    const n = rr(e).scrollLeft;
    return t ? t.left + n : pr(Fn(e)).left + n
}
function hr(e, t) {
    const n = e.getBoundingClientRect();
    return {
        x: n.left + t.scrollLeft - mr(e, n),
        y: n.top + t.scrollTop
    }
}
const gr = new Set(["absolute", "fixed"]);
function vr(e, t, n) {
    let r;
    if ("viewport" === t)
        r = function(e, t) {
            const n = Ln(e)
              , r = Fn(e)
              , o = n.visualViewport;
            let i = r.clientWidth
              , a = r.clientHeight
              , s = 0
              , c = 0;
            if (o) {
                i = o.width,
                a = o.height;
                const e = Qn();
                (!e || e && "fixed" === t) && (s = o.offsetLeft,
                c = o.offsetTop)
            }
            const u = mr(r);
            if (u <= 0) {
                const e = r.ownerDocument
                  , t = e.body
                  , n = getComputedStyle(t)
                  , o = "CSS1Compat" === e.compatMode && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0
                  , a = Math.abs(r.clientWidth - t.clientWidth - o);
                a <= 25 && (i -= a)
            } else
                u <= 25 && (i += u);
            return {
                width: i,
                height: a,
                x: s,
                y: c
            }
        }(e, n);
    else if ("document" === t)
        r = function(e) {
            const t = Fn(e)
              , n = rr(e)
              , r = e.ownerDocument.body
              , o = an(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth)
              , i = an(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
            let a = -n.scrollLeft + mr(e);
            const s = -n.scrollTop;
            return "rtl" === nr(r).direction && (a += an(t.clientWidth, r.clientWidth) - o),
            {
                width: o,
                height: i,
                x: a,
                y: s
            }
        }(Fn(e));
    else if (Bn(t))
        r = function(e, t) {
            const n = pr(e, !0, "fixed" === t)
              , r = n.top + e.clientTop
              , o = n.left + e.clientLeft
              , i = Kn(e) ? lr(e) : un(1);
            return {
                width: e.clientWidth * i.x,
                height: e.clientHeight * i.y,
                x: o * i.x,
                y: r * i.y
            }
        }(t, n);
    else {
        const n = fr(e);
        r = {
            x: t.x - n.x,
            y: t.y - n.y,
            width: t.width,
            height: t.height
        }
    }
    return An(r)
}
function yr(e, t) {
    const n = or(e);
    return !(n === t || !Bn(n) || tr(n)) && ("fixed" === nr(n).position || yr(n, t))
}
function wr(e, t, n) {
    const r = Kn(t)
      , o = Fn(t)
      , i = "fixed" === n
      , a = pr(e, !0, i, t);
    let s = {
        scrollLeft: 0,
        scrollTop: 0
    };
    const c = un(0);
    function u() {
        c.x = mr(o)
    }
    if (r || !r && !i)
        if (("body" !== In(t) || Un(o)) && (s = rr(t)),
        r) {
            const e = pr(t, !0, i, t);
            c.x = e.x + t.clientLeft,
            c.y = e.y + t.clientTop
        } else
            o && u();
    i && !r && o && u();
    const l = !o || r || i ? un(0) : hr(o, s);
    return {
        x: a.left + s.scrollLeft - c.x - l.x,
        y: a.top + s.scrollTop - c.y - l.y,
        width: a.width,
        height: a.height
    }
}
function br(e) {
    return "static" === nr(e).position
}
function xr(e, t) {
    if (!Kn(e) || "fixed" === nr(e).position)
        return null;
    if (t)
        return t(e);
    let n = e.offsetParent;
    return Fn(e) === n && (n = n.ownerDocument.body),
    n
}
function Rr(e, t) {
    const n = Ln(e);
    if (Xn(e))
        return n;
    if (!Kn(e)) {
        let t = or(e);
        for (; t && !tr(t); ) {
            if (Bn(t) && !br(t))
                return t;
            t = or(t)
        }
        return n
    }
    let r = xr(e, t);
    for (; r && zn(r) && br(r); )
        r = xr(r, t);
    return r && tr(r) && br(r) && !Jn(r) ? n : r || function(e) {
        let t = or(e);
        for (; Kn(t) && !tr(t); ) {
            if (Jn(t))
                return t;
            if (Xn(t))
                return null;
            t = or(t)
        }
        return null
    }(e) || n
}
const Er = {
    convertOffsetParentRelativeRectToViewportRelativeRect: function(e) {
        let {elements: t, rect: n, offsetParent: r, strategy: o} = e;
        const i = "fixed" === o
          , a = Fn(r)
          , s = !!t && Xn(t.floating);
        if (r === a || s && i)
            return n;
        let c = {
            scrollLeft: 0,
            scrollTop: 0
        }
          , u = un(1);
        const l = un(0)
          , d = Kn(r);
        if ((d || !d && !i) && (("body" !== In(r) || Un(a)) && (c = rr(r)),
        Kn(r))) {
            const e = pr(r);
            u = lr(r),
            l.x = e.x + r.clientLeft,
            l.y = e.y + r.clientTop
        }
        const f = !a || d || i ? un(0) : hr(a, c);
        return {
            width: n.width * u.x,
            height: n.height * u.y,
            x: n.x * u.x - c.scrollLeft * u.x + l.x + f.x,
            y: n.y * u.y - c.scrollTop * u.y + l.y + f.y
        }
    },
    getDocumentElement: Fn,
    getClippingRect: function(e) {
        let {element: t, boundary: n, rootBoundary: r, strategy: o} = e;
        const i = [..."clippingAncestors" === n ? Xn(t) ? [] : function(e, t) {
            const n = t.get(e);
            if (n)
                return n;
            let r = ar(e, [], !1).filter(e => Bn(e) && "body" !== In(e))
              , o = null;
            const i = "fixed" === nr(e).position;
            let a = i ? or(e) : e;
            for (; Bn(a) && !tr(a); ) {
                const t = nr(a)
                  , n = Jn(a);
                n || "fixed" !== t.position || (o = null),
                (i ? !n && !o : !n && "static" === t.position && o && gr.has(o.position) || Un(a) && !n && yr(e, a)) ? r = r.filter(e => e !== a) : o = t,
                a = or(a)
            }
            return t.set(e, r),
            r
        }(t, this._c) : [].concat(n), r]
          , a = i[0]
          , s = i.reduce( (e, n) => {
            const r = vr(t, n, o);
            return e.top = an(r.top, e.top),
            e.right = on(r.right, e.right),
            e.bottom = on(r.bottom, e.bottom),
            e.left = an(r.left, e.left),
            e
        }
        , vr(t, a, o));
        return {
            width: s.right - s.left,
            height: s.bottom - s.top,
            x: s.left,
            y: s.top
        }
    },
    getOffsetParent: Rr,
    getElementRects: async function(e) {
        const t = this.getOffsetParent || Rr
          , n = this.getDimensions
          , r = await n(e.floating);
        return {
            reference: wr(e.reference, await t(e.floating), e.strategy),
            floating: {
                x: 0,
                y: 0,
                width: r.width,
                height: r.height
            }
        }
    },
    getClientRects: function(e) {
        return Array.from(e.getClientRects())
    },
    getDimensions: function(e) {
        const {width: t, height: n} = cr(e);
        return {
            width: t,
            height: n
        }
    },
    getScale: lr,
    isElement: Bn,
    isRTL: function(e) {
        return "rtl" === nr(e).direction
    }
};
function Cr(e, t) {
    return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height
}
function _r(e, t, n, r) {
    void 0 === r && (r = {});
    const {ancestorScroll: o=!0, ancestorResize: i=!0, elementResize: a="function" == typeof ResizeObserver, layoutShift: s="function" == typeof IntersectionObserver, animationFrame: c=!1} = r
      , u = ur(e)
      , l = o || i ? [...u ? ar(u) : [], ...ar(t)] : [];
    l.forEach(e => {
        o && e.addEventListener("scroll", n, {
            passive: !0
        }),
        i && e.addEventListener("resize", n)
    }
    );
    const d = u && s ? function(e, t) {
        let n, r = null;
        const o = Fn(e);
        function i() {
            var e;
            clearTimeout(n),
            null == (e = r) || e.disconnect(),
            r = null
        }
        return function a(s, c) {
            void 0 === s && (s = !1),
            void 0 === c && (c = 1),
            i();
            const u = e.getBoundingClientRect()
              , {left: l, top: d, width: f, height: p} = u;
            if (s || t(),
            !f || !p)
                return;
            const m = {
                rootMargin: -cn(d) + "px " + -cn(o.clientWidth - (l + f)) + "px " + -cn(o.clientHeight - (d + p)) + "px " + -cn(l) + "px",
                threshold: an(0, on(1, c)) || 1
            };
            let h = !0;
            function g(t) {
                const r = t[0].intersectionRatio;
                if (r !== c) {
                    if (!h)
                        return a();
                    r ? a(!1, r) : n = setTimeout( () => {
                        a(!1, 1e-7)
                    }
                    , 1e3)
                }
                1 !== r || Cr(u, e.getBoundingClientRect()) || a(),
                h = !1
            }
            try {
                r = new IntersectionObserver(g,{
                    ...m,
                    root: o.ownerDocument
                })
            } catch (v) {
                r = new IntersectionObserver(g,m)
            }
            r.observe(e)
        }(!0),
        i
    }(u, n) : null;
    let f, p = -1, m = null;
    a && (m = new ResizeObserver(e => {
        let[r] = e;
        r && r.target === u && m && (m.unobserve(t),
        cancelAnimationFrame(p),
        p = requestAnimationFrame( () => {
            var e;
            null == (e = m) || e.observe(t)
        }
        )),
        n()
    }
    ),
    u && !c && m.observe(u),
    m.observe(t));
    let h = c ? pr(e) : null;
    return c && function t() {
        const r = pr(e);
        h && !Cr(h, r) && n();
        h = r,
        f = requestAnimationFrame(t)
    }(),
    n(),
    () => {
        var e;
        l.forEach(e => {
            o && e.removeEventListener("scroll", n),
            i && e.removeEventListener("resize", n)
        }
        ),
        null == d || d(),
        null == (e = m) || e.disconnect(),
        m = null,
        c && cancelAnimationFrame(f)
    }
}
const Dr = function(e) {
    return void 0 === e && (e = 0),
    {
        name: "offset",
        options: e,
        async fn(t) {
            var n, r;
            const {x: o, y: i, placement: a, middlewareData: s} = t
              , c = await async function(e, t) {
                const {placement: n, platform: r, elements: o} = e
                  , i = await (null == r.isRTL ? void 0 : r.isRTL(o.floating))
                  , a = mn(n)
                  , s = hn(n)
                  , c = "y" === wn(n)
                  , u = Tn.has(a) ? -1 : 1
                  , l = i && c ? -1 : 1
                  , d = pn(t, e);
                let {mainAxis: f, crossAxis: p, alignmentAxis: m} = "number" == typeof d ? {
                    mainAxis: d,
                    crossAxis: 0,
                    alignmentAxis: null
                } : {
                    mainAxis: d.mainAxis || 0,
                    crossAxis: d.crossAxis || 0,
                    alignmentAxis: d.alignmentAxis
                };
                return s && "number" == typeof m && (p = "end" === s ? -1 * m : m),
                c ? {
                    x: p * l,
                    y: f * u
                } : {
                    x: f * u,
                    y: p * l
                }
            }(t, e);
            return a === (null == (n = s.offset) ? void 0 : n.placement) && null != (r = s.arrow) && r.alignmentOffset ? {} : {
                x: o + c.x,
                y: i + c.y,
                data: {
                    ...c,
                    placement: a
                }
            }
        }
    }
}
  , Mr = function(e) {
    return void 0 === e && (e = {}),
    {
        name: "shift",
        options: e,
        async fn(t) {
            const {x: n, y: r, placement: o} = t
              , {mainAxis: i=!0, crossAxis: a=!1, limiter: s={
                fn: e => {
                    let {x: t, y: n} = e;
                    return {
                        x: t,
                        y: n
                    }
                }
            }, ...c} = pn(e, t)
              , u = {
                x: n,
                y: r
            }
              , l = await Pn(t, c)
              , d = wn(mn(o))
              , f = gn(d);
            let p = u[f]
              , m = u[d];
            if (i) {
                const e = "y" === f ? "bottom" : "right";
                p = fn(p + l["y" === f ? "top" : "left"], p, p - l[e])
            }
            if (a) {
                const e = "y" === d ? "bottom" : "right";
                m = fn(m + l["y" === d ? "top" : "left"], m, m - l[e])
            }
            const h = s.fn({
                ...t,
                [f]: p,
                [d]: m
            });
            return {
                ...h,
                data: {
                    x: h.x - n,
                    y: h.y - r,
                    enabled: {
                        [f]: i,
                        [d]: a
                    }
                }
            }
        }
    }
}
  , Sr = function(e) {
    return void 0 === e && (e = {}),
    {
        name: "flip",
        options: e,
        async fn(t) {
            var n, r;
            const {placement: o, middlewareData: i, rects: a, initialPlacement: s, platform: c, elements: u} = t
              , {mainAxis: l=!0, crossAxis: d=!0, fallbackPlacements: f, fallbackStrategy: p="bestFit", fallbackAxisSideDirection: m="none", flipAlignment: h=!0, ...g} = pn(e, t);
            if (null != (n = i.arrow) && n.alignmentOffset)
                return {};
            const v = mn(o)
              , y = wn(s)
              , w = mn(s) === s
              , b = await (null == c.isRTL ? void 0 : c.isRTL(u.floating))
              , x = f || (w || !h ? [Mn(s)] : function(e) {
                const t = Mn(e);
                return [xn(e), t, xn(t)]
            }(s))
              , R = "none" !== m;
            !f && R && x.push(...Dn(s, h, m, b));
            const E = [s, ...x]
              , C = await Pn(t, g)
              , _ = [];
            let D = (null == (r = i.flip) ? void 0 : r.overflows) || [];
            if (l && _.push(C[v]),
            d) {
                const e = function(e, t, n) {
                    void 0 === n && (n = !1);
                    const r = hn(e)
                      , o = bn(e)
                      , i = vn(o);
                    let a = "x" === o ? r === (n ? "end" : "start") ? "right" : "left" : "start" === r ? "bottom" : "top";
                    return t.reference[i] > t.floating[i] && (a = Mn(a)),
                    [a, Mn(a)]
                }(o, a, b);
                _.push(C[e[0]], C[e[1]])
            }
            if (D = [...D, {
                placement: o,
                overflows: _
            }],
            !_.every(e => e <= 0)) {
                var M, S;
                const e = ((null == (M = i.flip) ? void 0 : M.index) || 0) + 1
                  , t = E[e];
                if (t) {
                    if (!("alignment" === d && y !== wn(t)) || D.every(e => wn(e.placement) !== y || e.overflows[0] > 0))
                        return {
                            data: {
                                index: e,
                                overflows: D
                            },
                            reset: {
                                placement: t
                            }
                        }
                }
                let n = null == (S = D.filter(e => e.overflows[0] <= 0).sort( (e, t) => e.overflows[1] - t.overflows[1])[0]) ? void 0 : S.placement;
                if (!n)
                    switch (p) {
                    case "bestFit":
                        {
                            var A;
                            const e = null == (A = D.filter(e => {
                                if (R) {
                                    const t = wn(e.placement);
                                    return t === y || "y" === t
                                }
                                return !0
                            }
                            ).map(e => [e.placement, e.overflows.filter(e => e > 0).reduce( (e, t) => e + t, 0)]).sort( (e, t) => e[1] - t[1])[0]) ? void 0 : A[0];
                            e && (n = e);
                            break
                        }
                    case "initialPlacement":
                        n = s
                    }
                if (o !== n)
                    return {
                        reset: {
                            placement: n
                        }
                    }
            }
            return {}
        }
    }
}
  , Ar = function(e) {
    return void 0 === e && (e = {}),
    {
        name: "size",
        options: e,
        async fn(t) {
            var n, r;
            const {placement: o, rects: i, platform: a, elements: s} = t
              , {apply: c= () => {}
            , ...u} = pn(e, t)
              , l = await Pn(t, u)
              , d = mn(o)
              , f = hn(o)
              , p = "y" === wn(o)
              , {width: m, height: h} = i.floating;
            let g, v;
            "top" === d || "bottom" === d ? (g = d,
            v = f === (await (null == a.isRTL ? void 0 : a.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (v = d,
            g = "end" === f ? "top" : "bottom");
            const y = h - l.top - l.bottom
              , w = m - l.left - l.right
              , b = on(h - l[g], y)
              , x = on(m - l[v], w)
              , R = !t.middlewareData.shift;
            let E = b
              , C = x;
            if (null != (n = t.middlewareData.shift) && n.enabled.x && (C = w),
            null != (r = t.middlewareData.shift) && r.enabled.y && (E = y),
            R && !f) {
                const e = an(l.left, 0)
                  , t = an(l.right, 0)
                  , n = an(l.top, 0)
                  , r = an(l.bottom, 0);
                p ? C = m - 2 * (0 !== e || 0 !== t ? e + t : an(l.left, l.right)) : E = h - 2 * (0 !== n || 0 !== r ? n + r : an(l.top, l.bottom))
            }
            await c({
                ...t,
                availableWidth: C,
                availableHeight: E
            });
            const _ = await a.getDimensions(s.floating);
            return m !== _.width || h !== _.height ? {
                reset: {
                    rects: !0
                }
            } : {}
        }
    }
}
  , Or = function(e) {
    return void 0 === e && (e = {}),
    {
        name: "hide",
        options: e,
        async fn(t) {
            const {rects: n} = t
              , {strategy: r="referenceHidden", ...o} = pn(e, t);
            switch (r) {
            case "referenceHidden":
                {
                    const e = jn(await Pn(t, {
                        ...o,
                        elementContext: "reference"
                    }), n.reference);
                    return {
                        data: {
                            referenceHiddenOffsets: e,
                            referenceHidden: Nn(e)
                        }
                    }
                }
            case "escaped":
                {
                    const e = jn(await Pn(t, {
                        ...o,
                        altBoundary: !0
                    }), n.floating);
                    return {
                        data: {
                            escapedOffsets: e,
                            escaped: Nn(e)
                        }
                    }
                }
            default:
                return {}
            }
        }
    }
}
  , Pr = e => ({
    name: "arrow",
    options: e,
    async fn(t) {
        const {x: n, y: r, placement: o, rects: i, platform: a, elements: s, middlewareData: c} = t
          , {element: u, padding: l=0} = pn(e, t) || {};
        if (null == u)
            return {};
        const d = Sn(l)
          , f = {
            x: n,
            y: r
        }
          , p = bn(o)
          , m = vn(p)
          , h = await a.getDimensions(u)
          , g = "y" === p
          , v = g ? "top" : "left"
          , y = g ? "bottom" : "right"
          , w = g ? "clientHeight" : "clientWidth"
          , b = i.reference[m] + i.reference[p] - f[p] - i.floating[m]
          , x = f[p] - i.reference[p]
          , R = await (null == a.getOffsetParent ? void 0 : a.getOffsetParent(u));
        let E = R ? R[w] : 0;
        E && await (null == a.isElement ? void 0 : a.isElement(R)) || (E = s.floating[w] || i.floating[m]);
        const C = b / 2 - x / 2
          , _ = E / 2 - h[m] / 2 - 1
          , D = on(d[v], _)
          , M = on(d[y], _)
          , S = D
          , A = E - h[m] - M
          , O = E / 2 - h[m] / 2 + C
          , P = fn(S, O, A)
          , j = !c.arrow && null != hn(o) && O !== P && i.reference[m] / 2 - (O < S ? D : M) - h[m] / 2 < 0
          , N = j ? O < S ? O - S : O - A : 0;
        return {
            [p]: f[p] + N,
            data: {
                [p]: P,
                centerOffset: O - P - N,
                ...j && {
                    alignmentOffset: N
                }
            },
            reset: j
        }
    }
})
  , jr = function(e) {
    return void 0 === e && (e = {}),
    {
        options: e,
        fn(t) {
            const {x: n, y: r, placement: o, rects: i, middlewareData: a} = t
              , {offset: s=0, mainAxis: c=!0, crossAxis: u=!0} = pn(e, t)
              , l = {
                x: n,
                y: r
            }
              , d = wn(o)
              , f = gn(d);
            let p = l[f]
              , m = l[d];
            const h = pn(s, t)
              , g = "number" == typeof h ? {
                mainAxis: h,
                crossAxis: 0
            } : {
                mainAxis: 0,
                crossAxis: 0,
                ...h
            };
            if (c) {
                const e = "y" === f ? "height" : "width"
                  , t = i.reference[f] - i.floating[e] + g.mainAxis
                  , n = i.reference[f] + i.reference[e] - g.mainAxis;
                p < t ? p = t : p > n && (p = n)
            }
            if (u) {
                var v, y;
                const e = "y" === f ? "width" : "height"
                  , t = Tn.has(mn(o))
                  , n = i.reference[d] - i.floating[e] + (t && (null == (v = a.offset) ? void 0 : v[d]) || 0) + (t ? 0 : g.crossAxis)
                  , r = i.reference[d] + i.reference[e] + (t ? 0 : (null == (y = a.offset) ? void 0 : y[d]) || 0) - (t ? g.crossAxis : 0);
                m < n ? m = n : m > r && (m = r)
            }
            return {
                [f]: p,
                [d]: m
            }
        }
    }
}
  , Nr = (e, t, n) => {
    const r = new Map
      , o = {
        platform: Er,
        ...n
    }
      , i = {
        ...o.platform,
        _c: r
    };
    return (async (e, t, n) => {
        const {placement: r="bottom", strategy: o="absolute", middleware: i=[], platform: a} = n
          , s = i.filter(Boolean)
          , c = await (null == a.isRTL ? void 0 : a.isRTL(t));
        let u = await a.getElementRects({
            reference: e,
            floating: t,
            strategy: o
        })
          , {x: l, y: d} = On(u, r, c)
          , f = r
          , p = {}
          , m = 0;
        for (let h = 0; h < s.length; h++) {
            const {name: n, fn: i} = s[h]
              , {x: g, y: v, data: y, reset: w} = await i({
                x: l,
                y: d,
                initialPlacement: r,
                placement: f,
                strategy: o,
                middlewareData: p,
                rects: u,
                platform: a,
                elements: {
                    reference: e,
                    floating: t
                }
            });
            l = null != g ? g : l,
            d = null != v ? v : d,
            p = {
                ...p,
                [n]: {
                    ...p[n],
                    ...y
                }
            },
            w && m <= 50 && (m++,
            "object" == typeof w && (w.placement && (f = w.placement),
            w.rects && (u = !0 === w.rects ? await a.getElementRects({
                reference: e,
                floating: t,
                strategy: o
            }) : w.rects),
            ({x: l, y: d} = On(u, f, c))),
            h = -1)
        }
        return {
            x: l,
            y: d,
            placement: f,
            strategy: o,
            middlewareData: p
        }
    }
    )(e, t, {
        ...o,
        platform: i
    })
}
;
var Tr = "undefined" != typeof document ? e.useLayoutEffect : function() {}
;
function kr(e, t) {
    if (e === t)
        return !0;
    if (typeof e != typeof t)
        return !1;
    if ("function" == typeof e && e.toString() === t.toString())
        return !0;
    let n, r, o;
    if (e && t && "object" == typeof e) {
        if (Array.isArray(e)) {
            if (n = e.length,
            n !== t.length)
                return !1;
            for (r = n; 0 !== r--; )
                if (!kr(e[r], t[r]))
                    return !1;
            return !0
        }
        if (o = Object.keys(e),
        n = o.length,
        n !== Object.keys(t).length)
            return !1;
        for (r = n; 0 !== r--; )
            if (!{}.hasOwnProperty.call(t, o[r]))
                return !1;
        for (r = n; 0 !== r--; ) {
            const n = o[r];
            if (("_owner" !== n || !e.$$typeof) && !kr(e[n], t[n]))
                return !1
        }
        return !0
    }
    return e != e && t != t
}
function Ir(e) {
    if ("undefined" == typeof window)
        return 1;
    return (e.ownerDocument.defaultView || window).devicePixelRatio || 1
}
function Lr(e, t) {
    const n = Ir(e);
    return Math.round(t * n) / n
}
function Fr(t) {
    const n = e.useRef(t);
    return Tr( () => {
        n.current = t
    }
    ),
    n
}
const Wr = e => ({
    name: "arrow",
    options: e,
    fn(t) {
        const {element: n, padding: r} = "function" == typeof e ? e(t) : e;
        return n && (o = n,
        {}.hasOwnProperty.call(o, "current")) ? null != n.current ? Pr({
            element: n.current,
            padding: r
        }).fn(t) : {} : n ? Pr({
            element: n,
            padding: r
        }).fn(t) : {};
        var o
    }
})
  , Br = (e, t) => ({
    ...Dr(e),
    options: [e, t]
})
  , Kr = (e, t) => ({
    ...Mr(e),
    options: [e, t]
})
  , $r = (e, t) => ({
    ...jr(e),
    options: [e, t]
})
  , Hr = (e, t) => ({
    ...Sr(e),
    options: [e, t]
})
  , Ur = (e, t) => ({
    ...Ar(e),
    options: [e, t]
})
  , Vr = (e, t) => ({
    ...Or(e),
    options: [e, t]
})
  , zr = (e, t) => ({
    ...Wr(e),
    options: [e, t]
});
var Gr = e.forwardRef( (e, t) => {
    const {children: n, width: r=10, height: o=5, ...a} = e;
    return i.jsx(y.svg, {
        ...a,
        ref: t,
        width: r,
        height: o,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: e.asChild ? n : i.jsx("polygon", {
            points: "0,0 30,0 15,10"
        })
    })
}
);
Gr.displayName = "Arrow";
var Xr = Gr;
function Yr(t) {
    const [n,r] = e.useState(void 0);
    return j( () => {
        if (t) {
            r({
                width: t.offsetWidth,
                height: t.offsetHeight
            });
            const e = new ResizeObserver(e => {
                if (!Array.isArray(e))
                    return;
                if (!e.length)
                    return;
                const n = e[0];
                let o, i;
                if ("borderBoxSize"in n) {
                    const e = n.borderBoxSize
                      , t = Array.isArray(e) ? e[0] : e;
                    o = t.inlineSize,
                    i = t.blockSize
                } else
                    o = t.offsetWidth,
                    i = t.offsetHeight;
                r({
                    width: o,
                    height: i
                })
            }
            );
            return e.observe(t, {
                box: "border-box"
            }),
            () => e.unobserve(t)
        }
        r(void 0)
    }
    , [t]),
    n
}
var qr = "Popper"
  , [Zr,Jr] = l(qr)
  , [Qr,eo] = Zr(qr)
  , to = t => {
    const {__scopePopper: n, children: r} = t
      , [o,a] = e.useState(null);
    return i.jsx(Qr, {
        scope: n,
        anchor: o,
        onAnchorChange: a,
        children: r
    })
}
;
to.displayName = qr;
var no = "PopperAnchor"
  , ro = e.forwardRef( (t, n) => {
    const {__scopePopper: r, virtualRef: o, ...a} = t
      , s = eo(no, r)
      , u = e.useRef(null)
      , l = c(n, u)
      , d = e.useRef(null);
    return e.useEffect( () => {
        const e = d.current;
        d.current = o?.current || u.current,
        e !== d.current && s.onAnchorChange(d.current)
    }
    ),
    o ? null : i.jsx(y.div, {
        ...a,
        ref: l
    })
}
);
ro.displayName = no;
var oo = "PopperContent"
  , [io,ao] = Zr(oo)
  , so = e.forwardRef( (t, r) => {
    const {__scopePopper: o, side: a="bottom", sideOffset: s=0, align: u="center", alignOffset: l=0, arrowPadding: d=0, avoidCollisions: f=!0, collisionBoundary: p=[], collisionPadding: m=0, sticky: h="partial", hideWhenDetached: g=!1, updatePositionStrategy: v="optimized", onPlaced: w, ...x} = t
      , R = eo(oo, o)
      , [E,C] = e.useState(null)
      , _ = c(r, e => C(e))
      , [D,M] = e.useState(null)
      , S = Yr(D)
      , A = S?.width ?? 0
      , O = S?.height ?? 0
      , P = a + ("center" !== u ? "-" + u : "")
      , N = "number" == typeof m ? m : {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...m
    }
      , T = Array.isArray(p) ? p : [p]
      , k = T.length > 0
      , I = {
        padding: N,
        boundary: T.filter(fo),
        altBoundary: k
    }
      , {refs: L, floatingStyles: F, placement: W, isPositioned: B, middlewareData: K} = function(t) {
        void 0 === t && (t = {});
        const {placement: r="bottom", strategy: o="absolute", middleware: i=[], platform: a, elements: {reference: s, floating: c}={}, transform: u=!0, whileElementsMounted: l, open: d} = t
          , [f,p] = e.useState({
            x: 0,
            y: 0,
            strategy: o,
            placement: r,
            middlewareData: {},
            isPositioned: !1
        })
          , [m,h] = e.useState(i);
        kr(m, i) || h(i);
        const [g,v] = e.useState(null)
          , [y,w] = e.useState(null)
          , b = e.useCallback(e => {
            e !== C.current && (C.current = e,
            v(e))
        }
        , [])
          , x = e.useCallback(e => {
            e !== _.current && (_.current = e,
            w(e))
        }
        , [])
          , R = s || g
          , E = c || y
          , C = e.useRef(null)
          , _ = e.useRef(null)
          , D = e.useRef(f)
          , M = null != l
          , S = Fr(l)
          , A = Fr(a)
          , O = Fr(d)
          , P = e.useCallback( () => {
            if (!C.current || !_.current)
                return;
            const e = {
                placement: r,
                strategy: o,
                middleware: m
            };
            A.current && (e.platform = A.current),
            Nr(C.current, _.current, e).then(e => {
                const t = {
                    ...e,
                    isPositioned: !1 !== O.current
                };
                j.current && !kr(D.current, t) && (D.current = t,
                n.flushSync( () => {
                    p(t)
                }
                ))
            }
            )
        }
        , [m, r, o, A, O]);
        Tr( () => {
            !1 === d && D.current.isPositioned && (D.current.isPositioned = !1,
            p(e => ({
                ...e,
                isPositioned: !1
            })))
        }
        , [d]);
        const j = e.useRef(!1);
        Tr( () => (j.current = !0,
        () => {
            j.current = !1
        }
        ), []),
        Tr( () => {
            if (R && (C.current = R),
            E && (_.current = E),
            R && E) {
                if (S.current)
                    return S.current(R, E, P);
                P()
            }
        }
        , [R, E, P, S, M]);
        const N = e.useMemo( () => ({
            reference: C,
            floating: _,
            setReference: b,
            setFloating: x
        }), [b, x])
          , T = e.useMemo( () => ({
            reference: R,
            floating: E
        }), [R, E])
          , k = e.useMemo( () => {
            const e = {
                position: o,
                left: 0,
                top: 0
            };
            if (!T.floating)
                return e;
            const t = Lr(T.floating, f.x)
              , n = Lr(T.floating, f.y);
            return u ? {
                ...e,
                transform: "translate(" + t + "px, " + n + "px)",
                ...Ir(T.floating) >= 1.5 && {
                    willChange: "transform"
                }
            } : {
                position: o,
                left: t,
                top: n
            }
        }
        , [o, u, T.floating, f.x, f.y]);
        return e.useMemo( () => ({
            ...f,
            update: P,
            refs: N,
            elements: T,
            floatingStyles: k
        }), [f, P, N, T, k])
    }({
        strategy: "fixed",
        placement: P,
        whileElementsMounted: (...e) => _r(...e, {
            animationFrame: "always" === v
        }),
        elements: {
            reference: R.anchor
        },
        middleware: [Br({
            mainAxis: s + O,
            alignmentAxis: l
        }), f && Kr({
            mainAxis: !0,
            crossAxis: !1,
            limiter: "partial" === h ? $r() : void 0,
            ...I
        }), f && Hr({
            ...I
        }), Ur({
            ...I,
            apply: ({elements: e, rects: t, availableWidth: n, availableHeight: r}) => {
                const {width: o, height: i} = t.reference
                  , a = e.floating.style;
                a.setProperty("--radix-popper-available-width", `${n}px`),
                a.setProperty("--radix-popper-available-height", `${r}px`),
                a.setProperty("--radix-popper-anchor-width", `${o}px`),
                a.setProperty("--radix-popper-anchor-height", `${i}px`)
            }
        }), D && zr({
            element: D,
            padding: d
        }), po({
            arrowWidth: A,
            arrowHeight: O
        }), g && Vr({
            strategy: "referenceHidden",
            ...I
        })]
    })
      , [$,H] = mo(W)
      , U = b(w);
    j( () => {
        B && U?.()
    }
    , [B, U]);
    const V = K.arrow?.x
      , z = K.arrow?.y
      , G = 0 !== K.arrow?.centerOffset
      , [X,Y] = e.useState();
    return j( () => {
        E && Y(window.getComputedStyle(E).zIndex)
    }
    , [E]),
    i.jsx("div", {
        ref: L.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
            ...F,
            transform: B ? F.transform : "translate(0, -200%)",
            minWidth: "max-content",
            zIndex: X,
            "--radix-popper-transform-origin": [K.transformOrigin?.x, K.transformOrigin?.y].join(" "),
            ...K.hide?.referenceHidden && {
                visibility: "hidden",
                pointerEvents: "none"
            }
        },
        dir: t.dir,
        children: i.jsx(io, {
            scope: o,
            placedSide: $,
            onArrowChange: M,
            arrowX: V,
            arrowY: z,
            shouldHideArrow: G,
            children: i.jsx(y.div, {
                "data-side": $,
                "data-align": H,
                ...x,
                ref: _,
                style: {
                    ...x.style,
                    animation: B ? void 0 : "none"
                }
            })
        })
    })
}
);
so.displayName = oo;
var co = "PopperArrow"
  , uo = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
}
  , lo = e.forwardRef(function(e, t) {
    const {__scopePopper: n, ...r} = e
      , o = ao(co, n)
      , a = uo[o.placedSide];
    return i.jsx("span", {
        ref: o.onArrowChange,
        style: {
            position: "absolute",
            left: o.arrowX,
            top: o.arrowY,
            [a]: 0,
            transformOrigin: {
                top: "",
                right: "0 0",
                bottom: "center 0",
                left: "100% 0"
            }[o.placedSide],
            transform: {
                top: "translateY(100%)",
                right: "translateY(50%) rotate(90deg) translateX(-50%)",
                bottom: "rotate(180deg)",
                left: "translateY(50%) rotate(-90deg) translateX(50%)"
            }[o.placedSide],
            visibility: o.shouldHideArrow ? "hidden" : void 0
        },
        children: i.jsx(Xr, {
            ...r,
            ref: t,
            style: {
                ...r.style,
                display: "block"
            }
        })
    })
});
function fo(e) {
    return null !== e
}
lo.displayName = co;
var po = e => ({
    name: "transformOrigin",
    options: e,
    fn(t) {
        const {placement: n, rects: r, middlewareData: o} = t
          , i = 0 !== o.arrow?.centerOffset
          , a = i ? 0 : e.arrowWidth
          , s = i ? 0 : e.arrowHeight
          , [c,u] = mo(n)
          , l = {
            start: "0%",
            center: "50%",
            end: "100%"
        }[u]
          , d = (o.arrow?.x ?? 0) + a / 2
          , f = (o.arrow?.y ?? 0) + s / 2;
        let p = ""
          , m = "";
        return "bottom" === c ? (p = i ? l : `${d}px`,
        m = -s + "px") : "top" === c ? (p = i ? l : `${d}px`,
        m = `${r.floating.height + s}px`) : "right" === c ? (p = -s + "px",
        m = i ? l : `${f}px`) : "left" === c && (p = `${r.floating.width + s}px`,
        m = i ? l : `${f}px`),
        {
            data: {
                x: p,
                y: m
            }
        }
    }
});
function mo(e) {
    const [t,n="center"] = e.split("-");
    return [t, n]
}
var ho = to
  , go = ro
  , vo = so
  , yo = lo
  , wo = ["Enter", " "]
  , bo = ["ArrowUp", "PageDown", "End"]
  , xo = ["ArrowDown", "PageUp", "Home", ...bo]
  , Ro = {
    ltr: [...wo, "ArrowRight"],
    rtl: [...wo, "ArrowLeft"]
}
  , Eo = {
    ltr: ["ArrowLeft"],
    rtl: ["ArrowRight"]
}
  , Co = "Menu"
  , [_o,Do,Mo] = v(Co)
  , [So,Ao] = l(Co, [Mo, Jr, zt])
  , Oo = Jr()
  , Po = zt()
  , [jo,No] = So(Co)
  , [To,ko] = So(Co)
  , Io = t => {
    const {__scopeMenu: n, open: r=!1, children: o, dir: a, onOpenChange: s, modal: c=!0} = t
      , u = Oo(n)
      , [l,d] = e.useState(null)
      , f = e.useRef(!1)
      , p = b(s)
      , m = Ft(a);
    return e.useEffect( () => {
        const e = () => {
            f.current = !0,
            document.addEventListener("pointerdown", t, {
                capture: !0,
                once: !0
            }),
            document.addEventListener("pointermove", t, {
                capture: !0,
                once: !0
            })
        }
          , t = () => f.current = !1;
        return document.addEventListener("keydown", e, {
            capture: !0
        }),
        () => {
            document.removeEventListener("keydown", e, {
                capture: !0
            }),
            document.removeEventListener("pointerdown", t, {
                capture: !0
            }),
            document.removeEventListener("pointermove", t, {
                capture: !0
            })
        }
    }
    , []),
    i.jsx(ho, {
        ...u,
        children: i.jsx(jo, {
            scope: n,
            open: r,
            onOpenChange: p,
            content: l,
            onContentChange: d,
            children: i.jsx(To, {
                scope: n,
                onClose: e.useCallback( () => p(!1), [p]),
                isUsingKeyboardRef: f,
                dir: m,
                modal: c,
                children: o
            })
        })
    })
}
;
Io.displayName = Co;
var Lo = e.forwardRef( (e, t) => {
    const {__scopeMenu: n, ...r} = e
      , o = Oo(n);
    return i.jsx(go, {
        ...o,
        ...r,
        ref: t
    })
}
);
Lo.displayName = "MenuAnchor";
var Fo = "MenuPortal"
  , [Wo,Bo] = So(Fo, {
    forceMount: void 0
})
  , Ko = e => {
    const {__scopeMenu: t, forceMount: n, children: r, container: o} = e
      , a = No(Fo, t);
    return i.jsx(Wo, {
        scope: t,
        forceMount: n,
        children: i.jsx(T, {
            present: n || a.open,
            children: i.jsx(N, {
                asChild: !0,
                container: o,
                children: r
            })
        })
    })
}
;
Ko.displayName = Fo;
var $o = "MenuContent"
  , [Ho,Uo] = So($o)
  , Vo = e.forwardRef( (e, t) => {
    const n = Bo($o, e.__scopeMenu)
      , {forceMount: r=n.forceMount, ...o} = e
      , a = No($o, e.__scopeMenu)
      , s = ko($o, e.__scopeMenu);
    return i.jsx(_o.Provider, {
        scope: e.__scopeMenu,
        children: i.jsx(T, {
            present: r || a.open,
            children: i.jsx(_o.Slot, {
                scope: e.__scopeMenu,
                children: s.modal ? i.jsx(zo, {
                    ...o,
                    ref: t
                }) : i.jsx(Go, {
                    ...o,
                    ref: t
                })
            })
        })
    })
}
)
  , zo = e.forwardRef( (t, n) => {
    const r = No($o, t.__scopeMenu)
      , o = e.useRef(null)
      , a = c(n, o);
    return e.useEffect( () => {
        const e = o.current;
        if (e)
            return Ye(e)
    }
    , []),
    i.jsx(Yo, {
        ...t,
        ref: a,
        trapFocus: r.open,
        disableOutsidePointerEvents: r.open,
        disableOutsideScroll: !0,
        onFocusOutside: u(t.onFocusOutside, e => e.preventDefault(), {
            checkForDefaultPrevented: !1
        }),
        onDismiss: () => r.onOpenChange(!1)
    })
}
)
  , Go = e.forwardRef( (e, t) => {
    const n = No($o, e.__scopeMenu);
    return i.jsx(Yo, {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        onDismiss: () => n.onOpenChange(!1)
    })
}
)
  , Xo = f("MenuContent.ScrollLock")
  , Yo = e.forwardRef( (t, n) => {
    const {__scopeMenu: r, loop: o=!1, trapFocus: a, onOpenAutoFocus: s, onCloseAutoFocus: l, disableOutsidePointerEvents: d, onEntryFocus: f, onEscapeKeyDown: p, onPointerDownOutside: m, onFocusOutside: h, onInteractOutside: g, onDismiss: v, disableOutsideScroll: y, ...w} = t
      , b = No($o, r)
      , x = ko($o, r)
      , R = Oo(r)
      , E = Po(r)
      , C = Do(r)
      , [_,M] = e.useState(null)
      , S = e.useRef(null)
      , A = c(n, S, b.onContentChange)
      , O = e.useRef(0)
      , P = e.useRef("")
      , j = e.useRef(0)
      , N = e.useRef(null)
      , T = e.useRef("right")
      , k = e.useRef(0)
      , I = y ? $e : e.Fragment
      , L = y ? {
        as: Xo,
        allowPinchZoom: !0
    } : void 0
      , F = e => {
        const t = P.current + e
          , n = C().filter(e => !e.disabled)
          , r = document.activeElement
          , o = n.find(e => e.ref.current === r)?.textValue
          , i = function(e, t, n) {
            const r = t.length > 1 && Array.from(t).every(e => e === t[0])
              , o = r ? t[0] : t
              , i = n ? e.indexOf(n) : -1;
            let a = (s = e,
            c = Math.max(i, 0),
            s.map( (e, t) => s[(c + t) % s.length]));
            var s, c;
            1 === o.length && (a = a.filter(e => e !== n));
            const u = a.find(e => e.toLowerCase().startsWith(o.toLowerCase()));
            return u !== n ? u : void 0
        }(n.map(e => e.textValue), t, o)
          , a = n.find(e => e.textValue === i)?.ref.current;
        !function e(t) {
            P.current = t,
            window.clearTimeout(O.current),
            "" !== t && (O.current = window.setTimeout( () => e(""), 1e3))
        }(t),
        a && setTimeout( () => a.focus())
    }
    ;
    e.useEffect( () => () => window.clearTimeout(O.current), []),
    J();
    const W = e.useCallback(e => T.current === N.current?.side && function(e, t) {
        if (!t)
            return !1;
        const n = {
            x: e.clientX,
            y: e.clientY
        };
        return function(e, t) {
            const {x: n, y: r} = e;
            let o = !1;
            for (let i = 0, a = t.length - 1; i < t.length; a = i++) {
                const e = t[i]
                  , s = t[a]
                  , c = e.x
                  , u = e.y
                  , l = s.x
                  , d = s.y;
                u > r != d > r && n < (l - c) * (r - u) / (d - u) + c && (o = !o)
            }
            return o
        }(n, t)
    }(e, N.current?.area), []);
    return i.jsx(Ho, {
        scope: r,
        searchRef: P,
        onItemEnter: e.useCallback(e => {
            W(e) && e.preventDefault()
        }
        , [W]),
        onItemLeave: e.useCallback(e => {
            W(e) || (S.current?.focus(),
            M(null))
        }
        , [W]),
        onTriggerLeave: e.useCallback(e => {
            W(e) && e.preventDefault()
        }
        , [W]),
        pointerGraceTimerRef: j,
        onPointerGraceIntentChange: e.useCallback(e => {
            N.current = e
        }
        , []),
        children: i.jsx(I, {
            ...L,
            children: i.jsx(U, {
                asChild: !0,
                trapped: a,
                onMountAutoFocus: u(s, e => {
                    e.preventDefault(),
                    S.current?.focus({
                        preventScroll: !0
                    })
                }
                ),
                onUnmountAutoFocus: l,
                children: i.jsx(D, {
                    asChild: !0,
                    disableOutsidePointerEvents: d,
                    onEscapeKeyDown: p,
                    onPointerDownOutside: m,
                    onFocusOutside: h,
                    onInteractOutside: g,
                    onDismiss: v,
                    children: i.jsx(tn, {
                        asChild: !0,
                        ...E,
                        dir: x.dir,
                        orientation: "vertical",
                        loop: o,
                        currentTabStopId: _,
                        onCurrentTabStopIdChange: M,
                        onEntryFocus: u(f, e => {
                            x.isUsingKeyboardRef.current || e.preventDefault()
                        }
                        ),
                        preventScrollOnEntryFocus: !0,
                        children: i.jsx(vo, {
                            role: "menu",
                            "aria-orientation": "vertical",
                            "data-state": xi(b.open),
                            "data-radix-menu-content": "",
                            dir: x.dir,
                            ...R,
                            ...w,
                            ref: A,
                            style: {
                                outline: "none",
                                ...w.style
                            },
                            onKeyDown: u(w.onKeyDown, e => {
                                const t = e.target.closest("[data-radix-menu-content]") === e.currentTarget
                                  , n = e.ctrlKey || e.altKey || e.metaKey
                                  , r = 1 === e.key.length;
                                t && ("Tab" === e.key && e.preventDefault(),
                                !n && r && F(e.key));
                                const o = S.current;
                                if (e.target !== o)
                                    return;
                                if (!xo.includes(e.key))
                                    return;
                                e.preventDefault();
                                const i = C().filter(e => !e.disabled).map(e => e.ref.current);
                                bo.includes(e.key) && i.reverse(),
                                function(e) {
                                    const t = document.activeElement;
                                    for (const n of e) {
                                        if (n === t)
                                            return;
                                        if (n.focus(),
                                        document.activeElement !== t)
                                            return
                                    }
                                }(i)
                            }
                            ),
                            onBlur: u(t.onBlur, e => {
                                e.currentTarget.contains(e.target) || (window.clearTimeout(O.current),
                                P.current = "")
                            }
                            ),
                            onPointerMove: u(t.onPointerMove, Ci(e => {
                                const t = e.target
                                  , n = k.current !== e.clientX;
                                if (e.currentTarget.contains(t) && n) {
                                    const t = e.clientX > k.current ? "right" : "left";
                                    T.current = t,
                                    k.current = e.clientX
                                }
                            }
                            ))
                        })
                    })
                })
            })
        })
    })
}
);
Vo.displayName = $o;
var qo = e.forwardRef( (e, t) => {
    const {__scopeMenu: n, ...r} = e;
    return i.jsx(y.div, {
        role: "group",
        ...r,
        ref: t
    })
}
);
qo.displayName = "MenuGroup";
var Zo = e.forwardRef( (e, t) => {
    const {__scopeMenu: n, ...r} = e;
    return i.jsx(y.div, {
        ...r,
        ref: t
    })
}
);
Zo.displayName = "MenuLabel";
var Jo = "MenuItem"
  , Qo = "menu.itemSelect"
  , ei = e.forwardRef( (t, n) => {
    const {disabled: r=!1, onSelect: o, ...a} = t
      , s = e.useRef(null)
      , l = ko(Jo, t.__scopeMenu)
      , d = Uo(Jo, t.__scopeMenu)
      , f = c(n, s)
      , p = e.useRef(!1);
    return i.jsx(ti, {
        ...a,
        ref: f,
        disabled: r,
        onClick: u(t.onClick, () => {
            const e = s.current;
            if (!r && e) {
                const t = new CustomEvent(Qo,{
                    bubbles: !0,
                    cancelable: !0
                });
                e.addEventListener(Qo, e => o?.(e), {
                    once: !0
                }),
                w(e, t),
                t.defaultPrevented ? p.current = !1 : l.onClose()
            }
        }
        ),
        onPointerDown: e => {
            t.onPointerDown?.(e),
            p.current = !0
        }
        ,
        onPointerUp: u(t.onPointerUp, e => {
            p.current || e.currentTarget?.click()
        }
        ),
        onKeyDown: u(t.onKeyDown, e => {
            const t = "" !== d.searchRef.current;
            r || t && " " === e.key || wo.includes(e.key) && (e.currentTarget.click(),
            e.preventDefault())
        }
        )
    })
}
);
ei.displayName = Jo;
var ti = e.forwardRef( (t, n) => {
    const {__scopeMenu: r, disabled: o=!1, textValue: a, ...s} = t
      , l = Uo(Jo, r)
      , d = Po(r)
      , f = e.useRef(null)
      , p = c(n, f)
      , [m,h] = e.useState(!1)
      , [g,v] = e.useState("");
    return e.useEffect( () => {
        const e = f.current;
        e && v((e.textContent ?? "").trim())
    }
    , [s.children]),
    i.jsx(_o.ItemSlot, {
        scope: r,
        disabled: o,
        textValue: a ?? g,
        children: i.jsx(nn, {
            asChild: !0,
            ...d,
            focusable: !o,
            children: i.jsx(y.div, {
                role: "menuitem",
                "data-highlighted": m ? "" : void 0,
                "aria-disabled": o || void 0,
                "data-disabled": o ? "" : void 0,
                ...s,
                ref: p,
                onPointerMove: u(t.onPointerMove, Ci(e => {
                    if (o)
                        l.onItemLeave(e);
                    else if (l.onItemEnter(e),
                    !e.defaultPrevented) {
                        e.currentTarget.focus({
                            preventScroll: !0
                        })
                    }
                }
                )),
                onPointerLeave: u(t.onPointerLeave, Ci(e => l.onItemLeave(e))),
                onFocus: u(t.onFocus, () => h(!0)),
                onBlur: u(t.onBlur, () => h(!1))
            })
        })
    })
}
)
  , ni = e.forwardRef( (e, t) => {
    const {checked: n=!1, onCheckedChange: r, ...o} = e;
    return i.jsx(li, {
        scope: e.__scopeMenu,
        checked: n,
        children: i.jsx(ei, {
            role: "menuitemcheckbox",
            "aria-checked": Ri(n) ? "mixed" : n,
            ...o,
            ref: t,
            "data-state": Ei(n),
            onSelect: u(o.onSelect, () => r?.(!!Ri(n) || !n), {
                checkForDefaultPrevented: !1
            })
        })
    })
}
);
ni.displayName = "MenuCheckboxItem";
var ri = "MenuRadioGroup"
  , [oi,ii] = So(ri, {
    value: void 0,
    onValueChange: () => {}
})
  , ai = e.forwardRef( (e, t) => {
    const {value: n, onValueChange: r, ...o} = e
      , a = b(r);
    return i.jsx(oi, {
        scope: e.__scopeMenu,
        value: n,
        onValueChange: a,
        children: i.jsx(qo, {
            ...o,
            ref: t
        })
    })
}
);
ai.displayName = ri;
var si = "MenuRadioItem"
  , ci = e.forwardRef( (e, t) => {
    const {value: n, ...r} = e
      , o = ii(si, e.__scopeMenu)
      , a = n === o.value;
    return i.jsx(li, {
        scope: e.__scopeMenu,
        checked: a,
        children: i.jsx(ei, {
            role: "menuitemradio",
            "aria-checked": a,
            ...r,
            ref: t,
            "data-state": Ei(a),
            onSelect: u(r.onSelect, () => o.onValueChange?.(n), {
                checkForDefaultPrevented: !1
            })
        })
    })
}
);
ci.displayName = si;
var ui = "MenuItemIndicator"
  , [li,di] = So(ui, {
    checked: !1
})
  , fi = e.forwardRef( (e, t) => {
    const {__scopeMenu: n, forceMount: r, ...o} = e
      , a = di(ui, n);
    return i.jsx(T, {
        present: r || Ri(a.checked) || !0 === a.checked,
        children: i.jsx(y.span, {
            ...o,
            ref: t,
            "data-state": Ei(a.checked)
        })
    })
}
);
fi.displayName = ui;
var pi = e.forwardRef( (e, t) => {
    const {__scopeMenu: n, ...r} = e;
    return i.jsx(y.div, {
        role: "separator",
        "aria-orientation": "horizontal",
        ...r,
        ref: t
    })
}
);
pi.displayName = "MenuSeparator";
var mi = e.forwardRef( (e, t) => {
    const {__scopeMenu: n, ...r} = e
      , o = Oo(n);
    return i.jsx(yo, {
        ...o,
        ...r,
        ref: t
    })
}
);
mi.displayName = "MenuArrow";
var [hi,gi] = So("MenuSub")
  , vi = "MenuSubTrigger"
  , yi = e.forwardRef( (t, n) => {
    const r = No(vi, t.__scopeMenu)
      , o = ko(vi, t.__scopeMenu)
      , a = gi(vi, t.__scopeMenu)
      , c = Uo(vi, t.__scopeMenu)
      , l = e.useRef(null)
      , {pointerGraceTimerRef: d, onPointerGraceIntentChange: f} = c
      , p = {
        __scopeMenu: t.__scopeMenu
    }
      , m = e.useCallback( () => {
        l.current && window.clearTimeout(l.current),
        l.current = null
    }
    , []);
    return e.useEffect( () => m, [m]),
    e.useEffect( () => {
        const e = d.current;
        return () => {
            window.clearTimeout(e),
            f(null)
        }
    }
    , [d, f]),
    i.jsx(Lo, {
        asChild: !0,
        ...p,
        children: i.jsx(ti, {
            id: a.triggerId,
            "aria-haspopup": "menu",
            "aria-expanded": r.open,
            "aria-controls": a.contentId,
            "data-state": xi(r.open),
            ...t,
            ref: s(n, a.onTriggerChange),
            onClick: e => {
                t.onClick?.(e),
                t.disabled || e.defaultPrevented || (e.currentTarget.focus(),
                r.open || r.onOpenChange(!0))
            }
            ,
            onPointerMove: u(t.onPointerMove, Ci(e => {
                c.onItemEnter(e),
                e.defaultPrevented || t.disabled || r.open || l.current || (c.onPointerGraceIntentChange(null),
                l.current = window.setTimeout( () => {
                    r.onOpenChange(!0),
                    m()
                }
                , 100))
            }
            )),
            onPointerLeave: u(t.onPointerLeave, Ci(e => {
                m();
                const t = r.content?.getBoundingClientRect();
                if (t) {
                    const n = r.content?.dataset.side
                      , o = "right" === n
                      , i = o ? -5 : 5
                      , a = t[o ? "left" : "right"]
                      , s = t[o ? "right" : "left"];
                    c.onPointerGraceIntentChange({
                        area: [{
                            x: e.clientX + i,
                            y: e.clientY
                        }, {
                            x: a,
                            y: t.top
                        }, {
                            x: s,
                            y: t.top
                        }, {
                            x: s,
                            y: t.bottom
                        }, {
                            x: a,
                            y: t.bottom
                        }],
                        side: n
                    }),
                    window.clearTimeout(d.current),
                    d.current = window.setTimeout( () => c.onPointerGraceIntentChange(null), 300)
                } else {
                    if (c.onTriggerLeave(e),
                    e.defaultPrevented)
                        return;
                    c.onPointerGraceIntentChange(null)
                }
            }
            )),
            onKeyDown: u(t.onKeyDown, e => {
                const n = "" !== c.searchRef.current;
                t.disabled || n && " " === e.key || Ro[o.dir].includes(e.key) && (r.onOpenChange(!0),
                r.content?.focus(),
                e.preventDefault())
            }
            )
        })
    })
}
);
yi.displayName = vi;
var wi = "MenuSubContent"
  , bi = e.forwardRef( (t, n) => {
    const r = Bo($o, t.__scopeMenu)
      , {forceMount: o=r.forceMount, ...a} = t
      , s = No($o, t.__scopeMenu)
      , l = ko($o, t.__scopeMenu)
      , d = gi(wi, t.__scopeMenu)
      , f = e.useRef(null)
      , p = c(n, f);
    return i.jsx(_o.Provider, {
        scope: t.__scopeMenu,
        children: i.jsx(T, {
            present: o || s.open,
            children: i.jsx(_o.Slot, {
                scope: t.__scopeMenu,
                children: i.jsx(Yo, {
                    id: d.contentId,
                    "aria-labelledby": d.triggerId,
                    ...a,
                    ref: p,
                    align: "start",
                    side: "rtl" === l.dir ? "left" : "right",
                    disableOutsidePointerEvents: !1,
                    disableOutsideScroll: !1,
                    trapFocus: !1,
                    onOpenAutoFocus: e => {
                        l.isUsingKeyboardRef.current && f.current?.focus(),
                        e.preventDefault()
                    }
                    ,
                    onCloseAutoFocus: e => e.preventDefault(),
                    onFocusOutside: u(t.onFocusOutside, e => {
                        e.target !== d.trigger && s.onOpenChange(!1)
                    }
                    ),
                    onEscapeKeyDown: u(t.onEscapeKeyDown, e => {
                        l.onClose(),
                        e.preventDefault()
                    }
                    ),
                    onKeyDown: u(t.onKeyDown, e => {
                        const t = e.currentTarget.contains(e.target)
                          , n = Eo[l.dir].includes(e.key);
                        t && n && (s.onOpenChange(!1),
                        d.trigger?.focus(),
                        e.preventDefault())
                    }
                    )
                })
            })
        })
    })
}
);
function xi(e) {
    return e ? "open" : "closed"
}
function Ri(e) {
    return "indeterminate" === e
}
function Ei(e) {
    return Ri(e) ? "indeterminate" : e ? "checked" : "unchecked"
}
function Ci(e) {
    return t => "mouse" === t.pointerType ? e(t) : void 0
}
bi.displayName = wi;
var _i = Io
  , Di = Lo
  , Mi = Ko
  , Si = Vo
  , Ai = qo
  , Oi = Zo
  , Pi = ei
  , ji = ni
  , Ni = ai
  , Ti = ci
  , ki = fi
  , Ii = pi
  , Li = mi
  , Fi = yi
  , Wi = bi
  , Bi = "DropdownMenu"
  , [Ki] = l(Bi, [Ao])
  , $i = Ao()
  , [Hi,Ui] = Ki(Bi)
  , Vi = t => {
    const {__scopeDropdownMenu: n, children: r, dir: o, open: a, defaultOpen: s, onOpenChange: c, modal: u=!0} = t
      , l = $i(n)
      , d = e.useRef(null)
      , [f,p] = L({
        prop: a,
        defaultProp: s ?? !1,
        onChange: c,
        caller: Bi
    });
    return i.jsx(Hi, {
        scope: n,
        triggerId: B(),
        triggerRef: d,
        contentId: B(),
        open: f,
        onOpenChange: p,
        onOpenToggle: e.useCallback( () => p(e => !e), [p]),
        modal: u,
        children: i.jsx(_i, {
            ...l,
            open: f,
            onOpenChange: p,
            dir: o,
            modal: u,
            children: r
        })
    })
}
;
Vi.displayName = Bi;
var zi = "DropdownMenuTrigger"
  , Gi = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, disabled: r=!1, ...o} = e
      , a = Ui(zi, n)
      , c = $i(n);
    return i.jsx(Di, {
        asChild: !0,
        ...c,
        children: i.jsx(y.button, {
            type: "button",
            id: a.triggerId,
            "aria-haspopup": "menu",
            "aria-expanded": a.open,
            "aria-controls": a.open ? a.contentId : void 0,
            "data-state": a.open ? "open" : "closed",
            "data-disabled": r ? "" : void 0,
            disabled: r,
            ...o,
            ref: s(t, a.triggerRef),
            onPointerDown: u(e.onPointerDown, e => {
                r || 0 !== e.button || !1 !== e.ctrlKey || (a.onOpenToggle(),
                a.open || e.preventDefault())
            }
            ),
            onKeyDown: u(e.onKeyDown, e => {
                r || (["Enter", " "].includes(e.key) && a.onOpenToggle(),
                "ArrowDown" === e.key && a.onOpenChange(!0),
                ["Enter", " ", "ArrowDown"].includes(e.key) && e.preventDefault())
            }
            )
        })
    })
}
);
Gi.displayName = zi;
var Xi = e => {
    const {__scopeDropdownMenu: t, ...n} = e
      , r = $i(t);
    return i.jsx(Mi, {
        ...r,
        ...n
    })
}
;
Xi.displayName = "DropdownMenuPortal";
var Yi = "DropdownMenuContent"
  , qi = e.forwardRef( (t, n) => {
    const {__scopeDropdownMenu: r, ...o} = t
      , a = Ui(Yi, r)
      , s = $i(r)
      , c = e.useRef(!1);
    return i.jsx(Si, {
        id: a.contentId,
        "aria-labelledby": a.triggerId,
        ...s,
        ...o,
        ref: n,
        onCloseAutoFocus: u(t.onCloseAutoFocus, e => {
            c.current || a.triggerRef.current?.focus(),
            c.current = !1,
            e.preventDefault()
        }
        ),
        onInteractOutside: u(t.onInteractOutside, e => {
            const t = e.detail.originalEvent
              , n = 0 === t.button && !0 === t.ctrlKey
              , r = 2 === t.button || n;
            a.modal && !r || (c.current = !0)
        }
        ),
        style: {
            ...t.style,
            "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
            "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
            "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
    })
}
);
qi.displayName = Yi;
var Zi = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(Ai, {
        ...o,
        ...r,
        ref: t
    })
}
);
Zi.displayName = "DropdownMenuGroup";
var Ji = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(Oi, {
        ...o,
        ...r,
        ref: t
    })
}
);
Ji.displayName = "DropdownMenuLabel";
var Qi = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(Pi, {
        ...o,
        ...r,
        ref: t
    })
}
);
Qi.displayName = "DropdownMenuItem";
var ea = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(ji, {
        ...o,
        ...r,
        ref: t
    })
}
);
ea.displayName = "DropdownMenuCheckboxItem";
e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(Ni, {
        ...o,
        ...r,
        ref: t
    })
}
).displayName = "DropdownMenuRadioGroup";
var ta = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(Ti, {
        ...o,
        ...r,
        ref: t
    })
}
);
ta.displayName = "DropdownMenuRadioItem";
var na = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(ki, {
        ...o,
        ...r,
        ref: t
    })
}
);
na.displayName = "DropdownMenuItemIndicator";
var ra = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(Ii, {
        ...o,
        ...r,
        ref: t
    })
}
);
ra.displayName = "DropdownMenuSeparator";
e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(Li, {
        ...o,
        ...r,
        ref: t
    })
}
).displayName = "DropdownMenuArrow";
var oa = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(Fi, {
        ...o,
        ...r,
        ref: t
    })
}
);
oa.displayName = "DropdownMenuSubTrigger";
var ia = e.forwardRef( (e, t) => {
    const {__scopeDropdownMenu: n, ...r} = e
      , o = $i(n);
    return i.jsx(Wi, {
        ...o,
        ...r,
        ref: t,
        style: {
            ...e.style,
            "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
            "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
            "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
    })
}
);
ia.displayName = "DropdownMenuSubContent";
var aa = Vi
  , sa = Gi
  , ca = Xi
  , ua = qi
  , la = Zi
  , da = Ji
  , fa = Qi
  , pa = ea
  , ma = ta
  , ha = na
  , ga = ra
  , va = oa
  , ya = ia
  , wa = "Collapsible"
  , [ba,xa] = l(wa)
  , [Ra,Ea] = ba(wa)
  , Ca = e.forwardRef( (t, n) => {
    const {__scopeCollapsible: r, open: o, defaultOpen: a, disabled: s, onOpenChange: c, ...u} = t
      , [l,d] = L({
        prop: o,
        defaultProp: a ?? !1,
        onChange: c,
        caller: wa
    });
    return i.jsx(Ra, {
        scope: r,
        disabled: s,
        contentId: B(),
        open: l,
        onOpenToggle: e.useCallback( () => d(e => !e), [d]),
        children: i.jsx(y.div, {
            "data-state": Oa(l),
            "data-disabled": s ? "" : void 0,
            ...u,
            ref: n
        })
    })
}
);
Ca.displayName = wa;
var _a = "CollapsibleTrigger"
  , Da = e.forwardRef( (e, t) => {
    const {__scopeCollapsible: n, ...r} = e
      , o = Ea(_a, n);
    return i.jsx(y.button, {
        type: "button",
        "aria-controls": o.contentId,
        "aria-expanded": o.open || !1,
        "data-state": Oa(o.open),
        "data-disabled": o.disabled ? "" : void 0,
        disabled: o.disabled,
        ...r,
        ref: t,
        onClick: u(e.onClick, o.onOpenToggle)
    })
}
);
Da.displayName = _a;
var Ma = "CollapsibleContent"
  , Sa = e.forwardRef( (e, t) => {
    const {forceMount: n, ...r} = e
      , o = Ea(Ma, e.__scopeCollapsible);
    return i.jsx(T, {
        present: n || o.open,
        children: ({present: e}) => i.jsx(Aa, {
            ...r,
            ref: t,
            present: e
        })
    })
}
);
Sa.displayName = Ma;
var Aa = e.forwardRef( (t, n) => {
    const {__scopeCollapsible: r, present: o, children: a, ...s} = t
      , u = Ea(Ma, r)
      , [l,d] = e.useState(o)
      , f = e.useRef(null)
      , p = c(n, f)
      , m = e.useRef(0)
      , h = m.current
      , g = e.useRef(0)
      , v = g.current
      , w = u.open || l
      , b = e.useRef(w)
      , x = e.useRef(void 0);
    return e.useEffect( () => {
        const e = requestAnimationFrame( () => b.current = !1);
        return () => cancelAnimationFrame(e)
    }
    , []),
    j( () => {
        const e = f.current;
        if (e) {
            x.current = x.current || {
                transitionDuration: e.style.transitionDuration,
                animationName: e.style.animationName
            },
            e.style.transitionDuration = "0s",
            e.style.animationName = "none";
            const t = e.getBoundingClientRect();
            m.current = t.height,
            g.current = t.width,
            b.current || (e.style.transitionDuration = x.current.transitionDuration,
            e.style.animationName = x.current.animationName),
            d(o)
        }
    }
    , [u.open, o]),
    i.jsx(y.div, {
        "data-state": Oa(u.open),
        "data-disabled": u.disabled ? "" : void 0,
        id: u.contentId,
        hidden: !w,
        ...s,
        ref: p,
        style: {
            "--radix-collapsible-content-height": h ? `${h}px` : void 0,
            "--radix-collapsible-content-width": v ? `${v}px` : void 0,
            ...t.style
        },
        children: w && a
    })
}
);
function Oa(e) {
    return e ? "open" : "closed"
}
var Pa = Ca
  , ja = Da
  , Na = Sa
  , Ta = "Accordion"
  , ka = ["Home", "End", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"]
  , [Ia,La,Fa] = v(Ta)
  , [Wa] = l(Ta, [Fa, xa])
  , Ba = xa()
  , Ka = t.forwardRef( (e, t) => {
    const {type: n, ...r} = e
      , o = r
      , a = r;
    return i.jsx(Ia.Provider, {
        scope: e.__scopeAccordion,
        children: "multiple" === n ? i.jsx(Ga, {
            ...a,
            ref: t
        }) : i.jsx(za, {
            ...o,
            ref: t
        })
    })
}
);
Ka.displayName = Ta;
var [$a,Ha] = Wa(Ta)
  , [Ua,Va] = Wa(Ta, {
    collapsible: !1
})
  , za = t.forwardRef( (e, n) => {
    const {value: r, defaultValue: o, onValueChange: a= () => {}
    , collapsible: s=!1, ...c} = e
      , [u,l] = L({
        prop: r,
        defaultProp: o ?? "",
        onChange: a,
        caller: Ta
    });
    return i.jsx($a, {
        scope: e.__scopeAccordion,
        value: t.useMemo( () => u ? [u] : [], [u]),
        onItemOpen: l,
        onItemClose: t.useCallback( () => s && l(""), [s, l]),
        children: i.jsx(Ua, {
            scope: e.__scopeAccordion,
            collapsible: s,
            children: i.jsx(qa, {
                ...c,
                ref: n
            })
        })
    })
}
)
  , Ga = t.forwardRef( (e, n) => {
    const {value: r, defaultValue: o, onValueChange: a= () => {}
    , ...s} = e
      , [c,u] = L({
        prop: r,
        defaultProp: o ?? [],
        onChange: a,
        caller: Ta
    })
      , l = t.useCallback(e => u( (t=[]) => [...t, e]), [u])
      , d = t.useCallback(e => u( (t=[]) => t.filter(t => t !== e)), [u]);
    return i.jsx($a, {
        scope: e.__scopeAccordion,
        value: c,
        onItemOpen: l,
        onItemClose: d,
        children: i.jsx(Ua, {
            scope: e.__scopeAccordion,
            collapsible: !0,
            children: i.jsx(qa, {
                ...s,
                ref: n
            })
        })
    })
}
)
  , [Xa,Ya] = Wa(Ta)
  , qa = t.forwardRef( (e, n) => {
    const {__scopeAccordion: r, disabled: o, dir: a, orientation: s="vertical", ...l} = e
      , d = c(t.useRef(null), n)
      , f = La(r)
      , p = "ltr" === Ft(a)
      , m = u(e.onKeyDown, e => {
        if (!ka.includes(e.key))
            return;
        const t = e.target
          , n = f().filter(e => !e.ref.current?.disabled)
          , r = n.findIndex(e => e.ref.current === t)
          , o = n.length;
        if (-1 === r)
            return;
        e.preventDefault();
        let i = r;
        const a = o - 1
          , c = () => {
            i = r + 1,
            i > a && (i = 0)
        }
          , u = () => {
            i = r - 1,
            i < 0 && (i = a)
        }
        ;
        switch (e.key) {
        case "Home":
            i = 0;
            break;
        case "End":
            i = a;
            break;
        case "ArrowRight":
            "horizontal" === s && (p ? c() : u());
            break;
        case "ArrowDown":
            "vertical" === s && c();
            break;
        case "ArrowLeft":
            "horizontal" === s && (p ? u() : c());
            break;
        case "ArrowUp":
            "vertical" === s && u()
        }
        const l = i % o;
        n[l].ref.current?.focus()
    }
    );
    return i.jsx(Xa, {
        scope: r,
        disabled: o,
        direction: a,
        orientation: s,
        children: i.jsx(Ia.Slot, {
            scope: r,
            children: i.jsx(y.div, {
                ...l,
                "data-orientation": s,
                ref: d,
                onKeyDown: o ? void 0 : m
            })
        })
    })
}
)
  , Za = "AccordionItem"
  , [Ja,Qa] = Wa(Za)
  , es = t.forwardRef( (e, t) => {
    const {__scopeAccordion: n, value: r, ...o} = e
      , a = Ya(Za, n)
      , s = Ha(Za, n)
      , c = Ba(n)
      , u = B()
      , l = r && s.value.includes(r) || !1
      , d = a.disabled || e.disabled;
    return i.jsx(Ja, {
        scope: n,
        open: l,
        disabled: d,
        triggerId: u,
        children: i.jsx(Pa, {
            "data-orientation": a.orientation,
            "data-state": ss(l),
            ...c,
            ...o,
            ref: t,
            disabled: d,
            open: l,
            onOpenChange: e => {
                e ? s.onItemOpen(r) : s.onItemClose(r)
            }
        })
    })
}
);
es.displayName = Za;
var ts = "AccordionHeader"
  , ns = t.forwardRef( (e, t) => {
    const {__scopeAccordion: n, ...r} = e
      , o = Ya(Ta, n)
      , a = Qa(ts, n);
    return i.jsx(y.h3, {
        "data-orientation": o.orientation,
        "data-state": ss(a.open),
        "data-disabled": a.disabled ? "" : void 0,
        ...r,
        ref: t
    })
}
);
ns.displayName = ts;
var rs = "AccordionTrigger"
  , os = t.forwardRef( (e, t) => {
    const {__scopeAccordion: n, ...r} = e
      , o = Ya(Ta, n)
      , a = Qa(rs, n)
      , s = Va(rs, n)
      , c = Ba(n);
    return i.jsx(Ia.ItemSlot, {
        scope: n,
        children: i.jsx(ja, {
            "aria-disabled": a.open && !s.collapsible || void 0,
            "data-orientation": o.orientation,
            id: a.triggerId,
            ...c,
            ...r,
            ref: t
        })
    })
}
);
os.displayName = rs;
var is = "AccordionContent"
  , as = t.forwardRef( (e, t) => {
    const {__scopeAccordion: n, ...r} = e
      , o = Ya(Ta, n)
      , a = Qa(is, n)
      , s = Ba(n);
    return i.jsx(Na, {
        role: "region",
        "aria-labelledby": a.triggerId,
        "data-orientation": o.orientation,
        ...s,
        ...r,
        ref: t,
        style: {
            "--radix-accordion-content-height": "var(--radix-collapsible-content-height)",
            "--radix-accordion-content-width": "var(--radix-collapsible-content-width)",
            ...e.style
        }
    })
}
);
function ss(e) {
    return e ? "open" : "closed"
}
as.displayName = is;
var cs = Ka
  , us = es
  , ls = ns
  , ds = os
  , fs = as;
export {cs as $, go as A, P as B, Nt as C, kt as D, ca as E, ua as F, fa as G, pa as H, nn as I, ha as J, ma as K, da as L, ga as M, aa as N, jt as O, y as P, sa as Q, O as R, va as S, Tt as T, la as U, Ye as V, J as W, $e as X, U as Y, f as Z, Yr as _, L as a, us as a0, ls as a1, ds as a2, fs as a3, Je as a4, _t as a5, le as a6, te as a7, ce as a8, ee as a9, re as aa, oe as ab, ye as ac, ne as ad, De as ae, fe as af, Pa as ag, Da as ah, Sa as ai, T as b, s as c, u as d, b as e, v as f, l as g, N as h, j as i, w as j, Pt as k, It as l, At as m, Ot as n, tn as o, zt as p, Ft as q, B as r, D as s, vo as t, c as u, Jr as v, h as w, ho as x, yo as y, ya as z};
