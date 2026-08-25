import {a as e, u as t, b as a} from "./query-DsA5-mxg.js";
import {a as r} from "./router-gAN6ztYq.js";
import {r as s, a5 as n, at as i} from "./index-HS6_bSfL.js";
const o = "transcripts"
  , c = t => e({
    queryKey: [o, t],
    queryFn: async () => (await s.get(`/tests/${t}/transcript`)).data,
    enabled: !!t
})
  , u = () => {
    const e = t();
    return a({
        mutationFn: async ({testId: e, transcripts: t}) => (await s.post(`/tests/${e}/transcript`, t)).data,
        onSuccess: (t, a) => {
            e.invalidateQueries({
                queryKey: [o, a.testId]
            })
        }
    })
}
  , d = () => {
    const e = t();
    return a({
        mutationFn: async ({transcriptId: e, data: t}) => (await s.put(`/transcripts/${e}`, t)).data,
        onSuccess: t => {
            e.invalidateQueries({
                queryKey: [o, "single", t.id]
            }),
            t.practiceTestId && e.invalidateQueries({
                queryKey: [o, t.practiceTestId]
            })
        }
    })
}
  , p = "practice-tests"
  , y = "questions"
  , g = "passages"
  , l = "answer-keys"
  , w = (t, a, r, n=0, i=15) => e({
    queryKey: [p, t, a, r, n, i],
    queryFn: async () => {
        const e = new URLSearchParams;
        t && e.append("section", t),
        r && e.append("packId", r),
        e.append("page", n.toString()),
        e.append("size", i.toString());
        const {data: a} = await s.get(`/practice-tests?${e.toString()}`);
        return Array.isArray(a) ? a : a?.tests || []
    }
})
  , q = (t, a=0, r=10) => e({
    queryKey: [p, "pack", t, a, r],
    queryFn: async () => {
        const e = new URLSearchParams;
        e.append("packId", t),
        e.append("page", a.toString()),
        e.append("size", r.toString());
        const {data: n} = await s.get(`/practice-tests?${e.toString()}`);
        return n
    }
    ,
    enabled: Boolean(t)
})
  , S = (t, a=0, r=15, n) => {
    const {section: i, useAdminEndpoint: o=!1} = n ?? {};
    return e({
        queryKey: [p, "search", t, a, r, i ?? "ALL", o],
        queryFn: async () => {
            const e = new URLSearchParams;
            e.append("search", t),
            e.append("page", a.toString()),
            e.append("size", r.toString()),
            o && i && "ALL" !== i && e.append("section", i);
            const n = o ? "/admin/practice-tests/search" : "/practice-tests/search"
              , {data: c} = await s.get(`${n}?${e.toString()}`);
            return c
        }
        ,
        enabled: Boolean(t && t.trim())
    })
}
  , m = (t, a) => e({
    queryKey: [p, t],
    queryFn: async () => {
        const {data: e} = await s.get(`/practice-tests/${t}`);
        return e
    }
    ,
    enabled: Boolean(t),
    ...a
})
  , I = (t, a, r=0, n=100, i) => e({
    queryKey: [y, t, a, r, n],
    queryFn: async () => {
        const e = new URLSearchParams;
        t && e.append("practiceTestId", t),
        e.append("page", r.toString()),
        e.append("size", n.toString());
        const {data: a} = await s.get(`/questions?${e.toString()}`);
        return Array.isArray(a) ? a : a?.questions || []
    }
    ,
    enabled: Boolean(t),
    ...i
})
  , K = (t, a, r=0, n=100) => e({
    queryKey: [g, t, a, r, n],
    queryFn: async () => {
        const e = new URLSearchParams;
        t && e.append("practiceTestId", t),
        e.append("page", r.toString()),
        e.append("size", n.toString());
        const {data: a} = await s.get(`/passages?${e.toString()}`);
        return Array.isArray(a) ? a : a?.passages || []
    }
    ,
    enabled: Boolean(t)
})
  , f = (t, a=0, r=15, n) => e({
    queryKey: [g, "search", t, a, r, n],
    queryFn: async () => {
        const e = new URLSearchParams;
        e.append("search", t),
        e.append("page", a.toString()),
        e.append("size", r.toString()),
        n && e.append("passageNumber", n.toString());
        const {data: i} = await s.get(`/passages/search?${e.toString()}`);
        return i
    }
    ,
    enabled: Boolean(t && t.trim())
})
  , h = (t, a) => {
    const r = [p, t, l]
      , n = {
        enabled: Boolean(t),
        ...a,
        queryKey: r,
        queryFn: async () => {
            const {data: e} = await s.get(`/practice-tests/${t}/answer-keys`);
            return e
        }
    };
    return e(n)
}
;
function v() {
    const e = t();
    return a({
        mutationFn: async e => (await s.post("/practice-tests", e)).data,
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["practice-tests"]
            })
        }
    })
}
const $ = () => {
    const e = t();
    return a({
        mutationFn: async ({test: e, section: t}) => {
            const {data: a} = await s.put(`/practice-tests/${e.id}`, {
                ...e,
                section: t
            });
            return a
        }
        ,
        onSuccess: (t, a) => {
            e.invalidateQueries({
                queryKey: [p]
            }),
            e.invalidateQueries({
                queryKey: [p, a.test.id]
            })
        }
    })
}
  , F = () => {
    const e = t();
    return a({
        mutationFn: async e => (await s.delete(`/practice-tests/${e}`),
        e),
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: [p]
            })
        }
    })
}
  , Q = () => {
    const e = t();
    return a({
        mutationFn: async ({test: e, packId: t}) => {
            const a = {
                id: e.id,
                title: e.title,
                source: e.source || "",
                testOrder: e.testOrder,
                section: e.section,
                categoryNames: e.categoryNames || [],
                testType: e.testType || "FULL",
                packId: t,
                audioUrl: e.audioUrl,
                coverImageUrl: e.coverImageUrl,
                questionIds: e.questionIds || [],
                answerKeyId: e.answerKeyId,
                completed: e.completed || !1,
                passageIds: e.passageIds || [],
                categoryIds: e.categoryIds || [],
                description: e.description || ""
            }
              , {data: r} = await s.put(`/practice-tests/${e.id}`, a);
            return r
        }
        ,
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: [p]
            }),
            e.invalidateQueries({
                queryKey: ["test-packs"]
            })
        }
    })
}
  , L = () => {
    const e = t();
    return a({
        mutationFn: async ({test: e, newPackId: t}) => {
            const a = {
                ...e,
                packId: t
            }
              , {data: r} = await s.put(`/practice-tests/${e.id}`, a);
            return r
        }
        ,
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: [p]
            }),
            e.invalidateQueries({
                queryKey: ["test-packs"]
            })
        }
    })
}
  , k = () => {
    const e = t();
    return a({
        mutationFn: async e => {
            if (!e.id)
                throw new Error("Question ID is required for updates");
            const {data: t} = await s.put(`/questions/${e.id}`, e);
            return t
        }
        ,
        onSuccess: t => (e.invalidateQueries({
            queryKey: [y]
        }),
        e.invalidateQueries({
            queryKey: [y, t.id]
        }),
        t)
    })
}
  , b = () => {
    const e = t();
    return a({
        mutationFn: async e => {
            if (!e.id)
                throw new Error("Passage ID is required for updates");
            const {data: t} = await s.put(`/passages/${e.id}`, e);
            return t
        }
        ,
        onSuccess: t => (e.invalidateQueries({
            queryKey: [g]
        }),
        e.invalidateQueries({
            queryKey: [g, t.id]
        }),
        t)
    })
}
  , A = () => {
    const e = t();
    return a({
        mutationFn: async e => {
            if (!e.id)
                throw new Error("Answer key ID is required for updates");
            const t = {
                ...e,
                answers: i(e.answers)
            }
              , {data: a} = await s.put(`/answer-keys/${e.id}`, t);
            return a
        }
        ,
        onSuccess: t => (e.invalidateQueries({
            queryKey: [l]
        }),
        e.invalidateQueries({
            queryKey: [l, t.id]
        }),
        t)
    })
}
  , E = async e => {
    if (!e || 0 === Object.keys(e).length)
        return null;
    try {
        return (await s.post("/answer-keys", {
            answers: i(e)
        })).data.id
    } catch (t) {
        return null
    }
}
;
function B(t) {
    const [a,i] = r.useState({})
      , [o,u] = r.useState(null)
      , d = t?.id
      , p = t?.answerKeyId
      , y = t?.section === n.READING
      , g = t?.section === n.LISTENING
      , w = I(d)
      , q = e({
        queryKey: [l, S = p || ""],
        queryFn: async () => {
            const {data: e} = await s.get(`/answer-keys/${S}`);
            return e
        }
        ,
        enabled: Boolean(S)
    });
    var S;
    const m = K(y ? d : void 0, void 0, 0, 100)
      , f = c(g && d || "");
    r.useEffect( () => {
        q.data?.answers && i(q.data.answers)
    }
    , [q.data, p]),
    r.useEffect( () => {
        const e = [];
        if (w.error) {
            const t = w.error instanceof Error ? w.error.message : String(w.error);
            e.push(`Questions: ${t}`)
        }
        if (q.error) {
            const t = q.error instanceof Error ? q.error.message : String(q.error);
            e.push(`Answers: ${t}`)
        }
        if (m.error) {
            const t = m.error instanceof Error ? m.error.message : String(m.error);
            e.push(`Passages: ${t}`)
        }
        if (f.error) {
            const t = f.error instanceof Error ? f.error.message : String(f.error);
            e.push(`Transcripts: ${t}`)
        }
        e.length > 0 ? u(e.join("; ")) : u(null)
    }
    , [w.error, q.error, m.error, g, f?.error]);
    const h = w.isLoading || Boolean(p && q.isLoading) || Boolean(y && m.isLoading) || Boolean(g && f.isLoading);
    return {
        questions: w.data || [],
        answers: a,
        passages: y ? m.data : void 0,
        transcripts: g ? f.data?.parts : void 0,
        isLoading: h,
        error: o
    }
}
export {v as a, L as b, q as c, Q as d, F as e, w as f, f as g, k as h, b as i, A as j, $ as k, c as l, u as m, d as n, m as o, K as p, I as q, E as r, S as s, h as t, B as u};
