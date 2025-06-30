import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: "Not Found",
  description: "Page under construction",
};

export default async function NotFound() {
  const session = await auth();
  const slug = session?.user?.slug ?? "admin";

  return (
    <React.Fragment>
      <div className={cn("flex items-center justify-center h-svh")}>
        <div className="flex flex-col items-center gap-1">
          <h6 className="text-2xl font-semibold">Not Found</h6>
          <p className="text-muted-foreground text-sm">The page you are looking does not exist</p>
          <Image src={"/not-found.svg"} height={250} width={250} alt="Not-Found" className="mb-3" />
          <div>
            <Button asChild>
              <Link href={`/${slug}/dashboard`}>Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}