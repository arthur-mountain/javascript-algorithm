class StaticArray {
  #data;
  #length;
  #capacity;
  #minCapacity = 100;

  constructor(capacity) {
    this.#data = [];
    this.#length = 0;
    this.#capacity = Math.max(capacity || 0, this.#minCapacity);
  }

  shrink() {
    const newCapacity = Math.max(this.#capacity / 2, this.#minCapacity);
    const newData = new Array(newCapacity);

    for (let i = 0; i < this.#length; i++) {
      newData[i] = this.#data[i];
    }

    this.#data = newData;
    this.#capacity = newCapacity;
  }

  extend() {
    const newCapacity = this.#capacity * 2;
    const newData = new Array(newCapacity);

    for (let i = 0; i < this.#length; i++) {
      newData[i] = this.#data[i];
    }

    this.#data = newData;
    this.#capacity = newCapacity;
  }

  isFull() {
    return this.#length === this.#capacity;
  }

  isEmpty() {
    return this.#length === 0;
  }

  capacity() {
    return this.#capacity;
  }

  size() {
    return this.#length;
  }

  get(index) {
    return this.#data[index];
  }

  set(index, element) {
    if (index < 0 || index >= this.#length) {
      throw new Error("Index out of bounds");
    }
    this.#data[index] = element;
  }

  insert(index, element) {
    if (index < 0 || index >= this.#length) {
      throw new Error("Index out of bounds");
    }
    for (let i = this.#length; i > index; i--) {
      this.#data[i] = this.#data[i - 1];
    }
    this.#data[index] = element;
    this.#length++;
  }

  delete(index) {
    if (index < 0 || index >= this.#length) {
      throw new Error("Index out of bounds");
    }
    for (let i = index; i < this.#length; i++) {
      this.#data[i] = this.#data[i + 1];
    }
    this.#length--;
  }

  clear() {
    if (this.#length <= 0) return;
    this.#capacity = this.#minCapacity;
    this.#data = new Array(this.#capacity);
    this.#length = 0;
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
