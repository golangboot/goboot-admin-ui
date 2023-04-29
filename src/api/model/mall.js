import config from "@/config"
import http from "@/utils/request"

export default {
	category: {
		list: {
			url: `${config.API_URL}/mall/category`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/mall/category`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/mall/category`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/mall/category`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/mall/category`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
		tree: {
			url: `${config.API_URL}/mall/category/tree`,
			name: "树型列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
	},
	brand: {
		list: {
			url: `${config.API_URL}/mall/brand`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/mall/brand`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/mall/brand`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/mall/brand`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/mall/brand`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	product: {
		list: {
			url: `${config.API_URL}/mall/product`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/mall/product`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/mall/product`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/mall/product`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/mall/product`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
	productSku: {
		list: {
			url: `${config.API_URL}/mall/productSku`,
			name: "列表",
			get: async function(data){
				return await http.get(this.url, data);
			}
		},
		add: {
			url: `${config.API_URL}/mall/productSku`,
			name: "添加",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		detail: {
			url: `${config.API_URL}/mall/productSku`,
			name: "查看",
			get: async function(data){
				return await http.get(`${this.url}/${data.id}`, data);
			}
		},
		update: {
			url: `${config.API_URL}/mall/productSku`,
			name: "更新",
			put: async function(data){
				return await http.put(`${this.url}`, data);
			}
		},
		delete: {
			url: `${config.API_URL}/mall/productSku`,
			name: "删除",
			delete: async function(data){
				let id = (Array.isArray(data.ids) ? data.ids.filter(Boolean) : []).concat(data.id || []).filter(Boolean).map(String).join(',') || '';
				return await http.delete(`${this.url}/${id}`, data);
			}
		},
	},
}
