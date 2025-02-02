const StaticArray = require("./static-array");

class CustomArray extends StaticArray {
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
    this.isFull() && this.extend();
  }
}

export { CustomArray };
