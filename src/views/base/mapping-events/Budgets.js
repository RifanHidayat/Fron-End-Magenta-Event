import React,{ useState,useEffect }  from 'react'
import axios from 'axios'
import ReactMapGL from 'react-map-gl';
import DataTable from 'react-data-table-component'
import './css/style.css'
import { useHistory } from "react-router-dom";
// import {Projects} from './components/Projects'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CLabel,
  CInput,
  CCol,CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CFormGroup,
  CCardFooter,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,

} from '@coreui/react'
import { Projects } from './components/Projects';


const columns = [  
  {name: 'Pegawai',sortable: true,    cell: row => <div  data-tag="allowRowEvents">
    <div >
      <div>{
        row.first_name
        }  
    </div>
    
    <div>{
        row.employee_id
        }  
    </div>
    </div>
    
    </div>,  }, 
  {name: 'KTP/NPWP',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.identity_number}</div></div>,  },      
  {name: 'Uang Harian',sortable: true,right:true,    cell: row => <div data-tag="allowRowEvents"><div >{row.daily_money_regular}</div></div>,  },



];

const columns_selected_members = [  
  {name: 'Pegawai',sortable: true, 
     cell: row => <div  data-tag="allowRowEvents">
      <div >
        <div>{
          row.first_name
          }  
      </div>
      
      <div>{
          row.employee_id
          }  
      </div>
      </div>
    
  </div>,  }, 

  {name: 'KTP/NPWP',sortable: true, 
     cell: row => <div data-tag="allowRowEvents">
    <div >{row.identity_number}</div></div>,  },
          
  {name: 'Uang Harian',sortable: true,right:true,   
   cell: row => <div data-tag="allowRowEvents">
    <div >{row.daily_money_regular}</div></div>, 
 },

{name: 'Status',sortable: true,   
   cell: row => <div data-tag="allowRowEvents">
    <div >
    <div className="select">
  <select id="standard-select">
    <option value="Option 1">Anggota</option>
    <option value="Option 2">PIC 2</option>

 
  </select>
</div>
      
    </div></div>, 
 },
];

var  members=[];




function Budgets(props){
    const [tempProjectNumber, setTempProjectNumber] = useState(''); 
    const [tempProjectCreatedDate, setTempProjectCreatedDate] = useState('');
    const [tempProjectStartedDate, setTempProjectStartDate] = useState('');
    const [tempProjectEndDate, setTempProjectEndDate] = useState('');
    const [tempEventCustomer, setTempEventCustomer] = useState('');
    const [tempEventPic, setTempEventPic] = useState('');
    const [tempDescription, setTempDescription] = useState('');
    const [tempTotalProjectCost, setTempTotalProjectCos] = useState('');
    const [tempLatitude, setTempLatitude] = useState('');
    const [tempLongtitude, setTempLongtitude] = useState('');
    const [tempMap, setTempMap] = useState(false)
    const  [tempMembers,setTempMembers]=useState([]);
    const [modalMembers,setModalMembers]=useState(false);
    const [tempSelectedMembers,setTempSelectedMembers]=useState([])

    //loading spinner
    const [tempIsloadingMembers,setTempIsLoadingMembers]=useState(true);
    const[tempsIsLoadinAddMembers,setTempIloadingAddMembers]=useState(true);

    const fields = ['name','registered', 'role', 'status']
    //const fieldsa=[{name:'nama'},{registered:'regis'},{role:'aturan'},{status:}]

      //variable push page
    const navigator = useHistory();

    //navigation page
    const budgetsPage=()=>{
      var id=props.match.params.id;
      navigator.push('/mapping/budgets/'+id);
    }
    const membersPage=()=>{
      var id=props.match.params.id;
      navigator.push('/mapping/members/'+id);
    }
    const tasksPage=()=>{
      var id=props.match.params.id;
      navigator.push('/mapping/tasks/'+id);
    }
    const approvalPage=()=>{
      var id=props.match.params.id;
      navigator.push('/mapping/approval/'+id);
    }
      

    const saveMembers=(data)=>{
   
    }

   

  
    useEffect(()=>{
   

        //get members
        // axios.get("http://hrd.magentamediatama.net/api/employees").then((response)=>{
        //   members=response.data.data;
        //   setTempIloadingAddMembers(false);
        //   console.log(members);
        // })
        // .then((error)=>{
        //   setTempIloadingAddMembers(false);
        //  // console.log(error.
        // })    
    },[])

     //mapbox
  const[viewport, setViewport] = useState({
    width: "100",
    height: "400",
    latitude: 38.963745,
    longitude: 35.243322,
    zoom: 5
});


// selection table
  const onCheck = (state) => {
  //console.log(state.selectedRows);
  setTempSelectedMembers([...state.selectedRows]);
    
  };

  

  return (
      
    <div>
           <Projects id={props.match.params.id} ></Projects>
    {/* //menu */}
        <div class="pills-regular">
            <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">

                <li class="nav-item" id="members">
                    <button class="nav-link" onClick={()=>membersPage()}  > Anggota</button>
                 </li>&ensp;

                <li class="nav-item" id="budgets" to="/projects/manage">
                    <button class="nav-link active" onClick={()=>budgetsPage()} > Anggaran</button>
                 </li>&ensp;

                 <li class="nav-item" id="tasks">
                     <button class="nav-link" onClick={()=>tasksPage()} > Tugas</button>
                </li>&ensp;

                <li class="nav-item" id="approval" >
                        <button class="nav-link" onClick={()=>approvalPage()}  > Persetujuan</button>
                 </li>&ensp;
            </ul>
        </div>

        {/* data</Projects> project */}
   

        {/* Members */}
        <CCard>
            <CCardHeader>
                <div style={{float:'right',width:'100%'}}>
                    <div style={{float:'left',position:'absolute'}}>
                        <span>
                            <strong>
                                Anggaran Project
                            </strong>
                        </span>
                    </div>
                    <div  style={{textAlign: 'right'}}>
                      <CButton  size="sm"  className="btn-brand mr-1 mb-1" color='primary'>
                        <span> {tempIsloadingMembers==true?<i class="fas fa-circle-notch fa-spin"/>:<i class="fa fa-plus"/>} Tambah</span>
                      </CButton> 
                  </div>
                                    
                </div>
            </CCardHeader>
            <CCardBody>
                {tempMembers==''?
                    <div style={{textAlign:'center'}}>
                        <img 
                            src="https://arenzha.s3.ap-southeast-1.amazonaws.com/eo/icons/budget.png"
                            alt="new"
                            style={{width:'10%',height:'10%'}}
                        />
                         <br/>
                          <span>Belum ada Anggaran Project</span>
                    </div>

                :
                <CButton>tes</CButton>
                }
            
            </CCardBody>
                              {/* //modal members */}
          <CModal 
              show={modalMembers} 
              onClose={() => setModalMembers(!modalMembers)}
              size="lg">
              <CModalHeader closeButton>
                <CModalTitle>Pegawai EO</CModalTitle>
              </CModalHeader>
              <CModalBody>
               <DataTable 
                  
                  columns={columns}        
                  data={members}       
                  selectableRows  
                  pagination                            
                  paginationDefaultPage
                  paginationPerPage={5}                
                  defaultSortFieldId                
                  sortable                
                  Clicked
                  style                
                  onSelectedRowsChange={onCheck}
                  selectableRowsComponentProps={{ inkDisabled: true }}                   
               /> 
              <div><span>Pegawai terpilih</span></div>
            
           {tempSelectedMembers==''?
                    <div style={{textAlign:'center'}}>
                        <img 
                            src="https://arenzha.s3.ap-southeast-1.amazonaws.com/photos/default-photo.png"
                            alt="new"
                            style={{width:'10%',height:'10%'}}
                        />
                         <br/>
                          <span>Belum ada pegawai terpilih</span>
                    </div>

                :
                 <DataTable
                className="use-datatable"      
                columns={columns_selected_members}        
                data={tempSelectedMembers}                    
             /> 
        
                }
              </CModalBody>
              <CModalFooter>

                {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
                <div  style={{textAlign: 'right'}}>
                    <CButton disabled={tempIsloadingMembers} onClick={()=>saveMembers()} size="sm"   className="btn-brand mr-1 mb-1" color='primary'>
                    { tempIsloadingMembers? <i class="spinner-border"></i>: 
                    <span><i class="fa fa-save"/> Simpan</span>}
                      </CButton> 
              </div>

              </CModalFooter>
            </CModal>

        </CCard>
  </div>
   
  )
}
export default Budgets;
