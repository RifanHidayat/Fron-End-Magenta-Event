import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import FilterComponent from "src/views/base/components/FilterComponent";
import { API_URL } from "src/views/base/components/constants";
import BeatLoader from "react-spinners/BeatLoader";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CTooltip,
} from "@coreui/react";

const getBadge = (status) => {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "danger";
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
    },
    {
      name: "Customer",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>{row.event_customer}</div>
        </div>
      ),
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
      width: "20%",
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
    },

    {
      name: "Total Biaya",
      sortable: true,
      right: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.grand_total
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
        <div>
          <div></div>
          <CBadge style={{ width: "100%" }} color={getBadge(row.status)}>
            <span style={{ color: "white", alignContent: "center" }}>
              {" "}
              {row.status}
            </span>
          </CBadge>
        </div>
      ),
    },

    {
      name: "Aksi",
      width: "10%",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            {row.status === "pending" ? (
              <CTooltip content="Edit Project" placement="top">
                <CButton
                  color="secondary"
                  size="sm"
                  to={`/projects/edit/${row.id}`}
                >
                  {<i class="fa fa-edit"></i>}
                </CButton>
              </CTooltip>
            ) : (
              <span></span>
            )}
            &ensp;
            {row.status === "pending" ? (
              <CTooltip content="Delete Project" placement="top">
                <CButton
                  color="secondary"
                  size="sm"
                  onClick={() => deleteProject(row.id)}
                >
                  {<i class="fa fa-trash"></i>}
                </CButton>
              </CTooltip>
            ) : (
              <span></span>
            )}
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "manage");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    getDataProjects();
    setTempIsloading(false);
  }, []);

  const getDataProjects = () => {
    fetch(`${API_URL}/api/projects`)
      .then((response) => response.json())
      .then((json) => {
        projects = json["data"];
        setTempProjects([...json["data"]]);
      });
  };

  const deleteProject = (id) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "project akan dihapus",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return axios
          .delete(`${API_URL}/api/projects/delete-project/` + id)
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
        getDataProjects();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Peroject berhasil dihapus",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.href = '/leave';
          }
        });
      }
    });
  };

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
          <div style={{ float: "right", width: "100%" }}>
            <div style={{ float: "left", position: "absolute" }}>
              <span>
                <strong>Data Project</strong>
              </span>
            </div>
            <div style={{ float: "right" }}>
              <CButton size="sm" to="/projects/create" color="primary">
                <i className="fa fa-plus"></i> <span>Tambah </span>
              </CButton>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          {/*     
    <MDBDataTableV5
      hover
      columns={columns}
    
      entriesOptions={[5, 20, 25]}
      entries={5}
      pagesAmount={4}
      data={projects}
      pagingTop
      searchTop
      
      searchBottom={false}
      barReverse
    /> */}
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
              <BeatLoader color={"blue"} loading={true} size={20} />
            </center>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Manage;
