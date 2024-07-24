import React from "react";
import ManagerProfile from "./ManagerProfile";
import ManagerHome from "./ManagerHome";
import ViewDocumentation from "./ViewDocumentation";

const ManagerMainContent = () => {


  return (
    <div className="col-lg-9">
      <ManagerHome/>
 <ManagerProfile/>
 <ViewDocumentation/>
    </div>
  );
};

export default ManagerMainContent;
