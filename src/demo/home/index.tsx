import React from "react"
import cssModules from "../../core"
import Topic from "../Topic"
import common from "./common.less"
import styles from "./index.less"

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