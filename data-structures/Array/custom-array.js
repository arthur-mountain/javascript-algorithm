const { DynamicArray } = require("./dynamic-array");

class CustomArray extends DynamicArray {
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
}

module.exports = { CustomArray };
