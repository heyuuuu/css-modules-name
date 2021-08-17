function cssModule(styles) {

	const createCss = cname => {
		const [isLocal, name] = cname.split("$")
		if(name) {
			return name
		} else {
			return typeof styles === "object" ? styles[cname] || cname : cname
		}
	}

	const transformCss = (params) => {
		if(typeof params === "string") {
			return params.replace(/(\$?[\w-]+)/g, createCss)
		}else if(params instanceof Array) {
			const data = params.map(val => transformCss(val))
			return data.join(" ")
		}else if(typeof params === "object") {
			const data = Object.keys(params).map(name => params[name] ? name : "")
			return transformCss(data)
		}else{
			return ""
		}
	}

	const init = (...params) => {
		const data = transformCss(params).split(" ")
		const result = data.filter((val,index,arr) => arr.indexOf(val) === index)
		return result.join(" ")
	}

	return init
}

export default cssModule