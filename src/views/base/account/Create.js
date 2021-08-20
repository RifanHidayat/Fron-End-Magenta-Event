import React, { useState } from "react";
import { Formik } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import $ from "jquery";

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
} from "@coreui/react";

function Add() {
  const [tempSelected, setTempSelected] = useState("eo");
  const [tempIsloading, setTempIsloading] = useState(false);

  //masking
  $(document).on("input", "#bank_account_balance", function (e) {
    e.preventDefault();
    var objek = $("#bank_account_balance").val();
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
    $("#bank_account_balance").val(c);
  });

  //variable push page
  const navigator = useHistory();
  const onSelected = (selectedOptions) => {
    setTempSelected(selectedOptions["value"]);
  };

  const options = [
    { value: "eo", label: "Event Organizer" },

    { value: "all", label: "Semua" },
  ];
  return (
    <div>
      <CCard>
        <CCardHeader>
          <span>
            <strong>Buat Akun</strong>
          </span>
        </CCardHeader>
        <CCardBody>
          <Formik
            initialValues={{
              bank_account_name: "",
              bank_account_number: "",
              bank_account_owner: "",
              bank_account_balance: "",
              type: "",
              date: "",
            }}
            validate={(values) => {
              const errors = {};

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTempIsloading(true);
              const data = {
                bank_account_name: values.bank_account_name,
                bank_account_number: values.bank_account_number,
                //bank_account_owner:values.bank_account_owner,
                bank_account_balance: values.bank_account_balance.replace(
                  /[^\w\s]/gi,
                  ""
                ),
                type: tempSelected,
                date: values.date,
              };

              axios
                .post("http://localhost:3000/api/accounts/create-account", data)
                .then((response) => {
                  console.log(response);
                  Swal.fire({
                    title: "success",
                    text: "Akun berhasil dibuat",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                  }).then((_) => {
                    setTempIsloading(false);
                    navigator.push("/account/manage");
                  });
                })
                .catch((error) => {
                  // this.setState({ errorMessage: error.message });
                  console.error("There was an error!", error);
                  // setTempIsloading(false)
                  // setIsloading(false);
                  setTempIsloading(false);
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
                <CCol xs="6">
                  <CFormGroup>
                    <CLabel htmlFor="bank_account_name">Nama Akun</CLabel>
                    <CInput
                      required
                      id="bank_account_name"
                      name="bank_account_name"
                      onChange={handleChange}
                      value={values.bank_account_name}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs="6">
                  <CFormGroup>
                    <CLabel htmlFor="bank_account_number">No. Akun</CLabel>
                    <CInput
                      id="bank_account_number"
                      name="bank_account_number"
                      onChange={handleChange}
                      value={values.bank_account_number}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs="6">
                  <CFormGroup>
                    <CLabel htmlFor="bank_account_number">Tanggal</CLabel>
                    <CInput
                      type="date"
                      id="date"
                      name="date"
                      onChange={handleChange}
                      value={values.date}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs="6">
                  {/* <CFormGroup>
                        <CLabel htmlFor="bank_account_balance">Saldo Awal</CLabel>
                        <CInput required  oninput="convertToRupiah(this);"  style={{textAlign:'right'}} id="bank_account_balance" name="bank_account_balance" onChange={handleChange}  value={values.bank_account_balance} />
                    </CFormGroup> */}

                  <CFormGroup>
                    <CLabel htmlFor="total_project_cost">Saldo Awal</CLabel>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>IDR</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        required
                        oninput="convertToRupiah(this);"
                        style={{ textAlign: "right" }}
                        id="bank_account_balance"
                        name="bank_account_balance"
                        onChange={handleChange}
                        value={values.bank_account_balance}
                      />
                    </CInputGroup>
                  </CFormGroup>
                </CCol>

                <CCol xs="6">
                  <CFormGroup>
                    <CLabel htmlFor="type">Jenis Akun</CLabel>
                    <Select
                      onChange={onSelected}
                      defaultValue={options[0]}
                      className="basic-single"
                      classNamePrefix="select"
                      options={options}
                      name="color"
                    />
                  </CFormGroup>
                </CCol>
                <br />

                <CCardFooter>
                  <div style={{ textAlign: "right" }}>
                    <CButton
                      to="/account/manage"
                      size="sm col-1"
                      className="btn-secondary btn-brand mr-1 mb-1"
                    >
                      <span className="mfs-2">Kembali</span>
                    </CButton>
                    <CButton
                      disabled={tempIsloading}
                      type="submit"
                      size="sm col-1"
                      className="btn-brand mr-1 mb-1"
                      color="primary"
                    >
                      {tempIsloading ? (
                        <i class="spinner-border"></i>
                      ) : (
                        <span className="mfs-2">Simpan</span>
                      )}
                    </CButton>
                    {}
                  </div>
                </CCardFooter>
              </form>
            )}
          </Formik>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Add;
