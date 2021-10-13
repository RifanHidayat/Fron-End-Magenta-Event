import React, { useState, useEffect, useMemo } from "react";
import Table from "react-bootstrap/Table";
import ReactExport from "react-data-export";
import "jspdf-autotable";
import { useHistory } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { data, dataPDF } from "./data/transactions";
import Button from "@material-ui/core/Button";
import jsPDF from "jspdf";
import img from "../account/images/logo.png";
import Swal from "sweetalert2";
import FilterComponent from "src/views/base/components/FilterComponent";
import ModalImage from "react-modal-image";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
} from "@coreui/react";
import axios from "axios";
import { API_URL } from "src/views/base/components/constants";
function Transaction(props) {
  require("dotenv/config");
  //const [accounts,setAccounts]=useState([]);
  const [transaction, setTransaction] = useState([]);

  const [totalIn, setTotalIn] = useState();
  const [totalOut, setTotalOut] = useState();
  const [balance, setBalance] = useState();
  const [projectNumber, setProjectNumber] = useState();
  const [dataExcel, setDataExcel] = useState();

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  var dateFormat = require("dateformat");
  const navigator = useHistory();

  const columns = [
    {
      name: "Tanggal",
      selector: "date",
      sortable: true,
      width: "12%",
      cell: (row) => <span>{dateFormat(row.date, "dd/mm/yyyy")}</span>,
    },

    {
      name: "Deskripsi",
      selector: "description",
      sortable: true,
      width: "20%",
      cell: (row) => (
        <div
          dangerouslySetInnerHTML={{
            __html: "" + row.description !== "" ? row.description : "",
          }}
        />
      ),
    },
    {
      name: "Tipe",
      selector: "type",
      sortable: true,
      width: "15%",
      cell: (row) => <span>{row.type === "in" ? "Deposit" : "Advance"}</span>,
    },
    {
      name: "Cash In",
      selector: "amount",
      sortable: true,
      width: "15%",
      cell: (row) => (
        <span>
          {" "}
          {row.type === "in"
            ? "IDR " +
              row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            : ""}
        </span>
      ),
    },
    {
      name: "Cash Out",
      selector: "amount",
      sortable: true,
      width: "15%",
      cell: (row) => (
        <span>
          {" "}
          {row.type === "out"
            ? "IDR " +
              row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            : ""}
        </span>
      ),
    },
    {
      name: "Saldo",
      selector: "",
      sortable: true,
      width: "15%",
      cell: (row) => (
        <div>
          IDR &nbsp;
          {row.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
        </div>
      ),
    },
    {
      name: "Gambar",
      selector: "year",
      width: "10%",
      height: "5%",

      sortable: true,
      cell: (row) =>
        row.image == null ? (
          ""
        ) : row.image === "" ? (
          ""
        ) : (
          <div>
            <ModalImage
              small={`http://via.placeholder.com/350x150`}
              large={`https://arenzha.s3.ap-southeast-1.amazonaws.com/eo/transactions/${row.image}`}
            />
          </div>
        ),
    },
    {
      name: "",
      selector: "year",
      width: "20%",

      sortable: true,
      cell: (row) => (
        <div>
          {row.status == "pending" ? (
            <CButton
              size="sm"
              bloc
              color="primary"
              onClick={() =>
                approval(
                  row.id,
                  row.date,
                  row.amount,
                  row.description,
                  row.image,
                  row.account_id
                )
              }
            >
              Approve
            </CButton>
          ) : (
            " "
          )}
          {row.status == "pending" ? (
            <CButton
              size="sm"
              bloc
              color="danger"
              onClick={() =>
                rejection(
                  row.id,
                  row.date,
                  row.amount,
                  row.description,
                  row.image,
                  row.account_id
                )
              }
            >
              Reject
            </CButton>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  // const approval=(id,date,amount,description,image,account_id)=>{
  //   var data={
  //     date:date,
  //     amount:amount,
  //     description:description,
  //     image:image,
  //     account_id:account_id,
  //     project_number:projectNumber
  //   }
  //   axios.patch("http://localhost:3000/project/transactions/approval"+id,data)
  //   .then((response)=>{
  //     console.log("berhasil")

  //   })
  //   .catch((response)=>{
  //     console.log("error")

  //   })

  // }

  const filteredItems = transaction.filter(
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
  const approval = (id, date, amount, description, image, account_id) => {
    var data = {
      date: date,
      amount: amount,
      description: description,
      image: image,
      account_id: account_id,
      project_number: projectNumber,
      status: "approved",
    };
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Transaksi akan diapprove",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Rejected",
      confirmButtonText: "Approve",
      showLoaderOnConfirm: true,

      preConfirm: () => {
        return axios
          .patch(`${API_URL}/api/project/transactions/approval/` + id, data)
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
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "transaksi berhasil  diapprove",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          navigator.push("/mapping");
        });
      }
    });
  };

  const rejection = (id, date, amount, description, image, account_id) => {
    var data = {
      date: date,
      amount: amount,
      description: description,
      image: image,
      account_id: account_id,
      project_number: projectNumber,
      status: "rejection",
    };
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Transaksi akan direject",
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
          .patch(`${API_URL}/api/project/transactions/rejection/` + id, data)
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
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "transaksi berhasil  direject",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          navigator.push("/mapping");
        });
      }
    });
  };

  useEffect(() => {
    var data_transactions = [];
    const data_permission = JSON.parse(localStorage.getItem("permission"));
    const permission = data_permission.filter((value) => value === "mapping");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    let id = props.match.params.id;
    let project_number = props.match.params.project_number;

    dataPDF(props.match.params.id).then((response) => {
      var data_transactions_excel = [];
      response.data.transactions.map((value, index) => {
        var data = [
          {
            value: dateFormat(value.date, "dd/mm/yyyy"),
            width: 100,
          },
          {
            value: `${value.type == "out" ? "Advance" : "deposit"}`,
            width: { wpx: 80 },
          },
          {
            value: `${value.description == null ? "" : value.description}`,
            width: { wpx: 150 },
          },
          {
            value: value.type === "in" ? value.amount : "",
            width: { wpx: 100 },
          },
          {
            value: value.type === "out" ? value.amount : "",
            width: { wpx: 100 },
          },
          {
            value: value.balance,
            width: { wpx: 80 },
          },
        ];
        data_transactions.push(data);
        if (index + 1 >= response.data.transactions.length) {
          const header = [
            { value: response.total_in, width: { wpx: 100 } },
            { value: response.total_out, width: { wpx: 100 } },
            { value: response.balance, width: { wpx: 100 } },
          ];
          const multiDataSet = [
            {
              columns: [
                {
                  title: "Total Cash In",
                  width: { wpx: 100 },
                  style: {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "808080" },
                    },
                  },
                }, //pixels width
                {
                  title: "Total Cash Out",
                  width: { wpx: 100 },
                  style: {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "808080" },
                    },
                  },
                }, //char width
                {
                  title: "Saldo",
                  width: { wpx: 100 },
                  style: {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "808080" },
                    },
                  },
                },
              ],
              data: [header],
            },
            {
              ySteps: 1, //will put space of 5 rows,

              columns: [
                {
                  title: "Tanggal",
                  width: { wpx: 100 },
                  style: {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "808080" },
                    },
                  },
                }, //pixels width
                {
                  title: "Tipe",
                  width: { wpx: 100 },
                  style: {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "808080" },
                    },
                  },
                },

                {
                  title: "Deskripsi",
                  width: { wpx: 250 },
                  style: {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "808080" },
                    },
                  },
                }, //char width
                {
                  title: "Cash In",
                  width: { wpx: 100 },
                  style: {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "808080" },
                    },
                  },
                },

                {
                  title: "Cash Out",
                  width: { wpx: 100 },
                  style: {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "808080" },
                    },
                  },
                },
                {
                  title: "Saldo",
                  width: { wpx: 100 },
                  style: {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "808080" },
                    },
                  },
                },
              ],
              data: data_transactions,
            },
          ];
          setDataExcel([...multiDataSet]);
        }
      });
    });

    setProjectNumber(project_number);
    data(id).then((response) => {
      //setProjectNumber(props.project_number)
      console.log(props.project_number);

      if (response.transactions.length > 0) {
        setTransaction([...response.transactions]);
        setTotalIn(
          "IDR " +
            response.total_in
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
        );
        setTotalOut(
          "IDR " +
            response.total_out
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
        );
        setBalance(
          "IDR " +
            response.balance
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
        );
        //  setProjectNumber(response.project_number)
      }
    });
  }, []);

  function showExcel() {
    dataPDF(props.match.params.id).then((response) => {
      var data_transactions_excel = [];
      response.data.transactions.map((values) => {
        var data = {
          date: values.date,
          description: values.description,
          in: values.type === "in" ? values.amount : "",
          out: values.type === "out" ? values.amount : "",
          balance: values.balance,
        };
        data_transactions_excel.push(data);
      });
      setDataExcel([...data_transactions_excel]);
    });
  }

  function showPDF() {
    dataPDF(props.match.params.id).then((response) => {
      var data_transactions_pdf = [];
      var doc = new jsPDF("p", "px", "a4");
      doc.text(`Budget gantungan project ${projectNumber}`, 10, 20);
      doc.addImage(img, "png", 380, 10, 50, 50);
      doc.autoTable({ html: "#my-table" });

      response.data.transactions.map((values) => {
        var data = [
          dateFormat(values.date, "dd/mm/yyyy"),
          values.description,
          values.type === "in"
            ? values.amount
                .toString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            : "",
          values.type === "out"
            ? values.amount
                .toString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            : "",

          values.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
        ];
        data_transactions_pdf.push(data);
      });
      doc.autoTable({
        margin: { top: 20 },
        headStyles: {
          fillColor: "#df0c8f",
          textColor: [255, 255, 255],
          fontSize: 10,
          padding: 0,
        },
        columnStyles: {
          0: {
            halign: "right",
          },
          1: {
            halign: "right",
          },
          2: {
            halign: "right",
          },
        },

        margin: { left: 10, right: "70%", top: "10%" },

        head: [["Total Cash In", "Total Cash Out", "Saldo"]],
        body: [
          [
            response.data.total_in
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),

            response.data.total_out
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),

            response.data.balance
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
          ],
        ],
      });
      doc.autoTable({
        margin: { top: 20 },
        headStyles: {
          fillColor: "#df0c8f",
          textColor: [255, 255, 255],
          fontSize: 10,
          padding: 0,
        },
        columnStyles: {
          0: { cellWidth: 50 },

          2: { cellWidth: 70, halign: "right" },
          3: { cellWidth: 70, halign: "right" },
          4: { cellWidth: 70, halign: "right" },
        },
        thema: "grid",
        margin: { left: 10, right: 10 },
        head: [["tanggal", "Deskripsi", "Cash In", "Cash Out", "Saldo"]],
        body: data_transactions_pdf,
      });
      window.open(doc.output("bloburl"), "_blank");
    });
  }

  return (
    <div>
      {/* header */}
      <div style={{ float: "right", width: "100%" }}>
        <div style={{ float: "left", position: "absolute" }}>
          <span>
            <h5>
              <strong>Advance Transaksi</strong>
            </h5>
          </span>
          <span>
            <h7>No. project: {projectNumber}</h7>
          </span>
        </div>
        <div style={{ float: "right" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => showPDF()}
          >
            PDF
          </Button>
          &nbsp; &nbsp;
          <ExcelFile
            filename="Rekap Adavence transaksi"
            element={
              <Button
                variant="contained"
                color="success"
                style={{ backgroundColor: "green", color: "white" }}
              >
                Excel
              </Button>
            }
          >
            <ExcelSheet dataSet={dataExcel} name="Organization" />
          </ExcelFile>
        </div>
      </div>

      {/* <Table striped bordered hover style={{ width: "50%" }}>
        <thead>
          <tr>
            <th>Total Cash In</th>
            <th>Total Cash Out </th>
            <th>Total Saldo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td align="right">{totalIn}</td>
            <td align="right">{totalOut}</td>
            <td align="right">{balance}</td>
          </tr>
        </tbody>
      </Table> */}
      <div style={{ marginTop: "20px" }}>
        <br></br>
        <br></br>
        <br></br>
        <CFormGroup row>
          <CCol col="4">
            <CCard>
              <CCardHeader>
                <div>
                  <span>
                    <strong>Total In</strong>
                  </span>
                  <br></br>
                  <span>{totalIn}</span>
                </div>
              </CCardHeader>
            </CCard>
          </CCol>
          <CCol col="4">
            <CCard>
              <CCardHeader>
                <div>
                  <span>
                    <strong>Total Out</strong>
                  </span>
                  <br></br>
                  <span>{totalOut}</span>
                </div>
              </CCardHeader>
            </CCard>
          </CCol>
          <CCol col="4">
            <CCard>
              <CCardHeader>
                <div>
                  <span>
                    <strong>Balance</strong>
                  </span>
                  <br></br>
                  <span>{balance}</span>
                </div>
              </CCardHeader>
            </CCard>
          </CCol>
        </CFormGroup>
      </div>

      <CCard>
        <CCardHeader>
          <span>
            <strong>Detail Transaksi</strong>
          </span>
        </CCardHeader>
        <CCardBody>
          {/* <DataTableExtensions {...tableData}> */}
          <DataTable
            columns={columns}
            data={filteredItems}
            subHeader
            defaultSortField="id"
            defaultSortAsc={false}
            pagination
            highlightOnHover
            subHeaderComponent={subHeaderComponent}
          />
          {/* </DataTableExtensions> */}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Transaction;
