import React, { useState, useEffect } from "react";

const Motion = ({ children, initial, animate, transition, className }) => {
  const [style, setStyle] = useState(initial);

  useEffect(() => {
    setStyle(animate);
  }, [animate]);

  return (
    <li
      style={{
        ...style,
        transition: `left ${
          transition.type === "spring" ? "0.3s" : "0s"
        } ease-out, width ${
          transition.type === "spring" ? "0.3s" : "0s"
        } ease-out`,
        position: "absolute",
      }}
      className={className}
    >
      {children}
    </li>
  );
};

export default Motion;
