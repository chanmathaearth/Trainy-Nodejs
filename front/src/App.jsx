import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from './components/ModalView';
import Table from './components/TableView';
import Filter from './components/FilterView';
import { orderBy } from 'lodash';
import { format } from 'date-fns';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

    // Fetch stocks
    useEffect(() => {
        axios.get('http://localhost:3000/stocksv2')
            .then((response) => {
                setProducts(response.data);
                setFilteredProducts(response.data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Fetch items
    useEffect(() => {
        axios.get('http://localhost:3000/items')
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleViewClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleFilter = async (filterData) => {
        try {
            console.log(filterData)
            const response = await axios.post("http://localhost:3000/stocks/filter", filterData);
            console.log(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("Error fetching filtered data:", error.response || error);
        }
    };

    const sortedProducts = orderBy(
        filteredProducts,
        [sortConfig.key],
        [sortConfig.direction]
    );

    const handleSort = (key) => {
        let direction;
        if (sortConfig.key === key) {
            direction = sortConfig.direction === 'none' ? 'asc' : sortConfig.direction === 'asc' ? 'desc' : 'none';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="relative overflow-x-auto p-16">
            <Filter items={items} onFilter={handleFilter} />
            <Table products={sortedProducts} onViewClick={handleViewClick} onSort={handleSort} sortStatus={sortConfig}/>
            <Modal isOpen={isModalOpen} onClose={closeModal} product={selectedProduct} />
        </div>
    );
};

export default ProductTable;
