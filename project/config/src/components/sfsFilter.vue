<template lang="pug">
    .sf-simplate-filter
        el-form(:inline="true",:model="form",v-if="form")
            el-form-item(v-for="(item,i) in filters",:label="item.label",:key="i")
                el-input(v-if="!item.options",v-model="item.value",:placeholder="item.placeholder")
                el-select(v-if="item.options",v-model="item.value",:placeholder="item.placeholder")
                    el-option(v-for="option in item.options",:label="option.label",:key="option.value",:value="option.value")
            el-form-item
                button.btn-primary(@click.prevent="search") 查询
                button.btn-default(@click.prevent="reset") 重置
</template>
<script>
export default {
  props: ['filters'],
  computed: {
    form() {
      const obj = {};
      this.filters.forEach((v) => {
        obj[v.key] = v.value;
      });
      return obj;
    },
  },
  data() {
    return {
    };
  },
  methods: {
    search() {
      this.$emit('search', this.form);
    },
    reset() {
      this.filters.forEach((v, i) => {
        this.filters[i].value = '';
      });
    },
  },
};
</script>
<style lang="scss">
.sf-simplate-filter {
  @include mb();
  border: 1px solid $border-color;
  border-left: 6px solid $pr;
  border-radius: $border-radius;
  padding: 10px 20px;
  .el-form-item__content {
    line-height: 36px;
    .el-range-input {
      line-height: 36px;
    }
  }
  .el-form-item {
    margin: 9px 10px 9px 0;
  }
  .el-form-item__label {
    line-height: 36px;
  }
  .el-input__inner {
    height: 36px;
    border-color: $border;
    line-height: 36px;
  }
  .el-form-item {
    margin: 9px 10px 9px 0;
  }
}
</style>


