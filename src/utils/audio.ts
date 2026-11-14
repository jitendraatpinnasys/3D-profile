/**
 * Tiny generated ambient pad (no audio files, no network). Off by default.
 */
let ctx: AudioContext | null = null
let master: GainNode | null = null

export function setAmbient(on: boolean) {
  if (on) {
    if (!ctx) {
      ctx = new AudioContext()
      master = ctx.createGain()
      master.gain.value = 0
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 420
      filter.connect(master)
      master.connect(ctx.destination)
      ;[55, 82.4, 110.2, 164.8].forEach((f, i) => {
        const osc = ctx!.createOscillator()
        osc.type = i % 2 ? 'triangle' : 'sine'
        osc.frequency.value = f
        osc.detune.value = (i - 1.5) * 6
        const g = ctx!.createGain()
        g.gain.value = 0.18 / (i + 1)
        // slow tremolo for movement
        const lfo = ctx!.createOscillator()
        lfo.frequency.value = 0.05 + i * 0.03
        const lfoGain = ctx!.createGain()
        lfoGain.gain.value = 0.05
        lfo.connect(lfoGain).connect(g.gain)
        osc.connect(g).connect(filter)
        osc.start()
        lfo.start()
      })
    }
    void ctx.resume()
    master!.gain.setTargetAtTime(0.12, ctx.currentTime, 0.8)
  } else if (ctx && master) {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
  }
}
