import React, { useState, useEffect, useCallback, useRef } from "react";
import DataTable from "react-data-table-component";
import { Formik, useFormik } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import { useHistory } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Checkbox from "@material-ui/core/Checkbox";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import _ from "lodash";
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
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CLabel,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import MapGL, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import ControlPanel from "./components/controll-panel";
import Pin from "./components/pin";
import MAP_STYLE from "./components/mapstyle";
import { fromJS } from "immutable";

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

var quotations = [];
var selected_quotation = [];

const SIZE = 100;
const UNIT = "px";
function Edit(props) {
  //varoable state
  const [collapsed, setCollapsed] = React.useState(true);
  const [showElements, setShowElements] = React.useState(true);
  const [modal, setModal] = useState(true);
  const [large, setLarge] = useState(false);
  const [tempMap, setTempMap] = useState(false);
  const [tempIds, setTempIds] = useState([]);
  const [tempQuotationNumber, setTempQuotationNumber] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [mainLoading, setMainloading] = useState(true);
  const [tempDateCreatedProject, setTempDateCreatedPeoject] = useState();

  //data edit projects
  const [tempQuotation, setTempQuotation] = useState([]);
  const [tempProjectNumber, setTempProjectNumber] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [projectNumber1, setProjectNumber1] = useState("");
  const [tempEventCustomer, setTempEventCustomer] = useState("");
  const [tempEventPic, setTempEventPic] = useState("");
  const [tempTotalProjectCost, setTotalProjectost] = useState("0");
  const [tempProjectCreatedDate, setTempProjectCreatedDate] = useState("");
  const [tempProjectStartDate, setTempProjectStartDate] = useState();
  const [tempProjectEndDate, settempProjectEndDate] = useState();
  const [tempLongtitude, setTempLongtitude] = useState();
  const [tempLatitude, setTempLatitude] = useState();
  const [tempDescription, setTempDescription] = useState();
  const [idProject, setIdProject] = useState();
  const [titleEvent, setTitleEvent] = useState("");
  const [tempLocation, setTempLocation] = useState();

  //handle change plugin geocoder
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),

    []
  );

  const columns_selected = [
    {
      name: "No. quotation",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.quotation_number}</div>
        </div>
      ),
    },
    {
      name: "Tanggal Quotation",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.date_quotation}</div>
        </div>
      ),
    },
    {
      name: "Title Event",
      width: "13%",

      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.tittle_event}</div>
        </div>
      ),
    },
    {
      name: "Venue",

      width: "13%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.venue_event}</div>
        </div>
      ),
    },
    {
      name: "No. PO",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.po_number}</div>
        </div>
      ),
    },
    {
      name: "Tanggal PO",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.date_po_number}</div>
        </div>
      ),
    },
    {
      name: "Customer",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.customer_event}</div>
        </div>
      ),
    },
    {
      name: "PIC Event",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.pic_event}</div>
        </div>
      ),
    },
    {
      name: "Nominal",
      sortable: true,
      right: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.netto.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
          </div>
        </div>
      ),
    },
  ];

  const columns = [
    {
      name: "",
      sortable: true,
      width: "7%",
      right: true,
      cell: (row) => (
        <FormControlLabel
          onChange={() => onCheck1(row)}
          control={
            <Checkbox
              color="primary"
              checked={
                tempQuotation.filter(
                  (e) => e.quotation_number === row.quotation_number
                ).length > 0
                  ? true
                  : false
              }
            />
          }
        />
      ),
    },
    {
      name: "No. quotation",
      sortable: true,
      width: "13%",
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.quotation_number}</div>
        </div>
      ),
    },
    {
      name: "Tanggal Quotation",
      sortable: true,
      width: "13%",
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.date_quotation}</div>
        </div>
      ),
    },
    {
      name: "Title Event",
      width: "13%",

      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.tittle_event}</div>
        </div>
      ),
    },
    {
      name: "Venue",
      width: "10%",

      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.venue_event}</div>
        </div>
      ),
    },
    {
      name: "No. PO",
      width: "13%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.po_number}</div>
        </div>
      ),
    },
    {
      name: "Tanggal PO",
      width: "13%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.date_po_number}</div>
        </div>
      ),
    },
    {
      name: "Customer",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.customer_event}</div>
        </div>
      ),
    },
    {
      name: "PIC Event",
      width: "13%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.pic_event}</div>
        </div>
      ),
    },
    {
      name: "Nominal",
      width: "15%",
      sortable: true,
      right: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.netto.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
          </div>
        </div>
      ),
    },
  ];

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
      console.log(newViewport.latitude);
      setMarker({
        latitude: newViewport.latitude,
        longitude: newViewport.longitude,
      });
      setTempLatitude(marker.latitude);
      setTempLongtitude(marker.longitude);

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },

    [handleViewportChange]
  );

  //css loader
  const override = css`
    border-color: red;
    top: 50%;
  `;

  //varible map react gl
  const [viewport, setViewport] = useState({
    longitude: 107.6684889,
    latitude: -6.942100215253297,
    zoom: 13.5,
  });
  const [marker, setMarker] = useState({
    longitude: 107.6684889,
    latitude: -6.942100215253297,
  });

  const [events, logEvents] = useState({});

  // const onMarkerDragStart = useCallback((event) => {
  //   logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  // }, []);

  // const onMarkerDrag = useCallback((event) => {
  //   logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
  // }, []);

  // const onMarkerDragEnd = useCallback((event) => {
  //   logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
  //   console.log("long :", event.lngLat[0]);
  //   setTempLatitude(event.lngLat[1]);
  //   setTempLongtitude(event.lngLat[0]);

  //   setMarker({
  //     longitude: event.lngLat[0],
  //     latitude: event.lngLat[1],
  //   });
  // }, []);

  //variable push page
  const navigator = useHistory();

  //variable data
  let ids = [];
  let quotationNumber = [];

  const onCheck1 = (row) => {
    console.log(row);

    //setTempQuotation([...tempQuotation,row ])
    const index = _.findIndex(tempQuotation, {
      quotation_number: row.quotation_number,
    });
    if (index >= 0) {
      setTempQuotation(
        tempQuotation.filter((quotation, i) => {
          return i !== index;
        })
      );
    } else {
      setTempQuotation([...tempQuotation, row]);
    }
  };

  const defaultChecked = () => {
    return false;
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "manage");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    let id = props.match.params.id;
    console.log(id);
    setIsloading(false);
    setMainloading(true);

    //get data detail
    axios
      .get(`${API_URL}/api/projects/detail-project/` + id)
      .then((response) => {
        console.log("detail projecs :", response);
        setProjectNumber(response.data.data.project_number);
        setProjectNumber1(response.data.data.project_number);

        //projecct create data
        let project_created_date = new Date(
          response.data.data.project_created_date
        );
        let date_crated = project_created_date.getDate();
        let month_created = project_created_date.getMonth() + 1;
        let year_created = project_created_date.getFullYear();
        setTempDateCreatedPeoject(
          year_created +
            "-" +
            "00".substr(String(month_created).length) +
            month_created +
            "-" +
            "00".substr(String(date_crated).length) +
            date_crated
        );

        //project start date
        let project_start_date = new Date(
          response.data.data.project_start_date
        );
        let date_start = project_start_date.getDate();
        let month_start = project_start_date.getMonth() + 1;
        let year_start = project_start_date.getFullYear();
        setTempProjectStartDate(
          year_start +
            "-" +
            "00".substr(String(month_start).length) +
            month_start +
            "-" +
            "00".substr(String(date_start).length) +
            date_start
        );
        console.log("tanggal mulai", tempProjectStartDate);

        //project end date
        let project_end_date = new Date(response.data.data.project_end_date);
        let date_end = project_end_date.getDate();
        let month_end = project_end_date.getMonth() + 1;
        let year_end = project_end_date.getFullYear();
        settempProjectEndDate(
          year_end +
            "-" +
            "00".substr(String(month_end).length) +
            month_end +
            "-" +
            "00".substr(String(date_end).length) +
            date_end
        );

        setTempEventPic(response.data.data.event_pic);
        setTempEventCustomer(response.data.data.event_pic);
        setTempLatitude(response.data.data.latitude);
        setTempLongtitude(response.data.data.longtitude);
        // setTempDescription(response.data.data.description);

        setTempLocation(response.data.data.location);

        // setMarker({
        //   latitude: parseFloat(response.data.data.latitude),
        //   longitude: parseFloat(response.data.data.longtitude),
        // });
        // setViewport({
        //   latitude: parseFloat(response.data.data.latitude),
        //   longitude: parseFloat(response.data.data.longtitude),
        //   zoom: 13.5,
        // });

        setTotalProjectost(
          response.data.data.total_project_cost
            .toString()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
        );
        setIdProject(response.data.data.id);
        setTempQuotationNumber(response.data.data.quotation_number);
        setTempIds(response.data.data.id_quotation);

        setTempQuotation([...response.data.data.quotations]);

        //laading false
        setMainloading(false);
        $("#description").val(response.data.data.description);
      })

      .catch((error) => {
        //loading false
        setMainloading(false);
      });

    //get data qutoation
    fetch(`${API_URL}/api/quotations`)
      .then((response) => response.json())
      .then((json) => {
        quotations = json["data"];
        console.log(quotations);
      });
    //get project number
    axios
      .get(`${API_URL}/api/projects/project-number`)
      .then((response) => {
        console.log("data project number ", response.data.data);
        setTempProjectNumber(response.data.data);
      })
      .catch((error) => {
        // this.setState({ errorMessage: error.message });
        console.error("There was an error!", error);
      });
  }, []);

  useEffect(() => {
    var grand_total = 0;
    if (tempQuotation.length > 0) {
      tempQuotation.map((value) => (grand_total += value.netto));
      tempQuotation.map((value) => ids.push(value.id));
      tempQuotation.map((value) =>
        quotationNumber.push(value.quotation_number)
      );
      console.log(tempQuotation);

      //set data value quotation
      setTempEventPic(tempQuotation[0]["pic_event"]);
      setTempEventCustomer(tempQuotation[0]["customer_event"]);
      console.log(`${tempQuotation[0]["code"]}`);
      tempQuotation[0]["code"] == null
        ? setProjectNumber(`${projectNumber1}`)
        : setProjectNumber(`${tempQuotation[0]["code"]}${tempProjectNumber}`);
      setTotalProjectost(tempQuotation[0]["netto"]);
      setTotalProjectost(
        grand_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
      );
      setTitleEvent(tempQuotation[0]["tittle_event"]);
      $("#description").val(
        `${tempQuotation[0]["tittle_event"]} | ${tempQuotation[0]["venue_event"]} | ${tempQuotation[0]["date_event"]}`
      );
      // setTempDescription(
      //   `${tempQuotation[0]["tittle_event"]} | ${tempQuotation[0]["venue_event"]} | ${tempQuotation[0]["date_event"]}`
      // );
    } else {
      $("#description").val("");

      setTempEventPic("");
      setTempEventCustomer("");
      setTotalProjectost("0");
      setTitleEvent("0");
    }
    //set data list quotation
    setTempIds([...ids]);
    setTempQuotationNumber([...quotationNumber]);
  }, [tempQuotation]);

  const onCheck = (state) => {
    selected_quotation = [];
    let grand_total = 0;

    setTempQuotation([...state.selectedRows]);
    if (state.selectedRows.length > 0) {
      state.selectedRows.map((value) => (grand_total += value.netto));
      state.selectedRows.map((value) => ids.push(value.id));
      state.selectedRows.map((value) =>
        quotationNumber.push(value.quotation_number)
      );

      //set data value quotation
      setTempEventPic(state.selectedRows[0]["pic_event"]);
      setTempEventCustomer(state.selectedRows[0]["customer_event"]);
      setTotalProjectost(state.selectedRows[0]["netto"]);
      setTotalProjectost(
        grand_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
      );
    } else {
      setTempEventPic("");
      setTempEventCustomer("");
      setTotalProjectost("");
    }
    //set data list quotation
    setTempIds([...ids]);
    setTempQuotationNumber([...quotationNumber]);
  };

  return (
    <div>
      {mainLoading === false ? (
        <CCard>
          <CCardHeader>
            <span>
              <strong>Ubah Project</strong>
            </span>
          </CCardHeader>
          <CCardBody>
            <Formik
              initialValues={{
                project_start_date: tempProjectStartDate,
                project_end_date: tempProjectEndDate,

                location: tempLocation,
              }}
              validate={(values) => {
                const errors = {};
                if (!values.project_start_date) {
                  errors.project_start_date = "Required";
                } else if (!values.project_end_date) {
                  errors.project_end_date = "Required";
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setIsloading(true);
                const data = {
                  project_number: projectNumber,
                  project_created_date: tempDateCreatedProject,
                  project_start_date: values.project_start_date,
                  project_end_date: values.project_end_date,
                  event_customer: tempEventCustomer,
                  event_pic: tempEventPic,
                  total_project_cost: tempTotalProjectCost.replace(
                    /[^\w\s]/gi,
                    ""
                  ),
                  description: $("#description").val(),
                  latitude: tempLatitude,
                  longtitude: tempLongtitude,
                  id_quotation: tempIds,
                  location: values.location,

                  quotation_number: tempQuotationNumber.toString(),
                };

                axios
                  .patch(
                    `${API_URL}/api/projects/edit-project/` + idProject,
                    data
                  )
                  .then((response) => {
                    console.log(response);
                    Swal.fire({
                      title: "success",
                      text: "Project berhasil diubah",
                      icon: "success",
                      timer: 2000,
                      showConfirmButton: false,
                    }).then((_) => {
                      navigator.push("/projects/manage");
                    });
                  })
                  .catch((error) => {
                    // this.setState({ errorMessage: error.message });
                    console.error("There was an error!", error);
                    setIsloading(false);
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
                <form onSubmit={handleSubmit}>
                  <CFormGroup row className="my-0">
                    <CCol xs="6">
                      <CFormGroup>
                        <CLabel htmlFor="Project_number">No. Project</CLabel>
                        <CInput
                          required
                          id="project_number"
                          placeholder=""
                          name="project_number"
                          onChange={handleChange}
                          value={projectNumber}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="6">
                      <CFormGroup>
                        <CLabel htmlFor="Project_created_date">
                          Tanggal Buat Project
                        </CLabel>
                        <CInput
                          required
                          id="project_created_date"
                          name="project_created_date"
                          placeholder=""
                          type="date"
                          onChange={handleChange}
                          value={tempDateCreatedProject}
                        />
                      </CFormGroup>
                    </CCol>

                    <CCol xs="6">
                      <CFormGroup>
                        <CLabel htmlFor="project_start_date">
                          Tanggal Mulai Project
                        </CLabel>
                        <CInput
                          required
                          id="project_start_date"
                          name="project_start_date"
                          placeholder=""
                          type="date"
                          onChange={handleChange}
                          value={values.project_start_date}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="6">
                      <CFormGroup>
                        <CLabel htmlFor="project_end_date">
                          Tanggal Akhir Project
                        </CLabel>
                        <CInput
                          required
                          id="project_end_date"
                          name="project_end_date"
                          placeholder=""
                          type="date"
                          onChange={handleChange}
                          value={values.project_end_date}
                        />
                      </CFormGroup>
                    </CCol>

                    <CCol xs="6">
                      <CFormGroup>
                        <CLabel required htmlFor="event_customer">
                          Customer Event
                        </CLabel>
                        <CInput
                          required
                          readonly
                          id="event_customer"
                          name="event_customer"
                          placeholder=""
                          onChange={handleChange}
                          value={tempEventCustomer}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="6">
                      <CFormGroup>
                        <CLabel htmlFor="event_pic">PIC Event</CLabel>
                        <CInput
                          id="event_pic"
                          name="event_pic"
                          placeholder=""
                          onChange={handleChange}
                          value={tempEventPic}
                        />
                      </CFormGroup>
                    </CCol>

                    <CCol xs="6">
                      <CFormGroup>
                        <CLabel htmlFor="description">Deskripsi</CLabel>
                        <CInput
                          id="description"
                          name="description"
                          placeholder=""
                          onChange={handleChange}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="6">
                      <CFormGroup>
                        <CLabel htmlFor="total_project_cost">Nominal</CLabel>
                        <CInputGroup>
                          <CInputGroupPrepend>
                            <CInputGroupText>IDR</CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            style={{ textAlign: "right" }}
                            id="total_project_cost"
                            name="total_project_cost"
                            onChange={handleChange}
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
                          onChange={handleChange}
                          value={values.location}
                        />
                      </CFormGroup>
                    </CCol>

                    {/* <CCol xs="5">
                      <CFormGroup>
                        <CLabel htmlFor="latitude">Latitude</CLabel>
                        <CInput
                          id="latitude"
                          name="latitude"
                          placeholder=""
                          onChange={handleChange}
                          value={tempLatitude}
                        />
                      </CFormGroup>
                    </CCol> */}
                    {/* <CCol xs="5">
                      <CFormGroup>
                        <CLabel htmlFor="longtitude">Longitude</CLabel>
                        <CInput
                          id="longtitude"
                          name="longtitude"
                          placeholder=""
                          onChange={handleChange}
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
                  <br />
                  <div style={{ textAlign: "right", width: "100%" }}>
                    <CButton
                      style={{ width: "155px" }}
                      size="sm"
                      onClick={() => setLarge(!large)}
                      color="primary"
                    >
                      <span className="mfs-2">Pilih Quotation</span>
                    </CButton>
                  </div>
                   <DataTable columns={columns_selected} data={tempQuotation} />
                   
                  <CCardFooter>
                    <div style={{ textAlign: "right" }}>
                      <CButton
                        to="/projects/manage"
                        disabled={isLoading}
                        size="sm col-1"
                        className="btn-secondary btn-brand mr-1 mb-1"
                      >
                        <span className="mfs-2">Kembali</span>
                      </CButton>
                      <CButton
                        disabled={isLoading}
                        type="submit"
                        size="sm col-1"
                        className="btn-brand mr-1 mb-1"
                        color="primary"
                      >
                        {isLoading ? (
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

            {/* //modal quotation */}
            <CModal show={large} onClose={() => setLarge(!large)} size="lg">
              <CModalHeader closeButton>
                <CModalTitle>List Semua Quotation</CModalTitle>
              </CModalHeader>
              <CModalBody>
                 
                <DataTable
                  columns={columns}
                  data={quotations}
                  paginationPerPage={5}
                  pagination
                  defaultSortFieldId
                  sortable
                />
                 
                <hr />
                <div>
                  <span>Data quotation terpilih</span>
                </div>
                 <DataTable columns={columns_selected} data={tempQuotation} /> 
              </CModalBody>
              <CModalFooter>
                {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
                <CButton color="secondary" onClick={() => setLarge(!large)}>
                  Tutup
                </CButton>
              </CModalFooter>
            </CModal>

            {/* //modal amp */}
            <CModal
              show={tempMap}
              onClose={() => setLarge(!tempMap)}
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
                > */}
                {/* <Geocoder
                    mapRef={mapRef}
                    onViewportChange={handleGeocoderViewportChange}
                    mapboxApiAccessToken={
                      "pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg"
                    }
                    marker={false}
                    position="top-right"
                  /> */}
                {/* <Marker
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    style={{
                      transform: `translate(${SIZE / 2 + UNIT}, ${
                        SIZE / 2 + UNIT
                      }`,
                    }}
                    offsetTop={-20}
                    offsetLeft={-10}
                    draggable
                    // onDragStart={onMarkerDragStart}
                    // onDrag={onMarkerDrag}
                    onDragEnd={onMarkerDragEnd}
                  >
                    <Pin size={20} />
                  </Marker>

                  <GeolocateControl style={geolocateStyle} />
                  <FullscreenControl style={fullscreenControlStyle} />
                  <NavigationControl style={navStyle} />
                  <ScaleControl style={scaleControlStyle} />
                </MapGL> */}
                <ControlPanel events={events} />
              </CModalBody>
              <CModalFooter>
                {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
                <CButton color="secondary" onClick={() => setLarge(!tempMap)}>
                  Tutup
                </CButton>
              </CModalFooter>
            </CModal>
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
