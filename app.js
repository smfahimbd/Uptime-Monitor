const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const { loadMonitors, loadHistory, saveHistory } = require('./utils/store');
const { checkUrlStatus } = require('./utils/ping');
const { recordStatus } = require('./utils/uptime');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

let monitoredMonitors = [];
let uptimeHistory = {};

(async () => {
  monitoredMonitors = await loadMonitors();
  uptimeHistory = await loadHistory();
  setInterval(async () => {
    const monitors = await loadMonitors();
    if (monitors.length > 0) {
      const results = await Promise.all(monitors.map(monitor => checkUrlStatus(monitor.url)));
      results.forEach(result => {
        recordStatus(uptimeHistory, result.url, result.status, result.timestamp);
      });
      await saveHistory(uptimeHistory);
    }
  }, 5000);

  app.listen(PORT, () => {
    console.log(`Uptime Monitor Server running at http://localhost:${PORT}/`);
  });
})();
