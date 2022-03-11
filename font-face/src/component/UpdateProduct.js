import React, { useState, useEffect } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Dropzone from "react-dropzone";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import TemporaryDrawer from "./SideNavber";

const UpdateProduct = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [oldVariants, setOldVariants] = useState({
    color: [],
    size: [],
  });
  const [variantPrice, setVariantPrice] = useState([]);
  const [error, setError] = useState(false);
  const [product, setProduct] = useState({
    title: "",
    sku: "",
    description: "",
  });
  const [status, setStatus] = useState();
  const [image, setImage] = useState();

  //   retrive single element to edit
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/product/retrive/${id}`).then((res) => {
      setProduct({
        title: res.data["product"].title ? res.data["product"].title : "",
        sku: res.data["product"].sku ? res.data["product"].sku : "",
        description: res.data["product"].description
          ? res.data["product"].description
          : "",
      });
      setImage(
        res.data["product"].product_image[0] &&
          res.data["product"].product_image[0]["file_path"]
      );

      setOldVariants({
        color: res.data["varient"]["color"],
        size: res.data["varient"]["size"],
      });
      setVariantPrice([]);
      res.data["variantPrice"] &&
        res.data["variantPrice"].map((data) => {
          const varant_1 =
            data["product_variant_one"] &&
            data["product_variant_one"].variant_title.toString();
          const varant_2 =
            data["product_variant_two"] &&
            data["product_variant_two"].variant_title.toString();
          const varant_3 = data["product_variant_three"]
            ? data["product_variant_three"].variant_title.toString()
            : "";
          console.log("map check");
          const finalVariant = varant_1 + "/" + varant_2 + `/${varant_3}`;
          setVariantPrice((prevState) => [
            ...prevState,
            {
              title: finalVariant,
              id: data.id,
              price: data.price ? data.price : "",
              stock: data.stock ? data.stock : "",
            },
          ]);
        });
    });
  }, []);

  //   Handle Update price of variant
  const HandleChangePrice = (price, id) => {
    setVariantPrice((existingItems) => {
      const itemIndex = existingItems.findIndex((item) => item.id === id);
      return [
        ...existingItems.slice(0, itemIndex),
        {
          ...existingItems[itemIndex],
          price: price,
        },

        ...existingItems.slice(itemIndex + 1),
      ];
    });
  };
  //   Handle Update stock of variant
  const HandleChangeStock = (stock, id) => {
    setVariantPrice((existingItems) => {
      const itemIndex = existingItems.findIndex((item) => item.id === id);
      return [
        ...existingItems.slice(0, itemIndex),
        {
          ...existingItems[itemIndex],
          stock: stock,
        },

        ...existingItems.slice(itemIndex + 1),
      ];
    });
  };

  // combination algorith
  // Save product
  let saveProduct = (event) => {
    event.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': "Bearer " + res.data.access
      },
    };

    let empty_field = false;
    setError(false);

    if (!product["title"] || !product["sku"]) {
      setError(true);
      empty_field = true;
    }
    if (!empty_field) {
      axios
        .post(
          `http://127.0.0.1:8000/product/update/${id}/`,
          {
            productDetails: product,
            productImages: image,
            varientPrice: variantPrice,
          },
          config
        )
        .then((res) => {
          setStatus(res.data["status"]);
          console.log(res.data["status"]);
          // if (res.data["error"]) {
          //   setError(res.data["error"]);
          // } else if (res.data["status"]) {
          //   setError(res.data["status"]);
          //   history.push("/productList");
          // }

          // TODO : write your code here to save the product
        });
    }
  };

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <div style={{ marginBottom: 20 }}>
        <TemporaryDrawer value='Update Product' />
      </div>
      <section>
        <div className='row'>
          <div className='col-md-6'>
            <div className='card shadow mb-4'>
              <div className='card-body'>
                {error && (
                  <span style={{ color: "red", paddingBottom: 10 }}>
                    Product name and SKU should not be empty
                  </span>
                )}
                <div className='form-group'>
                  <label htmlFor=''>Product Name</label>
                  <input
                    type='text'
                    name='title'
                    value={product.title}
                    onChange={(e) => {
                      setProduct({
                        ...product,
                        [e.target.name]: e.target.value,
                      });
                    }}
                    placeholder='Product Name'
                    className='form-control'
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>Product SKU</label>
                  <input
                    value={product.sku}
                    type='text'
                    name='sku'
                    onChange={(e) => {
                      setProduct({
                        ...product,
                        [e.target.name]: e.target.value,
                      });
                    }}
                    placeholder='Product Name'
                    className='form-control'
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>Description</label>
                  <textarea
                    value={product.description}
                    id=''
                    name='description'
                    onChange={(e) => {
                      setProduct({
                        ...product,
                        [e.target.name]: e.target.value,
                      });
                    }}
                    cols='30'
                    rows='4'
                    className='form-control'
                  ></textarea>
                </div>
              </div>
            </div>

            <div className='card shadow mb-4'>
              <div className='card-header py-3 d-flex flex-row align-items-center justify-content-between'>
                <h6 className='m-0 font-weight-bold text-primary'>Media</h6>
              </div>
              <div className='card-body border'>
                <Dropzone onDrop={(acceptedFiles) => setImage(acceptedFiles)}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>
                          {image ? (
                            image[0] ? (
                              image[0].path ? (
                                image[0].path
                              ) : (
                                image
                              )
                            ) : (
                              image
                            )
                          ) : (
                            <p>
                              Drag drop some files here, or click to select
                              files
                            </p>
                          )}
                        </p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </div>
          </div>

          <div className='col-md-6'>
            <div className='card shadow mb-4'>
              <div className='card-header py-3 d-flex flex-row align-items-center justify-content-between'>
                <h6 className='m-0 font-weight-bold text-primary'>Variants</h6>
              </div>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <label htmlFor=''>Option</label>
                      <select
                        className='form-control'
                        defaultValue='{element.option}'
                      >
                        <option>color</option>
                      </select>
                    </div>
                  </div>

                  <div className='col-md-8'>
                    <div className='form-group'>
                      <section style={{ marginTop: "30px" }}>
                        <TagsInput
                          value={oldVariants["color"]}
                          style='margin-top:30px'
                        />
                      </section>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <label htmlFor=''>Option</label>
                      <select
                        className='form-control'
                        defaultValue='{element.option}'
                      >
                        <option>Size</option>
                      </select>
                    </div>
                  </div>

                  <div className='col-md-8'>
                    <div className='form-group'>
                      <section style={{ marginTop: "30px" }}>
                        <TagsInput
                          value={oldVariants["size"]}
                          style='margin-top:30px'
                        />
                      </section>
                    </div>
                  </div>
                </div>
              </div>

              <div className='card-header text-uppercase'>Preview</div>
              <div className='card-body'>
                <div className='table-responsive'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <td>Variant</td>
                        <td>Price</td>
                        <td>Stock</td>
                      </tr>
                    </thead>
                    <tbody>
                      {variantPrice.map((productVariantPrice, index) => {
                        return (
                          <tr key={index}>
                            <td>{productVariantPrice.title}</td>
                            <td>
                              <input
                                className='form-control'
                                type='number'
                                value={productVariantPrice.price}
                                onChange={(e) =>
                                  HandleChangePrice(
                                    e.target.value,
                                    productVariantPrice.id
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className='form-control'
                                value={productVariantPrice.stock}
                                onChange={(e) =>
                                  HandleChangeStock(
                                    e.target.value,
                                    productVariantPrice.id
                                  )
                                }
                                type='number'
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 style={{ color: "red", margin: 10, textAlign: "center" }}>
          {" "}
          {error && error}
          {status && <h1>Success Fully Updated</h1>}
        </h2>
        <div>
          <button
            type='button'
            onClick={saveProduct}
            className='btn btn-lg btn-primary'
          >
            Update
          </button>
          <button
            onClick={(e) => history.push("/")}
            type='button'
            className='btn btn-secondary btn-lg'
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
};

export default UpdateProduct;
