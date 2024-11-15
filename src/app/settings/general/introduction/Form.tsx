'use client'
import { Button } from "@/components/ui/button";

export default function ModuleAdd() {

    const handleClick = async () => {
        const dd = await fetch('/api/module')
        const rs = await dd.json();
        console.log(rs);
    }
    return (
        <>
            <Button onClick={()=>handleClick()}>Create Module</Button>
        </>
    );
}