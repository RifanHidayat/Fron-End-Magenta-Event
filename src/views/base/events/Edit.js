import React,{ useState,useEffect,Component}  from 'react'
import DataTable from 'react-data-table-component';
import { Formik, useFormik } from 'formik';
import Swal from 'sweetalert2' 
import axios from 'axios'
import { useHistory } from "react-router-dom";
import ReactMapGL from 'react-map-gl';
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CBadge,
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFade,
  CForm,
  CFormGroup,
  CFormText,
  CValidFeedback,
  CInvalidFeedback,
  CTextarea,
  CInput,
  CInputFile,
  CInputCheckbox,
  CInputRadio,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CDropdown,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CLabel,
  CSelect,
  CRow,
  CSwitch,
  CDataTable,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Card } from 'reactstrap';


const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const columns = [  
              {name: 'No. quotation',sortable: true,    cell: row => <div  data-tag="allowRowEvents"><div >{row.quotation_number}</div></div>,  }, 
              {name: 'tanggal quotation',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.date_quotation}</div></div>,  },      
              {name: 'No. PO',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.po_number}</div></div>,  },
              {name: 'Tanggal PO',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.date_po_number}</div></div>,  }, 
              {name: 'Customer',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.customer_event}</div></div>, },
              {name: 'PIC Event',sortable: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.pic_event}</div></div>,  }, 
               { name: 'Total Biaya',    selector: 'grand_total',    sortable: true,    right: true,  },
  ];

var  quotations=[];
var selected_quotation=[];


function Edit(props){
  
  //varoable state
  const [collapsed, setCollapsed] = React.useState(true)
  const [showElements, setShowElements] = React.useState(true)
  const [modal, setModal] = useState(true)
  const [large, setLarge] = useState(false)
  const [tempMap, setTempMap] = useState(false)
  const [tempIds, setTempIds] = useState([]);
  const [tempQuotationNumber, setTempQuotationNumber] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [mainLoading, setMainloading] = useState(true);
  const [tempDateCreatedProject,setTempDateCreatedPeoject]=useState();
  
  //data edit projects
  const [tempQuotation, setTempQuotation] = useState([]);
  const [tempProjectNumber, setTempProjectNumber] = useState('');
  const [tempEventCustomer, setTempEventCustomer] = useState('');
  const [tempEventPic, setTempEventPic] = useState('');
  const [tempTotalProjectCost, setTotalProjectost] = useState('0');
  const [tempProjectCreatedDate, setTempProjectCreatedDate] = useState('');
  const [tempProjectStartDate, setTempProjectStartDate] = useState()
  const [tempProjectEndDate, settempProjectEndDate] = useState()
  const [tempLongtitude, setTempLongtitude] = useState()
  const [tempLatitude, setTempLatitude] = useState()
  const [tempDescription, setTempDescription] = useState()
   const [idProject, setIdProject] = useState()

  //css loader
  const override = css`


  border-color: red;
  top: 50%;

`;

  

  //mapbox
  const[viewport, setViewport] = useState({
    width: "100",
    height: "400",
    latitude: 38.963745,
    longitude: 35.243322,
    zoom: 5
});

  //variable push page
  const navigator = useHistory();

  //variable data
  let ids=[];
  let quotationNumber=[];
 

  useEffect(() => {
    let id=props.match.params.id;
    console.log(id)
    setIsloading(false);
    setMainloading(true);
 
    //get data detail
    axios.get("http://localhost:3000/api/projects/detail-project/"+id)
    .then((response)=>{
      console.log('detail project :',response)
      setTempProjectNumber(response.data.data.project_number);

      //projecct create data
      let project_created_date = new Date(response.data.data.project_created_date)
      let date_crated = project_created_date.getDate();
      let month_created = project_created_date.getMonth() + 1;
      let year_created = project_created_date.getFullYear();
      setTempDateCreatedPeoject(year_created+'-'+'00'.substr( String(month_created).length ) + month_created+'-'+'00'.substr( String(date_crated).length ) + date_crated);

     //project start date
      let project_start_date = new Date(response.data.data.project_start_date)
      let date_start = project_start_date.getDate();
      let month_start = project_start_date.getMonth() + 1;
      let year_start = project_start_date.getFullYear();
      setTempProjectStartDate(year_start+'-'+'00'.substr( String(month_start).length ) + month_start+'-'+'00'.substr( String(date_start).length ) + date_start);
      console.log('tanggal mulai',tempProjectStartDate)
      
      //project end date
      let project_end_date = new Date(response.data.data.project_end_date)
      let date_end = project_end_date.getDate();
      let month_end = project_end_date.getMonth() + 1;
      let year_end = project_end_date.getFullYear();
      settempProjectEndDate(year_end+'-'+'00'.substr( String(month_end).length ) + month_end+'-'+'00'.substr( String(date_end).length ) + date_end);

    
    
      setTempEventPic(response.data.data.event_pic);
      setTempEventCustomer(response.data.data.event_pic);
      setTempLatitude(response.data.data.latitude);
      setTempLongtitude(response.data.data.longtitude);
      setTempDescription(response.data.data.description);   
      setTotalProjectost(response.data.data.total_project_cost);
      setIdProject(response.data.data.id);
      setTempQuotationNumber(response.data.data.quotation_number)
      setTempIds(response.data.data.id_quotation);
      console.log('description :',tempDescription)

      setTempQuotation([...response.data.data.quotations]);
      console.log('dataquotation',response.data.data.quotations)

      //laading false
      setMainloading(false)
    
    })

    .catch((error)=>{
      //loading false
      setMainloading(false)

    })
  
    //get data qutoation
    fetch('http://localhost:3000/api/quotations')
    .then((response)=>response.json())
    .then((json)=>{
      quotations=json['data'];
      console.log('data',quotations);
    });

  }, []);


  
  const onCheck = (state) => {
    selected_quotation=[];
    let grand_total=0;

    setTempQuotation([...state.selectedRows]);
    if (state.selectedRows.length>0){
    state.selectedRows.map((value) => grand_total+=value.grand_total );
    state.selectedRows.map((value) => ids.push(value.id));
    state.selectedRows.map((value) => quotationNumber.push(value.quotation_number));
    
    //set data value quotation
    setTempEventPic(state.selectedRows[0]['pic_event']);
    setTempEventCustomer(state.selectedRows[0]['customer_event']);
    setTotalProjectost(state.selectedRows[0]['grand_total'])
    setTotalProjectost(grand_total)


    }else{

    setTempEventPic('');
    setTempEventCustomer('');
    setTotalProjectost('')

    }
    //set data list quotation
    setTempIds([...ids]);
    setTempQuotationNumber([...quotationNumber])
  
  };

  return (
    <div>
    {mainLoading==false?<CCard>
      <CCardHeader>
        <span><strong>Ubah Project</strong></span>
      </CCardHeader>
      <CCardBody>
      <Formik
      initialValues={{ 
        
        project_start_date:'2021-07-02',
        project_end_date:tempProjectEndDate,
        description:tempDescription
      }}
      validate={values => {
        const errors = {};
        if (!values.project_start_date){
         errors.project_start_date = 'Required';
        }else if (!values.project_end_date){
         errors.project_end_date = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setIsloading(true);
        const data = { 
          project_number: tempProjectNumber,
          project_created_date:tempDateCreatedProject,
          project_start_date:values.project_start_date,
          project_end_date:values.project_end_date,
          event_customer:tempEventCustomer,
          event_pic:tempEventPic,
          total_project_cost:tempTotalProjectCost,
          description:values.description,
          latitude:tempLatitude,
          longtitude:tempLongtitude,
          id_quotation:tempIds.toString(),
    
          quotation_number:tempQuotationNumber.toString()

        };
    
       axios.patch('http://localhost:3000/api/projects/edit-project/'+idProject,data)
        .then(response => {
          console.log(response);
          Swal.fire({
            title: 'success',
            text: 'Project berhasil diubah',
            icon: 'success',
            timer:2000,
            showConfirmButton:false,
          }).then(_=>{
            navigator.push('/projects/manage');
          });
          
        })
        .catch(error => {
            // this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
            setIsloading(false);
        });

    
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

        <form onSubmit={handleSubmit}>
           <CFormGroup row className="my-0">
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="Project_number">No. Project</CLabel>
                   <CInput  required id="project_number" placeholder="" name="project_number" onChange={handleChange} value={tempProjectNumber} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="Project_created_date">Tanggal Buat Project</CLabel>
                   <CInput required id="project_created_date" name="project_created_date" placeholder="" type="date" onChange={handleChange}  value={tempDateCreatedProject}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="project_start_date">Tanggal Mulai Project</CLabel>
                   <CInput required id="project_start_date" name="project_start_date" placeholder="" type="date" onChange={handleChange}  value={values.project_start_date}/>
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="project_end_date">Tanggal Akhir Project</CLabel>
                   <CInput required  id="project_end_date" name="project_end_date"  placeholder=""  type="date" onChange={handleChange}  value={values.project_end_date}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel required htmlFor="event_customer">Customer Event</CLabel>
                   <CInput required readonly id="event_customer" name="event_customer"   placeholder="" onChange={handleChange}   value={tempEventCustomer} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="event_pic">PIC Event</CLabel>
                   <CInput id="event_pic" name="event_pic" placeholder="" onChange={handleChange}  value={tempEventPic}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="description">Deskripsi</CLabel>
                   <CInput id="description" name="description" placeholder="" onChange={handleChange}  value={values.description} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="total_project_cost">Total Biaya Project</CLabel>
                   <CInput id="total_project_cost"  name="total_project_cost" initialValues="0" placeholder="" type="number" onChange={handleChange}  value={tempTotalProjectCost} />
                 </CFormGroup>
               </CCol>
               
               <CCol xs="5">
                 <CFormGroup>
                   <CLabel htmlFor="latitude">Latitude</CLabel>
                   <CInput id="latitude" name="latitude" placeholder="" onChange={handleChange}  value={tempLatitude} />
                 </CFormGroup>
               </CCol>
               <CCol xs="5">
                 <CFormGroup>
                   <CLabel htmlFor="longtitude">Longitude</CLabel>
                   <CInput id="longtitude" name="longtitude" placeholder="" onChange={handleChange}  value={tempLongtitude} />
                 </CFormGroup>
               </CCol>
               <CCol xs="2">
                 <CFormGroup>

                 <div   style={{textAlign: 'right',marginTop:'35px',width:'100%'}}>                                     
                 <CButton color="primary" onClick={() => setTempMap(!tempMap)} size="sm" block> <i class="fa fa-map-marker" aria-hidden="true"></i></CButton>
                  </div>
                 </CFormGroup>
               </CCol>
              
             </CFormGroup>
             <br/>
           
             <div  style={{textAlign: 'right',width:'100%'}}>
             <CButton size="sm col-2" onClick={() => setLarge(!large)} color="primary"><span className="mfs-2">Pilih Quotation</span></CButton>
             </div>
              <DataTable      
                 columns={columns}        
                 data={tempQuotation}                    
              /> 
              <CCardFooter>

              <div  style={{textAlign: 'right'}}>
                  <CButton to="/projects/manage" disabled={isLoading}  size="sm col-1" className="btn-secondary btn-brand mr-1 mb-1"><span className="mfs-2">Kembali</span></CButton>
                  <CButton disabled={isLoading} type="submit" size="sm col-1"  className="btn-brand mr-1 mb-1" color='primary'>
                 { isLoading? <i class="spinner-border"></i>: <span className="mfs-2">Simpan</span>}
                  </CButton>
                  {}
               
              </div>
             </CCardFooter>   
        </form>
      )}
    </Formik>

          {/* //modal quotation */}
          <CModal 
              show={large} 
              onClose={() => setLarge(!large)}
              size="lg">
              <CModalHeader closeButton>
                <CModalTitle>List Semua Quotation</CModalTitle>
              </CModalHeader>
              <CModalBody>
               <DataTable 

                  title="Quotation dengan status  Final"        
                  columns={columns}        
                  data={quotations}       
                  selectableRows  
                  pagination
                  defaultSortFieldId
                  sortable        
                          
                  Clicked
                  onSelectedRowsChange={onCheck}
                  
                  selectableRowsComponentProps={{ inkDisabled: true }}                   
               /> 
              <hr/>
              <div><span>Data quotation terpilih</span></div>
               <DataTable      
                  columns={columns}        
                  data={tempQuotation}                    
               /> 
              </CModalBody>
              <CModalFooter>

                {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
                <CButton color="secondary" onClick={() => setLarge(!large)}>Tutup</CButton>
              </CModalFooter>
            </CModal>

               {/* //modal amp */}
          <CModal 
              show={tempMap} 
              onClose={() => setLarge(!tempMap)}
              size="lg col-50">
              <CModalHeader closeButton>
                <CModalTitle></CModalTitle>
              </CModalHeader>
              <CModalBody>
              <ReactMapGL
                  {...viewport}
                  mapboxApiAccessToken={'pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg'}
                  width="100%"
                  height="100%"
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                   onViewportChange={(viewport) => setViewport(viewport)}
            />
             
            
              </CModalBody>
              <CModalFooter>

                {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
                <CButton color="secondary" onClick={() => setLarge(!tempMap)}>Tutup</CButton>
              </CModalFooter>
            </CModal>
      </CCardBody>
    </CCard>:<center><BeatLoader color={'blue'} loading={true}   size={20} /></center>}
 
  </div>
   
  )
}

export default Edit;