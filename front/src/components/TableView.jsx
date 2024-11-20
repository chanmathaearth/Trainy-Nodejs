import { format, isValid } from 'date-fns';

const formatDate = (date, formatString) => {
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, formatString) : 'N/A';
};

const Table = ({ products, onViewClick, onSort, sortStatus }) => {
    const getSortIndicator = (key) => {
        if (sortStatus.key === key) {
            if (sortStatus.direction === 'asc') return ' ↑';
            if (sortStatus.direction === 'desc') return ' ↓';
        }
        return null;
    };

    return (
        <table className="w-full text-sm text-center rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort('item_code.name')}>
                            Name {getSortIndicator('item_code.name')}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort('amount')}>
                            Amount {getSortIndicator('amount')}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort('import_datetime')}>
                            Import Time {getSortIndicator('import_datetime')}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort('exp_datetime')}>
                            Exp Time {getSortIndicator('exp_datetime')}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort('lot')}>
                            Lot {getSortIndicator('lot')}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort('note')}>
                            Note {getSortIndicator('note')}
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={index} className="bg-white">
                        <td className="px-6 py-4">{product.item_code.name}</td>
                        <td className="px-6 py-4">{product.amount}</td>
                        <td className="px-6 py-4">{formatDate(product.import_datetime, 'yyyy-MM-dd')}</td>
                        <td className="px-6 py-4">{formatDate(product.exp_datetime, 'HH:mm:ss')}</td>
                        <td className="px-6 py-4">{product.lot}</td>
                        <td className="flex items-center h-full px-6 py-4 justify-center">
                            <button
                                onClick={() => onViewClick(product)}
                                className="bg-green-500 p-1 text-white rounded-xl text-sm font-thin hover:bg-green-600"
                            >
                                View
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
