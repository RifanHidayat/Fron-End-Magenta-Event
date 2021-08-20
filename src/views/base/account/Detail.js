import ReactExport from 'react-data-export';
import 'jspdf-autotable'
import React,{ useState,useEffect,useMemo }  from 'react'
import Table from 'react-bootstrap/Table'
import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { columns, data,dataPDF } from "./data/transaction";
import Button from '@material-ui/core/Button';
import jsPDF from 'jspdf'
import img from '../account/images/logo.png'
import FilterComponent from "src/views/base/components/FilterComponent";

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
    const [dataExcel,setDataExcel]=useState([])
    const [filterText, setFilterText] = React.useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
      false
    );

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
    const [fileName,setFileName]=useState();

  

  
    var dateFormat = require('dateformat');

  useEffect(() => {


   
  

    let id=props.match.params.id;
    let project_number=props.match.params.project_number;
    var data_transactions=[];
    
    setProjectNumber(project_number)
    data(id).then(response=>{
     //setProjectNumber(props.project_number)
     console.log(props.project_number)
     setAccountName(`${response.bank_name} (${response.account_number})`)
     setFileName(`Rekap Transaksi akun ${response.bank_name} (${response.account_number!=null?response.account_number:""})`)

   if (response.transactions.length>0){
      setTransaction([...response.transactions])
      setTotalIn('IDR '+response.total_in.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setTotalOut('IDR '+response.total_out.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setBalance('IDR '+response.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      console.log(response.transactions)

    //  setProjectNumber(response.project_number)


      

    response.transactions.map((value,index)=>{
    
      var data=[
        {
          value:dateFormat(value.date,'dd/mm/yyyy'),width:100,
        },
        {
          value: `${value.type=="out"?"Advance":"deposit"}`,width: {wpx: 80}
        },
        {
          value: `${value.description==null?"":value.description}`,width: {wpx: 150}
        },
        {
          value:value.type==="in"?value.amount:"",width: {wpx: 100}
        },
        {
          value:value.type==="out"?value.amount:"",width: {wpx: 100},
        },
        {
          value:value.balance,width: {wpx: 80}
        }
      ]
      data_transactions.push(data)
      if (index+1>=response.transactions.length){
        const header=[
        {  value:response.total_in,width: {wpx: 100},},
        {  value:response.total_out,width: {wpx: 100},},
        {  value:response.balance,width: {wpx: 100},}

        ]
        const multiDataSet = [
          
          {
           
              columns: [
                  {title: "Total In", width: {wpx: 100},style: {fill: {patternType: "solid", fgColor: {rgb: "808080"}}}},//pixels width 
                  {title: "Total Ou", width: {wpx: 100},style: {fill: {patternType: "solid", fgColor: {rgb: "808080"}}}},//char width 
                  {title: "Saldo", width: {wpx: 100},style: {fill: {patternType: "solid", fgColor: {rgb: "808080"}}}},
                  
              ],
              data: [header]
          },
          {
         
            ySteps: 1, //will put space of 5 rows,
           
            
            columns: [
                {title: "Tanggal", width: {wpx: 100},style: {fill: {patternType: "solid", fgColor: {rgb: "808080"}}}},//pixels width 
                {title: "Tipe", width: {wpx: 100},style: {fill: {patternType: "solid", fgColor: {rgb: "808080"}}}},
               
                {title: "Deskripsi", width: {wpx: 250},style: {fill: {patternType: "solid", fgColor: {rgb: "808080"}}}},//char width 
                {title: "Cash In", width: {wpx: 100},style: {fill: {patternType: "solid", fgColor: {rgb: "808080"}}}},
               
                {title: "Cash Out", width: {wpx: 100},style: {fill: {patternType: "solid", fgColor: {rgb: "808080"}}}},
                {title: "Saldo", width: {wpx: 100},style: {fill: {patternType: "solid", fgColor: {rgb: "808080"}}}},
            ],
            data: data_transactions
        },
          
          
      ];
      setDataExcel([...multiDataSet])
      }

    })
   }
      })
  },[]);


  function showPDF(){

    dataPDF(props.match.params.id).then(response=>{
        var data_transactions_pdf=[]
        var doc = new jsPDF('p', 'px', 'a4');
        doc.text(`Akun ${response.data.bank_name} (${response.data.account_number})`, 10, 20)
        doc.addImage(img, 'png', 380, 10, 50, 50)
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
          headStyles: {
            fillColor: '#df0c8f',
            textColor: [255,255,255],
            fontSize: 10,
            padding: 0,
        },
        
         
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
        headStyles: {
          fillColor: '#df0c8f',
          textColor: [255,255,255],
          fontSize: 10,
          padding: 0,
      },
      
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

  const filteredItems = transaction.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );


  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };


    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);


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


                <ExcelFile  filename="Rekap Transaksi Akun"  element={
                <Button variant="contained" color="success"  style={{backgroundColor:'green',color:'white'}}>
                Excel
            </Button>
                }>
                    <ExcelSheet dataSet={dataExcel} name="Organization"/>
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
          data={filteredItems}  
          subHeader
          defaultSortField="id"
          defaultSortAsc={false}
          pagination
          highlightOnHover
          subHeaderComponent={subHeaderComponent}
        />
      {/* </DataTableExtensions> */}

      </CCardBody>
    </CCard>
  </div>
   
  )
}

export default Transaction;
