const DynamicArray = require("../Array/dynamic-array");

class Deque {
  #dynamicArray;

  constructor() {
    this.#dynamicArray = new DynamicArray();
  }

  isFull() {
    return this.#dynamicArray.isFull();
  }

  isEmpty() {
    return this.#dynamicArray.isEmpty();
  }

  printAll() {
    this.#dynamicArray.printAll();
  }

  pushLeft(element) {
    this.#dynamicArray.insert(0, element);
  }

  pushRight(element) {
    this.#dynamicArray.insert(this.#dynamicArray.size(), element);
  }

  popLeft() {
    const element = this.#dynamicArray.get(0);
    this.#dynamicArray.delete(0);
    return element;
  }

  popRight() {
    const lastIndex = this.#dynamicArray.size() - 1;
    const element = this.#dynamicArray.get(lastIndex);
    this.#dynamicArray.delete(lastIndex);
    return element;
  }
}

export { Deque };
