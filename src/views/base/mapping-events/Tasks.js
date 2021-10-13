import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/style.css";
import { useHistory } from "react-router-dom";
import { Projects } from "./components/Projects";
import $ from "jquery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MDBDataTableV5 } from "mdbreact";
import Button from "@material-ui/core/Button";
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
function Tasks(props) {
  const [tempTask, setTempTasks] = useState([]);
  const [modalTasks, setModaltask] = useState(false);
  const [datatable, setDatatable] = React.useState({});
  const [status, setStatus] = useState();
  //loading spinner
  const [tempIsloadingTasks, setTempIsLoadingTask] = useState(false);
  const [tempIsloadingAddTasks, setTempIsLoadingAddTasks] = useState(true);

  const [tasks, setTasks] = useState([]);

  const taskss = [];

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

  const setDataTasks = (data) => {
    setDatatable({
      columns: [
        {
          label: "Nama Tugas",
          field: "name",
          width: 270,
          attributes: {
            "aria-controls": "DataTable",
            "aria-label": "Name",
          },
        },
        {
          label: "Status",
          field: "status",
          width: "20%",
          attributes: {
            "aria-controls": "DataTable",
            "aria-label": "Name",
          },
        },
      ],
      rows: data,
    });
  };

  const getAllTask = () => {
    var project_id = props.match.params.id;
    axios
      .get(`${API_URL}/api/projects/${project_id}/tasks`)
      .then((response) => {
        if (response.data.data.length > 0) {
          setTasks([...response.data.data]);
        } else {
          setTasks([]);
        }
      })

      .then((error) => {
        //setTempIsLoadingAddTasks(false)
      });
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "mapping");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    var employee_id = props.match.params.id;
    //get members
    axios
      .get(`${API_URL}/api/projects/detail-project/` + employee_id)
      .then((response) => {
        if (response.data.data.tasks.length > 0) {
          setTempIsLoadingAddTasks(false);
          setTempTasks([...response.data.data.tasks]);
          setTasks([...response.data.data.tasks]);
          setDataTasks(response.data.data.tasks);
          setStatus(response.data.data.status);

          response.data.data.tasks.map((value) => {
            updateRow(value.name, value.id, value.status);
            var data = {
              project_id: value.project_id,
              name: value.name,
              id: value.id,
              status: value.statusstatus,
            };
            taskss.push(data);
          });
        } else {
          setTempIsLoadingAddTasks(false);
          // setTempTasks(response.data.data.tasks)
          // setDataTasks(response.data.data.tasks)
          setStatus(response.data.data.status);
          setTempIsLoadingAddTasks(false);
        }
      })

      .then((error) => {
        //setTempIsLoadingAddTasks(false)
      });
  }, []);

  //delete row
  $(document).on("click", "#delete-row", function (e) {
    e.preventDefault();
    var table = $("#use-datatable tbody tr");
    console.log(table);

    if (table.length <= 1) {
    } else {
      console.log($(this).find("td:nth-child(2) input").val());
      $(this).parent().parent().remove();
    }
  });

  const addRow = () => {
    var row = "";
    row += "<tr>";
    row += "<td>";
    row += '<input required class="form-control"  ">';
    row += "</td>";

    row += "<th>";
    row +=
      '<button type="button" class="btn btn-danger" id="delete-row"><i className="fa fa-plus"/>X</button>';
    row += "</th>";
    row += "</tr>";
    $("#use-datatable tbody").append(row);
  };
  const updateRow = (taskName, id, status) => {
    var row = "";
    row += "<tr>";
    row += "<td>";
    row += '<input required class="form-control" value="' + taskName + '" >';
    row += "</td>";

    row += "<td hidden>";
    row += '<input required hidden class="form-control" value="' + id + '" >';
    row += "</td>";
    row += "<td hidden>";
    row +=
      '<input required hidden class="form-control" value="' + status + '" >';
    row += "</td>";

    row += "<th>";
    row +=
      '<button type="button" class="btn btn-danger" id="delete-row"><i className="fa fa-plus"/>X</button>';
    row += "</th>";
    row += "</tr>";
    $("#use-datatable tbody").append(row);
  };

  const saveTasks = () => {
    console.log("initial", taskss);
    var ids = [];
    setTempIsLoadingTask(false);
    var project_id = props.match.params.id;
    var Tasks = [];
    var data;
    $("#use-datatable tbody tr").each(function () {
      var name = $(this).find("td:nth-child(1) input").val().toString().trim();
      var id = $(this).find("td:nth-child(2) input").val();
      var status = $(this).find("td:nth-child(3) input").val();
      console.log(status);

      if (id != null) {
        data = { project_id: project_id, name: name, id: id, status: status };
        Tasks.push(data);
        taskss.push(data);
      } else {
        data = {
          project_id: project_id,
          name: name,
          id: "",
          status: "in progress",
        };
        Tasks.push(data);

        taskss.push(data);
      }
    });

    //check id delete task
    tasks.map((value) => {
      const filter = Tasks.filter(
        (e) => value.id.toString() === e.id.toString()
      );
      if (filter.length > 0) {
      } else {
        ids.push(value.id);
      }
    });
    console.log(ids);

    var data_task = {
      tempTask: Tasks,
      tasks: taskss,
      ids: ids,
    };
    console.log(Tasks);
    console.log(taskss);

    axios
      .post(`${API_URL}/api/projects/create-tasks`, data_task)
      .then((response) => {
        console.log(response.data.data);
        setTempIsLoadingTask(false);
        setTempTasks([...response.data.data]);
        setModaltask(false);
        getAllTask();
        toast.success("Berhasil menambahkan tugas project", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          color: "success",
        });
        setDataTasks(Tasks);
      })
      .catch((error) => {
        console.error("terjadi kesalahan");
      });
  };

  return (
    <div>
      <ToastContainer />
      <Projects id={props.match.params.id}></Projects>
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => tasksPage()}
            >
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
                <strong>Task Project</strong>
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              {status !== "closed" ? (
                <CButton
                  size="sm"
                  className="btn-brand mr-1 mb-1"
                  color="primary"
                  onClick={() => setModaltask(!modalTasks)}
                >
                  {tempTask.length > 0 ? (
                    <span>
                      {" "}
                      {tempIsloadingAddTasks ? (
                        <i class="fas fa-circle-notch fa-spin" />
                      ) : (
                        <i class="fa fa-edit" />
                      )}{" "}
                      Ubah
                    </span>
                  ) : (
                    <span>
                      {" "}
                      {tempIsloadingAddTasks ? (
                        <i class="fas fa-circle-notch fa-spin" />
                      ) : (
                        <i class="fa fa-plus" />
                      )}{" "}
                      Tambah
                    </span>
                  )}
                </CButton>
              ) : (
                ""
              )}
              :
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          {tempTask == "" ? (
            <div style={{ textAlign: "center" }}>
              <img
                src="https://arenzha.s3.ap-southeast-1.amazonaws.com/eo/icons/tasks.png"
                alt="new"
                style={{ width: "10%", height: "10%" }}
              />
              <br />
              <br />
              <span>Belum ada task project</span>
            </div>
          ) : (
            <MDBDataTableV5
              hover
              entriesOptions={[5, 20, 25]}
              entries={5}
              pagesAmount={10}
              data={datatable}
              paging={false}
              searchTop
              searchBottom={false}
              barReverse
            />
          )}
        </CCardBody>

        {/* //modal members */}
        <CModal
          show={modalTasks}
          onClose={() => setModaltask(!modalTasks)}
          size="lg"
        >
          <CModalHeader closeButton>
            <CModalTitle>Task Project</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <table
              tyle={{ width: "100%" }}
              class="table table-striped"
              id="use-datatable"
            >
              <thead>
                <tr>
                  <th>Task</th>

                  <th style={{ width: "25px" }}>
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={() => addRow()}
                    >
                      <i className="fa fa-plus" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody id="data-tasks"></tbody>
            </table>
          </CModalBody>
          <CModalFooter>
            {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
            <div style={{ textAlign: "right" }}>
              <CButton
                size="sm"
                disabled={tempIsloadingTasks}
                className="btn-brand mr-1 mb-1"
                color="primary"
                onClick={() => saveTasks()}
              >
                <span>
                  {tempIsloadingTasks ? (
                    <i class="fas fa-circle-notch fa-spin" />
                  ) : (
                    <i class="fa fa-save" />
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
export default Tasks;
