'use client';

import { useParams } from 'next/navigation';

import CharacterCard from '@/app/(pages)/(content)/components/character-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import useCharacters from '@/services/hooks/anime/useCharacters';

interface Props {
    extended?: boolean;
}

const OtherCharacters = ({ extended }: Props) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacters({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    const other = list.filter((ch) => !ch.main);

    if (other.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header title={'Другорядні Персонажі'} />
            <Stack size={5} className="grid-min-6" extended={extended}>
                {other.map((ch) => (
                    <CharacterCard
                        key={ch.character.slug}
                        character={ch.character}
                    />
                ))}
            </Stack>
        </Block>
    );
};

export default OtherCharacters;
