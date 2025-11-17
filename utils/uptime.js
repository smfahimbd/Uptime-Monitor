function recordStatus(uptimeHistory, url, status, timestamp) {
  if (!uptimeHistory[url]) {
    uptimeHistory[url] = [];
  }
  uptimeHistory[url].push({ status, timestamp });

  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  uptimeHistory[url] = uptimeHistory[url].filter(entry => entry.timestamp > thirtyDaysAgo);
}

function calculateUptime(uptimeHistory, url, days) {
  if (!uptimeHistory[url]) return 0;

  const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
  const relevantChecks = uptimeHistory[url].filter(entry => entry.timestamp > cutoffTime);

  if (relevantChecks.length === 0) return 0;

  const upChecks = relevantChecks.filter(entry => entry.status === 'up').length;
  return Math.round((upChecks / relevantChecks.length) * 100);
}

module.exports = {
  recordStatus,
  calculateUptime
};
