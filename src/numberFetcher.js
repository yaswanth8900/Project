import fetch from 'node-fetch';
import { getAuthToken } from './auth.js';

const API_BASE_URL = process.env.API_BASE_URL;
const TIMEOUT_MS = 500;

const typeToEndpoint = {
  'p': 'primes',
  'f': 'fibo',
  'e': 'even',
  'r': 'rand'
};

export async function fetchNumbers(type) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const token = await getAuthToken();
    const endpoint = typeToEndpoint[type];
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data.numbers)) {
      throw new Error('Invalid response format: numbers array not found');
    }

    const validNumbers = data.numbers
      .map(num => Number(num))
      .filter(num => !isNaN(num));

    return validNumbers;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`Request timed out after ${TIMEOUT_MS}ms`);
      return [];
    }
    console.error('Error fetching numbers:', error);
    return [];
  }
}