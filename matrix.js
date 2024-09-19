class Matrix {
  constructor(nrows, ncols) {
    this.nrows = nrows;
    this.ncols = ncols;
    this.data = new Float64Array(nrows * ncols);
  }
  get(i, j) {
    return this.data[i + j * this.nrows];
  }
  set(i, j, val) {
    this.data[i + j * this.nrows] = val;
  }
  *row(i) {
    for (let j = 0; j < this.ncols; j++) yield this.data[i + j * this.nrows];
  }
  *col(j) {
    for (let i = 0; i < this.nrows; i++) yield this.data[i + j * this.nrows];
  }
  toString() {
    let rows = [];
    for (let i = 0; i < this.nrows; i++) rows.push([...this.row(i)].join(" "));
    return rows.join("\n").concat("\n");
  }
  scale(a) {
    // Scale matrix in place:
    for (let i = 0; i < this.data.length; i++) this.data[i] *= a;
    return this;
  }
  addto(a) {
    // Increment matrix by another
    console.assert(this.data.length === a.data.length);
    for (let i = 0; i < this.data.length; i++) this.data[i] += a.data[i];
    return this;
  }
}

function identity(n) {
  let I = new Matrix(n, n);
  for (let i = 0; i < n; i++) I.set(i, i, 1);
  return I;
}

function matmult(a, b) {
  console.assert(a.ncols === b.nrows);
  let c = new Matrix(a.nrows, b.ncols);
  for (let j = 0; j < b.ncols; j++)
    for (let i = 0; i < a.nrows; i++)
      for (let k = 0; k < a.ncols; k++)
        c.data[i + j * c.nrows] +=
          a.data[i + k * a.nrows] * b.data[k + j * b.nrows];
  return c;
}

let m = new Matrix(2, 2);
m.set(0, 0, 5);
let I = identity(2);
let Im = matmult(I, m);

console.log(...m.row(0));
console.log(...m.col(1));
console.log(m.get(0, 0));
console.log(m.toString());
console.log(identity(5).toString());
console.log(Im.toString());
console.log(Im.scale(3).toString());
