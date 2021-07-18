import React,{ useState,useEffect }  from 'react'
import axios from 'axios'
import './css/style.css'
import { useHistory } from "react-router-dom";
import {Projects} from './components/Projects'
import $ from 'jquery'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MDBDataTableV5 } from 'mdbreact';


import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
} from '@coreui/react'
function Tasks(props){

    const [tempTask,setTempTasks]=useState([]);
    const [modalTasks,setModaltask]=useState(false);
    const [datatable, setDatatable] = React.useState({});
    const [status,setStatus]=useState()


    //loading spinner
    const [tempIsloadingTasks,setTempIsLoadingTask]=useState(false);
    const [tempIsloadingAddTasks,setTempIsLoadingAddTasks]=useState(true);
  
  

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

    const setDataTasks=(data)=>{
      setDatatable({
        columns: [
          {
            label: 'Nama Tugas',
            field: 'name',
            width: 270,
            attributes: {
              'aria-controls': 'DataTable',
              'aria-label': 'Name',
              
            },
          },
          {
            label: 'Status',
            field: 'status',
            width: '20%',
            attributes: {
              'aria-controls': 'DataTable',
              'aria-label': 'Name',  
            },
          },         
        ],
        rows: data
        
      })
    }
    
   

  
    useEffect(()=>{
      
   
      var employee_id=props.match.params.id;
      
        //get members
        axios.get("http://localhost:3000/api/projects/detail-project/"+employee_id).then((response)=>{
         if (response.data.data.tasks>0){
          
          setTempIsLoadingAddTasks(false)
          setTempTasks(response.data.data.tasks)
          setDataTasks(response.data.data.tasks)
          setStatus(response.data.data.status)
          response.data.data.tasks.map((value)=>updateRow(value.name))

         }else{
          setTempIsLoadingAddTasks(false)
          setTempTasks(response.data.data.tasks)
          setDataTasks(response.data.data.tasks)
          setStatus(response.data.data.status)
          setTempIsLoadingAddTasks(false)
         }
       
        })
        .then((error)=>{
          //setTempIsLoadingAddTasks(false)
          
        })    
   
      },[])


  //delete row
  $(document).on('click', '#delete-row', function(e) {
    e.preventDefault();
     var table=$('#use-datatable tbody tr');
     if (table.length<=1){
     }else{
       $(this).parent().parent().remove();
    
     }
   });

const addRow=()=>{
     
    var row='';
    row += '<tr>';
    row+='<td>';
    row+='<input required class="form-control"  id="nominal_budgets">';
    row+='</td>';
  
     
    row+='<th>';
    row+='<button type="button" class="btn btn-danger" id="delete-row"><i className="fa fa-plus"/>X</button>';
    row+='</th>';
    row+='</tr>';
    $('#use-datatable tbody').append(row); 
}
const updateRow=(taskName)=>{
     
  var row='';
  row += '<tr>';
  row+='<td>';
  row+='<input required class="form-control" value="'+taskName+'" >';
  row+='</td>';

   
  row+='<th>';
  row+='<button type="button" class="btn btn-danger" id="delete-row"><i className="fa fa-plus"/>X</button>';
  row+='</th>';
  row+='</tr>';
  $('#use-datatable tbody').append(row); 
}


const saveTasks=()=>{

  setTempIsLoadingTask(false)
  var project_id=props.match.params.id
  var task=[];
  var temp_tasks=[];
  $('#use-datatable tbody tr').each(function() {
    var name= $(this).find('td:nth-child(1) input').val().toString().trim();
    var status='in progress';
    var data_task=[name,status,project_id];
    var temp_task={name:name,status:status}
    task.push(data_task);  
    temp_tasks.push(temp_task)    
  });
  var data={
    data:task,
    id:project_id,
  }


  axios.post('http://localhost:3000/api/projects/create-tasks',data)
  .then((response)=>{
    console.log(response.data.data);
    setTempIsLoadingTask(false)
    setTempTasks(response.data.data)
    setModaltask(false)
    toast.success('Berhasil menambahkan tugas project', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      color:'success'
      });
      setDataTasks(temp_tasks)
  
  })
  .catch((error)=>{

  })

}

  
 
  return (
      
    <div>
        <ToastContainer />
       <Projects id={props.match.params.id} ></Projects>
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
                     <button class="nav-link active" onClick={()=>tasksPage()} > Tugas</button>
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
                                Tugas Project
                            </strong>
                        </span>
                    </div>
                    <div  style={{textAlign: 'right'}}>
                 
                      {status==='pending'?
                    
                      <CButton  size="sm"  className="btn-brand mr-1 mb-1" color='primary' onClick={()=>setModaltask(!modalTasks)} >
                       
                        {tempTask.length>0?<span> {tempIsloadingAddTasks?<i class="fas fa-circle-notch fa-spin"/>:<i class="fa fa-edit"/>} Ubah</span>:<span> {tempIsloadingAddTasks?<i class="fas fa-circle-notch fa-spin"/>:<i class="fa fa-plus"/>} Tambah</span>}
                      </CButton>:<p></p>
                      }
                      
                  </div>
                                    
                </div>
            </CCardHeader>
            <CCardBody>
                {tempTask==''?
                    <div style={{textAlign:'center'}}>
                        <img 
                            src="https://arenzha.s3.ap-southeast-1.amazonaws.com/eo/icons/tasks.png"
                            alt="new"
                            style={{width:'10%',height:'10%'}}
                        />
                         <br/>
                         <br/>
                          <span>Belum ada tugas project</span>
                    </div>

                :
                <MDBDataTableV5
                  hover
                  entriesOptions={[5, 20, 25]}
                  entries={5}
                  pagesAmount={10}
                  data={datatable}    
                  paging={false}
                  searchTop
                  searchBottom={false}
                  barReverse                                       
              />
                }
            
            </CCardBody>
           
                             {/* //modal members */}
          <CModal 
              show={modalTasks} 
              onClose={() => setModaltask(!modalTasks)}
              size="lg">
              <CModalHeader closeButton>
                <CModalTitle>Tuga Project</CModalTitle>
              </CModalHeader>
              <CModalBody>
              
              <table tyle={{width:'100%'}} class="table table-striped"  id="use-datatable">
                  <thead>
                    <tr>
                    <th>
                      Nama tugas
                      </th>
                     
                      <th style={{width:'25px'}}>
                      <button type="button" class="btn btn-primary" onClick={()=>addRow()}><i className="fa fa-plus"  /></button>
                      </th>                    
                    </tr>
                  </thead>
                  <tbody id="data-tasks">
                  </tbody>
                </table>  
              </CModalBody>
              <CModalFooter>

                {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
                <div  style={{textAlign: 'right'}}>
                    <CButton  size="sm" disabled={tempIsloadingTasks}   className="btn-brand mr-1 mb-1" color='primary' onClick={()=>saveTasks()}>
                    <span>{tempIsloadingTasks?<i class="fas fa-circle-notch fa-spin"/> :<i class="fa fa-save"/> } Simpan</span>
                    
                      </CButton> 
              </div>

              </CModalFooter>
            </CModal>
      

      
        </CCard>
  </div>
   
  )
}
export default Tasks;
