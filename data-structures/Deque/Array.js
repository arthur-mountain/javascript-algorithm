const { DynamicArray } = require("../Array/dynamic-array");

const PUBLIC_METHOD_SET = new Set([
  "pushLeft",
  "pushRight",
  "popLeft",
  "popRight",
  "isFull",
  "isEmpty",
  "size",
  "capacity",
  "printAll",
  "toString",
]);

class Deque extends DynamicArray {
  constructor() {
    super();
    const instance = this;
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === "symbol") {
          return Reflect.get(target, prop, receiver);
        }

        if (PUBLIC_METHOD_SET.has(prop)) {
          const value = Reflect.get(target, prop, receiver);
          return typeof value === "function" ? value.bind(instance) : value;
        }

        throw new Error(`Property '${prop}' is not accessible on Deque`);
      },
    });
  }

  pushLeft(element) {
    this.insert(0, element);
  }

  pushRight(element) {
    this.insert(this.size(), element);
  }

  popLeft() {
    const element = this.get(0);
    this.delete(0);
    return element;
  }

  popRight() {
    const lastIndex = this.size() - 1;
    const element = this.get(lastIndex);
    this.delete(lastIndex);
    return element;
  }
}

module.exports = { Deque };
