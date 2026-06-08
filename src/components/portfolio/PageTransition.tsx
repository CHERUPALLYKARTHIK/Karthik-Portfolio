import { useEffect, useState } from "react";

export function PageTransition() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <>
      <div className="page-layer green-layer" />
      <div className="page-layer dark-layer" />
    </>
  );
}
