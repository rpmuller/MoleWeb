import {TestCase, TestSuite} from "./test.js";

let suite2 = new TestSuite("pyquante/tests testing empty suite");
suite2.run(true);

let suite = new TestSuite("test.js tests", [
  new TestCase("1+1", 1 + 1, 2),
  //new TestCase("1+1",1+1,3), // Test false
  new TestCase("3.14", Math.PI, 3.14, 1),
]);
suite.add(new TestCase("arrayeq",[1,1.2],[1,1.2]));

suite.run(true)
