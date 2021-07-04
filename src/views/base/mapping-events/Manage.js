import React,{ useState,useEffect }  from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import DataTable from 'react-data-table-component';
import axios from 'axios'
import Swal from 'sweetalert2'
import CIcon from '@coreui/icons-react'
import { useHistory } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CBadge,
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFade,
  CForm,
  CFormGroup,
  CFormText,
  CValidFeedback,
  CInvalidFeedback,
  CTextarea,
  CInput,
  CInputFile,
  CInputCheckbox,
  CInputRadio,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CDropdown,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CLabel,
  CSelect,
  CRow,
  CSwitch,
  CDataTable,
} from '@coreui/react'


const getBadge = status => {
  switch (status) {
    case 'closed': return 'success'
    case 'pending': return 'warning'
    case 'rejected': return 'danger'

  }
}

var  projects=[];
var dateFormat = require("dateformat");
const columns = [  
              {name: 'No. Project',sortable: true,    cell: row => <div style={{width:'100%'}}  data-tag="allowRowEvents"><div >{row.project_number}</div></div>,  }, 

              {name: 'No. Quotation',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.quotation_number}</div></div>,  },          

              {name: 'Customer',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.event_customer}</div></div>,  },
            
              {name: 'PIC ',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.event_pic}</div></div>,  }, 


              {name: 'Tanggal',sortable: true,    cell: row => <div style={{width:'150%'}}  data-tag="allowRowEvents"><div >
                  tanggal Mulai: {dateFormat(row.project_start_date, "dd/mm/yyyy")} <br/>
                  tanggal Akhir: {dateFormat(row.project_end_date, "dd/mm/yyyy")}<br/>
                  </div></div>, },


               { name: 'Total Biaya Project',  sortable: true, cell:row=>
                <div>
                  <div>
                  </div>
                  <CBadge style={{width:'100%',height:'20px' }} >
                      <span >  {row.grand_total}</span>
                  </CBadge>
                </div> },
                 { name: 'Persentasi',  sortable: true, cell:row=>
                 <div>
                   <div>
                   </div>
                   <CBadge style={{width:'100%',height:'20px' }} >
                       <span >  {row.grand_toal}</span>
                   </CBadge>
                 </div> },

              {name: 'Aksi',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >

            <CDropdown>
            <CDropdownToggle color="red">
              <CIcon name="cil-settings" color={'black'}/>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem to={`/mapping/members/${row.id}`}>Pemetaan</CDropdownItem>
              <CDropdownItem>Rekap Transaksi</CDropdownItem>
              <CDropdownItem>Tutup Project</CDropdownItem>
              </CDropdownMenu>
          </CDropdown>
                </div></div>,  },
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
