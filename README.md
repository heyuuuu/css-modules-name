# css-modules-name

基于css-loader(modules)

# webpack 开启modules配置
```
    loader: "css-loader",
    options: {
        modules: {
            auto: true,
            localIdentName: "[local]--[hash:base64:5]"
        }
    }
```
### 引入方式
```
import cssModules, { coat } from "css-modules-name"
```

# API

## cssModules(modules?: Stylesheet | Stylesheet[], options?: {cache?: boolean, unused?: boolean})    

>* modules: 传入单个样式表对象或者样式表对象数组集合
>* config.cache: 是否启用缓存
>* config.unused 是否保留未使用的类名
>* 返回classnames函数

## classnames(names: string | object | Array<string|object>)

>* classnames("#container") 前置#代表为混合类名，解析为"container container-hash"
>* classnames("!container") 前置!代表为全局类名, 解析为 "container"
>* classnames("container") 解析为 "container-hash5"
>* classnames("#container !flex card"，{active: true, show: false}, ["#visible"]) 解析为 "container container-hash flex active-hash visible visible-hash"

## coat(names: string | object | Array<string|object>)

该函数为包裹函数，将所有类名包裹为全局类名