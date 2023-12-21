export function hexToRgba(hex, alpha) {
  hex = hex.replace(/^#/, '');

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const a = alpha !== undefined ? alpha : 1;
  
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function getOppositeColor(hexColor) {
  hexColor = hexColor.replace(/^#/, '');

  const decimalColor = parseInt(hexColor, 16);
  const oppositeDecimalColor = 0xFFFFFF ^ decimalColor;
  const oppositeHexColor = '#' + oppositeDecimalColor.toString(16).padStart(6, '0');

  return oppositeHexColor;
}