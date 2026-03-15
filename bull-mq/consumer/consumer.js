#!/usr/bin/env node

const { Worker } = require('bullmq');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// 1. Connection to your on-prem Redis
const connection = {
  host: process.env.REDIS_HOST || '192.168.0.109',
  port: process.env.REDIS_PORT || 6379,
};

console.log('👷 Worker started. Waiting for jobs...');

// 2. Initialize the Worker
const worker = new Worker(
  'playwright-tests',
  async (job) => {
    console.log(`[${new Date().toISOString()}] 🔍 Job ${job.id} started processing`);

    const {
      shardIndex,
      totalShards,
      configFile,
      project,
      workers,
    } = job.data;

    console.log(`\n[Job ${job.id}] 🚀 Running Shard ${shardIndex}/${totalShards}`);

    try {
      // 3. The Playwright Command
      const command = `npx playwright test --shard=${shardIndex}/${totalShards} --grep=@smoke --workers=${workers} --project=${project} --config=${configFile}`;

      console.log(`Executing: ${command}`);

      const { stdout, stderr } = await execPromise(command);

      if (stderr) console.error(`Stderr: ${stderr}`);
      console.log(`Stdout: ${stdout}`);

      return { status: 'success', shard: shardIndex };
    } catch (error) {
      console.error(`❌ Shard ${shardIndex} failed:`, error);
      throw new Error('Test Execution Failed');
    }
  },
  {
    connection,
    concurrency: 1, // Each worker process handles 1 shard at a time
    maxStalledCount: 1,
    stalledInterval: 30000
  }
);

// Optional: Listen for completion
worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Job ${job?.id} failed with ${err.message}`);
});