import PropTypes from "prop-types";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import "./SwapForm.css";

function TokenInput({
  token,
  amount,
  onAmountChange,
  onSelectToken,
  placeholder,
}) {
  return (
    <div className="input-group">
      <button onClick={onSelectToken} className="token-button">
        {token ? (
          <>
            <img src={token.icon} alt={token.symbol} className="token-icon" />
            {token.symbol}
          </>
        ) : (
          <>
            <HelpOutlinedIcon style={{ marginRight: 5, color: "gray" }} />
            Select Coin
          </>
        )}
      </button>
      <input
        type="number"
        value={amount || ""}
        onChange={onAmountChange}
        placeholder={placeholder}
      />
    </div>
  );
}

TokenInput.propTypes = {
  token: PropTypes.shape({
    symbol: PropTypes.string,
    icon: PropTypes.string,
  }),
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAmountChange: PropTypes.func.isRequired,
  onSelectToken: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default TokenInput;
