export class NumberStore {
  constructor(windowSize) {
    this.windowSize = windowSize;
    this.numbers = [];
    this.timestamps = [];
  }

  addNumbers(newNumbers) {
    const currentTime = Date.now();

    for (const num of newNumbers) {
      // Skip if number already exists
      if (this.numbers.includes(num)) {
        continue;
      }

      if (this.numbers.length >= this.windowSize) {
        // Remove oldest number and its timestamp
        this.numbers.shift();
        this.timestamps.shift();
      }

      // Add new number and its timestamp
      this.numbers.push(num);
      this.timestamps.push(currentTime);
    }
  }

  getNumbers() {
    return [...this.numbers];
  }

  calculateAverage() {
    if (this.numbers.length === 0) {
      return 0;
    }
    const sum = this.numbers.reduce((acc, num) => acc + num, 0);
    return sum / this.numbers.length;
  }

  getOldestTimestamp() {
    return this.timestamps[0] || null;
  }

  getNewestTimestamp() {
    return this.timestamps[this.timestamps.length - 1] || null;
  }

  clear() {
    this.numbers = [];
    this.timestamps = [];
  }
}