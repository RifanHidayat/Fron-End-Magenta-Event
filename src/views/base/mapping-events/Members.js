import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./css/style.css";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import $ from "jquery";
import { MDBDataTableV5 } from "mdbreact";
import { getDataEmployess } from "./data/employees";
import { Projects } from "./components/Projects";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterComponent from "src/views/base/components/FilterComponent";
import BootstrapTable from "react-bootstrap-table-next";
import "jquery/dist/jquery.min.js";
import Button from "@material-ui/core/Button";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import Checkbox from "@material-ui/core/Checkbox";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import _ from "lodash";
import { API_URL } from "src/views/base/components/constants";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
} from "@coreui/react";

function Members(props) {
  const [tempMembers, setTempMembers] = useState([]);
  const [modalMembers, setModalMembers] = useState(false);
  const [tempSelectedMembers, setTempSelectedMembers] = useState([]);
  const [employess, setEmployess] = useState([]);
  const [datatable, setDatatable] = React.useState({});

  //loading spinner
  const [tempIsloadingMembers, setTempIsLoadingMembers] = useState(false);
  const [tempsIsLoadinAddMembers, setTempIloadingAddMembers] = useState(true);
  const [status, setStatus] = useState();

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const [tempIdMembers, setTempidmembers] = useState([]);

  const columns = [
    {
      name: "",
      sortable: true,
      right: true,
      width: "10%",
      cell: (row) => (
        <FormControlLabel
          onChange={() => onCheck1(row)}
          control={
            <Checkbox
              color="primary"
              defaultChecked={
                tempSelectedMembers.filter(
                  (e) => e.employee_id === row.employee_id
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
      name: "Pegawai",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <div>{row.first_name}</div>
            <div>{row.employee_id}</div>
          </div>
        </div>
      ),
      defaultSortField: true,
      defaultSortAsc: false,
    },
    {
      name: "KTP/NPWP",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.identity_number}</div>
        </div>
      ),
    },
    {
      name: "Uang Harian",
      sortable: true,
      right: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            IDR{" "}
            {row.daily_money_regular
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
          </div>
        </div>
      ),
    },
  ];

  const options = [
    { value: "member", label: "Anggota" },
    { value: "pic", label: "PIC" },
  ];

  const columns_selected_members = [
    {
      name: "Pegawai",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <div>{row.first_name} </div>
            <div>{row.employee_id}</div>
          </div>
        </div>
      ),
    },
    {
      name: "KTP/NPWP",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.identity_number}</div>
        </div>
      ),
    },
    {
      name: "Uang Harian",
      sortable: true,
      right: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.daily_money_regular
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
          </div>
        </div>
      ),
    },

    {
      name: "Status",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <br />
            <br />
            <br />
            <div className="select">
              <Select
                defaultValue={options[1]}
                className="basic-single"
                classNamePrefix="select"
                options={options}
                name="color"
              />
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
        </div>
      ),
    },
  ];

  const filteredItems = employess.filter(
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

  const setDataMembersSelected = (data) => {
    var row = "";
    if (data.length === 0) {
    } else {
      for (var i = 0; i < data.length; i++) {
        row += `<tr >
                  <td>${data[i].first_name}<br> ${data[i].employee_id}</td>
                 
                   <td>${data[i].identity_number}</td>
                   <td> 
                   IDR ${data[i].daily_money_regular
                     .toString()
                     .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                   </td>
                    <td>
                    ${data[i].status === "pic" ? "PIC" : "Anggota"}
                     </td>
                   </tr>
          `;
      }
      $("#data-members-selected").html(row);
    }
  };

  //toast success

  const setDataMembers = (data) => {
    setDatatable({
      columns: [
        {
          label: "Id Pegawai",
          field: "employee_id",
          width: 150,
          attributes: {
            "aria-controls": "DataTable",
            "aria-label": "Name",
          },
        },
        {
          label: "Nama",
          field: "name",
          width: 270,
          textAlign: "right",
        },
        {
          label: "KTP",
          field: "identity_number",
          width: 200,
        },
        {
          label: "Uang Harian",
          field: "daily_money_regular",
        },
        {
          label: "Status",
          field: "status",
          sort: "disabled",
          width: 150,
        },
      ],
      rows: JSON.parse(data),
    });
  };

  const setDataSelectedMembers = (data) => {
    var row = "";
    if (data.length === 0) {
    } else {
      for (var i = 0; i < data.length; i++) {
        var selected = data[i].status == "pic" ? "selected" : "";
        row += `<tr id="${data[i].employee_id}">
                  <td>${data[i].employee_id}</td>
                  <td>${data[i].first_name}</td>
                   <td>${data[i].identity_number}</td>
                   <td> 
                      <input id='${
                        data[i].employee_id
                      }_input' style={{textAlign:'right'}}  type="text" value='${data[
          i
        ].daily_money_regular
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}'>
                   </td>
                    <td>
                      <select name="cars" id="cars">
                      <option ${selected}  value="members">Anggota</option>
                      <option ${selected}  value="pic">PIC</option>
                    </select> 
                     </td>
                     <td hidden>${data[i].id}</td>
                   </tr>
          `;
        //masking
      }
      $("#data-members").html(row);
    }
  };

  const saveMembers = (data) => {
    setTempIsLoadingMembers(true);
    var id = props.match.params.id;
    var data_members = [];
    $("#use-datatable tbody tr").each(function () {
      var employee_id = $(this)
        .find("td:nth-child(1)")
        .text()
        .toString()
        .trim();
      var name = $(this).find("td:nth-child(2)").text().toString().trim();
      var identity_number = $(this)
        .find("td:nth-child(3)")
        .text()
        .toString()
        .trim();
      var daily_money_regular = $(this)
        .find("td:nth-child(4) input")
        .val()
        .toString()
        .trim()
        .replace(/[^\w\s]/gi, "");
      var status = $(this)
        .find("td:nth-child(5) select")
        .val()
        .toString()
        .trim();
      var id = $(this).find("td:nth-child(6)").text().toString().trim();
      var data = {
        id: id,
        employee_id: employee_id,
        first_name: name,
        identity_number: identity_number,
        daily_money_regular: parseInt(daily_money_regular),
        status: status,
      };
      data_members.push(data);
    });
    const req_data = {
      members: JSON.stringify(data_members),
      members_id: tempIdMembers.toString(),
    };

    axios
      .patch(`${API_URL}/api/projects/` + id + "/save-members/", req_data)
      .then((response) => {
        //setDataMembers(JSON.stringify(data_members))
        setTempMembers([...data_members]);
        setTempIsLoadingMembers(false);
        setModalMembers(false);
        toast.success("Berhasil menambahkan anggota project", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          color: "success",
        });
        setDataMembersSelected(data_members);
        $("#members-datatable").DataTable();
      })
      .then((error) => {
        setTempIsLoadingMembers(false);
      });
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "mapping");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    var id = props.match.params.id;
    //all employess eo
    getDataEmployess().then((response) => {
      //  members=response;
      setEmployess([...response]);
      setTempIloadingAddMembers(false);
      setTempIsLoadingMembers(false);
    });
    //get data members
    axios
      .get(`${API_URL}/api/projects/detail-project/` + id)
      .then((response) => {
        if (response.data.data.members !== null) {
          setTempSelectedMembers([...response.data.data.members]);
          setTempMembers([...response.data.data.members]);
          setDataMembersSelected([...response.data.data.members]);
          setDataSelectedMembers([...response.data.data.members]);
          //onCheck([...tempSelectedMembers])
          setStatus(response.data.data.status);
          $("#members-datatable").DataTable();
        } else {
          setStatus(response.data.data.status);
        }
      })
      .catch((error) => {
        console.log("tes");
      });
  }, []);

  useEffect(() => {
    console.log(tempSelectedMembers);
    tempSelectedMembers.map((value) => {
      $(document).on("input", `#${value.employee_id}_input`, function (e) {
        e.preventDefault();
        var objek = $(`#${value.employee_id}_input`).val();
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
        $(`#${value.employee_id}_input`).val(c);
      });
    });
    //setDataMembersSelected(tempSelectedMembers)
    //setDataSelectedMembers(tempSelectedMembers)
  }, [tempSelectedMembers]);

  var row = "";
  const myFunction = () => {
    console.log("ee");
  };
  const onCheck1 = (row) => {
    const index = _.findIndex(tempSelectedMembers, {
      employee_id: row.employee_id,
    });
    if (index >= 0) {
      setTempSelectedMembers(
        tempSelectedMembers.filter((quotation, i) => {
          return i !== index;
        })
      );
      $(`#${row.employee_id}`).remove();
    } else {
      setTempSelectedMembers([...tempSelectedMembers, row]);

      row += `<tr id="${row.employee_id}">
                  <td>${row.employee_id}</td>
                  <td>${row.first_name}</td>
                   <td>${row.identity_number}</td>
                   <td> 
                      <input  id="${
                        row.employee_id
                      }_input" style={{textAlign:'right'}}  type="text" value='${row.daily_money_regular
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}'>
                   </td>
                    <td>
                      <select name="cars" id="cars">
                      <option value="members">Anggota</option>
                      <option value="pic">PIC</option>
                    </select> 
                     </td>
                     <td hidden>${row.id}</td>
                   </tr>
          `;

      $("#data-members").append(row);

      //
    }
  };

  // selection table
  const onCheck = (state) => {
    var members_id = [];
    if (state.selectedRows.length > 0) {
      state.selectedRows.map((value) => members_id.push(value.id));
    } else {
    }

    setTempSelectedMembers([...state.selectedRows]);
    setDataSelectedMembers(state.selectedRows);
    setTempidmembers([...members_id]);
  };

  return (
    <div>
      <ToastContainer />
      <Projects id={props.match.params.id}></Projects>
      {/* //menu */}
      <div className="pills-regular">
        <ul className="nav nav-pills mb-2" id="pills-tab" role="tablist">
          <li className="nav-item" id="members">
            <Button
              variant="contained"
              color="primary"
              onClick={() => membersPage()}
            >
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
            <Button variant="contained" onClick={() => approvalPage()}>
              Persetujuan
            </Button>
          </li>
          &ensp;
        </ul>
      </div>

      {/* Members */}
      <CCard>
        <CCardHeader>
          <div style={{ float: "right", width: "100%" }}>
            <div style={{ float: "left", position: "absolute" }}>
              <span>
                <strong>Anggota Project</strong>
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              {status !== "closed" ? (
                <CButton
                  disabled={tempsIsLoadinAddMembers}
                  onClick={() => setModalMembers(!modalMembers)}
                  size="sm"
                  className="btn-brand mr-1 mb-1"
                  color="primary"
                >
                  {tempMembers.length <= 0 ? (
                    <span>
                      {tempsIsLoadinAddMembers ? (
                        <i class="fas fa-circle-notch fa-spin" />
                      ) : (
                        <i class="fa fa-plus" />
                      )}{" "}
                      Tambah
                    </span>
                  ) : (
                    <span>
                      {tempsIsLoadinAddMembers ? (
                        <i class="fas fa-circle-notch fa-spin" />
                      ) : (
                        <i class="fa fa-edit" />
                      )}{" "}
                      Ubah
                    </span>
                  )}
                </CButton>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          {tempMembers == "" ? (
            <div style={{ textAlign: "center" }}>
              <img
                src="https://arenzha.s3.ap-southeast-1.amazonaws.com/photos/default-photo.png"
                alt="new"
                style={{ width: "10%", height: "10%" }}
              />
              <br />
              <span>Belum ada anggota Project</span>
            </div>
          ) : (
            //   <MDBDataTableV5
            //       hover
            //       entriesOptions={[5, 20, 25]}
            //       entries={5}
            //       pagesAmount={10}
            //       data={datatable}
            //       paging={false}
            //       searchTop
            //       searchBottom={false}
            //       barReverse
            //  />
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
              <tbody id="data-members-selected"></tbody>
            </table>
          )}
        </CCardBody>

        {/* //modal members */}
        <CModal
          show={modalMembers}
          onClose={() => setModalMembers(!modalMembers)}
          size="lg"
        >
          <CModalHeader closeButton>
            <CModalTitle>Pegawai EO</CModalTitle>
          </CModalHeader>
          <CModalBody>
            ??
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              paginationDefaultPage
              paginationPerPage={5}
              subHeaderComponent={subHeaderComponent}
              subHeader
              defaultSortFieldId
              sortable
              style
            />
            ??
            <div>
              <span>Pegawai terpilih</span>
            </div>
            {tempSelectedMembers === "" ? (
              <div style={{ textAlign: "center" }}>
                <img
                  src="https://arenzha.s3.ap-southeast-1.amazonaws.com/photos/default-photo.png"
                  alt="new"
                  style={{ width: "10%", height: "10%" }}
                />
                <br />
                <span>Belum ada pegawai terpilih</span>
              </div>
            ) : (
              <table
                tyle={{ width: "100%" }}
                class="table table-striped"
                id="use-datatable"
              >
                <thead>
                  <tr>
                    <th>Id Pegawai</th>
                    <th>Nama</th>
                    <th>KTP</th>
                    <th>Uang Harian</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="data-members"></tbody>
              </table>
            )}
          </CModalBody>
          <CModalFooter>
            {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
            <div style={{ textAlign: "right" }}>
              <CButton
                disabled={tempIsloadingMembers}
                onClick={() => saveMembers()}
                size="sm"
                className="btn-brand mr-1 mb-1"
                color="primary"
              >
                <span>
                  {tempIsloadingMembers == false ? (
                    <i class="fa fa-save" />
                  ) : (
                    <i class="fas fa-circle-notch fa-spin" />
                  )}{" "}
                  Simpan
                </span>
              </CButton>
            </div>
          </CModalFooter>
        </CModal>
      </CCard>
    </div>
  );
}
export default Members;
