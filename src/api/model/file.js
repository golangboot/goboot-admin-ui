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
}
