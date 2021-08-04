import React,{ useState,useEffect,useMemo }  from 'react'
import Swal from 'sweetalert2'
import DataTable from "react-data-table-component";
import axios from 'axios'
import FilterComponent from "src/views/base/components/FilterComponent";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip
} from '@coreui/react'




function Manage(){

  const columns = [  
    {
      name: 'Nama Akun',
      sortable: true,    
      cell: row => <div style={{width:'100%'}}  
      data-tag="allowRowEvents"><div >
      {row.bank_name}</div></div>, 
     }, 
    {
      name: 'No. Rekening',
      sortable: true,    
      cell: row => <div data-tag="allowRowEvents"><div >{row.account_number}</div></div>,  
    },                 
    {
      name: 'Saldo',
      sortable: true,   
      cell: row => <div data-tag="allowRowEvents"><div >{"IDR " +row.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}</div></div>,  
    },

    {
      name: 'Aksi',
      sortable: true,   
      center:true,
      cell: row => 
      <div data-tag="allowRowEvents"><div>
      <CTooltip content="Edit Akun"placement="top">
          <CButton color="secondary"  size="sm" to= {`/account/edit/${row.id}`}>{<i class="fa fa-edit"></i>}</CButton>
        </CTooltip>
        &ensp;
        <CTooltip content="Delete Akun"placement="top">
          <CButton color="secondary" size="sm"  onClick={()=>deleteAccount(row.id)}>{<i class="fa fa-trash"></i>}</CButton> 
        </CTooltip>
        &ensp;
        <CTooltip content="Lihat Transaksi."placement="top">
          <CButton to= {`/account/detail/${row.id}`} color="secondary"size="sm" >{<i class="fa fa-eye"></i>}</CButton>  
        </CTooltip>


      </div></div>,
     },
  ];

    const [accounts,setAccounts]=useState([]); 


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
           
                    console.log('rww',response.data);
                   
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
          getDataAccounts();
         
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Akun berhasil dihapus',
                timer:2000,
                showConfirmButton:false
            }).then((result) => {
                if (result.isConfirmed) {
                  console.log("delete berhasil")
                 
                   // window.location.href = '/leave';
                }
            })
        }

    })
    }

  
  const getDataAccounts=()=>{
  

    axios.get("http://localhost:3000/api/accounts")
    .then((response)=>{
      setAccounts([...response.data.data])
      console.log("masuk")

    })
    .catch((error)=>{
      console.log(error);
    })

  }

  useEffect(() => {
    getDataAccounts();
    
  },[]);


  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );


  
  const filteredItems = accounts.filter(
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
      {/* <Table data={accounts}  /> */}
      <DataTable
     
     columns={columns}
     data={filteredItems}
     defaultSortField="name"
     pagination
     subHeader
     subHeaderComponent={subHeaderComponent}
   
   />
      </CCardBody>
    </CCard>
  </div>
   
  )
}

export default Manage;
