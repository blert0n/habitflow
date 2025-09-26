import tinycolor from 'tinycolor2'

export const createLightGradient = (color: string) => {
  const baseColor = tinycolor(color)

  // Create very light versions (95% and 98% lightness) for subtle gradient
  const lightColor1 = baseColor.clone().lighten(40).setAlpha(0.15)
  const lightColor2 = baseColor.clone().lighten(45).setAlpha(0.08)

  return `linear-gradient(135deg, ${lightColor1.toRgbString()}, ${lightColor2.toRgbString()})`
}
