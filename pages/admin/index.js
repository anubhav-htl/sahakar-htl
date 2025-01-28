import { children, useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Layout({children}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <>
      <main id="main" className="main">
        <Navbar toggleSidebar={toggleSidebar}/>
        <Sidebar isOpen={isSidebarOpen} />
        {children}
      </main>
    </>
  );
}
