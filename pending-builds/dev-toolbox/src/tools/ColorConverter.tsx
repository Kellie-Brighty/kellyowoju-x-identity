import { useMemo, useState } from 'react'
import { Input, Typography, Alert } from 'antd'

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const num = parseInt(h, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#2563eb')

  const parsed = useMemo(() => hexToRgb(hex), [hex])
  const rgb = parsed
  const hsl = rgb ? rgbToHsl(...rgb) : null

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Color Converter</h2>
      <div className="flex items-center gap-3">
        <Input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#2563eb"
          className="font-mono max-w-xs"
        />
        <input
          type="color"
          value={
            rgb
              ? `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`
              : '#000000'
          }
          onChange={(e) => setHex(e.target.value)}
          className="w-10 h-10 rounded border cursor-pointer"
        />
        {rgb && <div className="w-16 h-10 rounded border" style={{ backgroundColor: hex }} />}
      </div>
      {!rgb && <Alert type="error" message="Enter a valid hex color, e.g. #2563eb or #fff" showIcon />}
      {rgb && hsl && (
        <div className="flex flex-col gap-2">
          <Typography.Text code copyable>{hex.startsWith('#') ? hex : `#${hex}`}</Typography.Text>
          <Typography.Text code copyable>{`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`}</Typography.Text>
          <Typography.Text code copyable>{`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`}</Typography.Text>
        </div>
      )}
    </div>
  )
}
