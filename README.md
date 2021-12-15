
###  vue-client

####  Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```
#### monaco-editor plugin
```
"monaco-editor-webpack-plugin": "^4.1.1",

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
vue.config.js
    chainWebpack: config => {
        config.plugin("monaco").use(new MonacoWebpackPlugin());
    }
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

![hjs-cms.jpg](https://webhjs.github.io/su/img/hjs-cms.jpg)
![cms.jpg](https://webhjs.github.io/su/img/cms.jpg)


