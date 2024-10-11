import React, { useState } from "react";
import ProductList from "./partials/productList";
import ProductDetail from "./partials/ProductDetail";

export default function Product() {
  const products = [
    {
      id: 1,
      title: "بادمجون",
      slug: "eggplanet",
      image:
        "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_rtl_r5.png",
      price: 50000,
      discountPrice: "",
      categories: [
        { title: "کشاورزی", slug: "sosage-category" },
        { title: "سبزیجات", slug: "sosage-category" },
      ],
      tags: [{ title: "سبزی", slug: "sosage-tag" }],
      rating: 5,
      SKU: "45-sw",
      stock: "5 تا  ",
      date: "1400/9/9",
    },
  ];

  // Update state to store the product ID to be edited (initially null)
  const [EidtProduct, setEidtProduct] = useState(null);

  return (
    <div>
      {/* If EidtProduct has a value (an ID), show ProductDetail, otherwise show ProductList */}
      {EidtProduct ? (
        <ProductDetail  id={EidtProduct} setEidtProduct={setEidtProduct} />
      ) : (
        products.map((product) => (
          <ProductList
            key={product.id}
            data={product}
            setEidtProduct={setEidtProduct}  // Pass setEidtProduct to ProductList
          />
        ))
      )}
    </div>
  );
}
