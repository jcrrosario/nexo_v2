module.exports = [
"[project]/app/(entity)/dashboard/vinculacao-organizacional/vinculacao-organizacional-page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VinculacaoOrganizacionalPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function VinculacaoOrganizacionalPage() {
    const [hierarquia, setHierarquia] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [departamentos, setDepartamentos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [funcoes, setFuncoes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [usuarios, setUsuarios] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editando, setEditando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        vinculacao_id: null,
        dpto_id: '',
        func_id: '',
        user_id: '',
        percentual_alocacao: 100,
        custo_mensal: ''
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        carregarHierarquia();
        carregarCombos();
    }, []);
    async function carregarHierarquia() {
        const token = localStorage.getItem('entity_token');
        const res = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/entity/vinculacao`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await res.json();
        setHierarquia(Array.isArray(json) ? json : []);
    }
    async function carregarCombos() {
        const token = localStorage.getItem('entity_token');
        const res = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/entity/vinculacao/combos`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await res.json();
        setDepartamentos(json.departamentos || []);
        setFuncoes(json.funcoes || []);
        setUsuarios(json.usuarios || []);
    }
    function limparMoeda(valor) {
        return valor.replace(/\./g, '').replace(',', '.');
    }
    async function salvar() {
        const token = localStorage.getItem('entity_token');
        const payload = {
            dpto_id: form.dpto_id,
            func_id: form.func_id,
            user_id: form.user_id,
            percentual_alocacao: form.percentual_alocacao,
            custo_mensal: form.custo_mensal ? Number(limparMoeda(form.custo_mensal)) : null
        };
        const url = editando ? `${"TURBOPACK compile-time value", "http://localhost:3001"}/entity/vinculacao/${form.vinculacao_id}` : `${"TURBOPACK compile-time value", "http://localhost:3001"}/entity/vinculacao`;
        await fetch(url, {
            method: editando ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        setShowModal(false);
        carregarHierarquia();
    }
    return null;
}
}),
"[project]/app/(entity)/dashboard/vinculacao-organizacional/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$entity$292f$dashboard$2f$vinculacao$2d$organizacional$2f$vinculacao$2d$organizacional$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(entity)/dashboard/vinculacao-organizacional/vinculacao-organizacional-page.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$entity$292f$dashboard$2f$vinculacao$2d$organizacional$2f$vinculacao$2d$organizacional$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/(entity)/dashboard/vinculacao-organizacional/page.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=app_%28entity%29_dashboard_vinculacao-organizacional_bb672fc6._.js.map