import { Button } from "@/components/ui/button";
import { themeConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";

const fontOptions = [
  { label: "Inter", value: "font-inter" },
  { label: "Poppins", value: "font-poppins" },
  { label: "Roboto", value: "font-roboto" },
  { label: "Montserrat", value: "font-montserrat" },
  { label: "Inconsolata", value: "font-inconsolata" },
  { label: "Sans Devanagari", value: "font-noto_sans" },
  { label: "Trio Devanagari", value: "font-trio" },
]

const RenderFonts = () => {
  const [config, setConfig] = themeConfig();
  const Devnagari = fontOptions.filter((x) => x.value === 'font-noto_sans' || x.value === 'font-trio');
  const Other = fontOptions.filter(x => x.value !== 'font-noto_sans' && x.value !== 'font-trio');
  const filterOptions = config.lang === 'mr' || config.lang === 'hi' ? Devnagari : Other

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2 overflow-x-auto">
        {filterOptions.map((item) => {
          return (
            <Button
              variant={"outline"}
              size="sm"
              type="button"
              key={item.label}
              onClick={(e) => {
                e.preventDefault();
                setConfig({
                  ...config,
                  font: item.value,
                })
              }}
              className={cn(
                "w-full",
                config.font === item.value &&
                "border-2 border-primary"
              )}
            >
              {item.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default RenderFonts;