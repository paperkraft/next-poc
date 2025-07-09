"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Save } from "lucide-react"

type Props = {
    onSave: () => void
}

export function UnsavedChangesBanner({ onSave }: Props) {
    return (
        <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-orange-700">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">You have unsaved changes</span>
                    </div>
                    <Button onClick={onSave} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
