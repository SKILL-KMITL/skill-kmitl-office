<template>
  <v-app id="inspire" class="dashboard-container">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      mini-variant-width="90"
      app
      width="270"
    >
      <v-list-item class="px-2 py-2">
        <v-list-item-avatar size="64">
          <v-img :src="require(`@/assets/images/brand.png`)"></v-img>
        </v-list-item-avatar>

        <v-list-item-title
          ><div class="title font-weight-bold">Skill Mapping</div>
          <div class="font-weight-light">
            ระบบแมพสกิลหลักสูตร
          </div></v-list-item-title
        >
      </v-list-item>
      <v-divider></v-divider>
      <v-list class="py-0">
        <!-- <v-list-item-group > -->
        <v-list-item
          v-for="[icon, text, rname, auth, disabled] in links"
          :key="icon"
          :to="{ name: rname }"
          :class="{ 'bg-active': $route.name == rname }"
          :color="
            disabled ? '' : auth ? (userIsLoggedIn ? 'white' : '') : 'white'
          "
          :disabled="
            disabled ? true : auth ? (userIsLoggedIn ? false : true) : false
          "
        >
          <v-list-item-icon>
            <v-icon color="dark">{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{
              text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Content -->
    <v-main>
      <!-- Toolbar -->
      <v-toolbar color="white2" flat height="95.94">
        <div>
          <v-app-bar-nav-icon @click="drawerTrigger()"></v-app-bar-nav-icon>
        </div>
        <v-list color="transparent">
          <v-list-item>
            <v-list-item-icon class="mr-2">
              <v-icon color="primary">{{ currentLink[0] }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-bold title">{{
                currentLink[1]
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div
          style="width: 100%;"
          class="text-right d-flex flex-row justify-end"
        >
          <div class="mr-3 d-none d-md-block" v-if="userData">
            {{ userData.email }}
          </div>
          <a @click="logoutActive()" v-if="userIsLoggedIn">
            Logout
          </a>
          <a @click="loginActive()" v-else>
            Login
          </a>
        </div>
      </v-toolbar>

      <!-- Views -->
      <v-container fluid class="content-fluid white2 py-8 pb-4 px-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { logout, login } from "@/router/middleware";
import { userStore } from "@/store";

@Component({})
export default class Dashboard extends Vue {
  public logoutActive() {
    logout().then(() => {
      this.$swal("Logout", "ออกจากระบบ", "success").then(() => {
        if (this.$route.name == "DOverview") {
          this.$router.go(0);
        } else {
          this.$router.push({ name: "DOverview" });
        }
      });
    });
  }

  public loginActive() {
    login().then(() => {
      this.$swal("Logged In", "เข้าสู่ระบบ", "success").then(() => {
        if (this.$route.name == "DOverview") {
          this.$router.go(0);
        } else {
          this.$router.push({ name: "DOverview" });
        }
      });
    });
  }

  get userIsLoggedIn() {
    return userStore.userIsLoggedIn;
  }

  get userData() {
    return userStore.userData;
  }

  drawer = true;
  mini = true;
  links = [
    ["mdi-apps", "Overview", "DOverview", 0],
    ["mdi-briefcase-outline", "Manage Career", "DCareer", 1, true],
    ["mdi-cast-education", "Manage Course", "DCourse", 1]
    // ["mdi-chart-line-variant", "Graph", "DGraph", 1]
  ];

  get currentLink() {
    return this.links.filter(item => item[2] == this.$route.name)[0];
  }

  created() {
    this.drawerTrigger();
  }

  drawerTrigger() {
    if (this.$vuetify.breakpoint.lgAndUp) {
      this.drawer = true;
      this.mini = this.mini ? false : true;
    } else {
      this.mini = false;
      this.drawer = this.drawer ? false : true;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/settings/_variables";
.bg-active {
  background: #e35205;
  box-shadow: 0 5px 0 0 #b84508;
  .v-list-item__title,
  .v-list-item__icon {
    color: #fff;
  }
}
.content-fluid {
  height: calc(100vh - 95px);
  min-height: calc(100vh - 95px);
}
@media #{map-get($display-breakpoints, 'md-and-down')} {
  .content-fluid {
    height: auto;
    min-height: calc(100vh - 95px);
  }
}

.v-list-item {
  padding-top: 10px;
  padding-bottom: 10px;
}

.v-toolbar {
  box-shadow: 0 1px 0 0 rgba($color: #e0e0e0, $alpha: 0.8) !important;
}
</style>
