#!/usr/bin/env node
const { parseJianpuToMIDI, listFingerings } = require("../src/midi-tool");

const jianpu = process.argv[2] || "1 2 3 5 6 5 3 2 1";
const bpm = parseInt(process.argv[3], 10) || 120;

if (process.argv.includes("--fingerings")) {
  console.table(listFingerings());
  process.exit(0);
}

const notes = parseJianpuToMIDI(jianpu, bpm);
console.log(`简谱: ${jianpu}  (BPM: ${bpm})`);
console.log(`音符数: ${notes.length}`);
notes.forEach((n, i) => {
  console.log(`  ${i + 1}. pitch=${n.pitch} 时值=${n.duration}s 指法=${n.fingering}`);
});
