<template>
	<div class="goodsDetails">
		<div class="title" style="display: flex;justify-content: space-between;align-items: center;">
			<el-page-header @back="goBack" :content="title"></el-page-header>
			<el-button type="primary" size="small" @click="submit">保存</el-button>
		</div>
		<!--<a-divider />-->
		<el-divider></el-divider>
		<el-descriptions title="基础信息"></el-descriptions>
		<el-form :model="ruleForm" :inline="false"   ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="封面图:">
				<sc-upload-image-plus :limit="1"  :key="timer"  :filelist="ruleForm.image"  @getfile="fileList"></sc-upload-image-plus>
			</el-form-item>
			<el-form-item label="轮播图:">
				<sc-upload-image-plus :limit="5"  :key="timer" :filelist="ruleForm.sliderImage"  @getfile="fileListArr"></sc-upload-image-plus>
			</el-form-item>
			<el-form-item label="商品分类:" >
				<el-cascader ref="myCascader"  style="width:360px" @change="getpositionName" v-model="ruleForm.cateId" :options="options" placeholder="请选择分类" :props="{ emitPath:false,checkStrictly: true,value:'id',label:'name'}"  class="ml-4"></el-cascader>
			</el-form-item>
			<el-form-item label="商品名称:" >
				<el-input v-model="ruleForm.storeName"></el-input>
			</el-form-item>
			<el-form-item label="商品简介:" >
				<el-input v-model="ruleForm.storeInfo"></el-input>
			</el-form-item>
			<el-form-item label="详细描述:" >
				<el-input v-model="ruleForm.description"></el-input>
			</el-form-item>
			<el-form-item label="返现积分:" >
				<el-input v-model="ruleForm.giveIntegral" type="number" min=0></el-input>
			</el-form-item>
			<el-form-item label="销量:" >
				<el-input v-model="ruleForm.ficti" type="number" min=0></el-input>
			</el-form-item>
			<el-form-item label="关键词:" >
				<el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClosekey(tag)">
					{{tag}}
				</el-tag>
				<el-input
					class="input-new-tag"
					v-if="inputVisible"
					v-model="inputValue"
					ref="saveTagInput"
					size="small"
					@keyup.enter="handleInputConfirmkey"
					@blur="handleInputConfirmkey"
				>
				</el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showInputkey">+ New Tag</el-button>
			</el-form-item>
			<el-form-item label="排序:" >
				<el-input v-model="ruleForm.sort" placeholder="数值越大越靠前" type="number" min=0></el-input>
			</el-form-item>
			<el-form-item label="是否多规格:" >
				<el-switch v-model="ruleForm.specType"></el-switch>
			</el-form-item>
			<el-form-item label="是否积分商品:" >
				<el-switch v-model="ruleForm.integralType"></el-switch>
			</el-form-item>
			<!-- 规格 -->
			<el-divider></el-divider>
			<div>
				<div class="goods-spec" v-if="ruleForm.specType">
					<h3>商品规格</h3>
					<el-link type="primary" @click="addPrivateSpec" class="goods-spec-add">添加规格</el-link>
				</div>
				<template v-if="ruleForm.specType">
					<div class="goods-container" v-for="(attr, index) in items" :key="index">
						<div class="goods-content">
							<div class="goods-content-box">
								<div class="goods-content-left">
									<el-form label-width="80px" style="width:400px">
										<el-form-item label="规格名">
											<el-input v-model="attr.value" placeholder="请输入规格名"></el-input>
										</el-form-item>
										<el-form-item label="规格值">
											<el-tag v-for="tag in attr.detail" :key="tag" closable :disable-transitions="false" @close="handleClose(tag, attr)">
												{{ tag }}
											</el-tag>
											<el-input
												class="input-new-tag"
												v-if="attr.inputVisible"
												v-model="attr.inputValue"
												:ref="`saveTagInput${index}`"
												size="small"
												@keyup.enter="handleInputConfirm(attr.inputValue, attr)"
												@blur="handleInputConfirm(attr.inputValue, attr)"
											>
											</el-input>
											<el-button v-else class="button-new-tag" size="small" @click="showInput(attr, index)">+ 添加</el-button>
										</el-form-item>
									</el-form>
								</div>
								<div class="goods-content-right">
									<el-link type="danger" @click="delPrivateSpec(index)">删除规格</el-link>
								</div>
							</div>
						</div>
					</div>
				</template>

				<!--<p style="margin:24px 0 10px 0">价格 / 库存</p>-->
				<el-divider>价格 / 库存</el-divider>
				<el-table ref="multipleTable" :data="tableColumnList.tableBodyList" stripe tooltip-effect="dark" style="width: 100%;margin-top:1%;">
					<el-table-column :label="item.propName" :property="item.prop" v-for="item in tableColumnList.tableHeaderList" :key="item.prop" align="center">
						<template #default="scope">
							<span>{{ scope.row[scope.column.property] }}</span>
						</template>
					</el-table-column>
					<el-table-column label="商品条码">
						<template #default="scope">
							<el-input v-model="scope.row.barCode"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="价格（元）">
						<template #default="scope">
							<el-input v-model.number="scope.row.price"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="成本价（元）">
						<template #default="scope">
							<el-input v-model.number="scope.row.cost"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="原价（元）">
						<template #default="scope">
							<el-input v-model.number="scope.row.otPrice"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="库存">
						<template #default="scope">
							<el-input v-model.number="scope.row.stock"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="体积">
						<template #default="scope">
							<el-input v-model="scope.row.volume"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="重量">
						<template #default="scope">
							<el-input v-model="scope.row.weight"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="兑换所需积分" v-if="ruleForm.integralType">
						<template #default="scope">
							<el-input v-model="scope.row.integral"></el-input>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- <el-button type="primary" style="width: 20%;margin-left: 30%;margin-top: 20px;">保存</el-button> -->
		</el-form>
	</div>
</template>

<script>
import scUploadImagePlus from "@/components/scUploadImagePlus";
export default {
	components:{
		scUploadImagePlus,
	},
	data(){
		return{
			ruleForm: {
				cateId:'',
				cateName:'',
				image:[],
				sliderImage:[],
				storeName: '',
				storeInfo: '',
				description: '',
				giveIntegral: '',
				ficti: '',
				sort: '',
				specType: false,
				integralType:false,
			},
			dynamicTags: ['标签一', '标签二'],  //关键词
			inputVisible: false,
			inputValue: '',
			tableColumnList: {
				tableHeaderList: [],
				tableBodyList: [
					{

					}
				]
				// inventory: ''
			},
			items: [    //sku属性
				{
					value: '', //规格名
					detail: [], //规格值数组
					inputVisible: false,
					inputValue: ''
				}
			],
			options:[],   //商品类列表
			id:"",   //无则添加有则编辑
			timer:'',  //刷新子组件
			title:"",
		}
	},
	mounted(){
		this.title="添加商品"
		if(this.$route.query.id){
			this.id=this.$route.query.id;
			this.title="商品信息"
			this.getdetails();
		}
		this.getoptions();

	},
	computed: {
		// 计算规格
		calculateAttribute() {
			// 初始化
			let obj = {}
			this.items.forEach((item) => {
				// 判断有没有输入规格名
				if (item.value) {
					//规格名:规格值     //'颜色':'尺寸'
					obj[item.value] = item.detail
				}
			})
			return obj
		}
	},
	watch: {
		// 监听规格数据
		calculateAttribute(newVal) {
			if(!this.ruleForm.specType){return;}
			this.attribute(newVal);

			let cloneNewVal = JSON.parse(JSON.stringify(newVal))
			let attrName = [] //规格名数组
			let attrValue = [] //规格值数组
			for (let key in cloneNewVal) {
				attrName.push(key)
				attrValue.push(cloneNewVal[key])
			}

			// 表格内容数据（笛卡尔积算法）
			let finalArr = this.cartesianProductOf(...attrValue)

			let tableObj = {
				tableBodyList: [],
				tableHeaderList: []
			}
			// 表格内容
			tableObj.tableBodyList = finalArr.map((item) => {
				let obj = {
					barCode: '',   //商品条码
					cost: 0,        //成本价
					otPrice: 0,     //原价
					price: 0,       //现价
					stock: 0,	   //库存
					volume: '',     //体积
					weight: '',     //重量
				}
				for (let i = 0; i < item.length; i++) {
					obj[attrName[i]] = item[i]
				}
				return obj
			})
			this.tableColumnList.tableBodyList = tableObj.tableBodyList //表格内容数据

			// 表头
			let skuTableArr = Object.keys(newVal)
			tableObj.tableHeaderList = skuTableArr.map((item) => {
				return {
					prop: item,
					propName: item
				}
			})
			this.tableColumnList.tableHeaderList = tableObj.tableHeaderList // 表头
		},
		'ruleForm.specType':{
			deep:true,
			handler:function(newV,oldV){
				console.log('oldV:', oldV)
				if(!newV){
					this.tableColumnList= this.$options.data().tableColumnList;
					this.items=this.$options.data().items;
				}
			}
		}
	},
	methods: {
		getpositionName(){
			const info = this.$refs.myCascader.getCheckedNodes()[0];
			this.ruleForm.cateName=info.label;
		},
		getoptions(){	//获取商品分类列表
			const that = this;
			this.$api.categorylist({}).then(function (response) {
				if(response.code==0){
					that.options=that.removeEmptyChildren(response.data);
				}else{
					that.$message({
						message: response.message,
						center: true,
						type: 'warning',
					});
				}
			})
		},
		removeEmptyChildren (node) {   //杀生
			var that=this;
			node.forEach(item => {
				if ('children' in item && item.children.length === 0) {
					delete item.children
				} else if ('children' in item && item.children.length) {
					that.removeEmptyChildren(item.children)
				}
			})
			return node;
		},
		attribute(newVal){
			var that=this;
			this.$api.goodssku(that.items).then(res=>{
				if(res.code==0){
					// console.log("属性",res);
					let cloneNewVal = JSON.parse(JSON.stringify(newVal))
					let attrName = [] //规格名数组
					let attrValue = [] //规格值数组
					for (let key in cloneNewVal) {
						attrName.push(key)
						attrValue.push(cloneNewVal[key])
					}

					// 表格内容数据（笛卡尔积算法）
					let finalArr = this.cartesianProductOf(...attrValue)
					console.log('finalArr:', finalArr)
					let tableObj = {
						tableBodyList: [],
						tableHeaderList: []
					}
					// 表格内容
					tableObj.tableBodyList = res.data.map((item) => {
						var detail = item.detail;
						console.log('detail:', detail)
						return Object.assign(item, detail);
					})
					this.tableColumnList.tableBodyList = tableObj.tableBodyList //表格内容数据
					this.tableColumnList.tableBodyList = res.data;
					// 表头
					let skuTableArr = Object.keys(newVal)
					tableObj.tableHeaderList = skuTableArr.map((item) => {
						return {
							prop: item,
							propName: item
						}
					})
					this.tableColumnList.tableHeaderList = tableObj.tableHeaderList // 表头
				}else{
					this.$message({
						message: res.message,
						center: true,
					});
				}
			}).catch(err=>{console.log("网络错误",err)})
		},
		//上传的图片列表
		fileList(list){
			console.log("封面图片：",list)
			this.ruleForm.image=list;
		},
		fileListArr(list){
			console.log("轮播图片：",list)
			this.ruleForm.sliderImage=list;
		},
		goBack(){
			this.$router.go(-1);
		},
		//关键词操作
		handleClosekey(tag) {
			this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
		},

		showInputkey() {
			this.inputVisible = true;
			// eslint-disable-next-line
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handleInputConfirmkey() {
			let inputValue = this.inputValue;
			if (inputValue) {
				this.dynamicTags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		//获取详情
		getdetails(){
			var that=this;
			this.$api.goodsDetails({id:that.id}).then(res=>{
				if(res.code==0){
					console.log("商品：",res);
					that.ruleForm=res.data;
					that.ruleForm.image=res.data.image.split(",");
					that.ruleForm.sliderImage=res.data.sliderImage.split(",");
					that.dynamicTags=res.data.keyword.split(",");
					that.items=res.data.items.map(item=>{
						item.inputValue="";
						item.inputVisible=false;
						return item;
					})
					setTimeout(()=>{
						let tablearr=[];
						for(var i=0; i<res.data.attrs.length;i++){
							tablearr.push(Object.assign(that.tableColumnList.tableBodyList[i],res.data.attrs[i]));
						}
						that.tableColumnList.tableBodyList=tablearr;
					},500)

					that.timer = new Date().getTime();
				}else{
					this.$message({
						message: res.message,
						center: true,
					});
				}
			}).catch(err=>{console.log("网络错误",err)})
		},
		submit(){
			var that=this;
			var obj;
			if(this.id){  //编辑
				obj=JSON.parse(JSON.stringify(that.ruleForm));
				obj.id=that.id;
				obj.items=that.items;
				obj.attrs=that.tableColumnList.tableBodyList;
				obj.keyword=that.dynamicTags.toString();
				obj.image=obj.image.toString();
				obj.sliderImage=obj.sliderImage.toString();
				this.$api.goodsedit(obj).then(res=>{
					if(res.code==0){
						this.$message({
							type:"success",
							message: res.message,
							center: true,
						});
						that.$router.push({path:'/product/goods'})
					}else{
						this.$message({
							message: res.message,
							center: true,
						});
					}
				}).catch(err=>{console.log("网络错误",err)})
			}else{
				obj=JSON.parse(JSON.stringify(that.ruleForm));

				obj.items=that.items;
				obj.attrs=that.tableColumnList.tableBodyList;
				obj.keyword=that.dynamicTags.toString();
				obj.image=obj.image.toString();
				obj.sliderImage=obj.sliderImage.toString();
				this.$api.goodsadd(obj).then(res=>{
					if(res.code==0){
						this.$message({
							type:"success",
							message: res.message,
							center: true,
						});
						that.$router.push({path:'/product/goods'})
					}else{
						this.$message({
							message: res.message,
							center: true,
						});
					}
				}).catch(err=>{console.log("网络错误",err)})
			}
		},
		/*****规格*****/
		// 添加规格
		addPrivateSpec(index) {
			console.log("addPrivateSpec index:", index);
			this.items.push({
				value: '',
				detail: [],
				inputVisible: false,
				inputValue: ''
			})
		},
		delPrivateSpec(index) {
			this.items.splice(index, 1)
		},
		handleInputConfirm(val, attr) {
			if (val) {
				attr.detail.push(val)
			}
			attr.inputVisible = false
			attr.inputValue = ''
		},
		handleClose(tag, item) {
			item.detail.splice(item.detail.indexOf(tag), 1)
		},
		showInput(attr, index) {
			attr.inputVisible = true
			// eslint-disable-next-line
			this.$nextTick((_) => {
				this.$refs[`saveTagInput${index}`][0].$refs.input.focus()
			})
		},
		// 笛卡尔积算法
		cartesianProductOf(...args) {
			return args.reduce(
				(total, current) => {
					let ret = []
					total.forEach((a) => {
						current.forEach((b) => {
							ret.push(a.concat([b]))
						})
					})
					return ret
				},
				[[]]
			)
		}

	},

};
</script>
<style scoped>
.goodsDetails {
	height: 100%;
	width: 100%;
	background: #FFFFFF;
	padding: 30px;
}

.goodsDetails .demo-ruleForm {
	width: 100%;
	/* display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap; */
}

.goodsDetails .demo-ruleForm > div {
	width: 80%;
}

.goodsDetails .el-tag + .el-tag {
	margin-left: 10px;
}

.goodsDetails .button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}

.goodsDetails .input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}

/* .goodsDetails .uploadimg{
	display: flex;
	width: 80vw;
} */
.goods-spec {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
}

.goods-spec .goods-spec-add {
	margin-right: 15px;
}

.goods-container .button-new-tag {
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}

.goods-container .input-new-tag {
	width: 90px;
	margin-right: 10px;
	vertical-align: bottom;
}

.goods-container .el-tag {
	margin-right: 10px;
}

.goods-container .goods-content {
	margin-bottom: 10px;
	padding: 14px;
	border: 1px solid #ebeef5;
	border-radius: 4px;
	background-color: #fcfcfc;
}

.goods-content .goods-content-box {
	display: flex;
	align-items: center;
}

.goods-content-box .goods-content-left {
	flex: 1;
}
</style>
