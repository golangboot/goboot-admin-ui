import config from "@/config"
import http from "@/utils/request"

export default {
	version: {
		url: `${config.API_URL}/app`,
		name: "版本信息",
		get: async function(){
			return await http.get(this.url);
		}
	},
	department: {
		tree: {
			url: `${config.API_URL}/system/department/tree`,
			name: "树型列表",
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
		detail: {
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
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	position: {
		list: {
			url: `${config.API_URL}/system/position`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/position`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/system/position`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/position`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/position`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	menu: {
		tree: {
			url: `${config.API_URL}/system/menu/tree`,
			name: "树型列表",
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
		detail: {
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
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		sync: {
			url: `${config.API_URL}/system/menu/sync`,
			name: "同步",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		export: {
			url: `${config.API_URL}/system/menu/export`,
			name: "导出附件",
			get: async function(data, config={}){
				return await http.get(this.url, data, config);
			}
		},
		import: {
			url: `${config.API_URL}/system/menu/import`,
			name: "导入附件",
			post: async function(data, config={}){
				return await http.post(this.url, data, config);
			}
		},
	},
	dict: {
		tree: {
			url: `${config.API_URL}/system/dict/tree`,
			name: "树型列表",
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
		detail: {
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
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	config: {
		tree: {
			url: `${config.API_URL}/system/config/tree`,
			name: "树型列表",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/config`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/system/config`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/system/config`,
			name: "详情",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/system/config`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/system/config`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
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
		detail: {
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
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		sync: {
			url: `${config.API_URL}/system/role/sync`,
			name: "同步",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		getPermissionIdListByRoleId: {
			url: `${config.API_URL}/system/role/getPermissionIdListByRoleId`,
			name: "根据角色ID获取权限ID列表",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		assignPermission: {
			url: `${config.API_URL}/system/role/assignPermission`,
			name: "分配权限",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		getMenuIdListByRoleId: {
			url: `${config.API_URL}/system/role/getMenuIdListByRoleId`,
			name: "根据角色ID获取菜单ID列表",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		assignMenu: {
			url: `${config.API_URL}/system/role/assignMenu`,
			name: "分配菜单",
			post: async function(data){
				return await http.post(this.url, data);
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
		detail: {
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
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		tree: {
			url: `${config.API_URL}/system/permission/tree`,
			name: "树型列表",
			get: async function(){
				return await http.get(this.url);
			}
		},
		sync: {
			url: `${config.API_URL}/system/permission/sync`,
			name: "同步",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
	},
	user: {
		list: {
			url: `${config.API_URL}/user/user`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/user/user`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/user/user`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/user/user`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/user/user`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		assignGroups: {
			url: `${config.API_URL}/user/user/assignGroups`,
			name: "分配用户组",
			post: async function(data){
				return await http.post(`${this.url}`, data);
			}
		},
		assignRoles: {
			url: `${config.API_URL}/user/user/assignRoles`,
			name: "分配角色",
			post: async function(data){
				return await http.post(`${this.url}`, data);
			}
		},
		assignDepartments: {
			url: `${config.API_URL}/user/user/assignDepartments`,
			name: "分配部门",
			post: async function(data){
				return await http.post(`${this.url}`, data);
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
