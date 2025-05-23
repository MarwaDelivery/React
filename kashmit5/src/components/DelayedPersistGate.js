import React, { useEffect, useState } from "react";
import { PersistGate } from "redux-persist/integration/react";

const DelayedPersistGate = ({ children, persistor, delay = 2000 }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [persistorDone, setPersistorDone] = useState(false);

  // After delay, hide loader if persistor is done
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Called by PersistGate when hydration is finished
  const onBeforeLift = () => {
    setPersistorDone(true);
  };

  const loadingUI = (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
      }}
    >
      <img
        src="/loading.gif"
        alt="Loading..."
        style={{ width: "150px", height: "150px" }}
      />
    </div>
  );

  // Show loader if either delay time not passed OR persistor still loading
  const shouldShowLoader = showLoader || !persistorDone;

  return (
    <PersistGate loading={shouldShowLoader ? loadingUI : null} persistor={persistor} onBeforeLift={onBeforeLift}>
      {children}
    </PersistGate>
  );
};

export default DelayedPersistGate;
