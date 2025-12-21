import { test, expect } from "@playwright/test";

test.describe("Product Details Screen", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication by setting localStorage
    await page.addInitScript(() => {
      localStorage.setItem(
        "staff_access_token",
        "test-token-for-playwright"
      );
    });
  });

  test("should not make infinite API calls when loading product edit page", async ({
    page,
  }) => {
    let addonApiCallCount = 0;

    // Intercept and count addon API calls
    await page.route("**/addon**", async (route) => {
      addonApiCallCount++;
      // Return mock data
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            addonGroups: [],
            addons: [],
          },
        }),
      });
    });

    // Mock product details API
    await page.route("**/product/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            product: {
              _id: "test-product-id",
              name: "Test Pizza",
              description: "A test pizza",
              type: "veg",
              basePrice: 10,
              packagingCharges: 1,
              category: "cat-1",
              subCategory: "sub-1",
              noOfPeople: 2,
              dishSize: { count: 1, unit: "piece" },
              photoList: [],
              weight: 100,
              protein: 10,
              carbs: 20,
              fats: 5,
              fiber: 2,
              allergicInfo: [],
              tags: [],
              spiceLevel: [],
              ingredientList: [],
              frosting: "",
              variantGroups: [],
            },
            addonGroupList: [],
            addonList: [],
            pricing: [],
            variantGroupList: [],
            variantList: [],
          },
        }),
      });
    });

    // Mock category API
    await page.route("**/category/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { _id: "cat-1", name: "Test Category" },
        }),
      });
    });

    // Mock subcategory API
    await page.route("**/sub-category/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { _id: "sub-1", name: "Test Subcategory" },
        }),
      });
    });

    // Navigate to product edit screen
    await page.goto("/menu-and-products/edit/test-product-id");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Wait a bit more to ensure no delayed re-fetches
    await page.waitForTimeout(2000);

    // Check that addon API was called only once or twice (not infinite loop)
    // Previously, this would be 100+ calls in a loop
    console.log(`Addon API call count: ${addonApiCallCount}`);
    expect(addonApiCallCount).toBeLessThanOrEqual(3);
  });

  test("should not make infinite API calls on create mode either", async ({
    page,
  }) => {
    let addonApiCallCount = 0;

    // Intercept and count addon API calls
    await page.route("**/addon**", async (route) => {
      addonApiCallCount++;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { addonGroups: [], addons: [] },
        }),
      });
    });

    // Mock category API
    await page.route("**/category/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { _id: "cat-1", name: "Test Category" },
        }),
      });
    });

    // Mock subcategory API
    await page.route("**/sub-category/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { _id: "sub-1", name: "Test Subcategory" },
        }),
      });
    });

    // Navigate to product create screen
    await page.goto(
      "/menu-and-products/create/new?categoryId=cat-1&subCategoryId=sub-1"
    );

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Wait a bit more to ensure no delayed re-fetches
    await page.waitForTimeout(2000);

    // Check that addon API was called only once or twice (not infinite loop)
    console.log(`Addon API call count (create mode): ${addonApiCallCount}`);
    expect(addonApiCallCount).toBeLessThanOrEqual(3);
  });
});
