import React,{ useEffect, useState }  from 'react'
import { Formik } from 'formik';
import Swal from 'sweetalert2'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import Select from 'react-select';
import {getAllPIC} from './data/pic'
import $ from 'jquery'

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
} from '@coreui/react'





function Create(){

  const [id,setId]=useState();
  const [tempIsloading,setTempIsloading]=useState(false);
  const [position,setPosition]=useState();
  const [email,setEmail]=useState();
  const [pic,setPIC]=useState([])
  //variable push page
  const navigator = useHistory();

  var dateFormat = require('dateformat');


   //masking 
   $(document).on('input', '#opening_balance', function(e) {
    e.preventDefault();
    var objek=$('#opening_balance').val();
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
    $('#opening_balance').val(c)
   });


 
  const onSelected = (selectedOptions) => {
    setId(selectedOptions['value'])
    setPosition(selectedOptions['position'])
    setEmail(selectedOptions['email'])     
  }


    useEffect(()=>{
        const options=[];
        getAllPIC().then((response=>{
            // eslint-disable-next-line array-callback-return
            response.data.map((values)=>{
                var data={value:values.id_event,label:values.pic_name,position:values.jabatan,email:values.email}
                options.push(data);

            })
            console.log(options)
            setPIC([...options])
          
        }))
       

    },[])
  return (
    <div>
    <CCard>
      <CCardHeader>
        <span><strong>Buat PIC TB</strong></span>
      </CCardHeader>
      <CCardBody>
      <Formik
      initialValues={{ 
        opening_balance:'',
      
  
      }}
      validate={values => {
        const errors = {};
       
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTempIsloading(true);
     

       
        const data = { 
            pic_id:id,
            opening_balance:values.opening_balance.replace(/[^\w\s]/gi, ''),
            balance:values.opening_balance.replace(/[^\w\s]/gi, ''),
            description:"Saldo awal",
            type:'in',
            amount:values.opening_balance.replace(/[^\w\s]/gi, ''),
            date:dateFormat(Date.now(),'yyyy-mm-dd'),
            id_faktur:''
        };

       
    
        
       axios.post('http://localhost:3000/api/pic/create-pictb',data)
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
           // setTempIsloading(false)
           // setIsloading(false);
           setTempIsloading(false)
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
                      <CCol xs="6">
                        <CFormGroup>
                            <CLabel htmlFor="type">Nama PIC</CLabel>
                            <Select
                                onChange={onSelected}                       
                                className="basic-single"
                                classNamePrefix="select"                     
                                options={pic}
                                name="color"/>    
                        </CFormGroup>
                 </CCol>             
                <CCol xs="6">
                    <CFormGroup>
                        <CLabel >Jabatan</CLabel>
                        <CInput required  onChange={handleChange}  value={position} />
                    </CFormGroup>
                 </CCol> 
                  
                 <CCol xs="6">
                    <CFormGroup>
                        <CLabel >Email</CLabel>
                        <CInput required  type="email"  onChange={handleChange}  value={email} />
                    </CFormGroup>
                 </CCol>  
                 <CCol xs="6">
                    <CFormGroup>
                        <CLabel htmlFor="opening_balance">Saldo Awal</CLabel>
                        <CInput required  style={{textAlign:'right'}} id="opening_balance" name="opening_balance" onChange={handleChange}  value={values.opening_balance} />
                    </CFormGroup>
                 </CCol>  

                 <br/>                 
              <CCardFooter>
              <div  style={{textAlign: 'right'}}>
                  <CButton to="/account/manage"   size="sm col-1" className="btn-secondary btn-brand mr-1 mb-1">Kembali</CButton>
                  <CButton disabled={tempIsloading} type="submit" size="sm col-1"  className="btn-brand mr-1 mb-1" color='primary'>
                 { tempIsloading? <i class="spinner-border"></i>: <span className="mfs-2">Simpan</span>}
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

export default Create;
