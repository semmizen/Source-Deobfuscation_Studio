/**
 * DEOBFUSCATION STUDIO - LAYER 01
 * File: script1.js
 * Chức năng: Giải mã chuỗi hệ Hexadecimal, Decimal, Unicode và dọn dẹp khoảng trắng rác.
 */

DeobfuscationStudio.registerModule("String & Character Decoder", async function(code, type) {
    let output = code;

    // 1. Giải mã Hex dạng \x41 \X41 -> Biến thành ký tự thường
    output = output.replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => {
        const charCode = parseInt(hex, 16);
        // Chỉ giải mã nếu là ký tự đọc được (printable), tránh làm lỗi cú pháp Lua
        return (charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13 
            ? String.fromCharCode(charCode) 
            : match;
    });

    // 2. Giải mã Decimal dạng \65 \065 (Thường gặp rất nhiều trong script Lua gác cổng)
    output = output.replace(/\\(\d{1,3})/g, (match, dec) => {
        const charCode = parseInt(dec, 10);
        // Giới hạn trong khoảng ký tự ASCII an toàn
        return (charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13 
            ? String.fromCharCode(charCode) 
            : match;
    });

    // 3. Giải mã Unicode dạng \u0041 (Nếu có dính líu từ các công cụ obfuscate lai)
    output = output.replace(/\\u([0-9A-Fa-f]{4})/g, (match, ut) => {
        const charCode = parseInt(ut, 16);
        return (charCode >= 32 && charCode <= 126) ? String.fromCharCode(charCode) : match;
    });

    // 4. Tối ưu hóa chuỗi rỗng nối nhau (Ví dụ: "a" .. "" .. "b" -> "ab")
    // Thường bọn obfuscator sẽ tự chèn chuỗi rỗng để làm rối mắt các bộ lọc thông thường
    if (type === "lua" || type === "luau") {
        output = output.replace(/\.\.\s*""\s*\.\./g, "..");
        output = output.replace(/"\s*\.\.\s*"/g, "");
    }

    return output; // Trả kết quả đã làm sạch tầng 1 sang file script2.js
});
                                  
