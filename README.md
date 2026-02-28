# sr-playwright
A self-practice repository for exploring and learning the capabilities of Playwright for end-to-end testing, cicd setup, also with ai intergration

# Usage

## Test execution with tag

Below cmd where the test have tag and depends target test folder in config

playwright.confg.ts : ``testDir: './' `` or ``testDir: './<your test folder>' ``

``` npx playwright test --grep @smoke --reporter=list ```

``--reporter=`` the options is `list` `dot` `line`

Every test can have multiple tag

``tag: ['@slow', '@vrt']``

## Run Test in ui mode

``npx playwright test --grep @smoke --ui``

once you ran the test in ui mode, the trace.zip will be generated in test-results folder. 

use this command to to view the file generated in *Trace Viewer*

``npx playwright show-trace 'test-results\e2e-example-has-title-chromium\trace.zip' ``

## Run with browser 

```shell
npx playwright test --grep @login --headed
```

### Good to read follow best practices documentations

https://playwright.dev/docs/best-practices


#### TODO

https://www.youtube.com/watch?v=2O7dyz6XO2s


Github actions
```
strategy:
  matrix:
    shardIndex: [1, 2, 3]
    shardTotal: [3]

steps:
  - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

```

Run playwright using helm
```
helm install play-1 ./helm-playwright

helm install play-1 ./helm-playwright -f values-smoke.yaml
```


