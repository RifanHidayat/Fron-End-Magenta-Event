import * as React from 'react';

//const eventNames = ['onDragStart', 'onDrag', 'onDragEnd'];
const eventNames = ['onDragEnd'];

function round5(value) {
  return (Math.round(value * 1e5) / 1e5).toFixed(5);
}

function ControlPanel(props) {
  return (
    <div className="control-panel">
   
      <div>
        {eventNames.map(eventName => {
          const {events = {}} = props;
          const lngLat = events[eventName];
          return (
            <div key={eventName}>
              {/* <strong>{eventName}:</strong> {lngLat ? lngLat.map(round5).join(', ') : <em>null</em>} */}
            </div>
          );
        })}
      </div>
      <div className="source-link">
      
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
