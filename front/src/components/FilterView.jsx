import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        height: "75%",
                    },
                },
            },
        },
    },
});

const Filter = ({ items, onFilter }) => {
    const [selectedName, setSelectedName] = useState("");
    const [selectedImportTime, setSelectedImportTime] = useState(null);
    const [selectedExpTime, setSelectedExpTime] = useState(null);
    const [selectedLot, setSelectedLot] = useState("");

    const handleApplyFilter = () => {
        const filterData = {
            ...(selectedName && { name: selectedName }),
            ...(selectedImportTime && { import_datetime: new Date(selectedImportTime).toISOString() }),
            ...(selectedExpTime && { exp_datetime: new Date(selectedExpTime).toISOString() }),
            ...(selectedLot && { lot: Number(selectedLot) }),
        };
        onFilter(filterData);
    };

    return (
        <div className="w-full">
            <div className="bg-white p-4 shadow-sm">
                <div className="mt-8 flex justify-center space-x-4">
                    <div className="w-80 flex flex-col">
                        <label
                            htmlFor="name"
                            className="text-stone-600 text-sm font-medium"
                        >
                            Name
                        </label>
                        <select
                            id="name"
                            className="appearance-none mt-2 block w-full rounded-md border border-gray-300 px-2 py-2 shadow-sm focus:outline-none"
                            value={selectedName}
                            onChange={(e) => setSelectedName(e.target.value)}
                        >
                            <option value="">กรุณาเลือก</option>
                            {items.map((item, index) => (
                                <option
                                    key={index}
                                    value={item.value || item.name}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ThemeProvider theme={theme}>
                        <div className="w-80 flex flex-col">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <label
                                    htmlFor="import-time"
                                    className="text-stone-600 text-sm font-medium mb-2"
                                >
                                    Import Time
                                </label>
                                <MobileDateTimePicker
                                    value={selectedImportTime}
                                    onChange={(newValue) =>
                                        setSelectedImportTime(newValue)
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </LocalizationProvider>
                        </div>
                    </ThemeProvider>

                    <ThemeProvider theme={theme}>
                        <div className="w-80 flex flex-col">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <label
                                    htmlFor="exp-time"
                                    className="text-stone-600 text-sm font-medium mb-2"
                                >
                                    Expired Time
                                </label>
                                <MobileDateTimePicker
                                    value={selectedExpTime}
                                    onChange={(newValue) =>
                                        setSelectedExpTime(newValue)
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </LocalizationProvider>
                        </div>
                    </ThemeProvider>

                    <div className="w-80 flex flex-col">
                        <label
                            htmlFor="lot"
                            className="text-stone-600 text-sm font-medium"
                        >
                            Lot
                        </label>
                        <input
                            type="number"
                            id="lot"
                            className="mt-2 block w-full rounded-md border border-gray-300 px-2 py-2 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            placeholder="Enter Lot Number"
                            value={selectedLot}
                            onChange={(e) => setSelectedLot(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "-") {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    <button
                        className="mt-3 text-black rounded-md py-2"
                        onClick={handleApplyFilter}
                    >
                        <svg
                            className="w-6 h-6 text-black"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filter;
