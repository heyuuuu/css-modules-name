import React from "react"
import cssModules, { classnames as cn, lock} from "../../core"
import styles from "./index.less"

const cm = cssModules([styles], {
    strict: true
})
const cs = cssModules([styles])
const ct = cssModules([], {
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