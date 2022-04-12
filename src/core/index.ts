/// <reference path="./index.d.ts" />

const delimiter: string = " "

function deduplication(classnames: string[]) {
	return classnames.join(delimiter).split(delimiter).filter((name, index, arr) => {
		if(name) {
			return arr.indexOf(name) === index
		}
		return false
	})
}

// 计算类型
function createType (name: string):CssModuleSpace.NamePrototype {
	const result = {
		isUse: false,
        isLock: false,
        isGlobal: false,
        name: name,
		value: []
	}
	// [name] 锁定样式
	const [isLock, LockValue] = result.name.match(/^\[([\w\-]+)\]/) || []
	if(isLock) {
		result.isLock = true
		result.name = LockValue
	}
	// $name 全局样式
	const [isGlogal, GlobalValue] = result.name.match(/^\$(\w+)/) || []
	if(isGlogal) {
		result.isGlobal = true
		result.name = GlobalValue
	}
	return result
}

// 转换classname
function dismantleCss(params: CssModuleSpace.ClassNames): CssModuleSpace.NamePrototype[] {

	const classnames:string[] = []

    const transformCss = (classname: CssModuleSpace.ClassNames) => {
        if(typeof classname === "string") {
			classnames.push(classname)
        }
        else if(classname instanceof Array) {
            classname.map(name => transformCss(name))
        }
        else if(typeof classname === "object") {
            Object.keys(classname).map(name => classname[name] ? transformCss(name) : delimiter)
        }
    }

	transformCss(params)

	return deduplication(classnames).map(createType)
}

function transformCssmodule(classnames: CssModuleSpace.NamePrototype[], modules: CssModuleSpace.Module, config: CssModuleSpace.Config = {}) {
	
	const { alias, strict } = config
	
	const classname: string[] = []
	
	classnames.forEach(item => {
		if(alias) {
			item.name = item.name.replace(/\{(\w+)\}/g, (_, name) => alias[name] || name)
		}
		const value = modules[item.name]
		if(value) {
			item.isUse = true
			item.value = value
		}
		if(item.isGlobal) {
			classname.push(item.name)
			classname.push(item.value.join(delimiter))
		}
		if(item.isLock) {
			classname.push(item.name)
		}
		if(item.isUse) {
			classname.push(item.value.join(delimiter))
		}
		if(!strict) {
			if([item.isGlobal, item.isLock, item.isUse].every(v => !v)) {
				classname.push(item.name)
			}
		}
	})

	return classname

}

function handleModules(modules: CssModuleSpace.Modules = []) {
	const module: CssModuleSpace.Module = {}
	const moduleList = modules instanceof Array ? modules : [modules]
	moduleList.forEach(style => {
		if(typeof style === "object") {
			Object.keys(style).forEach(name => {
				if(module[name]) {
					module[name].push(style[name])
				} else {
					module[name] = [style[name]]
				}
			})
		}
	})
	return module
}


function cssModule(modules: CssModuleSpace.Modules = [], config: CssModuleSpace.Config = {}) {

	const module = handleModules(modules)

	return (...classnames: CssModuleSpace.ClassNames[]) => {

		const classname = transformCssmodule(dismantleCss(classnames), module, config)

		return deduplication(classname).join(delimiter)
	}
}

// 锁定样式，避免在strict严格模式下丢失
export function lock(classnames = "") {
	return classnames.split(delimiter).map(name => `[${name}]`).join(delimiter)
}

// 仅进行全局样式计算
export function classnames(...classnames: CssModuleSpace.ClassNames[]) {
	const classname = transformCssmodule(dismantleCss(classnames), {}, {})
	return deduplication(classname).join(delimiter)
}

export default cssModule