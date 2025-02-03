const request = require("supertest");
const baseURL = "https://api.practicesoftwaretesting.com";
const invalidBrandId = "invalid-id-123"; // ID tidak valid
const nonexistentBrandId = "01JK0XXX0XXX0XXX0XXX0XXX"; // ID tidak ada di database
const faker = require('faker'); // Import faker untuk menghasilkan data random
const randomName = faker.company.companyName();
const randomSlug = faker.helpers.slugify(randomName);

beforeAll(async () => {
    const response = await request(baseURL)
        .post("/brands")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({
            name: randomName,
            slug: randomSlug,
        });

    validBrandId = response.body.id;
    validBrandSlug = response.body.slug;
});

// Test Case 1: Berhasil mengambil brand dengan ID yang valid (Expected 200)
test("Should retrieve brand details successfully with a valid ID", async () => {
    try {
        const response = await request(baseURL)
            .get(`/brands/${validBrandId}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("slug");
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error; // Re-throw error agar Jest tetap menandai test sebagai failed
    }
});

// Test Case 2: Gagal mengambil brand dengan ID yang tidak ada (Expected 404)
test("Should return 404 when retrieving a brand with a nonexistent ID", async () => {
    try {
        const response = await request(baseURL)
            .get(`/brands/${nonexistentBrandId}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "Requested item not found");
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 3: Gagal mengambil brand dengan ID yang tidak valid (Expected 404)
test("Should return 404 when retrieving a brand with an invalid ID format", async () => {
    try {
        const response = await request(baseURL)
            .get(`/brands/${invalidBrandId}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message");
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 4: Gagal mengambil brand dengan ID berupa null (Expected 400)
test("Should return 404 when retrieving a brand with null as ID", async () => {
    try {
        const response = await request(baseURL)
            .get(`/brands/null`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", ("Requested item not found"));
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 5: Gagal mengambil brand dengan ID berisi karakter spesial (Expected 400)
test("Should return 404 when retrieving a brand with special characters in ID", async () => {
    try {
        const response = await request(baseURL)
            .get(`/brands/@#!$%^&*`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "Requested item not found");
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 6: Gagal mengambil brand dengan ID yang memiliki whitespace (Expected 400 or 404)
test("Should return 400 or 404 when retrieving a brand with whitespace in ID", async () => {
    try {
        const response = await request(baseURL)
            .get(`/brands/ valid-id `)
            .set("Accept", "application/json");

        expect([400, 404]).toContain(response.statusCode);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 7: Menggunakan method yang salah (POST pada GET endpoint) (Expected 405)
test("Should return 405 when using POST method on GET /brands/{id}", async () => {
    try {
        const response = await request(baseURL)
            .post(`/brands/${validBrandId}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(405);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});

// Test Case 8: Tanpa Accept header (Expected 200 atau 406)
test("Should return 200 or 406 when retrieving a brand without Accept header", async () => {
    try {
        const response = await request(baseURL)
            .get(`/brands/${validBrandId}`);

        expect([200, 406]).toContain(response.statusCode);
    } catch (error) {
        console.error("Test failed - Response body:", error.response?.body || error);
        throw error;
    }
});