// AgroNex Bangladesh - Local Backend Verification Suite
// Verifies api/chat.ts serverless function: validation, security, timeout, and response formats.

import handler from '../api/chat.ts';

// Helper to simulate Vercel Serverless req/res
function createMockHttp(method: string, body?: any) {
  let statusCode = 200;
  let headers: Record<string, string> = {};
  let responseData: any = null;
  let ended = false;

  const req = {
    method,
    body,
    headers: {}
  };

  const res = {
    setHeader(key: string, val: string) {
      headers[key] = val;
    },
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(data: any) {
      responseData = data;
      ended = true;
      return res;
    },
    end() {
      ended = true;
      return res;
    }
  };

  return {
    req,
    res,
    getStatusCode: () => statusCode,
    getData: () => responseData,
    getHeaders: () => headers,
    isEnded: () => ended
  };
}

async function runBackendTests() {
  console.log('\n=============================================================');
  console.log('🧪 AgroNex Serverless Backend Verification (api/chat.ts)');
  console.log('=============================================================\n');

  let passed = 0;
  let total = 0;

  // TEST 1: Health check GET /api/chat
  total++;
  console.log('TEST 1: Health check GET /api/chat');
  {
    const mock = createMockHttp('GET');
    await handler(mock.req, mock.res);
    const data = mock.getData();
    const code = mock.getStatusCode();

    if (code === 200 && data.status === 'online' && data.sdk === '@google/genai') {
      console.log('  ✅ PASSED: Health check returned online status with @google/genai');
      passed++;
    } else {
      console.log('  ❌ FAILED: Health check failed', code, data);
    }
  }

  // TEST 2: Missing GEMINI_API_KEY rejection (503)
  total++;
  console.log('\nTEST 2: Missing GEMINI_API_KEY handling');
  {
    const originalKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = '';

    const mock = createMockHttp('POST', { message: 'ধানের ব্লাস্ট রোগ' });
    await handler(mock.req, mock.res);
    const data = mock.getData();
    const code = mock.getStatusCode();

    if (code === 503 && data.code === 'API_NOT_CONFIGURED') {
      console.log('  ✅ PASSED: Returns 503 API_NOT_CONFIGURED when GEMINI_API_KEY is not configured');
      passed++;
    } else {
      console.log('  ❌ FAILED: Unexpected response for missing key', code, data);
    }

    if (originalKey !== undefined) {
      process.env.GEMINI_API_KEY = originalKey;
    } else {
      delete process.env.GEMINI_API_KEY;
    }
  }

  // TEST 3: Empty message rejection (400)
  total++;
  console.log('\nTEST 3: Empty message validation');
  {
    process.env.GEMINI_API_KEY = 'test_key_sample';
    const mock = createMockHttp('POST', { message: '   ' });
    await handler(mock.req, mock.res);
    const data = mock.getData();
    const code = mock.getStatusCode();

    if (code === 400 && data.code === 'EMPTY_MESSAGE') {
      console.log('  ✅ PASSED: Rejects empty whitespace message with 400');
      passed++;
    } else {
      console.log('  ❌ FAILED: Did not reject empty message', code, data);
    }
  }

  // TEST 4: Excessively long message rejection (400)
  total++;
  console.log('\nTEST 4: Excessively long message (>2000 chars) rejection');
  {
    process.env.GEMINI_API_KEY = 'test_key_sample';
    const longText = 'ধান '.repeat(700); // ~2800 chars
    const mock = createMockHttp('POST', { message: longText });
    await handler(mock.req, mock.res);
    const data = mock.getData();
    const code = mock.getStatusCode();

    if (code === 400 && data.code === 'MESSAGE_TOO_LONG') {
      console.log('  ✅ PASSED: Rejects long message (>2000 chars) with 400');
      passed++;
    } else {
      console.log('  ❌ FAILED: Did not reject excessively long message', code, data);
    }
  }

  // TEST 5: Security verification - Zero key exposure in response
  total++;
  console.log('\nTEST 5: Security verification (API key never exposed to client)');
  {
    const secretKey = 'SECRET_TEST_KEY_NEVER_EXPOSE_998877';
    process.env.GEMINI_API_KEY = secretKey;

    const mock = createMockHttp('POST', { message: 'ধানের ব্লাস্ট' });
    await handler(mock.req, mock.res);
    const serializedData = JSON.stringify(mock.getData() || {});
    const serializedHeaders = JSON.stringify(mock.getHeaders() || {});

    const keyLeaked = serializedData.includes(secretKey) || serializedHeaders.includes(secretKey);

    if (!keyLeaked) {
      console.log('  ✅ PASSED: Secret key is completely absent from response body and headers');
      passed++;
    } else {
      console.log('  ❌ FAILED: Secret key found in response!');
    }
  }

  // Clean up test env
  delete process.env.GEMINI_API_KEY;

  console.log('\n=============================================================');
  console.log(`Backend Verification Summary: ${passed}/${total} Passed`);
  console.log('=============================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runBackendTests().catch(err => {
  console.error(err);
  process.exit(1);
});
