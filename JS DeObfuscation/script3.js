/**
 * DEOBFUSCATION STUDIO - LAYER 03
 * File: script3.js
 * Chức năng: Nhận diện và thanh trừng mã rác (Junk Code/Dead Code)
 */

DeobfuscationStudio.registerModule("Dead Code Purger", async function(code, type) {
    let output = code;

    // 1. Xóa các khối điều kiện rác luôn sai: if false then ... end
    output = output.replace(/if\s+false\s+then[\s\S]*?end\s*;?/g, "");
    output = output.replace(/if\s+not\s+true\s+then[\s\S]*?end\s*;?/g, "");

    // 2. Xóa các cấu trúc lặp vô dụng: while false do ... end
    output = output.replace(/while\s+false\s+do[\s\S]*?end\s*;?/g, "");

    // 3. Khử toán học tĩnh làm rối mắt (Constant Folding cơ bản)
    // Ví dụ: 10 + 20 -> 30, 0x05 * 2 -> 10
    output = output.replace(/(\d+)\s*([\+\-\*\/])\s*(\d+)/g, (match, n1, op, n2) => {
        try {
            const res = eval(match);
            return isNaN(res) ? match : res;
        } catch { return match; }
    });

    return output;
});
