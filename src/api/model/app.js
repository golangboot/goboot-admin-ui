import config from "@/config"
import http from "@/utils/request"

export default {
	info: {
		url: `${config.API_URL}/app/info`,
		name: "App信息",
		get: async function () {
			return await http.get(this.url);
		}
	},
	version: {
		url: `${config.API_URL}/app/info`,
		name: "App版本",
		get: async function () {
			return await http.get(this.url);
		}
	},
}
