export const getAllPICTB= async (props) => fetch("http://localhost:3000/api/pic/pic-tb")
  .then(response => response.json())
  .then((json)=>json)
  