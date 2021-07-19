import ReactExport from "react-export-excel";
import 'jspdf-autotable'

import React,{ useState,useEffect }  from 'react'
import Table from 'react-bootstrap/Table'
import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { columns, data,dataPDF } from "./data/transaction";
import Button from '@material-ui/core/Button';
import jsPDF from 'jspdf'

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
    const [accountNmame,setAccountName]=useState();
    const [dataExcel,setDataExcel]=useState()

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  

  
    var dateFormat = require('dateformat');

  useEffect(() => {
    let id=props.match.params.id;
    let project_number=props.match.params.project_number;
    
    setProjectNumber(project_number)
    data(id).then(response=>{
     //setProjectNumber(props.project_number)
     console.log(props.project_number)
     setAccountName(`${response.bank_name} (${response.account_number})`)

   if (response.transactions.length>0){
      setTransaction([...response.transactions])
      setTotalIn('IDR '+response.total_in.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setTotalOut('IDR '+response.total_out.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setBalance('IDR '+response.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
    //  setProjectNumber(response.project_number)

   }
   

      })
  },[]);


  function showExcel(){
    dataPDF(props.match.params.id).then((response)=>{
        var data_transactions_excel=[]
         response.data.transactions.map((values)=>{
             console.log('tee',values)
             var data={
                 date:values.date,
                 description:values.description,
                 in:values.type==='in'?values.amount:"",
                 out:values.type==="out"?values.amount:"",
                 balance:values.balance
             }
              data_transactions_excel.push(data)          
         })
         setDataExcel([...data_transactions_excel])
    
       })
     


  }

  function showPDF(){

    dataPDF(props.match.params.id).then(response=>{
        var data_transactions_pdf=[]
        var doc = new jsPDF('p', 'px', 'a4');
        doc.text(`${response.data.bank_name} (${response.data.account_number})`, 10, 20)
        doc.autoTable({ html: '#my-table' })

        response.data.transactions.map((values)=>{
            var data=[
                dateFormat(values.date,'dd/mm/yyyy'),
                values.description,
                values.type==="in"?"IDR "+values.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."):"",
                values.type==="out"?"IDR "+values.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."):"",
                "IDR "+values.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            ]
            data_transactions_pdf.push(data)
            
        })
        doc.autoTable({
            margin:{top:20},
            columnStyles: { 
                0: { 
                    halign: 'right', 
                },
                1: { 
                    halign: 'right', 
                },
                2: { 
                    halign: 'right', 
                } 
            },

            margin:{left:10,right:'70%',top:'10%'},


        head: [['Total Cash In', 'Total Cash Out', 'Saldo']],
        body: [
            [
                "IDR "+response.data.total_in.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
                "IDR "+response.data.total_out.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
                "IDR "+response.data.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            ],

        ],
    })
    doc.autoTable({
        margin:{top:20},
        columnStyles: {
            0: {cellWidth: 50},
        
            2: {cellWidth: 70, halign: 'right', },
            3: {cellWidth: 70, halign: 'right', },
            4: {cellWidth: 70, halign: 'right'},
          },
       thema:'grid',
        margin:{left:10,right:10},
        head: [['tanggal', 'Deskripsi', 'Cash In','Cash Out','Saldo']],
        body: data_transactions_pdf
    })
        window.open(doc.output('bloburl'), '_blank');    
    })  
  };




  return (
    <div>
    {/* header */}
    <div style={{float:'right',width:'100%'}}>
      <div style={{float:'left',position:'absolute'}}>
        <span>
            <h5><strong>
                {accountNmame}
          </strong></h5>
       </span>
    </div>
  <div style={{float:'right',}}>
     
  <Button variant="contained" color="secondary" onClick={()=>showPDF()}>
    PDF
</Button>
&nbsp;
&nbsp;

 <ExcelFile element={
    <Button variant="contained" style={{backgroundColor:'green', color:'white'}}  onClick={()=>showExcel()}>Excel</Button>
 }>
   <ExcelSheet name="Organization"/>
  </ExcelFile>


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
