import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';



import Link from 'next/link';



import { dehydrate } from '@tanstack/query-core';



import Breadcrumbs from '@/app/_components/breadcrumbs';
import SubBar from '@/app/_components/sub-navbar';
import RQHydrate from '@/utils/RQ-hydrate';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import getCharacterAnime from '@/utils/api/characters/getCharacterAnime';
import getCharacterInfo, { Response as CharacterResponse } from '@/utils/api/characters/getCharacterInfo';
import getQueryClient from '@/utils/getQueryClient';



import Cover from './_layout/cover';
import NavMenu from './_layout/nav-menu';
import NavBar from './_layout/navbar';
import Title from './_layout/title';


interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

// export const runtime = 'edge';

export async function generateMetadata(
    {
        params,
    }: {
        params: {
            slug: string;
        };
    },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;
    const slug = params.slug;

    const character: CharacterResponse = await getCharacterInfo({ slug });
    const title = character.name_ua || character.name_en || character.name_ja;

    return {
        title: { default: title, template: title + ' / %s / Hikka' },
        description: undefined,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image,
        },
    };
}

const Component = async ({ params: { slug }, children }: Props) => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['character', slug],
        queryFn: () => getCharacterInfo({ slug }),
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['characterAnime', slug],
        queryFn: () =>
            getCharacterAnime({ slug }),
        initialPageParam: 1,
    });

    const character: Hikka.Character | undefined = queryClient.getQueryData([
        'character',
        slug,
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Link
                            href={'/characters/' + character?.slug}
                            className="flex-1 overflow-hidden overflow-ellipsis text-sm font-bold hover:underline"
                        >
                            {character?.name_ua ||
                                character?.name_en ||
                                character?.name_ja}
                        </Link>
                    </div>
                    <NavMenu />
                </Breadcrumbs>
                <SubBar mobileOnly>
                    <NavBar />
                </SubBar>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                    <div className="flex flex-col gap-4">
                        <Cover />
                    </div>
                    <div className="flex flex-col gap-12">
                        <Title />
                        {children}
                    </div>
                </div>
            </>
        </RQHydrate>
    );
};

export default Component;