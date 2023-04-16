import config from "@/config"
import http from "@/utils/request"

export default {
	department: {
		tree: {
			url: `${config.API_URL}/system/department/tree`,
			name: "列表树",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		list: {
			url: `${config.API_URL}/system/department`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/department`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/department`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/department`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/department`,
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
	menu: {
		tree: {
			url: `${config.API_URL}/system/menu/tree`,
			name: "列表树",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		list: {
			url: `${config.API_URL}/system/menu`,
			name: "获取",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/menu`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/menu`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/menu`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/menu`,
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
	dict: {
		tree: {
			url: `${config.API_URL}/system/dict/tree`,
			name: "列表树",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/dict`,
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
	role: {
		list: {
			url: `${config.API_URL}/system/role`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/role`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/role`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/role`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/role`,
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
	permission: {
		list: {
			url: `${config.API_URL}/system/permission`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/permission`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/permission`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/permission`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/permission`,
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
	dept: {
		tree: {
			url: `${config.API_URL}/system/department/tree`,
			name: "列表树",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		list: {
			url: `${config.API_URL}/system/department`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/department`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/department`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/department`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/department`,
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
	user: {
		list: {
			url: `${config.API_URL}/system/user`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/user`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		show: {
			url: `${config.API_URL}/system/user`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/user`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/user`,
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
	app: {
		list: {
			url: `${config.API_URL}/system/app`,
			name: "应用列表",
			get: async function(){
				return await http.get(this.url);
			}
		}
	},
	log: {
		list: {
			url: `${config.API_URL}/system/log`,
			name: "日志列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	table: {
		list: {
			url: `${config.API_URL}/system/table`,
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
			url: `${config.API_URL}/system/tasks`,
			name: "系统任务管理",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
