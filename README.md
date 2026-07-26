# dizi-midi-tool 🎵

竹笛音阶 MIDI 生成器 — 将简谱映射到 D 调竹笛【筒音作5】指法表的 MIDI 音符序列。

## 安装

```bash
npm install dizi-midi-tool
```

## 使用

### CLI

```bash
npx dizi-midi-tool ".5 5 5. 6 5 3 2 1" 120
npx dizi-midi-tool --fingerings   # 查看指法表
```

### API

```js
const { parseJianpuToMIDI } = require("dizi-midi-tool");
const notes = parseJianpuToMIDI("5 5 6 5 3 2 1", 100);
// → [{ pitch:62, duration:0.6, startTime:0, velocity:80, fingering:"全按" }, ...]
```

## 语法

| 记谱 | 含义 | MIDI 偏移 |
|------|------|-----------|
| `5`  | 中音(四分音符) | 基准值 |
| `.5` | 低音 | −12 |
| `5.` | 高音 | +12 |
| `5-` | 二分音符(延长一倍) | 同音高 |
| `5--`| 全音符(延长两倍) | 同音高 |
| `5_` | 八分音符(缩短一半) | 同音高 |
| `5__`| 十六分音符(缩短至¼) | 同音高 |
| `0`  | 休止符 | 占时值，无声 |

## 局限 & 路线图

当前仅 D 调筒音作5指法，不支持变调/倚音/滑音，未生成 .mid 文件。  
规划：.mid 二进制输出 → 多指法支持 → 拍号解析 → Web 演示。

MIT License
