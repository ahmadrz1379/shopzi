import React from "react";

export default function Sidebar({ setActiveTab }) {
  return (
    <div className='flex flex-col w-2/12'>
      <div
        className='border-l border-b border-purple-800 cursor-pointer p-2'
        onClick={() => setActiveTab("products")}
      >
        محصولات
      </div>
      <div
        className='border-l border-b border-purple-800 cursor-pointer p-2'
        onClick={() => setActiveTab("orders")}
      >
        سفارش ها
      </div>
      <div
        className='border-l border-b border-purple-800 cursor-pointer p-2'
        onClick={() => setActiveTab("settings")}
      >
        پیکر بندی
      </div>
    </div>
  );
}
