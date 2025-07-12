import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export const CustomTrigger = () => {
    const { toggleSidebar } = useSidebar();
    return (
        <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="sm"
            className="size-7 -ml-1"
            aria-label="Toggle Sidebar"
        >
            <MenuIcon />
        </Button>
    );
};