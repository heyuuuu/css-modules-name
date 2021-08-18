
const delimiter = " "

function dismantleCss(params, createCss) {
	const transformCss = (params) => {
		if(typeof params === "string") {
			return params.replace(/(\$?[\w-]+)/g, createCss)
		}else if(params instanceof Array) {
			const data = params.map(val => transformCss(val))
			return data.join(delimiter)
		}else if(typeof params === "object") {
			const data = Object.keys(params).map(name => params[name] ? name : "")
			return transformCss(data)
		}else{
			return ""
		}
	}
	return transformCss(params)
}

// @params classname: string
function filterCss(classname) {
	const arr = classname.split(delimiter)
	const result = arr.filter((val,index,arr) => {
		if(val) {
			return arr.indexOf(val) === index
		}
	})
	return result.join(" ")
}

export function classnames(...params) {
	const createCss = cname => {
		const [isLocal, name] = cname.split("$")
		return name ? name : cname
	}
	const data = dismantleCss(params, createCss)
	return filterCss(data)
}

function cssModule(...styles) {

	const createCss = cname => {
		const [isLocal, name] = cname.split("$")
		if(name) {
			return name
		} else {
			const result = styles.map(style => typeof style === "object" ? styles[cname] || cname : cname)
			return result.join(delimiter)
		}
	}

	const init = (...params) => {
		const data = dismantleCss(params, createCss)
		return filterCss(data)
	}

	return init
}

export default cssModule