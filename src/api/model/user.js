import config from "@/config"
import tool from '@/utils/tool';
import http from "@/utils/request"

export default {
	getUserInfo: {
		url: `${config.API_URL}/user/getUserInfo`,
		name: "获取用户信息",
		get: async function(params){
			let res = await http.get(this.url, params)
			if (res.code == 200) {
				tool.data.set(config.DATA_CODE.USER_INFO, res.data)
			}
			return res;
		}
	},
	setUserInfo: {
		url: `${config.API_URL}/user/setUserInfo`,
		name: "设置用户信息",
		post: async function(params){
			let res = await http.post(this.url, params)
			// console.log('> setUserInfo:', res)
			if (res.code == 200) {
				tool.data.set(config.DATA_CODE.USER_INFO, res.data)
			}
			return res;
		}
	},
	changeUserPassword: {
		url: `${config.API_URL}/user/changeUserPassword`,
		name: "修改用户密码",
		post: async function(params){
			return await http.post(this.url, params)
		}
	},
	getLogRecord: {
		url: `${config.API_URL}/user/getLogRecord`,
		name: "获取用户日志记录",
		get: async function(params){
			return await http.get(this.url, params)
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
