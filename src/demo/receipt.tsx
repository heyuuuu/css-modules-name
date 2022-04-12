import React, { useState } from "react"
import cssModule, { lock, classnames } from "../core"
import styles from "./receipt.m.less"

const cm = cssModule([styles], {strict: true, alias: {c: "p"}})

interface Props {
	classname?: string
}

function Receipt(props: Props) {
	const [time, setTime]= useState(0)
	return <div className={cm("{c}ontainer $flex chinaz", lock(props.classname), {"{p}-heyu": true})}>
		<button onClick={() => setTime(new Date().valueOf())}>this is <span className={classnames("flex", {'{p}-heyu': true})}>Recipt</span></button>
	</div>
}

export default Receipt