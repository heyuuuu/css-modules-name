# css-modules-name

基于css-loader(modules)

前置“$”符号表示该变量为全局变量

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
import cssModules, { classnames , lock} from "css-modules-name"
```

# API

## cssModules(modules: Stylesheet | Stylesheet[], config?: {strict?: boolean, alias?: object})    

>* modules: 传入单个样式表对象或者样式表对象数组集合
>* config.strict: 是否启用严格模式，如果启用，那么将会去样式表中查找该样式名，如果没有找到该样式名，那么该样式名不会参数解析,慎用
>* config.alias 样式别名,例如: {pre: "home"},会去替换对应的样式名称，{name}-container 解析为home-container
>* 返回classnames函数

## classnames(names: string | object | Array<string|object> )

>* classnames("$container") 前置$代表为全局变量，解析为"container container-hash"
>* classnames("container card") 简答解析, 解析为 "container-hash5 card-hash5"
>* classnames(["card"]) 解析为 "card-hash5"
>* classnames({active: true}) 解析为 "active-hash"


## lock(classnames: string)

>* 该函数针对于子组件内开始strict严格模式，导致props传入类名不解析做出处理，可使用该lock包裹props.classname即可

## DEMO

##### topic.less

```
.topic-container {
    background-color: red;
}

.block {
    display: block;
}

.item {
    justify-items: center;
}
```

##### Topic.tsx

```
import React from "react"
import cssModules, { classnames as cn, lock} from "css-modules-name"
import styles from "./topic.less"

const cm = cssModules([styles], {
    // 是否启用严格模式，请慎用
    strict: true
})
const cs = cssModules([styles])
const ct = cssModules([], {
    // 样式别名
    alias: {
        pre: "public"
    }
})

interface Props {
    classname?: string
}

function Item1(props: Props) {
    return <div className={cm("block container", props.classname)}>Item1</div>
}

function Item2(props: Props) {
    return <div className={cm("$block container", lock(props.classname))}>Item2</div>
}

function Item3(props: Props) {
    return <div className={cn("$block container", lock(props.classname))}>item3</div>
}

function Item4(props: Props) {
    return <div className={cs("$block container", props.classname)}>item4</div>
}

function Item5(props: Props) {
    return <div className={ct("$block container {pre}-item", props.classname)}>item5</div>
}

function Topic(props: Props) {
    return <div className={cm("topic-container", lock(props.classname))}>
        <Item1 classname={cm("item")} />
        <Item2 classname={cm("item")} />
        <Item3 classname={cm("item")} />
        <Item4 classname={cm("item")} />
        <Item5 classname={cm("item")} />
    </div>
}

export default Topic
```


##### common.less

```
.card {
    width: 100px;
}
```

##### home.less

```
.home-page{
    &-container {
        background-color: red;
    }
}

.card {
    height: 100px;
}
```

##### Home.tst

```
import React from "react"
import cssModules from "css-modules-name"
import Topic from "../Topic"
import common from "./common.less"
import styles from "./home.less"

const cm = cssModules([common, styles], {
    strict: true,
    alias: {
        pre: "home-page"
    }
})

function Home() {
    return <div className={cm("{pre}-container")}>
        <Topic classname={cm("card")} />
    </div>
}

export default Home
```

### render

```
<div class="home-page-container--Hc9c2">
    <div class="topic-container--w8B00 card--Crctz card--S3yyf">
        <div class="block--HzkuU">item1</div>
        <div class="block block--HzkuU item--s9JA6">item2</div>
        <div class="block container item--s9JA6">item3</div>
        <div class="block block--HzkuU container item--s9JA6">item4</div>
        <div class="block container public-item item--s9JA6">item5</div>
    </div>
</div>
```