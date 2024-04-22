import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import arrowImage from "../../Assets/arrow.svg";
import Header from "../../components/header/Header";
import { updateProduct } from "../../actions/productActions";
import { baseURL } from "../../constance/productConstance";
import axios from "axios";

const EditProduct = () => {
  let navigate = useNavigate();
  const id = window.location.pathname.split("/")[2];
  const location = useLocation();

  const [sku, setSKU] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(["test"]);
  const [quantity, setQuantity] = useState("");
  const [imageURL, setImageURL] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      setSKU(location.state.sku);
      setName(location.state.name);
      setPrice(location.state.price);
      setDescription(location.state.description);
      setImage(location.state.image);
      setQuantity(location.state.quantity);
    };
    getData();
  }, [location.state]);

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

  const handleSubmit = (e) => {
    let image = []; 
    e.preventDefault();
    image.push(imageURL);
    dispatch(updateProduct(id, name, price, description, image, sku, quantity));
    navigate("/");
  };

  return (
    <div>
      <Header />
      <div className="mt-10 mx-[118px] flex">
        <h1 className="text-4xl font-bold p-5 pl-16">PRODUCTS</h1>
        <img src={arrowImage} alt="arrow" />
        <h3 className="mt-8 pl-3 text-blue font-bold">Edit Product</h3>
      </div>
      <div className="mt-4 pl-16 mx-[118px]">
        <form action="" onSubmit={handleSubmit}>
          <div className="flex">
            <label htmlFor="SKU" className="pt-1 font-bold">
              SKU
            </label>
            <input
              type="text"
              name="SKU"
              onChange={(e) => setSKU(e.target.value)}
              value={sku}
              className="bg-offWhite w-64 rounded-md ml-10 focus:outline-none pl-2 p-1"
            />
          </div>
          <div className="flex mt-10">
            <div>
              <label htmlFor="Name" className="pt-1 font-bold">
                Name
              </label>
              <input
                type="text"
                name="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-offWhite w-64 rounded-md ml-8 focus:outline-none pl-2 p-1"
              />
            </div>
            <div className="ml-96">
              <label htmlFor="Price" className="pt-1 font-bold">
                QTY
              </label>
              <input
                type="text"
                name="Price"
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
                className="bg-offWhite w-64 rounded-md ml-10 focus:outline-none pl-2 p-1"
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
              rows="5"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="bg-offWhite mt-4 w-96 rounded-md focus:outline-none pl-2 p-1"
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
                name="Image"
                onChange={handleImage}
                className="bg-offWhite w-96 rounded-md ml-10 focus:outline-none pl-2 p-1"
              />
            </div>
          </div>
          <div className="mt-8 ">
            <button
              type="submit"
              className="bg-blue text-white rounded-md px-10 py-2"
            >
              Edit Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
