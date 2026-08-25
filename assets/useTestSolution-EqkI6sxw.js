import {a as t, u as e, b as s} from "query-DsA5-mxg.js";
import {r as o, b as a} from "index-HS6_bSfL.js";
import {h as n, a as r, b as i} from "fuzzyTextMatching-BDgWYSW1.js";
const l = t => {
    if (null == t)
        return;
    const e = String(t).trim();
    return e || void 0
}
  , u = t => {
    if (!t || "object" != typeof t)
        return null;
    const e = t
      , s = l(e.excerpt)
      , o = (t => {
        if ("number" == typeof t && Number.isInteger(t) && t >= 0)
            return t;
        if ("string" == typeof t) {
            const e = t.trim();
            if (!e)
                return;
            const s = Number.parseInt(e, 10);
            if (!Number.isNaN(s) && s >= 0)
                return s
        }
    }
    )(e.paragraphIndex)
      , a = l(e.label)
      , n = l(e.timestamp);
    return s ? {
        excerpt: s,
        ...a ? {
            label: a
        } : {},
        ...void 0 !== o ? {
            paragraphIndex: o
        } : {},
        ...n ? {
            timestamp: n
        } : {}
    } : null
}
  , c = t => {
    if (!t || "object" != typeof t)
        return {};
    const e = {};
    return Object.entries(t).forEach( ([t,s]) => {
        const o = t.trim();
        if (!o)
            return;
        Array.isArray(s);
        const a = (Array.isArray(s) ? s : [s]).map(t => u(t)).filter(t => !!t);
        a.length > 0 && (e[o] = a)
    }
    ),
    e
}
  , p = (t, e) => n(e) ? r(t, e).length > 0 : i(t, e)
  , d = (t, e, s, o) => {
    return !!p(s, t.excerpt) && (void 0 !== t.paragraphIndex && t.paragraphIndex === e || (!(!t.label || !o || t.label !== o) || void 0 !== t.paragraphIndex && (a = e,
    n = t.paragraphIndex,
    a >= n - 1 && a <= n + 2)));
    var a, n
}
  , m = (t, e, s, o) => !!p(s, t.excerpt) && (!t.timestamp || !!o && t.timestamp === o)
  , y = {
    normalizeSolution: t => ({
        ...t,
        answerLocations: c(t?.answerLocations)
    }),
    normalizeSolutionCollection: t => ({
        ...t,
        solutions: (t?.solutions || []).map(t => y.normalizeSolution(t))
    }),
    getTestSolution: async t => {
        const e = await o.get(`/tests/${t}/solution`);
        return y.normalizeSolutionCollection(e.data)
    }
    ,
    getTestSolutionTyped: async t => (await o.get(`/tests/${t}/solution/typed`)).data,
    getCompleteTestSolution: async t => {
        const e = await o.get(`/tests/${t}/solution/complete`);
        return {
            ...e.data,
            solutions: (e.data?.solutions || []).map(t => y.normalizeSolution(t))
        }
    }
    ,
    getPassageSolution: async t => {
        const e = await o.get(`/reading-passages/${t}/solution`);
        return y.normalizeSolution(e.data)
    }
    ,
    getTranscriptSolution: async t => {
        const e = await o.get(`/transcripts/${t}/solution`);
        return y.normalizeSolution(e.data)
    }
    ,
    saveTestSolution: async (t, e) => {
        const s = {
            ...e,
            solutions: (e?.solutions || []).map(t => ({
                ...t,
                answerLocations: c(t?.answerLocations)
            }))
        }
          , a = await o.put(`/tests/${t}/solution`, s);
        return y.normalizeSolutionCollection(a.data)
    }
    ,
    deleteTestSolution: async t => {
        await o.delete(`/tests/${t}/solution`)
    }
}
  , g = "test-solution"
  , S = "complete-test-solution"
  , f = e => t({
    queryKey: [g, e],
    queryFn: () => y.getTestSolution(e),
    enabled: !!e,
    staleTime: 3e5,
    retry: (t, e) => 404 !== e?.response?.status && t < 3
})
  , b = e => t({
    queryKey: [S, e],
    queryFn: () => y.getCompleteTestSolution(e),
    enabled: !!e,
    staleTime: 3e5,
    retry: (t, e) => 404 !== e?.response?.status && t < 3
})
  , T = () => {
    const t = e()
      , {toast: o} = a();
    return s({
        mutationFn: ({testId: t, data: e}) => y.saveTestSolution(t, e),
        onSuccess: (e, s) => {
            t.invalidateQueries({
                queryKey: [g, s.testId]
            }),
            o({
                title: "Success",
                description: "Test solution saved successfully"
            })
        }
        ,
        onError: t => {
            o({
                title: "Error",
                description: t?.response?.data?.message || "Failed to save test solution",
                variant: "destructive"
            })
        }
    })
}
  , v = () => {
    const t = e()
      , {toast: o} = a();
    return s({
        mutationFn: t => y.deleteTestSolution(t),
        onSuccess: (e, s) => {
            t.invalidateQueries({
                queryKey: [g, s]
            }),
            o({
                title: "Success",
                description: "Test solution deleted successfully"
            })
        }
        ,
        onError: t => {
            o({
                title: "Error",
                description: t?.response?.data?.message || "Failed to delete test solution",
                variant: "destructive"
            })
        }
    })
}
;
export {T as a, v as b, b as c, m as d, c as n, d as s, f as u};
