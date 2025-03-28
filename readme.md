Here’s a concise README for your microservice:

---

# Average Calculator Microservice

This microservice is designed to fetch numbers of specific types (prime, Fibonacci, even, or random) from a third-party API, calculate their average, and maintain a sliding window of the most recent numbers.

---

## Features
- Retrieves numbers using authenticated API requests.
- Ensures unique numbers and maintains a fixed-size sliding window (default: 10).
- Calculates the average of the stored numbers.
- Returns a structured response, including the previous state, current state, and newly fetched numbers.

---

## Setup Instructions
1. **Install Dependencies**:
   ```bash
   npm install express axios cors
   ```
2. **Configure the Server**:
   - Replace placeholders in the `server.js` file with your registration details:
     - `companyName`
     - `clientID`
     - `clientSecret`
     - `ownerName`
     - `ownerEmail`
     - `rollNo`

3. **Start the Server**:
   ```bash
   node server.js
   ```
   The server will be available at `http://localhost:9876`.

---

## API Usage
### **GET /numbers/:type**
Fetch numbers of a specific type.

- **Path Parameters**:
  - `type` (required): Specify the number type (`prime`, `fibonacci`, `even`, `random`).

- **Response Example**:
  ```json
  {
    "windowPrevState": [2, 3],
    "windowCurrState": [2, 3, 5],
    "numbers": [5],
    "avg": 3.33
  }
  ```

---

## Testing
Use **Postman** or any HTTP client to send requests to the API. Add the **Bearer Token** for authentication when making requests.

---

Let me know if you need further refinements! 🚀