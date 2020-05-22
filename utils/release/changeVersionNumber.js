function changeVersionNumber(packageJson, type = 'minor') {
  let [breaking, moderate, minor] = packageJson.version.split('.').map(num => parseInt(num))

  if (type === 'moderate') {
    moderate++
  } else if (type === 'breaking') {
    breaking++
  } else {
    minor++
  }

  const newVersion = [breaking, moderate, minor].join('.')
  return newVersion
}

module.exports = { changeVersionNumber }