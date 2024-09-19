import { TestCase, TestSuite } from "./test.js";
import {
  S,
  //  Sc,
  overlap1d,
  overlap,
  gaussian_product_center,
  binomial_prefactor,
  binomial,
  kinetic,
  T,
  Tc,
  nuclear_attraction,
  V,
  Vc,
  A_term,
  A_array,
} from "./onee_ints.js";

import { PGBF, CGBF } from "./gbfs.js";

let O = [0, 0, 0];
let s = new PGBF(1.0, O);
let px = new PGBF(1.0, O, 1);
let sc = new CGBF(O, 0, 0, 0, [1], [1]);

let suite = new TestSuite("pyquante tests");

suite.add(new TestCase("S(s,s)", S(s, s), 1, 1e-8));

suite.add(
  new TestCase(
    "overlap",
    overlap(1, 0, 0, 0, O, 1, 0, 0, 0, O),
    1.96870124,
    1e-5
  )
);

suite.add(new TestCase("overlap1d", overlap1d(0, 0, 0, 0, 1), 1));

suite.add(
  new TestCase("binomial prefactor", binomial_prefactor(0, 0, 0, 0, 0), 1)
);

//should probably make a harder to pass testcase
let gc = gaussian_product_center(1, O, 1, O);
suite.add(new TestCase("gaussian product center", gc[0] + gc[1] + gc[2], 0));

suite.add(new TestCase("binomial", binomial(8, 3), 56));

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

suite.add(new TestCase("kinetic T", T(s, s), 1.5, 1e-6));

suite.add(new TestCase("kinetic Tc", Tc(sc, sc), 1.5, 1e-6));
suite.add(
  new TestCase(
    "nuclear_attraction",
    nuclear_attraction(1, 0, 0, 0, [0, 0, 0], 1, 0, 0, 0, [0, 0, 0], [0, 0, 0]),
    -3.141593,
    1e-6
  )
);
suite.add(
  new TestCase("nuclear attraction V", V(s, s, [0, 0, 0]), -1.595769, 1e-5)
);
suite.add(
  new TestCase("Nuclear attraction Vc", Vc(sc, sc, [0, 0, 0]), -1.595769, 1e-5)
);
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
