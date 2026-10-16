import {a as r, b as s} from "./query-DsA5-mxg.js";
import {r as t} from "./index-HS6_bSfL.js";
function n() {
    const {mutate: r, isPending: n, isError: e, isSuccess: a, error: o, reset: i} = s({
        mutationFn: async r => {
            const {data: s} = await t.post("/reports", r);
            return s
        }
    });
    return {
        submitReport: r,
        pending: n,
        error: e ? o instanceof Error ? o.message : "Unknown error" : null,
        success: a,
        reset: i
    }
}
function e(s) {
    return r({
        queryKey: ["issueReports", s],
        queryFn: async () => {
            const {data: r} = await t.get("/admin/reports", {
                params: s
            });
            return r
        }
    })
}
function a() {
    const {mutate: r, isPending: n, isError: e, isSuccess: a, error: o} = s({
        mutationFn: async ({id: r, status: s, adminNote: n}) => {
            const {data: e} = await t.patch(`/admin/reports/${r}`, {
                status: s,
                adminNote: n
            });
            return e
        }
    });
    return {
        updateStatus: r,
        pending: n,
        error: e ? o instanceof Error ? o.message : "Unknown error" : null,
        success: a
    }
}
export {a, n as b, e as u};
