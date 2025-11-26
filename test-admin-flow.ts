const API_BASE = "http://localhost:5000";
const TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID v4

async function testAdminFlow() {
  console.log("🧪 Testing Admin Registration and Login Flow\n");

  try {
    // Test 1: Try to register an admin
    console.log("1️⃣ Testing admin registration...");
    const registrationResponse = await fetch(
      `${API_BASE}/api/admin/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_USER_ID}`,
        },
        body: JSON.stringify({
          userId: TEST_USER_ID,
          email: "testadmin@example.com",
          name: "Test Admin",
        }),
      }
    );

    const regResult = await registrationResponse.json();
    console.log("Registration Response:", regResult);
    console.log(`Status: ${registrationResponse.status}\n`);

    // Test 2: Try to check admin auth with the same user ID
    console.log("2️⃣ Testing admin auth check...");
    const authCheckResponse = await fetch(
      `${API_BASE}/api/admin/auth/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TEST_USER_ID}`,
        },
        body: JSON.stringify({ userId: TEST_USER_ID }),
      }
    );

    const authResult = await authCheckResponse.json();
    console.log("Auth Check Response:", authResult);
    console.log(`Status: ${authCheckResponse.status}\n`);

    // Test 3: Try with invalid user
    console.log("3️⃣ Testing auth check with invalid user...");
    const invalidAuthResponse = await fetch(
      `${API_BASE}/api/admin/auth/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer invalid-user-id`,
        },
        body: JSON.stringify({ userId: "invalid-user-id" }),
      }
    );

    const invalidResult = await invalidAuthResponse.json();
    console.log("Invalid Auth Response:", invalidResult);
    console.log(`Status: ${invalidAuthResponse.status}\n`);

    console.log("✅ All tests completed!");
  } catch (error) {
    console.error("❌ Test error:", error);
    process.exit(1);
  }
}

testAdminFlow();
