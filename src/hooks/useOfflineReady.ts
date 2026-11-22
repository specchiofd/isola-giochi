"use client";

import { useEffect, useState } from "react";

export type OfflineStatus =
  | "unsupported"
  | "registering"
  | "ready"
  | "error";

export const useOfflineReady = () => {
  const [status, setStatus] = useState<OfflineStatus>("registering");

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker.ready
        .then(() => setStatus("ready"))
        .catch(() => setStatus("error"));
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    return () => window.removeEventListener("load", onLoad);
  }, []);

  return status;
};