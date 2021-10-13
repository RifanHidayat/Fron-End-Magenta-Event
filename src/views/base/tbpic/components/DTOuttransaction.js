import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import FilterComponent from "src/views/base/components/FilterComponent";
import { API_URL } from "src/views/base/components/constants";

import { CTooltip, CButton } from "@coreui/react";
import { Height } from "@material-ui/icons";
var dateFormat = require("dateformat");
const DataOutTransactions = async () =>
  fetch(`${API_URL}/api/transactions/out`)
    .then((response) => response.json())
    .then((json) => json);

const Table = (props) => {
  const columns = [
    {
      name: "Nama PICTB/ No. Project",
      sortable: true,
      width: "20%",
      filterable: true,
      cell: (row) => <span>{row.label}</span>,
    },

    {
      name: "Keterangan",

      sortable: true,
      width: "15%",
      cell: (row) =>
        row.project_id !== 0 ? " Laba Rugi project" : "PIC Tb Pindahan",
    },
    {
      name: "Tanggal",

      sortable: true,
      width: "15%",
      cell: (row) => dateFormat(row.date, "dd/mm/yyyy"),
    },
    {
      name: "Deskripsi",

      sortable: true,
      width: "15%",
      cell: (row) => row.description,
    },

    {
      name: "Jumlah",

      sortable: true,
      width: "15%",
      cell: (row) => (
        <span>
          {" "}
          IDR {row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
        </span>
      ),
    },
    {
      name: "Aksi",
      selector: "",
      sortable: true,
      width: "15%",
      center: true,

      cell: (row) => (
        <div>
          <CTooltip content="Edit PIC TB" placement="top">
            <CButton color="secondary" size="sm" to={`/pictb/edit/${row.id}`}>
              {<i class="fa fa-edit"></i>}
            </CButton>
          </CTooltip>
          &ensp;
          <CTooltip content="Hapus PIC TB" placement="top">
            <CButton
              color="secondary"
              size="sm"
              onClick={() => deletePIC(row.id, row.project_id, row.pictb_id)}
            >
              {<i class="fa fa-trash"></i>}
            </CButton>
          </CTooltip>
        </div>
      ),
    },
  ];

  const deletePIC = (id, project_id, pictb_id) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "PIC TB akan dihapus",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return axios
          .delete(
            `${API_URL}/api/transactions/out/` +
              id +
              "/" +
              project_id +
              "/" +
              pictb_id
          )
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error.data);
            Swal.fire({
              icon: "error",
              title: "Oops",
              text: "Terjadi Kesalahan",
            });
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Transaksi Out Berhasil dihapus",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.href = '/leave';
            // getAllOutTransactions()
          }
        });
      }
    });
  };

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const filteredItems = props.data.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
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
        onFilter={(e) => setFilterText(e.target.value)}
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
