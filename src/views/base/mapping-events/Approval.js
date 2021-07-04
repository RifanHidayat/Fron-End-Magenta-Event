import React,{ useState,useEffect }  from 'react'

import {
  CCard,
  CCardBody,

  CCardHeader,

} from '@coreui/react'




function Approval(){

  return (
      
    <div>
    {/* //menu */}
        <div class="pills-regular">
             <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">

                <li class="nav-item" id="members">
                    <button class="nav-link" to="mapping/members" > Anggota</button>
                 </li>&ensp;

                <li class="nav-item" id="budgets">
                    <button class="nav-link" to="mapping/budgets" > Anggaran</button>
                 </li>&ensp;

                 <li class="nav-item" id="tasks">
                     <button class="nav-link" to="mapping/tasks" > Tugas</button>
                </li>&ensp;

                <li class="nav-item" id="approval" >
                        <button class="nav-link active" > Persetujuan</button>
                 </li>&ensp;
            </ul>
        </div>
        <CCard>
            <CCardHeader>
                <div>
                    <span><strong>Daftar Tugas Project</strong></span>  
                </div>
            </CCardHeader>
            <CCardBody>
            
            </CCardBody>
         </CCard>
  </div>
   
  )
}
export default Approval;