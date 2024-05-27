const getBrightness = (hexColor) => {
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const isLightColor = (hexColor) => {
  return getBrightness(hexColor) > 128;
};

export default isLightColor;
