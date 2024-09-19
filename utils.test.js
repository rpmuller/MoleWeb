import {TestCase, TestSuite} from "./test.js";

import {fact,fact2,distance} from "./utils.js";

let suite = new TestSuite("pyquante/utils tests");

suite.add(new TestCase("fact(0)", fact(0), 1));
suite.add(new TestCase("fact2(0)", fact2(0), 1));
suite.add(new TestCase("fact2(3)", fact2(3), 3));
suite.add(new TestCase("distance", distance([0, 0, 0], [1, 0, 0]), 1));

suite.run(true)

