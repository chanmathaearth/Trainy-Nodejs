import { FC } from "react";
import { format, isValid } from "date-fns";

interface Stock {
    amount: number;
    import_datetime: string | Date;
    exp_datetime: string | Date;
    lot: number;
    note: string;
}

interface Items {
    name: string;
}

interface Product {
    stock: Stock;
    items: Items;
}

interface SortStatus {
    key: string | null;
    direction: "asc" | "desc" | "none";
}

interface TableProps {
    products: Product[];
    onViewClick: (product: Product) => void;
    onSort: (key: string) => void;
    sortStatus: SortStatus;
}

// Format date utility function with TypeScript types
const formatDate = (date: string | Date, formatString: string): string => {
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, formatString) : "N/A";
};

// Functional Component
const Table: FC<TableProps> = ({ products, onViewClick, onSort, sortStatus }) => {
    const getSortIndicator = (key: string): string | null => {
        if (sortStatus.key === key) {
            if (sortStatus.direction === "asc") return " ↑";
            if (sortStatus.direction === "desc") return " ↓";
        }
        return null;
    };

    return (
        <table className="w-full text-sm text-center rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort("items.name")}>
                            Name {getSortIndicator("items.name")}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort("stock.amount")}>
                            Amount {getSortIndicator("stock.amount")}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort("stock.import_datetime")}>
                            Import Time {getSortIndicator("stock.import_datetime")}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort("stock.exp_datetime")}>
                            Exp Time {getSortIndicator("stock.exp_datetime")}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort("stock.lot")}>
                            Lot {getSortIndicator("stock.lot")}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <button onClick={() => onSort("stock.note")}>
                            Note {getSortIndicator("stock.note")}
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={index} className="bg-white">
                        <td className="px-6 py-4">{product.items.name}</td>
                        <td className="px-6 py-4">{product.stock.amount}</td>
                        <td className="px-6 py-4">
                            {formatDate(product.stock.import_datetime, "yyyy-MM-dd")}
                        </td>
                        <td className="px-6 py-4">
                            {formatDate(product.stock.exp_datetime, "HH:mm:ss")}
                        </td>
                        <td className="px-6 py-4">{product.stock.lot}</td>
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
