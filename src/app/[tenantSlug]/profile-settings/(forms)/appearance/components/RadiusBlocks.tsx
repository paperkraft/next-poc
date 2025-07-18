import { Button } from "@/components/ui/button";
import { themeConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";

const RenderRadius = ()=> {
    const [config, setConfig] = themeConfig();
    return(
      <div className="space-y-1.5">
        <div className="grid grid-cols-5 gap-2">
          {["0", "0.3", "0.5", "0.75", "1.0"].map((value) => {
            return (
              <Button
                variant={"outline"}
                size="sm"
                key={value}
                onClick={(e) => {
                  e.preventDefault();
                  setConfig({
                    ...config,
                    radius: parseFloat(value),
                  })
                }}
                className={cn(
                  config.radius === parseFloat(value) &&
                    "border-2 border-primary"
                )}
              >
                {value}
              </Button>
            )
          })}
        </div>
      </div>
    )
}

export default RenderRadius;