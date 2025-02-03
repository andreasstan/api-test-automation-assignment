# Test Automation for Test Ass

## Setup and Running Tests

### Prerequisites
- Node.js
- npm
- Jest and Supertest installed

### Installation Steps
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the necessary environment variables (e.g., `BASE_URL` for the API endpoint).
4. Run the tests:
   ```sh
   npm test
   ```
   or
   ```sh
   yarn test
   ```

## Assumptions & Decisions
- The API follows RESTful conventions, and standard HTTP response codes are used.
- Test data is dynamically generated, and newly created brands can be retrieved or deleted.
- Some tests rely on the order of execution (e.g., creating a brand before updating it).
- The system should return `422` for invalid payloads and `404` for non-existent resources.
- Responses are expected in JSON format.

## Test Summary & Findings
### Test Cases Implemented:
- **POST /brands**: Successfully creates a new brand and validates response.
- **PUT /brands/{brandId}**: Updates a brand with valid data and handles invalid updates.
- **GET /brands/{brandId}**: Retrieves a brand by ID and handles non-existent brands.
- **Negative Test Cases**: Ensure appropriate error messages for invalid inputs, missing fields, and non-existent resources.

### Notable Findings:
- API correctly enforces required fields and validates input format.
- Some edge cases like excessively large payloads were not documented in the API specification but handled gracefully.
- Error handling is consistent across endpoints, ensuring predictability in test results.

---
For any issues or improvements, feel free to submit a pull request or open an issue. 🚀

