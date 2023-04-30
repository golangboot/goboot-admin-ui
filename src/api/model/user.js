import config from "@/config"
import http from "@/utils/request"
import tool from "@/utils/tool";

export default {
	userCenter:{
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
	},
	user: {
		list: {
			url: `${config.API_URL}/user`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/user`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/user`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/user`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/user`,
			name: "删除",
			delete: async function(data){
				/*let id = data.id;
				if (data.ids) {
					id = data.ids.join(',');
				}*/
				/*let id = data.id;
				if (data.ids) {
					let idSet = new Set(data.ids);
					idSet.add(id);
					id = Array.from(idSet).join(',');
				}*/
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		changeAccount: {
			url: `${config.API_URL}/user/changeAccount`,
			name: "账户",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
	},
	userGroup: {
		list: {
			url: `${config.API_URL}/user/userGroup`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/user/userGroup`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/user/userGroup`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/user/userGroup`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/user/userGroup`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	userLevel: {
		list: {
			url: `${config.API_URL}/user/userLevel`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/user/userLevel`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/user/userLevel`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/user/userLevel`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/user/userLevel`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	userLabel: {
		list: {
			url: `${config.API_URL}/user/userLabel`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/user/userLabel`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/user/userLabel`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/user/userLabel`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/user/userLabel`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
}
