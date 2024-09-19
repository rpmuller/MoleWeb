import { TestCase, TestSuite } from "./test.js";
import {fact, fact2, distance2} from "./utils.js";

let suite = new TestSuite("pyquante tests");

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

// Contracted Overlap function:
function Sc(ca, cb) {
  let olap = 0;
  for (let i = 0; i < ca.pgbfs.length; i++)
    for (let j = 0; j < cb.pgbfs.length; j++)
      olap += ca.coefs[i] * cb.coefs[j] * S(ca.pgbfs[i], cb.pgbfs[j]);
  return ca.norm * cb.norm * olap;
}

// Full form of the overlap integral between primative functions:
function overlap(aexp, aI, aJ, aK, a0, bexp, bI, bJ, bK, b0) {
  let r2 = distance2(a0, b0);
  let gamma = aexp + bexp;
  let P = gaussian_product_center(aexp, a0, bexp, b0);

  let pre =
    Math.pow(Math.PI / gamma, 1.5) * Math.exp((-aexp * bexp * r2) / gamma);

  let sx = overlap1d(aI, bI, P[0] - a0[0], P[0] - b0[0], gamma),
    sy = overlap1d(aJ, bJ, P[1] - a0[1], P[1] - b0[1], gamma),
    sz = overlap1d(aK, bK, P[2] - a0[2], P[2] - b0[2], gamma);

  return pre * sx * sy * sz;
}
suite.add(
  new TestCase(
    "overlap",
    overlap(1, 0, 0, 0, O, 1, 0, 0, 0, O),
    1.96870124,
    1e-5
  )
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
  return [a * a0[0] + b * b0[0], a * a0[1] + b * b0[1], a * a0[2] + b * b0[2]];
}
//should probably make a harder to pass testcase
let gc = gaussian_product_center(1, O, 1, O);
suite.add(new TestCase("gaussian product center", gc[0] + gc[1] + gc[2], 0));

// binomial coefficient: should this be called `choose`?
function binomial(n, k) {
  if (n == k) return 1;
  console.assert(n > k);
  return fact(n) / fact(k) / fact(n - k);
}
suite.add(new TestCase("binomial", binomial(8, 3), 56));

// Kinetic energy
function kinetic(alpha1, l1, m1, n1, A, alpha2, l2, m2, n2, B) {
  let term0 =
    alpha2 *
    (2 * (l2 + m2 + n2) + 3) *
    overlap(alpha1, l1, m1, n1, A, alpha2, l2, m2, n2, B);
  let term1 =
    -2 *
    alpha2 ** 2 *
    (overlap(alpha1, l1, m1, n1, A, alpha2, l2 + 2, m2, n2, B) +
      overlap(alpha1, l1, m1, n1, A, alpha2, l2, m2 + 2, n2, B) +
      overlap(alpha1, l1, m1, n1, A, alpha2, l2, m2, n2 + 2, B));
  let term2 =
    -0.5 *
    (l2 * (l2 - 1) * overlap(alpha1, l1, m1, n1, A, alpha2, l2 - 2, m2, n2, B) +
      overlap(alpha1, l1, m1, n1, A, alpha2, l2, m2 - 2, n2, B) +
      overlap(alpha1, l1, m1, n1, A, alpha2, l2, m2, n2 - 2, B));
  return term0 + term1 + term2;
}

suite.add(
  new TestCase(
    "kinetic prim",
    kinetic(
      s.exponent,
      s.I,
      s.J,
      s.K,
      s.origin,
      s.exponent,
      s.I,
      s.J,
      s.K,
      s.origin
    ),
    2.953052,
    1e-5
  )
);

function T(a,b){
  return a.norm*b.norm*kinetic(a.exponent,a.I,a.J,a.K,a.origin,
                              b.exponent,b.I,b.J,b.K,b.origin);
}

suite.add(new TestCase("kinetic T",T(s,s),1.5,1e-6));

function Tc(ca, cb) {
  let total = 0;
  for (let i = 0; i < ca.pgbfs.length; i++)
    for (let j = 0; j < cb.pgbfs.length; j++)
      total += ca.coefs[i] * cb.coefs[j] * T(ca.pgbfs[i], cb.pgbfs[j]);
  return ca.norm * cb.norm * total;
}
suite.add(new TestCase("kinetic Tc",Tc(sc,sc),1.5,1e-6));

function array_minus(arr1, arr2) {
  let diff = Array(arr1.length);
  for (let i = 0; i < arr1.length; i++) diff[i] = arr1[i] - arr2[i];
  return diff;
}

function nuclear_attraction(alpha1, l1, m1, n1, A, alpha2, l2, m2, n2, B, C) {
  let gamma = alpha1 + alpha2;

  let P = gaussian_product_center(alpha1, A, alpha2, B);
  let rab2 = distance2(A, B);

  let dPA = array_minus(P, A);
  let dPB = array_minus(P, B);
  let dPC = array_minus(P, C);

  let Ax = A_array(l1, l2, dPA[0], dPB[0], dPC[0], gamma);
  let Ay = A_array(m1, m2, dPA[1], dPB[1], dPC[1], gamma);
  let Az = A_array(n1, n2, dPA[2], dPB[2], dPC[2], gamma);

  let total = 0;
  for (let I = 0; I < l1 + l2 + 1; I++)
    for (let J = 0; J < m1 + m2 + 1; J++)
      for (let K = 0; K < n1 + n2 + 1; K++)
        total += Ax[I] * Ay[J] * Az[K] ;// * Fgamma(I + J + K, rcp2 * gamma);

  let val =
    ((-2 * Math.PI) / gamma) * Math.exp((-alpha1 * alpha2 * rab2) / gamma) * total;
  return val;
}
suite.add(new TestCase("nuclear_attraction",nuclear_attraction(1,0,0,0,[0,0,0],1,0,0,0,[0,0,0],[0,0,0]),-3.141593,1e-6));

function V(a,b,C){
  return a.norm*b.norm*nuclear_attraction(a.exponent,a.I,a.J,a.K,a.origin,
    b.exponent,b.I,b.J,b.K,b.origin,C);
}
suite.add(new TestCase("nuclear attraction V",V(s,s,[0,0,0]),-1.595769,1e-5));

function Vc(ca,cb,C){
  let total = 0;
  for (let i = 0; i < ca.pgbfs.length; i++)
    for (let j = 0; j < cb.pgbfs.length; j++)
      total += ca.coefs[i] * cb.coefs[j] * V(ca.pgbfs[i], cb.pgbfs[j],C);
  return ca.norm * cb.norm * total;
}
suite.add(new TestCase("Nuclear attraction Vc",Vc(sc,sc,[0,0,0]),-1.595769,1e-5));

function A_term(i, r, u, l1, l2, PAx, PBx, CPx, gamma) {
  return (
    (Math.pow(-1, i) *
      binomial_prefactor(i, l1, l2, PAx, PBx) *
      Math.pow(-1, u) *
      fact(i) *
      Math.pow(CPx, i - 2 * r - 2 * u) *
      Math.pow(0.25 / gamma, r + u)) /
    fact(r) /
    fact(u) /
    fact(i - 2 * r - 2 * u)
  );
}
suite.add(
  new TestCase(
    "A_term(0,0,0,0,0,0,0,0,1)",
    A_term(0, 0, 0, 0, 0, 0, 0, 0, 1),
    1.0
  )
);
suite.add(
  new TestCase(
    "A_term(0,0,0,0,1,1,1,1,1)",
    A_term(0, 0, 0, 0, 1, 1, 1, 1, 1),
    1.0
  )
);
suite.add(
  new TestCase(
    "A_term(1,0,0,0,1,1,1,1,1)",
    A_term(1, 0, 0, 0, 1, 1, 1, 1, 1),
    -1.0
  )
);
suite.add(
  new TestCase(
    "A_term(0,0,0,1,1,1,1,1,1)",
    A_term(0, 0, 0, 1, 1, 1, 1, 1, 1),
    1.0
  )
);
suite.add(
  new TestCase(
    "A_term(1,0,0,1,1,1,1,1,1)",
    A_term(1, 0, 0, 1, 1, 1, 1, 1, 1),
    -2.0
  )
);
suite.add(
  new TestCase(
    "A_term(2,0,0,1,1,1,1,1,1)",
    A_term(2, 0, 0, 1, 1, 1, 1, 1, 1),
    1.0
  )
);
suite.add(
  new TestCase(
    "A_term(2,0,1,1,1,1,1,1,1)",
    A_term(2, 0, 1, 1, 1, 1, 1, 1, 1),
    -0.5
  )
);
suite.add(
  new TestCase(
    "A_term(2,1,0,1,1,1,1,1,1)",
    A_term(2, 1, 0, 1, 1, 1, 1, 1, 1),
    0.5
  )
);

function A_array(l1, l2, PA, PB, CP, g) {
  let Imax = l1 + l2 + 1;
  let A = Array(Imax).fill(0);
  for (let i = 0; i < Imax; i++) {
    for (let r = 0; r < Math.floor(i / 2) + 1; r++) {
      for (let u = 0; u < Math.floor((i - 2 * r) / 2) + 1; u++) {
        let I = i - 2 * r - u;
        A[I] += A_term(i, r, u, l1, l2, PA, PB, CP, g);
      }
    }
  }
  return A;
}

function sum(arr) {
  let total = 0;
  for (let ai of arr) total += ai;
  return total;
}
suite.add(
  new TestCase("A_array(0,0,0,0,0,1)", A_array(0, 0, 0, 0, 0, 1), [1.0])
);
suite.add(
  new TestCase("A_array(0,1,1,1,1,1)", A_array(0, 1, 1, 1, 1, 1), [1.0, -1.0])
);
suite.add(
  new TestCase(
    "A_array(1,1,1,1,1,1)",
    A_array(1, 1, 1, 1, 1, 1),
    [1.5, -2.5, 1.0]
  )
);

suite.run(true);
