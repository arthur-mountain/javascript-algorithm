const { DynamicArray } = require("../Array/dynamic-array");

class Deque extends DynamicArray {
  #PUBLIC_METHOD_SET = new Set([
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

  constructor() {
    super();
    return new Proxy(this, {
      apply: (target, prop, receiver) => {
        if (this.#PUBLIC_METHOD_SET.has(prop)) {
          return Reflect.get(target, prop, receiver);
        }
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

export { Deque };
