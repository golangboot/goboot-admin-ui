import config from "@/config"
import http from "@/utils/request"

export default {
	info: {
		url: `${config.API_URL}/app/site/info`,
		name: "网站信息",
		get: async function () {
			return await http.get(this.url);
		}
	},
}
