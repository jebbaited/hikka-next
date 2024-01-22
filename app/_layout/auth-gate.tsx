import { PropsWithChildren } from 'react';

import { headers } from 'next/headers';

import { dehydrate } from '@tanstack/query-core';

import { getCookie } from '@/app/actions';
import RQHydrate from '@/utils/RQ-hydrate';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import getQueryClient from '@/utils/getQueryClient';
import getCharacterInfo from '@/utils/api/characters/getCharacterInfo';

interface Props extends PropsWithChildren {}

const Component = async ({ children }: Props) => {
    const headersList = headers();
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () =>
            getLoggedUserInfo({ secret: secret }),
    });


    const dehydratedState = dehydrate(queryClient);

    const loggedUserData: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser', secret
    ]);

    if (!loggedUserData) {
        await fetch('http://' + headersList.get('host') + '/auth/logout');
    }

    return <RQHydrate state={dehydratedState}>{children}</RQHydrate>;
};

export default Component;
