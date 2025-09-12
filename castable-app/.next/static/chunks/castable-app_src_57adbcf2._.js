(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/castable-app/src/lib/analytics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Analytics utilities for tracking user interactions and events
__turbopack_context__.s([
    "trackApplicationSubmitted",
    ()=>trackApplicationSubmitted,
    "trackError",
    ()=>trackError,
    "trackEvent",
    ()=>trackEvent,
    "trackFileUploaded",
    ()=>trackFileUploaded,
    "trackPageView",
    ()=>trackPageView,
    "trackPerformance",
    ()=>trackPerformance,
    "trackShowCreated",
    ()=>trackShowCreated,
    "trackShowViewed",
    ()=>trackShowViewed,
    "trackUserSignIn",
    ()=>trackUserSignIn,
    "trackUserSignUp",
    ()=>trackUserSignUp
]);
const trackEvent = (eventName, properties)=>{
    if ("object" !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, properties);
    }
};
const trackPageView = (url)=>{
    if ("object" !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
            page_path: url
        });
    }
};
const trackShowCreated = (showId, showTitle)=>{
    trackEvent('show_created', {
        show_id: showId,
        show_title: showTitle,
        timestamp: new Date().toISOString()
    });
};
const trackShowViewed = (showId, showTitle)=>{
    trackEvent('show_viewed', {
        show_id: showId,
        show_title: showTitle,
        timestamp: new Date().toISOString()
    });
};
const trackApplicationSubmitted = (showId, applicantEmail)=>{
    trackEvent('application_submitted', {
        show_id: showId,
        applicant_email: applicantEmail,
        timestamp: new Date().toISOString()
    });
};
const trackFileUploaded = (fileType, fileSize)=>{
    trackEvent('file_uploaded', {
        file_type: fileType,
        file_size: fileSize,
        timestamp: new Date().toISOString()
    });
};
const trackUserSignUp = (userId, method)=>{
    trackEvent('user_signup', {
        user_id: userId,
        method: method,
        timestamp: new Date().toISOString()
    });
};
const trackUserSignIn = (userId, method)=>{
    trackEvent('user_signin', {
        user_id: userId,
        method: method,
        timestamp: new Date().toISOString()
    });
};
const trackError = (error, context)=>{
    if ("object" !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
            description: error.message,
            fatal: false,
            context: context || 'unknown'
        });
    }
};
const trackPerformance = function(metricName, value) {
    let unit = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 'ms';
    if ("object" !== 'undefined' && window.gtag) {
        window.gtag('event', 'timing_complete', {
            name: metricName,
            value: Math.round(value),
            event_category: 'Performance',
            event_label: unit
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/castable-app/src/components/analytics-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnalyticsProvider",
    ()=>AnalyticsProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/src/lib/analytics.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AnalyticsProvider(param) {
    let { children } = param;
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnalyticsProvider.useEffect": ()=>{
            // Track page views
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackPageView"])(pathname);
        }
    }["AnalyticsProvider.useEffect"], [
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AnalyticsProvider, "V/ldUoOTYUs0Cb2F6bbxKSn7KxI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AnalyticsProvider;
var _c;
__turbopack_context__.k.register(_c, "AnalyticsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/castable-app/src/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function ThemeProvider(param) {
    let { children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/castable-app/src/components/theme-provider.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=castable-app_src_57adbcf2._.js.map