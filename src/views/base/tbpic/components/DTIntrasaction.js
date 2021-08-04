import React, { useMemo,useState,useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios'
import Swal from 'sweetalert2'
import FilterComponent from "src/views/base/components/FilterComponent";
import {DataInTransactions} from '../data/pic'


import {

  CTooltip,
  CButton
  
} from '@coreui/react'
import { Height } from "@material-ui/icons";
var dateFormat=require('dateformat')

const Table = props => {
  const [data,setData]=useState([])
  const [dataInTransactions,setDataInTransactions]=useState([])

  

  function getData(){
    DataInTransactions().then((response)=>{
      setDataInTransactions([...response.data])
      console.log("data in",response.data)
  
    })
  
  }


  useEffect(()=>{
    //setData([...props.data])
    getData()
    
  })
  
    const columns = [

        {
            name: "No Invoie",
          
            sortable: true,
            width:'15%',
            filterable: true,
            cell:row=><span>{row.faktur_number}</span>
          },
    
          {
            name: "No Po",
           
            sortable: true,
            width:'15%',
            cell: row => row.po_number
          },
          {
            name: "No. Project",
        
            sortable: true,
            width:'15%',
            cell : row=>row.project_number
    
          },
          {
            name: "Descripsi",
            selector: "openin_balance",
            sortable: true,
            width:'15%',
            cell: row=> row.description
            
          },
          {
            name: "Tanggal",
            selector: "balance",
            sortable: true,
            width:'10%',
            cell: row=> dateFormat(row.date,'dd/mm/yyyy')
          },
          {
            name: "Jumlah",
            selector: "balance",
            sortable: true,
            width:'15%',
            cell: row=> <span> IDR {row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}</span>
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
                return axios.delete('http://localhost:3000/api/transactions/in/'+id)
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
                    text: 'Berhasil menghapus data transaksi',
                    showConfirmButton:false,
                    timer:2000
                }).then((result) => {
                    if (result.isConfirmed) {
                       // window.location.href = '/leave';
                      getData()
                    }
                })
            }
    
        })
        }
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );


  
  const filteredItems = dataInTransactions.filter(
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
