import React,{ useState,useEffect,useRef,useMemo}  from 'react'

import Button from '@material-ui/core/Button';
import {getAllPICTB,getAllProjets,getDetailPIC,DataOutTransactions} from './data/pic'
import DataTable from "react-data-table-component";
import { Formik} from 'formik';
import Select from 'react-select'
import $ from 'jquery'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useHistory } from "react-router-dom";
import Table from "./components/DTOuttransaction";
import FilterComponent from "src/views/base/components/FilterComponent";


import Alert from '@material-ui/lab/Alert';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CFormGroup,
  CLabel,
  CCol,
  CInput,CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CTooltip
} from '@coreui/react'


  


function OUT(props){
  var dateFormat=require('dateformat')

  const columns = [

    {
        name: "Nama PICTB/ No. Project",      
        sortable: true,
        width:'20%',
        filterable: true,
        cell:row=><span>{row.label}</span>
      },

      {
        name: "Keterangan",
       
        sortable: true,
        width:'15%',
        cell: row => row.project_id!==0?" Laba Rugi project":"PIC Tb Pindahan"
      },
      {
        name: "Tanggal",
    
        sortable: true,
        width:'15%',
        cell: row=> dateFormat(row.date,'dd/mm/yyyy')

      },
      {
        name: "Deskripsi",
        
        sortable: true,
        width:'15%',
        cell: row=> row.description
        
      },
      
      {
        name: "Jumlah",
        
        sortable: true,
        width:'15%',
        cell: row=> <span> IDR {row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}</span>
      },
      {
        name: "Aksi",
        selector: "",
        sortable: true,
        width:'15%',
        center:true,
       
        cell:row=>
        <div>
              <CTooltip content="Edit PIC TB"placement="top">
        <CButton color="secondary"  size="sm" onClick={()=>editData(
          row.id,
         row.project_id,
         row.pictb_id,
         row.label,
         row.description,
         row.date,
         row.amount
        )}>{<i class="fa fa-edit"></i>}</CButton>
        </CTooltip>
      
        &ensp;
        <CTooltip content="Hapus PIC TB"placement="top">
        <CButton color="secondary" size="sm"  onClick={()=>deleteData(row.id,row.project_id,row.pictb_id)}>{<i class="fa fa-trash"></i>}</CButton>  
        </CTooltip>  
        </div>
      },
    ];



    const [projects,setProjects]=useState([])
    const [pictb,setPicTb]=useState([])
    const [nameTb,setNameTb]=useState([])
    const [projectID,setProjectID]=useState(0)
    const [pictbID,setPictbID]=useState(0)
    const selectProjectRef = useRef();
    const selectPicTbRef=useRef();
    const [valuePictb,setValuePictb]=useState();
    const [valueProject,setValueproject]=useState();
    const [dataOutTransactions,setDataOutTransactions]=useState([])
    const [label,setLbael]=useState()
    const [tempIsloadingOutTransaction,settempIsloadingOutTransaction]=useState(true);
    const [idOutTransaction,setIdOutTransaction]=useState("")
    const [tempIsLoading,setTempisLoading]=useState(false)
    const [isDisabledInvoice,setIsDisabledInvoice]=useState(false)
    const [balanceTb,setBalanceTB]=useState(0);

  



    //variable push page
    const navigator = useHistory();



  //masking 
  $(document).on('input', '#out_amount', function(e) {
    e.preventDefault();
    var objek=$('#out_amount').val();
    var separator = ".";
    var a = objek;
    var b = a.replace(/[^\d]/g,"")
    var c = "";
    var panjang = b.length; 
    var j = 0; 
    for (var i = panjang; i > 0; i--) {
      j = j + 1;
      if (((j % 3) == 1) && (j != 1)) {
        c = b.substr(i-1,1) + separator + c;
      } else {
        c = b.substr(i-1,1) + c;
      }
    }
    $('#out_amount').val(c)
   });



  const onSelectedProjects = (selectedOptions) => {
   setValueproject(selectedOptions)
  
   setValuePictb(null)
   setProjectID(selectedOptions.value)
   setPictbID(0)
   setLbael(selectedOptions.label)
   console.log(selectedOptions)
  
  }


  const onSelectedPicTB = (selectedOptions) => {
    setValueproject(null)
    setValuePictb(selectedOptions)
    setPictbID(selectedOptions.value)
    setProjectID(0) 
    setLbael(selectedOptions.label)
}

const getAllOutTransactions=()=>{
  let id=props.match.params.id;
  DataOutTransactions(id).then((response)=>{
    //  console.log(response.data)
      setDataOutTransactions([...response.data])
      settempIsloadingOutTransaction(false)
      
      
    })
}
const balancePIC=()=>{
  var id=props.match.params.id;
   //get detail pic
   getDetailPIC(id).then((response)=>{      
    setBalanceTB(response.data.balance)
    setNameTb(response.data.name)
    
  })

}
  useEffect(()=>{
    //$('#out_amount').val("33")
    var id=props.match.params.id;
    var option_projects=[]
    var option_pictb=[]
    getAllOutTransactions()
    
    getAllProjets().then((response)=>{
        response.data.map((value)=>{
            var data={value:value.id,label:value.project_number}
            option_projects.push(data)
        })
        setProjects(option_projects)
    })


    getAllPICTB().then((response)=>{
        response.data.map((value)=>{
        if (value.id!=id){
          var data={value:value.id,label:value.name}
          option_pictb.push(data)

        }
           
        })
        setPicTb(option_pictb)
    })

    balancePIC()



    

  },[])

  function pageCashIN(){
    navigator.push(`/pictb/in-transaction/${props.match.params.id}`)

  }
  function pageCashOut(){
    navigator.push(`/pictb/out-transaction/${props.match.params.id}`)

  }

  const editData=(
    id,
    project_id,
  pictb_id,
  label,
  description,
  date,
  amount
)=>{
  
  setIsDisabledInvoice(true)
setIdOutTransaction(id)
var option_edit_project={value:project_id,label:label}
var option_edit_pic={value:pictb_id,label:label}
if (project_id!==0){
  setValueproject(option_edit_project)
  setValuePictb(null)
  setProjectID(project_id)
  setPictbID(0)

}else{
  setValuePictb(option_edit_pic)
  setValueproject(null)
  setProjectID(0)
  setPictbID(pictb_id)

}
//setvalue(option_edit)
$('#out_amount').val(amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
$('#description').val(description)

$('#out_date').val(dateFormat(date,'yyyy-mm-dd'))


}
const backToSave=()=>{
  setProjectID(0)
  setPictbID(0)
  setIdOutTransaction("")
  setIsDisabledInvoice(false)
  setTempisLoading(false)
  setValuePictb(null)
  setValueproject(null)
  $('#description').val("")
$('#out_amount').val("")
$('#out_date').val("")
 
   
}
  const deleteData=(id,project_id,pictb_id)=>{
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: "PIC TB akan dihapus",
      icon: 'warning',
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',    
      showLoaderOnConfirm: true,
      preConfirm: () => {
          return axios.delete('http://localhost:3000/api/transactions/out/'+id+'/'+project_id+'/'+pictb_id)
              .then(function(response) {
                  console.log(response.data);
              })
              .catch(function(error) {
                  console.log(error.data);
                  Swal.fire({
                      icon: 'error',
                      title: 'Oops',
                      text: 'Terjadi Kesalahan',
                  })
              });
      },
      allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    getAllOutTransactions();
    balancePIC();
      if (result.isConfirmed) {
          Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Transaksi Out Berhasil dihapus',
              showConfirmButton:false,
              timer:2000
          }).then((result) => {
              if (result.isConfirmed) {
                balancePIC();
              

                 // window.location.href = '/leave';
                // getAllOutTransactions()
              }
          })
      }

  })
  }
  
const [filterText, setFilterText] = React.useState("");
const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
false
);



const filteredItems = dataOutTransactions.filter(
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
          <div class="pills-regular">
          <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">

              <li class="nav-item" id="members">
              <Button
                variant="contained"
                onClick={()=>pageCashIN()}
                >
                In
             </Button>
               </li>&ensp;
              <li class="nav-item" id="budgets" to="/projects/manage">

              {/* cash out by Ralf Schmitzer from the Noun Project */}
              <Button
                variant="contained"
                onClick={()=>pageCashOut()}
                color="primary"
               
                // startIcon={<DeleteIcon />}
                >
                Out
            </Button>
               </li>&ensp;
          </ul>
      </div>
    <CCard>
      <CCardHeader>
          <div style={{float:'right',width:'100%'}}>
                    <div style={{float:'left',position:'absolute'}}>
                        <span>
                            <strong>
                              Transaksi Out
                            </strong>
                        </span>
                    </div>
                    <div style={{float:'right',}}>
                        <span>
                            <strong>
                             TB: {nameTb}
                            </strong>
                        </span>
                     
                    </div>
                                    
                </div>
      </CCardHeader>
      <CCardBody>

      <Formik
      initialValues={{ 
     //  out_amount:'',
       out_date:'',
       description:''

      
  
      }}
      validate={values => {

      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values.description)
       
        setTempisLoading(true)
       
        var id_pictb=props.match.params.id;
        const data = {     
          description:$('#description').val(),
          date:values.out_date===''?$('#out_date').val():values.out_date,
          amount:$('#out_amount').val().replace(/[^\w\s]/gi, ''),
          pictb_id:pictbID,
          project_id:projectID,
          pictb_id_owner:id_pictb,
          label:label,
          pictb_id_source:props.match.params.id
          };
        

        if ((projectID!=0) || (pictbID!=0)){

            if (idOutTransaction===''){
              axios.post('http://localhost:3000/api/transactions/out',data)
              .then(response => {

                Swal.fire({
                  title: 'success',
                  text: "Berhasil menambahkan transaksi",
                  icon: 'success',
                  timer:2000,
                  showConfirmButton:false,
                }).then(_=>{
                  setTempisLoading(false)
                  getAllOutTransactions()
                  balancePIC();
                  backToSave()
                });
                
              })
              .catch(error => {
                  
                  console.error('There was an error!', error);
                
              });


            }else{
              axios.patch('http://localhost:3000/api/transactions/out/'+idOutTransaction+'/'+projectID+'/'+pictbID,data)
              .then(response => {
                

                Swal.fire({
                  title: 'success',
                  text: "Berhasil mengubah transaksi",
                  icon: 'success',
                  timer:2000,
                  showConfirmButton:false,
                }).then(_=>{
                  setTempisLoading(false)
                  getAllOutTransactions()
                  balancePIC();
                  backToSave()
                });
                
              })
              .catch(error => {
                  
                  console.error('There was an error!', error);
                
              });


            }
              
            

        }else{
          
          console.log("tes")

        }


    
      }}
    >     
      
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      })=> (
        <form onSubmit={handleSubmit} autoComplete="off">  
           <Alert severity="info">Pilih Salah satu No Porject atau PIC pindahan</Alert>
         <CFormGroup row>
                    <CCol xs="4">
                        <CFormGroup>
                            <CLabel htmlFor="type">No Project</CLabel>
                            <Select    
                                ref={selectProjectRef}
                                onChange={onSelectedProjects}                            
                                className="basic-single"
                                classNamePrefix="select" 
                                options={projects} 
                                value={valueProject} 
                                isDisabled={isDisabledInvoice}                                      
                                name="color"/>    
                        </CFormGroup>
                 </CCol> 
                 <CCol xs="4">
                        <CFormGroup>
                            <CLabel htmlFor="type">PIC TB (Pindahan)</CLabel>
                            <Select    
                                 ref={selectPicTbRef}
                                onChange={onSelectedPicTB}                            
                                className="basic-single"
                                classNamePrefix="select" 
                                options={pictb}  
                                value={valuePictb}     
                                isDisabled={isDisabledInvoice}                                 
                                name="color"/>    
                        </CFormGroup>
                 </CCol> 
                 <CCol xs="4">
                        <CFormGroup>
                            
                            <CFormGroup>
                            <CLabel >Saldo TB</CLabel>
                             <CInputGroup>
                             <CInputGroupPrepend>
                            <CInputGroupText>IDR</CInputGroupText>
                            </CInputGroupPrepend>
                                <CInput  style={{textAlign:'right'}}    required  onChange={handleChange} value={parseInt(balanceTb).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}    />                                 
                  </CInputGroup>
                </CFormGroup>  
                        </CFormGroup>
                 </CCol> 
                 </CFormGroup>  
                
                 <CFormGroup row>

                 <CCol xs="4">
                   
                   <CFormGroup>
                       <CLabel >Tanggal Out</CLabel>
                       <CInput id="out_date" name="out_date" type='date' required  onChange={handleChange}   />
                   </CFormGroup>
                </CCol> 

    
                <CCol xs="4">                  
                    <CFormGroup>
                        <CLabel  >Deskripsi </CLabel>
                        <CInput  id="description" name="description" required  onChange={handleChange}    />
                    </CFormGroup>
                 </CCol> 
                
                <CCol xs="4">
                <CFormGroup>
                 <CLabel htmlFor="out_amount">Jumlah</CLabel>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>IDR</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput required  style={{textAlign:'right'}} id="out_amount" name="out_amount" onChange={handleChange}   />               
                  </CInputGroup>
                </CFormGroup>             
                </CCol>      

                </CFormGroup>  
                <CCardFooter>
                {idOutTransaction===''?
                  <div  style={{textAlign: 'right'}}>                
                  <CButton to="/pictb/manage"   size="sm xs-1" className="btn-secondary btn-brand mr-1 mb-1">Kembali</CButton>
                  <CButton type="submit" disabled={tempIsLoading} size="sm xs-2"  className="btn-brand mr-1 mb-1" color='primary'>
                   {tempIsLoading===true? <i class="spinner-border"/>: <i class="fa fa-save"/>}<span className="mfs-1">Simpan</span>
                  </CButton>
                </div>
                :
                <div  style={{textAlign: 'right'}}>                
                <CButton onClick={()=>backToSave()}  size="sm xs-1" className="btn-secondary btn-brand mr-1 mb-1">X</CButton>
                <CButton type="submit" size="sm xs-1" disabled={tempIsLoading}  className="btn-brand mr-1 mb-1" color='primary'>
                {tempIsLoading===true?  <i class="spinner-border"/>: <i class="fa fa-edit"/>}<span className="mfs-2">Ubah</span>
                </CButton>
              </div>
                  
                }
              
              {/* <div  style={{textAlign: 'right'}}>
                  <CButton to="/pictb/manage"   size="sm col-1" className="btn-secondary btn-brand mr-1 mb-1">Kembali</CButton>
                  <CButton type="submit" size="sm col-1"  className="btn-brand mr-1 mb-1" color='primary'>
                   <span className="mfs-2">Simpan</span>
                  </CButton>
                  
                  {}      
              </div> */}
             </CCardFooter>           
        </form>
      )}
    </Formik>
     
        
      </CCardBody>
    </CCard>
   

    <CCard>
      <CCardHeader>
      <span>
              <strong>
                    Data Transaksi Out
              </strong>
      </span>
      </CCardHeader>
      <CCardBody>

      {tempIsloadingOutTransaction===false?
      <DataTable
     
      columns={columns}
      data={filteredItems}
      defaultSortField="name"
      pagination
      subHeader
      subHeaderComponent={subHeaderComponent}
      paginationPerPage={5}   
    
    />
      :
      <span></span>
      }       
      </CCardBody>
    </CCard>
  </div>
   
  )
}

export default OUT;
