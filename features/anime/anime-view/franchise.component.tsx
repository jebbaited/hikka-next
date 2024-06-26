'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useAnimeInfo from '@/services/hooks/anime/use-anime-info';
import useFranchise from '@/services/hooks/anime/use-franchise';

interface Props {
    extended?: boolean;
}

const Franchise: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });

    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useFranchise({ slug: String(params.slug) });

    if (!anime || !anime.has_franchise) {
        return null;
    }

    if (!list || list.length === 0) {
        return null;
    }

    const filterSelfData = list.filter((anime) => anime.slug !== params.slug);
    const filteredData = extended ? filterSelfData : filterSelfData.slice(0, 4);

    return (
        <Block>
            <Header
                title={`Пов’язане`}
                href={!extended ? params.slug + '/franchise' : undefined}
            />
            <Stack extended={extended} size={4} className="grid-min-10">
                {filteredData.map((anime) => (
                    <AnimeCard key={anime.slug} anime={anime} />
                ))}
            </Stack>
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </Block>
    );
};

export default Franchise;
