const StaticArray = require("./static-array");

class DynamicArray {
  #staticArray;

  constructor() {
    this.#staticArray = new StaticArray();
  }

  isEmpty() {
    return this.#staticArray.isEmpty();
  }

  isFull() {
    return this.#staticArray.isFull();
  }

  isEmpty() {
    return this.#staticArray.isEmpty();
  }

  capacity() {
    return this.#staticArray.capacity();
  }

  size() {
    return this.#staticArray.size();
  }

  get(index) {
    return this.#staticArray.get(index);
  }

  set(index, element) {
    this.#staticArray.set(index, element);
  }

  insert(index, element) {
    this.#staticArray.insert(index, element);
    if (this.#staticArray.isFull()) {
      this.#staticArray.extend();
    }
  }

  delete(index) {
    this.#staticArray.delete(index);
  }

  clear() {
    this.#staticArray.clear();
  }

  printAll() {
    this.#staticArray.printAll();
  }
}

export { DynamicArray };
