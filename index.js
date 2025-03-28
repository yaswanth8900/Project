// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { NumberStore } from './numberStore.js';
// import { fetchNumbers } from './numberFetcher.js';
// import { validateNumberType } from './validators.js';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const WINDOW_SIZE = parseInt(process.env.WINDOW_SIZE, 10) || 10;
// const numberStore = new NumberStore(WINDOW_SIZE);

// app.get('/health', (req, res) => {
//   res.json({ status: 'healthy' });
// });

// app.get('/numbers/:numberid', async (req, res) => {
//   const { numberid } = req.params;
  
//   const validationError = validateNumberType(numberid);
//   if (validationError) {
//     return res.status(400).json({ error: validationError });
//   }

//   try {
//     const beforeNumbers = numberStore.getNumbers();
//     const beforeAverage = numberStore.calculateAverage();

//     const newNumbers = await fetchNumbers(numberid);
//     numberStore.addNumbers(newNumbers);

//     const afterNumbers = numberStore.getNumbers();
//     const afterAverage = numberStore.calculateAverage();

//     const response = {
//       windowPrevState: beforeNumbers,
//       windowCurrState: afterNumbers,
//       numbers: newNumbers,
//       avg: Number(afterAverage.toFixed(2))
//     };

//     res.json(response);
//   } catch (error) {
//     console.error('Error processing request:', error);
//     res.status(500).json({ 
//       error: 'Internal server error',
//       message: error.message 
//     });
//   }
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     error: 'Internal server error',
//     message: err.message 
//   });
// });

// const PORT = process.env.PORT || 9876;
// app.listen(PORT, () => {
//   console.log(`Average Calculator service running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 9876;

app.use(cors());

const WINDOW_SIZE = 10;
let storedNumbers = [];
let accessToken = ""; 
const apiUrls = {
  prime: "http://20.244.56.144/test/primes",
  fibonacci: "http://29.244.56.144/test/fibo",
  even: "http://28.244.56.144/test/even",
  random: "http://28.244.56.144/test/rand",
};

// Function to fetch Access Token
async function fetchAccessToken() {
  const authApiUrl = "http://20.244.56.144/test/auth";
  const authData = {
    companyName: "afford-LBRCE",
    clientID: "abbd0c10-1131-455f-8e6a-5c72058f41d1",
    clientSecret: "DcShgBJmBTiqchxI",
    ownerName: "Chintada Yaswanth",
    ownerEmail: "chyaswanth890@gmail.com",
    rollNo: "22761A0511",
  };

  try {
    const response = await axios.post(authApiUrl, authData, { timeout: 500 });
    if (response.status === 200) {
      accessToken = response.data["access token"];
    }
  } catch (error) {
    console.error("Failed to fetch access token:", error.message);
  }
}

// Function to fetch numbers from third-party server
async function fetchNumbers(url) {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` }, 
      timeout: 500,
    });
    if (response.status === 200) {
      return response.data.numbers;
    }
  } catch (error) {
    return [];
  }
}

function calculateAverage(numbers) {
  return numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
}

// Endpoint to handle requests
app.get("/numbers/:type", async (req, res) => {
  const type = req.params.type;

  if (!apiUrls[type]) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  // Fetch numbers from the third-party server
  const newNumbers = await fetchNumbers(apiUrls[type]);

  // Update stored numbers (remove duplicates and maintain window size)
  storedNumbers = Array.from(new Set([...storedNumbers, ...newNumbers])).slice(0, WINDOW_SIZE);

  const average = calculateAverage(storedNumbers);

  // Prepare the response
  const response = {
    windowPrevState: storedNumbers.slice(0, storedNumbers.length - newNumbers.length),
    windowCurrState: storedNumbers,
    numbers: newNumbers,
    avg: average.toFixed(2),
  };

  res.json(response);
});

app.listen(PORT, async () => {
  await fetchAccessToken(); 
  console.log(`Server is running on http://localhost:${PORT}`);
});
