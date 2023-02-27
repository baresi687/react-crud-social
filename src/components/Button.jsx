function Button({ color, type, onClick, children }) {
  const btnStyling = {
    backgroundColor: color,
  };

  return (
    <>
      <button type={type} style={btnStyling} onClick={onClick}>
        {children}
      </button>
    </>
  );
}

export default Button;
