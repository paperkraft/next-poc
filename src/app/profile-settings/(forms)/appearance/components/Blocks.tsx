import { SkeletonDarkTheme, SkeletonLightTheme, SkeletonSidebarLayout, SkeletonStackedLayout, SkeletonSystemTheme } from "@/components/custom/layout-skeleton";
import { useSidebar } from "@/components/ui/sidebar";
import { LayoutType, themeConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React from "react"

interface BlockProps{
    setCurrent:string;
    block: React.ReactNode;
}

interface Blocks{
    context: string | LayoutType
    component: BlockProps[];
    type: string;
}

export const themeBlocks:BlockProps[] = [
    {
      setCurrent: 'light',
      block: <SkeletonLightTheme/>
    },
    {
      setCurrent: 'dark',
      block: <SkeletonDarkTheme/>
    },
    {
      setCurrent: 'system',
      block: <SkeletonSystemTheme/>
    }
];

export const layoutBlock:BlockProps[] = [
    {
      setCurrent: 'vertical',
      block: <SkeletonSidebarLayout/>
    },
    {
      setCurrent: 'horizontal',
      block: <SkeletonStackedLayout/>
    },
];

export const RenderBlocks = ({context, component, type}:Blocks) => {
    const [config, setConfig] = themeConfig();
    const { setTheme } = useTheme();
    const { setOpen } = useSidebar();

    const handleClick = (current:string, type:string) => {
        if(type === 'layout'){
          setConfig({
            ...config,
            layout: current
          });
          if(current === "horizontal"){
            setOpen(false)
          } else {
            setOpen(true)
          }
        }

        if(type === 'theme'){
          setTheme(current);
          setConfig({
            ...config,
            mode:current
          });
        }
    }

    return(
      <div className='flex flex-wrap gap-6'>
        {
          component.map((item:BlockProps)=>(
            <div key={item.setCurrent} className={cn("group relative before:absolute before:-inset-2.5 before:rounded-md before:bg-accent before:opacity-0 hover:before:opacity-50",
              {"before:bg-accent before:opacity-50" : context === item.setCurrent}
            )}>
              <div className={cn("flex justify-center items-center relative aspect-[16/9] overflow-hidden rounded-md ring-gray-900/10 w-64",
                {"ring-primary ring-2": context === item.setCurrent}
              )}>
                {item.block}
              </div>
              <h4 className={cn("mt-4 text-sm text-center font-medium group-hover:text-primary",
                {"text-primary": context === item.setCurrent}
              )}>
                <button onClick={(e) =>{e.preventDefault(); handleClick(item.setCurrent, type)}}>
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