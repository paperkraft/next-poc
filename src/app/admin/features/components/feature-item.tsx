import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface MenuItem {
  id: number
  name: string
  description?: string
}

interface FeatureItemProps {
  item: MenuItem
  isSelected: boolean
  onToggle: (id: number) => void
}

export function FeatureItem({ item, isSelected, onToggle }: FeatureItemProps) {
  return (
    <div
      className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${isSelected ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200 hover:bg-slate-50"
        }`}
    >
      <Checkbox id={`menu-${item.id}`} checked={isSelected} onCheckedChange={() => onToggle(item.id)} />
      <div className="flex-1 space-y-1">
        <Label htmlFor={`menu-${item.id}`} className="text-sm font-medium cursor-pointer">
          {item.name}
        </Label>
        {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
      </div>
    </div>
  )
}
