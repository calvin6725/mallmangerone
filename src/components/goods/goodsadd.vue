<template>
  <el-card>
    <!-- 1.面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 2.提示  el-aleart-->
    <el-alert style="margin-top: 20px" title="添加商品信息" type="success" center show-icon></el-alert>
    <!--3. 步骤条 el-steps -->
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 最外层 el-form -->
    <el-form
      label-position="top"
      label-width="80px"
      :model="form"
      style="height:500px;overflow:auto"
    >
      <!--tab  -->
      <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              :props="defaultProp"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDyparams" :key="i">
            <!-- 复选框组 -->
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <!-- 静态参数的数据 -->
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStaticparams" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              action
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <!-- 表达元素 -->
            <el-button @click="addGoods()" type="primary">添加商品</el-button>
            <!-- 富文本   后台数据：goods_introduce： 介绍-->
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
//局部注册富文本编辑的组件
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  //局部注册富文本编辑的组件
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      //添加商品的表单数据
      form: {
        goods_name: "",
        goods_cat: "", //以“,”分割的分类列表 不能为空->级联选择器绑定的  selectedOptions
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "", //介绍
        pics: [],//上传图片的临时路径（对象）
        attrs: [] //商品参数--商品的动态参数和静态参数
      },
      //级联选择器绑定的数据
      options: [], //options=list[ ]级联选择器用的数据源
      selectedOptions: [],//级联选择器 选中的id值
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //动态参数的数据数组
      arrDyparams: [],
      //静态参数的数据数组
      arrStaticparams: [],
      //上传图片时的头部token 因为除了登录请求 都需要设置头部
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    //添加商品--发送请求
    async addGoods() {
        //goods_cat  商品分类
        this.form.goods_cat=this.selectedOptions.join(',')
        const res=await this.$http.post(`goods`,this.form)
    },
    //图片上传时 触发的方法
    handlePreview(file) {},
    //图片移除
    handleRemove(file) {
      //file.response.data.tmp_path  图片临时上传的路径
    //移除当前x掉的图片  this.form.pics.splice(索引，长度)
    //findIndex() 遍历 把符号条件元素的索引进行返回
    let index=this.form.pics.findIndex((item)=>{
        //遍历数组 判断该图片路径和当前选x的图片的路径是否一样  返回值是该图片的索引
        item.pic===file.response.data.tmp_path
    })    
    this.form.pics.splice(index,1)
    },
    //图片临时上传成功
    handleSuccess(file) {
      //file.data.tmp_path 图片临时上传的路径
      this.form.pics.push({
          pic:file.data.tmp_path
      })
    },
    //   点击不同的tab时 触发
    async tabChange() {
      //如果点击第二个tab 同时 三级分类要有值
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          //提示
          this.$message.warning("请先选择商品三级分类");
          return;
        }
        //获取数据
        //id: 分类id
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        this.arrDyparams = res.data.data;
        // this.arrDyparams（它一个字符串） 每个对象.attr_vals 字符串 转为数组
        this.arrDyparams.forEach(item => {
          //并不是所有的三级分类都有动态参数
          //字符串转数组
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(","); //三元表达式
        });
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          //提示
          this.$message.warning("请先选择商品三级分类");
          return;
        }
        //获取静态参数的数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        this.arrStaticparams = res.data.data;
      }
    },
    handleChange() {},
    //获取三级分类的信息
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.ql-editor {
  min-height: 300px;
}
</style>
