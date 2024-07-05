import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SE = import.meta.env.VITE_CLIENT_SE;
const REFRESH_TOKEN = import.meta.env.VITE_REFRESH_TOKEN;
let accessToken = import.meta.env.VITE_ACCESS_TOKEN;

console.log(CLIENT_ID)
console.log(CLIENT_SE)
console.log(REFRESH_TOKEN)
console.log(accessToken)

const getAccessToken = async () => {
	try {
		const response = await axios.post(
			'https://api.dropbox.com/oauth2/token',
			null,
			{
				params: {
					grant_type: 'refresh_token',
					refresh_token: REFRESH_TOKEN,
					client_id: CLIENT_ID,
					client_secret: CLIENT_SE,
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
		accessToken = response.data.access_token;
		return accessToken;
	} catch (error) {
		console.error('Error refreshing access token', error);
		throw error;
	}
};

export { getAccessToken };