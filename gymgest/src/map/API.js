var geoTrack = null;


export function getLocation() {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }, () => {
      resolve(fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(location => {
          return {
            lat: location.latitude,
            lng: location.longitude
          };
        }));
    });
  });
}

export function startGeoJson(lat, lng) {
  geoTrack = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              lng,
              lat
            ],
            [
              lng,
              lat
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            lng,
            lat
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            lng,
            lat
          ]
        }
      }
    ]
  };

}

export function setGeoJson(lat, lng) {
  geoTrack.features[0].geometry.coordinates.push([lng, lat]);
  geoTrack.features[2].geometry.coordinates = [lng, lat];
}

export function getGeoJson() {
  return geoTrack;
}
