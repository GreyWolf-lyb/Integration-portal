webpackJsonp([7],{"66+H":function(e,t){},"F+Ll":function(e,t,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={watch:{filterText:function(e){this.$refs.tree.filter(e)}},data:function(){return{loding:!0,err:"",centerDialogVisible:!1,page:10,num:1e4,filterText:"组织结构",pname:"",pemail:"",ptel:"",tableData:[{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"},{name:"王小虎",tel:"18112619000",ssqy:"所属区域",ssbm:"工商局",zw:"经理",sex:"男",email:"john123@clound.com",date:"2020-07-03"}],data:[{id:1,label:"为森上海大区",children:[{id:4,label:"成本部门"},{id:5,label:"设计部门"},{id:6,label:"其它部门"},{id:7,label:"其它部门"},{id:8,label:"其它部门"}]},{id:2,label:"为森北京大区",children:[{id:9,label:"成本部门"},{id:10,label:"设计部门"},{id:11,label:"其它部门"},{id:12,label:"其它部门"},{id:13,label:"其它部门"}]},{id:3,label:"为森东北大区",children:[{id:14,label:"成本部门"},{id:15,label:"设计部门"},{id:16,label:"其它部门"},{id:17,label:"其它部门"},{id:18,label:"其它部门"}]}],defaultProps:{children:"children",label:"label"}}},methods:{filterNode:function(e,t){return!e||-1!==t.label.indexOf(e)},handleNodeClick:function(e){console.log(e.label)},handleSizeChange:function(e){console.log("每页 "+e+" 条")},handleCurrentChange:function(e){console.log("当前页: "+e)},search:function(){this.verification(),this.loding=!1},verification:function(){return/^[\u4e00-\u9fa5]{2,4}$/.test(this.pname)||""===this.pname?/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.ptel)||""===this.ptel?/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.pemail)||""===this.pemail?void 0:(this.err="请输入正确的邮箱地址！",this.centerDialogVisible=!0,!1):(this.err="请输入正确的手机号码！",this.centerDialogVisible=!0,!1):(this.err="请输入正确的姓名！",this.centerDialogVisible=!0,!1)}}},i={render:function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("el-container",{staticStyle:{height:"700px",margin:"10px",border:"1px solid #EEF1F6"}},[l("el-aside",{staticStyle:{width:"200px","background-color":"rgb(238, 241, 246)"}},[l("div",{staticStyle:{width:"200px","line-height":"50px","border-bottom":"1px solid #E6E6E6"}},[l("div",{staticStyle:{"margin-left":"12px","font-size":"16px","font-weight":"600"}},[e._v("组织结构")])]),e._v(" "),l("el-input",{staticStyle:{width:"180px",margin:"0px 8px",color:"#000","line-height":"70px"},attrs:{"suffix-icon":"el-icon-search",placeholder:"组织结构"},model:{value:e.filterText,callback:function(t){e.filterText=t},expression:"filterText"}}),e._v(" "),l("el-tree",{ref:"tree",staticStyle:{width:"180px",margin:"5px 8px"},attrs:{props:e.defaultProps,data:e.data,"default-expand-all":"","filter-node-method":e.filterNode},on:{"node-click":e.handleNodeClick}})],1),e._v(" "),l("el-container",[l("el-main",[l("div",{staticStyle:{width:"100%","line-height":"50px","border-bottom":"1px solid #E6E6E6"}},[l("div",{staticStyle:{"margin-left":"30px","font-size":"16px","font-weight":"600"}},[e._v("通讯录查看")])]),e._v(" "),l("div",{staticStyle:{width:"92%",margin:"0 4px"}},[l("div",{staticClass:"input",staticStyle:{"margin-left":"30px"}},[l("span",{staticClass:"title",staticStyle:{width:"18%"}},[e._v("姓名 :")]),e._v(" "),l("el-input",{staticStyle:{width:"74%",color:"#000"},attrs:{placeholder:""},model:{value:e.pname,callback:function(t){e.pname=t},expression:"pname"}})],1),e._v(" "),l("div",{staticClass:"input"},[l("span",{staticClass:"title",staticStyle:{width:"24%"}},[e._v("手机号 :")]),e._v(" "),l("el-input",{staticStyle:{width:"72%",color:"#000"},attrs:{placeholder:""},model:{value:e.ptel,callback:function(t){e.ptel=t},expression:"ptel"}})],1),e._v(" "),l("div",{staticClass:"input",staticStyle:{width:"40%"}},[l("span",{staticClass:"title",staticStyle:{width:"10%"}},[e._v("邮箱 :")]),e._v(" "),l("el-input",{staticStyle:{width:"86%",color:"#000"},attrs:{placeholder:""},model:{value:e.pemail,callback:function(t){e.pemail=t},expression:"pemail"}})],1),e._v(" "),l("el-button",{attrs:{type:"",icon:"el-icon-search"},on:{click:e.search}},[e._v("搜索")])],1),e._v(" "),l("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.tableData,stripe:""}},[l("el-table-column",{attrs:{prop:"name",label:"姓名"}}),e._v(" "),l("el-table-column",{attrs:{prop:"tel",label:"手机号"}}),e._v(" "),l("el-table-column",{attrs:{prop:"ssqy",label:"所属区域"}}),e._v(" "),l("el-table-column",{attrs:{prop:"ssbm",label:"所属部门"}}),e._v(" "),l("el-table-column",{attrs:{prop:"zw",label:"职务"}}),e._v(" "),l("el-table-column",{attrs:{prop:"sex",label:"性别"}}),e._v(" "),l("el-table-column",{attrs:{prop:"email",label:"邮箱",width:"180"}}),e._v(" "),l("el-table-column",{attrs:{prop:"date",label:"创建日期"}})],1),e._v(" "),l("div",{staticClass:"page_fy"},[l("el-pagination",{attrs:{"current-page":e.currentPage3,"page-size":e.page,"prev-text":"上一页","next-text":"下一页",layout:"prev, pager, next, jumper",total:e.num},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){e.currentPage3=t},"update:current-page":function(t){e.currentPage3=t}}})],1)],1)],1),e._v(" "),l("el-dialog",{attrs:{title:"提示",visible:e.centerDialogVisible,width:"30%",center:""},on:{"update:visible":function(t){e.centerDialogVisible=t}}},[l("span",[e._v(e._s(e.err))]),e._v(" "),l("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{on:{click:function(t){e.centerDialogVisible=!1}}},[e._v("取 消")]),e._v(" "),l("el-button",{attrs:{type:"primary"},on:{click:function(t){e.centerDialogVisible=!1}}},[e._v("确 定")])],1)])],1)},staticRenderFns:[]};var n=l("C7Lr")(a,i,!1,function(e){l("66+H")},null,null);t.default=n.exports}});
//# sourceMappingURL=7.1c192fa43dc1bace5350.js.map