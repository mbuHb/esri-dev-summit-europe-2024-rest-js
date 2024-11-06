Live from https://developers.arcgis.com/esri-leaflet/route-and-directions/find-a-route-and-directions/

```js
arcgisRest
  .solveRoute({
    stops: [startCoords, endCoords],
    endpoint: solveRouteUrl,
    authentication,
  })
  .then((response) => {
    // Clear the previous results
    routeLines.clearLayers();

    // Add the route to the map
    L.geoJSON(response.routes.geoJson).addTo(routeLines);

    // Display the directions
    const directionsHTML = response.directions[0].features
      .map((f) => f.attributes.text)
      .join("<br/>");
    directions.innerHTML = directionsHTML;
    startCoords = null;
    endCoords = null;
  })
  .catch((error) => {
    console.error(error);
    alert(
      "There was a problem using the route service. See the console for details."
    );
  });
```
