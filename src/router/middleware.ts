import OneGraphAuth from "onegraph-auth";
import jwtDecode from "jwt-decode";
import { userStore } from "@/store";

const auth = new OneGraphAuth({
  appId: "df4d06d4-c224-44d0-a660-63a685705e51"
});

export function titleMiddleware(router: any) {
  router.beforeEach((to: any, from: any, next: any) => {
    document.title = to.meta.title || "Skill Mapping - KMITL";
    next();
  });
}

export function login() {
  return new Promise((resolve, reject) => {
    auth.login("gmail").then((resp: any) => {
      if (resp) {
        userStore.setUser(jwtDecode(resp.token.accessToken));
        userStore.updateUser({ key: "isLoggedIn", value: true });
        return resolve(true);
      } else {
        return reject(false);
      }
    });
  });
}

export function logout(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    auth.logout("gmail").then(response => {
      if (response.result === "success") {
        userStore.resetUser();
        localStorage.removeItem(`oneGraph:${auth._storageKey}`);
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
}

export function isLoggedIn(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    auth.isLoggedIn("gmail").then(resp => {
      if (resp) {
        if (!userStore.user.isLoggedIn) {
          userStore.setUser(
            jwtDecode(auth.authHeaders().Authorization.split(" ")[1])
          );
          userStore.updateUser({ key: "isLoggedIn", value: true });
        }
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
}

export function authMiddleware(router: any) {
  router.beforeEach(async (to: any, from: any, next: any) => {
    next();
  });
}
