import config from "@/config"
import http from "@/utils/request"

export default {
	getUserInfo: {
		url: `${config.API_URL}/user/getUserInfo`,
		name: "获取用户信息",
		get: async function(params){
			return await http.get(this.url, params);
		}
	},
	setUserInfo: {
		url: `${config.API_URL}/user/setUserInfo`,
		name: "设置用户信息",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
	list: {
		url: `${config.API_URL}/api/user/list`,
		name: "用户列表",
		get: async function(params){
			return await http.get(this.url, params);
		}
	},
}
