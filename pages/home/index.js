"use client";
import { useEffect, useState, useRef } from "react";
import Header from "./header";
import Footer from "../../component/footer";
export default function homeLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
