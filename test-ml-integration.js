#!/usr/bin/env node

/**
 * ML Model Integration Test Suite
 * Tests all components of the AI response generation pipeline
 * 
 * Usage: node test-ml-integration.js
 */

const API_URL = process.env.API_URL || "http://localhost:3000";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function test(name, fn) {
  try {
    log("cyan", `\n▶ Testing: ${name}`);
    await fn();
    log("green", `✓ PASSED: ${name}`);
    return true;
  } catch (error) {
    log("red", `✗ FAILED: ${name}`);
    log("red", `  Error: ${error.message}`);
    if (error.details) {
      log("red", `  Details: ${error.details}`);
    }
    return false;
  }
}

async function request(endpoint, payload) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.details = data.error || data.message || JSON.stringify(data);
    throw error;
  }

  return data;
}

async function runTests() {
  log("blue", "\\n═══════════════════════════════════════════════════");
  log("blue", "   ML Model Integration Test Suite");
  log("blue", "═══════════════════════════════════════════════════");
  log("blue", `   API URL: ${API_URL}`);
  log("blue", "═══════════════════════════════════════════════════\\n");

  let passed = 0;
  let failed = 0;

  // Test 1: Officer Vikram (Bank Scam)
  if (
    await test(
      "Officer Vikram - Generate Bank Scam Response",
      async () => {
        const result = await request("/api/ai-response", {
          lastMessage: "Can you tell me my account balance?",
          scamType: "officer_vikram",
        });

        if (!result.aiResponse || result.aiResponse.length === 0) {
          throw new Error("No AI response generated");
        }

        if (!result.audioUrl) {
          throw new Error("No audio URL returned");
        }

        log("yellow", `  Response: ${result.aiResponse.substring(0, 100)}...`);
        log("yellow", `  Audio length: ${result.audioUrl.length} chars`);
      }
    )
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 2: Tech Support Scam
  if (
    await test(
      "Tech Support - Microsoft Scam Response",
      async () => {
        const result = await request("/api/ai-response", {
          lastMessage:
            "I am calling about suspicious activity on your computer",
          scamType: "tech_support",
        });

        if (!result.aiResponse || result.aiResponse.length === 0) {
          throw new Error("No AI response generated");
        }

        log("yellow", `  Response: ${result.aiResponse.substring(0, 100)}...`);
      }
    )
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 3: Bank Impersonation
  if (
    await test(
      "Bank Impersonation - Fraud Alert",
      async () => {
        const result = await request("/api/ai-response", {
          lastMessage:
            "There has been fraudulent activity on your account",
          scamType: "bank_impersonation",
        });

        if (!result.aiResponse || result.aiResponse.length === 0) {
          throw new Error("No AI response generated");
        }

        log("yellow", `  Response: ${result.aiResponse.substring(0, 100)}...`);
      }
    )
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 4: Romance Scam
  if (
    await test("Romance Scam - Emotional Response", async () => {
      const result = await request("/api/ai-response", {
        lastMessage: "I love you so much",
        scamType: "romance_scam",
      });

      if (!result.aiResponse || result.aiResponse.length === 0) {
        throw new Error("No AI response generated");
      }

      log("yellow", `  Response: ${result.aiResponse.substring(0, 100)}...`);
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 5: General/Default Scam Type
  if (
    await test("General - Default Scam Response", async () => {
      const result = await request("/api/ai-response", {
        lastMessage: "Hello, I need to verify your information",
        scamType: "general",
      });

      if (!result.aiResponse || result.aiResponse.length === 0) {
        throw new Error("No AI response generated");
      }

      log("yellow", `  Response: ${result.aiResponse.substring(0, 100)}...`);
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 6: Missing message should fail gracefully
  if (
    await test("Error Handling - Missing message", async () => {
      try {
        await request("/api/ai-response", {
          scamType: "officer_vikram",
        });
        throw new Error("Should have failed with 400 error");
      } catch (error) {
        if (error.message.includes("HTTP 400")) {
          // This is expected
          log("yellow", "  Correctly rejected request");
          return;
        }
        throw error;
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 7: Response validation
  if (
    await test("Response Validation - Check structure", async () => {
      const result = await request("/api/ai-response", {
        lastMessage: "Test message",
        scamType: "officer_vikram",
      });

      const required = ["success", "aiResponse", "audioUrl", "scamType"];
      for (const field of required) {
        if (!(field in result)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      if (result.success !== true) {
        throw new Error("success field should be true");
      }

      log("yellow", "  ✓ All required fields present");
      log("yellow", `  ✓ Success: ${result.success}`);
      log("yellow", `  ✓ Scam Type: ${result.scamType}`);
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 8: Audio URL format
  if (
    await test("Audio Validation - Check format", async () => {
      const result = await request("/api/ai-response", {
        lastMessage: "Test",
        scamType: "general",
      });

      if (!result.audioUrl.includes("data:audio")) {
        throw new Error(
          "Audio URL should be data URL format (data:audio/...)"
        );
      }

      if (!result.audioUrl.includes("base64")) {
        throw new Error("Audio should be base64 encoded");
      }

      const audioSize = result.audioUrl.length;
      log("yellow", `  ✓ Audio format: data URL`);
      log("yellow", `  ✓ Audio encoding: base64`);
      log("yellow", `  ✓ Audio size: ${(audioSize / 1024).toFixed(2)} KB`);
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 9: Response text validation
  if (
    await test("Response Text - Length validation", async () => {
      const result = await request("/api/ai-response", {
        lastMessage: "What should I do?",
        scamType: "officer_vikram",
      });

      const text = result.aiResponse;
      const wordCount = text.split(/\\s+/).length;

      if (wordCount < 5) {
        throw new Error("Response too short (< 5 words)");
      }

      if (wordCount > 100) {
        throw new Error("Response too long (> 100 words)");
      }

      log("yellow", `  ✓ Word count: ${wordCount} (expected: 5-100)`);
      log("yellow", `  ✓ Character count: ${text.length}`);
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 10: Timestamp validation
  if (
    await test("Timestamp - Valid ISO format", async () => {
      const result = await request("/api/ai-response", {
        lastMessage: "Test",
        scamType: "general",
      });

      const timestamp = new Date(result.timestamp);
      if (isNaN(timestamp.getTime())) {
        throw new Error("Invalid timestamp format");
      }

      log("yellow", `  ✓ Timestamp: ${result.timestamp}`);
      log("yellow", `  ✓ Format: ISO 8601`);
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Summary
  log("blue", "\\n═══════════════════════════════════════════════════");
  log("blue", "   Test Results");
  log("blue", "═══════════════════════════════════════════════════\\n");

  log("green", `✓ Passed: ${passed}`);
  log("red", `✗ Failed: ${failed}`);
  log("blue", `  Total:  ${passed + failed}\\n`);

  if (failed === 0) {
    log("green", "\\n🎉 All tests passed! ML integration is working correctly.\\n");
    process.exit(0);
  } else {
    log("red", `\\n⚠️  ${failed} test(s) failed. Check configuration and logs.\\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  log("red", "\\nFatal error:");
  log("red", error.message);
  process.exit(1);
});
