import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { IModule } from '@/app/_Interface/Module';
import { BaseColor } from '@/registry/registry-base-colors';
import { Style } from '@/registry/registry-styles';

type UserConfig = {
    id: string,
    name: string,
    email: string,
    roleId: string,
    permissions: number,
    modules: IModule[]
} | null;

export type LayoutType = {
    layout: "vertical" | "horizontal" | "collapsed" | "dual-menu"
    content: "wide" | "compact"
}

export type ThemeConfig = {
    lang: "en" | "hi" | "mr" | string;
    style: Style["name"];
    font: string;
    mode: string;
    layout: LayoutType["layout"];
    content: LayoutType["content"] | string;
    theme:  BaseColor["name"];
    radius: number;
}

const themeAtom = atomWithStorage<ThemeConfig>("theme-config", {
    lang: "en",
    style: "default",
    font: "font-inter",
    theme: "zinc",
    mode: "system",
    layout: "vertical",
    content: "compact",
    radius: 0.5,
})

const userAtom = atomWithStorage<UserConfig>("user", null)

export function userConfig() {
    return useAtom(userAtom)
}

export function themeConfig() {
    return useAtom(themeAtom)
}
