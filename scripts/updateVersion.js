const packageJSON = require('../package.json')
const { changeVersionNumber } = require('../utils/release/changeVersionNumber')
const { updateManifest, updatePackageJson } = require('../utils/release/updateVersionFiles')
const [,,, value] = process.argv;

const updatedVersionNumber = changeVersionNumber(packageJSON, value)


updatePackageJson({ key: 'version', value: updatedVersionNumber })
  .then(() => updateManifest({ key: 'version', value: updatedVersionNumber}))
  .then(newVersion => console.log('package.json and manifest.json is sucessfully updated to', newVersion))
  .catch(console.error)
