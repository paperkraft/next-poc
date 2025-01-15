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

const userAtom = atomWithStorage<UserConfig>("user", null)

export function userConfig() {
    return useAtom(userAtom)
}