<template>
	<el-dialog title="角色权限设置" v-model="visible" :width-invalid="'80%'" :height-invalid="'80%'" destroy-on-close @closed="$emit('closed')">
		<el-tabs tab-position="top">
			<el-tab-pane label="权限">
				<div class="treeMain">
					<el-tree ref="permission" node-key="id" :data="permission.list" :props="permission.props" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
			<el-tab-pane label="菜单">
				<div class="treeMain">
					<el-tree ref="menu" node-key="id" :data="menu.list" :props="menu.props" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
			<el-tab-pane label="数据权限" disabled>
				<el-form label-width="100px" label-position="left">
					<el-form-item label="规则类型">
						<el-select v-model="data.dataType" placeholder="请选择">
							<el-option label="全部可见" value="1"></el-option>
							<el-option label="本人可见" value="2"></el-option>
							<el-option label="所在部门可见" value="3"></el-option>
							<el-option label="所在部门及子级可见" value="4"></el-option>
							<el-option label="选择的部门可见" value="5"></el-option>
							<el-option label="自定义" value="6"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择部门" v-show="data.dataType=='5'">
						<div class="treeMain" style="width: 100%;">
							<el-tree ref="dept" node-key="id" :data="data.list" :props="data.props" show-checkbox></el-tree>
						</div>
					</el-form-item>
					<el-form-item label="规则值" v-show="data.dataType=='6'">
						<el-input v-model="data.rule" clearable type="textarea" :rows="6" placeholder="请输入自定义规则代码"></el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="控制台模块" disabled>
				<div class="treeMain">
					<el-tree ref="grid" node-key="key" :data="grid.list" :props="grid.props" :default-checked-keys="grid.checked" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
			<el-tab-pane label="控制台视图" disabled>
				<el-form label-width="100px" label-position="left">
					<el-form-item label="控制台视图">
						<el-select v-model="dashboard" placeholder="请选择">
							<el-option v-for="item in dashboardOptions" :key="item.value" :label="item.label" :value="item.value">
								<span style="float: left">{{ item.label }}</span>
								<span style="float: right; color: #8492a6; font-size: 12px">{{ item.views }}</span>
							</el-option>
						</el-select>
						<div class="el-form-item-msg">用于控制角色登录后控制台的视图</div>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				visible: false,
				isSaving: false,
				//表单数据
				form: {
					id:"",
					permissionIds:[],
					menuIds:[],
				},
				//验证规则
				rules: {
				},
				permission: {
					list: [],
					checked: [],
					props: {
						label: (data)=>{
							return data.name
						},
						/*children: 'children',
						isLeaf: (data) => {
							// 是否为叶子节点(终端节点/没有子节点)
							return !data.children || data.children.length === 0;
						},*/
					}
				},
				menu: {
					list: [],
					checked: [],
					props: {
						label: (data)=>{
							return data.meta.title
						},
						/*children: 'children',
						isLeaf: (data) => {
							// 是否为叶子节点(终端节点/没有子节点)
							return !data.children || data.children.length === 0;
						},*/
					}
				},
				grid: {
					list: [],
					checked: ["welcome", "ver", "time", "progress", "echarts", "about"],
					props: {
						label: (data)=>{
							return data.title
						},
						disabled: (data)=>{
							return data.isFixed
						}
					}
				},
				data: {
					dataType :"1",
					list: [],
					checked: [],
					props: {
						label: (data)=>{
							return data.name
						},
					},
					rule: ""
				},
				dashboard: "0",
				dashboardOptions: [
					{
						value: '0',
						label: '数据统计',
						views: 'stats'
					},
					{
						value: '1',
						label: '工作台',
						views: 'work'
					},
				]
			}
		},
		mounted() {
			this.getPermission()
			this.getMenu()
			this.getDept()
			this.getGrid()
		},
		methods: {
			open(){
				this.visible = true;
				return this;
			},
			async submit(){
				this.isSaving = true;

				let reqData = {
					roleId: this.form.id,
					permissionIds:[],
					menuIds:[],
				}

				let permissionCheckedKeys = this.$refs.permission.getCheckedKeys()
				// var permissionCheckedKeys = this.$refs.permission.getCheckedKeys().concat(this.$refs.permission.getHalfCheckedKeys())
				console.log('permission:', permissionCheckedKeys)
				reqData.permissionIds = permissionCheckedKeys
				this.form.permissionIds = permissionCheckedKeys

				//选中的和半选的合并后传值接口
				let menuCheckedKeys = this.$refs.menu.getCheckedKeys().concat(this.$refs.menu.getHalfCheckedKeys())
				console.log('menu:', menuCheckedKeys)
				reqData.menuIds = menuCheckedKeys
				this.form.menuIds = menuCheckedKeys

				// var checkedKeys_dept = this.$refs.dept.getCheckedKeys().concat(this.$refs.dept.getHalfCheckedKeys())
				// console.log('dept:', checkedKeys_dept)

				// console.log('data:', this.data)
				// console.log('dashboard:', this.dashboard)

				let resPermission = await this.$API.system.role.assignPermission.post(reqData)
				let resMenu = await this.$API.system.role.assignMenu.post(reqData)

				this.isSaving = false;

				if(resPermission.code == 200 && resMenu.code == 200 ){
					this.visible = false;
					this.$emit('success', this.form, this.mode)
					this.$message.success("操作成功")
				}
				if (resPermission.code != 200){
					this.$alert(resPermission.message, "提示", {type: 'error'})
				}
				if (resMenu.code != 200){
					this.$alert(resMenu.message, "提示", {type: 'error'})
				}

				/*setTimeout(()=>{
					this.isSaving = false;
					this.visible = false;
					this.$message.success("操作成功")
					this.$emit('success')
				},1000)*/
			},
			async getPermission(){
				this.isSaving = true

				var res = await this.$API.system.permission.tree.get()
				this.permission.list = res.data

				let reqData = {id: this.form.id}
				let resPermission = await this.$API.system.role.getPermissionIdListByRoleId.get(reqData)
				let permissionIds = resPermission.data
				// console.log('permissionIds:', permissionIds)

				//获取接口返回的之前选中的和半选的合并，处理过滤掉有叶子节点的key
				this.permission.checked = permissionIds ?? [] // 已选id
				this.$nextTick(() => {
					let filterKeys = this.permission.checked.filter(key => {
						return this.$refs.permission.getNode(key)?.isLeaf ?? true
					})
					this.$refs.permission.setCheckedKeys(filterKeys, true)
				})

				this.isSaving = false
			},
			async getMenu(){
				this.isSaving = true

				var res = await this.$API.system.menu.tree.get()
				this.menu.list = res.data

				let reqData = {id: this.form.id}
				let resMenu = await this.$API.system.role.getMenuIdListByRoleId.get(reqData)
				let menuIds = resMenu.data
				// console.log('menuIds:', menuIds)

				//获取接口返回的之前选中的和半选的合并，处理过滤掉有叶子节点的key
				this.menu.checked = menuIds ?? [] // 已选id
				this.$nextTick(() => {
					let filterKeys = this.menu.checked.filter(key => {
						return this.$refs.menu.getNode(key)?.isLeaf ?? true
					})
					this.$refs.menu.setCheckedKeys(filterKeys, true)
				})

				this.isSaving = false
			},
			async getDept(){
				var res = await this.$API.system.dept.tree.get();
				this.data.list = res.data
				this.data.checked = ["12", "2", "21", "22", "1"]
				this.$nextTick(() => {
					let filterKeys = this.data.checked.filter(key => {
						return this.$refs.menu.getNode(key)?.isLeaf ?? true
					})
					this.$refs.dept.setCheckedKeys(filterKeys, true)
				})
			},
			getGrid(){
				this.grid.list = [
					{
						key: "welcome",
						title: "欢迎",
						isFixed: true
					},
					{
						key: "ver",
						title: "版本信息",
						isFixed: true
					},
					{
						key: "time",
						title: "时钟"
					},
					{
						key: "progress",
						title: "进度环"
					},
					{
						key: "echarts",
						title: "实时收入"
					},
					{
						key: "about",
						title: "关于项目"
					}
				]
			},
			//表单注入数据
			async setData(data){
				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				Object.assign(this.form, data)

				if (data.id){
					this.isSaving = true
					let reqData = {id: data.id}
					let res = await this.$API.system.role.show.get(reqData)
					this.isSaving = false
					this.form = res.data
					// console.log('form:', this.form)
				}
			}
		}
	}
</script>

<style scoped>
	.treeMain {height:280px;overflow: auto;border: 1px solid #dcdfe6;margin-bottom: 10px;}
</style>
