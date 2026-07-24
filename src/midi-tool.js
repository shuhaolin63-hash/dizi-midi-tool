/**
 * dizi-midi-tool — 竹笛音阶MIDI生成器
 * 将简谱数字(1-7)映射到D调竹笛指法表的MIDI音符
 * 主题#8 器乐算法: 参考 Transkun(midi转录) + midi-model(序列生成) 设计思路
 */

// D调竹笛筒音作5指法表 (MIDI note numbers)
const DIZI_FINGERINGS = {
  '5': { midi: 62, name: 'D4', fingering: '全按' },
  '6': { midi: 64, name: 'E4', fingering: '开第一孔' },
  '7': { midi: 66, name: 'F#4', fingering: '开一二孔' },
  '1': { midi: 67, name: 'G4', fingering: '开一二三孔' },
  '2': { midi: 69, name: 'A4', fingering: '开一二三四孔' },
  '3': { midi: 71, name: 'B4', fingering: '开一二三四五孔' },
  '4': { midi: 72, name: 'C5', fingering: '开一二三四五六孔(半孔)' },
  '5': { midi: 74, name: 'D5', fingering: '开第六孔(超吹)' },
  '6': { midi: 76, name: 'E5', fingering: '超吹' },
};

/** 将简谱字符串解析为MIDI音符序列 */
function parseJianpuToMIDI(jianpuStr, bpm = 120) {
  const beatDuration = 60 / bpm;
  const notes = [];
  const chars = jianpuStr.replace(/s+/g, '');
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const isHigh = c === '.';
    const noteChar = isHigh ? chars[++i] : c;
    const finger = DIZI_FINGERINGS[noteChar];
    if (finger) {
      notes.push({
        pitch: finger.midi + (isHigh ? 12 : 0),
        duration: beatDuration,
        startTime: notes.length > 0
          ? notes[notes.length - 1].startTime + notes[notes.length - 1].duration
          : 0,
        fingering: finger.fingering + (isHigh ? '(高八度)' : ''),
      });
    }
  }
  return notes;
}

/** 列出所有可用指法 */
function listFingerings() {
  return Object.entries(DIZI_FINGERINGS).map(([k, v]) => ({
    jianpu: k, midi: v.midi, name: v.name, fingering: v.fingering
  }));
}

module.exports = { DIZI_FINGERINGS, parseJianpuToMIDI, listFingerings };
