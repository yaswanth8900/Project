import { expect, test, describe, beforeEach } from 'vitest';
import { NumberStore } from './numberStore.js';

describe('NumberStore', () => {
  let store;
  const WINDOW_SIZE = 5;

  beforeEach(() => {
    store = new NumberStore(WINDOW_SIZE);
  });

  test('should initialize empty', () => {
    expect(store.getNumbers()).toEqual([]);
    expect(store.calculateAverage()).toBe(0);
  });

  test('should maintain window size', () => {
    store.addNumbers([1, 2, 3, 4, 5, 6]);
    expect(store.getNumbers()).toEqual([2, 3, 4, 5, 6]);
    expect(store.getNumbers().length).toBe(WINDOW_SIZE);
  });

  test('should ignore duplicates', () => {
    store.addNumbers([1, 2, 2, 3, 3, 4]);
    expect(store.getNumbers()).toEqual([1, 2, 3, 4]);
  });

  test('should calculate average correctly', () => {
    store.addNumbers([1, 2, 3, 4, 5]);
    expect(store.calculateAverage()).toBe(3);
  });

  test('should handle decimal numbers', () => {
    store.addNumbers([1.5, 2.5, 3.5]);
    expect(store.calculateAverage()).toBe(2.5);
  });

  test('should maintain timestamps', () => {
    store.addNumbers([1, 2, 3]);
    expect(store.getOldestTimestamp()).toBeTruthy();
    expect(store.getNewestTimestamp()).toBeTruthy();
    expect(store.getNewestTimestamp()).toBeGreaterThanOrEqual(store.getOldestTimestamp());
  });

  test('should clear store', () => {
    store.addNumbers([1, 2, 3]);
    store.clear();
    expect(store.getNumbers()).toEqual([]);
    expect(store.calculateAverage()).toBe(0);
    expect(store.getOldestTimestamp()).toBeNull();
    expect(store.getNewestTimestamp()).toBeNull();
  });
});