import config from "@/config"
import http from "@/utils/request"

export default {
	menu: {
		myMenus: {
			// url: `${config.API_URL}/system/menu/my/1.6.1`,
			url: `${config.API_URL}/system/menu/myMenus`,
			name: "获取我的菜单",
			get: async function(){
				return await http.get(this.url);
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
				return await http.put(`${this.url}/${data.id}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/menu`,
			name: "删除菜单",
			delete: async function(data){
				return await http.delete(`${this.url}/${data.id}`, data);
			}
		},
		batchDelete: {
			url: `${config.API_URL}/system/menu/batchDelete`,
			name: "删除菜单",
			delete: async function(data){
				return await http.delete(`${this.url}`, data);
			}
		},
	},
	dic: {
		tree: {
			url: `${config.API_URL}/system/dic/tree`,
			name: "获取字典树",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/dic/list`,
			name: "字典明细",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/system/dic/get`,
			name: "获取字典数据",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	role: {
		list: {
			url: `${config.API_URL}/system/role/list`,
			name: "获取角色列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
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
