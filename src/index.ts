const delimiter: string = " "
const preGlobal: string = "$"

type BaseTYPE = string | object | undefined
type ParamsTYPE = BaseTYPE | BaseTYPE[]

function dismantleCss(params: ParamsTYPE[], transformName: (name: string) => string) {

    const transformCss = (params: ParamsTYPE): string => {
        if(typeof params === "string") {
            return params.replace(/(\$?[\w-]+)/g, name => transformName(name))
        }
        if(params instanceof Array) {
            return params.map(name => transformCss(name)).join(delimiter)
        }
        if(typeof params === "object") {
            return Object.keys(params).map(name => params[name] ? transformCss(name) : delimiter).join(delimiter)
        }
        return delimiter
    }

	const names: string[] = []

    transformCss(params).split(delimiter).map(name => {
		if(name && names.indexOf(name) === -1) {
			names.push(name)
		}
	})

	return names.join(delimiter)

}

function createCssModules(modules?: ParamsTYPE) {
	const Modules: object[] = []
	const transModules = (modules?: ParamsTYPE) => {
		if(modules instanceof Array) {
			modules.map(module => transModules(module))
		}
		if(typeof modules === "object") {
			Modules.push(modules)
		}
	}
	transModules(modules)
	return Modules
}

function classnames(...args: ParamsTYPE[]) {
	const createCss = (cname: string) => {
		const [isLocal, name] = cname.split(preGlobal)
		return name ? name : cname
	}
	return dismantleCss(args, createCss)
}

function cssModule(params: ParamsTYPE) {

	const modules = createCssModules(params)

	const createCss = (cname: string) => {
		const [isLocal, name] = cname.split(preGlobal)
		if(name) {
			return name
		} else {
			const result = modules.map(style => style[cname] || cname)
			return result.join(delimiter)
		}
	}

	const classnames = (...args: ParamsTYPE[]) => {
		return dismantleCss(args, createCss)
	}
	return classnames
}

export {
	classnames, // 将classnames作为全局样式进行计算
}

export default cssModule