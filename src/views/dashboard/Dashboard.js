
import { CCardHeader, CContainer,CCardBody, CCard, CFormGroup, CCol, CCardFooter } from '@coreui/react'
import { Card } from '@material-ui/core'
import React,{useState,useCallback,useRef,useEffect} from 'react'
import CityInfo from './components/popup';
import MapGL, {
  Popup,
  Marker,  
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl} from 'react-map-gl';

import ControlPanel from './components/controll-panel.js';
import Pins from './components/pins';
import MAP_STYLE from './components/mapstyle.js';
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import {fromJS} from 'immutable';
import {getProjects,totalStatus} from './data/Data'
import icon from './icons/project-white.svg'
import {BiRightArrowCircle} from 'react-icons/bi'
import './css/style.css'



const TOKEN = 'pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg'; // Set your mapbox token here

const defaultMapStyle = fromJS(MAP_STYLE);
const defaultLayers = defaultMapStyle.get('layers');

const categories = ['labels', 'roads', 'buildings', 'parks', 'water', 'background'];

// Layer id patterns by category
const layerSelector = {
  background: /background/,
  water: /water/,
  parks: /park/,
  buildings: /building/,
  roads: /bridge|road|tunnel/,
  labels: /label|place|poi/
};

// Layer color class by type
const colorClass = {
  line: 'line-color',
  fill: 'fill-color',
  background: 'background-color',
  symbol: 'text-color'
};


function getMapStyle({visibility, color}) {
  const layers = defaultLayers
    .filter(layer => {
      const id = layer.get('id');
      return categories.every(name => visibility[name] || !layerSelector[name].test(id));
    })
    .map(layer => {
      const id = layer.get('id');
      const type = layer.get('type');
      const category = categories.find(name => layerSelector[name].test(id));
      if (category && colorClass[type]) {
        return layer.setIn(['paint', colorClass[type]], color[category]);
      }
      return layer;
    });

  return defaultMapStyle.set('layers', layers);
}
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


const Dashboard=()=>{
  const mapRef = useRef();
  const [popupInfo, setPopupInfo] = useState(null);
  const [projects,setProjects]=useState([])
  const [hoverCardFinish,setHoverCardFinished]=useState('#0691D5')
  const [hoverCardInProgress,setHoverCardInProgress]=useState('#06D557')
  const [hoverCardPending,setHoverCardPending]=useState('#EDC00F')
  const [hoverCardRejected,setHoverCardRejected]=useState('#E51111')
  const [totalPending,setTotalPending]=useState(0)
  const [totalApproved,setTotalApproved]=useState(0)
  const [totalRejected,setTotalRejected]=useState(0)
  const [totalClosed,setTotalClosed]=useState(0)
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    
    []
  );

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
      console.log(newViewport.latitude)
      setMarker({
        latitude:newViewport.latitude,
        longitude:newViewport.longitude
      })
      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      
      });
    },
  
    [handleViewportChange]
  
  );

 


  //varible map react gl
  const [viewport, setViewport] = useState({
    longitude: 107.6684889,
    latitude: -6.9504246,
    zoom: 13.5,
  
  });
  const [marker, setMarker] = useState({
    longitude: 107.6684889,
    latitude: -6.9504246
  });
  
  const [events, logEvents] = useState({});

  useEffect(()=>{
    getProjects().then((response)=>{
      console.log('data',response)
      setProjects([...response])
      
    })

    totalStatus().then((response)=>{
      setTotalPending(response.data.total_pending)
      setTotalRejected(response.data.total_rejected)
      setTotalApproved(response.data.total_approved)
      setTotalClosed(response.data.total_closed)

    })

    
  


  },[])

  //function over
  function MouseOver(event) {
  
    setHoverCardFinished('#add8e6')
  
  }
  function MouseOut(event){
    setHoverCardFinished('#0691D5')
  }

  
  function MouseOverInProgress(event) {
  
    setHoverCardInProgress('#90ee90')
  
  }
  function MouseOutInProgress(event){
    setHoverCardInProgress('#06D557')
  }

  function MouseOverPending(event) {
  
    setHoverCardPending('#fed8b1')
  
  }
  function MouseOutPending(event){
    setHoverCardPending('#EDC00F')
  }

  function MouseOverRejected(event) {
  
    setHoverCardRejected('#ffcccb')
  
  }
  function MouseOutRejected(event){
    setHoverCardRejected('#E51111')
  }
  return (
    <div>
      {/* Container info project */}
    
      <CContainer>
        <CFormGroup row>
          <CCol xl='3'>
            <Card color="red" style={{backgroundColor:hoverCardFinish,height:'150px'}} onMouseOver={MouseOver} onMouseOut={MouseOut}  >
              <CCardBody style={{backgroundColor:hoverCardFinish}} >
              <img src={icon}  style={{width:'30px',height:'30px',backgroundColor:hoverCardFinish}}></img>
              <span style={{color:'white',fontFamily:"Time New Roman",backgroundColor:hoverCardFinish}} > Project selesai</span>
              
              <div style={{float:'right',marginTop:'50px',fontSize:'25px',backgroundColor:hoverCardFinish}}>
               <b> <span style={{color:'white', fontFamily:"Time New Roman",backgroundColor:hoverCardFinish}}>{totalClosed}</span></b>
              </div>
              </CCardBody>
              <CCardFooter style={{backgroundColor:hoverCardFinish,height:'10px',marginTop:'40px'}}>
                <div  style={{textAlign:'center',backgroundColor:hoverCardFinish}}>
                <span style={{color:'white',fontFamily:"Time New Roman",backgroundColor:hoverCardFinish}} > Lihat Semua</span>
                <BiRightArrowCircle size='19px' style={{color:'white',marginLeft:'10px',backgroundColor:hoverCardFinish}}/>
                </div>
               
              </CCardFooter>
             
            </Card>
          </CCol>
          <CCol xl='3'>
            <Card color="red" style={{backgroundColor:hoverCardInProgress,height:'150px'}} onMouseOver={MouseOverInProgress} onMouseOut={MouseOutInProgress}  >
              <CCardBody  >
              <img src={icon}  style={{width:'30px',height:'30px'}}></img>
              <span style={{color:'white',fontFamily:"Time New Roman"}} > Project Sedang Berjalan</span>
              
              <div style={{float:'right',marginTop:'50px',fontSize:'25px'}}>
               <b> <span style={{color:'white', fontFamily:"Time New Roman"}}>{totalApproved}</span></b>
              </div>
              </CCardBody>
              <CCardFooter style={{height:'10px',marginTop:'40px',backgroundColor:hoverCardInProgress}}>
                <div  style={{textAlign:'center'}}>
                <span style={{color:'white',fontFamily:"Time New Roman"}} > Lihat Semua</span>
                <BiRightArrowCircle size='19px' style={{color:'white',marginLeft:'10px'}}/>
                </div>
               
              </CCardFooter>
             
            </Card>
          </CCol>
          <CCol xl='3'>
            <Card color="red" style={{backgroundColor:hoverCardPending,height:'150px'}} onMouseOver={MouseOverPending} onMouseOut={MouseOutPending}  >
              <CCardBody  >
              <img src={icon}  style={{width:'30px',height:'30px'}}></img>
              <span style={{color:'white',fontFamily:"Time New Roman"}} > Project Pending</span>
              
              <div style={{float:'right',marginTop:'50px',fontSize:'25px'}}>
               <b> <span style={{color:'white', fontFamily:"Time New Roman"}}>{totalPending}</span></b>
              </div>
              </CCardBody>
              <CCardFooter style={{height:'10px',marginTop:'40px',backgroundColor:hoverCardPending}}>
                <div  style={{textAlign:'center'}}>
                <span style={{color:'white',fontFamily:"Time New Roman"}} > Lihat Semua</span>
                <BiRightArrowCircle size='19px' style={{color:'white',marginLeft:'10px'}}/>
                </div>
               
              </CCardFooter>
             
            </Card>
          </CCol>
          <CCol xl='3'>
            <Card color="red" style={{backgroundColor:hoverCardRejected,height:'150px'}} onMouseOver={MouseOverRejected} onMouseOut={MouseOutRejected}  >
              <CCardBody  >
              <img src={icon}  style={{width:'30px',height:'30px'}}></img>
              <span style={{color:'white',fontFamily:"Time New Roman"}} > Project ditolak</span>
              
              <div style={{float:'right',marginTop:'50px',fontSize:'25px'}}>
               <b> <span style={{color:'white', fontFamily:"Time New Roman"}}>{totalRejected}</span></b>
              </div>
              </CCardBody>
              <CCardFooter style={{height:'10px',marginTop:'40px',backgroundColor:hoverCardRejected}}>
                <div  style={{textAlign:'center'}}>
                <span style={{color:'white',fontFamily:"Time New Roman"}} > Lihat Semua</span>
                <BiRightArrowCircle size='19px' style={{color:'white',marginLeft:'10px'}}/>
                </div>
               
              </CCardFooter>
             
            </Card>
          </CCol>
        </CFormGroup>
       
      </CContainer>
      {/* Container map */}
      <CContainer>
        <Card>
          <CCardHeader>
            <span><strong>Lokasi Project</strong></span>
          </CCardHeader>
          <CCardBody>
          <MapGL {...viewport} 
                width="100%" height="70vh" 

                ref={mapRef} 
                        
               //  onViewportChange={setViewport}
                mapStyle={MAP_STYLE}
                onViewportChange={handleViewportChange}
                mapboxApiAccessToken={'pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg'}
               >
              <Geocoder
                mapRef={mapRef}
                onViewportChange={handleGeocoderViewportChange}
                mapboxApiAccessToken={'pk.eyJ1IjoicmV6aGEiLCJhIjoiY2txbG9sN3ZlMG85dDJ4bnNrOXI4cHhtciJ9.jWHZ8m3S6yZqEyL-sUgdfg'}
                marker={false}
                
                position="top-right"
              />
                <Marker
                  longitude={marker.longitude}
                  latitude={marker.latitude}
                  offsetTop={-20}
                  offsetLeft={-10}
                >
                  {/* <Pin size={20} /> */}
                  <Pins data={projects} onClick={setPopupInfo} />
                  {popupInfo && (
                  <Popup
                    tipSize={5}
                    anchor="top"
                    longitude={-118.4108}
                    latitude={34.0194}
                    closeOnClick={false}
                    onClose={setPopupInfo}
                  >
                    <CityInfo info={popupInfo} />
                  </Popup>
                )}
                </Marker>

                <GeolocateControl style={geolocateStyle} />
                <FullscreenControl style={fullscreenControlStyle} />
                <NavigationControl style={navStyle} />
                <ScaleControl style={scaleControlStyle} />
              </MapGL>
               <ControlPanel events={events} />

          </CCardBody>
        </Card>
      </CContainer>
    </div>
  )

}

export default Dashboard;