export const getAllPIC= async (props) => fetch("http://localhost:3000/api/pic")
  .then(response => response.json())
  .then((json)=>json)
  
  export const getDetailPIC= async (props) => fetch("http://localhost:3000/api/pic/detail-pictb/"+props)
  .then(response => response.json())
  .then((json)=>json)

  export const getAllFaktur= async (props) => fetch("http://localhost:3000/api/faktur")
  .then(response => response.json())
  .then((json)=>json)

  export const getAllPICTB= async (props) => fetch("http://localhost:3000/api/pic/pic-tb")
  .then(response => response.json())
  .then((json)=>json)
  
  export const getAllProjets= async (props) => fetch("http://localhost:3000/api/projects")
  .then(response => response.json())
  .then((json)=>json)

  export const dataPDF= async (props) => fetch("http://localhost:3000/api/pic/detail-pictb/"+props)
  .then(response => response.json())
  .then((json)=>json)

  export const DataInTransactions= async (id) => fetch(`http://localhost:3000/api/pictb/${id}/transactions/in`)
  .then(response => response.json())
  .then((json)=>json)

  export const DataOutTransactions= async (id) => fetch(`http://localhost:3000/api/pictb/${id}/transactions/out`)
  .then(response => response.json())
  .then((json)=>json)

  

  export const getInOutNumber = async (props) => fetch("http://localhost:3000/api/inout/inout-number")
  .then(response => response.json())
  .then((json)=>json)

  export const getAcounts = async (props) => fetch("http://localhost:3000/api/accounts")
  .then(response => response.json())
  .then((json)=>json)

  export const getInOutTransaction = async (props) => fetch("http://localhost:3000/api/pict/add-saldo-pictb/"+props)
  .then(response => response.json())
  .then((json)=>json)

  
  
  