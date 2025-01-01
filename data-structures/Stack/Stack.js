//@ts-check
// First In Last Out
class Stack {
  constructor() {
    this.stack = [];
    this.length = this.stack.length;
  }

  push(item) {
    this.stack.push(item);
  }

  pop() {
    return this.stack.pop();
  }

  peek() {
    return this.stack[this.length - 1];
  }

  size() {
    return this.length;
  }

  clear() {
    this.stack.length = this.length = 0;
  }
}

export default Stack