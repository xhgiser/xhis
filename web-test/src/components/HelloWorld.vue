<template>
  <div>
    <p>hello vue</p>
    <el-icon><ChatRound /></el-icon>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "less" scoped>
p{
  color:blue
}
</style>