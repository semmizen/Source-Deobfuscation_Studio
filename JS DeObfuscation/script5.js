/**
 * DEOBFUSCATION STUDIO - LAYER 05
 * File: script5.js
 * Chức năng: Làm đẹp và cấu trúc lại mã nguồn sau khi deobf (Beautifier)
 */

DeobfuscationStudio.registerModule("Code Format & Beautifier", async function(code, type) {
    let output = code.trim();
    
    // Tách dòng dựa trên các từ khóa chính của Lua để cấu trúc lại sơ bộ
    output = output
        .replace(/;\s*/g, ";\n")
        .replace(/\b(then|do)\b\s*/g, "$1\n")
        .replace(/\b(end|else|elseif)\b/g, "\n$1\n");

    // Xử lý loại bỏ các dòng trống thừa thãi liên tiếp do quá trình xóa code rác để lại
    output = output.replace(/\n\s*\n+/g, '\n');

    // Thêm một chút căn lề cơ bản
    let lines = output.split('\n');
    let indentLevel = 0;
    let formattedLines = lines.map(line => {
        let trimmed = line.trim();
        if (trimmed.startsWith('end') || trimmed.startsWith('else') || trimmed.startsWith('elseif')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        
        let newLine = "    ".repeat(indentLevel) + trimmed;
        
        if (trimmed.endsWith('then') || trimmed.endsWith('do') || trimmed.startsWith('function') || trimmed.startsWith('else') || trimmed.startsWith('elseif')) {
            indentLevel++;
        }
        return newLine;
    });

    return `-- [XỬ LÝ HOÀN TẤT TẦNG 1-5] --\n` + formattedLines.join('\n');
});
          
