import React from "react";

const Loader = ({ height = "100%", width = "100%" }) => {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height, width }}
    >
      <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
