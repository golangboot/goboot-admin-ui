import config from "@/config"
import http from "@/utils/request"

export default {
	upload: {
		url: `${config.API_URL}/file/upload`,
		name: "文件上传",
		post: async function(data, config={}){
			return await http.post(this.url, data, config);
		}
	},
	uploadFile: {
		// url: `${config.API_URL}/uploadFile`,
		url: `${config.API_URL}/file/upload`,
		name: "附件上传",
		post: async function(data, config={}){
			return await http.post(this.url, data, config);
		}
	},
	fileDetail: {
		list: {
			url: `${config.API_URL}/file/fileDetail`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/file/fileDetail`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/file/fileDetail`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/file/fileDetail`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/file/fileDetail`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	fileCategory: {
		tree: {
			url: `${config.API_URL}/file/fileCategory/tree`,
			name: "树型列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		list: {
			url: `${config.API_URL}/file/fileCategory`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/file/fileCategory`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/file/fileCategory`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/file/fileCategory`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/file/fileCategory`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
}
