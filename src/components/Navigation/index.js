import React from 'react';

const styleButton={
  background: "#00FFFF", 
  color: "#000000",
  width: "100px",
  height: "30px",
  marginTop:"70px" ,
  borderRadius:"5px",
  fontSize:"18px"
}

function Navigation(props) {
  return (
    <div>
      <span className="pull-xs-right">&nbsp;</span>
      <button style={styleButton}  
      disabled={props.stepNumber === 0}
              onClick={() => props.onClick(props.stepNumber - 1)}>
      ⇤ Prev
          </button>
          <span className="pull-xs-right">&nbsp;</span>
    <button  style={styleButton} 
     disabled={props.stepNumber === props.historyLength - 1}
              onClick={() => props.onClick(props.stepNumber + 1)}>
      Next ⇥
      </button>
      </div>
  );
}

export default Navigation;