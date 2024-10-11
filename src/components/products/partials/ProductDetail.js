import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import Login from "../../auth/login";

export default function ProductDetail({ setEditProduct, id }) {
  const [userLogin, setUserLogin] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const editorRef = useRef(null);
  const [apiSettings, setApiSettings] = useState({
    root: "",
    nonce: "",
  });

  useEffect(() => {
    // Check if wpApiSettings is available in the global window object
    if (window.wpApiSettings) {
      setApiSettings({
        root: window.wpApiSettings.root,
        nonce: window.wpApiSettings.nonce,
      });
    }
  }, []);
  const handleCategoryChange = (e) => {
    // Handle category change (You might need logic to add or remove categories)
  };

  const handleTagChange = (e) => {
    // Handle tag change (You might need logic to add or remove tags)
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleGalleryChange = (e) => {
    setGalleryImages([...e.target.files]);
  };

  const handleSave = async () => {
    const content = editorRef.current ? editorRef.current.getContent() : "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("SKU", sku);
    formData.append("stock", stock);
    formData.append("price", price);
    formData.append("discount_price", discountPrice);
    formData.append("description", content);
    formData.append("thumbnail", thumbnail);
    galleryImages.forEach((image, index) => {
      formData.append(`galleryImage_${index}`, image);
    });

    // Add categories and tags in the way your backend expects (this is just an example)
    formData.append("categories", JSON.stringify(categories));
    formData.append("tags", JSON.stringify(tags));

    try {
      const response = await axios.post(
        `${apiSettings.root}shopzi/v1/product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-WP-Nonce": apiSettings.nonce,
          },
          withCredentials: true, // Ensure this is set correctly outside the headers
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error saving the product", error);
      console.log(error.status);

      if (error.status == 401) {
        setUserLogin(false);
      }
    }
  };

  return (
    <>
      {" "}
      {userLogin ? (
        <div className='flex items-start'>
          <div className='w-10/12'>
            <input
              type='text'
              className='border border-purple-700'
              placeholder='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type='text'
              className='border border-purple-700'
              placeholder='slug'
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <Editor
              apiKey='efpu9kghf6tdm3o3b229n7frl2tf5ldab3rjwcbh34hwdri9'
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue='<p>This is the initial content of the editor.</p>'
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />

            <div className='border border-purple-600 my-2 flex flex-col gap-2 p-2'>
              <div>
                <label>SKU :</label>
                <input
                  className='border border-purple-400'
                  placeholder='enter the SKU'
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
              <div>
                <label>Stock :</label>
                <input
                  className='border border-purple-400'
                  placeholder='enter the stock'
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className='w-2/12 sticky top-0'>
            <div className='flex flex-col gap-4'>
              <div>
                <label>Insert the thumbnail</label>
                <input type='file' onChange={handleThumbnailChange} />
              </div>
              <div>
                <label>Insert the gallery images</label>
                <input type='file' multiple onChange={handleGalleryChange} />
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <input
                className='border border-purple-700'
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                className='border border-purple-700'
                placeholder='Discount Price'
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <ul>
                <li>
                  <label>
                    <input type='checkbox' onChange={handleCategoryChange} />
                    Categories
                  </label>
                </li>
              </ul>
              <button className='border border-purple-400 p-2'>
                Add Category
              </button>
            </div>

            <div className='flex flex-col gap-1'>
              <ul>
                <li>
                  <label>
                    <input type='checkbox' onChange={handleTagChange} />
                    Tag
                  </label>
                </li>
              </ul>
              <button className='border border-purple-400 p-2'>Add Tag</button>
            </div>

            <div>
              <button
                className='bg-purple-600 text-white text-xl font-medium'
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Login></Login>
      )}
    </>
  );
}
