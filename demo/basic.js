/**
 * dizi-midi-tool 基本用法演示
 * 运行: node demo/basic.js
 */
const { DIZI_FINGERINGS, parseJianpuToMIDI, listFingerings } = require("../src/midi-tool");

// 示例1: 列出手指法
console.log("=== D调竹笛指法表 ===");
console.table(listFingerings());

// 示例2: 茉莉花片段 (中音)
console.log("\n=== 《茉莉花》片段 (中音) ===");
const melody1 = "5 5 6 5 3 2 1";
const notes1 = parseJianpuToMIDI(melody1, 100);
notes1.forEach(n => console.log(`  pitch:${n.pitch} ${n.fingering}`));

// 示例3: 含高低八度
console.log("\n=== 含低音+高音示例 ===");
const melody2 = ".5 5 5. 6 5 3 2 1";
const notes2 = parseJianpuToMIDI(melody2, 120);
notes2.forEach(n => console.log(`  ${n.fingering.padEnd(14)} MIDI:${n.pitch}`));

// 示例4: 时值标记演示 (延长音 - / 缩短音 _)
console.log("\n=== 时值标记示例 (BPM=120) ===");
const melody3 = "5- 3 5__ 6_ 5 0 5.";
const notes3 = parseJianpuToMIDI(melody3, 120);
notes3.forEach(n => console.log(`  ${n.fingering.padEnd(14)} dur:${n.duration.toFixed(3)}s`));

// 示例5: 二分音符乐句
console.log("\n=== 《茉莉花》二分音符版 ===");
const melody4 = "5- 5- 6- 5- 3- 2- 1-";
const notes4 = parseJianpuToMIDI(melody4, 100);
const total = notes4.reduce((s, n) => s + n.duration, 0);
notes4.forEach(n => console.log(`  ${n.fingering.padEnd(14)} d:${n.duration.toFixed(2)}s`));
console.log(`总时长: ${total.toFixed(2)}s`);
