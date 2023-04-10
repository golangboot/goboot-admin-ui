const DEFAULT_CONFIG = {
	// 系统名称
	SYSTEM_NAME: process.env.VUE_SYSTEM_NAME || "GoBoot",

	// 系统版本号
	SYSTEM_VERSION: process.env.VUE_SYSTEM_VERSION || "1.0.0",

	// 系统开发者
	SYSTEM_AUTHOR: process.env.VUE_SYSTEM_SUPPORT_URL || "鸿宇科技",

	// 系统支持网址
	SYSTEM_SUPPORT_URL: process.env.VUE_SYSTEM_SUPPORT_URL || "http://hongyuvip.com",

	//标题
	APP_NAME: process.env.VUE_APP_TITLE,

	//首页地址
	DASHBOARD_URL: "/dashboard",

	//版本号
	APP_VER: "1.6.9",

	//内核版本号
	CORE_VER: "1.6.9",

	//接口地址
	API_URL: process.env.NODE_ENV === 'development' && process.env.VUE_APP_PROXY === 'true' ? "/api" : process.env.VUE_APP_API_BASEURL,

	//请求超时
	TIMEOUT: 10000,

	//TokenName
	TOKEN_NAME: "Authorization",

	//Token前缀，注意最后有个空格，如不需要需设置空字符串
	TOKEN_PREFIX: "Bearer ",

	//追加其他头
	HEADERS: {},

	//请求是否开启缓存
	REQUEST_CACHE: false,

	//布局 默认：default | 通栏：header | 经典：menu | 功能坞：dock
	//dock将关闭标签和面包屑栏
	LAYOUT: 'default',

	//菜单是否折叠
	MENU_IS_COLLAPSE: false,

	//菜单是否启用手风琴效果
	MENU_UNIQUE_OPENED: false,

	//是否开启多标签
	LAYOUT_TAGS: true,

	//语言
	LANG: 'zh-cn',

	//主题颜色
	COLOR: '',

	//是否加密localStorage, 为空不加密，可填写AES(模式ECB,移位Pkcs7)加密
	LS_ENCRYPTION: '',

	//localStorageAES加密秘钥，位数建议填写8的倍数
	LS_ENCRYPTION_key: '2XNN4K8LC0ELVWN4',

	//控制台首页默认布局
	DEFAULT_GRID: {
		//默认分栏数量和宽度 例如 [24] [18,6] [8,8,8] [6,12,6]
		layout: [12, 6, 6],
		//小组件分布，com取值:views/home/components 文件名
		copmsList: [
			['welcome'],
			['about', 'ver'],
			['time', 'progress']
		]
	},

	SYSTEM: {
		// 系统名称
		NAME: process.env.VUE_SYSTEM_NAME || "GoBoot",
		// 系统版本号
		VERSION: process.env.VUE_SYSTEM_VERSION || "1.0.0",
		// 系统开发者
		AUTHOR: process.env.VUE_SYSTEM_SUPPORT_URL || "鸿宇科技",
		// 系统支持网址
		SUPPORT_URL: process.env.VUE_SYSTEM_SUPPORT_URL || "http://hongyuvip.com",
	},

	// 数据CODE编码
	DATA_CODE: {
		TOKEN: 'TOKEN',
		USER_INFO: 'USER_INF',
		MENU: 'MENUS',
		PERMISSION: 'PERMISSIONS',
		DASHBOARD_GRID: 'DASHBOARD_GRID',
		GRID: 'GRID',
		SEARCH_HISTORY: 'SEARCH_HISTORY',
	},
}

//合并业务配置
import MY_CONFIG from "./myConfig"
Object.assign(DEFAULT_CONFIG, MY_CONFIG)

// 如果生产模式，就合并动态的APP_CONFIG
// public/config.js
if(process.env.NODE_ENV === 'production'){
	Object.assign(DEFAULT_CONFIG, APP_CONFIG)
}

export default DEFAULT_CONFIG
