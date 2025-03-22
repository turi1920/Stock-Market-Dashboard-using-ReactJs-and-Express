import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [stockData, setStockData] = useState(null);
  const [filteredStockData, setFilteredStockData] = useState(null);
  const [stockSymbol, setStockSymbol] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("stockData", (data) => {
      setStockData(data);

      // Apply filter if search input is not empty
      if (stockSymbol) {
        const filteredData = Object.entries(data).filter(([symbol]) =>
          symbol.includes(stockSymbol)
        );
        setFilteredStockData(Object.fromEntries(filteredData));
      } else {
        setFilteredStockData(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [stockSymbol]);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setStockSymbol(value);

    if (value && stockData) {
      const filteredData = Object.entries(stockData).filter(([symbol]) =>
        symbol.includes(value)
      );
      setFilteredStockData(Object.fromEntries(filteredData));
    } else {
      setFilteredStockData(stockData);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (stockSymbol && !searchHistory.includes(stockSymbol)) {
      setSearchHistory([...searchHistory, stockSymbol]);
    }
  };

  return (
    <div className="container text-center py-4" style={{ fontFamily: "Roboto, sans-serif" }}>
      <h1 className="text-primary mb-4">Stock Market Dashboard</h1>

      {/* Input Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Stock Symbol"
            value={stockSymbol}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </div>
      </form>

      {/* Display Search History */}
      <div className="mb-4">
        <h5>Search History:</h5>
        <ul className="list-group">
          {searchHistory.map((symbol, index) => (
            <li key={index} className="list-group-item">
              {symbol}
            </li>
          ))}
        </ul>
      </div>

      {/* Display Stock Data */}
      {filteredStockData ? (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Stock Symbol</th>
              <th>Price (USD)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredStockData).map(([symbol, price]) => (
              <tr key={symbol}>
                <td>{symbol}</td>
                <td>${price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">Loading stock data...</p>
      )}
    </div>
  );
};

export default Dashboard;
