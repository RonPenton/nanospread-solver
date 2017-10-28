module.exports = {
    context: __dirname,
    entry: "./src/index.ts",
    output: {
        filename: "index.js",
        path: __dirname + "/src"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["ts-loader"]
            }
        ]
    }
};