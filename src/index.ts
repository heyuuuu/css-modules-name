const delimiter: string = " "
const preGlobal: string = "$"

type BaseTYPE = string | object
type ParamsTYPE = BaseTYPE | BaseTYPE[]

const tools = {
	toArray: (name: string) => name.split(/\s+/),
	toString: (names: string[]) => names.join(delimiter),
	toNormal: (names: string[]) => names.map(name => name.replace(preGlobal, ''))
}

// 去除重复
function exrepeat(params: string[]) {
	// return [...new Set(params)]
	return params.filter((val, index, arr) => val ? arr.indexOf(val) === index : false)
}

// 处理成局部样式
function handlePrivateClassname(params: string[] | string) {
	const names = params instanceof Array ? params : tools.toArray(params)
	return tools.toString(exrepeat(tools.toNormal(names)))
}

// 处理成全局样式
function handlePublicClassname(params: string[]) {
	
}

// 处理module-name
function handleModules(params: string[],modules: (string | object)[]) {

	const classname: string[] = []

	params.map(name => {
		if(/^\$/.test(name)) {
			classname.push(name)
		} else {
			modules.map(module => {
				if(typeof module == "object" && module[name]) {
					classname.push(module[name])
				}
			})
		}
	})

	return classname
}

// 处理alias
function handleAlias(params: string[], alias?: object) {
	return params.map(name => name.replace(/\{(\w+)\}/,(_, name) => alias?.[name] || name))
}

// 重组classnames
function dismantleCss(params: ParamsTYPE[]) {

    const transformCss = (params: ParamsTYPE): string => {
        if(typeof params === "string") {
			return params
        }
        if(params instanceof Array) {
            return tools.toString(params.map(name => transformCss(name)))
        }
        if(typeof params === "object") {
            return tools.toString(Object.keys(params).map(name => params[name] ? transformCss(name) : delimiter))
        }
        return delimiter
    }

	const classname = exrepeat(tools.toArray(transformCss(params)))

	return classname
}

function classnames(...args: ParamsTYPE[]) {
	return handlePrivateClassname(dismantleCss(args))
}

interface CssModuleConfig {
	strict?: boolean // 是否严格模式，严格模式下未找到的局部变量将被删除
	alias?: object // 别名 {}
}

function cssModule(params: ParamsTYPE, config: CssModuleConfig = {}) {

	const modules =  params instanceof Array ? params : [params]

	const classnames = (...args: ParamsTYPE[]) => {


		const names = handleAlias(dismantleCss(args))
		let classname = handleModules(names, modules)

		// 严格模式
		if(!config.strict) {
			classname = classname.concat(names)
		}

		return handlePrivateClassname(classname)

	}
	return classnames
}

export {
	classnames, // 将classnames作为全局样式进行计算
}

export default cssModule