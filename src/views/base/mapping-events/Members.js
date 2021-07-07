import React,{ useState,useEffect }  from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import './css/style.css'
import { useHistory } from "react-router-dom";
import Select from 'react-select'
import $, { data } from 'jquery';
import { MDBDataTableV5 } from 'mdbreact';
import {getDataEmployess} from './data/employees'
import {Projects} from './components/Projects'

//import './loader.js'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,


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

const options = [
  { value: 'member', label: 'Anggota' },
  { value: 'pic', label: 'PIC' },

]  


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
    <br/>
      <br/>
      <br/>
    <div className="select">
      
    <Select
   
    
    defaultValue={options[1]}                         
    className="basic-single"
    classNamePrefix="select"                     
    options={options}
    name="color"/>  
</div>


     
    </div>
    <br/>
      <br/>
      <br/>
      <br/>
      
    
    </div>, 
 },
];



var  members=[];
function Members(props){

    const  [tempMembers,setTempMembers]=useState([]);
    const [modalMembers,setModalMembers]=useState(false);
    const [tempSelectedMembers,setTempSelectedMembers]=useState([])
    const [employess,setEmployess]=useState([]);


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
      
    // var table = $('#use-datatable').DataTable();
 
    // $('#use-datatable tbody').on( 'click', 'tr', function () {
    //     //console.log( table.row( this ).data() );
    //     console.log("tes")

    // } );
    // } );
    const saveMembers=(data)=>{
     // var data=[];
     var m=[];
      $('#use-datatable tbody tr').each(function() {
        var employee_id = $(this).find('td:nth-child(1)').text().toString().trim();
        var name = $(this).find('td:nth-child(2)').text().toString().trim();
        var idendity_number = $(this).find('td:nth-child(3)').text().toString().trim();
        var daily_money_regular = $(this).find('td:nth-child(4) input').val().toString().trim();
        var status = $(this).find('td:nth-child(5) select').val().toString().trim();
        var data={employee_id:employee_id,name:name,idendity_number:idendity_number,daily_money_regular:parseInt(daily_money_regular),status:status}
        m.push(data);
        //console.log(status)

        // console.log('quantity ',employee_id);
        
        
      });
      console.log(m)


  
     
  
    }



  
    useEffect(()=>{
        //all employess eo
        getDataEmployess().then(response=>{
          members=response;
         
          setEmployess([...response])
     
          setTempIloadingAddMembers(false);
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

const onSelected = (state) => {
  //setTempSelected(selectedOptions['value'])
  //console.log(state.)
  $('$data').val();
}

// selection table
  const onCheck = (state) => {
  setTempSelectedMembers([...state.selectedRows]);

    var row='';
  if (state.selectedRows.length===0){

  } else{
    for(var i=0;i<state.selectedRows.length;i++){
      row +=`<tr>
              <td>${state.selectedRows[i].employee_id}</td>
              <td>${state.selectedRows[i].first_name}</td>
               <td>${state.selectedRows[i].identity_number}</td>
               <td> 
                  <input style={{textAlign:'right'}}  type="text" value='${state.selectedRows[i].daily_money_regular}'>
               </td>
                <td>
                  <select name="cars" id="cars">
                  <option value="members">Anggota</option>
                  <option value="pic">PIC</option>
                </select> 
                 </td>
               </tr>
      `
    }
    $("#data-members").html(row);

    }
    console.log("\n")
  //} 


    
  };

  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: 'Nama',
        field: 'first_name',
        width: 150,
        attributes: {
          'aria-controls': 'DataTable',
          'aria-label': 'Name',
        },
      },
      {
        label: 'Id Pegawai',
        field: 'employee_id',
        width: 270,
      },
      {
        label: 'KTP',
        field: 'identity_number',
        width: 200,
      },
      {
        label: 'Uang Harian',
        field: 'daily_money_regular',
        sort: 'asc',
        right:true,
        width: 100,
      },
     
    ],
    rows: tempsIsLoadinAddMembers==false?[
      {
        firs_name: 'Tiger Nixon',
        position: 'System Architect',
        office: 'Edinburgh',
        age: '61',
        date: '2011/04/25',
        salary: '$320',
      },
      {
        firs_name: 'Garrett Winters',
        position: 'Accountant',
        office: 'Tokyo',
        age: '63',
        date: '2011/07/25',
        salary: '$170',
      },
      {
        firs_name: 'Ashton Cox',
        position: 'Junior Technical Author',
        office: 'San Francisco',
        age: '66',
        date: '2009/01/12',
        salary: '$86',
      },
      {
        first_name: 'Cedric Kelly',
        position: 'Senior Javascript Developer',
        office: 'Edinburgh',
        age: '22',
        date: '2012/03/29',
        salary: '$433',
      },
      {
        first_name: 'Airi Satou',
        position: 'Accountant',
        office: 'Tokyo',
        age: '33',
        date: '2008/11/28',
        salary: '$162',
      },
     
  
    ]:employess

  })



  
 
  return (
      
    <div>
    <Projects id={props.match.params.id} ></Projects>
    {/* //menu */}
        <div class="pills-regular">
            <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">

                <li class="nav-item" id="members">
                    <button class="nav-link active" onClick={()=>membersPage()}  > Anggota</button>
                 </li>&ensp;

                <li class="nav-item" id="budgets" to="/projects/manage">
                    <button class="nav-link" onClick={()=>budgetsPage()} > Anggaran</button>
                 </li>&ensp;

                 <li class="nav-item" id="tasks">
                     <button class="nav-link" onClick={()=>tasksPage()} > Tugas</button>
                </li>&ensp;

                <li class="nav-item" id="approval" >
                        <button class="nav-link" onClick={()=>approvalPage()}  > Persetujuan</button>
                 </li>&ensp;
            </ul>
        </div>

     

        {/* Members */}
        <CCard>
            <CCardHeader>
                <div style={{float:'right',width:'100%'}}>
                    <div style={{float:'left',position:'absolute'}}>
                        <span>
                            <strong>
                                Anggota Project
                            </strong>
                        </span>
                    </div>
                    <div  style={{textAlign: 'right'}}>
                      <CButton disabled={tempsIsLoadinAddMembers} onClick={()=>setModalMembers(!modalMembers)} size="sm"  className="btn-brand mr-1 mb-1" color='primary'>
                        <span> 
                          {tempsIsLoadinAddMembers?<i class="fas fa-circle-notch fa-spin"/>:<i class="fa fa-plus"/>} Tambah
                          </span>
                      </CButton> 
                  </div>
                                    
                </div>
            </CCardHeader>
            <CCardBody>
                {tempMembers==''?
                    <div style={{textAlign:'center'}}>
                        <img 
                            src="https://arenzha.s3.ap-southeast-1.amazonaws.com/photos/default-photo.png"
                            alt="new"
                            style={{width:'10%',height:'10%'}}
                        />
                         <br/>
                          <span>Belum ada anggota Project</span>
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
               
                  style                
                  onSelectedRowsChange={onCheck}
                           
               /> 
{/*               
              <MDBDataTableV5
                    hover
                    entriesOptions={[5, 20, 25]}
                    entries={5}
                    pagesAmount={4}
                    data={datatable}
                    checkbox
                    headCheckboxID='id41'
                    bodyCheckboxID='checkboxes41'
                    getValueCheckboxes={(e) => {
                      onCheck(e);
                    }}
                    getValueAllCheckBoxes={(e) => {
                      onCheck(e);
                    }}
                    multipleCheckboxes
                
                    filledCheckboxes
                    proSelect
                  
                 
              />
               */}
                          

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
                //  <DataTable
                // className="use-datatable"      
                // columns={columns_selected_members}        
                // data={tempSelectedMembers} 
                // highlightOnHover
                // pagination
                // paginationServer
                           
                // paginationComponentOptions={{
                //   noRowsPerPage: true
                // }}

                <table tyle={{width:'100%'}} class="table table-striped"  id="use-datatable">
                  <thead s>
                    <tr>
                    <th>
                        Id Pegawai
                      </th>
                      <th>
                        Nama
                      </th>
                      <th>
                        KTP
                      </th>
                      <th>
                        Uang Harian
                      </th>
                      <th>
                        Status
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody id="data-members">

                
                  </tbody>

                </table>
                                
             
        
                }
              </CModalBody>
              <CModalFooter>


                {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
                <div  style={{textAlign: 'right'}}>
                    <CButton onClick={()=>saveMembers()} size="sm"   className="btn-brand mr-1 mb-1" color='primary'>
                    <span><i class="fa fa-save"/> Simpan</span>
                      </CButton> 
              </div>


              </CModalFooter>
            </CModal>

        </CCard>
  </div>
   
  )
}
export default Members;



