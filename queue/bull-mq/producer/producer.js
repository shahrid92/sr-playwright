const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || '192.168.0.109',
  port: process.env.REDIS_PORT || 6379,
};

const testQueue = new Queue('playwright-tests', { connection });

async function addShards(totalShards) {
  console.log(`Adding ${totalShards} shards to the queue...`);

  for (let i = 1; i <= totalShards; i++) {
    await testQueue.add(`shard-${i}`, {
      shardIndex: i,
      totalShards: totalShards,
      configFile: 'playwright.config.ts',
      project: 'chromium',
      workers: 4
    },{
            attempts: 3,
            backoff: {
            type: 'exponential',
            delay: 1000,
        },
            removeOnComplete: true,
            removeOnFail: true,
        });
  }

  console.log('Done! Disconnecting...');
  await testQueue.close();
}

const shards = parseInt(process.argv[2], 10) || 1;
addShards(shards);