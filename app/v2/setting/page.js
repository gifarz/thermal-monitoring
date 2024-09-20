'use client'

// import MainPageV2Comp from '@/components/MainPageV2Comp';
import React from 'react';
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import LoadingComp from '@/components/LoadingComp';

const MainPageV2Comp = dynamic(() => import('@/components/MainPageV2Comp'), { ssr: false });

function page(props) {
    const [ imageUrl, setImageUrl ] = React.useState()
    const pathname = usePathname()

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const site = localStorage.getItem('site').toLowerCase()
            const pageName = pathname.split('/')[2]
        
            const url = `/v2/${site}/${pageName}`

            setImageUrl(url)
        }
    }, []);

    if (imageUrl === undefined) return <LoadingComp />
    
    return (
        <>
            <MainPageV2Comp path={imageUrl}/>
        </>
    );
}

export default page;