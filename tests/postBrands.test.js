const request = require('supertest');
const faker = require('faker'); // Import faker untuk menghasilkan data random
const baseURL = "https://api.practicesoftwaretesting.com";
const randomName = faker.company.companyName();
const randomSlug = faker.helpers.slugify(randomName);
const newBrand = {
    name: randomName,
    slug: randomSlug,
};

let brandID;

// Test Case 1: Valid Brand Creation (Expected 201)
test("Should create a new brand successfully with valid data", async () => {
    try {
        const response = await request(baseURL)
            .post("/brands")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send(newBrand);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("name", newBrand.name);
        expect(response.body).toHaveProperty("slug", newBrand.slug);
        expect(response.body).toHaveProperty("id");
        expect(typeof response.body.id).toBe("string"); // Verify that the ID is a string
        brandName = response.body.name;
        brandSlug = response.body.slug;
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 2: Redundant Slug
test("Should return 422 when creating a brand with duplicate slug", async () => {
    try {
        const response = await request(baseURL)
            .post("/brands")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
                name: randomName,
                slug: brandSlug,
            });

        expect(response.statusCode).toBe(422);
        expect(response.body.slug).toEqual(["A brand already exists with this slug."]);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 3: Resource Not Found (Expected 404)
test("Should return 404 when the resource is not found", async () => {
    try {
        const response = await request(baseURL)
            .get("/brands/nonexistent-id")
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "Requested item not found");
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 4: Method Not Allowed (Expected 405)
test("Should return 405 Method Not Allowed for POST request on GET route", async () => {
    try {
        const response = await request(baseURL)
            .put("/brands") // PUT method on a route that expects POST
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
                name: "invalid method",
                slug: "invalid-method"
            });

        expect(response.statusCode).toBe(405);
        expect(response.body).toHaveProperty("message", "Method is not allowed for the requested route");
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 5: Unprocessable Entity (Expected 422)
test("Should return 422 when the server is unable to process the content", async () => {
    try {
        const response = await request(baseURL)
            .post("/brands")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({});

        expect(response.statusCode).toBe(422);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 6: Invalid Data for Creating Brand (Expected 422)
test("Should return 422 for invalid data when creating a brand", async () => {
    try {
        const response = await request(baseURL)
            .post("/brands")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
                name: 12345,
                slug: 'invalid-slug',
            });

        expect(response.statusCode).toBe(422);
        expect(response.body.name).toEqual(["The name field must be a string."]);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 7: Creating a Brand with Maximum Length Name (Expected 422)
test("should return 422 when creating a brand with a maximum length name", async () => {
    try {
        const longName = 'a'.repeat(121);
        const response = await request(baseURL)
            .post('/brands')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                name: longName,
                slug: faker.lorem.slug(),
            });

        expect(response.statusCode).toBe(422);
        expect(response.body.name).toEqual(["The name field must not be greater than 120 characters."]);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 8: Creating a Brand with Empty Name and Slug (Expected 422)
test("should return 422 when creating a brand with empty name and slug", async () => {
    try {
        const response = await request(baseURL)
            .post('/brands')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                name: '', 
                slug: '', 
            });

        expect(response.statusCode).toBe(422);
        expect(response.body).toHaveProperty('name');
        expect(response.body.name).toEqual([
            "The name field is required."
        ]);
        expect(response.body).toHaveProperty('slug');
        expect(response.body.slug).toEqual([
            "The slug field is required."
        ]);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 9: Creating a Brand with Non-ASCII Characters in Name (Expected 201)
test("should return 201 when creating a brand with non-ASCII characters in the name", async () => {
    try {
        const nonAsciiName = 'CaféBrand💥'; 
        const response = await request(baseURL)
            .post('/brands')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                name: nonAsciiName,
                slug: faker.lorem.slug(),
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('name', nonAsciiName);
        expect(response.body).toHaveProperty('slug');
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 10: Creating a Brand with Special Characters in Name (Expected 201)
test("should return 201 when creating a brand with special characters in name", async () => {
    try {
        const specialName = 'New!Brand@2025#';
        const response = await request(baseURL)
            .post('/brands')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                name: specialName,
                slug: faker.lorem.slug(),
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('name', specialName);
        expect(response.body).toHaveProperty('slug');
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 11: Duplicate Slug Handling (Expected 422)
test("should return 422 when creating a brand with a duplicate slug", async () => {
    try {
        // Buat brand dengan slug yang sama
        const slug = faker.lorem.slug();
        await request(baseURL)
            .post('/brands')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Brand One',
                slug: slug,
            });

        // Mengirimkan brand kedua dengan slug yang sama
        const response = await request(baseURL)
            .post('/brands')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Brand Two',
                slug: slug,
            });

        expect(response.statusCode).toBe(422);
        expect(response.body).toHaveProperty('slug');
        expect(response.body.slug).toEqual(["A brand already exists with this slug."]);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 12: Excessive Data Fields (Expected 422)
test("should return 422 when creating a brand with excessive data fields", async () => {
    try {
        const newExtraFieldBrand = {
            name: randomName,
            slug: randomSlug,
            extraField1: 'extra1',
        };

        const response = await request(baseURL)
            .post('/brands')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(newExtraFieldBrand);

        expect(response.statusCode).toBe(422);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});
