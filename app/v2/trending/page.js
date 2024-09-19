'use client'

import MainPageV2Comp from '@/components/MainPageV2Comp';
import React from 'react';
import { usePathname } from 'next/navigation'
import { selectAlgDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';
import {
    Progress
} from "@nextui-org/react";

function page(props) {

    const [trendingValue, setTrendingValue] = React.useState()
    const { data, error, isLoading } = useSWR(
        '/api/selectDonggiData',
        selectAlgDonggi,
        { refreshInterval: 1000 }
    )
    const site = localStorage.getItem('site').toLowerCase()
    const pathname = usePathname()
    const pageName = pathname.split('/')[2]

    const imageUrl = `/v2/${site}/${pageName}`

    if (error) return <p>Error when loading page</p>
    if (isLoading) return

    console.log('data', data)

    return (
        // <></>
        <MainPageV2Comp path={imageUrl} trending={data}/>
    );
}

export default page;