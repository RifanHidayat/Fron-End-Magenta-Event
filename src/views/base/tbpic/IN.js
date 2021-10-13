// import React, { useState, useEffect, useMemo } from "react";

// import Button from "@material-ui/core/Button";
// import {
//   getAllFaktur,
//   getDetailPIC,
//   DataInTransactions,
//   getAcounts,
// } from "./data/pic";

// import { Formik } from "formik";
// import Select from "react-select";
// import $ from "jquery";
// import DataTable from "react-data-table-component";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useHistory } from "react-router-dom";
// import Table from "./components/DTIntrasaction";
// import FilterComponent from "src/views/base/components/FilterComponent";
// import { API_URL } from "src/views/base/components/constants";
// import BeatLoader from "react-spinners/BeatLoader";

// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCardFooter,
//   CFormGroup,
//   CLabel,
//   CCol,
//   CInput,
//   CInputGroup,
//   CInputGroupPrepend,
//   CInputGroupText,
//   CTooltip,
// } from "@coreui/react";

// var dateFormat = require("dateformat");
// function IN(props) {
//   const columns = [
//     {
//       name: "No Invoie",

//       sortable: true,
//       width: "15%",
//       filterable: true,
//       cell: (row) => <span>{row.faktur_number}</span>,
//     },

//     {
//       name: "No Po",

//       sortable: true,
//       width: "15%",
//       cell: (row) => row.po_number,
//     },
//     {
//       name: "No. Project",

//       sortable: true,
//       width: "15%",
//       cell: (row) => row.project_number,
//     },
//     {
//       name: "Deskripsi",
//       selector: "openin_balance",
//       sortable: true,
//       width: "15%",
//       cell: (row) => row.description,
//     },
//     {
//       name: "Tanggal",
//       selector: "balance",
//       sortable: true,
//       width: "10%",
//       cell: (row) => dateFormat(row.date, "dd/mm/yyyy"),
//     },
//     {
//       name: "Jumlah",
//       selector: "balance",
//       sortable: true,
//       width: "15%",
//       cell: (row) => (
//         <span>
//           {" "}
//           IDR {row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
//         </span>
//       ),
//     },
//     {
//       name: "Aksi",
//       selector: "",
//       sortable: true,
//       width: "15%",

//       cell: (row) => (
//         <div style={{ float: "left", width: "250%" }}>
//           <CTooltip content="Edit PIC TB" placement="top">
//             <CButton
//               color="secondary"
//               size="sm"
//               onClick={() =>
//                 editData(
//                   row.id,
//                   row.date,
//                   row.amount,
//                   row.faktur_id,
//                   row.faktur_number,
//                   row.po_number,
//                   row.project_number,
//                   row.project_id,
//                   row.description,
//                   row.pembayaran != null
//                     ? Number(row.total_faktur) -
//                         Number(row.pembayaran) +
//                         Number(row.amount)
//                     : Number(row.total_faktur),
//                   row.pembayaran != null ? row.pembayaran : 0,
//                   row.pic_event,
//                   row.id_pic_event
//                 )
//               }
//             >
//               {<i class="fa fa-edit"></i>}
//             </CButton>
//           </CTooltip>
//           &ensp;
//           <CTooltip content="Hapus PIC TB" placement="top">
//             <CButton
//               color="secondary"
//               size="sm"
//               onClick={() =>
//                 deletePIC(row.id, row.pembayaran - row.amount, row.faktur_id)
//               }
//             >
//               {<i class="fa fa-trash"></i>}
//             </CButton>
//           </CTooltip>
//         </div>
//       ),
//     },
//   ];

//   const [faktur, setFakatur] = useState([]);
//   const [idFaktur, setIdFaktur] = useState();
//   const [fakturNumber, setFakturNumber] = useState();
//   const [projectNumber, setProjectNumber] = useState();
//   const [picEvent, setPicEvent] = useState();
//   const [idPicEvent, setIdPicEvent] = useState();
//   const [descriptionProject, setDescrionProject] = useState();
//   const [accounts, setAccounts] = useState([]);

//   const [projectId, setProjectId] = useState();
//   const [totalFaktur, setTotalFaktur] = useState(0);
//   const [poNumber, setPoNumber] = useState();
//   const [balanceTb, setBalanceTB] = useState(0);
//   const [nameTb, setNameTb] = useState();
//   const [totalProject, setTotalProject] = useState();
//   const [value, setvalue] = useState(null);
//   const [dataInTransactions, setDataInTransactions] = useState([]);
//   const [idInTransactions, setIdInTransactions] = useState("");
//   const [isDisabledInvoice, setIsDisabledInvoice] = useState(false);
//   const [payment, setPayment] = useState();
//   const [disabledButton, setDisabledButton] = useState(true);
//   const [quotationNumber, setQuotationNumber] = useState();
//   const [isLoading, setIsLoading] = useState();
//   // const [totalFaktur,setTotalFaktur]=useState();

//   //loading spinner
//   const [tempIsLoading, setTempisLoading] = useState(true);

//   //variable push page
//   const navigator = useHistory();

//   //masking
//   $(document).on("input", "#payment", function (e) {
//     var payment_error = document.getElementById("payment_error");
//     e.preventDefault();
//     var objek = $("#payment").val();
//     var separator = ".";
//     var a = objek;
//     var b = a.replace(/[^\d]/g, "");
//     var c = "";
//     var panjang = b.length;
//     var j = 0;
//     for (var i = panjang; i > 0; i--) {
//       j = j + 1;
//       if (j % 3 == 1 && j != 1) {
//         c = b.substr(i - 1, 1) + separator + c;
//       } else {
//         c = b.substr(i - 1, 1) + c;
//       }
//     }
//     $("#payment").val(c);
//     console.log(
//       $("#payment")
//         .val()
//         .replace(/[^\w\s]/gi, "")
//     );

//     if (
//       Number(
//         $("#payment")
//           .val()
//           .replace(/[^\w\s]/gi, "")
//       ) > Number(totalFaktur)
//     ) {
//       payment_error.textContent = "Jumlah bayar melebihi batas maksimal";

//       setDisabledButton(true);
//     } else if (
//       Number(
//         $("#payment")
//           .val()
//           .replace(/[^\w\s]/gi, "")
//       ) > Number(balanceTb)
//     ) {
//       payment_error.textContent = "Jumlah bayar melebihi Saldo TB";

//       setDisabledButton(true);
//     } else {
//       setDisabledButton(false);

//       payment_error.textContent = "";
//     }
//   });

//   const onSelected = (selectedOptions) => {
//     var payment_error = document.getElementById("payment_error");
//     payment_error.textContent = "";

//     var pembayaran =
//       Number(selectedOptions.total_faktur) - Number(selectedOptions.payment);
//     setvalue(selectedOptions);
//     console.log(selectedOptions.quotation_number);
//     console.log(selectedOptions);
//     setIdFaktur(selectedOptions.value);
//     setFakturNumber(selectedOptions.setFakturNumber);
//     setPicEvent(selectedOptions.pic);
//     setIdPicEvent(selectedOptions.setIdPicEvent);
//     setProjectId(selectedOptions.project_id);
//     setProjectNumber(selectedOptions.project_number);
//     setDescrionProject(selectedOptions.project_description);
//     setPoNumber(selectedOptions.po_number);

//     $("#total_project_cost").val(
//       selectedOptions.total_project_cost
//         .toString()
//         .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
//     );
//     setTotalProject(selectedOptions.total_project_cost);

//     pembayaran > balanceTb
//       ? $("#payment").val(
//           balanceTb.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
//         )
//       : $("#payment").val(
//           selectedOptions.payment != null
//             ? (
//                 Number(selectedOptions.total_faktur) -
//                 Number(selectedOptions.payment)
//               )
//                 .toString()
//                 .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
//             : selectedOptions.total_faktur
//                 .toString()
//                 .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
//         );

//     setPayment(selectedOptions.payment != null ? selectedOptions.payment : 0);
//     setQuotationNumber(selectedOptions.quotation_number);

//     setTotalFaktur(
//       selectedOptions.payment != null
//         ? Number(selectedOptions.total_faktur) - Number(selectedOptions.payment)
//         : selectedOptions.total_faktur
//     );
//   };
//   function getData() {
//     let id = props.match.params.id;
//     console.log("id pictb", id);
//     DataInTransactions(id).then((response) => {
//       setDataInTransactions([...response.data]);
//     });
//   }
//   const editData = (
//     id,
//     date,
//     amount,
//     faktur_id,
//     faktur_number,
//     po_number,
//     project_number,
//     project_id,
//     description,
//     total_faktur,
//     pembayaran,
//     pic_event,
//     pic_event_id
//   ) => {
//     setIdFaktur(faktur_id);
//     setFakturNumber(faktur_number);
//     setPicEvent(pic_event);
//     setIdPicEvent(pic_event_id);
//     setProjectId(project_id);
//     setProjectNumber(project_number);
//     setDescrionProject(description);
//     setPoNumber(po_number);
//     setTotalFaktur(total_faktur);
//     setPayment(Number(pembayaran) - Number(amount));
//     $("#total_project_cost").val(
//       amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
//     );
//     setTotalProject(amount);
//     $("#in_date").val(dateFormat(date, "yyyy-mm-dd"));
//     $("#payment").val(
//       amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
//     );
//     setIdInTransactions(id);
//     setIsDisabledInvoice(true);

//     var option_edit = {
//       faktur_id,
//       label: faktur_number,
//       total_faktur: total_faktur,
//       po_number: po_number,
//       pic: pic_event,
//       pic_id: pic_event_id,
//       project_id: project_id,
//       project_number: project_number,
//       project_description: description,
//       total_project_cost: amount,
//     };
//     setvalue(option_edit);
//   };
//   const backToSave = () => {
//     setTempisLoading(false);

//     $("#total_project_cost").val("");
//     $("#int_date").val(null);
//     //$('#int_date').text(null)

//     setIdFaktur("");
//     setFakturNumber("");
//     setPicEvent("");
//     setIdPicEvent("");
//     setProjectId("");
//     setProjectNumber("");
//     setDescrionProject("");
//     setPoNumber("");
//     setTotalFaktur("");
//     $("#total_project_cost").val("");
//     setTotalProject("");
//     setvalue(null);
//     setIdInTransactions("");
//     $("#payment").val("");
//     setPayment(0);

//     setIsDisabledInvoice(false);
//     $("#in_date").val(dateFormat("", "yyyy-mm-dd"));
//     $("#payment").val("");
//   };

//   const deletePIC = (id, payment, faktur_id) => {
//     console.log("payment", payment);
//     console.log("faktur id", faktur_id);
//     Swal.fire({
//       title: "Apakah anda yakin?",
//       text: "PIC TB akan dihapus",
//       icon: "warning",
//       reverseButtons: true,
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       cancelButtonText: "Cancel",
//       confirmButtonText: "Delete",
//       showLoaderOnConfirm: true,
//       preConfirm: () => {
//         return axios
//           .delete(
//             `${API_URL}/api/transactions/in/${id}/${faktur_id}/${payment}`
//           )
//           .then(function (response) {
//             console.log(response.data);
//           })
//           .catch(function (error) {
//             console.log(error.data);
//             Swal.fire({
//               icon: "error",
//               title: "Oops",
//               text: "Terjadi Kesalahan",
//             });
//           });
//       },
//       allowOutsideClick: () => !Swal.isLoading(),
//     }).then((result) => {
//       getData();
//       detailPIC();
//       getFaktur();
//       $("#payment").val("");
//       setPayment(0);
//       if (result.isConfirmed) {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Transaksi berhasil dihapus",
//           showConfirmButton: false,
//           timer: 2000,
//         }).then((result) => {
//           if (result.isConfirmed) {
//           }
//         });
//       }
//     });
//   };
//   const detailPIC = () => {
//     var id = props.match.params.id;
//     //get detail pic
//     getDetailPIC(id).then((response) => {
//       setBalanceTB(response.data.balance);
//       setNameTb(response.data.name);
//     });
//   };

//   const getFaktur = () => {
//     getAllFaktur().then((response) => {
//       const options = [];
//       response.data.map((data) => {
//         var option = {
//           value: data.id_faktur,
//           label: `${data.faktur_number} | ${data.po_number}`,
//           total_faktur: data.total_faktur,
//           po_number: data.po_number,
//           pic: data.pic_event,
//           pic_id: data.id_pic_event,
//           customer: data.event_customer,
//           project_id: data.project_id,
//           project_number: data.project_number,
//           project_description: data.description,
//           total_project_cost: data.total_project_cost,
//           payment: data.pembayaran,
//           quotation_number: data.quotation_number,
//         };

//         if (Number(data.total_faktur) - Number(data.pembayaran) > 0) {
//           options.push(option);
//         }
//       });
//       setFakatur([...options]);

//       detailPIC();
//       setTempisLoading(false);
//       setDisabledButton(false);
//     });
//   };
//   useEffect(() => {
//     setIsLoading(true);

//     const data = JSON.parse(localStorage.getItem("permission"));
//     const permission = data.filter((value) => value === "pictb");
//     if (permission <= 0) {
//       Navigator.push("/dashboard");
//     }
//     getFaktur();
//     getData();
//     setIsLoading(false);
//   }, []);

//   function pageCashIN() {
//     navigator.push(`/pictb/in-transaction/${props.match.params.id}`);
//   }

//   function pageCashOut() {
//     navigator.push(`/pictb/out-transaction/${props.match.params.id}`);
//   }

//   const [filterText, setFilterText] = React.useState("");
//   const [resetPaginationToggle, setResetPaginationToggle] =
//     React.useState(false);

//   const filteredItems = dataInTransactions.filter(
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
//   return (
//     <div>
//       <div class="pills-regular">
//         <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">
//           <li class="nav-item active" id="members">
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => pageCashIN()}
//             >
//               IN
//             </Button>
//           </li>
//           &ensp;
//           <li class="nav-item" id="budgets" to="/projects/manage">
//             {/* cash out by Ralf Schmitzer from the Noun Project */}
//             <Button variant="contained" onClick={() => pageCashOut()}>
//               OUT
//             </Button>
//           </li>
//           &ensp;
//         </ul>
//       </div>
//       <CCard>
//         <CCardHeader>
//           <div style={{ float: "right", width: "100%" }}>
//             <div style={{ float: "left", position: "absolute" }}>
//               <span>
//                 <strong>Transaksi In</strong>
//               </span>
//             </div>
//             <div style={{ float: "right" }}>
//               <span>
//                 <strong>TB: {nameTb}</strong>
//               </span>
//             </div>
//           </div>
//         </CCardHeader>
//         <CCardBody>
//           <Formik
//             initialValues={{
//               total_project_cost: "",
//               in_date: "",
//             }}
//             validate={(values) => {}}
//             onSubmit={(values, { setSubmitting }) => {
//               setTempisLoading(true);
//               setDisabledButton(true);
//               let id = props.match.params.id;
//               const data = {
//                 faktur_id: idFaktur,
//                 project_id: projectId,
//                 description: descriptionProject,
//                 date:
//                   values.in_date === "" ? $("#in_date").val() : values.in_date,
//                 amount: $("#payment")
//                   .val()
//                   .replace(/[^\w\s]/gi, ""),
//                 payment:
//                   Number(
//                     $("#payment")
//                       .val()
//                       .replace(/[^\w\s]/gi, "")
//                   ) + Number(payment),
//                 project_number: projectNumber,
//                 quotation_number: quotationNumber,
//                 //type:'out',
//                 id_pictb: id,
//               };

//               if (idInTransactions === "") {
//                 axios
//                   .post(`${API_URL}/api/transactions/in`, data)
//                   .then((response) => {
//                     Swal.fire({
//                       title: "success",
//                       text: "Berhasil menambahkan Transaksi",
//                       icon: "success",
//                       timer: 2000,
//                       showConfirmButton: false,
//                     }).then((_) => {
//                       detailPIC();
//                       getFaktur();
//                       setTempisLoading(false);
//                       setDisabledButton(false);
//                       getData();
//                       $("#total_project_cost").val("");
//                       $("#in_date").val("");
//                       $("#payment").val("");
//                       //$('#int_date').text(null)

//                       setIdFaktur("");
//                       setFakturNumber("");
//                       setPicEvent("");
//                       setIdPicEvent("");
//                       setProjectId("");
//                       setProjectNumber("");
//                       setQuotationNumber("");
//                       setDescrionProject("");
//                       setPoNumber("");
//                       setTotalFaktur(0);
//                       $("#total_project_cost").val("");
//                       setTotalProject("");
//                       setIdInTransactions("");
//                       setvalue(null);
//                       setIsDisabledInvoice(false);
//                       $("#in_date").val(dateFormat("", "yyyy-mm-dd"));
//                     });
//                   })
//                   .catch((error) => {
//                     setIsDisabledInvoice(false);

//                     console.error("There was an error!", error);
//                   });
//               } else {
//                 //edit data

//                 axios
//                   .patch(
//                     `${API_URL}/api/transactions/in/` + idInTransactions,
//                     data
//                   )
//                   .then((response) => {
//                     setIsDisabledInvoice(false);
//                     Swal.fire({
//                       title: "success",
//                       text: "Berhasil mengubah Transaksi",
//                       icon: "success",
//                       timer: 2000,
//                       showConfirmButton: false,
//                     }).then((_) => {
//                       setDisabledButton(false);

//                       detailPIC();
//                       getFaktur();
//                       setTempisLoading(false);
//                       getData();

//                       $("#total_project_cost").val("");
//                       $("#int_date").val(null);
//                       $("#payment").val("");
//                       //$('#int_date').text(null)

//                       setIdFaktur("");
//                       setFakturNumber("");
//                       setPicEvent("");
//                       setIdPicEvent("");
//                       setProjectId("");
//                       setProjectNumber("");
//                       setDescrionProject("");
//                       setPoNumber("");
//                       setTotalFaktur(0);
//                       $("#total_project_cost").val("");
//                       setTotalProject("");
//                       setvalue(null);
//                       setIdInTransactions("");
//                       setIsDisabledInvoice(false);
//                       $("#in_date").val(dateFormat("", "yyyy-mm-dd"));
//                       setQuotationNumber("");
//                     });
//                   })
//                   .catch((error) => {
//                     setIsDisabledInvoice(false);
//                     console.error("There was an error!", error);
//                   });
//               }
//             }}
//           >
//             {({
//               values,
//               errors,
//               touched,
//               handleChange,
//               handleBlur,
//               handleSubmit,
//               isSubmitting,
//               /* and other goodies */
//             }) => (
//               <form onSubmit={handleSubmit} autoComplete="off">
//                 <CFormGroup row>
//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel htmlFor="type">No. Invoice</CLabel>
//                       <Select
//                         onChange={onSelected}
//                         className="basic-single"
//                         classNamePrefix="select"
//                         options={faktur}
//                         value={value}
//                         isDisabled={isDisabledInvoice}
//                         name="color"
//                       />
//                     </CFormGroup>
//                   </CCol>
//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel>Saldo TB</CLabel>
//                       <CInputGroup>
//                         <CInputGroupPrepend>
//                           <CInputGroupText>IDR</CInputGroupText>
//                         </CInputGroupPrepend>
//                         <CInput
//                           readOnly
//                           style={{ textAlign: "right" }}
//                           required
//                           onChange={handleChange}
//                           value={parseInt(balanceTb)
//                             .toString()
//                             .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
//                         />
//                       </CInputGroup>
//                     </CFormGroup>
//                   </CCol>
//                 </CFormGroup>
//                 <CFormGroup row>
//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel>No PO</CLabel>
//                       <CInput
//                         readOnly
//                         required
//                         onChange={handleChange}
//                         value={poNumber}
//                       />
//                     </CFormGroup>
//                   </CCol>
//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel>PIC Event</CLabel>
//                       <CInput
//                         readOnly
//                         required
//                         onChange={handleChange}
//                         value={picEvent}
//                       />
//                     </CFormGroup>
//                   </CCol>
//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel>Total Biaya Project</CLabel>
//                       <CInputGroup>
//                         <CInputGroupPrepend>
//                           <CInputGroupText>IDR</CInputGroupText>
//                         </CInputGroupPrepend>
//                         <CInput
//                           readOnly
//                           id
//                           required
//                           style={{ textAlign: "right" }}
//                           id="total_project_cost"
//                           name="total_project_cost"
//                           onChange={handleChange}
//                         />
//                       </CInputGroup>
//                     </CFormGroup>
//                   </CCol>
//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel>Total Biaya Faktur</CLabel>
//                       <CInputGroup>
//                         <CInputGroupPrepend>
//                           <CInputGroupText>IDR</CInputGroupText>
//                         </CInputGroupPrepend>
//                         <CInput
//                           style={{ textAlign: "right" }}
//                           required
//                           onChange={handleChange}
//                           value={totalFaktur
//                             .toString()
//                             .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
//                         />
//                       </CInputGroup>
//                     </CFormGroup>
//                   </CCol>

//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel>No Project</CLabel>
//                       <CInput
//                         readOnly
//                         required
//                         onChange={handleChange}
//                         value={projectNumber}
//                       />
//                     </CFormGroup>
//                   </CCol>
//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel>Deskripsi </CLabel>
//                       <CInput
//                         readOnly
//                         required
//                         onChange={handleChange}
//                         value={descriptionProject}
//                       />
//                     </CFormGroup>
//                   </CCol>
//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel>Tanggal</CLabel>
//                       <CInput
//                         id="in_date"
//                         name="in_date"
//                         type="date"
//                         required
//                         onChange={handleChange}
//                       />
//                     </CFormGroup>
//                   </CCol>
//                   <CCol xs="3">
//                     <CFormGroup>
//                       <CLabel htmlFor="total_project_cost">Jumlah Bayar</CLabel>
//                       <CInputGroup>
//                         <CInputGroupPrepend>
//                           <CInputGroupText>IDR</CInputGroupText>
//                         </CInputGroupPrepend>
//                         <CInput
//                           required
//                           style={{ textAlign: "right" }}
//                           id="payment"
//                           name="payment"
//                           onChange={handleChange}
//                         />
//                       </CInputGroup>
//                       <small
//                         class="text-danger pl-3"
//                         id="payment_error"
//                       ></small>
//                     </CFormGroup>
//                   </CCol>
//                 </CFormGroup>
//                 <CCardFooter>
//                   {idInTransactions === "" ? (
//                     <div style={{ textAlign: "right" }}>
//                       <CButton
//                         to="/pictb/manage"
//                         size="sm xs-1"
//                         className="btn-secondary btn-brand mr-1 mb-1"
//                       >
//                         Kembali
//                       </CButton>
//                       <CButton
//                         type="submit"
//                         disabled={disabledButton}
//                         size="sm xs-2"
//                         className="btn-brand mr-1 mb-1"
//                         color="primary"
//                       >
//                         {tempIsLoading === true ? (
//                           <i class="spinner-border" />
//                         ) : (
//                           <i class="fa fa-save" />
//                         )}
//                         <span className="mfs-1">Simpan</span>
//                       </CButton>
//                     </div>
//                   ) : (
//                     <div style={{ textAlign: "right" }}>
//                       <CButton
//                         onClick={() => backToSave()}
//                         size="sm xs-1"
//                         className="btn-secondary btn-brand mr-1 mb-1"
//                       >
//                         X
//                       </CButton>
//                       <CButton
//                         type="submit"
//                         size="sm xs-1"
//                         disabled={disabledButton}
//                         className="btn-brand mr-1 mb-1"
//                         color="primary"
//                       >
//                         {tempIsLoading === true ? (
//                           <i class="spinner-border" />
//                         ) : (
//                           <i class="fa fa-edit" />
//                         )}
//                         <span className="mfs-2">Ubah</span>
//                       </CButton>
//                     </div>
//                   )}
//                 </CCardFooter>
//               </form>
//             )}
//           </Formik>
//         </CCardBody>
//       </CCard>

//       <CCard>
//         <CCardHeader>
//           <span>
//             <strong>Data Transaksi In</strong>
//           </span>
//         </CCardHeader>
//         <CCardBody>
//           {isLoading === false ? (
//             <DataTable
//               columns={columns}
//               data={filteredItems}
//               defaultSortField="name"
//               pagination
//               subHeader
//               subHeaderComponent={subHeaderComponent}
//               paginationPerPage={5}
//             />
//           ) : (
//             <center>
//               <div style={{ height: "200px" }}>
//                 <BeatLoader color={"blue"} loading={true} size={20} />
//               </div>
//             </center>
//           )}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default IN;

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import { useHistory } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "react-toastify/dist/ReactToastify.css";
import { Formik } from "formik";
import $ from "jquery";
import "jspdf-autotable";
import DataTable from "react-data-table-component";
import FilterComponent from "src/views/base/components/FilterComponent";
import Select from "react-select";
import { getAcounts, getInOutTransaction, getDetailPIC } from "./data/pic";
import { API_URL } from "src/views/base/components/constants";
import Swal from "sweetalert2";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CLabel,
  CInput,
  CCol,
  CButton,
  CFormGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CCardFooter,
  CTooltip,
} from "@coreui/react";
import Button from "@material-ui/core/Button";

var dateFormat = require("dateformat");
function InOut(props) {
  const [costProject, setCostProject] = useState([]);
  const [idCostTransactions, setIdCostTransactions] = useState("");
  const [tempIsLoading, setTempIsLoading] = useState();
  const [accounts, setAccounts] = useState([]);
  const [inoutNumber, setInOutNumber] = useState();
  const [idAccountIn, setIdAccountIn] = useState();
  const [idAccountOut, setIdAccountOut] = useState();
  const [valueIn, setValuein] = useState(null);
  const [valueOut, setValueout] = useState(null);
  const [inoutTransactions, setInOutTransactions] = useState([]);
  const [idInOutTransaction, setIdInOutTransaction] = useState("");
  const [balanceTb, setBalanceTB] = useState(0);
  const [nameTb, setNameTb] = useState();
  //variable push page
  const navigator = useHistory();

  const getAllInOutDataCostProject = () => {
    getInOutTransaction(props.match.params.id).then((response) => {
      // console.log(response.data[1].quotation_po);
      setInOutTransactions([...response.data]);
    });
  };

  function pageCashIN() {
    navigator.push(`/pictb/in-transaction/${props.match.params.id}`);
  }
  function pageCashOut() {
    navigator.push(`/pictb/out-transaction/${props.match.params.id}`);
  }
  const columns = [
    {
      name: "No. Po",
      sortable: true,
      cell: (row) => row.quotation_po.code,
    },
    {
      name: "Tanggal",
      sortable: true,
      cell: (row) => dateFormat(row.date, "dd/mm/yyyy"),
    },
    {
      name: "Deskripsi",
      sortable: true,
      cell: (row) => row.description,
    },

    {
      name: "Jumlah",
      sortable: true,
      right: true,
      cell: (row) =>
        "IDR " +
        row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
    },

    {
      name: "Aksi",
      selector: "",
      sortable: true,
      width: "15%",
      center: true,

      cell: (row) => (
        <div>
          {/* <CTooltip content="Edit Cost"placement="top">
        <CButton color="secondary"  size="sm" onClick={()=>editData(
          row.id,
          row.inout_number,
          row.date,
          row.description,
          row.amount,
          row.account_in_id,
          row.account_out_id,
          row.account_in_name,
          row.account_out_name,
          row.account_in_number,
          row.account_out_number,
        )} >{<i class="fa fa-edit"></i>}</CButton>
        </CTooltip> */}
          &ensp;
          <CTooltip content="Hapus PIC TB" placement="top">
            <CButton
              color="secondary"
              size="sm"
              onClick={() => deleteData(row.id)}
            >
              <i class="fa fa-trash"></i>
            </CButton>
          </CTooltip>
        </div>
      ),
    },
  ];

  //masking
  $(document).on("input", "#amount", function (e) {
    e.preventDefault();
    var objek = $("#amount").val();
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
    $("#amount").val(c);
  });

  const editData = (
    id,
    inout_number,
    date,
    description,
    amount,
    account_in_id,
    account_out_id,
    account_in_name,
    account_out_name,
    account_in_number,
    account_out_number
  ) => {
    setIdAccountIn(account_in_id);
    setIdAccountOut(account_out_id);
    setIdInOutTransaction(id);

    $("#date").val(dateFormat(date, "yyyy-mm-dd"));
    $("#description").val(description);
    $("#amount_in_out").val(
      amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
    );
    var option_account_in = {
      value: account_in_id,
      label: account_in_name + ` (${account_in_number})`,
    };
    var option_account_out = {
      value: account_out_id,
      label: account_out_name + ` (${account_out_number})`,
    };
    setValuein(option_account_in);
    setValueout(option_account_out);
    setInOutNumber(inout_number);
    setIdCostTransactions(id);
  };
  const deleteData = (id) => {
    console.log("ee", id);
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data akan dihapus",
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
          .delete(`${API_URL}/api/add-tb-transactions/` + id)
          .then(function (response) {})
          .catch(function (error) {
            Swal.fire({
              icon: "error",
              title: "Oops",
              text: "Terjadi Kesalahan",
            });
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      getAllInOutDataCostProject();
      detailPIC();
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Transaksi berhasil dihapus",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.href = '/leave';
            // getAllOutTransactions()
          }
        });
      }
    });
  };

  const onSelectedOut = (selectedOptions) => {
    setValueout(selectedOptions);
    console.log("1", parseInt(selectedOptions.value));
    setIdAccountOut(parseInt(selectedOptions.value));
    getBalanceQuotationPo(selectedOptions.value);
    $("#amount").val(
      selectedOptions.amount
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
    );
    $("#description").val(selectedOptions.label);
  };
  const backToSave = () => {
    setIdInOutTransaction("");

    $("#date").val("");
    $("#description").val("");
    $("#amount").val("");

    setValuein(null);
    setValueout(null);

    setIdCostTransactions("");
  };
  const detailPIC = () => {
    var id = props.match.params.id;
    //get detail pic
    getDetailPIC(id).then((response) => {
      //setBalanceTB(response.data.balance=="N");
      setNameTb(response.data.name);
    });
  };

  const getBalanceQuotationPo = async (quotation_po_id) => {
    var id = props.match.params.id;
    axios
      .get(`${API_URL}/api/pictb/${id}/quotation-po/balance/${quotation_po_id}`)
      .then((response) => {
        setBalanceTB(response.data.data != null ? response.data.data : 0);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "pictb");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    detailPIC();

    getAllInOutDataCostProject();
    axios
      .get(`${API_URL}/api/quotation-po`)
      .then((response) => {
        setAccounts([...response.data.data]);
      })
      .catch((error) => {
        console.log(error);
      });

    // getAcounts().then((response) => {
    // response.data.map((values) => {
    //   var data = {
    //     value: values.id,
    //     label: values.bank_name + ` (${values.account_number})`,
    //   };
    //   if (
    //     values.id === 108 ||
    //     values.id === 100 ||
    //     values.id === 101 ||
    //     values.status !== "Active"
    //   ) {
    //   } else {
    //     option_accounts.push(data);
    //   }
    // });
    // setAccounts([...option_accounts]);
    //});
  }, []);

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const filteredItems = inoutTransactions.filter(
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
      <div class="pills-regular">
        <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">
          <li class="nav-item" id="members">
            <Button
              variant="contained"
              color="primary"
              onClick={() => pageCashIN()}
            >
              In
            </Button>
          </li>
          &ensp;
          <li class="nav-item" id="budgets" to="/projects/manage">
            {/* cash out by Ralf Schmitzer from the Noun Project */}
            <Button
              variant="contained"
              onClick={() => pageCashOut()}

              // startIcon={<DeleteIcon />}
            >
              Out
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
                <strong>In Transaction</strong>
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
          <Formik
            initialValues={
              {
                // date:'',
                // description:'',
                // amount_in_out:''
              }
            }
            validate={(values) => {}}
            onSubmit={(values, { setSubmitting }) => {
              var data = {
                date: $("#date").val(),
                description: $("#description").val(),
                amount: $("#amount")
                  .val()
                  .replace(/[^\w\s]/gi, ""),
                pictb_id: props.match.params.id,
                quotationpo_id: idAccountOut,
                name: nameTb,
              };

              axios
                .post(`${API_URL}/api/add-tb-transactions`, data)
                .then((response) => {
                  getAllInOutDataCostProject();
                  detailPIC();

                  backToSave();
                  Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Berhasil menambahkan saldo PIC",
                    showConfirmButton: false,
                    timer: 2000,
                  }).then((result) => {
                    if (result.isConfirmed) {
                    }
                  });
                })
                .catch((error) => {
                  console.log("terjadi kesalahan");
                });
            }}
          >
            {({
              handleChange,

              handleSubmit,

              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} autoComplete="off">
                <CFormGroup row>
                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel htmlFor="type">No. Po</CLabel>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        options={accounts}
                        onChange={onSelectedOut}
                        value={valueOut}
                        name="color"
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel>Saldo TB</CLabel>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>IDR</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          readOnly
                          style={{ textAlign: "right" }}
                          required
                          onChange={handleChange}
                          value={parseInt(balanceTb)
                            .toString()
                            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                        />
                      </CInputGroup>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel htmlFor="date">Tanggal</CLabel>
                      <CInput
                        required
                        id="date"
                        name="date"
                        type="date"
                        onChange={handleChange}
                      />
                    </CFormGroup>
                  </CCol>

                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel htmlFor="description">Deskripsi </CLabel>
                      <CInput
                        id="description"
                        name="description"
                        onChange={handleChange}
                      />
                    </CFormGroup>
                  </CCol>

                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel htmlFor="total">jumlah</CLabel>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>IDR</CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          required
                          style={{ textAlign: "right" }}
                          id="amount"
                          name="amount"
                          onChange={handleChange}
                        />
                      </CInputGroup>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                <CCardFooter>
                  {/* <div  style={{textAlign: 'right'}}>
                  <CButton type="submit" size="sm col-1"  className="btn-brand mr-1 mb-1" color='primary'>
                 Simpan
                  </CButton>
                  
                  {}      
              </div> */}

                  {idCostTransactions === "" ? (
                    <div style={{ textAlign: "right" }}>
                      <CButton
                        to="/pictb/manage"
                        size="sm xs-1"
                        className="btn-secondary btn-brand mr-1 mb-1"
                      >
                        Kembali
                      </CButton>
                      <CButton
                        type="submit"
                        size="sm xs-2"
                        className="btn-brand mr-1 mb-1"
                        color="primary"
                      >
                        {tempIsLoading === true ? (
                          <i class="spinner-border" />
                        ) : (
                          <i class="fa fa-save" />
                        )}
                        <span className="mfs-1">Simpan</span>
                      </CButton>
                    </div>
                  ) : (
                    <div style={{ textAlign: "right" }}>
                      <CButton
                        onClick={() => backToSave()}
                        size="sm xs-1"
                        className="btn-secondary btn-brand mr-1 mb-1"
                      >
                        X
                      </CButton>
                      <CButton
                        type="submit"
                        size="sm xs-1"
                        disabled={tempIsLoading}
                        className="btn-brand mr-1 mb-1"
                        color="primary"
                      >
                        {tempIsLoading === true ? (
                          <i class="spinner-border" />
                        ) : (
                          <i class="fa fa-edit" />
                        )}
                        <span className="mfs-2">Ubah</span>
                      </CButton>
                    </div>
                  )}
                </CCardFooter>
              </form>
            )}
          </Formik>

          <DataTable
            columns={columns}
            data={filteredItems}
            defaultSortField="name"
            pagination
            subHeader
            paginationPerPage={5}
            subHeaderComponent={subHeaderComponent}
          />

          {/* manage cost/ out projects */}
          {/* {tempisloadingCostProject===false? */}

          {/* // :
//   <DataTable
     
//   columns={columns}
//   data={costProject}
//   defaultSortField="name"
//   pagination
//   subHeader
//  // subHeaderComponent={subHeaderComponent}

// /> */}
        </CCardBody>
      </CCard>
    </div>
  );
}
export default InOut;
