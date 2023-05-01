import API from "@/api";

//上传配置

export default {
	apiObj: API.file.upload,			//上传请求API对象
	filename: "file",					//form请求时文件的key
	successCode: 200,					//请求完成代码
	maxSize: 10,						//最大文件大小 默认10MB
	parseData: function (res) {
		return {
			code: res.code,				//分析状态字段结构
			msg: res.message || res.msg,			//分析描述字段结构
			fileName: res.data.filename || res.data.name || res.data.fileName,//分析文件名称
			originalFilename: res.data.originalFilename,
			src: res.data.url || res.data.src,			//分析图片远程地址结构
			id: res.data.id,
			contentType: res.data.contentType,
			ext: res.data.ext,
			platform: res.data.platform,
		}
	},
	apiObjFile: API.file.uploadFile,	//附件上传请求API对象
	maxSizeFile: 10						//最大文件大小 默认10MB
}
