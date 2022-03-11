import "./css/productList.css";
import React, { useState, useEffect } from "react";

import Pagination from "@material-ui/lab/Pagination";
import TemporaryDrawer from "./SideNavber";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const ProductList = () => {
  const history = useHistory();
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const [pageNumber, setPageNumber] = useState(1);

  const [poroductList, setProductList] = useState();
  const [variants, setVariants] = useState();
  const [serachInfo, setSearchInfo] = useState({
    title: "",
    varient: "",
    price_from: "",
    price_to: "",
    date: "",
  });
  const [searchAlert, setSearchAlert] = useState({
    varient: false,
  });

  // get all the product list
  useEffect(() => {
    if (poroductList === undefined) {
      axios
        .get(`http://127.0.0.1:8000/product/list/?p=${pageNumber}`)
        .then((res) => {
          setProductList(res.data);
        });
    }
  }, []);

  // get product variant list
  useEffect(() => {
    if (variants === undefined) {
      axios.get(`http://127.0.0.1:8000/product/product-varient`).then((res) => {
        setVariants(res.data);
      });
    }
  }, []);

  // Handle varitant search info input
  const HandleVariantSearchInfo = (e) => {
    if (
      e.target.value === "Choose any Color" ||
      e.target.value === "Choose any Size"
    ) {
      setSearchInfo({ ...serachInfo, varient: "" });
    } else {
      setSearchInfo({ ...serachInfo, varient: e.target.value });
    }
  };

  // Handle search
  const SearchHandler = (event) => {
    event.preventDefault();
    let varient = false;
    if (
      serachInfo.varient === "Choose any Color" ||
      serachInfo.varient === "Choose any Size"
    ) {
      varient = true;
      setSearchAlert({ ...searchAlert, varient: true });
    } else {
      varient = false;
      setSearchAlert({ ...searchAlert, varient: false });
    }

    if (varient === false) {
      setPageNumber(1);
      axios
        .get(
          `http://127.0.0.1:8000/product/list/?p=1&title=${serachInfo.title}&varient=${serachInfo.varient}&gte_price=${serachInfo.price_from}&lte_price=${serachInfo.price_to}&date=${serachInfo.date}`
        )
        .then((res) => {
          setProductList(res.data);
        });
    }
  };

  // Handle pagination
  const HandlePaginator = (event, value) => {
    setPageNumber(value);
    axios
      .get(
        `http://127.0.0.1:8000/product/list/?p=${value}&title=${serachInfo.title}&varient=${serachInfo.varient}&gte_price=${serachInfo.price_from}&lte_price=${serachInfo.price_to}`
      )
      .then((res) => {
        setProductList(res.data);
      });
  };

  // got to Edit Page
  const goToEditPage = (event, id) => {
    event.preventDefault();
    history.push(`/updatePorduct/${id}`);
  };

  return (
    <div className='body'>
      <TemporaryDrawer value='products' />

      <div className='product-body'>
        <form onSubmit={SearchHandler}>
          <div className='product-search-ber'>
            <div class='form-row align-items-center'>
              <div>
                <div class='col-sm-3 my-1'>
                  <label class='sr-only' for='inlineFormInputName'>
                    Name
                  </label>
                  <input
                    onChange={(e) =>
                      setSearchInfo({
                        ...serachInfo,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name='title'
                    style={{ width: 200 }}
                    type='text'
                    class='form-control'
                    id='inlineFormInputName'
                    placeholder='Jane Doe'
                  />
                </div>
              </div>
            </div>

            <div class='col-auto my-1' style={{ width: 250 }}>
              <label class='mr-sm-2' for='inlineFormCustomSelect'></label>
              <select
                class='custom-select mr-sm-2'
                onChange={HandleVariantSearchInfo}
                id='inlineFormCustomSelect'
              >
                <option value='Choose any Color' style={{ fontWeight: "bold" }}>
                  Choose any Color
                </option>
                {variants &&
                  variants["color"].map((color) => (
                    <option value={color}>{color}</option>
                  ))}
                <option value='Choose any Size' style={{ fontWeight: "bold" }}>
                  Choose any Size
                </option>
                {variants &&
                  variants["size"].map((size) => (
                    <option value={size}>{size}</option>
                  ))}
              </select>
              {searchAlert.varient ? (
                <span style={{ color: "red" }}>
                  Please choose any color or size
                </span>
              ) : (
                " "
              )}
            </div>

            <div class='col-sm-3 my-1' style={{ paddingTop: 15 }}>
              <label class='sr-only' for='inlineFormInputGroupUsername'>
                Username
              </label>
              <div class='input-group'>
                <div class='input-group-prepend'>
                  <div class='input-group-text'>Price Range</div>
                </div>
                <input
                  onChange={(e) =>
                    setSearchInfo({
                      ...serachInfo,
                      [e.target.name]: e.target.value,
                    })
                  }
                  name='price_from'
                  type='number'
                  class='form-control'
                  id='inlineFormInputGroupUsername'
                  placeholder='From'
                />
                <input
                  type='number'
                  onChange={(e) =>
                    setSearchInfo({
                      ...serachInfo,
                      [e.target.name]: e.target.value,
                    })
                  }
                  name='price_to'
                  class='form-control'
                  id='inlineFormInputGroupUsername'
                  placeholder='To'
                />
              </div>
            </div>
            <div>
              <form className={classes.container} noValidate>
                <TextField
                  onChange={(e) =>
                    setSearchInfo({
                      ...serachInfo,
                      [e.target.name]: e.target.value,
                    })
                  }
                  name='date'
                  id='date'
                  label='pic a date'
                  type='date'
                  defaultValue='2022-03-11'
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
            </div>
            <div style={{ paddingTop: 15 }}>
              <button className='btn btn-primary'>Search</button>
            </div>
          </div>
        </form>
        <div className='product-list'>
          <table className='table'>
            <thead>
              <tr className=' '>
                <th className='col-1' scope='col-1'>
                  #
                </th>
                <th scope='col'>title</th>
                <th scope='col'>description</th>
                <th scope='col'>varient</th>
                <th scope='col'></th>
                <th scope='col'></th>
                <th scope='col'>action</th>
              </tr>
            </thead>
            <tbody>
              {poroductList &&
                poroductList.results.map((item, index) => (
                  <tr>
                    <th className='row-1' scope='row-1'>
                      {pageNumber * 2 - 1 + index}
                    </th>
                    <td>
                      {item.title} <br />
                      created at: {item.created_at.substring(0, 10)}
                    </td>
                    <td>{item.description}</td>
                    <td>
                      {item.product_varient_price.map((varient) => (
                        <p>
                          <strong>
                            {varient.product_variant_one.variant_title}
                            {varient.product_variant_two
                              ? "/" + varient.product_variant_two.variant_title
                              : ""}
                            {varient.product_variant_three
                              ? "/" +
                                varient.product_variant_three.variant_title
                              : ""}
                          </strong>
                        </p>
                      ))}
                    </td>
                    <td>
                      {item.product_varient_price.map((varient) => (
                        <p>
                          <strong>Price: {varient.price}</strong>
                        </p>
                      ))}
                    </td>
                    <td>
                      {item.product_varient_price.map((varient) => (
                        <p>Stock: {varient.stock}</p>
                      ))}
                    </td>
                    <td>
                      <button
                        onClick={(e) => goToEditPage(e, item.id)}
                        className='btn btn-primary'
                      >
                        edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className='product-footer'>
          <div>
            {poroductList && poroductList.count >= 1 && (
              <p style={{ fontWeight: "bold" }}>
                Showing {pageNumber * 2 - 1} to{" "}
                {poroductList.count > 1 ? pageNumber * 2 : 1} out of{" "}
                {poroductList && poroductList.count}
              </p>
            )}
          </div>
          <div>
            <Pagination
              onChange={HandlePaginator}
              count={poroductList && Math.ceil(poroductList.count / 2)}
              variant='outlined'
              shape='rounded'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
