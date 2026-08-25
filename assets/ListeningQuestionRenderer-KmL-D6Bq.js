import {j as e} from "./query-BoogBOpP.js";
import {S as s, a as r, e as t, f as o, g as a, h as u, F as n, b as E, d as x, T, G as N} from "./FlowChartCompletionTest-DjzNjB_B.js";
const C = ({questionGroup: C, examStore: O}) => {
    switch (C.type) {
    case "NOTE_COMPLETION":
    case "SHORT_ANSWER_COMPLETION":
    case "FORM_COMPLETION":
    case "SENTENCE_COMPLETION":
        return e.jsx(N, {
            questionGroup: C,
            examStore: O
        });
    case "TABLE_COMPLETION":
        return e.jsx(T, {
            questionGroup: C,
            examStore: O
        });
    case "DIAGRAM_LABELING":
        return e.jsx(x, {
            questionGroup: C,
            examStore: O
        });
    case "DIAGRAM_COMPLETION":
        return e.jsx(E, {
            questionGroup: C,
            examStore: O
        });
    case "FLOW_CHART_COMPLETION":
        return e.jsx(n, {
            questionGroup: C,
            examStore: O
        });
    case "MULTIPLE_CHOICE":
        return e.jsx(u, {
            questionGroup: C,
            examStore: O
        });
    case "MULTIPLE_CHOICE_MANY":
        return e.jsx(a, {
            questionGroup: C,
            examStore: O
        });
    case "FLOW_CHART_MATCHING":
        return e.jsx(o, {
            questionGroup: C,
            examStore: O
        });
    case "MATCHING":
    case "MATCHING_NAMES":
    case "MATCHING_SENTENCE_ENDINGS":
        return e.jsx(t, {
            questionGroup: C,
            examStore: O
        });
    case "MATCHING_FEATURES":
        return e.jsx(r, {
            questionGroup: C,
            examStore: O
        });
    case "SUMMARY_COMPLETION":
        return e.jsx(s, {
            questionGroup: C,
            examStore: O
        });
    default:
        return e.jsxs("div", {
            children: ["Unsupported question type: ", C.type]
        })
    }
}
;
export {C as L};
