import { useState, useEffect } from "react";
import TokenSelector from "./TokenSelector";
import PropTypes from "prop-types";
import "./SwapForm.css";
import TokenInput from "./TokenInput";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  IconButton,
  Snackbar,
  SnackbarContent,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

function SwapForm({ tokenPrices }) {
  // handling token selections and calculations
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [amount, setAmount] = useState("");
  const [estimatedReceive, setEstimatedReceive] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSelecting, setIsSelecting] = useState(null);

  // snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // dialog state
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    updateValues(amount, true);
  }, [fromToken, toToken]);

  const getTokenPrice = (tokenSymbol) => {
    const token = tokenPrices.find(
      (priceData) =>
        priceData.currency.toUpperCase() === tokenSymbol.toUpperCase()
    );
    return token ? token.price : null;
  };

  const updateValues = (newAmount, updateAmount = true) => {
    setErrorMessage(""); // reset error message

    if (fromToken && toToken) {
      const fromPrice = getTokenPrice(fromToken.symbol);
      const toPrice = getTokenPrice(toToken.symbol);

      if (!fromPrice || !toPrice) {
        setEstimatedReceive(null);
        setAmount("");
        setErrorMessage(
          !fromPrice
            ? `No price available for ${fromToken.symbol}`
            : `No price available for ${toToken.symbol}`
        );
        return;
      }

      if (updateAmount) {
        setAmount(newAmount);
        setEstimatedReceive((newAmount * fromPrice) / toPrice);
      } else {
        setEstimatedReceive(newAmount);
        setAmount((newAmount * toPrice) / fromPrice);
      }
    }
  };

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    updateValues(value, true);
  };

  const handleToAmountChange = (e) => {
    const value = e.target.value;
    updateValues(value, false);
  };

  /* swap */
  const handleSwap = () => {
    if (!fromToken || !toToken) return; // only allow swapping if both tokens selected
    setOpenDialog(true); // show confirmation dialog
  };

  const confirmSwap = () => {
    // swap the tokens and reset the amount
    setOpenDialog(false); // close the confirmation dialog
    setOpenSnackbar(true); // show the snackbar after swap
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <div className="swap-form">
      <text className="label">Sell</text>
      <TokenInput
        token={fromToken}
        amount={amount}
        onAmountChange={handleFromAmountChange}
        onSelectToken={() => setIsSelecting("from")}
        placeholder="Amount to sell"
      />

      {/* switch icon (between tokens) */}
      <div className="switch-icon-container">
        <IconButton
          onClick={() => {
            if (!fromToken || !toToken) return; // don't switch if tokens are not selected
            setFromToken(toToken);
            setToToken(fromToken);
            updateValues(amount, true); // recalculate values after switching tokens
          }}
          disabled={!fromToken || !toToken}
        >
          <SwapVertIcon fontSize="large" />
        </IconButton>
      </div>

      <text className="label">Buy</text>
      <TokenInput
        token={toToken}
        amount={estimatedReceive}
        onAmountChange={handleToAmountChange}
        onSelectToken={() => setIsSelecting("to")}
        placeholder="Estimated Receive"
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* swap button */}
      <button
        className="swap-button"
        disabled={!fromToken || !toToken || !amount}
        onClick={handleSwap} // opens confirmation dialog
      >
        SWAP
      </button>

      {isSelecting && (
        <TokenSelector
          isOpen={true}
          onClose={() => setIsSelecting(null)}
          onSelect={(token) => {
            if (isSelecting === "from") {
              setFromToken(token);
            } else {
              setToToken(token);
            }
            setIsSelecting(null);
          }}
        />
      )}

      {/* confirmation dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Swap</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to swap {fromToken?.symbol} for{" "}
            {toToken?.symbol}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmSwap}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* snack bar showing successful swap */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          message="Swap successful!"
          sx={{
            backgroundColor: "green",
            color: "white",
          }}
        />
      </Snackbar>
    </div>
  );
}

SwapForm.propTypes = {
  tokenPrices: PropTypes.arrayOf(
    PropTypes.shape({
      currency: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SwapForm;
