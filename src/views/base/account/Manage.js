import React,{ useState,useEffect }  from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import DataTable from 'react-data-table-component';
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
} from '@coreui/react'



var dateFormat = require("dateformat");


var projects=[];

const columns = [  
              {name: 'Nama Akun',sortable: true,    
              cell: row => <div style={{width:'100%'}}  
              data-tag="allowRowEvents"><div >
                {row.bank_name}</div></div>,  }, 

              {name: 'No. Rekening',sortable: true,    
              cell: row => <div data-tag="allowRowEvents">
                <div >{row.account_number}</div></div>,  },          

              {name: 'Saldo',sortable: true,   
               cell: row => <div data-tag="allowRowEvents">
                <div >{row.account_balance}</div></div>,  },
            
        
              {name: 'Aksi',sortable: true,   
               cell: row => <div data-tag="allowRowEvents"><div >
               <CButton color="secondary"  size="sm" to= {`/account/edit/${row.id}`}>
                 {<i class="fa fa-edit"></i>}</CButton>
                &ensp;<CButton color="secondary"  
                size="sm"  onClick={()=>deleteAccount(row.id)}>{<i class="fa fa-trash"></i>}</CButton>   
                 &ensp;<CButton color="secondary"  
                size="sm" >{<i class="fa fa-eye"></i>}</CButton>              
                </div></div>,  },
            ];


    const deleteAccount=(id)=>{
      Swal.fire({
        title: 'Apakah anda yakin?',
        text: "Akun akan dihapus",
        icon: 'warning',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',    
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return axios.delete('http://localhost:3000/api/accounts/delete-account/'+id)
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
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Akun berhasil dihapus',
                timer:2000,
                showConfirmButton:false
            }).then((result) => {
                if (result.isConfirmed) {
                   // window.location.href = '/leave';
                }
            })
        }

    })
    }

function Manage(){
    const [tempProjects, setTempProjects] = useState([]);   
    const [accounts,setAccounts]=useState([]); 
  useEffect(() => {
    fetch('http://localhost:3000/api/accounts')
    .then((response)=>response.json())
    .then((json)=>{
      //projects=json['data'];
      setAccounts([...json['data']])
      console.log('data',json['data']);
      console.log(accounts)      
    });
  }, []);



  return (
    <div>
    <CCard>
      <CCardHeader>
          <div style={{float:'right',width:'100%'}}>
                    <div style={{float:'left',position:'absolute'}}>
                        <span>
                            <strong>
                                Akun
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
      <DataTable       
      columns={columns}        
      data={accounts}        
      pagination  
      defaultSortFieldId
      sortable  
      pagination
      defaultSortFieldId
      sortable                      
      />    
      </CCardBody>
    </CCard>
  </div>
   
  )
}

export default Manage;
