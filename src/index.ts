import compiler from "./compiler";
import formatter from "./formatter";
import optimizer from "./optimizer";
import parser from "./parser";
import tokenizer from "./tokenizer";
import typeChecker from "./typeChecker";
import virtualMachine from "./virtualMachine";

export const evaluate = (source: string) => (
  virtualMachine(compiler(optimizer(parser(tokenizer(source)))))
);

export const format = (source: string, { optimize }: { optimize?: boolean } = {}) => {
  let node = parser(tokenizer(source));
  if (optimize) {
    node = optimizer(node)
  }

  return formatter(node);
};

export const typeCheck = (source: string) => (
  typeChecker(parser(tokenizer(source)))
);
