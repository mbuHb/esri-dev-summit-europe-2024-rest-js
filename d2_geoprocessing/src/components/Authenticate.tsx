// src/Authenticate.tsx
import React, { useEffect, useRef } from "react";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

const Authenticate: React.FC = () => {
  const effectRan = useRef(false);
  
  useEffect(() => {
    if (effectRan.current) return;

    ArcGISIdentityManager.completeOAuth2({
      clientId: import.meta.env.VITE_CLIENT_ID,
      redirectUri: window.location.origin + "/authenticate",
      portal: `${import.meta.env.VITE_PORTAL_URL}/sharing/rest`,
      popup: true,
    })
    .then((session) => {
      console.log("OAuth callback complete", session);
    })
    .catch((error) => {
      console.error("Error completing OAuth callback", error);
    });
    
    effectRan.current = true;
  }, []);

  return <div>Loading...</div>;
};

export default Authenticate;
