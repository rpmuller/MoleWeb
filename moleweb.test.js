import { TestCase, TestSuite } from "./test";
import {
  atnos,
  parse_xyz,
  text_part,
  get_atno,
  distance,
  to_kcal_mol,
} from "./moleweb.js";

let suite = new TestSuite("moleweb tests");
suite.add(new TestCase("Atomic number He", atnos["He"], 2));
suite.add(new TestCase("Atomic number Li", atnos["Li"], 3));
suite.add(
  new TestCase("parse geo", parse_xyz("O1 0.0 0.0 0.0"), ["O1", 0, 0, 0])
);
suite.add(new TestCase("text_part", text_part("O1"), "O"));
suite.add(new TestCase("get_atno", get_atno("O1"), 8));
suite.add(new TestCase("get_atno Kr", get_atno("Kr"), 36));
suite.add(
  new TestCase("distance", distance(0, 0, 0, 1, 1, 0), Math.SQRT2, 1e-5)
);
suite.add(new TestCase("to_kcal_mol", to_kcal_mol(1), 627.51, 1e-5));

suite.run(true);

// console.log(`parse geo ${parse_xyz("O1 0.0 0.0 0.0")} ${["O1", 0, 0, 0]}`);
// console.log(`text_part ${text_part("O1")} O`);
