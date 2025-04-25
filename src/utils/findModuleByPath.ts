import { Module } from '@/types/module';

function normalizePath(p: string): string {
  return p.trim().replace(/\s+/g, '').replace(/\/+$/, ''); // remove trailing slashes & spaces
}

function pathToRegex(path: string): RegExp {
  const pattern = normalizePath(path).replace(/\[.*?\]/g, '[^/]+').replace(/\//g, '\\/');
  return new RegExp(`^${pattern}(\\/.*)?$`);
}

export function findModuleByPath(modules: Module[], pathname: string): Module | null {
  const cleanPath = normalizePath(pathname);
  let match: Module | null = null;

  function recurse(modules: Module[]) {
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
      if (module.subModules?.length) {
        recurse(module.subModules);
      }
    }
  }

  recurse(modules);
  return match;
}