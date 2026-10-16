import {a as s, u as a, b as e} from "./query-DsA5-mxg.js";
import {r} from "./index-HS6_bSfL.js";
const t = () => s({
    queryKey: ["courses"],
    queryFn: async () => {
        const {data: s} = await r.get("/courses");
        return s.courses
    }
})
  , n = a => s({
    queryKey: ["courses", a],
    queryFn: async () => {
        const {data: s} = await r.get(`/courses/${a}`);
        return s
    }
    ,
    enabled: !!a
})
  , u = (a=!0) => {
    const e = s({
        queryKey: ["userCourseDataCollection"],
        queryFn: async () => {
            const {data: s} = await r.get("/users/course-data");
            return s.userCourseData
        }
        ,
        enabled: a
    });
    return {
        data: e.data,
        isLoading: e.isPending
    }
}
  , o = () => {
    const s = a();
    return e({
        mutationFn: async s => {
            const {data: a} = await r.post("/courses", s);
            return a
        }
        ,
        onSuccess: () => {
            s.invalidateQueries({
                queryKey: ["courses"]
            })
        }
        ,
        onError: s => {}
    })
}
;
export {u as a, o as b, n as c, t as u};
