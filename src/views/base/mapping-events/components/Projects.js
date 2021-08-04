import React,{ useState,useEffect, useCallback,useRef  }  from 'react'
import DataTable from 'react-data-table-component';
import { Formik, useFormik } from 'formik';
import Swal from 'sweetalert2' 
import axios from 'axios'
import { useHistory } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import MapGL, {
  Marker,  
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl} from 'react-map-gl';
import ControlPanel from './controll-panel';
import Pin from './pin';
import MAP_STYLE from './mapstyle';
import {fromJS} from 'immutable';;

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
  

export function Projects(props){
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
    const [tempStatus,setTempStatus]=useState();

    const mapRef = useRef();
    const handleViewportChange = useCallback(
      (newViewport) => setViewport(newViewport),
      
      []
    );


   const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
     
      setMarker({
        latitude:newViewport.latitude,
        longitude:newViewport.longitude
      })
      setTempLatitude(marker.latitude)
      setTempLongtitude(marker.longitude)

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      
      });
    },
  
    [handleViewportChange]
  
  );


  const [events, logEvents] = useState({});


  const onMarkerDragStart = useCallback(event => {
    logEvents(_events => ({..._events, onDragStart: event.lngLat}));
  }, []);

  const onMarkerDrag = useCallback(event => {
    logEvents(_events => ({..._events, onDrag: event.lngLat}));
  }, []);

  const onMarkerDragEnd = useCallback(event => {
    logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
    
    setTempLatitude(event.lngLat[1]);
    setTempLongtitude(event.lngLat[0]);

    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    });
  }, [])




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



    useEffect(()=>{

       let id=props.id;
     
        axios.get('http://localhost:3000/api/projects/detail-project/'+id)
        .then((response)=>{
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
           
            
            //project end date
            let project_end_date = new Date(response.data.data.project_end_date)
            let date_end = project_end_date.getDate();
            let month_end = project_end_date.getMonth() + 1;
            let year_end = project_end_date.getFullYear();
            setTempProjectEndDate(year_end+'-'+'00'.substr( String(month_end).length ) + month_end+'-'+'00'.substr( String(date_end).length ) + date_end);

            setMarker({
                latitude:parseFloat(response.data.data.latitude),
                longitude:parseFloat(response.data.data.longtitude),
              })
              setViewport({
                latitude:parseFloat(response.data.data.latitude),
                longitude:parseFloat(response.data.data.longtitude),
                zoom:13.5
              })

            setTempEventCustomer(response.data.data.event_customer)
            setTempEventPic(response.data.data.event_pic);
            setTempDescription(response.data.data.description);
            setTempLatitude(response.data.data.latitude);
            setTempLongtitude(response.data.data.longtitude);
            setTempTotalProjectCos(response.data.data.total_project_cost.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
            setTempStatus(response.data.data.status)
         
            //setTempMembers([...response.data.data.members])
            //setTempIsLoadingMembers(false);
    
        })
        .catch((error)=>{
            //setTempIsLoadingMembers(false);
        })
    
    },[])

    const SIZE = 100;
const UNIT = "px";
    return (
        <div>
               {/* data project */}
        <CCard>
            <CCardHeader>
                <div>
                    <span><strong>Data Project</strong></span>  
                </div>
            </CCardHeader>
            <CCardBody>
            
            <CFormGroup row className="my-0">
            <CCol xs="12" >
                 <CFormGroup hidden>
                   <CLabel htmlFor="Project_number">Status</CLabel>
                   <CInput readOnly  required id="status" placeholder="" name="status"  value={tempStatus} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="Project_number">No. Project</CLabel>
                   <CInput readOnly  required id="project_number" placeholder="" name="project_number"  value={tempProjectNumber} />
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel  htmlFor="Project_created_date">Tanggal Buat Project</CLabel>
                   <CInput type="date"  readOnly required id="project_created_date" name="project_created_date" placeholder=""  value={tempProjectCreatedDate}/>
                 </CFormGroup>
               </CCol>

               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="project_start_date">Tanggal Mulai Project</CLabel>
                   <CInput readOnly required id="project_start_date" name="project_start_date" placeholder=""  value={tempProjectStartedDate}/>
                 </CFormGroup>
               </CCol>
               <CCol xs="6">
                 <CFormGroup>
                   <CLabel htmlFor="project_end_date">Tanggal Akhir Project</CLabel>
                   <CInput readOnly required  id="project_end_date" name="project_end_date"  placeholder=""   value={tempProjectEndDate}/>
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
                mapStyle={'mapbox://styles/mapbox/streets-v11'}
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

        </div>

    );

}

