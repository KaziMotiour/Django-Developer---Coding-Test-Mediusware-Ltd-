import React, { useState, useEffect } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Dropzone from "react-dropzone";
import { useHistory } from "react-router-dom";
import TemporaryDrawer from "./SideNavber";
import axios from "axios";

const CreateProduct = (props) => {
  const history = useHistory();
  const [productVariantPrices, setProductVariantPrices] = useState([]);
  const [variants, setVariant] = useState();
  const [error, setError] = useState();
  const [status, setStatus] = useState();
  const [image, setImage] = useState();

  const [productInfo, setProductInfo] = useState({
    productName: "",
    sku: "",
    description: "",
  });

  const [productVariants, setProductVariant] = useState([
    {
      option: "color",
      tags: [],
    },
  ]);

  //   get all the variant
  useEffect(() => {
    if (variants === undefined) {
      axios.get(`http://127.0.0.1:8000/product/varient`).then((res) => {
        setVariant(res.data);
      });
    }
  }, []);

  // handle click event of the Add button
  const handleAddClick = () => {
    let all_variants = variants.map((el) => el.id);
    let selected_variants = productVariants.map((el) => el.option);
    let available_variants = all_variants.filter(
      (entry1) => !selected_variants.some((entry2) => entry1 == entry2)
    );
    setProductVariant([
      ...productVariants,
      {
        option: "color",
        tags: [],
      },
    ]);
  };

  // handle input change on tag input
  const handleInputTagOnChange = (value, index) => {
    let product_variants = [...productVariants];
    product_variants[index].tags = value;

    setProductVariant(product_variants);

    checkVariant();
  };

  // remove product variant
  const removeProductVariant = (index) => {
    let product_variants = [...productVariants];
    product_variants.splice(index, 1);
    setProductVariant(product_variants);
  };

  //   add variant name to variant list
  const addVariantName = (title, index) => {
    let product_variants = [...productVariants];
    product_variants[index].option = title;
    setProductVariant(product_variants);
  };

  //   Handle price changing in variant price
  const HandleChangePrice = (price, index) => {
    let productVariantPrice = [...productVariantPrices];
    productVariantPrice[index].price = price;
    setProductVariantPrices(productVariantPrice);
  };

  //   Handle stock changing in variant price
  const HandleChangeStock = (stock, index) => {
    let productVariantPrice = [...productVariantPrices];
    productVariantPrice[index].stock = stock;
    setProductVariantPrices(productVariantPrice);
  };

  // check the variant and render all the combination
  const checkVariant = () => {
    let tags = [];

    productVariants.filter((item) => {
      tags.push(item.tags);
    });

    setProductVariantPrices([]);

    getCombn(tags).forEach((item) => {
      setProductVariantPrices((productVariantPrice) => [
        ...productVariantPrice,
        {
          title: item,
          price: 0,
          stock: 0,
        },
      ]);
    });
  };

  // combination algorithm
  function getCombn(arr, pre) {
    pre = pre || "";
    if (!arr.length) {
      return pre;
    }
    let ans = arr[0].reduce(function (ans, value) {
      return ans.concat(getCombn(arr.slice(1), pre + value + "/"));
    }, []);
    return ans;
  }

  // Save product
  let saveProduct = (event) => {
    event.preventDefault();
    const formData = new FormData();
    const config = {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': "Bearer " + res.data.access
      },
    };

    axios
      .post(
        "http://127.0.0.1:8000/product/create/",
        {
          productDetails: productInfo,
          productImages: image,
          productVariten: productVariants,
          varientPrice: productVariantPrices,
        },
        config
      )
      .then((res) => {
        if (res.data["error"]) {
          setError(res.data["error"]);
        } else if (res.data["status"]) {
          setError(res.data["status"]);
          history.push("/productList");
        }

        // TODO : write your code here to save the product
      });
  };

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <div style={{ marginBottom: 20 }}>
        <TemporaryDrawer value='Create New Product' />
      </div>
      <section>
        <div className='row'>
          <div className='col-md-6'>
            <div className='card shadow mb-4'>
              <div className='card-body'>
                <div className='form-group'>
                  <label htmlFor=''>Product Name</label>
                  <input
                    type='text'
                    name='productName'
                    onChange={(e) => {
                      setProductInfo({
                        ...productInfo,
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
                    type='text'
                    name='sku'
                    onChange={(e) => {
                      setProductInfo({
                        ...productInfo,
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
                    id=''
                    name='description'
                    onChange={(e) => {
                      setProductInfo({
                        ...productInfo,
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
                            image[0].path
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
                {productVariants.map((element, index) => {
                  return (
                    <div className='row' key={index}>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label htmlFor=''>Option</label>
                          <select
                            className='form-control'
                            onChange={(e) =>
                              addVariantName(e.target.value, index)
                            }
                            defaultValue={element.option}
                          >
                            {variants &&
                              variants.map((variant, index) => {
                                return (
                                  <option key={index} value={variant.title}>
                                    {variant.title}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>

                      <div className='col-md-8'>
                        <div className='form-group'>
                          {productVariants.length > 1 ? (
                            <label
                              htmlFor=''
                              className='float-right text-primary'
                              style={{ marginTop: "-30px" }}
                              onClick={() => removeProductVariant(index)}
                            >
                              remove
                            </label>
                          ) : (
                            ""
                          )}

                          <section style={{ marginTop: "30px" }}>
                            <TagsInput
                              value={element.tags}
                              style='margin-top:30px'
                              onChange={(value) =>
                                handleInputTagOnChange(value, index)
                              }
                            />
                          </section>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className='card-footer'>
                {productVariants.length !== 3 ? (
                  <button className='btn btn-primary' onClick={handleAddClick}>
                    Add another option
                  </button>
                ) : (
                  ""
                )}
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
                      {productVariantPrices.map(
                        (productVariantPrice, index) => {
                          return (
                            <tr key={index}>
                              <td>{productVariantPrice.title}</td>
                              <td>
                                <input
                                  className='form-control'
                                  type='number'
                                  onChange={(e) =>
                                    HandleChangePrice(e.target.value, index)
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className='form-control'
                                  onChange={(e) =>
                                    HandleChangeStock(e.target.value, index)
                                  }
                                  type='number'
                                />
                              </td>
                            </tr>
                          );
                        }
                      )}
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
        </h2>
        <div>
          <button
            type='button'
            onClick={saveProduct}
            className='btn btn-lg btn-primary'
          >
            Save
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

export default CreateProduct;
