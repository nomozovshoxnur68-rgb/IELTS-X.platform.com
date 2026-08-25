import {r as t, a as e} from "./router-gAN6ztYq.js";
var s, r, i = {
    exports: {}
}, n = {};
var a = (r || (r = 1,
i.exports = function() {
    if (s)
        return n;
    s = 1;
    var e = t()
      , r = Symbol.for("react.element")
      , i = Symbol.for("react.fragment")
      , a = Object.prototype.hasOwnProperty
      , o = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner
      , u = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };
    function c(t, e, s) {
        var i, n = {}, c = null, h = null;
        for (i in void 0 !== s && (c = "" + s),
        void 0 !== e.key && (c = "" + e.key),
        void 0 !== e.ref && (h = e.ref),
        e)
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
        }
    }
    return n.Fragment = i,
    n.jsx = c,
    n.jsxs = c,
    n
}()),
i.exports)
  , o = class {
    constructor() {
        this.listeners = new Set,
        this.subscribe = this.subscribe.bind(this)
    }
    subscribe(t) {
        return this.listeners.add(t),
        this.onSubscribe(),
        () => {
            this.listeners.delete(t),
            this.onUnsubscribe()
        }
    }
    hasListeners() {
        return this.listeners.size > 0
    }
    onSubscribe() {}
    onUnsubscribe() {}
}
  , u = {
    setTimeout: (t, e) => setTimeout(t, e),
    clearTimeout: t => clearTimeout(t),
    setInterval: (t, e) => setInterval(t, e),
    clearInterval: t => clearInterval(t)
}
  , c = new class {
    #t = u;
    #e = !1;
    setTimeoutProvider(t) {
        this.#t = t
    }
    setTimeout(t, e) {
        return this.#t.setTimeout(t, e)
    }
    clearTimeout(t) {
        this.#t.clearTimeout(t)
    }
    setInterval(t, e) {
        return this.#t.setInterval(t, e)
    }
    clearInterval(t) {
        this.#t.clearInterval(t)
    }
}
;
var h = "undefined" == typeof window || "Deno"in globalThis;
function l() {}
function d(t) {
    return "number" == typeof t && t >= 0 && t !== 1 / 0
}
function p(t, e) {
    return Math.max(t + (e || 0) - Date.now(), 0)
}
function f(t, e) {
    return "function" == typeof t ? t(e) : t
}
function y(t, e) {
    return "function" == typeof t ? t(e) : t
}
function m(t, e) {
    const {type: s="all", exact: r, fetchStatus: i, predicate: n, queryKey: a, stale: o} = t;
    if (a)
        if (r) {
            if (e.queryHash !== b(a, e.options))
                return !1
        } else if (!O(e.queryKey, a))
            return !1;
    if ("all" !== s) {
        const t = e.isActive();
        if ("active" === s && !t)
            return !1;
        if ("inactive" === s && t)
            return !1
    }
    return ("boolean" != typeof o || e.isStale() === o) && ((!i || i === e.state.fetchStatus) && !(n && !n(e)))
}
function v(t, e) {
    const {exact: s, status: r, predicate: i, mutationKey: n} = t;
    if (n) {
        if (!e.options.mutationKey)
            return !1;
        if (s) {
            if (g(e.options.mutationKey) !== g(n))
                return !1
        } else if (!O(e.options.mutationKey, n))
            return !1
    }
    return (!r || e.state.status === r) && !(i && !i(e))
}
function b(t, e) {
    return (e?.queryKeyHashFn || g)(t)
}
function g(t) {
    return JSON.stringify(t, (t, e) => P(e) ? Object.keys(e).sort().reduce( (t, s) => (t[s] = e[s],
    t), {}) : e)
}
function O(t, e) {
    return t === e || typeof t == typeof e && (!(!t || !e || "object" != typeof t || "object" != typeof e) && Object.keys(e).every(s => O(t[s], e[s])))
}
var R = Object.prototype.hasOwnProperty;
function C(t, e) {
    if (t === e)
        return t;
    const s = S(t) && S(e);
    if (!(s || P(t) && P(e)))
        return e;
    const r = (s ? t : Object.keys(t)).length
      , i = s ? e : Object.keys(e)
      , n = i.length
      , a = s ? new Array(n) : {};
    let o = 0;
    for (let u = 0; u < n; u++) {
        const n = s ? u : i[u]
          , c = t[n]
          , h = e[n];
        if (c === h) {
            a[n] = c,
            (s ? u < r : R.call(t, n)) && o++;
            continue
        }
        if (null === c || null === h || "object" != typeof c || "object" != typeof h) {
            a[n] = h;
            continue
        }
        const l = C(c, h);
        a[n] = l,
        l === c && o++
    }
    return r === n && o === r ? t : a
}
function w(t, e) {
    if (!e || Object.keys(t).length !== Object.keys(e).length)
        return !1;
    for (const s in t)
        if (t[s] !== e[s])
            return !1;
    return !0
}
function S(t) {
    return Array.isArray(t) && t.length === Object.keys(t).length
}
function P(t) {
    if (!Q(t))
        return !1;
    const e = t.constructor;
    if (void 0 === e)
        return !0;
    const s = e.prototype;
    return !!Q(s) && (!!s.hasOwnProperty("isPrototypeOf") && Object.getPrototypeOf(t) === Object.prototype)
}
function Q(t) {
    return "[object Object]" === Object.prototype.toString.call(t)
}
function q(t, e, s) {
    return "function" == typeof s.structuralSharing ? s.structuralSharing(t, e) : !1 !== s.structuralSharing ? C(t, e) : e
}
function E(t, e, s=0) {
    const r = [...t, e];
    return s && r.length > s ? r.slice(1) : r
}
function T(t, e, s=0) {
    const r = [e, ...t];
    return s && r.length > s ? r.slice(0, -1) : r
}
var F = Symbol();
function I(t, e) {
    return !t.queryFn && e?.initialPromise ? () => e.initialPromise : t.queryFn && t.queryFn !== F ? t.queryFn : () => Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`))
}
function x(t, e) {
    return "function" == typeof t ? t(...e) : !!t
}
var D = new class extends o {
    #s;
    #r;
    #i;
    constructor() {
        super(),
        this.#i = t => {
            if (!h && window.addEventListener) {
                const e = () => t();
                return window.addEventListener("visibilitychange", e, !1),
                () => {
                    window.removeEventListener("visibilitychange", e)
                }
            }
        }
    }
    onSubscribe() {
        this.#r || this.setEventListener(this.#i)
    }
    onUnsubscribe() {
        this.hasListeners() || (this.#r?.(),
        this.#r = void 0)
    }
    setEventListener(t) {
        this.#i = t,
        this.#r?.(),
        this.#r = t(t => {
            "boolean" == typeof t ? this.setFocused(t) : this.onFocus()
        }
        )
    }
    setFocused(t) {
        this.#s !== t && (this.#s = t,
        this.onFocus())
    }
    onFocus() {
        const t = this.isFocused();
        this.listeners.forEach(e => {
            e(t)
        }
        )
    }
    isFocused() {
        return "boolean" == typeof this.#s ? this.#s : "hidden" !== globalThis.document?.visibilityState
    }
}
;
function M() {
    let t, e;
    const s = new Promise( (s, r) => {
        t = s,
        e = r
    }
    );
    function r(t) {
        Object.assign(s, t),
        delete s.resolve,
        delete s.reject
    }
    return s.status = "pending",
    s.catch( () => {}
    ),
    s.resolve = e => {
        r({
            status: "fulfilled",
            value: e
        }),
        t(e)
    }
    ,
    s.reject = t => {
        r({
            status: "rejected",
            reason: t
        }),
        e(t)
    }
    ,
    s
}
var A = function(t) {
    setTimeout(t, 0)
};
var j = function() {
    let t = []
      , e = 0
      , s = t => {
        t()
    }
      , r = t => {
        t()
    }
      , i = A;
    const n = r => {
        e ? t.push(r) : i( () => {
            s(r)
        }
        )
    }
    ;
    return {
        batch: n => {
            let a;
            e++;
            try {
                a = n()
            } finally {
                e--,
                e || ( () => {
                    const e = t;
                    t = [],
                    e.length && i( () => {
                        r( () => {
                            e.forEach(t => {
                                s(t)
                            }
                            )
                        }
                        )
                    }
                    )
                }
                )()
            }
            return a
        }
        ,
        batchCalls: t => (...e) => {
            n( () => {
                t(...e)
            }
            )
        }
        ,
        schedule: n,
        setNotifyFunction: t => {
            s = t
        }
        ,
        setBatchNotifyFunction: t => {
            r = t
        }
        ,
        setScheduler: t => {
            i = t
        }
    }
}()
  , U = new class extends o {
    #n = !0;
    #r;
    #i;
    constructor() {
        super(),
        this.#i = t => {
            if (!h && window.addEventListener) {
                const e = () => t(!0)
                  , s = () => t(!1);
                return window.addEventListener("online", e, !1),
                window.addEventListener("offline", s, !1),
                () => {
                    window.removeEventListener("online", e),
                    window.removeEventListener("offline", s)
                }
            }
        }
    }
    onSubscribe() {
        this.#r || this.setEventListener(this.#i)
    }
    onUnsubscribe() {
        this.hasListeners() || (this.#r?.(),
        this.#r = void 0)
    }
    setEventListener(t) {
        this.#i = t,
        this.#r?.(),
        this.#r = t(this.setOnline.bind(this))
    }
    setOnline(t) {
        this.#n !== t && (this.#n = t,
        this.listeners.forEach(e => {
            e(t)
        }
        ))
    }
    isOnline() {
        return this.#n
    }
}
;
function k(t) {
    return Math.min(1e3 * 2 ** t, 3e4)
}
function K(t) {
    return "online" !== (t ?? "online") || U.isOnline()
}
var _ = class extends Error {
    constructor(t) {
        super("CancelledError"),
        this.revert = t?.revert,
        this.silent = t?.silent
    }
}
;
function L(t) {
    let e, s = !1, r = 0;
    const i = M()
      , n = () => "pending" !== i.status
      , a = () => D.isFocused() && ("always" === t.networkMode || U.isOnline()) && t.canRun()
      , o = () => K(t.networkMode) && t.canRun()
      , u = t => {
        n() || (e?.(),
        i.resolve(t))
    }
      , l = t => {
        n() || (e?.(),
        i.reject(t))
    }
      , d = () => new Promise(s => {
        e = t => {
            (n() || a()) && s(t)
        }
        ,
        t.onPause?.()
    }
    ).then( () => {
        e = void 0,
        n() || t.onContinue?.()
    }
    )
      , p = () => {
        if (n())
            return;
        let e;
        const i = 0 === r ? t.initialPromise : void 0;
        try {
            e = i ?? t.fn()
        } catch (o) {
            e = Promise.reject(o)
        }
        Promise.resolve(e).then(u).catch(e => {
            if (n())
                return;
            const i = t.retry ?? (h ? 0 : 3)
              , o = t.retryDelay ?? k
              , u = "function" == typeof o ? o(r, e) : o
              , f = !0 === i || "number" == typeof i && r < i || "function" == typeof i && i(r, e);
            var y;
            !s && f ? (r++,
            t.onFail?.(r, e),
            (y = u,
            new Promise(t => {
                c.setTimeout(t, y)
            }
            )).then( () => a() ? void 0 : d()).then( () => {
                s ? l(e) : p()
            }
            )) : l(e)
        }
        )
    }
    ;
    return {
        promise: i,
        status: () => i.status,
        cancel: e => {
            if (!n()) {
                const s = new _(e);
                l(s),
                t.onCancel?.(s)
            }
        }
        ,
        continue: () => (e?.(),
        i),
        cancelRetry: () => {
            s = !0
        }
        ,
        continueRetry: () => {
            s = !1
        }
        ,
        canStart: o,
        start: () => (o() ? p() : d().then(p),
        i)
    }
}
var H = class {
    #a;
    destroy() {
        this.clearGcTimeout()
    }
    scheduleGc() {
        this.clearGcTimeout(),
        d(this.gcTime) && (this.#a = c.setTimeout( () => {
            this.optionalRemove()
        }
        , this.gcTime))
    }
    updateGcTime(t) {
        this.gcTime = Math.max(this.gcTime || 0, t ?? (h ? 1 / 0 : 3e5))
    }
    clearGcTimeout() {
        this.#a && (c.clearTimeout(this.#a),
        this.#a = void 0)
    }
}
  , G = class extends H {
    #o;
    #u;
    #c;
    #h;
    #l;
    #d;
    #p;
    constructor(t) {
        super(),
        this.#p = !1,
        this.#d = t.defaultOptions,
        this.setOptions(t.options),
        this.observers = [],
        this.#h = t.client,
        this.#c = this.#h.getQueryCache(),
        this.queryKey = t.queryKey,
        this.queryHash = t.queryHash,
        this.#o = W(this.options),
        this.state = t.state ?? this.#o,
        this.scheduleGc()
    }
    get meta() {
        return this.options.meta
    }
    get promise() {
        return this.#l?.promise
    }
    setOptions(t) {
        if (this.options = {
            ...this.#d,
            ...t
        },
        this.updateGcTime(this.options.gcTime),
        this.state && void 0 === this.state.data) {
            const t = W(this.options);
            void 0 !== t.data && (this.setState(B(t.data, t.dataUpdatedAt)),
            this.#o = t)
        }
    }
    optionalRemove() {
        this.observers.length || "idle" !== this.state.fetchStatus || this.#c.remove(this)
    }
    setData(t, e) {
        const s = q(this.state.data, t, this.options);
        return this.#f({
            data: s,
            type: "success",
            dataUpdatedAt: e?.updatedAt,
            manual: e?.manual
        }),
        s
    }
    setState(t, e) {
        this.#f({
            type: "setState",
            state: t,
            setStateOptions: e
        })
    }
    cancel(t) {
        const e = this.#l?.promise;
        return this.#l?.cancel(t),
        e ? e.then(l).catch(l) : Promise.resolve()
    }
    destroy() {
        super.destroy(),
        this.cancel({
            silent: !0
        })
    }
    reset() {
        this.destroy(),
        this.setState(this.#o)
    }
    isActive() {
        return this.observers.some(t => !1 !== y(t.options.enabled, this))
    }
    isDisabled() {
        return this.getObserversCount() > 0 ? !this.isActive() : this.options.queryFn === F || this.state.dataUpdateCount + this.state.errorUpdateCount === 0
    }
    isStatic() {
        return this.getObserversCount() > 0 && this.observers.some(t => "static" === f(t.options.staleTime, this))
    }
    isStale() {
        return this.getObserversCount() > 0 ? this.observers.some(t => t.getCurrentResult().isStale) : void 0 === this.state.data || this.state.isInvalidated
    }
    isStaleByTime(t=0) {
        return void 0 === this.state.data || "static" !== t && (!!this.state.isInvalidated || !p(this.state.dataUpdatedAt, t))
    }
    onFocus() {
        const t = this.observers.find(t => t.shouldFetchOnWindowFocus());
        t?.refetch({
            cancelRefetch: !1
        }),
        this.#l?.continue()
    }
    onOnline() {
        const t = this.observers.find(t => t.shouldFetchOnReconnect());
        t?.refetch({
            cancelRefetch: !1
        }),
        this.#l?.continue()
    }
    addObserver(t) {
        this.observers.includes(t) || (this.observers.push(t),
        this.clearGcTimeout(),
        this.#c.notify({
            type: "observerAdded",
            query: this,
            observer: t
        }))
    }
    removeObserver(t) {
        this.observers.includes(t) && (this.observers = this.observers.filter(e => e !== t),
        this.observers.length || (this.#l && (this.#p ? this.#l.cancel({
            revert: !0
        }) : this.#l.cancelRetry()),
        this.scheduleGc()),
        this.#c.notify({
            type: "observerRemoved",
            query: this,
            observer: t
        }))
    }
    getObserversCount() {
        return this.observers.length
    }
    invalidate() {
        this.state.isInvalidated || this.#f({
            type: "invalidate"
        })
    }
    async fetch(t, e) {
        if ("idle" !== this.state.fetchStatus && "rejected" !== this.#l?.status())
            if (void 0 !== this.state.data && e?.cancelRefetch)
                this.cancel({
                    silent: !0
                });
            else if (this.#l)
                return this.#l.continueRetry(),
                this.#l.promise;
        if (t && this.setOptions(t),
        !this.options.queryFn) {
            const t = this.observers.find(t => t.options.queryFn);
            t && this.setOptions(t.options)
        }
        const s = new AbortController
          , r = t => {
            Object.defineProperty(t, "signal", {
                enumerable: !0,
                get: () => (this.#p = !0,
                s.signal)
            })
        }
          , i = () => {
            const t = I(this.options, e)
              , s = ( () => {
                const t = {
                    client: this.#h,
                    queryKey: this.queryKey,
                    meta: this.meta
                };
                return r(t),
                t
            }
            )();
            return this.#p = !1,
            this.options.persister ? this.options.persister(t, s, this) : t(s)
        }
          , n = ( () => {
            const t = {
                fetchOptions: e,
                options: this.options,
                queryKey: this.queryKey,
                client: this.#h,
                state: this.state,
                fetchFn: i
            };
            return r(t),
            t
        }
        )();
        this.options.behavior?.onFetch(n, this),
        this.#u = this.state,
        "idle" !== this.state.fetchStatus && this.state.fetchMeta === n.fetchOptions?.meta || this.#f({
            type: "fetch",
            meta: n.fetchOptions?.meta
        }),
        this.#l = L({
            initialPromise: e?.initialPromise,
            fn: n.fetchFn,
            onCancel: t => {
                t instanceof _ && t.revert && this.setState({
                    ...this.#u,
                    fetchStatus: "idle"
                }),
                s.abort()
            }
            ,
            onFail: (t, e) => {
                this.#f({
                    type: "failed",
                    failureCount: t,
                    error: e
                })
            }
            ,
            onPause: () => {
                this.#f({
                    type: "pause"
                })
            }
            ,
            onContinue: () => {
                this.#f({
                    type: "continue"
                })
            }
            ,
            retry: n.options.retry,
            retryDelay: n.options.retryDelay,
            networkMode: n.options.networkMode,
            canRun: () => !0
        });
        try {
            const t = await this.#l.start();
            if (void 0 === t)
                throw new Error(`${this.queryHash} data is undefined`);
            return this.setData(t),
            this.#c.config.onSuccess?.(t, this),
            this.#c.config.onSettled?.(t, this.state.error, this),
            t
        } catch (a) {
            if (a instanceof _) {
                if (a.silent)
                    return this.#l.promise;
                if (a.revert) {
                    if (void 0 === this.state.data)
                        throw a;
                    return this.state.data
                }
            }
            throw this.#f({
                type: "error",
                error: a
            }),
            this.#c.config.onError?.(a, this),
            this.#c.config.onSettled?.(this.state.data, a, this),
            a
        } finally {
            this.scheduleGc()
        }
    }
    #f(t) {
        this.state = (e => {
            switch (t.type) {
            case "failed":
                return {
                    ...e,
                    fetchFailureCount: t.failureCount,
                    fetchFailureReason: t.error
                };
            case "pause":
                return {
                    ...e,
                    fetchStatus: "paused"
                };
            case "continue":
                return {
                    ...e,
                    fetchStatus: "fetching"
                };
            case "fetch":
                return {
                    ...e,
                    ...N(e.data, this.options),
                    fetchMeta: t.meta ?? null
                };
            case "success":
                const s = {
                    ...e,
                    ...B(t.data, t.dataUpdatedAt),
                    dataUpdateCount: e.dataUpdateCount + 1,
                    ...!t.manual && {
                        fetchStatus: "idle",
                        fetchFailureCount: 0,
                        fetchFailureReason: null
                    }
                };
                return this.#u = t.manual ? s : void 0,
                s;
            case "error":
                const r = t.error;
                return {
                    ...e,
                    error: r,
                    errorUpdateCount: e.errorUpdateCount + 1,
                    errorUpdatedAt: Date.now(),
                    fetchFailureCount: e.fetchFailureCount + 1,
                    fetchFailureReason: r,
                    fetchStatus: "idle",
                    status: "error",
                    isInvalidated: !0
                };
            case "invalidate":
                return {
                    ...e,
                    isInvalidated: !0
                };
            case "setState":
                return {
                    ...e,
                    ...t.state
                }
            }
        }
        )(this.state),
        j.batch( () => {
            this.observers.forEach(t => {
                t.onQueryUpdate()
            }
            ),
            this.#c.notify({
                query: this,
                type: "updated",
                action: t
            })
        }
        )
    }
}
;
function N(t, e) {
    return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: K(e.networkMode) ? "fetching" : "paused",
        ...void 0 === t && {
            error: null,
            status: "pending"
        }
    }
}
function B(t, e) {
    return {
        data: t,
        dataUpdatedAt: e ?? Date.now(),
        error: null,
        isInvalidated: !1,
        status: "success"
    }
}
function W(t) {
    const e = "function" == typeof t.initialData ? t.initialData() : t.initialData
      , s = void 0 !== e
      , r = s ? "function" == typeof t.initialDataUpdatedAt ? t.initialDataUpdatedAt() : t.initialDataUpdatedAt : 0;
    return {
        data: e,
        dataUpdateCount: 0,
        dataUpdatedAt: s ? r ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: !1,
        status: s ? "success" : "pending",
        fetchStatus: "idle"
    }
}
var $ = class extends o {
    constructor(t, e) {
        super(),
        this.options = e,
        this.#h = t,
        this.#y = null,
        this.#m = M(),
        this.bindMethods(),
        this.setOptions(e)
    }
    #h;
    #v = void 0;
    #b = void 0;
    #g = void 0;
    #O;
    #R;
    #m;
    #y;
    #C;
    #w;
    #S;
    #P;
    #Q;
    #q;
    #E = new Set;
    bindMethods() {
        this.refetch = this.refetch.bind(this)
    }
    onSubscribe() {
        1 === this.listeners.size && (this.#v.addObserver(this),
        z(this.#v, this.options) ? this.#T() : this.updateResult(),
        this.#F())
    }
    onUnsubscribe() {
        this.hasListeners() || this.destroy()
    }
    shouldFetchOnReconnect() {
        return J(this.#v, this.options, this.options.refetchOnReconnect)
    }
    shouldFetchOnWindowFocus() {
        return J(this.#v, this.options, this.options.refetchOnWindowFocus)
    }
    destroy() {
        this.listeners = new Set,
        this.#I(),
        this.#x(),
        this.#v.removeObserver(this)
    }
    setOptions(t) {
        const e = this.options
          , s = this.#v;
        if (this.options = this.#h.defaultQueryOptions(t),
        void 0 !== this.options.enabled && "boolean" != typeof this.options.enabled && "function" != typeof this.options.enabled && "boolean" != typeof y(this.options.enabled, this.#v))
            throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
        this.#D(),
        this.#v.setOptions(this.options),
        e._defaulted && !w(this.options, e) && this.#h.getQueryCache().notify({
            type: "observerOptionsUpdated",
            query: this.#v,
            observer: this
        });
        const r = this.hasListeners();
        r && Y(this.#v, s, this.options, e) && this.#T(),
        this.updateResult(),
        !r || this.#v === s && y(this.options.enabled, this.#v) === y(e.enabled, this.#v) && f(this.options.staleTime, this.#v) === f(e.staleTime, this.#v) || this.#M();
        const i = this.#A();
        !r || this.#v === s && y(this.options.enabled, this.#v) === y(e.enabled, this.#v) && i === this.#q || this.#j(i)
    }
    getOptimisticResult(t) {
        const e = this.#h.getQueryCache().build(this.#h, t)
          , s = this.createResult(e, t);
        return function(t, e) {
            if (!w(t.getCurrentResult(), e))
                return !0;
            return !1
        }(this, s) && (this.#g = s,
        this.#R = this.options,
        this.#O = this.#v.state),
        s
    }
    getCurrentResult() {
        return this.#g
    }
    trackResult(t, e) {
        return new Proxy(t,{
            get: (t, s) => (this.trackProp(s),
            e?.(s),
            "promise" === s && (this.trackProp("data"),
            this.options.experimental_prefetchInRender || "pending" !== this.#m.status || this.#m.reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),
            Reflect.get(t, s))
        })
    }
    trackProp(t) {
        this.#E.add(t)
    }
    getCurrentQuery() {
        return this.#v
    }
    refetch({...t}={}) {
        return this.fetch({
            ...t
        })
    }
    fetchOptimistic(t) {
        const e = this.#h.defaultQueryOptions(t)
          , s = this.#h.getQueryCache().build(this.#h, e);
        return s.fetch().then( () => this.createResult(s, e))
    }
    fetch(t) {
        return this.#T({
            ...t,
            cancelRefetch: t.cancelRefetch ?? !0
        }).then( () => (this.updateResult(),
        this.#g))
    }
    #T(t) {
        this.#D();
        let e = this.#v.fetch(this.options, t);
        return t?.throwOnError || (e = e.catch(l)),
        e
    }
    #M() {
        this.#I();
        const t = f(this.options.staleTime, this.#v);
        if (h || this.#g.isStale || !d(t))
            return;
        const e = p(this.#g.dataUpdatedAt, t) + 1;
        this.#P = c.setTimeout( () => {
            this.#g.isStale || this.updateResult()
        }
        , e)
    }
    #A() {
        return ("function" == typeof this.options.refetchInterval ? this.options.refetchInterval(this.#v) : this.options.refetchInterval) ?? !1
    }
    #j(t) {
        this.#x(),
        this.#q = t,
        !h && !1 !== y(this.options.enabled, this.#v) && d(this.#q) && 0 !== this.#q && (this.#Q = c.setInterval( () => {
            (this.options.refetchIntervalInBackground || D.isFocused()) && this.#T()
        }
        , this.#q))
    }
    #F() {
        this.#M(),
        this.#j(this.#A())
    }
    #I() {
        this.#P && (c.clearTimeout(this.#P),
        this.#P = void 0)
    }
    #x() {
        this.#Q && (c.clearInterval(this.#Q),
        this.#Q = void 0)
    }
    createResult(t, e) {
        const s = this.#v
          , r = this.options
          , i = this.#g
          , n = this.#O
          , a = this.#R
          , o = t !== s ? t.state : this.#b
          , {state: u} = t;
        let c, h = {
            ...u
        }, l = !1;
        if (e._optimisticResults) {
            const i = this.hasListeners()
              , n = !i && z(t, e)
              , a = i && Y(t, s, e, r);
            (n || a) && (h = {
                ...h,
                ...N(u.data, t.options)
            }),
            "isRestoring" === e._optimisticResults && (h.fetchStatus = "idle")
        }
        let {error: d, errorUpdatedAt: p, status: f} = h;
        c = h.data;
        let m = !1;
        if (void 0 !== e.placeholderData && void 0 === c && "pending" === f) {
            let t;
            i?.isPlaceholderData && e.placeholderData === a?.placeholderData ? (t = i.data,
            m = !0) : t = "function" == typeof e.placeholderData ? e.placeholderData(this.#S?.state.data, this.#S) : e.placeholderData,
            void 0 !== t && (f = "success",
            c = q(i?.data, t, e),
            l = !0)
        }
        if (e.select && void 0 !== c && !m)
            if (i && c === n?.data && e.select === this.#C)
                c = this.#w;
            else
                try {
                    this.#C = e.select,
                    c = e.select(c),
                    c = q(i?.data, c, e),
                    this.#w = c,
                    this.#y = null
                } catch (w) {
                    this.#y = w
                }
        this.#y && (d = this.#y,
        c = this.#w,
        p = Date.now(),
        f = "error");
        const v = "fetching" === h.fetchStatus
          , b = "pending" === f
          , g = "error" === f
          , O = b && v
          , R = void 0 !== c
          , C = {
            status: f,
            fetchStatus: h.fetchStatus,
            isPending: b,
            isSuccess: "success" === f,
            isError: g,
            isInitialLoading: O,
            isLoading: O,
            data: c,
            dataUpdatedAt: h.dataUpdatedAt,
            error: d,
            errorUpdatedAt: p,
            failureCount: h.fetchFailureCount,
            failureReason: h.fetchFailureReason,
            errorUpdateCount: h.errorUpdateCount,
            isFetched: h.dataUpdateCount > 0 || h.errorUpdateCount > 0,
            isFetchedAfterMount: h.dataUpdateCount > o.dataUpdateCount || h.errorUpdateCount > o.errorUpdateCount,
            isFetching: v,
            isRefetching: v && !b,
            isLoadingError: g && !R,
            isPaused: "paused" === h.fetchStatus,
            isPlaceholderData: l,
            isRefetchError: g && R,
            isStale: V(t, e),
            refetch: this.refetch,
            promise: this.#m,
            isEnabled: !1 !== y(e.enabled, t)
        };
        if (this.options.experimental_prefetchInRender) {
            const e = t => {
                "error" === C.status ? t.reject(C.error) : void 0 !== C.data && t.resolve(C.data)
            }
              , r = () => {
                const t = this.#m = C.promise = M();
                e(t)
            }
              , i = this.#m;
            switch (i.status) {
            case "pending":
                t.queryHash === s.queryHash && e(i);
                break;
            case "fulfilled":
                "error" !== C.status && C.data === i.value || r();
                break;
            case "rejected":
                "error" === C.status && C.error === i.reason || r()
            }
        }
        return C
    }
    updateResult() {
        const t = this.#g
          , e = this.createResult(this.#v, this.options);
        if (this.#O = this.#v.state,
        this.#R = this.options,
        void 0 !== this.#O.data && (this.#S = this.#v),
        w(e, t))
            return;
        this.#g = e;
        this.#U({
            listeners: ( () => {
                if (!t)
                    return !0;
                const {notifyOnChangeProps: e} = this.options
                  , s = "function" == typeof e ? e() : e;
                if ("all" === s || !s && !this.#E.size)
                    return !0;
                const r = new Set(s ?? this.#E);
                return this.options.throwOnError && r.add("error"),
                Object.keys(this.#g).some(e => {
                    const s = e;
                    return this.#g[s] !== t[s] && r.has(s)
                }
                )
            }
            )()
        })
    }
    #D() {
        const t = this.#h.getQueryCache().build(this.#h, this.options);
        if (t === this.#v)
            return;
        const e = this.#v;
        this.#v = t,
        this.#b = t.state,
        this.hasListeners() && (e?.removeObserver(this),
        t.addObserver(this))
    }
    onQueryUpdate() {
        this.updateResult(),
        this.hasListeners() && this.#F()
    }
    #U(t) {
        j.batch( () => {
            t.listeners && this.listeners.forEach(t => {
                t(this.#g)
            }
            ),
            this.#h.getQueryCache().notify({
                query: this.#v,
                type: "observerResultsUpdated"
            })
        }
        )
    }
}
;
function z(t, e) {
    return function(t, e) {
        return !1 !== y(e.enabled, t) && void 0 === t.state.data && !("error" === t.state.status && !1 === e.retryOnMount)
    }(t, e) || void 0 !== t.state.data && J(t, e, e.refetchOnMount)
}
function J(t, e, s) {
    if (!1 !== y(e.enabled, t) && "static" !== f(e.staleTime, t)) {
        const r = "function" == typeof s ? s(t) : s;
        return "always" === r || !1 !== r && V(t, e)
    }
    return !1
}
function Y(t, e, s, r) {
    return (t !== e || !1 === y(r.enabled, t)) && (!s.suspense || "error" !== t.state.status) && V(t, s)
}
function V(t, e) {
    return !1 !== y(e.enabled, t) && t.isStaleByTime(f(e.staleTime, t))
}
function X(t) {
    return {
        onFetch: (e, s) => {
            const r = e.options
              , i = e.fetchOptions?.meta?.fetchMore?.direction
              , n = e.state.data?.pages || []
              , a = e.state.data?.pageParams || [];
            let o = {
                pages: [],
                pageParams: []
            }
              , u = 0;
            const c = async () => {
                let s = !1;
                const c = t => {
                    !function(t, e, s) {
                        let r, i = !1;
                        Object.defineProperty(t, "signal", {
                            enumerable: !0,
                            get: () => (r ??= e(),
                            i || (i = !0,
                            r.aborted ? s() : r.addEventListener("abort", s, {
                                once: !0
                            })),
                            r)
                        })
                    }(t, () => e.signal, () => s = !0)
                }
                  , h = I(e.options, e.fetchOptions)
                  , l = async (t, r, i) => {
                    if (s)
                        return Promise.reject();
                    if (null == r && t.pages.length)
                        return Promise.resolve(t);
                    const n = ( () => {
                        const t = {
                            client: e.client,
                            queryKey: e.queryKey,
                            pageParam: r,
                            direction: i ? "backward" : "forward",
                            meta: e.options.meta
                        };
                        return c(t),
                        t
                    }
                    )()
                      , a = await h(n)
                      , {maxPages: o} = e.options
                      , u = i ? T : E;
                    return {
                        pages: u(t.pages, a, o),
                        pageParams: u(t.pageParams, r, o)
                    }
                }
                ;
                if (i && n.length) {
                    const t = "backward" === i
                      , e = {
                        pages: n,
                        pageParams: a
                    }
                      , s = (t ? tt : Z)(r, e);
                    o = await l(e, s, t)
                } else {
                    const e = t ?? n.length;
                    do {
                        const t = 0 === u ? a[0] ?? r.initialPageParam : Z(r, o);
                        if (u > 0 && null == t)
                            break;
                        o = await l(o, t),
                        u++
                    } while (u < e)
                }
                return o
            }
            ;
            e.options.persister ? e.fetchFn = () => e.options.persister?.(c, {
                client: e.client,
                queryKey: e.queryKey,
                meta: e.options.meta,
                signal: e.signal
            }, s) : e.fetchFn = c
        }
    }
}
function Z(t, {pages: e, pageParams: s}) {
    const r = e.length - 1;
    return e.length > 0 ? t.getNextPageParam(e[r], e, s[r], s) : void 0
}
function tt(t, {pages: e, pageParams: s}) {
    return e.length > 0 ? t.getPreviousPageParam?.(e[0], e, s[0], s) : void 0
}
var et = class extends H {
    #h;
    #k;
    #K;
    #l;
    constructor(t) {
        super(),
        this.#h = t.client,
        this.mutationId = t.mutationId,
        this.#K = t.mutationCache,
        this.#k = [],
        this.state = t.state || {
            context: void 0,
            data: void 0,
            error: null,
            failureCount: 0,
            failureReason: null,
            isPaused: !1,
            status: "idle",
            variables: void 0,
            submittedAt: 0
        },
        this.setOptions(t.options),
        this.scheduleGc()
    }
    setOptions(t) {
        this.options = t,
        this.updateGcTime(this.options.gcTime)
    }
    get meta() {
        return this.options.meta
    }
    addObserver(t) {
        this.#k.includes(t) || (this.#k.push(t),
        this.clearGcTimeout(),
        this.#K.notify({
            type: "observerAdded",
            mutation: this,
            observer: t
        }))
    }
    removeObserver(t) {
        this.#k = this.#k.filter(e => e !== t),
        this.scheduleGc(),
        this.#K.notify({
            type: "observerRemoved",
            mutation: this,
            observer: t
        })
    }
    optionalRemove() {
        this.#k.length || ("pending" === this.state.status ? this.scheduleGc() : this.#K.remove(this))
    }
    continue() {
        return this.#l?.continue() ?? this.execute(this.state.variables)
    }
    async execute(t) {
        const e = () => {
            this.#f({
                type: "continue"
            })
        }
          , s = {
            client: this.#h,
            meta: this.options.meta,
            mutationKey: this.options.mutationKey
        };
        this.#l = L({
            fn: () => this.options.mutationFn ? this.options.mutationFn(t, s) : Promise.reject(new Error("No mutationFn found")),
            onFail: (t, e) => {
                this.#f({
                    type: "failed",
                    failureCount: t,
                    error: e
                })
            }
            ,
            onPause: () => {
                this.#f({
                    type: "pause"
                })
            }
            ,
            onContinue: e,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => this.#K.canRun(this)
        });
        const r = "pending" === this.state.status
          , i = !this.#l.canStart();
        try {
            if (r)
                e();
            else {
                this.#f({
                    type: "pending",
                    variables: t,
                    isPaused: i
                }),
                await (this.#K.config.onMutate?.(t, this, s));
                const e = await (this.options.onMutate?.(t, s));
                e !== this.state.context && this.#f({
                    type: "pending",
                    context: e,
                    variables: t,
                    isPaused: i
                })
            }
            const n = await this.#l.start();
            return await (this.#K.config.onSuccess?.(n, t, this.state.context, this, s)),
            await (this.options.onSuccess?.(n, t, this.state.context, s)),
            await (this.#K.config.onSettled?.(n, null, this.state.variables, this.state.context, this, s)),
            await (this.options.onSettled?.(n, null, t, this.state.context, s)),
            this.#f({
                type: "success",
                data: n
            }),
            n
        } catch (n) {
            try {
                await (this.#K.config.onError?.(n, t, this.state.context, this, s))
            } catch (a) {
                Promise.reject(a)
            }
            try {
                await (this.options.onError?.(n, t, this.state.context, s))
            } catch (a) {
                Promise.reject(a)
            }
            try {
                await (this.#K.config.onSettled?.(void 0, n, this.state.variables, this.state.context, this, s))
            } catch (a) {
                Promise.reject(a)
            }
            try {
                await (this.options.onSettled?.(void 0, n, t, this.state.context, s))
            } catch (a) {
                Promise.reject(a)
            }
            throw this.#f({
                type: "error",
                error: n
            }),
            n
        } finally {
            this.#K.runNext(this)
        }
    }
    #f(t) {
        this.state = (e => {
            switch (t.type) {
            case "failed":
                return {
                    ...e,
                    failureCount: t.failureCount,
                    failureReason: t.error
                };
            case "pause":
                return {
                    ...e,
                    isPaused: !0
                };
            case "continue":
                return {
                    ...e,
                    isPaused: !1
                };
            case "pending":
                return {
                    ...e,
                    context: t.context,
                    data: void 0,
                    failureCount: 0,
                    failureReason: null,
                    error: null,
                    isPaused: t.isPaused,
                    status: "pending",
                    variables: t.variables,
                    submittedAt: Date.now()
                };
            case "success":
                return {
                    ...e,
                    data: t.data,
                    failureCount: 0,
                    failureReason: null,
                    error: null,
                    status: "success",
                    isPaused: !1
                };
            case "error":
                return {
                    ...e,
                    data: void 0,
                    error: t.error,
                    failureCount: e.failureCount + 1,
                    failureReason: t.error,
                    isPaused: !1,
                    status: "error"
                }
            }
        }
        )(this.state),
        j.batch( () => {
            this.#k.forEach(e => {
                e.onMutationUpdate(t)
            }
            ),
            this.#K.notify({
                mutation: this,
                type: "updated",
                action: t
            })
        }
        )
    }
}
;
var st = class extends o {
    constructor(t={}) {
        super(),
        this.config = t,
        this.#_ = new Set,
        this.#L = new Map,
        this.#H = 0
    }
    #_;
    #L;
    #H;
    build(t, e, s) {
        const r = new et({
            client: t,
            mutationCache: this,
            mutationId: ++this.#H,
            options: t.defaultMutationOptions(e),
            state: s
        });
        return this.add(r),
        r
    }
    add(t) {
        this.#_.add(t);
        const e = rt(t);
        if ("string" == typeof e) {
            const s = this.#L.get(e);
            s ? s.push(t) : this.#L.set(e, [t])
        }
        this.notify({
            type: "added",
            mutation: t
        })
    }
    remove(t) {
        if (this.#_.delete(t)) {
            const e = rt(t);
            if ("string" == typeof e) {
                const s = this.#L.get(e);
                if (s)
                    if (s.length > 1) {
                        const e = s.indexOf(t);
                        -1 !== e && s.splice(e, 1)
                    } else
                        s[0] === t && this.#L.delete(e)
            }
        }
        this.notify({
            type: "removed",
            mutation: t
        })
    }
    canRun(t) {
        const e = rt(t);
        if ("string" == typeof e) {
            const s = this.#L.get(e)
              , r = s?.find(t => "pending" === t.state.status);
            return !r || r === t
        }
        return !0
    }
    runNext(t) {
        const e = rt(t);
        if ("string" == typeof e) {
            const s = this.#L.get(e)?.find(e => e !== t && e.state.isPaused);
            return s?.continue() ?? Promise.resolve()
        }
        return Promise.resolve()
    }
    clear() {
        j.batch( () => {
            this.#_.forEach(t => {
                this.notify({
                    type: "removed",
                    mutation: t
                })
            }
            ),
            this.#_.clear(),
            this.#L.clear()
        }
        )
    }
    getAll() {
        return Array.from(this.#_)
    }
    find(t) {
        const e = {
            exact: !0,
            ...t
        };
        return this.getAll().find(t => v(e, t))
    }
    findAll(t={}) {
        return this.getAll().filter(e => v(t, e))
    }
    notify(t) {
        j.batch( () => {
            this.listeners.forEach(e => {
                e(t)
            }
            )
        }
        )
    }
    resumePausedMutations() {
        const t = this.getAll().filter(t => t.state.isPaused);
        return j.batch( () => Promise.all(t.map(t => t.continue().catch(l))))
    }
}
;
function rt(t) {
    return t.options.scope?.id
}
var it = class extends o {
    #h;
    #g = void 0;
    #G;
    #N;
    constructor(t, e) {
        super(),
        this.#h = t,
        this.setOptions(e),
        this.bindMethods(),
        this.#B()
    }
    bindMethods() {
        this.mutate = this.mutate.bind(this),
        this.reset = this.reset.bind(this)
    }
    setOptions(t) {
        const e = this.options;
        this.options = this.#h.defaultMutationOptions(t),
        w(this.options, e) || this.#h.getMutationCache().notify({
            type: "observerOptionsUpdated",
            mutation: this.#G,
            observer: this
        }),
        e?.mutationKey && this.options.mutationKey && g(e.mutationKey) !== g(this.options.mutationKey) ? this.reset() : "pending" === this.#G?.state.status && this.#G.setOptions(this.options)
    }
    onUnsubscribe() {
        this.hasListeners() || this.#G?.removeObserver(this)
    }
    onMutationUpdate(t) {
        this.#B(),
        this.#U(t)
    }
    getCurrentResult() {
        return this.#g
    }
    reset() {
        this.#G?.removeObserver(this),
        this.#G = void 0,
        this.#B(),
        this.#U()
    }
    mutate(t, e) {
        return this.#N = e,
        this.#G?.removeObserver(this),
        this.#G = this.#h.getMutationCache().build(this.#h, this.options),
        this.#G.addObserver(this),
        this.#G.execute(t)
    }
    #B() {
        const t = this.#G?.state ?? {
            context: void 0,
            data: void 0,
            error: null,
            failureCount: 0,
            failureReason: null,
            isPaused: !1,
            status: "idle",
            variables: void 0,
            submittedAt: 0
        };
        this.#g = {
            ...t,
            isPending: "pending" === t.status,
            isSuccess: "success" === t.status,
            isError: "error" === t.status,
            isIdle: "idle" === t.status,
            mutate: this.mutate,
            reset: this.reset
        }
    }
    #U(t) {
        j.batch( () => {
            if (this.#N && this.hasListeners()) {
                const s = this.#g.variables
                  , r = this.#g.context
                  , i = {
                    client: this.#h,
                    meta: this.options.meta,
                    mutationKey: this.options.mutationKey
                };
                if ("success" === t?.type) {
                    try {
                        this.#N.onSuccess?.(t.data, s, r, i)
                    } catch (e) {
                        Promise.reject(e)
                    }
                    try {
                        this.#N.onSettled?.(t.data, null, s, r, i)
                    } catch (e) {
                        Promise.reject(e)
                    }
                } else if ("error" === t?.type) {
                    try {
                        this.#N.onError?.(t.error, s, r, i)
                    } catch (e) {
                        Promise.reject(e)
                    }
                    try {
                        this.#N.onSettled?.(void 0, t.error, s, r, i)
                    } catch (e) {
                        Promise.reject(e)
                    }
                }
            }
            this.listeners.forEach(t => {
                t(this.#g)
            }
            )
        }
        )
    }
}
  , nt = class extends o {
    constructor(t={}) {
        super(),
        this.config = t,
        this.#W = new Map
    }
    #W;
    build(t, e, s) {
        const r = e.queryKey
          , i = e.queryHash ?? b(r, e);
        let n = this.get(i);
        return n || (n = new G({
            client: t,
            queryKey: r,
            queryHash: i,
            options: t.defaultQueryOptions(e),
            state: s,
            defaultOptions: t.getQueryDefaults(r)
        }),
        this.add(n)),
        n
    }
    add(t) {
        this.#W.has(t.queryHash) || (this.#W.set(t.queryHash, t),
        this.notify({
            type: "added",
            query: t
        }))
    }
    remove(t) {
        const e = this.#W.get(t.queryHash);
        e && (t.destroy(),
        e === t && this.#W.delete(t.queryHash),
        this.notify({
            type: "removed",
            query: t
        }))
    }
    clear() {
        j.batch( () => {
            this.getAll().forEach(t => {
                this.remove(t)
            }
            )
        }
        )
    }
    get(t) {
        return this.#W.get(t)
    }
    getAll() {
        return [...this.#W.values()]
    }
    find(t) {
        const e = {
            exact: !0,
            ...t
        };
        return this.getAll().find(t => m(e, t))
    }
    findAll(t={}) {
        const e = this.getAll();
        return Object.keys(t).length > 0 ? e.filter(e => m(t, e)) : e
    }
    notify(t) {
        j.batch( () => {
            this.listeners.forEach(e => {
                e(t)
            }
            )
        }
        )
    }
    onFocus() {
        j.batch( () => {
            this.getAll().forEach(t => {
                t.onFocus()
            }
            )
        }
        )
    }
    onOnline() {
        j.batch( () => {
            this.getAll().forEach(t => {
                t.onOnline()
            }
            )
        }
        )
    }
}
  , at = class {
    #$;
    #K;
    #d;
    #z;
    #J;
    #Y;
    #V;
    #X;
    constructor(t={}) {
        this.#$ = t.queryCache || new nt,
        this.#K = t.mutationCache || new st,
        this.#d = t.defaultOptions || {},
        this.#z = new Map,
        this.#J = new Map,
        this.#Y = 0
    }
    mount() {
        this.#Y++,
        1 === this.#Y && (this.#V = D.subscribe(async t => {
            t && (await this.resumePausedMutations(),
            this.#$.onFocus())
        }
        ),
        this.#X = U.subscribe(async t => {
            t && (await this.resumePausedMutations(),
            this.#$.onOnline())
        }
        ))
    }
    unmount() {
        this.#Y--,
        0 === this.#Y && (this.#V?.(),
        this.#V = void 0,
        this.#X?.(),
        this.#X = void 0)
    }
    isFetching(t) {
        return this.#$.findAll({
            ...t,
            fetchStatus: "fetching"
        }).length
    }
    isMutating(t) {
        return this.#K.findAll({
            ...t,
            status: "pending"
        }).length
    }
    getQueryData(t) {
        const e = this.defaultQueryOptions({
            queryKey: t
        });
        return this.#$.get(e.queryHash)?.state.data
    }
    ensureQueryData(t) {
        const e = this.defaultQueryOptions(t)
          , s = this.#$.build(this, e)
          , r = s.state.data;
        return void 0 === r ? this.fetchQuery(t) : (t.revalidateIfStale && s.isStaleByTime(f(e.staleTime, s)) && this.prefetchQuery(e),
        Promise.resolve(r))
    }
    getQueriesData(t) {
        return this.#$.findAll(t).map( ({queryKey: t, state: e}) => [t, e.data])
    }
    setQueryData(t, e, s) {
        const r = this.defaultQueryOptions({
            queryKey: t
        })
          , i = this.#$.get(r.queryHash)
          , n = i?.state.data
          , a = function(t, e) {
            return "function" == typeof t ? t(e) : t
        }(e, n);
        if (void 0 !== a)
            return this.#$.build(this, r).setData(a, {
                ...s,
                manual: !0
            })
    }
    setQueriesData(t, e, s) {
        return j.batch( () => this.#$.findAll(t).map( ({queryKey: t}) => [t, this.setQueryData(t, e, s)]))
    }
    getQueryState(t) {
        const e = this.defaultQueryOptions({
            queryKey: t
        });
        return this.#$.get(e.queryHash)?.state
    }
    removeQueries(t) {
        const e = this.#$;
        j.batch( () => {
            e.findAll(t).forEach(t => {
                e.remove(t)
            }
            )
        }
        )
    }
    resetQueries(t, e) {
        const s = this.#$;
        return j.batch( () => (s.findAll(t).forEach(t => {
            t.reset()
        }
        ),
        this.refetchQueries({
            type: "active",
            ...t
        }, e)))
    }
    cancelQueries(t, e={}) {
        const s = {
            revert: !0,
            ...e
        }
          , r = j.batch( () => this.#$.findAll(t).map(t => t.cancel(s)));
        return Promise.all(r).then(l).catch(l)
    }
    invalidateQueries(t, e={}) {
        return j.batch( () => (this.#$.findAll(t).forEach(t => {
            t.invalidate()
        }
        ),
        "none" === t?.refetchType ? Promise.resolve() : this.refetchQueries({
            ...t,
            type: t?.refetchType ?? t?.type ?? "active"
        }, e)))
    }
    refetchQueries(t, e={}) {
        const s = {
            ...e,
            cancelRefetch: e.cancelRefetch ?? !0
        }
          , r = j.batch( () => this.#$.findAll(t).filter(t => !t.isDisabled() && !t.isStatic()).map(t => {
            let e = t.fetch(void 0, s);
            return s.throwOnError || (e = e.catch(l)),
            "paused" === t.state.fetchStatus ? Promise.resolve() : e
        }
        ));
        return Promise.all(r).then(l)
    }
    fetchQuery(t) {
        const e = this.defaultQueryOptions(t);
        void 0 === e.retry && (e.retry = !1);
        const s = this.#$.build(this, e);
        return s.isStaleByTime(f(e.staleTime, s)) ? s.fetch(e) : Promise.resolve(s.state.data)
    }
    prefetchQuery(t) {
        return this.fetchQuery(t).then(l).catch(l)
    }
    fetchInfiniteQuery(t) {
        return t.behavior = X(t.pages),
        this.fetchQuery(t)
    }
    prefetchInfiniteQuery(t) {
        return this.fetchInfiniteQuery(t).then(l).catch(l)
    }
    ensureInfiniteQueryData(t) {
        return t.behavior = X(t.pages),
        this.ensureQueryData(t)
    }
    resumePausedMutations() {
        return U.isOnline() ? this.#K.resumePausedMutations() : Promise.resolve()
    }
    getQueryCache() {
        return this.#$
    }
    getMutationCache() {
        return this.#K
    }
    getDefaultOptions() {
        return this.#d
    }
    setDefaultOptions(t) {
        this.#d = t
    }
    setQueryDefaults(t, e) {
        this.#z.set(g(t), {
            queryKey: t,
            defaultOptions: e
        })
    }
    getQueryDefaults(t) {
        const e = [...this.#z.values()]
          , s = {};
        return e.forEach(e => {
            O(t, e.queryKey) && Object.assign(s, e.defaultOptions)
        }
        ),
        s
    }
    setMutationDefaults(t, e) {
        this.#J.set(g(t), {
            mutationKey: t,
            defaultOptions: e
        })
    }
    getMutationDefaults(t) {
        const e = [...this.#J.values()]
          , s = {};
        return e.forEach(e => {
            O(t, e.mutationKey) && Object.assign(s, e.defaultOptions)
        }
        ),
        s
    }
    defaultQueryOptions(t) {
        if (t._defaulted)
            return t;
        const e = {
            ...this.#d.queries,
            ...this.getQueryDefaults(t.queryKey),
            ...t,
            _defaulted: !0
        };
        return e.queryHash || (e.queryHash = b(e.queryKey, e)),
        void 0 === e.refetchOnReconnect && (e.refetchOnReconnect = "always" !== e.networkMode),
        void 0 === e.throwOnError && (e.throwOnError = !!e.suspense),
        !e.networkMode && e.persister && (e.networkMode = "offlineFirst"),
        e.queryFn === F && (e.enabled = !1),
        e
    }
    defaultMutationOptions(t) {
        return t?._defaulted ? t : {
            ...this.#d.mutations,
            ...t?.mutationKey && this.getMutationDefaults(t.mutationKey),
            ...t,
            _defaulted: !0
        }
    }
    clear() {
        this.#$.clear(),
        this.#K.clear()
    }
}
  , ot = e.createContext(void 0)
  , ut = t => {
    const s = e.useContext(ot);
    if (!s)
        throw new Error("No QueryClient set, use QueryClientProvider to set one");
    return s
}
  , ct = ({client: t, children: s}) => (e.useEffect( () => (t.mount(),
() => {
    t.unmount()
}
), [t]),
a.jsx(ot.Provider, {
    value: t,
    children: s
}))
  , ht = e.createContext(!1);
ht.Provider;
var lt = e.createContext(function() {
    let t = !1;
    return {
        clearReset: () => {
            t = !1
        }
        ,
        reset: () => {
            t = !0
        }
        ,
        isReset: () => t
    }
}())
  , dt = (t, e, s) => e.fetchOptimistic(t).catch( () => {
    s.clearReset()
}
);
function pt(t, s, r) {
    const i = e.useContext(ht)
      , n = e.useContext(lt)
      , a = ut()
      , o = a.defaultQueryOptions(t);
    a.getDefaultOptions().queries?._experimental_beforeQuery?.(o);
    const u = a.getQueryCache().get(o.queryHash);
    o._optimisticResults = i ? "isRestoring" : "optimistic",
    (t => {
        if (t.suspense) {
            const e = 1e3
              , s = t => "static" === t ? t : Math.max(t ?? e, e)
              , r = t.staleTime;
            t.staleTime = "function" == typeof r ? (...t) => s(r(...t)) : s(r),
            "number" == typeof t.gcTime && (t.gcTime = Math.max(t.gcTime, e))
        }
    }
    )(o),
    ( (t, e, s) => {
        const r = s?.state.error && "function" == typeof t.throwOnError ? x(t.throwOnError, [s.state.error, s]) : t.throwOnError;
        (t.suspense || t.experimental_prefetchInRender || r) && (e.isReset() || (t.retryOnMount = !1))
    }
    )(o, n, u),
    (t => {
        e.useEffect( () => {
            t.clearReset()
        }
        , [t])
    }
    )(n);
    const c = !a.getQueryCache().get(o.queryHash)
      , [d] = e.useState( () => new s(a,o))
      , p = d.getOptimisticResult(o)
      , f = !i && !1 !== t.subscribed;
    if (e.useSyncExternalStore(e.useCallback(t => {
        const e = f ? d.subscribe(j.batchCalls(t)) : l;
        return d.updateResult(),
        e
    }
    , [d, f]), () => d.getCurrentResult(), () => d.getCurrentResult()),
    e.useEffect( () => {
        d.setOptions(o)
    }
    , [o, d]),
    ( (t, e) => t?.suspense && e.isPending)(o, p))
        throw dt(o, d, n);
    if (( ({result: t, errorResetBoundary: e, throwOnError: s, query: r, suspense: i}) => t.isError && !e.isReset() && !t.isFetching && r && (i && void 0 === t.data || x(s, [t.error, r])))({
        result: p,
        errorResetBoundary: n,
        throwOnError: o.throwOnError,
        query: u,
        suspense: o.suspense
    }))
        throw p.error;
    if (a.getDefaultOptions().queries?._experimental_afterQuery?.(o, p),
    o.experimental_prefetchInRender && !h && ( (t, e) => t.isLoading && t.isFetching && !e)(p, i)) {
        const t = c ? dt(o, d, n) : u?.promise;
        t?.catch(l).finally( () => {
            d.updateResult()
        }
        )
    }
    return o.notifyOnChangeProps ? p : d.trackResult(p)
}
function ft(t, e) {
    return pt(t, $)
}
function yt(t, s) {
    const r = ut()
      , [i] = e.useState( () => new it(r,t));
    e.useEffect( () => {
        i.setOptions(t)
    }
    , [i, t]);
    const n = e.useSyncExternalStore(e.useCallback(t => i.subscribe(j.batchCalls(t)), [i]), () => i.getCurrentResult(), () => i.getCurrentResult())
      , a = e.useCallback( (t, e) => {
        i.mutate(t, e).catch(l)
    }
    , [i]);
    if (n.error && x(i.options.throwOnError, [n.error]))
        throw n.error;
    return {
        ...n,
        mutate: a,
        mutateAsync: n.mutate
    }
}
export {at as Q, ft as a, yt as b, ct as c, a as j, ut as u};
