const fs = require('fs');
const dayjs = require('dayjs');
const path = require('path');

const config = require('../time-log.config.json');

function ensureDataFolder() {
  if (!fs.existsSync(config.data)) {
    fs.mkdirSync(config.data);
  }
}

function ensureYearFolder(year) {
  let y;

  if (!year) {
    y = dayjs().year();
  } else {
    y = year;
  }

  const yearFolderPath = path.join(config.data, y.toString());
  if (!fs.existsSync(yearFolderPath)) {
    fs.mkdirSync(yearFolderPath);
  }
  return yearFolderPath;
}

function ensureDataFile(month, year) {
  const yearFolderPath = ensureYearFolder(year);
  let m;
  let y;

  if (!month) {
    m = dayjs().month() + 1;
  } else {
    m = month;
  }

  if (!year) {
    y = dayjs().year();
  } else {
    y = year;
  }

  const dataFilePath = path.join(yearFolderPath, `${m}-${y}.json`);

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]');
  }

  return dataFilePath;
}

ensureDataFolder();

exports.read = function read(month, year) {
  const dataFilePath = ensureDataFile(month, year);

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]');
  }
  return fs.readFileSync(dataFilePath);
};

exports.write = function write(content, month, year) {
  const dataFilePath = ensureDataFile(month, year);
  fs.writeFileSync(dataFilePath, content);
};

exports.getYearFolderContents = function getYearFolderContents(year) {
  const yearFolderPath = path.join(config.data, year.toString());

  if (!fs.existsSync(yearFolderPath)) {
    return [];
  }

  return fs.readdirSync(yearFolderPath);
};

exports.getDataFolderContents = function getDataFolderContents() {
  if (!fs.existsSync(config.data)) {
    return [];
  }

  return fs.readdirSync(config.data);
};
