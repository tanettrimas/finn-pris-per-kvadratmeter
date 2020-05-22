require('dotenv').config()
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch')
const signAddon = require('sign-addon').default;


const MOZILLA_BASE_API_URL = "https://addons.mozilla.org/api/v4"

const { MOZILLA_JWT_SECRET, MOZILLA_JWT_ISSUER, MOZILLA_UUID } = process.env
function doPublishToMozilla({ filePath, versionNumber } = {}) {
  return new Promise(async (resolve, reject) => {
    signAddon({
      // Required arguments:
    
      xpiPath: filePath,
      version: versionNumber,
      apiKey: MOZILLA_JWT_ISSUER,
      apiSecret: MOZILLA_JWT_SECRET,
    
      // Optional arguments:

      // The explicit extension ID.
      // WebExtensions do not require an ID.
      // See the notes below about dealing with IDs.
      id: MOZILLA_UUID,
      // The release channel (listed or unlisted).
      // Ignored for new add-ons, which are always unlisted.
      // Default: most recently used channel.
      channel: undefined,
      // Save downloaded files to this directory.
      // Default: current working directory.
      downloadDir: undefined,
      // Number of milleseconds to wait before aborting the request.
      // Default: 2 minutes.
      timeout: undefined,
      // Optional proxy to use for all API requests,
      // such as "http://yourproxy:6000"
      // Read this for details on how proxy requests work:
      // https://github.com/request/request#proxies
      apiProxy: undefined,
      // Optional object to pass to request() for additional configuration.
      // Some properties such as 'url' cannot be defined here.
      // Available options:
      // https://github.com/request/request#requestoptions-callback
      apiRequestConfig: undefined,
      // Optional override to the number of seconds until the JWT token for
      // the API request expires. This must match the expiration time that
      // the API server accepts.
      apiJwtExpiresIn: undefined,
      // Optional override to the URL prefix of the signing API.
      // The production instance of the API will be used by default.
      apiUrlPrefix: MOZILLA_BASE_API_URL,
    })
      .then(function(result) {
        if (result.success) {
          console.log('The following signed files were downloaded:');
          console.log(result.downloadedFiles);
          console.log('Your extension ID is:');
          console.log(result.id);
        } else {
          console.error('Your add-on could not be signed!');
          console.error('Error code: ' + result.errorCode);
          if (result.errorCode) {
            resolve(true)
          }
        }
        console.log(result.success ? 'SUCCESS' : 'FAIL');
      })
      .catch(function(error) {
        console.error('Signing error:', error);
        reject(new Error(error.message))
      });
  })
}



function generateMozillaJWT() {
  return new Promise((resolve, reject) => {
    try {
      const issuedAt = Math.floor(Date.now() / 1000);
      const payload = {
        iss: MOZILLA_JWT_ISSUER,
        jti: Math.random().toString(),
        iat: issuedAt,
        exp: issuedAt + 60,
      };
      
      const secret = MOZILLA_JWT_SECRET;  // store this securely.
      const token = jwt.sign(payload, secret, {
        algorithm: 'HS256',  // HMAC-SHA256 signing algorithm
      });
      resolve(token)
    } catch (error) {
      reject(new Error(error.message))
    }
  })
}

async function doTestRequest() {
  const JWT = await generateMozillaJWT()
  const response = await fetch(`${MOZILLA_BASE_API_URL}/addons/${MOZILLA_UUID}/versions/1.0.10`, {
    method: 'GET', 
    headers: {
      'Authorization': `JWT ${JWT}`
    }
  })
  const data = await response.json()
  console.log(data)
}


doTestRequest()

module.exports = doPublishToMozilla

