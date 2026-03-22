function generateStars(count) {
  let stars = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 2000;
    const y = Math.random() * 2000;
    stars.push(`${x}px ${y}px #FFF`);
  }
  return stars.join(", ");
}
const isCoarse = matchMedia("(pointer: coarse)").matches;
const factor = isCoarse ? 0.45 : 1;

stars.style.boxShadow  = generateStars(Math.round(700 * factor));
stars2.style.boxShadow = generateStars(Math.round(300 * factor));
stars3.style.boxShadow = generateStars(Math.round(150 * factor));