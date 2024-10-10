import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

type CardProps = {
    header: string | React.ReactNode;
    description?: string;
    children: React.ReactNode;
    footer?: string | React.ReactNode;
}

export default function CustomCard({header, description, children, footer}:CardProps){
    return(
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{header}</CardTitle>
                { description && <CardDescription>{description}</CardDescription> }
            </CardHeader>
            <CardContent>{children}</CardContent>
            { footer && <CardFooter>{footer}</CardFooter> }
        </Card>
    )
}