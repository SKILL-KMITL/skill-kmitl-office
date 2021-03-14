<template>
  <div id="components-layout-root">
    <a-layout>
      <a-layout-sider>Sider</a-layout-sider>
      <a-layout>
        <a-layout-header>Header</a-layout-header>
        <a-layout-content>Content</a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
