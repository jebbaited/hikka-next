import getQueryClient from '@/utils/getQueryClient';
import { dehydrate } from '@tanstack/query-core';
import RQHydrate from '@/utils/RQHydrate';
import { PropsWithChildren } from 'react';
import User from '@/app/u/[username]/_layout/User';
import getUserInfo from '@/utils/api/user/getUserInfo';
import getFavouriteList from '@/utils/api/favourite/getFavouriteList';
import getWatchStats from '@/utils/api/watch/getWatchStats';
import NavBar from '@/app/u/[username]/_layout/NavBar';
import { redirect } from 'next/navigation';
import getFollowings from '@/utils/api/follow/getFollowings';
import getFollowers from '@/utils/api/follow/getFollowers';
import Followers from '@/app/u/[username]/_layout/Followers';
import Followings from '@/app/u/[username]/_layout/Followings';

interface Props extends PropsWithChildren {
    params: { username: string };
}

const Component = async ({ params: { username }, children }: Props) => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(['user', username], () =>
        getUserInfo({ username }),
    );

    await queryClient.prefetchQuery(['favorites', username], () =>
        getFavouriteList({ username }),
    );

    await queryClient.prefetchQuery(['watchStats', username], () =>
        getWatchStats({ username }),
    );

    await queryClient.prefetchQuery(['followings', username], () =>
        getFollowings({ username }),
    );

    await queryClient.prefetchQuery(['followers', username], () =>
        getFollowers({ username }),
    );

    const dehydratedState = dehydrate(queryClient);

    if (dehydratedState.queries.length === 0) {
        return redirect('/404');
    }

    return (
        <RQHydrate state={dehydratedState}>
            <div className="grid grid-cols-1 md:grid-cols-[20%_1fr] md:gap-16 gap-12">
                <div className="flex flex-col gap-12 md:sticky md:top-20 md:self-start">
                    <User />
                    <div className="md:flex flex-col gap-12 hidden">
                        <Followers />
                        <Followings />
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <NavBar />
                    {children}
                </div>
            </div>
        </RQHydrate>
    );
};

export default Component;