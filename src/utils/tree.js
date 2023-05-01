export default {
	// 触发树更新
	treeHandleSuccess(tree, data, mode){
		if (mode == 'add') {
			tree.append(data, data.parentId)
			tree.setCurrentKey(data.id)
		} else if (mode == 'edit') {
			let editNode = tree.getNode(data.id);
			if (editNode){
				// 判断是否移动
				// let editNodeParentId = editNode.level == 1 ? undefined : editNode.parent.data.id
				let editNodeParentId = editNode.level && editNode.level == 1 ? 0 : editNode.parent.data.id
				// console.log('editNodeParentId', editNodeParentId)
				// console.log('data.parentId', data.parentId)
				if (editNodeParentId != data.parentId) {
					let obj = editNode.data;
					tree.remove(data.id)
					tree.append(obj, data.parentId)
				}
			}
			// console.log('data.children', data.children)
			// console.log('editNode.data.children', editNode.data.children)
			if (data.children == null || (Array.isArray(data.children) && data.children.length === 0)) {
				data.children = editNode.data.children
			}
			Object.assign(editNode.data, data)
		}
	},
	//树过滤
	treeFilterNode(value, data){
		if (!value) return true;
		let targetText = data.name + data.code;
		return targetText.indexOf(value) !== -1;
	},
	//树拖拽
	treeNodeDrop(draggingNode, dropNode, dropType, next) {
		let defaultParentId = 0;
		let defaultSort = 1000;

		let { data } = draggingNode;
		let parentId = dropType === 'inner' ? dropNode.data.id : dropNode.data.parentId || defaultParentId;
		let sort = dropNode.data.sort ? (dropType === 'before' ? dropNode.data.sort - 1 : dropNode.data.sort + 1) : defaultSort;

		Object.assign(data, {
			parentId: parentId,
			sort: sort,
		})

		if(next){
			next(data)
		}
	},
	// 改变节点的状态
	changeTreeNodeStatus (node, treeStatus) {
		node.expanded = treeStatus;
		for (let i = 0; i < node.childNodes.length; i++) {
			// 改变节点的自身expanded状态
			node.childNodes[i].expanded = treeStatus;
			// 看看他孩子的长度，有的话就调用自己往下找
			if (node.childNodes[i].childNodes.length > 0) {
				this.changeTreeNodeStatus(node.childNodes[i], treeStatus);
			}
		}
	},
}
