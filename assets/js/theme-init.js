/*
 * IELTSX — theme before first paint (assets/js/theme-init.js)
 * Loaded in <head> so a dark-mode visitor never sees a white flash.
 * Same rule as IELTSX.theme in app.js: saved "dark" / "light", otherwise the system setting.
 */
(function () {
    try {
        var saved = localStorage.getItem('theme');
        var dark = saved === 'dark' ||
            (saved !== 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (dark) document.documentElement.classList.add('dark-mode');
    } catch (e) {}
})();
