import { Button } from "@/components/ui/button";
import { themeConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";
import { themes } from "@/registry/theme";
import { CheckIcon } from "lucide-react";

const RenderColors = () => {
    const [config, setConfig] = themeConfig();
    return(
      <div className="space-y-1.5">
        <div className="grid grid-cols-3 gap-2">
          {
            themes.map((theme) => {
              const isActive = config.theme === theme.name
              return (
                <Button
                  variant={"outline"}
                  size="sm"
                  key={theme.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setConfig({
                      ...config,
                      theme:theme.name
                    });
                  }}
                  className={cn(
                    "justify-start",
                    isActive && "border-2 border-primary"
                  )}
                  style={
                    {
                      "--theme-primary": `hsl(${
                        theme?.activeColor[config.mode === "dark" ? "dark" : "light"]
                      })`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={cn(
                      "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]",
                    )}
                  >
                    {isActive && <CheckIcon className="h-4 w-4 text-white" />}
                  </span>
                  {theme.label}
                </Button>
              ) 
            })
          }
        </div>
      </div>
    )
}

export default RenderColors;