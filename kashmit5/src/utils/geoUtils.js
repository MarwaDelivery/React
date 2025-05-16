const toRadians = (degree) => {
	return (degree * Math.PI) / 180;
};
export const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
	const earthRadius = 6378137.0;
	const startLatitude = lat1;
	const endLatitude = lat2;
	const startLongitude = lon1;
	const endLongitude = lon2;
	const dLat = toRadians(endLatitude - startLatitude);
	const dLon = toRadians(endLongitude - startLongitude);

	const a =
		Math.pow(Math.sin(dLat / 2), 2) +
		Math.pow(Math.sin(dLon / 2), 2) *
		Math.cos(toRadians(startLatitude)) *
		Math.cos(toRadians(endLatitude));
	const c = 2 * Math.asin(Math.sqrt(a));

	return earthRadius * c;
};
