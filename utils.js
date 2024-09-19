
import { TestCase, TestSuite } from "./test.js";

let suite = new TestSuite("pyquante/utils tests");

function range(start, end = 0, step = 1) {
  // TODO make into a generator or iterator
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

// replacing the old Point with a 3-tuple:
function distance2(xyz1, xyz2) {
  console.assert(xyz1.length === xyz2.length);
  let dx = xyz1[0] - xyz2[0];
  let dy = xyz1[1] - xyz2[1];
  let dz = xyz1[2] - xyz2[2];
  return dx * dx + dy * dy + dz * dz;
}
function distance(xyz1, xyz2) {
  return Math.sqrt(distance2(xyz1, xyz2));
}

suite.add(new TestCase("distance", distance([0, 0, 0], [1, 0, 0]), 1));

suite.run(true)

export {fact, fact2, distance, distance2};