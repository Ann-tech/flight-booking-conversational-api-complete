function formatFlightData(flightData) {
    const { departureCity, arrivalCity, flightName } = flightData;

    if (flightName) flightData.flightName = flightName.toLowerCase().trim();
    if (departureCity) flightData.departureCity = departureCity.toLowerCase().trim();
    if (arrivalCity) flightData.arrivalCity = arrivalCity.toLowerCase().trim();

    return flightData;
}

module.exports = formatFlightData;