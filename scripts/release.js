const packageJSON = require('../package.json')
const checkIfValidVersionNumber = require('../utils/release/checkIfValidVersionNumber')
const updatePackageJson = require('../utils/release/updatePackageJson')
const compress = require('../utils/release/compress')

const [,,command, value] = process.argv;

if (!command || !value) {
  throw new Error('Version not specified, should be of the specified format: --version 1.2.3')
}

if (command !== '--version') {
  throw new Error(`Unsupported command operator ${command}`)
} 

const isValidVersionNumber = checkIfValidVersionNumber(value, packageJSON.version)

if(!isValidVersionNumber) {
  throw new Error(`Provided version number ${value} cannot be less than current version ${packageJSON.version}`)
}

updatePackageJson({ key: 'version', value }).then(newVersion => compress(newVersion))

