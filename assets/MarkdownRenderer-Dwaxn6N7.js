import {j as e} from "./query-DsA5-mxg.js";
import {n as t} from "./index-HS6_bSfL.js";
import {g as n} from "./router-gAN6ztYq.js";
function r() {}
function i() {}
function s(e) {
    const t = []
      , n = String(e || "");
    let r = n.indexOf(",")
      , i = 0
      , s = !1;
    for (; !s; ) {
        -1 === r && (r = n.length,
        s = !0);
        const e = n.slice(i, r).trim();
        !e && s || t.push(e),
        i = r + 1,
        r = n.indexOf(",", i)
    }
    return t
}
function o(e, t) {
    const n = {};
    return ("" === e[e.length - 1] ? [...e, ""] : e).join((n.padRight ? " " : "") + "," + (!1 === n.padLeft ? "" : " ")).trim()
}
const a = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u
  , c = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u
  , l = {};
function u(e, t) {
    return (l.jsx ? c : a).test(e)
}
const h = /[ \t\n\f\r]/g;
function p(e) {
    return "" === e.replace(h, "")
}
class d {
    constructor(e, t, n) {
        this.normal = t,
        this.property = e,
        n && (this.space = n)
    }
}
function f(e, t) {
    const n = {}
      , r = {};
    for (const i of e)
        Object.assign(n, i.property),
        Object.assign(r, i.normal);
    return new d(n,r,t)
}
function m(e) {
    return e.toLowerCase()
}
d.prototype.normal = {},
d.prototype.property = {},
d.prototype.space = void 0;
class E {
    constructor(e, t) {
        this.attribute = t,
        this.property = e
    }
}
E.prototype.attribute = "",
E.prototype.booleanish = !1,
E.prototype.boolean = !1,
E.prototype.commaOrSpaceSeparated = !1,
E.prototype.commaSeparated = !1,
E.prototype.defined = !1,
E.prototype.mustUseProperty = !1,
E.prototype.number = !1,
E.prototype.overloadedBoolean = !1,
E.prototype.property = "",
E.prototype.spaceSeparated = !1,
E.prototype.space = void 0;
let T = 0;
const g = C()
  , A = C()
  , _ = C()
  , I = C()
  , N = C()
  , k = C()
  , S = C();
function C() {
    return 2 ** ++T
}
const D = Object.freeze(Object.defineProperty({
    __proto__: null,
    boolean: g,
    booleanish: A,
    commaOrSpaceSeparated: S,
    commaSeparated: k,
    number: I,
    overloadedBoolean: _,
    spaceSeparated: N
}, Symbol.toStringTag, {
    value: "Module"
}))
  , O = Object.keys(D);
class y extends E {
    constructor(e, t, n, r) {
        let i = -1;
        if (super(e, t),
        b(this, "space", r),
        "number" == typeof n)
            for (; ++i < O.length; ) {
                const e = O[i];
                b(this, O[i], (n & D[e]) === D[e])
            }
    }
}
function b(e, t, n) {
    n && (e[t] = n)
}
function R(e) {
    const t = {}
      , n = {};
    for (const [r,i] of Object.entries(e.properties)) {
        const s = new y(r,e.transform(e.attributes || {}, r),i,e.space);
        e.mustUseProperty && e.mustUseProperty.includes(r) && (s.mustUseProperty = !0),
        t[r] = s,
        n[m(r)] = r,
        n[m(s.attribute)] = r
    }
    return new d(t,n,e.space)
}
y.prototype.defined = !0;
const L = R({
    properties: {
        ariaActiveDescendant: null,
        ariaAtomic: A,
        ariaAutoComplete: null,
        ariaBusy: A,
        ariaChecked: A,
        ariaColCount: I,
        ariaColIndex: I,
        ariaColSpan: I,
        ariaControls: N,
        ariaCurrent: null,
        ariaDescribedBy: N,
        ariaDetails: null,
        ariaDisabled: A,
        ariaDropEffect: N,
        ariaErrorMessage: null,
        ariaExpanded: A,
        ariaFlowTo: N,
        ariaGrabbed: A,
        ariaHasPopup: null,
        ariaHidden: A,
        ariaInvalid: null,
        ariaKeyShortcuts: null,
        ariaLabel: null,
        ariaLabelledBy: N,
        ariaLevel: I,
        ariaLive: null,
        ariaModal: A,
        ariaMultiLine: A,
        ariaMultiSelectable: A,
        ariaOrientation: null,
        ariaOwns: N,
        ariaPlaceholder: null,
        ariaPosInSet: I,
        ariaPressed: A,
        ariaReadOnly: A,
        ariaRelevant: null,
        ariaRequired: A,
        ariaRoleDescription: N,
        ariaRowCount: I,
        ariaRowIndex: I,
        ariaRowSpan: I,
        ariaSelected: A,
        ariaSetSize: I,
        ariaSort: null,
        ariaValueMax: I,
        ariaValueMin: I,
        ariaValueNow: I,
        ariaValueText: null,
        role: null
    },
    transform: (e, t) => "role" === t ? t : "aria-" + t.slice(4).toLowerCase()
});
function P(e, t) {
    return t in e ? e[t] : t
}
function M(e, t) {
    return P(e, t.toLowerCase())
}
const x = R({
    attributes: {
        acceptcharset: "accept-charset",
        classname: "class",
        htmlfor: "for",
        httpequiv: "http-equiv"
    },
    mustUseProperty: ["checked", "multiple", "muted", "selected"],
    properties: {
        abbr: null,
        accept: k,
        acceptCharset: N,
        accessKey: N,
        action: null,
        allow: null,
        allowFullScreen: g,
        allowPaymentRequest: g,
        allowUserMedia: g,
        alt: null,
        as: null,
        async: g,
        autoCapitalize: null,
        autoComplete: N,
        autoFocus: g,
        autoPlay: g,
        blocking: N,
        capture: null,
        charSet: null,
        checked: g,
        cite: null,
        className: N,
        cols: I,
        colSpan: null,
        content: null,
        contentEditable: A,
        controls: g,
        controlsList: N,
        coords: I | k,
        crossOrigin: null,
        data: null,
        dateTime: null,
        decoding: null,
        default: g,
        defer: g,
        dir: null,
        dirName: null,
        disabled: g,
        download: _,
        draggable: A,
        encType: null,
        enterKeyHint: null,
        fetchPriority: null,
        form: null,
        formAction: null,
        formEncType: null,
        formMethod: null,
        formNoValidate: g,
        formTarget: null,
        headers: N,
        height: I,
        hidden: _,
        high: I,
        href: null,
        hrefLang: null,
        htmlFor: N,
        httpEquiv: N,
        id: null,
        imageSizes: null,
        imageSrcSet: null,
        inert: g,
        inputMode: null,
        integrity: null,
        is: null,
        isMap: g,
        itemId: null,
        itemProp: N,
        itemRef: N,
        itemScope: g,
        itemType: N,
        kind: null,
        label: null,
        lang: null,
        language: null,
        list: null,
        loading: null,
        loop: g,
        low: I,
        manifest: null,
        max: null,
        maxLength: I,
        media: null,
        method: null,
        min: null,
        minLength: I,
        multiple: g,
        muted: g,
        name: null,
        nonce: null,
        noModule: g,
        noValidate: g,
        onAbort: null,
        onAfterPrint: null,
        onAuxClick: null,
        onBeforeMatch: null,
        onBeforePrint: null,
        onBeforeToggle: null,
        onBeforeUnload: null,
        onBlur: null,
        onCancel: null,
        onCanPlay: null,
        onCanPlayThrough: null,
        onChange: null,
        onClick: null,
        onClose: null,
        onContextLost: null,
        onContextMenu: null,
        onContextRestored: null,
        onCopy: null,
        onCueChange: null,
        onCut: null,
        onDblClick: null,
        onDrag: null,
        onDragEnd: null,
        onDragEnter: null,
        onDragExit: null,
        onDragLeave: null,
        onDragOver: null,
        onDragStart: null,
        onDrop: null,
        onDurationChange: null,
        onEmptied: null,
        onEnded: null,
        onError: null,
        onFocus: null,
        onFormData: null,
        onHashChange: null,
        onInput: null,
        onInvalid: null,
        onKeyDown: null,
        onKeyPress: null,
        onKeyUp: null,
        onLanguageChange: null,
        onLoad: null,
        onLoadedData: null,
        onLoadedMetadata: null,
        onLoadEnd: null,
        onLoadStart: null,
        onMessage: null,
        onMessageError: null,
        onMouseDown: null,
        onMouseEnter: null,
        onMouseLeave: null,
        onMouseMove: null,
        onMouseOut: null,
        onMouseOver: null,
        onMouseUp: null,
        onOffline: null,
        onOnline: null,
        onPageHide: null,
        onPageShow: null,
        onPaste: null,
        onPause: null,
        onPlay: null,
        onPlaying: null,
        onPopState: null,
        onProgress: null,
        onRateChange: null,
        onRejectionHandled: null,
        onReset: null,
        onResize: null,
        onScroll: null,
        onScrollEnd: null,
        onSecurityPolicyViolation: null,
        onSeeked: null,
        onSeeking: null,
        onSelect: null,
        onSlotChange: null,
        onStalled: null,
        onStorage: null,
        onSubmit: null,
        onSuspend: null,
        onTimeUpdate: null,
        onToggle: null,
        onUnhandledRejection: null,
        onUnload: null,
        onVolumeChange: null,
        onWaiting: null,
        onWheel: null,
        open: g,
        optimum: I,
        pattern: null,
        ping: N,
        placeholder: null,
        playsInline: g,
        popover: null,
        popoverTarget: null,
        popoverTargetAction: null,
        poster: null,
        preload: null,
        readOnly: g,
        referrerPolicy: null,
        rel: N,
        required: g,
        reversed: g,
        rows: I,
        rowSpan: I,
        sandbox: N,
        scope: null,
        scoped: g,
        seamless: g,
        selected: g,
        shadowRootClonable: g,
        shadowRootDelegatesFocus: g,
        shadowRootMode: null,
        shape: null,
        size: I,
        sizes: null,
        slot: null,
        span: I,
        spellCheck: A,
        src: null,
        srcDoc: null,
        srcLang: null,
        srcSet: null,
        start: I,
        step: null,
        style: null,
        tabIndex: I,
        target: null,
        title: null,
        translate: null,
        type: null,
        typeMustMatch: g,
        useMap: null,
        value: A,
        width: I,
        wrap: null,
        writingSuggestions: null,
        align: null,
        aLink: null,
        archive: N,
        axis: null,
        background: null,
        bgColor: null,
        border: I,
        borderColor: null,
        bottomMargin: I,
        cellPadding: null,
        cellSpacing: null,
        char: null,
        charOff: null,
        classId: null,
        clear: null,
        code: null,
        codeBase: null,
        codeType: null,
        color: null,
        compact: g,
        declare: g,
        event: null,
        face: null,
        frame: null,
        frameBorder: null,
        hSpace: I,
        leftMargin: I,
        link: null,
        longDesc: null,
        lowSrc: null,
        marginHeight: I,
        marginWidth: I,
        noResize: g,
        noHref: g,
        noShade: g,
        noWrap: g,
        object: null,
        profile: null,
        prompt: null,
        rev: null,
        rightMargin: I,
        rules: null,
        scheme: null,
        scrolling: A,
        standby: null,
        summary: null,
        text: null,
        topMargin: I,
        valueType: null,
        version: null,
        vAlign: null,
        vLink: null,
        vSpace: I,
        allowTransparency: null,
        autoCorrect: null,
        autoSave: null,
        disablePictureInPicture: g,
        disableRemotePlayback: g,
        prefix: null,
        property: null,
        results: I,
        security: null,
        unselectable: null
    },
    space: "html",
    transform: M
})
  , v = R({
    attributes: {
        accentHeight: "accent-height",
        alignmentBaseline: "alignment-baseline",
        arabicForm: "arabic-form",
        baselineShift: "baseline-shift",
        capHeight: "cap-height",
        className: "class",
        clipPath: "clip-path",
        clipRule: "clip-rule",
        colorInterpolation: "color-interpolation",
        colorInterpolationFilters: "color-interpolation-filters",
        colorProfile: "color-profile",
        colorRendering: "color-rendering",
        crossOrigin: "crossorigin",
        dataType: "datatype",
        dominantBaseline: "dominant-baseline",
        enableBackground: "enable-background",
        fillOpacity: "fill-opacity",
        fillRule: "fill-rule",
        floodColor: "flood-color",
        floodOpacity: "flood-opacity",
        fontFamily: "font-family",
        fontSize: "font-size",
        fontSizeAdjust: "font-size-adjust",
        fontStretch: "font-stretch",
        fontStyle: "font-style",
        fontVariant: "font-variant",
        fontWeight: "font-weight",
        glyphName: "glyph-name",
        glyphOrientationHorizontal: "glyph-orientation-horizontal",
        glyphOrientationVertical: "glyph-orientation-vertical",
        hrefLang: "hreflang",
        horizAdvX: "horiz-adv-x",
        horizOriginX: "horiz-origin-x",
        horizOriginY: "horiz-origin-y",
        imageRendering: "image-rendering",
        letterSpacing: "letter-spacing",
        lightingColor: "lighting-color",
        markerEnd: "marker-end",
        markerMid: "marker-mid",
        markerStart: "marker-start",
        navDown: "nav-down",
        navDownLeft: "nav-down-left",
        navDownRight: "nav-down-right",
        navLeft: "nav-left",
        navNext: "nav-next",
        navPrev: "nav-prev",
        navRight: "nav-right",
        navUp: "nav-up",
        navUpLeft: "nav-up-left",
        navUpRight: "nav-up-right",
        onAbort: "onabort",
        onActivate: "onactivate",
        onAfterPrint: "onafterprint",
        onBeforePrint: "onbeforeprint",
        onBegin: "onbegin",
        onCancel: "oncancel",
        onCanPlay: "oncanplay",
        onCanPlayThrough: "oncanplaythrough",
        onChange: "onchange",
        onClick: "onclick",
        onClose: "onclose",
        onCopy: "oncopy",
        onCueChange: "oncuechange",
        onCut: "oncut",
        onDblClick: "ondblclick",
        onDrag: "ondrag",
        onDragEnd: "ondragend",
        onDragEnter: "ondragenter",
        onDragExit: "ondragexit",
        onDragLeave: "ondragleave",
        onDragOver: "ondragover",
        onDragStart: "ondragstart",
        onDrop: "ondrop",
        onDurationChange: "ondurationchange",
        onEmptied: "onemptied",
        onEnd: "onend",
        onEnded: "onended",
        onError: "onerror",
        onFocus: "onfocus",
        onFocusIn: "onfocusin",
        onFocusOut: "onfocusout",
        onHashChange: "onhashchange",
        onInput: "oninput",
        onInvalid: "oninvalid",
        onKeyDown: "onkeydown",
        onKeyPress: "onkeypress",
        onKeyUp: "onkeyup",
        onLoad: "onload",
        onLoadedData: "onloadeddata",
        onLoadedMetadata: "onloadedmetadata",
        onLoadStart: "onloadstart",
        onMessage: "onmessage",
        onMouseDown: "onmousedown",
        onMouseEnter: "onmouseenter",
        onMouseLeave: "onmouseleave",
        onMouseMove: "onmousemove",
        onMouseOut: "onmouseout",
        onMouseOver: "onmouseover",
        onMouseUp: "onmouseup",
        onMouseWheel: "onmousewheel",
        onOffline: "onoffline",
        onOnline: "ononline",
        onPageHide: "onpagehide",
        onPageShow: "onpageshow",
        onPaste: "onpaste",
        onPause: "onpause",
        onPlay: "onplay",
        onPlaying: "onplaying",
        onPopState: "onpopstate",
        onProgress: "onprogress",
        onRateChange: "onratechange",
        onRepeat: "onrepeat",
        onReset: "onreset",
        onResize: "onresize",
        onScroll: "onscroll",
        onSeeked: "onseeked",
        onSeeking: "onseeking",
        onSelect: "onselect",
        onShow: "onshow",
        onStalled: "onstalled",
        onStorage: "onstorage",
        onSubmit: "onsubmit",
        onSuspend: "onsuspend",
        onTimeUpdate: "ontimeupdate",
        onToggle: "ontoggle",
        onUnload: "onunload",
        onVolumeChange: "onvolumechange",
        onWaiting: "onwaiting",
        onZoom: "onzoom",
        overlinePosition: "overline-position",
        overlineThickness: "overline-thickness",
        paintOrder: "paint-order",
        panose1: "panose-1",
        pointerEvents: "pointer-events",
        referrerPolicy: "referrerpolicy",
        renderingIntent: "rendering-intent",
        shapeRendering: "shape-rendering",
        stopColor: "stop-color",
        stopOpacity: "stop-opacity",
        strikethroughPosition: "strikethrough-position",
        strikethroughThickness: "strikethrough-thickness",
        strokeDashArray: "stroke-dasharray",
        strokeDashOffset: "stroke-dashoffset",
        strokeLineCap: "stroke-linecap",
        strokeLineJoin: "stroke-linejoin",
        strokeMiterLimit: "stroke-miterlimit",
        strokeOpacity: "stroke-opacity",
        strokeWidth: "stroke-width",
        tabIndex: "tabindex",
        textAnchor: "text-anchor",
        textDecoration: "text-decoration",
        textRendering: "text-rendering",
        transformOrigin: "transform-origin",
        typeOf: "typeof",
        underlinePosition: "underline-position",
        underlineThickness: "underline-thickness",
        unicodeBidi: "unicode-bidi",
        unicodeRange: "unicode-range",
        unitsPerEm: "units-per-em",
        vAlphabetic: "v-alphabetic",
        vHanging: "v-hanging",
        vIdeographic: "v-ideographic",
        vMathematical: "v-mathematical",
        vectorEffect: "vector-effect",
        vertAdvY: "vert-adv-y",
        vertOriginX: "vert-origin-x",
        vertOriginY: "vert-origin-y",
        wordSpacing: "word-spacing",
        writingMode: "writing-mode",
        xHeight: "x-height",
        playbackOrder: "playbackorder",
        timelineBegin: "timelinebegin"
    },
    properties: {
        about: S,
        accentHeight: I,
        accumulate: null,
        additive: null,
        alignmentBaseline: null,
        alphabetic: I,
        amplitude: I,
        arabicForm: null,
        ascent: I,
        attributeName: null,
        attributeType: null,
        azimuth: I,
        bandwidth: null,
        baselineShift: null,
        baseFrequency: null,
        baseProfile: null,
        bbox: null,
        begin: null,
        bias: I,
        by: null,
        calcMode: null,
        capHeight: I,
        className: N,
        clip: null,
        clipPath: null,
        clipPathUnits: null,
        clipRule: null,
        color: null,
        colorInterpolation: null,
        colorInterpolationFilters: null,
        colorProfile: null,
        colorRendering: null,
        content: null,
        contentScriptType: null,
        contentStyleType: null,
        crossOrigin: null,
        cursor: null,
        cx: null,
        cy: null,
        d: null,
        dataType: null,
        defaultAction: null,
        descent: I,
        diffuseConstant: I,
        direction: null,
        display: null,
        dur: null,
        divisor: I,
        dominantBaseline: null,
        download: g,
        dx: null,
        dy: null,
        edgeMode: null,
        editable: null,
        elevation: I,
        enableBackground: null,
        end: null,
        event: null,
        exponent: I,
        externalResourcesRequired: null,
        fill: null,
        fillOpacity: I,
        fillRule: null,
        filter: null,
        filterRes: null,
        filterUnits: null,
        floodColor: null,
        floodOpacity: null,
        focusable: null,
        focusHighlight: null,
        fontFamily: null,
        fontSize: null,
        fontSizeAdjust: null,
        fontStretch: null,
        fontStyle: null,
        fontVariant: null,
        fontWeight: null,
        format: null,
        fr: null,
        from: null,
        fx: null,
        fy: null,
        g1: k,
        g2: k,
        glyphName: k,
        glyphOrientationHorizontal: null,
        glyphOrientationVertical: null,
        glyphRef: null,
        gradientTransform: null,
        gradientUnits: null,
        handler: null,
        hanging: I,
        hatchContentUnits: null,
        hatchUnits: null,
        height: null,
        href: null,
        hrefLang: null,
        horizAdvX: I,
        horizOriginX: I,
        horizOriginY: I,
        id: null,
        ideographic: I,
        imageRendering: null,
        initialVisibility: null,
        in: null,
        in2: null,
        intercept: I,
        k: I,
        k1: I,
        k2: I,
        k3: I,
        k4: I,
        kernelMatrix: S,
        kernelUnitLength: null,
        keyPoints: null,
        keySplines: null,
        keyTimes: null,
        kerning: null,
        lang: null,
        lengthAdjust: null,
        letterSpacing: null,
        lightingColor: null,
        limitingConeAngle: I,
        local: null,
        markerEnd: null,
        markerMid: null,
        markerStart: null,
        markerHeight: null,
        markerUnits: null,
        markerWidth: null,
        mask: null,
        maskContentUnits: null,
        maskUnits: null,
        mathematical: null,
        max: null,
        media: null,
        mediaCharacterEncoding: null,
        mediaContentEncodings: null,
        mediaSize: I,
        mediaTime: null,
        method: null,
        min: null,
        mode: null,
        name: null,
        navDown: null,
        navDownLeft: null,
        navDownRight: null,
        navLeft: null,
        navNext: null,
        navPrev: null,
        navRight: null,
        navUp: null,
        navUpLeft: null,
        navUpRight: null,
        numOctaves: null,
        observer: null,
        offset: null,
        onAbort: null,
        onActivate: null,
        onAfterPrint: null,
        onBeforePrint: null,
        onBegin: null,
        onCancel: null,
        onCanPlay: null,
        onCanPlayThrough: null,
        onChange: null,
        onClick: null,
        onClose: null,
        onCopy: null,
        onCueChange: null,
        onCut: null,
        onDblClick: null,
        onDrag: null,
        onDragEnd: null,
        onDragEnter: null,
        onDragExit: null,
        onDragLeave: null,
        onDragOver: null,
        onDragStart: null,
        onDrop: null,
        onDurationChange: null,
        onEmptied: null,
        onEnd: null,
        onEnded: null,
        onError: null,
        onFocus: null,
        onFocusIn: null,
        onFocusOut: null,
        onHashChange: null,
        onInput: null,
        onInvalid: null,
        onKeyDown: null,
        onKeyPress: null,
        onKeyUp: null,
        onLoad: null,
        onLoadedData: null,
        onLoadedMetadata: null,
        onLoadStart: null,
        onMessage: null,
        onMouseDown: null,
        onMouseEnter: null,
        onMouseLeave: null,
        onMouseMove: null,
        onMouseOut: null,
        onMouseOver: null,
        onMouseUp: null,
        onMouseWheel: null,
        onOffline: null,
        onOnline: null,
        onPageHide: null,
        onPageShow: null,
        onPaste: null,
        onPause: null,
        onPlay: null,
        onPlaying: null,
        onPopState: null,
        onProgress: null,
        onRateChange: null,
        onRepeat: null,
        onReset: null,
        onResize: null,
        onScroll: null,
        onSeeked: null,
        onSeeking: null,
        onSelect: null,
        onShow: null,
        onStalled: null,
        onStorage: null,
        onSubmit: null,
        onSuspend: null,
        onTimeUpdate: null,
        onToggle: null,
        onUnload: null,
        onVolumeChange: null,
        onWaiting: null,
        onZoom: null,
        opacity: null,
        operator: null,
        order: null,
        orient: null,
        orientation: null,
        origin: null,
        overflow: null,
        overlay: null,
        overlinePosition: I,
        overlineThickness: I,
        paintOrder: null,
        panose1: null,
        path: null,
        pathLength: I,
        patternContentUnits: null,
        patternTransform: null,
        patternUnits: null,
        phase: null,
        ping: N,
        pitch: null,
        playbackOrder: null,
        pointerEvents: null,
        points: null,
        pointsAtX: I,
        pointsAtY: I,
        pointsAtZ: I,
        preserveAlpha: null,
        preserveAspectRatio: null,
        primitiveUnits: null,
        propagate: null,
        property: S,
        r: null,
        radius: null,
        referrerPolicy: null,
        refX: null,
        refY: null,
        rel: S,
        rev: S,
        renderingIntent: null,
        repeatCount: null,
        repeatDur: null,
        requiredExtensions: S,
        requiredFeatures: S,
        requiredFonts: S,
        requiredFormats: S,
        resource: null,
        restart: null,
        result: null,
        rotate: null,
        rx: null,
        ry: null,
        scale: null,
        seed: null,
        shapeRendering: null,
        side: null,
        slope: null,
        snapshotTime: null,
        specularConstant: I,
        specularExponent: I,
        spreadMethod: null,
        spacing: null,
        startOffset: null,
        stdDeviation: null,
        stemh: null,
        stemv: null,
        stitchTiles: null,
        stopColor: null,
        stopOpacity: null,
        strikethroughPosition: I,
        strikethroughThickness: I,
        string: null,
        stroke: null,
        strokeDashArray: S,
        strokeDashOffset: null,
        strokeLineCap: null,
        strokeLineJoin: null,
        strokeMiterLimit: I,
        strokeOpacity: I,
        strokeWidth: null,
        style: null,
        surfaceScale: I,
        syncBehavior: null,
        syncBehaviorDefault: null,
        syncMaster: null,
        syncTolerance: null,
        syncToleranceDefault: null,
        systemLanguage: S,
        tabIndex: I,
        tableValues: null,
        target: null,
        targetX: I,
        targetY: I,
        textAnchor: null,
        textDecoration: null,
        textRendering: null,
        textLength: null,
        timelineBegin: null,
        title: null,
        transformBehavior: null,
        type: null,
        typeOf: S,
        to: null,
        transform: null,
        transformOrigin: null,
        u1: null,
        u2: null,
        underlinePosition: I,
        underlineThickness: I,
        unicode: null,
        unicodeBidi: null,
        unicodeRange: null,
        unitsPerEm: I,
        values: null,
        vAlphabetic: I,
        vMathematical: I,
        vectorEffect: null,
        vHanging: I,
        vIdeographic: I,
        version: null,
        vertAdvY: I,
        vertOriginX: I,
        vertOriginY: I,
        viewBox: null,
        viewTarget: null,
        visibility: null,
        width: null,
        widths: null,
        wordSpacing: null,
        writingMode: null,
        x: null,
        x1: null,
        x2: null,
        xChannelSelector: null,
        xHeight: I,
        y: null,
        y1: null,
        y2: null,
        yChannelSelector: null,
        z: null,
        zoomAndPan: null
    },
    space: "svg",
    transform: P
})
  , w = R({
    properties: {
        xLinkActuate: null,
        xLinkArcRole: null,
        xLinkHref: null,
        xLinkRole: null,
        xLinkShow: null,
        xLinkTitle: null,
        xLinkType: null
    },
    space: "xlink",
    transform: (e, t) => "xlink:" + t.slice(5).toLowerCase()
})
  , F = R({
    attributes: {
        xmlnsxlink: "xmlns:xlink"
    },
    properties: {
        xmlnsXLink: null,
        xmlns: null
    },
    space: "xmlns",
    transform: M
})
  , B = R({
    properties: {
        xmlBase: null,
        xmlLang: null,
        xmlSpace: null
    },
    space: "xml",
    transform: (e, t) => "xml:" + t.slice(3).toLowerCase()
})
  , H = {
    classId: "classID",
    dataType: "datatype",
    itemId: "itemID",
    strokeDashArray: "strokeDasharray",
    strokeDashOffset: "strokeDashoffset",
    strokeLineCap: "strokeLinecap",
    strokeLineJoin: "strokeLinejoin",
    strokeMiterLimit: "strokeMiterlimit",
    typeOf: "typeof",
    xLinkActuate: "xlinkActuate",
    xLinkArcRole: "xlinkArcrole",
    xLinkHref: "xlinkHref",
    xLinkRole: "xlinkRole",
    xLinkShow: "xlinkShow",
    xLinkTitle: "xlinkTitle",
    xLinkType: "xlinkType",
    xmlnsXLink: "xmlnsXlink"
}
  , U = /[A-Z]/g
  , G = /-[a-z]/g
  , Y = /^data[-\w.:]+$/i;
function z(e, t) {
    const n = m(t);
    let r = t
      , i = E;
    if (n in e.normal)
        return e.property[e.normal[n]];
    if (n.length > 4 && "data" === n.slice(0, 4) && Y.test(t)) {
        if ("-" === t.charAt(4)) {
            const e = t.slice(5).replace(G, V);
            r = "data" + e.charAt(0).toUpperCase() + e.slice(1)
        } else {
            const e = t.slice(4);
            if (!G.test(e)) {
                let n = e.replace(U, q);
                "-" !== n.charAt(0) && (n = "-" + n),
                t = "data" + n
            }
        }
        i = y
    }
    return new i(r,t)
}
function q(e) {
    return "-" + e.toLowerCase()
}
function V(e) {
    return e.charAt(1).toUpperCase()
}
const Q = f([L, x, w, F, B], "html")
  , j = f([L, v, w, F, B], "svg");
function W(e) {
    const t = String(e || "").trim();
    return t ? t.split(/[ \t\n\r\f]+/g) : []
}
function K(e) {
    return e.join(" ").trim()
}
var X, J, $, Z = {};
function ee() {
    if ($)
        return Z;
    $ = 1;
    var e = Z && Z.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    ;
    Object.defineProperty(Z, "__esModule", {
        value: !0
    }),
    Z.default = function(e, n) {
        let r = null;
        if (!e || "string" != typeof e)
            return r;
        const i = (0,
        t.default)(e)
          , s = "function" == typeof n;
        return i.forEach(e => {
            if ("declaration" !== e.type)
                return;
            const {property: t, value: i} = e;
            s ? n(t, i, e) : i && (r = r || {},
            r[t] = i)
        }
        ),
        r
    }
    ;
    const t = e(function() {
        if (J)
            return X;
        J = 1;
        var e = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g
          , t = /\n/g
          , n = /^\s*/
          , r = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/
          , i = /^:\s*/
          , s = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/
          , o = /^[;\s]*/
          , a = /^\s+|\s+$/g
          , c = "";
        function l(e) {
            return e ? e.replace(a, c) : c
        }
        return X = function(a, u) {
            if ("string" != typeof a)
                throw new TypeError("First argument must be a string");
            if (!a)
                return [];
            u = u || {};
            var h = 1
              , p = 1;
            function d(e) {
                var n = e.match(t);
                n && (h += n.length);
                var r = e.lastIndexOf("\n");
                p = ~r ? e.length - r : p + e.length
            }
            function f() {
                var e = {
                    line: h,
                    column: p
                };
                return function(t) {
                    return t.position = new m(e),
                    g(),
                    t
                }
            }
            function m(e) {
                this.start = e,
                this.end = {
                    line: h,
                    column: p
                },
                this.source = u.source
            }
            function E(e) {
                var t = new Error(u.source + ":" + h + ":" + p + ": " + e);
                if (t.reason = e,
                t.filename = u.source,
                t.line = h,
                t.column = p,
                t.source = a,
                !u.silent)
                    throw t
            }
            function T(e) {
                var t = e.exec(a);
                if (t) {
                    var n = t[0];
                    return d(n),
                    a = a.slice(n.length),
                    t
                }
            }
            function g() {
                T(n)
            }
            function A(e) {
                var t;
                for (e = e || []; t = _(); )
                    !1 !== t && e.push(t);
                return e
            }
            function _() {
                var e = f();
                if ("/" == a.charAt(0) && "*" == a.charAt(1)) {
                    for (var t = 2; c != a.charAt(t) && ("*" != a.charAt(t) || "/" != a.charAt(t + 1)); )
                        ++t;
                    if (t += 2,
                    c === a.charAt(t - 1))
                        return E("End of comment missing");
                    var n = a.slice(2, t - 2);
                    return p += 2,
                    d(n),
                    a = a.slice(t),
                    p += 2,
                    e({
                        type: "comment",
                        comment: n
                    })
                }
            }
            function I() {
                var t = f()
                  , n = T(r);
                if (n) {
                    if (_(),
                    !T(i))
                        return E("property missing ':'");
                    var a = T(s)
                      , u = t({
                        type: "declaration",
                        property: l(n[0].replace(e, c)),
                        value: a ? l(a[0].replace(e, c)) : c
                    });
                    return T(o),
                    u
                }
            }
            return m.prototype.content = a,
            g(),
            function() {
                var e, t = [];
                for (A(t); e = I(); )
                    !1 !== e && (t.push(e),
                    A(t));
                return t
            }()
        }
    }());
    return Z
}
var te, ne, re, ie = {};
function se() {
    if (te)
        return ie;
    te = 1,
    Object.defineProperty(ie, "__esModule", {
        value: !0
    }),
    ie.camelCase = void 0;
    var e = /^--[a-zA-Z0-9_-]+$/
      , t = /-([a-z])/g
      , n = /^[^-]+$/
      , r = /^-(webkit|moz|ms|o|khtml)-/
      , i = /^-(ms)-/
      , s = function(e, t) {
        return t.toUpperCase()
    }
      , o = function(e, t) {
        return "".concat(t, "-")
    };
    return ie.camelCase = function(a, c) {
        return void 0 === c && (c = {}),
        function(t) {
            return !t || n.test(t) || e.test(t)
        }(a) ? a : (a = a.toLowerCase(),
        (a = c.reactCompat ? a.replace(i, o) : a.replace(r, o)).replace(t, s))
    }
    ,
    ie
}
const oe = n(function() {
    if (re)
        return ne;
    re = 1;
    var e = (ne && ne.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    )(ee())
      , t = se();
    function n(n, r) {
        var i = {};
        return n && "string" == typeof n ? ((0,
        e.default)(n, function(e, n) {
            e && n && (i[(0,
            t.camelCase)(e, r)] = n)
        }),
        i) : i
    }
    return n.default = n,
    ne = n
}())
  , ae = le("end")
  , ce = le("start");
function le(e) {
    return function(t) {
        const n = t && t.position && t.position[e] || {};
        if ("number" == typeof n.line && n.line > 0 && "number" == typeof n.column && n.column > 0)
            return {
                line: n.line,
                column: n.column,
                offset: "number" == typeof n.offset && n.offset > -1 ? n.offset : void 0
            }
    }
}
function ue(e) {
    const t = ce(e)
      , n = ae(e);
    if (t && n)
        return {
            start: t,
            end: n
        }
}
function he(e) {
    return e && "object" == typeof e ? "position"in e || "type"in e ? de(e.position) : "start"in e || "end"in e ? de(e) : "line"in e || "column"in e ? pe(e) : "" : ""
}
function pe(e) {
    return fe(e && e.line) + ":" + fe(e && e.column)
}
function de(e) {
    return pe(e && e.start) + "-" + pe(e && e.end)
}
function fe(e) {
    return e && "number" == typeof e ? e : 1
}
class me extends Error {
    constructor(e, t, n) {
        super(),
        "string" == typeof t && (n = t,
        t = void 0);
        let r = ""
          , i = {}
          , s = !1;
        if (t && (i = "line"in t && "column"in t || "start"in t && "end"in t ? {
            place: t
        } : "type"in t ? {
            ancestors: [t],
            place: t.position
        } : {
            ...t
        }),
        "string" == typeof e ? r = e : !i.cause && e && (s = !0,
        r = e.message,
        i.cause = e),
        !i.ruleId && !i.source && "string" == typeof n) {
            const e = n.indexOf(":");
            -1 === e ? i.ruleId = n : (i.source = n.slice(0, e),
            i.ruleId = n.slice(e + 1))
        }
        if (!i.place && i.ancestors && i.ancestors) {
            const e = i.ancestors[i.ancestors.length - 1];
            e && (i.place = e.position)
        }
        const o = i.place && "start"in i.place ? i.place.start : i.place;
        this.ancestors = i.ancestors || void 0,
        this.cause = i.cause || void 0,
        this.column = o ? o.column : void 0,
        this.fatal = void 0,
        this.file = "",
        this.message = r,
        this.line = o ? o.line : void 0,
        this.name = he(i.place) || "1:1",
        this.place = i.place || void 0,
        this.reason = this.message,
        this.ruleId = i.ruleId || void 0,
        this.source = i.source || void 0,
        this.stack = s && i.cause && "string" == typeof i.cause.stack ? i.cause.stack : "",
        this.actual = void 0,
        this.expected = void 0,
        this.note = void 0,
        this.url = void 0
    }
}
me.prototype.file = "",
me.prototype.name = "",
me.prototype.reason = "",
me.prototype.message = "",
me.prototype.stack = "",
me.prototype.column = void 0,
me.prototype.line = void 0,
me.prototype.ancestors = void 0,
me.prototype.cause = void 0,
me.prototype.fatal = void 0,
me.prototype.place = void 0,
me.prototype.ruleId = void 0,
me.prototype.source = void 0;
const Ee = {}.hasOwnProperty
  , Te = new Map
  , ge = /[A-Z]/g
  , Ae = new Set(["table", "tbody", "thead", "tfoot", "tr"])
  , _e = new Set(["td", "th"])
  , Ie = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function Ne(e, t) {
    if (!t || void 0 === t.Fragment)
        throw new TypeError("Expected `Fragment` in options");
    const n = t.filePath || void 0;
    let r;
    if (t.development) {
        if ("function" != typeof t.jsxDEV)
            throw new TypeError("Expected `jsxDEV` in options when `development: true`");
        r = function(e, t) {
            return n;
            function n(n, r, i, s) {
                const o = Array.isArray(i.children)
                  , a = ce(n);
                return t(r, i, s, o, {
                    columnNumber: a ? a.column - 1 : void 0,
                    fileName: e,
                    lineNumber: a ? a.line : void 0
                }, void 0)
            }
        }(n, t.jsxDEV)
    } else {
        if ("function" != typeof t.jsx)
            throw new TypeError("Expected `jsx` in production options");
        if ("function" != typeof t.jsxs)
            throw new TypeError("Expected `jsxs` in production options");
        r = function(e, t, n) {
            return r;
            function r(e, r, i, s) {
                const o = Array.isArray(i.children) ? n : t;
                return s ? o(r, i, s) : o(r, i)
            }
        }(0, t.jsx, t.jsxs)
    }
    const i = {
        Fragment: t.Fragment,
        ancestors: [],
        components: t.components || {},
        create: r,
        elementAttributeNameCase: t.elementAttributeNameCase || "react",
        evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
        filePath: n,
        ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
        passKeys: !1 !== t.passKeys,
        passNode: t.passNode || !1,
        schema: "svg" === t.space ? j : Q,
        stylePropertyNameCase: t.stylePropertyNameCase || "dom",
        tableCellAlignToStyle: !1 !== t.tableCellAlignToStyle
    }
      , s = ke(i, e, void 0);
    return s && "string" != typeof s ? s : i.create(e, i.Fragment, {
        children: s || void 0
    }, void 0)
}
function ke(e, t, n) {
    return "element" === t.type ? function(e, t, n) {
        const r = e.schema;
        let i = r;
        "svg" === t.tagName.toLowerCase() && "html" === r.space && (i = j,
        e.schema = i);
        e.ancestors.push(t);
        const s = ye(e, t.tagName, !1)
          , o = function(e, t) {
            const n = {};
            let r, i;
            for (i in t.properties)
                if ("children" !== i && Ee.call(t.properties, i)) {
                    const s = Oe(e, i, t.properties[i]);
                    if (s) {
                        const [i,o] = s;
                        e.tableCellAlignToStyle && "align" === i && "string" == typeof o && _e.has(t.tagName) ? r = o : n[i] = o
                    }
                }
            if (r) {
                (n.style || (n.style = {}))["css" === e.stylePropertyNameCase ? "text-align" : "textAlign"] = r
            }
            return n
        }(e, t);
        let a = De(e, t);
        Ae.has(t.tagName) && (a = a.filter(function(e) {
            return "string" != typeof e || !("object" == typeof (t = e) ? "text" === t.type && p(t.value) : p(t));
            var t
        }));
        return Se(e, o, s, t),
        Ce(o, a),
        e.ancestors.pop(),
        e.schema = r,
        e.create(t, s, o, n)
    }(e, t, n) : "mdxFlowExpression" === t.type || "mdxTextExpression" === t.type ? function(e, t) {
        if (t.data && t.data.estree && e.evaluater) {
            const n = t.data.estree.body[0];
            return n.type,
            e.evaluater.evaluateExpression(n.expression)
        }
        be(e, t.position)
    }(e, t) : "mdxJsxFlowElement" === t.type || "mdxJsxTextElement" === t.type ? function(e, t, n) {
        const i = e.schema;
        let s = i;
        "svg" === t.name && "html" === i.space && (s = j,
        e.schema = s);
        e.ancestors.push(t);
        const o = null === t.name ? e.Fragment : ye(e, t.name, !0)
          , a = function(e, t) {
            const n = {};
            for (const i of t.attributes)
                if ("mdxJsxExpressionAttribute" === i.type)
                    if (i.data && i.data.estree && e.evaluater) {
                        const t = i.data.estree.body[0];
                        r(t.type);
                        const s = t.expression;
                        r(s.type);
                        const o = s.properties[0];
                        r(o.type),
                        Object.assign(n, e.evaluater.evaluateExpression(o.argument))
                    } else
                        be(e, t.position);
                else {
                    const s = i.name;
                    let o;
                    if (i.value && "object" == typeof i.value)
                        if (i.value.data && i.value.data.estree && e.evaluater) {
                            const t = i.value.data.estree.body[0];
                            r(t.type),
                            o = e.evaluater.evaluateExpression(t.expression)
                        } else
                            be(e, t.position);
                    else
                        o = null === i.value || i.value;
                    n[s] = o
                }
            return n
        }(e, t)
          , c = De(e, t);
        return Se(e, a, o, t),
        Ce(a, c),
        e.ancestors.pop(),
        e.schema = i,
        e.create(t, o, a, n)
    }(e, t, n) : "mdxjsEsm" === t.type ? function(e, t) {
        if (t.data && t.data.estree && e.evaluater)
            return e.evaluater.evaluateProgram(t.data.estree);
        be(e, t.position)
    }(e, t) : "root" === t.type ? function(e, t, n) {
        const r = {};
        return Ce(r, De(e, t)),
        e.create(t, e.Fragment, r, n)
    }(e, t, n) : "text" === t.type ? function(e, t) {
        return t.value
    }(0, t) : void 0
}
function Se(e, t, n, r) {
    "string" != typeof n && n !== e.Fragment && e.passNode && (t.node = r)
}
function Ce(e, t) {
    if (t.length > 0) {
        const n = t.length > 1 ? t : t[0];
        n && (e.children = n)
    }
}
function De(e, t) {
    const n = [];
    let r = -1;
    const i = e.passKeys ? new Map : Te;
    for (; ++r < t.children.length; ) {
        const s = t.children[r];
        let o;
        if (e.passKeys) {
            const e = "element" === s.type ? s.tagName : "mdxJsxFlowElement" === s.type || "mdxJsxTextElement" === s.type ? s.name : void 0;
            if (e) {
                const t = i.get(e) || 0;
                o = e + "-" + t,
                i.set(e, t + 1)
            }
        }
        const a = ke(e, s, o);
        void 0 !== a && n.push(a)
    }
    return n
}
function Oe(e, t, n) {
    const r = z(e.schema, t);
    if (!(null == n || "number" == typeof n && Number.isNaN(n))) {
        if (Array.isArray(n) && (n = r.commaSeparated ? o(n) : K(n)),
        "style" === r.property) {
            let t = "object" == typeof n ? n : function(e, t) {
                try {
                    return oe(t, {
                        reactCompat: !0
                    })
                } catch (n) {
                    if (e.ignoreInvalidStyle)
                        return {};
                    const t = n
                      , r = new me("Cannot parse `style` attribute",{
                        ancestors: e.ancestors,
                        cause: t,
                        ruleId: "style",
                        source: "hast-util-to-jsx-runtime"
                    });
                    throw r.file = e.filePath || void 0,
                    r.url = Ie + "#cannot-parse-style-attribute",
                    r
                }
            }(e, String(n));
            return "css" === e.stylePropertyNameCase && (t = function(e) {
                const t = {};
                let n;
                for (n in e)
                    Ee.call(e, n) && (t[Re(n)] = e[n]);
                return t
            }(t)),
            ["style", t]
        }
        return ["react" === e.elementAttributeNameCase && r.space ? H[r.property] || r.property : r.attribute, n]
    }
}
function ye(e, t, n) {
    let r;
    if (n)
        if (t.includes(".")) {
            const e = t.split(".");
            let n, i = -1;
            for (; ++i < e.length; ) {
                const t = u(e[i]) ? {
                    type: "Identifier",
                    name: e[i]
                } : {
                    type: "Literal",
                    value: e[i]
                };
                n = n ? {
                    type: "MemberExpression",
                    object: n,
                    property: t,
                    computed: Boolean(i && "Literal" === t.type),
                    optional: !1
                } : t
            }
            r = n
        } else
            r = u(t) && !/^[a-z]/.test(t) ? {
                type: "Identifier",
                name: t
            } : {
                type: "Literal",
                value: t
            };
    else
        r = {
            type: "Literal",
            value: t
        };
    if ("Literal" === r.type) {
        const t = r.value;
        return Ee.call(e.components, t) ? e.components[t] : t
    }
    if (e.evaluater)
        return e.evaluater.evaluateExpression(r);
    be(e)
}
function be(e, t) {
    const n = new me("Cannot handle MDX estrees without `createEvaluater`",{
        ancestors: e.ancestors,
        place: t,
        ruleId: "mdx-estree",
        source: "hast-util-to-jsx-runtime"
    });
    throw n.file = e.filePath || void 0,
    n.url = Ie + "#cannot-handle-mdx-estrees-without-createevaluater",
    n
}
function Re(e) {
    let t = e.replace(ge, Le);
    return "ms-" === t.slice(0, 3) && (t = "-" + t),
    t
}
function Le(e) {
    return "-" + e.toLowerCase()
}
const Pe = {
    action: ["form"],
    cite: ["blockquote", "del", "ins", "q"],
    data: ["object"],
    formAction: ["button", "input"],
    href: ["a", "area", "base", "link"],
    icon: ["menuitem"],
    itemId: null,
    manifest: ["html"],
    ping: ["a", "area"],
    poster: ["video"],
    src: ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"]
}
  , Me = {};
function xe(e, t) {
    return ve(e, "boolean" != typeof Me.includeImageAlt || Me.includeImageAlt, "boolean" != typeof Me.includeHtml || Me.includeHtml)
}
function ve(e, t, n) {
    if (function(e) {
        return Boolean(e && "object" == typeof e)
    }(e)) {
        if ("value"in e)
            return "html" !== e.type || n ? e.value : "";
        if (t && "alt"in e && e.alt)
            return e.alt;
        if ("children"in e)
            return we(e.children, t, n)
    }
    return Array.isArray(e) ? we(e, t, n) : ""
}
function we(e, t, n) {
    const r = [];
    let i = -1;
    for (; ++i < e.length; )
        r[i] = ve(e[i], t, n);
    return r.join("")
}
const Fe = document.createElement("i");
function Be(e) {
    const t = "&" + e + ";";
    Fe.innerHTML = t;
    const n = Fe.textContent;
    return (59 !== n.charCodeAt(n.length - 1) || "semi" === e) && (n !== t && n)
}
function He(e, t, n, r) {
    const i = e.length;
    let s, o = 0;
    if (t = t < 0 ? -t > i ? 0 : i + t : t > i ? i : t,
    n = n > 0 ? n : 0,
    r.length < 1e4)
        s = Array.from(r),
        s.unshift(t, n),
        e.splice(...s);
    else
        for (n && e.splice(t, n); o < r.length; )
            s = r.slice(o, o + 1e4),
            s.unshift(t, 0),
            e.splice(...s),
            o += 1e4,
            t += 1e4
}
function Ue(e, t) {
    return e.length > 0 ? (He(e, e.length, 0, t),
    e) : t
}
const Ge = {}.hasOwnProperty;
function Ye(e) {
    const t = {};
    let n = -1;
    for (; ++n < e.length; )
        ze(t, e[n]);
    return t
}
function ze(e, t) {
    let n;
    for (n in t) {
        const r = (Ge.call(e, n) ? e[n] : void 0) || (e[n] = {})
          , i = t[n];
        let s;
        if (i)
            for (s in i) {
                Ge.call(r, s) || (r[s] = []);
                const e = i[s];
                qe(r[s], Array.isArray(e) ? e : e ? [e] : [])
            }
    }
}
function qe(e, t) {
    let n = -1;
    const r = [];
    for (; ++n < t.length; )
        ("after" === t[n].add ? e : r).push(t[n]);
    He(e, 0, 0, r)
}
function Ve(e, t) {
    const n = Number.parseInt(e, t);
    return n < 9 || 11 === n || n > 13 && n < 32 || n > 126 && n < 160 || n > 55295 && n < 57344 || n > 64975 && n < 65008 || !(65535 & ~n) || 65534 == (65535 & n) || n > 1114111 ? "�" : String.fromCodePoint(n)
}
function Qe(e) {
    return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase()
}
const je = st(/[A-Za-z]/)
  , We = st(/[\dA-Za-z]/)
  , Ke = st(/[#-'*+\--9=?A-Z^-~]/);
function Xe(e) {
    return null !== e && (e < 32 || 127 === e)
}
const Je = st(/\d/)
  , $e = st(/[\dA-Fa-f]/)
  , Ze = st(/[!-/:-@[-`{-~]/);
function et(e) {
    return null !== e && e < -2
}
function tt(e) {
    return null !== e && (e < 0 || 32 === e)
}
function nt(e) {
    return -2 === e || -1 === e || 32 === e
}
const rt = st(new RegExp("\\p{P}|\\p{S}","u"))
  , it = st(/\s/);
function st(e) {
    return function(t) {
        return null !== t && t > -1 && e.test(String.fromCharCode(t))
    }
}
function ot(e) {
    const t = [];
    let n = -1
      , r = 0
      , i = 0;
    for (; ++n < e.length; ) {
        const s = e.charCodeAt(n);
        let o = "";
        if (37 === s && We(e.charCodeAt(n + 1)) && We(e.charCodeAt(n + 2)))
            i = 2;
        else if (s < 128)
            /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(s)) || (o = String.fromCharCode(s));
        else if (s > 55295 && s < 57344) {
            const t = e.charCodeAt(n + 1);
            s < 56320 && t > 56319 && t < 57344 ? (o = String.fromCharCode(s, t),
            i = 1) : o = "�"
        } else
            o = String.fromCharCode(s);
        o && (t.push(e.slice(r, n), encodeURIComponent(o)),
        r = n + i + 1,
        o = ""),
        i && (n += i,
        i = 0)
    }
    return t.join("") + e.slice(r)
}
function at(e, t, n, r) {
    const i = r ? r - 1 : Number.POSITIVE_INFINITY;
    let s = 0;
    return function(r) {
        if (nt(r))
            return e.enter(n),
            o(r);
        return t(r)
    }
    ;
    function o(r) {
        return nt(r) && s++ < i ? (e.consume(r),
        o) : (e.exit(n),
        t(r))
    }
}
const ct = {
    tokenize: function(e) {
        const t = e.attempt(this.parser.constructs.contentInitial, function(n) {
            if (null === n)
                return void e.consume(n);
            return e.enter("lineEnding"),
            e.consume(n),
            e.exit("lineEnding"),
            at(e, t, "linePrefix")
        }, function(t) {
            return e.enter("paragraph"),
            r(t)
        });
        let n;
        return t;
        function r(t) {
            const r = e.enter("chunkText", {
                contentType: "text",
                previous: n
            });
            return n && (n.next = r),
            n = r,
            i(t)
        }
        function i(t) {
            return null === t ? (e.exit("chunkText"),
            e.exit("paragraph"),
            void e.consume(t)) : et(t) ? (e.consume(t),
            e.exit("chunkText"),
            r) : (e.consume(t),
            i)
        }
    }
};
const lt = {
    tokenize: function(e) {
        const t = this
          , n = [];
        let r, i, s, o = 0;
        return a;
        function a(r) {
            if (o < n.length) {
                const i = n[o];
                return t.containerState = i[1],
                e.attempt(i[0].continuation, c, l)(r)
            }
            return l(r)
        }
        function c(e) {
            if (o++,
            t.containerState._closeFlow) {
                t.containerState._closeFlow = void 0,
                r && g();
                const n = t.events.length;
                let i, s = n;
                for (; s--; )
                    if ("exit" === t.events[s][0] && "chunkFlow" === t.events[s][1].type) {
                        i = t.events[s][1].end;
                        break
                    }
                T(o);
                let a = n;
                for (; a < t.events.length; )
                    t.events[a][1].end = {
                        ...i
                    },
                    a++;
                return He(t.events, s + 1, 0, t.events.slice(n)),
                t.events.length = a,
                l(e)
            }
            return a(e)
        }
        function l(i) {
            if (o === n.length) {
                if (!r)
                    return p(i);
                if (r.currentConstruct && r.currentConstruct.concrete)
                    return f(i);
                t.interrupt = Boolean(r.currentConstruct && !r._gfmTableDynamicInterruptHack)
            }
            return t.containerState = {},
            e.check(ut, u, h)(i)
        }
        function u(e) {
            return r && g(),
            T(o),
            p(e)
        }
        function h(e) {
            return t.parser.lazy[t.now().line] = o !== n.length,
            s = t.now().offset,
            f(e)
        }
        function p(n) {
            return t.containerState = {},
            e.attempt(ut, d, f)(n)
        }
        function d(e) {
            return o++,
            n.push([t.currentConstruct, t.containerState]),
            p(e)
        }
        function f(n) {
            return null === n ? (r && g(),
            T(0),
            void e.consume(n)) : (r = r || t.parser.flow(t.now()),
            e.enter("chunkFlow", {
                _tokenizer: r,
                contentType: "flow",
                previous: i
            }),
            m(n))
        }
        function m(n) {
            return null === n ? (E(e.exit("chunkFlow"), !0),
            T(0),
            void e.consume(n)) : et(n) ? (e.consume(n),
            E(e.exit("chunkFlow")),
            o = 0,
            t.interrupt = void 0,
            a) : (e.consume(n),
            m)
        }
        function E(e, n) {
            const a = t.sliceStream(e);
            if (n && a.push(null),
            e.previous = i,
            i && (i.next = e),
            i = e,
            r.defineSkip(e.start),
            r.write(a),
            t.parser.lazy[e.start.line]) {
                let e = r.events.length;
                for (; e--; )
                    if (r.events[e][1].start.offset < s && (!r.events[e][1].end || r.events[e][1].end.offset > s))
                        return;
                const n = t.events.length;
                let i, a, c = n;
                for (; c--; )
                    if ("exit" === t.events[c][0] && "chunkFlow" === t.events[c][1].type) {
                        if (i) {
                            a = t.events[c][1].end;
                            break
                        }
                        i = !0
                    }
                for (T(o),
                e = n; e < t.events.length; )
                    t.events[e][1].end = {
                        ...a
                    },
                    e++;
                He(t.events, c + 1, 0, t.events.slice(n)),
                t.events.length = e
            }
        }
        function T(r) {
            let i = n.length;
            for (; i-- > r; ) {
                const r = n[i];
                t.containerState = r[1],
                r[0].exit.call(t, e)
            }
            n.length = r
        }
        function g() {
            r.write([null]),
            i = void 0,
            r = void 0,
            t.containerState._closeFlow = void 0
        }
    }
}
  , ut = {
    tokenize: function(e, t, n) {
        return at(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)
    }
};
function ht(e) {
    return null === e || tt(e) || it(e) ? 1 : rt(e) ? 2 : void 0
}
function pt(e, t, n) {
    const r = [];
    let i = -1;
    for (; ++i < e.length; ) {
        const s = e[i].resolveAll;
        s && !r.includes(s) && (t = s(t, n),
        r.push(s))
    }
    return t
}
const dt = {
    name: "attention",
    resolveAll: function(e, t) {
        let n, r, i, s, o, a, c, l, u = -1;
        for (; ++u < e.length; )
            if ("enter" === e[u][0] && "attentionSequence" === e[u][1].type && e[u][1]._close)
                for (n = u; n--; )
                    if ("exit" === e[n][0] && "attentionSequence" === e[n][1].type && e[n][1]._open && t.sliceSerialize(e[n][1]).charCodeAt(0) === t.sliceSerialize(e[u][1]).charCodeAt(0)) {
                        if ((e[n][1]._close || e[u][1]._open) && (e[u][1].end.offset - e[u][1].start.offset) % 3 && !((e[n][1].end.offset - e[n][1].start.offset + e[u][1].end.offset - e[u][1].start.offset) % 3))
                            continue;
                        a = e[n][1].end.offset - e[n][1].start.offset > 1 && e[u][1].end.offset - e[u][1].start.offset > 1 ? 2 : 1;
                        const h = {
                            ...e[n][1].end
                        }
                          , p = {
                            ...e[u][1].start
                        };
                        ft(h, -a),
                        ft(p, a),
                        s = {
                            type: a > 1 ? "strongSequence" : "emphasisSequence",
                            start: h,
                            end: {
                                ...e[n][1].end
                            }
                        },
                        o = {
                            type: a > 1 ? "strongSequence" : "emphasisSequence",
                            start: {
                                ...e[u][1].start
                            },
                            end: p
                        },
                        i = {
                            type: a > 1 ? "strongText" : "emphasisText",
                            start: {
                                ...e[n][1].end
                            },
                            end: {
                                ...e[u][1].start
                            }
                        },
                        r = {
                            type: a > 1 ? "strong" : "emphasis",
                            start: {
                                ...s.start
                            },
                            end: {
                                ...o.end
                            }
                        },
                        e[n][1].end = {
                            ...s.start
                        },
                        e[u][1].start = {
                            ...o.end
                        },
                        c = [],
                        e[n][1].end.offset - e[n][1].start.offset && (c = Ue(c, [["enter", e[n][1], t], ["exit", e[n][1], t]])),
                        c = Ue(c, [["enter", r, t], ["enter", s, t], ["exit", s, t], ["enter", i, t]]),
                        c = Ue(c, pt(t.parser.constructs.insideSpan.null, e.slice(n + 1, u), t)),
                        c = Ue(c, [["exit", i, t], ["enter", o, t], ["exit", o, t], ["exit", r, t]]),
                        e[u][1].end.offset - e[u][1].start.offset ? (l = 2,
                        c = Ue(c, [["enter", e[u][1], t], ["exit", e[u][1], t]])) : l = 0,
                        He(e, n - 1, u - n + 3, c),
                        u = n + c.length - l - 2;
                        break
                    }
        u = -1;
        for (; ++u < e.length; )
            "attentionSequence" === e[u][1].type && (e[u][1].type = "data");
        return e
    },
    tokenize: function(e, t) {
        const n = this.parser.constructs.attentionMarkers.null
          , r = this.previous
          , i = ht(r);
        let s;
        return function(t) {
            return s = t,
            e.enter("attentionSequence"),
            o(t)
        }
        ;
        function o(a) {
            if (a === s)
                return e.consume(a),
                o;
            const c = e.exit("attentionSequence")
              , l = ht(a)
              , u = !l || 2 === l && i || n.includes(a)
              , h = !i || 2 === i && l || n.includes(r);
            return c._open = Boolean(42 === s ? u : u && (i || !h)),
            c._close = Boolean(42 === s ? h : h && (l || !u)),
            t(a)
        }
    }
};
function ft(e, t) {
    e.column += t,
    e.offset += t,
    e._bufferIndex += t
}
const mt = {
    name: "autolink",
    tokenize: function(e, t, n) {
        let r = 0;
        return function(t) {
            return e.enter("autolink"),
            e.enter("autolinkMarker"),
            e.consume(t),
            e.exit("autolinkMarker"),
            e.enter("autolinkProtocol"),
            i
        }
        ;
        function i(t) {
            return je(t) ? (e.consume(t),
            s) : 64 === t ? n(t) : c(t)
        }
        function s(e) {
            return 43 === e || 45 === e || 46 === e || We(e) ? (r = 1,
            o(e)) : c(e)
        }
        function o(t) {
            return 58 === t ? (e.consume(t),
            r = 0,
            a) : (43 === t || 45 === t || 46 === t || We(t)) && r++ < 32 ? (e.consume(t),
            o) : (r = 0,
            c(t))
        }
        function a(r) {
            return 62 === r ? (e.exit("autolinkProtocol"),
            e.enter("autolinkMarker"),
            e.consume(r),
            e.exit("autolinkMarker"),
            e.exit("autolink"),
            t) : null === r || 32 === r || 60 === r || Xe(r) ? n(r) : (e.consume(r),
            a)
        }
        function c(t) {
            return 64 === t ? (e.consume(t),
            l) : Ke(t) ? (e.consume(t),
            c) : n(t)
        }
        function l(e) {
            return We(e) ? u(e) : n(e)
        }
        function u(n) {
            return 46 === n ? (e.consume(n),
            r = 0,
            l) : 62 === n ? (e.exit("autolinkProtocol").type = "autolinkEmail",
            e.enter("autolinkMarker"),
            e.consume(n),
            e.exit("autolinkMarker"),
            e.exit("autolink"),
            t) : h(n)
        }
        function h(t) {
            if ((45 === t || We(t)) && r++ < 63) {
                const n = 45 === t ? h : u;
                return e.consume(t),
                n
            }
            return n(t)
        }
    }
};
const Et = {
    partial: !0,
    tokenize: function(e, t, n) {
        return function(t) {
            return nt(t) ? at(e, r, "linePrefix")(t) : r(t)
        }
        ;
        function r(e) {
            return null === e || et(e) ? t(e) : n(e)
        }
    }
};
const Tt = {
    continuation: {
        tokenize: function(e, t, n) {
            const r = this;
            return function(t) {
                if (nt(t))
                    return at(e, i, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t);
                return i(t)
            }
            ;
            function i(r) {
                return e.attempt(Tt, t, n)(r)
            }
        }
    },
    exit: function(e) {
        e.exit("blockQuote")
    },
    name: "blockQuote",
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            if (62 === t) {
                const n = r.containerState;
                return n.open || (e.enter("blockQuote", {
                    _container: !0
                }),
                n.open = !0),
                e.enter("blockQuotePrefix"),
                e.enter("blockQuoteMarker"),
                e.consume(t),
                e.exit("blockQuoteMarker"),
                i
            }
            return n(t)
        }
        ;
        function i(n) {
            return nt(n) ? (e.enter("blockQuotePrefixWhitespace"),
            e.consume(n),
            e.exit("blockQuotePrefixWhitespace"),
            e.exit("blockQuotePrefix"),
            t) : (e.exit("blockQuotePrefix"),
            t(n))
        }
    }
};
const gt = {
    name: "characterEscape",
    tokenize: function(e, t, n) {
        return function(t) {
            return e.enter("characterEscape"),
            e.enter("escapeMarker"),
            e.consume(t),
            e.exit("escapeMarker"),
            r
        }
        ;
        function r(r) {
            return Ze(r) ? (e.enter("characterEscapeValue"),
            e.consume(r),
            e.exit("characterEscapeValue"),
            e.exit("characterEscape"),
            t) : n(r)
        }
    }
};
const At = {
    name: "characterReference",
    tokenize: function(e, t, n) {
        const r = this;
        let i, s, o = 0;
        return function(t) {
            return e.enter("characterReference"),
            e.enter("characterReferenceMarker"),
            e.consume(t),
            e.exit("characterReferenceMarker"),
            a
        }
        ;
        function a(t) {
            return 35 === t ? (e.enter("characterReferenceMarkerNumeric"),
            e.consume(t),
            e.exit("characterReferenceMarkerNumeric"),
            c) : (e.enter("characterReferenceValue"),
            i = 31,
            s = We,
            l(t))
        }
        function c(t) {
            return 88 === t || 120 === t ? (e.enter("characterReferenceMarkerHexadecimal"),
            e.consume(t),
            e.exit("characterReferenceMarkerHexadecimal"),
            e.enter("characterReferenceValue"),
            i = 6,
            s = $e,
            l) : (e.enter("characterReferenceValue"),
            i = 7,
            s = Je,
            l(t))
        }
        function l(a) {
            if (59 === a && o) {
                const i = e.exit("characterReferenceValue");
                return s !== We || Be(r.sliceSerialize(i)) ? (e.enter("characterReferenceMarker"),
                e.consume(a),
                e.exit("characterReferenceMarker"),
                e.exit("characterReference"),
                t) : n(a)
            }
            return s(a) && o++ < i ? (e.consume(a),
            l) : n(a)
        }
    }
};
const _t = {
    partial: !0,
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            if (null === t)
                return n(t);
            return e.enter("lineEnding"),
            e.consume(t),
            e.exit("lineEnding"),
            i
        }
        ;
        function i(e) {
            return r.parser.lazy[r.now().line] ? n(e) : t(e)
        }
    }
}
  , It = {
    concrete: !0,
    name: "codeFenced",
    tokenize: function(e, t, n) {
        const r = this
          , i = {
            partial: !0,
            tokenize: function(e, t, n) {
                let i = 0;
                return o;
                function o(t) {
                    return e.enter("lineEnding"),
                    e.consume(t),
                    e.exit("lineEnding"),
                    c
                }
                function c(t) {
                    return e.enter("codeFencedFence"),
                    nt(t) ? at(e, l, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : l(t)
                }
                function l(t) {
                    return t === s ? (e.enter("codeFencedFenceSequence"),
                    u(t)) : n(t)
                }
                function u(t) {
                    return t === s ? (i++,
                    e.consume(t),
                    u) : i >= a ? (e.exit("codeFencedFenceSequence"),
                    nt(t) ? at(e, h, "whitespace")(t) : h(t)) : n(t)
                }
                function h(r) {
                    return null === r || et(r) ? (e.exit("codeFencedFence"),
                    t(r)) : n(r)
                }
            }
        };
        let s, o = 0, a = 0;
        return function(t) {
            return function(t) {
                const n = r.events[r.events.length - 1];
                return o = n && "linePrefix" === n[1].type ? n[2].sliceSerialize(n[1], !0).length : 0,
                s = t,
                e.enter("codeFenced"),
                e.enter("codeFencedFence"),
                e.enter("codeFencedFenceSequence"),
                c(t)
            }(t)
        }
        ;
        function c(t) {
            return t === s ? (a++,
            e.consume(t),
            c) : a < 3 ? n(t) : (e.exit("codeFencedFenceSequence"),
            nt(t) ? at(e, l, "whitespace")(t) : l(t))
        }
        function l(n) {
            return null === n || et(n) ? (e.exit("codeFencedFence"),
            r.interrupt ? t(n) : e.check(_t, d, g)(n)) : (e.enter("codeFencedFenceInfo"),
            e.enter("chunkString", {
                contentType: "string"
            }),
            u(n))
        }
        function u(t) {
            return null === t || et(t) ? (e.exit("chunkString"),
            e.exit("codeFencedFenceInfo"),
            l(t)) : nt(t) ? (e.exit("chunkString"),
            e.exit("codeFencedFenceInfo"),
            at(e, h, "whitespace")(t)) : 96 === t && t === s ? n(t) : (e.consume(t),
            u)
        }
        function h(t) {
            return null === t || et(t) ? l(t) : (e.enter("codeFencedFenceMeta"),
            e.enter("chunkString", {
                contentType: "string"
            }),
            p(t))
        }
        function p(t) {
            return null === t || et(t) ? (e.exit("chunkString"),
            e.exit("codeFencedFenceMeta"),
            l(t)) : 96 === t && t === s ? n(t) : (e.consume(t),
            p)
        }
        function d(t) {
            return e.attempt(i, g, f)(t)
        }
        function f(t) {
            return e.enter("lineEnding"),
            e.consume(t),
            e.exit("lineEnding"),
            m
        }
        function m(t) {
            return o > 0 && nt(t) ? at(e, E, "linePrefix", o + 1)(t) : E(t)
        }
        function E(t) {
            return null === t || et(t) ? e.check(_t, d, g)(t) : (e.enter("codeFlowValue"),
            T(t))
        }
        function T(t) {
            return null === t || et(t) ? (e.exit("codeFlowValue"),
            E(t)) : (e.consume(t),
            T)
        }
        function g(n) {
            return e.exit("codeFenced"),
            t(n)
        }
    }
};
const Nt = {
    name: "codeIndented",
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            return e.enter("codeIndented"),
            at(e, i, "linePrefix", 5)(t)
        }
        ;
        function i(e) {
            const t = r.events[r.events.length - 1];
            return t && "linePrefix" === t[1].type && t[2].sliceSerialize(t[1], !0).length >= 4 ? s(e) : n(e)
        }
        function s(t) {
            return null === t ? a(t) : et(t) ? e.attempt(kt, s, a)(t) : (e.enter("codeFlowValue"),
            o(t))
        }
        function o(t) {
            return null === t || et(t) ? (e.exit("codeFlowValue"),
            s(t)) : (e.consume(t),
            o)
        }
        function a(n) {
            return e.exit("codeIndented"),
            t(n)
        }
    }
}
  , kt = {
    partial: !0,
    tokenize: function(e, t, n) {
        const r = this;
        return i;
        function i(t) {
            return r.parser.lazy[r.now().line] ? n(t) : et(t) ? (e.enter("lineEnding"),
            e.consume(t),
            e.exit("lineEnding"),
            i) : at(e, s, "linePrefix", 5)(t)
        }
        function s(e) {
            const s = r.events[r.events.length - 1];
            return s && "linePrefix" === s[1].type && s[2].sliceSerialize(s[1], !0).length >= 4 ? t(e) : et(e) ? i(e) : n(e)
        }
    }
};
const St = {
    name: "codeText",
    previous: function(e) {
        return 96 !== e || "characterEscape" === this.events[this.events.length - 1][1].type
    },
    resolve: function(e) {
        let t, n, r = e.length - 4, i = 3;
        if (!("lineEnding" !== e[i][1].type && "space" !== e[i][1].type || "lineEnding" !== e[r][1].type && "space" !== e[r][1].type))
            for (t = i; ++t < r; )
                if ("codeTextData" === e[t][1].type) {
                    e[i][1].type = "codeTextPadding",
                    e[r][1].type = "codeTextPadding",
                    i += 2,
                    r -= 2;
                    break
                }
        t = i - 1,
        r++;
        for (; ++t <= r; )
            void 0 === n ? t !== r && "lineEnding" !== e[t][1].type && (n = t) : t !== r && "lineEnding" !== e[t][1].type || (e[n][1].type = "codeTextData",
            t !== n + 2 && (e[n][1].end = e[t - 1][1].end,
            e.splice(n + 2, t - n - 2),
            r -= t - n - 2,
            t = n + 2),
            n = void 0);
        return e
    },
    tokenize: function(e, t, n) {
        let r, i, s = 0;
        return function(t) {
            return e.enter("codeText"),
            e.enter("codeTextSequence"),
            o(t)
        }
        ;
        function o(t) {
            return 96 === t ? (e.consume(t),
            s++,
            o) : (e.exit("codeTextSequence"),
            a(t))
        }
        function a(t) {
            return null === t ? n(t) : 32 === t ? (e.enter("space"),
            e.consume(t),
            e.exit("space"),
            a) : 96 === t ? (i = e.enter("codeTextSequence"),
            r = 0,
            l(t)) : et(t) ? (e.enter("lineEnding"),
            e.consume(t),
            e.exit("lineEnding"),
            a) : (e.enter("codeTextData"),
            c(t))
        }
        function c(t) {
            return null === t || 32 === t || 96 === t || et(t) ? (e.exit("codeTextData"),
            a(t)) : (e.consume(t),
            c)
        }
        function l(n) {
            return 96 === n ? (e.consume(n),
            r++,
            l) : r === s ? (e.exit("codeTextSequence"),
            e.exit("codeText"),
            t(n)) : (i.type = "codeTextData",
            c(n))
        }
    }
};
class Ct {
    constructor(e) {
        this.left = e ? [...e] : [],
        this.right = []
    }
    get(e) {
        if (e < 0 || e >= this.left.length + this.right.length)
            throw new RangeError("Cannot access index `" + e + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
        return e < this.left.length ? this.left[e] : this.right[this.right.length - e + this.left.length - 1]
    }
    get length() {
        return this.left.length + this.right.length
    }
    shift() {
        return this.setCursor(0),
        this.right.pop()
    }
    slice(e, t) {
        const n = null == t ? Number.POSITIVE_INFINITY : t;
        return n < this.left.length ? this.left.slice(e, n) : e > this.left.length ? this.right.slice(this.right.length - n + this.left.length, this.right.length - e + this.left.length).reverse() : this.left.slice(e).concat(this.right.slice(this.right.length - n + this.left.length).reverse())
    }
    splice(e, t, n) {
        const r = t || 0;
        this.setCursor(Math.trunc(e));
        const i = this.right.splice(this.right.length - r, Number.POSITIVE_INFINITY);
        return n && Dt(this.left, n),
        i.reverse()
    }
    pop() {
        return this.setCursor(Number.POSITIVE_INFINITY),
        this.left.pop()
    }
    push(e) {
        this.setCursor(Number.POSITIVE_INFINITY),
        this.left.push(e)
    }
    pushMany(e) {
        this.setCursor(Number.POSITIVE_INFINITY),
        Dt(this.left, e)
    }
    unshift(e) {
        this.setCursor(0),
        this.right.push(e)
    }
    unshiftMany(e) {
        this.setCursor(0),
        Dt(this.right, e.reverse())
    }
    setCursor(e) {
        if (!(e === this.left.length || e > this.left.length && 0 === this.right.length || e < 0 && 0 === this.left.length))
            if (e < this.left.length) {
                const t = this.left.splice(e, Number.POSITIVE_INFINITY);
                Dt(this.right, t.reverse())
            } else {
                const t = this.right.splice(this.left.length + this.right.length - e, Number.POSITIVE_INFINITY);
                Dt(this.left, t.reverse())
            }
    }
}
function Dt(e, t) {
    let n = 0;
    if (t.length < 1e4)
        e.push(...t);
    else
        for (; n < t.length; )
            e.push(...t.slice(n, n + 1e4)),
            n += 1e4
}
function Ot(e) {
    const t = {};
    let n, r, i, s, o, a, c, l = -1;
    const u = new Ct(e);
    for (; ++l < u.length; ) {
        for (; l in t; )
            l = t[l];
        if (n = u.get(l),
        l && "chunkFlow" === n[1].type && "listItemPrefix" === u.get(l - 1)[1].type && (a = n[1]._tokenizer.events,
        i = 0,
        i < a.length && "lineEndingBlank" === a[i][1].type && (i += 2),
        i < a.length && "content" === a[i][1].type))
            for (; ++i < a.length && "content" !== a[i][1].type; )
                "chunkText" === a[i][1].type && (a[i][1]._isInFirstContentOfListItem = !0,
                i++);
        if ("enter" === n[0])
            n[1].contentType && (Object.assign(t, yt(u, l)),
            l = t[l],
            c = !0);
        else if (n[1]._container) {
            for (i = l,
            r = void 0; i--; )
                if (s = u.get(i),
                "lineEnding" === s[1].type || "lineEndingBlank" === s[1].type)
                    "enter" === s[0] && (r && (u.get(r)[1].type = "lineEndingBlank"),
                    s[1].type = "lineEnding",
                    r = i);
                else if ("linePrefix" !== s[1].type && "listItemIndent" !== s[1].type)
                    break;
            r && (n[1].end = {
                ...u.get(r)[1].start
            },
            o = u.slice(r, l),
            o.unshift(n),
            u.splice(r, l - r + 1, o))
        }
    }
    return He(e, 0, Number.POSITIVE_INFINITY, u.slice(0)),
    !c
}
function yt(e, t) {
    const n = e.get(t)[1]
      , r = e.get(t)[2];
    let i = t - 1;
    const s = [];
    let o = n._tokenizer;
    o || (o = r.parser[n.contentType](n.start),
    n._contentTypeTextTrailing && (o._contentTypeTextTrailing = !0));
    const a = o.events
      , c = []
      , l = {};
    let u, h, p = -1, d = n, f = 0, m = 0;
    const E = [m];
    for (; d; ) {
        for (; e.get(++i)[1] !== d; )
            ;
        s.push(i),
        d._tokenizer || (u = r.sliceStream(d),
        d.next || u.push(null),
        h && o.defineSkip(d.start),
        d._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = !0),
        o.write(u),
        d._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = void 0)),
        h = d,
        d = d.next
    }
    for (d = n; ++p < a.length; )
        "exit" === a[p][0] && "enter" === a[p - 1][0] && a[p][1].type === a[p - 1][1].type && a[p][1].start.line !== a[p][1].end.line && (m = p + 1,
        E.push(m),
        d._tokenizer = void 0,
        d.previous = void 0,
        d = d.next);
    for (o.events = [],
    d ? (d._tokenizer = void 0,
    d.previous = void 0) : E.pop(),
    p = E.length; p--; ) {
        const t = a.slice(E[p], E[p + 1])
          , n = s.pop();
        c.push([n, n + t.length - 1]),
        e.splice(n, 2, t)
    }
    for (c.reverse(),
    p = -1; ++p < c.length; )
        l[f + c[p][0]] = f + c[p][1],
        f += c[p][1] - c[p][0] - 1;
    return l
}
const bt = {
    resolve: function(e) {
        return Ot(e),
        e
    },
    tokenize: function(e, t) {
        let n;
        return function(t) {
            return e.enter("content"),
            n = e.enter("chunkContent", {
                contentType: "content"
            }),
            r(t)
        }
        ;
        function r(t) {
            return null === t ? i(t) : et(t) ? e.check(Rt, s, i)(t) : (e.consume(t),
            r)
        }
        function i(n) {
            return e.exit("chunkContent"),
            e.exit("content"),
            t(n)
        }
        function s(t) {
            return e.consume(t),
            e.exit("chunkContent"),
            n.next = e.enter("chunkContent", {
                contentType: "content",
                previous: n
            }),
            n = n.next,
            r
        }
    }
}
  , Rt = {
    partial: !0,
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            return e.exit("chunkContent"),
            e.enter("lineEnding"),
            e.consume(t),
            e.exit("lineEnding"),
            at(e, i, "linePrefix")
        }
        ;
        function i(i) {
            if (null === i || et(i))
                return n(i);
            const s = r.events[r.events.length - 1];
            return !r.parser.constructs.disable.null.includes("codeIndented") && s && "linePrefix" === s[1].type && s[2].sliceSerialize(s[1], !0).length >= 4 ? t(i) : e.interrupt(r.parser.constructs.flow, n, t)(i)
        }
    }
};
function Lt(e, t, n, r, i, s, o, a, c) {
    const l = c || Number.POSITIVE_INFINITY;
    let u = 0;
    return function(t) {
        if (60 === t)
            return e.enter(r),
            e.enter(i),
            e.enter(s),
            e.consume(t),
            e.exit(s),
            h;
        if (null === t || 32 === t || 41 === t || Xe(t))
            return n(t);
        return e.enter(r),
        e.enter(o),
        e.enter(a),
        e.enter("chunkString", {
            contentType: "string"
        }),
        f(t)
    }
    ;
    function h(n) {
        return 62 === n ? (e.enter(s),
        e.consume(n),
        e.exit(s),
        e.exit(i),
        e.exit(r),
        t) : (e.enter(a),
        e.enter("chunkString", {
            contentType: "string"
        }),
        p(n))
    }
    function p(t) {
        return 62 === t ? (e.exit("chunkString"),
        e.exit(a),
        h(t)) : null === t || 60 === t || et(t) ? n(t) : (e.consume(t),
        92 === t ? d : p)
    }
    function d(t) {
        return 60 === t || 62 === t || 92 === t ? (e.consume(t),
        p) : p(t)
    }
    function f(i) {
        return u || null !== i && 41 !== i && !tt(i) ? u < l && 40 === i ? (e.consume(i),
        u++,
        f) : 41 === i ? (e.consume(i),
        u--,
        f) : null === i || 32 === i || 40 === i || Xe(i) ? n(i) : (e.consume(i),
        92 === i ? m : f) : (e.exit("chunkString"),
        e.exit(a),
        e.exit(o),
        e.exit(r),
        t(i))
    }
    function m(t) {
        return 40 === t || 41 === t || 92 === t ? (e.consume(t),
        f) : f(t)
    }
}
function Pt(e, t, n, r, i, s) {
    const o = this;
    let a, c = 0;
    return function(t) {
        return e.enter(r),
        e.enter(i),
        e.consume(t),
        e.exit(i),
        e.enter(s),
        l
    }
    ;
    function l(h) {
        return c > 999 || null === h || 91 === h || 93 === h && !a || 94 === h && !c && "_hiddenFootnoteSupport"in o.parser.constructs ? n(h) : 93 === h ? (e.exit(s),
        e.enter(i),
        e.consume(h),
        e.exit(i),
        e.exit(r),
        t) : et(h) ? (e.enter("lineEnding"),
        e.consume(h),
        e.exit("lineEnding"),
        l) : (e.enter("chunkString", {
            contentType: "string"
        }),
        u(h))
    }
    function u(t) {
        return null === t || 91 === t || 93 === t || et(t) || c++ > 999 ? (e.exit("chunkString"),
        l(t)) : (e.consume(t),
        a || (a = !nt(t)),
        92 === t ? h : u)
    }
    function h(t) {
        return 91 === t || 92 === t || 93 === t ? (e.consume(t),
        c++,
        u) : u(t)
    }
}
function Mt(e, t, n, r, i, s) {
    let o;
    return function(t) {
        if (34 === t || 39 === t || 40 === t)
            return e.enter(r),
            e.enter(i),
            e.consume(t),
            e.exit(i),
            o = 40 === t ? 41 : t,
            a;
        return n(t)
    }
    ;
    function a(n) {
        return n === o ? (e.enter(i),
        e.consume(n),
        e.exit(i),
        e.exit(r),
        t) : (e.enter(s),
        c(n))
    }
    function c(t) {
        return t === o ? (e.exit(s),
        a(o)) : null === t ? n(t) : et(t) ? (e.enter("lineEnding"),
        e.consume(t),
        e.exit("lineEnding"),
        at(e, c, "linePrefix")) : (e.enter("chunkString", {
            contentType: "string"
        }),
        l(t))
    }
    function l(t) {
        return t === o || null === t || et(t) ? (e.exit("chunkString"),
        c(t)) : (e.consume(t),
        92 === t ? u : l)
    }
    function u(t) {
        return t === o || 92 === t ? (e.consume(t),
        l) : l(t)
    }
}
function xt(e, t) {
    let n;
    return function r(i) {
        if (et(i))
            return e.enter("lineEnding"),
            e.consume(i),
            e.exit("lineEnding"),
            n = !0,
            r;
        if (nt(i))
            return at(e, r, n ? "linePrefix" : "lineSuffix")(i);
        return t(i)
    }
}
const vt = {
    name: "definition",
    tokenize: function(e, t, n) {
        const r = this;
        let i;
        return function(t) {
            return e.enter("definition"),
            function(t) {
                return Pt.call(r, e, s, n, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(t)
            }(t)
        }
        ;
        function s(t) {
            return i = Qe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)),
            58 === t ? (e.enter("definitionMarker"),
            e.consume(t),
            e.exit("definitionMarker"),
            o) : n(t)
        }
        function o(t) {
            return tt(t) ? xt(e, a)(t) : a(t)
        }
        function a(t) {
            return Lt(e, c, n, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString")(t)
        }
        function c(t) {
            return e.attempt(wt, l, l)(t)
        }
        function l(t) {
            return nt(t) ? at(e, u, "whitespace")(t) : u(t)
        }
        function u(s) {
            return null === s || et(s) ? (e.exit("definition"),
            r.parser.defined.push(i),
            t(s)) : n(s)
        }
    }
}
  , wt = {
    partial: !0,
    tokenize: function(e, t, n) {
        return function(t) {
            return tt(t) ? xt(e, r)(t) : n(t)
        }
        ;
        function r(t) {
            return Mt(e, i, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(t)
        }
        function i(t) {
            return nt(t) ? at(e, s, "whitespace")(t) : s(t)
        }
        function s(e) {
            return null === e || et(e) ? t(e) : n(e)
        }
    }
};
const Ft = {
    name: "hardBreakEscape",
    tokenize: function(e, t, n) {
        return function(t) {
            return e.enter("hardBreakEscape"),
            e.consume(t),
            r
        }
        ;
        function r(r) {
            return et(r) ? (e.exit("hardBreakEscape"),
            t(r)) : n(r)
        }
    }
};
const Bt = {
    name: "headingAtx",
    resolve: function(e, t) {
        let n, r, i = e.length - 2, s = 3;
        "whitespace" === e[s][1].type && (s += 2);
        i - 2 > s && "whitespace" === e[i][1].type && (i -= 2);
        "atxHeadingSequence" === e[i][1].type && (s === i - 1 || i - 4 > s && "whitespace" === e[i - 2][1].type) && (i -= s + 1 === i ? 2 : 4);
        i > s && (n = {
            type: "atxHeadingText",
            start: e[s][1].start,
            end: e[i][1].end
        },
        r = {
            type: "chunkText",
            start: e[s][1].start,
            end: e[i][1].end,
            contentType: "text"
        },
        He(e, s, i - s + 1, [["enter", n, t], ["enter", r, t], ["exit", r, t], ["exit", n, t]]));
        return e
    },
    tokenize: function(e, t, n) {
        let r = 0;
        return function(t) {
            return e.enter("atxHeading"),
            function(t) {
                return e.enter("atxHeadingSequence"),
                i(t)
            }(t)
        }
        ;
        function i(t) {
            return 35 === t && r++ < 6 ? (e.consume(t),
            i) : null === t || tt(t) ? (e.exit("atxHeadingSequence"),
            s(t)) : n(t)
        }
        function s(n) {
            return 35 === n ? (e.enter("atxHeadingSequence"),
            o(n)) : null === n || et(n) ? (e.exit("atxHeading"),
            t(n)) : nt(n) ? at(e, s, "whitespace")(n) : (e.enter("atxHeadingText"),
            a(n))
        }
        function o(t) {
            return 35 === t ? (e.consume(t),
            o) : (e.exit("atxHeadingSequence"),
            s(t))
        }
        function a(t) {
            return null === t || 35 === t || tt(t) ? (e.exit("atxHeadingText"),
            s(t)) : (e.consume(t),
            a)
        }
    }
};
const Ht = ["address", "article", "aside", "base", "basefont", "blockquote", "body", "caption", "center", "col", "colgroup", "dd", "details", "dialog", "dir", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "iframe", "legend", "li", "link", "main", "menu", "menuitem", "nav", "noframes", "ol", "optgroup", "option", "p", "param", "search", "section", "summary", "table", "tbody", "td", "tfoot", "th", "thead", "title", "tr", "track", "ul"]
  , Ut = ["pre", "script", "style", "textarea"]
  , Gt = {
    concrete: !0,
    name: "htmlFlow",
    resolveTo: function(e) {
        let t = e.length;
        for (; t-- && ("enter" !== e[t][0] || "htmlFlow" !== e[t][1].type); )
            ;
        t > 1 && "linePrefix" === e[t - 2][1].type && (e[t][1].start = e[t - 2][1].start,
        e[t + 1][1].start = e[t - 2][1].start,
        e.splice(t - 2, 2));
        return e
    },
    tokenize: function(e, t, n) {
        const r = this;
        let i, s, o, a, c;
        return function(t) {
            return function(t) {
                return e.enter("htmlFlow"),
                e.enter("htmlFlowData"),
                e.consume(t),
                l
            }(t)
        }
        ;
        function l(a) {
            return 33 === a ? (e.consume(a),
            u) : 47 === a ? (e.consume(a),
            s = !0,
            d) : 63 === a ? (e.consume(a),
            i = 3,
            r.interrupt ? t : x) : je(a) ? (e.consume(a),
            o = String.fromCharCode(a),
            f) : n(a)
        }
        function u(s) {
            return 45 === s ? (e.consume(s),
            i = 2,
            h) : 91 === s ? (e.consume(s),
            i = 5,
            a = 0,
            p) : je(s) ? (e.consume(s),
            i = 4,
            r.interrupt ? t : x) : n(s)
        }
        function h(i) {
            return 45 === i ? (e.consume(i),
            r.interrupt ? t : x) : n(i)
        }
        function p(i) {
            const s = "CDATA[";
            return i === s.charCodeAt(a++) ? (e.consume(i),
            6 === a ? r.interrupt ? t : D : p) : n(i)
        }
        function d(t) {
            return je(t) ? (e.consume(t),
            o = String.fromCharCode(t),
            f) : n(t)
        }
        function f(a) {
            if (null === a || 47 === a || 62 === a || tt(a)) {
                const c = 47 === a
                  , l = o.toLowerCase();
                return c || s || !Ut.includes(l) ? Ht.includes(o.toLowerCase()) ? (i = 6,
                c ? (e.consume(a),
                m) : r.interrupt ? t(a) : D(a)) : (i = 7,
                r.interrupt && !r.parser.lazy[r.now().line] ? n(a) : s ? E(a) : T(a)) : (i = 1,
                r.interrupt ? t(a) : D(a))
            }
            return 45 === a || We(a) ? (e.consume(a),
            o += String.fromCharCode(a),
            f) : n(a)
        }
        function m(i) {
            return 62 === i ? (e.consume(i),
            r.interrupt ? t : D) : n(i)
        }
        function E(t) {
            return nt(t) ? (e.consume(t),
            E) : S(t)
        }
        function T(t) {
            return 47 === t ? (e.consume(t),
            S) : 58 === t || 95 === t || je(t) ? (e.consume(t),
            g) : nt(t) ? (e.consume(t),
            T) : S(t)
        }
        function g(t) {
            return 45 === t || 46 === t || 58 === t || 95 === t || We(t) ? (e.consume(t),
            g) : A(t)
        }
        function A(t) {
            return 61 === t ? (e.consume(t),
            _) : nt(t) ? (e.consume(t),
            A) : T(t)
        }
        function _(t) {
            return null === t || 60 === t || 61 === t || 62 === t || 96 === t ? n(t) : 34 === t || 39 === t ? (e.consume(t),
            c = t,
            I) : nt(t) ? (e.consume(t),
            _) : N(t)
        }
        function I(t) {
            return t === c ? (e.consume(t),
            c = null,
            k) : null === t || et(t) ? n(t) : (e.consume(t),
            I)
        }
        function N(t) {
            return null === t || 34 === t || 39 === t || 47 === t || 60 === t || 61 === t || 62 === t || 96 === t || tt(t) ? A(t) : (e.consume(t),
            N)
        }
        function k(e) {
            return 47 === e || 62 === e || nt(e) ? T(e) : n(e)
        }
        function S(t) {
            return 62 === t ? (e.consume(t),
            C) : n(t)
        }
        function C(t) {
            return null === t || et(t) ? D(t) : nt(t) ? (e.consume(t),
            C) : n(t)
        }
        function D(t) {
            return 45 === t && 2 === i ? (e.consume(t),
            R) : 60 === t && 1 === i ? (e.consume(t),
            L) : 62 === t && 4 === i ? (e.consume(t),
            v) : 63 === t && 3 === i ? (e.consume(t),
            x) : 93 === t && 5 === i ? (e.consume(t),
            M) : !et(t) || 6 !== i && 7 !== i ? null === t || et(t) ? (e.exit("htmlFlowData"),
            O(t)) : (e.consume(t),
            D) : (e.exit("htmlFlowData"),
            e.check(Yt, w, O)(t))
        }
        function O(t) {
            return e.check(zt, y, w)(t)
        }
        function y(t) {
            return e.enter("lineEnding"),
            e.consume(t),
            e.exit("lineEnding"),
            b
        }
        function b(t) {
            return null === t || et(t) ? O(t) : (e.enter("htmlFlowData"),
            D(t))
        }
        function R(t) {
            return 45 === t ? (e.consume(t),
            x) : D(t)
        }
        function L(t) {
            return 47 === t ? (e.consume(t),
            o = "",
            P) : D(t)
        }
        function P(t) {
            if (62 === t) {
                const n = o.toLowerCase();
                return Ut.includes(n) ? (e.consume(t),
                v) : D(t)
            }
            return je(t) && o.length < 8 ? (e.consume(t),
            o += String.fromCharCode(t),
            P) : D(t)
        }
        function M(t) {
            return 93 === t ? (e.consume(t),
            x) : D(t)
        }
        function x(t) {
            return 62 === t ? (e.consume(t),
            v) : 45 === t && 2 === i ? (e.consume(t),
            x) : D(t)
        }
        function v(t) {
            return null === t || et(t) ? (e.exit("htmlFlowData"),
            w(t)) : (e.consume(t),
            v)
        }
        function w(n) {
            return e.exit("htmlFlow"),
            t(n)
        }
    }
}
  , Yt = {
    partial: !0,
    tokenize: function(e, t, n) {
        return function(r) {
            return e.enter("lineEnding"),
            e.consume(r),
            e.exit("lineEnding"),
            e.attempt(Et, t, n)
        }
    }
}
  , zt = {
    partial: !0,
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            if (et(t))
                return e.enter("lineEnding"),
                e.consume(t),
                e.exit("lineEnding"),
                i;
            return n(t)
        }
        ;
        function i(e) {
            return r.parser.lazy[r.now().line] ? n(e) : t(e)
        }
    }
};
const qt = {
    name: "htmlText",
    tokenize: function(e, t, n) {
        const r = this;
        let i, s, o;
        return function(t) {
            return e.enter("htmlText"),
            e.enter("htmlTextData"),
            e.consume(t),
            a
        }
        ;
        function a(t) {
            return 33 === t ? (e.consume(t),
            c) : 47 === t ? (e.consume(t),
            _) : 63 === t ? (e.consume(t),
            g) : je(t) ? (e.consume(t),
            k) : n(t)
        }
        function c(t) {
            return 45 === t ? (e.consume(t),
            l) : 91 === t ? (e.consume(t),
            s = 0,
            d) : je(t) ? (e.consume(t),
            T) : n(t)
        }
        function l(t) {
            return 45 === t ? (e.consume(t),
            p) : n(t)
        }
        function u(t) {
            return null === t ? n(t) : 45 === t ? (e.consume(t),
            h) : et(t) ? (o = u,
            P(t)) : (e.consume(t),
            u)
        }
        function h(t) {
            return 45 === t ? (e.consume(t),
            p) : u(t)
        }
        function p(e) {
            return 62 === e ? L(e) : 45 === e ? h(e) : u(e)
        }
        function d(t) {
            const r = "CDATA[";
            return t === r.charCodeAt(s++) ? (e.consume(t),
            6 === s ? f : d) : n(t)
        }
        function f(t) {
            return null === t ? n(t) : 93 === t ? (e.consume(t),
            m) : et(t) ? (o = f,
            P(t)) : (e.consume(t),
            f)
        }
        function m(t) {
            return 93 === t ? (e.consume(t),
            E) : f(t)
        }
        function E(t) {
            return 62 === t ? L(t) : 93 === t ? (e.consume(t),
            E) : f(t)
        }
        function T(t) {
            return null === t || 62 === t ? L(t) : et(t) ? (o = T,
            P(t)) : (e.consume(t),
            T)
        }
        function g(t) {
            return null === t ? n(t) : 63 === t ? (e.consume(t),
            A) : et(t) ? (o = g,
            P(t)) : (e.consume(t),
            g)
        }
        function A(e) {
            return 62 === e ? L(e) : g(e)
        }
        function _(t) {
            return je(t) ? (e.consume(t),
            I) : n(t)
        }
        function I(t) {
            return 45 === t || We(t) ? (e.consume(t),
            I) : N(t)
        }
        function N(t) {
            return et(t) ? (o = N,
            P(t)) : nt(t) ? (e.consume(t),
            N) : L(t)
        }
        function k(t) {
            return 45 === t || We(t) ? (e.consume(t),
            k) : 47 === t || 62 === t || tt(t) ? S(t) : n(t)
        }
        function S(t) {
            return 47 === t ? (e.consume(t),
            L) : 58 === t || 95 === t || je(t) ? (e.consume(t),
            C) : et(t) ? (o = S,
            P(t)) : nt(t) ? (e.consume(t),
            S) : L(t)
        }
        function C(t) {
            return 45 === t || 46 === t || 58 === t || 95 === t || We(t) ? (e.consume(t),
            C) : D(t)
        }
        function D(t) {
            return 61 === t ? (e.consume(t),
            O) : et(t) ? (o = D,
            P(t)) : nt(t) ? (e.consume(t),
            D) : S(t)
        }
        function O(t) {
            return null === t || 60 === t || 61 === t || 62 === t || 96 === t ? n(t) : 34 === t || 39 === t ? (e.consume(t),
            i = t,
            y) : et(t) ? (o = O,
            P(t)) : nt(t) ? (e.consume(t),
            O) : (e.consume(t),
            b)
        }
        function y(t) {
            return t === i ? (e.consume(t),
            i = void 0,
            R) : null === t ? n(t) : et(t) ? (o = y,
            P(t)) : (e.consume(t),
            y)
        }
        function b(t) {
            return null === t || 34 === t || 39 === t || 60 === t || 61 === t || 96 === t ? n(t) : 47 === t || 62 === t || tt(t) ? S(t) : (e.consume(t),
            b)
        }
        function R(e) {
            return 47 === e || 62 === e || tt(e) ? S(e) : n(e)
        }
        function L(r) {
            return 62 === r ? (e.consume(r),
            e.exit("htmlTextData"),
            e.exit("htmlText"),
            t) : n(r)
        }
        function P(t) {
            return e.exit("htmlTextData"),
            e.enter("lineEnding"),
            e.consume(t),
            e.exit("lineEnding"),
            M
        }
        function M(t) {
            return nt(t) ? at(e, x, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : x(t)
        }
        function x(t) {
            return e.enter("htmlTextData"),
            o(t)
        }
    }
};
const Vt = {
    name: "labelEnd",
    resolveAll: function(e) {
        let t = -1;
        const n = [];
        for (; ++t < e.length; ) {
            const r = e[t][1];
            if (n.push(e[t]),
            "labelImage" === r.type || "labelLink" === r.type || "labelEnd" === r.type) {
                const e = "labelImage" === r.type ? 4 : 2;
                r.type = "data",
                t += e
            }
        }
        e.length !== n.length && He(e, 0, e.length, n);
        return e
    },
    resolveTo: function(e, t) {
        let n, r, i, s, o = e.length, a = 0;
        for (; o--; )
            if (n = e[o][1],
            r) {
                if ("link" === n.type || "labelLink" === n.type && n._inactive)
                    break;
                "enter" === e[o][0] && "labelLink" === n.type && (n._inactive = !0)
            } else if (i) {
                if ("enter" === e[o][0] && ("labelImage" === n.type || "labelLink" === n.type) && !n._balanced && (r = o,
                "labelLink" !== n.type)) {
                    a = 2;
                    break
                }
            } else
                "labelEnd" === n.type && (i = o);
        const c = {
            type: "labelLink" === e[r][1].type ? "link" : "image",
            start: {
                ...e[r][1].start
            },
            end: {
                ...e[e.length - 1][1].end
            }
        }
          , l = {
            type: "label",
            start: {
                ...e[r][1].start
            },
            end: {
                ...e[i][1].end
            }
        }
          , u = {
            type: "labelText",
            start: {
                ...e[r + a + 2][1].end
            },
            end: {
                ...e[i - 2][1].start
            }
        };
        return s = [["enter", c, t], ["enter", l, t]],
        s = Ue(s, e.slice(r + 1, r + a + 3)),
        s = Ue(s, [["enter", u, t]]),
        s = Ue(s, pt(t.parser.constructs.insideSpan.null, e.slice(r + a + 4, i - 3), t)),
        s = Ue(s, [["exit", u, t], e[i - 2], e[i - 1], ["exit", l, t]]),
        s = Ue(s, e.slice(i + 1)),
        s = Ue(s, [["exit", c, t]]),
        He(e, r, e.length, s),
        e
    },
    tokenize: function(e, t, n) {
        const r = this;
        let i, s, o = r.events.length;
        for (; o--; )
            if (("labelImage" === r.events[o][1].type || "labelLink" === r.events[o][1].type) && !r.events[o][1]._balanced) {
                i = r.events[o][1];
                break
            }
        return function(t) {
            if (!i)
                return n(t);
            if (i._inactive)
                return u(t);
            return s = r.parser.defined.includes(Qe(r.sliceSerialize({
                start: i.end,
                end: r.now()
            }))),
            e.enter("labelEnd"),
            e.enter("labelMarker"),
            e.consume(t),
            e.exit("labelMarker"),
            e.exit("labelEnd"),
            a
        }
        ;
        function a(t) {
            return 40 === t ? e.attempt(Qt, l, s ? l : u)(t) : 91 === t ? e.attempt(jt, l, s ? c : u)(t) : s ? l(t) : u(t)
        }
        function c(t) {
            return e.attempt(Wt, l, u)(t)
        }
        function l(e) {
            return t(e)
        }
        function u(e) {
            return i._balanced = !0,
            n(e)
        }
    }
}
  , Qt = {
    tokenize: function(e, t, n) {
        return function(t) {
            return e.enter("resource"),
            e.enter("resourceMarker"),
            e.consume(t),
            e.exit("resourceMarker"),
            r
        }
        ;
        function r(t) {
            return tt(t) ? xt(e, i)(t) : i(t)
        }
        function i(t) {
            return 41 === t ? l(t) : Lt(e, s, o, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(t)
        }
        function s(t) {
            return tt(t) ? xt(e, a)(t) : l(t)
        }
        function o(e) {
            return n(e)
        }
        function a(t) {
            return 34 === t || 39 === t || 40 === t ? Mt(e, c, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(t) : l(t)
        }
        function c(t) {
            return tt(t) ? xt(e, l)(t) : l(t)
        }
        function l(r) {
            return 41 === r ? (e.enter("resourceMarker"),
            e.consume(r),
            e.exit("resourceMarker"),
            e.exit("resource"),
            t) : n(r)
        }
    }
}
  , jt = {
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            return Pt.call(r, e, i, s, "reference", "referenceMarker", "referenceString")(t)
        }
        ;
        function i(e) {
            return r.parser.defined.includes(Qe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(e) : n(e)
        }
        function s(e) {
            return n(e)
        }
    }
}
  , Wt = {
    tokenize: function(e, t, n) {
        return function(t) {
            return e.enter("reference"),
            e.enter("referenceMarker"),
            e.consume(t),
            e.exit("referenceMarker"),
            r
        }
        ;
        function r(r) {
            return 93 === r ? (e.enter("referenceMarker"),
            e.consume(r),
            e.exit("referenceMarker"),
            e.exit("reference"),
            t) : n(r)
        }
    }
};
const Kt = {
    name: "labelStartImage",
    resolveAll: Vt.resolveAll,
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            return e.enter("labelImage"),
            e.enter("labelImageMarker"),
            e.consume(t),
            e.exit("labelImageMarker"),
            i
        }
        ;
        function i(t) {
            return 91 === t ? (e.enter("labelMarker"),
            e.consume(t),
            e.exit("labelMarker"),
            e.exit("labelImage"),
            s) : n(t)
        }
        function s(e) {
            return 94 === e && "_hiddenFootnoteSupport"in r.parser.constructs ? n(e) : t(e)
        }
    }
};
const Xt = {
    name: "labelStartLink",
    resolveAll: Vt.resolveAll,
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            return e.enter("labelLink"),
            e.enter("labelMarker"),
            e.consume(t),
            e.exit("labelMarker"),
            e.exit("labelLink"),
            i
        }
        ;
        function i(e) {
            return 94 === e && "_hiddenFootnoteSupport"in r.parser.constructs ? n(e) : t(e)
        }
    }
};
const Jt = {
    name: "lineEnding",
    tokenize: function(e, t) {
        return function(n) {
            return e.enter("lineEnding"),
            e.consume(n),
            e.exit("lineEnding"),
            at(e, t, "linePrefix")
        }
    }
};
const $t = {
    name: "thematicBreak",
    tokenize: function(e, t, n) {
        let r, i = 0;
        return function(t) {
            return e.enter("thematicBreak"),
            function(e) {
                return r = e,
                s(e)
            }(t)
        }
        ;
        function s(s) {
            return s === r ? (e.enter("thematicBreakSequence"),
            o(s)) : i >= 3 && (null === s || et(s)) ? (e.exit("thematicBreak"),
            t(s)) : n(s)
        }
        function o(t) {
            return t === r ? (e.consume(t),
            i++,
            o) : (e.exit("thematicBreakSequence"),
            nt(t) ? at(e, s, "whitespace")(t) : s(t))
        }
    }
};
const Zt = {
    continuation: {
        tokenize: function(e, t, n) {
            const r = this;
            return r.containerState._closeFlow = void 0,
            e.check(Et, function(n) {
                return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine,
                at(e, t, "listItemIndent", r.containerState.size + 1)(n)
            }, function(n) {
                if (r.containerState.furtherBlankLines || !nt(n))
                    return r.containerState.furtherBlankLines = void 0,
                    r.containerState.initialBlankLine = void 0,
                    i(n);
                return r.containerState.furtherBlankLines = void 0,
                r.containerState.initialBlankLine = void 0,
                e.attempt(tn, t, i)(n)
            });
            function i(i) {
                return r.containerState._closeFlow = !0,
                r.interrupt = void 0,
                at(e, e.attempt(Zt, t, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(i)
            }
        }
    },
    exit: function(e) {
        e.exit(this.containerState.type)
    },
    name: "list",
    tokenize: function(e, t, n) {
        const r = this
          , i = r.events[r.events.length - 1];
        let s = i && "linePrefix" === i[1].type ? i[2].sliceSerialize(i[1], !0).length : 0
          , o = 0;
        return function(t) {
            const i = r.containerState.type || (42 === t || 43 === t || 45 === t ? "listUnordered" : "listOrdered");
            if ("listUnordered" === i ? !r.containerState.marker || t === r.containerState.marker : Je(t)) {
                if (r.containerState.type || (r.containerState.type = i,
                e.enter(i, {
                    _container: !0
                })),
                "listUnordered" === i)
                    return e.enter("listItemPrefix"),
                    42 === t || 45 === t ? e.check($t, n, c)(t) : c(t);
                if (!r.interrupt || 49 === t)
                    return e.enter("listItemPrefix"),
                    e.enter("listItemValue"),
                    a(t)
            }
            return n(t)
        }
        ;
        function a(t) {
            return Je(t) && ++o < 10 ? (e.consume(t),
            a) : (!r.interrupt || o < 2) && (r.containerState.marker ? t === r.containerState.marker : 41 === t || 46 === t) ? (e.exit("listItemValue"),
            c(t)) : n(t)
        }
        function c(t) {
            return e.enter("listItemMarker"),
            e.consume(t),
            e.exit("listItemMarker"),
            r.containerState.marker = r.containerState.marker || t,
            e.check(Et, r.interrupt ? n : l, e.attempt(en, h, u))
        }
        function l(e) {
            return r.containerState.initialBlankLine = !0,
            s++,
            h(e)
        }
        function u(t) {
            return nt(t) ? (e.enter("listItemPrefixWhitespace"),
            e.consume(t),
            e.exit("listItemPrefixWhitespace"),
            h) : n(t)
        }
        function h(n) {
            return r.containerState.size = s + r.sliceSerialize(e.exit("listItemPrefix"), !0).length,
            t(n)
        }
    }
}
  , en = {
    partial: !0,
    tokenize: function(e, t, n) {
        const r = this;
        return at(e, function(e) {
            const i = r.events[r.events.length - 1];
            return !nt(e) && i && "listItemPrefixWhitespace" === i[1].type ? t(e) : n(e)
        }, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5)
    }
}
  , tn = {
    partial: !0,
    tokenize: function(e, t, n) {
        const r = this;
        return at(e, function(e) {
            const i = r.events[r.events.length - 1];
            return i && "listItemIndent" === i[1].type && i[2].sliceSerialize(i[1], !0).length === r.containerState.size ? t(e) : n(e)
        }, "listItemIndent", r.containerState.size + 1)
    }
};
const nn = {
    name: "setextUnderline",
    resolveTo: function(e, t) {
        let n, r, i, s = e.length;
        for (; s--; )
            if ("enter" === e[s][0]) {
                if ("content" === e[s][1].type) {
                    n = s;
                    break
                }
                "paragraph" === e[s][1].type && (r = s)
            } else
                "content" === e[s][1].type && e.splice(s, 1),
                i || "definition" !== e[s][1].type || (i = s);
        const o = {
            type: "setextHeading",
            start: {
                ...e[n][1].start
            },
            end: {
                ...e[e.length - 1][1].end
            }
        };
        e[r][1].type = "setextHeadingText",
        i ? (e.splice(r, 0, ["enter", o, t]),
        e.splice(i + 1, 0, ["exit", e[n][1], t]),
        e[n][1].end = {
            ...e[i][1].end
        }) : e[n][1] = o;
        return e.push(["exit", o, t]),
        e
    },
    tokenize: function(e, t, n) {
        const r = this;
        let i;
        return function(t) {
            let o, a = r.events.length;
            for (; a--; )
                if ("lineEnding" !== r.events[a][1].type && "linePrefix" !== r.events[a][1].type && "content" !== r.events[a][1].type) {
                    o = "paragraph" === r.events[a][1].type;
                    break
                }
            if (!r.parser.lazy[r.now().line] && (r.interrupt || o))
                return e.enter("setextHeadingLine"),
                i = t,
                function(t) {
                    return e.enter("setextHeadingLineSequence"),
                    s(t)
                }(t);
            return n(t)
        }
        ;
        function s(t) {
            return t === i ? (e.consume(t),
            s) : (e.exit("setextHeadingLineSequence"),
            nt(t) ? at(e, o, "lineSuffix")(t) : o(t))
        }
        function o(r) {
            return null === r || et(r) ? (e.exit("setextHeadingLine"),
            t(r)) : n(r)
        }
    }
};
const rn = {
    tokenize: function(e) {
        const t = this
          , n = e.attempt(Et, function(r) {
            if (null === r)
                return void e.consume(r);
            return e.enter("lineEndingBlank"),
            e.consume(r),
            e.exit("lineEndingBlank"),
            t.currentConstruct = void 0,
            n
        }, e.attempt(this.parser.constructs.flowInitial, r, at(e, e.attempt(this.parser.constructs.flow, r, e.attempt(bt, r)), "linePrefix")));
        return n;
        function r(r) {
            if (null !== r)
                return e.enter("lineEnding"),
                e.consume(r),
                e.exit("lineEnding"),
                t.currentConstruct = void 0,
                n;
            e.consume(r)
        }
    }
};
const sn = {
    resolveAll: ln()
}
  , on = cn("string")
  , an = cn("text");
function cn(e) {
    return {
        resolveAll: ln("text" === e ? un : void 0),
        tokenize: function(t) {
            const n = this
              , r = this.parser.constructs[e]
              , i = t.attempt(r, s, o);
            return s;
            function s(e) {
                return c(e) ? i(e) : o(e)
            }
            function o(e) {
                if (null !== e)
                    return t.enter("data"),
                    t.consume(e),
                    a;
                t.consume(e)
            }
            function a(e) {
                return c(e) ? (t.exit("data"),
                i(e)) : (t.consume(e),
                a)
            }
            function c(e) {
                if (null === e)
                    return !0;
                const t = r[e];
                let i = -1;
                if (t)
                    for (; ++i < t.length; ) {
                        const e = t[i];
                        if (!e.previous || e.previous.call(n, n.previous))
                            return !0
                    }
                return !1
            }
        }
    }
}
function ln(e) {
    return function(t, n) {
        let r, i = -1;
        for (; ++i <= t.length; )
            void 0 === r ? t[i] && "data" === t[i][1].type && (r = i,
            i++) : t[i] && "data" === t[i][1].type || (i !== r + 2 && (t[r][1].end = t[i - 1][1].end,
            t.splice(r + 2, i - r - 2),
            i = r + 2),
            r = void 0);
        return e ? e(t, n) : t
    }
}
function un(e, t) {
    let n = 0;
    for (; ++n <= e.length; )
        if ((n === e.length || "lineEnding" === e[n][1].type) && "data" === e[n - 1][1].type) {
            const r = e[n - 1][1]
              , i = t.sliceStream(r);
            let s, o = i.length, a = -1, c = 0;
            for (; o--; ) {
                const e = i[o];
                if ("string" == typeof e) {
                    for (a = e.length; 32 === e.charCodeAt(a - 1); )
                        c++,
                        a--;
                    if (a)
                        break;
                    a = -1
                } else if (-2 === e)
                    s = !0,
                    c++;
                else if (-1 !== e) {
                    o++;
                    break
                }
            }
            if (t._contentTypeTextTrailing && n === e.length && (c = 0),
            c) {
                const i = {
                    type: n === e.length || s || c < 2 ? "lineSuffix" : "hardBreakTrailing",
                    start: {
                        _bufferIndex: o ? a : r.start._bufferIndex + a,
                        _index: r.start._index + o,
                        line: r.end.line,
                        column: r.end.column - c,
                        offset: r.end.offset - c
                    },
                    end: {
                        ...r.end
                    }
                };
                r.end = {
                    ...i.start
                },
                r.start.offset === r.end.offset ? Object.assign(r, i) : (e.splice(n, 0, ["enter", i, t], ["exit", i, t]),
                n += 2)
            }
            n++
        }
    return e
}
const hn = {
    42: Zt,
    43: Zt,
    45: Zt,
    48: Zt,
    49: Zt,
    50: Zt,
    51: Zt,
    52: Zt,
    53: Zt,
    54: Zt,
    55: Zt,
    56: Zt,
    57: Zt,
    62: Tt
}
  , pn = {
    91: vt
}
  , dn = {
    [-2]: Nt,
    [-1]: Nt,
    32: Nt
}
  , fn = {
    35: Bt,
    42: $t,
    45: [nn, $t],
    60: Gt,
    61: nn,
    95: $t,
    96: It,
    126: It
}
  , mn = {
    38: At,
    92: gt
}
  , En = {
    [-5]: Jt,
    [-4]: Jt,
    [-3]: Jt,
    33: Kt,
    38: At,
    42: dt,
    60: [mt, qt],
    91: Xt,
    92: [Ft, gt],
    93: Vt,
    95: dt,
    96: St
}
  , Tn = {
    null: [dt, sn]
}
  , gn = Object.freeze(Object.defineProperty({
    __proto__: null,
    attentionMarkers: {
        null: [42, 95]
    },
    contentInitial: pn,
    disable: {
        null: []
    },
    document: hn,
    flow: fn,
    flowInitial: dn,
    insideSpan: Tn,
    string: mn,
    text: En
}, Symbol.toStringTag, {
    value: "Module"
}));
function An(e, t, n) {
    let r = {
        _bufferIndex: -1,
        _index: 0,
        line: n && n.line || 1,
        column: n && n.column || 1,
        offset: n && n.offset || 0
    };
    const i = {}
      , s = [];
    let o = []
      , a = [];
    const c = {
        attempt: E(function(e, t) {
            T(e, t.from)
        }),
        check: E(m),
        consume: function(e) {
            et(e) ? (r.line++,
            r.column = 1,
            r.offset += -3 === e ? 2 : 1,
            g()) : -1 !== e && (r.column++,
            r.offset++);
            r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++,
            r._bufferIndex === o[r._index].length && (r._bufferIndex = -1,
            r._index++));
            l.previous = e
        },
        enter: function(e, t) {
            const n = t || {};
            return n.type = e,
            n.start = p(),
            l.events.push(["enter", n, l]),
            a.push(n),
            n
        },
        exit: function(e) {
            const t = a.pop();
            return t.end = p(),
            l.events.push(["exit", t, l]),
            t
        },
        interrupt: E(m, {
            interrupt: !0
        })
    }
      , l = {
        code: null,
        containerState: {},
        defineSkip: function(e) {
            i[e.line] = e.column,
            g()
        },
        events: [],
        now: p,
        parser: e,
        previous: null,
        sliceSerialize: function(e, t) {
            return function(e, t) {
                let n = -1;
                const r = [];
                let i;
                for (; ++n < e.length; ) {
                    const s = e[n];
                    let o;
                    if ("string" == typeof s)
                        o = s;
                    else
                        switch (s) {
                        case -5:
                            o = "\r";
                            break;
                        case -4:
                            o = "\n";
                            break;
                        case -3:
                            o = "\r\n";
                            break;
                        case -2:
                            o = t ? " " : "\t";
                            break;
                        case -1:
                            if (!t && i)
                                continue;
                            o = " ";
                            break;
                        default:
                            o = String.fromCharCode(s)
                        }
                    i = -2 === s,
                    r.push(o)
                }
                return r.join("")
            }(h(e), t)
        },
        sliceStream: h,
        write: function(e) {
            if (o = Ue(o, e),
            d(),
            null !== o[o.length - 1])
                return [];
            return T(t, 0),
            l.events = pt(s, l.events, l),
            l.events
        }
    };
    let u = t.tokenize.call(l, c);
    return t.resolveAll && s.push(t),
    l;
    function h(e) {
        return function(e, t) {
            const n = t.start._index
              , r = t.start._bufferIndex
              , i = t.end._index
              , s = t.end._bufferIndex;
            let o;
            if (n === i)
                o = [e[n].slice(r, s)];
            else {
                if (o = e.slice(n, i),
                r > -1) {
                    const e = o[0];
                    "string" == typeof e ? o[0] = e.slice(r) : o.shift()
                }
                s > 0 && o.push(e[i].slice(0, s))
            }
            return o
        }(o, e)
    }
    function p() {
        const {_bufferIndex: e, _index: t, line: n, column: i, offset: s} = r;
        return {
            _bufferIndex: e,
            _index: t,
            line: n,
            column: i,
            offset: s
        }
    }
    function d() {
        let e;
        for (; r._index < o.length; ) {
            const t = o[r._index];
            if ("string" == typeof t)
                for (e = r._index,
                r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === e && r._bufferIndex < t.length; )
                    f(t.charCodeAt(r._bufferIndex));
            else
                f(t)
        }
    }
    function f(e) {
        u = u(e)
    }
    function m(e, t) {
        t.restore()
    }
    function E(e, t) {
        return function(n, i, s) {
            let o, u, h, d;
            return Array.isArray(n) ? f(n) : "tokenize"in n ? f([n]) : function(e) {
                return t;
                function t(t) {
                    const n = null !== t && e[t]
                      , r = null !== t && e.null;
                    return f([...Array.isArray(n) ? n : n ? [n] : [], ...Array.isArray(r) ? r : r ? [r] : []])(t)
                }
            }(n);
            function f(e) {
                return o = e,
                u = 0,
                0 === e.length ? s : m(e[u])
            }
            function m(e) {
                return function(n) {
                    d = function() {
                        const e = p()
                          , t = l.previous
                          , n = l.currentConstruct
                          , i = l.events.length
                          , s = Array.from(a);
                        return {
                            from: i,
                            restore: o
                        };
                        function o() {
                            r = e,
                            l.previous = t,
                            l.currentConstruct = n,
                            l.events.length = i,
                            a = s,
                            g()
                        }
                    }(),
                    h = e,
                    e.partial || (l.currentConstruct = e);
                    if (e.name && l.parser.constructs.disable.null.includes(e.name))
                        return T();
                    return e.tokenize.call(t ? Object.assign(Object.create(l), t) : l, c, E, T)(n)
                }
            }
            function E(t) {
                return e(h, d),
                i
            }
            function T(e) {
                return d.restore(),
                ++u < o.length ? m(o[u]) : s
            }
        }
    }
    function T(e, t) {
        e.resolveAll && !s.includes(e) && s.push(e),
        e.resolve && He(l.events, t, l.events.length - t, e.resolve(l.events.slice(t), l)),
        e.resolveTo && (l.events = e.resolveTo(l.events, l))
    }
    function g() {
        r.line in i && r.column < 2 && (r.column = i[r.line],
        r.offset += i[r.line] - 1)
    }
}
const _n = /[\0\t\n\r]/g;
const In = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function Nn(e, t, n) {
    if (t)
        return t;
    if (35 === n.charCodeAt(0)) {
        const e = n.charCodeAt(1)
          , t = 120 === e || 88 === e;
        return Ve(n.slice(t ? 2 : 1), t ? 16 : 10)
    }
    return Be(n) || e
}
const kn = {}.hasOwnProperty;
function Sn(e, t, n) {
    return "string" != typeof t && (n = t,
    t = void 0),
    function(e) {
        const t = {
            transforms: [],
            canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
            enter: {
                autolink: s(te),
                autolinkProtocol: C,
                autolinkEmail: C,
                atxHeading: s(J),
                blockQuote: s(Q),
                characterEscape: C,
                characterReference: C,
                codeFenced: s(j),
                codeFencedFenceInfo: o,
                codeFencedFenceMeta: o,
                codeIndented: s(j, o),
                codeText: s(W, o),
                codeTextData: C,
                data: C,
                codeFlowValue: C,
                definition: s(K),
                definitionDestinationString: o,
                definitionLabelString: o,
                definitionTitleString: o,
                emphasis: s(X),
                hardBreakEscape: s($),
                hardBreakTrailing: s($),
                htmlFlow: s(Z, o),
                htmlFlowData: C,
                htmlText: s(Z, o),
                htmlTextData: C,
                image: s(ee),
                label: o,
                link: s(te),
                listItem: s(re),
                listItemValue: p,
                listOrdered: s(ne, h),
                listUnordered: s(ne),
                paragraph: s(ie),
                reference: H,
                referenceString: o,
                resourceDestinationString: o,
                resourceTitleString: o,
                setextHeading: s(J),
                strong: s(se),
                thematicBreak: s(ae)
            },
            exit: {
                atxHeading: c(),
                atxHeadingSequence: I,
                autolink: c(),
                autolinkEmail: V,
                autolinkProtocol: q,
                blockQuote: c(),
                characterEscapeValue: D,
                characterReferenceMarkerHexadecimal: G,
                characterReferenceMarkerNumeric: G,
                characterReferenceValue: Y,
                characterReference: z,
                codeFenced: c(E),
                codeFencedFence: m,
                codeFencedFenceInfo: d,
                codeFencedFenceMeta: f,
                codeFlowValue: D,
                codeIndented: c(T),
                codeText: c(L),
                codeTextData: D,
                data: D,
                definition: c(),
                definitionDestinationString: _,
                definitionLabelString: g,
                definitionTitleString: A,
                emphasis: c(),
                hardBreakEscape: c(y),
                hardBreakTrailing: c(y),
                htmlFlow: c(b),
                htmlFlowData: D,
                htmlText: c(R),
                htmlTextData: D,
                image: c(M),
                label: v,
                labelText: x,
                lineEnding: O,
                link: c(P),
                listItem: c(),
                listOrdered: c(),
                listUnordered: c(),
                paragraph: c(),
                referenceString: U,
                resourceDestinationString: w,
                resourceTitleString: F,
                resource: B,
                setextHeading: c(S),
                setextHeadingLineSequence: k,
                setextHeadingText: N,
                strong: c(),
                thematicBreak: c()
            }
        };
        Dn(t, (e || {}).mdastExtensions || []);
        const n = {};
        return r;
        function r(e) {
            let r = {
                type: "root",
                children: []
            };
            const s = {
                stack: [r],
                tokenStack: [],
                config: t,
                enter: a,
                exit: l,
                buffer: o,
                resume: u,
                data: n
            }
              , c = [];
            let h = -1;
            for (; ++h < e.length; )
                if ("listOrdered" === e[h][1].type || "listUnordered" === e[h][1].type)
                    if ("enter" === e[h][0])
                        c.push(h);
                    else {
                        h = i(e, c.pop(), h)
                    }
            for (h = -1; ++h < e.length; ) {
                const n = t[e[h][0]];
                kn.call(n, e[h][1].type) && n[e[h][1].type].call(Object.assign({
                    sliceSerialize: e[h][2].sliceSerialize
                }, s), e[h][1])
            }
            if (s.tokenStack.length > 0) {
                const e = s.tokenStack[s.tokenStack.length - 1];
                (e[1] || yn).call(s, void 0, e[0])
            }
            for (r.position = {
                start: Cn(e.length > 0 ? e[0][1].start : {
                    line: 1,
                    column: 1,
                    offset: 0
                }),
                end: Cn(e.length > 0 ? e[e.length - 2][1].end : {
                    line: 1,
                    column: 1,
                    offset: 0
                })
            },
            h = -1; ++h < t.transforms.length; )
                r = t.transforms[h](r) || r;
            return r
        }
        function i(e, t, n) {
            let r, i, s, o, a = t - 1, c = -1, l = !1;
            for (; ++a <= n; ) {
                const t = e[a];
                switch (t[1].type) {
                case "listUnordered":
                case "listOrdered":
                case "blockQuote":
                    "enter" === t[0] ? c++ : c--,
                    o = void 0;
                    break;
                case "lineEndingBlank":
                    "enter" === t[0] && (!r || o || c || s || (s = a),
                    o = void 0);
                    break;
                case "linePrefix":
                case "listItemValue":
                case "listItemMarker":
                case "listItemPrefix":
                case "listItemPrefixWhitespace":
                    break;
                default:
                    o = void 0
                }
                if (!c && "enter" === t[0] && "listItemPrefix" === t[1].type || -1 === c && "exit" === t[0] && ("listUnordered" === t[1].type || "listOrdered" === t[1].type)) {
                    if (r) {
                        let o = a;
                        for (i = void 0; o--; ) {
                            const t = e[o];
                            if ("lineEnding" === t[1].type || "lineEndingBlank" === t[1].type) {
                                if ("exit" === t[0])
                                    continue;
                                i && (e[i][1].type = "lineEndingBlank",
                                l = !0),
                                t[1].type = "lineEnding",
                                i = o
                            } else if ("linePrefix" !== t[1].type && "blockQuotePrefix" !== t[1].type && "blockQuotePrefixWhitespace" !== t[1].type && "blockQuoteMarker" !== t[1].type && "listItemIndent" !== t[1].type)
                                break
                        }
                        s && (!i || s < i) && (r._spread = !0),
                        r.end = Object.assign({}, i ? e[i][1].start : t[1].end),
                        e.splice(i || a, 0, ["exit", r, t[2]]),
                        a++,
                        n++
                    }
                    if ("listItemPrefix" === t[1].type) {
                        const i = {
                            type: "listItem",
                            _spread: !1,
                            start: Object.assign({}, t[1].start),
                            end: void 0
                        };
                        r = i,
                        e.splice(a, 0, ["enter", i, t[2]]),
                        a++,
                        n++,
                        s = void 0,
                        o = !0
                    }
                }
            }
            return e[t][1]._spread = l,
            n
        }
        function s(e, t) {
            return n;
            function n(n) {
                a.call(this, e(n), n),
                t && t.call(this, n)
            }
        }
        function o() {
            this.stack.push({
                type: "fragment",
                children: []
            })
        }
        function a(e, t, n) {
            this.stack[this.stack.length - 1].children.push(e),
            this.stack.push(e),
            this.tokenStack.push([t, n || void 0]),
            e.position = {
                start: Cn(t.start),
                end: void 0
            }
        }
        function c(e) {
            return t;
            function t(t) {
                e && e.call(this, t),
                l.call(this, t)
            }
        }
        function l(e, t) {
            const n = this.stack.pop()
              , r = this.tokenStack.pop();
            if (!r)
                throw new Error("Cannot close `" + e.type + "` (" + he({
                    start: e.start,
                    end: e.end
                }) + "): it’s not open");
            if (r[0].type !== e.type)
                if (t)
                    t.call(this, e, r[0]);
                else {
                    (r[1] || yn).call(this, e, r[0])
                }
            n.position.end = Cn(e.end)
        }
        function u() {
            return xe(this.stack.pop())
        }
        function h() {
            this.data.expectingFirstListItemValue = !0
        }
        function p(e) {
            if (this.data.expectingFirstListItemValue) {
                this.stack[this.stack.length - 2].start = Number.parseInt(this.sliceSerialize(e), 10),
                this.data.expectingFirstListItemValue = void 0
            }
        }
        function d() {
            const e = this.resume();
            this.stack[this.stack.length - 1].lang = e
        }
        function f() {
            const e = this.resume();
            this.stack[this.stack.length - 1].meta = e
        }
        function m() {
            this.data.flowCodeInside || (this.buffer(),
            this.data.flowCodeInside = !0)
        }
        function E() {
            const e = this.resume();
            this.stack[this.stack.length - 1].value = e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""),
            this.data.flowCodeInside = void 0
        }
        function T() {
            const e = this.resume();
            this.stack[this.stack.length - 1].value = e.replace(/(\r?\n|\r)$/g, "")
        }
        function g(e) {
            const t = this.resume()
              , n = this.stack[this.stack.length - 1];
            n.label = t,
            n.identifier = Qe(this.sliceSerialize(e)).toLowerCase()
        }
        function A() {
            const e = this.resume();
            this.stack[this.stack.length - 1].title = e
        }
        function _() {
            const e = this.resume();
            this.stack[this.stack.length - 1].url = e
        }
        function I(e) {
            const t = this.stack[this.stack.length - 1];
            if (!t.depth) {
                const n = this.sliceSerialize(e).length;
                t.depth = n
            }
        }
        function N() {
            this.data.setextHeadingSlurpLineEnding = !0
        }
        function k(e) {
            this.stack[this.stack.length - 1].depth = 61 === this.sliceSerialize(e).codePointAt(0) ? 1 : 2
        }
        function S() {
            this.data.setextHeadingSlurpLineEnding = void 0
        }
        function C(e) {
            const t = this.stack[this.stack.length - 1].children;
            let n = t[t.length - 1];
            n && "text" === n.type || (n = oe(),
            n.position = {
                start: Cn(e.start),
                end: void 0
            },
            t.push(n)),
            this.stack.push(n)
        }
        function D(e) {
            const t = this.stack.pop();
            t.value += this.sliceSerialize(e),
            t.position.end = Cn(e.end)
        }
        function O(e) {
            const n = this.stack[this.stack.length - 1];
            if (this.data.atHardBreak) {
                return n.children[n.children.length - 1].position.end = Cn(e.end),
                void (this.data.atHardBreak = void 0)
            }
            !this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(n.type) && (C.call(this, e),
            D.call(this, e))
        }
        function y() {
            this.data.atHardBreak = !0
        }
        function b() {
            const e = this.resume();
            this.stack[this.stack.length - 1].value = e
        }
        function R() {
            const e = this.resume();
            this.stack[this.stack.length - 1].value = e
        }
        function L() {
            const e = this.resume();
            this.stack[this.stack.length - 1].value = e
        }
        function P() {
            const e = this.stack[this.stack.length - 1];
            if (this.data.inReference) {
                const t = this.data.referenceType || "shortcut";
                e.type += "Reference",
                e.referenceType = t,
                delete e.url,
                delete e.title
            } else
                delete e.identifier,
                delete e.label;
            this.data.referenceType = void 0
        }
        function M() {
            const e = this.stack[this.stack.length - 1];
            if (this.data.inReference) {
                const t = this.data.referenceType || "shortcut";
                e.type += "Reference",
                e.referenceType = t,
                delete e.url,
                delete e.title
            } else
                delete e.identifier,
                delete e.label;
            this.data.referenceType = void 0
        }
        function x(e) {
            const t = this.sliceSerialize(e)
              , n = this.stack[this.stack.length - 2];
            n.label = function(e) {
                return e.replace(In, Nn)
            }(t),
            n.identifier = Qe(t).toLowerCase()
        }
        function v() {
            const e = this.stack[this.stack.length - 1]
              , t = this.resume()
              , n = this.stack[this.stack.length - 1];
            if (this.data.inReference = !0,
            "link" === n.type) {
                const t = e.children;
                n.children = t
            } else
                n.alt = t
        }
        function w() {
            const e = this.resume();
            this.stack[this.stack.length - 1].url = e
        }
        function F() {
            const e = this.resume();
            this.stack[this.stack.length - 1].title = e
        }
        function B() {
            this.data.inReference = void 0
        }
        function H() {
            this.data.referenceType = "collapsed"
        }
        function U(e) {
            const t = this.resume()
              , n = this.stack[this.stack.length - 1];
            n.label = t,
            n.identifier = Qe(this.sliceSerialize(e)).toLowerCase(),
            this.data.referenceType = "full"
        }
        function G(e) {
            this.data.characterReferenceType = e.type
        }
        function Y(e) {
            const t = this.sliceSerialize(e)
              , n = this.data.characterReferenceType;
            let r;
            if (n)
                r = Ve(t, "characterReferenceMarkerNumeric" === n ? 10 : 16),
                this.data.characterReferenceType = void 0;
            else {
                r = Be(t)
            }
            this.stack[this.stack.length - 1].value += r
        }
        function z(e) {
            this.stack.pop().position.end = Cn(e.end)
        }
        function q(e) {
            D.call(this, e);
            this.stack[this.stack.length - 1].url = this.sliceSerialize(e)
        }
        function V(e) {
            D.call(this, e);
            this.stack[this.stack.length - 1].url = "mailto:" + this.sliceSerialize(e)
        }
        function Q() {
            return {
                type: "blockquote",
                children: []
            }
        }
        function j() {
            return {
                type: "code",
                lang: null,
                meta: null,
                value: ""
            }
        }
        function W() {
            return {
                type: "inlineCode",
                value: ""
            }
        }
        function K() {
            return {
                type: "definition",
                identifier: "",
                label: null,
                title: null,
                url: ""
            }
        }
        function X() {
            return {
                type: "emphasis",
                children: []
            }
        }
        function J() {
            return {
                type: "heading",
                depth: 0,
                children: []
            }
        }
        function $() {
            return {
                type: "break"
            }
        }
        function Z() {
            return {
                type: "html",
                value: ""
            }
        }
        function ee() {
            return {
                type: "image",
                title: null,
                url: "",
                alt: null
            }
        }
        function te() {
            return {
                type: "link",
                title: null,
                url: "",
                children: []
            }
        }
        function ne(e) {
            return {
                type: "list",
                ordered: "listOrdered" === e.type,
                start: null,
                spread: e._spread,
                children: []
            }
        }
        function re(e) {
            return {
                type: "listItem",
                spread: e._spread,
                checked: null,
                children: []
            }
        }
        function ie() {
            return {
                type: "paragraph",
                children: []
            }
        }
        function se() {
            return {
                type: "strong",
                children: []
            }
        }
        function oe() {
            return {
                type: "text",
                value: ""
            }
        }
        function ae() {
            return {
                type: "thematicBreak"
            }
        }
    }(n)(function(e) {
        for (; !Ot(e); )
            ;
        return e
    }(function(e) {
        const t = {
            constructs: Ye([gn, ...(e || {}).extensions || []]),
            content: n(ct),
            defined: [],
            document: n(lt),
            flow: n(rn),
            lazy: {},
            string: n(on),
            text: n(an)
        };
        return t;
        function n(e) {
            return function(n) {
                return An(t, e, n)
            }
        }
    }(n).document().write(function() {
        let e, t = 1, n = "", r = !0;
        return function(i, s, o) {
            const a = [];
            let c, l, u, h, p;
            for (i = n + ("string" == typeof i ? i.toString() : new TextDecoder(s || void 0).decode(i)),
            u = 0,
            n = "",
            r && (65279 === i.charCodeAt(0) && u++,
            r = void 0); u < i.length; ) {
                if (_n.lastIndex = u,
                c = _n.exec(i),
                h = c && void 0 !== c.index ? c.index : i.length,
                p = i.charCodeAt(h),
                !c) {
                    n = i.slice(u);
                    break
                }
                if (10 === p && u === h && e)
                    a.push(-3),
                    e = void 0;
                else
                    switch (e && (a.push(-5),
                    e = void 0),
                    u < h && (a.push(i.slice(u, h)),
                    t += h - u),
                    p) {
                    case 0:
                        a.push(65533),
                        t++;
                        break;
                    case 9:
                        for (l = 4 * Math.ceil(t / 4),
                        a.push(-2); t++ < l; )
                            a.push(-1);
                        break;
                    case 10:
                        a.push(-4),
                        t = 1;
                        break;
                    default:
                        e = !0,
                        t = 1
                    }
                u = h + 1
            }
            return o && (e && a.push(-5),
            n && a.push(n),
            a.push(null)),
            a
        }
    }()(e, t, !0))))
}
function Cn(e) {
    return {
        line: e.line,
        column: e.column,
        offset: e.offset
    }
}
function Dn(e, t) {
    let n = -1;
    for (; ++n < t.length; ) {
        const r = t[n];
        Array.isArray(r) ? Dn(e, r) : On(e, r)
    }
}
function On(e, t) {
    let n;
    for (n in t)
        if (kn.call(t, n))
            switch (n) {
            case "canContainEols":
                {
                    const r = t[n];
                    r && e[n].push(...r);
                    break
                }
            case "transforms":
                {
                    const r = t[n];
                    r && e[n].push(...r);
                    break
                }
            case "enter":
            case "exit":
                {
                    const r = t[n];
                    r && Object.assign(e[n], r);
                    break
                }
            }
}
function yn(e, t) {
    throw e ? new Error("Cannot close `" + e.type + "` (" + he({
        start: e.start,
        end: e.end
    }) + "): a different token (`" + t.type + "`, " + he({
        start: t.start,
        end: t.end
    }) + ") is open") : new Error("Cannot close document, a token (`" + t.type + "`, " + he({
        start: t.start,
        end: t.end
    }) + ") is still open")
}
function bn(e) {
    const t = this;
    t.parser = function(n) {
        return Sn(n, {
            ...t.data("settings"),
            ...e,
            extensions: t.data("micromarkExtensions") || [],
            mdastExtensions: t.data("fromMarkdownExtensions") || []
        })
    }
}
function Rn(e, t) {
    const n = t.referenceType;
    let r = "]";
    if ("collapsed" === n ? r += "[]" : "full" === n && (r += "[" + (t.label || t.identifier) + "]"),
    "imageReference" === t.type)
        return [{
            type: "text",
            value: "![" + t.alt + r
        }];
    const i = e.all(t)
      , s = i[0];
    s && "text" === s.type ? s.value = "[" + s.value : i.unshift({
        type: "text",
        value: "["
    });
    const o = i[i.length - 1];
    return o && "text" === o.type ? o.value += r : i.push({
        type: "text",
        value: r
    }),
    i
}
function Ln(e) {
    const t = e.spread;
    return null == t ? e.children.length > 1 : t
}
function Pn(e) {
    const t = String(e)
      , n = /\r?\n|\r/g;
    let r = n.exec(t)
      , i = 0;
    const s = [];
    for (; r; )
        s.push(Mn(t.slice(i, r.index), i > 0, !0), r[0]),
        i = r.index + r[0].length,
        r = n.exec(t);
    return s.push(Mn(t.slice(i), i > 0, !1)),
    s.join("")
}
function Mn(e, t, n) {
    let r = 0
      , i = e.length;
    if (t) {
        let t = e.codePointAt(r);
        for (; 9 === t || 32 === t; )
            r++,
            t = e.codePointAt(r)
    }
    if (n) {
        let t = e.codePointAt(i - 1);
        for (; 9 === t || 32 === t; )
            i--,
            t = e.codePointAt(i - 1)
    }
    return i > r ? e.slice(r, i) : ""
}
const xn = {
    blockquote: function(e, t) {
        const n = {
            type: "element",
            tagName: "blockquote",
            properties: {},
            children: e.wrap(e.all(t), !0)
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    break: function(e, t) {
        const n = {
            type: "element",
            tagName: "br",
            properties: {},
            children: []
        };
        return e.patch(t, n),
        [e.applyData(t, n), {
            type: "text",
            value: "\n"
        }]
    },
    code: function(e, t) {
        const n = t.value ? t.value + "\n" : ""
          , r = {}
          , i = t.lang ? t.lang.split(/\s+/) : [];
        i.length > 0 && (r.className = ["language-" + i[0]]);
        let s = {
            type: "element",
            tagName: "code",
            properties: r,
            children: [{
                type: "text",
                value: n
            }]
        };
        return t.meta && (s.data = {
            meta: t.meta
        }),
        e.patch(t, s),
        s = e.applyData(t, s),
        s = {
            type: "element",
            tagName: "pre",
            properties: {},
            children: [s]
        },
        e.patch(t, s),
        s
    },
    delete: function(e, t) {
        const n = {
            type: "element",
            tagName: "del",
            properties: {},
            children: e.all(t)
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    emphasis: function(e, t) {
        const n = {
            type: "element",
            tagName: "em",
            properties: {},
            children: e.all(t)
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    footnoteReference: function(e, t) {
        const n = "string" == typeof e.options.clobberPrefix ? e.options.clobberPrefix : "user-content-"
          , r = String(t.identifier).toUpperCase()
          , i = ot(r.toLowerCase())
          , s = e.footnoteOrder.indexOf(r);
        let o, a = e.footnoteCounts.get(r);
        void 0 === a ? (a = 0,
        e.footnoteOrder.push(r),
        o = e.footnoteOrder.length) : o = s + 1,
        a += 1,
        e.footnoteCounts.set(r, a);
        const c = {
            type: "element",
            tagName: "a",
            properties: {
                href: "#" + n + "fn-" + i,
                id: n + "fnref-" + i + (a > 1 ? "-" + a : ""),
                dataFootnoteRef: !0,
                ariaDescribedBy: ["footnote-label"]
            },
            children: [{
                type: "text",
                value: String(o)
            }]
        };
        e.patch(t, c);
        const l = {
            type: "element",
            tagName: "sup",
            properties: {},
            children: [c]
        };
        return e.patch(t, l),
        e.applyData(t, l)
    },
    heading: function(e, t) {
        const n = {
            type: "element",
            tagName: "h" + t.depth,
            properties: {},
            children: e.all(t)
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    html: function(e, t) {
        if (e.options.allowDangerousHtml) {
            const n = {
                type: "raw",
                value: t.value
            };
            return e.patch(t, n),
            e.applyData(t, n)
        }
    },
    imageReference: function(e, t) {
        const n = String(t.identifier).toUpperCase()
          , r = e.definitionById.get(n);
        if (!r)
            return Rn(e, t);
        const i = {
            src: ot(r.url || ""),
            alt: t.alt
        };
        null !== r.title && void 0 !== r.title && (i.title = r.title);
        const s = {
            type: "element",
            tagName: "img",
            properties: i,
            children: []
        };
        return e.patch(t, s),
        e.applyData(t, s)
    },
    image: function(e, t) {
        const n = {
            src: ot(t.url)
        };
        null !== t.alt && void 0 !== t.alt && (n.alt = t.alt),
        null !== t.title && void 0 !== t.title && (n.title = t.title);
        const r = {
            type: "element",
            tagName: "img",
            properties: n,
            children: []
        };
        return e.patch(t, r),
        e.applyData(t, r)
    },
    inlineCode: function(e, t) {
        const n = {
            type: "text",
            value: t.value.replace(/\r?\n|\r/g, " ")
        };
        e.patch(t, n);
        const r = {
            type: "element",
            tagName: "code",
            properties: {},
            children: [n]
        };
        return e.patch(t, r),
        e.applyData(t, r)
    },
    linkReference: function(e, t) {
        const n = String(t.identifier).toUpperCase()
          , r = e.definitionById.get(n);
        if (!r)
            return Rn(e, t);
        const i = {
            href: ot(r.url || "")
        };
        null !== r.title && void 0 !== r.title && (i.title = r.title);
        const s = {
            type: "element",
            tagName: "a",
            properties: i,
            children: e.all(t)
        };
        return e.patch(t, s),
        e.applyData(t, s)
    },
    link: function(e, t) {
        const n = {
            href: ot(t.url)
        };
        null !== t.title && void 0 !== t.title && (n.title = t.title);
        const r = {
            type: "element",
            tagName: "a",
            properties: n,
            children: e.all(t)
        };
        return e.patch(t, r),
        e.applyData(t, r)
    },
    listItem: function(e, t, n) {
        const r = e.all(t)
          , i = n ? function(e) {
            let t = !1;
            if ("list" === e.type) {
                t = e.spread || !1;
                const n = e.children;
                let r = -1;
                for (; !t && ++r < n.length; )
                    t = Ln(n[r])
            }
            return t
        }(n) : Ln(t)
          , s = {}
          , o = [];
        if ("boolean" == typeof t.checked) {
            const e = r[0];
            let n;
            e && "element" === e.type && "p" === e.tagName ? n = e : (n = {
                type: "element",
                tagName: "p",
                properties: {},
                children: []
            },
            r.unshift(n)),
            n.children.length > 0 && n.children.unshift({
                type: "text",
                value: " "
            }),
            n.children.unshift({
                type: "element",
                tagName: "input",
                properties: {
                    type: "checkbox",
                    checked: t.checked,
                    disabled: !0
                },
                children: []
            }),
            s.className = ["task-list-item"]
        }
        let a = -1;
        for (; ++a < r.length; ) {
            const e = r[a];
            (i || 0 !== a || "element" !== e.type || "p" !== e.tagName) && o.push({
                type: "text",
                value: "\n"
            }),
            "element" !== e.type || "p" !== e.tagName || i ? o.push(e) : o.push(...e.children)
        }
        const c = r[r.length - 1];
        c && (i || "element" !== c.type || "p" !== c.tagName) && o.push({
            type: "text",
            value: "\n"
        });
        const l = {
            type: "element",
            tagName: "li",
            properties: s,
            children: o
        };
        return e.patch(t, l),
        e.applyData(t, l)
    },
    list: function(e, t) {
        const n = {}
          , r = e.all(t);
        let i = -1;
        for ("number" == typeof t.start && 1 !== t.start && (n.start = t.start); ++i < r.length; ) {
            const e = r[i];
            if ("element" === e.type && "li" === e.tagName && e.properties && Array.isArray(e.properties.className) && e.properties.className.includes("task-list-item")) {
                n.className = ["contains-task-list"];
                break
            }
        }
        const s = {
            type: "element",
            tagName: t.ordered ? "ol" : "ul",
            properties: n,
            children: e.wrap(r, !0)
        };
        return e.patch(t, s),
        e.applyData(t, s)
    },
    paragraph: function(e, t) {
        const n = {
            type: "element",
            tagName: "p",
            properties: {},
            children: e.all(t)
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    root: function(e, t) {
        const n = {
            type: "root",
            children: e.wrap(e.all(t))
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    strong: function(e, t) {
        const n = {
            type: "element",
            tagName: "strong",
            properties: {},
            children: e.all(t)
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    table: function(e, t) {
        const n = e.all(t)
          , r = n.shift()
          , i = [];
        if (r) {
            const n = {
                type: "element",
                tagName: "thead",
                properties: {},
                children: e.wrap([r], !0)
            };
            e.patch(t.children[0], n),
            i.push(n)
        }
        if (n.length > 0) {
            const r = {
                type: "element",
                tagName: "tbody",
                properties: {},
                children: e.wrap(n, !0)
            }
              , s = ce(t.children[1])
              , o = ae(t.children[t.children.length - 1]);
            s && o && (r.position = {
                start: s,
                end: o
            }),
            i.push(r)
        }
        const s = {
            type: "element",
            tagName: "table",
            properties: {},
            children: e.wrap(i, !0)
        };
        return e.patch(t, s),
        e.applyData(t, s)
    },
    tableCell: function(e, t) {
        const n = {
            type: "element",
            tagName: "td",
            properties: {},
            children: e.all(t)
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    tableRow: function(e, t, n) {
        const r = n ? n.children : void 0
          , i = 0 === (r ? r.indexOf(t) : 1) ? "th" : "td"
          , s = n && "table" === n.type ? n.align : void 0
          , o = s ? s.length : t.children.length;
        let a = -1;
        const c = [];
        for (; ++a < o; ) {
            const n = t.children[a]
              , r = {}
              , o = s ? s[a] : void 0;
            o && (r.align = o);
            let l = {
                type: "element",
                tagName: i,
                properties: r,
                children: []
            };
            n && (l.children = e.all(n),
            e.patch(n, l),
            l = e.applyData(n, l)),
            c.push(l)
        }
        const l = {
            type: "element",
            tagName: "tr",
            properties: {},
            children: e.wrap(c, !0)
        };
        return e.patch(t, l),
        e.applyData(t, l)
    },
    text: function(e, t) {
        const n = {
            type: "text",
            value: Pn(String(t.value))
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    thematicBreak: function(e, t) {
        const n = {
            type: "element",
            tagName: "hr",
            properties: {},
            children: []
        };
        return e.patch(t, n),
        e.applyData(t, n)
    },
    toml: vn,
    yaml: vn,
    definition: vn,
    footnoteDefinition: vn
};
function vn() {}
const wn = "object" == typeof self ? self : globalThis
  , Fn = e => ( (e, t) => {
    const n = (t, n) => (e.set(n, t),
    t)
      , r = i => {
        if (e.has(i))
            return e.get(i);
        const [s,o] = t[i];
        switch (s) {
        case 0:
        case -1:
            return n(o, i);
        case 1:
            {
                const e = n([], i);
                for (const t of o)
                    e.push(r(t));
                return e
            }
        case 2:
            {
                const e = n({}, i);
                for (const [t,n] of o)
                    e[r(t)] = r(n);
                return e
            }
        case 3:
            return n(new Date(o), i);
        case 4:
            {
                const {source: e, flags: t} = o;
                return n(new RegExp(e,t), i)
            }
        case 5:
            {
                const e = n(new Map, i);
                for (const [t,n] of o)
                    e.set(r(t), r(n));
                return e
            }
        case 6:
            {
                const e = n(new Set, i);
                for (const t of o)
                    e.add(r(t));
                return e
            }
        case 7:
            {
                const {name: e, message: t} = o;
                return n(new wn[e](t), i)
            }
        case 8:
            return n(BigInt(o), i);
        case "BigInt":
            return n(Object(BigInt(o)), i);
        case "ArrayBuffer":
            return n(new Uint8Array(o).buffer, o);
        case "DataView":
            {
                const {buffer: e} = new Uint8Array(o);
                return n(new DataView(e), o)
            }
        }
        return n(new wn[s](o), i)
    }
    ;
    return r
}
)(new Map, e)(0)
  , Bn = ""
  , {toString: Hn} = {}
  , {keys: Un} = Object
  , Gn = e => {
    const t = typeof e;
    if ("object" !== t || !e)
        return [0, t];
    const n = Hn.call(e).slice(8, -1);
    switch (n) {
    case "Array":
        return [1, Bn];
    case "Object":
        return [2, Bn];
    case "Date":
        return [3, Bn];
    case "RegExp":
        return [4, Bn];
    case "Map":
        return [5, Bn];
    case "Set":
        return [6, Bn];
    case "DataView":
        return [1, n]
    }
    return n.includes("Array") ? [1, n] : n.includes("Error") ? [7, n] : [2, n]
}
  , Yn = ([e,t]) => 0 === e && ("function" === t || "symbol" === t)
  , zn = (e, {json: t, lossy: n}={}) => {
    const r = [];
    return ( (e, t, n, r) => {
        const i = (e, t) => {
            const i = r.push(e) - 1;
            return n.set(t, i),
            i
        }
          , s = r => {
            if (n.has(r))
                return n.get(r);
            let[o,a] = Gn(r);
            switch (o) {
            case 0:
                {
                    let t = r;
                    switch (a) {
                    case "bigint":
                        o = 8,
                        t = r.toString();
                        break;
                    case "function":
                    case "symbol":
                        if (e)
                            throw new TypeError("unable to serialize " + a);
                        t = null;
                        break;
                    case "undefined":
                        return i([-1], r)
                    }
                    return i([o, t], r)
                }
            case 1:
                {
                    if (a) {
                        let e = r;
                        return "DataView" === a ? e = new Uint8Array(r.buffer) : "ArrayBuffer" === a && (e = new Uint8Array(r)),
                        i([a, [...e]], r)
                    }
                    const e = []
                      , t = i([o, e], r);
                    for (const n of r)
                        e.push(s(n));
                    return t
                }
            case 2:
                {
                    if (a)
                        switch (a) {
                        case "BigInt":
                            return i([a, r.toString()], r);
                        case "Boolean":
                        case "Number":
                        case "String":
                            return i([a, r.valueOf()], r)
                        }
                    if (t && "toJSON"in r)
                        return s(r.toJSON());
                    const n = []
                      , c = i([o, n], r);
                    for (const t of Un(r))
                        !e && Yn(Gn(r[t])) || n.push([s(t), s(r[t])]);
                    return c
                }
            case 3:
                return i([o, r.toISOString()], r);
            case 4:
                {
                    const {source: e, flags: t} = r;
                    return i([o, {
                        source: e,
                        flags: t
                    }], r)
                }
            case 5:
                {
                    const t = []
                      , n = i([o, t], r);
                    for (const [i,o] of r)
                        (e || !Yn(Gn(i)) && !Yn(Gn(o))) && t.push([s(i), s(o)]);
                    return n
                }
            case 6:
                {
                    const t = []
                      , n = i([o, t], r);
                    for (const i of r)
                        !e && Yn(Gn(i)) || t.push(s(i));
                    return n
                }
            }
            const {message: c} = r;
            return i([o, {
                name: a,
                message: c
            }], r)
        }
        ;
        return s
    }
    )(!(t || n), !!t, new Map, r)(e),
    r
}
  , qn = "function" == typeof structuredClone ? (e, t) => t && ("json"in t || "lossy"in t) ? Fn(zn(e, t)) : structuredClone(e) : (e, t) => Fn(zn(e, t));
function Vn(e, t) {
    const n = [{
        type: "text",
        value: "↩"
    }];
    return t > 1 && n.push({
        type: "element",
        tagName: "sup",
        properties: {},
        children: [{
            type: "text",
            value: String(t)
        }]
    }),
    n
}
function Qn(e, t) {
    return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "")
}
const jn = function(e) {
    if (null == e)
        return Kn;
    if ("function" == typeof e)
        return Wn(e);
    if ("object" == typeof e)
        return Array.isArray(e) ? function(e) {
            const t = [];
            let n = -1;
            for (; ++n < e.length; )
                t[n] = jn(e[n]);
            return Wn(r);
            function r(...e) {
                let n = -1;
                for (; ++n < t.length; )
                    if (t[n].apply(this, e))
                        return !0;
                return !1
            }
        }(e) : function(e) {
            const t = e;
            return Wn(n);
            function n(n) {
                const r = n;
                let i;
                for (i in e)
                    if (r[i] !== t[i])
                        return !1;
                return !0
            }
        }(e);
    if ("string" == typeof e)
        return function(e) {
            return Wn(t);
            function t(t) {
                return t && t.type === e
            }
        }(e);
    throw new Error("Expected function, string, or object as test")
};
function Wn(e) {
    return function(t, n, r) {
        return Boolean(function(e) {
            return null !== e && "object" == typeof e && "type"in e
        }(t) && e.call(this, t, "number" == typeof n ? n : void 0, r || void 0))
    }
}
function Kn() {
    return !0
}
const Xn = []
  , Jn = !0
  , $n = !1;
function Zn(e, t, n, r) {
    let i;
    "function" == typeof t && "function" != typeof n ? (r = n,
    n = t) : i = t;
    const s = jn(i)
      , o = r ? -1 : 1;
    !function e(i, a, c) {
        const l = i && "object" == typeof i ? i : {};
        if ("string" == typeof l.type) {
            const e = "string" == typeof l.tagName ? l.tagName : "string" == typeof l.name ? l.name : void 0;
            Object.defineProperty(u, "name", {
                value: "node (" + i.type + (e ? "<" + e + ">" : "") + ")"
            })
        }
        return u;
        function u() {
            let l, u, h, p = Xn;
            if ((!t || s(i, a, c[c.length - 1] || void 0)) && (p = function(e) {
                if (Array.isArray(e))
                    return e;
                if ("number" == typeof e)
                    return [Jn, e];
                return null == e ? Xn : [e]
            }(n(i, c)),
            p[0] === $n))
                return p;
            if ("children"in i && i.children) {
                const t = i;
                if (t.children && "skip" !== p[0])
                    for (u = (r ? t.children.length : -1) + o,
                    h = c.concat(t); u > -1 && u < t.children.length; ) {
                        const n = t.children[u];
                        if (l = e(n, u, h)(),
                        l[0] === $n)
                            return l;
                        u = "number" == typeof l[1] ? l[1] : u + o
                    }
            }
            return p
        }
    }(e, void 0, [])()
}
function er(e, t, n, r) {
    let i, s, o;
    "function" == typeof t && "function" != typeof n ? (s = void 0,
    o = t,
    i = n) : (s = t,
    o = n,
    i = r),
    Zn(e, s, function(e, t) {
        const n = t[t.length - 1]
          , r = n ? n.children.indexOf(e) : void 0;
        return o(e, r, n)
    }, i)
}
const tr = {}.hasOwnProperty
  , nr = {};
function rr(e, t) {
    e.position && (t.position = ue(e))
}
function ir(e, t) {
    let n = t;
    if (e && e.data) {
        const t = e.data.hName
          , r = e.data.hChildren
          , i = e.data.hProperties;
        if ("string" == typeof t)
            if ("element" === n.type)
                n.tagName = t;
            else {
                n = {
                    type: "element",
                    tagName: t,
                    properties: {},
                    children: "children"in n ? n.children : [n]
                }
            }
        "element" === n.type && i && Object.assign(n.properties, qn(i)),
        "children"in n && n.children && null != r && (n.children = r)
    }
    return n
}
function sr(e, t) {
    const n = t.data || {}
      , r = !("value"in t) || tr.call(n, "hProperties") || tr.call(n, "hChildren") ? {
        type: "element",
        tagName: "div",
        properties: {},
        children: e.all(t)
    } : {
        type: "text",
        value: t.value
    };
    return e.patch(t, r),
    e.applyData(t, r)
}
function or(e, t) {
    const n = [];
    let r = -1;
    for (t && n.push({
        type: "text",
        value: "\n"
    }); ++r < e.length; )
        r && n.push({
            type: "text",
            value: "\n"
        }),
        n.push(e[r]);
    return t && e.length > 0 && n.push({
        type: "text",
        value: "\n"
    }),
    n
}
function ar(e) {
    let t = 0
      , n = e.charCodeAt(t);
    for (; 9 === n || 32 === n; )
        t++,
        n = e.charCodeAt(t);
    return e.slice(t)
}
function cr(e, t) {
    const n = function(e, t) {
        const n = t || nr
          , r = new Map
          , i = new Map
          , s = new Map
          , o = {
            ...xn,
            ...n.handlers
        }
          , a = {
            all: function(e) {
                const t = [];
                if ("children"in e) {
                    const n = e.children;
                    let r = -1;
                    for (; ++r < n.length; ) {
                        const i = a.one(n[r], e);
                        if (i) {
                            if (r && "break" === n[r - 1].type && (Array.isArray(i) || "text" !== i.type || (i.value = ar(i.value)),
                            !Array.isArray(i) && "element" === i.type)) {
                                const e = i.children[0];
                                e && "text" === e.type && (e.value = ar(e.value))
                            }
                            Array.isArray(i) ? t.push(...i) : t.push(i)
                        }
                    }
                }
                return t
            },
            applyData: ir,
            definitionById: r,
            footnoteById: i,
            footnoteCounts: s,
            footnoteOrder: [],
            handlers: o,
            one: function(e, t) {
                const n = e.type
                  , r = a.handlers[n];
                if (tr.call(a.handlers, n) && r)
                    return r(a, e, t);
                if (a.options.passThrough && a.options.passThrough.includes(n)) {
                    if ("children"in e) {
                        const {children: t, ...n} = e
                          , r = qn(n);
                        return r.children = a.all(e),
                        r
                    }
                    return qn(e)
                }
                return (a.options.unknownHandler || sr)(a, e, t)
            },
            options: n,
            patch: rr,
            wrap: or
        };
        return er(e, function(e) {
            if ("definition" === e.type || "footnoteDefinition" === e.type) {
                const t = "definition" === e.type ? r : i
                  , n = String(e.identifier).toUpperCase();
                t.has(n) || t.set(n, e)
            }
        }),
        a
    }(e, t)
      , r = n.one(e, void 0)
      , i = function(e) {
        const t = "string" == typeof e.options.clobberPrefix ? e.options.clobberPrefix : "user-content-"
          , n = e.options.footnoteBackContent || Vn
          , r = e.options.footnoteBackLabel || Qn
          , i = e.options.footnoteLabel || "Footnotes"
          , s = e.options.footnoteLabelTagName || "h2"
          , o = e.options.footnoteLabelProperties || {
            className: ["sr-only"]
        }
          , a = [];
        let c = -1;
        for (; ++c < e.footnoteOrder.length; ) {
            const i = e.footnoteById.get(e.footnoteOrder[c]);
            if (!i)
                continue;
            const s = e.all(i)
              , o = String(i.identifier).toUpperCase()
              , l = ot(o.toLowerCase());
            let u = 0;
            const h = []
              , p = e.footnoteCounts.get(o);
            for (; void 0 !== p && ++u <= p; ) {
                h.length > 0 && h.push({
                    type: "text",
                    value: " "
                });
                let e = "string" == typeof n ? n : n(c, u);
                "string" == typeof e && (e = {
                    type: "text",
                    value: e
                }),
                h.push({
                    type: "element",
                    tagName: "a",
                    properties: {
                        href: "#" + t + "fnref-" + l + (u > 1 ? "-" + u : ""),
                        dataFootnoteBackref: "",
                        ariaLabel: "string" == typeof r ? r : r(c, u),
                        className: ["data-footnote-backref"]
                    },
                    children: Array.isArray(e) ? e : [e]
                })
            }
            const d = s[s.length - 1];
            if (d && "element" === d.type && "p" === d.tagName) {
                const e = d.children[d.children.length - 1];
                e && "text" === e.type ? e.value += " " : d.children.push({
                    type: "text",
                    value: " "
                }),
                d.children.push(...h)
            } else
                s.push(...h);
            const f = {
                type: "element",
                tagName: "li",
                properties: {
                    id: t + "fn-" + l
                },
                children: e.wrap(s, !0)
            };
            e.patch(i, f),
            a.push(f)
        }
        if (0 !== a.length)
            return {
                type: "element",
                tagName: "section",
                properties: {
                    dataFootnotes: !0,
                    className: ["footnotes"]
                },
                children: [{
                    type: "element",
                    tagName: s,
                    properties: {
                        ...qn(o),
                        id: "footnote-label"
                    },
                    children: [{
                        type: "text",
                        value: i
                    }]
                }, {
                    type: "text",
                    value: "\n"
                }, {
                    type: "element",
                    tagName: "ol",
                    properties: {},
                    children: e.wrap(a, !0)
                }, {
                    type: "text",
                    value: "\n"
                }]
            }
    }(n)
      , s = Array.isArray(r) ? {
        type: "root",
        children: r
    } : r || {
        type: "root",
        children: []
    };
    return i && s.children.push({
        type: "text",
        value: "\n"
    }, i),
    s
}
function lr(e, t) {
    return e && "run"in e ? async function(n, r) {
        const i = cr(n, {
            file: r,
            ...t
        });
        await e.run(i, r)
    }
    : function(n, r) {
        return cr(n, {
            file: r,
            ...e || t
        })
    }
}
function ur(e) {
    if (e)
        throw e
}
var hr, pr;
const dr = n(function() {
    if (pr)
        return hr;
    pr = 1;
    var e = Object.prototype.hasOwnProperty
      , t = Object.prototype.toString
      , n = Object.defineProperty
      , r = Object.getOwnPropertyDescriptor
      , i = function(e) {
        return "function" == typeof Array.isArray ? Array.isArray(e) : "[object Array]" === t.call(e)
    }
      , s = function(n) {
        if (!n || "[object Object]" !== t.call(n))
            return !1;
        var r, i = e.call(n, "constructor"), s = n.constructor && n.constructor.prototype && e.call(n.constructor.prototype, "isPrototypeOf");
        if (n.constructor && !i && !s)
            return !1;
        for (r in n)
            ;
        return void 0 === r || e.call(n, r)
    }
      , o = function(e, t) {
        n && "__proto__" === t.name ? n(e, t.name, {
            enumerable: !0,
            configurable: !0,
            value: t.newValue,
            writable: !0
        }) : e[t.name] = t.newValue
    }
      , a = function(t, n) {
        if ("__proto__" === n) {
            if (!e.call(t, n))
                return;
            if (r)
                return r(t, n).value
        }
        return t[n]
    };
    return hr = function e() {
        var t, n, r, c, l, u, h = arguments[0], p = 1, d = arguments.length, f = !1;
        for ("boolean" == typeof h && (f = h,
        h = arguments[1] || {},
        p = 2),
        (null == h || "object" != typeof h && "function" != typeof h) && (h = {}); p < d; ++p)
            if (null != (t = arguments[p]))
                for (n in t)
                    r = a(h, n),
                    h !== (c = a(t, n)) && (f && c && (s(c) || (l = i(c))) ? (l ? (l = !1,
                    u = r && i(r) ? r : []) : u = r && s(r) ? r : {},
                    o(h, {
                        name: n,
                        newValue: e(f, u, c)
                    })) : void 0 !== c && o(h, {
                        name: n,
                        newValue: c
                    }));
        return h
    }
}());
function fr(e) {
    if ("object" != typeof e || null === e)
        return !1;
    const t = Object.getPrototypeOf(e);
    return !(null !== t && t !== Object.prototype && null !== Object.getPrototypeOf(t) || Symbol.toStringTag in e || Symbol.iterator in e)
}
function mr() {
    const e = []
      , t = {
        run: function(...t) {
            let n = -1;
            const r = t.pop();
            if ("function" != typeof r)
                throw new TypeError("Expected function as last argument, not " + r);
            !function i(s, ...o) {
                const a = e[++n];
                let c = -1;
                if (s)
                    r(s);
                else {
                    for (; ++c < t.length; )
                        null !== o[c] && void 0 !== o[c] || (o[c] = t[c]);
                    t = o,
                    a ? function(e, t) {
                        let n;
                        return r;
                        function r(...t) {
                            const r = e.length > t.length;
                            let a;
                            r && t.push(i);
                            try {
                                a = e.apply(this, t)
                            } catch (s) {
                                if (r && n)
                                    throw s;
                                return i(s)
                            }
                            r || (a && a.then && "function" == typeof a.then ? a.then(o, i) : a instanceof Error ? i(a) : o(a))
                        }
                        function i(e, ...r) {
                            n || (n = !0,
                            t(e, ...r))
                        }
                        function o(e) {
                            i(null, e)
                        }
                    }(a, i)(...o) : r(null, ...o)
                }
            }(null, ...t)
        },
        use: function(n) {
            if ("function" != typeof n)
                throw new TypeError("Expected `middelware` to be a function, not " + n);
            return e.push(n),
            t
        }
    };
    return t
}
const Er = {
    basename: function(e, t) {
        if (void 0 !== t && "string" != typeof t)
            throw new TypeError('"ext" argument must be a string');
        Tr(e);
        let n, r = 0, i = -1, s = e.length;
        if (void 0 === t || 0 === t.length || t.length > e.length) {
            for (; s--; )
                if (47 === e.codePointAt(s)) {
                    if (n) {
                        r = s + 1;
                        break
                    }
                } else
                    i < 0 && (n = !0,
                    i = s + 1);
            return i < 0 ? "" : e.slice(r, i)
        }
        if (t === e)
            return "";
        let o = -1
          , a = t.length - 1;
        for (; s--; )
            if (47 === e.codePointAt(s)) {
                if (n) {
                    r = s + 1;
                    break
                }
            } else
                o < 0 && (n = !0,
                o = s + 1),
                a > -1 && (e.codePointAt(s) === t.codePointAt(a--) ? a < 0 && (i = s) : (a = -1,
                i = o));
        r === i ? i = o : i < 0 && (i = e.length);
        return e.slice(r, i)
    },
    dirname: function(e) {
        if (Tr(e),
        0 === e.length)
            return ".";
        let t, n = -1, r = e.length;
        for (; --r; )
            if (47 === e.codePointAt(r)) {
                if (t) {
                    n = r;
                    break
                }
            } else
                t || (t = !0);
        return n < 0 ? 47 === e.codePointAt(0) ? "/" : "." : 1 === n && 47 === e.codePointAt(0) ? "//" : e.slice(0, n)
    },
    extname: function(e) {
        Tr(e);
        let t, n = e.length, r = -1, i = 0, s = -1, o = 0;
        for (; n--; ) {
            const a = e.codePointAt(n);
            if (47 !== a)
                r < 0 && (t = !0,
                r = n + 1),
                46 === a ? s < 0 ? s = n : 1 !== o && (o = 1) : s > -1 && (o = -1);
            else if (t) {
                i = n + 1;
                break
            }
        }
        if (s < 0 || r < 0 || 0 === o || 1 === o && s === r - 1 && s === i + 1)
            return "";
        return e.slice(s, r)
    },
    join: function(...e) {
        let t, n = -1;
        for (; ++n < e.length; )
            Tr(e[n]),
            e[n] && (t = void 0 === t ? e[n] : t + "/" + e[n]);
        return void 0 === t ? "." : function(e) {
            Tr(e);
            const t = 47 === e.codePointAt(0);
            let n = function(e, t) {
                let n, r, i = "", s = 0, o = -1, a = 0, c = -1;
                for (; ++c <= e.length; ) {
                    if (c < e.length)
                        n = e.codePointAt(c);
                    else {
                        if (47 === n)
                            break;
                        n = 47
                    }
                    if (47 === n) {
                        if (o === c - 1 || 1 === a)
                            ;
                        else if (o !== c - 1 && 2 === a) {
                            if (i.length < 2 || 2 !== s || 46 !== i.codePointAt(i.length - 1) || 46 !== i.codePointAt(i.length - 2))
                                if (i.length > 2) {
                                    if (r = i.lastIndexOf("/"),
                                    r !== i.length - 1) {
                                        r < 0 ? (i = "",
                                        s = 0) : (i = i.slice(0, r),
                                        s = i.length - 1 - i.lastIndexOf("/")),
                                        o = c,
                                        a = 0;
                                        continue
                                    }
                                } else if (i.length > 0) {
                                    i = "",
                                    s = 0,
                                    o = c,
                                    a = 0;
                                    continue
                                }
                            t && (i = i.length > 0 ? i + "/.." : "..",
                            s = 2)
                        } else
                            i.length > 0 ? i += "/" + e.slice(o + 1, c) : i = e.slice(o + 1, c),
                            s = c - o - 1;
                        o = c,
                        a = 0
                    } else
                        46 === n && a > -1 ? a++ : a = -1
                }
                return i
            }(e, !t);
            0 !== n.length || t || (n = ".");
            n.length > 0 && 47 === e.codePointAt(e.length - 1) && (n += "/");
            return t ? "/" + n : n
        }(t)
    },
    sep: "/"
};
function Tr(e) {
    if ("string" != typeof e)
        throw new TypeError("Path must be a string. Received " + JSON.stringify(e))
}
const gr = {
    cwd: function() {
        return "/"
    }
};
function Ar(e) {
    return Boolean(null !== e && "object" == typeof e && "href"in e && e.href && "protocol"in e && e.protocol && void 0 === e.auth)
}
function _r(e) {
    if ("string" == typeof e)
        e = new URL(e);
    else if (!Ar(e)) {
        const t = new TypeError('The "path" argument must be of type string or an instance of URL. Received `' + e + "`");
        throw t.code = "ERR_INVALID_ARG_TYPE",
        t
    }
    if ("file:" !== e.protocol) {
        const e = new TypeError("The URL must be of scheme file");
        throw e.code = "ERR_INVALID_URL_SCHEME",
        e
    }
    return function(e) {
        if ("" !== e.hostname) {
            const e = new TypeError('File URL host must be "localhost" or empty on darwin');
            throw e.code = "ERR_INVALID_FILE_URL_HOST",
            e
        }
        const t = e.pathname;
        let n = -1;
        for (; ++n < t.length; )
            if (37 === t.codePointAt(n) && 50 === t.codePointAt(n + 1)) {
                const e = t.codePointAt(n + 2);
                if (70 === e || 102 === e) {
                    const e = new TypeError("File URL path must not include encoded / characters");
                    throw e.code = "ERR_INVALID_FILE_URL_PATH",
                    e
                }
            }
        return decodeURIComponent(t)
    }(e)
}
const Ir = ["history", "path", "basename", "stem", "extname", "dirname"];
class Nr {
    constructor(e) {
        let t;
        t = e ? Ar(e) ? {
            path: e
        } : "string" == typeof e || function(e) {
            return Boolean(e && "object" == typeof e && "byteLength"in e && "byteOffset"in e)
        }(e) ? {
            value: e
        } : e : {},
        this.cwd = "cwd"in t ? "" : gr.cwd(),
        this.data = {},
        this.history = [],
        this.messages = [],
        this.value,
        this.map,
        this.result,
        this.stored;
        let n, r = -1;
        for (; ++r < Ir.length; ) {
            const e = Ir[r];
            e in t && void 0 !== t[e] && null !== t[e] && (this[e] = "history" === e ? [...t[e]] : t[e])
        }
        for (n in t)
            Ir.includes(n) || (this[n] = t[n])
    }
    get basename() {
        return "string" == typeof this.path ? Er.basename(this.path) : void 0
    }
    set basename(e) {
        Sr(e, "basename"),
        kr(e, "basename"),
        this.path = Er.join(this.dirname || "", e)
    }
    get dirname() {
        return "string" == typeof this.path ? Er.dirname(this.path) : void 0
    }
    set dirname(e) {
        Cr(this.basename, "dirname"),
        this.path = Er.join(e || "", this.basename)
    }
    get extname() {
        return "string" == typeof this.path ? Er.extname(this.path) : void 0
    }
    set extname(e) {
        if (kr(e, "extname"),
        Cr(this.dirname, "extname"),
        e) {
            if (46 !== e.codePointAt(0))
                throw new Error("`extname` must start with `.`");
            if (e.includes(".", 1))
                throw new Error("`extname` cannot contain multiple dots")
        }
        this.path = Er.join(this.dirname, this.stem + (e || ""))
    }
    get path() {
        return this.history[this.history.length - 1]
    }
    set path(e) {
        Ar(e) && (e = _r(e)),
        Sr(e, "path"),
        this.path !== e && this.history.push(e)
    }
    get stem() {
        return "string" == typeof this.path ? Er.basename(this.path, this.extname) : void 0
    }
    set stem(e) {
        Sr(e, "stem"),
        kr(e, "stem"),
        this.path = Er.join(this.dirname || "", e + (this.extname || ""))
    }
    fail(e, t, n) {
        const r = this.message(e, t, n);
        throw r.fatal = !0,
        r
    }
    info(e, t, n) {
        const r = this.message(e, t, n);
        return r.fatal = void 0,
        r
    }
    message(e, t, n) {
        const r = new me(e,t,n);
        return this.path && (r.name = this.path + ":" + r.name,
        r.file = this.path),
        r.fatal = !1,
        this.messages.push(r),
        r
    }
    toString(e) {
        if (void 0 === this.value)
            return "";
        if ("string" == typeof this.value)
            return this.value;
        return new TextDecoder(e || void 0).decode(this.value)
    }
}
function kr(e, t) {
    if (e && e.includes(Er.sep))
        throw new Error("`" + t + "` cannot be a path: did not expect `" + Er.sep + "`")
}
function Sr(e, t) {
    if (!e)
        throw new Error("`" + t + "` cannot be empty")
}
function Cr(e, t) {
    if (!e)
        throw new Error("Setting `" + t + "` requires `path` to be set too")
}
const Dr = function(e) {
    const t = this.constructor.prototype
      , n = t[e]
      , r = function() {
        return n.apply(r, arguments)
    };
    return Object.setPrototypeOf(r, t),
    r
}
  , Or = {}.hasOwnProperty;
class yr extends Dr {
    constructor() {
        super("copy"),
        this.Compiler = void 0,
        this.Parser = void 0,
        this.attachers = [],
        this.compiler = void 0,
        this.freezeIndex = -1,
        this.frozen = void 0,
        this.namespace = {},
        this.parser = void 0,
        this.transformers = mr()
    }
    copy() {
        const e = new yr;
        let t = -1;
        for (; ++t < this.attachers.length; ) {
            const n = this.attachers[t];
            e.use(...n)
        }
        return e.data(dr(!0, {}, this.namespace)),
        e
    }
    data(e, t) {
        return "string" == typeof e ? 2 === arguments.length ? (Pr("data", this.frozen),
        this.namespace[e] = t,
        this) : Or.call(this.namespace, e) && this.namespace[e] || void 0 : e ? (Pr("data", this.frozen),
        this.namespace = e,
        this) : this.namespace
    }
    freeze() {
        if (this.frozen)
            return this;
        const e = this;
        for (; ++this.freezeIndex < this.attachers.length; ) {
            const [t,...n] = this.attachers[this.freezeIndex];
            if (!1 === n[0])
                continue;
            !0 === n[0] && (n[0] = void 0);
            const r = t.call(e, ...n);
            "function" == typeof r && this.transformers.use(r)
        }
        return this.frozen = !0,
        this.freezeIndex = Number.POSITIVE_INFINITY,
        this
    }
    parse(e) {
        this.freeze();
        const t = vr(e)
          , n = this.parser || this.Parser;
        return Rr("parse", n),
        n(String(t), t)
    }
    process(e, t) {
        const n = this;
        return this.freeze(),
        Rr("process", this.parser || this.Parser),
        Lr("process", this.compiler || this.Compiler),
        t ? r(void 0, t) : new Promise(r);
        function r(r, i) {
            const s = vr(e)
              , o = n.parse(s);
            function a(e, n) {
                e || !n ? i(e) : r ? r(n) : t(void 0, n)
            }
            n.run(o, s, function(e, t, r) {
                if (e || !t || !r)
                    return a(e);
                const i = t
                  , s = n.stringify(i, r);
                var o;
                "string" == typeof (o = s) || function(e) {
                    return Boolean(e && "object" == typeof e && "byteLength"in e && "byteOffset"in e)
                }(o) ? r.value = s : r.result = s,
                a(e, r)
            })
        }
    }
    processSync(e) {
        let t, n = !1;
        return this.freeze(),
        Rr("processSync", this.parser || this.Parser),
        Lr("processSync", this.compiler || this.Compiler),
        this.process(e, function(e, r) {
            n = !0,
            ur(e),
            t = r
        }),
        xr("processSync", "process", n),
        t
    }
    run(e, t, n) {
        Mr(e),
        this.freeze();
        const r = this.transformers;
        return n || "function" != typeof t || (n = t,
        t = void 0),
        n ? i(void 0, n) : new Promise(i);
        function i(i, s) {
            const o = vr(t);
            r.run(e, o, function(t, r, o) {
                const a = r || e;
                t ? s(t) : i ? i(a) : n(void 0, a, o)
            })
        }
    }
    runSync(e, t) {
        let n, r = !1;
        return this.run(e, t, function(e, t) {
            ur(e),
            n = t,
            r = !0
        }),
        xr("runSync", "run", r),
        n
    }
    stringify(e, t) {
        this.freeze();
        const n = vr(t)
          , r = this.compiler || this.Compiler;
        return Lr("stringify", r),
        Mr(e),
        r(e, n)
    }
    use(e, ...t) {
        const n = this.attachers
          , r = this.namespace;
        if (Pr("use", this.frozen),
        null == e)
            ;
        else if ("function" == typeof e)
            a(e, t);
        else {
            if ("object" != typeof e)
                throw new TypeError("Expected usable value, not `" + e + "`");
            Array.isArray(e) ? o(e) : s(e)
        }
        return this;
        function i(e) {
            if ("function" == typeof e)
                a(e, []);
            else {
                if ("object" != typeof e)
                    throw new TypeError("Expected usable value, not `" + e + "`");
                if (Array.isArray(e)) {
                    const [t,...n] = e;
                    a(t, n)
                } else
                    s(e)
            }
        }
        function s(e) {
            if (!("plugins"in e) && !("settings"in e))
                throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");
            o(e.plugins),
            e.settings && (r.settings = dr(!0, r.settings, e.settings))
        }
        function o(e) {
            let t = -1;
            if (null == e)
                ;
            else {
                if (!Array.isArray(e))
                    throw new TypeError("Expected a list of plugins, not `" + e + "`");
                for (; ++t < e.length; ) {
                    i(e[t])
                }
            }
        }
        function a(e, t) {
            let r = -1
              , i = -1;
            for (; ++r < n.length; )
                if (n[r][0] === e) {
                    i = r;
                    break
                }
            if (-1 === i)
                n.push([e, ...t]);
            else if (t.length > 0) {
                let[r,...s] = t;
                const o = n[i][1];
                fr(o) && fr(r) && (r = dr(!0, o, r)),
                n[i] = [e, r, ...s]
            }
        }
    }
}
const br = (new yr).freeze();
function Rr(e, t) {
    if ("function" != typeof t)
        throw new TypeError("Cannot `" + e + "` without `parser`")
}
function Lr(e, t) {
    if ("function" != typeof t)
        throw new TypeError("Cannot `" + e + "` without `compiler`")
}
function Pr(e, t) {
    if (t)
        throw new Error("Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")
}
function Mr(e) {
    if (!fr(e) || "string" != typeof e.type)
        throw new TypeError("Expected node, got `" + e + "`")
}
function xr(e, t, n) {
    if (!n)
        throw new Error("`" + e + "` finished async. Use `" + t + "` instead")
}
function vr(e) {
    return function(e) {
        return Boolean(e && "object" == typeof e && "message"in e && "messages"in e)
    }(e) ? e : new Nr(e)
}
const wr = []
  , Fr = {
    allowDangerousHtml: !0
}
  , Br = /^(https?|ircs?|mailto|xmpp)$/i
  , Hr = [{
    from: "astPlugins",
    id: "remove-buggy-html-in-markdown-parser"
}, {
    from: "allowDangerousHtml",
    id: "remove-buggy-html-in-markdown-parser"
}, {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
}, {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
}, {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
}, {
    from: "escapeHtml",
    id: "remove-buggy-html-in-markdown-parser"
}, {
    from: "includeElementIndex",
    id: "#remove-includeelementindex"
}, {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
}, {
    from: "linkTarget",
    id: "remove-linktarget"
}, {
    from: "plugins",
    id: "change-plugins-to-remarkplugins",
    to: "remarkPlugins"
}, {
    from: "rawSourcePos",
    id: "#remove-rawsourcepos"
}, {
    from: "renderers",
    id: "change-renderers-to-components",
    to: "components"
}, {
    from: "source",
    id: "change-source-to-children",
    to: "children"
}, {
    from: "sourcePos",
    id: "#remove-sourcepos"
}, {
    from: "transformImageUri",
    id: "#add-urltransform",
    to: "urlTransform"
}, {
    from: "transformLinkUri",
    id: "#add-urltransform",
    to: "urlTransform"
}];
function Ur(t) {
    const n = function(e) {
        const t = e.rehypePlugins || wr
          , n = e.remarkPlugins || wr
          , r = e.remarkRehypeOptions ? {
            ...e.remarkRehypeOptions,
            ...Fr
        } : Fr
          , i = br().use(bn).use(n).use(lr, r).use(t);
        return i
    }(t)
      , r = function(e) {
        const t = e.children || ""
          , n = new Nr;
        "string" == typeof t && (n.value = t);
        return n
    }(t);
    return function(t, n) {
        const r = n.allowedElements
          , s = n.allowElement
          , o = n.components
          , a = n.disallowedElements
          , c = n.skipHtml
          , l = n.unwrapDisallowed
          , u = n.urlTransform || Gr;
        for (const e of Hr)
            Object.hasOwn(n, e.from) && i((e.from,
            e.to && e.to,
            e.id));
        n.className && (t = {
            type: "element",
            tagName: "div",
            properties: {
                className: n.className
            },
            children: "root" === t.type ? t.children : [t]
        });
        return er(t, h),
        Ne(t, {
            Fragment: e.Fragment,
            components: o,
            ignoreInvalidStyle: !0,
            jsx: e.jsx,
            jsxs: e.jsxs,
            passKeys: !0,
            passNode: !0
        });
        function h(e, t, n) {
            if ("raw" === e.type && n && "number" == typeof t)
                return c ? n.children.splice(t, 1) : n.children[t] = {
                    type: "text",
                    value: e.value
                },
                t;
            if ("element" === e.type) {
                let t;
                for (t in Pe)
                    if (Object.hasOwn(Pe, t) && Object.hasOwn(e.properties, t)) {
                        const n = e.properties[t]
                          , r = Pe[t];
                        (null === r || r.includes(e.tagName)) && (e.properties[t] = u(String(n || ""), t, e))
                    }
            }
            if ("element" === e.type) {
                let i = r ? !r.includes(e.tagName) : !!a && a.includes(e.tagName);
                if (!i && s && "number" == typeof t && (i = !s(e, t, n)),
                i && n && "number" == typeof t)
                    return l && e.children ? n.children.splice(t, 1, ...e.children) : n.children.splice(t, 1),
                    t
            }
        }
    }(n.runSync(n.parse(r), r), t)
}
function Gr(e) {
    const t = e.indexOf(":")
      , n = e.indexOf("?")
      , r = e.indexOf("#")
      , i = e.indexOf("/");
    return -1 === t || -1 !== i && t > i || -1 !== n && t > n || -1 !== r && t > r || Br.test(e.slice(0, t)) ? e : ""
}
function Yr(e, t) {
    const n = String(e);
    if ("string" != typeof t)
        throw new TypeError("Expected character");
    let r = 0
      , i = n.indexOf(t);
    for (; -1 !== i; )
        r++,
        i = n.indexOf(t, i + t.length);
    return r
}
function zr(e, t, n) {
    const r = jn((n || {}).ignore || [])
      , i = function(e) {
        const t = [];
        if (!Array.isArray(e))
            throw new TypeError("Expected find and replace tuple or list of tuples");
        const n = !e[0] || Array.isArray(e[0]) ? e : [e];
        let r = -1;
        for (; ++r < n.length; ) {
            const e = n[r];
            t.push([qr(e[0]), Vr(e[1])])
        }
        return t
    }(t);
    let s = -1;
    for (; ++s < i.length; )
        Zn(e, "text", o);
    function o(e, t) {
        let n, o = -1;
        for (; ++o < t.length; ) {
            const e = t[o]
              , i = n ? n.children : void 0;
            if (r(e, i ? i.indexOf(e) : void 0, n))
                return;
            n = e
        }
        if (n)
            return function(e, t) {
                const n = t[t.length - 1]
                  , r = i[s][0]
                  , o = i[s][1];
                let a = 0;
                const c = n.children.indexOf(e);
                let l = !1
                  , u = [];
                r.lastIndex = 0;
                let h = r.exec(e.value);
                for (; h; ) {
                    const n = h.index
                      , i = {
                        index: h.index,
                        input: h.input,
                        stack: [...t, e]
                    };
                    let s = o(...h, i);
                    if ("string" == typeof s && (s = s.length > 0 ? {
                        type: "text",
                        value: s
                    } : void 0),
                    !1 === s ? r.lastIndex = n + 1 : (a !== n && u.push({
                        type: "text",
                        value: e.value.slice(a, n)
                    }),
                    Array.isArray(s) ? u.push(...s) : s && u.push(s),
                    a = n + h[0].length,
                    l = !0),
                    !r.global)
                        break;
                    h = r.exec(e.value)
                }
                l ? (a < e.value.length && u.push({
                    type: "text",
                    value: e.value.slice(a)
                }),
                n.children.splice(c, 1, ...u)) : u = [e];
                return c + u.length
            }(e, t)
    }
}
function qr(e) {
    return "string" == typeof e ? new RegExp(function(e) {
        if ("string" != typeof e)
            throw new TypeError("Expected a string");
        return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
    }(e),"g") : e
}
function Vr(e) {
    return "function" == typeof e ? e : function() {
        return e
    }
}
const Qr = "phrasing"
  , jr = ["autolink", "link", "image", "label"];
function Wr(e) {
    this.enter({
        type: "link",
        title: null,
        url: "",
        children: []
    }, e)
}
function Kr(e) {
    this.config.enter.autolinkProtocol.call(this, e)
}
function Xr(e) {
    this.config.exit.autolinkProtocol.call(this, e)
}
function Jr(e) {
    this.config.exit.data.call(this, e);
    const t = this.stack[this.stack.length - 1];
    t.type,
    t.url = "http://" + this.sliceSerialize(e)
}
function $r(e) {
    this.config.exit.autolinkEmail.call(this, e)
}
function Zr(e) {
    this.exit(e)
}
function ei(e) {
    zr(e, [[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, ti], [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)","gu"), ni]], {
        ignore: ["link", "linkReference"]
    })
}
function ti(e, t, n, r, i) {
    let s = "";
    if (!ri(i))
        return !1;
    if (/^w/i.test(t) && (n = t + n,
    t = "",
    s = "http://"),
    !function(e) {
        const t = e.split(".");
        if (t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])))
            return !1;
        return !0
    }(n))
        return !1;
    const o = function(e) {
        const t = /[!"&'),.:;<>?\]}]+$/.exec(e);
        if (!t)
            return [e, void 0];
        e = e.slice(0, t.index);
        let n = t[0]
          , r = n.indexOf(")");
        const i = Yr(e, "(");
        let s = Yr(e, ")");
        for (; -1 !== r && i > s; )
            e += n.slice(0, r + 1),
            n = n.slice(r + 1),
            r = n.indexOf(")"),
            s++;
        return [e, n]
    }(n + r);
    if (!o[0])
        return !1;
    const a = {
        type: "link",
        title: null,
        url: s + t + o[0],
        children: [{
            type: "text",
            value: t + o[0]
        }]
    };
    return o[1] ? [a, {
        type: "text",
        value: o[1]
    }] : a
}
function ni(e, t, n, r) {
    return !(!ri(r, !0) || /[-\d_]$/.test(n)) && {
        type: "link",
        title: null,
        url: "mailto:" + t + "@" + n,
        children: [{
            type: "text",
            value: t + "@" + n
        }]
    }
}
function ri(e, t) {
    const n = e.input.charCodeAt(e.index - 1);
    return (0 === e.index || it(n) || rt(n)) && (!t || 47 !== n)
}
function ii() {
    this.buffer()
}
function si(e) {
    this.enter({
        type: "footnoteReference",
        identifier: "",
        label: ""
    }, e)
}
function oi() {
    this.buffer()
}
function ai(e) {
    this.enter({
        type: "footnoteDefinition",
        identifier: "",
        label: "",
        children: []
    }, e)
}
function ci(e) {
    const t = this.resume()
      , n = this.stack[this.stack.length - 1];
    n.type,
    n.identifier = Qe(this.sliceSerialize(e)).toLowerCase(),
    n.label = t
}
function li(e) {
    this.exit(e)
}
function ui(e) {
    const t = this.resume()
      , n = this.stack[this.stack.length - 1];
    n.type,
    n.identifier = Qe(this.sliceSerialize(e)).toLowerCase(),
    n.label = t
}
function hi(e) {
    this.exit(e)
}
function pi(e, t, n, r) {
    const i = n.createTracker(r);
    let s = i.move("[^");
    const o = n.enter("footnoteReference")
      , a = n.enter("reference");
    return s += i.move(n.safe(n.associationId(e), {
        after: "]",
        before: s
    })),
    a(),
    o(),
    s += i.move("]"),
    s
}
function di(e) {
    let t = !1;
    return e && e.firstLineBlank && (t = !0),
    {
        handlers: {
            footnoteDefinition: function(e, n, r, i) {
                const s = r.createTracker(i);
                let o = s.move("[^");
                const a = r.enter("footnoteDefinition")
                  , c = r.enter("label");
                o += s.move(r.safe(r.associationId(e), {
                    before: o,
                    after: "]"
                })),
                c(),
                o += s.move("]:"),
                e.children && e.children.length > 0 && (s.shift(4),
                o += s.move((t ? "\n" : " ") + r.indentLines(r.containerFlow(e, s.current()), t ? mi : fi)));
                return a(),
                o
            },
            footnoteReference: pi
        },
        unsafe: [{
            character: "[",
            inConstruct: ["label", "phrasing", "reference"]
        }]
    }
}
function fi(e, t, n) {
    return 0 === t ? e : mi(e, t, n)
}
function mi(e, t, n) {
    return (n ? "" : "    ") + e
}
pi.peek = function() {
    return "["
}
;
const Ei = ["autolink", "destinationLiteral", "destinationRaw", "reference", "titleQuote", "titleApostrophe"];
function Ti(e) {
    this.enter({
        type: "delete",
        children: []
    }, e)
}
function gi(e) {
    this.exit(e)
}
function Ai(e, t, n, r) {
    const i = n.createTracker(r)
      , s = n.enter("strikethrough");
    let o = i.move("~~");
    return o += n.containerPhrasing(e, {
        ...i.current(),
        before: o,
        after: "~"
    }),
    o += i.move("~~"),
    s(),
    o
}
function _i(e) {
    return e.length
}
function Ii(e) {
    return null == e ? "" : String(e)
}
function Ni(e) {
    const t = "string" == typeof e ? e.codePointAt(0) : 0;
    return 67 === t || 99 === t ? 99 : 76 === t || 108 === t ? 108 : 82 === t || 114 === t ? 114 : 0
}
Ai.peek = function() {
    return "~"
}
;
const ki = {}.hasOwnProperty;
function Si(e, t) {
    const n = t || {};
    function r(t, ...n) {
        let i = r.invalid;
        const s = r.handlers;
        if (t && ki.call(t, e)) {
            const n = String(t[e]);
            i = ki.call(s, n) ? s[n] : r.unknown
        }
        if (i)
            return i.call(this, t, ...n)
    }
    return r.handlers = n.handlers || {},
    r.invalid = n.invalid,
    r.unknown = n.unknown,
    r
}
function Ci(e, t, n) {
    return ">" + (n ? "" : " ") + e
}
function Di(e, t) {
    return Oi(e, t.inConstruct, !0) && !Oi(e, t.notInConstruct, !1)
}
function Oi(e, t, n) {
    if ("string" == typeof t && (t = [t]),
    !t || 0 === t.length)
        return n;
    let r = -1;
    for (; ++r < t.length; )
        if (e.includes(t[r]))
            return !0;
    return !1
}
function yi(e, t, n, r) {
    let i = -1;
    for (; ++i < n.unsafe.length; )
        if ("\n" === n.unsafe[i].character && Di(n.stack, n.unsafe[i]))
            return /[ \t]/.test(r.before) ? "" : " ";
    return "\\\n"
}
function bi(e, t, n) {
    return (n ? "" : "    ") + e
}
function Ri(e) {
    const t = e.options.quote || '"';
    if ('"' !== t && "'" !== t)
        throw new Error("Cannot serialize title with `" + t + "` for `options.quote`, expected `\"`, or `'`");
    return t
}
function Li(e) {
    return "&#x" + e.toString(16).toUpperCase() + ";"
}
function Pi(e, t, n) {
    const r = ht(e)
      , i = ht(t);
    return void 0 === r ? void 0 === i ? "_" === n ? {
        inside: !0,
        outside: !0
    } : {
        inside: !1,
        outside: !1
    } : 1 === i ? {
        inside: !0,
        outside: !0
    } : {
        inside: !1,
        outside: !0
    } : 1 === r ? void 0 === i ? {
        inside: !1,
        outside: !1
    } : 1 === i ? {
        inside: !0,
        outside: !0
    } : {
        inside: !1,
        outside: !1
    } : void 0 === i ? {
        inside: !1,
        outside: !1
    } : 1 === i ? {
        inside: !0,
        outside: !1
    } : {
        inside: !1,
        outside: !1
    }
}
function Mi(e, t, n, r) {
    const i = function(e) {
        const t = e.options.emphasis || "*";
        if ("*" !== t && "_" !== t)
            throw new Error("Cannot serialize emphasis with `" + t + "` for `options.emphasis`, expected `*`, or `_`");
        return t
    }(n)
      , s = n.enter("emphasis")
      , o = n.createTracker(r)
      , a = o.move(i);
    let c = o.move(n.containerPhrasing(e, {
        after: i,
        before: a,
        ...o.current()
    }));
    const l = c.charCodeAt(0)
      , u = Pi(r.before.charCodeAt(r.before.length - 1), l, i);
    u.inside && (c = Li(l) + c.slice(1));
    const h = c.charCodeAt(c.length - 1)
      , p = Pi(r.after.charCodeAt(0), h, i);
    p.inside && (c = c.slice(0, -1) + Li(h));
    const d = o.move(i);
    return s(),
    n.attentionEncodeSurroundingInfo = {
        after: p.outside,
        before: u.outside
    },
    a + c + d
}
function xi(e) {
    return e.value || ""
}
function vi(e, t, n, r) {
    const i = Ri(n)
      , s = '"' === i ? "Quote" : "Apostrophe"
      , o = n.enter("image");
    let a = n.enter("label");
    const c = n.createTracker(r);
    let l = c.move("![");
    return l += c.move(n.safe(e.alt, {
        before: l,
        after: "]",
        ...c.current()
    })),
    l += c.move("]("),
    a(),
    !e.url && e.title || /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"),
    l += c.move("<"),
    l += c.move(n.safe(e.url, {
        before: l,
        after: ">",
        ...c.current()
    })),
    l += c.move(">")) : (a = n.enter("destinationRaw"),
    l += c.move(n.safe(e.url, {
        before: l,
        after: e.title ? " " : ")",
        ...c.current()
    }))),
    a(),
    e.title && (a = n.enter(`title${s}`),
    l += c.move(" " + i),
    l += c.move(n.safe(e.title, {
        before: l,
        after: i,
        ...c.current()
    })),
    l += c.move(i),
    a()),
    l += c.move(")"),
    o(),
    l
}
function wi(e, t, n, r) {
    const i = e.referenceType
      , s = n.enter("imageReference");
    let o = n.enter("label");
    const a = n.createTracker(r);
    let c = a.move("![");
    const l = n.safe(e.alt, {
        before: c,
        after: "]",
        ...a.current()
    });
    c += a.move(l + "]["),
    o();
    const u = n.stack;
    n.stack = [],
    o = n.enter("reference");
    const h = n.safe(n.associationId(e), {
        before: c,
        after: "]",
        ...a.current()
    });
    return o(),
    n.stack = u,
    s(),
    "full" !== i && l && l === h ? "shortcut" === i ? c = c.slice(0, -1) : c += a.move("]") : c += a.move(h + "]"),
    c
}
function Fi(e, t, n) {
    let r = e.value || ""
      , i = "`"
      , s = -1;
    for (; new RegExp("(^|[^`])" + i + "([^`]|$)").test(r); )
        i += "`";
    for (/[^ \r\n]/.test(r) && (/^[ \r\n]/.test(r) && /[ \r\n]$/.test(r) || /^`|`$/.test(r)) && (r = " " + r + " "); ++s < n.unsafe.length; ) {
        const e = n.unsafe[s]
          , t = n.compilePattern(e);
        let i;
        if (e.atBreak)
            for (; i = t.exec(r); ) {
                let e = i.index;
                10 === r.charCodeAt(e) && 13 === r.charCodeAt(e - 1) && e--,
                r = r.slice(0, e) + " " + r.slice(i.index + 1)
            }
    }
    return i + r + i
}
function Bi(e, t) {
    const n = xe(e);
    return Boolean(!t.options.resourceLink && e.url && !e.title && e.children && 1 === e.children.length && "text" === e.children[0].type && (n === e.url || "mailto:" + n === e.url) && /^[a-z][a-z+.-]+:/i.test(e.url) && !/[\0- <>\u007F]/.test(e.url))
}
function Hi(e, t, n, r) {
    const i = Ri(n)
      , s = '"' === i ? "Quote" : "Apostrophe"
      , o = n.createTracker(r);
    let a, c;
    if (Bi(e, n)) {
        const t = n.stack;
        n.stack = [],
        a = n.enter("autolink");
        let r = o.move("<");
        return r += o.move(n.containerPhrasing(e, {
            before: r,
            after: ">",
            ...o.current()
        })),
        r += o.move(">"),
        a(),
        n.stack = t,
        r
    }
    a = n.enter("link"),
    c = n.enter("label");
    let l = o.move("[");
    return l += o.move(n.containerPhrasing(e, {
        before: l,
        after: "](",
        ...o.current()
    })),
    l += o.move("]("),
    c(),
    !e.url && e.title || /[\0- \u007F]/.test(e.url) ? (c = n.enter("destinationLiteral"),
    l += o.move("<"),
    l += o.move(n.safe(e.url, {
        before: l,
        after: ">",
        ...o.current()
    })),
    l += o.move(">")) : (c = n.enter("destinationRaw"),
    l += o.move(n.safe(e.url, {
        before: l,
        after: e.title ? " " : ")",
        ...o.current()
    }))),
    c(),
    e.title && (c = n.enter(`title${s}`),
    l += o.move(" " + i),
    l += o.move(n.safe(e.title, {
        before: l,
        after: i,
        ...o.current()
    })),
    l += o.move(i),
    c()),
    l += o.move(")"),
    a(),
    l
}
function Ui(e, t, n, r) {
    const i = e.referenceType
      , s = n.enter("linkReference");
    let o = n.enter("label");
    const a = n.createTracker(r);
    let c = a.move("[");
    const l = n.containerPhrasing(e, {
        before: c,
        after: "]",
        ...a.current()
    });
    c += a.move(l + "]["),
    o();
    const u = n.stack;
    n.stack = [],
    o = n.enter("reference");
    const h = n.safe(n.associationId(e), {
        before: c,
        after: "]",
        ...a.current()
    });
    return o(),
    n.stack = u,
    s(),
    "full" !== i && l && l === h ? "shortcut" === i ? c = c.slice(0, -1) : c += a.move("]") : c += a.move(h + "]"),
    c
}
function Gi(e) {
    const t = e.options.bullet || "*";
    if ("*" !== t && "+" !== t && "-" !== t)
        throw new Error("Cannot serialize items with `" + t + "` for `options.bullet`, expected `*`, `+`, or `-`");
    return t
}
function Yi(e) {
    const t = e.options.rule || "*";
    if ("*" !== t && "-" !== t && "_" !== t)
        throw new Error("Cannot serialize rules with `" + t + "` for `options.rule`, expected `*`, `-`, or `_`");
    return t
}
Mi.peek = function(e, t, n) {
    return n.options.emphasis || "*"
}
,
xi.peek = function() {
    return "<"
}
,
vi.peek = function() {
    return "!"
}
,
wi.peek = function() {
    return "!"
}
,
Fi.peek = function() {
    return "`"
}
,
Hi.peek = function(e, t, n) {
    return Bi(e, n) ? "<" : "["
}
,
Ui.peek = function() {
    return "["
}
;
const zi = jn(["break", "delete", "emphasis", "footnote", "footnoteReference", "image", "imageReference", "inlineCode", "inlineMath", "link", "linkReference", "mdxJsxTextElement", "mdxTextExpression", "strong", "text", "textDirective"]);
function qi(e, t, n, r) {
    const i = function(e) {
        const t = e.options.strong || "*";
        if ("*" !== t && "_" !== t)
            throw new Error("Cannot serialize strong with `" + t + "` for `options.strong`, expected `*`, or `_`");
        return t
    }(n)
      , s = n.enter("strong")
      , o = n.createTracker(r)
      , a = o.move(i + i);
    let c = o.move(n.containerPhrasing(e, {
        after: i,
        before: a,
        ...o.current()
    }));
    const l = c.charCodeAt(0)
      , u = Pi(r.before.charCodeAt(r.before.length - 1), l, i);
    u.inside && (c = Li(l) + c.slice(1));
    const h = c.charCodeAt(c.length - 1)
      , p = Pi(r.after.charCodeAt(0), h, i);
    p.inside && (c = c.slice(0, -1) + Li(h));
    const d = o.move(i + i);
    return s(),
    n.attentionEncodeSurroundingInfo = {
        after: p.outside,
        before: u.outside
    },
    a + c + d
}
qi.peek = function(e, t, n) {
    return n.options.strong || "*"
}
;
const Vi = {
    blockquote: function(e, t, n, r) {
        const i = n.enter("blockquote")
          , s = n.createTracker(r);
        s.move("> "),
        s.shift(2);
        const o = n.indentLines(n.containerFlow(e, s.current()), Ci);
        return i(),
        o
    },
    break: yi,
    code: function(e, t, n, r) {
        const i = function(e) {
            const t = e.options.fence || "`";
            if ("`" !== t && "~" !== t)
                throw new Error("Cannot serialize code with `" + t + "` for `options.fence`, expected `` ` `` or `~`");
            return t
        }(n)
          , s = e.value || ""
          , o = "`" === i ? "GraveAccent" : "Tilde";
        if (function(e, t) {
            return Boolean(!1 === t.options.fences && e.value && !e.lang && /[^ \r\n]/.test(e.value) && !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value))
        }(e, n)) {
            const e = n.enter("codeIndented")
              , t = n.indentLines(s, bi);
            return e(),
            t
        }
        const a = n.createTracker(r)
          , c = i.repeat(Math.max(function(e, t) {
            const n = String(e);
            let r = n.indexOf(t)
              , i = r
              , s = 0
              , o = 0;
            if ("string" != typeof t)
                throw new TypeError("Expected substring");
            for (; -1 !== r; )
                r === i ? ++s > o && (o = s) : s = 1,
                i = r + t.length,
                r = n.indexOf(t, i);
            return o
        }(s, i) + 1, 3))
          , l = n.enter("codeFenced");
        let u = a.move(c);
        if (e.lang) {
            const t = n.enter(`codeFencedLang${o}`);
            u += a.move(n.safe(e.lang, {
                before: u,
                after: " ",
                encode: ["`"],
                ...a.current()
            })),
            t()
        }
        if (e.lang && e.meta) {
            const t = n.enter(`codeFencedMeta${o}`);
            u += a.move(" "),
            u += a.move(n.safe(e.meta, {
                before: u,
                after: "\n",
                encode: ["`"],
                ...a.current()
            })),
            t()
        }
        return u += a.move("\n"),
        s && (u += a.move(s + "\n")),
        u += a.move(c),
        l(),
        u
    },
    definition: function(e, t, n, r) {
        const i = Ri(n)
          , s = '"' === i ? "Quote" : "Apostrophe"
          , o = n.enter("definition");
        let a = n.enter("label");
        const c = n.createTracker(r);
        let l = c.move("[");
        return l += c.move(n.safe(n.associationId(e), {
            before: l,
            after: "]",
            ...c.current()
        })),
        l += c.move("]: "),
        a(),
        !e.url || /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"),
        l += c.move("<"),
        l += c.move(n.safe(e.url, {
            before: l,
            after: ">",
            ...c.current()
        })),
        l += c.move(">")) : (a = n.enter("destinationRaw"),
        l += c.move(n.safe(e.url, {
            before: l,
            after: e.title ? " " : "\n",
            ...c.current()
        }))),
        a(),
        e.title && (a = n.enter(`title${s}`),
        l += c.move(" " + i),
        l += c.move(n.safe(e.title, {
            before: l,
            after: i,
            ...c.current()
        })),
        l += c.move(i),
        a()),
        o(),
        l
    },
    emphasis: Mi,
    hardBreak: yi,
    heading: function(e, t, n, r) {
        const i = Math.max(Math.min(6, e.depth || 1), 1)
          , s = n.createTracker(r);
        if (function(e, t) {
            let n = !1;
            return er(e, function(e) {
                if ("value"in e && /\r?\n|\r/.test(e.value) || "break" === e.type)
                    return n = !0,
                    $n
            }),
            Boolean((!e.depth || e.depth < 3) && xe(e) && (t.options.setext || n))
        }(e, n)) {
            const t = n.enter("headingSetext")
              , r = n.enter("phrasing")
              , o = n.containerPhrasing(e, {
                ...s.current(),
                before: "\n",
                after: "\n"
            });
            return r(),
            t(),
            o + "\n" + (1 === i ? "=" : "-").repeat(o.length - (Math.max(o.lastIndexOf("\r"), o.lastIndexOf("\n")) + 1))
        }
        const o = "#".repeat(i)
          , a = n.enter("headingAtx")
          , c = n.enter("phrasing");
        s.move(o + " ");
        let l = n.containerPhrasing(e, {
            before: "# ",
            after: "\n",
            ...s.current()
        });
        return /^[\t ]/.test(l) && (l = Li(l.charCodeAt(0)) + l.slice(1)),
        l = l ? o + " " + l : o,
        n.options.closeAtx && (l += " " + o),
        c(),
        a(),
        l
    },
    html: xi,
    image: vi,
    imageReference: wi,
    inlineCode: Fi,
    link: Hi,
    linkReference: Ui,
    list: function(e, t, n, r) {
        const i = n.enter("list")
          , s = n.bulletCurrent;
        let o = e.ordered ? function(e) {
            const t = e.options.bulletOrdered || ".";
            if ("." !== t && ")" !== t)
                throw new Error("Cannot serialize items with `" + t + "` for `options.bulletOrdered`, expected `.` or `)`");
            return t
        }(n) : Gi(n);
        const a = e.ordered ? "." === o ? ")" : "." : function(e) {
            const t = Gi(e)
              , n = e.options.bulletOther;
            if (!n)
                return "*" === t ? "-" : "*";
            if ("*" !== n && "+" !== n && "-" !== n)
                throw new Error("Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
            if (n === t)
                throw new Error("Expected `bullet` (`" + t + "`) and `bulletOther` (`" + n + "`) to be different");
            return n
        }(n);
        let c = !(!t || !n.bulletLastUsed) && o === n.bulletLastUsed;
        if (!e.ordered) {
            const t = e.children ? e.children[0] : void 0;
            if ("*" !== o && "-" !== o || !t || t.children && t.children[0] || "list" !== n.stack[n.stack.length - 1] || "listItem" !== n.stack[n.stack.length - 2] || "list" !== n.stack[n.stack.length - 3] || "listItem" !== n.stack[n.stack.length - 4] || 0 !== n.indexStack[n.indexStack.length - 1] || 0 !== n.indexStack[n.indexStack.length - 2] || 0 !== n.indexStack[n.indexStack.length - 3] || (c = !0),
            Yi(n) === o && t) {
                let t = -1;
                for (; ++t < e.children.length; ) {
                    const n = e.children[t];
                    if (n && "listItem" === n.type && n.children && n.children[0] && "thematicBreak" === n.children[0].type) {
                        c = !0;
                        break
                    }
                }
            }
        }
        c && (o = a),
        n.bulletCurrent = o;
        const l = n.containerFlow(e, r);
        return n.bulletLastUsed = o,
        n.bulletCurrent = s,
        i(),
        l
    },
    listItem: function(e, t, n, r) {
        const i = function(e) {
            const t = e.options.listItemIndent || "one";
            if ("tab" !== t && "one" !== t && "mixed" !== t)
                throw new Error("Cannot serialize items with `" + t + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
            return t
        }(n);
        let s = n.bulletCurrent || Gi(n);
        t && "list" === t.type && t.ordered && (s = ("number" == typeof t.start && t.start > -1 ? t.start : 1) + (!1 === n.options.incrementListMarker ? 0 : t.children.indexOf(e)) + s);
        let o = s.length + 1;
        ("tab" === i || "mixed" === i && (t && "list" === t.type && t.spread || e.spread)) && (o = 4 * Math.ceil(o / 4));
        const a = n.createTracker(r);
        a.move(s + " ".repeat(o - s.length)),
        a.shift(o);
        const c = n.enter("listItem")
          , l = n.indentLines(n.containerFlow(e, a.current()), function(e, t, n) {
            if (t)
                return (n ? "" : " ".repeat(o)) + e;
            return (n ? s : s + " ".repeat(o - s.length)) + e
        });
        return c(),
        l
    },
    paragraph: function(e, t, n, r) {
        const i = n.enter("paragraph")
          , s = n.enter("phrasing")
          , o = n.containerPhrasing(e, r);
        return s(),
        i(),
        o
    },
    root: function(e, t, n, r) {
        return (e.children.some(function(e) {
            return zi(e)
        }) ? n.containerPhrasing : n.containerFlow).call(n, e, r)
    },
    strong: qi,
    text: function(e, t, n, r) {
        return n.safe(e.value, r)
    },
    thematicBreak: function(e, t, n) {
        const r = (Yi(n) + (n.options.ruleSpaces ? " " : "")).repeat(function(e) {
            const t = e.options.ruleRepetition || 3;
            if (t < 3)
                throw new Error("Cannot serialize rules with repetition `" + t + "` for `options.ruleRepetition`, expected `3` or more");
            return t
        }(n));
        return n.options.ruleSpaces ? r.slice(0, -1) : r
    }
};
function Qi(e) {
    const t = e._align;
    this.enter({
        type: "table",
        align: t.map(function(e) {
            return "none" === e ? null : e
        }),
        children: []
    }, e),
    this.data.inTable = !0
}
function ji(e) {
    this.exit(e),
    this.data.inTable = void 0
}
function Wi(e) {
    this.enter({
        type: "tableRow",
        children: []
    }, e)
}
function Ki(e) {
    this.exit(e)
}
function Xi(e) {
    this.enter({
        type: "tableCell",
        children: []
    }, e)
}
function Ji(e) {
    let t = this.resume();
    this.data.inTable && (t = t.replace(/\\([\\|])/g, $i));
    const n = this.stack[this.stack.length - 1];
    n.type,
    n.value = t,
    this.exit(e)
}
function $i(e, t) {
    return "|" === t ? t : e
}
function Zi(e) {
    const t = e || {}
      , n = t.tableCellPadding
      , r = t.tablePipeAlign
      , i = t.stringLength
      , s = n ? " " : "|";
    return {
        unsafe: [{
            character: "\r",
            inConstruct: "tableCell"
        }, {
            character: "\n",
            inConstruct: "tableCell"
        }, {
            atBreak: !0,
            character: "|",
            after: "[\t :-]"
        }, {
            character: "|",
            inConstruct: "tableCell"
        }, {
            atBreak: !0,
            character: ":",
            after: "-"
        }, {
            atBreak: !0,
            character: "-",
            after: "[:|-]"
        }],
        handlers: {
            inlineCode: function(e, t, n) {
                let r = Vi.inlineCode(e, t, n);
                n.stack.includes("tableCell") && (r = r.replace(/\|/g, "\\$&"));
                return r
            },
            table: function(e, t, n, r) {
                return a(function(e, t, n) {
                    const r = e.children;
                    let i = -1;
                    const s = []
                      , o = t.enter("table");
                    for (; ++i < r.length; )
                        s[i] = c(r[i], t, n);
                    return o(),
                    s
                }(e, n, r), e.align)
            },
            tableCell: o,
            tableRow: function(e, t, n, r) {
                const i = a([c(e, n, r)]);
                return i.slice(0, i.indexOf("\n"))
            }
        }
    };
    function o(e, t, n, r) {
        const i = n.enter("tableCell")
          , o = n.enter("phrasing")
          , a = n.containerPhrasing(e, {
            ...r,
            before: s,
            after: s
        });
        return o(),
        i(),
        a
    }
    function a(e, t) {
        return function(e, t) {
            const n = t || {}
              , r = (n.align || []).concat()
              , i = n.stringLength || _i
              , s = []
              , o = []
              , a = []
              , c = [];
            let l = 0
              , u = -1;
            for (; ++u < e.length; ) {
                const t = []
                  , r = [];
                let s = -1;
                for (e[u].length > l && (l = e[u].length); ++s < e[u].length; ) {
                    const o = Ii(e[u][s]);
                    if (!1 !== n.alignDelimiters) {
                        const e = i(o);
                        r[s] = e,
                        (void 0 === c[s] || e > c[s]) && (c[s] = e)
                    }
                    t.push(o)
                }
                o[u] = t,
                a[u] = r
            }
            let h = -1;
            if ("object" == typeof r && "length"in r)
                for (; ++h < l; )
                    s[h] = Ni(r[h]);
            else {
                const e = Ni(r);
                for (; ++h < l; )
                    s[h] = e
            }
            h = -1;
            const p = []
              , d = [];
            for (; ++h < l; ) {
                const e = s[h];
                let t = ""
                  , r = "";
                99 === e ? (t = ":",
                r = ":") : 108 === e ? t = ":" : 114 === e && (r = ":");
                let i = !1 === n.alignDelimiters ? 1 : Math.max(1, c[h] - t.length - r.length);
                const o = t + "-".repeat(i) + r;
                !1 !== n.alignDelimiters && (i = t.length + i + r.length,
                i > c[h] && (c[h] = i),
                d[h] = i),
                p[h] = o
            }
            o.splice(1, 0, p),
            a.splice(1, 0, d),
            u = -1;
            const f = [];
            for (; ++u < o.length; ) {
                const e = o[u]
                  , t = a[u];
                h = -1;
                const r = [];
                for (; ++h < l; ) {
                    const i = e[h] || "";
                    let o = ""
                      , a = "";
                    if (!1 !== n.alignDelimiters) {
                        const e = c[h] - (t[h] || 0)
                          , n = s[h];
                        114 === n ? o = " ".repeat(e) : 99 === n ? e % 2 ? (o = " ".repeat(e / 2 + .5),
                        a = " ".repeat(e / 2 - .5)) : (o = " ".repeat(e / 2),
                        a = o) : a = " ".repeat(e)
                    }
                    !1 === n.delimiterStart || h || r.push("|"),
                    !1 === n.padding || !1 === n.alignDelimiters && "" === i || !1 === n.delimiterStart && !h || r.push(" "),
                    !1 !== n.alignDelimiters && r.push(o),
                    r.push(i),
                    !1 !== n.alignDelimiters && r.push(a),
                    !1 !== n.padding && r.push(" "),
                    !1 === n.delimiterEnd && h === l - 1 || r.push("|")
                }
                f.push(!1 === n.delimiterEnd ? r.join("").replace(/ +$/, "") : r.join(""))
            }
            return f.join("\n")
        }(e, {
            align: t,
            alignDelimiters: r,
            padding: n,
            stringLength: i
        })
    }
    function c(e, t, n) {
        const r = e.children;
        let i = -1;
        const s = []
          , a = t.enter("tableRow");
        for (; ++i < r.length; )
            s[i] = o(r[i], 0, t, n);
        return a(),
        s
    }
}
function es(e) {
    const t = this.stack[this.stack.length - 2];
    t.type,
    t.checked = "taskListCheckValueChecked" === e.type
}
function ts(e) {
    const t = this.stack[this.stack.length - 2];
    if (t && "listItem" === t.type && "boolean" == typeof t.checked) {
        const e = this.stack[this.stack.length - 1];
        e.type;
        const n = e.children[0];
        if (n && "text" === n.type) {
            const r = t.children;
            let i, s = -1;
            for (; ++s < r.length; ) {
                const e = r[s];
                if ("paragraph" === e.type) {
                    i = e;
                    break
                }
            }
            i === e && (n.value = n.value.slice(1),
            0 === n.value.length ? e.children.shift() : e.position && n.position && "number" == typeof n.position.start.offset && (n.position.start.column++,
            n.position.start.offset++,
            e.position.start = Object.assign({}, n.position.start)))
        }
    }
    this.exit(e)
}
function ns(e, t, n, r) {
    const i = e.children[0]
      , s = "boolean" == typeof e.checked && i && "paragraph" === i.type
      , o = "[" + (e.checked ? "x" : " ") + "] "
      , a = n.createTracker(r);
    s && a.move(o);
    let c = Vi.listItem(e, t, n, {
        ...r,
        ...a.current()
    });
    return s && (c = c.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, function(e) {
        return e + o
    })),
    c
}
const rs = {
    tokenize: function(e, t, n) {
        let r = 0;
        return function t(s) {
            if ((87 === s || 119 === s) && r < 3)
                return r++,
                e.consume(s),
                t;
            if (46 === s && 3 === r)
                return e.consume(s),
                i;
            return n(s)
        }
        ;
        function i(e) {
            return null === e ? n(e) : t(e)
        }
    },
    partial: !0
}
  , is = {
    tokenize: function(e, t, n) {
        let r, i, s;
        return o;
        function o(t) {
            return 46 === t || 95 === t ? e.check(os, c, a)(t) : null === t || tt(t) || it(t) || 45 !== t && rt(t) ? c(t) : (s = !0,
            e.consume(t),
            o)
        }
        function a(t) {
            return 95 === t ? r = !0 : (i = r,
            r = void 0),
            e.consume(t),
            o
        }
        function c(e) {
            return i || r || !s ? n(e) : t(e)
        }
    },
    partial: !0
}
  , ss = {
    tokenize: function(e, t) {
        let n = 0
          , r = 0;
        return i;
        function i(o) {
            return 40 === o ? (n++,
            e.consume(o),
            i) : 41 === o && r < n ? s(o) : 33 === o || 34 === o || 38 === o || 39 === o || 41 === o || 42 === o || 44 === o || 46 === o || 58 === o || 59 === o || 60 === o || 63 === o || 93 === o || 95 === o || 126 === o ? e.check(os, t, s)(o) : null === o || tt(o) || it(o) ? t(o) : (e.consume(o),
            i)
        }
        function s(t) {
            return 41 === t && r++,
            e.consume(t),
            i
        }
    },
    partial: !0
}
  , os = {
    tokenize: function(e, t, n) {
        return r;
        function r(o) {
            return 33 === o || 34 === o || 39 === o || 41 === o || 42 === o || 44 === o || 46 === o || 58 === o || 59 === o || 63 === o || 95 === o || 126 === o ? (e.consume(o),
            r) : 38 === o ? (e.consume(o),
            s) : 93 === o ? (e.consume(o),
            i) : 60 === o || null === o || tt(o) || it(o) ? t(o) : n(o)
        }
        function i(e) {
            return null === e || 40 === e || 91 === e || tt(e) || it(e) ? t(e) : r(e)
        }
        function s(e) {
            return je(e) ? o(e) : n(e)
        }
        function o(t) {
            return 59 === t ? (e.consume(t),
            r) : je(t) ? (e.consume(t),
            o) : n(t)
        }
    },
    partial: !0
}
  , as = {
    tokenize: function(e, t, n) {
        return function(t) {
            return e.consume(t),
            r
        }
        ;
        function r(e) {
            return We(e) ? n(e) : t(e)
        }
    },
    partial: !0
}
  , cs = {
    name: "wwwAutolink",
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            if (87 !== t && 119 !== t || !ds.call(r, r.previous) || Ts(r.events))
                return n(t);
            return e.enter("literalAutolink"),
            e.enter("literalAutolinkWww"),
            e.check(rs, e.attempt(is, e.attempt(ss, i), n), n)(t)
        }
        ;
        function i(n) {
            return e.exit("literalAutolinkWww"),
            e.exit("literalAutolink"),
            t(n)
        }
    },
    previous: ds
}
  , ls = {
    name: "protocolAutolink",
    tokenize: function(e, t, n) {
        const r = this;
        let i = ""
          , s = !1;
        return function(t) {
            if ((72 === t || 104 === t) && fs.call(r, r.previous) && !Ts(r.events))
                return e.enter("literalAutolink"),
                e.enter("literalAutolinkHttp"),
                i += String.fromCodePoint(t),
                e.consume(t),
                o;
            return n(t)
        }
        ;
        function o(t) {
            if (je(t) && i.length < 5)
                return i += String.fromCodePoint(t),
                e.consume(t),
                o;
            if (58 === t) {
                const n = i.toLowerCase();
                if ("http" === n || "https" === n)
                    return e.consume(t),
                    a
            }
            return n(t)
        }
        function a(t) {
            return 47 === t ? (e.consume(t),
            s ? c : (s = !0,
            a)) : n(t)
        }
        function c(t) {
            return null === t || Xe(t) || tt(t) || it(t) || rt(t) ? n(t) : e.attempt(is, e.attempt(ss, l), n)(t)
        }
        function l(n) {
            return e.exit("literalAutolinkHttp"),
            e.exit("literalAutolink"),
            t(n)
        }
    },
    previous: fs
}
  , us = {
    name: "emailAutolink",
    tokenize: function(e, t, n) {
        const r = this;
        let i, s;
        return function(t) {
            if (!Es(t) || !ms.call(r, r.previous) || Ts(r.events))
                return n(t);
            return e.enter("literalAutolink"),
            e.enter("literalAutolinkEmail"),
            o(t)
        }
        ;
        function o(t) {
            return Es(t) ? (e.consume(t),
            o) : 64 === t ? (e.consume(t),
            a) : n(t)
        }
        function a(t) {
            return 46 === t ? e.check(as, l, c)(t) : 45 === t || 95 === t || We(t) ? (s = !0,
            e.consume(t),
            a) : l(t)
        }
        function c(t) {
            return e.consume(t),
            i = !0,
            a
        }
        function l(o) {
            return s && i && je(r.previous) ? (e.exit("literalAutolinkEmail"),
            e.exit("literalAutolink"),
            t(o)) : n(o)
        }
    },
    previous: ms
}
  , hs = {};
let ps = 48;
for (; ps < 123; )
    hs[ps] = us,
    ps++,
    58 === ps ? ps = 65 : 91 === ps && (ps = 97);
function ds(e) {
    return null === e || 40 === e || 42 === e || 95 === e || 91 === e || 93 === e || 126 === e || tt(e)
}
function fs(e) {
    return !je(e)
}
function ms(e) {
    return !(47 === e || Es(e))
}
function Es(e) {
    return 43 === e || 45 === e || 46 === e || 95 === e || We(e)
}
function Ts(e) {
    let t = e.length
      , n = !1;
    for (; t--; ) {
        const r = e[t][1];
        if (("labelLink" === r.type || "labelImage" === r.type) && !r._balanced) {
            n = !0;
            break
        }
        if (r._gfmAutolinkLiteralWalkedInto) {
            n = !1;
            break
        }
    }
    return e.length > 0 && !n && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0),
    n
}
hs[43] = us,
hs[45] = us,
hs[46] = us,
hs[95] = us,
hs[72] = [us, ls],
hs[104] = [us, ls],
hs[87] = [us, cs],
hs[119] = [us, cs];
const gs = {
    tokenize: function(e, t, n) {
        const r = this;
        return at(e, function(e) {
            const i = r.events[r.events.length - 1];
            return i && "gfmFootnoteDefinitionIndent" === i[1].type && 4 === i[2].sliceSerialize(i[1], !0).length ? t(e) : n(e)
        }, "gfmFootnoteDefinitionIndent", 5)
    },
    partial: !0
};
function As(e, t, n) {
    const r = this;
    let i = r.events.length;
    const s = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
    let o;
    for (; i--; ) {
        const e = r.events[i][1];
        if ("labelImage" === e.type) {
            o = e;
            break
        }
        if ("gfmFootnoteCall" === e.type || "labelLink" === e.type || "label" === e.type || "image" === e.type || "link" === e.type)
            break
    }
    return function(i) {
        if (!o || !o._balanced)
            return n(i);
        const a = Qe(r.sliceSerialize({
            start: o.end,
            end: r.now()
        }));
        if (94 !== a.codePointAt(0) || !s.includes(a.slice(1)))
            return n(i);
        return e.enter("gfmFootnoteCallLabelMarker"),
        e.consume(i),
        e.exit("gfmFootnoteCallLabelMarker"),
        t(i)
    }
}
function _s(e, t) {
    let n = e.length;
    for (; n--; )
        if ("labelImage" === e[n][1].type && "enter" === e[n][0]) {
            e[n][1];
            break
        }
    e[n + 1][1].type = "data",
    e[n + 3][1].type = "gfmFootnoteCallLabelMarker";
    const r = {
        type: "gfmFootnoteCall",
        start: Object.assign({}, e[n + 3][1].start),
        end: Object.assign({}, e[e.length - 1][1].end)
    }
      , i = {
        type: "gfmFootnoteCallMarker",
        start: Object.assign({}, e[n + 3][1].end),
        end: Object.assign({}, e[n + 3][1].end)
    };
    i.end.column++,
    i.end.offset++,
    i.end._bufferIndex++;
    const s = {
        type: "gfmFootnoteCallString",
        start: Object.assign({}, i.end),
        end: Object.assign({}, e[e.length - 1][1].start)
    }
      , o = {
        type: "chunkString",
        contentType: "string",
        start: Object.assign({}, s.start),
        end: Object.assign({}, s.end)
    }
      , a = [e[n + 1], e[n + 2], ["enter", r, t], e[n + 3], e[n + 4], ["enter", i, t], ["exit", i, t], ["enter", s, t], ["enter", o, t], ["exit", o, t], ["exit", s, t], e[e.length - 2], e[e.length - 1], ["exit", r, t]];
    return e.splice(n, e.length - n + 1, ...a),
    e
}
function Is(e, t, n) {
    const r = this
      , i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
    let s, o = 0;
    return function(t) {
        return e.enter("gfmFootnoteCall"),
        e.enter("gfmFootnoteCallLabelMarker"),
        e.consume(t),
        e.exit("gfmFootnoteCallLabelMarker"),
        a
    }
    ;
    function a(t) {
        return 94 !== t ? n(t) : (e.enter("gfmFootnoteCallMarker"),
        e.consume(t),
        e.exit("gfmFootnoteCallMarker"),
        e.enter("gfmFootnoteCallString"),
        e.enter("chunkString").contentType = "string",
        c)
    }
    function c(a) {
        if (o > 999 || 93 === a && !s || null === a || 91 === a || tt(a))
            return n(a);
        if (93 === a) {
            e.exit("chunkString");
            const s = e.exit("gfmFootnoteCallString");
            return i.includes(Qe(r.sliceSerialize(s))) ? (e.enter("gfmFootnoteCallLabelMarker"),
            e.consume(a),
            e.exit("gfmFootnoteCallLabelMarker"),
            e.exit("gfmFootnoteCall"),
            t) : n(a)
        }
        return tt(a) || (s = !0),
        o++,
        e.consume(a),
        92 === a ? l : c
    }
    function l(t) {
        return 91 === t || 92 === t || 93 === t ? (e.consume(t),
        o++,
        c) : c(t)
    }
}
function Ns(e, t, n) {
    const r = this
      , i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
    let s, o, a = 0;
    return function(t) {
        return e.enter("gfmFootnoteDefinition")._container = !0,
        e.enter("gfmFootnoteDefinitionLabel"),
        e.enter("gfmFootnoteDefinitionLabelMarker"),
        e.consume(t),
        e.exit("gfmFootnoteDefinitionLabelMarker"),
        c
    }
    ;
    function c(t) {
        return 94 === t ? (e.enter("gfmFootnoteDefinitionMarker"),
        e.consume(t),
        e.exit("gfmFootnoteDefinitionMarker"),
        e.enter("gfmFootnoteDefinitionLabelString"),
        e.enter("chunkString").contentType = "string",
        l) : n(t)
    }
    function l(t) {
        if (a > 999 || 93 === t && !o || null === t || 91 === t || tt(t))
            return n(t);
        if (93 === t) {
            e.exit("chunkString");
            const n = e.exit("gfmFootnoteDefinitionLabelString");
            return s = Qe(r.sliceSerialize(n)),
            e.enter("gfmFootnoteDefinitionLabelMarker"),
            e.consume(t),
            e.exit("gfmFootnoteDefinitionLabelMarker"),
            e.exit("gfmFootnoteDefinitionLabel"),
            h
        }
        return tt(t) || (o = !0),
        a++,
        e.consume(t),
        92 === t ? u : l
    }
    function u(t) {
        return 91 === t || 92 === t || 93 === t ? (e.consume(t),
        a++,
        l) : l(t)
    }
    function h(t) {
        return 58 === t ? (e.enter("definitionMarker"),
        e.consume(t),
        e.exit("definitionMarker"),
        i.includes(s) || i.push(s),
        at(e, p, "gfmFootnoteDefinitionWhitespace")) : n(t)
    }
    function p(e) {
        return t(e)
    }
}
function ks(e, t, n) {
    return e.check(Et, t, e.attempt(gs, t, n))
}
function Ss(e) {
    e.exit("gfmFootnoteDefinition")
}
function Cs(e) {
    let t = (e || {}).singleTilde;
    const n = {
        name: "strikethrough",
        tokenize: function(e, n, r) {
            const i = this.previous
              , s = this.events;
            let o = 0;
            return function(t) {
                if (126 === i && "characterEscape" !== s[s.length - 1][1].type)
                    return r(t);
                return e.enter("strikethroughSequenceTemporary"),
                a(t)
            }
            ;
            function a(s) {
                const c = ht(i);
                if (126 === s)
                    return o > 1 ? r(s) : (e.consume(s),
                    o++,
                    a);
                if (o < 2 && !t)
                    return r(s);
                const l = e.exit("strikethroughSequenceTemporary")
                  , u = ht(s);
                return l._open = !u || 2 === u && Boolean(c),
                l._close = !c || 2 === c && Boolean(u),
                n(s)
            }
        },
        resolveAll: function(e, t) {
            let n = -1;
            for (; ++n < e.length; )
                if ("enter" === e[n][0] && "strikethroughSequenceTemporary" === e[n][1].type && e[n][1]._close) {
                    let r = n;
                    for (; r--; )
                        if ("exit" === e[r][0] && "strikethroughSequenceTemporary" === e[r][1].type && e[r][1]._open && e[n][1].end.offset - e[n][1].start.offset === e[r][1].end.offset - e[r][1].start.offset) {
                            e[n][1].type = "strikethroughSequence",
                            e[r][1].type = "strikethroughSequence";
                            const i = {
                                type: "strikethrough",
                                start: Object.assign({}, e[r][1].start),
                                end: Object.assign({}, e[n][1].end)
                            }
                              , s = {
                                type: "strikethroughText",
                                start: Object.assign({}, e[r][1].end),
                                end: Object.assign({}, e[n][1].start)
                            }
                              , o = [["enter", i, t], ["enter", e[r][1], t], ["exit", e[r][1], t], ["enter", s, t]]
                              , a = t.parser.constructs.insideSpan.null;
                            a && He(o, o.length, 0, pt(a, e.slice(r + 1, n), t)),
                            He(o, o.length, 0, [["exit", s, t], ["enter", e[n][1], t], ["exit", e[n][1], t], ["exit", i, t]]),
                            He(e, r - 1, n - r + 3, o),
                            n = r + o.length - 2;
                            break
                        }
                }
            n = -1;
            for (; ++n < e.length; )
                "strikethroughSequenceTemporary" === e[n][1].type && (e[n][1].type = "data");
            return e
        }
    };
    return null == t && (t = !0),
    {
        text: {
            126: n
        },
        insideSpan: {
            null: [n]
        },
        attentionMarkers: {
            null: [126]
        }
    }
}
class Ds {
    constructor() {
        this.map = []
    }
    add(e, t, n) {
        !function(e, t, n, r) {
            let i = 0;
            if (0 === n && 0 === r.length)
                return;
            for (; i < e.map.length; ) {
                if (e.map[i][0] === t)
                    return e.map[i][1] += n,
                    void e.map[i][2].push(...r);
                i += 1
            }
            e.map.push([t, n, r])
        }(this, e, t, n)
    }
    consume(e) {
        if (this.map.sort(function(e, t) {
            return e[0] - t[0]
        }),
        0 === this.map.length)
            return;
        let t = this.map.length;
        const n = [];
        for (; t > 0; )
            t -= 1,
            n.push(e.slice(this.map[t][0] + this.map[t][1]), this.map[t][2]),
            e.length = this.map[t][0];
        n.push(e.slice()),
        e.length = 0;
        let r = n.pop();
        for (; r; ) {
            for (const t of r)
                e.push(t);
            r = n.pop()
        }
        this.map.length = 0
    }
}
function Os(e, t) {
    let n = !1;
    const r = [];
    for (; t < e.length; ) {
        const i = e[t];
        if (n) {
            if ("enter" === i[0])
                "tableContent" === i[1].type && r.push("tableDelimiterMarker" === e[t + 1][1].type ? "left" : "none");
            else if ("tableContent" === i[1].type) {
                if ("tableDelimiterMarker" === e[t - 1][1].type) {
                    const e = r.length - 1;
                    r[e] = "left" === r[e] ? "center" : "right"
                }
            } else if ("tableDelimiterRow" === i[1].type)
                break
        } else
            "enter" === i[0] && "tableDelimiterRow" === i[1].type && (n = !0);
        t += 1
    }
    return r
}
function ys(e, t, n) {
    const r = this;
    let i, s = 0, o = 0;
    return function(e) {
        let t = r.events.length - 1;
        for (; t > -1; ) {
            const e = r.events[t][1].type;
            if ("lineEnding" !== e && "linePrefix" !== e)
                break;
            t--
        }
        const i = t > -1 ? r.events[t][1].type : null
          , s = "tableHead" === i || "tableRow" === i ? _ : a;
        if (s === _ && r.parser.lazy[r.now().line])
            return n(e);
        return s(e)
    }
    ;
    function a(t) {
        return e.enter("tableHead"),
        e.enter("tableRow"),
        function(e) {
            if (124 === e)
                return c(e);
            return i = !0,
            o += 1,
            c(e)
        }(t)
    }
    function c(t) {
        return null === t ? n(t) : et(t) ? o > 1 ? (o = 0,
        r.interrupt = !0,
        e.exit("tableRow"),
        e.enter("lineEnding"),
        e.consume(t),
        e.exit("lineEnding"),
        h) : n(t) : nt(t) ? at(e, c, "whitespace")(t) : (o += 1,
        i && (i = !1,
        s += 1),
        124 === t ? (e.enter("tableCellDivider"),
        e.consume(t),
        e.exit("tableCellDivider"),
        i = !0,
        c) : (e.enter("data"),
        l(t)))
    }
    function l(t) {
        return null === t || 124 === t || tt(t) ? (e.exit("data"),
        c(t)) : (e.consume(t),
        92 === t ? u : l)
    }
    function u(t) {
        return 92 === t || 124 === t ? (e.consume(t),
        l) : l(t)
    }
    function h(t) {
        return r.interrupt = !1,
        r.parser.lazy[r.now().line] ? n(t) : (e.enter("tableDelimiterRow"),
        i = !1,
        nt(t) ? at(e, p, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : p(t))
    }
    function p(t) {
        return 45 === t || 58 === t ? f(t) : 124 === t ? (i = !0,
        e.enter("tableCellDivider"),
        e.consume(t),
        e.exit("tableCellDivider"),
        d) : A(t)
    }
    function d(t) {
        return nt(t) ? at(e, f, "whitespace")(t) : f(t)
    }
    function f(t) {
        return 58 === t ? (o += 1,
        i = !0,
        e.enter("tableDelimiterMarker"),
        e.consume(t),
        e.exit("tableDelimiterMarker"),
        m) : 45 === t ? (o += 1,
        m(t)) : null === t || et(t) ? g(t) : A(t)
    }
    function m(t) {
        return 45 === t ? (e.enter("tableDelimiterFiller"),
        E(t)) : A(t)
    }
    function E(t) {
        return 45 === t ? (e.consume(t),
        E) : 58 === t ? (i = !0,
        e.exit("tableDelimiterFiller"),
        e.enter("tableDelimiterMarker"),
        e.consume(t),
        e.exit("tableDelimiterMarker"),
        T) : (e.exit("tableDelimiterFiller"),
        T(t))
    }
    function T(t) {
        return nt(t) ? at(e, g, "whitespace")(t) : g(t)
    }
    function g(n) {
        return 124 === n ? p(n) : (null === n || et(n)) && i && s === o ? (e.exit("tableDelimiterRow"),
        e.exit("tableHead"),
        t(n)) : A(n)
    }
    function A(e) {
        return n(e)
    }
    function _(t) {
        return e.enter("tableRow"),
        I(t)
    }
    function I(n) {
        return 124 === n ? (e.enter("tableCellDivider"),
        e.consume(n),
        e.exit("tableCellDivider"),
        I) : null === n || et(n) ? (e.exit("tableRow"),
        t(n)) : nt(n) ? at(e, I, "whitespace")(n) : (e.enter("data"),
        N(n))
    }
    function N(t) {
        return null === t || 124 === t || tt(t) ? (e.exit("data"),
        I(t)) : (e.consume(t),
        92 === t ? k : N)
    }
    function k(t) {
        return 92 === t || 124 === t ? (e.consume(t),
        N) : N(t)
    }
}
function bs(e, t) {
    let n, r, i, s = -1, o = !0, a = 0, c = [0, 0, 0, 0], l = [0, 0, 0, 0], u = !1, h = 0;
    const p = new Ds;
    for (; ++s < e.length; ) {
        const d = e[s]
          , f = d[1];
        "enter" === d[0] ? "tableHead" === f.type ? (u = !1,
        0 !== h && (Ls(p, t, h, n, r),
        r = void 0,
        h = 0),
        n = {
            type: "table",
            start: Object.assign({}, f.start),
            end: Object.assign({}, f.end)
        },
        p.add(s, 0, [["enter", n, t]])) : "tableRow" === f.type || "tableDelimiterRow" === f.type ? (o = !0,
        i = void 0,
        c = [0, 0, 0, 0],
        l = [0, s + 1, 0, 0],
        u && (u = !1,
        r = {
            type: "tableBody",
            start: Object.assign({}, f.start),
            end: Object.assign({}, f.end)
        },
        p.add(s, 0, [["enter", r, t]])),
        a = "tableDelimiterRow" === f.type ? 2 : r ? 3 : 1) : !a || "data" !== f.type && "tableDelimiterMarker" !== f.type && "tableDelimiterFiller" !== f.type ? "tableCellDivider" === f.type && (o ? o = !1 : (0 !== c[1] && (l[0] = l[1],
        i = Rs(p, t, c, a, void 0, i)),
        c = l,
        l = [c[1], s, 0, 0])) : (o = !1,
        0 === l[2] && (0 !== c[1] && (l[0] = l[1],
        i = Rs(p, t, c, a, void 0, i),
        c = [0, 0, 0, 0]),
        l[2] = s)) : "tableHead" === f.type ? (u = !0,
        h = s) : "tableRow" === f.type || "tableDelimiterRow" === f.type ? (h = s,
        0 !== c[1] ? (l[0] = l[1],
        i = Rs(p, t, c, a, s, i)) : 0 !== l[1] && (i = Rs(p, t, l, a, s, i)),
        a = 0) : !a || "data" !== f.type && "tableDelimiterMarker" !== f.type && "tableDelimiterFiller" !== f.type || (l[3] = s)
    }
    for (0 !== h && Ls(p, t, h, n, r),
    p.consume(t.events),
    s = -1; ++s < t.events.length; ) {
        const e = t.events[s];
        "enter" === e[0] && "table" === e[1].type && (e[1]._align = Os(t.events, s))
    }
    return e
}
function Rs(e, t, n, r, i, s) {
    const o = 1 === r ? "tableHeader" : 2 === r ? "tableDelimiter" : "tableData";
    0 !== n[0] && (s.end = Object.assign({}, Ps(t.events, n[0])),
    e.add(n[0], 0, [["exit", s, t]]));
    const a = Ps(t.events, n[1]);
    if (s = {
        type: o,
        start: Object.assign({}, a),
        end: Object.assign({}, a)
    },
    e.add(n[1], 0, [["enter", s, t]]),
    0 !== n[2]) {
        const i = Ps(t.events, n[2])
          , s = Ps(t.events, n[3])
          , o = {
            type: "tableContent",
            start: Object.assign({}, i),
            end: Object.assign({}, s)
        };
        if (e.add(n[2], 0, [["enter", o, t]]),
        2 !== r) {
            const r = t.events[n[2]]
              , i = t.events[n[3]];
            if (r[1].end = Object.assign({}, i[1].end),
            r[1].type = "chunkText",
            r[1].contentType = "text",
            n[3] > n[2] + 1) {
                const t = n[2] + 1
                  , r = n[3] - n[2] - 1;
                e.add(t, r, [])
            }
        }
        e.add(n[3] + 1, 0, [["exit", o, t]])
    }
    return void 0 !== i && (s.end = Object.assign({}, Ps(t.events, i)),
    e.add(i, 0, [["exit", s, t]]),
    s = void 0),
    s
}
function Ls(e, t, n, r, i) {
    const s = []
      , o = Ps(t.events, n);
    i && (i.end = Object.assign({}, o),
    s.push(["exit", i, t])),
    r.end = Object.assign({}, o),
    s.push(["exit", r, t]),
    e.add(n + 1, 0, s)
}
function Ps(e, t) {
    const n = e[t]
      , r = "enter" === n[0] ? "start" : "end";
    return n[1][r]
}
const Ms = {
    name: "tasklistCheck",
    tokenize: function(e, t, n) {
        const r = this;
        return function(t) {
            if (null !== r.previous || !r._gfmTasklistFirstContentOfListItem)
                return n(t);
            return e.enter("taskListCheck"),
            e.enter("taskListCheckMarker"),
            e.consume(t),
            e.exit("taskListCheckMarker"),
            i
        }
        ;
        function i(t) {
            return tt(t) ? (e.enter("taskListCheckValueUnchecked"),
            e.consume(t),
            e.exit("taskListCheckValueUnchecked"),
            s) : 88 === t || 120 === t ? (e.enter("taskListCheckValueChecked"),
            e.consume(t),
            e.exit("taskListCheckValueChecked"),
            s) : n(t)
        }
        function s(t) {
            return 93 === t ? (e.enter("taskListCheckMarker"),
            e.consume(t),
            e.exit("taskListCheckMarker"),
            e.exit("taskListCheck"),
            o) : n(t)
        }
        function o(r) {
            return et(r) ? t(r) : nt(r) ? e.check({
                tokenize: xs
            }, t, n)(r) : n(r)
        }
    }
};
function xs(e, t, n) {
    return at(e, function(e) {
        return null === e ? n(e) : t(e)
    }, "whitespace")
}
const vs = {};
function ws(e) {
    const t = e || vs
      , n = this.data()
      , r = n.micromarkExtensions || (n.micromarkExtensions = [])
      , i = n.fromMarkdownExtensions || (n.fromMarkdownExtensions = [])
      , s = n.toMarkdownExtensions || (n.toMarkdownExtensions = []);
    r.push(function(e) {
        return Ye([{
            text: hs
        }, {
            document: {
                91: {
                    name: "gfmFootnoteDefinition",
                    tokenize: Ns,
                    continuation: {
                        tokenize: ks
                    },
                    exit: Ss
                }
            },
            text: {
                91: {
                    name: "gfmFootnoteCall",
                    tokenize: Is
                },
                93: {
                    name: "gfmPotentialFootnoteCall",
                    add: "after",
                    tokenize: As,
                    resolveTo: _s
                }
            }
        }, Cs(e), {
            flow: {
                null: {
                    name: "table",
                    tokenize: ys,
                    resolveAll: bs
                }
            }
        }, {
            text: {
                91: Ms
            }
        }])
    }(t)),
    i.push([{
        transforms: [ei],
        enter: {
            literalAutolink: Wr,
            literalAutolinkEmail: Kr,
            literalAutolinkHttp: Kr,
            literalAutolinkWww: Kr
        },
        exit: {
            literalAutolink: Zr,
            literalAutolinkEmail: $r,
            literalAutolinkHttp: Xr,
            literalAutolinkWww: Jr
        }
    }, {
        enter: {
            gfmFootnoteCallString: ii,
            gfmFootnoteCall: si,
            gfmFootnoteDefinitionLabelString: oi,
            gfmFootnoteDefinition: ai
        },
        exit: {
            gfmFootnoteCallString: ci,
            gfmFootnoteCall: li,
            gfmFootnoteDefinitionLabelString: ui,
            gfmFootnoteDefinition: hi
        }
    }, {
        canContainEols: ["delete"],
        enter: {
            strikethrough: Ti
        },
        exit: {
            strikethrough: gi
        }
    }, {
        enter: {
            table: Qi,
            tableData: Xi,
            tableHeader: Xi,
            tableRow: Wi
        },
        exit: {
            codeText: Ji,
            table: ji,
            tableData: Ki,
            tableHeader: Ki,
            tableRow: Ki
        }
    }, {
        exit: {
            taskListCheckValueChecked: es,
            taskListCheckValueUnchecked: es,
            paragraph: ts
        }
    }]),
    s.push(function(e) {
        return {
            extensions: [{
                unsafe: [{
                    character: "@",
                    before: "[+\\-.\\w]",
                    after: "[\\-.\\w]",
                    inConstruct: Qr,
                    notInConstruct: jr
                }, {
                    character: ".",
                    before: "[Ww]",
                    after: "[\\-.\\w]",
                    inConstruct: Qr,
                    notInConstruct: jr
                }, {
                    character: ":",
                    before: "[ps]",
                    after: "\\/",
                    inConstruct: Qr,
                    notInConstruct: jr
                }]
            }, di(e), {
                unsafe: [{
                    character: "~",
                    inConstruct: "phrasing",
                    notInConstruct: Ei
                }],
                handlers: {
                    delete: Ai
                }
            }, Zi(e), {
                unsafe: [{
                    atBreak: !0,
                    character: "-",
                    after: "[:|-]"
                }],
                handlers: {
                    listItem: ns
                }
            }]
        }
    }(t))
}
const Fs = /[#.]/g;
function Bs(e, t, n) {
    const r = n ? function(e) {
        const t = new Map;
        for (const n of e)
            t.set(n.toLowerCase(), n);
        return t
    }(n) : void 0;
    return function(n, i, ...s) {
        let o;
        if (null == n) {
            o = {
                type: "root",
                children: []
            };
            const e = i;
            s.unshift(e)
        } else {
            o = function(e, t) {
                const n = e || ""
                  , r = {};
                let i, s, o = 0;
                for (; o < n.length; ) {
                    Fs.lastIndex = o;
                    const e = Fs.exec(n)
                      , t = n.slice(o, e ? e.index : n.length);
                    t && (i ? "#" === i ? r.id = t : Array.isArray(r.className) ? r.className.push(t) : r.className = [t] : s = t,
                    o += t.length),
                    e && (i = e[0],
                    o++)
                }
                return {
                    type: "element",
                    tagName: s || t || "div",
                    properties: r,
                    children: []
                }
            }(n, t);
            const a = o.tagName.toLowerCase()
              , c = r ? r.get(a) : void 0;
            if (o.tagName = c || a,
            function(e) {
                if (null === e || "object" != typeof e || Array.isArray(e))
                    return !0;
                if ("string" != typeof e.type)
                    return !1;
                const t = e
                  , n = Object.keys(e);
                for (const r of n) {
                    const e = t[r];
                    if (e && "object" == typeof e) {
                        if (!Array.isArray(e))
                            return !0;
                        const t = e;
                        for (const e of t)
                            if ("number" != typeof e && "string" != typeof e)
                                return !0
                    }
                }
                if ("children"in e && Array.isArray(e.children))
                    return !0;
                return !1
            }(i))
                s.unshift(i);
            else
                for (const [t,n] of Object.entries(i))
                    Hs(e, o.properties, t, n)
        }
        for (const e of s)
            Us(o.children, e);
        return "element" === o.type && "template" === o.tagName && (o.content = {
            type: "root",
            children: o.children
        },
        o.children = []),
        o
    }
}
function Hs(e, t, n, r) {
    const i = z(e, n);
    let o;
    if (null != r) {
        if ("number" == typeof r) {
            if (Number.isNaN(r))
                return;
            o = r
        } else
            o = "boolean" == typeof r ? r : "string" == typeof r ? i.spaceSeparated ? W(r) : i.commaSeparated ? s(r) : i.commaOrSpaceSeparated ? W(s(r).join(" ")) : Gs(i, i.property, r) : Array.isArray(r) ? [...r] : "style" === i.property ? function(e) {
                const t = [];
                for (const [n,r] of Object.entries(e))
                    t.push([n, r].join(": "));
                return t.join("; ")
            }(r) : String(r);
        if (Array.isArray(o)) {
            const e = [];
            for (const t of o)
                e.push(Gs(i, i.property, t));
            o = e
        }
        "className" === i.property && Array.isArray(t.className) && (o = t.className.concat(o)),
        t[i.property] = o
    }
}
function Us(e, t) {
    if (null == t)
        ;
    else if ("number" == typeof t || "string" == typeof t)
        e.push({
            type: "text",
            value: String(t)
        });
    else if (Array.isArray(t))
        for (const n of t)
            Us(e, n);
    else {
        if ("object" != typeof t || !("type"in t))
            throw new Error("Expected node, nodes, or string, got `" + t + "`");
        "root" === t.type ? Us(e, t.children) : e.push(t)
    }
}
function Gs(e, t, n) {
    if ("string" == typeof n) {
        if (e.number && n && !Number.isNaN(Number(n)))
            return Number(n);
        if ((e.boolean || e.overloadedBoolean) && ("" === n || m(n) === m(t)))
            return !0
    }
    return n
}
const Ys = Bs(Q, "div")
  , zs = Bs(j, "g", ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "solidColor", "textArea", "textPath"]);
function qs(e, t) {
    const n = e.indexOf("\r", t)
      , r = e.indexOf("\n", t);
    return -1 === r ? n : -1 === n || n + 1 === r ? r : n < r ? n : r
}
const Vs = {
    html: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    svg: "http://www.w3.org/2000/svg",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
}
  , Qs = {}.hasOwnProperty
  , js = Object.prototype;
function Ws(e, t) {
    let n;
    switch (t.nodeName) {
    case "#comment":
        {
            const r = t;
            return n = {
                type: "comment",
                value: r.data
            },
            Xs(e, r, n),
            n
        }
    case "#document":
    case "#document-fragment":
        {
            const r = t
              , i = "mode"in r && ("quirks" === r.mode || "limited-quirks" === r.mode);
            if (n = {
                type: "root",
                children: Ks(e, t.childNodes),
                data: {
                    quirksMode: i
                }
            },
            e.file && e.location) {
                const t = String(e.file)
                  , r = function(e) {
                    const t = String(e)
                      , n = [];
                    return {
                        toOffset: function(e) {
                            if (e && "number" == typeof e.line && "number" == typeof e.column && !Number.isNaN(e.line) && !Number.isNaN(e.column)) {
                                for (; n.length < e.line; ) {
                                    const e = n[n.length - 1]
                                      , r = qs(t, e)
                                      , i = -1 === r ? t.length + 1 : r + 1;
                                    if (e === i)
                                        break;
                                    n.push(i)
                                }
                                const r = (e.line > 1 ? n[e.line - 2] : 0) + e.column - 1;
                                if (r < n[e.line - 1])
                                    return r
                            }
                        },
                        toPoint: function(e) {
                            if ("number" == typeof e && e > -1 && e <= t.length) {
                                let r = 0;
                                for (; ; ) {
                                    let i = n[r];
                                    if (void 0 === i) {
                                        const e = qs(t, n[r - 1]);
                                        i = -1 === e ? t.length + 1 : e + 1,
                                        n[r] = i
                                    }
                                    if (i > e)
                                        return {
                                            line: r + 1,
                                            column: e - (r > 0 ? n[r - 1] : 0) + 1,
                                            offset: e
                                        };
                                    r++
                                }
                            }
                        }
                    }
                }(t)
                  , i = r.toPoint(0)
                  , s = r.toPoint(t.length);
                n.position = {
                    start: i,
                    end: s
                }
            }
            return n
        }
    case "#documentType":
        return n = {
            type: "doctype"
        },
        Xs(e, t, n),
        n;
    case "#text":
        {
            const r = t;
            return n = {
                type: "text",
                value: r.value
            },
            Xs(e, r, n),
            n
        }
    default:
        return n = function(e, t) {
            const n = e.schema;
            e.schema = t.namespaceURI === Vs.svg ? j : Q;
            let r = -1;
            const i = {};
            for (; ++r < t.attrs.length; ) {
                const e = t.attrs[r]
                  , n = (e.prefix ? e.prefix + ":" : "") + e.name;
                Qs.call(js, n) || (i[n] = e.value)
            }
            const s = "svg" === e.schema.space ? zs : Ys
              , o = s(t.tagName, i, Ks(e, t.childNodes));
            if (Xs(e, t, o),
            "template" === o.tagName) {
                const n = t
                  , r = n.sourceCodeLocation
                  , i = r && r.startTag && Js(r.startTag)
                  , s = r && r.endTag && Js(r.endTag)
                  , a = Ws(e, n.content);
                i && s && e.file && (a.position = {
                    start: i.end,
                    end: s.start
                }),
                o.content = a
            }
            return e.schema = n,
            o
        }(e, t),
        n
    }
}
function Ks(e, t) {
    let n = -1;
    const r = [];
    for (; ++n < t.length; ) {
        const i = Ws(e, t[n]);
        r.push(i)
    }
    return r
}
function Xs(e, t, n) {
    if ("sourceCodeLocation"in t && t.sourceCodeLocation && e.file) {
        const r = function(e, t, n) {
            const r = Js(n);
            if ("element" === t.type) {
                const i = t.children[t.children.length - 1];
                if (r && !n.endTag && i && i.position && i.position.end && (r.end = Object.assign({}, i.position.end)),
                e.verbose) {
                    const r = {};
                    let i;
                    if (n.attrs)
                        for (i in n.attrs)
                            Qs.call(n.attrs, i) && (r[z(e.schema, i).property] = Js(n.attrs[i]));
                    n.startTag;
                    const s = Js(n.startTag)
                      , o = n.endTag ? Js(n.endTag) : void 0
                      , a = {
                        opening: s
                    };
                    o && (a.closing = o),
                    a.properties = r,
                    t.data = {
                        position: a
                    }
                }
            }
            return r
        }(e, n, t.sourceCodeLocation);
        r && (e.location = !0,
        n.position = r)
    }
}
function Js(e) {
    const t = $s({
        line: e.startLine,
        column: e.startCol,
        offset: e.startOffset
    })
      , n = $s({
        line: e.endLine,
        column: e.endCol,
        offset: e.endOffset
    });
    return t || n ? {
        start: t,
        end: n
    } : void 0
}
function $s(e) {
    return e.line && e.column ? e : void 0
}
const Zs = {}
  , eo = {}.hasOwnProperty
  , to = Si("type", {
    handlers: {
        root: function(e, t) {
            const n = {
                nodeName: "#document",
                mode: (e.data || {}).quirksMode ? "quirks" : "no-quirks",
                childNodes: []
            };
            return n.childNodes = ro(e.children, n, t),
            io(e, n),
            n
        },
        element: function(e, t) {
            const n = t;
            let r = n;
            "element" === e.type && "svg" === e.tagName.toLowerCase() && "html" === n.space && (r = j);
            const i = [];
            let s;
            if (e.properties)
                for (s in e.properties)
                    if ("children" !== s && eo.call(e.properties, s)) {
                        const t = no(r, s, e.properties[s]);
                        t && i.push(t)
                    }
            const o = r.space
              , a = {
                nodeName: e.tagName,
                tagName: e.tagName,
                attrs: i,
                namespaceURI: Vs[o],
                childNodes: [],
                parentNode: null
            };
            a.childNodes = ro(e.children, a, r),
            io(e, a),
            "template" === e.tagName && e.content && (a.content = function(e, t) {
                const n = {
                    nodeName: "#document-fragment",
                    childNodes: []
                };
                return n.childNodes = ro(e.children, n, t),
                io(e, n),
                n
            }(e.content, r));
            return a
        },
        text: function(e) {
            const t = {
                nodeName: "#text",
                value: e.value,
                parentNode: null
            };
            return io(e, t),
            t
        },
        comment: function(e) {
            const t = {
                nodeName: "#comment",
                data: e.value,
                parentNode: null
            };
            return io(e, t),
            t
        },
        doctype: function(e) {
            const t = {
                nodeName: "#documentType",
                name: "html",
                publicId: "",
                systemId: "",
                parentNode: null
            };
            return io(e, t),
            t
        }
    }
});
function no(e, t, n) {
    const r = z(e, t);
    if (!1 === n || null == n || "number" == typeof n && Number.isNaN(n) || !n && r.boolean)
        return;
    Array.isArray(n) && (n = r.commaSeparated ? o(n) : K(n));
    const i = {
        name: r.attribute,
        value: !0 === n ? "" : String(n)
    };
    if (r.space && "html" !== r.space && "svg" !== r.space) {
        const e = i.name.indexOf(":");
        e < 0 ? i.prefix = "" : (i.name = i.name.slice(e + 1),
        i.prefix = r.attribute.slice(0, e)),
        i.namespace = Vs[r.space]
    }
    return i
}
function ro(e, t, n) {
    let r = -1;
    const i = [];
    if (e)
        for (; ++r < e.length; ) {
            const s = to(e[r], n);
            s.parentNode = t,
            i.push(s)
        }
    return i
}
function io(e, t) {
    const n = e.position;
    n && n.start && n.end && (n.start.offset,
    n.end.offset,
    t.sourceCodeLocation = {
        startLine: n.start.line,
        startCol: n.start.column,
        startOffset: n.start.offset,
        endLine: n.end.line,
        endCol: n.end.column,
        endOffset: n.end.offset
    })
}
const so = ["area", "base", "basefont", "bgsound", "br", "col", "command", "embed", "frame", "hr", "image", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]
  , oo = new Set([65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111])
  , ao = "�";
var co, lo;
(lo = co || (co = {}))[lo.EOF = -1] = "EOF",
lo[lo.NULL = 0] = "NULL",
lo[lo.TABULATION = 9] = "TABULATION",
lo[lo.CARRIAGE_RETURN = 13] = "CARRIAGE_RETURN",
lo[lo.LINE_FEED = 10] = "LINE_FEED",
lo[lo.FORM_FEED = 12] = "FORM_FEED",
lo[lo.SPACE = 32] = "SPACE",
lo[lo.EXCLAMATION_MARK = 33] = "EXCLAMATION_MARK",
lo[lo.QUOTATION_MARK = 34] = "QUOTATION_MARK",
lo[lo.AMPERSAND = 38] = "AMPERSAND",
lo[lo.APOSTROPHE = 39] = "APOSTROPHE",
lo[lo.HYPHEN_MINUS = 45] = "HYPHEN_MINUS",
lo[lo.SOLIDUS = 47] = "SOLIDUS",
lo[lo.DIGIT_0 = 48] = "DIGIT_0",
lo[lo.DIGIT_9 = 57] = "DIGIT_9",
lo[lo.SEMICOLON = 59] = "SEMICOLON",
lo[lo.LESS_THAN_SIGN = 60] = "LESS_THAN_SIGN",
lo[lo.EQUALS_SIGN = 61] = "EQUALS_SIGN",
lo[lo.GREATER_THAN_SIGN = 62] = "GREATER_THAN_SIGN",
lo[lo.QUESTION_MARK = 63] = "QUESTION_MARK",
lo[lo.LATIN_CAPITAL_A = 65] = "LATIN_CAPITAL_A",
lo[lo.LATIN_CAPITAL_Z = 90] = "LATIN_CAPITAL_Z",
lo[lo.RIGHT_SQUARE_BRACKET = 93] = "RIGHT_SQUARE_BRACKET",
lo[lo.GRAVE_ACCENT = 96] = "GRAVE_ACCENT",
lo[lo.LATIN_SMALL_A = 97] = "LATIN_SMALL_A",
lo[lo.LATIN_SMALL_Z = 122] = "LATIN_SMALL_Z";
const uo = "--"
  , ho = "[CDATA["
  , po = "doctype"
  , fo = "script"
  , mo = "public"
  , Eo = "system";
function To(e) {
    return e >= 55296 && e <= 57343
}
function go(e) {
    return 32 !== e && 10 !== e && 13 !== e && 9 !== e && 12 !== e && e >= 1 && e <= 31 || e >= 127 && e <= 159
}
function Ao(e) {
    return e >= 64976 && e <= 65007 || oo.has(e)
}
var _o, Io;
(Io = _o || (_o = {})).controlCharacterInInputStream = "control-character-in-input-stream",
Io.noncharacterInInputStream = "noncharacter-in-input-stream",
Io.surrogateInInputStream = "surrogate-in-input-stream",
Io.nonVoidHtmlElementStartTagWithTrailingSolidus = "non-void-html-element-start-tag-with-trailing-solidus",
Io.endTagWithAttributes = "end-tag-with-attributes",
Io.endTagWithTrailingSolidus = "end-tag-with-trailing-solidus",
Io.unexpectedSolidusInTag = "unexpected-solidus-in-tag",
Io.unexpectedNullCharacter = "unexpected-null-character",
Io.unexpectedQuestionMarkInsteadOfTagName = "unexpected-question-mark-instead-of-tag-name",
Io.invalidFirstCharacterOfTagName = "invalid-first-character-of-tag-name",
Io.unexpectedEqualsSignBeforeAttributeName = "unexpected-equals-sign-before-attribute-name",
Io.missingEndTagName = "missing-end-tag-name",
Io.unexpectedCharacterInAttributeName = "unexpected-character-in-attribute-name",
Io.unknownNamedCharacterReference = "unknown-named-character-reference",
Io.missingSemicolonAfterCharacterReference = "missing-semicolon-after-character-reference",
Io.unexpectedCharacterAfterDoctypeSystemIdentifier = "unexpected-character-after-doctype-system-identifier",
Io.unexpectedCharacterInUnquotedAttributeValue = "unexpected-character-in-unquoted-attribute-value",
Io.eofBeforeTagName = "eof-before-tag-name",
Io.eofInTag = "eof-in-tag",
Io.missingAttributeValue = "missing-attribute-value",
Io.missingWhitespaceBetweenAttributes = "missing-whitespace-between-attributes",
Io.missingWhitespaceAfterDoctypePublicKeyword = "missing-whitespace-after-doctype-public-keyword",
Io.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers = "missing-whitespace-between-doctype-public-and-system-identifiers",
Io.missingWhitespaceAfterDoctypeSystemKeyword = "missing-whitespace-after-doctype-system-keyword",
Io.missingQuoteBeforeDoctypePublicIdentifier = "missing-quote-before-doctype-public-identifier",
Io.missingQuoteBeforeDoctypeSystemIdentifier = "missing-quote-before-doctype-system-identifier",
Io.missingDoctypePublicIdentifier = "missing-doctype-public-identifier",
Io.missingDoctypeSystemIdentifier = "missing-doctype-system-identifier",
Io.abruptDoctypePublicIdentifier = "abrupt-doctype-public-identifier",
Io.abruptDoctypeSystemIdentifier = "abrupt-doctype-system-identifier",
Io.cdataInHtmlContent = "cdata-in-html-content",
Io.incorrectlyOpenedComment = "incorrectly-opened-comment",
Io.eofInScriptHtmlCommentLikeText = "eof-in-script-html-comment-like-text",
Io.eofInDoctype = "eof-in-doctype",
Io.nestedComment = "nested-comment",
Io.abruptClosingOfEmptyComment = "abrupt-closing-of-empty-comment",
Io.eofInComment = "eof-in-comment",
Io.incorrectlyClosedComment = "incorrectly-closed-comment",
Io.eofInCdata = "eof-in-cdata",
Io.absenceOfDigitsInNumericCharacterReference = "absence-of-digits-in-numeric-character-reference",
Io.nullCharacterReference = "null-character-reference",
Io.surrogateCharacterReference = "surrogate-character-reference",
Io.characterReferenceOutsideUnicodeRange = "character-reference-outside-unicode-range",
Io.controlCharacterReference = "control-character-reference",
Io.noncharacterCharacterReference = "noncharacter-character-reference",
Io.missingWhitespaceBeforeDoctypeName = "missing-whitespace-before-doctype-name",
Io.missingDoctypeName = "missing-doctype-name",
Io.invalidCharacterSequenceAfterDoctypeName = "invalid-character-sequence-after-doctype-name",
Io.duplicateAttribute = "duplicate-attribute",
Io.nonConformingDoctype = "non-conforming-doctype",
Io.missingDoctype = "missing-doctype",
Io.misplacedDoctype = "misplaced-doctype",
Io.endTagWithoutMatchingOpenElement = "end-tag-without-matching-open-element",
Io.closingOfElementWithOpenChildElements = "closing-of-element-with-open-child-elements",
Io.disallowedContentInNoscriptInHead = "disallowed-content-in-noscript-in-head",
Io.openElementsLeftAfterEof = "open-elements-left-after-eof",
Io.abandonedHeadElementChild = "abandoned-head-element-child",
Io.misplacedStartTagForHeadElement = "misplaced-start-tag-for-head-element",
Io.nestedNoscriptInHead = "nested-noscript-in-head",
Io.eofInElementThatCanContainOnlyText = "eof-in-element-that-can-contain-only-text";
class No {
    constructor(e) {
        this.handler = e,
        this.html = "",
        this.pos = -1,
        this.lastGapPos = -2,
        this.gapStack = [],
        this.skipNextNewLine = !1,
        this.lastChunkWritten = !1,
        this.endOfChunkHit = !1,
        this.bufferWaterline = 65536,
        this.isEol = !1,
        this.lineStartPos = 0,
        this.droppedBufferSize = 0,
        this.line = 1,
        this.lastErrOffset = -1
    }
    get col() {
        return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos)
    }
    get offset() {
        return this.droppedBufferSize + this.pos
    }
    getError(e, t) {
        const {line: n, col: r, offset: i} = this
          , s = r + t
          , o = i + t;
        return {
            code: e,
            startLine: n,
            endLine: n,
            startCol: s,
            endCol: s,
            startOffset: o,
            endOffset: o
        }
    }
    _err(e) {
        this.handler.onParseError && this.lastErrOffset !== this.offset && (this.lastErrOffset = this.offset,
        this.handler.onParseError(this.getError(e, 0)))
    }
    _addGap() {
        this.gapStack.push(this.lastGapPos),
        this.lastGapPos = this.pos
    }
    _processSurrogate(e) {
        if (this.pos !== this.html.length - 1) {
            const t = this.html.charCodeAt(this.pos + 1);
            if (function(e) {
                return e >= 56320 && e <= 57343
            }(t))
                return this.pos++,
                this._addGap(),
                1024 * (e - 55296) + 9216 + t
        } else if (!this.lastChunkWritten)
            return this.endOfChunkHit = !0,
            co.EOF;
        return this._err(_o.surrogateInInputStream),
        e
    }
    willDropParsedChunk() {
        return this.pos > this.bufferWaterline
    }
    dropParsedChunk() {
        this.willDropParsedChunk() && (this.html = this.html.substring(this.pos),
        this.lineStartPos -= this.pos,
        this.droppedBufferSize += this.pos,
        this.pos = 0,
        this.lastGapPos = -2,
        this.gapStack.length = 0)
    }
    write(e, t) {
        this.html.length > 0 ? this.html += e : this.html = e,
        this.endOfChunkHit = !1,
        this.lastChunkWritten = t
    }
    insertHtmlAtCurrentPos(e) {
        this.html = this.html.substring(0, this.pos + 1) + e + this.html.substring(this.pos + 1),
        this.endOfChunkHit = !1
    }
    startsWith(e, t) {
        if (this.pos + e.length > this.html.length)
            return this.endOfChunkHit = !this.lastChunkWritten,
            !1;
        if (t)
            return this.html.startsWith(e, this.pos);
        for (let n = 0; n < e.length; n++) {
            if ((32 | this.html.charCodeAt(this.pos + n)) !== e.charCodeAt(n))
                return !1
        }
        return !0
    }
    peek(e) {
        const t = this.pos + e;
        if (t >= this.html.length)
            return this.endOfChunkHit = !this.lastChunkWritten,
            co.EOF;
        const n = this.html.charCodeAt(t);
        return n === co.CARRIAGE_RETURN ? co.LINE_FEED : n
    }
    advance() {
        if (this.pos++,
        this.isEol && (this.isEol = !1,
        this.line++,
        this.lineStartPos = this.pos),
        this.pos >= this.html.length)
            return this.endOfChunkHit = !this.lastChunkWritten,
            co.EOF;
        let e = this.html.charCodeAt(this.pos);
        if (e === co.CARRIAGE_RETURN)
            return this.isEol = !0,
            this.skipNextNewLine = !0,
            co.LINE_FEED;
        if (e === co.LINE_FEED && (this.isEol = !0,
        this.skipNextNewLine))
            return this.line--,
            this.skipNextNewLine = !1,
            this._addGap(),
            this.advance();
        this.skipNextNewLine = !1,
        To(e) && (e = this._processSurrogate(e));
        return null === this.handler.onParseError || e > 31 && e < 127 || e === co.LINE_FEED || e === co.CARRIAGE_RETURN || e > 159 && e < 64976 || this._checkForProblematicCharacters(e),
        e
    }
    _checkForProblematicCharacters(e) {
        go(e) ? this._err(_o.controlCharacterInInputStream) : Ao(e) && this._err(_o.noncharacterInInputStream)
    }
    retreat(e) {
        for (this.pos -= e; this.pos < this.lastGapPos; )
            this.lastGapPos = this.gapStack.pop(),
            this.pos--;
        this.isEol = !1
    }
}
var ko, So;
function Co(e, t) {
    for (let n = e.attrs.length - 1; n >= 0; n--)
        if (e.attrs[n].name === t)
            return e.attrs[n].value;
    return null
}
(So = ko || (ko = {}))[So.CHARACTER = 0] = "CHARACTER",
So[So.NULL_CHARACTER = 1] = "NULL_CHARACTER",
So[So.WHITESPACE_CHARACTER = 2] = "WHITESPACE_CHARACTER",
So[So.START_TAG = 3] = "START_TAG",
So[So.END_TAG = 4] = "END_TAG",
So[So.COMMENT = 5] = "COMMENT",
So[So.DOCTYPE = 6] = "DOCTYPE",
So[So.EOF = 7] = "EOF",
So[So.HIBERNATION = 8] = "HIBERNATION";
const Do = new Uint16Array('ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map(e => e.charCodeAt(0)))
  , Oo = new Map([[0, 65533], [128, 8364], [130, 8218], [131, 402], [132, 8222], [133, 8230], [134, 8224], [135, 8225], [136, 710], [137, 8240], [138, 352], [139, 8249], [140, 338], [142, 381], [145, 8216], [146, 8217], [147, 8220], [148, 8221], [149, 8226], [150, 8211], [151, 8212], [152, 732], [153, 8482], [154, 353], [155, 8250], [156, 339], [158, 382], [159, 376]]);
var yo, bo;
(bo = yo || (yo = {}))[bo.NUM = 35] = "NUM",
bo[bo.SEMI = 59] = "SEMI",
bo[bo.EQUALS = 61] = "EQUALS",
bo[bo.ZERO = 48] = "ZERO",
bo[bo.NINE = 57] = "NINE",
bo[bo.LOWER_A = 97] = "LOWER_A",
bo[bo.LOWER_F = 102] = "LOWER_F",
bo[bo.LOWER_X = 120] = "LOWER_X",
bo[bo.LOWER_Z = 122] = "LOWER_Z",
bo[bo.UPPER_A = 65] = "UPPER_A",
bo[bo.UPPER_F = 70] = "UPPER_F",
bo[bo.UPPER_Z = 90] = "UPPER_Z";
var Ro, Lo, Po, Mo, xo, vo, wo, Fo, Bo, Ho, Uo, Go, Yo, zo, qo, Vo;
function Qo(e) {
    return e >= yo.ZERO && e <= yo.NINE
}
function jo(e) {
    return e >= yo.UPPER_A && e <= yo.UPPER_F || e >= yo.LOWER_A && e <= yo.LOWER_F
}
function Wo(e) {
    return e === yo.EQUALS || function(e) {
        return e >= yo.UPPER_A && e <= yo.UPPER_Z || e >= yo.LOWER_A && e <= yo.LOWER_Z || Qo(e)
    }(e)
}
(Lo = Ro || (Ro = {}))[Lo.VALUE_LENGTH = 49152] = "VALUE_LENGTH",
Lo[Lo.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH",
Lo[Lo.JUMP_TABLE = 127] = "JUMP_TABLE",
(Mo = Po || (Po = {}))[Mo.EntityStart = 0] = "EntityStart",
Mo[Mo.NumericStart = 1] = "NumericStart",
Mo[Mo.NumericDecimal = 2] = "NumericDecimal",
Mo[Mo.NumericHex = 3] = "NumericHex",
Mo[Mo.NamedEntity = 4] = "NamedEntity",
(vo = xo || (xo = {}))[vo.Legacy = 0] = "Legacy",
vo[vo.Strict = 1] = "Strict",
vo[vo.Attribute = 2] = "Attribute";
class Ko {
    constructor(e, t, n) {
        this.decodeTree = e,
        this.emitCodePoint = t,
        this.errors = n,
        this.state = Po.EntityStart,
        this.consumed = 1,
        this.result = 0,
        this.treeIndex = 0,
        this.excess = 1,
        this.decodeMode = xo.Strict
    }
    startEntity(e) {
        this.decodeMode = e,
        this.state = Po.EntityStart,
        this.result = 0,
        this.treeIndex = 0,
        this.excess = 1,
        this.consumed = 1
    }
    write(e, t) {
        switch (this.state) {
        case Po.EntityStart:
            return e.charCodeAt(t) === yo.NUM ? (this.state = Po.NumericStart,
            this.consumed += 1,
            this.stateNumericStart(e, t + 1)) : (this.state = Po.NamedEntity,
            this.stateNamedEntity(e, t));
        case Po.NumericStart:
            return this.stateNumericStart(e, t);
        case Po.NumericDecimal:
            return this.stateNumericDecimal(e, t);
        case Po.NumericHex:
            return this.stateNumericHex(e, t);
        case Po.NamedEntity:
            return this.stateNamedEntity(e, t)
        }
    }
    stateNumericStart(e, t) {
        return t >= e.length ? -1 : (32 | e.charCodeAt(t)) === yo.LOWER_X ? (this.state = Po.NumericHex,
        this.consumed += 1,
        this.stateNumericHex(e, t + 1)) : (this.state = Po.NumericDecimal,
        this.stateNumericDecimal(e, t))
    }
    addToNumericResult(e, t, n, r) {
        if (t !== n) {
            const i = n - t;
            this.result = this.result * Math.pow(r, i) + Number.parseInt(e.substr(t, i), r),
            this.consumed += i
        }
    }
    stateNumericHex(e, t) {
        const n = t;
        for (; t < e.length; ) {
            const r = e.charCodeAt(t);
            if (!Qo(r) && !jo(r))
                return this.addToNumericResult(e, n, t, 16),
                this.emitNumericEntity(r, 3);
            t += 1
        }
        return this.addToNumericResult(e, n, t, 16),
        -1
    }
    stateNumericDecimal(e, t) {
        const n = t;
        for (; t < e.length; ) {
            const r = e.charCodeAt(t);
            if (!Qo(r))
                return this.addToNumericResult(e, n, t, 10),
                this.emitNumericEntity(r, 2);
            t += 1
        }
        return this.addToNumericResult(e, n, t, 10),
        -1
    }
    emitNumericEntity(e, t) {
        var n;
        if (this.consumed <= t)
            return null === (n = this.errors) || void 0 === n || n.absenceOfDigitsInNumericCharacterReference(this.consumed),
            0;
        if (e === yo.SEMI)
            this.consumed += 1;
        else if (this.decodeMode === xo.Strict)
            return 0;
        return this.emitCodePoint(function(e) {
            var t;
            return e >= 55296 && e <= 57343 || e > 1114111 ? 65533 : null !== (t = Oo.get(e)) && void 0 !== t ? t : e
        }(this.result), this.consumed),
        this.errors && (e !== yo.SEMI && this.errors.missingSemicolonAfterCharacterReference(),
        this.errors.validateNumericCharacterReference(this.result)),
        this.consumed
    }
    stateNamedEntity(e, t) {
        const {decodeTree: n} = this;
        let r = n[this.treeIndex]
          , i = (r & Ro.VALUE_LENGTH) >> 14;
        for (; t < e.length; t++,
        this.excess++) {
            const s = e.charCodeAt(t);
            if (this.treeIndex = Xo(n, r, this.treeIndex + Math.max(1, i), s),
            this.treeIndex < 0)
                return 0 === this.result || this.decodeMode === xo.Attribute && (0 === i || Wo(s)) ? 0 : this.emitNotTerminatedNamedEntity();
            if (r = n[this.treeIndex],
            i = (r & Ro.VALUE_LENGTH) >> 14,
            0 !== i) {
                if (s === yo.SEMI)
                    return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
                this.decodeMode !== xo.Strict && (this.result = this.treeIndex,
                this.consumed += this.excess,
                this.excess = 0)
            }
        }
        return -1
    }
    emitNotTerminatedNamedEntity() {
        var e;
        const {result: t, decodeTree: n} = this
          , r = (n[t] & Ro.VALUE_LENGTH) >> 14;
        return this.emitNamedEntityData(t, r, this.consumed),
        null === (e = this.errors) || void 0 === e || e.missingSemicolonAfterCharacterReference(),
        this.consumed
    }
    emitNamedEntityData(e, t, n) {
        const {decodeTree: r} = this;
        return this.emitCodePoint(1 === t ? r[e] & ~Ro.VALUE_LENGTH : r[e + 1], n),
        3 === t && this.emitCodePoint(r[e + 2], n),
        n
    }
    end() {
        var e;
        switch (this.state) {
        case Po.NamedEntity:
            return 0 === this.result || this.decodeMode === xo.Attribute && this.result !== this.treeIndex ? 0 : this.emitNotTerminatedNamedEntity();
        case Po.NumericDecimal:
            return this.emitNumericEntity(0, 2);
        case Po.NumericHex:
            return this.emitNumericEntity(0, 3);
        case Po.NumericStart:
            return null === (e = this.errors) || void 0 === e || e.absenceOfDigitsInNumericCharacterReference(this.consumed),
            0;
        case Po.EntityStart:
            return 0
        }
    }
}
function Xo(e, t, n, r) {
    const i = (t & Ro.BRANCH_LENGTH) >> 7
      , s = t & Ro.JUMP_TABLE;
    if (0 === i)
        return 0 !== s && r === s ? n : -1;
    if (s) {
        const t = r - s;
        return t < 0 || t >= i ? -1 : e[n + t] - 1
    }
    let o = n
      , a = o + i - 1;
    for (; o <= a; ) {
        const t = o + a >>> 1
          , n = e[t];
        if (n < r)
            o = t + 1;
        else {
            if (!(n > r))
                return e[t + i];
            a = t - 1
        }
    }
    return -1
}
(Fo = wo || (wo = {})).HTML = "http://www.w3.org/1999/xhtml",
Fo.MATHML = "http://www.w3.org/1998/Math/MathML",
Fo.SVG = "http://www.w3.org/2000/svg",
Fo.XLINK = "http://www.w3.org/1999/xlink",
Fo.XML = "http://www.w3.org/XML/1998/namespace",
Fo.XMLNS = "http://www.w3.org/2000/xmlns/",
(Ho = Bo || (Bo = {})).TYPE = "type",
Ho.ACTION = "action",
Ho.ENCODING = "encoding",
Ho.PROMPT = "prompt",
Ho.NAME = "name",
Ho.COLOR = "color",
Ho.FACE = "face",
Ho.SIZE = "size",
(Go = Uo || (Uo = {})).NO_QUIRKS = "no-quirks",
Go.QUIRKS = "quirks",
Go.LIMITED_QUIRKS = "limited-quirks",
(zo = Yo || (Yo = {})).A = "a",
zo.ADDRESS = "address",
zo.ANNOTATION_XML = "annotation-xml",
zo.APPLET = "applet",
zo.AREA = "area",
zo.ARTICLE = "article",
zo.ASIDE = "aside",
zo.B = "b",
zo.BASE = "base",
zo.BASEFONT = "basefont",
zo.BGSOUND = "bgsound",
zo.BIG = "big",
zo.BLOCKQUOTE = "blockquote",
zo.BODY = "body",
zo.BR = "br",
zo.BUTTON = "button",
zo.CAPTION = "caption",
zo.CENTER = "center",
zo.CODE = "code",
zo.COL = "col",
zo.COLGROUP = "colgroup",
zo.DD = "dd",
zo.DESC = "desc",
zo.DETAILS = "details",
zo.DIALOG = "dialog",
zo.DIR = "dir",
zo.DIV = "div",
zo.DL = "dl",
zo.DT = "dt",
zo.EM = "em",
zo.EMBED = "embed",
zo.FIELDSET = "fieldset",
zo.FIGCAPTION = "figcaption",
zo.FIGURE = "figure",
zo.FONT = "font",
zo.FOOTER = "footer",
zo.FOREIGN_OBJECT = "foreignObject",
zo.FORM = "form",
zo.FRAME = "frame",
zo.FRAMESET = "frameset",
zo.H1 = "h1",
zo.H2 = "h2",
zo.H3 = "h3",
zo.H4 = "h4",
zo.H5 = "h5",
zo.H6 = "h6",
zo.HEAD = "head",
zo.HEADER = "header",
zo.HGROUP = "hgroup",
zo.HR = "hr",
zo.HTML = "html",
zo.I = "i",
zo.IMG = "img",
zo.IMAGE = "image",
zo.INPUT = "input",
zo.IFRAME = "iframe",
zo.KEYGEN = "keygen",
zo.LABEL = "label",
zo.LI = "li",
zo.LINK = "link",
zo.LISTING = "listing",
zo.MAIN = "main",
zo.MALIGNMARK = "malignmark",
zo.MARQUEE = "marquee",
zo.MATH = "math",
zo.MENU = "menu",
zo.META = "meta",
zo.MGLYPH = "mglyph",
zo.MI = "mi",
zo.MO = "mo",
zo.MN = "mn",
zo.MS = "ms",
zo.MTEXT = "mtext",
zo.NAV = "nav",
zo.NOBR = "nobr",
zo.NOFRAMES = "noframes",
zo.NOEMBED = "noembed",
zo.NOSCRIPT = "noscript",
zo.OBJECT = "object",
zo.OL = "ol",
zo.OPTGROUP = "optgroup",
zo.OPTION = "option",
zo.P = "p",
zo.PARAM = "param",
zo.PLAINTEXT = "plaintext",
zo.PRE = "pre",
zo.RB = "rb",
zo.RP = "rp",
zo.RT = "rt",
zo.RTC = "rtc",
zo.RUBY = "ruby",
zo.S = "s",
zo.SCRIPT = "script",
zo.SEARCH = "search",
zo.SECTION = "section",
zo.SELECT = "select",
zo.SOURCE = "source",
zo.SMALL = "small",
zo.SPAN = "span",
zo.STRIKE = "strike",
zo.STRONG = "strong",
zo.STYLE = "style",
zo.SUB = "sub",
zo.SUMMARY = "summary",
zo.SUP = "sup",
zo.TABLE = "table",
zo.TBODY = "tbody",
zo.TEMPLATE = "template",
zo.TEXTAREA = "textarea",
zo.TFOOT = "tfoot",
zo.TD = "td",
zo.TH = "th",
zo.THEAD = "thead",
zo.TITLE = "title",
zo.TR = "tr",
zo.TRACK = "track",
zo.TT = "tt",
zo.U = "u",
zo.UL = "ul",
zo.SVG = "svg",
zo.VAR = "var",
zo.WBR = "wbr",
zo.XMP = "xmp",
(Vo = qo || (qo = {}))[Vo.UNKNOWN = 0] = "UNKNOWN",
Vo[Vo.A = 1] = "A",
Vo[Vo.ADDRESS = 2] = "ADDRESS",
Vo[Vo.ANNOTATION_XML = 3] = "ANNOTATION_XML",
Vo[Vo.APPLET = 4] = "APPLET",
Vo[Vo.AREA = 5] = "AREA",
Vo[Vo.ARTICLE = 6] = "ARTICLE",
Vo[Vo.ASIDE = 7] = "ASIDE",
Vo[Vo.B = 8] = "B",
Vo[Vo.BASE = 9] = "BASE",
Vo[Vo.BASEFONT = 10] = "BASEFONT",
Vo[Vo.BGSOUND = 11] = "BGSOUND",
Vo[Vo.BIG = 12] = "BIG",
Vo[Vo.BLOCKQUOTE = 13] = "BLOCKQUOTE",
Vo[Vo.BODY = 14] = "BODY",
Vo[Vo.BR = 15] = "BR",
Vo[Vo.BUTTON = 16] = "BUTTON",
Vo[Vo.CAPTION = 17] = "CAPTION",
Vo[Vo.CENTER = 18] = "CENTER",
Vo[Vo.CODE = 19] = "CODE",
Vo[Vo.COL = 20] = "COL",
Vo[Vo.COLGROUP = 21] = "COLGROUP",
Vo[Vo.DD = 22] = "DD",
Vo[Vo.DESC = 23] = "DESC",
Vo[Vo.DETAILS = 24] = "DETAILS",
Vo[Vo.DIALOG = 25] = "DIALOG",
Vo[Vo.DIR = 26] = "DIR",
Vo[Vo.DIV = 27] = "DIV",
Vo[Vo.DL = 28] = "DL",
Vo[Vo.DT = 29] = "DT",
Vo[Vo.EM = 30] = "EM",
Vo[Vo.EMBED = 31] = "EMBED",
Vo[Vo.FIELDSET = 32] = "FIELDSET",
Vo[Vo.FIGCAPTION = 33] = "FIGCAPTION",
Vo[Vo.FIGURE = 34] = "FIGURE",
Vo[Vo.FONT = 35] = "FONT",
Vo[Vo.FOOTER = 36] = "FOOTER",
Vo[Vo.FOREIGN_OBJECT = 37] = "FOREIGN_OBJECT",
Vo[Vo.FORM = 38] = "FORM",
Vo[Vo.FRAME = 39] = "FRAME",
Vo[Vo.FRAMESET = 40] = "FRAMESET",
Vo[Vo.H1 = 41] = "H1",
Vo[Vo.H2 = 42] = "H2",
Vo[Vo.H3 = 43] = "H3",
Vo[Vo.H4 = 44] = "H4",
Vo[Vo.H5 = 45] = "H5",
Vo[Vo.H6 = 46] = "H6",
Vo[Vo.HEAD = 47] = "HEAD",
Vo[Vo.HEADER = 48] = "HEADER",
Vo[Vo.HGROUP = 49] = "HGROUP",
Vo[Vo.HR = 50] = "HR",
Vo[Vo.HTML = 51] = "HTML",
Vo[Vo.I = 52] = "I",
Vo[Vo.IMG = 53] = "IMG",
Vo[Vo.IMAGE = 54] = "IMAGE",
Vo[Vo.INPUT = 55] = "INPUT",
Vo[Vo.IFRAME = 56] = "IFRAME",
Vo[Vo.KEYGEN = 57] = "KEYGEN",
Vo[Vo.LABEL = 58] = "LABEL",
Vo[Vo.LI = 59] = "LI",
Vo[Vo.LINK = 60] = "LINK",
Vo[Vo.LISTING = 61] = "LISTING",
Vo[Vo.MAIN = 62] = "MAIN",
Vo[Vo.MALIGNMARK = 63] = "MALIGNMARK",
Vo[Vo.MARQUEE = 64] = "MARQUEE",
Vo[Vo.MATH = 65] = "MATH",
Vo[Vo.MENU = 66] = "MENU",
Vo[Vo.META = 67] = "META",
Vo[Vo.MGLYPH = 68] = "MGLYPH",
Vo[Vo.MI = 69] = "MI",
Vo[Vo.MO = 70] = "MO",
Vo[Vo.MN = 71] = "MN",
Vo[Vo.MS = 72] = "MS",
Vo[Vo.MTEXT = 73] = "MTEXT",
Vo[Vo.NAV = 74] = "NAV",
Vo[Vo.NOBR = 75] = "NOBR",
Vo[Vo.NOFRAMES = 76] = "NOFRAMES",
Vo[Vo.NOEMBED = 77] = "NOEMBED",
Vo[Vo.NOSCRIPT = 78] = "NOSCRIPT",
Vo[Vo.OBJECT = 79] = "OBJECT",
Vo[Vo.OL = 80] = "OL",
Vo[Vo.OPTGROUP = 81] = "OPTGROUP",
Vo[Vo.OPTION = 82] = "OPTION",
Vo[Vo.P = 83] = "P",
Vo[Vo.PARAM = 84] = "PARAM",
Vo[Vo.PLAINTEXT = 85] = "PLAINTEXT",
Vo[Vo.PRE = 86] = "PRE",
Vo[Vo.RB = 87] = "RB",
Vo[Vo.RP = 88] = "RP",
Vo[Vo.RT = 89] = "RT",
Vo[Vo.RTC = 90] = "RTC",
Vo[Vo.RUBY = 91] = "RUBY",
Vo[Vo.S = 92] = "S",
Vo[Vo.SCRIPT = 93] = "SCRIPT",
Vo[Vo.SEARCH = 94] = "SEARCH",
Vo[Vo.SECTION = 95] = "SECTION",
Vo[Vo.SELECT = 96] = "SELECT",
Vo[Vo.SOURCE = 97] = "SOURCE",
Vo[Vo.SMALL = 98] = "SMALL",
Vo[Vo.SPAN = 99] = "SPAN",
Vo[Vo.STRIKE = 100] = "STRIKE",
Vo[Vo.STRONG = 101] = "STRONG",
Vo[Vo.STYLE = 102] = "STYLE",
Vo[Vo.SUB = 103] = "SUB",
Vo[Vo.SUMMARY = 104] = "SUMMARY",
Vo[Vo.SUP = 105] = "SUP",
Vo[Vo.TABLE = 106] = "TABLE",
Vo[Vo.TBODY = 107] = "TBODY",
Vo[Vo.TEMPLATE = 108] = "TEMPLATE",
Vo[Vo.TEXTAREA = 109] = "TEXTAREA",
Vo[Vo.TFOOT = 110] = "TFOOT",
Vo[Vo.TD = 111] = "TD",
Vo[Vo.TH = 112] = "TH",
Vo[Vo.THEAD = 113] = "THEAD",
Vo[Vo.TITLE = 114] = "TITLE",
Vo[Vo.TR = 115] = "TR",
Vo[Vo.TRACK = 116] = "TRACK",
Vo[Vo.TT = 117] = "TT",
Vo[Vo.U = 118] = "U",
Vo[Vo.UL = 119] = "UL",
Vo[Vo.SVG = 120] = "SVG",
Vo[Vo.VAR = 121] = "VAR",
Vo[Vo.WBR = 122] = "WBR",
Vo[Vo.XMP = 123] = "XMP";
const Jo = new Map([[Yo.A, qo.A], [Yo.ADDRESS, qo.ADDRESS], [Yo.ANNOTATION_XML, qo.ANNOTATION_XML], [Yo.APPLET, qo.APPLET], [Yo.AREA, qo.AREA], [Yo.ARTICLE, qo.ARTICLE], [Yo.ASIDE, qo.ASIDE], [Yo.B, qo.B], [Yo.BASE, qo.BASE], [Yo.BASEFONT, qo.BASEFONT], [Yo.BGSOUND, qo.BGSOUND], [Yo.BIG, qo.BIG], [Yo.BLOCKQUOTE, qo.BLOCKQUOTE], [Yo.BODY, qo.BODY], [Yo.BR, qo.BR], [Yo.BUTTON, qo.BUTTON], [Yo.CAPTION, qo.CAPTION], [Yo.CENTER, qo.CENTER], [Yo.CODE, qo.CODE], [Yo.COL, qo.COL], [Yo.COLGROUP, qo.COLGROUP], [Yo.DD, qo.DD], [Yo.DESC, qo.DESC], [Yo.DETAILS, qo.DETAILS], [Yo.DIALOG, qo.DIALOG], [Yo.DIR, qo.DIR], [Yo.DIV, qo.DIV], [Yo.DL, qo.DL], [Yo.DT, qo.DT], [Yo.EM, qo.EM], [Yo.EMBED, qo.EMBED], [Yo.FIELDSET, qo.FIELDSET], [Yo.FIGCAPTION, qo.FIGCAPTION], [Yo.FIGURE, qo.FIGURE], [Yo.FONT, qo.FONT], [Yo.FOOTER, qo.FOOTER], [Yo.FOREIGN_OBJECT, qo.FOREIGN_OBJECT], [Yo.FORM, qo.FORM], [Yo.FRAME, qo.FRAME], [Yo.FRAMESET, qo.FRAMESET], [Yo.H1, qo.H1], [Yo.H2, qo.H2], [Yo.H3, qo.H3], [Yo.H4, qo.H4], [Yo.H5, qo.H5], [Yo.H6, qo.H6], [Yo.HEAD, qo.HEAD], [Yo.HEADER, qo.HEADER], [Yo.HGROUP, qo.HGROUP], [Yo.HR, qo.HR], [Yo.HTML, qo.HTML], [Yo.I, qo.I], [Yo.IMG, qo.IMG], [Yo.IMAGE, qo.IMAGE], [Yo.INPUT, qo.INPUT], [Yo.IFRAME, qo.IFRAME], [Yo.KEYGEN, qo.KEYGEN], [Yo.LABEL, qo.LABEL], [Yo.LI, qo.LI], [Yo.LINK, qo.LINK], [Yo.LISTING, qo.LISTING], [Yo.MAIN, qo.MAIN], [Yo.MALIGNMARK, qo.MALIGNMARK], [Yo.MARQUEE, qo.MARQUEE], [Yo.MATH, qo.MATH], [Yo.MENU, qo.MENU], [Yo.META, qo.META], [Yo.MGLYPH, qo.MGLYPH], [Yo.MI, qo.MI], [Yo.MO, qo.MO], [Yo.MN, qo.MN], [Yo.MS, qo.MS], [Yo.MTEXT, qo.MTEXT], [Yo.NAV, qo.NAV], [Yo.NOBR, qo.NOBR], [Yo.NOFRAMES, qo.NOFRAMES], [Yo.NOEMBED, qo.NOEMBED], [Yo.NOSCRIPT, qo.NOSCRIPT], [Yo.OBJECT, qo.OBJECT], [Yo.OL, qo.OL], [Yo.OPTGROUP, qo.OPTGROUP], [Yo.OPTION, qo.OPTION], [Yo.P, qo.P], [Yo.PARAM, qo.PARAM], [Yo.PLAINTEXT, qo.PLAINTEXT], [Yo.PRE, qo.PRE], [Yo.RB, qo.RB], [Yo.RP, qo.RP], [Yo.RT, qo.RT], [Yo.RTC, qo.RTC], [Yo.RUBY, qo.RUBY], [Yo.S, qo.S], [Yo.SCRIPT, qo.SCRIPT], [Yo.SEARCH, qo.SEARCH], [Yo.SECTION, qo.SECTION], [Yo.SELECT, qo.SELECT], [Yo.SOURCE, qo.SOURCE], [Yo.SMALL, qo.SMALL], [Yo.SPAN, qo.SPAN], [Yo.STRIKE, qo.STRIKE], [Yo.STRONG, qo.STRONG], [Yo.STYLE, qo.STYLE], [Yo.SUB, qo.SUB], [Yo.SUMMARY, qo.SUMMARY], [Yo.SUP, qo.SUP], [Yo.TABLE, qo.TABLE], [Yo.TBODY, qo.TBODY], [Yo.TEMPLATE, qo.TEMPLATE], [Yo.TEXTAREA, qo.TEXTAREA], [Yo.TFOOT, qo.TFOOT], [Yo.TD, qo.TD], [Yo.TH, qo.TH], [Yo.THEAD, qo.THEAD], [Yo.TITLE, qo.TITLE], [Yo.TR, qo.TR], [Yo.TRACK, qo.TRACK], [Yo.TT, qo.TT], [Yo.U, qo.U], [Yo.UL, qo.UL], [Yo.SVG, qo.SVG], [Yo.VAR, qo.VAR], [Yo.WBR, qo.WBR], [Yo.XMP, qo.XMP]]);
function $o(e) {
    var t;
    return null !== (t = Jo.get(e)) && void 0 !== t ? t : qo.UNKNOWN
}
const Zo = qo
  , ea = {
    [wo.HTML]: new Set([Zo.ADDRESS, Zo.APPLET, Zo.AREA, Zo.ARTICLE, Zo.ASIDE, Zo.BASE, Zo.BASEFONT, Zo.BGSOUND, Zo.BLOCKQUOTE, Zo.BODY, Zo.BR, Zo.BUTTON, Zo.CAPTION, Zo.CENTER, Zo.COL, Zo.COLGROUP, Zo.DD, Zo.DETAILS, Zo.DIR, Zo.DIV, Zo.DL, Zo.DT, Zo.EMBED, Zo.FIELDSET, Zo.FIGCAPTION, Zo.FIGURE, Zo.FOOTER, Zo.FORM, Zo.FRAME, Zo.FRAMESET, Zo.H1, Zo.H2, Zo.H3, Zo.H4, Zo.H5, Zo.H6, Zo.HEAD, Zo.HEADER, Zo.HGROUP, Zo.HR, Zo.HTML, Zo.IFRAME, Zo.IMG, Zo.INPUT, Zo.LI, Zo.LINK, Zo.LISTING, Zo.MAIN, Zo.MARQUEE, Zo.MENU, Zo.META, Zo.NAV, Zo.NOEMBED, Zo.NOFRAMES, Zo.NOSCRIPT, Zo.OBJECT, Zo.OL, Zo.P, Zo.PARAM, Zo.PLAINTEXT, Zo.PRE, Zo.SCRIPT, Zo.SECTION, Zo.SELECT, Zo.SOURCE, Zo.STYLE, Zo.SUMMARY, Zo.TABLE, Zo.TBODY, Zo.TD, Zo.TEMPLATE, Zo.TEXTAREA, Zo.TFOOT, Zo.TH, Zo.THEAD, Zo.TITLE, Zo.TR, Zo.TRACK, Zo.UL, Zo.WBR, Zo.XMP]),
    [wo.MATHML]: new Set([Zo.MI, Zo.MO, Zo.MN, Zo.MS, Zo.MTEXT, Zo.ANNOTATION_XML]),
    [wo.SVG]: new Set([Zo.TITLE, Zo.FOREIGN_OBJECT, Zo.DESC]),
    [wo.XLINK]: new Set,
    [wo.XML]: new Set,
    [wo.XMLNS]: new Set
}
  , ta = new Set([Zo.H1, Zo.H2, Zo.H3, Zo.H4, Zo.H5, Zo.H6]);
var na, ra;
Yo.STYLE,
Yo.SCRIPT,
Yo.XMP,
Yo.IFRAME,
Yo.NOEMBED,
Yo.NOFRAMES,
Yo.PLAINTEXT,
(ra = na || (na = {}))[ra.DATA = 0] = "DATA",
ra[ra.RCDATA = 1] = "RCDATA",
ra[ra.RAWTEXT = 2] = "RAWTEXT",
ra[ra.SCRIPT_DATA = 3] = "SCRIPT_DATA",
ra[ra.PLAINTEXT = 4] = "PLAINTEXT",
ra[ra.TAG_OPEN = 5] = "TAG_OPEN",
ra[ra.END_TAG_OPEN = 6] = "END_TAG_OPEN",
ra[ra.TAG_NAME = 7] = "TAG_NAME",
ra[ra.RCDATA_LESS_THAN_SIGN = 8] = "RCDATA_LESS_THAN_SIGN",
ra[ra.RCDATA_END_TAG_OPEN = 9] = "RCDATA_END_TAG_OPEN",
ra[ra.RCDATA_END_TAG_NAME = 10] = "RCDATA_END_TAG_NAME",
ra[ra.RAWTEXT_LESS_THAN_SIGN = 11] = "RAWTEXT_LESS_THAN_SIGN",
ra[ra.RAWTEXT_END_TAG_OPEN = 12] = "RAWTEXT_END_TAG_OPEN",
ra[ra.RAWTEXT_END_TAG_NAME = 13] = "RAWTEXT_END_TAG_NAME",
ra[ra.SCRIPT_DATA_LESS_THAN_SIGN = 14] = "SCRIPT_DATA_LESS_THAN_SIGN",
ra[ra.SCRIPT_DATA_END_TAG_OPEN = 15] = "SCRIPT_DATA_END_TAG_OPEN",
ra[ra.SCRIPT_DATA_END_TAG_NAME = 16] = "SCRIPT_DATA_END_TAG_NAME",
ra[ra.SCRIPT_DATA_ESCAPE_START = 17] = "SCRIPT_DATA_ESCAPE_START",
ra[ra.SCRIPT_DATA_ESCAPE_START_DASH = 18] = "SCRIPT_DATA_ESCAPE_START_DASH",
ra[ra.SCRIPT_DATA_ESCAPED = 19] = "SCRIPT_DATA_ESCAPED",
ra[ra.SCRIPT_DATA_ESCAPED_DASH = 20] = "SCRIPT_DATA_ESCAPED_DASH",
ra[ra.SCRIPT_DATA_ESCAPED_DASH_DASH = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH",
ra[ra.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN",
ra[ra.SCRIPT_DATA_ESCAPED_END_TAG_OPEN = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN",
ra[ra.SCRIPT_DATA_ESCAPED_END_TAG_NAME = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME",
ra[ra.SCRIPT_DATA_DOUBLE_ESCAPE_START = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START",
ra[ra.SCRIPT_DATA_DOUBLE_ESCAPED = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED",
ra[ra.SCRIPT_DATA_DOUBLE_ESCAPED_DASH = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH",
ra[ra.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH",
ra[ra.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN",
ra[ra.SCRIPT_DATA_DOUBLE_ESCAPE_END = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END",
ra[ra.BEFORE_ATTRIBUTE_NAME = 31] = "BEFORE_ATTRIBUTE_NAME",
ra[ra.ATTRIBUTE_NAME = 32] = "ATTRIBUTE_NAME",
ra[ra.AFTER_ATTRIBUTE_NAME = 33] = "AFTER_ATTRIBUTE_NAME",
ra[ra.BEFORE_ATTRIBUTE_VALUE = 34] = "BEFORE_ATTRIBUTE_VALUE",
ra[ra.ATTRIBUTE_VALUE_DOUBLE_QUOTED = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED",
ra[ra.ATTRIBUTE_VALUE_SINGLE_QUOTED = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED",
ra[ra.ATTRIBUTE_VALUE_UNQUOTED = 37] = "ATTRIBUTE_VALUE_UNQUOTED",
ra[ra.AFTER_ATTRIBUTE_VALUE_QUOTED = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED",
ra[ra.SELF_CLOSING_START_TAG = 39] = "SELF_CLOSING_START_TAG",
ra[ra.BOGUS_COMMENT = 40] = "BOGUS_COMMENT",
ra[ra.MARKUP_DECLARATION_OPEN = 41] = "MARKUP_DECLARATION_OPEN",
ra[ra.COMMENT_START = 42] = "COMMENT_START",
ra[ra.COMMENT_START_DASH = 43] = "COMMENT_START_DASH",
ra[ra.COMMENT = 44] = "COMMENT",
ra[ra.COMMENT_LESS_THAN_SIGN = 45] = "COMMENT_LESS_THAN_SIGN",
ra[ra.COMMENT_LESS_THAN_SIGN_BANG = 46] = "COMMENT_LESS_THAN_SIGN_BANG",
ra[ra.COMMENT_LESS_THAN_SIGN_BANG_DASH = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH",
ra[ra.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH",
ra[ra.COMMENT_END_DASH = 49] = "COMMENT_END_DASH",
ra[ra.COMMENT_END = 50] = "COMMENT_END",
ra[ra.COMMENT_END_BANG = 51] = "COMMENT_END_BANG",
ra[ra.DOCTYPE = 52] = "DOCTYPE",
ra[ra.BEFORE_DOCTYPE_NAME = 53] = "BEFORE_DOCTYPE_NAME",
ra[ra.DOCTYPE_NAME = 54] = "DOCTYPE_NAME",
ra[ra.AFTER_DOCTYPE_NAME = 55] = "AFTER_DOCTYPE_NAME",
ra[ra.AFTER_DOCTYPE_PUBLIC_KEYWORD = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD",
ra[ra.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER",
ra[ra.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED",
ra[ra.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED",
ra[ra.AFTER_DOCTYPE_PUBLIC_IDENTIFIER = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER",
ra[ra.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS",
ra[ra.AFTER_DOCTYPE_SYSTEM_KEYWORD = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD",
ra[ra.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER",
ra[ra.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED",
ra[ra.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED",
ra[ra.AFTER_DOCTYPE_SYSTEM_IDENTIFIER = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER",
ra[ra.BOGUS_DOCTYPE = 67] = "BOGUS_DOCTYPE",
ra[ra.CDATA_SECTION = 68] = "CDATA_SECTION",
ra[ra.CDATA_SECTION_BRACKET = 69] = "CDATA_SECTION_BRACKET",
ra[ra.CDATA_SECTION_END = 70] = "CDATA_SECTION_END",
ra[ra.CHARACTER_REFERENCE = 71] = "CHARACTER_REFERENCE",
ra[ra.AMBIGUOUS_AMPERSAND = 72] = "AMBIGUOUS_AMPERSAND";
const ia = {
    DATA: na.DATA,
    RCDATA: na.RCDATA,
    RAWTEXT: na.RAWTEXT,
    SCRIPT_DATA: na.SCRIPT_DATA,
    PLAINTEXT: na.PLAINTEXT,
    CDATA_SECTION: na.CDATA_SECTION
};
function sa(e) {
    return e >= co.LATIN_CAPITAL_A && e <= co.LATIN_CAPITAL_Z
}
function oa(e) {
    return function(e) {
        return e >= co.LATIN_SMALL_A && e <= co.LATIN_SMALL_Z
    }(e) || sa(e)
}
function aa(e) {
    return oa(e) || function(e) {
        return e >= co.DIGIT_0 && e <= co.DIGIT_9
    }(e)
}
function ca(e) {
    return e + 32
}
function la(e) {
    return e === co.SPACE || e === co.LINE_FEED || e === co.TABULATION || e === co.FORM_FEED
}
function ua(e) {
    return la(e) || e === co.SOLIDUS || e === co.GREATER_THAN_SIGN
}
class ha {
    constructor(e, t) {
        this.options = e,
        this.handler = t,
        this.paused = !1,
        this.inLoop = !1,
        this.inForeignNode = !1,
        this.lastStartTagName = "",
        this.active = !1,
        this.state = na.DATA,
        this.returnState = na.DATA,
        this.entityStartPos = 0,
        this.consumedAfterSnapshot = -1,
        this.currentCharacterToken = null,
        this.currentToken = null,
        this.currentAttr = {
            name: "",
            value: ""
        },
        this.preprocessor = new No(t),
        this.currentLocation = this.getCurrentLocation(-1),
        this.entityDecoder = new Ko(Do, (e, t) => {
            this.preprocessor.pos = this.entityStartPos + t - 1,
            this._flushCodePointConsumedAsCharacterReference(e)
        }
        ,t.onParseError ? {
            missingSemicolonAfterCharacterReference: () => {
                this._err(_o.missingSemicolonAfterCharacterReference, 1)
            }
            ,
            absenceOfDigitsInNumericCharacterReference: e => {
                this._err(_o.absenceOfDigitsInNumericCharacterReference, this.entityStartPos - this.preprocessor.pos + e)
            }
            ,
            validateNumericCharacterReference: e => {
                const t = function(e) {
                    return e === co.NULL ? _o.nullCharacterReference : e > 1114111 ? _o.characterReferenceOutsideUnicodeRange : To(e) ? _o.surrogateCharacterReference : Ao(e) ? _o.noncharacterCharacterReference : go(e) || e === co.CARRIAGE_RETURN ? _o.controlCharacterReference : null
                }(e);
                t && this._err(t, 1)
            }
        } : void 0)
    }
    _err(e, t=0) {
        var n, r;
        null === (r = (n = this.handler).onParseError) || void 0 === r || r.call(n, this.preprocessor.getError(e, t))
    }
    getCurrentLocation(e) {
        return this.options.sourceCodeLocationInfo ? {
            startLine: this.preprocessor.line,
            startCol: this.preprocessor.col - e,
            startOffset: this.preprocessor.offset - e,
            endLine: -1,
            endCol: -1,
            endOffset: -1
        } : null
    }
    _runParsingLoop() {
        if (!this.inLoop) {
            for (this.inLoop = !0; this.active && !this.paused; ) {
                this.consumedAfterSnapshot = 0;
                const e = this._consume();
                this._ensureHibernation() || this._callState(e)
            }
            this.inLoop = !1
        }
    }
    pause() {
        this.paused = !0
    }
    resume(e) {
        if (!this.paused)
            throw new Error("Parser was already resumed");
        this.paused = !1,
        this.inLoop || (this._runParsingLoop(),
        this.paused || null == e || e())
    }
    write(e, t, n) {
        this.active = !0,
        this.preprocessor.write(e, t),
        this._runParsingLoop(),
        this.paused || null == n || n()
    }
    insertHtmlAtCurrentPos(e) {
        this.active = !0,
        this.preprocessor.insertHtmlAtCurrentPos(e),
        this._runParsingLoop()
    }
    _ensureHibernation() {
        return !!this.preprocessor.endOfChunkHit && (this.preprocessor.retreat(this.consumedAfterSnapshot),
        this.consumedAfterSnapshot = 0,
        this.active = !1,
        !0)
    }
    _consume() {
        return this.consumedAfterSnapshot++,
        this.preprocessor.advance()
    }
    _advanceBy(e) {
        this.consumedAfterSnapshot += e;
        for (let t = 0; t < e; t++)
            this.preprocessor.advance()
    }
    _consumeSequenceIfMatch(e, t) {
        return !!this.preprocessor.startsWith(e, t) && (this._advanceBy(e.length - 1),
        !0)
    }
    _createStartTagToken() {
        this.currentToken = {
            type: ko.START_TAG,
            tagName: "",
            tagID: qo.UNKNOWN,
            selfClosing: !1,
            ackSelfClosing: !1,
            attrs: [],
            location: this.getCurrentLocation(1)
        }
    }
    _createEndTagToken() {
        this.currentToken = {
            type: ko.END_TAG,
            tagName: "",
            tagID: qo.UNKNOWN,
            selfClosing: !1,
            ackSelfClosing: !1,
            attrs: [],
            location: this.getCurrentLocation(2)
        }
    }
    _createCommentToken(e) {
        this.currentToken = {
            type: ko.COMMENT,
            data: "",
            location: this.getCurrentLocation(e)
        }
    }
    _createDoctypeToken(e) {
        this.currentToken = {
            type: ko.DOCTYPE,
            name: e,
            forceQuirks: !1,
            publicId: null,
            systemId: null,
            location: this.currentLocation
        }
    }
    _createCharacterToken(e, t) {
        this.currentCharacterToken = {
            type: e,
            chars: t,
            location: this.currentLocation
        }
    }
    _createAttr(e) {
        this.currentAttr = {
            name: e,
            value: ""
        },
        this.currentLocation = this.getCurrentLocation(0)
    }
    _leaveAttrName() {
        var e, t;
        const n = this.currentToken;
        if (null === Co(n, this.currentAttr.name)) {
            if (n.attrs.push(this.currentAttr),
            n.location && this.currentLocation) {
                (null !== (e = (t = n.location).attrs) && void 0 !== e ? e : t.attrs = Object.create(null))[this.currentAttr.name] = this.currentLocation,
                this._leaveAttrValue()
            }
        } else
            this._err(_o.duplicateAttribute)
    }
    _leaveAttrValue() {
        this.currentLocation && (this.currentLocation.endLine = this.preprocessor.line,
        this.currentLocation.endCol = this.preprocessor.col,
        this.currentLocation.endOffset = this.preprocessor.offset)
    }
    prepareToken(e) {
        this._emitCurrentCharacterToken(e.location),
        this.currentToken = null,
        e.location && (e.location.endLine = this.preprocessor.line,
        e.location.endCol = this.preprocessor.col + 1,
        e.location.endOffset = this.preprocessor.offset + 1),
        this.currentLocation = this.getCurrentLocation(-1)
    }
    emitCurrentTagToken() {
        const e = this.currentToken;
        this.prepareToken(e),
        e.tagID = $o(e.tagName),
        e.type === ko.START_TAG ? (this.lastStartTagName = e.tagName,
        this.handler.onStartTag(e)) : (e.attrs.length > 0 && this._err(_o.endTagWithAttributes),
        e.selfClosing && this._err(_o.endTagWithTrailingSolidus),
        this.handler.onEndTag(e)),
        this.preprocessor.dropParsedChunk()
    }
    emitCurrentComment(e) {
        this.prepareToken(e),
        this.handler.onComment(e),
        this.preprocessor.dropParsedChunk()
    }
    emitCurrentDoctype(e) {
        this.prepareToken(e),
        this.handler.onDoctype(e),
        this.preprocessor.dropParsedChunk()
    }
    _emitCurrentCharacterToken(e) {
        if (this.currentCharacterToken) {
            switch (e && this.currentCharacterToken.location && (this.currentCharacterToken.location.endLine = e.startLine,
            this.currentCharacterToken.location.endCol = e.startCol,
            this.currentCharacterToken.location.endOffset = e.startOffset),
            this.currentCharacterToken.type) {
            case ko.CHARACTER:
                this.handler.onCharacter(this.currentCharacterToken);
                break;
            case ko.NULL_CHARACTER:
                this.handler.onNullCharacter(this.currentCharacterToken);
                break;
            case ko.WHITESPACE_CHARACTER:
                this.handler.onWhitespaceCharacter(this.currentCharacterToken)
            }
            this.currentCharacterToken = null
        }
    }
    _emitEOFToken() {
        const e = this.getCurrentLocation(0);
        e && (e.endLine = e.startLine,
        e.endCol = e.startCol,
        e.endOffset = e.startOffset),
        this._emitCurrentCharacterToken(e),
        this.handler.onEof({
            type: ko.EOF,
            location: e
        }),
        this.active = !1
    }
    _appendCharToCurrentCharacterToken(e, t) {
        if (this.currentCharacterToken) {
            if (this.currentCharacterToken.type === e)
                return void (this.currentCharacterToken.chars += t);
            this.currentLocation = this.getCurrentLocation(0),
            this._emitCurrentCharacterToken(this.currentLocation),
            this.preprocessor.dropParsedChunk()
        }
        this._createCharacterToken(e, t)
    }
    _emitCodePoint(e) {
        const t = la(e) ? ko.WHITESPACE_CHARACTER : e === co.NULL ? ko.NULL_CHARACTER : ko.CHARACTER;
        this._appendCharToCurrentCharacterToken(t, String.fromCodePoint(e))
    }
    _emitChars(e) {
        this._appendCharToCurrentCharacterToken(ko.CHARACTER, e)
    }
    _startCharacterReference() {
        this.returnState = this.state,
        this.state = na.CHARACTER_REFERENCE,
        this.entityStartPos = this.preprocessor.pos,
        this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute() ? xo.Attribute : xo.Legacy)
    }
    _isCharacterReferenceInAttribute() {
        return this.returnState === na.ATTRIBUTE_VALUE_DOUBLE_QUOTED || this.returnState === na.ATTRIBUTE_VALUE_SINGLE_QUOTED || this.returnState === na.ATTRIBUTE_VALUE_UNQUOTED
    }
    _flushCodePointConsumedAsCharacterReference(e) {
        this._isCharacterReferenceInAttribute() ? this.currentAttr.value += String.fromCodePoint(e) : this._emitCodePoint(e)
    }
    _callState(e) {
        switch (this.state) {
        case na.DATA:
            this._stateData(e);
            break;
        case na.RCDATA:
            this._stateRcdata(e);
            break;
        case na.RAWTEXT:
            this._stateRawtext(e);
            break;
        case na.SCRIPT_DATA:
            this._stateScriptData(e);
            break;
        case na.PLAINTEXT:
            this._statePlaintext(e);
            break;
        case na.TAG_OPEN:
            this._stateTagOpen(e);
            break;
        case na.END_TAG_OPEN:
            this._stateEndTagOpen(e);
            break;
        case na.TAG_NAME:
            this._stateTagName(e);
            break;
        case na.RCDATA_LESS_THAN_SIGN:
            this._stateRcdataLessThanSign(e);
            break;
        case na.RCDATA_END_TAG_OPEN:
            this._stateRcdataEndTagOpen(e);
            break;
        case na.RCDATA_END_TAG_NAME:
            this._stateRcdataEndTagName(e);
            break;
        case na.RAWTEXT_LESS_THAN_SIGN:
            this._stateRawtextLessThanSign(e);
            break;
        case na.RAWTEXT_END_TAG_OPEN:
            this._stateRawtextEndTagOpen(e);
            break;
        case na.RAWTEXT_END_TAG_NAME:
            this._stateRawtextEndTagName(e);
            break;
        case na.SCRIPT_DATA_LESS_THAN_SIGN:
            this._stateScriptDataLessThanSign(e);
            break;
        case na.SCRIPT_DATA_END_TAG_OPEN:
            this._stateScriptDataEndTagOpen(e);
            break;
        case na.SCRIPT_DATA_END_TAG_NAME:
            this._stateScriptDataEndTagName(e);
            break;
        case na.SCRIPT_DATA_ESCAPE_START:
            this._stateScriptDataEscapeStart(e);
            break;
        case na.SCRIPT_DATA_ESCAPE_START_DASH:
            this._stateScriptDataEscapeStartDash(e);
            break;
        case na.SCRIPT_DATA_ESCAPED:
            this._stateScriptDataEscaped(e);
            break;
        case na.SCRIPT_DATA_ESCAPED_DASH:
            this._stateScriptDataEscapedDash(e);
            break;
        case na.SCRIPT_DATA_ESCAPED_DASH_DASH:
            this._stateScriptDataEscapedDashDash(e);
            break;
        case na.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:
            this._stateScriptDataEscapedLessThanSign(e);
            break;
        case na.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:
            this._stateScriptDataEscapedEndTagOpen(e);
            break;
        case na.SCRIPT_DATA_ESCAPED_END_TAG_NAME:
            this._stateScriptDataEscapedEndTagName(e);
            break;
        case na.SCRIPT_DATA_DOUBLE_ESCAPE_START:
            this._stateScriptDataDoubleEscapeStart(e);
            break;
        case na.SCRIPT_DATA_DOUBLE_ESCAPED:
            this._stateScriptDataDoubleEscaped(e);
            break;
        case na.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:
            this._stateScriptDataDoubleEscapedDash(e);
            break;
        case na.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:
            this._stateScriptDataDoubleEscapedDashDash(e);
            break;
        case na.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:
            this._stateScriptDataDoubleEscapedLessThanSign(e);
            break;
        case na.SCRIPT_DATA_DOUBLE_ESCAPE_END:
            this._stateScriptDataDoubleEscapeEnd(e);
            break;
        case na.BEFORE_ATTRIBUTE_NAME:
            this._stateBeforeAttributeName(e);
            break;
        case na.ATTRIBUTE_NAME:
            this._stateAttributeName(e);
            break;
        case na.AFTER_ATTRIBUTE_NAME:
            this._stateAfterAttributeName(e);
            break;
        case na.BEFORE_ATTRIBUTE_VALUE:
            this._stateBeforeAttributeValue(e);
            break;
        case na.ATTRIBUTE_VALUE_DOUBLE_QUOTED:
            this._stateAttributeValueDoubleQuoted(e);
            break;
        case na.ATTRIBUTE_VALUE_SINGLE_QUOTED:
            this._stateAttributeValueSingleQuoted(e);
            break;
        case na.ATTRIBUTE_VALUE_UNQUOTED:
            this._stateAttributeValueUnquoted(e);
            break;
        case na.AFTER_ATTRIBUTE_VALUE_QUOTED:
            this._stateAfterAttributeValueQuoted(e);
            break;
        case na.SELF_CLOSING_START_TAG:
            this._stateSelfClosingStartTag(e);
            break;
        case na.BOGUS_COMMENT:
            this._stateBogusComment(e);
            break;
        case na.MARKUP_DECLARATION_OPEN:
            this._stateMarkupDeclarationOpen(e);
            break;
        case na.COMMENT_START:
            this._stateCommentStart(e);
            break;
        case na.COMMENT_START_DASH:
            this._stateCommentStartDash(e);
            break;
        case na.COMMENT:
            this._stateComment(e);
            break;
        case na.COMMENT_LESS_THAN_SIGN:
            this._stateCommentLessThanSign(e);
            break;
        case na.COMMENT_LESS_THAN_SIGN_BANG:
            this._stateCommentLessThanSignBang(e);
            break;
        case na.COMMENT_LESS_THAN_SIGN_BANG_DASH:
            this._stateCommentLessThanSignBangDash(e);
            break;
        case na.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:
            this._stateCommentLessThanSignBangDashDash(e);
            break;
        case na.COMMENT_END_DASH:
            this._stateCommentEndDash(e);
            break;
        case na.COMMENT_END:
            this._stateCommentEnd(e);
            break;
        case na.COMMENT_END_BANG:
            this._stateCommentEndBang(e);
            break;
        case na.DOCTYPE:
            this._stateDoctype(e);
            break;
        case na.BEFORE_DOCTYPE_NAME:
            this._stateBeforeDoctypeName(e);
            break;
        case na.DOCTYPE_NAME:
            this._stateDoctypeName(e);
            break;
        case na.AFTER_DOCTYPE_NAME:
            this._stateAfterDoctypeName(e);
            break;
        case na.AFTER_DOCTYPE_PUBLIC_KEYWORD:
            this._stateAfterDoctypePublicKeyword(e);
            break;
        case na.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:
            this._stateBeforeDoctypePublicIdentifier(e);
            break;
        case na.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:
            this._stateDoctypePublicIdentifierDoubleQuoted(e);
            break;
        case na.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:
            this._stateDoctypePublicIdentifierSingleQuoted(e);
            break;
        case na.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:
            this._stateAfterDoctypePublicIdentifier(e);
            break;
        case na.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:
            this._stateBetweenDoctypePublicAndSystemIdentifiers(e);
            break;
        case na.AFTER_DOCTYPE_SYSTEM_KEYWORD:
            this._stateAfterDoctypeSystemKeyword(e);
            break;
        case na.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:
            this._stateBeforeDoctypeSystemIdentifier(e);
            break;
        case na.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:
            this._stateDoctypeSystemIdentifierDoubleQuoted(e);
            break;
        case na.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:
            this._stateDoctypeSystemIdentifierSingleQuoted(e);
            break;
        case na.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:
            this._stateAfterDoctypeSystemIdentifier(e);
            break;
        case na.BOGUS_DOCTYPE:
            this._stateBogusDoctype(e);
            break;
        case na.CDATA_SECTION:
            this._stateCdataSection(e);
            break;
        case na.CDATA_SECTION_BRACKET:
            this._stateCdataSectionBracket(e);
            break;
        case na.CDATA_SECTION_END:
            this._stateCdataSectionEnd(e);
            break;
        case na.CHARACTER_REFERENCE:
            this._stateCharacterReference();
            break;
        case na.AMBIGUOUS_AMPERSAND:
            this._stateAmbiguousAmpersand(e);
            break;
        default:
            throw new Error("Unknown state")
        }
    }
    _stateData(e) {
        switch (e) {
        case co.LESS_THAN_SIGN:
            this.state = na.TAG_OPEN;
            break;
        case co.AMPERSAND:
            this._startCharacterReference();
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this._emitCodePoint(e);
            break;
        case co.EOF:
            this._emitEOFToken();
            break;
        default:
            this._emitCodePoint(e)
        }
    }
    _stateRcdata(e) {
        switch (e) {
        case co.AMPERSAND:
            this._startCharacterReference();
            break;
        case co.LESS_THAN_SIGN:
            this.state = na.RCDATA_LESS_THAN_SIGN;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this._emitChars(ao);
            break;
        case co.EOF:
            this._emitEOFToken();
            break;
        default:
            this._emitCodePoint(e)
        }
    }
    _stateRawtext(e) {
        switch (e) {
        case co.LESS_THAN_SIGN:
            this.state = na.RAWTEXT_LESS_THAN_SIGN;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this._emitChars(ao);
            break;
        case co.EOF:
            this._emitEOFToken();
            break;
        default:
            this._emitCodePoint(e)
        }
    }
    _stateScriptData(e) {
        switch (e) {
        case co.LESS_THAN_SIGN:
            this.state = na.SCRIPT_DATA_LESS_THAN_SIGN;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this._emitChars(ao);
            break;
        case co.EOF:
            this._emitEOFToken();
            break;
        default:
            this._emitCodePoint(e)
        }
    }
    _statePlaintext(e) {
        switch (e) {
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this._emitChars(ao);
            break;
        case co.EOF:
            this._emitEOFToken();
            break;
        default:
            this._emitCodePoint(e)
        }
    }
    _stateTagOpen(e) {
        if (oa(e))
            this._createStartTagToken(),
            this.state = na.TAG_NAME,
            this._stateTagName(e);
        else
            switch (e) {
            case co.EXCLAMATION_MARK:
                this.state = na.MARKUP_DECLARATION_OPEN;
                break;
            case co.SOLIDUS:
                this.state = na.END_TAG_OPEN;
                break;
            case co.QUESTION_MARK:
                this._err(_o.unexpectedQuestionMarkInsteadOfTagName),
                this._createCommentToken(1),
                this.state = na.BOGUS_COMMENT,
                this._stateBogusComment(e);
                break;
            case co.EOF:
                this._err(_o.eofBeforeTagName),
                this._emitChars("<"),
                this._emitEOFToken();
                break;
            default:
                this._err(_o.invalidFirstCharacterOfTagName),
                this._emitChars("<"),
                this.state = na.DATA,
                this._stateData(e)
            }
    }
    _stateEndTagOpen(e) {
        if (oa(e))
            this._createEndTagToken(),
            this.state = na.TAG_NAME,
            this._stateTagName(e);
        else
            switch (e) {
            case co.GREATER_THAN_SIGN:
                this._err(_o.missingEndTagName),
                this.state = na.DATA;
                break;
            case co.EOF:
                this._err(_o.eofBeforeTagName),
                this._emitChars("</"),
                this._emitEOFToken();
                break;
            default:
                this._err(_o.invalidFirstCharacterOfTagName),
                this._createCommentToken(2),
                this.state = na.BOGUS_COMMENT,
                this._stateBogusComment(e)
            }
    }
    _stateTagName(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            this.state = na.BEFORE_ATTRIBUTE_NAME;
            break;
        case co.SOLIDUS:
            this.state = na.SELF_CLOSING_START_TAG;
            break;
        case co.GREATER_THAN_SIGN:
            this.state = na.DATA,
            this.emitCurrentTagToken();
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            t.tagName += ao;
            break;
        case co.EOF:
            this._err(_o.eofInTag),
            this._emitEOFToken();
            break;
        default:
            t.tagName += String.fromCodePoint(sa(e) ? ca(e) : e)
        }
    }
    _stateRcdataLessThanSign(e) {
        e === co.SOLIDUS ? this.state = na.RCDATA_END_TAG_OPEN : (this._emitChars("<"),
        this.state = na.RCDATA,
        this._stateRcdata(e))
    }
    _stateRcdataEndTagOpen(e) {
        oa(e) ? (this.state = na.RCDATA_END_TAG_NAME,
        this._stateRcdataEndTagName(e)) : (this._emitChars("</"),
        this.state = na.RCDATA,
        this._stateRcdata(e))
    }
    handleSpecialEndTag(e) {
        if (!this.preprocessor.startsWith(this.lastStartTagName, !1))
            return !this._ensureHibernation();
        this._createEndTagToken();
        this.currentToken.tagName = this.lastStartTagName;
        switch (this.preprocessor.peek(this.lastStartTagName.length)) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            return this._advanceBy(this.lastStartTagName.length),
            this.state = na.BEFORE_ATTRIBUTE_NAME,
            !1;
        case co.SOLIDUS:
            return this._advanceBy(this.lastStartTagName.length),
            this.state = na.SELF_CLOSING_START_TAG,
            !1;
        case co.GREATER_THAN_SIGN:
            return this._advanceBy(this.lastStartTagName.length),
            this.emitCurrentTagToken(),
            this.state = na.DATA,
            !1;
        default:
            return !this._ensureHibernation()
        }
    }
    _stateRcdataEndTagName(e) {
        this.handleSpecialEndTag(e) && (this._emitChars("</"),
        this.state = na.RCDATA,
        this._stateRcdata(e))
    }
    _stateRawtextLessThanSign(e) {
        e === co.SOLIDUS ? this.state = na.RAWTEXT_END_TAG_OPEN : (this._emitChars("<"),
        this.state = na.RAWTEXT,
        this._stateRawtext(e))
    }
    _stateRawtextEndTagOpen(e) {
        oa(e) ? (this.state = na.RAWTEXT_END_TAG_NAME,
        this._stateRawtextEndTagName(e)) : (this._emitChars("</"),
        this.state = na.RAWTEXT,
        this._stateRawtext(e))
    }
    _stateRawtextEndTagName(e) {
        this.handleSpecialEndTag(e) && (this._emitChars("</"),
        this.state = na.RAWTEXT,
        this._stateRawtext(e))
    }
    _stateScriptDataLessThanSign(e) {
        switch (e) {
        case co.SOLIDUS:
            this.state = na.SCRIPT_DATA_END_TAG_OPEN;
            break;
        case co.EXCLAMATION_MARK:
            this.state = na.SCRIPT_DATA_ESCAPE_START,
            this._emitChars("<!");
            break;
        default:
            this._emitChars("<"),
            this.state = na.SCRIPT_DATA,
            this._stateScriptData(e)
        }
    }
    _stateScriptDataEndTagOpen(e) {
        oa(e) ? (this.state = na.SCRIPT_DATA_END_TAG_NAME,
        this._stateScriptDataEndTagName(e)) : (this._emitChars("</"),
        this.state = na.SCRIPT_DATA,
        this._stateScriptData(e))
    }
    _stateScriptDataEndTagName(e) {
        this.handleSpecialEndTag(e) && (this._emitChars("</"),
        this.state = na.SCRIPT_DATA,
        this._stateScriptData(e))
    }
    _stateScriptDataEscapeStart(e) {
        e === co.HYPHEN_MINUS ? (this.state = na.SCRIPT_DATA_ESCAPE_START_DASH,
        this._emitChars("-")) : (this.state = na.SCRIPT_DATA,
        this._stateScriptData(e))
    }
    _stateScriptDataEscapeStartDash(e) {
        e === co.HYPHEN_MINUS ? (this.state = na.SCRIPT_DATA_ESCAPED_DASH_DASH,
        this._emitChars("-")) : (this.state = na.SCRIPT_DATA,
        this._stateScriptData(e))
    }
    _stateScriptDataEscaped(e) {
        switch (e) {
        case co.HYPHEN_MINUS:
            this.state = na.SCRIPT_DATA_ESCAPED_DASH,
            this._emitChars("-");
            break;
        case co.LESS_THAN_SIGN:
            this.state = na.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this._emitChars(ao);
            break;
        case co.EOF:
            this._err(_o.eofInScriptHtmlCommentLikeText),
            this._emitEOFToken();
            break;
        default:
            this._emitCodePoint(e)
        }
    }
    _stateScriptDataEscapedDash(e) {
        switch (e) {
        case co.HYPHEN_MINUS:
            this.state = na.SCRIPT_DATA_ESCAPED_DASH_DASH,
            this._emitChars("-");
            break;
        case co.LESS_THAN_SIGN:
            this.state = na.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this.state = na.SCRIPT_DATA_ESCAPED,
            this._emitChars(ao);
            break;
        case co.EOF:
            this._err(_o.eofInScriptHtmlCommentLikeText),
            this._emitEOFToken();
            break;
        default:
            this.state = na.SCRIPT_DATA_ESCAPED,
            this._emitCodePoint(e)
        }
    }
    _stateScriptDataEscapedDashDash(e) {
        switch (e) {
        case co.HYPHEN_MINUS:
            this._emitChars("-");
            break;
        case co.LESS_THAN_SIGN:
            this.state = na.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
            break;
        case co.GREATER_THAN_SIGN:
            this.state = na.SCRIPT_DATA,
            this._emitChars(">");
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this.state = na.SCRIPT_DATA_ESCAPED,
            this._emitChars(ao);
            break;
        case co.EOF:
            this._err(_o.eofInScriptHtmlCommentLikeText),
            this._emitEOFToken();
            break;
        default:
            this.state = na.SCRIPT_DATA_ESCAPED,
            this._emitCodePoint(e)
        }
    }
    _stateScriptDataEscapedLessThanSign(e) {
        e === co.SOLIDUS ? this.state = na.SCRIPT_DATA_ESCAPED_END_TAG_OPEN : oa(e) ? (this._emitChars("<"),
        this.state = na.SCRIPT_DATA_DOUBLE_ESCAPE_START,
        this._stateScriptDataDoubleEscapeStart(e)) : (this._emitChars("<"),
        this.state = na.SCRIPT_DATA_ESCAPED,
        this._stateScriptDataEscaped(e))
    }
    _stateScriptDataEscapedEndTagOpen(e) {
        oa(e) ? (this.state = na.SCRIPT_DATA_ESCAPED_END_TAG_NAME,
        this._stateScriptDataEscapedEndTagName(e)) : (this._emitChars("</"),
        this.state = na.SCRIPT_DATA_ESCAPED,
        this._stateScriptDataEscaped(e))
    }
    _stateScriptDataEscapedEndTagName(e) {
        this.handleSpecialEndTag(e) && (this._emitChars("</"),
        this.state = na.SCRIPT_DATA_ESCAPED,
        this._stateScriptDataEscaped(e))
    }
    _stateScriptDataDoubleEscapeStart(e) {
        if (this.preprocessor.startsWith(fo, !1) && ua(this.preprocessor.peek(fo.length))) {
            this._emitCodePoint(e);
            for (let e = 0; e < fo.length; e++)
                this._emitCodePoint(this._consume());
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED
        } else
            this._ensureHibernation() || (this.state = na.SCRIPT_DATA_ESCAPED,
            this._stateScriptDataEscaped(e))
    }
    _stateScriptDataDoubleEscaped(e) {
        switch (e) {
        case co.HYPHEN_MINUS:
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED_DASH,
            this._emitChars("-");
            break;
        case co.LESS_THAN_SIGN:
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,
            this._emitChars("<");
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this._emitChars(ao);
            break;
        case co.EOF:
            this._err(_o.eofInScriptHtmlCommentLikeText),
            this._emitEOFToken();
            break;
        default:
            this._emitCodePoint(e)
        }
    }
    _stateScriptDataDoubleEscapedDash(e) {
        switch (e) {
        case co.HYPHEN_MINUS:
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH,
            this._emitChars("-");
            break;
        case co.LESS_THAN_SIGN:
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,
            this._emitChars("<");
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED,
            this._emitChars(ao);
            break;
        case co.EOF:
            this._err(_o.eofInScriptHtmlCommentLikeText),
            this._emitEOFToken();
            break;
        default:
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED,
            this._emitCodePoint(e)
        }
    }
    _stateScriptDataDoubleEscapedDashDash(e) {
        switch (e) {
        case co.HYPHEN_MINUS:
            this._emitChars("-");
            break;
        case co.LESS_THAN_SIGN:
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,
            this._emitChars("<");
            break;
        case co.GREATER_THAN_SIGN:
            this.state = na.SCRIPT_DATA,
            this._emitChars(">");
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED,
            this._emitChars(ao);
            break;
        case co.EOF:
            this._err(_o.eofInScriptHtmlCommentLikeText),
            this._emitEOFToken();
            break;
        default:
            this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED,
            this._emitCodePoint(e)
        }
    }
    _stateScriptDataDoubleEscapedLessThanSign(e) {
        e === co.SOLIDUS ? (this.state = na.SCRIPT_DATA_DOUBLE_ESCAPE_END,
        this._emitChars("/")) : (this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED,
        this._stateScriptDataDoubleEscaped(e))
    }
    _stateScriptDataDoubleEscapeEnd(e) {
        if (this.preprocessor.startsWith(fo, !1) && ua(this.preprocessor.peek(fo.length))) {
            this._emitCodePoint(e);
            for (let e = 0; e < fo.length; e++)
                this._emitCodePoint(this._consume());
            this.state = na.SCRIPT_DATA_ESCAPED
        } else
            this._ensureHibernation() || (this.state = na.SCRIPT_DATA_DOUBLE_ESCAPED,
            this._stateScriptDataDoubleEscaped(e))
    }
    _stateBeforeAttributeName(e) {
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            break;
        case co.SOLIDUS:
        case co.GREATER_THAN_SIGN:
        case co.EOF:
            this.state = na.AFTER_ATTRIBUTE_NAME,
            this._stateAfterAttributeName(e);
            break;
        case co.EQUALS_SIGN:
            this._err(_o.unexpectedEqualsSignBeforeAttributeName),
            this._createAttr("="),
            this.state = na.ATTRIBUTE_NAME;
            break;
        default:
            this._createAttr(""),
            this.state = na.ATTRIBUTE_NAME,
            this._stateAttributeName(e)
        }
    }
    _stateAttributeName(e) {
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
        case co.SOLIDUS:
        case co.GREATER_THAN_SIGN:
        case co.EOF:
            this._leaveAttrName(),
            this.state = na.AFTER_ATTRIBUTE_NAME,
            this._stateAfterAttributeName(e);
            break;
        case co.EQUALS_SIGN:
            this._leaveAttrName(),
            this.state = na.BEFORE_ATTRIBUTE_VALUE;
            break;
        case co.QUOTATION_MARK:
        case co.APOSTROPHE:
        case co.LESS_THAN_SIGN:
            this._err(_o.unexpectedCharacterInAttributeName),
            this.currentAttr.name += String.fromCodePoint(e);
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this.currentAttr.name += ao;
            break;
        default:
            this.currentAttr.name += String.fromCodePoint(sa(e) ? ca(e) : e)
        }
    }
    _stateAfterAttributeName(e) {
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            break;
        case co.SOLIDUS:
            this.state = na.SELF_CLOSING_START_TAG;
            break;
        case co.EQUALS_SIGN:
            this.state = na.BEFORE_ATTRIBUTE_VALUE;
            break;
        case co.GREATER_THAN_SIGN:
            this.state = na.DATA,
            this.emitCurrentTagToken();
            break;
        case co.EOF:
            this._err(_o.eofInTag),
            this._emitEOFToken();
            break;
        default:
            this._createAttr(""),
            this.state = na.ATTRIBUTE_NAME,
            this._stateAttributeName(e)
        }
    }
    _stateBeforeAttributeValue(e) {
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            break;
        case co.QUOTATION_MARK:
            this.state = na.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
            break;
        case co.APOSTROPHE:
            this.state = na.ATTRIBUTE_VALUE_SINGLE_QUOTED;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.missingAttributeValue),
            this.state = na.DATA,
            this.emitCurrentTagToken();
            break;
        default:
            this.state = na.ATTRIBUTE_VALUE_UNQUOTED,
            this._stateAttributeValueUnquoted(e)
        }
    }
    _stateAttributeValueDoubleQuoted(e) {
        switch (e) {
        case co.QUOTATION_MARK:
            this.state = na.AFTER_ATTRIBUTE_VALUE_QUOTED;
            break;
        case co.AMPERSAND:
            this._startCharacterReference();
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this.currentAttr.value += ao;
            break;
        case co.EOF:
            this._err(_o.eofInTag),
            this._emitEOFToken();
            break;
        default:
            this.currentAttr.value += String.fromCodePoint(e)
        }
    }
    _stateAttributeValueSingleQuoted(e) {
        switch (e) {
        case co.APOSTROPHE:
            this.state = na.AFTER_ATTRIBUTE_VALUE_QUOTED;
            break;
        case co.AMPERSAND:
            this._startCharacterReference();
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this.currentAttr.value += ao;
            break;
        case co.EOF:
            this._err(_o.eofInTag),
            this._emitEOFToken();
            break;
        default:
            this.currentAttr.value += String.fromCodePoint(e)
        }
    }
    _stateAttributeValueUnquoted(e) {
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            this._leaveAttrValue(),
            this.state = na.BEFORE_ATTRIBUTE_NAME;
            break;
        case co.AMPERSAND:
            this._startCharacterReference();
            break;
        case co.GREATER_THAN_SIGN:
            this._leaveAttrValue(),
            this.state = na.DATA,
            this.emitCurrentTagToken();
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            this.currentAttr.value += ao;
            break;
        case co.QUOTATION_MARK:
        case co.APOSTROPHE:
        case co.LESS_THAN_SIGN:
        case co.EQUALS_SIGN:
        case co.GRAVE_ACCENT:
            this._err(_o.unexpectedCharacterInUnquotedAttributeValue),
            this.currentAttr.value += String.fromCodePoint(e);
            break;
        case co.EOF:
            this._err(_o.eofInTag),
            this._emitEOFToken();
            break;
        default:
            this.currentAttr.value += String.fromCodePoint(e)
        }
    }
    _stateAfterAttributeValueQuoted(e) {
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            this._leaveAttrValue(),
            this.state = na.BEFORE_ATTRIBUTE_NAME;
            break;
        case co.SOLIDUS:
            this._leaveAttrValue(),
            this.state = na.SELF_CLOSING_START_TAG;
            break;
        case co.GREATER_THAN_SIGN:
            this._leaveAttrValue(),
            this.state = na.DATA,
            this.emitCurrentTagToken();
            break;
        case co.EOF:
            this._err(_o.eofInTag),
            this._emitEOFToken();
            break;
        default:
            this._err(_o.missingWhitespaceBetweenAttributes),
            this.state = na.BEFORE_ATTRIBUTE_NAME,
            this._stateBeforeAttributeName(e)
        }
    }
    _stateSelfClosingStartTag(e) {
        switch (e) {
        case co.GREATER_THAN_SIGN:
            this.currentToken.selfClosing = !0,
            this.state = na.DATA,
            this.emitCurrentTagToken();
            break;
        case co.EOF:
            this._err(_o.eofInTag),
            this._emitEOFToken();
            break;
        default:
            this._err(_o.unexpectedSolidusInTag),
            this.state = na.BEFORE_ATTRIBUTE_NAME,
            this._stateBeforeAttributeName(e)
        }
    }
    _stateBogusComment(e) {
        const t = this.currentToken;
        switch (e) {
        case co.GREATER_THAN_SIGN:
            this.state = na.DATA,
            this.emitCurrentComment(t);
            break;
        case co.EOF:
            this.emitCurrentComment(t),
            this._emitEOFToken();
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            t.data += ao;
            break;
        default:
            t.data += String.fromCodePoint(e)
        }
    }
    _stateMarkupDeclarationOpen(e) {
        this._consumeSequenceIfMatch(uo, !0) ? (this._createCommentToken(uo.length + 1),
        this.state = na.COMMENT_START) : this._consumeSequenceIfMatch(po, !1) ? (this.currentLocation = this.getCurrentLocation(po.length + 1),
        this.state = na.DOCTYPE) : this._consumeSequenceIfMatch(ho, !0) ? this.inForeignNode ? this.state = na.CDATA_SECTION : (this._err(_o.cdataInHtmlContent),
        this._createCommentToken(ho.length + 1),
        this.currentToken.data = "[CDATA[",
        this.state = na.BOGUS_COMMENT) : this._ensureHibernation() || (this._err(_o.incorrectlyOpenedComment),
        this._createCommentToken(2),
        this.state = na.BOGUS_COMMENT,
        this._stateBogusComment(e))
    }
    _stateCommentStart(e) {
        switch (e) {
        case co.HYPHEN_MINUS:
            this.state = na.COMMENT_START_DASH;
            break;
        case co.GREATER_THAN_SIGN:
            {
                this._err(_o.abruptClosingOfEmptyComment),
                this.state = na.DATA;
                const e = this.currentToken;
                this.emitCurrentComment(e);
                break
            }
        default:
            this.state = na.COMMENT,
            this._stateComment(e)
        }
    }
    _stateCommentStartDash(e) {
        const t = this.currentToken;
        switch (e) {
        case co.HYPHEN_MINUS:
            this.state = na.COMMENT_END;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.abruptClosingOfEmptyComment),
            this.state = na.DATA,
            this.emitCurrentComment(t);
            break;
        case co.EOF:
            this._err(_o.eofInComment),
            this.emitCurrentComment(t),
            this._emitEOFToken();
            break;
        default:
            t.data += "-",
            this.state = na.COMMENT,
            this._stateComment(e)
        }
    }
    _stateComment(e) {
        const t = this.currentToken;
        switch (e) {
        case co.HYPHEN_MINUS:
            this.state = na.COMMENT_END_DASH;
            break;
        case co.LESS_THAN_SIGN:
            t.data += "<",
            this.state = na.COMMENT_LESS_THAN_SIGN;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            t.data += ao;
            break;
        case co.EOF:
            this._err(_o.eofInComment),
            this.emitCurrentComment(t),
            this._emitEOFToken();
            break;
        default:
            t.data += String.fromCodePoint(e)
        }
    }
    _stateCommentLessThanSign(e) {
        const t = this.currentToken;
        switch (e) {
        case co.EXCLAMATION_MARK:
            t.data += "!",
            this.state = na.COMMENT_LESS_THAN_SIGN_BANG;
            break;
        case co.LESS_THAN_SIGN:
            t.data += "<";
            break;
        default:
            this.state = na.COMMENT,
            this._stateComment(e)
        }
    }
    _stateCommentLessThanSignBang(e) {
        e === co.HYPHEN_MINUS ? this.state = na.COMMENT_LESS_THAN_SIGN_BANG_DASH : (this.state = na.COMMENT,
        this._stateComment(e))
    }
    _stateCommentLessThanSignBangDash(e) {
        e === co.HYPHEN_MINUS ? this.state = na.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH : (this.state = na.COMMENT_END_DASH,
        this._stateCommentEndDash(e))
    }
    _stateCommentLessThanSignBangDashDash(e) {
        e !== co.GREATER_THAN_SIGN && e !== co.EOF && this._err(_o.nestedComment),
        this.state = na.COMMENT_END,
        this._stateCommentEnd(e)
    }
    _stateCommentEndDash(e) {
        const t = this.currentToken;
        switch (e) {
        case co.HYPHEN_MINUS:
            this.state = na.COMMENT_END;
            break;
        case co.EOF:
            this._err(_o.eofInComment),
            this.emitCurrentComment(t),
            this._emitEOFToken();
            break;
        default:
            t.data += "-",
            this.state = na.COMMENT,
            this._stateComment(e)
        }
    }
    _stateCommentEnd(e) {
        const t = this.currentToken;
        switch (e) {
        case co.GREATER_THAN_SIGN:
            this.state = na.DATA,
            this.emitCurrentComment(t);
            break;
        case co.EXCLAMATION_MARK:
            this.state = na.COMMENT_END_BANG;
            break;
        case co.HYPHEN_MINUS:
            t.data += "-";
            break;
        case co.EOF:
            this._err(_o.eofInComment),
            this.emitCurrentComment(t),
            this._emitEOFToken();
            break;
        default:
            t.data += "--",
            this.state = na.COMMENT,
            this._stateComment(e)
        }
    }
    _stateCommentEndBang(e) {
        const t = this.currentToken;
        switch (e) {
        case co.HYPHEN_MINUS:
            t.data += "--!",
            this.state = na.COMMENT_END_DASH;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.incorrectlyClosedComment),
            this.state = na.DATA,
            this.emitCurrentComment(t);
            break;
        case co.EOF:
            this._err(_o.eofInComment),
            this.emitCurrentComment(t),
            this._emitEOFToken();
            break;
        default:
            t.data += "--!",
            this.state = na.COMMENT,
            this._stateComment(e)
        }
    }
    _stateDoctype(e) {
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            this.state = na.BEFORE_DOCTYPE_NAME;
            break;
        case co.GREATER_THAN_SIGN:
            this.state = na.BEFORE_DOCTYPE_NAME,
            this._stateBeforeDoctypeName(e);
            break;
        case co.EOF:
            {
                this._err(_o.eofInDoctype),
                this._createDoctypeToken(null);
                const e = this.currentToken;
                e.forceQuirks = !0,
                this.emitCurrentDoctype(e),
                this._emitEOFToken();
                break
            }
        default:
            this._err(_o.missingWhitespaceBeforeDoctypeName),
            this.state = na.BEFORE_DOCTYPE_NAME,
            this._stateBeforeDoctypeName(e)
        }
    }
    _stateBeforeDoctypeName(e) {
        if (sa(e))
            this._createDoctypeToken(String.fromCharCode(ca(e))),
            this.state = na.DOCTYPE_NAME;
        else
            switch (e) {
            case co.SPACE:
            case co.LINE_FEED:
            case co.TABULATION:
            case co.FORM_FEED:
                break;
            case co.NULL:
                this._err(_o.unexpectedNullCharacter),
                this._createDoctypeToken(ao),
                this.state = na.DOCTYPE_NAME;
                break;
            case co.GREATER_THAN_SIGN:
                {
                    this._err(_o.missingDoctypeName),
                    this._createDoctypeToken(null);
                    const e = this.currentToken;
                    e.forceQuirks = !0,
                    this.emitCurrentDoctype(e),
                    this.state = na.DATA;
                    break
                }
            case co.EOF:
                {
                    this._err(_o.eofInDoctype),
                    this._createDoctypeToken(null);
                    const e = this.currentToken;
                    e.forceQuirks = !0,
                    this.emitCurrentDoctype(e),
                    this._emitEOFToken();
                    break
                }
            default:
                this._createDoctypeToken(String.fromCodePoint(e)),
                this.state = na.DOCTYPE_NAME
            }
    }
    _stateDoctypeName(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            this.state = na.AFTER_DOCTYPE_NAME;
            break;
        case co.GREATER_THAN_SIGN:
            this.state = na.DATA,
            this.emitCurrentDoctype(t);
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            t.name += ao;
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            t.name += String.fromCodePoint(sa(e) ? ca(e) : e)
        }
    }
    _stateAfterDoctypeName(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            break;
        case co.GREATER_THAN_SIGN:
            this.state = na.DATA,
            this.emitCurrentDoctype(t);
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            this._consumeSequenceIfMatch(mo, !1) ? this.state = na.AFTER_DOCTYPE_PUBLIC_KEYWORD : this._consumeSequenceIfMatch(Eo, !1) ? this.state = na.AFTER_DOCTYPE_SYSTEM_KEYWORD : this._ensureHibernation() || (this._err(_o.invalidCharacterSequenceAfterDoctypeName),
            t.forceQuirks = !0,
            this.state = na.BOGUS_DOCTYPE,
            this._stateBogusDoctype(e))
        }
    }
    _stateAfterDoctypePublicKeyword(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            this.state = na.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
            break;
        case co.QUOTATION_MARK:
            this._err(_o.missingWhitespaceAfterDoctypePublicKeyword),
            t.publicId = "",
            this.state = na.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
            break;
        case co.APOSTROPHE:
            this._err(_o.missingWhitespaceAfterDoctypePublicKeyword),
            t.publicId = "",
            this.state = na.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.missingDoctypePublicIdentifier),
            t.forceQuirks = !0,
            this.state = na.DATA,
            this.emitCurrentDoctype(t);
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            this._err(_o.missingQuoteBeforeDoctypePublicIdentifier),
            t.forceQuirks = !0,
            this.state = na.BOGUS_DOCTYPE,
            this._stateBogusDoctype(e)
        }
    }
    _stateBeforeDoctypePublicIdentifier(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            break;
        case co.QUOTATION_MARK:
            t.publicId = "",
            this.state = na.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
            break;
        case co.APOSTROPHE:
            t.publicId = "",
            this.state = na.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.missingDoctypePublicIdentifier),
            t.forceQuirks = !0,
            this.state = na.DATA,
            this.emitCurrentDoctype(t);
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            this._err(_o.missingQuoteBeforeDoctypePublicIdentifier),
            t.forceQuirks = !0,
            this.state = na.BOGUS_DOCTYPE,
            this._stateBogusDoctype(e)
        }
    }
    _stateDoctypePublicIdentifierDoubleQuoted(e) {
        const t = this.currentToken;
        switch (e) {
        case co.QUOTATION_MARK:
            this.state = na.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            t.publicId += ao;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.abruptDoctypePublicIdentifier),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this.state = na.DATA;
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            t.publicId += String.fromCodePoint(e)
        }
    }
    _stateDoctypePublicIdentifierSingleQuoted(e) {
        const t = this.currentToken;
        switch (e) {
        case co.APOSTROPHE:
            this.state = na.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            t.publicId += ao;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.abruptDoctypePublicIdentifier),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this.state = na.DATA;
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            t.publicId += String.fromCodePoint(e)
        }
    }
    _stateAfterDoctypePublicIdentifier(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            this.state = na.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
            break;
        case co.GREATER_THAN_SIGN:
            this.state = na.DATA,
            this.emitCurrentDoctype(t);
            break;
        case co.QUOTATION_MARK:
            this._err(_o.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),
            t.systemId = "",
            this.state = na.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
            break;
        case co.APOSTROPHE:
            this._err(_o.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),
            t.systemId = "",
            this.state = na.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            this._err(_o.missingQuoteBeforeDoctypeSystemIdentifier),
            t.forceQuirks = !0,
            this.state = na.BOGUS_DOCTYPE,
            this._stateBogusDoctype(e)
        }
    }
    _stateBetweenDoctypePublicAndSystemIdentifiers(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            break;
        case co.GREATER_THAN_SIGN:
            this.emitCurrentDoctype(t),
            this.state = na.DATA;
            break;
        case co.QUOTATION_MARK:
            t.systemId = "",
            this.state = na.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
            break;
        case co.APOSTROPHE:
            t.systemId = "",
            this.state = na.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            this._err(_o.missingQuoteBeforeDoctypeSystemIdentifier),
            t.forceQuirks = !0,
            this.state = na.BOGUS_DOCTYPE,
            this._stateBogusDoctype(e)
        }
    }
    _stateAfterDoctypeSystemKeyword(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            this.state = na.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
            break;
        case co.QUOTATION_MARK:
            this._err(_o.missingWhitespaceAfterDoctypeSystemKeyword),
            t.systemId = "",
            this.state = na.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
            break;
        case co.APOSTROPHE:
            this._err(_o.missingWhitespaceAfterDoctypeSystemKeyword),
            t.systemId = "",
            this.state = na.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.missingDoctypeSystemIdentifier),
            t.forceQuirks = !0,
            this.state = na.DATA,
            this.emitCurrentDoctype(t);
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            this._err(_o.missingQuoteBeforeDoctypeSystemIdentifier),
            t.forceQuirks = !0,
            this.state = na.BOGUS_DOCTYPE,
            this._stateBogusDoctype(e)
        }
    }
    _stateBeforeDoctypeSystemIdentifier(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            break;
        case co.QUOTATION_MARK:
            t.systemId = "",
            this.state = na.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
            break;
        case co.APOSTROPHE:
            t.systemId = "",
            this.state = na.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.missingDoctypeSystemIdentifier),
            t.forceQuirks = !0,
            this.state = na.DATA,
            this.emitCurrentDoctype(t);
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            this._err(_o.missingQuoteBeforeDoctypeSystemIdentifier),
            t.forceQuirks = !0,
            this.state = na.BOGUS_DOCTYPE,
            this._stateBogusDoctype(e)
        }
    }
    _stateDoctypeSystemIdentifierDoubleQuoted(e) {
        const t = this.currentToken;
        switch (e) {
        case co.QUOTATION_MARK:
            this.state = na.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            t.systemId += ao;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.abruptDoctypeSystemIdentifier),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this.state = na.DATA;
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            t.systemId += String.fromCodePoint(e)
        }
    }
    _stateDoctypeSystemIdentifierSingleQuoted(e) {
        const t = this.currentToken;
        switch (e) {
        case co.APOSTROPHE:
            this.state = na.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter),
            t.systemId += ao;
            break;
        case co.GREATER_THAN_SIGN:
            this._err(_o.abruptDoctypeSystemIdentifier),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this.state = na.DATA;
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            t.systemId += String.fromCodePoint(e)
        }
    }
    _stateAfterDoctypeSystemIdentifier(e) {
        const t = this.currentToken;
        switch (e) {
        case co.SPACE:
        case co.LINE_FEED:
        case co.TABULATION:
        case co.FORM_FEED:
            break;
        case co.GREATER_THAN_SIGN:
            this.emitCurrentDoctype(t),
            this.state = na.DATA;
            break;
        case co.EOF:
            this._err(_o.eofInDoctype),
            t.forceQuirks = !0,
            this.emitCurrentDoctype(t),
            this._emitEOFToken();
            break;
        default:
            this._err(_o.unexpectedCharacterAfterDoctypeSystemIdentifier),
            this.state = na.BOGUS_DOCTYPE,
            this._stateBogusDoctype(e)
        }
    }
    _stateBogusDoctype(e) {
        const t = this.currentToken;
        switch (e) {
        case co.GREATER_THAN_SIGN:
            this.emitCurrentDoctype(t),
            this.state = na.DATA;
            break;
        case co.NULL:
            this._err(_o.unexpectedNullCharacter);
            break;
        case co.EOF:
            this.emitCurrentDoctype(t),
            this._emitEOFToken()
        }
    }
    _stateCdataSection(e) {
        switch (e) {
        case co.RIGHT_SQUARE_BRACKET:
            this.state = na.CDATA_SECTION_BRACKET;
            break;
        case co.EOF:
            this._err(_o.eofInCdata),
            this._emitEOFToken();
            break;
        default:
            this._emitCodePoint(e)
        }
    }
    _stateCdataSectionBracket(e) {
        e === co.RIGHT_SQUARE_BRACKET ? this.state = na.CDATA_SECTION_END : (this._emitChars("]"),
        this.state = na.CDATA_SECTION,
        this._stateCdataSection(e))
    }
    _stateCdataSectionEnd(e) {
        switch (e) {
        case co.GREATER_THAN_SIGN:
            this.state = na.DATA;
            break;
        case co.RIGHT_SQUARE_BRACKET:
            this._emitChars("]");
            break;
        default:
            this._emitChars("]]"),
            this.state = na.CDATA_SECTION,
            this._stateCdataSection(e)
        }
    }
    _stateCharacterReference() {
        let e = this.entityDecoder.write(this.preprocessor.html, this.preprocessor.pos);
        if (e < 0) {
            if (!this.preprocessor.lastChunkWritten)
                return this.active = !1,
                this.preprocessor.pos = this.preprocessor.html.length - 1,
                this.consumedAfterSnapshot = 0,
                void (this.preprocessor.endOfChunkHit = !0);
            e = this.entityDecoder.end()
        }
        0 === e ? (this.preprocessor.pos = this.entityStartPos,
        this._flushCodePointConsumedAsCharacterReference(co.AMPERSAND),
        this.state = !this._isCharacterReferenceInAttribute() && aa(this.preprocessor.peek(1)) ? na.AMBIGUOUS_AMPERSAND : this.returnState) : this.state = this.returnState
    }
    _stateAmbiguousAmpersand(e) {
        aa(e) ? this._flushCodePointConsumedAsCharacterReference(e) : (e === co.SEMICOLON && this._err(_o.unknownNamedCharacterReference),
        this.state = this.returnState,
        this._callState(e))
    }
}
const pa = new Set([qo.DD, qo.DT, qo.LI, qo.OPTGROUP, qo.OPTION, qo.P, qo.RB, qo.RP, qo.RT, qo.RTC])
  , da = new Set([...pa, qo.CAPTION, qo.COLGROUP, qo.TBODY, qo.TD, qo.TFOOT, qo.TH, qo.THEAD, qo.TR])
  , fa = new Set([qo.APPLET, qo.CAPTION, qo.HTML, qo.MARQUEE, qo.OBJECT, qo.TABLE, qo.TD, qo.TEMPLATE, qo.TH])
  , ma = new Set([...fa, qo.OL, qo.UL])
  , Ea = new Set([...fa, qo.BUTTON])
  , Ta = new Set([qo.ANNOTATION_XML, qo.MI, qo.MN, qo.MO, qo.MS, qo.MTEXT])
  , ga = new Set([qo.DESC, qo.FOREIGN_OBJECT, qo.TITLE])
  , Aa = new Set([qo.TR, qo.TEMPLATE, qo.HTML])
  , _a = new Set([qo.TBODY, qo.TFOOT, qo.THEAD, qo.TEMPLATE, qo.HTML])
  , Ia = new Set([qo.TABLE, qo.TEMPLATE, qo.HTML])
  , Na = new Set([qo.TD, qo.TH]);
class ka {
    get currentTmplContentOrNode() {
        return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current
    }
    constructor(e, t, n) {
        this.treeAdapter = t,
        this.handler = n,
        this.items = [],
        this.tagIDs = [],
        this.stackTop = -1,
        this.tmplCount = 0,
        this.currentTagId = qo.UNKNOWN,
        this.current = e
    }
    _indexOf(e) {
        return this.items.lastIndexOf(e, this.stackTop)
    }
    _isInTemplate() {
        return this.currentTagId === qo.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === wo.HTML
    }
    _updateCurrentElement() {
        this.current = this.items[this.stackTop],
        this.currentTagId = this.tagIDs[this.stackTop]
    }
    push(e, t) {
        this.stackTop++,
        this.items[this.stackTop] = e,
        this.current = e,
        this.tagIDs[this.stackTop] = t,
        this.currentTagId = t,
        this._isInTemplate() && this.tmplCount++,
        this.handler.onItemPush(e, t, !0)
    }
    pop() {
        const e = this.current;
        this.tmplCount > 0 && this._isInTemplate() && this.tmplCount--,
        this.stackTop--,
        this._updateCurrentElement(),
        this.handler.onItemPop(e, !0)
    }
    replace(e, t) {
        const n = this._indexOf(e);
        this.items[n] = t,
        n === this.stackTop && (this.current = t)
    }
    insertAfter(e, t, n) {
        const r = this._indexOf(e) + 1;
        this.items.splice(r, 0, t),
        this.tagIDs.splice(r, 0, n),
        this.stackTop++,
        r === this.stackTop && this._updateCurrentElement(),
        this.current && void 0 !== this.currentTagId && this.handler.onItemPush(this.current, this.currentTagId, r === this.stackTop)
    }
    popUntilTagNamePopped(e) {
        let t = this.stackTop + 1;
        do {
            t = this.tagIDs.lastIndexOf(e, t - 1)
        } while (t > 0 && this.treeAdapter.getNamespaceURI(this.items[t]) !== wo.HTML);
        this.shortenToLength(Math.max(t, 0))
    }
    shortenToLength(e) {
        for (; this.stackTop >= e; ) {
            const t = this.current;
            this.tmplCount > 0 && this._isInTemplate() && (this.tmplCount -= 1),
            this.stackTop--,
            this._updateCurrentElement(),
            this.handler.onItemPop(t, this.stackTop < e)
        }
    }
    popUntilElementPopped(e) {
        const t = this._indexOf(e);
        this.shortenToLength(Math.max(t, 0))
    }
    popUntilPopped(e, t) {
        const n = this._indexOfTagNames(e, t);
        this.shortenToLength(Math.max(n, 0))
    }
    popUntilNumberedHeaderPopped() {
        this.popUntilPopped(ta, wo.HTML)
    }
    popUntilTableCellPopped() {
        this.popUntilPopped(Na, wo.HTML)
    }
    popAllUpToHtmlElement() {
        this.tmplCount = 0,
        this.shortenToLength(1)
    }
    _indexOfTagNames(e, t) {
        for (let n = this.stackTop; n >= 0; n--)
            if (e.has(this.tagIDs[n]) && this.treeAdapter.getNamespaceURI(this.items[n]) === t)
                return n;
        return -1
    }
    clearBackTo(e, t) {
        const n = this._indexOfTagNames(e, t);
        this.shortenToLength(n + 1)
    }
    clearBackToTableContext() {
        this.clearBackTo(Ia, wo.HTML)
    }
    clearBackToTableBodyContext() {
        this.clearBackTo(_a, wo.HTML)
    }
    clearBackToTableRowContext() {
        this.clearBackTo(Aa, wo.HTML)
    }
    remove(e) {
        const t = this._indexOf(e);
        t >= 0 && (t === this.stackTop ? this.pop() : (this.items.splice(t, 1),
        this.tagIDs.splice(t, 1),
        this.stackTop--,
        this._updateCurrentElement(),
        this.handler.onItemPop(e, !1)))
    }
    tryPeekProperlyNestedBodyElement() {
        return this.stackTop >= 1 && this.tagIDs[1] === qo.BODY ? this.items[1] : null
    }
    contains(e) {
        return this._indexOf(e) > -1
    }
    getCommonAncestor(e) {
        const t = this._indexOf(e) - 1;
        return t >= 0 ? this.items[t] : null
    }
    isRootHtmlElementCurrent() {
        return 0 === this.stackTop && this.tagIDs[0] === qo.HTML
    }
    hasInDynamicScope(e, t) {
        for (let n = this.stackTop; n >= 0; n--) {
            const r = this.tagIDs[n];
            switch (this.treeAdapter.getNamespaceURI(this.items[n])) {
            case wo.HTML:
                if (r === e)
                    return !0;
                if (t.has(r))
                    return !1;
                break;
            case wo.SVG:
                if (ga.has(r))
                    return !1;
                break;
            case wo.MATHML:
                if (Ta.has(r))
                    return !1
            }
        }
        return !0
    }
    hasInScope(e) {
        return this.hasInDynamicScope(e, fa)
    }
    hasInListItemScope(e) {
        return this.hasInDynamicScope(e, ma)
    }
    hasInButtonScope(e) {
        return this.hasInDynamicScope(e, Ea)
    }
    hasNumberedHeaderInScope() {
        for (let e = this.stackTop; e >= 0; e--) {
            const t = this.tagIDs[e];
            switch (this.treeAdapter.getNamespaceURI(this.items[e])) {
            case wo.HTML:
                if (ta.has(t))
                    return !0;
                if (fa.has(t))
                    return !1;
                break;
            case wo.SVG:
                if (ga.has(t))
                    return !1;
                break;
            case wo.MATHML:
                if (Ta.has(t))
                    return !1
            }
        }
        return !0
    }
    hasInTableScope(e) {
        for (let t = this.stackTop; t >= 0; t--)
            if (this.treeAdapter.getNamespaceURI(this.items[t]) === wo.HTML)
                switch (this.tagIDs[t]) {
                case e:
                    return !0;
                case qo.TABLE:
                case qo.HTML:
                    return !1
                }
        return !0
    }
    hasTableBodyContextInTableScope() {
        for (let e = this.stackTop; e >= 0; e--)
            if (this.treeAdapter.getNamespaceURI(this.items[e]) === wo.HTML)
                switch (this.tagIDs[e]) {
                case qo.TBODY:
                case qo.THEAD:
                case qo.TFOOT:
                    return !0;
                case qo.TABLE:
                case qo.HTML:
                    return !1
                }
        return !0
    }
    hasInSelectScope(e) {
        for (let t = this.stackTop; t >= 0; t--)
            if (this.treeAdapter.getNamespaceURI(this.items[t]) === wo.HTML)
                switch (this.tagIDs[t]) {
                case e:
                    return !0;
                case qo.OPTION:
                case qo.OPTGROUP:
                    break;
                default:
                    return !1
                }
        return !0
    }
    generateImpliedEndTags() {
        for (; void 0 !== this.currentTagId && pa.has(this.currentTagId); )
            this.pop()
    }
    generateImpliedEndTagsThoroughly() {
        for (; void 0 !== this.currentTagId && da.has(this.currentTagId); )
            this.pop()
    }
    generateImpliedEndTagsWithExclusion(e) {
        for (; void 0 !== this.currentTagId && this.currentTagId !== e && da.has(this.currentTagId); )
            this.pop()
    }
}
var Sa, Ca;
(Ca = Sa || (Sa = {}))[Ca.Marker = 0] = "Marker",
Ca[Ca.Element = 1] = "Element";
const Da = {
    type: Sa.Marker
};
class Oa {
    constructor(e) {
        this.treeAdapter = e,
        this.entries = [],
        this.bookmark = null
    }
    _getNoahArkConditionCandidates(e, t) {
        const n = []
          , r = t.length
          , i = this.treeAdapter.getTagName(e)
          , s = this.treeAdapter.getNamespaceURI(e);
        for (let o = 0; o < this.entries.length; o++) {
            const e = this.entries[o];
            if (e.type === Sa.Marker)
                break;
            const {element: t} = e;
            if (this.treeAdapter.getTagName(t) === i && this.treeAdapter.getNamespaceURI(t) === s) {
                const e = this.treeAdapter.getAttrList(t);
                e.length === r && n.push({
                    idx: o,
                    attrs: e
                })
            }
        }
        return n
    }
    _ensureNoahArkCondition(e) {
        if (this.entries.length < 3)
            return;
        const t = this.treeAdapter.getAttrList(e)
          , n = this._getNoahArkConditionCandidates(e, t);
        if (n.length < 3)
            return;
        const r = new Map(t.map(e => [e.name, e.value]));
        let i = 0;
        for (let s = 0; s < n.length; s++) {
            const e = n[s];
            e.attrs.every(e => r.get(e.name) === e.value) && (i += 1,
            i >= 3 && this.entries.splice(e.idx, 1))
        }
    }
    insertMarker() {
        this.entries.unshift(Da)
    }
    pushElement(e, t) {
        this._ensureNoahArkCondition(e),
        this.entries.unshift({
            type: Sa.Element,
            element: e,
            token: t
        })
    }
    insertElementAfterBookmark(e, t) {
        const n = this.entries.indexOf(this.bookmark);
        this.entries.splice(n, 0, {
            type: Sa.Element,
            element: e,
            token: t
        })
    }
    removeEntry(e) {
        const t = this.entries.indexOf(e);
        -1 !== t && this.entries.splice(t, 1)
    }
    clearToLastMarker() {
        const e = this.entries.indexOf(Da);
        -1 === e ? this.entries.length = 0 : this.entries.splice(0, e + 1)
    }
    getElementEntryInScopeWithTagName(e) {
        const t = this.entries.find(t => t.type === Sa.Marker || this.treeAdapter.getTagName(t.element) === e);
        return t && t.type === Sa.Element ? t : null
    }
    getElementEntry(e) {
        return this.entries.find(t => t.type === Sa.Element && t.element === e)
    }
}
const ya = {
    createDocument: () => ({
        nodeName: "#document",
        mode: Uo.NO_QUIRKS,
        childNodes: []
    }),
    createDocumentFragment: () => ({
        nodeName: "#document-fragment",
        childNodes: []
    }),
    createElement: (e, t, n) => ({
        nodeName: e,
        tagName: e,
        attrs: n,
        namespaceURI: t,
        childNodes: [],
        parentNode: null
    }),
    createCommentNode: e => ({
        nodeName: "#comment",
        data: e,
        parentNode: null
    }),
    createTextNode: e => ({
        nodeName: "#text",
        value: e,
        parentNode: null
    }),
    appendChild(e, t) {
        e.childNodes.push(t),
        t.parentNode = e
    },
    insertBefore(e, t, n) {
        const r = e.childNodes.indexOf(n);
        e.childNodes.splice(r, 0, t),
        t.parentNode = e
    },
    setTemplateContent(e, t) {
        e.content = t
    },
    getTemplateContent: e => e.content,
    setDocumentType(e, t, n, r) {
        const i = e.childNodes.find(e => "#documentType" === e.nodeName);
        if (i)
            i.name = t,
            i.publicId = n,
            i.systemId = r;
        else {
            const i = {
                nodeName: "#documentType",
                name: t,
                publicId: n,
                systemId: r,
                parentNode: null
            };
            ya.appendChild(e, i)
        }
    },
    setDocumentMode(e, t) {
        e.mode = t
    },
    getDocumentMode: e => e.mode,
    detachNode(e) {
        if (e.parentNode) {
            const t = e.parentNode.childNodes.indexOf(e);
            e.parentNode.childNodes.splice(t, 1),
            e.parentNode = null
        }
    },
    insertText(e, t) {
        if (e.childNodes.length > 0) {
            const n = e.childNodes[e.childNodes.length - 1];
            if (ya.isTextNode(n))
                return void (n.value += t)
        }
        ya.appendChild(e, ya.createTextNode(t))
    },
    insertTextBefore(e, t, n) {
        const r = e.childNodes[e.childNodes.indexOf(n) - 1];
        r && ya.isTextNode(r) ? r.value += t : ya.insertBefore(e, ya.createTextNode(t), n)
    },
    adoptAttributes(e, t) {
        const n = new Set(e.attrs.map(e => e.name));
        for (let r = 0; r < t.length; r++)
            n.has(t[r].name) || e.attrs.push(t[r])
    },
    getFirstChild: e => e.childNodes[0],
    getChildNodes: e => e.childNodes,
    getParentNode: e => e.parentNode,
    getAttrList: e => e.attrs,
    getTagName: e => e.tagName,
    getNamespaceURI: e => e.namespaceURI,
    getTextNodeContent: e => e.value,
    getCommentNodeContent: e => e.data,
    getDocumentTypeNodeName: e => e.name,
    getDocumentTypeNodePublicId: e => e.publicId,
    getDocumentTypeNodeSystemId: e => e.systemId,
    isTextNode: e => "#text" === e.nodeName,
    isCommentNode: e => "#comment" === e.nodeName,
    isDocumentTypeNode: e => "#documentType" === e.nodeName,
    isElementNode: e => Object.prototype.hasOwnProperty.call(e, "tagName"),
    setNodeSourceCodeLocation(e, t) {
        e.sourceCodeLocation = t
    },
    getNodeSourceCodeLocation: e => e.sourceCodeLocation,
    updateNodeSourceCodeLocation(e, t) {
        e.sourceCodeLocation = {
            ...e.sourceCodeLocation,
            ...t
        }
    }
}
  , ba = "html"
  , Ra = ["+//silmaril//dtd html pro v0r11 19970101//", "-//as//dtd html 3.0 aswedit + extensions//", "-//advasoft ltd//dtd html 3.0 aswedit + extensions//", "-//ietf//dtd html 2.0 level 1//", "-//ietf//dtd html 2.0 level 2//", "-//ietf//dtd html 2.0 strict level 1//", "-//ietf//dtd html 2.0 strict level 2//", "-//ietf//dtd html 2.0 strict//", "-//ietf//dtd html 2.0//", "-//ietf//dtd html 2.1e//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.2 final//", "-//ietf//dtd html 3.2//", "-//ietf//dtd html 3//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 3//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict//", "-//ietf//dtd html//", "-//metrius//dtd metrius presentational//", "-//microsoft//dtd internet explorer 2.0 html strict//", "-//microsoft//dtd internet explorer 2.0 html//", "-//microsoft//dtd internet explorer 2.0 tables//", "-//microsoft//dtd internet explorer 3.0 html strict//", "-//microsoft//dtd internet explorer 3.0 html//", "-//microsoft//dtd internet explorer 3.0 tables//", "-//netscape comm. corp.//dtd html//", "-//netscape comm. corp.//dtd strict html//", "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//o'reilly and associates//dtd html extended relaxed 1.0//", "-//sq//dtd html 2.0 hotmetal + extensions//", "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//", "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//", "-//spyglass//dtd html 2.0 extended//", "-//sun microsystems corp.//dtd hotjava html//", "-//sun microsystems corp.//dtd hotjava strict html//", "-//w3c//dtd html 3 1995-03-24//", "-//w3c//dtd html 3.2 draft//", "-//w3c//dtd html 3.2 final//", "-//w3c//dtd html 3.2//", "-//w3c//dtd html 3.2s draft//", "-//w3c//dtd html 4.0 frameset//", "-//w3c//dtd html 4.0 transitional//", "-//w3c//dtd html experimental 19960712//", "-//w3c//dtd html experimental 970421//", "-//w3c//dtd w3 html//", "-//w3o//dtd w3 html 3.0//", "-//webtechs//dtd mozilla html 2.0//", "-//webtechs//dtd mozilla html//"]
  , La = [...Ra, "-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"]
  , Pa = new Set(["-//w3o//dtd w3 html strict 3.0//en//", "-/w3c/dtd html 4.0 transitional/en", "html"])
  , Ma = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"]
  , xa = [...Ma, "-//w3c//dtd html 4.01 frameset//", "-//w3c//dtd html 4.01 transitional//"];
function va(e, t) {
    return t.some(t => e.startsWith(t))
}
const wa = "text/html"
  , Fa = "application/xhtml+xml"
  , Ba = new Map(["attributeName", "attributeType", "baseFrequency", "baseProfile", "calcMode", "clipPathUnits", "diffuseConstant", "edgeMode", "filterUnits", "glyphRef", "gradientTransform", "gradientUnits", "kernelMatrix", "kernelUnitLength", "keyPoints", "keySplines", "keyTimes", "lengthAdjust", "limitingConeAngle", "markerHeight", "markerUnits", "markerWidth", "maskContentUnits", "maskUnits", "numOctaves", "pathLength", "patternContentUnits", "patternTransform", "patternUnits", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "preserveAspectRatio", "primitiveUnits", "refX", "refY", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "specularConstant", "specularExponent", "spreadMethod", "startOffset", "stdDeviation", "stitchTiles", "surfaceScale", "systemLanguage", "tableValues", "targetX", "targetY", "textLength", "viewBox", "viewTarget", "xChannelSelector", "yChannelSelector", "zoomAndPan"].map(e => [e.toLowerCase(), e]))
  , Ha = new Map([["xlink:actuate", {
    prefix: "xlink",
    name: "actuate",
    namespace: wo.XLINK
}], ["xlink:arcrole", {
    prefix: "xlink",
    name: "arcrole",
    namespace: wo.XLINK
}], ["xlink:href", {
    prefix: "xlink",
    name: "href",
    namespace: wo.XLINK
}], ["xlink:role", {
    prefix: "xlink",
    name: "role",
    namespace: wo.XLINK
}], ["xlink:show", {
    prefix: "xlink",
    name: "show",
    namespace: wo.XLINK
}], ["xlink:title", {
    prefix: "xlink",
    name: "title",
    namespace: wo.XLINK
}], ["xlink:type", {
    prefix: "xlink",
    name: "type",
    namespace: wo.XLINK
}], ["xml:lang", {
    prefix: "xml",
    name: "lang",
    namespace: wo.XML
}], ["xml:space", {
    prefix: "xml",
    name: "space",
    namespace: wo.XML
}], ["xmlns", {
    prefix: "",
    name: "xmlns",
    namespace: wo.XMLNS
}], ["xmlns:xlink", {
    prefix: "xmlns",
    name: "xlink",
    namespace: wo.XMLNS
}]])
  , Ua = new Map(["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"].map(e => [e.toLowerCase(), e]))
  , Ga = new Set([qo.B, qo.BIG, qo.BLOCKQUOTE, qo.BODY, qo.BR, qo.CENTER, qo.CODE, qo.DD, qo.DIV, qo.DL, qo.DT, qo.EM, qo.EMBED, qo.H1, qo.H2, qo.H3, qo.H4, qo.H5, qo.H6, qo.HEAD, qo.HR, qo.I, qo.IMG, qo.LI, qo.LISTING, qo.MENU, qo.META, qo.NOBR, qo.OL, qo.P, qo.PRE, qo.RUBY, qo.S, qo.SMALL, qo.SPAN, qo.STRONG, qo.STRIKE, qo.SUB, qo.SUP, qo.TABLE, qo.TT, qo.U, qo.UL, qo.VAR]);
function Ya(e) {
    for (let t = 0; t < e.attrs.length; t++)
        if ("definitionurl" === e.attrs[t].name) {
            e.attrs[t].name = "definitionURL";
            break
        }
}
function za(e) {
    for (let t = 0; t < e.attrs.length; t++) {
        const n = Ba.get(e.attrs[t].name);
        null != n && (e.attrs[t].name = n)
    }
}
function qa(e) {
    for (let t = 0; t < e.attrs.length; t++) {
        const n = Ha.get(e.attrs[t].name);
        n && (e.attrs[t].prefix = n.prefix,
        e.attrs[t].name = n.name,
        e.attrs[t].namespace = n.namespace)
    }
}
function Va(e, t, n, r) {
    return (!r || r === wo.HTML) && function(e, t, n) {
        if (t === wo.MATHML && e === qo.ANNOTATION_XML)
            for (let r = 0; r < n.length; r++)
                if (n[r].name === Bo.ENCODING) {
                    const e = n[r].value.toLowerCase();
                    return e === wa || e === Fa
                }
        return t === wo.SVG && (e === qo.FOREIGN_OBJECT || e === qo.DESC || e === qo.TITLE)
    }(e, t, n) || (!r || r === wo.MATHML) && function(e, t) {
        return t === wo.MATHML && (e === qo.MI || e === qo.MO || e === qo.MN || e === qo.MS || e === qo.MTEXT)
    }(e, t)
}
var Qa, ja;
(ja = Qa || (Qa = {}))[ja.INITIAL = 0] = "INITIAL",
ja[ja.BEFORE_HTML = 1] = "BEFORE_HTML",
ja[ja.BEFORE_HEAD = 2] = "BEFORE_HEAD",
ja[ja.IN_HEAD = 3] = "IN_HEAD",
ja[ja.IN_HEAD_NO_SCRIPT = 4] = "IN_HEAD_NO_SCRIPT",
ja[ja.AFTER_HEAD = 5] = "AFTER_HEAD",
ja[ja.IN_BODY = 6] = "IN_BODY",
ja[ja.TEXT = 7] = "TEXT",
ja[ja.IN_TABLE = 8] = "IN_TABLE",
ja[ja.IN_TABLE_TEXT = 9] = "IN_TABLE_TEXT",
ja[ja.IN_CAPTION = 10] = "IN_CAPTION",
ja[ja.IN_COLUMN_GROUP = 11] = "IN_COLUMN_GROUP",
ja[ja.IN_TABLE_BODY = 12] = "IN_TABLE_BODY",
ja[ja.IN_ROW = 13] = "IN_ROW",
ja[ja.IN_CELL = 14] = "IN_CELL",
ja[ja.IN_SELECT = 15] = "IN_SELECT",
ja[ja.IN_SELECT_IN_TABLE = 16] = "IN_SELECT_IN_TABLE",
ja[ja.IN_TEMPLATE = 17] = "IN_TEMPLATE",
ja[ja.AFTER_BODY = 18] = "AFTER_BODY",
ja[ja.IN_FRAMESET = 19] = "IN_FRAMESET",
ja[ja.AFTER_FRAMESET = 20] = "AFTER_FRAMESET",
ja[ja.AFTER_AFTER_BODY = 21] = "AFTER_AFTER_BODY",
ja[ja.AFTER_AFTER_FRAMESET = 22] = "AFTER_AFTER_FRAMESET";
const Wa = {
    startLine: -1,
    startCol: -1,
    startOffset: -1,
    endLine: -1,
    endCol: -1,
    endOffset: -1
}
  , Ka = new Set([qo.TABLE, qo.TBODY, qo.TFOOT, qo.THEAD, qo.TR])
  , Xa = {
    scriptingEnabled: !0,
    sourceCodeLocationInfo: !1,
    treeAdapter: ya,
    onParseError: null
};
class Ja {
    constructor(e, t, n=null, r=null) {
        this.fragmentContext = n,
        this.scriptHandler = r,
        this.currentToken = null,
        this.stopped = !1,
        this.insertionMode = Qa.INITIAL,
        this.originalInsertionMode = Qa.INITIAL,
        this.headElement = null,
        this.formElement = null,
        this.currentNotInHTML = !1,
        this.tmplInsertionModeStack = [],
        this.pendingCharacterTokens = [],
        this.hasNonWhitespacePendingCharacterToken = !1,
        this.framesetOk = !0,
        this.skipNextNewLine = !1,
        this.fosterParentingEnabled = !1,
        this.options = {
            ...Xa,
            ...e
        },
        this.treeAdapter = this.options.treeAdapter,
        this.onParseError = this.options.onParseError,
        this.onParseError && (this.options.sourceCodeLocationInfo = !0),
        this.document = null != t ? t : this.treeAdapter.createDocument(),
        this.tokenizer = new ha(this.options,this),
        this.activeFormattingElements = new Oa(this.treeAdapter),
        this.fragmentContextID = n ? $o(this.treeAdapter.getTagName(n)) : qo.UNKNOWN,
        this._setContextModes(null != n ? n : this.document, this.fragmentContextID),
        this.openElements = new ka(this.document,this.treeAdapter,this)
    }
    static parse(e, t) {
        const n = new this(t);
        return n.tokenizer.write(e, !0),
        n.document
    }
    static getFragmentParser(e, t) {
        const n = {
            ...Xa,
            ...t
        };
        null != e || (e = n.treeAdapter.createElement(Yo.TEMPLATE, wo.HTML, []));
        const r = n.treeAdapter.createElement("documentmock", wo.HTML, [])
          , i = new this(n,r,e);
        return i.fragmentContextID === qo.TEMPLATE && i.tmplInsertionModeStack.unshift(Qa.IN_TEMPLATE),
        i._initTokenizerForFragmentParsing(),
        i._insertFakeRootElement(),
        i._resetInsertionMode(),
        i._findFormInFragmentContext(),
        i
    }
    getFragment() {
        const e = this.treeAdapter.getFirstChild(this.document)
          , t = this.treeAdapter.createDocumentFragment();
        return this._adoptNodes(e, t),
        t
    }
    _err(e, t, n) {
        var r;
        if (!this.onParseError)
            return;
        const i = null !== (r = e.location) && void 0 !== r ? r : Wa
          , s = {
            code: t,
            startLine: i.startLine,
            startCol: i.startCol,
            startOffset: i.startOffset,
            endLine: n ? i.startLine : i.endLine,
            endCol: n ? i.startCol : i.endCol,
            endOffset: n ? i.startOffset : i.endOffset
        };
        this.onParseError(s)
    }
    onItemPush(e, t, n) {
        var r, i;
        null === (i = (r = this.treeAdapter).onItemPush) || void 0 === i || i.call(r, e),
        n && this.openElements.stackTop > 0 && this._setContextModes(e, t)
    }
    onItemPop(e, t) {
        var n, r;
        if (this.options.sourceCodeLocationInfo && this._setEndLocation(e, this.currentToken),
        null === (r = (n = this.treeAdapter).onItemPop) || void 0 === r || r.call(n, e, this.openElements.current),
        t) {
            let e, t;
            0 === this.openElements.stackTop && this.fragmentContext ? (e = this.fragmentContext,
            t = this.fragmentContextID) : ({current: e, currentTagId: t} = this.openElements),
            this._setContextModes(e, t)
        }
    }
    _setContextModes(e, t) {
        const n = e === this.document || e && this.treeAdapter.getNamespaceURI(e) === wo.HTML;
        this.currentNotInHTML = !n,
        this.tokenizer.inForeignNode = !n && void 0 !== e && void 0 !== t && !this._isIntegrationPoint(t, e)
    }
    _switchToTextParsing(e, t) {
        this._insertElement(e, wo.HTML),
        this.tokenizer.state = t,
        this.originalInsertionMode = this.insertionMode,
        this.insertionMode = Qa.TEXT
    }
    switchToPlaintextParsing() {
        this.insertionMode = Qa.TEXT,
        this.originalInsertionMode = Qa.IN_BODY,
        this.tokenizer.state = ia.PLAINTEXT
    }
    _getAdjustedCurrentElement() {
        return 0 === this.openElements.stackTop && this.fragmentContext ? this.fragmentContext : this.openElements.current
    }
    _findFormInFragmentContext() {
        let e = this.fragmentContext;
        for (; e; ) {
            if (this.treeAdapter.getTagName(e) === Yo.FORM) {
                this.formElement = e;
                break
            }
            e = this.treeAdapter.getParentNode(e)
        }
    }
    _initTokenizerForFragmentParsing() {
        if (this.fragmentContext && this.treeAdapter.getNamespaceURI(this.fragmentContext) === wo.HTML)
            switch (this.fragmentContextID) {
            case qo.TITLE:
            case qo.TEXTAREA:
                this.tokenizer.state = ia.RCDATA;
                break;
            case qo.STYLE:
            case qo.XMP:
            case qo.IFRAME:
            case qo.NOEMBED:
            case qo.NOFRAMES:
            case qo.NOSCRIPT:
                this.tokenizer.state = ia.RAWTEXT;
                break;
            case qo.SCRIPT:
                this.tokenizer.state = ia.SCRIPT_DATA;
                break;
            case qo.PLAINTEXT:
                this.tokenizer.state = ia.PLAINTEXT
            }
    }
    _setDocumentType(e) {
        const t = e.name || ""
          , n = e.publicId || ""
          , r = e.systemId || "";
        if (this.treeAdapter.setDocumentType(this.document, t, n, r),
        e.location) {
            const t = this.treeAdapter.getChildNodes(this.document).find(e => this.treeAdapter.isDocumentTypeNode(e));
            t && this.treeAdapter.setNodeSourceCodeLocation(t, e.location)
        }
    }
    _attachElementToTree(e, t) {
        if (this.options.sourceCodeLocationInfo) {
            const n = t && {
                ...t,
                startTag: t
            };
            this.treeAdapter.setNodeSourceCodeLocation(e, n)
        }
        if (this._shouldFosterParentOnInsertion())
            this._fosterParentElement(e);
        else {
            const t = this.openElements.currentTmplContentOrNode;
            this.treeAdapter.appendChild(null != t ? t : this.document, e)
        }
    }
    _appendElement(e, t) {
        const n = this.treeAdapter.createElement(e.tagName, t, e.attrs);
        this._attachElementToTree(n, e.location)
    }
    _insertElement(e, t) {
        const n = this.treeAdapter.createElement(e.tagName, t, e.attrs);
        this._attachElementToTree(n, e.location),
        this.openElements.push(n, e.tagID)
    }
    _insertFakeElement(e, t) {
        const n = this.treeAdapter.createElement(e, wo.HTML, []);
        this._attachElementToTree(n, null),
        this.openElements.push(n, t)
    }
    _insertTemplate(e) {
        const t = this.treeAdapter.createElement(e.tagName, wo.HTML, e.attrs)
          , n = this.treeAdapter.createDocumentFragment();
        this.treeAdapter.setTemplateContent(t, n),
        this._attachElementToTree(t, e.location),
        this.openElements.push(t, e.tagID),
        this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(n, null)
    }
    _insertFakeRootElement() {
        const e = this.treeAdapter.createElement(Yo.HTML, wo.HTML, []);
        this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(e, null),
        this.treeAdapter.appendChild(this.openElements.current, e),
        this.openElements.push(e, qo.HTML)
    }
    _appendCommentNode(e, t) {
        const n = this.treeAdapter.createCommentNode(e.data);
        this.treeAdapter.appendChild(t, n),
        this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(n, e.location)
    }
    _insertCharacters(e) {
        let t, n;
        if (this._shouldFosterParentOnInsertion() ? (({parent: t, beforeElement: n} = this._findFosterParentingLocation()),
        n ? this.treeAdapter.insertTextBefore(t, e.chars, n) : this.treeAdapter.insertText(t, e.chars)) : (t = this.openElements.currentTmplContentOrNode,
        this.treeAdapter.insertText(t, e.chars)),
        !e.location)
            return;
        const r = this.treeAdapter.getChildNodes(t)
          , i = n ? r.lastIndexOf(n) : r.length
          , s = r[i - 1];
        if (this.treeAdapter.getNodeSourceCodeLocation(s)) {
            const {endLine: t, endCol: n, endOffset: r} = e.location;
            this.treeAdapter.updateNodeSourceCodeLocation(s, {
                endLine: t,
                endCol: n,
                endOffset: r
            })
        } else
            this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(s, e.location)
    }
    _adoptNodes(e, t) {
        for (let n = this.treeAdapter.getFirstChild(e); n; n = this.treeAdapter.getFirstChild(e))
            this.treeAdapter.detachNode(n),
            this.treeAdapter.appendChild(t, n)
    }
    _setEndLocation(e, t) {
        if (this.treeAdapter.getNodeSourceCodeLocation(e) && t.location) {
            const n = t.location
              , r = this.treeAdapter.getTagName(e)
              , i = t.type === ko.END_TAG && r === t.tagName ? {
                endTag: {
                    ...n
                },
                endLine: n.endLine,
                endCol: n.endCol,
                endOffset: n.endOffset
            } : {
                endLine: n.startLine,
                endCol: n.startCol,
                endOffset: n.startOffset
            };
            this.treeAdapter.updateNodeSourceCodeLocation(e, i)
        }
    }
    shouldProcessStartTagTokenInForeignContent(e) {
        if (!this.currentNotInHTML)
            return !1;
        let t, n;
        return 0 === this.openElements.stackTop && this.fragmentContext ? (t = this.fragmentContext,
        n = this.fragmentContextID) : ({current: t, currentTagId: n} = this.openElements),
        (e.tagID !== qo.SVG || this.treeAdapter.getTagName(t) !== Yo.ANNOTATION_XML || this.treeAdapter.getNamespaceURI(t) !== wo.MATHML) && (this.tokenizer.inForeignNode || (e.tagID === qo.MGLYPH || e.tagID === qo.MALIGNMARK) && void 0 !== n && !this._isIntegrationPoint(n, t, wo.HTML))
    }
    _processToken(e) {
        switch (e.type) {
        case ko.CHARACTER:
            this.onCharacter(e);
            break;
        case ko.NULL_CHARACTER:
            this.onNullCharacter(e);
            break;
        case ko.COMMENT:
            this.onComment(e);
            break;
        case ko.DOCTYPE:
            this.onDoctype(e);
            break;
        case ko.START_TAG:
            this._processStartTag(e);
            break;
        case ko.END_TAG:
            this.onEndTag(e);
            break;
        case ko.EOF:
            this.onEof(e);
            break;
        case ko.WHITESPACE_CHARACTER:
            this.onWhitespaceCharacter(e)
        }
    }
    _isIntegrationPoint(e, t, n) {
        return Va(e, this.treeAdapter.getNamespaceURI(t), this.treeAdapter.getAttrList(t), n)
    }
    _reconstructActiveFormattingElements() {
        const e = this.activeFormattingElements.entries.length;
        if (e) {
            const t = this.activeFormattingElements.entries.findIndex(e => e.type === Sa.Marker || this.openElements.contains(e.element));
            for (let n = -1 === t ? e - 1 : t - 1; n >= 0; n--) {
                const e = this.activeFormattingElements.entries[n];
                this._insertElement(e.token, this.treeAdapter.getNamespaceURI(e.element)),
                e.element = this.openElements.current
            }
        }
    }
    _closeTableCell() {
        this.openElements.generateImpliedEndTags(),
        this.openElements.popUntilTableCellPopped(),
        this.activeFormattingElements.clearToLastMarker(),
        this.insertionMode = Qa.IN_ROW
    }
    _closePElement() {
        this.openElements.generateImpliedEndTagsWithExclusion(qo.P),
        this.openElements.popUntilTagNamePopped(qo.P)
    }
    _resetInsertionMode() {
        for (let e = this.openElements.stackTop; e >= 0; e--)
            switch (0 === e && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[e]) {
            case qo.TR:
                return void (this.insertionMode = Qa.IN_ROW);
            case qo.TBODY:
            case qo.THEAD:
            case qo.TFOOT:
                return void (this.insertionMode = Qa.IN_TABLE_BODY);
            case qo.CAPTION:
                return void (this.insertionMode = Qa.IN_CAPTION);
            case qo.COLGROUP:
                return void (this.insertionMode = Qa.IN_COLUMN_GROUP);
            case qo.TABLE:
                return void (this.insertionMode = Qa.IN_TABLE);
            case qo.BODY:
                return void (this.insertionMode = Qa.IN_BODY);
            case qo.FRAMESET:
                return void (this.insertionMode = Qa.IN_FRAMESET);
            case qo.SELECT:
                return void this._resetInsertionModeForSelect(e);
            case qo.TEMPLATE:
                return void (this.insertionMode = this.tmplInsertionModeStack[0]);
            case qo.HTML:
                return void (this.insertionMode = this.headElement ? Qa.AFTER_HEAD : Qa.BEFORE_HEAD);
            case qo.TD:
            case qo.TH:
                if (e > 0)
                    return void (this.insertionMode = Qa.IN_CELL);
                break;
            case qo.HEAD:
                if (e > 0)
                    return void (this.insertionMode = Qa.IN_HEAD)
            }
        this.insertionMode = Qa.IN_BODY
    }
    _resetInsertionModeForSelect(e) {
        if (e > 0)
            for (let t = e - 1; t > 0; t--) {
                const e = this.openElements.tagIDs[t];
                if (e === qo.TEMPLATE)
                    break;
                if (e === qo.TABLE)
                    return void (this.insertionMode = Qa.IN_SELECT_IN_TABLE)
            }
        this.insertionMode = Qa.IN_SELECT
    }
    _isElementCausesFosterParenting(e) {
        return Ka.has(e)
    }
    _shouldFosterParentOnInsertion() {
        return this.fosterParentingEnabled && void 0 !== this.openElements.currentTagId && this._isElementCausesFosterParenting(this.openElements.currentTagId)
    }
    _findFosterParentingLocation() {
        for (let e = this.openElements.stackTop; e >= 0; e--) {
            const t = this.openElements.items[e];
            switch (this.openElements.tagIDs[e]) {
            case qo.TEMPLATE:
                if (this.treeAdapter.getNamespaceURI(t) === wo.HTML)
                    return {
                        parent: this.treeAdapter.getTemplateContent(t),
                        beforeElement: null
                    };
                break;
            case qo.TABLE:
                {
                    const n = this.treeAdapter.getParentNode(t);
                    return n ? {
                        parent: n,
                        beforeElement: t
                    } : {
                        parent: this.openElements.items[e - 1],
                        beforeElement: null
                    }
                }
            }
        }
        return {
            parent: this.openElements.items[0],
            beforeElement: null
        }
    }
    _fosterParentElement(e) {
        const t = this._findFosterParentingLocation();
        t.beforeElement ? this.treeAdapter.insertBefore(t.parent, e, t.beforeElement) : this.treeAdapter.appendChild(t.parent, e)
    }
    _isSpecialElement(e, t) {
        const n = this.treeAdapter.getNamespaceURI(e);
        return ea[n].has(t)
    }
    onCharacter(e) {
        if (this.skipNextNewLine = !1,
        this.tokenizer.inForeignNode)
            !function(e, t) {
                e._insertCharacters(t),
                e.framesetOk = !1
            }(this, e);
        else
            switch (this.insertionMode) {
            case Qa.INITIAL:
                ac(this, e);
                break;
            case Qa.BEFORE_HTML:
                cc(this, e);
                break;
            case Qa.BEFORE_HEAD:
                lc(this, e);
                break;
            case Qa.IN_HEAD:
                pc(this, e);
                break;
            case Qa.IN_HEAD_NO_SCRIPT:
                dc(this, e);
                break;
            case Qa.AFTER_HEAD:
                fc(this, e);
                break;
            case Qa.IN_BODY:
            case Qa.IN_CAPTION:
            case Qa.IN_CELL:
            case Qa.IN_TEMPLATE:
                Tc(this, e);
                break;
            case Qa.TEXT:
            case Qa.IN_SELECT:
            case Qa.IN_SELECT_IN_TABLE:
                this._insertCharacters(e);
                break;
            case Qa.IN_TABLE:
            case Qa.IN_TABLE_BODY:
            case Qa.IN_ROW:
                Dc(this, e);
                break;
            case Qa.IN_TABLE_TEXT:
                Lc(this, e);
                break;
            case Qa.IN_COLUMN_GROUP:
                vc(this, e);
                break;
            case Qa.AFTER_BODY:
                qc(this, e);
                break;
            case Qa.AFTER_AFTER_BODY:
                Vc(this, e)
            }
    }
    onNullCharacter(e) {
        if (this.skipNextNewLine = !1,
        this.tokenizer.inForeignNode)
            !function(e, t) {
                t.chars = ao,
                e._insertCharacters(t)
            }(this, e);
        else
            switch (this.insertionMode) {
            case Qa.INITIAL:
                ac(this, e);
                break;
            case Qa.BEFORE_HTML:
                cc(this, e);
                break;
            case Qa.BEFORE_HEAD:
                lc(this, e);
                break;
            case Qa.IN_HEAD:
                pc(this, e);
                break;
            case Qa.IN_HEAD_NO_SCRIPT:
                dc(this, e);
                break;
            case Qa.AFTER_HEAD:
                fc(this, e);
                break;
            case Qa.TEXT:
                this._insertCharacters(e);
                break;
            case Qa.IN_TABLE:
            case Qa.IN_TABLE_BODY:
            case Qa.IN_ROW:
                Dc(this, e);
                break;
            case Qa.IN_COLUMN_GROUP:
                vc(this, e);
                break;
            case Qa.AFTER_BODY:
                qc(this, e);
                break;
            case Qa.AFTER_AFTER_BODY:
                Vc(this, e)
            }
    }
    onComment(e) {
        if (this.skipNextNewLine = !1,
        this.currentNotInHTML)
            sc(this, e);
        else
            switch (this.insertionMode) {
            case Qa.INITIAL:
            case Qa.BEFORE_HTML:
            case Qa.BEFORE_HEAD:
            case Qa.IN_HEAD:
            case Qa.IN_HEAD_NO_SCRIPT:
            case Qa.AFTER_HEAD:
            case Qa.IN_BODY:
            case Qa.IN_TABLE:
            case Qa.IN_CAPTION:
            case Qa.IN_COLUMN_GROUP:
            case Qa.IN_TABLE_BODY:
            case Qa.IN_ROW:
            case Qa.IN_CELL:
            case Qa.IN_SELECT:
            case Qa.IN_SELECT_IN_TABLE:
            case Qa.IN_TEMPLATE:
            case Qa.IN_FRAMESET:
            case Qa.AFTER_FRAMESET:
                sc(this, e);
                break;
            case Qa.IN_TABLE_TEXT:
                Pc(this, e);
                break;
            case Qa.AFTER_BODY:
                !function(e, t) {
                    e._appendCommentNode(t, e.openElements.items[0])
                }(this, e);
                break;
            case Qa.AFTER_AFTER_BODY:
            case Qa.AFTER_AFTER_FRAMESET:
                !function(e, t) {
                    e._appendCommentNode(t, e.document)
                }(this, e)
            }
    }
    onDoctype(e) {
        switch (this.skipNextNewLine = !1,
        this.insertionMode) {
        case Qa.INITIAL:
            !function(e, t) {
                e._setDocumentType(t);
                const n = t.forceQuirks ? Uo.QUIRKS : function(e) {
                    if (e.name !== ba)
                        return Uo.QUIRKS;
                    const {systemId: t} = e;
                    if (t && "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd" === t.toLowerCase())
                        return Uo.QUIRKS;
                    let {publicId: n} = e;
                    if (null !== n) {
                        if (n = n.toLowerCase(),
                        Pa.has(n))
                            return Uo.QUIRKS;
                        let e = null === t ? La : Ra;
                        if (va(n, e))
                            return Uo.QUIRKS;
                        if (e = null === t ? Ma : xa,
                        va(n, e))
                            return Uo.LIMITED_QUIRKS
                    }
                    return Uo.NO_QUIRKS
                }(t);
                (function(e) {
                    return e.name === ba && null === e.publicId && (null === e.systemId || "about:legacy-compat" === e.systemId)
                }
                )(t) || e._err(t, _o.nonConformingDoctype);
                e.treeAdapter.setDocumentMode(e.document, n),
                e.insertionMode = Qa.BEFORE_HTML
            }(this, e);
            break;
        case Qa.BEFORE_HEAD:
        case Qa.IN_HEAD:
        case Qa.IN_HEAD_NO_SCRIPT:
        case Qa.AFTER_HEAD:
            this._err(e, _o.misplacedDoctype);
            break;
        case Qa.IN_TABLE_TEXT:
            Pc(this, e)
        }
    }
    onStartTag(e) {
        this.skipNextNewLine = !1,
        this.currentToken = e,
        this._processStartTag(e),
        e.selfClosing && !e.ackSelfClosing && this._err(e, _o.nonVoidHtmlElementStartTagWithTrailingSolidus)
    }
    _processStartTag(e) {
        this.shouldProcessStartTagTokenInForeignContent(e) ? function(e, t) {
            if (function(e) {
                const t = e.tagID;
                return t === qo.FONT && e.attrs.some( ({name: e}) => e === Bo.COLOR || e === Bo.SIZE || e === Bo.FACE) || Ga.has(t)
            }(t))
                Qc(e),
                e._startTagOutsideForeignContent(t);
            else {
                const n = e._getAdjustedCurrentElement()
                  , r = e.treeAdapter.getNamespaceURI(n);
                r === wo.MATHML ? Ya(t) : r === wo.SVG && (!function(e) {
                    const t = Ua.get(e.tagName);
                    null != t && (e.tagName = t,
                    e.tagID = $o(e.tagName))
                }(t),
                za(t)),
                qa(t),
                t.selfClosing ? e._appendElement(t, r) : e._insertElement(t, r),
                t.ackSelfClosing = !0
            }
        }(this, e) : this._startTagOutsideForeignContent(e)
    }
    _startTagOutsideForeignContent(e) {
        switch (this.insertionMode) {
        case Qa.INITIAL:
            ac(this, e);
            break;
        case Qa.BEFORE_HTML:
            !function(e, t) {
                t.tagID === qo.HTML ? (e._insertElement(t, wo.HTML),
                e.insertionMode = Qa.BEFORE_HEAD) : cc(e, t)
            }(this, e);
            break;
        case Qa.BEFORE_HEAD:
            !function(e, t) {
                switch (t.tagID) {
                case qo.HTML:
                    Nc(e, t);
                    break;
                case qo.HEAD:
                    e._insertElement(t, wo.HTML),
                    e.headElement = e.openElements.current,
                    e.insertionMode = Qa.IN_HEAD;
                    break;
                default:
                    lc(e, t)
                }
            }(this, e);
            break;
        case Qa.IN_HEAD:
            uc(this, e);
            break;
        case Qa.IN_HEAD_NO_SCRIPT:
            !function(e, t) {
                switch (t.tagID) {
                case qo.HTML:
                    Nc(e, t);
                    break;
                case qo.BASEFONT:
                case qo.BGSOUND:
                case qo.HEAD:
                case qo.LINK:
                case qo.META:
                case qo.NOFRAMES:
                case qo.STYLE:
                    uc(e, t);
                    break;
                case qo.NOSCRIPT:
                    e._err(t, _o.nestedNoscriptInHead);
                    break;
                default:
                    dc(e, t)
                }
            }(this, e);
            break;
        case Qa.AFTER_HEAD:
            !function(e, t) {
                switch (t.tagID) {
                case qo.HTML:
                    Nc(e, t);
                    break;
                case qo.BODY:
                    e._insertElement(t, wo.HTML),
                    e.framesetOk = !1,
                    e.insertionMode = Qa.IN_BODY;
                    break;
                case qo.FRAMESET:
                    e._insertElement(t, wo.HTML),
                    e.insertionMode = Qa.IN_FRAMESET;
                    break;
                case qo.BASE:
                case qo.BASEFONT:
                case qo.BGSOUND:
                case qo.LINK:
                case qo.META:
                case qo.NOFRAMES:
                case qo.SCRIPT:
                case qo.STYLE:
                case qo.TEMPLATE:
                case qo.TITLE:
                    e._err(t, _o.abandonedHeadElementChild),
                    e.openElements.push(e.headElement, qo.HEAD),
                    uc(e, t),
                    e.openElements.remove(e.headElement);
                    break;
                case qo.HEAD:
                    e._err(t, _o.misplacedStartTagForHeadElement);
                    break;
                default:
                    fc(e, t)
                }
            }(this, e);
            break;
        case Qa.IN_BODY:
            Nc(this, e);
            break;
        case Qa.IN_TABLE:
            Oc(this, e);
            break;
        case Qa.IN_TABLE_TEXT:
            Pc(this, e);
            break;
        case Qa.IN_CAPTION:
            !function(e, t) {
                const n = t.tagID;
                Mc.has(n) ? e.openElements.hasInTableScope(qo.CAPTION) && (e.openElements.generateImpliedEndTags(),
                e.openElements.popUntilTagNamePopped(qo.CAPTION),
                e.activeFormattingElements.clearToLastMarker(),
                e.insertionMode = Qa.IN_TABLE,
                Oc(e, t)) : Nc(e, t)
            }(this, e);
            break;
        case Qa.IN_COLUMN_GROUP:
            xc(this, e);
            break;
        case Qa.IN_TABLE_BODY:
            wc(this, e);
            break;
        case Qa.IN_ROW:
            Bc(this, e);
            break;
        case Qa.IN_CELL:
            !function(e, t) {
                const n = t.tagID;
                Mc.has(n) ? (e.openElements.hasInTableScope(qo.TD) || e.openElements.hasInTableScope(qo.TH)) && (e._closeTableCell(),
                Bc(e, t)) : Nc(e, t)
            }(this, e);
            break;
        case Qa.IN_SELECT:
            Uc(this, e);
            break;
        case Qa.IN_SELECT_IN_TABLE:
            !function(e, t) {
                const n = t.tagID;
                n === qo.CAPTION || n === qo.TABLE || n === qo.TBODY || n === qo.TFOOT || n === qo.THEAD || n === qo.TR || n === qo.TD || n === qo.TH ? (e.openElements.popUntilTagNamePopped(qo.SELECT),
                e._resetInsertionMode(),
                e._processStartTag(t)) : Uc(e, t)
            }(this, e);
            break;
        case Qa.IN_TEMPLATE:
            !function(e, t) {
                switch (t.tagID) {
                case qo.BASE:
                case qo.BASEFONT:
                case qo.BGSOUND:
                case qo.LINK:
                case qo.META:
                case qo.NOFRAMES:
                case qo.SCRIPT:
                case qo.STYLE:
                case qo.TEMPLATE:
                case qo.TITLE:
                    uc(e, t);
                    break;
                case qo.CAPTION:
                case qo.COLGROUP:
                case qo.TBODY:
                case qo.TFOOT:
                case qo.THEAD:
                    e.tmplInsertionModeStack[0] = Qa.IN_TABLE,
                    e.insertionMode = Qa.IN_TABLE,
                    Oc(e, t);
                    break;
                case qo.COL:
                    e.tmplInsertionModeStack[0] = Qa.IN_COLUMN_GROUP,
                    e.insertionMode = Qa.IN_COLUMN_GROUP,
                    xc(e, t);
                    break;
                case qo.TR:
                    e.tmplInsertionModeStack[0] = Qa.IN_TABLE_BODY,
                    e.insertionMode = Qa.IN_TABLE_BODY,
                    wc(e, t);
                    break;
                case qo.TD:
                case qo.TH:
                    e.tmplInsertionModeStack[0] = Qa.IN_ROW,
                    e.insertionMode = Qa.IN_ROW,
                    Bc(e, t);
                    break;
                default:
                    e.tmplInsertionModeStack[0] = Qa.IN_BODY,
                    e.insertionMode = Qa.IN_BODY,
                    Nc(e, t)
                }
            }(this, e);
            break;
        case Qa.AFTER_BODY:
            !function(e, t) {
                t.tagID === qo.HTML ? Nc(e, t) : qc(e, t)
            }(this, e);
            break;
        case Qa.IN_FRAMESET:
            !function(e, t) {
                switch (t.tagID) {
                case qo.HTML:
                    Nc(e, t);
                    break;
                case qo.FRAMESET:
                    e._insertElement(t, wo.HTML);
                    break;
                case qo.FRAME:
                    e._appendElement(t, wo.HTML),
                    t.ackSelfClosing = !0;
                    break;
                case qo.NOFRAMES:
                    uc(e, t)
                }
            }(this, e);
            break;
        case Qa.AFTER_FRAMESET:
            !function(e, t) {
                switch (t.tagID) {
                case qo.HTML:
                    Nc(e, t);
                    break;
                case qo.NOFRAMES:
                    uc(e, t)
                }
            }(this, e);
            break;
        case Qa.AFTER_AFTER_BODY:
            !function(e, t) {
                t.tagID === qo.HTML ? Nc(e, t) : Vc(e, t)
            }(this, e);
            break;
        case Qa.AFTER_AFTER_FRAMESET:
            !function(e, t) {
                switch (t.tagID) {
                case qo.HTML:
                    Nc(e, t);
                    break;
                case qo.NOFRAMES:
                    uc(e, t)
                }
            }(this, e)
        }
    }
    onEndTag(e) {
        this.skipNextNewLine = !1,
        this.currentToken = e,
        this.currentNotInHTML ? function(e, t) {
            if (t.tagID === qo.P || t.tagID === qo.BR)
                return Qc(e),
                void e._endTagOutsideForeignContent(t);
            for (let n = e.openElements.stackTop; n > 0; n--) {
                const r = e.openElements.items[n];
                if (e.treeAdapter.getNamespaceURI(r) === wo.HTML) {
                    e._endTagOutsideForeignContent(t);
                    break
                }
                const i = e.treeAdapter.getTagName(r);
                if (i.toLowerCase() === t.tagName) {
                    t.tagName = i,
                    e.openElements.shortenToLength(n);
                    break
                }
            }
        }(this, e) : this._endTagOutsideForeignContent(e)
    }
    _endTagOutsideForeignContent(e) {
        switch (this.insertionMode) {
        case Qa.INITIAL:
            ac(this, e);
            break;
        case Qa.BEFORE_HTML:
            !function(e, t) {
                const n = t.tagID;
                n !== qo.HTML && n !== qo.HEAD && n !== qo.BODY && n !== qo.BR || cc(e, t)
            }(this, e);
            break;
        case Qa.BEFORE_HEAD:
            !function(e, t) {
                const n = t.tagID;
                n === qo.HEAD || n === qo.BODY || n === qo.HTML || n === qo.BR ? lc(e, t) : e._err(t, _o.endTagWithoutMatchingOpenElement)
            }(this, e);
            break;
        case Qa.IN_HEAD:
            !function(e, t) {
                switch (t.tagID) {
                case qo.HEAD:
                    e.openElements.pop(),
                    e.insertionMode = Qa.AFTER_HEAD;
                    break;
                case qo.BODY:
                case qo.BR:
                case qo.HTML:
                    pc(e, t);
                    break;
                case qo.TEMPLATE:
                    hc(e, t);
                    break;
                default:
                    e._err(t, _o.endTagWithoutMatchingOpenElement)
                }
            }(this, e);
            break;
        case Qa.IN_HEAD_NO_SCRIPT:
            !function(e, t) {
                switch (t.tagID) {
                case qo.NOSCRIPT:
                    e.openElements.pop(),
                    e.insertionMode = Qa.IN_HEAD;
                    break;
                case qo.BR:
                    dc(e, t);
                    break;
                default:
                    e._err(t, _o.endTagWithoutMatchingOpenElement)
                }
            }(this, e);
            break;
        case Qa.AFTER_HEAD:
            !function(e, t) {
                switch (t.tagID) {
                case qo.BODY:
                case qo.HTML:
                case qo.BR:
                    fc(e, t);
                    break;
                case qo.TEMPLATE:
                    hc(e, t);
                    break;
                default:
                    e._err(t, _o.endTagWithoutMatchingOpenElement)
                }
            }(this, e);
            break;
        case Qa.IN_BODY:
            Sc(this, e);
            break;
        case Qa.TEXT:
            !function(e, t) {
                var n;
                t.tagID === qo.SCRIPT && (null === (n = e.scriptHandler) || void 0 === n || n.call(e, e.openElements.current));
                e.openElements.pop(),
                e.insertionMode = e.originalInsertionMode
            }(this, e);
            break;
        case Qa.IN_TABLE:
            yc(this, e);
            break;
        case Qa.IN_TABLE_TEXT:
            Pc(this, e);
            break;
        case Qa.IN_CAPTION:
            !function(e, t) {
                const n = t.tagID;
                switch (n) {
                case qo.CAPTION:
                case qo.TABLE:
                    e.openElements.hasInTableScope(qo.CAPTION) && (e.openElements.generateImpliedEndTags(),
                    e.openElements.popUntilTagNamePopped(qo.CAPTION),
                    e.activeFormattingElements.clearToLastMarker(),
                    e.insertionMode = Qa.IN_TABLE,
                    n === qo.TABLE && yc(e, t));
                    break;
                case qo.BODY:
                case qo.COL:
                case qo.COLGROUP:
                case qo.HTML:
                case qo.TBODY:
                case qo.TD:
                case qo.TFOOT:
                case qo.TH:
                case qo.THEAD:
                case qo.TR:
                    break;
                default:
                    Sc(e, t)
                }
            }(this, e);
            break;
        case Qa.IN_COLUMN_GROUP:
            !function(e, t) {
                switch (t.tagID) {
                case qo.COLGROUP:
                    e.openElements.currentTagId === qo.COLGROUP && (e.openElements.pop(),
                    e.insertionMode = Qa.IN_TABLE);
                    break;
                case qo.TEMPLATE:
                    hc(e, t);
                    break;
                case qo.COL:
                    break;
                default:
                    vc(e, t)
                }
            }(this, e);
            break;
        case Qa.IN_TABLE_BODY:
            Fc(this, e);
            break;
        case Qa.IN_ROW:
            Hc(this, e);
            break;
        case Qa.IN_CELL:
            !function(e, t) {
                const n = t.tagID;
                switch (n) {
                case qo.TD:
                case qo.TH:
                    e.openElements.hasInTableScope(n) && (e.openElements.generateImpliedEndTags(),
                    e.openElements.popUntilTagNamePopped(n),
                    e.activeFormattingElements.clearToLastMarker(),
                    e.insertionMode = Qa.IN_ROW);
                    break;
                case qo.TABLE:
                case qo.TBODY:
                case qo.TFOOT:
                case qo.THEAD:
                case qo.TR:
                    e.openElements.hasInTableScope(n) && (e._closeTableCell(),
                    Hc(e, t));
                    break;
                case qo.BODY:
                case qo.CAPTION:
                case qo.COL:
                case qo.COLGROUP:
                case qo.HTML:
                    break;
                default:
                    Sc(e, t)
                }
            }(this, e);
            break;
        case Qa.IN_SELECT:
            Gc(this, e);
            break;
        case Qa.IN_SELECT_IN_TABLE:
            !function(e, t) {
                const n = t.tagID;
                n === qo.CAPTION || n === qo.TABLE || n === qo.TBODY || n === qo.TFOOT || n === qo.THEAD || n === qo.TR || n === qo.TD || n === qo.TH ? e.openElements.hasInTableScope(n) && (e.openElements.popUntilTagNamePopped(qo.SELECT),
                e._resetInsertionMode(),
                e.onEndTag(t)) : Gc(e, t)
            }(this, e);
            break;
        case Qa.IN_TEMPLATE:
            !function(e, t) {
                t.tagID === qo.TEMPLATE && hc(e, t)
            }(this, e);
            break;
        case Qa.AFTER_BODY:
            zc(this, e);
            break;
        case Qa.IN_FRAMESET:
            !function(e, t) {
                t.tagID !== qo.FRAMESET || e.openElements.isRootHtmlElementCurrent() || (e.openElements.pop(),
                e.fragmentContext || e.openElements.currentTagId === qo.FRAMESET || (e.insertionMode = Qa.AFTER_FRAMESET))
            }(this, e);
            break;
        case Qa.AFTER_FRAMESET:
            !function(e, t) {
                t.tagID === qo.HTML && (e.insertionMode = Qa.AFTER_AFTER_FRAMESET)
            }(this, e);
            break;
        case Qa.AFTER_AFTER_BODY:
            Vc(this, e)
        }
    }
    onEof(e) {
        switch (this.insertionMode) {
        case Qa.INITIAL:
            ac(this, e);
            break;
        case Qa.BEFORE_HTML:
            cc(this, e);
            break;
        case Qa.BEFORE_HEAD:
            lc(this, e);
            break;
        case Qa.IN_HEAD:
            pc(this, e);
            break;
        case Qa.IN_HEAD_NO_SCRIPT:
            dc(this, e);
            break;
        case Qa.AFTER_HEAD:
            fc(this, e);
            break;
        case Qa.IN_BODY:
        case Qa.IN_TABLE:
        case Qa.IN_CAPTION:
        case Qa.IN_COLUMN_GROUP:
        case Qa.IN_TABLE_BODY:
        case Qa.IN_ROW:
        case Qa.IN_CELL:
        case Qa.IN_SELECT:
        case Qa.IN_SELECT_IN_TABLE:
            Cc(this, e);
            break;
        case Qa.TEXT:
            !function(e, t) {
                e._err(t, _o.eofInElementThatCanContainOnlyText),
                e.openElements.pop(),
                e.insertionMode = e.originalInsertionMode,
                e.onEof(t)
            }(this, e);
            break;
        case Qa.IN_TABLE_TEXT:
            Pc(this, e);
            break;
        case Qa.IN_TEMPLATE:
            Yc(this, e);
            break;
        case Qa.AFTER_BODY:
        case Qa.IN_FRAMESET:
        case Qa.AFTER_FRAMESET:
        case Qa.AFTER_AFTER_BODY:
        case Qa.AFTER_AFTER_FRAMESET:
            oc(this, e)
        }
    }
    onWhitespaceCharacter(e) {
        if (this.skipNextNewLine && (this.skipNextNewLine = !1,
        e.chars.charCodeAt(0) === co.LINE_FEED)) {
            if (1 === e.chars.length)
                return;
            e.chars = e.chars.substr(1)
        }
        if (this.tokenizer.inForeignNode)
            this._insertCharacters(e);
        else
            switch (this.insertionMode) {
            case Qa.IN_HEAD:
            case Qa.IN_HEAD_NO_SCRIPT:
            case Qa.AFTER_HEAD:
            case Qa.TEXT:
            case Qa.IN_COLUMN_GROUP:
            case Qa.IN_SELECT:
            case Qa.IN_SELECT_IN_TABLE:
            case Qa.IN_FRAMESET:
            case Qa.AFTER_FRAMESET:
                this._insertCharacters(e);
                break;
            case Qa.IN_BODY:
            case Qa.IN_CAPTION:
            case Qa.IN_CELL:
            case Qa.IN_TEMPLATE:
            case Qa.AFTER_BODY:
            case Qa.AFTER_AFTER_BODY:
            case Qa.AFTER_AFTER_FRAMESET:
                Ec(this, e);
                break;
            case Qa.IN_TABLE:
            case Qa.IN_TABLE_BODY:
            case Qa.IN_ROW:
                Dc(this, e);
                break;
            case Qa.IN_TABLE_TEXT:
                Rc(this, e)
            }
    }
}
function $a(e, t) {
    let n = e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);
    return n ? e.openElements.contains(n.element) ? e.openElements.hasInScope(t.tagID) || (n = null) : (e.activeFormattingElements.removeEntry(n),
    n = null) : kc(e, t),
    n
}
function Za(e, t) {
    let n = null
      , r = e.openElements.stackTop;
    for (; r >= 0; r--) {
        const i = e.openElements.items[r];
        if (i === t.element)
            break;
        e._isSpecialElement(i, e.openElements.tagIDs[r]) && (n = i)
    }
    return n || (e.openElements.shortenToLength(Math.max(r, 0)),
    e.activeFormattingElements.removeEntry(t)),
    n
}
function ec(e, t, n) {
    let r = t
      , i = e.openElements.getCommonAncestor(t);
    for (let s = 0, o = i; o !== n; s++,
    o = i) {
        i = e.openElements.getCommonAncestor(o);
        const n = e.activeFormattingElements.getElementEntry(o)
          , a = n && s >= 3;
        !n || a ? (a && e.activeFormattingElements.removeEntry(n),
        e.openElements.remove(o)) : (o = tc(e, n),
        r === t && (e.activeFormattingElements.bookmark = n),
        e.treeAdapter.detachNode(r),
        e.treeAdapter.appendChild(o, r),
        r = o)
    }
    return r
}
function tc(e, t) {
    const n = e.treeAdapter.getNamespaceURI(t.element)
      , r = e.treeAdapter.createElement(t.token.tagName, n, t.token.attrs);
    return e.openElements.replace(t.element, r),
    t.element = r,
    r
}
function nc(e, t, n) {
    const r = $o(e.treeAdapter.getTagName(t));
    if (e._isElementCausesFosterParenting(r))
        e._fosterParentElement(n);
    else {
        const i = e.treeAdapter.getNamespaceURI(t);
        r === qo.TEMPLATE && i === wo.HTML && (t = e.treeAdapter.getTemplateContent(t)),
        e.treeAdapter.appendChild(t, n)
    }
}
function rc(e, t, n) {
    const r = e.treeAdapter.getNamespaceURI(n.element)
      , {token: i} = n
      , s = e.treeAdapter.createElement(i.tagName, r, i.attrs);
    e._adoptNodes(t, s),
    e.treeAdapter.appendChild(t, s),
    e.activeFormattingElements.insertElementAfterBookmark(s, i),
    e.activeFormattingElements.removeEntry(n),
    e.openElements.remove(n.element),
    e.openElements.insertAfter(t, s, i.tagID)
}
function ic(e, t) {
    for (let n = 0; n < 8; n++) {
        const n = $a(e, t);
        if (!n)
            break;
        const r = Za(e, n);
        if (!r)
            break;
        e.activeFormattingElements.bookmark = n;
        const i = ec(e, r, n.element)
          , s = e.openElements.getCommonAncestor(n.element);
        e.treeAdapter.detachNode(i),
        s && nc(e, s, i),
        rc(e, r, n)
    }
}
function sc(e, t) {
    e._appendCommentNode(t, e.openElements.currentTmplContentOrNode)
}
function oc(e, t) {
    if (e.stopped = !0,
    t.location) {
        const n = e.fragmentContext ? 0 : 2;
        for (let r = e.openElements.stackTop; r >= n; r--)
            e._setEndLocation(e.openElements.items[r], t);
        if (!e.fragmentContext && e.openElements.stackTop >= 0) {
            const n = e.openElements.items[0]
              , r = e.treeAdapter.getNodeSourceCodeLocation(n);
            if (r && !r.endTag && (e._setEndLocation(n, t),
            e.openElements.stackTop >= 1)) {
                const n = e.openElements.items[1]
                  , r = e.treeAdapter.getNodeSourceCodeLocation(n);
                r && !r.endTag && e._setEndLocation(n, t)
            }
        }
    }
}
function ac(e, t) {
    e._err(t, _o.missingDoctype, !0),
    e.treeAdapter.setDocumentMode(e.document, Uo.QUIRKS),
    e.insertionMode = Qa.BEFORE_HTML,
    e._processToken(t)
}
function cc(e, t) {
    e._insertFakeRootElement(),
    e.insertionMode = Qa.BEFORE_HEAD,
    e._processToken(t)
}
function lc(e, t) {
    e._insertFakeElement(Yo.HEAD, qo.HEAD),
    e.headElement = e.openElements.current,
    e.insertionMode = Qa.IN_HEAD,
    e._processToken(t)
}
function uc(e, t) {
    switch (t.tagID) {
    case qo.HTML:
        Nc(e, t);
        break;
    case qo.BASE:
    case qo.BASEFONT:
    case qo.BGSOUND:
    case qo.LINK:
    case qo.META:
        e._appendElement(t, wo.HTML),
        t.ackSelfClosing = !0;
        break;
    case qo.TITLE:
        e._switchToTextParsing(t, ia.RCDATA);
        break;
    case qo.NOSCRIPT:
        e.options.scriptingEnabled ? e._switchToTextParsing(t, ia.RAWTEXT) : (e._insertElement(t, wo.HTML),
        e.insertionMode = Qa.IN_HEAD_NO_SCRIPT);
        break;
    case qo.NOFRAMES:
    case qo.STYLE:
        e._switchToTextParsing(t, ia.RAWTEXT);
        break;
    case qo.SCRIPT:
        e._switchToTextParsing(t, ia.SCRIPT_DATA);
        break;
    case qo.TEMPLATE:
        e._insertTemplate(t),
        e.activeFormattingElements.insertMarker(),
        e.framesetOk = !1,
        e.insertionMode = Qa.IN_TEMPLATE,
        e.tmplInsertionModeStack.unshift(Qa.IN_TEMPLATE);
        break;
    case qo.HEAD:
        e._err(t, _o.misplacedStartTagForHeadElement);
        break;
    default:
        pc(e, t)
    }
}
function hc(e, t) {
    e.openElements.tmplCount > 0 ? (e.openElements.generateImpliedEndTagsThoroughly(),
    e.openElements.currentTagId !== qo.TEMPLATE && e._err(t, _o.closingOfElementWithOpenChildElements),
    e.openElements.popUntilTagNamePopped(qo.TEMPLATE),
    e.activeFormattingElements.clearToLastMarker(),
    e.tmplInsertionModeStack.shift(),
    e._resetInsertionMode()) : e._err(t, _o.endTagWithoutMatchingOpenElement)
}
function pc(e, t) {
    e.openElements.pop(),
    e.insertionMode = Qa.AFTER_HEAD,
    e._processToken(t)
}
function dc(e, t) {
    const n = t.type === ko.EOF ? _o.openElementsLeftAfterEof : _o.disallowedContentInNoscriptInHead;
    e._err(t, n),
    e.openElements.pop(),
    e.insertionMode = Qa.IN_HEAD,
    e._processToken(t)
}
function fc(e, t) {
    e._insertFakeElement(Yo.BODY, qo.BODY),
    e.insertionMode = Qa.IN_BODY,
    mc(e, t)
}
function mc(e, t) {
    switch (t.type) {
    case ko.CHARACTER:
        Tc(e, t);
        break;
    case ko.WHITESPACE_CHARACTER:
        Ec(e, t);
        break;
    case ko.COMMENT:
        sc(e, t);
        break;
    case ko.START_TAG:
        Nc(e, t);
        break;
    case ko.END_TAG:
        Sc(e, t);
        break;
    case ko.EOF:
        Cc(e, t)
    }
}
function Ec(e, t) {
    e._reconstructActiveFormattingElements(),
    e._insertCharacters(t)
}
function Tc(e, t) {
    e._reconstructActiveFormattingElements(),
    e._insertCharacters(t),
    e.framesetOk = !1
}
function gc(e, t) {
    e._reconstructActiveFormattingElements(),
    e._appendElement(t, wo.HTML),
    e.framesetOk = !1,
    t.ackSelfClosing = !0
}
function Ac(e) {
    const t = Co(e, Bo.TYPE);
    return null != t && "hidden" === t.toLowerCase()
}
function _c(e, t) {
    e._switchToTextParsing(t, ia.RAWTEXT)
}
function Ic(e, t) {
    e._reconstructActiveFormattingElements(),
    e._insertElement(t, wo.HTML)
}
function Nc(e, t) {
    switch (t.tagID) {
    case qo.I:
    case qo.S:
    case qo.B:
    case qo.U:
    case qo.EM:
    case qo.TT:
    case qo.BIG:
    case qo.CODE:
    case qo.FONT:
    case qo.SMALL:
    case qo.STRIKE:
    case qo.STRONG:
        !function(e, t) {
            e._reconstructActiveFormattingElements(),
            e._insertElement(t, wo.HTML),
            e.activeFormattingElements.pushElement(e.openElements.current, t)
        }(e, t);
        break;
    case qo.A:
        !function(e, t) {
            const n = e.activeFormattingElements.getElementEntryInScopeWithTagName(Yo.A);
            n && (ic(e, t),
            e.openElements.remove(n.element),
            e.activeFormattingElements.removeEntry(n)),
            e._reconstructActiveFormattingElements(),
            e._insertElement(t, wo.HTML),
            e.activeFormattingElements.pushElement(e.openElements.current, t)
        }(e, t);
        break;
    case qo.H1:
    case qo.H2:
    case qo.H3:
    case qo.H4:
    case qo.H5:
    case qo.H6:
        !function(e, t) {
            e.openElements.hasInButtonScope(qo.P) && e._closePElement(),
            void 0 !== e.openElements.currentTagId && ta.has(e.openElements.currentTagId) && e.openElements.pop(),
            e._insertElement(t, wo.HTML)
        }(e, t);
        break;
    case qo.P:
    case qo.DL:
    case qo.OL:
    case qo.UL:
    case qo.DIV:
    case qo.DIR:
    case qo.NAV:
    case qo.MAIN:
    case qo.MENU:
    case qo.ASIDE:
    case qo.CENTER:
    case qo.FIGURE:
    case qo.FOOTER:
    case qo.HEADER:
    case qo.HGROUP:
    case qo.DIALOG:
    case qo.DETAILS:
    case qo.ADDRESS:
    case qo.ARTICLE:
    case qo.SEARCH:
    case qo.SECTION:
    case qo.SUMMARY:
    case qo.FIELDSET:
    case qo.BLOCKQUOTE:
    case qo.FIGCAPTION:
        !function(e, t) {
            e.openElements.hasInButtonScope(qo.P) && e._closePElement(),
            e._insertElement(t, wo.HTML)
        }(e, t);
        break;
    case qo.LI:
    case qo.DD:
    case qo.DT:
        !function(e, t) {
            e.framesetOk = !1;
            const n = t.tagID;
            for (let r = e.openElements.stackTop; r >= 0; r--) {
                const t = e.openElements.tagIDs[r];
                if (n === qo.LI && t === qo.LI || (n === qo.DD || n === qo.DT) && (t === qo.DD || t === qo.DT)) {
                    e.openElements.generateImpliedEndTagsWithExclusion(t),
                    e.openElements.popUntilTagNamePopped(t);
                    break
                }
                if (t !== qo.ADDRESS && t !== qo.DIV && t !== qo.P && e._isSpecialElement(e.openElements.items[r], t))
                    break
            }
            e.openElements.hasInButtonScope(qo.P) && e._closePElement(),
            e._insertElement(t, wo.HTML)
        }(e, t);
        break;
    case qo.BR:
    case qo.IMG:
    case qo.WBR:
    case qo.AREA:
    case qo.EMBED:
    case qo.KEYGEN:
        gc(e, t);
        break;
    case qo.HR:
        !function(e, t) {
            e.openElements.hasInButtonScope(qo.P) && e._closePElement(),
            e._appendElement(t, wo.HTML),
            e.framesetOk = !1,
            t.ackSelfClosing = !0
        }(e, t);
        break;
    case qo.RB:
    case qo.RTC:
        !function(e, t) {
            e.openElements.hasInScope(qo.RUBY) && e.openElements.generateImpliedEndTags(),
            e._insertElement(t, wo.HTML)
        }(e, t);
        break;
    case qo.RT:
    case qo.RP:
        !function(e, t) {
            e.openElements.hasInScope(qo.RUBY) && e.openElements.generateImpliedEndTagsWithExclusion(qo.RTC),
            e._insertElement(t, wo.HTML)
        }(e, t);
        break;
    case qo.PRE:
    case qo.LISTING:
        !function(e, t) {
            e.openElements.hasInButtonScope(qo.P) && e._closePElement(),
            e._insertElement(t, wo.HTML),
            e.skipNextNewLine = !0,
            e.framesetOk = !1
        }(e, t);
        break;
    case qo.XMP:
        !function(e, t) {
            e.openElements.hasInButtonScope(qo.P) && e._closePElement(),
            e._reconstructActiveFormattingElements(),
            e.framesetOk = !1,
            e._switchToTextParsing(t, ia.RAWTEXT)
        }(e, t);
        break;
    case qo.SVG:
        !function(e, t) {
            e._reconstructActiveFormattingElements(),
            za(t),
            qa(t),
            t.selfClosing ? e._appendElement(t, wo.SVG) : e._insertElement(t, wo.SVG),
            t.ackSelfClosing = !0
        }(e, t);
        break;
    case qo.HTML:
        !function(e, t) {
            0 === e.openElements.tmplCount && e.treeAdapter.adoptAttributes(e.openElements.items[0], t.attrs)
        }(e, t);
        break;
    case qo.BASE:
    case qo.LINK:
    case qo.META:
    case qo.STYLE:
    case qo.TITLE:
    case qo.SCRIPT:
    case qo.BGSOUND:
    case qo.BASEFONT:
    case qo.TEMPLATE:
        uc(e, t);
        break;
    case qo.BODY:
        !function(e, t) {
            const n = e.openElements.tryPeekProperlyNestedBodyElement();
            n && 0 === e.openElements.tmplCount && (e.framesetOk = !1,
            e.treeAdapter.adoptAttributes(n, t.attrs))
        }(e, t);
        break;
    case qo.FORM:
        !function(e, t) {
            const n = e.openElements.tmplCount > 0;
            e.formElement && !n || (e.openElements.hasInButtonScope(qo.P) && e._closePElement(),
            e._insertElement(t, wo.HTML),
            n || (e.formElement = e.openElements.current))
        }(e, t);
        break;
    case qo.NOBR:
        !function(e, t) {
            e._reconstructActiveFormattingElements(),
            e.openElements.hasInScope(qo.NOBR) && (ic(e, t),
            e._reconstructActiveFormattingElements()),
            e._insertElement(t, wo.HTML),
            e.activeFormattingElements.pushElement(e.openElements.current, t)
        }(e, t);
        break;
    case qo.MATH:
        !function(e, t) {
            e._reconstructActiveFormattingElements(),
            Ya(t),
            qa(t),
            t.selfClosing ? e._appendElement(t, wo.MATHML) : e._insertElement(t, wo.MATHML),
            t.ackSelfClosing = !0
        }(e, t);
        break;
    case qo.TABLE:
        !function(e, t) {
            e.treeAdapter.getDocumentMode(e.document) !== Uo.QUIRKS && e.openElements.hasInButtonScope(qo.P) && e._closePElement(),
            e._insertElement(t, wo.HTML),
            e.framesetOk = !1,
            e.insertionMode = Qa.IN_TABLE
        }(e, t);
        break;
    case qo.INPUT:
        !function(e, t) {
            e._reconstructActiveFormattingElements(),
            e._appendElement(t, wo.HTML),
            Ac(t) || (e.framesetOk = !1),
            t.ackSelfClosing = !0
        }(e, t);
        break;
    case qo.PARAM:
    case qo.TRACK:
    case qo.SOURCE:
        !function(e, t) {
            e._appendElement(t, wo.HTML),
            t.ackSelfClosing = !0
        }(e, t);
        break;
    case qo.IMAGE:
        !function(e, t) {
            t.tagName = Yo.IMG,
            t.tagID = qo.IMG,
            gc(e, t)
        }(e, t);
        break;
    case qo.BUTTON:
        !function(e, t) {
            e.openElements.hasInScope(qo.BUTTON) && (e.openElements.generateImpliedEndTags(),
            e.openElements.popUntilTagNamePopped(qo.BUTTON)),
            e._reconstructActiveFormattingElements(),
            e._insertElement(t, wo.HTML),
            e.framesetOk = !1
        }(e, t);
        break;
    case qo.APPLET:
    case qo.OBJECT:
    case qo.MARQUEE:
        !function(e, t) {
            e._reconstructActiveFormattingElements(),
            e._insertElement(t, wo.HTML),
            e.activeFormattingElements.insertMarker(),
            e.framesetOk = !1
        }(e, t);
        break;
    case qo.IFRAME:
        !function(e, t) {
            e.framesetOk = !1,
            e._switchToTextParsing(t, ia.RAWTEXT)
        }(e, t);
        break;
    case qo.SELECT:
        !function(e, t) {
            e._reconstructActiveFormattingElements(),
            e._insertElement(t, wo.HTML),
            e.framesetOk = !1,
            e.insertionMode = e.insertionMode === Qa.IN_TABLE || e.insertionMode === Qa.IN_CAPTION || e.insertionMode === Qa.IN_TABLE_BODY || e.insertionMode === Qa.IN_ROW || e.insertionMode === Qa.IN_CELL ? Qa.IN_SELECT_IN_TABLE : Qa.IN_SELECT
        }(e, t);
        break;
    case qo.OPTION:
    case qo.OPTGROUP:
        !function(e, t) {
            e.openElements.currentTagId === qo.OPTION && e.openElements.pop(),
            e._reconstructActiveFormattingElements(),
            e._insertElement(t, wo.HTML)
        }(e, t);
        break;
    case qo.NOEMBED:
    case qo.NOFRAMES:
        _c(e, t);
        break;
    case qo.FRAMESET:
        !function(e, t) {
            const n = e.openElements.tryPeekProperlyNestedBodyElement();
            e.framesetOk && n && (e.treeAdapter.detachNode(n),
            e.openElements.popAllUpToHtmlElement(),
            e._insertElement(t, wo.HTML),
            e.insertionMode = Qa.IN_FRAMESET)
        }(e, t);
        break;
    case qo.TEXTAREA:
        !function(e, t) {
            e._insertElement(t, wo.HTML),
            e.skipNextNewLine = !0,
            e.tokenizer.state = ia.RCDATA,
            e.originalInsertionMode = e.insertionMode,
            e.framesetOk = !1,
            e.insertionMode = Qa.TEXT
        }(e, t);
        break;
    case qo.NOSCRIPT:
        e.options.scriptingEnabled ? _c(e, t) : Ic(e, t);
        break;
    case qo.PLAINTEXT:
        !function(e, t) {
            e.openElements.hasInButtonScope(qo.P) && e._closePElement(),
            e._insertElement(t, wo.HTML),
            e.tokenizer.state = ia.PLAINTEXT
        }(e, t);
        break;
    case qo.COL:
    case qo.TH:
    case qo.TD:
    case qo.TR:
    case qo.HEAD:
    case qo.FRAME:
    case qo.TBODY:
    case qo.TFOOT:
    case qo.THEAD:
    case qo.CAPTION:
    case qo.COLGROUP:
        break;
    default:
        Ic(e, t)
    }
}
function kc(e, t) {
    const n = t.tagName
      , r = t.tagID;
    for (let i = e.openElements.stackTop; i > 0; i--) {
        const t = e.openElements.items[i]
          , s = e.openElements.tagIDs[i];
        if (r === s && (r !== qo.UNKNOWN || e.treeAdapter.getTagName(t) === n)) {
            e.openElements.generateImpliedEndTagsWithExclusion(r),
            e.openElements.stackTop >= i && e.openElements.shortenToLength(i);
            break
        }
        if (e._isSpecialElement(t, s))
            break
    }
}
function Sc(e, t) {
    switch (t.tagID) {
    case qo.A:
    case qo.B:
    case qo.I:
    case qo.S:
    case qo.U:
    case qo.EM:
    case qo.TT:
    case qo.BIG:
    case qo.CODE:
    case qo.FONT:
    case qo.NOBR:
    case qo.SMALL:
    case qo.STRIKE:
    case qo.STRONG:
        ic(e, t);
        break;
    case qo.P:
        !function(e) {
            e.openElements.hasInButtonScope(qo.P) || e._insertFakeElement(Yo.P, qo.P),
            e._closePElement()
        }(e);
        break;
    case qo.DL:
    case qo.UL:
    case qo.OL:
    case qo.DIR:
    case qo.DIV:
    case qo.NAV:
    case qo.PRE:
    case qo.MAIN:
    case qo.MENU:
    case qo.ASIDE:
    case qo.BUTTON:
    case qo.CENTER:
    case qo.FIGURE:
    case qo.FOOTER:
    case qo.HEADER:
    case qo.HGROUP:
    case qo.DIALOG:
    case qo.ADDRESS:
    case qo.ARTICLE:
    case qo.DETAILS:
    case qo.SEARCH:
    case qo.SECTION:
    case qo.SUMMARY:
    case qo.LISTING:
    case qo.FIELDSET:
    case qo.BLOCKQUOTE:
    case qo.FIGCAPTION:
        !function(e, t) {
            const n = t.tagID;
            e.openElements.hasInScope(n) && (e.openElements.generateImpliedEndTags(),
            e.openElements.popUntilTagNamePopped(n))
        }(e, t);
        break;
    case qo.LI:
        !function(e) {
            e.openElements.hasInListItemScope(qo.LI) && (e.openElements.generateImpliedEndTagsWithExclusion(qo.LI),
            e.openElements.popUntilTagNamePopped(qo.LI))
        }(e);
        break;
    case qo.DD:
    case qo.DT:
        !function(e, t) {
            const n = t.tagID;
            e.openElements.hasInScope(n) && (e.openElements.generateImpliedEndTagsWithExclusion(n),
            e.openElements.popUntilTagNamePopped(n))
        }(e, t);
        break;
    case qo.H1:
    case qo.H2:
    case qo.H3:
    case qo.H4:
    case qo.H5:
    case qo.H6:
        !function(e) {
            e.openElements.hasNumberedHeaderInScope() && (e.openElements.generateImpliedEndTags(),
            e.openElements.popUntilNumberedHeaderPopped())
        }(e);
        break;
    case qo.BR:
        !function(e) {
            e._reconstructActiveFormattingElements(),
            e._insertFakeElement(Yo.BR, qo.BR),
            e.openElements.pop(),
            e.framesetOk = !1
        }(e);
        break;
    case qo.BODY:
        !function(e, t) {
            if (e.openElements.hasInScope(qo.BODY) && (e.insertionMode = Qa.AFTER_BODY,
            e.options.sourceCodeLocationInfo)) {
                const n = e.openElements.tryPeekProperlyNestedBodyElement();
                n && e._setEndLocation(n, t)
            }
        }(e, t);
        break;
    case qo.HTML:
        !function(e, t) {
            e.openElements.hasInScope(qo.BODY) && (e.insertionMode = Qa.AFTER_BODY,
            zc(e, t))
        }(e, t);
        break;
    case qo.FORM:
        !function(e) {
            const t = e.openElements.tmplCount > 0
              , {formElement: n} = e;
            t || (e.formElement = null),
            (n || t) && e.openElements.hasInScope(qo.FORM) && (e.openElements.generateImpliedEndTags(),
            t ? e.openElements.popUntilTagNamePopped(qo.FORM) : n && e.openElements.remove(n))
        }(e);
        break;
    case qo.APPLET:
    case qo.OBJECT:
    case qo.MARQUEE:
        !function(e, t) {
            const n = t.tagID;
            e.openElements.hasInScope(n) && (e.openElements.generateImpliedEndTags(),
            e.openElements.popUntilTagNamePopped(n),
            e.activeFormattingElements.clearToLastMarker())
        }(e, t);
        break;
    case qo.TEMPLATE:
        hc(e, t);
        break;
    default:
        kc(e, t)
    }
}
function Cc(e, t) {
    e.tmplInsertionModeStack.length > 0 ? Yc(e, t) : oc(e, t)
}
function Dc(e, t) {
    if (void 0 !== e.openElements.currentTagId && Ka.has(e.openElements.currentTagId))
        switch (e.pendingCharacterTokens.length = 0,
        e.hasNonWhitespacePendingCharacterToken = !1,
        e.originalInsertionMode = e.insertionMode,
        e.insertionMode = Qa.IN_TABLE_TEXT,
        t.type) {
        case ko.CHARACTER:
            Lc(e, t);
            break;
        case ko.WHITESPACE_CHARACTER:
            Rc(e, t)
        }
    else
        bc(e, t)
}
function Oc(e, t) {
    switch (t.tagID) {
    case qo.TD:
    case qo.TH:
    case qo.TR:
        !function(e, t) {
            e.openElements.clearBackToTableContext(),
            e._insertFakeElement(Yo.TBODY, qo.TBODY),
            e.insertionMode = Qa.IN_TABLE_BODY,
            wc(e, t)
        }(e, t);
        break;
    case qo.STYLE:
    case qo.SCRIPT:
    case qo.TEMPLATE:
        uc(e, t);
        break;
    case qo.COL:
        !function(e, t) {
            e.openElements.clearBackToTableContext(),
            e._insertFakeElement(Yo.COLGROUP, qo.COLGROUP),
            e.insertionMode = Qa.IN_COLUMN_GROUP,
            xc(e, t)
        }(e, t);
        break;
    case qo.FORM:
        !function(e, t) {
            e.formElement || 0 !== e.openElements.tmplCount || (e._insertElement(t, wo.HTML),
            e.formElement = e.openElements.current,
            e.openElements.pop())
        }(e, t);
        break;
    case qo.TABLE:
        !function(e, t) {
            e.openElements.hasInTableScope(qo.TABLE) && (e.openElements.popUntilTagNamePopped(qo.TABLE),
            e._resetInsertionMode(),
            e._processStartTag(t))
        }(e, t);
        break;
    case qo.TBODY:
    case qo.TFOOT:
    case qo.THEAD:
        !function(e, t) {
            e.openElements.clearBackToTableContext(),
            e._insertElement(t, wo.HTML),
            e.insertionMode = Qa.IN_TABLE_BODY
        }(e, t);
        break;
    case qo.INPUT:
        !function(e, t) {
            Ac(t) ? e._appendElement(t, wo.HTML) : bc(e, t),
            t.ackSelfClosing = !0
        }(e, t);
        break;
    case qo.CAPTION:
        !function(e, t) {
            e.openElements.clearBackToTableContext(),
            e.activeFormattingElements.insertMarker(),
            e._insertElement(t, wo.HTML),
            e.insertionMode = Qa.IN_CAPTION
        }(e, t);
        break;
    case qo.COLGROUP:
        !function(e, t) {
            e.openElements.clearBackToTableContext(),
            e._insertElement(t, wo.HTML),
            e.insertionMode = Qa.IN_COLUMN_GROUP
        }(e, t);
        break;
    default:
        bc(e, t)
    }
}
function yc(e, t) {
    switch (t.tagID) {
    case qo.TABLE:
        e.openElements.hasInTableScope(qo.TABLE) && (e.openElements.popUntilTagNamePopped(qo.TABLE),
        e._resetInsertionMode());
        break;
    case qo.TEMPLATE:
        hc(e, t);
        break;
    case qo.BODY:
    case qo.CAPTION:
    case qo.COL:
    case qo.COLGROUP:
    case qo.HTML:
    case qo.TBODY:
    case qo.TD:
    case qo.TFOOT:
    case qo.TH:
    case qo.THEAD:
    case qo.TR:
        break;
    default:
        bc(e, t)
    }
}
function bc(e, t) {
    const n = e.fosterParentingEnabled;
    e.fosterParentingEnabled = !0,
    mc(e, t),
    e.fosterParentingEnabled = n
}
function Rc(e, t) {
    e.pendingCharacterTokens.push(t)
}
function Lc(e, t) {
    e.pendingCharacterTokens.push(t),
    e.hasNonWhitespacePendingCharacterToken = !0
}
function Pc(e, t) {
    let n = 0;
    if (e.hasNonWhitespacePendingCharacterToken)
        for (; n < e.pendingCharacterTokens.length; n++)
            bc(e, e.pendingCharacterTokens[n]);
    else
        for (; n < e.pendingCharacterTokens.length; n++)
            e._insertCharacters(e.pendingCharacterTokens[n]);
    e.insertionMode = e.originalInsertionMode,
    e._processToken(t)
}
const Mc = new Set([qo.CAPTION, qo.COL, qo.COLGROUP, qo.TBODY, qo.TD, qo.TFOOT, qo.TH, qo.THEAD, qo.TR]);
function xc(e, t) {
    switch (t.tagID) {
    case qo.HTML:
        Nc(e, t);
        break;
    case qo.COL:
        e._appendElement(t, wo.HTML),
        t.ackSelfClosing = !0;
        break;
    case qo.TEMPLATE:
        uc(e, t);
        break;
    default:
        vc(e, t)
    }
}
function vc(e, t) {
    e.openElements.currentTagId === qo.COLGROUP && (e.openElements.pop(),
    e.insertionMode = Qa.IN_TABLE,
    e._processToken(t))
}
function wc(e, t) {
    switch (t.tagID) {
    case qo.TR:
        e.openElements.clearBackToTableBodyContext(),
        e._insertElement(t, wo.HTML),
        e.insertionMode = Qa.IN_ROW;
        break;
    case qo.TH:
    case qo.TD:
        e.openElements.clearBackToTableBodyContext(),
        e._insertFakeElement(Yo.TR, qo.TR),
        e.insertionMode = Qa.IN_ROW,
        Bc(e, t);
        break;
    case qo.CAPTION:
    case qo.COL:
    case qo.COLGROUP:
    case qo.TBODY:
    case qo.TFOOT:
    case qo.THEAD:
        e.openElements.hasTableBodyContextInTableScope() && (e.openElements.clearBackToTableBodyContext(),
        e.openElements.pop(),
        e.insertionMode = Qa.IN_TABLE,
        Oc(e, t));
        break;
    default:
        Oc(e, t)
    }
}
function Fc(e, t) {
    const n = t.tagID;
    switch (t.tagID) {
    case qo.TBODY:
    case qo.TFOOT:
    case qo.THEAD:
        e.openElements.hasInTableScope(n) && (e.openElements.clearBackToTableBodyContext(),
        e.openElements.pop(),
        e.insertionMode = Qa.IN_TABLE);
        break;
    case qo.TABLE:
        e.openElements.hasTableBodyContextInTableScope() && (e.openElements.clearBackToTableBodyContext(),
        e.openElements.pop(),
        e.insertionMode = Qa.IN_TABLE,
        yc(e, t));
        break;
    case qo.BODY:
    case qo.CAPTION:
    case qo.COL:
    case qo.COLGROUP:
    case qo.HTML:
    case qo.TD:
    case qo.TH:
    case qo.TR:
        break;
    default:
        yc(e, t)
    }
}
function Bc(e, t) {
    switch (t.tagID) {
    case qo.TH:
    case qo.TD:
        e.openElements.clearBackToTableRowContext(),
        e._insertElement(t, wo.HTML),
        e.insertionMode = Qa.IN_CELL,
        e.activeFormattingElements.insertMarker();
        break;
    case qo.CAPTION:
    case qo.COL:
    case qo.COLGROUP:
    case qo.TBODY:
    case qo.TFOOT:
    case qo.THEAD:
    case qo.TR:
        e.openElements.hasInTableScope(qo.TR) && (e.openElements.clearBackToTableRowContext(),
        e.openElements.pop(),
        e.insertionMode = Qa.IN_TABLE_BODY,
        wc(e, t));
        break;
    default:
        Oc(e, t)
    }
}
function Hc(e, t) {
    switch (t.tagID) {
    case qo.TR:
        e.openElements.hasInTableScope(qo.TR) && (e.openElements.clearBackToTableRowContext(),
        e.openElements.pop(),
        e.insertionMode = Qa.IN_TABLE_BODY);
        break;
    case qo.TABLE:
        e.openElements.hasInTableScope(qo.TR) && (e.openElements.clearBackToTableRowContext(),
        e.openElements.pop(),
        e.insertionMode = Qa.IN_TABLE_BODY,
        Fc(e, t));
        break;
    case qo.TBODY:
    case qo.TFOOT:
    case qo.THEAD:
        (e.openElements.hasInTableScope(t.tagID) || e.openElements.hasInTableScope(qo.TR)) && (e.openElements.clearBackToTableRowContext(),
        e.openElements.pop(),
        e.insertionMode = Qa.IN_TABLE_BODY,
        Fc(e, t));
        break;
    case qo.BODY:
    case qo.CAPTION:
    case qo.COL:
    case qo.COLGROUP:
    case qo.HTML:
    case qo.TD:
    case qo.TH:
        break;
    default:
        yc(e, t)
    }
}
function Uc(e, t) {
    switch (t.tagID) {
    case qo.HTML:
        Nc(e, t);
        break;
    case qo.OPTION:
        e.openElements.currentTagId === qo.OPTION && e.openElements.pop(),
        e._insertElement(t, wo.HTML);
        break;
    case qo.OPTGROUP:
        e.openElements.currentTagId === qo.OPTION && e.openElements.pop(),
        e.openElements.currentTagId === qo.OPTGROUP && e.openElements.pop(),
        e._insertElement(t, wo.HTML);
        break;
    case qo.HR:
        e.openElements.currentTagId === qo.OPTION && e.openElements.pop(),
        e.openElements.currentTagId === qo.OPTGROUP && e.openElements.pop(),
        e._appendElement(t, wo.HTML),
        t.ackSelfClosing = !0;
        break;
    case qo.INPUT:
    case qo.KEYGEN:
    case qo.TEXTAREA:
    case qo.SELECT:
        e.openElements.hasInSelectScope(qo.SELECT) && (e.openElements.popUntilTagNamePopped(qo.SELECT),
        e._resetInsertionMode(),
        t.tagID !== qo.SELECT && e._processStartTag(t));
        break;
    case qo.SCRIPT:
    case qo.TEMPLATE:
        uc(e, t)
    }
}
function Gc(e, t) {
    switch (t.tagID) {
    case qo.OPTGROUP:
        e.openElements.stackTop > 0 && e.openElements.currentTagId === qo.OPTION && e.openElements.tagIDs[e.openElements.stackTop - 1] === qo.OPTGROUP && e.openElements.pop(),
        e.openElements.currentTagId === qo.OPTGROUP && e.openElements.pop();
        break;
    case qo.OPTION:
        e.openElements.currentTagId === qo.OPTION && e.openElements.pop();
        break;
    case qo.SELECT:
        e.openElements.hasInSelectScope(qo.SELECT) && (e.openElements.popUntilTagNamePopped(qo.SELECT),
        e._resetInsertionMode());
        break;
    case qo.TEMPLATE:
        hc(e, t)
    }
}
function Yc(e, t) {
    e.openElements.tmplCount > 0 ? (e.openElements.popUntilTagNamePopped(qo.TEMPLATE),
    e.activeFormattingElements.clearToLastMarker(),
    e.tmplInsertionModeStack.shift(),
    e._resetInsertionMode(),
    e.onEof(t)) : oc(e, t)
}
function zc(e, t) {
    var n;
    if (t.tagID === qo.HTML) {
        if (e.fragmentContext || (e.insertionMode = Qa.AFTER_AFTER_BODY),
        e.options.sourceCodeLocationInfo && e.openElements.tagIDs[0] === qo.HTML) {
            e._setEndLocation(e.openElements.items[0], t);
            const r = e.openElements.items[1];
            r && !(null === (n = e.treeAdapter.getNodeSourceCodeLocation(r)) || void 0 === n ? void 0 : n.endTag) && e._setEndLocation(r, t)
        }
    } else
        qc(e, t)
}
function qc(e, t) {
    e.insertionMode = Qa.IN_BODY,
    mc(e, t)
}
function Vc(e, t) {
    e.insertionMode = Qa.IN_BODY,
    mc(e, t)
}
function Qc(e) {
    for (; e.treeAdapter.getNamespaceURI(e.openElements.current) !== wo.HTML && void 0 !== e.openElements.currentTagId && !e._isIntegrationPoint(e.openElements.currentTagId, e.openElements.current); )
        e.openElements.pop()
}
Yo.AREA,
Yo.BASE,
Yo.BASEFONT,
Yo.BGSOUND,
Yo.BR,
Yo.COL,
Yo.EMBED,
Yo.FRAME,
Yo.HR,
Yo.IMG,
Yo.INPUT,
Yo.KEYGEN,
Yo.LINK,
Yo.META,
Yo.PARAM,
Yo.SOURCE,
Yo.TRACK,
Yo.WBR;
const jc = /<(\/?)(iframe|noembed|noframes|plaintext|script|style|textarea|title|xmp)(?=[\t\n\f\r />])/gi
  , Wc = new Set(["mdxFlowExpression", "mdxJsxFlowElement", "mdxJsxTextElement", "mdxTextExpression", "mdxjsEsm"])
  , Kc = {
    sourceCodeLocationInfo: !0,
    scriptingEnabled: !1
};
function Xc(e, t) {
    const n = function(e) {
        const t = "root" === e.type ? e.children[0] : e;
        return Boolean(t && ("doctype" === t.type || "element" === t.type && "html" === t.tagName.toLowerCase()))
    }(e)
      , r = Si("type", {
        handlers: {
            root: $c,
            element: Zc,
            text: el,
            comment: rl,
            doctype: tl,
            raw: il
        },
        unknown: sl
    })
      , i = {
        parser: n ? new Ja(Kc) : Ja.getFragmentParser(void 0, Kc),
        handle(e) {
            r(e, i)
        },
        stitches: !1,
        options: t || {}
    };
    r(e, i),
    ol(i, ce());
    const s = function(e, t) {
        const n = t || {};
        return Ws({
            file: n.file || void 0,
            location: !1,
            schema: "svg" === n.space ? j : Q,
            verbose: n.verbose || !1
        }, e)
    }(n ? i.parser.document : i.parser.getFragment(), {
        file: i.options.file
    });
    return i.stitches && er(s, "comment", function(e, t, n) {
        const r = e;
        if (r.value.stitch && n && void 0 !== t) {
            return n.children[t] = r.value.stitch,
            t
        }
    }),
    "root" === s.type && 1 === s.children.length && s.children[0].type === e.type ? s.children[0] : s
}
function Jc(e, t) {
    let n = -1;
    if (e)
        for (; ++n < e.length; )
            t.handle(e[n])
}
function $c(e, t) {
    Jc(e.children, t)
}
function Zc(e, t) {
    !function(e, t) {
        const n = e.tagName.toLowerCase();
        if (t.parser.tokenizer.state === ia.PLAINTEXT)
            return;
        ol(t, ce(e));
        const r = t.parser.openElements.current;
        let i = "namespaceURI"in r ? r.namespaceURI : Vs.html;
        i === Vs.html && "svg" === n && (i = Vs.svg);
        const s = function(e, t) {
            const n = (t || Zs).space;
            return to(e, "svg" === n ? j : Q)
        }({
            ...e,
            children: []
        }, {
            space: i === Vs.svg ? "svg" : "html"
        })
          , o = {
            type: ko.START_TAG,
            tagName: n,
            tagID: $o(n),
            selfClosing: !1,
            ackSelfClosing: !1,
            attrs: "attrs"in s ? s.attrs : [],
            location: cl(e)
        };
        t.parser.currentToken = o,
        t.parser._processToken(t.parser.currentToken),
        t.parser.tokenizer.lastStartTagName = n
    }(e, t),
    Jc(e.children, t),
    function(e, t) {
        const n = e.tagName.toLowerCase();
        if (!t.parser.tokenizer.inForeignNode && so.includes(n))
            return;
        if (t.parser.tokenizer.state === ia.PLAINTEXT)
            return;
        ol(t, ae(e));
        const r = {
            type: ko.END_TAG,
            tagName: n,
            tagID: $o(n),
            selfClosing: !1,
            ackSelfClosing: !1,
            attrs: [],
            location: cl(e)
        };
        t.parser.currentToken = r,
        t.parser._processToken(t.parser.currentToken),
        n !== t.parser.tokenizer.lastStartTagName || t.parser.tokenizer.state !== ia.RCDATA && t.parser.tokenizer.state !== ia.RAWTEXT && t.parser.tokenizer.state !== ia.SCRIPT_DATA || (t.parser.tokenizer.state = ia.DATA)
    }(e, t)
}
function el(e, t) {
    t.parser.tokenizer.state > 4 && (t.parser.tokenizer.state = 0);
    const n = {
        type: ko.CHARACTER,
        chars: e.value,
        location: cl(e)
    };
    ol(t, ce(e)),
    t.parser.currentToken = n,
    t.parser._processToken(t.parser.currentToken)
}
function tl(e, t) {
    const n = {
        type: ko.DOCTYPE,
        name: "html",
        forceQuirks: !1,
        publicId: "",
        systemId: "",
        location: cl(e)
    };
    ol(t, ce(e)),
    t.parser.currentToken = n,
    t.parser._processToken(t.parser.currentToken)
}
function nl(e, t) {
    t.stitches = !0;
    const n = function(e) {
        return qn("children"in e ? {
            ...e,
            children: []
        } : e)
    }(e);
    if ("children"in e && "children"in n) {
        const r = Xc({
            type: "root",
            children: e.children
        }, t.options);
        n.children = r.children
    }
    rl({
        type: "comment",
        value: {
            stitch: n
        }
    }, t)
}
function rl(e, t) {
    const n = e.value
      , r = {
        type: ko.COMMENT,
        data: n,
        location: cl(e)
    };
    ol(t, ce(e)),
    t.parser.currentToken = r,
    t.parser._processToken(t.parser.currentToken)
}
function il(e, t) {
    if (t.parser.tokenizer.preprocessor.html = "",
    t.parser.tokenizer.preprocessor.pos = -1,
    t.parser.tokenizer.preprocessor.lastGapPos = -2,
    t.parser.tokenizer.preprocessor.gapStack = [],
    t.parser.tokenizer.preprocessor.skipNextNewLine = !1,
    t.parser.tokenizer.preprocessor.lastChunkWritten = !1,
    t.parser.tokenizer.preprocessor.endOfChunkHit = !1,
    t.parser.tokenizer.preprocessor.isEol = !1,
    al(t, ce(e)),
    t.parser.tokenizer.write(t.options.tagfilter ? e.value.replace(jc, "&lt;$1$2") : e.value, !1),
    t.parser.tokenizer._runParsingLoop(),
    72 === t.parser.tokenizer.state || 78 === t.parser.tokenizer.state) {
        t.parser.tokenizer.preprocessor.lastChunkWritten = !0;
        const e = t.parser.tokenizer._consume();
        t.parser.tokenizer._callState(e)
    }
}
function sl(e, t) {
    const n = e;
    if (!t.options.passThrough || !t.options.passThrough.includes(n.type)) {
        let e = "";
        throw Wc.has(n.type) && (e = ". It looks like you are using MDX nodes with `hast-util-raw` (or `rehype-raw`). If you use this because you are using remark or rehype plugins that inject `'html'` nodes, then please raise an issue with that plugin, as its a bad and slow idea. If you use this because you are using markdown syntax, then you have to configure this utility (or plugin) to pass through these nodes (see `passThrough` in docs), but you can also migrate to use the MDX syntax"),
        new Error("Cannot compile `" + n.type + "` node" + e)
    }
    nl(n, t)
}
function ol(e, t) {
    al(e, t);
    const n = e.parser.tokenizer.currentCharacterToken;
    n && n.location && (n.location.endLine = e.parser.tokenizer.preprocessor.line,
    n.location.endCol = e.parser.tokenizer.preprocessor.col + 1,
    n.location.endOffset = e.parser.tokenizer.preprocessor.offset + 1,
    e.parser.currentToken = n,
    e.parser._processToken(e.parser.currentToken)),
    e.parser.tokenizer.paused = !1,
    e.parser.tokenizer.inLoop = !1,
    e.parser.tokenizer.active = !1,
    e.parser.tokenizer.returnState = ia.DATA,
    e.parser.tokenizer.charRefCode = -1,
    e.parser.tokenizer.consumedAfterSnapshot = -1,
    e.parser.tokenizer.currentLocation = null,
    e.parser.tokenizer.currentCharacterToken = null,
    e.parser.tokenizer.currentToken = null,
    e.parser.tokenizer.currentAttr = {
        name: "",
        value: ""
    }
}
function al(e, t) {
    if (t && void 0 !== t.offset) {
        const n = {
            startLine: t.line,
            startCol: t.column,
            startOffset: t.offset,
            endLine: -1,
            endCol: -1,
            endOffset: -1
        };
        e.parser.tokenizer.preprocessor.lineStartPos = 1 - t.column,
        e.parser.tokenizer.preprocessor.droppedBufferSize = t.offset,
        e.parser.tokenizer.preprocessor.line = t.line,
        e.parser.tokenizer.currentLocation = n
    }
}
function cl(e) {
    const t = ce(e) || {
        line: void 0,
        column: void 0,
        offset: void 0
    }
      , n = ae(e) || {
        line: void 0,
        column: void 0,
        offset: void 0
    };
    return {
        startLine: t.line,
        startCol: t.column,
        startOffset: t.offset,
        endLine: n.line,
        endCol: n.column,
        endOffset: n.offset
    }
}
function ll(e) {
    return function(t, n) {
        return Xc(t, {
            ...e,
            file: n
        })
    }
}
const ul = ["ariaDescribedBy", "ariaLabel", "ariaLabelledBy"]
  , hl = {
    ancestors: {
        tbody: ["table"],
        td: ["table"],
        th: ["table"],
        thead: ["table"],
        tfoot: ["table"],
        tr: ["table"]
    },
    attributes: {
        a: [...ul, "dataFootnoteBackref", "dataFootnoteRef", ["className", "data-footnote-backref"], "href"],
        blockquote: ["cite"],
        code: [["className", /^language-./]],
        del: ["cite"],
        div: ["itemScope", "itemType"],
        dl: [...ul],
        h2: [["className", "sr-only"]],
        img: [...ul, "longDesc", "src"],
        input: [["disabled", !0], ["type", "checkbox"]],
        ins: ["cite"],
        li: [["className", "task-list-item"]],
        ol: [...ul, ["className", "contains-task-list"]],
        q: ["cite"],
        section: ["dataFootnotes", ["className", "footnotes"]],
        source: ["srcSet"],
        summary: [...ul],
        table: [...ul],
        ul: [...ul, ["className", "contains-task-list"]],
        "*": ["abbr", "accept", "acceptCharset", "accessKey", "action", "align", "alt", "axis", "border", "cellPadding", "cellSpacing", "char", "charOff", "charSet", "checked", "clear", "colSpan", "color", "cols", "compact", "coords", "dateTime", "dir", "encType", "frame", "hSpace", "headers", "height", "hrefLang", "htmlFor", "id", "isMap", "itemProp", "label", "lang", "maxLength", "media", "method", "multiple", "name", "noHref", "noShade", "noWrap", "open", "prompt", "readOnly", "rev", "rowSpan", "rows", "rules", "scope", "selected", "shape", "size", "span", "start", "summary", "tabIndex", "title", "useMap", "vAlign", "value", "width"]
    },
    clobber: ["ariaDescribedBy", "ariaLabelledBy", "id", "name"],
    clobberPrefix: "user-content-",
    protocols: {
        cite: ["http", "https"],
        href: ["http", "https", "irc", "ircs", "mailto", "xmpp"],
        longDesc: ["http", "https"],
        src: ["http", "https"]
    },
    required: {
        input: {
            disabled: !0,
            type: "checkbox"
        }
    },
    strip: ["script"],
    tagNames: ["a", "b", "blockquote", "br", "code", "dd", "del", "details", "div", "dl", "dt", "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "input", "ins", "kbd", "li", "ol", "p", "picture", "pre", "q", "rp", "rt", "ruby", "s", "samp", "section", "source", "span", "strike", "strong", "sub", "summary", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "tt", "ul", "var"]
}
  , pl = {}.hasOwnProperty;
function dl(e, t) {
    if (t && "object" == typeof t) {
        const n = t;
        switch ("string" == typeof n.type ? n.type : "") {
        case "comment":
            return function(e, t) {
                if (e.schema.allowComments) {
                    const e = "string" == typeof t.value ? t.value : ""
                      , n = e.indexOf("--\x3e")
                      , r = {
                        type: "comment",
                        value: n < 0 ? e : e.slice(0, n)
                    };
                    return Tl(r, t),
                    r
                }
            }(e, n);
        case "doctype":
            return function(e, t) {
                if (e.schema.allowDoctypes) {
                    const e = {
                        type: "doctype"
                    };
                    return Tl(e, t),
                    e
                }
            }(e, n);
        case "element":
            return function(e, t) {
                const n = "string" == typeof t.tagName ? t.tagName : "";
                e.stack.push(n);
                const r = fl(e, t.children)
                  , i = function(e, t) {
                    const n = e.stack[e.stack.length - 1]
                      , r = e.schema.attributes
                      , i = e.schema.required
                      , s = r && pl.call(r, n) ? r[n] : void 0
                      , o = r && pl.call(r, "*") ? r["*"] : void 0
                      , a = t && "object" == typeof t ? t : {}
                      , c = {};
                    let l;
                    for (l in a)
                        if (pl.call(a, l)) {
                            const t = a[l];
                            let n = ml(e, gl(s, l), l, t);
                            null == n && (n = ml(e, gl(o, l), l, t)),
                            null != n && (c[l] = n)
                        }
                    if (i && pl.call(i, n)) {
                        const e = i[n];
                        for (l in e)
                            pl.call(e, l) && !pl.call(c, l) && (c[l] = e[l])
                    }
                    return c
                }(e, t.properties);
                e.stack.pop();
                let s = !1;
                if (n && "*" !== n && (!e.schema.tagNames || e.schema.tagNames.includes(n)) && (s = !0,
                e.schema.ancestors && pl.call(e.schema.ancestors, n))) {
                    const t = e.schema.ancestors[n];
                    let r = -1;
                    for (s = !1; ++r < t.length; )
                        e.stack.includes(t[r]) && (s = !0)
                }
                if (!s)
                    return e.schema.strip && !e.schema.strip.includes(n) ? r : void 0;
                const o = {
                    type: "element",
                    tagName: n,
                    properties: i,
                    children: r
                };
                return Tl(o, t),
                o
            }(e, n);
        case "root":
            return function(e, t) {
                const n = fl(e, t.children)
                  , r = {
                    type: "root",
                    children: n
                };
                return Tl(r, t),
                r
            }(e, n);
        case "text":
            return function(e, t) {
                const n = "string" == typeof t.value ? t.value : ""
                  , r = {
                    type: "text",
                    value: n
                };
                return Tl(r, t),
                r
            }(0, n)
        }
    }
}
function fl(e, t) {
    const n = [];
    if (Array.isArray(t)) {
        const r = t;
        let i = -1;
        for (; ++i < r.length; ) {
            const t = dl(e, r[i]);
            t && (Array.isArray(t) ? n.push(...t) : n.push(t))
        }
    }
    return n
}
function ml(e, t, n, r) {
    return t ? Array.isArray(r) ? function(e, t, n, r) {
        let i = -1;
        const s = [];
        for (; ++i < r.length; ) {
            const o = El(e, t, n, r[i]);
            "number" != typeof o && "string" != typeof o || s.push(o)
        }
        return s
    }(e, t, n, r) : El(e, t, n, r) : void 0
}
function El(e, t, n, r) {
    if (("boolean" == typeof r || "number" == typeof r || "string" == typeof r) && function(e, t, n) {
        const r = e.schema.protocols && pl.call(e.schema.protocols, t) ? e.schema.protocols[t] : void 0;
        if (!r || 0 === r.length)
            return !0;
        const i = String(n)
          , s = i.indexOf(":")
          , o = i.indexOf("?")
          , a = i.indexOf("#")
          , c = i.indexOf("/");
        if (s < 0 || c > -1 && s > c || o > -1 && s > o || a > -1 && s > a)
            return !0;
        let l = -1;
        for (; ++l < r.length; ) {
            const e = r[l];
            if (s === e.length && i.slice(0, e.length) === e)
                return !0
        }
        return !1
    }(e, n, r)) {
        if ("object" == typeof t && t.length > 1) {
            let e = !1
              , n = 0;
            for (; ++n < t.length; ) {
                const i = t[n];
                if (i && "object" == typeof i && "flags"in i) {
                    if (i.test(String(r))) {
                        e = !0;
                        break
                    }
                } else if (i === r) {
                    e = !0;
                    break
                }
            }
            if (!e)
                return
        }
        return e.schema.clobber && e.schema.clobberPrefix && e.schema.clobber.includes(n) ? e.schema.clobberPrefix + r : r
    }
}
function Tl(e, t) {
    const n = ue(t);
    t.data && (e.data = qn(t.data)),
    n && (e.position = n)
}
function gl(e, t) {
    let n, r = -1;
    if (e)
        for (; ++r < e.length; ) {
            const i = e[r]
              , s = "string" == typeof i ? i : i[0];
            if (s === t)
                return i;
            "data*" === s && (n = i)
        }
    if (t.length > 4 && "data" === t.slice(0, 4).toLowerCase())
        return n
}
function Al(e) {
    return function(t) {
        const n = function(e, t) {
            let n = {
                type: "root",
                children: []
            };
            const r = dl({
                schema: t ? {
                    ...hl,
                    ...t
                } : hl,
                stack: []
            }, e);
            return r && (Array.isArray(r) ? 1 === r.length ? n = r[0] : n.children = r : n = r),
            n
        }(t, e);
        return n
    }
}
const _l = ({content: n, className: r}) => {
    const i = {
        h1: t => e.jsx("h1", {
            className: "scroll-m-20 text-xl font-bold tracking-tight mb-4",
            ...t
        }),
        h2: t => e.jsx("h2", {
            className: "scroll-m-20 text-lg font-semibold tracking-tight mb-3",
            ...t
        }),
        h3: t => e.jsx("h3", {
            className: "scroll-m-20 text-md font-semibold tracking-tight mb-2",
            ...t
        }),
        hr: t => e.jsx("hr", {
            className: "my-10 border-t border-gray-200",
            ...t
        }),
        p: t => e.jsx("p", {
            className: "leading-7 my-1 text-primary",
            ...t
        }),
        a: t => e.jsx("a", {
            ...t,
            className: "text-primary hover:text-blue-700 no-underline"
        }),
        ul: t => e.jsx("ul", {
            className: "text-primary list-disc my-1 px-8",
            ...t
        }),
        ol: t => e.jsx("ol", {
            className: "text-primary list-decimal my-1",
            ...t
        }),
        li: t => e.jsx("li", {
            className: "leading-7 text-primary",
            ...t
        }),
        img: ({alt: t, src: n, ...r}) => e.jsxs("div", {
            className: "my-8 overflow-hidden text-primary rounded-lg border bg-muted",
            children: [e.jsx("img", {
                src: n,
                alt: t,
                className: "w-full h-auto object-cover transition-all hover:scale-105",
                loading: "lazy",
                ...r
            }), t && e.jsx("div", {
                className: "p-2 text-sm text-center",
                children: t
            })]
        }),
        blockquote: t => e.jsx("blockquote", {
            className: "mt-6 border-l-2 italic pl-4",
            ...t
        })
    };
    return e.jsx("div", {
        className: t("space-y-8", r),
        children: e.jsx("div", {
            className: "prose prose-slate dark:prose-invert max-w-none",
            children: e.jsx(Ur, {
                remarkPlugins: [ws],
                rehypePlugins: [ll, Al],
                components: i,
                children: n
            })
        })
    })
}
;
export {_l as M};
