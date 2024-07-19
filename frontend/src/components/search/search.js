import React from 'react'
import styles from './search.module.scss'
import { BiSearch } from 'react-icons/bi'

const Search = ({value, onChange}) => {
    return (
        <div classname={styles.search}>
            <BiSearch size={18} className={styles.icon}/>
            <input type="text" placeholder="Search products" value={value} onChange={onChange}/>
        </div>
    )
}

export default Search