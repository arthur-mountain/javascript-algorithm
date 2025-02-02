class StaticArray {
  #data;
  #length;
  #capacity = 100;

  constructor(capacity) {
    this.#capacity = Math.max(capacity || 0, this.#capacity);
    this.#data = new Array(this.#capacity);
    this.#length = 0;
  }

  #resize(newCapacity) {
    if (newCapacity < this.#length) {
      throw new Error("New capacity is less than current length");
    }
    const newData = new Array(newCapacity);
    for (let i = 0; i < this.#length; i++) {
      newData[i] = this.#data[i];
    }
    this.#data = newData;
    this.#capacity = newCapacity;
  }

  shrink() {
    this.#resize(Math.max(this.#capacity / 2, this.#capacity));
  }

  extend() {
    this.#resize(this.#capacity * 2);
  }

  findIndex(element) {
    for (let i = 0; i < this.#capacity; i++) {
      if (this.#data[i] === element) {
        return i;
      }
    }
    return -1;
  }

  find(element) {
    const index = this.findIndex(element);
    return index === -1 ? undefined : this.#data[index];
  }

  contains(element) {
    return this.findIndex(element) >= 0;
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
    if (index < 0 || index >= this.#capacity) {
      throw new Error("Index out of bounds");
    }
    return this.#data[index];
  }

  set(index, element) {
    if (index < 0 || index >= this.#capacity) {
      throw new Error("Index out of bounds");
    }
    this.#data[index] = element;
  }

  insert(index, element) {
    if (this.isFull()) {
      throw new Error("Array is full");
    }
    if (index < 0 || index >= this.#capacity) {
      throw new Error("Index out of bounds");
    }
    for (let i = this.#capacity; i > index; i--) {
      this.#data[i] = this.#data[i - 1];
    }
    this.#data[index] = element;
    this.#length++;
  }

  delete(index) {
    if (index < 0 || index >= this.#capacity) {
      throw new Error("Index out of bounds");
    }
    if (index === this.#capacity - 1) {
      this.#data[index] = undefined;
    } else {
      for (let i = index; i < this.#capacity; i++) {
        this.#data[i] = this.#data[i + 1];
      }
    }
    this.#length--;
  }

  clear() {
    if (this.#length <= 0) return;
    this.#data = new Array(this.#capacity);
    this.#length = 0;
  }

  printAll() {
    if (this.#length <= 0) {
      console.log("No elements to print.");
    } else {
      for (let i = 0; i < this.#capacity; i++) {
        console.log("🚀 ~ printAll ~ at: %s \n", i);
        console.log("🚀 ~ printAll ~ item: ", this.#data[i], "\n");
      }
    }
  }

  toString() {
    const chars = [];
    for (let i = 0; i < this.#capacity; i++) {
      chars.push(this.#data[i]);
    }
    return "[" + chars.join(", ") + "]";
  }
}

module.exports = { StaticArray };
