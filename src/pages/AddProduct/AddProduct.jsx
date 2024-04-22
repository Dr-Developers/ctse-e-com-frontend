import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import arrowImage from "../../Assets/arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../actions/productActions";
import { baseURL } from "../../constance/productConstance";
import axios from "axios";

const AddProduct = () => {
  const [sku, setSKU] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState('');
  const [quantity, setQuantity] = useState("");

  const dispatch = useDispatch();

  const productRegister = useSelector((state) => state.productAdd);
  const { loading, error, productAdd } = productRegister;
  const navigate = useNavigate();

  useEffect(() => {
    if (productAdd) {
      navigate("/");
    }
  });

  const handleImage = async (e) => {
    if (!e.target.files) {
        console.error("No files input found.");
        return;
    }

    e.preventDefault();

    try {
        const file = e.target.files[0];
        if (!file) {
            alert("No file selected.");
            return;
        }

        if (file.size > 1024 * 1024) { // 1 MB
            alert("File size too large! Limit is 1MB.");
            return;
        }

        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            alert("Invalid file format! Only JPEG and PNG are allowed.");
            return;
        }

        let formData = new FormData();
        formData.append("file", file);

        console.log("formData: ", formData);

        const response = await axios.post(`${baseURL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        setImageURL(response.data.url);  // Assuming setImageURL is a valid function like setImage

        console.log("URL: ", response.data.url);
    } catch (error) {
        console.error("Error uploading image: ", error);
    }
};


  const handleSubmit = async (e) => {
    let image = []; 
    e.preventDefault();
    image.push(imageURL);
    dispatch(addProduct(name, price, description, image, sku, quantity));
  };

  return (
    <div>
      <Header />
      <div className="mt-10 mx-[118px] flex">
        <h1 className="text-4xl font-bold p-5 pl-16">PRODUCTS</h1>
        <img src={arrowImage} alt="arrow" />
        <h3 className="mt-8 pl-3 text-blue font-bold">Add new Product</h3>
      </div>
      <div className="mt-4 pl-16 mx-[118px]">
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <div>
              <label htmlFor="SKU" className="pt-1 font-bold">
                SKU
              </label>
              <input
                type="text"
                className="bg-offWhite w-64 rounded-md ml-10 focus:outline-none pl-2 p-1"
                name="SKU"
                onChange={(e) => setSKU(e.target.value)}
              />
            </div>
            <div className="ml-96">
              <label htmlFor="Price" className="pt-1 font-bold">
                Price
              </label>
              <input
                type="text"
                className="bg-offWhite w-64 rounded-md ml-10 focus:outline-none pl-2 p-1"
                name="Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="flex mt-10">
            <div>
              <label htmlFor="Name" className="pt-1 font-bold">
                Name
              </label>
              <input
                type="text"
                className="bg-offWhite w-64 rounded-md ml-8 focus:outline-none pl-2 p-1"
                name="Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="ml-96">
              <label htmlFor="Price" className="pt-1 font-bold">
                QTY
              </label>
              <input
                type="text"
                className="bg-offWhite w-64 rounded-md ml-10 focus:outline-none pl-2 p-1"
                name="Price"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-10">
            <label htmlFor="Description" className="pt-1 font-bold">
              Product Description
            </label>
            <h6 className="text-xs pt-2">A small product about the product</h6>
            <textarea
              name="Description"
              id=""
              cols="50"
              className="bg-offWhite mt-4 w-96 rounded-md focus:outline-none pl-2 p-1"
              rows="5"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mt-5 flex">
            <div>
              <label htmlFor="Image" className="pt-1 font-bold">
                Product Image
              </label>
              <h6 className="text-xs pt-2">JPEG, PNG, SVG or GIF</h6>
              <h6 className="text-xs">(Maximum file size 50MB)</h6>
            </div>
            <div>
              <input
                type="file"
                className="bg-offWhite w-96 rounded-md ml-10 focus:outline-none pl-2 p-1"
                name="Image"
                onChange={handleImage}
              />
            </div>
          </div>
          <div className="mt-8 ">
            <button
              type="submit"
              className="bg-blue text-white rounded-md px-10 py-2"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
