/**
 * DEOBFUSCATION STUDIO - LAYER 02
 * File: script2.js
 * Chức năng: Quét và giải nén các mảng hằng số (Constant Array Replacement)
 */

DeobfuscationStudio.registerModule("Constant Array Unpacker", async function(code, type) {
    let output = code;

    // Tìm dạng mảng hằng số phổ biến: local MANG = { "string1", "string2", 123 }
    // Regex này bắt cụm định nghĩa mảng đơn giản
    const arrayRegex = /local\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\{\s*(([^{}]+))\s*\}/g;
    let match;

    while ((match = arrayRegex.exec(output)) !== null) {
        const arrayName = match[1];
        // Tách các phần tử trong mảng ra thành JS Array
        const elements = match[2].split(',').map(e => e.trim().replace(/^["']|["']$/g, ''));

        // Đi thay thế các vị trí gọi mảng dạng: MANG[1] hoặc MANG[0x01]
        elements.forEach((val, index) => {
            const luaIndex = index + 1; // Lua bắt đầu từ index 1
            
            // Thay thế dạng thường: MANG[1]
            const targetNormal = new RegExp(arrayName + '\\s*\\[\\s*' + luaIndex + '\\s*\\]', 'g');
            // Thay thế dạng Hex nếu có: MANG[0x01]
            const targetHex = new RegExp(arrayName + '\\s*\\[\\s*0x' + luaIndex.toString(16) + '\\s*\\]', 'g');

            const replacement = isNaN(val) ? `"${val}"` : val;
            output = output.replace(targetNormal, replacement).replace(targetHex, replacement);
        });
    }

    return output;
});
              
