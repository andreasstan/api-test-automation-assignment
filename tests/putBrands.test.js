const request = require("supertest");
const faker = require('faker'); // Import faker untuk menghasilkan data random
const baseURL = "https://api.practicesoftwaretesting.com";
const invalidBrandId = "invalid-id-12345";
const nonExistentBrandId = "01421421321312312"; 
const randomName = faker.company.companyName();
const randomSlug = faker.helpers.slugify(randomName);
const newBrand = {
    name: randomName,
    slug: randomSlug,
};

let validBrandId;

beforeAll(async () => {
    const response = await request(baseURL)
        .post("/brands")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send(newBrand);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("slug");
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("string"); 

    validBrandId = response.body.id;
});

// Test Case 1: Update Brand Successfully (200)
test("Should update a brand successfully with valid data", async () => {
    try {
        const response = await request(baseURL)
            .put(`/brands/${validBrandId}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send(newBrand);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("success");
        expect(response.body.success).toBe(true);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 2: Attempt to update a non-existent brand (expected success is false)
test("Should return 200 and success is false when updating a non-exist brand", async () => {
    try {
        const response = await request(baseURL)
            .put(`/brands/${nonExistentBrandId}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send(newBrand);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("success");
        expect(response.body.success).toBe(false);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 3: Update with invalid data (422)
test("Should return 422 when updating with invalid data", async () => {
    try {
        const response = await request(baseURL)
            .put(`/brands/${validBrandId}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
                name: 12345,
                slug: true,
            });

        expect(response.statusCode).toBe(422);
        expect(response.body).toHaveProperty("name");
        expect(response.body.name).toContain("The name field must be a string.");
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 4: Update with incomplete data
test("Should return 200 when updating with only 1 parameter", async () => {
    try {
        const response = await request(baseURL)
            .put(`/brands/${validBrandId}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
                name: randomName, 
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("success");
        expect(response.body.success).toBe(true);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});


// Test Case 5: Update with null values for name and slug
test("Should return 422 when name and slug are null", async () => {
    try {
        const response = await request(baseURL)
            .put(`/brands/${validBrandId}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
                name: null,
                slug: null,
            });

        expect(response.statusCode).toBe(422);
        expect(response.body).toHaveProperty("name");
        expect(response.body.name).toContain("The name field must be a string.");
        expect(response.body).toHaveProperty("slug");
        expect(response.body.slug).toContain("The slug field must only contain letters, numbers, dashes, and underscores.");
        expect(response.body.slug).toContain("The slug field must be a string.");
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 6: Update with brand and slug containing spaces
test("Should return 422 when brand slug contains spaces", async () => {
    try {
        const response = await request(baseURL)
            .put(`/brands/${validBrandId}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
                name: "Brand With Space",
                slug: "Slug with space",
            });

        expect(response.statusCode).toBe(422);
        expect(response.body).toHaveProperty("slug");
        expect(response.body.slug).toContain("The slug field must only contain letters, numbers, dashes, and underscores.");
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 7: Update with special characters in name and slug
test("Should return 422 when name and slug contain special characters", async () => {
    try {
        const response = await request(baseURL)
            .post("/brands")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
                name: "Brand@#%",
                slug: "slug@#%",
            });

        console.log("Response Status:", response.statusCode);
        console.log("Response Body:", JSON.stringify(response.body, null, 2));

        expect(response.statusCode).toBe(422);
        expect(response.body).toHaveProperty("slug");
        expect(response.body.slug).toContain(
            "The slug field must only contain letters, numbers, dashes, and underscores."
        );
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});
