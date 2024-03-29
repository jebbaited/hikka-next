import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import Breadcrumbs from '@/components/navbar/nav-breadcrumbs';
import InternalNavBar from '@/components/navbar/nav-tabs';
import NavMenu from '@/components/navbar/nav-dropdown';
import SubBar from '@/components/navbar/sub-nav';
import getPersonAnime from '@/services/api/people/getPersonAnime';
import getPersonCharacters from '@/services/api/people/getPersonCharacters';
import getPersonInfo from '@/services/api/people/getPersonInfo';
import { PERSON_NAV_ROUTES } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

import Cover from '@/app/(pages)/people/[slug]/components/cover';
import Title from '@/app/(pages)/people/[slug]/components/title';
import { redirect } from 'next/navigation';


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

    const person = await getPersonInfo({ slug });
    const title = person.name_ua || person.name_en || person.name_native;

    return {
        title: { default: title, template: title + ' / %s / Hikka' },
        description: undefined,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: person.image,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: person.image,
        },
    };
}

const PersonLayout = async ({ params: { slug }, children }: Props) => {
    const queryClient = getQueryClient();

    const person = await queryClient.fetchQuery({
        queryKey: ['person', slug],
        queryFn: () => getPersonInfo({ slug }),
    });

    if (!person) {
        return redirect('/');
    }

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['personAnime', slug],
        queryFn: () => getPersonAnime({ slug }),
        initialPageParam: 1,
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['personCharacters', slug],
        queryFn: () => getPersonCharacters({ slug }),
        initialPageParam: 1,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Link
                            href={'/people/' + person?.slug}
                            className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                        >
                            {person?.name_ua ||
                                person?.name_en ||
                                person?.name_native}
                        </Link>
                    </div>
                    <NavMenu
                        routes={PERSON_NAV_ROUTES}
                        urlPrefix={'/people/' + slug}
                    />
                </Breadcrumbs>
                <SubBar mobileOnly>
                    <InternalNavBar
                        routes={PERSON_NAV_ROUTES}
                        urlPrefix={'/people/' + slug}
                    />
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
        </HydrationBoundary>
    );
};

export default PersonLayout;
