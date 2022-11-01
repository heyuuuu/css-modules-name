/// <reference path ="index.d.ts"/>

const cache = new Map<string, {raw: string}>()

function reset(arr: string[]) {
	return arr.filter((name, index, arr) => name && arr.indexOf(name) === index)
}

function conversion(...params: CssModuleSpace.Params[]) {
	const ref = {current: [] as string[]}
	const recursion = (names: CssModuleSpace.Params) => {
		if(typeof names === "string") {
			ref.current = ref.current.concat(names.split(" "))
		} else if(names instanceof Array) {
			names.forEach(recursion)
		} else if(typeof names === "object") {
			Object.keys(names).forEach(name => names[name] && recursion(name))
		}
	}
	params.forEach(recursion)
	// 去空去重
	return reset(ref.current)
}

// 包裹传入的类名参数
export function coat(...params: CssModuleSpace.Params[]) {
	return conversion(params).map(name => `!${name}`)
}

// 处理局部类名
export default function main(
	styleSheet: CssModuleSpace.StyleSheets | CssModuleSpace.StyleSheets[] = [],
	options: CssModuleSpace.Options = {}
) {
	const styleSheets = styleSheet instanceof Array ? styleSheet : [styleSheet]
	const prefix = Math.random().toString().slice(-10)
	return (...params: CssModuleSpace.Params[]) => {
		const key = prefix + JSON.stringify(params)
		if(options.cache) {
			const data = cache.get(key);
			if(data) return data.raw;
		}
		const names = conversion(params)
		const ref = {
			common: [] as string[],
			scope: [] as string[]
		}
		names.map(name => {
			const [, common] = name.split(/^\!/)
			const [, mixed] = name.split(/^\#/)
			if(common) {
				ref.common.push(common)
			}else if(mixed) {
				ref.common.push(mixed)
				styleSheets.forEach(sheet => ref.scope.push(sheet[mixed]))
			}else {
				const names = styleSheets.map(sheet => sheet[name])
				if(names.some(Boolean)) {
					ref.scope = ref.scope.concat(names)
				}else if(options.unused) {
					ref.scope.push(name)
				}
			}
		})
		const raw = reset(ref.common.concat(ref.scope)).join(" ")
		if(options.cache) {
			cache.set(key, {raw})
		}
		return raw
	}
}