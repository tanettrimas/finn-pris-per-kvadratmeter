const fs = require('fs');
const packageJSON = require('../../package.json')

function updatePackageJson({ key, value}) {
  return new Promise((resolve, reject) => {
    packageJSON[key] = value
    fs.writeFile('./package.json', JSON.stringify(packageJSON, null, 2), function(err) {
      if (err) {
        reject(new Error(err.message))
      }
      console.log('writing to package.json');
      resolve(value)
    });
  })
}

module.exports = updatePackageJson

