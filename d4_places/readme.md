https://developers.arcgis.com/openlayers/places/find-places-nearby/

```js

    function showPlaces() {
        // Transform user location to WGS84 spatial reference
        const lngLat = ol.proj.transform(userLocation, "EPSG:3857", "EPSG:4326");

        // Find POIs near selected point by selected category
        arcgisRest.findPlacesNearPoint({
            x: lngLat[0],
            y: lngLat[1],
            categoryIds: activeCategory,
            radius: searchRadius,
            authentication
        })
        .then((response)=>{
            placesLayer.getSource().clear();
            resultList.innerHTML = "";

            const places = [];
            response.results.forEach((result)=>{
                const location = ol.proj.transform(
                    [result.location.x,result.location.y],
                    "EPSG:4326",
                    "EPSG:3857"
                );
                const marker = new ol.Feature({
                    geometry: new ol.geom.Point(location),
                    name: result.name,
                    id: result.placeId,
                    category: result.categories[0].label,
                    distance: (result.distance / 1000).toFixed(1)
                });
                places.push(marker);
                addToList(marker);
            });

            const source = new ol.source.Vector({features: places});
            placesLayer.setSource(source)

        });
    };

```