/* ============ PROJECTION SOUND — synthesized, MOS until asked ============
   WebAudio only, no samples. The projector can only speak after a gesture. */

let ac: AudioContext | null = null;
let master: GainNode | null = null;
let whir: { src: AudioBufferSourceNode; lfo: OscillatorNode } | null = null;

function ctx(): AudioContext {
  if (ac) return ac;
  ac = new AudioContext();
  master = ac.createGain();
  master.gain.value = 0.5;
  master.connect(ac.destination);
  return ac;
}

function env(node: GainNode, t0: number, a: number, peak: number, d: number) {
  node.gain.setValueAtTime(0, t0);
  node.gain.linearRampToValueAtTime(peak, t0 + a);
  node.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
}

function tone(f: number, dur: number, peak: number, type: OscillatorType = "sine") {
  const a = ctx(), o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = f;
  o.connect(g); g.connect(master!);
  env(g, a.currentTime, 0.008, peak, dur);
  o.start(); o.stop(a.currentTime + dur + 0.1);
}

function noise(dur: number, peak: number, f0: number, q = 1) {
  const a = ctx(), len = (a.sampleRate * dur) | 0;
  const b = a.createBuffer(1, len, a.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
  src.buffer = b; bp.type = "bandpass"; bp.frequency.value = f0; bp.Q.value = q;
  src.connect(bp); bp.connect(g); g.connect(master!);
  env(g, a.currentTime, 0.003, peak, dur);
  src.start();
}

export type SfxName = "blip" | "tick" | "clack" | "chime" | "kachunk" | "miss" | "wrap" | "beep";

const SFX: Record<SfxName, () => void> = {
  blip: () => tone(660, 0.06, 0.12, "square"),
  tick: () => tone(1180, 0.03, 0.06, "square"),
  clack: () => { noise(0.08, 0.5, 2400, 0.8); tone(180, 0.06, 0.2, "triangle"); },
  chime: () => { tone(659, 0.35, 0.14); setTimeout(() => tone(988, 0.5, 0.12), 110); },
  kachunk: () => { tone(82, 0.16, 0.3, "triangle"); setTimeout(() => noise(0.05, 0.3, 1600, 2), 90); },
  miss: () => tone(196, 0.18, 0.12, "triangle"),
  wrap: () => { tone(523, 0.3, 0.12); setTimeout(() => tone(659, 0.3, 0.12), 140); setTimeout(() => tone(784, 0.6, 0.12), 280); },
  beep: () => tone(1000, 0.08, 0.1), // the leader's 2-pop
};

export function sfx(name: SfxName) {
  try { SFX[name](); } catch { /* audio unavailable */ }
}

export function resumeAudio() {
  try { ctx().resume?.(); } catch { /* no gesture yet */ }
}

/* the booth whir: filtered brown noise with a slow flutter */
export function whirOn() {
  if (whir) return;
  try {
    const a = ctx(), len = a.sampleRate * 2;
    const b = a.createBuffer(1, len, a.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = (last + (Math.random() * 2 - 1) * 0.02) * 0.995; d[i] = last * 3; }
    const src = a.createBufferSource(), lp = a.createBiquadFilter(), g = a.createGain(),
      lfo = a.createOscillator(), lg = a.createGain();
    src.buffer = b; src.loop = true;
    lp.type = "lowpass"; lp.frequency.value = 520;
    g.gain.value = 0.045; lfo.frequency.value = 11.5; lg.gain.value = 0.012;
    lfo.connect(lg); lg.connect(g.gain);
    src.connect(lp); lp.connect(g); g.connect(master!);
    src.start(); lfo.start();
    whir = { src, lfo };
  } catch { /* audio unavailable */ }
}

export function whirOff() {
  if (!whir) return;
  try { whir.src.stop(); whir.lfo.stop(); } catch { /* already stopped */ }
  whir = null;
}
