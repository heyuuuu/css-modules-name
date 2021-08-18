
const delimiter = " "

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

	const init = (...params) => {
		const data = transformCss(params).split(delimiter)
		const result = data.filter((val,index,arr) => arr.indexOf(val) === index)
		return result.join(" ")
	}

	return init
}

export default cssModule