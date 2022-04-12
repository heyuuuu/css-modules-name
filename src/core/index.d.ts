declare namespace CssModuleSpace {
    type Stylesheet = object // 导入的样式
    type ClassNames = undefined | string | object | ClassNames[]
    type Module = Record<string, string[]> // 转换后的样式模块
    type Modules = string | Stylesheet | Modules[]
    interface Config {
        strict?: boolean // 是否严格模式，严格模式下未找到的局部变量将被删除
        alias?: object
    }
    interface NamePrototype {
        isUse?: boolean // 是否使用过
        isLock?: boolean // 是否为锁定类名
        isGlobal?: boolean // 是否为全局类名
        name: string // 样式名
        value: string[] // 局部样式名集合
    }
}