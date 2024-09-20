'use client'

// import MainPageV2Comp from '@/components/MainPageV2Comp';
import React from 'react';
import { usePathname } from 'next/navigation'
import { selectAlgDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';
import {
    Progress
} from "@nextui-org/react";
import dynamic from 'next/dynamic'

const MainPageV2Comp = dynamic(() => import('@/components/MainPageV2Comp'), { ssr: false });


function page(props) {
    const [ imageUrl, setImageUrl ] = React.useState()
    const { data, error, isLoading } = useSWR(
        '/api/selectDonggiData',
        selectAlgDonggi,
        { refreshInterval: 1000 }
    )
    const pathname = usePathname()

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const site = localStorage.getItem('site').toLowerCase()
            const pageName = pathname.split('/')[2]
        
            const url = `/v2/${site}/${pageName}`

            setImageUrl(url)
        }
    }, []);

    if (error) return <p>Error when loading page</p>
    if (isLoading || !imageUrl) return <p>Loading Page</p>

    console.log('data trending', data)

    return (
        <>
            <MainPageV2Comp path={imageUrl} trending={data}/>
        </>
    );
}

export default page;