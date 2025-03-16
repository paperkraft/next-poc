import { SkeletonDarkTheme, SkeletonLightTheme, SkeletonSidebarLayout, SkeletonStackedLayout, SkeletonSystemTheme } from "@/components/custom/layout-skeleton";
import { useSidebar } from "@/components/ui/sidebar";
import { LayoutType, themeConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React from "react"

interface BlockProps {
  setCurrent: string;
  block: React.ReactNode;
}

interface Blocks {
  context: string | LayoutType
  component: BlockProps[];
  type: string;
}

export const themeBlocks: BlockProps[] = [
  {
    setCurrent: 'light',
    block: <SkeletonLightTheme />
  },
  {
    setCurrent: 'dark',
    block: <SkeletonDarkTheme />
  },
  {
    setCurrent: 'system',
    block: <SkeletonSystemTheme />
  }
];

export const layoutBlock: BlockProps[] = [
  {
    setCurrent: 'vertical',
    block: <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="104" height="66" rx="4" fill="currentColor" fillOpacity="0.02"></rect>
      <path d="M0 4C0 1.79086 1.79086 0 4 0H27.4717V66H4C1.79086 66 0 64.2091 0 62V4Z" fill="currentColor" fillOpacity="0.08"></path>
      <rect x="4.90625" y="23.8839" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="8.83008" y="5.88135" width="9.81132" height="9.70588" rx="2" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="4.90625" y="34.4382" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="4.90625" y="44.9923" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="4.90625" y="55.5463" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="32.1523" y="4.67169" width="64.7547" height="8.8" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="35.0781" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="78.248" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="84.1348" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="90.0215" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="57.0859" y="19.6134" width="40.2264" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="32.1523" y="19.6134" width="19.0455" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="32.1523" y="42.4545" width="65.1591" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
    </svg>
  },
  {
    setCurrent: 'horizontal',
    block: <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="104" height="66" rx="4" fill="currentColor" fillOpacity="0.02"></rect>
      <rect x="44.0068" y="19.6136" width="46.8212" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="14.9854" y="19.6136" width="22.1679" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="14.9854" y="42.4547" width="75.8413" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="14.9248" y="4.68896" width="74.1506" height="9.00999" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="20.0264" y="6.50403" width="6.00327" height="5.38019" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="33.877" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="48.3652" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="62.8506" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="77.3379" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fillOpacity="0.3"></rect>
    </svg>
  },
  {
    setCurrent: 'collapsed',
    block: <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="104" height="66" rx="4" fill="currentColor" fillOpacity="0.02"></rect>
      <path d="M0 4C0 1.79086 1.79086 0 4 0H13.7359V66H4C1.79086 66 0 64.2091 0 62V4Z" fill="currentColor" fillOpacity="0.04"></path>
      <rect x="2.94336" y="23.8839" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="3.43359" y="5.88135" width="6.86793" height="6.79412" rx="2" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="2.94336" y="34.4382" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="2.94336" y="44.9923" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="2.94336" y="55.5463" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="21.4717" y="4.67169" width="75.437" height="8.8" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="25.6172" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="78.248" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="84.1348" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="90.0215" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
      <rect x="50.4912" y="19.6134" width="46.8212" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="21.4717" y="19.6134" width="22.1679" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
      <rect x="21.4717" y="42.4545" width="75.8413" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
    </svg>
  },
];

export const RenderBlocks = ({ context, component, type }: Blocks) => {
  const [config, setConfig] = themeConfig();
  const { setTheme } = useTheme();
  const { setOpen } = useSidebar();

  const handleClick = (current: string, type: string) => {
    if (type === 'layout') {
      setConfig({
        ...config,
        layout: current
      });
      if (current === "horizontal") {
        setOpen(false)
      } else {
        setOpen(true)
      }
    }

    if (type === 'theme') {
      setTheme(current);
      setConfig({
        ...config,
        mode: current
      });
    }
  }

  return (
    <div className='flex flex-wrap gap-6'>
      {
        component.map((item: BlockProps) => (
          <div key={item.setCurrent} className={cn("group relative before:absolute before:-inset-2.5 before:rounded-md before:bg-accent before:opacity-0 hover:before:opacity-50",
            { "before:bg-accent before:opacity-50": context === item.setCurrent }
          )}>
            <div className={cn("flex justify-center items-center relative aspect-[16/9] overflow-hidden rounded-md ring-gray-900/10 w-64",
              { "ring-primary ring-2": context === item.setCurrent }
            )}>
              {item.block}
            </div>
            <h4 className={cn("mt-4 text-sm text-center font-medium group-hover:text-primary",
              { "text-primary": context === item.setCurrent }
            )}>
              <button onClick={(e) => { e.preventDefault(); handleClick(item.setCurrent, type) }}>
                <span className="absolute -inset-2.5 z-10"></span>
                <span className="relative">{item.setCurrent?.toUpperCase()}</span>
              </button>
            </h4>
          </div>
        ))
      }
    </div>
  )
}