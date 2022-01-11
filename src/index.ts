const delimiter: string = " "
const preGlobal: string = "$"

type BaseTYPE = string | object | undefined
type ParamsTYPE = BaseTYPE | BaseTYPE[]

// 去除重复
function exrepeat(params: string[]) {
	// return [...new Set(params)]
	return params.filter((val, index, arr) => val ? arr.indexOf(val) === index : false)
}

// 处理成局部样式
function handlePrivateClassname(params: string[]) {
	return exrepeat(params.map(val => val.replace(preGlobal, ""))).join(delimiter)
}

// 处理成全局样式
function handlePublicClassname(params: string[]) {
	
}

function dismantleCss(params: ParamsTYPE[]) {

    const transformCss = (params: ParamsTYPE): string => {
        if(typeof params === "string") {
			return params
        }
        if(params instanceof Array) {
            return params.map(name => transformCss(name)).join(delimiter)
        }
        if(typeof params === "object") {
            return Object.keys(params).map(name => params[name] ? transformCss(name) : delimiter).join(delimiter)
        }
        return delimiter
    }

	const classname = exrepeat(transformCss(params).split(/\s/g))

	return classname
}

function classnames(...args: ParamsTYPE[]) {
	return handlePrivateClassname(dismantleCss(args))
}

interface CssModuleConfig {
	scope?: boolean // 是否开启局部作用域限制
}

function cssModule(params: ParamsTYPE, config: CssModuleConfig = {}) {

	const modules =  params instanceof Array ? params : [params]

	const classnames = (...args: ParamsTYPE[]) => {

		let classname: string[] = []

		const arr = dismantleCss(args).map(name => {
			if(/^\$/.test(name)) {
				classname.push(name)
			} else {
				modules.map(module => {
					if(typeof module == "object" && module[name]) {
						classname.push(module[name])
					}
				})
			}
			return name
		})

		if(!config.scope) {
			classname = classname.concat(arr)
		}

		return handlePrivateClassname(classname)

	}
	return classnames
}

export {
	classnames, // 将classnames作为全局样式进行计算
}

export default cssModule