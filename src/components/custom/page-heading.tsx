import { Separator } from "@/components/ui/separator"
import { ReactNode } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, Edit, Edit2, Trash2 } from "lucide-react"

type Props = {
    title: string
    description?: string
    children?: ReactNode
}

export default function TitlePage({ title, description, children }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center">
                <div className="space-y-0.5">
                    <h1 className="text-lg font-semibold">{title}</h1>
                    { description && <p className="text-sm text-muted-foreground">{description}</p> }
                </div>
                <div className="ml-auto">
                    {children}
                </div>
            </div>
            <Separator />
        </div>
    )
}

