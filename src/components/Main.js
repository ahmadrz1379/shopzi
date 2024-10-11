import React from "react";
import Product from "./products/product";

export default function Main({ activeTab }) {
  return (
    <div className='w-10/12 p-4'>
      {activeTab === "products" && <Product />}
      {activeTab === "orders" && <div>Orders content goes here.</div>}
      {activeTab === "settings" && <div>Settings content goes here.</div>}
    </div>
  );
}
