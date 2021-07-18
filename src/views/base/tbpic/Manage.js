import React,{ useState,useEffect}  from 'react'


import Table from "./components/DataTable";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import {getAllPICTB} from './data/pictb'



function Manage(){
    const [pictb, setPictb] = useState([]);

  useEffect(() => {
  getAllPICTB().then((response)=>{
    
    setPictb([...response.data])
    console.log('saldo',response.data)

  })
      
  }, []);

  return (
    <div>
    <CCard>
      <CCardHeader>
          <div style={{float:'right',width:'100%'}}>
                    <div style={{float:'left',position:'absolute'}}>
                        <span>
                            <strong>
                                Data PIC TB
                            </strong>
                        </span>
                    </div>
                    <div style={{float:'right',}}>
                        <CButton size="sm" to="/pictb/create"  color='primary'>
                        <i className="fa fa-plus" ></i> <span>Tambah</span>
                         </CButton>
                     
                    </div>
                                    
                </div>
      </CCardHeader>
      <CCardBody>
      <Table data={pictb}  />
        
      </CCardBody>
    </CCard>
  </div>
   
  )
}

export default Manage;
