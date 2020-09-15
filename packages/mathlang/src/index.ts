import compiler from "./compiler";
import optimizer from "./optimizer";
import parser from "./parser";
import tokenizer from "./tokenizer";
import typeChecker from "./typeChecker";
import { Nodes } from "./types";
import virtualMachine from "./virtualMachine";

type Options = { optimize?: boolean };

const optimizeWithOptions = (node: Nodes.Program, options: Options) => (
  options.optimize ? optimizer(node) : node
);

export const parse = (source: string, options: Options = {}) => (
  optimizeWithOptions(parser(tokenizer(source)), options)
);

export const compile = (source: string, options: Options = {}) => (
  compiler(parse(source, options))
);

export const evaluate = (source: string, options: Options = {}) => (
  virtualMachine(compile(source, options))
);

export const tokenize = tokenizer;

export const typeCheck = (source: string) => typeChecker(parse(source));

export { Nodes } from "./types";