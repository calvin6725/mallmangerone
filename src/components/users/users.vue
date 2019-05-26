<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.搜索 -->
    <el-row class="searchRow">
      <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success">添加用户</el-button>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="160"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <!-- 如果单元格内显示的内容不是字符串（文本），需要给被显示的内容外层包裹一个template -->
        <!-- 
        template 内部要用数据 需设置slot-scope属性
        该属性的值是要用数据create_time的数据源userlist
        -->
        <!-- 
           slot-scope的值userlist其实就是el-table绑定的数据userlist,他会自动去找最外层的数据
        userlist.row:指的是数组中的每个对象
        -->
        <template slot-scope="scope">{{scope.row.create_time | fmtdata}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="180">
        <template>
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2,4,6,8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      userlist: [],
      //分页相关的数据
      total: -1
    };
  },
  created() {
    this.getuserList();
  },
  methods: {
    //分页相关方法
    // size-change：  每页显示条数变化时 触发
    // current-change  ：当前页改变时 触发
    // current-page   设置当前页是第几页
    // page-sizes     每页多少条的数据数组
    // page-size 设置显示多少条
    // total  数据总数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      //触发每页显示条数时更改 page-size
      this.pagesize=val;
    //   this.pagenum=1;
      this.getuserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum=val;
       this.getuserList();
    },
    async getuserList() {
      //先设置请求头，获取请求头之后 再发送请求时会连同请求头一起再发送请求
      // query     查询参数
      // pagenum  当前页码
      // pagesize 每页显示条数
      //需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
      //axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);

      //对象的结构赋值
      const {
        meta: { status, msg },
        data: { users, total }
      } = res.data;
      if (status === 200) {
        //1.给表格数据赋值
        this.userlist = users;
        //2.给total赋值
        this.total = total;
        //3.提示
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>
