<template>
  <div>
    Overview
    {{ career_fields }}
  </div>
</template>

<script lang="ts">
import gql from "graphql-tag";
import { Component } from "vue-property-decorator";
import Dashboard from "./Dashboard.vue";

@Component({
  apollo: {
    // eslint-disable-next-line @typescript-eslint/camelcase
    career_fields: gql`
      query Query {
        career_fields {
          name
        }
      }
    `
  }
})
export default class Overview extends Dashboard {}
</script>
