// prettier-ignore
let symbols = ['',
    'H',                                                                               'He',
    'Li','Be',                                                     'B','C','N','O','F','Ne',
    "Na","Mg",                                                  "Al","Si","P","S","Cl","Ar",
    "K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"];
let atnos = {};
for (let [i, s] of symbols.entries()) {
  atnos[s] = i;
}
function get_atno(symbol) {
  return atnos[text_part(symbol)];
}
function text_part(word) {
  // matches the character part of an atom label
  return word.match(/[A-Za-z]+/);
}
function parse_xyz(text) {
  let geo = [];
  for (let line of text.split("\n")) {
    let words = line.trim().split(/\s/);
    if (words.length < 4) continue;
    let sym = words[0];
    let x = +words[1];
    let y = +words[2];
    let z = +words[3];
    geo.push([sym, x, y, z]);
  }
  return geo;
}
function distance(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
  );
}
function to_kcal_mol(energy_h) {
  return 627.51 * energy_h;
}
function e_repulsion(geo) {
  let erep = 0;
  let i, j;
  for (i = 0; i < geo.length; i++) {
    [symi, xi, yi, zi] = geo[i];
    for (j = 0; j < i; j++) {
      [symj, xj, yj, zj] = geo[j];
      erep +=
        (get_atno(symi) * get_atno(symj)) / distance(xi, yi, zi, xj, yj, zj);
    }
  }
  return erep;
}

export { atnos, parse_xyz, text_part, get_atno, distance, to_kcal_mol };
