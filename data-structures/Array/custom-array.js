const StaticArray = require("./static-array");

class CustomArray {
  #intervalId;
  #staticArray;

  constructor() {
    this.#staticArray = new StaticArray();
    this.#sizeChecker();
  }

  #sizeChecker() {
    if (this.#intervalId) return;
    this.#intervalId = setInterval(() => {
      if (this.#staticArray.size() < this.#staticArray.capacity() / 2) {
        this.#staticArray.shrink();
      }
    }, 60 * 1000);
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

  delete(index) {
    this.#staticArray.delete(index);
  }

  clear() {
    this.#staticArray.clear();
  }

  printAll() {
    this.#staticArray.printAll();
  }

  insert(index, element) {
    this.#staticArray.insert(index, element);
    if (this.#staticArray.isFull()) {
      this.#staticArray.extend();
    }
  }
}

class CustomArrayWithExtends extends StaticArray {
  #intervalId;

  constructor() {
    super();
    this.#sizeChecker();
  }

  #sizeChecker() {
    if (this.#intervalId) return;
    this.#intervalId = setInterval(() => {
      if (this.size() < this.capacity() / 2) {
        this.shrink();
      }
    }, 60 * 1000);
  }

  destroy() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  insert(index, element) {
    super.insert(index, element);
    if (this.isFull()) {
      this.extend();
    }
  }
}

export { CustomArray };
