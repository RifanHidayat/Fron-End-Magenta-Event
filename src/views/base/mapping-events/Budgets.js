import React,{ useState,useEffect }  from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { Formik } from 'formik';
import $ from 'jquery'
import { MDBDataTableV5 } from 'mdbreact';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CLabel,
  CInput,
  CCol,CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CFormGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,

} from '@coreui/react'
import { Projects } from './components/Projects';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getDataAccounts} from './data/accounts'


const columns = [  
  {
    name: 'Nominal',
    sortable: true,  
    right:true, cell: row => <div  data-tag="allowRowEvents"><div  ><div style={{textAlign:'right'}}>IDR {row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}  
    </div></div>
    </div>, 
   },
   
  {
    name: 'Tanggal Transfer',
    sortable: true,   
    cell: row => <div data-tag="allowRowEvents"><div >{row.date}</div></div>, 
   }, 

  {
    name: 'Akun',
    sortable: true,
    cell: row => <div data-tag="allowRowEvents"><div ></div></div>,  
  },
];

function Budgets(props){


    const [modalBudgets,setModalBudgets]=useState(false);
   
    const [tempTotalBudgets,setTempTotalBudgets]=useState([])
    const [account,setAccount]=useState([])
    const[budgets,setBudgets]=useState([])
    const [budgetStartDate,setBudgetStartDate]=useState();
    const [budgetEndDate,setBudgetEndtDate]=useState();
    const [datatable, setDatatable] = React.useState({});
    const [status,setStatus]=useState();
    const [TotalBudgetProject,setTotalBudgetProject]=useState();

    //loading spinner
    const [tempIsloadingBudgets,setTempIsLoadingBudgets]=useState(true);
    const [mainisLoading,setMainIsLoading]=useState(true)
    var dateFormat = require('dateformat');
   
    //variable push page
    const navigator = useHistory();
    

    //navigation page
    const budgetsPage=()=>{
      var id=props.match.params.id;
      navigator.push('/mapping/budgets/'+id);
    }
    const membersPage=()=>{
      var id=props.match.params.id;
      navigator.push('/mapping/members/'+id);
    }
    const tasksPage=()=>{
      var id=props.match.params.id;
      navigator.push('/mapping/tasks/'+id);
    }
    const approvalPage=()=>{
      var id=props.match.params.id;
      navigator.push('/mapping/approval/'+id);
    }

    function calculation(){
      var result=0;   
      $('#use-datatable tbody tr').each(function(){
         var nominal = $(this).find('td:nth-child(1) input').val().replace(/[^\w\s]/gi, '')
        // console.log(nominal)
        result =Number(nominal)+Number(result)
       });
       setTempTotalBudgets(result.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
       console.log(result)
    }



    //delete row
    $(document).on('click', '#delete-row', function(e) {
     e.preventDefault();
      var table=$('#use-datatable tbody tr');
      if (table.length<=1){
      }else{
        $(this).parent().parent().remove();
        calculation();
      }
    });

    $(document).on('input', '.nominal_budgets', function(e) {
      e.preventDefault();
      calculation() 
     });
    //add row
    const setDataBudgets=()=>{
     
      var row='';
      row += '<tr>';
       row+='<td>';
      row+='<input required class="form-control nominal_budgets"  >';
      row+='</td>';
      row+='<td>';
      row+='<input required name="budget_end_project" id="budget_end_project" type="date"  class="form-control" >';
      row+='</td>';
      row+='<td>';
      row+='<select required style="width:110%;height:35px;"  class="form-select" aria-label="Default select example">';
      row+='<option selected value="1">pilih Akun</option>';   
      // eslint-disable-next-line no-lone-blocks
      {account.map((data) => (
      row+='<option value="'+data.id+'">'+data.bank_name+'('+data.account_number+')</option>'
       ))}      
      row+='</select>';
      row+='</td>';      
       row+='<th style="textAlign:right">';
       row+=' <button type="button" class="btn btn-danger" id="delete-row"><i className="fa fa-plus"/>X</button>';
      row+='</th>';
      row+='</tr>';
      $('#use-datatable tbody').append(row);
          
    }

       //add row
       const updateBudgets=(amount,date,id,accounts)=>{
     
        var row='';
        row += '<tr>';
         row+='<td>';
        row+='<input required class="form-control nominal_budgets"  value="'+amount+'">';
        row+='</td>';
        row+='<td>';
        row+='<input required name="budget_end_project" id="budget_end_project" type="date"  class="form-control" value="'+dateFormat(date,'yyyy-mm-dd')+'" >';
        row+='</td>';
        row+='<td>';
        
        row+='<select required style="width:110%;height:35px;"  class="form-select" aria-label="Default select example">';
        row+='<option selected value="0">pilih Akun</option>';   
        // eslint-disable-next-line no-lone-blocks
        {accounts.map((data) => (
          
        row+='<option value="'+data.id+'">'+data.bank_name+'('+data.account_number+')</option>'
         ))}      
        row+='</select>';
    
        row+='</td>';      
         row+='<th style="textAlign:right">';
         row+=' <button type="button" class="btn btn-danger" id="delete-row"><i className="fa fa-plus"/>X</button>';
        row+='</th>';
        row+='</tr>';
        $('#use-datatable tbody').append(row);      
      }
      

    const saveBudgets=(data)=>{
   
    }

    const BudgetProject=(data)=>{
      setDatatable({
        columns: [
          {
            label: 'tanggal Transfer',
            field: 'date',
            width: 270,
            textAlign:'right',
          },
          {
            label: 'Nominal',
            field: 'amount',
            width: 150,
            attributes: {
              'aria-controls': 'DataTable',
              'aria-label': 'Name',
              
            },
          },
          {
            label: 'Akun',
            field: '',
            width: 200,
          },      
        ],
        rows: data
        
      })
    }

    useEffect(()=>{  
      var id=props.match.params.id;
      var dateFormat = require('dateformat');
      getDataAccounts().then(accounts=>{
        setAccount([...accounts])
    

      //get detail budgets
      axios.get('http://localhost:3000/api/budgets/detail-budget/'+id)
      .then((response)=>{

        console.log("tes",response)
        if (response.data.data.transactions.length>0){
        setBudgets(response.data.data.transactions)
        BudgetProject(response.data.data.transactions)
        setStatus(response.data.data.status)
        setBudgetStartDate(dateFormat(response.data.data.budget_start_date,'yyyy-mm-dd'))
        setBudgetEndtDate(dateFormat(response.data.data.budget_end_date,'yyyy-mm-dd'));
        setTotalBudgetProject(response.data.data.total_budget.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."));
 
        setTempIsLoadingBudgets(false)
        setMainIsLoading(false) 
        response.data.data.transactions.map((value)=>updateBudgets(value.amount,value.date,value.
        account_id,accounts))  
        calculation();  
        }else{
          setMainIsLoading(false) 
          setTempIsLoadingBudgets(false)
          setMainIsLoading(false) 
          setStatus(response.data.data.status)
          
        }     
      })
      .catch((response)=>{
        setTempIsLoadingBudgets(false)
        setMainIsLoading(false) 
       
      })       
        })    
    },[])



  return ( 
  
    <div>
      <ToastContainer />
      <Projects id={props.match.params.id} ></Projects>:
    
      <div class="pills-regular">
          <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">

              <li class="nav-item" id="members">
                  <button class="nav-link" onClick={()=>membersPage()}  > Anggota</button>
               </li>&ensp;

              <li class="nav-item" id="budgets" to="/projects/manage">
                  <button class="nav-link active" onClick={()=>budgetsPage()} > Anggaran</button>
               </li>&ensp;

               <li class="nav-item" id="tasks">
                   <button class="nav-link" onClick={()=>tasksPage()} > Tugas</button>
              </li>&ensp;

              <li class="nav-item" id="approval" >
                      <button class="nav-link" onClick={()=>approvalPage()}  > Persetujuan</button>
               </li>&ensp;
          </ul>
      </div>

      {mainisLoading===false  
      ?
      <CCard>
          <CCardHeader>
              <div style={{float:'right',width:'100%'}}>
                  <div style={{float:'left',position:'absolute'}}>
                      <span>
                          <strong>
                              Anggaran Project
                          </strong>
                      </span>
                  </div>
                  <div  style={{textAlign: 'right'}}>
                  {status==="pending"?
                    <CButton  size="sm" disabled={tempIsloadingBudgets}  className="btn-brand mr-1 mb-1" color='primary' onClick={()=>setModalBudgets(!modalBudgets)}>
                      {budgets.length<=0? <span>{tempIsloadingBudgets?<i class="fas fa-circle-notch fa-spin"/>:<i class="fa fa-plus"/>} Tambah</span>:<span>{tempIsloadingBudgets?<i class="fas fa-circle-notch fa-spin"/>:<i class="fa fa-edit"/>} Ubah</span>}
                      
                    </CButton> 
                    :<p></p>
                  }            
                </div>                              
              </div>
          </CCardHeader>
          <CCardBody>
              {budgets==''?
                  <div style={{textAlign:'center'}}>
                      <img 
                          src="https://arenzha.s3.ap-southeast-1.amazonaws.com/eo/icons/budget.png"
                          alt="new"
                          style={{width:'10%',height:'10%'}}
                      />
                       <br/>
                        <span>Belum ada Anggaran Project</span>
                  </div>
              :
              <CFormGroup  row className="my-0" >
              <CCol xs="6">
                    <CFormGroup>
                      <CLabel htmlFor="budget_start_date">Tanggal Mulai anggaran </CLabel>
                      <CInput readOnly     placeholder="" type="date"  value={budgetStartDate}  />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel htmlFor="budget_end_date">Tanggal Akhir Anggaran</CLabel>
                      <CInput readOnly    placeholder="" type="date" value={budgetEndDate} />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="12">
                    <CFormGroup>
                    <CLabel htmlFor="budgets">Total Anggaran</CLabel>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>IDR</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput style={{textAlign:'right'}}   value={TotalBudgetProject}/>                  
                    </CInputGroup>
                    </CFormGroup>
              </CCol>
                  <CCol xs="12">
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
              </CCol>
           </CFormGroup>      
              } 
          </CCardBody>
 
        <CModal 
            show={modalBudgets} 
            onClose={() => setModalBudgets(!modalBudgets)}
            size="lg">
            <CModalHeader closeButton>
              <CModalTitle>Tambah Anggaran project</CModalTitle>
            </CModalHeader>
            <CModalBody>
            <Formik
    initialValues={{ 
      budget_start_date:budgetStartDate,
      budget_end_date:budgetEndDate,      
    }}
    validate={values => {
      const errors = {};
      if (!values.budget_start_date){
       errors.budget_start_date = 'Required';

      }else if (!values.budget_end_date){

       errors.budget_end_date = 'Required';
      }
      return errors;
    }}
    onSubmit={(values, { setSubmitting }) => {
      var total_budget=$('#total_budget').val().replace(/[^\w\s]/gi, '');
      var project_id=props.match.params.id;
      var budget_start_date=$('#budget_start_date').val()
      var budget_end_date=$('#budget_end_date').val()
      var project_number=$('#project_number').val();
      
      var budget_project=[];
      var accounts=[];
      var datatable_budgets=[];
      var description=`Penambahan anggaran untuk project dengan No. Project <a href='http://localhost:3001/mapping/manage#/mapping/members/${project_id}'>${project_number}</a>` 
   
       if ((budget_start_date.toString()!='') && (budget_end_date.toString()!='')){
        $('#use-datatable tbody tr').each(function() {
          var budget = $(this).find('td:nth-child(1) input').val().replace(/[^\w\s]/gi, '');
          var transfer_date = $(this).find('td:nth-child(2) input').val();
          var account_bank = $(this).find('td:nth-child(3) select').val(); 


          //inialisai insert multipel row to database
          //rquest {amount:budget,date:date,type:type,image:image,account_Id:account:id,project_id:project_id}
          var budgets=[budget,transfer_date,"in","Penambahan anggaran project","",account_bank,project_id];
          //rquest {amount:budget,date:date,type:type,description:description,image:image,account_Id:account:id}
          var account=[budget,transfer_date,"out",description,"",account_bank];
          
          // for datatable budget this page
          var datatable_budget={date:transfer_date,amount:budget,account_id:account_bank}
          
          budget_project.push(budgets); 
          accounts.push(account)     
          datatable_budgets.push(datatable_budget)  
        });
 

        let data_budget={
          budget_start_date:budget_start_date,
          budget_end_date:budget_end_date,
          opening_balance:total_budget,
          project_id:project_id,
  
        }
        let data_transaction_project={
          data:budget_project,
          project_id:project_id
        }

 

      //create budget
        axios.post('http://localhost:3000/api/budgets/create-budget',data_budget)
        .then((response)=>{

        

      // create transacton project
        axios.post('http://localhost:3000/api/projects/transaction-project',data_transaction_project)
        .then((response)=>{
          
          setModalBudgets(false)
          setBudgets([...datatable_budgets]);
          BudgetProject(datatable_budgets)
          setTotalBudgetProject(total_budget.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
          setBudgetStartDate(values.budget_start_date)
          setBudgetEndtDate(values.budget_end_date)
          toast.success('Berhasil menambahkan anggaran project', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            color:'success'
            });
          
          })         
        .catch((error)=>{
          console.log(error);
        })
     })       
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
    })=> (
      <form onSubmit={handleSubmit} autoComplete="off">
      
         <CFormGroup row className="my-0">
         <CCol xs="6">
               <CFormGroup>
                 <CLabel htmlFor="budget_start_date">Tanggal Mulai anggaran </CLabel>
                 <CInput required   name="budget_start_date" id="budget_start_date"  placeholder="" type="date" onChange={handleChange} value={values.budget_start_date}  />
               </CFormGroup>
             </CCol>
             <CCol xs="6">
               <CFormGroup>
                 <CLabel htmlFor="budget_end_date">Tanggal Akhir Anggaran</CLabel>
                 <CInput required  name="budget_end_date" id="budget_end_date"  placeholder="" type="date" onChange={handleChange} value={values.budget_end_date} />
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
              <CInput style={{textAlign:'right'}} id="total_budget"  name="total_budget"   value={tempTotalBudgets}/>                  
            </CInputGroup>
            </CFormGroup>
            </CCol>

           <br/>
           <table tyle={{width:'100%'}} class="table table-striped"  id="use-datatable">
                <thead s>
                  <tr>
                  <th>
                      Nominal
                    </th>
                    <th>
                      Tanggal Transfer
                    </th>
                    <th style={{width:'30%'}} >
                      Akun Transfer
                    </th>
                    <th style={{textAlign:'right',width:'25px'}}>
                    <button type="button" class="btn btn-primary"  onClick={()=>setDataBudgets()} ><i className="fa fa-plus"/></button>
                    </th>                    
                  </tr>
                </thead>
                <tbody id="data-budgets">
                </tbody>
              </table>  
              <div  style={{textAlign: 'right'}}>
                
                  <CButton type='submit'  disabled={tempIsloadingBudgets} onClick={()=>saveBudgets()}  size="sm"   className="btn-brand mr-1 mb-1" color='primary'>
                { tempIsloadingBudgets? <i class="spinner-border"></i>: 
                <span><i class="fa fa-save"/> Simpan</span>}
                </CButton> 
              
            </div>            
      </form>
    )}
  </Formik>
          
            </CModalBody>
            <CModalFooter>
            </CModalFooter>
          </CModal>

      </CCard>
      
      
      :
      
      <span></span>
      
      }
      
  
  </div>      
  )
}
export default Budgets;
