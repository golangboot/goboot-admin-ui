import config from "@/config"
import http from "@/utils/request"

export default {
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
