import React,{ useState,useEffect }  from 'react'
import Table from 'react-bootstrap/Table'

import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getDetailPIC } from "./data/pic";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,

} from '@coreui/react'


var dateFormat = require('dateformat');


const columns = [

    {
        name: "Tanggal",
        selector: "date",
        sortable: true,
        width:'15%',
        cell:row=><span>{dateFormat(row.date,'dd/mm/yyyy')}</span>
      },

      {
        name: "Deskripsi",
        selector: "description",
        sortable: true,
        width:'25%',
        cell: row => <div dangerouslySetInnerHTML={{__html: ''+row.description!==""?row.description:""}} />
      },
      
      {
        name: "Cash In",
        selector: "amount",
        sortable: true,
        ritgh:true,
        width:'20%',
        cell: row=> <span> {row.type==='in'?"IDR "+row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."):""}</span>
        
      },
      {
        name: "Cash Out",
        selector: "amount",
        sortable: true,
        ritgh:true,
        width:'20%',
        cell: row=> <span> {row.type==='out'?"IDR "+row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."):""}</span>
      },
      {
        name: "Saldo",
        selector: "",
        sortable: true,
        ritgh:true,
        width:'20%',
        cell:row=>
        <div>
          IDR &nbsp;
          {
            row.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
          }
       
        </div>
      },
   
    ];
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
    getDetailPIC(id).then(response=>{
        console.log(response.data)
    
   
    

   if (response.data.transactions.length>0){
      setTransaction([...response.data.transactions])
      setTotalIn('IDR '+response.data.total_in.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setTotalOut('IDR '+response.data.total_out.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setBalance('IDR '+response.data.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
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
      <th>Total Cash In</th>
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
