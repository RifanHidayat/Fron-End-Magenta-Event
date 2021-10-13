import { API_URL } from "src/views/base/components/constants";
import Button from "@material-ui/core/Button";
var dateFormat = require("dateformat");

export const data = async (props) =>
  fetch(`${API_URL}/api/projects/detail-transactions/` + props)
    .then((response) => response.json())
    .then((json) => json["data"]);

export const dataPDF = async (props) =>
  fetch(`${API_URL}/api/projects/detail-transactions/` + props)
    .then((response) => response.json())
    .then((json) => json);

export const dataPDFLR = async (props) =>
  fetch(`${API_URL}/api/projects/${props}/transactions`)
    .then((response) => response.json())
    .then((json) => json);

export const columns = [
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

    sortable: true,
  },
  {
    name: "",
    selector: "year",
    width: "10%",

    sortable: true,
    cell: (row) => (
      <div>
        {row.status == "pending" ? (
          <Button
            style={{ width: "20px", height: "20px", fontSize: "5px" }}
            variant="contained"
            color="primary"
            onClick={() => approval()}
          >
            Approved
          </Button>
        ) : (
          ""
        )}
      </div>
    ),
  },
];

const approval = (
  id,
  date,
  amount,
  description,
  image,
  account_id,
  project_number
) => {
  console.log("tes");
};
