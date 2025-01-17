import config from "@/config";
import tool from '@/utils/tool';
import api from '@/api';

let token = tool.cookie.get(config.DATA_CODE.TOKEN);
export default {
	state: {
		//用户信息
		userInfo: {},
		//Token令牌
		token: token,
		//是否已经登录
		hasLogin: token && Boolean(Object.keys(token).length),
	},
	mutations: {
		//登录
		async login(state, data = {}, autologin = false) {
			/*let data = {
				username: this.form.user,
				// password: tool.crypto.MD5(this.form.password)
				password: this.form.password
			}*/
			//获取token
			let res = await api.auth.login.post(data)
			if (res.code == 200) {
				await this.loginSuccess(state, res.data, autologin)
				/*tool.cookie.set(config.DATA_CODE.TOKEN, res.data.token, {
					expires: autologin ? 24 * 60 * 60 : 0
				})
				tool.data.set(config.DATA_CODE.USER_INFO, res.data.userInfo || res.data.userinfo)*/
			}
			return res;
		},
		async loginSuccess(state, data, autologin = false) {
			// console.log('loginSuccess:', data)
			if (data.token) {
				state.token = data.token
				tool.cookie.set(config.DATA_CODE.TOKEN, data.token, {
					expires: autologin ? 24 * 60 * 60 : 0
				})
			}
			if (data.userInfo) {
				state.userInfo = data.userInfo
				tool.data.set(config.DATA_CODE.USER_INFO, data.userInfo)
			}
			if (data.userinfo) {
				state.userInfo = data.userinfo
				tool.data.set(config.DATA_CODE.USER_INFO, data.userinfo)
			}
		},
		//获取菜单
		async getUserMenus(state, role = 'admin') {
			let res = null
			if (role == 'admin') {
				res = await api.backend.user.userCenter.myMenus.get()
			} else {
				res = await api.backend.user.userCenter.myMenus.get()
			}
			if (res.code == 200) {
				if (res.data.menu.length > 0) {
					tool.data.set(config.DATA_CODE.MENU, res.data.menu)
					tool.data.set(config.DATA_CODE.ROLES, res.data.roles)
					tool.data.set(config.DATA_CODE.PERMISSIONS, res.data.permissions)
					tool.data.set(config.DATA_CODE.DASHBOARD_GRID, res.data.dashboardGrid)
				}
			}
			return res
		},
		//获取Token
		getToken() {
			let token = tool.cookie.get(config.DATA_CODE.TOKEN);
			return token;
		}
	},
	actions: {
		login({ commit }, data, autologin = false) {
			commit('login', data, autologin);
		}
	}
}
