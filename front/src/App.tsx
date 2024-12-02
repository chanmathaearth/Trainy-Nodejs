import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from './components/ModalView.js';
import Table from './components/TableView.js';
import Filter from './components/FilterView.js';
import { orderBy } from 'lodash';

interface Product {
    stock: {
        lot: number;
        amount: number;
        import_datetime: string;
        exp_datetime: string;
        note: string;
    };
    items: {
        name: string;
    };
}

interface Item {
    _id: string;
    name: string;
}

interface SortConfig {
    key: string | null;
    direction: 'asc' | 'desc' | 'none';
}

const ProductTable = () => {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'none' });

    useEffect(() => {
        axios.get<Product[]>('http://localhost:3000/stocks')
            .then((response) => {
                setFilteredProducts(response.data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        axios.get<Item[]>('http://localhost:3000/items')
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleViewClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleFilter = async (filterData: Record<string, any>) => {
        try {
            const response = await axios.post<Product[]>(
                'http://localhost:3000/stocks/filter',
                filterData
            );
            console.log(filterData);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };

    const sortedProducts = orderBy(
        filteredProducts,
        [sortConfig.key],
        [sortConfig.direction]
    );

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' | 'none';
        if (sortConfig.key === key) {
            direction =
                sortConfig.direction === 'none'
                    ? 'asc'
                    : sortConfig.direction === 'asc'
                    ? 'desc'
                    : 'none';
        } else {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="relative overflow-x-auto p-16">
            <Filter items={items} onFilter={handleFilter} />
            <Table
                products={sortedProducts}
                onViewClick={handleViewClick}
                onSort={handleSort}
                sortStatus={sortConfig}
            />
            <Modal isOpen={isModalOpen} onClose={closeModal} product={selectedProduct} />
        </div>
    );
};

export default ProductTable;
