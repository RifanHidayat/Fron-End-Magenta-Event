export const getDataEmployess = async () => fetch("http://hrd.magentamediatama.net/api/employees")
  .then(response => response.json())
  .then((json)=>json['data'])