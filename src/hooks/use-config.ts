import { IModule } from "@/app/_Interface/Module"
import { Style } from "@/registry/registry-styles";
import { BaseColor } from "@/registry/registry-base-colors";
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type UserConfig = {
    id: string,
    name: string,
    email: string,
    roleId: string,
    permissions: number,
    modules: IModule[]
} | null;

export type LayoutType = {
    layout: "vertical" | "horizontal" | "collapsed"
}

export type ThemeConfig = {
    lang: "en" | "hi" | "mr" | string
    style: Style["name"]
    font: string
    mode: string
    layout: LayoutType | string
    content: string
    theme:  BaseColor["name"]
    radius: number
    dual: boolean
}

const themeAtom = atomWithStorage<ThemeConfig>("theme-config", {
    lang: "en",
    style: "default",
    font: "font-inter",
    theme: "zinc",
    mode: "system",
    layout: "vertical",
    content: "wide",
    radius: 0.5,
    dual: false
})

const userAtom = atomWithStorage<UserConfig>("user", null)

export function userConfig() {
    return useAtom(userAtom)
}

export function themeConfig() {
    return useAtom(themeAtom)
}
