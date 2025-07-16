import { auth } from '@/auth';
import { cn } from '@/lib/utils';

export default async function Loading() {
  const session = await auth();
  return (
    <div className={cn("flex justify-center items-center w-full h-[calc(100svh-100px)]", { 'h-screen': !session })}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}