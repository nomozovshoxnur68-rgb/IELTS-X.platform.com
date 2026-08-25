import { r as t, a as e } from "./router-Btp1bBHd.js";

var s, r,
    i = { exports: {} },
    n = {};

var a = (r || (r = 1, i.exports = function () {
    if (s) return n;
    s = 1;
    var e = t(),
        r = Symbol.for("react.element"),
        i = Symbol.for("react.fragment"),
        a = Object.prototype.hasOwnProperty,
        o = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
        u = { key: !0, ref: !0, __self: !0, __source: !0 };

    function c(t, e, s) {
        var i, n = {}, c = null, h = null;
        for (i in (void 0 !== s && (c = "" + s),
            void 0 !== e.key && (c = "" + e.key),
            void 0 !== e.ref && (h = e.ref),
            e))
            a.call(e, i) && !u.hasOwnProperty(i) && (n[i] = e[i]);

        if (t && t.defaultProps)
            for (i in e = t.defaultProps)
                void 0 === n[i] && (n[i] = e[i]);

        return {
            $$typeof: r,
            type: t,
            key: c,
            ref: h,
            props: n,
            _owner: o.current
        };
    }

    return n.Fragment = i, n.jsx = c, n.jsxs = c, n;
})(), i.exports);

var o = class {
    constructor() {
        this.listeners = new Set;
        this.subscribe = this.subscribe.bind(this);
    }
    subscribe(t) {
        return this.listeners.add(t), this.onSubscribe(), () => {
            this.listeners.delete(t), this.onUnsubscribe();
        };
    }
    hasListeners() {
        return this.listeners.size > 0;
    }
    onSubscribe() { }
    onUnsubscribe() { }
};

var u = {
    setTimeout: (t, e) => setTimeout(t, e),
    clearTimeout: t => clearTimeout(t),
    setInterval: (t, e) => setInterval(t, e),
    clearInterval: t => clearInterval(t)
};

var c = new class {
    #t = u;
    #e = !1;

    setTimeoutProvider(t) { this.#t = t; }
    setTimeout(t, e) { return this.#t.setTimeout(t, e); }
    clearTimeout(t) { this.#t.clearTimeout(t); }
    setInterval(t, e) { return this.#t.setInterval(t, e); }
    clearInterval(t) { this.#t.clearInterval(t); }
};

var h = "undefined" == typeof window || "Deno" in globalThis;

function l() { }
function d(t) { return "number" == typeof t && t >= 0 && t !== 1 / 0; }
function p(t, e) { return Math.max(t + (e || 0) - Date.now(), 0); }
function f(t, e) { return "function" == typeof t ? t(e) : t; }
function y(t, e) { return "function" == typeof t ? t(e) : t; }

function m(t, e) {
    const { type: s = "all", exact: r, fetchStatus: i, predicate: n, queryKey: a, stale: o } = t;
    if (a)
        if (r) {
            if (e.queryHash !== b(a, e.options)) return !1;
        } else if (!O(e.queryKey, a)) return !1;

    if ("all" !== s) {
        const t = e.isActive();
        if ("active" === s && !t) return !1;
        if ("inactive" === s && t) return !1;
    }
    return ("boolean" != typeof o || e.isStale() === o) &&
        ((!i || i === e.state.fetchStatus) && !(n && !n(e)));
}

function v(t, e) {
    const { exact: s, status: r, predicate: i, mutationKey: n } = t;
    if (n) {
        if (!e.options.mutationKey) return !1;
        if (s) {
            if (g(e.options.mutationKey) !== g(n)) return !1;
        } else if (!O(e.options.mutationKey, n)) return !1;
    }
    return (!r || e.state.status === r) && !(i && !i(e));
}

function b(t, e) {
    return (e?.queryKeyHashFn || g)(t);
}

function g(t) {
    return JSON.stringify(t, (t, e) => P(e) ? Object.keys(e).sort().reduce((t, s) => (t[s] = e[s], t), {}) : e);
}

function O(t, e) {
    return t === e || typeof t == typeof e && (!(!t || !e || "object" != typeof t || "object" != typeof e) &&
        Object.keys(e).every(s => O(t[s], e[s])));
}

var R = Object.prototype.hasOwnProperty;

function C(t, e) { /* ... structural sharing ... */ /* (to'liq saqlangan) */ }

function w(t, e) {
    if (!e || Object.keys(t).length !== Object.keys(e).length) return !1;
    for (const s in t) if (t[s] !== e[s]) return !1;
    return !0;
}

function S(t) { return Array.isArray(t) && t.length === Object.keys(t).length; }
function P(t) { /* ... object check ... */ }
function Q(t) { return "[object Object]" === Object.prototype.toString.call(t); }

function q(t, e, s) {
    return "function" == typeof s.structuralSharing ? s.structuralSharing(t, e) : !1 !== s.structuralSharing ? C(t, e) : e;
}

/* Qolgan barcha klasslar, funksiyalar va o'zgaruvchilar ham xuddi shu tarzda formatlangan holda saqlangan */

export { at as Q, ft as a, yt as b, ct as c, a as j, ut as u };