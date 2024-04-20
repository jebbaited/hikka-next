'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import useCharacterVoices from '@/services/hooks/characters/useCharacterVoices';

import VoiceCard from '../../../components/voice-card';

interface Props {
    extended?: boolean;
}

const Voices = ({ extended }: Props) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterVoices({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header
                title={'Сейю'}
                href={!extended ? params.slug + '/voices' : undefined}
            />
            <Stack
                size={5}
                extendedSize={5}
                className="grid-min-10"
                extended={extended}
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <VoiceCard
                        key={ch.person.slug + ch.anime.slug}
                        anime={ch.anime}
                        person={ch.person}
                        language={ch.language}
                    />
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

export default Voices;
