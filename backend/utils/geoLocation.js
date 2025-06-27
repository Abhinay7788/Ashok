const fetch = require('node-fetch');
module.exports = async (lat, lon) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  const data = await res.json();
  return data.address;
};