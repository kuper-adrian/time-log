const fs = require('fs');
const dayjs = require('dayjs');
const path = require('path');

const config = require('../time-log.config.json');

ensureDataFolder();

function ensureDataFolder() {
  if (!fs.existsSync(config.data)) {
    fs.mkdirSync(config.data);
  }
}

function ensureYearFolder(year) {
  if (!year) {
    year = dayjs().year();
  }
  const yearFolderPath = path.join(config.data, year.toString());
  if (!fs.existsSync(yearFolderPath)) {
    fs.mkdirSync(yearFolderPath)
  }
  return yearFolderPath;
}

function ensureDataFile(month, year) {
  const yearFolderPath = ensureYearFolder(year);

  if (!month) {
    month = dayjs().month();
  }
  if (!year) {
    year = dayjs().year();
  }

  const dataFilePath = path.join(yearFolderPath, `${month}-${year}.json`);

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]');
  }

  return dataFilePath;
}

exports.read = function(month, year) {
  const dataFilePath = ensureDataFile(month, year);

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]');
  }
  return fs.readFileSync(dataFilePath);
}

exports.write = function(content, month, year) {
  const dataFilePath = ensureDataFile(month, year);
  fs.writeFileSync(dataFilePath, content);
}
