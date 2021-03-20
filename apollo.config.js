module.exports = {
  client: {
    service: {
      name: "SKILL-KMITL",
      url: "http://127.0.0.1:8080/v1/graphql"
    },
    // Files processed by the extension
    excludes: ["node_modules/**/*"],
    includes: ["src/**/*.vue", "src/**/*.ts"]
  }
};
