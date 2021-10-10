import React, { Component } from 'react';


function Move(props) {
  const { x, y } = props.step.checked;
  //const { jumpTo, index } = props;
  const order = x && y ?
    `Go to Move (${x - 1}, ${y - 1})` :
    'GO TO GAME START';
  return (
    <li>
      <div
        style={{
          color: (props.order === x, y) ? "blue" : "red",
          fontSize: "16px"
        }}
      // onClick={() => jumpTo(index)} 
      >{order}
      </div>
    </li>
  );
}
class MoveList extends Component {
  render() {
    const { history, jumpTo } = this.props;
    return (
      <ol>
        {history.map((step, index) => (
          <Move
            key={index}
            step={step}
            index={index}
            jumpTo={jumpTo} />
        ))}
      </ol>
    );
  }
}

export default MoveList;