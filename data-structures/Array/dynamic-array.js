const { StaticArray } = require("./static-array");

class DynamicArray extends StaticArray {
  constructor(capacity = 100) {
    super(capacity);
  }

  insert(index, element) {
    super.insert(index, element);
    this.isFull() && this.extend();
  }

  shrink() {
    throw new Error("TODO: Not implemented yet");
  }

  extend() {
    throw new Error("TODO: Not implemented yet");
  }
}

module.exports = { DynamicArray };
