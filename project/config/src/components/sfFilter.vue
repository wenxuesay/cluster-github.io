<template lang="pug">
.sf-panel.sf-filter
  .panel-heading
    el-row.text-left(:gutter="20")
      el-col(:span="24")
        div.pull-left(v-for="(item,index) in filterTop",:key="item.name",v-show="!item.isHide")
            div.pull-left.split.gray(v-if="index==1") 的
            el-select(:style='{width:resetSelect(item.options.find(t=>t.value==item.selected))+"px"}',v-model="item.selected",:placeholder="item.placeholder||'请选择'",:loading="item.loading",@change='changeFilterTop(index,$event)')
              el-option(v-for="option in item.options",:key="option.value",:label="option.label",:value="option.value")
            
        div.pull-right.bookmark(@click="openBookmark()")
            i.fa.fa-star(:class='{on:bookmarkId>0}')
            |&nbsp;书签
  .panel-body.sf-filter-body
    //- div.filterBox(style="display:flex;justify-content:center;align-items: center;")
    .flex.filterbox
      .filter-left
        .flex(style="margin-top: -30px;")
          .flex1.gray 按
          .flex8
            el-select(:style='{width:resetSelect(filterCenter.options.find(t=>t.value==filterCenter.selected))+"px"}',v-model="filterCenter.selected",@change='changeFilterCenter()')
              el-option(v-for="option in filterCenter.options",:key="option.value",:label="option.label",:value="option.value")
             
      .flex6
        div(style="display:flex;")
          .filter-con.connectionBox(v-show="filterBody.length>1",:style='{height:fCHeight + "px"}')
            div.text-regular(@click="changeConnection($event)",:message_and="filterConnection[0].name",:message_or="filterConnection[1].name",:class="{'on':filterConnection[0].checked}")
          .flex6.filterControls
            el-row.text-left.filterRow(v-for="(filter,index) in filterBody",:key="index",:gutter="50")
              el-col(:span="6")
                el-select(v-model="filter.selected",placeholder="请选择")
                  el-option(v-for="option in filter.options",:key="option.value",:label="option.label",:value="option.value")
              el-col(:span="6")
                el-select(v-model="filter.conditions",placeholder="请选择")
                  el-option(v-for="condition in conditions",:key="condition.value",:label="condition.value",:value="condition.value")
                    b {{condition.value}}：
                    span {{condition.label}}
              el-col(:span="6")
                el-input(@blur='filterTextBlur(filter,$event)',:value='filter.text', icon="edit",:disabled="filter.conditions&&curCondition(filter).numOfControls==0",:placeholder='filter.conditions&&curCondition(filter).description')
              el-col(:span="3")
                el-button(type="text",@click="deleteFilterBody(index)",class= 'delFilter')
                  i.el-icon-circle-close
                  
            .text-left(:style="{'marginTop':filterBody.length>0?'0':'-27px'}")
              a.create.text-regular(@click="addFilterBody")
                | +筛选条件
      .filter-right
        .flex-content(style="margin-top: -46px;")
          
          el-button.flex1(type='primary',@click="query") 查&nbsp;&nbsp;询
      el-dialog(:title='boardBookmarkId==0&&bookmarkId==0?"添加书签":"修改书签"', :visible.sync='dialogBookmark',size='tiny')
        el-form(:model='bookmarkForm',:rules="bookmarkRules",ref="bookmarkForm")
          el-form-item(label='书签名称', label-width='120px', prop="name")
            el-input(v-model='bookmarkForm.name', auto-complete='off')
        .dialog-footer.text-center(slot='footer')
          el-button(type='primary', @click='submitBookmark("bookmarkForm")',:class="{trbtn:boardBookmarkId>0&&bookmarkId==0}") 
            //- | {{boardBookmarkId==0&&bookmarkId==0?"确定":"确定"}}
            | {{boardBookmarkId>0&&bookmarkId==0? '更新当前书签':'确定'}}
          el-button(type='primary',v-if="boardBookmarkId>0&&bookmarkId==0", @click='submitBookmark("bookmarkForm",1)',:class="{trbtn:boardBookmarkId>0&&bookmarkId==0}") 另存为新书签
          el-button(@click='dialogBookmark = false',:class="{trbtn:boardBookmarkId>0&&bookmarkId==0}") 取消
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'sf-filter',
  props: ['filterTop', 'filterContent', 'analysisId', 'bookmarkModel', 'boardBookmarkId'],
  data() {
    // 验证
    const validateBookmarkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入收藏名称'));
      } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/.test(value)) {
        callback(new Error('只能汉字、数字、字母、下划线，在20个字符内'));
      } else {
        callback();
      }
    };
    return {
      filterCenter: {
        selected: '',
        options: [],
      },
      filterBody: [],
      filterConnection: [{
        key: 'and',
        name: '且',
        checked: true,
      }, {
        key: 'or',
        name: '或',
        checked: false,
      }],
      conditions: [
        {
          value: 'is_null',
          label: '为空',
          numOfControls: 0,
          description: '',
        },
        {
          value: 'not_null',
          label: '不为空',
          numOfControls: 0,
          description: '',
        },
        {
          value: 'starts_with',
          label: '以xxx开头，字符串，区分大小写',
          numOfControls: 1,
          description: '字符串',
        },
        {
          value: 'ends_with',
          label: '以xxx结尾，字符串，区分大小写',
          numOfControls: 1,
          description: '字符串',
        },
        {
          value: 'contains',
          label: '包含xxx，字符串，区分大小写',
          numOfControls: 1,
          description: '字符串',
        },
        {
          value: '=',
          label: '相等，不区分大写小相等，字符串',
          numOfControls: 1,
          description: '字符串',
        },
        {
          value: '==',
          label: '相等，对字符串区分大小写，字符串或数字类型',
          numOfControls: 1,
          description: '字符串或数字类型',
        },
        {
          value: '<>',
          label: '不等，字符串或数字类型',
          numOfControls: 1,
          description: '字符串或数字类型',
        },
        {
          value: '>',
          label: '大于，字符串或数字类型',
          numOfControls: 1,
          description: '字符串或数字类型',
        },
        {
          value: '<',
          label: '小于，字符串或数字类型',
          numOfControls: 1,
          description: '字符串或数字类型',
        },
        {
          value: '>=',
          label: '大于等于，字符串或数字类型',
          numOfControls: 1,
          description: '字符串或数字类型',
        },

        {
          value: '<=',
          label: '小于等于，字符串或数字类型',
          numOfControls: 1,
          description: '字符串或数字类型',
        },
        {
          value: '[]',
          label: '区间，字符串或数字类型',
          numOfControls: 2,
          description: '区间 以‘,’分割',
        },
        {
          value: '()',
          label: '区间，字符串或数字类型',
          numOfControls: 2,
          description: '区间 以‘,’分割',
        },
        {
          value: '(]',
          label: '区间，字符串或数字类型',
          numOfControls: 2,
          description: '区间 以‘,’分割',
        },
        {
          value: '[)',
          label: '区间，字符串或数字类型',
          numOfControls: 2,
          description: '区间 以‘,’分割',
        },
      ],
      fCHeight: 75, // 组合框的高
      bookmarkForm: { name: '' },
      bookmarked: false,
      // 书签check 返回的bookmark
      bookmarkId: 0,
      //
      firstCheckBookmarkFlag: false,

      dialogBookmark: false,
      bookmarkRules: {
        name: [
          { required: true, message: '收藏名称不能为空' },
          { validator: validateBookmarkName, trigger: 'blur' },
        ],

      },


    };
  },
  created() {


  },
  mounted() {
    // if (this.$route.params.bookmarkId) {
    //   this.boardBookmarkId = parseInt(this.$route.params.bookmarkId);

    // }


  },
  computed: {
    calcFilterConnection() {
      let text = '';
      this.filterConnection.forEach((oFc) => {
        if (oFc.checked) {
          text = oFc.name;
        }
      }, this);
      return text;
    },
  },
  methods: {
    ...mapActions(['setAggValueList', 'setFilterCondition', 'setGroupByValueList']),
    addFilterBody() {
      this.filterBody.push(Object.assign({}, this.filterContent));
      this.updatedFCHeight();
    },

    deleteFilterBody(i) {
      this.filterBody.splice(i, 1);
      this.updatedFCHeight();
    },
    updatedFCHeight() { // 更新组合条件div的高
      this.$nextTick(() => {
        const filterControls = document.querySelector('.filterControls');
        const filterControlsDIV = document.querySelector('.filterControls>div');
        if (filterControls) {
          const oStyle = filterControlsDIV.currentStyle ? this.currentStyle : window.getComputedStyle(filterControlsDIV, null);
          // 获取过虑控件 div 的底部空隙
          const spaceWidth = parseInt(oStyle.marginBottom) + parseInt(oStyle.paddingBottom) + parseInt(oStyle.borderBottomWidth);

          this.fCHeight = filterControls.clientHeight - spaceWidth - 65;
          // console.log('this.fCHeight', this.fCHeight)
        }
      });
    },
    changeConnection(event) {
      const p = event.target;

      this.filterConnection.map((oFc) => {
        oFc.checked = !oFc.checked;
      }, this);
      // 检查书签

      this.checkBookmark();
      // this.query();
    },
    changeFilterTop(index, event) {
      // console.log('changefilteer', index)
      // console.log('this.$store.state.filter', this.$store.state.filter);
      // 当是第一个change，即事件改变时 还原选择
      if (index == 0 && this.filterTop[1]) {
        this.filterTop[1].selected = '';// 还原选择
        this.filterCenter.selected = '';
        this.firstCheckBookmarkFlag = false;
      }
      if (index == 1) {
        // 检查书签
        if (this.firstCheckBookmarkFlag) {
          this.checkBookmark();
        }
      }
      this.$emit('changeFilterTop', { index, event });
    },
    // select 自动宽
    resetSelect(item) {
      if (item) {
        let len = 0;
        for (let i = 0; i < item.label.length; i++) {
          if (item.label.charCodeAt(i) > 127 || item.label.charCodeAt(i) == 94) {
            len += 2;
          } else {
            len += 1;
          }
        }
        // 17 像素
        return `${(len / 2 + 2) * 17}`;
      }
      return '100';
    },
    changeFilterCenter() {
      // 检查书签
      if (this.firstCheckBookmarkFlag) {
        this.checkBookmark();
      }
      //  this.query();

      this.$emit('changeFilterCenter');
    },
    // 由于el-input 不支持lazy，所以只能放在blur里面 v-model.lazy="filter.text",
    filterTextBlur(fliter, event) {
      // console.log(event.target.value)
      fliter.text = event.target.value;
    },
    // 处理  绑定过虑 ，在有书签id的情况下
    handlerFilter() {
      this.firstCheckBookmarkFlag = true;
      // 有书签id的情况下
      if (this.boardBookmarkId) {
        const $vm = this;
        // this.$store.state.filter.aggValueList
        // this.$store.state.filter.filterCondition

        if (this.$store.state.filter.groupByValueList) {
          this.$store.state.filter.groupByValueList.forEach((group, index) => {
            const ogroup = this.filterCenter.options.find(item => group.columnName == item.label);
            if (ogroup && Object.keys(ogroup).length > 0) {
              this.filterCenter.selected = ogroup.value;
            }
          });
        }

        const filter = this.$store.state.filter.filterCondition;

        if (filter) {
          if (filter.length > 0) {
            this.filterConnection.map(item => item.checked = item.key == filter.relation);
          }

          const bindFilter = (filterItem) => {
            const fl = $vm.filterContent.options.find(item => item.label == filterItem.columnName);

            if (fl) {
              this.addFilterBody();

              const emptyFilter = $vm.filterBody.find(item => item.selected == '');

              emptyFilter.selected = fl.value,
                emptyFilter.value = fl.value,
                emptyFilter.label = $vm.filterBody.columnName,
                emptyFilter.elementType = filterItem.columnType,
                emptyFilter.conditions = filterItem.condition,

                emptyFilter.text = filterItem.value;
            }
          };
          if (filter.subCondition && filter.subCondition.length > 0) {
            for (const filterItem of filter.subCondition) {
              bindFilter(filterItem);
            }
          } else {
            bindFilter(filter);
          }
        }
      }
    },
    // 生成 筛选条件
    buildFilter() {
      const evenid = this.filterTop[0].selected;
      const o = this.filterTop[0].options.find(item => item.value == this.filterTop[0].selected);
      const taskid = (o && o.taskId) || '';

      const operatorid = this.filterTop[1].selected || '';

      let aggValueList = [],
        filterCondition = {},
        groupByValueList = []
        ;

      if (Object.prototype.toString.call(this.filterTop[1]) == '[object Object]') {
        const oOperator = this.filterTop[1].options.filter(item => item.value == this.filterTop[1].selected);

        if (oOperator.length == 0) {
          // this.$message.warning('请选择算子！')
          // this.bootmarkLoading = false;

          return;
        }
        // 添加选中的算子到aggValueList中
        oOperator.forEach((item) => {
          aggValueList.push({
            columnName: item.sysElement.elementName,
            columnType: item.sysElement.elementType,
            value: item.operatorValue,
          });
        });
      }

      // if (this.filterCenter.selected != '') {
      // filterCondition 过虑条件处理
      const subCondition = [];
      // console.log('this.filterBody', this.filterBody)
      // console.log('this.filterContent', this.filterContent)
      // 验证


      const { verifyFlag, verifyError } = this.verifyFilter();

      if (!verifyFlag) {
        // this.$message.warning(verifyError);
        return;
      }
      this.filterBody.forEach((item) => {
        // console.log('item', item)

        const selectitem = item.options.find(it => it.value == item.selected);
        subCondition.push({
          columnName: selectitem.label,
          columnType: selectitem.elementType,
          condition: item.conditions,
          value: item.text,
        });
      });
      // console.log('subCondition', subCondition);
      if (this.filterBody.length > 0) { // 且 或
        filterCondition.relation = this.filterConnection.find(item => item.checked == true).key;
      }
      if (subCondition.length > 1)// 如果有多个condition，结果要放在subcondition里面以数组传
      {
        filterCondition.subCondition = subCondition;
      } else { // 否则，放在filtercondition 下面，不用放在subcondition里面
        filterCondition = { relation: filterCondition.relation, ...subCondition[0] };
      }

      // groupByValueList 组合查询 处理
      const groupByList = this.filterCenter.options.filter(item => item.value == this.filterCenter.selected);
      // 以后可能是多选的
      groupByList.forEach((item) => {
        if (this.filterCenter.selected != '') { // 选择总数时，为空
          groupByValueList.push({
            columnName: item.label,
            columnType: item.elementType,
            value: '*', // 这个目前统一为* ，后期按需求再改，比如 年龄：[10,20,30]....
          });
        }
      });
      // }
      // console.log('filterCondition',filterCondition)
      this.setAggValueList(aggValueList);
      this.setFilterCondition(filterCondition);
      // console.log(234)
      this.setGroupByValueList(groupByValueList);
    },
    query() {
      const { verifyFlag, verifyError } = this.verifyFilter();
      // console.log('11111')
      // console.log('verifyFlag', verifyFlag)
      if (!verifyFlag) {
        this.$message.warning(verifyError);
        return;
      }
      this.buildFilter();
      this.$emit('query', {});
    },
    // 校验筛选条件是否存在
    async checkBookmark() {
      // filterContent 发生两次改变后（也就是第一次进入时，其它请求结束并绑定后）

      const evenid = this.filterTop[0].selected;
      const o = this.filterTop[0].options.find(item => item.value == this.filterTop[0].selected);
      const taskid = (o && o.taskId) || '';

      this.buildFilter();

      const bookmark = {
        appId: this.$store.state.global.appId,
        // "analysisId": this.analysisId,
        // "operatorId": operatorid,

        eventId: evenid,
        taskId: taskid,
        aggValueList: this.$store.state.filter.aggValueList,
        filterCondition: this.$store.state.filter.filterCondition,
        groupByValueList: this.$store.state.filter.groupByValueList,
      };

      await this.$axios.post('/api/bdp-ubas/BookmarkController/conditions/check', bookmark).then((res) => {
        if (res.code == 0) {
          // 检查是否存在，如果 res.result >0说明存在
          this.bookmarkId = res.result;
        }
      });
    },
    openBookmark() {
      const { verifyFlag, verifyError } = this.verifyFilter();
      if (!verifyFlag) {
        this.$message.warning(verifyError);
        return;
      }


      // console.log('11111')
      // console.log('verifyFlag', verifyFlag)

      this.dialogBookmark = true;
    },
    // 新增书签
    addBookmark(bookmark) {
      this.$axios.post('/api/bdp-ubas/BookmarkController/info', bookmark).then((res) => {
        if (res.code == 0) {
          this.$message.success('提交成功！');
          this.bookmarkId = res.bookmarkId;
          // this.$router.push({ path: '/dataViews/anl' + this.analysisId + '/' + res.bookmarkId });
          // this.bookmarked = true;
        } else {
          this.$message.warning(res.msg);
        }
        this.dialogBookmark = false;
      });
    },
    updateBookmark(bookmark) {
      this.$axios.put('/api/bdp-ubas/BookmarkController/conditions', bookmark).then((res) => {
        if (res.code == 0) {
          this.$message.success('提交成功！');

          // this.$router.push({ path: '/dataViews/anl' + this.analysisId + '/' + res.bookmarkId });
          // this.bookmarked = true;
        } else {
          this.$message.warning(res.msg);
        }
        this.dialogBookmark = false;
      });
    },
    // 书签管理
    submitBookmark(formName, type) {
      // this.bootmarkLoading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');

          const evenid = this.filterTop[0].selected;
          const o = this.filterTop[0].options.find(item => item.value == this.filterTop[0].selected);
          const taskid = (o && o.taskId) || '';

          const operatorid = this.filterTop[1].selected || '';


          // this.buildFilter();
          // if(!this.$store.state.global.userCode)
          // {
          //   this.$message.warning('请重新登录！');
          //   return;
          // }
          // 书签对象
          const bookmark = {
            appId: this.$store.state.global.appId,
            analysisId: this.analysisId,
            operatorId: operatorid,
            bookmarkName: this.bookmarkForm.name,
            eventId: evenid,
            taskId: taskid,
            createrId: this.$store.state.global.userCode || '80002797',
            aggValueList: this.$store.state.filter.aggValueList,
            filterCondition: this.$store.state.filter.filterCondition,
            groupByValueList: this.$store.state.filter.groupByValueList,
          };

          if (type == 1) {
            // 点另存为时  即新增
            this.addBookmark(bookmark);
          } else if (this.boardBookmarkId == 0) {
            // 从行为分析 进来的情况
            if (this.bookmarkId == 0) {
              // 新增

              this.addBookmark(bookmark);
            } else {
              // 已存在书签，直接显示修改
              // bookmark
              bookmark.bookmarkId = this.bookmarkId;
              this.updateBookmark(bookmark);
            }
          } else if (this.boardBookmarkId > 0) {
            // 从看板进来的情况、
            if (this.bookmarkId == 0) {
              // 没改条件情况，直接改名 或者 另存为（另存为在type==1执行）
              bookmark.bookmarkId = this.boardBookmarkId;
              this.updateBookmark(bookmark);
            } else {
              // 修改条件后，刚好和其它已存书签一样，这种情况要修改冲突的书签， 只显示修改按钮，不显示另存为
              bookmark.bookmarkId = this.bookmarkId;
              this.updateBookmark(bookmark);
            }
          }
        }
      });
    },
    // 获取筛选条件项
    curCondition(filter) {
      return this.conditions.find(item => item.value == filter.conditions);
    },
    // 验证 筛选条件
    verifyFilter() {
      // 验证 筛选表单控件是否存在末填或末选
      let verifyFlag = true,
        verifyError = '';
      // console.log('verifyFlag', verifyFlag);
      // console.log(this.filterBody)
      this.filterBody.forEach((filter) => {
        if (!filter.selected) {
          verifyError = '请选择元素';
          verifyFlag = false;
        }
        if (!filter.conditions) {
          verifyError = '请选择关系运算符';
          verifyFlag = false;
        } else {
          const conditionItem = this.conditions.find(item => item.value == filter.conditions);


          if (conditionItem) {
            // 如果无需填值路过
            if (conditionItem.numOfControls > 0 && !filter.text) {
              verifyError = '请输入运算值';
              verifyFlag = false;
            }
            // 如果是区间
            if (conditionItem.numOfControls == 2 && filter.text && filter.text.split(',').length != 2) {
              // console.log('verifyFlag3', verifyFlag);
              verifyError = '区间必须用逗号分割';
              verifyFlag = false;
            }
          }
        }
        // console.log('verifyFlag2', verifyFlag);
      });

      return { verifyFlag, verifyError };
    },


  },
  watch: {
    filterContent: {
      handler(curVal, oldVal) {
        this.filterBody = [];
        this.filterCenter.options = [{ value: '', label: '总数' }, ...curVal.options];

        this.handlerFilter();


        this.buildFilter();
      },
      deep: true,
    },
    filterBody: {
      handler(curVal, oldVal) {
        // if (curVal.length > 0) {
        // filterBody 结构： conditions:""， name:"element" ，options:Array(2)， selected:"" ，text:""
        // 判断规则 1，conditions不能为空，
        // 2，selected不能为空 ；
        // 3，text对应condtions对象的numOfControls数量，即numOfControls为0时可以为空，numOfControls为1和2时不能为空且当numOfControls为2时，要存在逗号分隔
        // 当满足以上条件后 执行query动作
        const { verifyFlag, verifyError } = this.verifyFilter();
        if (verifyFlag) {
          // 检查是否存在书签
          this.checkBookmark();
          // 查询动作
          // this.query();
        }
        // }
      },
      deep: true,
    },
    bookmarkModel: {
      handler(curVal, oldVal) {
        this.bookmarkForm.name = this.bookmarkModel.bookmarkName;
      },
      deep: true,

    },
  },
};
</script>
<style lang="scss">
.sf-panel.sf-filter {
  padding-top: 0px;
  box-shadow: 0 0 30px #C8DCF2;

  a.create {
    text-decoration: underline;
    color: #007DFD;
    cursor: pointer;
  }

  .gray {
    color: #A4A4A4;
  }
  .split {
    line-height: 36px;
    padding: 0 5px 0 8px;
  }
  .el-select {
    width: auto;
    &>.el-input {
      font-size: 16px;
    }
    .el-input__inner {
      color: #2B2E33;
      letter-spacing: 0;
    }
  }
  .trbtn {
    margin: 0 10px;
  }
  .bookmark {
    color: #9EAAC2;
    cursor: pointer;
    line-height: 34px;
    font-size: 14px;
    i {
      position: relative;
      top: 2px;
      font-size: 18px;
    }
    .on {
      color: #FFB900;
    }
  }

  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.filterbox {
      min-height: 100px;
    }
  }

  .flex1 {
    flex: 1;
    margin: 0 10px;
  }

  .delFilter {
    color: #FF6E72;
    i {
      font-size: 20px;
    }
  }

  .filter-left {
    /*flex: 0 0 150px;*/
    .el-input__inner {
      border: none;
    }
  }

  .filter-right {
    flex: 0 0 200px;
    .flex-content {
      display: flex;
      padding: 0 0 0 100px;
      flex-direction: column;
      .el-button {
        margin: 18px 0;
      }
    }
  }

  .filter-con {
    flex: 0 0 33px;
  }

  .flex2 {
    flex: 1;
    margin: 0 10px;
  }

  .flex6 {
    flex: 6;
    margin: 0 10px 0 50px;
    .el-input__icon {
      color: #007dfd;
    }
  }

  .el-input__icon {
    width: 20px;
  }
  .el-input__icon+.el-input__inner {
    padding-right: 20px;
  }
  .panel-heading {
    background-color: #fff;
    margin: 0px 30px;
    padding-left: 0;

    padding-top: 18px;
    padding-bottom: 9px;
    .el-input__inner {
      border: none;
    }
  }
  .panel-body {
    margin: 0px 30px;
    padding: 15px 0;
  }
  /*
  .flex8 {
    width: 140px;
  }
*/
  .panel-body .el-row {
    padding-bottom: 18px;
  }

  .transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #20A0FF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }

  .filterControls {
    margin: 0; // transition: all 1s;
    a.create {
      margin-top: -46px;
    }
    .filterRow {
      padding-bottom: 10px;
    }
  }
  .el-select-dropdown__item {
    color: #b2bbce;
  }
  .connectionBox {
    margin-top: 20px;
    position: relative;
    border: 1px solid #13C1AD;
    border-right: none;
    width: 3.1667%;
    margin-left: 3%;
    div::before {
      content: attr(message_and);
      display: block;
      margin-left: -10px;
      width: 30px;
      height: 30px;
      border: 1px solid #13C1AD;
      background-color: #13C1AD;
      color: #fff;
      border-radius: 20px;
      position: absolute;
      left: -10px;
      top: 50%;
      margin-top: -15px;
      line-height: 30px;
      cursor: pointer;
      transition: transform 0.6s;
      transform: rotateY(180deg);
    }
    div.on::before {
      transform: rotateY(0deg);
      z-index: 2;
    }

    div::after {
      border-radius: 20px;
      margin-left: -10px;
      content: attr(message_or);
      display: block;
      width: 30px;
      height: 30px;
      border: 1px solid #13C1AD;
      background-color: #13C1AD;
      color: #fff;
      position: absolute;
      left: -10px;
      top: 50%;
      margin-top: -15px;
      line-height: 30px;
      cursor: pointer;
      transform: rotateY(0deg);
      transition: transform 0.6s;
    }
    div.on::after {
      transform: rotateY(180deg);
    }
  }
}
</style>
