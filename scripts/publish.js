const path = require('path')
const version = require('../package.json').version
const doPublishToMozilla = require('../utils/release/integrations/mozilla')
const doPublishToChrome = require('../utils/release/integrations/chrome')

async function publish() {
  const filePath = path.resolve(`./web-ext-artifacts/finn_pris-per-kvadratmeter-${version}.zip`)
  return Promise.all([
    doPublishToMozilla({ filePath, versionNumber: version }), 
    doPublishToChrome({ filePath })
  ])
}

publish()
  .then(([firefoxStatus, chromeStatus]) => {
    console.log('Successfully published to webstores!')
    console.log('Firefox is published:', firefoxStatus)
    console.log('Chrome is published:', chromeStatus)
  })
  .catch(error => console.error('Something went wrong!', error))
