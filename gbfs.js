import { fact2 } from "./utils.js";
import { Sc } from "./onee_ints.js";

class PGBF {
  constructor(exponent, origin, I = 0, J = 0, K = 0) {
    this.exponent = exponent;
    this.origin = origin; // xyz tuple
    this.I = I;
    this.J = J;
    this.K = K;
    this.norm = 1;
    this.normalize();
  }
  normalize() {
    let IJK = this.I + this.J + this.K;
    this.norm = Math.sqrt(
      (Math.pow(2, 2 * IJK + 1.5) * Math.pow(this.exponent, IJK + 1.5)) /
        fact2(2 * this.I - 1) /
        fact2(2 * this.J - 1) /
        fact2(2 * this.K - 1) /
        Math.pow(Math.PI, 1.5)
    );
  }
  amplitude(pt) {
    let dx = pt[0] - this.origin[0],
      dy = pt[1] - this.origin[1],
      dz = pt[2] - this.origin[2];
    let r2 = dx * dx + dy * dy + dz * dz;
    return (
      this.norm *
      dx ** this.I *
      dy ** this.J *
      dz ** this.K *
      Math.exp(-this.exponent * r2)
    );
  }
}

class CGBF {
  constructor(origin, I = 0, J = 0, K = 0, exps = [], coefs = []) {
    this.origin = origin;
    this.I = I;
    this.J = J;
    this.K = K;
    console.assert(exps.length === coefs.length);
    this.pgbfs = [];
    this.coefs = coefs;
    for (let i = 0; i < exps.length; i++) {
      this.pgbfs.push(new PGBF(exps[i], origin, I, J, K));
    }
    this.norm = 1;
    this.normalize();
  }
  normalize() {
    // Experimenting with keeping a separate norm, rather than adjusting all the coefficients
    // like I do in pyquante.
    this.norm = 1 / Math.sqrt(Sc(this, this));
  }
  amplitude(pt) {
    let sum = 0;
    for (let p of this.pgbfs) sum += this.norm * p.amplitude(pt);
    return sum;
  }
}

export { PGBF, CGBF };
