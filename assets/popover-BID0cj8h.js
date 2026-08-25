import {j as e} from "./query-DsA5-mxg.js";
import {a as o} from "./router-gAN6ztYq.js";
import {a as r, x as t, r as n, u as a, P as s, d as i, A as d, v as c, b as p, h as u, g as l, V as f, X as v, Z as h, W as m, Y as g, s as x, t as P, y as C} from "./ui-IJSLl_ge.js";
import {q as j} from "./index-HS6_bSfL.js";
var O = "Popover"
  , [w] = l(O, [c])
  , b = c()
  , [R,_] = w(O)
  , y = a => {
    const {__scopePopover: s, children: i, open: d, defaultOpen: c, onOpenChange: p, modal: u=!1} = a
      , l = b(s)
      , f = o.useRef(null)
      , [v,h] = o.useState(!1)
      , [m,g] = r({
        prop: d,
        defaultProp: c ?? !1,
        onChange: p,
        caller: O
    });
    return e.jsx(t, {
        ...l,
        children: e.jsx(R, {
            scope: s,
            contentId: n(),
            triggerRef: f,
            open: m,
            onOpenChange: g,
            onOpenToggle: o.useCallback( () => g(e => !e), [g]),
            hasCustomAnchor: v,
            onCustomAnchorAdd: o.useCallback( () => h(!0), []),
            onCustomAnchorRemove: o.useCallback( () => h(!1), []),
            modal: u,
            children: i
        })
    })
}
;
y.displayName = O;
var A = "PopoverAnchor";
o.forwardRef( (r, t) => {
    const {__scopePopover: n, ...a} = r
      , s = _(A, n)
      , i = b(n)
      , {onCustomAnchorAdd: c, onCustomAnchorRemove: p} = s;
    return o.useEffect( () => (c(),
    () => p()), [c, p]),
    e.jsx(d, {
        ...i,
        ...a,
        ref: t
    })
}
).displayName = A;
var F = "PopoverTrigger"
  , D = o.forwardRef( (o, r) => {
    const {__scopePopover: t, ...n} = o
      , c = _(F, t)
      , p = b(t)
      , u = a(r, c.triggerRef)
      , l = e.jsx(s.button, {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": c.open,
        "aria-controls": c.contentId,
        "data-state": U(c.open),
        ...n,
        ref: u,
        onClick: i(o.onClick, c.onOpenToggle)
    });
    return c.hasCustomAnchor ? l : e.jsx(d, {
        asChild: !0,
        ...p,
        children: l
    })
}
);
D.displayName = F;
var E = "PopoverPortal"
  , [N,k] = w(E, {
    forceMount: void 0
})
  , I = o => {
    const {__scopePopover: r, forceMount: t, children: n, container: a} = o
      , s = _(E, r);
    return e.jsx(N, {
        scope: r,
        forceMount: t,
        children: e.jsx(p, {
            present: t || s.open,
            children: e.jsx(u, {
                asChild: !0,
                container: a,
                children: n
            })
        })
    })
}
;
I.displayName = E;
var M = "PopoverContent"
  , z = o.forwardRef( (o, r) => {
    const t = k(M, o.__scopePopover)
      , {forceMount: n=t.forceMount, ...a} = o
      , s = _(M, o.__scopePopover);
    return e.jsx(p, {
        present: n || s.open,
        children: s.modal ? e.jsx(T, {
            ...a,
            ref: r
        }) : e.jsx(q, {
            ...a,
            ref: r
        })
    })
}
);
z.displayName = M;
var K = h("PopoverContent.RemoveScroll")
  , T = o.forwardRef( (r, t) => {
    const n = _(M, r.__scopePopover)
      , s = o.useRef(null)
      , d = a(t, s)
      , c = o.useRef(!1);
    return o.useEffect( () => {
        const e = s.current;
        if (e)
            return f(e)
    }
    , []),
    e.jsx(v, {
        as: K,
        allowPinchZoom: !0,
        children: e.jsx(S, {
            ...r,
            ref: d,
            trapFocus: n.open,
            disableOutsidePointerEvents: !0,
            onCloseAutoFocus: i(r.onCloseAutoFocus, e => {
                e.preventDefault(),
                c.current || n.triggerRef.current?.focus()
            }
            ),
            onPointerDownOutside: i(r.onPointerDownOutside, e => {
                const o = e.detail.originalEvent
                  , r = 0 === o.button && !0 === o.ctrlKey
                  , t = 2 === o.button || r;
                c.current = t
            }
            , {
                checkForDefaultPrevented: !1
            }),
            onFocusOutside: i(r.onFocusOutside, e => e.preventDefault(), {
                checkForDefaultPrevented: !1
            })
        })
    })
}
)
  , q = o.forwardRef( (r, t) => {
    const n = _(M, r.__scopePopover)
      , a = o.useRef(!1)
      , s = o.useRef(!1);
    return e.jsx(S, {
        ...r,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: e => {
            r.onCloseAutoFocus?.(e),
            e.defaultPrevented || (a.current || n.triggerRef.current?.focus(),
            e.preventDefault()),
            a.current = !1,
            s.current = !1
        }
        ,
        onInteractOutside: e => {
            r.onInteractOutside?.(e),
            e.defaultPrevented || (a.current = !0,
            "pointerdown" === e.detail.originalEvent.type && (s.current = !0));
            const o = e.target
              , t = n.triggerRef.current?.contains(o);
            t && e.preventDefault(),
            "focusin" === e.detail.originalEvent.type && s.current && e.preventDefault()
        }
    })
}
)
  , S = o.forwardRef( (o, r) => {
    const {__scopePopover: t, trapFocus: n, onOpenAutoFocus: a, onCloseAutoFocus: s, disableOutsidePointerEvents: i, onEscapeKeyDown: d, onPointerDownOutside: c, onFocusOutside: p, onInteractOutside: u, ...l} = o
      , f = _(M, t)
      , v = b(t);
    return m(),
    e.jsx(g, {
        asChild: !0,
        loop: !0,
        trapped: n,
        onMountAutoFocus: a,
        onUnmountAutoFocus: s,
        children: e.jsx(x, {
            asChild: !0,
            disableOutsidePointerEvents: i,
            onInteractOutside: u,
            onEscapeKeyDown: d,
            onPointerDownOutside: c,
            onFocusOutside: p,
            onDismiss: () => f.onOpenChange(!1),
            children: e.jsx(P, {
                "data-state": U(f.open),
                role: "dialog",
                id: f.contentId,
                ...v,
                ...l,
                ref: r,
                style: {
                    ...l.style,
                    "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                    "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                    "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                    "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                    "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
            })
        })
    })
}
)
  , Z = "PopoverClose";
o.forwardRef( (o, r) => {
    const {__scopePopover: t, ...n} = o
      , a = _(Z, t);
    return e.jsx(s.button, {
        type: "button",
        ...n,
        ref: r,
        onClick: i(o.onClick, () => a.onOpenChange(!1))
    })
}
).displayName = Z;
function U(e) {
    return e ? "open" : "closed"
}
o.forwardRef( (o, r) => {
    const {__scopePopover: t, ...n} = o
      , a = b(t);
    return e.jsx(C, {
        ...a,
        ...n,
        ref: r
    })
}
).displayName = "PopoverArrow";
var V = I
  , W = z;
const X = y
  , Y = D
  , B = o.forwardRef( ({className: o, align: r="center", sideOffset: t=4, ...n}, a) => e.jsx(V, {
    children: e.jsx(W, {
        ref: a,
        align: r,
        sideOffset: t,
        className: j("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", o),
        ...n
    })
}));
B.displayName = W.displayName;
export {X as P, Y as a, B as b};
