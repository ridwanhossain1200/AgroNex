// AgroNex Bangladesh - Live Agent Serverless Endpoint Verification
// Tests api/chat.ts with function calling and multi-step tool execution.

import handler from '../api/chat.ts';

function createMockHttp(body: any) {
  let statusCode = 200;
  let responseData: any = null;

  const req = {
    method: 'POST',
    body,
    headers: { 'content-type': 'application/json' }
  };

  const res = {
    setHeader() {},
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(data: any) {
      responseData = data;
      return res;
    },
    end() {
      return res;
    }
  };

  return { req, res, getStatusCode: () => statusCode, getData: () => responseData };
}

async function run() {
  console.log('\n=============================================================');
  console.log('🤖 AgroNex End-to-End Live Agent Endpoint Verification (/api/chat)');
  console.log('=============================================================\n');

  const testQuery = 'আমার ২ বিঘা জমিতে বোরো ধানের জন্য কি পরিমাণ সার লাগবে এবং বর্তমান বাজারদর কত?';
  console.log(`Sending Agent Query: "${testQuery}"\n`);

  const mock = createMockHttp({ message: testQuery, responseLanguage: 'bn' });
  await handler(mock.req, mock.res);

  const code = mock.getStatusCode();
  const data = mock.getData();

  console.log(`Response HTTP Status: ${code}`);
  console.log(`Success: ${data?.success}`);
  console.log(`Model: ${data?.model}`);
  console.log(`Tools Executed (${data?.toolSteps?.length || 0}):`);
  if (data?.toolSteps) {
    data.toolSteps.forEach((t: any, i: number) => {
      console.log(`  [Tool #${i + 1}] ${t.toolName}: ${t.summaryText}`);
    });
  }
  console.log(`\nFinal Reply Preview:\n${data?.reply?.slice(0, 350)}...\n`);
  console.log(`Action Card:`, data?.actionCard);
}

run().catch(console.error);
