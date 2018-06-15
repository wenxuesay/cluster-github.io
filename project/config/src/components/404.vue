<template lang="pug">
  section.sf-content
    .sf-panel
      .panel-heading 404
      .panel-body
        h4 您访问页面不存在,{{time}}秒后跳转
</template>
<script>
export default {
  data() {
    return {
      time: 3,
    };
  },
  methods: {
  },
  mounted() {
    const $vm = this;
    setInterval(() => {
      $vm.time -= 1;
      if ($vm.time === 0) {
        $vm.$router.replace({
          path: '/',
        });
      }
    }, 1000);
  },
};
</script>
