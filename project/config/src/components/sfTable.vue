<template lang="pug">
.sf-table-top
  .sf-table
    el-table(:data="tData",border,v-loading="this.$store.state.global.loading",@sort-change="sortable",@selection-change="selectionChange",ref="multipleTable",show-overflow-tooltip="true"
    )
      //- slot(name="checkbox")
      el-table-column(v-if="tableSearch && Array.isArray(tableSearch.selection)",type="selection")
      slot(name="a")
      el-table-column(v-for="column in tColumns",:key='column.prop',:prop="column.prop",:label="column.label",:sortable="column.sortable",min-width="100px")
      slot(name="actions")
    el-pagination(v-if="tableSearch && tableSearch.pageSize" @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 50]"
      :page-size="tableSearch.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableSearch ? tableSearch.total:0")
</template>
<script>
export default {
  props: ['title', 'tColumns', 'tData', 'excel', 'tableSearch'],
  data() {
    return {
    };
  },
  methods: {
    handleSizeChange(val) {
      // this.$emit('search', {
      //   pageSize: val,
      // });
      this.tableSearch.pageSize = val;
    },
    handleCurrentChange(val) {
      // this.$emit('search', {
      //   currentPage: val,
      // });
      this.tableSearch.currentPage = val;
    },
    searchAction() {
      this.$emit('search', {
        key: this.select.selected,
        value: this.filter,
      });
    },
    selectionChange(val) {
      this.tableSearch.selection = val;
    },
    sortable(val) {
      this.tableSearch.order = val.order;
      this.tableSearch.prop = val.prop;
      this.$emit('search', {});
    },
    buttonClick(type) {
      this.$emit('search', {
        type: 'button',
        text: type,
      });
    },
    restSearch() {
      this.$emit('search', {
        type: 'restSearch',
      });
    },
    handleIconClick() {
      this.$emit('search', {
        type: 'keyWordChange',
      });
    },
    exportExcel() {
      this.$emit('search', { type: 'excel', name: this.excel });
    },
  },
  watch: {
    'tableSearch.selection': {
      handler() {
        if (this.tableSearch.selection.length === 0) {
          this.$refs.multipleTable.clearSelection();
        }
        // console.log('hello');
        // this.$emit('search', {});
      },
      deep: true,
    },
    'tableSearch.currentPage': {
      handler() {
        if (this.tableSearch.selection.length === 0) {
          this.$refs.multipleTable.clearSelection();
        }
        this.$emit('search', {});
      },
      deep: true,
    },
    'tableSearch.pageSize': {
      handler() {
        if (this.tableSearch.selection.length === 0) {
          this.$refs.multipleTable.clearSelection();
        }
        this.$emit('search', {});
      },
      deep: true,
    },
    // selection() {
    //   if (this.selection.selection.length === 0) {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // },
  },
};
</script>
<style lang="scss">
/* 表格样式 */

.sf-table {
    // border: 1px solid $border-color;
    border-radius: $border-radius;
    .el-pagination {
        border-top: 1px solid #efefef;
        padding:18px 0;
        text-align: right;
        input {
            line-height:26px;
        }
       .btn-prev {
            border: 1px solid $border-color;
            border-right: none;
            padding-right: 5px;
        }
        .btn-next {
            border: 1px solid $border-color;
            border-left: none;
             padding-left: 5px;
        }
        .el-pager {
            .number {
                border: 1px solid $border-color;
                color: $font-color;
                font-weight: 100;
                border-right: none;
                &:last-child {
                    border-right: 1px solid $border-color;
                }
                &:hover,&.active {
                    color: #fff;
                    background: $pr;
                }
            }
        }
    }
}
.el-table {
  // border-radius: 5px;
  th {
    background-color: #F2F2F2 !important;
    padding: 5px 0;
    min-width: 120px;
    // border-right: 1px solid #efefef;
    // padding-top: 10.5px;
    // padding-bottom: 10.5px;
    &>.cell {
        text-align: left;
        color: #333;
        font-weight: bold;
        .el-checkbox {
            padding-left: 6px;
        }

        white-space: nowrap;
    }
  }
  td {
    padding: 7px;
    border-color: #efefef;
    button {
      padding: 3px 10px;
      font-size: 10px;
    }
  }
}
</style>
