class StaticArray {
  #data;
  #length;
  #capacity;
  #minCapacity = 100;

  constructor(capacity) {
    this.#capacity = Math.max(capacity || 0, this.#minCapacity);
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
    this.#resize(Math.max(this.#capacity / 2, this.#minCapacity));
  }

  extend() {
    this.#resize(this.#capacity * 2);
  }

  findIndex(element) {
    for (let i = 0; i < this.#length; i++) {
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
    this.#data = new Array((this.#capacity = this.#minCapacity));
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
