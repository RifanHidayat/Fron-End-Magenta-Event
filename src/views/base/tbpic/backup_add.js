import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "react-toastify/dist/ReactToastify.css";
import { Formik } from "formik";
import $ from "jquery";
import "jspdf-autotable";
import DataTable from "react-data-table-component";
import FilterComponent from "src/views/base/components/FilterComponent";
import Select from "react-select";
import { getAcounts, getInOutTransaction, getDetailPIC } from "./data/pic";
import { API_URL } from "src/views/base/components/constants";
import Swal from "sweetalert2";


import {
  CCard,
  CCardBody,
  CCardHeader,
  CLabel,
  CInput,
  CCol,
  CButton,
  CFormGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CCardFooter,
  CTooltip,
} from "@coreui/react";

import { getProjects } from "src/views/dashboard/data/Data";
import { getDataAccounts } from "../mapping-events/data/accounts";
var dateFormat = require("dateformat");
function InOut(props) {
  const [costProject, setCostProject] = useState([]);
  const [idCostTransactions, setIdCostTransactions] = useState("");
  const [tempIsLoading, setTempIsLoading] = useState();
  const [accounts, setAccounts] = useState([]);
  const [inoutNumber, setInOutNumber] = useState();
  const [idAccountIn, setIdAccountIn] = useState();
  const [idAccountOut, setIdAccountOut] = useState();
  const [valueIn, setValuein] = useState(null);
  const [valueOut, setValueout] = useState(null);
  const [inoutTransactions, setInOutTransactions] = useState([]);
  const [idInOutTransaction, setIdInOutTransaction] = useState("");
  const [balanceTb, setBalanceTB] = useState(0);
  const [nameTb, setNameTb] = useState();
  //variable push page
  const navigator = useHistory();

  const getAllInOutDataCostProject = () => {
    getInOutTransaction(props.match.params.id).then((response) => {
      console.log(response.data);
      setInOutTransactions([...response.data]);
    });
  };
  const columns = [
    {
      name: "Tanggal",
      sortable: true,
      cell: (row) => dateFormat(row.date, "dd/mm/yyyy"),
    },
    {
      name: "Deskripsi",
      sortable: true,
      cell: (row) => row.description,
    },
    {
      name: "Akun",
      sortable: true,
      cell: (row) => `${row.bank_name} (${row.account_number})`,
    },
    {
      name: "Jumlah",
      sortable: true,
      right: true,
      cell: (row) =>
        "IDR " +
        row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
    },

    {
      name: "Aksi",
      selector: "",
      sortable: true,
      width: "15%",
      center: true,

      cell: (row) => (
        <div>
          {/* <CTooltip content="Edit Cost"placement="top">
        <CButton color="secondary"  size="sm" onClick={()=>editData(
          row.id,
          row.inout_number,
          row.date,
          row.description,
          row.amount,
          row.account_in_id,
          row.account_out_id,
          row.account_in_name,
          row.account_out_name,
          row.account_in_number,
          row.account_out_number,
        )} >{<i class="fa fa-edit"></i>}</CButton>
        </CTooltip> */}
          &ensp;
          <CTooltip content="Hapus PIC TB" placement="top">
            <CButton
              color="secondary"
              size="sm"
              onClick={() => deleteData(row.id)}
            >
              <i class="fa fa-trash"></i>
            </CButton>
          </CTooltip>
        </div>
      ),
    },
  ];

  //masking
  $(document).on("input", "#amount", function (e) {
    e.preventDefault();
    var objek = $("#amount").val();
    var separator = ".";
    var a = objek;
    var b = a.replace(/[^\d]/g, "");
    var c = "";
    var panjang = b.length;
    var j = 0;
    for (var i = panjang; i > 0; i--) {
      j = j + 1;
      if (j % 3 == 1 && j != 1) {
        c = b.substr(i - 1, 1) + separator + c;
      } else {
        c = b.substr(i - 1, 1) + c;
      }
    }
    $("#amount").val(c);
  });

  const editData = (
    id,
    inout_number,
    date,
    description,
    amount,
    account_in_id,
    account_out_id,
    account_in_name,
    account_out_name,
    account_in_number,
    account_out_number
  ) => {
    setIdAccountIn(account_in_id);
    setIdAccountOut(account_out_id);
    setIdInOutTransaction(id);

    $("#date").val(dateFormat(date, "yyyy-mm-dd"));
    $("#description").val(description);
    $("#amount_in_out").val(
      amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
    );
    var option_account_in = {
      value: account_in_id,
      label: account_in_name + ` (${account_in_number})`,
    };
    var option_account_out = {
      value: account_out_id,
      label: account_out_name + ` (${account_out_number})`,
    };
    setValuein(option_account_in);
    setValueout(option_account_out);
    setInOutNumber(inout_number);
    setIdCostTransactions(id);
  };
  const deleteData = (id) => {
    console.log("dd", id);
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data akan dihapus",
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
          .delete(`${API_URL}/api/pict/add-saldo-pictb/` + id)
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
      getAllInOutDataCostProject();
      detailPIC();
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Transaksi berhasil dihapus",
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
  const onSelectedIn = (selectedOptions) => {
    setValuein(selectedOptions);
    setIdAccountIn(selectedOptions.value);
  };
  const onSelectedOut = (selectedOptions) => {
    setValueout(selectedOptions);
    setIdAccountOut(selectedOptions.value);
  };
  const backToSave = () => {
    setIdInOutTransaction("");

    $("#date").val("");
    $("#description").val("");
    $("#amount").val("");

    setValuein(null);
    setValueout(null);

    setIdCostTransactions("");
  };
  const detailPIC = () => {
    var id = props.match.params.id;
    //get detail pic
    getDetailPIC(id).then((response) => {
      setBalanceTB(response.data.balance);
      setNameTb(response.data.name);
    });
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "pictb");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    detailPIC();
    // getAllDataCostProject();
    var option_accounts = [];

    getAllInOutDataCostProject();

    getAcounts().then((response) => {
      response.data.map((values) => {
        var data = {
          value: values.id,
          label: values.bank_name + ` (${values.account_number})`,
        };
        if (
          values.id === 108 ||
          values.id === 100 ||
          values.id === 101 ||
          values.status !== "Active"
        ) {
        } else {
          option_accounts.push(data);
        }
      });
      setAccounts([...option_accounts]);
    });
  }, []);

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const filteredItems = inoutTransactions.filter(
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
      {/* Members */}
      <CCard>
        <CCardHeader>
          <div style={{ float: "right", width: "100%" }}>
            <div style={{ float: "left", position: "absolute" }}>
              <span>
                <strong>Tambah saldo</strong>
              </span>
            </div>
            <div style={{ float: "right" }}>
              <span>
                <strong>TB: {nameTb}</strong>
              </span>
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          <Formik
            initialValues={
              {
                // date:'',
                // description:'',
                // amount_in_out:''
              }
            }
            validate={(values) => {}}
            onSubmit={(values, { setSubmitting }) => {
              var data = {
                date: $("#date").val(),
                description: $("#description").val(),
                amount: $("#amount")
                  .val()
                  .replace(/[^\w\s]/gi, ""),
                id: props.match.params.id,
                account_id: idAccountOut,
                name: nameTb,
              };
              console.log("id account", idAccountOut);
              console.log("date ", $("#date").val());
              console.log("description", $("#description").val());
              console.log(
                "amount",
                $("#amount")
                  .val()
                  .replace(/[^\w\s]/gi, "")
              );
              console.log("id pic", props.match.params.id);

              axios
                .post(`${API_URL}/api/pict/add-saldo-pictb`, data)
                .then((response) => {
                  getAllInOutDataCostProject();
                  detailPIC();

                  backToSave();
                  Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Berhasil menambahkan saldo PIC",
                    showConfirmButton: false,
                    timer: 2000,
                  }).then((result) => {
                    if (result.isConfirmed) {
                    }
                  });
                })
                .catch((error) => {
                  console.log("terjadi kesalahan");
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
            }) => (
              <form onSubmit={handleSubmit} autoComplete="off">
                <CFormGroup row>
                  <CCol xs="3">
                    <CFormGroup>
                      <CLabel>Saldo TB</CLabel>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>IDR</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          readOnly
                          style={{ textAlign: "right" }}
                          required
                          onChange={handleChange}
                          value={parseInt(balanceTb)
                            .toString()
                            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                        />
                      </CInputGroup>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel htmlFor="date">Tanggal</CLabel>
                      <CInput
                        required
                        id="date"
                        name="date"
                        type="date"
                        onChange={handleChange}
                      />
                    </CFormGroup>
                  </CCol>

                  <CCol xs="3">
                    <CFormGroup>
                      <CLabel htmlFor="description">Deskripsi </CLabel>
                      <CInput
                        id="description"
                        name="description"
                        onChange={handleChange}
                      />
                    </CFormGroup>
                  </CCol>

                  <CCol xs="3">
                    <CFormGroup>
                      <CLabel htmlFor="total">jumlah</CLabel>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>IDR</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          required
                          style={{ textAlign: "right" }}
                          id="amount"
                          name="amount"
                          onChange={handleChange}
                        />
                      </CInputGroup>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                <CCardFooter>
                  {/* <div  style={{textAlign: 'right'}}>
                  <CButton type="submit" size="sm col-1"  className="btn-brand mr-1 mb-1" color='primary'>
                 Simpan
                  </CButton>
                  
                  {}      
              </div> */}

                  {idCostTransactions === "" ? (
                    <div style={{ textAlign: "right" }}>
                      <CButton
                        to="/pictb/manage"
                        size="sm xs-1"
                        className="btn-secondary btn-brand mr-1 mb-1"
                      >
                        Kembali
                      </CButton>
                      <CButton
                        type="submit"
                        size="sm xs-2"
                        className="btn-brand mr-1 mb-1"
                        color="primary"
                      >
                        {tempIsLoading === true ? (
                          <i class="spinner-border" />
                        ) : (
                          <i class="fa fa-save" />
                        )}
                        <span className="mfs-1">Simpan</span>
                      </CButton>
                    </div>
                  ) : (
                    <div style={{ textAlign: "right" }}>
                      <CButton
                        onClick={() => backToSave()}
                        size="sm xs-1"
                        className="btn-secondary btn-brand mr-1 mb-1"
                      >
                        X
                      </CButton>
                      <CButton
                        type="submit"
                        size="sm xs-1"
                        disabled={tempIsLoading}
                        className="btn-brand mr-1 mb-1"
                        color="primary"
                      >
                        {tempIsLoading === true ? (
                          <i class="spinner-border" />
                        ) : (
                          <i class="fa fa-edit" />
                        )}
                        <span className="mfs-2">Ubah</span>
                      </CButton>
                    </div>
                  )}
                </CCardFooter>
              </form>
            )}
          </Formik>

          <DataTable
            columns={columns}
            data={filteredItems}
            defaultSortField="name"
            pagination
            subHeader
            paginationPerPage={5}
            subHeaderComponent={subHeaderComponent}
          />

          {/* manage cost/ out projects */}
          {/* {tempisloadingCostProject===false? */}

          {/* // :
//   <DataTable
     
//   columns={columns}
//   data={costProject}
//   defaultSortField="name"
//   pagination
//   subHeader
//  // subHeaderComponent={subHeaderComponent}

// /> */}
        </CCardBody>
      </CCard>
    </div>
  );
}
export default InOut;
