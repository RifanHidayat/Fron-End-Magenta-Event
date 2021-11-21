import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import DataTable from "react-data-table-component";
import { Formik } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import { useHistory } from "react-router-dom";
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
import { fromJS } from "immutable";
import FilterComponent from "src/views/base/components/FilterComponent";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import _ from "lodash";
import $ from "jquery";
import { API_URL, METAPRINT_API } from "src/views/base/components/constants";
import Alert from "@material-ui/lab/Alert";

import Button from "@material-ui/core/Button";
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

const TOKEN =
  "pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg"; // Set your mapbox token here

const defaultMapStyle = fromJS(MAP_STYLE);
const defaultLayers = defaultMapStyle.get("layers");

const categories = [
  "labels",
  "roads",
  "buildings",
  "parks",
  "water",
  "background",
];

// Layer id patterns by category
const layerSelector = {
  background: /background/,
  water: /water/,
  parks: /park/,
  buildings: /building/,
  roads: /bridge|road|tunnel/,
  labels: /label|place|poi/,
};

// Layer color class by type
const colorClass = {
  line: "line-color",
  fill: "fill-color",
  background: "background-color",
  symbol: "text-color",
};

function getMapStyle({ visibility, color }) {
  const layers = defaultLayers
    .filter((layer) => {
      const id = layer.get("id");
      return categories.every(
        (name) => visibility[name] || !layerSelector[name].test(id)
      );
    })
    .map((layer) => {
      const id = layer.get("id");
      const type = layer.get("type");
      const category = categories.find((name) => layerSelector[name].test(id));
      if (category && colorClass[type]) {
        return layer.setIn(["paint", colorClass[type]], color[category]);
      }
      return layer;
    });

  return defaultMapStyle.set("layers", layers);
}

function Create() {
  const dateFormat = require("dateformat");
  const columns = [
    {
      name: "",
      sortable: true,
      width: "5%",
      cell: (row) => (
        <FormControlLabel
          onChange={() => onCheck1(row)}
          control={<Checkbox color="primary" />}
        />
      ),
    },
    {
      name: "No. SO",
      width: "15%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.number}</div>
        </div>
      ),
    },
    {
      name: "Tanggal SO",
      width: "15%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.date}</div>
        </div>
      ),
    },

    {
      name: "Deskripsi",
      width: "20%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.source === "quotation"
              ? row.v2_quotation.description
              : row.source === "purchase_order"
              ? row.customer_purchase_order.description
              : ""}
          </div>
        </div>
      ),
    },
    {
      name: "Source",
      width: "20%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.source}</div>
        </div>
      ),
    },
    {
      name: "Deskripsi",
      width: "20%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.source === "quotation"
              ? row.v2_quotation.number
              : row.source === "purchase_order"
              ? row.customer_purchase_order.number
              : ""}
          </div>
        </div>
      ),
    },

    {
      name: "Customer",
      width: "15%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.customer == null ? "" : row.customer.name}</div>
        </div>
      ),
    },

    // {
    //   name: "PIC Event",
    //   sortable: true,
    //   cell: (row) => (
    //     <div data-tag="allowRowEvents">
    //       <div>{row.number}</div>
    //     </div>
    //   ),
    // },
    {
      name: "Nominal",
      sortable: true,
      right: true,
      width: "15%",
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <div>
              {row.source === "quotation"
                ? row.v2_quotation.total
                : row.source === "purchase_order"
                ? row.customer_purchase_order.total
                : ""}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const columns_selected = [
    {
      name: "No. SO",
      width: "15%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.number}</div>
        </div>
      ),
    },
    {
      name: "Tanggal SO",
      width: "15%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.date}</div>
        </div>
      ),
    },

    {
      name: "Deskripsi",
      width: "20%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.source === "quotation"
              ? row.v2_quotation.description
              : row.source === "purchase_order"
              ? row.customer_purchase_order.description
              : ""}
          </div>
        </div>
      ),
    },
    {
      name: "Source",
      width: "20%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.source}</div>
        </div>
      ),
    },
    {
      name: "Number",
      width: "20%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.source === "quotation"
              ? row.v2_quotation.number
              : row.source === "purchase_order"
              ? row.customer_purchase_order.number
              : ""}
          </div>
        </div>
      ),
    },

    {
      name: "Customer",
      width: "15%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.customer == null ? "" : row.customer.name}</div>
        </div>
      ),
    },

    // {
    //   name: "PIC Event",
    //   sortable: true,
    //   cell: (row) => (
    //     <div data-tag="allowRowEvents">
    //       <div>{row.number}</div>
    //     </div>
    //   ),
    // },
    {
      name: "Nominal",
      sortable: true,
      right: true,
      width: "15%",
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <div>
              {row.source === "quotation"
                ? row.v2_quotation.total
                : row.source === "purchase_order"
                ? row.customer_purchase_order.total
                : ""}
            </div>
          </div>
        </div>
      ),
    },
  ];

  //varoable state

  const [large, setLarge] = useState(false);
  const [tempMap, setTempMap] = useState(false);
  const [tempQuotation, setTempQuotation] = useState([]);
  const [tempProjectNumber, setTempProjectNumber] = useState("");
  const [tempEventCustomer, setTempEventCustomer] = useState("");
  const [tempEventPic, setTempEventPic] = useState("");
  const [tempTotalProjectCost, setTotalProjectost] = useState("0");
  const [tempIds, setTempIds] = useState([]);
  const [tempQuotationNumber, setTempQuotationNumber] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [tempDateCreatedProject, setTempDateCreatedPeoject] = useState();
  const [tempLatitude, setTempLatitude] = useState("");
  const [tempLongtitude, setTempLongtitude] = useState("");
  const [projectNumber, setProjectNumber] = useState();

  const [titleEvent, setTitleEvent] = useState("");

  const t = [];

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),

    []
  );

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

  //varible map react gl
  const [viewport, setViewport] = useState({
    longitude: 107.6684889,
    latitude: -6.9504246,
    zoom: 13.5,
  });
  const [marker, setMarker] = useState({
    longitude: 107.6684889,
    latitude: -6.9504246,
  });

  const [events, logEvents] = useState({});

  // const onMarkerDragStart = useCallback(event => {
  //   logEvents(_events => ({..._events, onDragStart: event.lngLat}));
  // }, []);

  // const onMarkerDrag = useCallback(event => {
  //   logEvents(_events => ({..._events, onDrag: event.lngLat}));
  // }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    console.log("long :", event.lngLat[0]);
    setTempLatitude(event.lngLat[1]);
    setTempLongtitude(event.lngLat[0]);
    console.log(event);

    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);

  //map style
  const [visibility, setVisibility] = useState({
    water: true,
    parks: true,
    buildings: true,
    roads: true,
    labels: true,
    background: true,
  });

  const [color, setColor] = useState({
    water: "#DBE2E6",
    parks: "#E6EAE9",
    buildings: "#c0c0c8",
    roads: "#ffffff",
    labels: "#78888a",
    background: "#EBF0F0",
  });

  //variable push page
  const navigator = useHistory();

  //variable data
  let ids = [];
  let quotationNumber = [];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "manage");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    setIsloading(false);

    // var data="-101.84452, 39.71375";
    // console.log('data parsing :',data.split(",")[0])

    //project create date
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    setTempDateCreatedPeoject(
      year +
        "-" +
        "00".substr(String(month).length) +
        month +
        "-" +
        "00".substr(String(date).length) +
        date
    );
    //console.log(year+'-'+month+'-'+date)

    //get data qutoation
    fetch(`${METAPRINT_API}/api/sales-orders`)
      .then((response) => response.json())
      .then((json) => {
        quotations = json["data"];
        console.log("data metaprint", quotations);
      });

    //get project number
    axios
      .get(`${API_URL}/api/projects/project-number`)
      .then((response) => {
        console.log("data project number ", response.data.data);
        setTempProjectNumber(response.data.data);
        setProjectNumber(response.data.data);
      })
      .catch((error) => {
        // this.setState({ errorMessage: error.message });
        console.error("There was an error!", error);
      });
  }, []);

  useEffect(() => {
    var grand_total = 0;
    if (tempQuotation.length > 0) {
      tempQuotation.map(
        (value) =>
          (grand_total +=
            value.v2_quotation == null ? 0 : value.v2_quotation.total)
      );
      tempQuotation.map((value) => ids.push(value.id));
      tempQuotation.map((value) => quotationNumber.push(value.number));

      //set data value quotation
      console.log("te", tempQuotation[0]);
      setTempEventPic(
        tempQuotation[0]["v2_quotation"] == null
          ? ""
          : tempQuotation[0]["v2_quotation"]["up"]
      );
      setProjectNumber(`${tempQuotation[0]["code"]}${tempProjectNumber}`);
      setTempEventCustomer(
        tempQuotation[0]["customer"] == null
          ? ""
          : tempQuotation[0]["customer"]["name"]
      );
      // setTotalProjectost(tempQuotation[0]["netto"]);
      setTotalProjectost(
        grand_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
      );
      setTitleEvent(
        tempQuotation[0]["v2_quotation"] == null
          ? ""
          : tempQuotation[0]["v2_quotation"]["title"]
      );
      // $("#description").val(
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

  var lenghth = 0;
  const onCheck1 = (row) => {
    console.log(row);
    //setTempQuotation([...tempQuotation,row ])
    const index = _.findIndex(tempQuotation, {
      number: row.number,
    });
    if (index >= 0) {
      setTempQuotation(
        tempQuotation.filter((quotation, i) => {
          return i !== index;
        })
      );
      lenghth = Number(lenghth) - 1;
    } else {
      setTempQuotation([...tempQuotation, row]);
      lenghth = Number(lenghth) + 1;
    }
  };

  const onCheck = (state) => {
    selected_quotation = [];
    let grand_total = 0;
    console.log(state.selectedRows);

    setTempQuotation([...state.selectedRows]);
    if (state.selectedRows.length > 0) {
      state.selectedRows.map((value) => (grand_total += value.grand_total));
      state.selectedRows.map((value) => ids.push(value.id));
      state.selectedRows.map((value) =>
        quotationNumber.push(value.quotation_number)
      );

      //set data value quotation
      setTempEventPic(state.selectedRows[0]["pic_event"]);
      setTempEventCustomer(state.selectedRows[0]["customer_event"]);
      setTotalProjectost(state.selectedRows[0]["grand_total"]);
      setTotalProjectost(
        grand_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
      );
    } else {
      setTempEventPic("");
      setTempEventCustomer("");
      setTotalProjectost("0");
    }
    //set data list quotation
    setTempIds([...ids]);
    setTempQuotationNumber([...quotationNumber]);
  };

  const SIZE = 100;
  const UNIT = "px";

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const filteredItems = quotations.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

  function pageEO() {
    navigator.push(`/projects/eo/create`);
  }
  function pageMetaprint() {
    navigator.push(`/projects/metaprint/create`);
  }

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
      <Alert severity="info" className="mb-2">
        Dibawah dapat terlihat project event organizer dan metaprint
      </Alert>
      <div class="pills-regular">
        <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">
          <li class="nav-item" id="members">
            <Button variant="contained" onClick={() => pageEO()}>
              Event Organizer
            </Button>
          </li>
          &ensp;
          <li class="nav-item" id="budgets" to="/projects/manage">
            {/* cash out by Ralf Schmitzer from the Noun Project */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => pageMetaprint()}

              // startIcon={<DeleteIcon />}
            >
              Metaprint
            </Button>
          </li>
          &ensp;
        </ul>
      </div>
      <CCard>
        <CCardHeader>
          <span>
            <strong>Buat Project</strong>
          </span>
        </CCardHeader>
        <CCardBody>
          <Formik
            initialValues={{
              project_start_date: "",
              project_end_date: "",
              latitude: "",
              longtitude: "",
              description: titleEvent,
              location: "",
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
              // tempQuotation.map((value) => ids.push(value.id));
              // tempQuotation.selectedRows.map((value) => quotationNumber.push(value.quotation_number));
              setIsloading(true);
              // console.log('marker drag end',onMarkerDragEnd);
              // console.log(ids)

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
                status: "approved",
                quotation_number: tempQuotationNumber.toString(),
                quotations: tempQuotation,
                location: values.location,
                source: "metaprint",
              };

              axios
                .get(`${API_URL}/api/quotations/checked?ids=${tempIds}`)
                .then((response) => {
                  setIsloading(false);
                  // if (response.data.data.length > 0) {
                  //   Swal.fire({
                  //     title: "info",
                  //     text: ``,
                  //     icon: "info",

                  //     showConfirmButton: true,
                  //   });
                  // } else {
                  axios
                    .post(`${API_URL}/api/projects/create-project`, data)
                    .then((response) => {
                      console.log(response);
                      Swal.fire({
                        title: "success",
                        text: "Project berhasil dibuat",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                      }).then((_) => {
                        setIsloading(false);
                        navigator.push("/projects/manage");
                      });
                    })
                    .catch((error) => {
                      setIsloading(false);

                      // this.setState({ errorMessage: error.message });
                      console.error("There was an error!", error);
                      setIsloading(false);
                    });
                  // }
                })
                .catch((error) => {});
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
                  {/* 
                  <CCol xs="5">
                    <CFormGroup>
                      <CLabel htmlFor="latitude">Latitude</CLabel>
                      <CInput
                        required
                        id="latitude"
                        name="latitude"
                        placeholder=""
                        value={tempLatitude}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="5">
                    <CFormGroup>
                      <CLabel htmlFor="longtitude">Longitude</CLabel>
                      <CInput
                        required
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
                </CFormGroup>
                <br />
                <div style={{ textAlign: "right", width: "100%" }}>
                  <CButton
                    style={{ width: "155px" }}
                    size="sm col"
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
                      color="secondary"
                    >
                      <span className="mfs-2">Kembali</span>
                    </CButton>
                    &ensp;{" "}
                    <CButton
                      disabled={isLoading}
                      type="submit"
                      size="sm col-1"
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
                title=""
                columns={columns}
                data={filteredItems}
                defaultSortField="name"
                subHeaderComponent={subHeaderComponent}
                subHeader
                pagination
                paginationDefaultPage
                paginationPerPage={5}
              />
              <hr />
              <div>
                <span>Data quotation terpilih</span>
              </div>
               <DataTable columns={columns_selected} data={tempQuotation} /> 
            </CModalBody>
            <CModalFooter>
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
              <MapGL
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
                <Geocoder
                  mapRef={mapRef}
                  onViewportChange={handleGeocoderViewportChange}
                  mapboxApiAccessToken={
                    "pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg"
                  }
                  marker={false}
                  position="top-right"
                />
                <Marker
                  longitude={marker.longitude}
                  latitude={marker.latitude}
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
              </MapGL>
              <ControlPanel events={events} />
            </CModalBody>
            <CModalFooter>
              {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
              <CButton color="secondary" onClick={() => setTempMap(!tempMap)}>
                Tutup
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Create;
