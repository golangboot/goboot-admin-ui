import config from "@/config"
import tool from '@/utils/tool';
import http from "@/utils/request"

export default {
	myMenus: {
		url: `${config.API_URL}/user/userCenter/myMenus`,
		name: "获取我的菜单",
		get: async function(){
			return await http.get(this.url);
		}
	},
	getUserInfo: {
		url: `${config.API_URL}/user/userCenter/getUserInfo`,
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
		url: `${config.API_URL}/user/userCenter/setUserInfo`,
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
	changePassword: {
		url: `${config.API_URL}/user/userCenter/changePassword`,
		name: "修改用户密码",
		post: async function(params){
			return await http.post(this.url, params)
		}
	},
	logRecord: {
		url: `${config.API_URL}/user/userCenter/logRecord`,
		name: "获取用户日志记录",
		get: async function(params){
			return await http.get(this.url, params)
		}
	},
	deleteLogRecord: {
		url: `${config.API_URL}/user/userCenter/logRecord`,
		name: "删除用户日志记录",
		delete: async function(data){
			return await http.delete(`${this.url}/${data.id}`, data)
		}
	},

}
