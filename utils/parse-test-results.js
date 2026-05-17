const fs = require('fs');
const jp = require('jsonpath-plus').JSONPath;

const report = JSON.parse(fs.readFileSync('../tests/test-results/test-results.json', 'utf-8'));

const failedTests = jp({
  //path: '$..specs[?(@.tests.some(t => t.results.some(r => r.status=="timedOut" || r.status=="failed")))]',
  path: '$.suites[*].suites[*].specs[?(@.tests[0].results[0].status=="timedOut")].tags',
  //.specs[*].tests[*][?(@.status=="failed")]
  json: report
});

// const results = failedTests.map(test => {
//     const lastResult = test.tests[0]
//     const tags = test.tags[0]
    
// //   const lastResult = test.results?.slice(-1)[0];

//   return {
//     // title: test.spec?.title,
//     // file: test.spec?.file,
//     // tags: test.spec?.tags || [],
//     // status: lastResult?.status
//     tags: test.tags[0],
//     status: test.tests[0].results[0].status,
//     browser: test.tests[0].projectId
//   };
// });


//console.log(failedTests);

// Step 1: get all specs
const specs = jp({
  path: '$..specs[*]',
  json: report
});

// Step 2: JS filter for failed/timedOut
const failedSpecs = specs.filter(spec =>
  spec.tests?.some(test =>
    test.results?.some(r =>
      r.status === 'failed' || r.status === 'timedOut'
    )
  )
);

// Step 3: normalize output
const result = failedSpecs.map(spec => {
  const finalStatuses = spec.tests.flatMap(t => t.results.map(r => r.status));
  const lastStatus = finalStatuses.at(-1);

  return {
    tags: spec.tags[0] || [],
    status: lastStatus
  };
});

console.log(JSON.stringify(result, null, 2));