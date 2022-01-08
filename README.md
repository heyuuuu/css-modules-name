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

# cssModules(string | object | Array(string | object))

```
import cssModules from "css-modules-name"
import styles from "./index.less"

const cm = cssModules(styles)

<div className={cm("home-container $m-t-5")} />
```

如果在开启cssmodule的情况下，且index.less中存在.home-container样式名

```
<div className="home-container--GRQwP m-t-5" />
```

如果不存在该样式名

```
<div className="m-t-5" />
```

# classnames(string | object | Array(string | object))

所有样式名不参与局部计算，将作为全局样式名解析

```
import { classnames as cn } from "css-modules-name"

<div className={cn("home-container $m-t-5")} />
```
解析为
```
<div className="home-container m-t-5" />
```

# 复杂的应用场景

```
import { useState } from "react"
import cssModules from "css-modules-name"
import styles from "./index.less"

const cm = cssModules(styles)

function Card(props) {
    return <div class={cm(props.classnames)}>this is card</div>
}

function App() {
    const [tabBg, setTabBg] = useState(true)

    return <div class={cm("container default $flex", ["mask"] ,{"red": tabBg})}>
        <Card classnames={cm({"red": tabBg}, "mask")} />
        <button onClick={() => setTabBg(!tabBg)}>切换背景色</button>
    </div>
}

```

解析为

```
    <div>
        <div class="container-hash default-hash mask-hash red flex">
            <div class="mask-hash red-hash">this is card</div>
            <button>切换背景色</button>
        </div>
    </div>
```