export const getInOutNumber = async (props) => fetch("http://localhost:3000/api/inout/inout-number")
  .then(response => response.json())
  .then((json)=>json)

  export const getAcounts = async (props) => fetch("http://localhost:3000/api/accounts")
  .then(response => response.json())
  .then((json)=>json)

  export const getInOutTransaction = async (props) => fetch("http://localhost:3000/api/inout")
  .then(response => response.json())
  .then((json)=>json)