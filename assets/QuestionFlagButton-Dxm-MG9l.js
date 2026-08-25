import { j as e } from "./query-DsA5-mxg.js";
import { aO as t } from "./icons-IGaB-7H7.js";

const i = ({
  questionId: i,
  isFlagged: n,
  isActive: r = !1,
  onClick: s,
  className: a = ""
}) => {
  const o = n || r;
  
  const l = `${n ? "Unflag" : "Flag"} question${
    i.length > 5 && !/^\d+-\d+$/.test(i) ? "" : ` ${i}`
  }`;

  return e.jsx("button", {
    type: "button",
    className: `inline-flex items-center justify-center rounded-sm transition-opacity flex-shrink-0 ${
      n ? "text-red-600 dark:text-red-400" : "text-primary"
    } ${o ? "opacity-100" : "pointer-events-none opacity-0"} ${a}`,
    onClick: s,
    "aria-label": l,
    "aria-pressed": n,
    title: l,
    tabIndex: o ? 0 : -1,
    "aria-hidden": !o,
    children: e.jsx(t, {
      className: "h-5 w-5",
      fill: n ? "currentColor" : "none",
      strokeWidth: 2,
      "aria-hidden": "true"
    })
  });
};

export { i as Q };