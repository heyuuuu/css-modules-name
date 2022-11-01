declare namespace CssModuleSpace {
    type Params = undefined | string | Params[] | Record<string, boolean>
    type StyleSheets = Record<string, string> | string
    interface Options {
        cache?: boolean // 是否开启缓存
        unused?: boolean // 是否保留未使用类型
    }
}