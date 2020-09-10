import evaluator from "./evaluator";
import generator from "./generator";
import parser from "./parser";
import tokenizer from "./tokenizer";

const input = "add(1, 2)";

const tree = parser(tokenizer(input));
console.log(generator(tree));
console.log(evaluator(tree));
