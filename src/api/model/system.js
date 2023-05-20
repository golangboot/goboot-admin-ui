import config from "@/config"
import http from "@/utils/request"

export default {
	version: {
		url: `${config.API_URL}/common/app`,
		name: "版本信息",
		get: async function(){
			return await http.get(this.url);
		}
	},
	department: {
		tree: {
			url: `${config.API_URL}/sys/department/tree`,
			name: "树型列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		list: {
			url: `${config.API_URL}/sys/department`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/department`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/department`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/department`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/department`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	position: {
		list: {
			url: `${config.API_URL}/sys/position`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/position`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/position`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/position`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/position`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	menu: {
		tree: {
			url: `${config.API_URL}/sys/menu/tree`,
			name: "树型列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		list: {
			url: `${config.API_URL}/sys/menu`,
			name: "获取",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/menu`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/menu`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/menu`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/menu`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		sync: {
			url: `${config.API_URL}/sys/menu/sync`,
			name: "同步",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		export: {
			url: `${config.API_URL}/sys/menu/export`,
			name: "导出附件",
			get: async function(data, config={}){
				return await http.get(this.url, data, config);
			}
		},
		import: {
			url: `${config.API_URL}/sys/menu/import`,
			name: "导入附件",
			post: async function(data, config={}){
				return await http.post(this.url, data, config);
			}
		},
	},
	dict: {
		list: {
			url: `${config.API_URL}/sys/dict`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/dict`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/dict`,
			name: "详情",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/dict`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/dict`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		tree: {
			url: `${config.API_URL}/sys/dict/tree`,
			name: "树型列表",
			get: async function(){
				return await http.get(this.url);
			}
		},
		getDictItemList: {
			url: `${config.API_URL}/sys/dict/getDictList`,
			name: "获取字典列表子类",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		getDictType: {
			url: `${config.API_URL}/sys/dict/getDictType`,
			name: "获取字典类型",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
	},
	config: {
		tree: {
			url: `${config.API_URL}/sys/config/tree`,
			name: "树型列表",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/sys/config`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/config`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/config`,
			name: "详情",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/config`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/config`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	role: {
		list: {
			url: `${config.API_URL}/sys/role`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/role`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/role`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/role`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/role`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		sync: {
			url: `${config.API_URL}/sys/role/sync`,
			name: "同步",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		getPermissionIdListByRoleId: {
			url: `${config.API_URL}/sys/role/getPermissionIdListByRoleId`,
			name: "根据角色ID获取权限ID列表",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		assignPermission: {
			url: `${config.API_URL}/sys/role/assignPermission`,
			name: "分配权限",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		getMenuIdListByRoleId: {
			url: `${config.API_URL}/sys/role/getMenuIdListByRoleId`,
			name: "根据角色ID获取菜单ID列表",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		assignMenu: {
			url: `${config.API_URL}/sys/role/assignMenu`,
			name: "分配菜单",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
	},
	permission: {
		list: {
			url: `${config.API_URL}/sys/permission`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/permission`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/permission`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/permission`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/permission`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		tree: {
			url: `${config.API_URL}/sys/permission/tree`,
			name: "树型列表",
			get: async function(){
				return await http.get(this.url);
			}
		},
		sync: {
			url: `${config.API_URL}/sys/permission/sync`,
			name: "同步",
			post: async function(data){
				return await http.post(this.url, data);
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
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		assignGroups: {
			url: `${config.API_URL}/user/assignGroups`,
			name: "分配用户组",
			post: async function(data){
				return await http.post(`${this.url}`, data);
			}
		},
		assignRoles: {
			url: `${config.API_URL}/user/assignRoles`,
			name: "分配角色",
			post: async function(data){
				return await http.post(`${this.url}`, data);
			}
		},
		assignDepartments: {
			url: `${config.API_URL}/user/assignDepartments`,
			name: "分配部门",
			post: async function(data){
				return await http.post(`${this.url}`, data);
			}
		},
	},
	setting: {
		list: {
			url: `${config.API_URL}/sys/setting`,
			name: "列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		update: {
			url: `${config.API_URL}/sys/setting`,
			name: "修改",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
	},
	route: {
		list: {
			url: `${config.API_URL}/sys/route/list`,
			name: "列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
	},
	log: {
		list: {
			url: `${config.API_URL}/sys/log`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/log`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/log`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/log`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/log`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	notice: {
		list: {
			url: `${config.API_URL}/sys/notice`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/notice`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/notice`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/notice`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/notice`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	area: {
		list: {
			url: `${config.API_URL}/sys/area`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/sys/area`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/sys/area`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/sys/area`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/sys/area`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		tree: {
			url: `${config.API_URL}/sys/area/tree`,
			name: "树型列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
	},
	app: {
		list: {
			url: `${config.API_URL}/sys/app`,
			name: "应用列表",
			get: async function(){
				return await http.get(this.url);
			}
		}
	},
	table: {
		list: {
			url: `${config.API_URL}/sys/table`,
			name: "表格列管理列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		info: {
			url: `${config.API_URL}/sys/table/info`,
			name: "表格列管理详情",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	tasks: {
		list: {
			url: `${config.API_URL}/sys/tasks`,
			name: "系统任务管理",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
