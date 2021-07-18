export const getProjects = async (props) => fetch("http://localhost:3000/api/projects")
  .then(response => response.json())
  .then((json)=>json['data'])

  export const totalStatus = async (props) => fetch("http://localhost:3000/api/projects/count-status")
  .then(response => response.json())
  .then((json)=>json)