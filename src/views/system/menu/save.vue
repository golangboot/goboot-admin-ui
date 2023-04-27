<template>
	<el-drawer :title="titleMap[mode]" v-model="visible" :size="'60%'" destroy-on-close @closed="$emit('closed')">
		<el-container v-loading="loading">
			<el-main style="padding:0 20px 20px 20px">
				<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
					<el-row :gutter="40">
						<el-col :lg="12">
							<el-form-item label="显示名称" prop="meta.title">
								<el-input v-model="form.meta.title" clearable placeholder="菜单显示名字"></el-input>
							</el-form-item>
							<el-form-item label="上级菜单" prop="parentId">
								<el-cascader v-model="form.parentId" :options="menuOptions" :props="menuProps" :show-all-levels="false" placeholder="顶级菜单" clearable></el-cascader>
							</el-form-item>
							<el-form-item label="类型" prop="meta.type">
								<el-radio-group v-model="form.meta.type">
									<el-radio-button label="menu">菜单</el-radio-button>
									<el-radio-button label="iframe">Iframe</el-radio-button>
									<el-radio-button label="link">外链</el-radio-button>
									<el-radio-button label="button">按钮</el-radio-button>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="别名" prop="name">
								<el-input v-model="form.name" clearable placeholder="菜单别名"></el-input>
								<div class="el-form-item-msg">系统唯一且与内置组件名一致，否则导致缓存失效。如类型为Iframe的菜单，别名将代替源地址显示在地址栏</div>
							</el-form-item>
							<el-form-item label="菜单图标" prop="meta.icon">
								<sc-icon-select v-model="form.meta.icon" clearable></sc-icon-select>
							</el-form-item>
							<el-form-item label="路由地址" prop="path">
								<el-input v-model="form.path" clearable placeholder=""></el-input>
							</el-form-item>
							<el-form-item label="重定向" prop="redirect">
								<el-input v-model="form.redirect" clearable placeholder=""></el-input>
							</el-form-item>
							<el-form-item label="菜单高亮" prop="active">
								<el-input v-model="form.active" clearable placeholder=""></el-input>
								<div class="el-form-item-msg">子节点或详情页需要高亮的上级菜单路由地址</div>
							</el-form-item>
							<el-form-item label="视图" prop="component">
								<el-input v-model="form.component" clearable placeholder="">
									<template #prepend>views/</template>
								</el-input>
								<div class="el-form-item-msg">如父节点、链接或Iframe等没有视图的菜单不需要填写</div>
							</el-form-item>
							<el-form-item label="颜色" prop="color">
								<el-color-picker v-model="form.meta.color" :predefine="predefineColors"></el-color-picker>
							</el-form-item>
							<el-form-item label="是否隐藏" prop="meta.hidden">
								<el-checkbox v-model="form.meta.hidden">隐藏菜单</el-checkbox>
								<el-checkbox v-model="form.meta.hiddenBreadcrumb">隐藏面包屑</el-checkbox>
								<div class="el-form-item-msg">菜单不显示在导航中，但用户依然可以访问，例如详情页</div>
							</el-form-item>
							<el-form-item label="整页路由" prop="fullpage">
								<el-switch v-model="form.meta.fullpage" />
							</el-form-item>
							<el-form-item label="标签" prop="tag">
								<el-input v-model="form.meta.tag" clearable placeholder=""></el-input>
							</el-form-item>
							<el-form-item label="排序" prop="sort">
								<el-input-number v-model="form.sort" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
							</el-form-item>
							<el-form-item label="是否有效" prop="status">
								<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
							</el-form-item>
						</el-col>
						<el-col :lg="12" class="api-list">
							<h2>Api接口权限</h2>
							<sc-form-table v-model="form.apiList" :addTemplate="apiListAddTemplate" placeholder="暂无匹配接口权限">
								<el-table-column prop="code" label="标识" width="150">
									<template #default="scope">
										<el-input v-model="scope.row.code" placeholder="请输入权限标识"></el-input>
									</template>
								</el-table-column>
								<el-table-column prop="url" label="Api url">
									<template #default="scope">
										<el-input v-model="scope.row.url" placeholder="请输入 API URL"></el-input>
									</template>
								</el-table-column>
							</sc-form-table>
							<!--<el-form-item label="权限标识" prop="permission">
								<el-input v-model="form.permission" clearable placeholder=""></el-input>
								<div class="el-form-item-msg">Api接口权限编码</div>
							</el-form-item>
							<el-form-item label="接口地址" prop="url">
								<el-input v-model="form.url" clearable placeholder=""></el-input>
								<div class="el-form-item-msg">Api接口地址</div>
							</el-form-item>-->
						</el-col>
					</el-row>
				</el-form>
			</el-main>
			<el-footer>
				<el-button v-if="mode!='show'" type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
				<el-button @click="visible=false">取 消</el-button>
			</el-footer>
		</el-container>
	</el-drawer>
</template>

<script>
	import scIconSelect from '@/components/scIconSelect'
	export default {
		emits: ['success', 'closed'],
		components: {
			scIconSelect,
		},
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增',
					edit: '编辑',
					show: '查看'
				},
				visible: false,
				isSaving: false,
				//表单数据
				form: {
					id: "",
					parentId: "",
					name: "",
					path: "",
					component: "",
					redirect: "",
					meta:{
						title: "",
						icon: "",
						active: "",
						color: "",
						type: "menu",
						fullpage: false,
						tag: "",
					},
					apiList: [],
					// role: [],
					sort: null,
					status: 1,
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入菜单名称'}
					],
				},
				apiListAddTemplate: {
					code: "",
					url: ""
				},
				menu: [],
				menuOptions: [],
				menuProps: {
					value: 'id',
					label: 'title',
					checkStrictly: true,
					emitPath: false,
				},
			}
		},
		watch: {
			menu: {
				handler(){
					this.menuOptions = this.treeToMap(this.menu)
				},
				deep: true
			},
			form: {
				handler(){
					if (!this.form.apiList){
						this.form.apiList = [];
					}
				},
				deep: true
			},
		},
		mounted() {
			this.getMenu();
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//加载树数据
			async getMenu(){
				var res = await this.$API.system.menu.tree.get();
				this.menu = res.data;
			},
			//简单化菜单
			treeToMap(tree){
				const map = []
				tree.forEach(item => {
					var obj = {
						id: item.id,
						parentId: item.parentId,
						title: item.meta.title,
						children: item.children&&item.children.length>0 ? this.treeToMap(item.children) : null
					}
					map.push(obj)
				})
				return map
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						var res;
						if (this.form.id) {
							res = await this.$API.system.menu.update.put(this.form)
						} else {
							res = await this.$API.system.menu.add.post(this.form)
						}
						this.isSaving = false;
						if(res.code == 200){
							// this.form.id = res.data.id
							this.form = res.data
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
			//表单注入数据
			async setData(data){
				Object.assign(this.form, data)
				if (data.id){
					this.isSaving = true
					let reqData = {id: data.id}
					let res = await this.$API.system.menu.show.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			}
		}
	}
</script>

<style scoped>
h2 {font-size: 17px;color: #3c4a54;padding:0 0 30px 0;}
.api-list {border-left: 1px solid #eee;}

[data-theme="dark"] h2 {color: #fff;}
[data-theme="dark"] .api-list {border-color: #434343;}
</style>
