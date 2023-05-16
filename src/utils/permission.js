import config from "@/config"
import tool from '@/utils/tool';

/**
 * 是否含有不限分类，有则表示全部允许通过
 */
export function permissionAll() {
	const allPermissions = "*/*/*"
	let permissions = tool.data.get(config.DATA_CODE.PERMISSIONS);
	return permissions.includes(allPermissions);
}

/**
 * 比对两组数据是否一致
 * @param news
 * @param old
 * @returns {boolean}
 */
export function judementSameArr(news, old) {
	// console.log(news)
	// console.log(old)
	let count = 0;
	const leng = news.length;
	for (let i in news) {
		for (let j in old) {
			if (news[i] === old[j]) {
				count++;
				// console.log(news[i])
			}
		}
	}
	// console.log('相同的数量', count)
	return count === leng;
}

export function permission(data) {
	let permissions = tool.data.get(config.DATA_CODE.PERMISSIONS);
	if(!permissions){
		return false;
	}
	let isHave = permissions.includes(data);
	return isHave;
}

export function rolePermission(data) {
	let userInfo = tool.data.get(config.DATA_CODE.USER_INFO);
	if(!userInfo){
		return false;
	}
	let userRoles = userInfo.roles;
	if(!userRoles){
		return false;
	}
	let isHave = userRoles.includes(data);
	if (!isHave){
		let roles = tool.data.get(config.DATA_CODE.ROLES);
		if (roles){
			isHave = roles.includes(data);
		}
	}
	return isHave;
}
