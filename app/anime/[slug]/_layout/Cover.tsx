'use client';

import Image from '@/app/_components/Image';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import BaseCard from "@/app/_components/BaseCard";

const Component = () => {
    const params = useParams();

    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!data) {
        return null;
    }

    return (
        <div className="flex items-center md:px-0 px-16">
            <BaseCard poster={data.poster} />
        </div>
    );
};

export default Component;
