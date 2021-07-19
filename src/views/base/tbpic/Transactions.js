import React,{ useState,useEffect }  from 'react'
import Table from 'react-bootstrap/Table'
import ReactExport from "react-export-excel";
import 'jspdf-autotable'
import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getDetailPIC,dataPDF } from "./data/pic";
import Button from '@material-ui/core/Button';
import jsPDF from 'jspdf'
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
    const [namePIC,setNamePIC]=useState()
    const [dataExcel,setDataExcel]=useState()

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
    
 
  useEffect(() => {
    let id=props.match.params.id;
    
  
    getDetailPIC(id).then(response=>{
        console.log(response.data)
        setNamePIC(response.data.name)
   if (response.data.transactions.length>0){
      setTransaction([...response.data.transactions])
      setTotalIn('IDR '+response.data.total_in.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setTotalOut('IDR '+response.data.total_out.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setBalance('IDR '+response.data.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
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
        doc.text(`${namePIC}`, 10, 20)
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
                   {namePIC}
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
