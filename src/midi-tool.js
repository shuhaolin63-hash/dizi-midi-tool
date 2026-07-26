/**
 * dizi-midi-tool — 竹笛音阶MIDI生成器
 * 将简谱数字(1-7)映射到D调竹笛筒音作5指法表的MIDI音符
 * 主题#8 器乐算法: 参考 Transkun(midi转录) + midi-model(序列生成) 设计思路
 */
const OCTAVE_SHIFT = 12;

// 时值标记: - 延长一倍, _ 缩短一半; 基准 = 四分音符(1倍)
const DURATION_MARKS = {
  '--': 4,   // 全音符 (4倍)
  '-': 2,    // 二分音符 (2倍)
  '': 1,     // 四分音符 (1倍，默认)
  '_': 0.5,  // 八分音符 (1/2)
  '__': 0.25, // 十六分音符 (1/4)
};

// D调竹笛【筒音作5】指法表，仅中音区基准值
// 高音 = midi + 12, 低音 = midi - 12
const DIZI_FINGERINGS = {
  '5': { midi: 62, name: 'D4', fingering: '全按' },
  '6': { midi: 64, name: 'E4', fingering: '开第一孔' },
  '7': { midi: 66, name: 'F#4', fingering: '开一二孔' },
  '1': { midi: 67, name: 'G4', fingering: '开一二三孔' },
  '2': { midi: 69, name: 'A4', fingering: '开一二三四孔' },
  '3': { midi: 71, name: 'B4', fingering: '开一二三四五孔' },
  '4': { midi: 72, name: 'C5', fingering: '开一二三四五六孔(半孔)' },
};

/**
 * 简谱规则: .5 = 低音5 | 5 = 中音5 | 5. = 高音5
 * @param {string} jianpuStr - 简谱文本
 * @param {number} bpm - 速度 (Beats Per Minute)
 * @returns {Array<{pitch, duration, startTime, velocity, fingering}>}
 */
function parseJianpuToMIDI(jianpuStr, bpm = 120) {
  if (typeof jianpuStr !== 'string') throw new Error('简谱输入必须为字符串');
  if (!jianpuStr.trim()) return [];

  const beatDuration = 60 / bpm;
  const notes = [];
  const chars = jianpuStr.replace(/\s+/g, '');
  let i = 0;

  while (i < chars.length) {
    const c = chars[i];
    let octaveOffset = 0;
    let noteChar = c;

    // 高音标记: 5. （音符后跟点）
    if (i + 1 < chars.length && chars[i + 1] === '.') {
      noteChar = c;
      octaveOffset = OCTAVE_SHIFT;
      i += 2;
    }
    // 低音标记: .5 （点后跟音符）
    else if (c === '.' && i + 1 < chars.length) {
      noteChar = chars[i + 1];
      octaveOffset = -OCTAVE_SHIFT;
      i += 2;
    } else {
      i++;
    }

    const lastNote = notes.at(-1);
    const startTime = lastNote ? lastNote.startTime + lastNote.duration : 0;

    // 读取时值标记: - 延长, _ 缩短 (基准=四分音符)
    let durationMark = '';
    while (i < chars.length && (chars[i] === '-' || chars[i] === '_')) {
      durationMark += chars[i];
      i++;
    }
    const durationMult = DURATION_MARKS[durationMark] || 1;
    const duration = beatDuration * durationMult;

    // 休止符: 占时值但无音高
    if (noteChar === '0') {
      notes.push({
        pitch: null, rest: true,
        duration, startTime,
        fingering: '休止',
      });
      continue;
    }

    const finger = DIZI_FINGERINGS[noteChar];
    if (!finger) continue; // 跳过非法字符

    notes.push({
      pitch: finger.midi + octaveOffset,
      duration,
      startTime,
      velocity: 80,
      fingering: finger.fingering + (octaveOffset === 12 ? '(高)' : octaveOffset === -12 ? '(低)' : ''),
    });
  }
  return notes;
}

/** 列出所有中音区指法 */
function listFingerings() {
  return Object.entries(DIZI_FINGERINGS).map(([k, v]) => ({
    jianpu: k, midi: v.midi, name: v.name, fingering: v.fingering,
  }));
}

module.exports = { DIZI_FINGERINGS, parseJianpuToMIDI, listFingerings };
