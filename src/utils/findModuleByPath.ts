import { ModuleNode } from '@/types/modules';

export function normalizePath(p: string): string {
  return p.trim().replace(/\s+/g, '').replace(/\/+$/, ''); // remove trailing slashes & spaces
}

function pathToRegex(path: string): RegExp {
  const pattern = normalizePath(path).replace(/\[.*?\]/g, '[^/]+').replace(/\//g, '\\/');
  return new RegExp(`^${pattern}(\\/.*)?$`);
}

export function findModuleByPathOld(modules: ModuleNode[], pathname: string): ModuleNode | null {
  const cleanPath = normalizePath(pathname);
  let match: ModuleNode | null = null;

  function recurse(modules: ModuleNode[]) {
    for (const module of modules) {
      const currentPath = normalizePath(module.path || '');
      if (currentPath) {
        const regex = pathToRegex(currentPath);
        if (regex.test(cleanPath)) {
          if (!match || currentPath.length > (match.path?.length || 0)) {
            match = module;
          }
        }
      }
      if (module.children?.length) {
        recurse(module.children);
      }
    }
  }

  recurse(modules);
  return match;
}

/**
 * Recursively finds a module by matching the given path.
 * Supports exact or startsWith match (fallback).
 */
export function findModuleByPath(
  modules: ModuleNode[],
  pathname: string
): ModuleNode | null {
  const targetPath = normalizePath(pathname);
  for (const module of modules) {
    // Exact match
    if (module.path === targetPath) return module;

    // Recursively check children
    if (module.children && module.children.length > 0) {
      const found = findModuleByPath(module.children, targetPath);
      if (found) return found;
    }

    // Loose match fallback (if no exact match and target path starts with module path)
    if (
      targetPath !== '/' &&
      module.path !== '/' &&
      targetPath.startsWith(module.path + '/')
    ) {
      return module;
    }
  }

  return null;
}