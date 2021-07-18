import React,{ useState,useEffect }  from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import DataTable from 'react-data-table-component';
import axios from 'axios'
import Swal from 'sweetalert2'
import CIcon from '@coreui/icons-react'
import { useHistory } from "react-router-dom";
import {BsGear} from 'react-icons/bs'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CDropdown,
 
} from '@coreui/react'


const getBadge = status => {
  // eslint-disable-next-line default-case
  switch (status) {
    case 'approved': return 'success'
    case 'pending': return 'warning'
    case 'rejected': return 'danger'

  }
}

var  projects=[];
var dateFormat = require("dateformat");
const columns = [  
              {
                name: 'No. Project',
                sortable: true,    
                cell: row => <div style={{width:'100%'}}  data-tag="allowRowEvents"><div >{row.project_number}</div></div>,
          
              }, 
              {
                name: 'No. Quotation',
                sortable: true, 
                cell: row => <div data-tag="allowRowEvents"><div >{row.quotation_number}</div></div>, 
              width:'15%'
            
             },          
              {
                name: 'Customer',
                sortable: true,   
                 cell: row => <div data-tag="allowRowEvents"><div >{row.event_customer}</div></div>, 
                width:'15%'
                
               },
              {
                name: 'PIC ',
                sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.event_pic
                }</div></div>,
                
              },
              {
                name: 'Tanggal',
                sortable: true,  
                  cell: row => <div style={{width:'150%'}}  data-tag="allowRowEvents"><div >
              tanggal Mulai: {dateFormat(row.project_start_date, "dd/mm/yyyy")} <br/>
              tanggal Akhir: {dateFormat(row.project_end_date, "dd/mm/yyyy")}<br/>
              </div></div>,
                width:'16%'
               },
               {
                name: 'Total Biaya',
                sortable: true,right: true,    
                cell: row => <div data-tag="allowRowEvents">
              <div >{row.grand_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
              }</div>
              </div>,
               width:'10%'
               }, 
                   { name: 'Status',  sortable: true, 
                   cell:row=><div><div></div>
                   <CBadge style={{width:'100%' }} color={getBadge(row.status)}>
                   <span style={{color:'white',alignContent:'center'}}>  {row.status}</span>
                   </CBadge>
                   </div> },

              { 
                name: 'Persentase',  
                sortable: true, cell:row=>
              <div>
              <div>
              </div>
             <CBadge style={{width:'100%',height:'20px' }} >
             <span >  {row.grand_toal}</span>
            </CBadge>
            </div> 
            },

          {name: 'Aksi',
          sortable: true,  
            cell: row => <div data-tag="allowRowEvents"><div >

            <CDropdown>
            <CDropdownToggle caret={false} color="secondary">
              <BsGear size='18px'/>
              
            </CDropdownToggle>
            <CDropdownMenu   placement="left-end"  >
              <CDropdownItem  to={`/mapping/members/${row.id}`}>Pemetaan</CDropdownItem>
              <CDropdownItem  to={`/mapping/Transactions/${row.id}/${row.project_number}`}>Rekap Transaksi</CDropdownItem>
              {row.status==="approved"?
              <CDropdownItem  to={`/mapping/l/r/${row.id}`}>L/R Project</CDropdownItem>
              :<span></span>             
              }
              
              <CDropdownItem>Tutup Project</CDropdownItem>
              </CDropdownMenu>
          </CDropdown>
                </div></div>, 
                width:'10%'
                 },
            ];


function Manage(){
   
    const [tempProjects, setTempProjects] = useState([]);
   
    
  useEffect(() => {
    fetch('http://localhost:3000/api/projects')
    .then((response)=>response.json())
    .then((json)=>{
      projects=json['data'];
      setTempProjects(...json['data'])
      console.log('data',projects);
      setTempProjects(...json['data']);
      
    });
  }, []);


  return (
    <div>
    <CCard>
      <CCardHeader>
      <div>
            <span><strong>Pemetaan Project</strong></span>  
        </div>
      
      </CCardHeader> 
      <CCardBody>


      <DataTable       
      columns={columns}        
      data={projects}       
      pagination  
      defaultSortFieldId
      sortable                      
      />    

      </CCardBody>
    </CCard>
  </div>
   
  )
}

export default Manage;
