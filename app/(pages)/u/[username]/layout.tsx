import { Metadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import ActivationAlert from '@/app/(pages)/u/[username]/components/activation-alert';
import FollowButton from '@/app/(pages)/u/[username]/components/follow-button';
import FollowStats from '@/app/(pages)/u/[username]/components/follow-stats';
import ListStats from '@/app/(pages)/u/[username]/components/list-stats';
import UserInfo from '@/app/(pages)/u/[username]/components/user-info';
import UserTitle from '@/app/(pages)/u/[username]/components/user-title';
import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import InternalNavBar from '@/components/navigation/nav-tabs';
import SubBar from '@/components/navigation/sub-nav';
import Image from '@/components/ui/image';
import getFollowStats from '@/services/api/follow/getFollowStats';
import getUserInfo, {
    Response as UserResponse,
} from '@/services/api/user/getUserInfo';
import getWatchStats from '@/services/api/watch/getWatchStats';
import { USER_NAV_ROUTES } from '@/utils/constants';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

interface Props extends PropsWithChildren {
    params: {
        username: string;
    };
}

// export const runtime = 'edge';

export async function generateMetadata({
    params,
}: {
    params: {
        username: string;
    };
}): Promise<Metadata> {
    const username = params.username;

    const user: UserResponse = await getUserInfo({ username });

    return _generateMetadata({
        title: {
            default: user.username,
            template: user.username + ' / %s / Hikka',
        },
        description: user.description,
        images: `https://preview.hikka.io/u/${username}/${user.updated}`,
    });
}

const Component = async ({ params: { username }, children }: Props) => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['user', username],
        queryFn: () => getUserInfo({ username }),
    });

    await queryClient.prefetchQuery({
        queryKey: ['watchStats', username],
        queryFn: () => getWatchStats({ username }),
    });

    await queryClient.prefetchQuery({
        queryKey: ['followStats', username],
        queryFn: () => getFollowStats({ username }),
    });

    const dehydratedState = dehydrate(queryClient);

    if (dehydratedState.queries.length === 0) {
        return redirect('/404');
    }

    const user: API.User | undefined = queryClient.getQueryData([
        'user',
        username,
    ]);

    if (!user) {
        return redirect('/');
    }

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12 lg:gap-16">
                <ActivationAlert />
                {user.cover && (
                    <div className="absolute left-0 top-0 -z-20 h-80 w-full overflow-hidden opacity-40 gradient-mask-b-0">
                        <Image
                            src={user.cover}
                            className="relative size-full object-cover"
                            alt="cover"
                            fill
                            priority
                        />
                    </div>
                )}
                <Breadcrumbs>
                    <Link
                        href={'/u/' + user?.username}
                        className="text-sm font-bold hover:underline"
                    >
                        {user?.username}
                    </Link>
                    <NavMenu
                        routes={USER_NAV_ROUTES}
                        urlPrefix={'/u/' + username}
                    />
                </Breadcrumbs>
                <SubBar>
                    <InternalNavBar
                        routes={USER_NAV_ROUTES}
                        urlPrefix={'/u/' + username}
                    />
                </SubBar>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                    <div className="flex flex-col gap-4 lg:gap-8">
                        <div className="flex gap-4 lg:gap-8">
                            <UserInfo />
                            <div className="flex flex-col gap-2">
                                <UserTitle />
                                <FollowStats className="hidden lg:flex" />
                                <div className="hidden flex-1 flex-col justify-end gap-2 lg:flex">
                                    <FollowButton />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 lg:hidden">
                            <FollowStats />
                            <FollowButton className="w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <ListStats />
                    </div>
                </div>
                <div className="flex flex-col gap-12">{children}</div>
            </div>
        </HydrationBoundary>
    );
};

export default Component;
