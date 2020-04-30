<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {}
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin: 60px;
}

.app-text-area {
  width: 100%;
  min-height: 100px;
  display: flex;
  margin: auto;
}
</style>
