const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        path.join(__dirname, "src", "js", "initializing.ts"),
        path.join(__dirname, "src", "index.html"),
        "webpack-dev-server/client?http://localhost:8080",
    ],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".jsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                loaders: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "images/[name].[ext]",
                        },
                    },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader?name=[name].[ext]",
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "postcss-loader",
                        "less-loader",
                    ],
                }),
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
            {
                test: /index\.html/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "index.html",
                        },
                    },
                    "extract-loader",
                    "html-loader",
                ],
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
    },
};