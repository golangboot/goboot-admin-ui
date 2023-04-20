<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
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
			<el-form-item>
				<el-button type="primary" @click="edit" :loading="loading">保 存</el-button>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
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
					role: [],
					sort: 1000,
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入菜单名称'}
					],
				}
			}
		},
		mounted() {

		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
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
			setData(data){
				Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
