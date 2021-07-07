import React,{ useState,useEffect }  from 'react'
import { Formik } from 'formik';
import Swal from 'sweetalert2'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import Select from 'react-select';
import BeatLoader from "react-spinners/BeatLoader";

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


// const handleChange=(e)=> {
//   console.log("Fruit Selected!!");
//   this.setState({ fruit: e.target.value });
// }

function Edit(props){

  const [tempSelected,setTempSelected]=useState();
  const [tempIsloading,setTempIsloading]=useState(false);

  const [tempBankAccountName,setTempBankAccountName]=useState();
  const [tempBankAccountNumber,setTempBankAccountNumber]=useState();
  const [tempBankAccountBalance,setTempBankAccountBalance]=useState();
  const [mainLoading,setMainloading]=useState(true);
  const [tempIndexSelected,setTempIndexSelected]=useState(0);


  useEffect(() => {
    let id=props.match.params.id;
   
 
    //get data detail
    axios.get("http://localhost:3000/api/accounts/detail-account/"+id)
    .then((response)=>{
      console.log('detail project :',response)

      setTempBankAccountName(response.data.data.bank_name)
      setTempBankAccountNumber(response.data.data.account_number)
      setTempBankAccountBalance(response.data.data.account_balance)
      setTempSelected(response.data.data.type)
      //eo =1.metaprint=2,all =3
     if (response.data.data.type==='eo'){
         setTempIndexSelected(0)
     }else if(response.data.data.type==='metaprint'){
         setTempIndexSelected(1)

     }else if (response.data.data.type==='all'){
         setTempIndexSelected(2)
     }

      //laading false
      setMainloading(false)
    
    })

    .catch((error)=>{
      //loading false
      setMainloading(false)

    })
  }, []);




  //variable push page
  const navigator = useHistory();

 
  const onSelected = (selectedOptions) => {
    setTempSelected(selectedOptions['value'])
  }

  const options = [
    { value: 'eo', label: 'Event Organizer' },
    { value: 'metaprint', label: 'Metaprint' },
    { value: 'all', label: 'Semua' }
  ]  
  return (
    <div>
    {mainLoading===false?<CCard>
      <CCardHeader>
        <span><strong>Buat Akun</strong></span>
      </CCardHeader>
      <CCardBody>
      <Formik
      initialValues={{ 
        bank_account_name:tempBankAccountName,
        bank_account_number:tempBankAccountNumber,
        bank_account_owner:'',
        bank_account_balance:tempBankAccountBalance,
        type:'',
  
      }}
      validate={values => {
        const errors = {};
       
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        //setTempIsloading(true);
        var id=props.match.params.id;
        console.log('selectead:',tempSelected)
     

       
        const data = { 
            bank_account_name:values.bank_account_name,
            bank_account_number:values.bank_account_number,
            //bank_account_owner:values.bank_account_owner,
            bank_account_balance:values.bank_account_balance,
            type:tempSelected 
        };
    
        
       axios.patch('http://localhost:3000/api/accounts/edit-account/'+id,data)
        .then(response => {
          console.log(response);
          Swal.fire({
            title: 'success',
            text: 'Akun berhasil dibuat',
            icon: 'success',
            timer:2000,
            showConfirmButton:false,
          }).then(_=>{
            setTempIsloading(false)
           navigator.push('/account/manage');
           
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
                        <CLabel htmlFor="bank_account_name">Nama Akun</CLabel>
                        <CInput required id="bank_account_name" name="bank_account_name" onChange={handleChange}  value={values.bank_account_name} />
                    </CFormGroup>
                 </CCol> 
                 <CCol xs="6">
                    <CFormGroup>
                        <CLabel htmlFor="bank_account_number">No. Rekening</CLabel>
                        <CInput required id="bank_account_number" name="bank_account_number"  onChange={handleChange}  value={values.bank_account_number} />
                    </CFormGroup>
                 </CCol>  
                 <CCol xs="6">
                    <CFormGroup>
                        <CLabel htmlFor="bank_account_balance">Saldo bank</CLabel>
                        <CInput required  style={{textAlign:'right'}} id="bank_account_balance" name="bank_account_balance" onChange={handleChange}  value={values.bank_account_balance} />
                    </CFormGroup>
                 </CCol>  

                  <CCol xs="6">
                    <CFormGroup>
                        <CLabel htmlFor="type">Jenis Akun</CLabel>
                        <Select
                         
                            onChange={onSelected}   
                            defaultValue={options[tempIndexSelected]}                     
                            className="basic-single"
                            classNamePrefix="select"                     
                            options={options}
                            name="color"/>    
                    </CFormGroup>
                 </CCol> 
                 <br/> 

                                       
              <CCardFooter>
              <div  style={{textAlign: 'right'}}>
                  <CButton to="/account/manage"   size="sm col-1" className="btn-secondary btn-brand mr-1 mb-1"><span className="mfs-2">Kembali</span></CButton>
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
      </CCard>:<center><BeatLoader color={'blue'} loading={true}   size={20} /></center>}
 
  </div>
   
  )
}

export default Edit;
