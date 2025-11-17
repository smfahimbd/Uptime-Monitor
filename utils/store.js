const fs = require('fs').promises;
const path = require('path');

const URLS_FILE = path.join(__dirname, '../data/urls.json');
const HISTORY_FILE = path.join(__dirname, '../data/history.json');

async function loadMonitors() {
  try {
    const data = await fs.readFile(URLS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveMonitors(monitors) {
  try {
    await fs.writeFile(URLS_FILE, JSON.stringify(monitors, null, 2));
  } catch (error) {
    console.error('Error saving monitors:', error);
  }
}

async function loadHistory() {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function saveHistory(history) {
  try {
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving history:', error);
  }
}

module.exports = {
  loadMonitors,
  saveMonitors,
  loadHistory,
  saveHistory
};
