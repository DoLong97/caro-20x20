import React, { Component } from 'react';

function Square(props) {
  return (
    <button className="square"
      onClick={props.onClick}
      style={{
        color: (props.value === "X") ? "blue" : "red",
        backgroundColor: (props.isHighLight) ? '#00FF00' :null,
      }}  
    >
      {(props.value === 0) ? null : props.value}
    </button>
  );
}
class Row extends Component {
  render() {
    const { row, rowIdx, highLights, onClick} = this.props;
    return (
      <div className="board-row">
        {row.map((col, colIdx,) => {
          const isHighLight = highLights.filter(highLight => {
            return highLight.x === rowIdx+1 && highLight.y === colIdx+1;
          }).length > 0;
          return (
            <Square
              key={colIdx}
              isHighLight={isHighLight}
              value={row[colIdx]}
              onClick={() => onClick(rowIdx, colIdx)} />
          );
          })}
      
      </div>
    );
  }
}

export default Row;