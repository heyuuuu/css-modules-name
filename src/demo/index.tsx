import React from "react"
import ReactDOM from "react-dom"
import Receipt from "./receipt"
import cssModule from "../core"

import styles from "./index.m.less"
import otherStyles from "./other.m.less"

const cm = cssModule([styles, otherStyles], {strict: true})

function Home() {
	return <div className={cm("$container {p}-a item {p}-a", "name [hhh]")}>
		this is home
		<Receipt classname={cm("container")} />
	</div>
}

ReactDOM.render(<Home />, document.querySelector("#root"))