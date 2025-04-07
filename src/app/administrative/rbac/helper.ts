import { IModule } from "@/types/permissions";
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