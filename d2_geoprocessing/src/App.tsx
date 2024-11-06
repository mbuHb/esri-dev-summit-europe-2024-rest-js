import { useEffect, useState } from "react";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { GeoprocessingForm } from "./components/GeoprocessingForm";
import { Outlet, Route, Routes } from "react-router-dom";
import Authenticate from "./components/Authenticate";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";
import { CalciteButton } from "@esri/calcite-components-react";

import "./style/core.css";

defineCustomElements(window, {
  resourcesUrl: "https://js.arcgis.com/calcite-components/2.13.0/assets",
});

const App: React.FC = () => {

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check if there is a session in local storage
    const serializedSession = localStorage.getItem("__ARCGIS_REST_USER_SESSION__");
    if (serializedSession) {
        // Set up the session if it exists from local storage object
        setSession(ArcGISIdentityManager.deserialize(serializedSession))
    }
  }, [])

  const signIn = () => {
    // Begin the OAuth2 process
    ArcGISIdentityManager.beginOAuth2({
        clientId: import.meta.env.VITE_CLIENT_ID,
        portal: `${import.meta.env.VITE_PORTAL_URL}/sharing/rest`,
        popup: true,
        redirectUri: window.location.origin + "/authenticate",
    })?.then((sessionInfo) => {
        // Store the session in local storage and set the session state when beginOAuth2 resolves
        localStorage.setItem("__ARCGIS_REST_USER_SESSION__", JSON.stringify(sessionInfo));
        setSession(sessionInfo);
    });
  };

  const signOut = () => {
    // Sign out the user by removing the session from local storage and deleting the session state
    localStorage.removeItem("__ARCGIS_REST_USER_SESSION__");
    setSession(null);
  };


  const Layout = () => {
    return (
        <div className="container mx-auto">
   
          {/* An <Outlet> renders whatever child route is currently active,
              so you can think about this <Outlet> as a placeholder for
              the child routes we defined above. */}
          <Outlet />
        </div>
    )
 }

  return <div className="container mx-auto">
    <div>
    {
        session ? (
          <div>
              <div className="my-2 flex justify-between">
                  <div className="text-2xl">Welcome, {session.username}</div>
                  <CalciteButton onClick={signOut}>Sign out</CalciteButton>
              </div>
          </div>

        ) : (
          <div>
            <div className="my-2 flex justify-center">
              <CalciteButton onClick={signIn}>Sign In with ArcGIS</CalciteButton>
            </div>
          </div>
        )
    }
    </div>
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GeoprocessingForm authentication={session} />} />
        </Route>
        <Route path="/authenticate" element={<Authenticate />} />
    </Routes>

  </div>
};

export default App;
