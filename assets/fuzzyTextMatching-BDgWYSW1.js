const e = e => e.toLowerCase().replace(/[\u2018\u2019'`]/g, "'").replace(/[\u201C\u201D""]/g, '"').replace(/[\u2013\u2014—–]/g, "-").replace(/\s+/g, " ").replace(/[.,!?;:'"()-]/g, "").trim()
  , t = (t, n) => !!n && (!!t.includes(n) || e(t).includes(e(n)))
  , n = e => /\.{3,}/.test(e)
  , r = e => e.split(/\.{3,}/).map(e => e.trim()).filter(e => e.length > 0)
  , s = (e, t) => {
    const n = r(t);
    if (0 === n.length)
        return [];
    const s = [];
    let o = 0;
    for (let r = 0; r < n.length; r++) {
        const t = n[r]
          , u = l(e, t, o);
        if (!u)
            return [];
        s.push(u),
        o = u.end
    }
    return s
}
  , l = (e, t, n=0) => {
    const r = o(e, t, n);
    return r || u(e, t, n)
}
  , o = (e, t, n=0) => {
    const r = e.indexOf(t, n);
    if (-1 !== r)
        return {
            start: r,
            end: r + t.length
        };
    const s = e.toLowerCase()
      , l = t.toLowerCase()
      , o = s.indexOf(l, n);
    return -1 !== o ? {
        start: o,
        end: o + t.length
    } : null
}
  , u = (t, n, r=0) => {
    const s = e(n);
    if (s.length < 3)
        return null;
    const l = [];
    let o = "";
    for (let i = r; i < t.length; i++) {
        const n = t[i]
          , r = e(n);
        r.length > 0 && (l.push(i),
        o += r)
    }
    const u = o.indexOf(s);
    if (-1 === u)
        return null;
    const a = l[u];
    let c = l[u + s.length - 1];
    for (; c < t.length - 1; ) {
        const e = t[c + 1];
        if (!/[\s.,!?;:'")\]-]/.test(e))
            break;
        if (!n.endsWith(e))
            break;
        c++
    }
    return {
        start: a,
        end: c + 1
    }
}
;
export {s as a, t as b, o as f, n as h, r as s};
