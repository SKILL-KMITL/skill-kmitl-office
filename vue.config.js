module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
        indentedSyntax: true
      },
      scss: {
        // additionalData: `@import "~@/assets/scss/variables.scss";`
      }
    }
  },
  configureWebpack: {
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            }
          }
        }
      }
    }
  }
};
