import React from "react";
import ManagerProfile from "./ManagerProfile";
import ManagerHome from "./ManagerHome";
import ViewDocumentation from "./ViewDocumentation";
import CustomPrompt from "./CustomPrompt";

const ManagerMainContent = () => {


  return (
 <>
      <ManagerHome/>
 <ManagerProfile/>
 <ViewDocumentation/>
 <CustomPrompt/>
 </>
   
  );
};

export default ManagerMainContent;
