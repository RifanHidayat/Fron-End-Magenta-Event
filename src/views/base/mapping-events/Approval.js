import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./css/style.css";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import Swal from "sweetalert2";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import { Alert } from 'reactstrap';
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { API_URL } from "src/views/base/components/constants";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CLabel,
  CInput,
  CCol,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CFormGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
} from "@coreui/react";

import MapGL, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import ControlPanel from "./components/controll-panel";
import Pin from "./components/pin";
import MAP_STYLE from "./components/mapstyle";

//Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';
import "jquery/dist/jquery.min.js";

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";

const geolocateStyle = {
  top: 0,
  left: 0,
  padding: "10px",
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: "10px",
};

const navStyle = {
  top: 72,
  left: 0,
  padding: "10px",
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: "10px",
};

function Approval(props) {
  const [tempProjectNumber, setTempProjectNumber] = useState("");
  const [tempProjectCreatedDate, setTempProjectCreatedDate] = useState("");
  const [tempProjectStartedDate, setTempProjectStartDate] = useState("");
  const [tempProjectEndDate, setTempProjectEndDate] = useState("");
  const [tempEventCustomer, setTempEventCustomer] = useState("");
  const [tempEventPic, setTempEventPic] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [tempTotalProjectCost, setTempTotalProjectCos] = useState("");
  const [tempLatitude, setTempLatitude] = useState("");
  const [tempLongtitude, setTempLongtitude] = useState("");
  const [tempMap, setTempMap] = useState(false);
  const [status, setStatus] = useState();
  const [tempProfits, setTempProfits] = useState();
  const [tempIds, setTempids] = useState([]);

  const [TotalProject, setTotalProject] = useState();
  const [disabledButton, setDisabledButton] = useState(true);
  const [tempLocation, setTempLocation] = useState("");

  const [quotations, setQuotations] = useState();

  //loading spinner
  const [tempIsloading, setTempIsloading] = useState(true);

  const [budgetStartDate, setBudgetStartDate] = useState();
  const [budgetEndDate, setBudgetEndtDate] = useState();
  var profits = [];

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),

    []
  );

  const [events, logEvents] = useState({});
  //variable push page
  const navigator = useHistory();

  //navigation page
  const budgetsPage = () => {
    var id = props.match.params.id;
    navigator.push("/mapping/budgets/" + id);
  };
  const membersPage = () => {
    var id = props.match.params.id;
    navigator.push("/mapping/members/" + id);
  };
  const tasksPage = () => {
    var id = props.match.params.id;
    navigator.push("/mapping/tasks/" + id);
  };
  const approvalPage = () => {
    var id = props.match.params.id;
    navigator.push("/mapping/approval/" + id);
  };

  const setDataMembers = (data) => {
    var row = "";
    if (data.length === 0) {
    } else {
      for (var i = 0; i < data.length; i++) {
        row += `<tr>
                  <td>${data[i].first_name}<br> ${data[i].employee_id}</td>
                 
                   <td>${data[i].identity_number}</td>
                   <td> 
                   IDR ${data[i].daily_money_regular
                     .toString()
                     .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                   </td>
                    <td>
                    ${data[i].status == "pic" ? "PIC" : "Anggota"}
                     </td>
                   </tr>
          `;
      }
      $("#data-members").html(row);
    }
  };

  const setDataBudgets = (data) => {
    var row = "";
    if (data.length === 0) {
    } else {
      for (var i = 0; i < data.length; i++) {
        let date = new Date(data[i].date);
        let date_crated = date.getDate();
        let month_created = date.getMonth() + 1;
        let year_created = date.getFullYear();
        let date_transfer =
          "00".substr(String(date_crated).length) +
          date_crated +
          "/" +
          "00".substr(String(month_created).length) +
          month_created +
          "/" +
          year_created;
        if (data[i].type == "in") {
          row += `<tr>
                  <td>IDR ${data[i].amount
                    .toString()
                    .replace(
                      /(\d)(?=(\d\d\d)+(?!\d))/g,
                      "$1."
                    )}</td>            
                   <td>${date_transfer}</td>
                   <td> ${data[i].account.bank_name} (${
            data[i].account.account_number
          })
                   </td>

                   </tr>
          `;
        }
      }
      $("#data-budgets").html(row);
    }
  };

  const setDataTasks = (data) => {
    var row = "";
    if (data.length === 0) {
    } else {
      for (var i = 0; i < data.length; i++) {
        row += `<tr>
                 <td>${data[i].name}</td>            
                 <td>${data[i].status} </td>
                 </tr>
          `;
      }
      $("#data-tasks").html(row);
    }
  };

  const approvalProject = (id) => {
    var id = props.match.params.id;
    var project_number = $("#project_number").val();
    // var description = `Penambahan anggaran untuk project dengan No. Project <a href='${}/mapping/manage#/mapping/approval/${id}'>${project_number}</a>`;
    var data = {
      description: "",
      profits: tempProfits,
      id_quotation: tempIds,
    };
    console.log("prods", profits);
    //values save L/R project
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "project akan disetujui",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Approve",
      showLoaderOnConfirm: true,

      preConfirm: () => {
        return axios
          .patch(`${API_URL}/api/projects/approval/` + id, data)
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
        setStatus("approved");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Peroject berhasil diapprove",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed) {
            navigator.push("/mapping");
          }
        });
      }
    });
  };

  const rejectionProject = (id) => {
    var id = props.match.params.id;
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "project akan ditolak",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Reject",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return axios
          .patch(`${API_URL}/api/projects/rejection/` + id)
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
        setStatus("rejected");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Project  berhasil  direject",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.href = '/leave';
            navigator.push("/mapping");
          }
        });
      }
    });
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "mapping");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    let id = props.match.params.id;
    var dateFormat = require("dateformat");
    let ids = [];

    //get detail project
    axios
      .get(`${API_URL}/api/projects/detail-project/` + id)
      .then((response) => {
        if (response.data.data.members != null) {
          setDataMembers(response.data.data.members);
        }

        setQuotations(response.data.data.quotations);

        response.data.data.quotations.map((value) => {
          ids.push(value.id);
          //set data quotation to save profit / loss project
          var description = `${value.quotation_number}/${response.data.data.project_number}`;
          var data = [
            dateFormat(response.data.data.project_start_date, "yyyy-mm-dd"),
            description,
            value.grand_total,
            "in",
            id,
          ];
          profits.push(data);
        });

        if (response.data.data.budget != "") {
          //budget
          if (response.data.data.budget.transactions.length > 0) {
            setDataBudgets(response.data.data.budget.transactions);
          }

          setBudgetEndtDate(
            dateFormat(response.data.data.budget.budget_end_date, "yyyy-mm-dd")
          );
          setBudgetStartDate(
            dateFormat(
              response.data.data.budget.budget_start_date,
              "yyyy-mm-dd"
            )
          );
          setTotalProject(
            response.data.data.budget.opening_balance
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
          );

          console.log("quotation", response.data.data);
          //set data transactions budget to save profit / loss project
          response.data.data.budget.transactions.map((value) => {
            var data = [
              dateFormat(value.date, "yyyy-mm-dd"),
              value.description,
              value.amount,
              "out",
              id,
            ];
            profits.push(data);
          });
        }
        //   console.log("quotation",response.data.data)

        if (response.data.data.tasks.length > 0) {
          setDataTasks(response.data.data.tasks);
        }

        setTempProjectNumber(response.data.data.project_number);
        //projecct create data
        setTempProjectCreatedDate(
          dateFormat(response.data.data.project_created_date, "yyyy-mm-dd")
        );
        setTempProjectStartDate(
          dateFormat(response.data.data.project_start_date, "yyyy-mm-dd")
        );
        setTempProjectEndDate(
          dateFormat(response.data.data.project_end_date, "yyyy-mm-dd")
        );

        setTempEventCustomer(response.data.data.event_customer);
        setTempEventPic(response.data.data.event_pic);
        setTempDescription(response.data.data.description);
        setTempLatitude(response.data.data.latitude);
        setTempLongtitude(response.data.data.longtitude);
        setTempLocation(response.data.data.location);
        setTempTotalProjectCos(
          response.data.data.total_project_cost
            .toString()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
        );

        setStatus(response.data.data.status);
        setMarker({
          latitude: parseFloat(response.data.data.latitude),
          longitude: parseFloat(response.data.data.longtitude),
        });
        setViewport({
          latitude: parseFloat(response.data.data.latitude),
          longitude: parseFloat(response.data.data.longtitude),
          zoom: 13.5,
        });

        //disable button approve and reject

        setTempids([...ids]);
        //iniaslisasi datatable
        $("#members-datatable").DataTable();
        $("#budgets-datatable").DataTable();
        $("#tasks-datatable").DataTable();
        setTempProfits(profits);

        setTempIsloading(false);

        if (
          response.data.data.budget.length <= 0 ||
          response.data.data.tasks.length <= 0 ||
          response.data.data.members === null ||
          response.data.data.members === "[]"
        ) {
          setDisabledButton(true);
        } else {
          setDisabledButton(false);
        }
      })
      .catch((error) => {});
  }, []);

  const [viewport, setViewport] = useState({
    width: "100",
    height: "400",
    latitude: 38.963745,
    longitude: 35.243322,
    zoom: 5,
  });
  const [marker, setMarker] = useState({
    longitude: 107.6684889,
    latitude: -6.942100215253297,
  });

  const SIZE = 100;
  const UNIT = "px";
  return (
    <div>
      {status === "approved" ? (
        <Alert severity="success">Project telah disetujui</Alert>
      ) : status === "rejected" ? (
        <Alert severity="error">Project ditolak</Alert>
      ) : status === "pending" ? (
        <Alert severity="warning">Menungu persetujuan</Alert>
      ) : (
        <Alert severity="info">Project closed</Alert>
      )}
      <br />

      {/* data project */}
      <CCard>
        <CCardHeader>
          <div style={{ float: "right", width: "100%" }}>
            <div style={{ float: "left", position: "absolute" }}>
              <span>
                <strong>Data Project</strong>
              </span>
            </div>
            <div style={{ float: "right" }}>
              {status === "pending" ? (
                <CButton
                  // disabled={disabledButton}
                  size="sm"
                  bloc
                  color="danger"
                  onClick={() => rejectionProject()}
                >
                  <span>
                    {tempIsloading == true ? <i class="spinner-border" /> : ""}{" "}
                    Reject{" "}
                  </span>
                </CButton>
              ) : (
                ""
              )}
              &nbsp;
              {status === "pending" ? (
                <CButton
                  // disabled={disabledButton}
                  size="sm"
                  bloc
                  color="primary"
                  onClick={() => approvalProject()}
                >
                  <span>
                    {tempIsloading === true ? <i class="spinner-border" /> : ""}{" "}
                    Approve{" "}
                  </span>
                </CButton>
              ) : (
                ""
              )}
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CFormGroup row className="my-0">
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="Project_number">No. Project</CLabel>
                <CInput
                  readOnly
                  required
                  id="project_number"
                  placeholder=""
                  name="project_number"
                  value={tempProjectNumber}
                />
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="Project_created_date">
                  Tanggal Buat Project
                </CLabel>
                <CInput
                  readOnly
                  type="date"
                  required
                  id="project_created_date"
                  name="project_created_date"
                  placeholder=""
                  value={tempProjectCreatedDate}
                />
              </CFormGroup>
            </CCol>

            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="project_start_date">
                  Tanggal Mulai Project
                </CLabel>
                <CInput
                  readOnly
                  type="date"
                  required
                  id="project_start_date"
                  name="project_start_date"
                  placeholder=""
                  value={tempProjectStartedDate}
                />
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="project_end_date">
                  Tanggal Akhir Project
                </CLabel>
                <CInput
                  readOnly
                  type="date"
                  required
                  id="project_end_date"
                  name="project_end_date"
                  placeholder=""
                  value={tempProjectEndDate}
                />
              </CFormGroup>
            </CCol>

            <CCol xs="6">
              <CFormGroup>
                <CLabel required htmlFor="event_customer">
                  Customer Event
                </CLabel>
                <CInput
                  readOnly
                  id="event_customer"
                  name="event_customer"
                  placeholder=""
                  value={tempEventCustomer}
                />
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="event_pic">PIC Event</CLabel>
                <CInput
                  readOnly
                  id="event_pic"
                  name="event_pic"
                  placeholder=""
                  value={tempEventPic}
                />
              </CFormGroup>
            </CCol>

            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="description">Deskripsi</CLabel>
                <CInput
                  readOnly
                  id="description"
                  name="description"
                  placeholder=""
                  value={tempDescription}
                />
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="total_project_cost">
                  Total Biaya Project
                </CLabel>
                <CInputGroup>
                  <CInputGroupPrepend>
                    <CInputGroupText>IDR</CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    readOnly
                    style={{ textAlign: "right" }}
                    id="total_project_cost"
                    name="total_project_cost"
                    value={tempTotalProjectCost}
                  />
                </CInputGroup>
              </CFormGroup>
            </CCol>
            <CCol xs="12">
              <CFormGroup>
                <CLabel htmlFor="location">Lokasi Project</CLabel>
                <CInput
                  required
                  id="location"
                  name="location"
                  placeholder=""
                  readOnly
                  value={tempLocation}
                />
              </CFormGroup>
            </CCol>

            {/* <CCol xs="5">
              <CFormGroup>
                <CLabel htmlFor="latitude">Latitude</CLabel>
                <CInput
                  readOnly
                  id="latitude"
                  name="latitude"
                  placeholder=""
                  value={tempLatitude}
                />
              </CFormGroup>
            </CCol> */}
            {/* <CCol xs="5">
              <CFormGroup>
                <CLabel htmlFor="longtitude">Longitude</CLabel>
                <CInput
                  readOnly
                  id="longtitude"
                  name="longtitude"
                  placeholder=""
                  value={tempLongtitude}
                />
              </CFormGroup>
            </CCol> */}
            {/* <CCol xs="2">
              <CFormGroup>
                <div
                  style={{
                    textAlign: "right",
                    marginTop: "35px",
                    width: "100%",
                  }}
                >
                  <CButton
                    color="primary"
                    onClick={() => setTempMap(!tempMap)}
                    size="sm"
                    block
                  >
                    {" "}
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </CButton>
                </div>
              </CFormGroup>
            </CCol> */}
          </CFormGroup>
        </CCardBody>
      </CCard>

      {/* //menu */}
      <div class="pills-regular">
        <ul className="nav nav-pills mb-2" id="pills-tab" role="tablist">
          <li className="nav-item" id="members">
            <Button variant="contained" onClick={() => membersPage()}>
              Anggota
            </Button>
          </li>
          &ensp;
          <li className="nav-item" id="budgets" to="/projects/manage">
            <Button variant="contained" onClick={() => budgetsPage()}>
              Budget
            </Button>
          </li>
          &ensp;
          <li className="nav-item" id="tasks">
            <Button variant="contained" onClick={() => tasksPage()}>
              Task
            </Button>
          </li>
          &ensp;
          <li className="nav-item" id="approval">
            <Button
              color="primary"
              variant="contained"
              onClick={() => approvalPage()}
            >
              Persetujuan
            </Button>
          </li>
          &ensp;
        </ul>
      </div>

      {/* Members */}
      <CCard>
        <CCardHeader>
          <div>
            <span>
              <strong>Anggota project</strong>
            </span>
          </div>
        </CCardHeader>

        <CCardBody>
          <table
            tyle={{ width: "100%" }}
            class="table table-striped"
            id="members-datatable"
          >
            <thead>
              <tr>
                <th>Nama</th>

                <th>KTP</th>
                <th>Uang Harian</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="data-members"></tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* budget */}
      <CCard>
        <CCardHeader>
          <div>
            <span>
              <strong>Anggaran Project</strong>
            </span>
          </div>
        </CCardHeader>
        <CCardBody>
          <CFormGroup row className="my-0">
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="budget_start_date">
                  Tanggal Mulai anggaran{" "}
                </CLabel>
                <CInput
                  readOnly
                  required
                  name="budget_start_date"
                  id="budget_start_date"
                  placeholder=""
                  type="date"
                  value={budgetStartDate}
                />
              </CFormGroup>
            </CCol>
            <CCol xs="6">
              <CFormGroup>
                <CLabel htmlFor="budget_end_date">
                  Tanggal Akhir Anggaran
                </CLabel>
                <CInput
                  readOnly
                  required
                  name="budget_end_date"
                  id="budget_end_date"
                  placeholder=""
                  type="date"
                  value={budgetEndDate}
                />
              </CFormGroup>
            </CCol>
          </CFormGroup>
          <CCol xs="12">
            <CFormGroup>
              <CLabel htmlFor="budgets">Total Anggaran</CLabel>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>IDR</CInputGroupText>
                </CInputGroupPrepend>
                <CInput style={{ textAlign: "right" }} value={TotalProject} />
              </CInputGroup>
            </CFormGroup>
          </CCol>
          <br></br>
          <table
            tyle={{ width: "100%" }}
            class="table table-striped"
            id="budgets-datatable"
          >
            <thead s>
              <tr>
                <th>Nominal</th>
                <th>Tanggal Transfer</th>
                <th style={{ width: "30%" }}>Akun Transfer</th>
              </tr>
            </thead>
            <tbody id="data-budgets"></tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Task */}
      <CCard>
        <CCardHeader>
          <div>
            <span>
              <strong>Tugas Project</strong>
            </span>
          </div>
        </CCardHeader>
        <CCardBody>
          <table class="table table-striped" id="tasks-datatable">
            <thead>
              <tr style={{ width: "90%" }}>
                <th>Nama</th>

                <th width="20%">Status</th>
              </tr>
            </thead>
            <tbody id="data-tasks"></tbody>
          </table>
        </CCardBody>

        {/* Modal map */}
        <CModal
          show={tempMap}
          onClose={() => setTempMap(!tempMap)}
          size="lg col-50"
        >
          <CModalHeader closeButton>
            <CModalTitle></CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* <MapGL
              {...viewport}
              width="48vw"
              height="60vh"
              ref={mapRef}
              //  onViewportChange={setViewport}
              mapStyle={"mapbox://styles/mapbox/streets-v11"}
              onViewportChange={handleViewportChange}
              mapboxApiAccessToken={
                "pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg"
              }
            >
              <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                style={{
                  transform: `translate(${SIZE / 2 + UNIT}, ${SIZE / 2 + UNIT}`,
                }}
                offsetTop={-20}
                offsetLeft={-10}
              >
                <Pin size={20} />
              </Marker>

              <GeolocateControl style={geolocateStyle} />
              <FullscreenControl style={fullscreenControlStyle} />
              <NavigationControl style={navStyle} />
              <ScaleControl style={scaleControlStyle} />
            </MapGL>
            <ControlPanel events={events} /> */}
          </CModalBody>
          <CModalFooter>
            {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
            <CButton color="secondary" onClick={() => setTempMap(!tempMap)}>
              Tutup
            </CButton>
          </CModalFooter>
        </CModal>
      </CCard>
    </div>
  );
}
export default Approval;
