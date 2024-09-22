'use client'

import React from 'react';
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import { menuButtonV2 as menuButton } from '@/utils/coordinates';
import useSWR from 'swr';
import useImage from 'use-image';
import LoadingComp from '@/components/LoadingComp';
import TableLoggerComp from '@/components/TableLoggerComp';
import { selectAlgDonggi, selectTlgL10224 } from '@/pages/api/selectDonggiData';
import dynamic from 'next/dynamic';

// const Stage = dynamic(() => import('react-konva').then(mod => mod.Stage), { ssr: false });
// const Layer = dynamic(() => import('react-konva').then(mod => mod.Layer), { ssr: false });
// const Rect = dynamic(() => import('react-konva').then(mod => mod.Rect), { ssr: false });
// const Text = dynamic(() => import('react-konva').then(mod => mod.Text), { ssr: false });

function page(props) {
    const [imageUrl, setImageUrl] = React.useState()
    const [image] = useImage(`${imageUrl}.png`);
    const [canvasSize, setCanvasSize] = React.useState();
    const [imgAspectRatio, setImgAspectRatio] = React.useState(1); // Default aspect ratio
    const router = useRouter();
    const pathname = usePathname()

    // const { data, error, isLoading } = useSWR(
    //     '/api/selectDonggiData',
    //     selectTlgL10224(tagValue),
    //     { refreshInterval: 1000 }
    // )
    
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const site = localStorage.getItem('site') ? localStorage.getItem('site').toLowerCase() : 'donggi'
            const pageName = pathname.split('/')[2]

            const url = `/v2/${site}/${pageName}`

            setImageUrl(url)
        }

        const resizeCanvas = () => {
            if (!image) return;

            const canvasWidth = window.innerWidth;
            const aspectRatio = image.width / image.height;
            const canvasHeight = canvasWidth / aspectRatio;
            setCanvasSize({ width: canvasWidth, height: canvasHeight });
            setImgAspectRatio(aspectRatio);
        };

        window.addEventListener('resize', resizeCanvas);
        if (image) resizeCanvas(); // Call initially when the image loads

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };

    }, [image]);

    const handleButtonClick = (button) => {
        router.push(button.href);
    };

    if (canvasSize == undefined) return <LoadingComp flag={'canvas'}/>
    // if (error) return <p>Error when loading page</p>
    // if (isLoading) return <LoadingComp flag={'page'} />

    return (
        <div style={{ width: '100%', minHeight: '100vh', overflowY: 'hidden', overflowX: 'hidden' }}>
            <div 
            className='absolute w-1/2 z-10 overflow-y-hidden overflow-x-hidden left-1/2 mt-10'
            style={{
                overflow: '-moz-hidden-unscrollable',
                transform: 'translate(-50%, 0)', 
                maxHeight: '90%',
                maxWidth: '95%',
                minWidth: '90%',
                top: '150px'
            }}
            >
                <TableLoggerComp/>
            </div>
            <Stage width={canvasSize.width} height={canvasSize.height}>
                <Layer>
                    {/* Render the background image */}
                    {
                        image && (
                            <Image
                                image={image}
                                x={0}
                                y={0}
                                width={canvasSize.width}
                                height={canvasSize.height}
                            />
                        )
                    }

                    {/* Render buttons */}
                    {
                        menuButton.map((button, index) => {
                            const btnX = button.x * canvasSize.width;
                            const btnY = button.y * canvasSize.height;
                            const btnWidth = button.width * canvasSize.width;
                            const btnHeight = button.height * canvasSize.height;

                            return (
                                <Rect
                                    key={index}
                                    x={btnX}
                                    y={btnY}
                                    width={btnWidth}
                                    height={btnHeight}
                                    fill="transparent"
                                    stroke="transparent"
                                    onClick={() => handleButtonClick(button)}
                                    onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                    onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}
                                />
                            );
                        })
                    }

                </Layer>
            </Stage>
        </div>
    );
}

export default page;