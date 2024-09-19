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
    if (typeof this.val1 === "object") {
      // assume this is an array test:
      if (this.delta === undefined) this.delta = 1e-7;
      result = arrayeq(this.val1, this.val2, this.delta);
    } else if (this.delta === undefined) {
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
let suite = new TestSuite("tests.js tests", [
  new TestCase("1+1", 1 + 1, 2),
  //new TestCase("1+1",1+1,3), // Test false
  new TestCase("3.14", Math.PI, 3.14, 1),
]);


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

// utilities
function approx(a, b, delta = 1e-4) {
  return Math.abs(a - b) < delta;
}

function arrayeq(arr1, arr2, delta) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++)
    if (!approx(arr1[i], arr2[i], delta)) return false;
  return true;
}

suite.add(new TestCase("arrayeq",[1,1.2],[1,1.2]));

suite.run(true)

export { TestCase, TestSuite, test };
