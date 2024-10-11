import React, { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

function App() {
  const [activeTab, setActiveTab] = useState("products");
 
  return (
    <div dir='rtl' className='App flex '>
 
      <Sidebar setActiveTab={setActiveTab} />
      <Main activeTab={activeTab} />
    </div>
  );
}

export default App;
