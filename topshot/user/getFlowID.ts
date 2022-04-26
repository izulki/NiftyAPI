var axios = require('axios');

export default async function flowID(req, res) {
  //console.log(req.params)
  let username = req.params.username
  var data = JSON.stringify({
    query: `query GetUserProfileByUsername($input: getUserProfileByUsernameInput!) {
      getUserProfileByUsername(input: $input) {
      publicInfo {
          dapperID
          username
          flowAddress
          __typename
        }
        momentCount
        __typename
      }
    }`,
    variables: {"input":{"username":`${username}`}}
  });

  var config = {
    method: 'post',
    url: 'https://api.nba.dapperlabs.com/marketplace/graphql',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
  .then(function (response) {
    let data = response.data.data
    let flowAddress = data.getUserProfileByUsername.publicInfo.flowAddress
    let username = data.getUserProfileByUsername.publicInfo.username
    let dapperID = data.getUserProfileByUsername.publicInfo.dapperID
    res.send({flowAddress, username, dapperID})
  })
  .catch(function (error) {
    console.log(error);
    res.status(500).send("Error fetching account.")
  });
}


