import React from "react";

export default function ProductList({ data, setEidtProduct }) {
  // Handle Edit button click
  const handlerEdit = () => {
    // Set the product ID to be edited
    setEidtProduct(data.id);
  };

  return (
    <div className='w-full'>
      {/* Table Header */}
      <div className='flex items-center justify-between border-b border-purple-800 py-2 font-bold bg-gray-100'>
        <div className='w-1/12'>Image</div>
        <div className='w-2/12'>Name</div>
        <div className='w-1/12'>Price</div>
        <div className='w-1/12'>SKU</div>
        <div className='w-1/12'>Stock</div>
        <div className='w-2/12'>Categories</div>
        <div className='w-2/12'>Tags</div>
        <div className='w-1/12'>Date</div>
      </div>

      {/* Table Row */}
      <div className='flex items-start justify-between border-b border-purple-800 py-2'>
        <div className='w-1/12'>
          <img src={data.image} alt={data.title} className='w-full h-auto' />
        </div>
        <div className='container_name w-2/12 flex flex-col'>
          <span>{data.title}</span>
          <div className='action_buttons space-x-2 mt-2'>
            {/* When clicking Edit, call the handlerEdit function */}
            <button className='text-blue-500' onClick={handlerEdit}>
              Edit
            </button>
            <button className='text-red-600'>Delete</button>
            <a href={data.slug} className='text-blue-500'>
              Show
            </a>
          </div>
        </div>
        <div className='w-1/12'>{data.price}</div>
        <div className='w-1/12'>{data.SKU}</div>
        <div className='w-1/12'>{data.stock}</div>
        <div className='w-2/12'>
          {data.categories.map((category, index) => (
            <a key={index} href={category.slug} className='block text-blue-500'>
              {category.title}
            </a>
          ))}
        </div>
        <div className='w-2/12'>
          {data.tags.map((tag, index) => (
            <a key={index} href={tag.slug} className='block text-blue-500'>
              {tag.title}
            </a>
          ))}
        </div>
        <div className='w-1/12'>{data.date}</div>
      </div>
    </div>
  );
}
