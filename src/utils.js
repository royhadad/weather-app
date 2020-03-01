const request = require('request');
const inverseString = (str) => {
    return str.split('').reverse().join('')
};
const getGeoCode = (searchText, callback) => {
    const genericLocationError = 'location not found';
    const mapBoxURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=pk.eyJ1Ijoicm95aGFkYWQ5OCIsImEiOiJjazczMnc3NDcwN3h4M2htbmtrbWJrZWdtIn0.a8Vl295XiruKmJtc9XbltA&limit=1`;
    request({ url: mapBoxURL, json: true }, (err, res) => {
        if (err) {
            callback(genericWeatherError);
        } else if (!res.body.features[0]) {
            callback(genericLocationError);
        } else {
            const place = res.body.features[0];
            const longitude = place.center[0];
            const latitude = place.center[1];
            callback(undefined, { geoCode: { longitude, latitude }, location: res.body.features[0].place_name });
        }
    });
};
const getWeatherByGeoCode = (geoCode, callback) => {
    const genericWeatherError = 'Unable to get weather';
    const darkSkyURL = `https://api.darksky.net/forecast/ba0ef3badd9c4df8eed82892a8272151/${geoCode.latitude},${geoCode.longitude}?units=si&lang=en`;
    request({ url: darkSkyURL, json: true }, (err, res) => {
        if (err) {
            callback(genericWeatherError);
        } else if (res.body.error) {
            callback(res.body.error);
        } else {
            const dataForToday = res.body.daily.data[0];
            callback(undefined, { summary: dataForToday.summary + ` it is currently ${res.body.currently.temperature} degrees out, there is a ${res.body.currently.precipProbability}% chance of rain.` });
        }
    });

};
const getWeather = (searchText, callback) => {
    getGeoCode(searchText, (err, geoCodeRes) => {
        if (err) {
            callback(err);
        } else {
            getWeatherByGeoCode(geoCodeRes.geoCode, (err, weatherRes) => {
                if (err) {
                    callback(err);
                } else {
                    callback(undefined, { summary: weatherRes.summary, location: geoCodeRes.location });
                }
            });
        }
    });
};
module.exports = { inverseString, getGeoCode, getWeatherByGeoCode, getWeather }