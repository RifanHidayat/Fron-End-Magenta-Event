import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import $ from "jquery";
import { MDBDataTableV5 } from "mdbreact";
import { API_URL } from "src/views/base/components/constants";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CLabel,
  CInput,
  CCol,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CFormGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
} from "@coreui/react";
import { Projects } from "./components/Projects";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDataAccounts } from "./data/accounts";
import "jquery/dist/jquery.min.js";

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";

const columns = [
  {
    name: "Nominal",
    sortable: true,
    right: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div>
          <div style={{ textAlign: "right" }}>
            IDR{" "}
            {row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Tanggal Transfer",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div>{row.date}</div>
      </div>
    ),
  },
  {
    name: "Akun",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div></div>
      </div>
    ),
  },
];

function Budgets(props) {
  const data = JSON.parse(localStorage.getItem("permission"));
  const permission = data.filter((value) => value === "mapping");
  if (permission <= 0) {
    Navigator.push("/dashboard");
  }
  const [modalBudgets, setModalBudgets] = useState(false);

  const [tempTotalBudgets, setTempTotalBudgets] = useState([]);
  const [account, setAccount] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetStartDate, setBudgetStartDate] = useState();
  const [budgetEndDate, setBudgetEndtDate] = useState();
  const [datatable, setDatatable] = React.useState({});
  const [status, setStatus] = useState();
  const [TotalBudgetProject, setTotalBudgetProject] = useState();
  var dateFormat = require("dateformat");

  //loading spinner
  const [tempIsloadingBudgets, setTempIsLoadingBudgets] = useState(true);
  const [mainisLoading, setMainIsLoading] = useState(true);
  var dateFormat = require("dateformat");

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

  function calculation() {
    var result = 0;
    $("#use-datatable tbody tr").each(function () {
      var nominal = $(this)
        .find("td:nth-child(1) input")
        .val()
        .replace(/[^\w\s]/gi, "");
      // console.log(nominal)
      result = Number(nominal) + Number(result);
    });
    setTempTotalBudgets(
      result.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
    );
    console.log(result);
  }

  //delete row
  $(document).on("click", "#delete-row", function (e) {
    e.preventDefault();
    var table = $("#use-datatable tbody tr");
    if (table.length <= 1) {
    } else {
      $(this).parent().parent().remove();
      calculation();
    }
  });

  $(document).on("input", ".nominal_budgets", function (e) {
    e.preventDefault();
    calculation();
  });
  //add row
  const setDataBudgets = () => {
    var row = "";
    row += "<tr>";
    row += "<td>";
    row += '<input  required class="form-control nominal_budgets"  >';
    row += "</td>";

    row += "<td>";
    row +=
      '<input required name="budget_end_project" id="budget_end_project" type="date"  class="form-control" >';
    row += "</td>";

    row += "<td>";
    row +=
      '<select required style="width:110%;height:35px;"  class="form-select" aria-label="Default select example">';
    row += '<option selected value="1">pilih Akun</option>';
    // eslint-disable-next-line no-lone-blocks
    {
      account.map((data) =>
        data.active == 1
          ? data.is_default === 1
            ? ""
            : (row +=
                '<option value="' +
                data.id +
                '">' +
                data.name +
                "(" +
                data.number +
                ")</option>")
          : ""
      );
    }
    row += "</select>";
    row += "</td>";
    row += "<td>";
    row += '<input required class="form-control transfer_to" >';
    row += "</td>";

    row += '<th style="textAlign:right">';
    row +=
      ' <button type="button" class="btn btn-danger" id="delete-row"><i className="fa fa-plus"/>X</button>';
    row += "</th>";
    row += "</tr>";
    $("#use-datatable tbody").append(row);
  };

  //add row
  const updateBudgets = (
    amount,
    date,
    account_id,
    accounts,
    transfer_to,
    id
  ) => {
    var row = "";
    row += "<tr>";

    row += "<td>";
    row +=
      '<input required class="form-control nominal_budgets"  value="' +
      amount +
      '">';
    row += "</td>";

    row += "<td>";
    row +=
      '<input required name="budget_end_project" id="budget_end_project" type="date"  class="form-control" value="' +
      dateFormat(date, "yyyy-mm-dd") +
      '" >';
    row += "</td>";

    row += "<td>";
    row +=
      '<select required style="width:110%;height:35px;" class="form-select" aria-label="Default select example">';
    row += '<option selected value="0">pilih Akun</option>';
    // eslint-disable-next-line no-lone-blocks
    {
      accounts.map((data) =>
        data.is_default === 1
          ? ""
          : (row += `<option ${
              data.id === account_id ? "selected" : ""
            }  value="${data.id}">${data.bank_name}(${
              data.account_number
            })</option>'`)
      );
    }
    row += "</select>";

    row += "</td>";
    row += "<td>";
    row +=
      '<input required class="form-control transfer_to"  value="' +
      transfer_to +
      '" >';
    row += "</td>";
    row += "<td hidden>";
    row +=
      '<input required class="form-control transfer_to"  value="' + id + '" >';
    row += "</td>";

    row += '<th style="textAlign:right">';

    row +=
      ' <button type="button" class="btn btn-danger" id="delete-row"><i className="fa fa-plus"/>X</button>';
    row += "</th>";
    row += "</tr>";
    $("#use-datatable tbody").append(row);
  };

  const setDataBudgetCreated = (data) => {
    var row = "";

    if (data.length === 0) {
    } else {
      for (var i = 0; i < data.length; i++) {
        row += `<tr>
            <td>IDR ${data[i].amount
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}</td>           
                     <td>${dateFormat(data[i].date, "dd/mm/yyyy")}</td>
                    
                     <td>  ${data[i].account.bank_name} (${
          data[i].account.account_number
        })
                     
                     </td>
                     <td>  ${data[i].transfer_to}
                     
                     </td>
  
                     </tr>
            `;
      }
    }
    $(".data-budget-selected").html(row);
  };

  const saveBudgets = (data) => {};

  const BudgetProject = (data) => {
    setDatatable({
      columns: [
        {
          label: "tanggal Transfer",
          field: "date",
          width: 270,
          textAlign: "right",
        },
        {
          label: "Nominal",
          field: "amount",
          width: 150,
          attributes: {
            "aria-controls": "DataTable",
            "aria-label": "Name",
          },
        },
        {
          label: "Akun",
          field: "",
          width: 200,
        },
      ],
      rows: data,
    });
  };

  const getDateSelected = () => {
    var id = props.match.params.id;
    axios
      .get(`${API_URL}/api/budgets/detail-budget/` + id)
      .then((response) => {
        if (response.data.data.transactions.length > 0) {
          setDataBudgetCreated(response.data.data.transactions);
          console.log("erew", response.data.data.transactions);
          calculation();
          $("#budgets-datatable").DataTable();
        }
      })
      .catch((response) => {
        setTempIsLoadingBudgets(false);
        setMainIsLoading(false);
      });
  };

  const getBudgetTransaction = () => {
    var id = props.match.params.id;
    axios
      .get(`${API_URL}/api/budgets/detail-budget/` + id)
      .then((response) => {
        console.log("tes");
        if (response.data.data.transactions.length > 0) {
          setBudgets([...response.data.data.transactions]);
        }
      })
      .catch((response) => {});
  };

  useEffect(() => {
    var id = props.match.params.id;

    getDataAccounts().then((accounts) => {
      setAccount([...accounts]);

      //get detail budgets
      axios
        .get(`${API_URL}/api/budgets/detail-budget/` + id)
        .then((response) => {
          if (response.data.data.transactions.length > 0) {
            setBudgets([...response.data.data.transactions]);
            BudgetProject(response.data.data.transactions);
            setStatus(response.data.data.status);
            setBudgetStartDate(
              dateFormat(response.data.data.budget_start_date, "yyyy-mm-dd")
            );
            setBudgetEndtDate(
              dateFormat(response.data.data.budget_end_date, "yyyy-mm-dd")
            );
            setTotalBudgetProject(
              response.data.data.total_budget
                .toString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            );
            setTempIsLoadingBudgets(false);
            setMainIsLoading(false);
            response.data.data.transactions.map((value) =>
              updateBudgets(
                value.amount,
                value.date,
                value.account_id,
                accounts,
                value.transfer_to,
                value.id
              )
            );
            //setDataBudgetCreated(response.data.data.transactions);
            getDateSelected();
            //getDateSelected(response.data.data.transactions)
            console.log("erew", response.data.data.transactions);
            calculation();
            $("#budgets-datatable").DataTable();
          } else {
            setMainIsLoading(false);
            setTempIsLoadingBudgets(false);
            setMainIsLoading(false);
            setStatus(response.data.data.status);
          }
        })
        .catch((response) => {
          setTempIsLoadingBudgets(false);
          setMainIsLoading(false);
        });
    });

    // $('.budgets-datatable').DataTable();
  }, []);

  return (
    <div>
      <ToastContainer />
      <Projects id={props.match.params.id}></Projects>:
      <div class="pills-regular">
        <ul className="nav nav-pills mb-2" id="pills-tab" role="tablist">
          <li className="nav-item" id="members">
            <Button variant="contained" onClick={() => membersPage()}>
              Anggota
            </Button>
          </li>
          &ensp;
          <li className="nav-item" id="budgets" to="/projects/manage">
            <Button
              variant="contained"
              color="primary"
              onClick={() => budgetsPage()}
            >
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
      {mainisLoading === false ? (
        <CCard>
          <CCardHeader>
            <div style={{ float: "right", width: "100%" }}>
              <div style={{ float: "left", position: "absolute" }}>
                <span>
                  <strong>Anggaran Project</strong>
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                {status !== "closed" ? (
                  <CButton
                    size="sm"
                    disabled={tempIsloadingBudgets}
                    className="btn-brand mr-1 mb-1"
                    color="primary"
                    onClick={() => setModalBudgets(!modalBudgets)}
                  >
                    {budgets.length <= 0 ? (
                      <span>
                        {tempIsloadingBudgets ? (
                          <i class="fas fa-circle-notch fa-spin" />
                        ) : (
                          <i class="fa fa-plus" />
                        )}{" "}
                        Tambah
                      </span>
                    ) : (
                      <span>
                        {tempIsloadingBudgets ? (
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
            {budgets == "" ? (
              <div style={{ textAlign: "center" }}>
                <img
                  src="https://arenzha.s3.ap-southeast-1.amazonaws.com/eo/icons/budget.png"
                  alt="new"
                  style={{ width: "10%", height: "10%" }}
                />
                <br />
                <span>Belum ada Budget Project</span>
              </div>
            ) : (
              <CFormGroup row className="my-0">
                <CCol xs="6">
                  <CFormGroup>
                    <CLabel htmlFor="budget_start_date">
                      Tanggal effective budget
                    </CLabel>
                    <CInput
                      readOnly
                      placeholder=""
                      type="date"
                      value={budgetStartDate}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs="6">
                  <CFormGroup>
                    <CLabel htmlFor="budget_end_date">
                      Tanggal expired budget
                    </CLabel>
                    <CInput
                      readOnly
                      placeholder=""
                      type="date"
                      value={budgetEndDate}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel htmlFor="budgets">Total Anggaran</CLabel>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>IDR</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        style={{ textAlign: "right" }}
                        value={TotalBudgetProject}
                      />
                    </CInputGroup>
                  </CFormGroup>
                </CCol>
                <CCol xs="12">
                  <br></br>
                  <table
                    tyle={{ width: "100%" }}
                    class="table table-striped budgets-datatable"
                    id="budgets-datatable"
                  >
                    <thead s>
                      <tr>
                        <th>Nominal</th>
                        <th>Tanggal Transfer</th>

                        <th style={{ width: "30%" }}>Transfer dari</th>
                        <th>Transfer ke</th>
                      </tr>
                    </thead>
                    <tbody
                      id="data-budget-selected"
                      class="data-budget-selected"
                    ></tbody>
                  </table>
                  {/* <MDBDataTableV5
                  hover
                  entriesOptions={[5, 20, 25]}
                  entries={5}
                  pagesAmount={10}
                  data={datatable}    
                  paging={false}                 
                  searchTop
                  searchBottom={false}
                  barReverse                                         
              /> */}
                </CCol>
              </CFormGroup>
            )}
          </CCardBody>

          <CModal
            show={modalBudgets}
            onClose={() => setModalBudgets(!modalBudgets)}
            size="lg"
          >
            <CModalHeader closeButton>
              <CModalTitle>Tambah budget project</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <Formik
                initialValues={{
                  budget_start_date: budgetStartDate,
                  budget_end_date: budgetEndDate,
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.budget_start_date) {
                    errors.budget_start_date = "Required";
                  } else if (!values.budget_end_date) {
                    errors.budget_end_date = "Required";
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTempIsLoadingBudgets(true);
                  var total_budget = $("#total_budget")
                    .val()
                    .replace(/[^\w\s]/gi, "");

                  var project_id = props.match.params.id;
                  var budget_start_date = $("#budget_start_date").val();
                  var budget_end_date = $("#budget_end_date").val();
                  var project_number = $("#project_number").val();
                  var transaction_id = `${project_number}_website_transactions`;
                  var budget_project = [];
                  var accounts = [];
                  var datatable_budgets = [];
                  var ids = [];
                  var budget1 = [];
                  var account;

                  // var description=`Penambahan anggaran untuk project dengan No. Project <a href='http://localhost:3001/mapping/manage#/mapping/members/${project_id}'>${project_number}</a>`

                  var description = `Penambahan anggaran untuk project dengan No. Project ${project_number}`;
                  if (
                    budget_start_date.toString() != "" &&
                    budget_end_date.toString() != ""
                  ) {
                    $("#use-datatable tbody tr").each(function () {
                      var budget = $(this)
                        .find("td:nth-child(1) input")
                        .val()
                        .replace(/[^\w\s]/gi, "");
                      var transfer_date = $(this)
                        .find("td:nth-child(2) input")
                        .val();
                      var account_bank = $(this)
                        .find("td:nth-child(3) select")
                        .val();
                      var transfer_to = $(this)
                        .find("td:nth-child(4) input")
                        .val();
                      var id = $(this).find("td:nth-child(5) input").val();
                      console.log(id);

                      if (id != null) {
                        budget1 = {
                          amount: budget,
                          date: transfer_date,
                          type: "in",
                          description: "Penambahan anggaran project",
                          image: "",
                          account_id: account_bank,

                          project_id: project_id,
                          transfer_to: transfer_to,
                          id: id,
                        };
                      } else {
                        budget1 = {
                          amount: budget,
                          date: transfer_date,
                          type: "in",
                          description: "Penambahan anggaran project",
                          image: "",
                          account_id: account_bank,

                          project_id: project_id,
                          transfer_to: transfer_to,
                          id: "",
                        };
                      }

                      account = [
                        project_number,
                        budget,
                        transfer_date,
                        "out",
                        description,
                        "",
                        account_bank,
                        "111",
                        props.match.params.id,
                        "budget_transaction_project",
                      ];

                      //inialisai insert multipel row to database
                      //rquest {amount:budget,date:date,type:type,image:image,account_Id:account:id,project_id:project_id}

                      // for datatable budget this page
                      var datatable_budget = {
                        date: transfer_date,
                        amount: budget,
                        account_id: account_bank,
                      };

                      budget_project.push(budget1);
                      console.log("id", budget_project);
                      accounts.push(account);
                      datatable_budgets.push(datatable_budget);
                    });

                    budgets.map((value) => {
                      const filter = budget_project.filter(
                        (e) => value.id.toString() === e.id
                      );
                      if (filter.length > 0) {
                      } else {
                        ids.push(value.id);
                      }
                    });
                    let data_budget = {
                      budget_start_date: budget_start_date,
                      budget_end_date: budget_end_date,
                      opening_balance: total_budget,
                      project_id: project_id,
                    };
                    let data_transaction_project = {
                      data: budget_project,
                      project_id: project_id,
                      data_transactions_account: accounts,
                      transaction_id: transaction_id,
                      ids: ids,
                    };

                    axios
                      .post(`${API_URL}/api/budgets/create-budget`, data_budget)
                      .then((response) => {
                        // create transacton project
                        axios
                          .post(
                            `${API_URL}/api/projects/transaction-project`,
                            data_transaction_project
                          )
                          .then((response) => {
                            toast.success(
                              "Berhasil menambahkan anggaran project",
                              {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                color: "success",
                              }
                            );

                            setTempIsLoadingBudgets(false);
                            getDateSelected();
                            setModalBudgets(false);
                            setBudgets([...datatable_budgets]);
                            BudgetProject(datatable_budgets);
                            getBudgetTransaction();

                            setTotalBudgetProject(
                              total_budget
                                .toString()
                                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
                            );
                            setBudgetStartDate(values.budget_start_date);
                            setBudgetEndtDate(values.budget_end_date);
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      });
                  }
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
                          <CLabel htmlFor="budget_start_date">
                            Tanggal Mulai anggaran{" "}
                          </CLabel>
                          <CInput
                            required
                            name="budget_start_date"
                            id="budget_start_date"
                            placeholder=""
                            type="date"
                            onChange={handleChange}
                            value={values.budget_start_date}
                          />
                        </CFormGroup>
                      </CCol>
                      <CCol xs="6">
                        <CFormGroup>
                          <CLabel htmlFor="budget_end_date">
                            Tanggal Akhir Anggaran
                          </CLabel>
                          <CInput
                            required
                            name="budget_end_date"
                            id="budget_end_date"
                            placeholder=""
                            type="date"
                            onChange={handleChange}
                            value={values.budget_end_date}
                          />
                        </CFormGroup>
                      </CCol>
                    </CFormGroup>
                    <CCol xs="12">
                      <CFormGroup>
                        <CLabel htmlFor="budgets">Total Anggaran</CLabel>
                        <CInputGroup>
                          <CInputGroupPrepend>
                            <CInputGroupText>IDR</CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            style={{ textAlign: "right" }}
                            id="total_budget"
                            name="total_budget"
                            value={tempTotalBudgets}
                          />
                        </CInputGroup>
                      </CFormGroup>
                    </CCol>

                    <br />
                    <table
                      tyle={{ width: "100%" }}
                      class="table table-striped"
                      id="use-datatable"
                    >
                      <thead s>
                        <tr>
                          <th width="35%">Nominal</th>
                          <th>Tanggal Transfer</th>
                          <th width="35%">Transfer dari</th>
                          <th style={{ width: "35%" }}>Transfer ke</th>
                          <th style={{ textAlign: "right", width: "25px" }}>
                            <button
                              type="button"
                              class="btn btn-primary"
                              onClick={() => setDataBudgets()}
                            >
                              <i className="fa fa-plus" />
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody id="data-budgets"></tbody>
                    </table>
                    <div style={{ textAlign: "right" }}>
                      <CButton
                        type="submit"
                        disabled={tempIsloadingBudgets}
                        onClick={() => saveBudgets()}
                        size="sm"
                        className="btn-brand mr-1 mb-1"
                        color="primary"
                      >
                        {tempIsloadingBudgets ? (
                          <span>
                            <i class="spinner-border"></i> Simpan
                          </span>
                        ) : (
                          <span>
                            <i class="fa fa-save" /> Simpan
                          </span>
                        )}
                      </CButton>
                    </div>
                  </form>
                )}
              </Formik>
            </CModalBody>
            <CModalFooter></CModalFooter>
          </CModal>
        </CCard>
      ) : (
        <span></span>
      )}
    </div>
  );
}
export default Budgets;
