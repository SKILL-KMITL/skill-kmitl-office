<template>
  <div style="height: 100%" class="d-flex">
    <iframe
      src="https://skill.kmitl.ac.th"
      style="width: 100%; border: none; min-height: 90vh"
    ></iframe>
  </div>
</template>

<script lang="ts">
import gql from "graphql-tag";
import { Component } from "vue-property-decorator";
import Dashboard from "./Dashboard.vue";

@Component({})
export default class Overview extends Dashboard {}
</script>
