/**
 * DEOBFUSCATION STUDIO - LAYER 09 (ULTIMATE CLEANER & RENAMER - PACKED POWER)
 * File: script9.js
 * Chức năng: Khử nhiễu toán học (Constant Folding), tối ưu hóa cấu trúc điều kiện lồng lặp,
 * tự động đổi tên biến dựa trên ngữ cảnh hành vi (Heuristic Renamer), chuẩn hóa thẩm mỹ mã nguồn.
 */

DeobfuscationStudio.registerModule("Variable Renamer & Math Simplifier", async function(code, type) {
    let output = code;
    console.log("[LÕI 9 - THẨM MỸ] Khởi động bộ lọc làm sạch và khôi phục cấu trúc ngôn ngữ...");

    let cleanContext = {
        foldedConstantsCount: 0,
        renamedVariablesCount: 0,
        eliminatedDeadCodeLines: 0,
        variableMap: {}
    };

    // --- TẦNG 1: KHỬ NHIỄU TOÁN HỌC & GIẢI MÃ HEX/OCTAL (CONSTANT FOLDING ENGINE) ---
    // Tìm kiếm và ép xử lý các số Hexadecimal (0x...) về dạng thập phân dễ đọc
    output = output.replace(/0x([0-9a-fA-F]+)/g, (match, hexValue) => {
        cleanContext.foldedConstantsCount++;
        return parseInt(hexValue, 16).toString();
    });

    // Giải toán các phép tính tĩnh cơ bản lặp đi lặp lại do Obfuscator sinh ra làm rối mắt
    // Ví dụ: 10 + 20 -> 30, 5 * 4 -> 20
    const mathPattern = /(\b\d+)\s*([\+\-\*\/])\s*(\b\d+)/g;
    let mathMatch;
    let keepFolding = true;
    let foldingLimit = 0;

    while (keepFolding && foldingLimit < 50) {
        keepFolding = false;
        foldingLimit++;
        output = output.replace(mathPattern, (match, num1, operator, num2) => {
            let n1 = parseInt(num1, 10);
            let n2 = parseInt(num2, 10);
            let res = 0;
            
            switch(operator) {
                case '+': res = n1 + n2; break;
                case '-': res = n1 - n2; break;
                case '*': res = n1 * n2; break;
                case '/': res = n2 !== 0 ? Math.floor(n1 / n2) : 0; break;
                default: return match;
            }
            cleanContext.foldedConstantsCount++;
            keepFolding = true;
            return res.toString();
        });
    }

    // --- TẦNG 2: PHÂN TÍCH NGỮ CẢNH VÀ ĐỔI TÊN BIẾN THÔNG MINH (HEURISTIC VARIABLE RENAMER) ---
    // Quét tìm các biến cục bộ (local) có dạng ngẫu nhiên hoặc vô nghĩa do VM sinh ra
    const localDeclarationPattern = /local\s+([a-zA-Z_]\w*)/g;
    let varMatch;
    let detectedVariables = [];

    while ((varMatch = localDeclarationPattern.exec(output)) !== null) {
        if (!detectedVariables.includes(varMatch[1]) && varMatch[1].length > 2) {
            detectedVariables.push(varMatch[1]);
        }
    }

    // Phân loại và gán tên có ý nghĩa dựa trên cách biến đó tương tác với dữ liệu
    detectedVariables.forEach(vName => {
        // Bỏ qua các từ khóa hệ thống hoặc biến toàn cục tiêu chuẩn
        if (["string", "table", "math", "pairs", "ipairs", "print", "require"].includes(vName)) return;

        let alias = "";
        
        // Tạo biểu thức kiểm tra hành vi
        let isLoopIndex = new RegExp("for\\s+" + vName + "\\s*=").test(output);
        let isFunction = new RegExp(vName + "\\s*=\\s*function").test(output);
        let isTable = new RegExp(vName + "\\s*=\\s*\\{").test(output);
        let isStringTarget = new RegExp("string\\..*?\\(\\s*" + vName).test(output);

        if (isLoopIndex) {
            alias = "loop_index_" + (++cleanContext.renamedVariablesCount);
        } else if (isFunction) {
            alias = "resolved_func_" + (++cleanContext.renamedVariablesCount);
        } else if (isTable) {
            alias = "data_table_" + (++cleanContext.renamedVariablesCount);
        } else if (isStringTarget) {
            alias = "decrypted_string_var_" + (++cleanContext.renamedVariablesCount);
        } else if (vName.startsWith("V_REG_")) {
            alias = vName.toLowerCase(); // Giữ cấu trúc thanh ghi nhưng viết thường cho sạch
        }

        if (alias !== "") {
            cleanContext.variableMap[vName] = alias;
            // Thay thế chính xác biến trong luồng code sử dụng ranh giới từ (\b)
            let replacerRegex = new RegExp("\\b" + vName + "\\b", "g");
            output = output.replace(replacerRegex, alias);
        }
    });

    // --- TẦNG 3: CHUẨN HÓA CÁC BIỂU THỨC LOGIC & ĐIỀU KIỆN (BOOLEAN SIMPLIFIER) ---
    // Khử các kiểu so sánh thừa thãi như if true == true then
    output = output.replace(/true\s*==\s*true/g, "true");
    output = output.replace(/false\s*==\s*false/g, "true");
    output = output.replace(/if\s+true\s+then/g, "do");

    // --- TẦNG 4: LOẠI BỎ ĐOẠN MÃ CHẾT & RÁC THỪA (DEAD CODE ELIMINATION) ---
    // Loại bỏ các dòng khai báo biến rác trống rỗng liên tục do dính các tầng deobf trước để lại
    const emptyAssignPattern = /local\s+[a-zA-Z_]\w*\s*=\s*nil\s*;?\s*\n/g;
    if (emptyAssignPattern.test(output)) {
        output = output.replace(emptyAssignPattern, () => {
            cleanContext.eliminatedDeadCodeLines++;
            return "";
        });
    }

    // --- TẦNG 5: ĐỒNG BỘ HÓA VÀ KẾT NỐI VỚI FILE CUỐI (LAYER 10 POST-PROCESSOR) ---
    let cleanReportHeader = `-- ========================================================================\n`;
    cleanReportHeader += `--      DEOBFUSCATION STUDIO - LAYER 09 CODE BEAUTIFIER & SIMPLIFIER\n`;
    cleanReportHeader += `-- ========================================================================\n`;
    cleanReportHeader += `-- [Tính Toán Tĩnh]: Đã giải và thu gọn ${cleanContext.foldedConstantsCount} biểu thức số học.\n`;
    cleanReportHeader += `-- [Khôi Phục Tên Biến]: Đã đổi tên ${cleanContext.renamedVariablesCount} định danh dựa trên ngữ cảnh hành vi.\n`;
    cleanReportHeader += `-- [Dọn Rác Hệ Thống]: Đã xóa bỏ ${cleanContext.eliminatedDeadCodeLines} dòng mã chết dư thừa.\n`;
    cleanReportHeader += `-- ========================================================================\n\n`;

    output = cleanReportHeader + output;

    output += `\n\n-- [HOÀN THÀNH LÕI 9]: Toàn bộ mã nguồn đã được làm sạch thẩm mỹ cao cấp. Chuẩn bị xuất xưởng.\n`;

    let totalLines = output.split('\n').length;
    console.log(`[HỆ THỐNG] Tiến trình Lõi 9 hoàn tất. Tổng số dòng sau khi tối ưu và làm sạch: ${totalLines}`);

    return output;
});
                                   
