import { TestCase, TestSuite } from "./test.js";
import { PGBF, CGBF } from "./gbfs.js";
import { Sc } from "./onee_ints.js";

let suite = new TestSuite("pyquante/gbfs tests");

let O = [0, 0, 0];
let s = new PGBF(1.0, O);
let px = new PGBF(1.0, O, 1);

suite.add(new TestCase("s.amplitude(O)", s.amplitude(O), 0.712705, 1e-4));
suite.add(new TestCase("px.amplitude(O)", px.amplitude(O), 0));

let sc = new CGBF(O, 0, 0, 0, [1], [1]);
suite.add(new TestCase("sc.amplitude(O)", sc.amplitude(O), 0.712705, 1e-4));
suite.add(new TestCase("Sc overlap", Sc(sc, sc), 1.0));

suite.run(true);
