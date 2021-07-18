import React,{ useState,useEffect }  from 'react'
import Table from 'react-bootstrap/Table'

import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { columns, data } from "./data/transactions";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,

} from '@coreui/react'
 function Transaction(props){
     
    //const [accounts,setAccounts]=useState([]); 
    const [transaction,setTransaction]=useState([]);
 
    const [totalIn,setTotalIn]=useState();
    const [totalOut,setTotalOut]=useState();
    const [balance,setBalance]=useState();
    const [projectNumber,setProjectNumber]=useState();
    
 
  useEffect(() => {
    let id=props.match.params.id;
    let project_number=props.match.params.project_number;
    
    setProjectNumber(project_number)
    data(id).then(response=>{
     //setProjectNumber(props.project_number)
     console.log(props.project_number)

   if (response.transactions.length>0){
      setTransaction([...response.transactions])
      setTotalIn('IDR '+response.total_in.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setTotalOut('IDR '+response.total_out.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setBalance('IDR '+response.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
    //  setProjectNumber(response.project_number)

   }
      })
  },[]);



  return (
    <div>
    {/* header */}
    <div style={{float:'right',width:'100%'}}>
      <div style={{float:'left',position:'absolute'}}>
        <span>
            <h5><strong>
                   {projectNumber}
          </strong></h5>
       </span>
    </div>
  <div style={{float:'right',}}>
     
     <CButton size="sm" to="/account/create"  color='primary'>
         <span>Download </span>
     </CButton>

   </div>                                  
 </div>
 
 <Table striped bordered hover style={{width:'50%'}}>
  <thead>
    <tr>
      <th>total Cash In</th>
      <th>Total Cash Out </th>
      <th>Total Saldo</th>   
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align='right'>{totalIn}</td>
      <td align='right'>{totalOut}</td>
      <td align='right'>{balance}</td>

    </tr>
  </tbody>
</Table>  
    <CCard>
      <CCardHeader>
      <span><strong>
            Detail Transaksi
    </strong></span>
  
    
      </CCardHeader>
      <CCardBody>
      {/* <DataTableExtensions {...tableData}> */}
        <DataTable
          columns={columns}
          data={transaction}
          noHeader
          defaultSortField="id"
          defaultSortAsc={false}
          pagination
          highlightOnHover
        />
      {/* </DataTableExtensions> */}

      </CCardBody>
    </CCard>
  </div>
   
  )
}

export default Transaction;
