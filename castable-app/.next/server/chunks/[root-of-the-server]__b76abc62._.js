module.exports = [
"[project]/castable-app/.next-internal/server/app/api/shows/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/castable-app/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/castable-app/src/lib/mock-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock authentication for testing and development
__turbopack_context__.s([
    "getMockAuth",
    ()=>getMockAuth,
    "isMockAuthEnabled",
    ()=>isMockAuthEnabled,
    "mockAuth",
    ()=>mockAuth
]);
const mockAuth = {
    userId: 'test-user-id',
    user: {
        id: 'test-user-id',
        emailAddresses: [
            {
                emailAddress: 'test@example.com'
            }
        ],
        firstName: 'Test',
        lastName: 'User'
    }
};
function isMockAuthEnabled() {
    return ("TURBOPACK compile-time value", "development") === 'test' || process.env.MOCK_AUTH === 'true';
}
function getMockAuth() {
    return mockAuth;
}
}),
"[project]/castable-app/src/app/api/shows/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/node_modules/@clerk/nextjs/dist/esm/app-router/server/currentUser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/castable-app/src/lib/mock-auth.ts [app-route] (ecmascript)");
;
;
;
;
// Ensure the authenticated Clerk user exists in our database
async function ensureUserExists(userId) {
    try {
        // Fast path: if user already exists, return
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                id: userId
            }
        });
        if (existing) return;
        let email = '';
        try {
            const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
            email = user?.emailAddresses?.[0]?.emailAddress || '';
        } catch  {}
        if (!email) email = `${userId}@users.local`;
        await __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
            data: {
                id: userId,
                email
            }
        });
    } catch (err) {
        console.log('ensureUserExists error:', err);
    }
}
async function GET(request) {
    try {
        let userId = null;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isMockAuthEnabled"])()) {
            const mockAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockAuth"])();
            userId = mockAuth.userId;
        } else {
            const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
            userId = authResult.userId;
        }
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Make sure the user exists in our DB (prevents FK errors elsewhere)
        await ensureUserExists(userId);
        const shows = await __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].show.findMany({
            where: {
                userId: userId
            },
            include: {
                characters: true,
                auditionMaterials: true,
                _count: {
                    select: {
                        applicants: true,
                        characters: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            shows
        });
    } catch (error) {
        console.error('Error fetching shows:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch shows'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        let userId = null;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isMockAuthEnabled"])()) {
            const mockAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockAuth"])();
            userId = mockAuth.userId;
        } else {
            const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
            userId = authResult.userId;
        }
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Make sure the user exists in our DB before creating a show
        await ensureUserExists(userId);
        console.log('Creating show...');
        const body = await request.json();
        console.log('Request body:', body);
        const { title, description, director, organization, auditionDate, deadline, location, contactEmail, contactPhone, characters, auditionMaterials, events, // New fields from schema
        greetingMessage, auditionPrepRequirements, rehearsalInfo, castingInfo, musicDirector, choreographer, venue, rehearsalPeriod } = body;
        // Validate required fields
        if (!title || !director || !contactEmail) {
            console.log('Validation failed:', {
                title,
                director,
                contactEmail
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: title, director, contactEmail'
            }, {
                status: 400
            });
        }
        // Create the show
        console.log('Creating show in database...');
        const show = await __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].show.create({
            data: {
                title,
                description,
                director,
                organization,
                auditionDate: auditionDate ? new Date(auditionDate) : null,
                deadline: deadline ? new Date(deadline) : null,
                location,
                contactEmail,
                contactPhone,
                status: 'active',
                userId: userId,
                greetingMessage,
                auditionPrepRequirements,
                rehearsalInfo,
                castingInfo,
                musicDirector,
                choreographer,
                venue,
                rehearsalPeriod,
                characters: {
                    create: characters?.map((char)=>({
                            name: char.name,
                            description: char.description,
                            gender: char.gender || 'Any',
                            ageRange: char.ageRange,
                            notes: char.notes,
                            category: char.category,
                            vocalInfo: char.vocalInfo,
                            auditionCut: char.auditionCut
                        })) || []
                },
                auditionMaterials: {
                    create: auditionMaterials?.map((material)=>({
                            type: material.type,
                            fileName: material.fileName,
                            fileUrl: material.fileUrl,
                            fileSize: material.fileSize,
                            mimeType: material.mimeType
                        })) || []
                },
                // @ts-ignore - events relation exists in schema and runtime
                events: (events?.map((e)=>({
                        type: e.type,
                        startAt: new Date(e.startAt),
                        endAt: e.endAt ? new Date(e.endAt) : null,
                        timezone: e.timezone || null,
                        location: e.location || null,
                        notes: e.notes || null
                    })) || []).length ? {
                    create: events.map((e)=>({
                            type: e.type,
                            startAt: new Date(e.startAt),
                            endAt: e.endAt ? new Date(e.endAt) : null,
                            timezone: e.timezone || null,
                            location: e.location || null,
                            notes: e.notes || null
                        }))
                } : undefined
            },
            include: {
                characters: true,
                auditionMaterials: true,
                _count: {
                    select: {
                        applicants: true,
                        characters: true
                    }
                }
            }
        });
        console.log('Show created successfully:', show.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            show,
            publicUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shows/${show.id}`
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating show:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create show',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        let userId = null;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isMockAuthEnabled"])()) {
            const mockAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockAuth"])();
            userId = mockAuth.userId;
        } else {
            const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
            userId = authResult.userId;
        }
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const { id, title, description, director, organization, auditionDate, deadline, location, contactEmail, contactPhone, characters, auditionMaterials, events, // New fields from schema
        greetingMessage, auditionPrepRequirements, rehearsalInfo, castingInfo, musicDirector, choreographer, venue, rehearsalPeriod } = body;
        // Validate required fields
        if (!id || !title || !director || !contactEmail) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: id, title, director, contactEmail'
            }, {
                status: 400
            });
        }
        // Check if show exists and belongs to user
        const existingShow = await __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].show.findFirst({
            where: {
                id: id,
                userId: userId
            }
        });
        if (!existingShow) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Show not found or access denied'
            }, {
                status: 404
            });
        }
        // Update the show
        const show = await __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].show.update({
            where: {
                id: id
            },
            data: {
                title,
                description,
                director,
                organization,
                auditionDate: auditionDate ? new Date(auditionDate) : null,
                deadline: deadline ? new Date(deadline) : null,
                location,
                contactEmail,
                contactPhone,
                greetingMessage,
                auditionPrepRequirements,
                rehearsalInfo,
                castingInfo,
                musicDirector,
                choreographer,
                venue,
                rehearsalPeriod,
                // Update characters
                characters: {
                    deleteMany: {},
                    create: characters?.map((char)=>({
                            name: char.name,
                            description: char.description,
                            gender: char.gender || 'Any',
                            ageRange: char.ageRange,
                            notes: char.notes,
                            category: char.category,
                            vocalInfo: char.vocalInfo,
                            auditionCut: char.auditionCut
                        })) || []
                },
                // Update audition materials
                auditionMaterials: {
                    deleteMany: {},
                    create: auditionMaterials?.map((material)=>({
                            type: material.type,
                            fileName: material.fileName,
                            fileUrl: material.fileUrl,
                            fileSize: material.fileSize,
                            mimeType: material.mimeType
                        })) || []
                },
                // Update events
                // @ts-ignore - events relation exists in schema and runtime
                events: (events?.map((e)=>e) || []).length ? {
                    deleteMany: {},
                    create: events.map((e)=>({
                            type: e.type,
                            startAt: new Date(e.startAt),
                            endAt: e.endAt ? new Date(e.endAt) : null,
                            timezone: e.timezone || null,
                            location: e.location || null,
                            notes: e.notes || null
                        }))
                } : undefined
            },
            include: {
                characters: true,
                auditionMaterials: true,
                _count: {
                    select: {
                        applicants: true,
                        characters: true
                    }
                }
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            show
        });
    } catch (error) {
        console.error('Error updating show:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update show',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        let userId = null;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isMockAuthEnabled"])()) {
            const mockAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockAuth"])();
            userId = mockAuth.userId;
        } else {
            const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
            userId = authResult.userId;
        }
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const { id } = body;
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required field: id'
            }, {
                status: 400
            });
        }
        // Get the original show with all related data
        const originalShow = await __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].show.findFirst({
            where: {
                id: id,
                userId: userId
            },
            include: {
                characters: true,
                auditionMaterials: true
            }
        });
        if (!originalShow) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Show not found or access denied'
            }, {
                status: 404
            });
        }
        // Create the duplicate show
        const duplicatedShow = await __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].show.create({
            data: {
                title: `${originalShow.title} (Copy)`,
                description: originalShow.description,
                director: originalShow.director,
                organization: originalShow.organization,
                auditionDate: originalShow.auditionDate,
                deadline: originalShow.deadline,
                location: originalShow.location,
                contactEmail: originalShow.contactEmail,
                contactPhone: originalShow.contactPhone,
                status: 'draft',
                userId: userId,
                greetingMessage: originalShow.greetingMessage,
                auditionPrepRequirements: originalShow.auditionPrepRequirements,
                rehearsalInfo: originalShow.rehearsalInfo,
                castingInfo: originalShow.castingInfo,
                musicDirector: originalShow.musicDirector,
                choreographer: originalShow.choreographer,
                venue: originalShow.venue,
                rehearsalPeriod: originalShow.rehearsalPeriod,
                characters: {
                    create: originalShow.characters.map((char)=>({
                            name: char.name,
                            description: char.description,
                            gender: char.gender,
                            ageRange: char.ageRange,
                            notes: char.notes,
                            category: char.category,
                            vocalInfo: char.vocalInfo,
                            auditionCut: char.auditionCut
                        }))
                },
                auditionMaterials: {
                    create: originalShow.auditionMaterials.map((material)=>({
                            type: material.type,
                            fileName: material.fileName,
                            fileUrl: material.fileUrl,
                            fileSize: material.fileSize,
                            mimeType: material.mimeType
                        }))
                }
            },
            include: {
                characters: true,
                auditionMaterials: true,
                _count: {
                    select: {
                        applicants: true
                    }
                }
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            show: duplicatedShow,
            message: 'Show duplicated successfully'
        });
    } catch (error) {
        console.error('Error duplicating show:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to duplicate show',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        let userId = null;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isMockAuthEnabled"])()) {
            const mockAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$mock$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockAuth"])();
            userId = mockAuth.userId;
        } else {
            const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
            userId = authResult.userId;
        }
        if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        const { id } = await request.json();
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing required field: id'
        }, {
            status: 400
        });
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].show.deleteMany({
            where: {
                id,
                userId
            }
        });
        if (result.count === 0) return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Show not found or access denied'
        }, {
            status: 404
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            deleted: result.count
        });
    } catch (error) {
        console.error('Error deleting show:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$castable$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete show'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b76abc62._.js.map