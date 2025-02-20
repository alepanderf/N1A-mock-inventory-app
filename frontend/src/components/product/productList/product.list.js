import React, { useEffect, useState } from 'react'
import './product.list.scss'
import { SpinnerImage } from '../../loader/loader'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { AiOutlineEye } from 'react-icons/ai'
import Search from '../../search/search'
import { useDispatch, useSelector } from 'react-redux'
import { FILTER_PRODUCTS, selectFilteredProducts } from '../../../redux/features/product/filter.slice'
import ReactPaginate from 'react-paginate'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { deleteProduct, getProducts } from '../../../redux/features/product/product.slice'
import { Link } from 'react-router-dom'

const ProductList = ({products, isLoading}) => {
    const [search, setSearch] = useState("")
    const filteredProducts = useSelector(selectFilteredProducts)
    const dispatch = useDispatch()

    const shortenText = (text, n) => {
        if(text.length > n) {
            const shortenedText = text.substring(0, n).concat("...")
            return shortenedText
        }
        return text
    }

    

    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product?',
            buttons: [
              {
                label: 'Delete',
                onClick: () => delProduct(id)
              },
              {
                label: 'Cancel',
                
              }
            ]
          });
    }

    const delProduct = async (id) => {
        await dispatch(deleteProduct(id)) 
        await dispatch(getProducts())
    }
    //begin Pagination  

    const itemsPerPage = 2
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = filteredProducts.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  // Invoke when user click to request another page.
    const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };
    //end pagination 

    useEffect(() => {
        dispatch(FILTER_PRODUCTS({products, search}))
    }, [products, search, dispatch])
    
    return(
        <div className="product-list">
            <hr/>
            <div className="table">
                <div className="--flex-between --flex-dir-column">
                    <span>
                        <h3>Inventory Items</h3>
                    </span>
                    <span>
                        <Search value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </span>
                </div>

                {isLoading && <SpinnerImage/>}

                <div className="table">
                    {!isLoading && products.length === 0 ? (
                        <p>-- No product found, please add a product</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Value</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                                
                            <tbody>
                                {
                                    currentItems.map((product, index) => {
                                        const {_id, name, category, price, quantity} = product
                                        return (
                                            <tr key={_id}>
                                                <td>{index + 1}</td>
                                                <td>{shortenText(name, 16)}</td>
                                                <td>{category}</td>
                                                <td>{"$"}{price}</td>
                                                <td>{quantity}</td>
                                                <td>{"$"}{price * quantity}</td>
                                                <td className="icons">
                                                    <span>
                                                        <Link to={`/product-detail/${_id}`}>
                                                        <AiOutlineEye size={25} color={"purple"}/>
                                                        </Link>
                                                    </span>
                                                    <span>
                                                        <Link to={`/edit-product/${_id}`}>
                                                        <FaEdit size={20} color={"green"}/>
                                                        </Link>
                                                    </span>
                                                    <span>
                                                        <FaTrashAlt size={25} color={"red"} onClick={() => confirmDelete(_id)} />
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    )} 
                </div>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="Prev"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                        pageLinkClassName="page-num"
                        previousLinkClassName="page-num"
                        nextLinkClassName="page-num"
                        activeLinkClassName="activePage"
                />
            </div>
        </div>

    )
}

export default ProductList