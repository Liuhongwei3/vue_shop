<template>
  <div>
    <h3>Welcome~</h3>
    <el-tag type="primary" effect="dark" @click="toTadm">
      关于  𝓣𝓪𝓭𝓶
    </el-tag>
  </div>
</template>

<script>
  export default {
    name: "Welcome",
    methods: {
      toTadm() {
        window.location.href = 'https://liuhongwei3.github.io/';
      }
    },
  }
</script>

<style scoped>
  .el-tag{
    font-size: 18px;
  }
.el-tag:hover{
  cursor: pointer;
}
</style>
