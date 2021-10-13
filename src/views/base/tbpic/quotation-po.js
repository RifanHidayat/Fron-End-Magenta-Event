import React, { useState, useEffect, useMemo } from "react";

import Table from "./components/DataTable";
import { CButton, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { getAllPICTB } from "./data/pictb";
import BeatLoader from "react-spinners/BeatLoader";
import FilterComponent from "src/views/base/components/FilterComponent";
import axios from "axios";
import DataTable from "react-data-table-component";
import { API_URL } from "src/views/base/components/constants";
import { MDBBadge, MDBContainer } from "mdbreact";

import {
  getAllProjets,
  getDetailPIC,
  DataOutTransactions,
  getAcounts,
} from "./data/pic";

var dateFormat = require("dateformat");

function Manage(props) {
  const [pictb, setPictb] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [quotationPOTransaction, setQuotatitionPoTransaction] = useState([]);
  const [nameTb, setNameTb] = useState();

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const columns = [
    {
      name: "No. PO",
      selector: "date",
      sortable: true,

      cell: (row) => (
        <MDBBadge pill color="info">
          {row.code}
        </MDBBadge>
      ),
    },

    {
      name: "Total IN",
      selector: "date",
      sortable: true,

      cell: (row) =>
        row.transaction_tbs
          .reduce((a, b) => (b.type == "in" ? a + b.amount : (a = a)), 0)
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
    },

    {
      name: "Total Out",
      selector: "date",
      sortable: true,
      cell: (row) =>
        row.transaction_tbs
          .reduce((a, b) => (b.type == "out" ? a + b.amount : (a = a)), 0)
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
          
    },
    {
      name: "Saldo",
      selector: "date",
      sortable: true,

      cell: (row) =>
        row.transaction_tbs
          .reduce((a, b) => (b.type == "in" ? a + b.amount : a - b.amount), 0)
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
    },

    {
      name: "Action",
      selector: "date",
      sortable: true,

      cell: (row) => (
        <CButton
          size="sm"
          to={`/pictb/${props.match.params.id}/quotation-po-transaction/${row.id}`}
          color="primary"
        >
          <span>Detail Transaksi</span>
        </CButton>
      ),
    },
  ];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "pictb");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    var id = props.match.params.id;
    //get detail pic
    getDetailPIC(id).then((response) => {
      // setBalanceTB(response.data.balance);
      setNameTb(response.data.name);
    });
    getQuotationTransaction();
  }, []);

  const getQuotationTransaction = async () => {
    axios
      .get(`${API_URL}/api/quotation-po/${props.match.params.id}`)
      .then((response) => {
        setQuotatitionPoTransaction(response.data.data);
      })
      .catch((error) => {});
    setIsLoading(false);
  };

  //   const filteredItems = quotationPOTransaction.filter(
  //     (item) =>
  //       JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
  //       -1
  //   );

  //   const subHeaderComponent = useMemo(() => {
  //     const handleClear = () => {
  //       if (filterText) {
  //         setResetPaginationToggle(!resetPaginationToggle);
  //         setFilterText("");
  //       }
  //     };

  //     return (
  //       <FilterComponent
  //         onFilter={(e) => setFilterText(e.target.value)}
  //         onClear={handleClear}
  //         filterText={filterText}
  //       />
  //     );
  //   }, [filterText, resetPaginationToggle]);

  return (
    <div>
      <CCard>
        <CCardHeader>
          <div style={{ float: "right", width: "100%" }}>
            <div style={{ float: "left", position: "absolute" }}>
              <span>
                <strong>Quotation PO</strong>
              </span>
            </div>
            <div style={{ float: "right" }}>
              <span>
                <strong>TB: {nameTb}</strong>
              </span>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          {isLoading === false ? (
            <DataTable
              columns={columns}
              data={quotationPOTransaction}
              subHeader
              defaultSortField="id"
              defaultSortAsc={false}
              pagination
              highlightOnHover
            />
          ) : (
            <center>
              <div style={{ height: "200px" }}>
                <BeatLoader color={"blue"} loading={true} size={20} />
              </div>
            </center>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Manage;
