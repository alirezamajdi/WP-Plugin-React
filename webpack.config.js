const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    index: "./src/index.tsx",
    block: "./src/block.ts",
    editor: "./src/editor.scss",
  },
  output: {
    path: __dirname + "/build",
    filename: "[name].js",
    publicPath: "/wp-content/plugins/contact-signup/build/",
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  resolve: {
    ...defaultConfig.resolve,
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};
