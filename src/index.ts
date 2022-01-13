/// <reference path="./index.d.ts" />

const delimiter: string = " "
const preGlobal: string = "$"

const tools = {
	toArray: (name: string) => name.split(/\s+/),
	toString: (names: CssModuleSpace.ClassName) => names.join(delimiter),
	toNormal: (names: CssModuleSpace.ClassName) => names.map(name => name.replace(preGlobal, ''))
}

// 去除重复
function exrepeat(params: CssModuleSpace.ClassName): CssModuleSpace.ClassName {
	// return [...new Set(params)]
	return params.filter((val, index, arr) => val ? arr.indexOf(val) === index : false)
}

// 处理成局部样式
function handlePrivateClassname(params: CssModuleSpace.ClassName) {
	return tools.toString(exrepeat(tools.toNormal(params)))
}

// 处理成全局样式
function handlePublicClassname(params: string[]) {
	
}

// 将name转换为modules中对应的键值
function handleModules(params: CssModuleSpace.ClassName,modules: CssModuleSpace.Module[]): CssModuleSpace.ClassName {

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
function handleAlias(params: CssModuleSpace.ClassName, alias?: CssModuleSpace.Alias) {
	return params.map(name => name.replace(/\{(\w+)\}/,(_, name) => alias ? alias[name] || name : name))
}

// 将classname转换为classname[]
function dismantleCss(params: CssModuleSpace.ClassNames) {

    const transformCss = (params: CssModuleSpace.ClassNames): string => {
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

function classnames(...args: CssModuleSpace.ClassNames[]) {
	return handlePrivateClassname(dismantleCss(args))
}

interface MixClassnames {
	alias?: CssModuleSpace.Alias
}

function mixClassnames(config: MixClassnames) {
	return (...args: CssModuleSpace.ClassNames[]) => {
		return handlePrivateClassname(handleAlias(dismantleCss(args), config.alias))
	}
}

interface CssModuleConfig {
	strict?: boolean // 是否严格模式，严格模式下未找到的局部变量将被删除
	alias?: CssModuleSpace.Alias
}

function cssModule(params: CssModuleSpace.Mudules, config: CssModuleConfig = {}) {

	const modules =  params instanceof Array ? params : [params]

	return (...args: CssModuleSpace.ClassNames[]) => {

		const names = handleAlias(dismantleCss(args), config.alias)
		let classname = handleModules(names, modules)

		// 严格模式
		if(!config.strict) {
			classname = classname.concat(names)
		}

		return handlePrivateClassname(classname)
	}
}

export {
	classnames, // 将classnames作为全局样式进行计算
	mixClassnames
}

export default cssModule