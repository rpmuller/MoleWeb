// utilities
function approx(a, b, delta = 1e-4) {
  return Math.abs(a - b) < delta;
}

// function arrayeq(a,b) {}

class TestCase {
  constructor(tag, val1, val2, delta) {
    this.tag = tag;
    this.val1 = val1;
    this.val2 = val2;
    this.delta = delta;
  }
  run(verbose = false) {
    let result = false,
      op = "=",
      summary = "FAIL";
    if (this.delta === undefined) {
      result = this.val1 === this.val2;
      op = "=";
    } else {
      result = approx(this.val1, this.val2, this.delta);
      op = "\u2248";
    }
    summary = result ? "PASS" : "FAIL";
    if (verbose || !result)
      console.log(
        `    ${summary} ${this.tag}: ${this.val1}${op}${this.val2}: ${result}`
      );
    return Number(result);
  }
}

class TestSuite {
  constructor(name, cases, verbose = false) {
    this.name = name;
    this.cases = cases;
    this.verbose = verbose;
  }
  add(tcase) {
    this.cases.push(tcase);
  }
  run(verbose = false) {
    let ncases = this.cases.length,
      passed = 0;
    let start = Date.now();
    console.log(`\nTest suite ${this.name}`);
    for (let tcase of this.cases) {
      passed += tcase.run(verbose);
    }
    let elapsed = Date.now() - start;
    console.log(
      `${ncases - passed} test cases failed out of ${ncases} in ${
        elapsed / 1000
      } sec\n`
    );
  }
}
let suite = new TestSuite("PyQuante.jl tests", [
  new TestCase("1+1", 1 + 1, 2),
  //new TestCase("1+1",1+1,3), // Test false
  new TestCase("3.14", Math.PI, 3.14, 1),
]);

//suite.run(true)

// One-off test case
const VERBOSE_TESTS = false; // control result printing with global const
function test(tag, val1, val2, delta) {
  let result = false;
  if (delta === undefined) {
    result = val1 === val2;
    if (VERBOSE_TESTS || !result)
      console.log(`testing ${tag}: ${val1}=${val2} ${result}`);
  } else {
    result = approx(val1, val2, delta);
    if (VERBOSE_TESTS || !result)
      console.log(`testing ${tag}: ${val1} \u2248 ${val2} ${result}`);
  }
}

function range(start, end = 0, step = 1) {
  let l = [];
  if (end === 0) {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) l.push(i);
  return l;
}

function fact2(n) {
  let prod = 1,
    v = n;
  while (v > 0) {
    prod *= v;
    v -= 2;
  }
  return prod;
}

function fact(n) {
  let prod = 1;
  for (let i = 1; i <= n; i++) prod *= i;
  return prod;
}

suite.add(new TestCase("fact(0)", fact(0), 1));
suite.add(new TestCase("fact2(0)", fact2(0), 1));
suite.add(new TestCase("fact2(3)", fact2(3), 3));

class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  distance2(other) {
    let dx = this.x - other.x;
    let dy = this.y - other.y;
    let dz = this.z - other.z;
    return dx * dx + dy * dy + dz * dz;
  }
  distance(other) {
    return Math.sqrt(this.distance2(other));
  }
}

let a = new Point(0, 0, 0);
let b = new Point(1, 0, 0);
suite.add(new TestCase("a.distance(b)", a.distance(b), 1));

class PGBF {
  constructor(exponent, origin, I = 0, J = 0, K = 0) {
    this.exponent = exponent;
    this.origin = origin; // Point
    this.I = I;
    this.J = J;
    this.K = K;
    this.norm = 1;
    //this.normalize();
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
    let dx = pt.x - this.origin.x,
      dy = pt.y - this.origin.y,
      dz = pt.z - this.origin.z;
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

let O = a;
let s = new PGBF(1.0, O);
let px = new PGBF(1.0, O, 1);

suite.add(new TestCase("s.amplitude(O)", s.amplitude(O), 0.712705, 1e-4));
suite.add(new TestCase("px.amplitude(O)", px.amplitude(O), 0));

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
    // TODO: write the overlap function S
    //this.normalize()
  }
  normalize() {
    // Experimenting with keeping a separate norm, rather than adjusting all the coefficients
    // like I do in pyquante.

    // TODO: write the overlap function S
    this.norm = 1 / Math.sqrt(S(this, this));
  }
  amplitude(pt) {
    let sum = 0;
    for (let p of this.pgbfs) sum += this.norm * p.amplitude(pt);
    return sum;
  }
}

let sc = new CGBF(O, 0, 0, 0, [1], [1]);
suite.add(new TestCase("sc.amplitude(O)", sc.amplitude(O), 0.712705, 1e-4));

// One electron integrals

// Overlap integral over PGBFs a and b
function S(a, b) {
  let Sab = overlap(
    a.exponent,
    a.I,
    a.J,
    a.K,
    a.origin,
    b.exponent,
    b.I,
    b.J,
    b.K,
    b.origin
  );
  return a.norm * b.norm * Sab;
}
suite.add(new TestCase("S(s,s)", S(s, s), 1, 1e-8));

// Full form of the overlap integral between primative functions:
function overlap(aexp, aI, aJ, aK, a0, bexp, bI, bJ, bK, b0) {
  let r2 = a0.distance2(b0);
  let gamma = aexp + bexp;
  let P = gaussian_product_center(aexp, a0, bexp, b0);

  let pre =
    Math.pow(Math.PI / gamma, 1.5) * Math.exp((-aexp * bexp * r2) / gamma);

  let sx = overlap1d(aI, bI, P.x - a0.x, P.x - b0.x, gamma),
    sy = overlap1d(aJ, bJ, P.y - a0.y, P.y - b0.y, gamma),
    sz = overlap1d(aK, bK, P.z - a0.z, P.z - b0.z, gamma);

  return pre * sx * sy * sz;
}
suite.add(
  new TestCase("overlap", overlap(1, 0, 0, 0, O, 1, 0, 0, 0, O), 1, 1e-8)
);

// One-dimensional component of the overlap integral
function overlap1d(aL, bL, da, db, gamma) {
  let sum = 0,
    limit = 1 + Math.floor((aL + bL) / 2);
  for (let i = 0; i < limit; i++)
    sum +=
      (binomial_prefactor(2 * i, aL, bL, da, db) * fact2(2 * i - 1)) /
      Math.pow(2 * gamma, i);
  return sum;
}
suite.add(new TestCase("overlap1d", overlap1d(0, 0, 0, 0, 1), 1));

// The integral prefactor containing the binomial coefficients
function binomial_prefactor(s, ia, ib, xpa, xpb) {
  let sum = 0;
  for (let t = 0; t < s + 1; t++) {
    if (t >= s - ia && t <= ib)
      sum +=
        binomial(ia, s - t) *
        binomial(ib, t) *
        Math.pow(xpa, ia - s + t) *
        Math.pow(xpb, ib - t);
  }
  return sum;
}
suite.add(
  new TestCase("binomial prefactor", binomial_prefactor(0, 0, 0, 0, 0), 1)
);

// The center of the gaussian function resulting from the product of two gaussians
function gaussian_product_center(aexp, a0, bexp, b0) {
  let a = aexp / (aexp + bexp),
    b = bexp / (aexp + bexp);
  return new Point(
    a * a0.x + b * b0.x,
    a * a0.y + b * b0.y,
    a * a0.z,
    b * b0.z
  );
}
//should probably make a harder to pass testcase
let gc = gaussian_product_center(1, O, 1, O);
suite.add(new TestCase("gaussian product center", gc.x + gc.y + gc.z, 0));

// binomial coefficient: should this be called `choose`?
function binomial(n, k) {
  if (n == k) return 1;
  console.assert(n > k);
  return fact(n) / fact(k) / fact(n - k);
}
suite.add(new TestCase("binomial", binomial(8, 3), 56));

suite.run();
