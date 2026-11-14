import * as THREE from 'three'

export const FONT_SANS = '"Inter Tight Variable", "Inter Tight", system-ui, sans-serif'
export const FONT_MONO = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace'

export interface TextLine {
  text: string
  size: number
  weight?: number
  font?: 'sans' | 'mono'
  color?: string
  /** extra spacing above this line, in px */
  gap?: number
  letterSpacing?: number
}

export interface TextTextureOptions {
  width: number
  height: number
  padding?: number
  align?: CanvasTextAlign
  background?: string
  border?: string
  radius?: number
}

/**
 * Draws text into a canvas and returns a texture. Used for in-world labels so the
 * scene never needs to fetch font files at runtime (fonts are bundled locally).
 */
export function makeTextTexture(lines: TextLine[], opts: TextTextureOptions): THREE.CanvasTexture {
  const dpr = 2
  const { width, height, padding = 32, align = 'left', background, border, radius = 28 } = opts
  const canvas = document.createElement('canvas')
  canvas.width = width * dpr
  canvas.height = height * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  if (background || border) {
    ctx.beginPath()
    ctx.roundRect(1, 1, width - 2, height - 2, radius)
    if (background) {
      ctx.fillStyle = background
      ctx.fill()
    }
    if (border) {
      ctx.strokeStyle = border
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  ctx.textAlign = align
  ctx.textBaseline = 'top'
  const x = align === 'center' ? width / 2 : align === 'right' ? width - padding : padding
  let y = padding
  for (const line of lines) {
    y += line.gap ?? 0
    ctx.font = `${line.weight ?? 600} ${line.size}px ${line.font === 'mono' ? FONT_MONO : FONT_SANS}`
    ctx.fillStyle = line.color ?? '#f4f4f5'
    if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${line.letterSpacing ?? 0}px`
    for (const wrapped of wrap(ctx, line.text, width - padding * 2)) {
      ctx.fillText(wrapped, x, y)
      y += line.size * 1.22
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(' ')
  const out: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > max && line) {
      out.push(line)
      line = w
    } else line = test
  }
  if (line) out.push(line)
  return out
}

/** Soft radial glow texture for sprites / light pools. */
export function makeGlowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)'): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, inner)
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
