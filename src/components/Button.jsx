function Button({ color, type, onClick, dataId, dataTitle, dataBody, dataMedia, dataTags, children }) {
  const btnStyling = {
    backgroundColor: color,
  };

  return (
    <>
      <button
        type={type}
        style={btnStyling}
        data-id={dataId}
        data-title={dataTitle}
        data-body={dataBody}
        data-media={dataMedia}
        data-tags={dataTags}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
