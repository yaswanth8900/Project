import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

let authToken = null;
let tokenExpiry = 0;

export async function register() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyName: process.env.COMPANY_NAME,
        ownerName: process.env.OWNER_NAME,
        rollNo: process.env.ROLL_NO,
        ownerEmail: process.env.OWNER_EMAIL,
        accessCode: process.env.ACCESS_CODE
      })
    });

    if (!response.ok) {
      throw new Error(`Registration failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Registration successful. Save these credentials:');
    console.log(`Client ID: ${data.clientId}`);
    console.log(`Client Secret: ${data.clientSecret}`);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function getAuthToken() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyName: process.env.COMPANY_NAME,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        ownerName: process.env.OWNER_NAME,
        ownerEmail: process.env.OWNER_EMAIL,
        rollNo: process.env.ROLL_NO
      })
    });

    if (!response.ok) {
      throw new Error(`Authentication failed with status ${response.status}`);
    }

    const data = await response.json();
    authToken = data.access_token;
    tokenExpiry = data.expires_in * 1000 + Date.now();
    return authToken;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}