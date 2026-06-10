/**
 * DEOBFUSCATION STUDIO - LAYER 06
 * File: script6.js
 * Chức năng: Quét sâu và triệt tiêu các cụm Spam biến, gán đè rác diện rộng (Anti-Junk Flood)
 */

DeobfuscationStudio.registerModule("Advanced Anti-Spam & Junk Flood", async function(code, type) {
    let output = code;

    // --- BƯỚC 1: KHỬ SPAM GÁN ĐÈ LIÊN TỤC (Dead Store Elimination) ---
    // Tìm các cụm gán giá trị liên tục cho cùng một biến mà không có lệnh sử dụng ở giữa
    // Ví dụ: local v = 1; v = 2; v = 3; -> Giữ lại duy nhất phát gán cuối: local v = 3;
    let lines = output.split('\n');
    let cleanLines = [];
    let lastAssignedVar = null;
    let lastAssignedIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        let currentLine = lines[i].trim();
        
        // Regex nhận diện phép gán đơn giản: tên_biến = giá_trị
        let assignMatch = currentLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]+);?$/);
        
        if (assignMatch) {
            let varName = assignMatch[1];
            
            // Nếu dòng trước đó cũng gán cho chính biến này, ta loại bỏ dòng trước đó khỏi kết quả
            if (lastAssignedVar === varName && lastAssignedIndex !== -1) {
                cleanLines[lastAssignedIndex] = `-- [Hệ thống dọn dẹp spam gán đè: ${varName}]`;
            }
            
            lastAssignedVar = varName;
            lastAssignedIndex = cleanLines.length;
        } else {
            // Nếu dòng này không phải phép gán, hoặc có logic khác (như gọi hàm), reset trạng thái theo dõi
            if (currentLine.length > 0 && !currentLine.startsWith('--')) {
                lastAssignedVar = null;
                lastAssignedIndex = -1;
            }
        }
        cleanLines.push(lines[i]);
    }
    output = cleanLines.join('\n');

    // --- BƯỚC 2: KHỬ KHỐI LẶP SPAM VÔ TẬN KHÔNG LỐI THOÁT ---
    // Bọn obfuscator hay sinh ra dạng: repeat ... until true hoặc while false do end để bọc rác
    // Tui dùng vòng lặp để quét rác nhiều lần cho sạch hẳn từ trong ra ngoài
    let oldLength;
    do {
        oldLength = output.length;
        
        // Xóa khối repeat ... until true rỗng hoặc chỉ chứa chú thích/rác
        output = output.replace(/repeat\s*([\s--]*)\s*until\s+true\b/g, "$1");
        
        // Xóa các hàm ẩn danh được định nghĩa ra chỉ để thực thi ngay lập tức mà không chứa logic cốt lõi
        // Dạng: (function() end)()
        output = output.replace(/\(function\s*\(\s*\)\s*end\s*\)\s*\(\s*\)/g, "");
        
    } while (output.length < oldLength); // Chạy tiếp nếu dung lượng file vẫn giảm (tức là vẫn còn rác lồng nhau)

    // --- BƯỚC 3: DỌN DẸP DẤU CHẤM PHẨY SPAM ---
    // Lỗi sinh ra khi bóc tách code thường để lại chuỗi ";;;;;" dính nhau
    output = output.replace(/;{2,}/g, ";");
    output = output.replace(/^\s*;\s*$/gm, ""); // Xóa dòng chỉ chứa dấu chấm phẩy

    return output; // Chuyển code đã được lọc sạch spam sang tầng xử lý Chunk của file số 7
});
      
