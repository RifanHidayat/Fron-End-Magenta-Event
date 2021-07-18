import React,{ useState,useEffect }  from 'react'
import Table from "./components/DataTable";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'




function Manage(){
     
    const [accounts,setAccounts]=useState([]); 
  useEffect(() => {
    fetch('http://localhost:3000/api/accounts')
    .then((response)=>response.json())
    .then((json)=>{
      //projects=json['data'];
      setAccounts([...json['data']])
           
    });
  },[]);



  return (
    <div>
    <CCard>
      <CCardHeader>
          <div style={{float:'right',width:'100%'}}>
                    <div style={{float:'left',position:'absolute'}}>
                        <span>
                            <strong>
                                Data Akun
                            </strong>
                        </span>
                    </div>
                    <div style={{float:'right',}}>
                        <CButton size="sm" to="/account/create"  color='primary'>
                        <i className="fa fa-plus" ></i> <span>Tambah  </span>
                         </CButton>
                     
                    </div>
                                    
                </div>
      </CCardHeader>
      <CCardBody>
      <Table data={accounts}  />

      </CCardBody>
    </CCard>
  </div>
   
  )
}

export default Manage;
