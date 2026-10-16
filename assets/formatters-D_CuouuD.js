function e(e) {
    return e >= 7 ? "text-emerald-600 dark:text-emerald-400" : e >= 5.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
}
function t(e) {
    if (null != e) {
        if ("string" == typeof e)
            return e || void 0;
        if ("object" == typeof e) {
            if (!Array.isArray(e)) {
                const t = Object.entries(e);
                if (t.length > 0 && t.every( ([,e]) => "string" == typeof e || "number" == typeof e))
                    return t.map( ([e,t]) => `**${e}**: ${t}`).join("\n\n")
            }
            try {
                return JSON.stringify(e)
            } catch {
                return String(e)
            }
        }
        return String(e)
    }
}
const r = e => {
    const t = e.replace(/\D/g, "");
    return t.length <= 3 ? `+${t}` : t.length <= 5 ? `+${t.slice(0, 3)} ${t.slice(3)}` : t.length <= 8 ? `+${t.slice(0, 3)} ${t.slice(3, 5)} ${t.slice(5)}` : t.length <= 10 ? `+${t.slice(0, 3)} ${t.slice(3, 5)} ${t.slice(5, 8)} ${t.slice(8)}` : t.length <= 12 ? `+${t.slice(0, 3)} ${t.slice(3, 5)} ${t.slice(5, 8)} ${t.slice(8, 10)} ${t.slice(10)}` : `+${t.slice(0, 3)} ${t.slice(3, 5)} ${t.slice(5, 8)} ${t.slice(8, 10)} ${t.slice(10, 12)}`
}
  , i = e => e.replace(/\D/g, "");
export {r as f, e as g, t, i as u};
