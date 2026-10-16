import {a as e, u as t, b as a} from "query-DsA5-mxg.js";
import {r as s, ap as n} from "index-HS6_bSfL.js";
const r = () => e({
    queryKey: ["teacher", "credits"],
    queryFn: async () => (await s.get("/teacher/credits")).data
})
  , i = () => e({
    queryKey: ["teacher", "credit-packages"],
    queryFn: async () => (await s.get("/teacher/credit-packages")).data
})
  , u = () => e({
    queryKey: ["teacher", "invites"],
    queryFn: async () => (await s.get("/teacher/invites")).data
})
  , c = () => e({
    queryKey: ["teacher", "students"],
    queryFn: async () => (await s.get("/teacher/students")).data
});
function d(t, a, r) {
    return e({
        queryKey: ["teacher", "students", t, "test-results", a],
        queryFn: async () => ((await s.get(`/teacher/students/${t}/test-results`, {
            params: a ? {
                section: a,
                page: 0,
                size: 100
            } : void 0
        })).data.userTestResults || []).map(e => n(e)),
        enabled: Boolean(t && a) && !0,
        ...r
    })
}
function o(e) {
    const t = d(e, "listening")
      , a = d(e, "reading")
      , s = d(e, "writing")
      , n = d(e, "speaking");
    return {
        listening: {
            ...t,
            testResults: t.data || []
        },
        reading: {
            ...a,
            testResults: a.data || []
        },
        writing: {
            ...s,
            testResults: s.data || []
        },
        writingTask1: {
            isLoading: !1,
            error: null,
            testResults: []
        },
        writingTask2: {
            isLoading: !1,
            error: null,
            testResults: []
        },
        speaking: {
            ...n,
            testResults: n.data || []
        }
    }
}
function y(t, a=0, n=100) {
    return e({
        queryKey: ["teacher", "students", t, "mock-results", a, n],
        queryFn: async () => {
            const e = await s.get(`/teacher/students/${t}/mock-results`, {
                params: {
                    page: a,
                    size: n
                }
            });
            return {
                ...e.data,
                mockResults: (e.data.mockResults || []).map(e => ({
                    ...e,
                    createdDate: e.createdDate ?? e.createdAt,
                    updatedDate: e.updatedDate ?? e.updatedAt
                }))
            }
        }
        ,
        enabled: Boolean(t)
    })
}
function l(t, a=12) {
    return e({
        queryKey: ["teacher", "students", t, "test-activity", a],
        queryFn: async () => (await s.get(`/teacher/students/${t}/test-results/activity`, {
            params: {
                months: a
            }
        })).data,
        enabled: Boolean(t),
        staleTime: 3e5
    })
}
const h = () => e({
    queryKey: ["teacher", "invitations"],
    queryFn: async () => (await s.get("/teacher/invitations")).data
})
  , p = () => {
    const e = t();
    return a({
        mutationFn: async e => (await s.post("/teacher/students/invite", e)).data,
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["teacher", "invites"]
            })
        }
    })
}
  , q = () => {
    const e = t();
    return a({
        mutationFn: async e => {
            await s.delete(`/teacher/invites/${e}`)
        }
        ,
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["teacher", "invites"]
            })
        }
    })
}
  , g = () => {
    const e = t();
    return a({
        mutationFn: async e => {
            await s.delete(`/teacher/students/${e}`)
        }
        ,
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["teacher", "students"]
            })
        }
    })
}
  , m = () => {
    const e = t();
    return a({
        mutationFn: async ({studentId: e, request: t}) => (await s.post(`/teacher/students/${e}/subscription`, t)).data,
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["teacher", "students"]
            }),
            e.invalidateQueries({
                queryKey: ["teacher", "credits"]
            })
        }
    })
}
  , v = () => a({
    mutationFn: async ({provider: e, request: t}) => {
        const a = e.toLowerCase();
        return (await s.post(`/teacher/credits/purchases/${a}/initiate`, t)).data
    }
})
  , w = () => {
    const e = t();
    return a({
        mutationFn: async e => {
            await s.post(`/teacher/invitations/${e}/accept`)
        }
        ,
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["teacher", "invitations"]
            })
        }
    })
}
  , F = () => {
    const e = t();
    return a({
        mutationFn: async e => {
            await s.post(`/teacher/invitations/${e}/reject`)
        }
        ,
        onSuccess: () => {
            e.invalidateQueries({
                queryKey: ["teacher", "invitations"]
            })
        }
    })
}
;
export {w as a, F as b, r as c, u as d, c as e, p as f, q as g, g as h, m as i, i as j, v as k, o as l, y as m, l as n, h as u};
