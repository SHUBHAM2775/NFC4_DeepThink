const fetch = require("node-fetch");

const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    address
  )}&format=json&limit=1`;

  const response = await fetch(url, {
    headers: { "User-Agent": "asha-app/1.0" },
  });

  const data = await response.json();

  if (!data.length) return null;

  const { lat, lon } = data[0];
  return [parseFloat(lon), parseFloat(lat)];
};

module.exports = { geocodeAddress };
