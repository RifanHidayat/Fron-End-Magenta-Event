export const getDataCostProjects = async (props) => fetch("http://localhost:3000/api/projects/"+props+"/cost")
  .then(response => response.json())
  .then((json)=>json)