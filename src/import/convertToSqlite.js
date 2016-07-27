'use strict';
const path = require('path');
const exec = require('child_process').exec;
const prepareBuildDirectory = require('./prepareBuildDirectory');

module.exports = function convertToSqlite(file, targetFile, log, callback) {
  prepareBuildDirectory(targetFile, log, err => {
    if (err) {
      callback(err);
      return;
    }

    log.info('Start converting mysql dump to sqlite');

    const convert = exec(
      `${path.join(__dirname, '../../bin/mysql2sqlite')} ${file} > ${targetFile}`
    );

    convert.stdout.on('data', log.verbose);
    convert.stderr.on('data', log.error);

    convert.on('close', () => {
      log.info('Finished converting');

      if (callback) callback();
    });
  });
};