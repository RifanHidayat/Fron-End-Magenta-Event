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
import { getInOutNumber, getAcounts, getInOutTransaction } from "./data/Data";
import { API_URL } from "src/views/base/components/constants";
import BeatLoader from "react-spinners/BeatLoader";

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
  const [isLoading, setIsLoading] = useState(true);

  //variable push page
  const navigator = useHistory();

  const getAllInOutDataCostProject = () => {
    getInOutTransaction().then((response) => {
      console.log(response.data);
      setInOutTransactions([...response.data]);
      setIsLoading(false);
    });
  };
  const columns = [
    {
      name: "No. In Out",
      sortable: true,
      cell: (row) => row.inout_number,
    },
    {
      name: "Tanggal",
      sortable: true,
      cell: (row) => dateFormat(row.date, "dd/mm/yyyy"),
    },
    {
      name: "Deskripsi",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.description}</div>
        </div>
      ),
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
      name: "Akun In",
      sortable: true,
      right: true,
      cell: (row) => row.account_in_name + ` (${row.account_in_number})`,
    },
    {
      name: "Akun Out",
      sortable: true,
      right: true,
      cell: (row) => row.account_out_name + ` (${row.account_out_number})`,
    },
    {
      name: "Aksi",
      selector: "",
      sortable: true,
      width: "15%",
      center: true,

      cell: (row) => (
        <div>
          <CTooltip content="Edit Cost" placement="top">
            <CButton
              color="secondary"
              size="sm"
              onClick={() =>
                editData(
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
                  row.account_out_number
                )
              }
            >
              {<i class="fa fa-edit"></i>}
            </CButton>
          </CTooltip>
          &ensp;
          <CTooltip content="Hapus PIC TB" placement="top">
            <CButton
              color="secondary"
              size="sm"
              onClick={() => deleteData(row.inout_number)}
            >
              <i class="fa fa-trash"></i>
            </CButton>
          </CTooltip>
        </div>
      ),
    },
  ];

  //masking
  $(document).on("input", "#amount_in_out", function (e) {
    e.preventDefault();
    var objek = $("#amount_in_out").val();
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
    $("#amount_in_out").val(c);
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
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Transaksi In Out akan dihapus",
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
          .delete(`${API_URL}/api/inout/` + id)
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
      if (result.isConfirmed) {
        InOutNumber();
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

            getAllInOutDataCostProject();
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
    $("#amount_in_out").val("");

    setValuein(null);
    setValueout(null);

    setIdCostTransactions("");
    InOutNumber();
  };

  const InOutNumber = () => {
    getInOutNumber().then((response) => {
      setInOutNumber(response.data);
    });
  };
  useEffect(() => {
    setTempIsLoading(true);
    setIsLoading(true);
    // getAllDataCostProject();
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "inout");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    var option_accounts = [];

    InOutNumber();
    getAllInOutDataCostProject();

    getAcounts().then((response) => {
      response.data.map((values) => {
        if (values.status !== "Active") {
        } else {
          var data = {
            value: values.id,
            label: values.bank_name + ` (${values.account_number})`,
          };
          option_accounts.push(data);
        }
      });
      setAccounts([...option_accounts]);
    });
    setTempIsLoading(false);
    setIsLoading(false);
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
          <div>
            <span>
              <strong>In/Out</strong>
            </span>
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
              setTempIsLoading(true);
              var data = {
                date: $("#date").val(),
                description: $("#description").val(),
                amount: $("#amount_in_out")
                  .val()
                  .replace(/[^\w\s]/gi, ""),
                in_account: idAccountIn,
                out_account: idAccountOut,
                inout_number: inoutNumber,
              };

              if (idInOutTransaction === "") {
                axios
                  .post(`${API_URL}/api/inout`, data)
                  .then((response) => {
                    getAllInOutDataCostProject();

                    backToSave();
                    setTempIsLoading(false);
                    Swal.fire({
                      icon: "success",
                      title: "Success",
                      text: "Transaksi In Out berhasil disimpan",
                      showConfirmButton: false,
                      timer: 2000,
                    }).then((result) => {
                      if (result.isConfirmed) {
                      }
                    });
                  })
                  .catch((error) => {});
              } else {
                axios
                  .patch(`${API_URL}/api/inout/` + inoutNumber, data)
                  .then((response) => {
                    getAllInOutDataCostProject();

                    backToSave();
                    setTempIsLoading(false);
                    Swal.fire({
                      icon: "success",
                      title: "Success",
                      text: "Transaksi In Out berhasil diubah",
                      showConfirmButton: false,
                      timer: 2000,
                    }).then((result) => {
                      if (result.isConfirmed) {
                      }
                    });
                  })
                  .catch((error) => {
                    console.log("berhasilasd");
                    setTempIsLoading(false);
                  });
              }
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
                      <CLabel htmlFor="type">Akun In</CLabel>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        options={accounts}
                        onChange={onSelectedIn}
                        value={valueIn}
                        name="color"
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="3">
                    <CFormGroup>
                      <CLabel htmlFor="type">Akun Out</CLabel>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        options={accounts}
                        onChange={onSelectedOut}
                        value={valueOut}
                        name="color"
                      />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol xs="3">
                    <CFormGroup>
                      <CLabel htmlFor="inout">No. In Out </CLabel>
                      <CInput id="inout" name="inout" value={inoutNumber} />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="3">
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
                          id="amount_in_out"
                          name="amount_in_out"
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
                        type="submit"
                        size="sm xs-2"
                        className="btn-brand mr-1 mb-1"
                        color="primary"
                        disabled={tempIsLoading}
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

          {isLoading === false ? (
            <DataTable
              columns={columns}
              data={filteredItems}
              defaultSortField="name"
              pagination
              subHeader
              paginationPerPage={5}
              subHeaderComponent={subHeaderComponent}
            />
          ) : (
            <center>
              <div style={{ height: "200px" }}>
                <BeatLoader color={"blue"} loading={true} size={20} />
              </div>
            </center>
          )}

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
