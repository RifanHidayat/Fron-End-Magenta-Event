import React, { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import axios from "axios";
import FilterComponent from "src/views/base/components/FilterComponent";
import { API_URL } from "src/views/base/components/constants";
import BeatLoader from "react-spinners/BeatLoader";

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip,
  CBadge,
} from "@coreui/react";

import env from "react-dotenv";

function Manage() {
  const getBadge = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "In Active":
        return "danger";
    }
  };

  const columns = [
    {
      name: "Nama Akun",
      sortable: true,
      width: "20%",
      cell: (row) => (
        <div style={{ width: "100%" }} data-tag="allowRowEvents">
          <div>{row.bank_name}</div>
        </div>
      ),
    },
    {
      name: "No. Rekening",
      width: "20%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.account_number}</div>
        </div>
      ),
    },
    {
      name: "Saldo",
      width: "30%",
      sortable: true,

      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {"IDR " +
              row.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      width: "20%",
      sortable: true,
      cell: (row) => (
        <div>
          <div></div>
          <CBadge style={{ width: "100%" }} color={getBadge(row.status)}>
            <span style={{ color: "white", alignContent: "center" }}>
              {" "}
              {row.status}
            </span>
          </CBadge>
        </div>
      ),
    },

    {
      name: "Aksi",
      width: "10%",
      sortable: true,
      center: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <CTooltip content="Edit Akun" placement="top">
              <CButton
                color="secondary"
                size="sm"
                to={`/account/edit/${row.id}`}
              >
                {<i class="fa fa-edit"></i>}
              </CButton>
            </CTooltip>
            &ensp;
            {/* <CTooltip content="Delete Akun" placement="top">
              <CButton
                color="secondary"
                size="sm"
                onClick={() => deleteAccount(row.id)}
              >
                {<i class="fa fa-trash"></i>}
              </CButton>
            </CTooltip> */}
            &ensp;
            <CTooltip content="Lihat Transaksi." placement="top">
              <CButton
                to={`/account/detail/${row.id}`}
                color="secondary"
                size="sm"
              >
                {<i class="fa fa-eye"></i>}
              </CButton>
            </CTooltip>
          </div>
        </div>
      ),
    },
  ];

  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const deleteAccount = (id) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Akun akan dihapus",
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
          .delete(`${API_URL}/api/accounts/delete-account/` + id)
          .then(function (response) {
            console.log("rww", response.data);
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
        getDataAccounts();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Akun berhasil dihapus",
          timer: 2000,
          showConfirmButton: false,
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("delete berhasil");

            // window.location.href = '/leave';
          }
        });
      }
    });
  };

  const getDataAccounts = () => {
 
    axios
      .get(`${API_URL}/api/accounts`)
      .then((response) => {
        setAccounts([...response.data.data]);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "account");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    getDataAccounts();
  }, []);

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const filteredItems = accounts.filter(
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
    <div>
      <CCard>
        <CCardHeader>
          <div style={{ float: "right", width: "100%" }}>
            <div style={{ float: "left", position: "absolute" }}>
              <span>
                <strong>Data Akun</strong>
              </span>
            </div>
            <div style={{ float: "right" }}>
              <CButton size="sm" to="/account/create" color="primary">
                <i className="fa fa-plus"></i> <span>Tambah </span>
              </CButton>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          {/* <Table data={accounts}  /> */}
          {isLoading == false ? (
            <DataTable
              columns={columns}
              data={filteredItems}
              defaultSortField="name"
              pagination
              subHeader
              subHeaderComponent={subHeaderComponent}
            />
          ) : (
            <center>
              <div style={{ height: "200px" }}>
                <BeatLoader color={"blue"} loading={true} size={20} />
              </div>
            </center>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Manage;
