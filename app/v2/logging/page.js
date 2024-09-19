'use client'

// import MainPageV2Comp from '@/components/MainPageV2Comp';
import React from 'react';
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
 
const MainPageV2Comp = dynamic(() => import('@/components/MainPageV2Comp'), { ssr: false });

function page(props) {

    const site = localStorage.getItem('site').toLowerCase()
    const pathname = usePathname()
    const pageName = pathname.split('/')[2]

    const imageUrl = `/v2/${site}/${pageName}`

    return (
        <>
            <MainPageV2Comp path={imageUrl}/>
        </>
    );
}

export default page;