import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import BeatLoader from "react-spinners/BeatLoader";
import $ from "jquery";
import { FINANCE_API } from "src/views/base/components/constants";

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
  CInputGroupText,
  CInputGroup,
  CInputGroupPrepend,
} from "@coreui/react";

// const handleChange=(e)=> {
//   console.log("Fruit Selected!!");
//   this.setState({ fruit: e.target.value });
// }

function Edit(props) {
  const [tempSelectedStatus, setTempSelectedStatus] = useState();

  const dateFormat = require("dateformat");
  const [tempSelected, setTempSelected] = useState();
  const [tempIsloading, setTempIsloading] = useState(false);
  const [tempBankAccountName, setTempBankAccountName] = useState();
  const [tempBankAccountNumber, setTempBankAccountNumber] = useState();
  const [tempBankAccountBalance, setTempBankAccountBalance] = useState();
  const [mainLoading, setMainloading] = useState(true);
  const [tempIndexSelectedStatus, setTempIndexSelectedStatus] = useState(0);
  const [valueStatusAccount, setvalueStatusAccount] = useState(null);
  const [date, setDate] = useState();

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

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "account");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }

    let id = props.match.params.id;

    //get data detail
    axios
      .get(`${FINANCE_API}/api/account/` + id)
      .then((response) => {
        setTempBankAccountName(response.data.data[0].name);
        setTempBankAccountNumber(response.data.data[0].number);
        setTempBankAccountBalance(
          response.data.data[0].init_balance
            .toString()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
        );
        setDate(dateFormat(response.data.data[0].date, "yyyy-mm-dd"));
        setTempSelected(response.data.data[0].type);
        //eo =1.metaprint=2,all =3

        setTempSelectedStatus(
          response.data.data[0].active === 1 ? "Active" : "In Active"
        );

        if (response.data.data[0].active === 1) {
          var optionStatus = {
            value: "Active",
            label: "Active",
          };
          setvalueStatusAccount(optionStatus);

          setTempIndexSelectedStatus(0);
        } else {
          setTempIndexSelectedStatus(1);
          var optionStatus = {
            value: "In Active",
            label: "In Active",
          };
          setvalueStatusAccount(optionStatus);
        }
        //setTempSelectedStatus(response.data.data.status);
        //laading false
        setMainloading(false);
      })

      .catch((error) => {
        //loading false
        setMainloading(false);
      });
  }, []);

  //variable push page
  const navigator = useHistory();

  const onSelectedStatus = (selectedOptions) => {
    setTempSelectedStatus(selectedOptions["value"]);
    setvalueStatusAccount(selectedOptions);
  };

  const optionsStatus = [
    { value: "Active", label: "Active" },

    { value: "In Active", label: "In Active" },
  ];
  return (
    <div>
      {mainLoading === false ? (
        <CCard>
          <CCardHeader>
            <span>
              <strong>Buat Akun</strong>
            </span>
          </CCardHeader>
          <CCardBody>
            <Formik
              initialValues={{
                bank_account_name: tempBankAccountName,
                bank_account_number: tempBankAccountNumber,
                bank_account_owner: "",
                bank_account_balance: tempBankAccountBalance,
                type: "",
                date: date,
              }}
              validate={(values) => {
                const errors = {};

                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                console.log(values.date);
                //setTempIsloading(true);
                var id = props.match.params.id;
                console.log("selectead:", tempSelected);
                console.log(tempSelectedStatus);

                // const data = {
                //   date: values.date,
                //   name: values.bank_account_name,
                //   number: values.bank_account_number,
                //   //bank_account_owner:values.bank_account_owner,
                //   status: tempSelectedStatus,
                //   init_balance: values.bank_account_balance.replace(
                //     /[^\w\s]/gi,
                //     ""
                //   ),
                // };
                const data = {
                  name: values.bank_account_name,
                  number: values.bank_account_number,
                  is_active: tempSelectedStatus === "Active" ? 1 : 0,
                  //bank_account_owner:values.bank_account_owner,
                  init_balance: values.bank_account_balance.replace(
                    /[^\w\s]/gi,
                    ""
                  ),
                  date: values.date,
                };

                axios
                  .patch(`${FINANCE_API}/api/account/` + id, data)
                  .then((response) => {
                    console.log(response);
                    Swal.fire({
                      title: "success",
                      text: "Akun berhasil diubah",
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
                      <CLabel>Tanggal</CLabel>
                      <CInput
                        id="date"
                        name="date"
                        type="date"
                        value={values.date}
                        onChange={handleChange}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="6">
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
                      <CLabel htmlFor="type">Status</CLabel>
                      <Select
                        onChange={onSelectedStatus}
                        className="basic-single"
                        classNamePrefix="select"
                        options={optionsStatus}
                        value={valueStatusAccount}
                        name="color"
                      />
                    </CFormGroup>
                  </CCol>

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
      ) : (
        <center>
          <BeatLoader color={"blue"} loading={true} size={20} />
        </center>
      )}
    </div>
  );
}

export default Edit;
