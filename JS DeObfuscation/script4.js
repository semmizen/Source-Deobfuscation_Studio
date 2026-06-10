/**
 * DEOBFUSCATION STUDIO - LAYER 04
 * File: script4.js
 * Chức năng: Khôi phục hàm trung gian (Proxy Functions Inline)
 */

DeobfuscationStudio.registerModule("Proxy Function Inliner", async function(code, type) {
    let output = code;

    // Tìm các hàm bọc dạng: local function HONG_GIO(a, b) return ALO(a, b) end
    const proxyRegex = /local\s+function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]+)\)\s*return\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\2\s*\)\s*end/g;
    
    let match;
    while ((match = proxyRegex.exec(output)) !== null) {
        const proxyName = match[1];
        const realFunctionName = match[3];

        // Thay thế tất cả những nơi gọi hàm proxy bằng hàm thật
        const callRegex = new RegExp(`\\b${proxyName}\\b(?=\\s*\\()`, 'g');
        output = output.replace(callRegex, realFunctionName);
    }

    return output;
});
