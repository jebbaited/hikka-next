import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { FC } from 'react';

import Collections from '@/features/users/user-profile/user-collections/user-collections.component';
import Favorites from '@/features/users/user-profile/user-favorites/user-favorites.component';
import History from '@/features/users/user-profile/user-history/user-history.component';
import Statistics from '@/features/users/user-profile/user-statistics/user-statistics.component';

import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import getUserActivity from '@/services/api/user/getUserActivity';
import getUserHistory from '@/services/api/user/getUserHistory';
import getQueryClient from '@/utils/get-query-client';

interface Props {
    params: {
        username: string;
    };
}

const UserPage: FC<Props> = async ({ params: { username } }) => {
    const queryClient = await getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['favorites', username, { content_type: 'anime' }],
        queryFn: ({ pageParam = 1, meta }) =>
            getFavouriteList({
                page: pageParam,
                params: {
                    username,
                    content_type: 'anime',
                },
            }),
        initialPageParam: 1,
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['history', username],
        queryFn: ({ pageParam, meta }) =>
            getUserHistory({
                params: {
                    username,
                },
                page: pageParam,
            }),
        initialPageParam: 1,
    });

    await queryClient.prefetchQuery({
        queryKey: ['activityStats', username],
        queryFn: ({ meta }) =>
            getUserActivity({
                params: {
                    username,
                },
            }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <div className="order-2 flex flex-col gap-12 lg:order-1 lg:gap-16">
                    <Statistics />
                    <Favorites />
                </div>
                <div className="order-1 flex flex-col gap-12 lg:order-2 lg:gap-16">
                    <History />
                    <Collections />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default UserPage;
