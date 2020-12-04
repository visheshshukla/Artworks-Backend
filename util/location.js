const axios = require('axios');

const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX}`
  );

  const data = response.data;

  if (!data || response.status !== 200) {
    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    throw error;
  }

  const [longitude,latitude] = data.features[0].center;

  const coordinates = {
      lat: latitude,
      lng: longitude
  }

  return coordinates;
}

module.exports = getCoordsForAddress;