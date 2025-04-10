import { IGroupedModule, IModule } from "@/types/permissions";
import fuzzysort from "fuzzysort";

export const filterModulesByName = (mods: IModule[], query: string, openSet = new Set<string>()): IModule[] => {
    if (!query.trim()) return mods;

    return mods
        .map((mod) => {
            const subMatches = filterModulesByName(mod.subModules || [], query, openSet);
            const isMatch = !!fuzzysort.single(query, mod.name);

            if (isMatch || subMatches.length > 0) {
                if (subMatches.length > 0) openSet.add(mod.id);
                return {
                    ...mod,
                    subModules: subMatches,
                };
            }

            return null;
        })
        .filter((mod): mod is IModule => mod !== null);
};


export function filterGroupedModules(
    groups: IGroupedModule[],
    search: string,
    openSet: Set<string>
) {
    if (!search.trim()) return groups;

    const lowerSearch = search.toLowerCase();

    return groups
        .map(group => {
            const filteredModules = group.modules
                .map(mod => {
                    const match = mod.name.toLowerCase().includes(lowerSearch);

                    const filteredSubModules = mod.subModules.filter(sub =>
                        sub.name.toLowerCase().includes(lowerSearch)
                    );

                    if (match || filteredSubModules.length > 0) {
                        if (filteredSubModules.length > 0) {
                            openSet.add(mod.id); // auto-expand parent
                        }
                        return {
                            ...mod,
                            subModules: filteredSubModules,
                        };
                    }

                    return null;
                })
                .filter(Boolean) as IModule[];

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
export const groupModules = (modules: IModule[]): IGroupedModule[] => {
    const groupMap = new Map<string, IGroupedModule>();

    for (const mod of modules) {
        if (!groupMap.has(mod.groupId)) {
            groupMap.set(mod.groupId, {
                groupId: mod.groupId,
                groupName: mod.groupName,
                modules: [],
            });
        }

        groupMap.get(mod.groupId)!.modules.push(mod);
    }

    return Array.from(groupMap.values()).map((group) => ({
        ...group,
        modules: group.modules.sort((a, b) => a.position - b.position),
    }));
};