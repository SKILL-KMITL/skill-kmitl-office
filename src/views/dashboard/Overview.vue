<template>
  <div>
    Overview
    <v-btn @click="login()">Login Gmail</v-btn>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Dashboard from "./Dashboard.vue";
import OneGraphAuth from "onegraph-auth";

@Component({})
export default class Overview extends Dashboard {
  auth = new OneGraphAuth({
    appId: "df4d06d4-c224-44d0-a660-63a685705e51"
  });
  mounted() {
    this.auth.isLoggedIn("gmail").then((isLoggedIn: unknown) => {
      if (isLoggedIn) {
        console.log("Already logged in to Gmail");
      } else {
        console.log("Not logged in to Gmail.");
      }
    });
  }

  public login() {
    this.auth.login("gmail");
  }
}
</script>
