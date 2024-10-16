'use client'
import AppLayout from '@/components/custom/layout/AppLayout';
import TitlePage from '@/components/custom/page-heading';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export type ImgProps={
  id: number,
  albumId: number,
  title: string,
  url: string,
  thumbnailUrl: string
}

const Gallery = React.memo(()=> {
  const [photos, setPhotos] = useState<ImgProps[]>();

  useEffect(()=>{
    const getImages = async () => {
      await fetch('https://jsonplaceholder.typicode.com/photos')
      .then(response => response.json())
      .then(data => {
        const firstTenPhotos = data.slice(0, 10);
        setPhotos(firstTenPhotos)
      })
      .catch(error => console.error('Error fetching photos:', error));
    }
    
    getImages();

    return () => {
      getImages()
    }

  },[])

  return (
    <AppLayout>
      <TitlePage title="Gallery" description="description" />
      <div className="grid grid-cols-5 gap-4 p-4">
        {photos?.map((item) => (
          <Link href={`/gallery/photos/${item.id}`} passHref key={item.id} className='flex flex-col items-center justify-center'>
            <Image src={item.thumbnailUrl} height={150} width={150} alt={`${item.id}`} className='rounded-md w-40 h-40'/>
            <p className="text-muted-foreground text-sm py-2">Image {item.id}</p>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
})

Gallery.displayName = "Gallery";

export default Gallery;