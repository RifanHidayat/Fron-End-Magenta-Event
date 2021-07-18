export const getDataAccounts = async (props) => fetch("http://localhost:3000/api/projects/detail-project/"+props)
  .then(response => response.json())
  .then((json)=>json['data'])