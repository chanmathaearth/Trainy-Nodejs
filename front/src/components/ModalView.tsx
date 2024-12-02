import React, { FC } from "react";

interface Stock {
    note: string;
}

interface Product {
    stock: Stock;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold">Note</h2>
                    <button onClick={onClose}>
                        <svg
                            className="w-6 h-6 text-red-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                d="M6 18 17.94 6M18 18 6.06 6"
                            />
                        </svg>
                    </button>
                </div>
                <textarea
                    className="w-full mt-4 p-2 border rounded-md shadow-sm focus:outline-none"
                    value={product.stock.note}
                    readOnly
                    rows={5}
                />
            </div>
        </div>
    );
};

export default Modal;
