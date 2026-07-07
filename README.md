# sr-playwright
A self-practice repository for exploring and learning the capabilities of Playwright for end-to-end testing, cicd setup, also with ai intergration

---

## Table of Contents
- [Usage](#usage)
  - [Test Execution with Tag](#test-execution-with-tag)
  - [Run Test in UI Mode](#run-test-in-ui-mode)
  - [Run with Browser](#run-with-browser)
- [CI/CD](#cicd)
  - [GitHub Actions](#github-actions)
- [Container & Infrastructure](#container--infrastructure)
  - [Run Playwright Using Helm](#run-playwright-using-helm)
  - [Install Redis Queue](#install-redis-queue)
  - [Redis Queue Configuration](#redis-queue-configuration)
  - [Access Skooner](#access-skooner)
- [Reporting](#reporting)
  - [Allure Report](#allure-report)
  - [Manual Open Trace Viewer](#manual-open-trace-viewer)
- [References](#references)

---

## Usage

### Test Execution with Tag

Below cmd where the test have tag and depends target test folder in config

playwright.confg.ts : ``testDir: './' `` or ``testDir: './<your test folder>' ``

``` npx playwright test --grep @smoke --reporter=list ```

``--reporter=`` the options is `list` `dot` `line`

Every test can have multiple tag

``tag: ['@slow', '@vrt']``

### Run Test in UI Mode

``npx playwright test --grep @smoke --ui``

once you ran the test in ui mode, the trace.zip will be generated in test-results folder.

use this command to to view the file generated in *Trace Viewer*

``npx playwright show-trace 'test-results\e2e-example-has-title-chromium\trace.zip' ``

### Run with Browser

```shell
npx playwright test --grep @login --headed

npx playwright test --grep @TC001 --project=chromium --headed
```

---

## CI/CD

### GitHub Actions

```
strategy:
  matrix:
    shardIndex: [1, 2, 3]
    shardTotal: [3]

steps:
  - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

```

---

## Container & Infrastructure

### Run Playwright Using Helm

```
helm install play-1 ./helm-playwright

helm install play-1 ./helm-playwright -f values-smoke.yaml
```

### Install Redis Queue

```

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update


helm install redis bitnami/redis \
  --set auth.enabled=false \
  --set architecture=standalone \
  --set master.persistence.enabled=false \
  --set master.resources.requests.memory=256Mi \
  --set master.resources.limits.memory=512Mi
```

### Redis Queue Configuration

```
helm install redis-queue bitnami/redis -f helm-redis-queue/redis-values.yaml
```
redis-queue-master.default.svc.cluster.local

latest update: redis need to turn off pvc nad need a node selector

```
helm install playwright-redis bitnami/redis \
  --set architecture=standalone \
  --set auth.enabled=false \
  --set master.persistence.enabled=false \
  --set replica.replicaCount=0

  helm install playwright-redis bitnami/redis \
  --set architecture=standalone \
  --set auth.enabled=false \
  --set master.persistence.enabled=false \
  --set replica.replicaCount=0 \
  --set master.configmap="maxmemory-policy noeviction"
```

### Build Consumer Image

```shell
docker build -f ./infra/docker/Dockerfile.playwright_consumer -t test-consumer:latest .
```

### Access Skooner

kubectl port-forward service/skooner -n kube-system 8080:80 --address 0.0.0.0



---

## Reporting

### Allure Report

allure generate

alluer serve

### Manual Open Trace Viewer

npx show report also can open trace since in html-report/data have trace zip file

npx playwright show-trace ./tests/test-results/html-report/data/2a19294065623fdcc78eade61b764622a7f95109.zip

---

## References

### Good to read follow best practices documentations

https://playwright.dev/docs/best-practices

### TODO

https://www.youtube.com/watch?v=2O7dyz6XO2s

implement zod for json schema


# why use helmchart

# SR playwright shards with redis queue

# Build image command for sr-playwright worker 

```
docker build -t test-consume:latest -f ./infra/docker/Dockerfile.playwright_consumer .
```

### producer
run "generate-py-shards.sh" to get number of shards. 

```
node producer.js <number of shards>
```
to be continue
docker with multi worker run correctly able to recieve message uqeue from redis
next action is merging report allure and native playwright shard


### cli musy know


npx playwright codegen
npx playwright test --grep@TC001 --debug
npx playwright test --grep=@TC001 --project=chromium --trace on
npx playwright test --ui
npx playwright test --headed
npx playwright show-report
npx playwright show-trace trace.zip


learn 
screencast
runtime annotation test.info().annotations.

await page.waitforresponse worth to check
Network interception (VERY important)
Auuthentication state reuse
API + UI hybrid testing
await page.waitForLoadState('networkidle');
playwright with kafka : https://dev.to/arkreddysfo/end-to-end-testing-validating-kafka-messages-with-playwright-2m0h


custom mcp for distributed shards into redis queue and k8s

1) mcp tools
  - calculate how many shards
  - 

### parallel exeution using sharding with queue (Docker)

control plane port forward bullmq

kubectl port-forward service/redis-queue-master -n kube-system 6379:6379 --address 0.0.0.0

build image from /infra/docker and run image with port 6379

