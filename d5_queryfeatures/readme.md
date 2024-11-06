https://developers.arcgis.com/maplibre-gl-js/query-and-edit/query-a-feature-layer-spatial/

```js

function executeQuery(geometry, geometryType) {
    
    arcgisRest
    .queryFeatures({
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/LA_County_Parcels/FeatureServer/0",
        geometry: geometry,
        geometryType: geometryType,
        spatialRel: "esriSpatialRelIntersects",
        f: "geojson",
        returnGeometry: true,
        outFields: ["APN", "UseType", "TaxRateCity", " Roll_LandValue"]
    });

}

```