import { useState, useEffect } from "react";
import "./App.css";
import SwapForm from "./components/SwapForm";
function App() {
  const [tokenPrices, setTokenPrices] = useState([]);

  useEffect(() => {
    const fetchTokenPrices = async () => {
      try {
        const response = await fetch(
          "https://interview.switcheo.com/prices.json"
        );
        const data = await response.json();
        setTokenPrices(data);
      } catch (error) {
        console.error("Error fetching token prices:", error);
      }
    };

    fetchTokenPrices();
  }, []);

  return (
    <div className="container">
      <h1>CURRENCY SWAP</h1>
      <br />

      <SwapForm tokenPrices={tokenPrices} />
    </div>
  );
}

export default App;
