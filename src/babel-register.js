import babelRegister from "@babel/register";

babelRegister({
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  ignore: [/node_modules/],
});