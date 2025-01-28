import { children } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Layout({children}) {
  return (
    <>
      <main id="main" className="main">
        <Navbar />
        <Sidebar />
        {children}
      </main>
    </>
  );
}
