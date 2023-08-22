const fs = require('fs').promises;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const questionAsync = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

const main = async () => {
  try {
    console.log('Please enter your database configuration:');
    const origin = await questionAsync('Client Origin URL(default: http://localhost:5173): ');
    const user = await questionAsync('Database User(User Id): ');
    const password = await questionAsync('Database Password: ');
    const accessKey = await questionAsync('Access Token Secret Key(any string): ');
    const refreshKey = await questionAsync('Refresh Token Secret Key(any string): ');
    const accessExpire = await questionAsync('Access Token Expire(default: 3600(1h)): ');
    const refreshExpire = await questionAsync('Access Token Expire(default: 604800(7d)): ');

    const envContent = `
SERVER_PORT=8080
MORGAN=dev
CORS_ORIGIN=${origin || 'http://localhost:5173'}
POSTGRES_HOST=db
POSTGRES_USER=${user}
POSTGRES_PASSWORD=${password}
POSTGRES_DB=hamkke
POSTGRES_PORT=5432
REDIS_HOST=redis
REDIS_PORT=6379
JWT_ACCESS_KEY=${accessKey}
JWT_REFRESH_KEY=${refreshKey}
JWT_ACCESS_EXPIRE=${accessExpire || 3600}
JWT_REFRESH_EXPIRE=${refreshExpire || 604800}
`.trimStart();

    await fs.writeFile('.env', envContent);
    console.log('.env file has been created with the provided settings.');
  } catch (err) {
    console.error('Error creating .env file:', err);
  } finally {
    rl.close();
  }
};

main();
