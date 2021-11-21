import { API_URL, FINANCE_API } from "src/views/base/components/constants";
require("dotenv").config();

var dateFormat = require("dateformat");
export const data = async (props) =>
  fetch(`${FINANCE_API}/api/account/` + props)
    .then((response) => response.json())
    .then((json) => json["data"][0]);

export const dataPDF = async (props) =>
  fetch(`${API_URL}/api/accounts/detail-account/` + props)
    .then((response) => response.json())
    .then((json) => json);
export const dataAccounts = async (props) =>
  fetch(`${FINANCE_API}/api/account`)
    .then((response) => response.json())
    .then((json) => json);

export const columns = [
  {
    name: "COA",
    selector: "",
    sortable: true,
    width: "12%",
    cell: (row) => <span>{row.coa_id == null ? "" : row.coa_id.name}</span>,
  },
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
    name: "Note",
    selector: "Note",
    sortable: true,
    width: "20%",
    cell: (row) => (
      <div
        dangerouslySetInnerHTML={{
          __html: "" + row.note !== "" ? row.note : "",
        }}
      />
    ),
  },

  {
    name: "In",
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
    name: "Out",
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

    sortable: true,
  },
];
