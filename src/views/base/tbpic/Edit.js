import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { getAllPIC, getDetailPIC } from "./data/pic";
import $ from "jquery";
import { API_URL } from "src/views/base/components/constants";
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
  CInputGroupPrepend,
  CInputGroup,
} from "@coreui/react";

function Edit(props) {
  const dateFormat = require("dateformat");
  const [id, setId] = useState();
  const [tempIsloading, setTempIsloading] = useState(false);
  const [position, setPosition] = useState();
  const [email, setEmail] = useState();
  const [tempOpeningBalance, settTempOpeningBalance] = useState();
  const [mainIsLoading, setMainIsloading] = useState(true);
  const [tempNamePIC, setTempNamePIC] = useState();
  const [pic, setPIC] = useState([]);
  const [value, setValue] = useState();

  //masking
  $(document).on("input", "#opening_balance", function (e) {
    e.preventDefault();
    var objek = $("#opening_balance").val();
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
    $("#opening_balance").val(c);
  });

  //variable push page
  const navigator = useHistory();

  const onSelected = (selectedOptions) => {
    setValue(selectedOptions);
    setId(selectedOptions["value"]);
    setPosition(selectedOptions["position"]);
    setEmail(selectedOptions["email"]);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "pictb");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    const options = [];
    var id = props.match.params.id;

    getDetailPIC(id).then((response) => {
      console.log("detail data edit ", response.data);
      $("#opening_balance").val(
        response.data.opening_balance
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
      );
      console.log("aa", response.data.date);

      $("#date").val(dateFormat(response.data.date, "yyyy-mm-dd"));

      setEmail(response.data.email);
      setPosition(response.data.position);
      settTempOpeningBalance(response.data.opening_balance);
      console.log(response.data.name);
      setId(response.data.event_id);
      setTempNamePIC(response.data.name);
      var option = { label: response.data.name, value: response.data.id };
      setValue(option);
    });

    getAllPIC().then((response) => {
      // eslint-disable-next-line array-callback-return
      response.data.map((values) => {
        var data = {
          value: values.id_event,
          label: values.pic_name,
          position: values.jabatan,
          email: values.email,
        };
        options.push(data);
      });

      setPIC([...options]);
      setMainIsloading(false);
    });
  }, []);
  return (
    <div>
      {mainIsLoading === false ? (
        <CCard>
          <CCardHeader>
            <span>
              <strong>Edit PIC TB</strong>
            </span>
          </CCardHeader>
          <CCardBody>
            <Formik
              initialValues={{}}
              validate={(values) => {
                const errors = {};
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                var pic_id = props.match.params.id;
                setTempIsloading(true);
                const data = {
                  pic_id: id,
                  opening_balance: $("#opening_balance")
                    .val()
                    .replace(/[^\w\s]/gi, ""),
                  balance: $("#opening_balance")
                    .val()
                    .replace(/[^\w\s]/gi, ""),

                  date: dateFormat($("#date").val(), "yyyy-mm-dd"),
                };

                axios
                  .patch(`${API_URL}/api/pic/edit-pictb/` + pic_id, data)
                  .then((response) => {
                    console.log(response);
                    Swal.fire({
                      title: "success",
                      text: "PIC TB berhasil diedit",
                      icon: "success",
                      timer: 2000,
                      showConfirmButton: false,
                    }).then((_) => {
                      setTempIsloading(false);
                      navigator.push("/pictb/manage");
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
                      <CLabel htmlFor="type">Nama PIC</CLabel>
                      <Select
                        onChange={onSelected}
                        className="basic-single"
                        classNamePrefix="select"
                        value={value}
                        options={pic}
                        name="color"
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel>Jabatan</CLabel>
                      <CInput
                        required
                        onChange={handleChange}
                        value={position}
                      />
                    </CFormGroup>
                  </CCol>

                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel>Email</CLabel>
                      <CInput
                        required
                        type="email"
                        onChange={handleChange}
                        value={email}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel htmlFor="bank_account_number">Tanggal</CLabel>
                      <CInput
                        required
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
                        <CLabel htmlFor="opening_balance">Saldo Awal</CLabel>
                        <CInput required  style={{textAlign:'right'}} id="opening_balance" name="opening_balance" onChange={handleChange}  value={values.opening_balance} />
                    </CFormGroup> */}

                    <CFormGroup>
                      <CLabel htmlFor="total_project_cost">Saldo Awal</CLabel>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>IDR</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          required
                          style={{ textAlign: "right" }}
                          id="opening_balance"
                          name="opening_balance"
                          onChange={handleChange}
                        />
                      </CInputGroup>
                    </CFormGroup>
                  </CCol>

                  <br />
                  <CCardFooter>
                    <div style={{ textAlign: "right" }}>
                      <CButton
                        to="/pictb/manage"
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
        <p></p>
      )}
    </div>
  );
}

export default Edit;
