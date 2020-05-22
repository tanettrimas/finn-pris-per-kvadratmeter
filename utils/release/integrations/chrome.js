require('dotenv').config()
const fs = require('fs')
const fetch = require('node-fetch')
const chromeBaseTokenURL = "https://accounts.google.com/o/oauth2/token"
const chromeAPIPath = "https://www.googleapis.com/upload/chromewebstore/v1.1/items/"

const { CHROME_CLIENT_ID, CHROME_CLIENT_SECRET, CHROME_REFRESH_TOKEN, CHROME_APP_ID } = process.env

function doPublishToChrome({ filePath}) {
  // TODO: resolve with false if something went wrong
  return new Promise(async (resolve, reject) => {
    const myZipFile = fs.createReadStream(filePath);

    const { access_token } = await requestGoogleToken();

    const didUpdatePackage = doUpdatePackageInChromeStore(access_token, myZipFile)

    if (!didUpdatePackage) {
      return reject(new Error('Something went wrong during the updating stage in Google'))
    }

    const didSuccessfullyPublish = didPublishToStore(access_token)

    if (!didSuccessfullyPublish) {
      return reject(new Error('Something went wrong during the publishing stage in Google'))
    }

    resolve(true)
  })
}

async function requestGoogleToken() {
  const response = await fetch(chromeBaseTokenURL, {
    method: 'POST', 
    body: JSON.stringify({
      client_id: CHROME_CLIENT_ID, 
      client_secret: CHROME_CLIENT_SECRET, 
      refresh_token: CHROME_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    throw new Error(`Google responsed with ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  console.log('Successfully retrieved access token from Google!')
  return data
}

async function doUpdatePackageInChromeStore(accessToken, file) {
  const response = await fetch(`${chromeAPIPath}${CHROME_APP_ID}`, {
    method: 'PUT', 
    body: file,
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-version': '2',
      'Authorization': `Bearer ${accessToken}`
    }
  })
  if (!response.ok) {
    console.error(`Google responsed with ${response.status} ${response.statusText}`)
    return false
  }
  const data = await response.json();
  console.log('Google successfully updated the package, here is the response:', data)
  return true
}

async function didPublishToStore(accessToken) {
  const response = await fetch(`${chromeAPIPath}${CHROME_APP_ID}/publish`, {
    method: 'POST', 
    headers: {
      'x-goog-api-version': '2',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Length': '0'
    }
  })

  if (!response.ok) {
    console.error(`Google responsed with ${response.status} ${response.statusText}`)
    return false
  }

  const data = await response.json();
  console.log('Successfully published to Chrome!')
  console.log(data)
  return true
}

module.exports = doPublishToChrome