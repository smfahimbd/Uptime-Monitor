const axios = require('axios');

async function checkUrlStatus(url) {
  const startTime = Date.now();
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const responseTime = Date.now() - startTime;
    return { url, status: 'up', responseTime: `${responseTime}ms`, timestamp: Date.now() };
  } catch (error) {
    return { url, status: 'down', error: error.message, timestamp: Date.now() };
  }
}

module.exports = {
  checkUrlStatus
};
