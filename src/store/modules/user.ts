import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { User } from "@/@types/user";

// https://github.com/championswimmer/vuex-module-decorators
@Module({
  name: "user",
  namespaced: true,
  stateFactory: true
})
export default class UserStore extends VuexModule {
  user: User = new User();

  @Mutation
  setUser(data) {
    this.user = data;
  }

  @Mutation
  updateUser(data: Record<string, any>) {
    this.user[data.key] = data.value;
  }

  @Mutation
  resetUser() {
    this.user = new User();
  }

  get userIsLoggedIn() {
    return this.user.isLoggedIn;
  }

  get userData() {
    return this.user.user;
  }
}
