https://developers.arcgis.com/cesiumjs/data-enrichment/query-demographic-data/

```js
// Function to get demographic data
function getDemographics(longitude, latitude) {
  // Query demographic global facts data
  arcgisRest
    .queryDemographicData({
      studyAreas: [{ geometry: { x: longitude, y: latitude } }],
      dataCollections: ["KeyGlobalFacts"], // https://developers.arcgis.com/documentation/mapping-and-location-services/data-enrichment/tools/data-collection-finder/
      authentication: authentication,
    })
    .then((response) => {
      // Set feature set from response
      const featureSet = response.results[0].value.FeatureSet;
      let message;

      // Set result data from first feature
      if (featureSet.length > 0 && featureSet[0].features.length > 0) {
        const attributes = featureSet[0].features[0].attributes;
        message =
          `<b>Data for a 1 mile search radius</b>` +
          [
            `<br>Population: ${attributes.TOTPOP}`,
            `Males: ${attributes.TOTMALES} `,
            `Females: ${attributes.TOTFEMALES}`,
            `Average Household Size: ${attributes.AVGHHSZ}`,
          ].join("<br>");
      } else {
        message = "Data not available for this location.";
      }
      // Show result in Cesium viewer
      let resultEntity = new Cesium.Entity({
        name: "Demographic results",
        description: message,
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
      });

      viewer.selectedEntity = resultEntity;
    });
}
```
