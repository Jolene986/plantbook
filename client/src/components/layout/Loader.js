import React from "react";
import loader from "../../images/loader.gif";

const Loader = (props) => {
  return (
    <div className={props.classN}>
      <img
        src={loader}
        alt="loader"
        width={props.width}
        height={props.height}
      />
    </div>
  );
};

export default Loader;
