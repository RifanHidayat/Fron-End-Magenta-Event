import React,{ useState,useEffect }  from 'react'
import DataTable from 'react-data-table-component';
import { Formik, useFormik } from 'formik';
import Swal from 'sweetalert2'
import axios from 'axios'
import { useHistory } from "react-router-dom";

import ReactLoading from 'react-loading'

import ReactMapGL, { Marker, Popup } from "react-map-gl";
 

 
 

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
  {name: 'Total Biaya',sortable: true,right: true,    cell: row => <div data-tag="allowRowEvents"><div >{row.grand_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
}</div></div>,  }, 
//                { name: 'Total Biaya',    selector: 'grand_total',    sortable: true,    right: true,  },
];

var  quotations=[];
var selected_quotation=[];


function Create(){


  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  // const handleLogout = () => {
  //   setCurrentUsername(null);
  //  // myStorage.removeItem("user");
  // };

  //batas

  //varoable state
//   const [collapsed, setCollapsed] = React.useState(true)
//   const [showElements, setShowElements] = React.useState(true)
//   const [modal, setModal] = useState(true)
//   const [large, setLarge] = useState(false)
//   const [tempMap, setTempMap] = useState(false)
//   const [tempQuotation, setTempQuotation] = useState([]);
//   const [tempProjectNumber, setTempProjectNumber] = useState('');
//   const [tempEventCustomer, setTempEventCustomer] = useState('');
//   const [tempEventPic, setTempEventPic] = useState('');
//   const [tempTotalProjectCost, setTotalProjectost] = useState('0');
//   const [tempIds, setTempIds] = useState([]);
//   const [tempQuotationNumber, setTempQuotationNumber] = useState([]);
//   const [isLoading, setIsloading] = useState(false);
//   const [tempDateCreatedProject,setTempDateCreatedPeoject]=useState();



//   //mapbox
//   const[viewport, setViewport] = useState({
//     width: "100",
//     height: "400",
//     latitude: 38.963745,
//     longitude: 35.243322,
//     zoom: 5
// });


//   //variable push page
//   const navigator = useHistory();


//   //variable data
//   let ids=[];
//   let quotationNumber=[];
 


//   useEffect(() => {
//     setIsloading(false);

//     //project create date
//     let newDate = new Date()
//     let date = newDate.getDate();
//     let month = newDate.getMonth() + 1;
//     let year = newDate.getFullYear();
//     setTempDateCreatedPeoject(year+'-'+'00'.substr( String(month).length ) + month+'-'+'00'.substr( String(date).length ) + date);
//     //console.log(year+'-'+month+'-'+date)
  

//     //get data qutoation
//     fetch('http://localhost:3000/api/quotations')
//     .then((response)=>response.json())
//     .then((json)=>{
//       quotations=json['data'];
//       console.log(quotations);
//     });

//     //get project number
//     axios.get('http://localhost:3000/api/projects/project-number')
//     .then(response => {
//       console.log('data project number ',response.data.data)
//       setTempProjectNumber(response.data.data);
//     })
//     .catch(error => {
//         // this.setState({ errorMessage: error.message });
//         console.error('There was an error!', error);
//     });
//   }, []);


  
//   const onCheck = (state) => {
//     selected_quotation=[];
//     let grand_total=0;
//     console.log(state.selectedRows);

//     setTempQuotation([...state.selectedRows]);
//     if (state.selectedRows.length>0){
//     state.selectedRows.map((value) => grand_total+=value.grand_total );
//     state.selectedRows.map((value) => ids.push(value.id));
//     state.selectedRows.map((value) => quotationNumber.push(value.quotation_number));
    
//     //set data value quotation
//     setTempEventPic(state.selectedRows[0]['pic_event']);
//     setTempEventCustomer(state.selectedRows[0]['customer_event']);
//     setTotalProjectost(state.selectedRows[0]['grand_total'])
//     setTotalProjectost(grand_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))


//     }else{

//     setTempEventPic('');
//     setTempEventCustomer('');
//     setTotalProjectost('0')

//     }
//     //set data list quotation
//     setTempIds([...ids]);
//     setTempQuotationNumber([...quotationNumber])
  
//   };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken=""
        width="100%"
        height="100%"
        transitionDuration="200"
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onViewportChange={(viewport) => setViewport(viewport)}
        onDblClick={currentUsername && handleAddClick}
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color:
                    currentUsername === p.username ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
      </ReactMapGL>
    </div>
  //   <div>
  //   <CCard>
  //     <CCardHeader>
  //       <span><strong>Buat Project</strong></span>
  //     </CCardHeader>
  //     <CCardBody>
  //     <Formik
  //     initialValues={{ 
       
  //       project_start_date:'',
  //       project_end_date:'',
  //       latitude:'',
  //       longtitude:'',
  //       description:''
  //     }}
  //     validate={values => {
  //       const errors = {};
  //       if (!values.project_start_date){
  //        errors.project_start_date = 'Required';

  //       }else if (!values.project_end_date){

  //        errors.project_end_date = 'Required';
  //       }
  //       return errors;
  //     }}
  //     onSubmit={(values, { setSubmitting }) => {
  //       setIsloading(true);
  //       const data = { 
  //         project_number: tempProjectNumber,
  //         project_created_date:tempDateCreatedProject,
  //         project_start_date:values.project_start_date,
  //         project_end_date:values.project_end_date,
  //         event_customer:tempEventCustomer,
  //         event_pic:tempEventPic,
  //         total_project_cost:tempTotalProjectCost.replace(/[^\w\s]/gi, ''),
  //         description:values.description,
  //         latitude:values.latitude,
  //         longtitude:values.longtitude,
  //         id_quotation:tempIds.toString(),
  //         status:"pending",
  //         quotation_number:tempQuotationNumber.toString()

  //       };
    
      
    
  //      axios.post('http://localhost:3000/api/projects/create-project',data)
  //       .then(response => {
  //         console.log(response);
  //         Swal.fire({
  //           title: 'success',
  //           text: 'Project berhasil dibuat',
  //           icon: 'success',
  //           timer:2000,
  //           showConfirmButton:false,
  //         }).then(_=>{
  //           navigator.push('/projects/manage');
  //         });
          
  //       })
  //       .catch(error => {
  //           // this.setState({ errorMessage: error.message });
  //           console.error('There was an error!', error);
  //           setIsloading(false);
  //       });

    
  //     }}
  //   >
      
  //     {({
  //       values,
  //       errors,
  //       touched,
  //       handleChange,
  //       handleBlur,
  //       handleSubmit,
  //       isSubmitting,
  //       /* and other goodies */
  //     })=> (
  //       <form onSubmit={handleSubmit} autoComplete="off">
         
    
  //          <CFormGroup row className="my-0">

  //              <CCol xs="6">
  //                <CFormGroup>
  //                  <CLabel htmlFor="Project_number">No. Project</CLabel>
  //                  <CInput  required id="project_number" placeholder="" name="project_number" onChange={handleChange} value={tempProjectNumber} />
  //                </CFormGroup>
  //              </CCol>
  //              <CCol xs="6">
  //                <CFormGroup>
  //                  <CLabel htmlFor="Project_created_date">Tanggal Buat Project</CLabel>
  //                  <CInput required id="project_created_date" name="project_created_date" placeholder="" type="date" onChange={handleChange}  value={tempDateCreatedProject}/>
  //                </CFormGroup>
  //              </CCol>

  //              <CCol xs="6">
  //                <CFormGroup>
  //                  <CLabel htmlFor="project_start_date">Tanggal Mulai Project</CLabel>
  //                  <CInput required id="project_start_date" name="project_start_date" placeholder="" type="date" onChange={handleChange}  value={values.project_start_date}/>
  //                </CFormGroup>
  //              </CCol>
  //              <CCol xs="6">
  //                <CFormGroup>
  //                  <CLabel htmlFor="project_end_date">Tanggal Akhir Project</CLabel>
  //                  <CInput required  id="project_end_date" name="project_end_date"  placeholder=""  type="date" onChange={handleChange}  value={values.project_end_date}/>
  //                </CFormGroup>
  //              </CCol>

  //              <CCol xs="6">
  //                <CFormGroup>
  //                  <CLabel required htmlFor="event_customer">Customer Event</CLabel>
  //                  <CInput required readonly id="event_customer" name="event_customer"   placeholder="" onChange={handleChange}   value={tempEventCustomer} />
  //                </CFormGroup>
  //              </CCol>
  //              <CCol xs="6">
  //                <CFormGroup>
  //                  <CLabel htmlFor="event_pic">PIC Event</CLabel>
  //                  <CInput id="event_pic" name="event_pic" placeholder="" onChange={handleChange}  value={tempEventPic}/>
  //                </CFormGroup>
  //              </CCol>

  //              <CCol xs="6">
  //                <CFormGroup>
  //                  <CLabel htmlFor="description">Deskripsi</CLabel>
  //                  <CInput id="description" name="description" placeholder="" onChange={handleChange}  value={values.description} />
  //                </CFormGroup>
  //              </CCol>
  //              <CCol xs="6">
  //                {/* <CFormGroup>
  //                  <CLabel htmlFor="total_project_cost">Total Biaya Project</CLabel>
  //                  <CInput id="total_project_cost"  name="total_project_cost" initialValues="0" placeholder="" type="number" onChange={handleChange}  value={tempTotalProjectCost} />
  //                </CFormGroup> */}

  //                <CFormGroup>
  //                <CLabel htmlFor="total_project_cost">Total Biaya Project</CLabel>
  //                 <CInputGroup>
  //                   <CInputGroupPrepend>
  //                     <CInputGroupText>IDR</CInputGroupText>
  //                   </CInputGroupPrepend>
  //                   <CInput style={{textAlign:'right'}} id="total_project_cost"  name="total_project_cost"  onChange={handleChange}  value={tempTotalProjectCost}/>                  
  //                 </CInputGroup>
  //               </CFormGroup>
  //              </CCol>
               
  //              <CCol xs="5">
  //                <CFormGroup>
  //                  <CLabel htmlFor="latitude">Latitude</CLabel>
  //                  <CInput id="latitude" name="latitude" placeholder="" onChange={handleChange}  value={values.latitude} />
  //                </CFormGroup>
  //              </CCol>
  //              <CCol xs="5">
  //                <CFormGroup>
  //                  <CLabel htmlFor="longtitude">Longitude</CLabel>
  //                  <CInput id="longtitude" name="longtitude" placeholder="" onChange={handleChange}  value={values.longtitude} />
  //                </CFormGroup>
  //              </CCol>
  //              <CCol xs="2">
  //                <CFormGroup>

  //                <div   style={{textAlign: 'right',marginTop:'35px',width:'100%'}}>                                     
  //                <CButton color="primary" onClick={() => setTempMap(!tempMap)} size="sm" block> <i class="fa fa-map-marker" aria-hidden="true"></i></CButton>
  //                 </div>
  //                </CFormGroup>
  //              </CCol>
              
  //            </CFormGroup>
  //            <br/>
           
  //            <div  style={{textAlign: 'right',width:'100%'}}>
  //            <CButton size="sm col-2" onClick={() => setLarge(!large)} color="primary"><span className="mfs-2">Pilih Quotation</span></CButton>
  //            </div>
  //             <DataTable      
  //                columns={columns}        
  //                data={tempQuotation}                    
  //             /> 
  //             <CCardFooter>

  //             <div  style={{textAlign: 'right'}}>
  //                 <CButton to="/projects/manage" disabled={isLoading}  size="sm col-1" className="btn-secondary btn-brand mr-1 mb-1"><span className="mfs-2">Kembali</span></CButton>
  //                 <CButton disabled={isLoading} type="submit" size="sm col-1"  className="btn-brand mr-1 mb-1" color='primary'>
  //                { isLoading? <i class="spinner-border"></i>: <span className="mfs-2">Simpan</span>}
  //                 </CButton>
  //                 {}
               
  //             </div>
  //            </CCardFooter>   
  //       </form>
  //     )}
  //   </Formik>

  //         {/* //modal quotation */}
  //         <CModal 
  //             show={large} 
  //             onClose={() => setLarge(!large)}
  //             size="lg">
  //             <CModalHeader closeButton>
  //               <CModalTitle>List Semua Quotation</CModalTitle>
  //             </CModalHeader>
  //             <CModalBody>
  //              <DataTable 

  //                 title="Quotation dengan status  Final"        
  //                 columns={columns}        
  //                 data={quotations}       
  //                 selectableRows  
  //                 pagination
  //                 defaultSortFieldId
  //                 sortable                
  //                 Clicked
  //                 onSelectedRowsChange={onCheck}
  //                 selectableRowsComponentProps={{ inkDisabled: true }}                   
  //              /> 
  //             <hr/>
  //             <div><span>Data quotation terpilih</span></div>
  //              <DataTable      
  //                 columns={columns}        
  //                 data={tempQuotation}                    
  //              /> 
  //             </CModalBody>
  //             <CModalFooter>

  //               {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
  //               <CButton color="secondary" onClick={() => setLarge(!large)}>Tutup</CButton>
  //             </CModalFooter>
  //           </CModal>

  //              {/* //modal amp */}
  //         <CModal 
  //             show={tempMap} 
  //             onClose={() => setLarge(!tempMap)}
  //             size="lg col-50">
  //             <CModalHeader closeButton>
  //               <CModalTitle></CModalTitle>
  //             </CModalHeader>
  //             <CModalBody>
  //             <ReactMapGL
  //                 {...viewport}
  //                 mapboxApiAccessToken={'pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg'}
  //                 width="100%"
  //                 height="100%"
  //                 mapStyle="mapbox://styles/mapbox/streets-v11"
  //                  onViewportChange={(viewport) => setViewport(viewport)}
  //   />
             
            
  //             </CModalBody>
  //             <CModalFooter>

  //               {/* <CButton color="primary" onClick={() => setLarge(!large)}>Save</CButton>{' '} */}
  //               <CButton color="secondary" onClick={() => setLarge(!tempMap)}>Tutup</CButton>
  //             </CModalFooter>
  //           </CModal>
  //     </CCardBody>
  //   </CCard>
 
  // </div>
   
  )
}

export default Create;
