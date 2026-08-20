const BASE_URL = "http://127.0.0.1:5000/api";

async function runTests() {
  console.log("=========================================");
  console.log("🚀 STARTING VOLUNTREE API ENDPOINT TESTS");
  console.log("=========================================\n");

  // Test Case 1: Fetch Public Categories
  try {
    console.log("📥 Testing: GET /api/categories...");
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Success! Found ${data.data.length} categories.`);
      console.log("   Categories:", data.data.map(c => c.name).join(", "));
    } else {
      console.log(`❌ Failed:`, data);
    }
  } catch (err) {
    console.log(`❌ Error:`, err.message);
  }
  console.log("-----------------------------------------\n");

  // Test Case 2: Fetch Public Events
  try {
    console.log("📥 Testing: GET /api/events...");
    const res = await fetch(`${BASE_URL}/events`);
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Success! Found ${data.data.length} events.`);
      data.data.forEach(event => {
        console.log(`   - [ID ${event.id}] ${event.title} (${event.location})`);
      });
    } else {
      console.log(`❌ Failed:`, data);
    }
  } catch (err) {
    console.log(`❌ Error:`, err.message);
  }
  console.log("-----------------------------------------\n");

  // Test Case 3: Login as Volunteer
  let volunteerToken = "";
  try {
    console.log("📥 Testing: POST /api/auth/login (Volunteer)...");
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "volunteer@volunteer.id",
        password: "vol12345"
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Login Success! Logged in as: ${data.data.user.full_name}`);
      console.log(`   Role: ${data.data.user.role}`);
      volunteerToken = data.data.token;
      console.log(`   JWT Token retrieved successfully.`);
    } else {
      console.log(`❌ Login Failed:`, data.message || data);
    }
  } catch (err) {
    console.log(`❌ Error:`, err.message);
  }
  console.log("-----------------------------------------\n");

  // Test Case 4: Access Authenticated Route (GET /api/auth/me)
  if (volunteerToken) {
    try {
      console.log("📥 Testing: GET /api/auth/me (using JWT Token)...");
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${volunteerToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✅ Profile retrieved!`);
        console.log(`   Name  : ${data.data.full_name}`);
        console.log(`   Email : ${data.data.email}`);
        console.log(`   Role  : ${data.data.role}`);
      } else {
        console.log(`❌ Failed to retrieve profile:`, data);
      }
    } catch (err) {
      console.log(`❌ Error:`, err.message);
    }
  } else {
    console.log("⚠️ Skipped GET /api/auth/me because login failed.");
  }
  console.log("-----------------------------------------\n");

  // Test Case 5: Login as Organization
  let orgToken = "";
  try {
    console.log("📥 Testing: POST /api/auth/login (Organization)...");
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "org@volunteer.id",
        password: "org12345"
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Login Success! Logged in as: ${data.data.user.full_name}`);
      console.log(`   Role: ${data.data.user.role}`);
      orgToken = data.data.token;
      console.log(`   JWT Token retrieved successfully.`);
    } else {
      console.log(`❌ Login Failed:`, data.message || data);
    }
  } catch (err) {
    console.log(`❌ Error:`, err.message);
  }
  console.log("=========================================");
  console.log("🎉 ALL TESTS COMPLETED");
  console.log("=========================================");
}

runTests();
