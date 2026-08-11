import React from "react";
import { CiFaceFrown } from "react-icons/ci";
const OopsNotFound = ({ content ,overRideCSS}) => {
  return (
    <div className={overRideCSS}>
       <div className="flex justify-center">
       <CiFaceFrown size={40}/>
       </div>
       <h2  className="text-center text-2xl font-bold">Oops!!</h2>
      <p className="text-center ">{content}</p>
    </div>
  );
};

export default OopsNotFound;
