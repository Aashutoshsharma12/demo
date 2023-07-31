const axios = require('axios');
var host = 'http://3.110.75.42:3009/vendor/'
var signUp = host + "" + 'auth/sign-up'
async function getFirstAlbumTitle() {
  const response = await axios.get(signUp);
  console.log(response,"response----------------------")
  return response.data[0].title;
}

module.exports = getFirstAlbumTitle;