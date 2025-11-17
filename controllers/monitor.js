const { loadMonitors, saveMonitors, loadHistory, saveHistory } = require('../utils/store');
const { checkUrlStatus } = require('../utils/ping');
const { recordStatus, calculateUptime } = require('../utils/uptime');

let monitoredMonitors = [];
let uptimeHistory = {};

(async () => {
  monitoredMonitors = await loadMonitors();
  uptimeHistory = await loadHistory();
})();

async function addMonitor(req, res) {
  const { name, url } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Name and URL are required' });
  }
  const monitors = await loadMonitors();
  if (!monitors.some(m => m.url === url)) {
    monitors.push({ name, url });
    await saveMonitors(monitors);
  }
  res.json({ message: 'Monitor added for monitoring', monitors });
}

async function getAllStatuses(req, res) {
  const monitors = await loadMonitors();
  const results = await Promise.all(monitors.map(async (monitor) => {
    const currentStatus = await checkUrlStatus(monitor.url);
    recordStatus(uptimeHistory, monitor.url, currentStatus.status, currentStatus.timestamp);
    const uptime24h = calculateUptime(uptimeHistory, monitor.url, 1);
    const uptime7d = calculateUptime(uptimeHistory, monitor.url, 7);
    const uptime30d = calculateUptime(uptimeHistory, monitor.url, 30);

    return {
      name: monitor.name,
      ...currentStatus,
      uptime: {
        '24h': uptime24h,
        '7d': uptime7d,
        '30d': uptime30d
      }
    };
  }));

  results.sort((a, b) => b.uptime['30d'] - a.uptime['30d']);

  await saveHistory(uptimeHistory);

  res.json({ results });
}

async function getStatus(req, res) {
  const url = decodeURIComponent(req.params.url);
  const result = await checkUrlStatus(url);
  res.json(result);
}

async function removeMonitor(req, res) {
  const { url } = req.body;
  const monitors = await loadMonitors();
  const updatedMonitors = monitors.filter(m => m.url !== url);
  await saveMonitors(updatedMonitors);
  res.json({ message: 'Monitor removed from monitoring', monitors: updatedMonitors });
}

async function getHistory(req, res) {
  const url = decodeURIComponent(req.params.url);
  const history = uptimeHistory[url] || [];
  res.json({ url, history });
}

function home(req, res) {
  res.json({ message: 'Welcome to Uptime Monitor API', endpoints: ['POST /add-url', 'GET /status', 'GET /status/:url', 'DELETE /remove-url'] });
}

module.exports = {
  addMonitor,
  getAllStatuses,
  getStatus,
  removeMonitor,
  getHistory,
  home
};
