// This needs further checking
function checkIfValidVersionNumber(value, currentVersion) {
  if (!value.includes('.')) {
    throw new Error('Version needs to be of correctly formatted like 1.2.3 (including dots)')
  }
  const getVersionNumber = value.split('.').join('')
  const packageJSONVersion = currentVersion.split('.').join('')
  return getVersionNumber > packageJSONVersion
}

module.exports = checkIfValidVersionNumber