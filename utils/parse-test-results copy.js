const fs = require('fs');
const jp = require('jsonpath-plus').JSONPath;

// 1. Load Playwright JSON report
const report = JSON.parse(
  fs.readFileSync('../tests/test-results/test-results.json', 'utf-8')
);

// 2. Extract all test nodes (safe across shards/suites)
const tests = jp({
  //path: '$.suites[*].suites[*].specs[*].tests[*]',
   path: '$.suites[*].suites[*].specs[*]',
  json: report
});


const result = tests.map(test => {
  
  const lastResult = test.results?.slice(-1)[0];
  console.log(lastResult)
 
  const tags =
    test.spec?.tags ||
    test.tags ||
    [];

  return {
    title: test.spec?.title || 'unknown',
    file: test.spec?.file || 'unknown',
    tags: tags,
    status: lastResult?.status || 'unknown',
    error: lastResult?.error?.message || null,
    duration: lastResult?.duration || 0
  };
});

// 4. Print result
//console.log(JSON.stringify(result, null, 2));

// 5. OPTIONAL: filter only failed tests (useful for DLQ)
const failedOnly = result.filter(r => r.status === 'failed');

//console.log('\n🔥 FAILED TESTS ONLY:\n');
//console.log(JSON.stringify(failedOnly, null, 2));

// 6. OPTIONAL: push to Redis / BullMQ (example)
// for (const test of failedOnly) {
//   await queue.add('retry-test', test);
// }