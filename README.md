# Test Automation for Test Assignment

## Setup and Running Tests

### Prerequisites
Before you begin, ensure you have the following installed:

- **Node.js**: Download and install from [https://nodejs.org/](https://nodejs.org/).
- **npm**: Node package manager comes with Node.js installation. You can verify installation by running:
  ```sh
  npm -v
- Jest and Supertest installed

### Installation Steps
1. Clone the repository:
   ```sh
   git clone <https://github.com/andreasstan/api-test-automation-assignment.git>
   cd <repository-folder->
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the tests:
   ```sh
   npm test
   ```

## Assumptions & Decisions
- Test data is dynamically generated, and newly created brands can be retrieved or updated.
- Some tests rely on the order of execution (e.g., creating a brand before updating it).
- The system should return `422` for invalid payloads and `404` for non-existent resources.
- Using supertest and jest: supertest is used to perform HTTP requests compared to other libraries because it does not require extra configuration, can directly check statusCode, body and jest is used for testing and assertion.

## Test Summary & Findings
## Test Cases Implemented:
- **POST /brands**: Successfully creates a new brand and validates response.
- **PUT /brands/{brandId}**: Updates a brand with valid data and handles invalid updates.
- **GET /brands/{brandId}**: Retrieves a brand by ID and handles non-existent brandIDs.
- **Negative Test Cases**: Ensure appropriate error messages for invalid inputs, missing fields, and non-existent resources.


