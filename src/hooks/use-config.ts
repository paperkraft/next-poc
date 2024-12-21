import { IModule } from "@/app/_Interface/Module"
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

type GroupConfig = {
   id:string,
   name:string
}[] | null

const userAtom = atomWithStorage<UserConfig>("user", null)
const groupAtom = atomWithStorage<GroupConfig>("groups", null)
const menusAtom = atomWithStorage<IModule[] | null>("menus", null)

export function userConfig() {
    return useAtom(userAtom)
}

export function groupConfig() {
    return useAtom(groupAtom)
}

export function menusConfig() {
    return useAtom(menusAtom)
}