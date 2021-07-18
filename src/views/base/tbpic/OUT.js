import React,{ useState,useEffect,useRef}  from 'react'

import Button from '@material-ui/core/Button';
import {getAllPICTB,getAllProjets,getDetailPIC} from './data/pic'
import DeleteIcon from '@material-ui/icons/Delete';
import { Formik, validateYupSchema } from 'formik';
import Select from 'react-select'
import $ from 'jquery'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useHistory } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
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
} from '@coreui/react'


  


function OUT(props){
    const [projects,setProjects]=useState([])
    const [pictb,setPicTb]=useState([])
    const [nameTb,setNameTb]=useState([])
    const [projectID,setProjectID]=useState(0)
    const [pictbID,setPictbID]=useState(0)

    const selectProjectRef = useRef();
    const selectPicTbRef=useRef();

    const [valuePictb,setValuePictb]=useState();
    const [valueProject,setValueproject]=useState();

    const [tempIsloading,setTempIsloading]=useState();
     



    //variable push page
  const navigator = useHistory();



  //masking 
  $(document).on('input', '#amount', function(e) {
    e.preventDefault();
    var objek=$('#amount').val();
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
    $('#amount').val(c)
   });



  const onSelectedProjects = (selectedOptions) => {
   setValueproject(selectedOptions)
   setValuePictb(null)
   setProjectID(selectedOptions.value)
   setPictbID(0)
  }


  const onSelectedPicTB = (selectedOptions) => {
    setValueproject(null)
    setValuePictb(selectedOptions)
    setPictbID(selectedOptions.value)
    setProjectID(0) 
}


  useEffect(()=>{
    var id=props.match.params.id;
    var option_projects=[]
    var option_pictb=[]
    
    getAllProjets().then((response)=>{
        response.data.map((value)=>{
            var data={value:value.id,label:value.project_number}
            option_projects.push(data)
        })
        setProjects(option_projects)
    })


    getAllPICTB().then((response)=>{
        response.data.map((value)=>{
            var data={value:value.id,label:value.name}
            option_pictb.push(data)
        })
        setPicTb(option_pictb)
    })



    getDetailPIC(id).then((response)=>{      
        setNameTb(response.data.name)
      })    

  },[])

  function pageCashIN(){
    navigator.push(`/pictb/in-transaction/${props.match.params.id}`)

  }
  function pageCashOut(){
    navigator.push(`/pictb/out-transaction/${props.match.params.id}`)

  }

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
       amount:'',
       out_date:'',
       description:''

      
  
      }}
      validate={values => {

      }}
      onSubmit={(values, { setSubmitting }) => {
        setTempIsloading(true)
        var id_pictb=props.match.params.id;
       

        if ((projectID!=0) || (pictbID!=0)){

          if (pictbID!=0){
           
            const data = { 
              id_faktur:"",
              description:values.description,
              date:values.out_date,
              amount:values.amount.replace(/[^\w\s]/gi, ''),
              type:'in',
              id_pictb:id_pictb
              };
              
             axios.post('http://localhost:3000/api/pic/create-transaction-pictb',data)
              .then(response => {

                Swal.fire({
                  title: 'success',
                  text: 'PIC TB berhasil dibuat',
                  icon: 'success',
                  timer:2000,
                  showConfirmButton:false,
                }).then(_=>{
                  setTempIsloading(false)
                 navigator.push('/pictb/manage');
      
                });
                
              })
              .catch(error => {
                  // this.setState({ errorMessage: error.message });
                  console.error('There was an error!', error);
                //  // setTempIsloading(false)
                //  // setIsloading(false);
                //  setTempIsloading(false)
              });

          }else{
            const data = { 
             
              description:values.description,
              date:values.out_date,
              amount:values.amount.replace(/[^\w\s]/gi, ''),
              type:'out',
              id:projectID
              };
              
            axios.post("http://localhost:3000/api/projects/create-transaction",data)
            .then((response)=>{
              Swal.fire({
                title: 'success',
                text: 'Berhasi menambahkan L/R Project',
                icon: 'success',
                timer:2000,
                showConfirmButton:false,
              }).then(_=>{
                setTempIsloading(false)
               navigator.push('/pictb/manage');
    
              });
               
    
                
            })
            .catch((error)=>{
    
            })
            
      


          }

        }else{
          
          

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
                                name="color"/>    
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
                 <CLabel htmlFor="amount">Jumlah</CLabel>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>IDR</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput required  style={{textAlign:'right'}} id="amount" name="amount" onChange={handleChange}  value={values.amount} />               
                  </CInputGroup>
                </CFormGroup>             
                </CCol>      

                </CFormGroup>  
                <CCardFooter>
              <div  style={{textAlign: 'right'}}>
                  <CButton to="/pictb/manage"   size="sm col-1" className="btn-secondary btn-brand mr-1 mb-1">Kembali</CButton>
                  <CButton type="submit" size="sm col-1"  className="btn-brand mr-1 mb-1" color='primary'>
                   <span className="mfs-2">Simpan</span>
                  </CButton>
                  
                  {}
 
       
              </div>
             </CCardFooter>           

        </form>
      )}
    </Formik>
     
        
      </CCardBody>
    </CCard>
  </div>
   
  )
}

export default OUT;
