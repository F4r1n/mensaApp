const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: "./src/App.js",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|jpg|gif|swf)$/,
        use: "file-loader"
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
        use: "file-loader"
      },
      {
        test: /\.(js|jsx)$/,
        use: "imports-loader?define=>false",
        include: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js"
  },
  node: {
    fs: "empty"
  }
};
