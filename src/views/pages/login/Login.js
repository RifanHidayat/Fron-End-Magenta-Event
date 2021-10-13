import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import Swal from "sweetalert2";

const Login = () => {
  const [isloading, setIsLoaing] = useState(true);
  const navigator = useHistory();

  useEffect(() => {
    setIsLoaing(false);
  }, []);

  const login = async () => {
    setIsLoaing(true);

    var data = {
      username: $("#username").val(),
      password: $("#password").val(),
    };
    console.log($("#username").val());
    console.log($("#password").val());
    await axios
      .post("http://react.magentamediatama.net/api/login", data)
      .then((response) => {
        console.log(response.data.data);

        localStorage.setItem(
          "permission",
          response.data.data.finance_permission
        );
        localStorage.setItem("isLogin", true);
        localStorage.setItem("data", JSON.stringify(response.data.data));

        console.log(JSON.parse(localStorage.getItem("permission")));
        navigator.push("/dashboard");

        // $("#username").val("");
        // $("#password").val("");
        // navigator.push("/mapping");
        // //window.location.href = "";

        // sessionStorage.setItem("user", JSON.stringify(response.data.data));
        // console.log(response.data.data.id);
        // sessionStorage.setItem("name", "rifan");

        // setIsLoaing(false);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "error",
          text: `${error.response.data.message}`,
          showConfirmButton: false,
          timer: 2000,
        });

        setIsLoaing(false);
      });

    // axios.post('http://localhost:3000/api/login',data).then(response=>{
    //   setIsLoaing(false)
    //   console.log(response)

    // })
    // .catch((error)=>{
    //   console.log(error)
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'error',
    //     text: `${error.data.data}`,
    //     showConfirmButton:false,
    //     timer:2000
    //})

    // })
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Magenta Projects</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        required
                        type="text"
                        placeholder="Username"
                        name="username"
                        id="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        required
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CButton
                        onClick={() => login()}
                        style={{
                          width: "100%",
                          marginLeft: "15px",
                          marginRight: "15px",
                        }}
                        color="primary"
                        className="px-4"
                        disabled={isloading}
                      >
                        {isloading === true ? (
                          <i class="spinner-border" />
                        ) : (
                          <span style={{ fontSize: "18px" }}>login</span>
                        )}
                      </CButton>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
