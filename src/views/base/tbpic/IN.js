import React,{ useState,useEffect}  from 'react'

import Button from '@material-ui/core/Button';
import {getAllFaktur,getDetailPIC} from './data/pic'
import DeleteIcon from '@material-ui/icons/Delete';
import { Formik } from 'formik';
import Select from 'react-select'
import $ from 'jquery'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useHistory } from "react-router-dom";
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


  


function IN(props){

  const [faktur,setFakatur]=useState([])
  const [idFaktur,setIdFaktur]=useState();
  const [fakturNumber,setFakturNumber]=useState();
  const [projectNumber,setProjectNumber]=useState()
  const [picEvent,setPicEvent]=useState()
  const [idPicEvent,setIdPicEvent]=useState();
  const [descriptionProject,setDescrionProject]=useState()
  const [nameTb,setNameTb]=useState()
  const [projectId,setProjectId]=useState()
  const [totalFaktur,setTotalFaktur]=useState(0)
  const [poNumber,setPoNumber]=useState()
  const [balanceTb,setBalanceTB]=useState();
  const [disabledButtond,setTempDisableButton]=useState();
  const [totalProject,setTotalProject]=useState()
  //loading spinner
  const [tempIsLoading,setTempisLoading]=useState()

    //variable push page
  const navigator = useHistory();



  //masking 
  $(document).on('input', '#total_project_cost', function(e) {
    e.preventDefault();
    var objek=$('#total_project_cost').val();
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
    $('#total_project_cost').val(c)
   });



  const onSelected = (selectedOptions) => {
    setIdFaktur(selectedOptions.value)
    setFakturNumber(selectedOptions.setFakturNumber)
    setPicEvent(selectedOptions.pic)
    setIdPicEvent(selectedOptions.setIdPicEvent)
    setProjectId(selectedOptions.projectId)
    setProjectNumber(selectedOptions.project_number)
    setDescrionProject(selectedOptions.project_description)
    setPoNumber(selectedOptions.po_number)
    setTotalFaktur(selectedOptions.total_faktur)
    $('#total_project_cost').val(selectedOptions.total_project_cost.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
    setTotalProject(selectedOptions.total_project_cost)

      
    
  }
  useEffect(()=>{
    var id=props.match.params.id;
    getAllFaktur().then((response)=>{
      const options=[];   
      response.data.map((data)=>{
        var option={value:data.id_faktur,label:data.faktur_number,total_faktur:data.total_faktur,po_number:data.po_number,pic:data.pic_event,pic_id:data.id_pic_event,customer:data.event_customer,project_id:data.project_id,project_number:data.project_number,project_description:data.description,total_project_cost:data.total_project_cost}
        options.push(option)
      })
      setFakatur([...options])
    
      //get detail pic
      getDetailPIC(id).then((response)=>{      
        setBalanceTB(response.data.balance)
        setNameTb(response.data.name)
      })
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

              <li class="nav-item active" id="members">
              <Button
                variant="contained"
               color="primary"
                onClick={()=>pageCashIN()}
                >
                IN
             </Button>
               </li>&ensp;
              <li class="nav-item" id="budgets" to="/projects/manage">

              {/* cash out by Ralf Schmitzer from the Noun Project */}
              <Button
                variant="contained"
             
                onClick={()=>pageCashOut()}
                >
                OUT 
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
                              Transaksi In
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
       total_project_cost:'',
        in_date:''
      
  
      }}
      validate={values => {

      }}
      onSubmit={(values, { setSubmitting }) => {
        setTempisLoading(true)   
        let id=props.match.params.id;  
        const data = { 
        id_faktur:idFaktur,
        description:descriptionProject,
        date:values.in_date,
        amount:values.total_project_cost===''?totalProject:values.total_project_cost.replace(/[^\w\s]/gi, ''),
        type:'out',
        id_pictb:id 
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
            setTempisLoading(false)
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
         <CFormGroup row>
                    <CCol xs="3">
                        <CFormGroup>
                            <CLabel htmlFor="type">No. Invoice</CLabel>
                            <Select    
                                onChange={onSelected}                            
                                className="basic-single"
                                classNamePrefix="select" 
                                options={faktur}      
                                value={faktur}                                  
                                name="color"/>    
                        </CFormGroup>
                 </CCol> 
                 </CFormGroup>  
                 <CFormGroup row>
                 <CCol xs="3">
                   
                   <CFormGroup>
                       <CLabel >No PO</CLabel>
                       <CInput readOnly required  onChange={handleChange}  value={poNumber}  />
                   </CFormGroup>
                </CCol> 
                <CCol xs="3">    
                    <CFormGroup>
                        <CLabel >PIC Event</CLabel>
                        <CInput readOnly   required  onChange={handleChange}  value={picEvent}  />
                    </CFormGroup>
                 </CCol> 
                 <CCol xs="3">    
                 
                    <CFormGroup>
                 <CLabel >Total Faktur</CLabel>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>IDR</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput readOnly  required  style={{textAlign:'right'}}   onChange={handleChange} value={parseInt(totalFaktur).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}   />                                
                  </CInputGroup>
                </CFormGroup>

                 </CCol> 
                 <CCol xs="3">                                                   
                   <CFormGroup>
                 <CLabel >Saldo TB</CLabel>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>IDR</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput readOnly  style={{textAlign:'right'}}    required  onChange={handleChange} value={parseInt(balanceTb).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}    />                                 
                  </CInputGroup>
                </CFormGroup>

                </CCol> 
               

                <CCol xs="3">                 
                   <CFormGroup>
                       <CLabel >No Project</CLabel>
                       <CInput readOnly  required  onChange={handleChange} value={projectNumber}   />
                   </CFormGroup>
                </CCol> 
                <CCol xs="3">
                   
                    <CFormGroup>
                        <CLabel >Deskripsi </CLabel>
                        <CInput readOnly  required  onChange={handleChange}  value={descriptionProject}  />
                    </CFormGroup>
                 </CCol> 
                 <CCol xs="3">
                   
                   <CFormGroup>
                       <CLabel >Tanggal In</CLabel>
                       <CInput id="in_date" name="in_date" type='date' required  onChange={handleChange}   />
                   </CFormGroup>
                </CCol> 
                <CCol xs="3">
                <CFormGroup>
                 <CLabel htmlFor="total_project_cost">Jumlah</CLabel>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>IDR</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput required  style={{textAlign:'right'}} id="total_project_cost" name="total_project_cost" onChange={handleChange}  value={values.opening_balance} />               
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

export default IN;
