<template>
  <el-card>
    <!-- 1、面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!--2、 按钮 -->
    <el-row class="addrolebtn">
      <el-col>
        <el-button type="info">添加角色</el-button>
      </el-col>
    </el-row>
     <!-- 3.表格 -->
    <el-table 
  row-key="id"
    height="300px"
    :data="rolelist"
    style="width: 100%">
    <el-table-column type="expand" label="#" width="160">
        <template slot-scope="scope"> 
            <el-row v-for="(item1,i) in scope.row.children" :key="i">
                <el-col :span="4">
                    <!-- 传角色Id 和权限id -->
                    <el-tag @close="deleRight(scope.row,item1.id)" closable type="success">{{item1.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                    <el-row  v-for="(item2,i) in item1.children" :key="i">
                        <el-col :span="4">
                            <el-tag @close="deleRight(scope.row,item2.id)" closable type="info">{{item2.authName}}</el-tag>
                             <i class="el-icon-arrow-right"></i>
                        </el-col>

                        <el-col :span="20">
                            <el-tag @close="deleRight(scope.row,item3.id)" closable type="warning"  v-for="(item3,i) in item2.children" :key="i">{{item3.authName}}</el-tag>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 无权限的提示 -->
            <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
    </el-table-column>
      <el-table-column type="index" label="#" width="160"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column prop label="操作" width="180">
        <template slot-scope="scope">
          <el-button 
          size="mini" 
          plain 
          type="primary" 
          icon="el-icon-edit"
           circle
           @click="showEditUserDia(scope.row)"
           >
           </el-button>
          <el-button 
          size="mini" 
          plain 
          type="danger" 
          icon="el-icon-delete" circle
          @click="showDeleUserMsgBox(scope.row.id)"
          ></el-button>
          <el-button 
          @click="showSetRightDia(scope.row)"
          size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 修改权限对话框 -->
<el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
 <!-- 树形控件 
 data:数据源：[]
 show-checkbox:选择框
 node-key: 每个节点的唯一标识 通常是data数据源中的key和id
 default-expanded-keys   默认展开[要展开的节点的Id]
 default-checked-keys    [要选择的节点的Id]
 props 配置项{label(节点的文字标题),children(节点的子节点)}
 label和children的值来源于data绑定的数据源中的该属性的key名"label"和"children"
 -->
 <el-tree
 ref="tree"
  :data="treelist"
  show-checkbox
  node-key="id"
  default-expanded-all  
  :default-checked-keys="arrcheck"
  :props="defaultProps">
</el-tree>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
    <el-button type="primary" @click="setRoleRight()">确 定</el-button>
  </div>
</el-dialog>
     </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      //修改对话框的关闭和显示：
      dialogFormVisibleRight:false,
      //树形结构的数据
      treelist:[],
      defaultProps:{
          label:'authName',
          children:'children'
      },
      //该角色的权限id
      arrcheck:[],
      //当前角色id：
      currRoleId:-1

    }
  },
  created() {
    this.getRolelist();
  },
  methods: {
      //修改权限--发送请求
    async  setRoleRight(){
        //roleId：当前要修改权限的角色id
        //rids 属性节点中 所有全选和半选的label的id[]

        //获取全选的id的数组arr1 getCheckedKeys
        //el-tree 要等于它的js方法
        //1.给要操作的dom元素 设置ref属性值
        //2，this.$refs.ref(属性值).js方法名
        let arr1=this.$refs.tree.getCheckedKeys()
        //获取半选的id的数组arr2  getHalfCheckedKeys
        let arr2=this.$refs.tree.getHalfCheckedKeys()
        //es6 展开运算符   ...数组或对象
        let arr=[...arr1,...arr2]
        const res=await this.$http.post(`roles/${this.currRoleId}/rights`,{rids:arr.join(',')})
        //更新视图
        this.getRolelist()
        this.dialogFormVisibleRight=false
      },
      //修改/分配 权限
    async  showSetRightDia(role){
        //获取属性结构的权限数据
        const res=await this.$http.get(`rights/tree`)
        //给currRoleId赋值
        this.currRoleId=role.id
        this.treelist=res.data.data
        //获取当前角色 role 的权限id
        let arrtemp2=[]
        role.children.forEach(item1=>{
            item1.children.forEach(item2=>{
                item2.children.forEach(item3=>{
                    arrtemp2.push(item3.id)
                })
            })
        })
        this.arrcheck=arrtemp2
        this.dialogFormVisibleRight=true
      },
      //取消权限
    async deleRight(role,rightId){
        //roles/:roleId/rights/:rightId
        //roleId  当前的角色ID
        //rightId 要删除的权限ID
        const res=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        //删除成功 返回200和该角色的权限
        role.children=res.data.data  //只更新当前角色权限
    },
    async getRolelist() {
      const res = await this.$http.get(`roles`);
      console.log(res);
       const {meta: { status, msg },data} = res.data;
      this.rolelist=data     
    }
  }
};
</script>

<style>
.addrolebtn {
  margin-top: 20px;
}
</style>

