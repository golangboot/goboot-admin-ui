import config from "@/config"
import http from "@/utils/request"

export default {
	menu: {
		tree: {
			url: `${config.API_URL}/system/menu/tree`,
			name: "获取菜单树",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		list: {
			url: `${config.API_URL}/system/menu/list`,
			name: "获取菜单",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/menu`,
			name: "添加菜单",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/menu`,
			name: "查看菜单",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/menu`,
			name: "更新菜单",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/menu`,
			name: "删除菜单",
			delete: async function(data){
				let id = data.id;
				if (data.ids) {
					id = data.ids.join(',');
				}
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	dict: {
		tree: {
			url: `${config.API_URL}/system/dict/tree`,
			name: "列表树",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/dict/list`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/dict`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/dict`,
			name: "详情",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/dict`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/dict`,
			name: "删除",
			delete: async function(data){
				let id = data.id;
				if (data.ids) {
					id = data.ids.join(',');
				}
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	dictItem: {
		list: {
			url: `${config.API_URL}/system/dictItem/list`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/dictItem`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/dictItem`,
			name: "详情",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/dictItem`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/dictItem`,
			name: "删除",
			delete: async function(data){
				let id = data.id;
				if (data.ids) {
					id = data.ids.join(',');
				}
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	role: {
		list: {
			url: `${config.API_URL}/system/role/list`,
			name: "获取角色列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		add: {
			url: `${config.API_URL}/system/role`,
			name: "添加菜单",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/role`,
			name: "查看菜单",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/role`,
			name: "更新菜单",
			put: async function(data){
				return await http.put(`${this.url}/${data.id}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/role`,
			name: "删除菜单",
			delete: async function(data){
				let id = data.id;
				if (data.ids) {
					id = data.ids.join(',');
				}
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	dept: {
		list: {
			url: `${config.API_URL}/system/dept/list`,
			name: "获取部门列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	user: {
		list: {
			url: `${config.API_URL}/system/user/list`,
			name: "获取用户列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	app: {
		list: {
			url: `${config.API_URL}/system/app/list`,
			name: "应用列表",
			get: async function(){
				return await http.get(this.url);
			}
		}
	},
	log: {
		list: {
			url: `${config.API_URL}/system/log/list`,
			name: "日志列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	table: {
		list: {
			url: `${config.API_URL}/system/table/list`,
			name: "表格列管理列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		info: {
			url: `${config.API_URL}/system/table/info`,
			name: "表格列管理详情",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	tasks: {
		list: {
			url: `${config.API_URL}/system/tasks/list`,
			name: "系统任务管理",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
