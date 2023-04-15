import config from "@/config"
import http from "@/utils/request"

export default {
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
	show: {
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
			let id = data.id;
			if (data.ids) {
				id = data.ids.join(',');
			}
			return await http.delete(`${this.url}/${id}`, data);
		}
	},
}
