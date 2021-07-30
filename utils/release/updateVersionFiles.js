const fs = require("fs");
require("dotenv").config();
const packageJSON = require("../../package.json");
const manifestJSON = require("../../src/manifest.json");

function updatePackageJson({ key, value }) {
  return new Promise((resolve, reject) => {
    packageJSON[key] = value;
    fs.writeFile(
      "./package.json",
      JSON.stringify(packageJSON, null, 2),
      function (err) {
        if (err) {
          reject(new Error(err.message));
        }
        console.log("writing to package.json");
        resolve(value);
      }
    );
  });
}

function updateManifest({ key, value }) {
  return new Promise((resolve, reject) => {
    manifestJSON[key] = value;
    fs.writeFile(
      "./src/manifest.json",
      JSON.stringify(manifestJSON, null, 2),
      function (err) {
        if (err) {
          reject(new Error(err.message));
        }
        console.log("writing to manifest.json");
        resolve(value);
      }
    );
  });
}

module.exports = {
  updatePackageJson,
  updateManifest,
};
