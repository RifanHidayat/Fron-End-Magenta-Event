export const getDataAccounts = async () => fetch("http://localhost:3000/api/accounts")
  .then(response => response.json())
  .then((json)=>json['data'])