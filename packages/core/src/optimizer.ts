import { Nodes } from "./types";
import { add, assign, call, define, divide, exponentiate, modulo, multiply, negate, number, program, stmtList, subtract } from "./builders";

type Optimizer = Partial<{ [T in Nodes.All["kind"]]: (node: Nodes.All & { kind: T }) => Nodes.All | undefined }>;

const optimize = (node: Nodes.All, optimizer: Optimizer): Nodes.All => {
  const optimizeNode = <N extends Nodes.All>(node: Nodes.All): N => {
    const callback = optimizer[node.kind];
    return callback ? ((callback as any)(node) || node) : node;
  };

  const visitNode = <N extends Nodes.All>(node: Nodes.All): N => {
    switch (node.kind) {
      case "add":
        return optimizeNode(add({ left: visitNode(node.left), right: visitNode(node.right) }));
      case "assign":
        return optimizeNode(assign({ name: node.name, value: visitNode(node.value) }));
      case "call":
        return optimizeNode(call({ name: node.name, args: node.args.map((arg) => visitNode(arg)) }));
      case "define":
        return optimizeNode(define({ name: node.name, paramList: node.paramList, stmtList: visitNode(node.stmtList) }));
      case "divide":
        return optimizeNode(divide({ left: visitNode(node.left), right: visitNode(node.right) }));
      case "exponentiate":
        return optimizeNode(exponentiate({ left: visitNode(node.left), right: visitNode(node.right) }));
      case "modulo":
        return optimizeNode(modulo({ left: visitNode(node.left), right: visitNode(node.right) }));
      case "multiply":
        return optimizeNode(multiply({ left: visitNode(node.left), right: visitNode(node.right) }));
      case "negate":
        return optimizeNode(negate({ value: visitNode(node.value) }));
      case "program":
        return optimizeNode(program({ stmtList: visitNode(node.stmtList) }));
      case "stmtList":
        return optimizeNode(stmtList({ stmts: node.stmts.map(visitNode) as Nodes.Stmt[] }));
      case "subtract":
        return optimizeNode(subtract({ left: visitNode(node.left), right: visitNode(node.right) }));
      case "number":
      case "variable":
        return node as N;
    }
  }

  return visitNode(node);
};

const isNumber = (node: Nodes.All): node is Nodes.Number => node.kind === "number";

const replaceConstantExpressions: Optimizer = {
  add(node) {
    if (isNumber(node.left) && isNumber(node.right)) {
      return number({ value: node.left.value + node.right.value });
    }
  },
  divide(node) {
    if (isNumber(node.left) && isNumber(node.right)) {
      return number({ value: node.left.value / node.right.value });
    }
  },
  exponentiate(node) {
    if (isNumber(node.left) && isNumber(node.right)) {
      return number({ value: Math.pow(node.left.value, node.right.value) });
    }
  },
  modulo(node) {
    if (isNumber(node.left) && isNumber(node.right)) {
      return number({ value: node.left.value % node.right.value });
    }
  },
  multiply(node) {
    if (isNumber(node.left) && isNumber(node.right)) {
      return number({ value: node.left.value * node.right.value });
    }
  },
  negate(node) {
    if (isNumber(node.value)) {
      return number({ value: node.value.value * -1 });
    }
  },
  subtract(node) {
    if (isNumber(node.left) && isNumber(node.right)) {
      return number({ value: node.left.value - node.right.value });
    }
  }
};

const optimizer = (node: Nodes.All): Nodes.All => optimize(node, replaceConstantExpressions);

export default optimizer;
