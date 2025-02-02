const StaticArray = require("./static-array");

class DynamicArray extends StaticArray {
  constructor() {
    super();
  }

  insert(index, element) {
    super.insert(index, element);
    this.isFull() && this.extend();
  }
}

export { DynamicArray };
