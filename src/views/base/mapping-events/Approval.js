import React,{ useState,useEffect }  from 'react'
import axios from 'axios'
import ReactMapGL from 'react-map-gl';
import DataTable from 'react-data-table-component'
import './css/style.css'
import { useHistory } from "react-router-dom";

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




function Approval(props){
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
        let id=props.match.params.id;
        console.log(id);

        //get detail project
        axios.get('http://localhost:3000/api/projects/detail-project/'+id)
        .then((response)=>{
            setTempProjectNumber(response.data.data.project_number)
             //projecct create data
            let project_created_date = new Date(response.data.data.project_created_date)
            let date_crated = project_created_date.getDate();
            let month_created = project_created_date.getMonth() + 1;
            let year_created = project_created_date.getFullYear();
            setTempProjectCreatedDate(year_created+'-'+'00'.substr( String(month_created).length ) + month_created+'-'+'00'.substr( String(date_crated).length ) + date_crated);

            //project start date
            let project_start_date = new Date(response.data.data.project_start_date)
            let date_start = project_start_date.getDate();
            let month_start = project_start_date.getMonth() + 1;
            let year_start = project_start_date.getFullYear();
            setTempProjectStartDate(year_start+'-'+'00'.substr( String(month_start).length ) + month_start+'-'+'00'.substr( String(date_start).length ) + date_start);
            // console.log('tanggal mulai',tempProjectStartDate)
            
            //project end date
            let project_end_date = new Date(response.data.data.project_end_date)
            let date_end = project_end_date.getDate();
            let month_end = project_end_date.getMonth() + 1;
            let year_end = project_end_date.getFullYear();
            setTempProjectEndDate(year_end+'-'+'00'.substr( String(month_end).length ) + month_end+'-'+'00'.substr( String(date_end).length ) + date_end);

            setTempEventCustomer(response.data.data.event_customer)
            setTempEventPic(response.data.data.event_pic);
            setTempDescription(response.data.data.description);
            setTempLatitude(response.data.data.latitude);
            setTempLongtitude(response.data.data.longtitude);
            setTempTotalProjectCos(response.data.data.total_project_cost.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))

            setTempMembers([...response.data.data.members])
            setTempIsLoadingMembers(false);
    
        })
        .catch((error)=>{
            setTempIsLoadingMembers(false);
    
        })

        //get members
        axios.get("http://hrd.magentamediatama.net/api/employees").then((response)=>{
          members=response.data.data;
          setTempIloadingAddMembers(false);
          console.log(members);
        })
        .then((error)=>{
          setTempIloadingAddMembers(false);
         // console.log(error.
        })    
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
    {/* //menu */}
        <div class="pills-regular">
            <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">

                <li class="nav-item" id="members">
                    <button class="nav-link" onClick={()=>membersPage()}  > Anggota</button>
                 </li>&ensp;

                <li class="nav-item" id="budgets" to="/projects/manage">
                    <button class="nav-link" onClick={()=>budgetsPage()} > Anggaran</button>
                 </li>&ensp;

                 <li class="nav-item" id="tasks">
                     <button class="nav-link" onClick={()=>tasksPage()} > Tugas</button>
                </li>&ensp;

                <li class="nav-item" id="approval" >
                        <button class="nav-link active" onClick={()=>approvalPage()}  > Persetujuan</button>
                 </li>&ensp;
            </ul>
        </div>

        {/* data project */}
        <CCard>
            <CCardHeader>
            <div style={{float:'right',width:'100%'}}>
                    <div style={{float:'left',position:'absolute'}}>
                        <span>
                            <strong>
                                Data Project
                            </strong>
                        </span>
                    </div>
                    <div style={{float:'right',}}>
                        <CButton size="sm" bloc to="/projects/create"  color='primary'>
                         <span>Approve  </span>
                         </CButton>
                     
                    </div>
                                    
                </div>
            </CCardHeader>
            <CCardBody>
            
            <CFormGroup row className="my-0">
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="Project_number">No. Project</CLabel>
                   <CInput readOnly  required id="project_number" placeholder="" name="project_number"  value={tempProjectNumber} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel  htmlFor="Project_created_date">Tanggal Buat Project</CLabel>
                   <CInput readOnly type="date" required id="project_created_date" name="project_created_date" placeholder=""  value={tempProjectCreatedDate}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="project_start_date">Tanggal Mulai Project</CLabel>
                   <CInput readOnly type="date"  required id="project_start_date" name="project_start_date" placeholder=""  value={tempProjectStartedDate}/>
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="project_end_date">Tanggal Akhir Project</CLabel>
                   <CInput readOnly type="date"  required  id="project_end_date" name="project_end_date"  placeholder=""   value={tempProjectEndDate}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel required htmlFor="event_customer">Customer Event</CLabel>
                   <CInput readOnly  id="event_customer" name="event_customer"   placeholder=""  value={tempEventCustomer} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="event_pic">PIC Event</CLabel>
                   <CInput readOnly id="event_pic" name="event_pic" placeholder="" value={tempEventPic}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="description">Deskripsi</CLabel>
                   <CInput readOnly id="description" name="description" placeholder=""  value={tempDescription} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
               <CFormGroup>
                 <CLabel htmlFor="total_project_cost">Total Biaya Project</CLabel>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>IDR</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput readOnly style={{textAlign:'right'}} id="total_project_cost"  name="total_project_cost"  value={tempTotalProjectCost}/>                  
                  </CInputGroup>
                </CFormGroup>
               </CCol>
               
               <CCol xs="5">
                 <CFormGroup>
                   <CLabel htmlFor="latitude">Latitude</CLabel>
                   <CInput readOnly id="latitude" name="latitude" placeholder=""   value={tempLatitude} />
                 </CFormGroup>
               </CCol>
               <CCol xs="5">
                 <CFormGroup>
                   <CLabel htmlFor="longtitude">Longitude</CLabel>
                   <CInput readOnly id="longtitude" name="longtitude" placeholder=""  value={tempLongtitude} />
                 </CFormGroup>
               </CCol>
               <CCol xs="2">
                 <CFormGroup>

                 <div   style={{textAlign: 'right',marginTop:'35px',width:'100%'}}>                                     
                 <CButton color="primary" onClick={() => setTempMap(!tempMap)} size="sm" block> <i class="fa fa-map-marker" aria-hidden="true"></i></CButton>
                  </div>
                 </CFormGroup>
               </CCol>
             </CFormGroup>
            </CCardBody>

             
        </CCard>

        {/* Members */}
        <CCard>
            <CCardHeader>
            <div>
                <span>
                  <strong>
                      Anggota project
                  </strong>
              </span>                                 
                </div>
            </CCardHeader>
            <CCardBody>
               
            
            </CCardBody>  
        </CCard>

         {/* budget */}
         <CCard>
            <CCardHeader>
            <div>
                <span>
                  <strong>
                      Anggaran Project
                  </strong>
              </span>                                 
                </div>
            </CCardHeader>
            <CCardBody>
               
            
            </CCardBody>  
        </CCard>

          {/* Task */}
          <CCard>
            <CCardHeader>
                <div>
                <span>
                  <strong>
                      Tugas Project
                  </strong>
              </span>                                 
                </div>
            </CCardHeader>
            <CCardBody>
               
            
            </CCardBody>  
        </CCard>
  </div>
   
  )
}
export default Approval;
