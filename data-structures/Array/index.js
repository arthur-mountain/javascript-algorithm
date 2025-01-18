//@ts-check

class StaticArray {
  #data;
  #length;
  #capacity;

  constructor(capacity = 100) {
    this.#data = [];
    this.#length = 0;
    this.#capacity = capacity;
  }

  printAll() {
    if (this.#length <= 0) return;
    console.log("🚀 ~ printAll ~ capacity: ", this.#capacity);
    for (let i = 0; i < this.#length; i++) {
      console.log("🚀 ~ printAll ~ at: ", i);
      console.log("🚀 ~ printAll ~ item: ", this.#data[i], "\n");
    }
  }
}

export { StaticArray };
