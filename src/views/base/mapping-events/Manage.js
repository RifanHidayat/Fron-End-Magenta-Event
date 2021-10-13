import React, { useState, useEffect, useMemo } from "react";
import { MDBDataTableV5 } from "mdbreact";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
import { BsGear } from "react-icons/bs";
import ProgressBar from "react-bootstrap/ProgressBar";
import FilterComponent from "src/views/base/components/FilterComponent";
import { API_URL } from "src/views/base/components/constants";
import BeatLoader from "react-spinners/BeatLoader";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CDropdown,
} from "@coreui/react";

const getBadge = (status) => {
  // eslint-disable-next-line default-case
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "danger";
    case "paid_off":
      return "info";
    case "closed":
      return "info";
  }
};

function Manage() {
  const [tempProjects, setTempProjects] = useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [tempIsloading, setTempIsloading] = useState(true);

  var projects = [];
  var dateFormat = require("dateformat");
  const columns = [
    {
      name: "No. Project",
      width: "12%",
      sortable: true,
      cell: (row) => (
        <div style={{ width: "100%" }} data-tag="allowRowEvents">
          <div>{row.project_number}</div>
        </div>
      ),
    },
    {
      name: "No. Quotation",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.quotation_number}</div>
        </div>
      ),
      width: "15%",
    },
    {
      name: "Customer",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.event_customer}</div>
        </div>
      ),
      width: "15%",
    },
    {
      name: "PIC ",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.event_pic}</div>
        </div>
      ),
    },
    {
      name: "Tanggal",
      sortable: true,
      cell: (row) => (
        <div style={{ width: "150%" }} data-tag="allowRowEvents">
          <div>
            tanggal Mulai: {dateFormat(row.project_start_date, "dd/mm/yyyy")}{" "}
            <br />
            tanggal Akhir: {dateFormat(row.project_end_date, "dd/mm/yyyy")}
            <br />
          </div>
        </div>
      ),
      width: "18%",
    },
    {
      name: "Deskripsi",
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{`${row.description}`}</div>
        </div>
      ),
      width: "15%",
    },
    {
      name: "Biaya Project",
      sortable: true,
      right: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{`IDR ${row.grand_total
            .toString()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`}</div>
        </div>
      ),
      width: "15%",
    },
    {
      name: "Budget Gantungan",
      sortable: true,
      right: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.budget.balance !== 0
              ? `IDR ${row.budget.balance
                  .toString()
                  .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`
              : "IDR 0"
                // <CBadge
                //   style={{ width: "100%" }}
                //   color={getBadge(
                //     row.status === "approved"
                //       ? "paid_off"
                //       : row.status === "closed"
                //       ? "paid_off"
                //       : ""
                //   )}
                // >
                // {row.status === "approved" ? (
                //   "IDR 0"
                // ) :
                // <span
                //   style={{
                //     color: "white",
                //     alignContent: "center",
                //     width: "120px",
                //   }}
                // >

                // </span>
                // row.status === "closed" ? (
                //   "IDR 0"
                // ) : (
                // <span
                //   style={{
                //     color: "white",
                //     alignContent: "center",
                //     width: "120px",
                //   }}
                // >
                //   &nbsp;&nbsp; Lunas &nbsp;&nbsp;{" "}
                //   // </span>
                //   <span
                //     style={{
                //       color: "black",
                //       alignContent: "center",
                //       width: "120px",
                //     }}
                //   >
                //     &nbsp;&nbsp;<span></span> &nbsp;&
                //     nbsp;{" "}
                //   </span>
                // )}
                // </CBadge>
            }
          </div>
        </div>
      ),
      width: "15%",
    },
    {
      name: "Status",
      sortable: true,
      cell: (row) => (
        <div>
          <div></div>
          <CBadge style={{ width: "100%" }} color={getBadge(row.status)}>
            <span style={{ color: "white", alignContent: "center" }}>
              {" "}
              &nbsp;&nbsp;{row.status}&nbsp;&nbsp;
            </span>
          </CBadge>
        </div>
      ),
    },

    {
      name: "Persentase",
      sortable: true,
      cell: (row) => (
        <div>
          <center>
            <span>
              {row.status === "approved"
                ? row.total_task_completed === 0
                  ? "0 %"
                  : `${(
                      (Number(row.total_task_completed) /
                        Number(row.total_all_task)) *
                      100
                    ).toFixed(2)} %`
                : row.status == "closed"
                ? row.total_task_completed === 0
                  ? "0 %"
                  : `${(
                      (Number(row.total_task_completed) /
                        Number(row.total_all_task)) *
                      100
                    ).toFixed(2)} %`
                : ""}
            </span>
          </center>

          {row.status === "approved" ? (
            <ProgressBar
              animated
              now={(
                (row.total_task_completed / row.total_all_task) *
                100
              ).toFixed(2)}
              style={{ width: "60px", height: "10px" }}
            />
          ) : row.status === "closed" ? (
            <ProgressBar
              animated
              now={(
                (row.total_task_completed / row.total_all_task) *
                100
              ).toFixed(2)}
              style={{ width: "60px", height: "10px" }}
            />
          ) : (
            ""
          )}
        </div>
      ),
    },

    {
      name: "Aksi",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <CDropdown>
              <CDropdownToggle caret={false} color="secondary">
                <BsGear size="18px" />
                {/* &nbsp;{row.budget.status_pending>0?
                <div id = "exampleCircle"  style={{borderRadius:'50%',backgroundColor:'red',width:'20px',height:'20px'}}><p align="center" style={{color:'white'}}>{row.budget.status_pending}</p></div>
                :<p></p>} */}
              </CDropdownToggle>

              <CDropdownMenu placement="left-end">
                <CDropdownItem to={`/mapping/members/${row.id}`}>
                  Pemetaan
                </CDropdownItem>
                <CDropdownItem
                  to={`/mapping/Transactions/${row.id}/${row.project_number}`}
                >
                  Advance Transaksi &nbsp;
                  {row.budget.status_pending > 0 ? (
                    <div
                      id="exampleCircle"
                      style={{
                        borderRadius: "50%",
                        backgroundColor: "red",
                        width: "20px",
                        height: "20px",
                      }}
                    >
                      <p align="center" style={{ color: "white" }}>
                        {row.budget.status_pending}
                      </p>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </CDropdownItem>
                {row.status === "approved" ? (
                  <CDropdownItem to={`/mapping/profit-cost/${row.id}`}>
                    L/R Project
                  </CDropdownItem>
                ) : (
                  <span></span>
                )}

                {
                  <CDropdownItem onClick={() => closeProject(row.id)}>
                    Tutup Project
                  </CDropdownItem>
                }
              </CDropdownMenu>
            </CDropdown>
          </div>
        </div>
      ),
      width: "10%",
    },
  ];

  const closeProject = (id) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "project akan di close",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Close",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return axios
          .patch(`${API_URL}/api/project/${id}/close`)
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
      getProjects();
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Peroject berhasil dihapus",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed) {
            //getDataProjects();
            // window.location.href = '/leave';
          }
        });
      }
    });
  };

  const getProjects = () => {
    fetch(`${API_URL}/api/projects`)
      .then((response) => response.json())
      .then((json) => {
        projects = json["data"];
        setTempProjects([...json["data"]]);
        console.log("data", projects);
        setTempProjects([...json["data"]]);
        setTempIsloading(false);
      });
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "mapping");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    setTempIsloading(true);
    getProjects();
    setTempIsloading(false);
  }, []);

  const filteredItems = tempProjects.filter(
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
      <CCard>
        <CCardHeader>
          <div>
            <span>
              <strong>Pemetaan Project</strong>
            </span>
          </div>
        </CCardHeader>
        <CCardBody>
           {" "}
          {tempIsloading === false ? (
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              defaultSortFieldId
              subHeader
              subHeaderComponent={subHeaderComponent}
              sortable
            />
          ) : (
            <center>
              <div style={{ height: "200px" }}>
                <BeatLoader color={"blue"} loading={true} size={20} />
              </div>
            </center>
            // <DataTable
            //   columns={columns}
            //   data={filteredItems}
            //   pagination
            //   defaultSortFieldId
            //   subHeader
            //   subHeaderComponent={subHeaderComponent}
            //   sortable
            // />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Manage;
