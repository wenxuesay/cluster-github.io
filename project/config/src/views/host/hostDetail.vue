<template lang="pug">
  div
    .sf-panel
      .panel-heading(style="font-size:20px;") 主机信息
      .panel-body
        el-row(:gutter="20")
          el-col.ztext(:span="8",v-for="(item,i) in items",:key="i") {{item.label}}:{{item.value}}
    //- .sf-panel
    //-   .panel-heading 操作系统
    //-   .panel-body
    //-     el-row(:gutter="20")
    //-       el-col(:span="8",v-for="item in items") {{item.key}}:{{item.name}}
    //- .sf-panel
    //-   .panel-heading 硬件信息
    //-   .panel-body
    //-     el-row(:gutter="20")
    //-       el-col(:span="8",v-for="item in items") {{item.key}}:{{item.name}}

</template>
<script>
export default {
  data() {
    return {
      items: [
        { label: 'FQDN', value: 'hadoop01.sfdc.com' },
        { label: 'FQDN', value: 'hadoop01.sfdc.com' },
        { label: 'FQDN', value: 'hadoop01.sfdc.com' },
      ],
    };
  },
  mounted() {
    const id = this.$route.params.id;
    const $vm = this;
    this.$axios.get(`/back/get/hostdetail/${id}`).then((res) => {
      if (res.status === 'ok') {
        this.items = [];
        Object.keys(res.result).forEach((k) => {
          $vm.items.push({
            label: res.mapping[k] ? res.mapping[k] : k,
            value: res.result[k],
          });
        });
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.ztext{
  margin: 18px auto;
}
</style>

{
  os: 'centos7'
}




