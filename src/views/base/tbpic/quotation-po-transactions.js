import React, { useState, useEffect, useMemo } from "react";
import Table from "react-bootstrap/Table";
import "jspdf-autotable";
import ReactExport from "react-data-export";
import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getDetailPIC, dataPDF } from "./data/pic";
import Button from "@material-ui/core/Button";
import jsPDF from "jspdf";
import img from "../account/images/logo.png";
import FilterComponent from "src/views/base/components/FilterComponent";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
} from "@coreui/react";
import axios from "axios";
import { API_URL } from "../components/constants";
var dateFormat = require("dateformat");

const columns = [
  {
    name: "Tanggal",
    selector: "date",
    sortable: true,
    width: "15%",
    cell: (row) => <span>{dateFormat(row.date, "dd/mm/yyyy")}</span>,
  },

  {
    name: "Deskripsi",
    selector: "description",
    sortable: true,
    width: "25%",
    cell: (row) => (
      <div
        dangerouslySetInnerHTML={{
          __html: "" + row.description !== "" ? row.description : "",
        }}
      />
    ),
  },

  {
    name: "Cash In",
    selector: "amount",
    sortable: true,
    ritgh: true,
    width: "20%",
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
    ritgh: true,
    width: "20%",
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
    ritgh: true,
    width: "20%",
    cell: (row) => (
      <div>
        IDR &nbsp;
        {row.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
      </div>
    ),
  },
];
function Transaction(props) {
  //const [accounts,setAccounts]=useState([]);
  const [transaction, setTransaction] = useState([]);

  const [totalIn, setTotalIn] = useState();
  const [totalOut, setTotalOut] = useState();
  const [balance, setBalance] = useState();
  const [projectNumber, setProjectNumber] = useState();
  const [namePIC, setNamePIC] = useState();
  const [dataExcel, setDataExcel] = useState();

  const [poNumber, setPoNumber] = useState();

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "pictb");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    let id = props.match.params.id;

    axios
      .get(
        `${API_URL}/api/quotation-po/detail/${props.match.params.quotation_po_id}`
      )
      .then((response) => {
        console.log(response.data.data);
        setPoNumber(response.data.data[0].code);
      })
      .catch((error) => {});

    axios
      .get(
        `${API_URL}/api/pictb/${props.match.params.pictb_id}/tb-transactions/quotation-po/${props.match.params.quotation_po_id}`
      )
      .then((response) => {
        setTransaction(response.data.data);

        setTotalIn(
          response.data.data
            .reduce((a, b) => (b.type === "in" ? a + b.amount : (a = a)), 0)
            .toString()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
        );
        setTotalOut(
          response.data.data
            .reduce((a, b) => (b.type === "out" ? a + b.amount : (a = a)), 0)
            .toString()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
        );
        setBalance(
          response.data.data
            .reduce(
              (a, b) => (b.type === "in" ? a + b.amount : a - b.amount),
              0
            )
            .toString()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
        );
      })
      .catch((error) => {});
  }, []);

  function showExcel() {
    // dataPDF(props.match.params.id).then((response)=>{
    //     var data_transactions_excel=[]
    //      response.data.transactions.map((values)=>{
    //          console.log('tee',values)
    //          var data={
    //              date:values.date,
    //              description:values.description,
    //              in:values.type==='in'?values.amount:"",
    //              out:values.type==="out"?values.amount:"",
    //              balance:values.balance
    //          }
    //           data_transactions_excel.push(data)
    //      })
    //      setDataExcel([...data_transactions_excel])
    //    })
  }

  function showPDF() {
    dataPDF(props.match.params.id).then((response) => {
      var data_transactions_pdf = [];
      var doc = new jsPDF("p", "px", "a4");
      doc.text(`TB:${namePIC}`, 10, 20);
      doc.addImage(img, "png", 380, 10, 50, 50);
      doc.autoTable({ html: "#my-table" });
      response.data.transactions.map((values) => {
        var data = [
          dateFormat(values.date, "dd/mm/yyyy"),
          values.description,
          values.type === "in"
            ? "IDR " +
              values.amount
                .toString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            : "",
          values.type === "out"
            ? "IDR " +
              values.amount
                .toString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            : "",
          "IDR " +
            values.balance
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
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
            "IDR " +
              response.data.total_in
                .toString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
            "IDR " +
              response.data.total_out
                .toString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
            "IDR " +
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

  return (
    <div>
      {/* header */}
      <div style={{ float: "right", width: "100%" }}>
        <div style={{ float: "left", position: "absolute" }}>
          <span>
            <h5>
              <strong>Detail Transaksi PO</strong>
            </h5>
          </span>
          <span>
            <h7>No. PO: {poNumber}</h7>
          </span>
        </div>
        <div style={{ float: "right" }}>
          {/* <Button variant="outline" color="secondary" onClick={() => showPDF()}>
            PDF
          </Button> */}
          <Button variant="outlined" onClick={() => showPDF()}>PDF</Button>
          &nbsp; &nbsp;
          <ExcelFile
            filename="Rekap Transaksi PIC TB"
            element={
              // <Button
              //   variant="contained"
              //   color="success"
              //   style={{ backgroundColor: "green", color: "white" }}
              // >
              //   Excel
              // </Button>
              <Button variant="outlined"
              >Excel</Button>
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
