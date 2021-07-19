import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios'
import Swal from 'sweetalert2'
import FilterComponent from "src/views/base/components/FilterComponent";
import CIcon from '@coreui/icons-react'
import  {BsThreeDots} from 'react-icons/bs'
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CTooltip,
  CButton
  
} from '@coreui/react'
import { Height } from "@material-ui/icons";

const Table = props => {
    const columns = [

        {
            name: "Name",
            selector: "name",
            sortable: true,
            width:'15%',
            filterable: true,
            cell:row=><span>{row.name}</span>
          },
    
          {
            name: "Jabatan",
            selector: "position",
            sortable: true,
            width:'15%',
            cell: row => row.position
          },
          {
            name: "email",
            selector: "email",
            sortable: true,
            width:'20%',
            cell : row=>row.email
    
          },
          {
            name: "Saldo Awal",
            selector: "openin_balance",
            sortable: true,
            width:'15%',
            cell: row=> <span> IDR {row.opening_balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}</span>
            
          },
          {
            name: "Saldo",
            selector: "balance",
            sortable: true,
            width:'15%',
            cell: row=> <span> IDR {row.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}</span>
          },
          {
            name: "Aksi",
            selector: "",
            sortable: true,
            width:'15%',
           
            cell:row=>
            <div style={{float:'left',width:'250%'}}>
                  <CTooltip content="Edit PIC TB"placement="top">
            <CButton color="secondary"  size="sm" to= {`/pictb/edit/${row.id}`}>{<i class="fa fa-edit"></i>}</CButton>
            </CTooltip>
          
            &ensp;
            <CTooltip content="Hapus PIC TB"placement="top">
            <CButton color="secondary" size="sm"  onClick={()=>deletePIC(row.id)}>{<i class="fa fa-trash"></i>}</CButton>  
            </CTooltip>  
           
             
            
          <div style={{textAlign:'right', marginLeft:'70px',width:'30px' ,marginTop:'-35px'}}>
      
            
            <CDropdown  color="secondary" >
            <CDropdownToggle  caret={false} color="transparant" >
              {/* <CIcon name="cil-settings" color={'black'}/> */}
              <BsThreeDots style={{backgroundColor:'secondary',width:'30px',height:'30px',borderRadius:'1px'}} />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="left-end">
              <CDropdownItem  to={`/pictb/in-transaction/${row.id}`}>IN OUT Transaksi</CDropdownItem>
              <CDropdownItem to={`/pictb/transaction-pictb/${row.id}`}>Rekap IN OUT Transaksi </CDropdownItem>
              <CDropdownItem>Tutup Project</CDropdownItem>
              </CDropdownMenu>
          </CDropdown>
            </div>
                 
      
            </div>
          },
        ];
    
    
    
        const deletePIC=(id)=>{
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
                return axios.delete('http://localhost:3000/api/pic/delete-pictb/'+id)
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
                    text: 'PIC TB berhasil dihapus',
                    showConfirmButton:false,
                    timer:2000
                }).then((result) => {
                    if (result.isConfirmed) {
                       // window.location.href = '/leave';
                    }
                })
            }
    
        })
        }
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );


  
  const filteredItems = props.data.filter(
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
    <DataTable
     
      columns={columns}
      data={filteredItems}
      defaultSortField="name"
      pagination
      subHeader
      subHeaderComponent={subHeaderComponent}
    
    />
  );
};

export default Table;
