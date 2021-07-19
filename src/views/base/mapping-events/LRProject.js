import React,{ useState,useEffect,useRef,useCallback }  from 'react'
import axios from 'axios'
import './css/style.css'
import { useHistory } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Table from "./components/DataTable";
import Transactions from "./components/Transactions";
import 'react-toastify/dist/ReactToastify.css';
import {Formik} from 'formik'
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery'
import Button from '@material-ui/core/Button';
import jsPDF from 'jspdf'
import ReactExport from "react-export-excel";
import 'jspdf-autotable'
import {dataPDFLR} from './data/transactions'


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
  CCardFooter,

} from '@coreui/react'

import MapGL, {
  Marker,  
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl} from 'react-map-gl';
import ControlPanel from './components/controll-panel';
import Pin from './components/pin';
import MAP_STYLE from './components/mapstyle';

//Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import { CardBody } from 'reactstrap';


const geolocateStyle = {
  top: 0,
  left: 0,
  padding: '10px'
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: '10px'
};

const navStyle = {
  top: 72,
  left: 0,
  padding: '10px'
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: '10px'
};


function Approval(props){
    const [tempProjectNumber, setTempProjectNumber] = useState(''); 
    const [tempProjectCreatedDate, setTempProjectCreatedDate] = useState('');
    const [tempProjectStartedDate, setTempProjectStartDate] = useState('');
    const [tempProjectEndDate, setTempProjectEndDate] = useState('');
    const [tempEventCustomer, setTempEventCustomer] = useState('');
    const [tempEventPic, setTempEventPic] = useState('');
    const [tempDescription, setTempDescription] = useState('');
    const [tempTotalProjectCost, setTempTotalProjectCos] = useState('');
    const [tempLatitude, setTempLatitude] = useState('');
    const [tempLongtitude, setTempLongtitude] = useState('');
    const [tempMap, setTempMap] = useState(false)
    const [quotations,setQuotations]=useState([])
    const [tempTransactions,setTempTransactions]=useState();

    const [tempIsLoadingGetTransactions,setTempIsLoadingGetTransaction]=useState(true)
    const [dataExcel,setDataExcel]=useState()

    var dateFormat=require('dateformat')


    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


    const mapRef = useRef();
    const handleViewportChange = useCallback(
      (newViewport) => setViewport(newViewport),
      
      []
    );

  const [events, logEvents] = useState({});
      //variable push page
    const navigator = useHistory(); 
    
    const getAllTransactions=()=>{
      var id=props.match.params.id;
      axios.get(`http://localhost:3000/api/projects/${id}/transactions`)
      .then((response)=>{
         setTempTransactions([...response.data.data.transactions])
    
         setTempIsLoadingGetTransaction(false)
        console.log('data',response.data.data.transactions)
     
     

      })
      .catch((response)=>{

      })
    }
  
    useEffect(()=>{
        let id=props.match.params.id;
      
    
        //get detail project
        axios.get('http://localhost:3000/api/projects/detail-project/'+id)
        .then((response)=>{   
            setQuotations([...response.data.data.quotations])      
            setTempProjectNumber(response.data.data.project_number)
             //projecct create data
            let project_created_date = new Date(response.data.data.project_created_date)
            let date_crated = project_created_date.getDate();
            let month_created = project_created_date.getMonth() + 1;
            let year_created = project_created_date.getFullYear();
            setTempProjectCreatedDate(year_created+'-'+'00'.substr( String(month_created).length ) + month_created+'-'+'00'.substr( String(date_crated).length ) + date_crated);

            //project start date
            let project_start_date = new Date(response.data.data.project_start_date)
            let date_start = project_start_date.getDate();
            let month_start = project_start_date.getMonth() + 1;
            let year_start = project_start_date.getFullYear();
            setTempProjectStartDate(year_start+'-'+'00'.substr( String(month_start).length ) + month_start+'-'+'00'.substr( String(date_start).length ) + date_start);
            // console.log('tanggal mulai',tempProjectStartDate)
            
            //project end date
            let project_end_date = new Date(response.data.data.project_end_date)
            let date_end = project_end_date.getDate();
            let month_end = project_end_date.getMonth() + 1;
            let year_end = project_end_date.getFullYear();
            setTempProjectEndDate(year_end+'-'+'00'.substr( String(month_end).length ) + month_end+'-'+'00'.substr( String(date_end).length ) + date_end);

            setTempEventCustomer(response.data.data.event_customer)
            setTempEventPic(response.data.data.event_pic);
            setTempDescription(response.data.data.description);
            setTempLatitude(response.data.data.latitude);
            setTempLongtitude(response.data.data.longtitude);
            setTempTotalProjectCos(response.data.data.total_project_cost.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))

            getAllTransactions()
            setMarker({
              latitude:parseFloat(response.data.data.latitude),
              longitude:parseFloat(response.data.data.longtitude),
            })
            setViewport({
              latitude:parseFloat(response.data.data.latitude),
              longitude:parseFloat(response.data.data.longtitude),
              zoom:13.5
            })
           
        })
        .catch((error)=>{
        
    
        })

  
    },[])


    const[viewport, setViewport] = useState({
      width: "100",
      height: "400",
      latitude: 38.963745,
      longitude: 35.243322,
      zoom: 5
  });
  const [marker, setMarker] = useState({
      longitude: 107.6684889,
      latitude: -6.942100215253297,
    });



  
  const SIZE = 100;
  const UNIT = "px";
  function showExcel(){
    dataPDFLR(props.match.params.id).then((response)=>{
        var data_transactions_excel=[]
         response.data.transactions.map((values)=>{
             console.log('tee',values)
             var data={
                 date:values.date,
                 description:values.description,
                 in:values.type==='in'?values.amount:"",
                 out:values.type==="out"?values.amount:"",
                 balance:values.balance
             }
              data_transactions_excel.push(data)          
         })
         setDataExcel([...data_transactions_excel])
       })
  }


  function showPDF(){
    dataPDFLR(props.match.params.id).then(response=>{
        var data_transactions_pdf=[]
        var doc = new jsPDF('p', 'px', 'a4');
        doc.text(`Laba Rugi Project ${$('#project_number').val()} `, 10, 20)
        doc.autoTable({ html: '#my-table' })

        response.data.transactions.map((values)=>{
            var data=[
                dateFormat(values.date,'dd/mm/yyyy'),
                values.description,
                values.type==="in"?"IDR "+values.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."):"",
                values.type==="out"?"IDR "+values.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."):"",
                "IDR "+values.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            ]
            data_transactions_pdf.push(data)
            
        })
        doc.autoTable({
            margin:{top:20},
            columnStyles: { 
                0: { 
                    halign: 'right', 
                },
                1: { 
                    halign: 'right', 
                },
                2: { 
                    halign: 'right', 
                } 
            },

            margin:{left:10,right:'70%',top:'10%'},


        head: [['Total Cash In', 'Total Cash Out', 'Saldo']],
        body: [
            [
                "IDR "+response.data.total_in.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
                "IDR "+response.data.total_out.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
                "IDR "+response.data.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
            ],

        ],
    })
    doc.autoTable({
        margin:{top:20},
        columnStyles: {
            0: {cellWidth: 50},
        
            2: {cellWidth: 70, halign: 'right', },
            3: {cellWidth: 70, halign: 'right', },
            4: {cellWidth: 70, halign: 'right'},
          },
       thema:'grid',
        margin:{left:10,right:10},
        head: [['tanggal', 'Deskripsi', 'Cash In','Cash Out','Saldo']],
        body: data_transactions_pdf
    })
        window.open(doc.output('bloburl'), '_blank');    
    })  
  };

  return (
      
    <div>
        
        {/* data project */}
        <CCard>
        
            <CCardHeader>
            <span>
                    <strong>
                        Data Project
                    </strong>
                        </span>
           
            </CCardHeader>
            <CCardBody>
            
            <CFormGroup row className="my-0">
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="Project_number">No. Project</CLabel>
                   <CInput readOnly  required id="project_number" placeholder="" name="project_number"  value={tempProjectNumber} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel  htmlFor="Project_created_date">Tanggal Buat Project</CLabel>
                   <CInput readOnly type="date" required id="project_created_date" name="project_created_date" placeholder=""  value={tempProjectCreatedDate}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="project_start_date">Tanggal Mulai Project</CLabel>
                   <CInput readOnly type="date"  required id="project_start_date" name="project_start_date" placeholder=""  value={tempProjectStartedDate}/>
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="project_end_date">Tanggal Akhir Project</CLabel>
                   <CInput readOnly type="date"  required  id="project_end_date" name="project_end_date"  placeholder=""   value={tempProjectEndDate}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel required htmlFor="event_customer">Customer Event</CLabel>
                   <CInput readOnly  id="event_customer" name="event_customer"   placeholder=""  value={tempEventCustomer} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="event_pic">PIC Event</CLabel>
                   <CInput readOnly id="event_pic" name="event_pic" placeholder="" value={tempEventPic}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="description">Deskripsi</CLabel>
                   <CInput readOnly id="description" name="description" placeholder=""  value={tempDescription} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
               <CFormGroup>
                 <CLabel htmlFor="total_project_cost">Total Biaya Project</CLabel>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>IDR</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput readOnly style={{textAlign:'right'}} id="total_project_cost"  name="total_project_cost"  value={tempTotalProjectCost}/>                  
                  </CInputGroup>
                </CFormGroup>
               </CCol>
               
               <CCol xs="5">
                 <CFormGroup>
                   <CLabel htmlFor="latitude">Latitude</CLabel>
                   <CInput readOnly id="latitude" name="latitude" placeholder=""   value={tempLatitude} />
                 </CFormGroup>
               </CCol>
               <CCol xs="5">
                 <CFormGroup>
                   <CLabel htmlFor="longtitude">Longitude</CLabel>
                   <CInput readOnly id="longtitude" name="longtitude" placeholder=""  value={tempLongtitude} />
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
             <ToastContainer />
             <br/>
             <Table data={quotations}  />
            </CCardBody>


                 {/* Modal map */}
                 <CModal 
              show={tempMap} 
              onClose={() => setTempMap(!tempMap)}
              size="lg col-50">
              <CModalHeader closeButton>
                <CModalTitle></CModalTitle>
              </CModalHeader>
              <CModalBody>
              <MapGL {...viewport} 
                width="53vw" height="60vh" 
                ref={mapRef} 
                        
               //  onViewportChange={setViewport}
                mapStyle={MAP_STYLE}
                onViewportChange={handleViewportChange}
                mapboxApiAccessToken={'pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg'}
               >
   
                <Marker
                  longitude={marker.longitude}
                  latitude={marker.latitude}
                  style={{transform: `translate(${SIZE/2 + UNIT}, ${SIZE/2 + UNIT}` }}
                  offsetTop={-20}
                  offsetLeft={-10}
                >
                  <Pin size={20} />
                  
                </Marker>

                <GeolocateControl style={geolocateStyle} />
                <FullscreenControl style={fullscreenControlStyle} />
                <NavigationControl style={navStyle} />
                <ScaleControl style={scaleControlStyle} />
              </MapGL>
               <ControlPanel events={events} />
              </CModalBody>
              <CModalFooter>

                {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
                <CButton color="secondary" onClick={() => setTempMap(!tempMap)}>Tutup</CButton>
              </CModalFooter>
            </CModal>

   

        </CCard>
        {/* Members */}
        <CCard>
            <CCardHeader>
            <div>
                <span>
                  <strong>
                      Cost/Out
                  </strong>
              </span>                                 
                </div>
            </CCardHeader>  

            <CCardBody>

      <Formik
      initialValues={{ 
       out_amount:'',
       out_date:'',
       out_description:''

      
  
      }}
      validate={values => {

      }}
      onSubmit={(values, { setSubmitting }) => {
        var  date=values.out_date
        var description=values.out_description
        var amount=values.out_amount
        var id=props.match.params.id
        var type="out"
        var data={
            date:date,
            description:description,
            amount:amount.replace(/[^\w\s]/gi, ''),
            type:type,
            id:id
        }

        axios.post("http://localhost:3000/api/projects/create-transaction",data)
        .then((response)=>{
            $('#out_date').val("")
            $('#out_description').val("")
            $('#out_amount').val("")
            getAllTransactions()

            toast.success('Berhasil menambahkan Cost/Out', {
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

        })

       
       

    
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
                 <CFormGroup row>
                 <CCol xs="4">
                   <CFormGroup>
                       <CLabel  htmlFor="out_date">Tanggal Out</CLabel>
                       <CInput required id="out_date" name="out_date" type='date'  onChange={handleChange}  value={values.out_date}  />
                   </CFormGroup>
                </CCol> 

    
                <CCol xs="4">                  
                    <CFormGroup>
                        <CLabel   htmlFor="out_description" >Deskripsi </CLabel>
                        <CInput  id="out_description" name="out_description" onChange={handleChange}  value={values.out_description}  />
                    </CFormGroup>
                 </CCol> 
                
                <CCol xs="4">
                <CFormGroup>
                 <CLabel htmlFor="out_amount">jumlah</CLabel>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>IDR</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput required  style={{textAlign:'right'}} id="out_amount" name="out_amount" onChange={handleChange}  value={values.out_amount} />               
                  </CInputGroup>
                </CFormGroup>             
                </CCol>      

                </CFormGroup>  
                <CCardFooter>
              <div  style={{textAlign: 'right'}}>
                  <CButton type="submit" size="sm col-1"  className="btn-brand mr-1 mb-1" color='primary'>
                 Simpan
                  </CButton>
                  
                  {}
 
       
              </div>
             </CCardFooter>           

        </form>
      )}
    </Formik>

        </CCardBody>  
        </CCard>

    <CCard>
        <CCardHeader>
            <span><strong>Rekap Transaksi Project</strong></span>
        </CCardHeader>
        <CardBody>
               
  <Button variant="contained" color="secondary" onClick={()=>showPDF()}>
    PDF
</Button>
&nbsp;
&nbsp;

 <ExcelFile element={
    <Button variant="contained" style={{backgroundColor:'green', color:'white'}}  onClick={()=>showExcel()}>Excel</Button>
 }>
   <ExcelSheet name="Organization"/>
  </ExcelFile>
        {tempIsLoadingGetTransactions===true?
        <span></span>:
        <Transactions data={tempTransactions}/>
        
        }

        </CardBody>
    </CCard>

       
  </div>
   
  )
}
export default Approval;
