class StaticArray {
  #data;
  #length;
  #capacity = 100;
  #minCapacity = 100;
  #intervalId;

  constructor(capacity) {
    this.#data = [];
    this.#length = 0;
    this.#capacity = Math.max(capacity || 0, this.#minCapacity);
    this.#sizeChecker();
  }

  #sizeChecker() {
    if (this.#intervalId) return;
    this.#intervalId = setInterval(() => {
      if (this.#length < this.#capacity / 2) {
        this.#shrink();
      }
    }, 60 * 1000);
  }

  // shrink twice the capacity
  #shrink() {
    const newCapacity = Math.max(this.#capacity / 2, this.#minCapacity);
    const newData = new Array(newCapacity);

    for (let i = 0; i < this.#length; i++) {
      newData[i] = this.#data[i];
    }

    this.#data = newData;
    this.#capacity = newCapacity;
  }

  // Extend twice the capacity
  #extend() {
    const newCapacity = this.#capacity * 2;
    const newData = new Array(newCapacity);

    for (let i = 0; i < this.#length; i++) {
      newData[i] = this.#data[i];
    }

    this.#data = newData;
    this.#capacity = newCapacity;
  }

  pushLeft(element) {
    for (let i = this.#length; i > 0; i--) {
      this.#data[i] = this.#data[i - 1];
    }
    this.#data[0] = element;
    this.#length++;
    if (this.#length >= this.#capacity) {
      this.#extend();
    }
    this.#sizeChecker();
  }

  pushRight(element) {
    this.#data[this.#length++] = element;
    if (this.#length >= this.#capacity) {
      this.#extend();
    }
    this.#sizeChecker();
  }

  popLeft() {
    if (this.#length === 0) {
      return null;
    }
    const element = this.#data[0];
    for (let i = 0; i < this.#length - 1; i++) {
      this.#data[i] = this.#data[i + 1];
    }
    this.#data[this.#length - 1] = null;
    this.#length--;
    this.#sizeChecker();
    return element;
  }

  popRight() {
    if (this.#length === 0) {
      return null;
    }
    const element = this.#data[this.#length - 1];
    this.#data[--this.#length] = null;
    this.#sizeChecker();
    return element;
  }

  clear() {
    if (this.#length <= 0) return;
    this.#capacity = this.#minCapacity;
    this.#data = new Array(this.#capacity);
    this.#length = 0;
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  printAll() {
    console.log("🚀 ~ printAll ~ capacity: ", this.#capacity);
    if (this.#length <= 0) {
      console.log("No elements to print.");
    } else {
      for (let i = 0; i < this.#length; i++) {
        console.log("🚀 ~ printAll ~ at: ", i);
        console.log("🚀 ~ printAll ~ item: ", this.#data[i], "\n");
      }
    }
  }
}

export { StaticArray };
