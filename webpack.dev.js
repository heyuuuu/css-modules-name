const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
	mode: "development",
	entry: ["./src/demo/index.tsx"],
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		alias: {
			"@": path.join(__dirname, "src")
		}
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts)$/,
				loader: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.(css|less)$/,
				use: [MiniCssExtractPlugin.loader, {
					loader: "css-loader",
					options: {
						modules: {
							auto: /\.less$/,
							localIdentName: "[local]--[hash:base64:5]"
						}
					}
				}],
				// exclude: /node_modules/
			},
			{
				test: /\.less$/,
				loader: "less-loader",
			},
		]
	},
	plugins: [
		new ReactRefreshWebpackPlugin(),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			publicPath: "/",
			template: "./src/demo/index.html",
			inject: "body"
		})
	],
	devServer: {
		allowedHosts: "all",
		port: 9000,
		hot: true
	},
}