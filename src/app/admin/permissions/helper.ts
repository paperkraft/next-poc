// import { ModuleNode } from "@/types/modules";
import { MenuItem } from "@/lib/menus";
import { IGroupedModule } from "@/types/permissions";
import fuzzysort from "fuzzysort";

export const filterModulesByName = (mods: MenuItem[], query: string, openSet = new Set<number>()): MenuItem[] => {
    if (!query.trim()) return mods;

    return mods
        .map((mod) => {
            const subMatches = filterModulesByName(mod.children || [], query, openSet);
            const isMatch = !!fuzzysort.single(query, mod.name);

            if (isMatch || subMatches.length > 0) {
                if (subMatches.length > 0) openSet.add(mod.id);
                return {
                    ...mod,
                    children: subMatches,
                };
            }

            return null;
        })
        .filter((mod): mod is MenuItem => mod !== null);
};

export function filterGroupedModules(
    groups: IGroupedModule[],
    search: string,
    openSet: Set<number>
) {
    if (!search.trim()) return groups;

    const lowerSearch = search.toLowerCase();

    return groups
        .map(group => {
            const filteredModules = group.modules
                .map(mod => {
                    const match = mod.name.toLowerCase().includes(lowerSearch);

                    const filteredSubModules = mod.children.filter(sub => sub.name.toLowerCase().includes(lowerSearch)
                    );

                    if (match || filteredSubModules.length > 0) {
                        if (filteredSubModules.length > 0) {
                            openSet.add(mod.id); // auto-expand parent
                        }
                        return {
                            ...mod,
                            children: filteredSubModules,
                        };
                    }

                    return null;
                })
                .filter(Boolean) as MenuItem[];

            if (filteredModules.length > 0) {
                return {
                    ...group,
                    modules: filteredModules,
                };
            }

            return null;
        })
        .filter(Boolean) as typeof groups;
}

// Group by groupName and sort by group and module positions
export const groupModules = (modules: MenuItem[]): IGroupedModule[] => {
    const groupMap = new Map<number, IGroupedModule>();

    for (const mod of modules) {
        if (!groupMap.has(+mod?.groupId!)) {
            groupMap.set(+mod?.groupId!, {
                groupId: +mod?.groupId!,
                groupName: mod.groupName as string,
                modules: [],
            });
        }

        groupMap.get(mod?.groupId!)!.modules.push(mod);
    }
    return Array.from(groupMap.values()).map((group) => ({
        ...group,
        modules: group.modules.sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity)),
    }));
};