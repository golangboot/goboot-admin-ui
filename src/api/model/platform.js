import config from "@/config"
import http from "@/utils/request"
import tool from "@/utils/tool";

export default {
	sys: {
		department: {
			tree: {
				url: `${config.API_URL}/platform/sys/department/tree`,
				name: "树型列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			list: {
				url: `${config.API_URL}/platform/sys/department`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/department`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/department`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/department`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/department`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		position: {
			list: {
				url: `${config.API_URL}/platform/sys/position`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/position`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/position`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/position`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/position`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		menu: {
			tree: {
				url: `${config.API_URL}/platform/sys/menu/tree`,
				name: "树型列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			list: {
				url: `${config.API_URL}/platform/sys/menu`,
				name: "获取",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/menu`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/menu`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/menu`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/menu`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			sync: {
				url: `${config.API_URL}/platform/sys/menu/sync`,
				name: "同步",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			export: {
				url: `${config.API_URL}/platform/sys/menu/export`,
				name: "导出附件",
				get: async function(data, config={}){
					return await http.get(this.url, data, config);
				}
			},
			import: {
				url: `${config.API_URL}/platform/sys/menu/import`,
				name: "导入附件",
				post: async function(data, config={}){
					return await http.post(this.url, data, config);
				}
			},
		},
		dict: {
			list: {
				url: `${config.API_URL}/platform/sys/dict`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/dict`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/dict`,
				name: "详情",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/dict`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/dict`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			tree: {
				url: `${config.API_URL}/platform/sys/dict/tree`,
				name: "树型列表",
				get: async function(){
					return await http.get(this.url);
				}
			},
			getDictItemList: {
				url: `${config.API_URL}/platform/sys/dict/getDictItemList`,
				name: "获取字典项列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
		},
		dictItem: {
			list: {
				url: `${config.API_URL}/platform/sys/dictItem`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/dictItem`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/dictItem`,
				name: "详情",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/dictItem`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/dictItem`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		config: {
			tree: {
				url: `${config.API_URL}/platform/sys/config/tree`,
				name: "树型列表",
				get: async function(){
					return await http.get(this.url);
				}
			},
			list: {
				url: `${config.API_URL}/platform/sys/config`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/config`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/config`,
				name: "详情",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/config`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/config`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		role: {
			list: {
				url: `${config.API_URL}/platform/sys/role`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/role`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/role`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/role`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/role`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			sync: {
				url: `${config.API_URL}/platform/sys/role/sync`,
				name: "同步",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			getPermissionIdListByRoleId: {
				url: `${config.API_URL}/platform/sys/role/getPermissionIdListByRoleId`,
				name: "根据角色ID获取权限ID列表",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			assignPermission: {
				url: `${config.API_URL}/platform/sys/role/assignPermission`,
				name: "分配权限",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			getMenuIdListByRoleId: {
				url: `${config.API_URL}/platform/sys/role/getMenuIdListByRoleId`,
				name: "根据角色ID获取菜单ID列表",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			assignMenu: {
				url: `${config.API_URL}/platform/sys/role/assignMenu`,
				name: "分配菜单",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
		},
		permission: {
			list: {
				url: `${config.API_URL}/platform/sys/permission`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/permission`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/permission`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/permission`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/permission`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			tree: {
				url: `${config.API_URL}/platform/sys/permission/tree`,
				name: "树型列表",
				get: async function(){
					return await http.get(this.url);
				}
			},
			sync: {
				url: `${config.API_URL}/platform/sys/permission/sync`,
				name: "同步",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
		},
		setting: {
			list: {
				url: `${config.API_URL}/platform/sys/setting`,
				name: "列表",
				get: async function(params){
					return await http.get(this.url, params);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/setting`,
				name: "修改",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
		},
		route: {
			list: {
				url: `${config.API_URL}/platform/sys/route/list`,
				name: "列表",
				get: async function(params){
					return await http.get(this.url, params);
				}
			},
		},
		log: {
			list: {
				url: `${config.API_URL}/platform/sys/log`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/log`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/log`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/log`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/log`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		notice: {
			list: {
				url: `${config.API_URL}/platform/sys/notice`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/notice`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/notice`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/notice`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/notice`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		tenant: {
			list: {
				url: `${config.API_URL}/platform/sys/tenant`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/tenant`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/tenant`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/tenant`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/tenant`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		area: {
			list: {
				url: `${config.API_URL}/platform/sys/area`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/area`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/area`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/area`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/area`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			tree: {
				url: `${config.API_URL}/platform/sys/area/tree`,
				name: "树型列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
		},
		fileDetail: {
			list: {
				url: `${config.API_URL}/platform/sys/fileDetail`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/fileDetail`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/fileDetail`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/fileDetail`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/fileDetail`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		fileCategory: {
			tree: {
				url: `${config.API_URL}/platform/sys/fileCategory/tree`,
				name: "树型列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			list: {
				url: `${config.API_URL}/platform/sys/fileCategory`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/sys/fileCategory`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/sys/fileCategory`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/sys/fileCategory`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/sys/fileCategory`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
	},
	user: {
		userCenter:{
			myMenus: {
				url: `${config.API_URL}/platform/user/userCenter/myMenus`,
				name: "获取我的菜单",
				get: async function(){
					return await http.get(this.url);
				}
			},
			getUserInfo: {
				url: `${config.API_URL}/platform/user/userCenter/getUserInfo`,
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
				url: `${config.API_URL}/platform/user/userCenter/setUserInfo`,
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
				url: `${config.API_URL}/platform/user/userCenter/changePassword`,
				name: "修改用户密码",
				post: async function(params){
					return await http.post(this.url, params)
				}
			},
			logRecord: {
				url: `${config.API_URL}/platform/user/userCenter/logRecord`,
				name: "获取用户日志记录",
				get: async function(params){
					return await http.get(this.url, params)
				}
			},
			deleteLogRecord: {
				url: `${config.API_URL}/platform/user/userCenter/logRecord`,
				name: "删除用户日志记录",
				delete: async function(data){
					return await http.delete(`${this.url}/${data.id}`, data)
				}
			},
		},
		user: {
			list: {
				url: `${config.API_URL}/platform/user/user`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/user/user`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/user/user`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/user/user`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/user/user`,
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
				url: `${config.API_URL}/platform/user/user/changeAccount`,
				name: "账户",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			assignRoles: {
				url: `${config.API_URL}/platform/user/user/assignRoles`,
				name: "分配角色",
				post: async function(data){
					return await http.post(`${this.url}`, data);
				}
			},
			assignGroups: {
				url: `${config.API_URL}/platform/user/user/assignGroups`,
				name: "分配用户组",
				post: async function(data){
					return await http.post(`${this.url}`, data);
				}
			},
			assignDepartments: {
				url: `${config.API_URL}/platform/user/user/assignDepartments`,
				name: "分配部门",
				post: async function(data){
					return await http.post(`${this.url}`, data);
				}
			},
		},
		userGroup: {
			list: {
				url: `${config.API_URL}/platform/user/userGroup`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/user/userGroup`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/user/userGroup`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/user/userGroup`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/user/userGroup`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		userLevel: {
			list: {
				url: `${config.API_URL}/platform/user/userLevel`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/user/userLevel`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/user/userLevel`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/user/userLevel`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/user/userLevel`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		userLabel: {
			list: {
				url: `${config.API_URL}/platform/user/userLabel`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/user/userLabel`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/user/userLabel`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/user/userLabel`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/user/userLabel`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
	},
	cms: {
		article: {
			list: {
				url: `${config.API_URL}/platform/cms/article`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/cms/article`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/cms/article`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/cms/article`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/cms/article`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		articleCategory: {
			list: {
				url: `${config.API_URL}/platform/cms/articleCategory`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/cms/articleCategory`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/cms/articleCategory`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/cms/articleCategory`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/cms/articleCategory`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			tree: {
				url: `${config.API_URL}/platform/cms/articleCategory/tree`,
				name: "树型列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
		},
		articleComment: {
			list: {
				url: `${config.API_URL}/platform/cms/articleComment`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/cms/articleComment`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/cms/articleComment`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/cms/articleComment`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/cms/articleComment`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		articleTag: {
			list: {
				url: `${config.API_URL}/platform/cms/articleTag`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/cms/articleTag`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/cms/articleTag`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/cms/articleTag`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/cms/articleTag`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
	},
	store: {
		category: {
			list: {
				url: `${config.API_URL}/platform/store/category`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/category`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/category`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/category`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/category`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			tree: {
				url: `${config.API_URL}/platform/store/category/tree`,
				name: "树型列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			getCategoryAttributes: {
				url: `${config.API_URL}/platform/store/category/getCategoryAttributes`,
				name: "获取分类属性",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
		},
		brand: {
			list: {
				url: `${config.API_URL}/platform/store/brand`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/brand`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/brand`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/brand`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/brand`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		saleUnit: {
			list: {
				url: `${config.API_URL}/platform/store/saleUnit`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/saleUnit`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/saleUnit`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/saleUnit`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/saleUnit`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		productAttribute: {
			list: {
				url: `${config.API_URL}/platform/store/productAttribute`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/productAttribute`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/productAttribute`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/productAttribute`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/productAttribute`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		product: {
			list: {
				url: `${config.API_URL}/platform/store/product`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/product`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/product`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/product`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/product`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		productSku: {
			list: {
				url: `${config.API_URL}/platform/store/productSku`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/productSku`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/productSku`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/productSku`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/productSku`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		productSpec: {
			list: {
				url: `${config.API_URL}/platform/store/productSpec`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/productSpec`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/productSpec`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/productSpec`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/productSpec`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			tree: {
				url: `${config.API_URL}/platform/store/productSpec/tree`,
				name: "树型列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
		},
		productComment: {
			list: {
				url: `${config.API_URL}/platform/store/productComment`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/productComment`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/productComment`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/productComment`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/productComment`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		merchant: {
			list: {
				url: `${config.API_URL}/platform/store/merchant`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/merchant`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/merchant`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/merchant`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/merchant`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		merchantApply: {
			list: {
				url: `${config.API_URL}/platform/store/merchantApply`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/merchantApply`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/merchantApply`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/merchantApply`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/merchantApply`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		merchantCategory: {
			list: {
				url: `${config.API_URL}/platform/store/merchantCategory`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/merchantCategory`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/merchantCategory`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/merchantCategory`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/merchantCategory`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		merchantType: {
			list: {
				url: `${config.API_URL}/platform/store/merchantType`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/merchantType`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/merchantType`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/merchantType`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/merchantType`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		merchantDeposit: {
			list: {
				url: `${config.API_URL}/platform/store/merchantDeposit`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/merchantDeposit`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/merchantDeposit`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/merchantDeposit`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/merchantDeposit`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		shippingTemplate: {
			list: {
				url: `${config.API_URL}/platform/store/shippingTemplate`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/shippingTemplate`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/shippingTemplate`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/shippingTemplate`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/shippingTemplate`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		order: {
			list: {
				url: `${config.API_URL}/platform/store/order`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/order`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/order`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/order`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/order`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		orderRefund: {
			list: {
				url: `${config.API_URL}/platform/store/orderRefund`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/orderRefund`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/orderRefund`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/orderRefund`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/orderRefund`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		express: {
			list: {
				url: `${config.API_URL}/platform/store/express`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/express`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/express`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/express`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/express`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		advert: {
			list: {
				url: `${config.API_URL}/platform/store/advert`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/advert`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/advert`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/advert`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/advert`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		banner: {
			list: {
				url: `${config.API_URL}/platform/store/banner`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/banner`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/banner`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/banner`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/banner`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		serviceGuarantee: {
			list: {
				url: `${config.API_URL}/platform/store/serviceGuarantee`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/serviceGuarantee`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/serviceGuarantee`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/serviceGuarantee`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/serviceGuarantee`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		searchKeyword: {
			list: {
				url: `${config.API_URL}/platform/store/searchKeyword`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/searchKeyword`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/searchKeyword`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/searchKeyword`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/searchKeyword`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		deviseCategory: {
			list: {
				url: `${config.API_URL}/platform/store/deviseCategory`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/deviseCategory`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/deviseCategory`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/deviseCategory`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/deviseCategory`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		coupon: {
			list: {
				url: `${config.API_URL}/platform/store/coupon`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/coupon`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/coupon`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/coupon`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/coupon`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		seckill: {
			list: {
				url: `${config.API_URL}/platform/store/seckill`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/seckill`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/seckill`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/seckill`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/seckill`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
		seckillTime: {
			list: {
				url: `${config.API_URL}/platform/store/seckillTime`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/store/seckillTime`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/store/seckillTime`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/store/seckillTime`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/store/seckillTime`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
		},
	},
	app: {
		siteConfig: {
			list: {
				url: `${config.API_URL}/platform/app/siteConfig`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/app/siteConfig`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/app/siteConfig`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/app/siteConfig`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/app/siteConfig`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			getConfig: {
				url: `${config.API_URL}/platform/app/siteConfig/getConfig`,
				name: "获取配置",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			setConfig: {
				url: `${config.API_URL}/platform/app/siteConfig/setConfig`,
				name: "设置配置",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
		},
		storeConfig: {
			list: {
				url: `${config.API_URL}/platform/app/storeConfig`,
				name: "列表",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			add: {
				url: `${config.API_URL}/platform/app/storeConfig`,
				name: "添加",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
			detail: {
				url: `${config.API_URL}/platform/app/storeConfig`,
				name: "查看",
				get: async function(data){
					return await http.get(`${this.url}/${data.id}`, data);
				}
			},
			update: {
				url: `${config.API_URL}/platform/app/storeConfig`,
				name: "更新",
				put: async function(data){
					return await http.put(`${this.url}`, data);
				}
			},
			delete: {
				url: `${config.API_URL}/platform/app/storeConfig`,
				name: "删除",
				delete: async function(data){
					let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
					return await http.delete(`${this.url}/${id}`, data);
				}
			},
			getConfig: {
				url: `${config.API_URL}/platform/app/storeConfig/getConfig`,
				name: "获取配置",
				get: async function(data){
					return await http.get(this.url, data);
				}
			},
			setConfig: {
				url: `${config.API_URL}/platform/app/storeConfig/setConfig`,
				name: "设置配置",
				post: async function(data){
					return await http.post(this.url, data);
				}
			},
		},
	},
}
