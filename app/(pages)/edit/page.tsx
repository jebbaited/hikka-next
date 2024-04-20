import * as React from 'react';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';

import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import EditList from '@/app/(pages)/edit/components/edit-list/edit-list';
import EditTopStats from '@/app/(pages)/edit/components/edit-top-stats/edit-top-stats';
import EditFiltersModal from '@/components/modals/edit-filters-modal';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';
import getEditList from '@/services/api/edit/getEditList';
import getEditTop from '@/services/api/stats/edit/getEditTop';
import getQueryClient from '@/utils/getQueryClient';

import Filters from '../../../components/filters/edit-filters';

const EditListPage = async ({
    searchParams: { page, content_type, order, sort, edit_status },
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    if (!page) {
        return redirect('/edit?page=1');
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: [
            'editList',
            {
                page,
                content_type: content_type || null,
                order: order || 'desc',
                sort: sort || 'edit_id',
                edit_status: edit_status || null,
            },
        ],
        queryFn: () => getEditList({ page: Number(page) }),
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['editTopStats'],
        queryFn: ({ pageParam }) => getEditTop({ page: Number(pageParam) }),
        initialPageParam: 1,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12 lg:gap-12">
                <EditTopStats />
                <div className="grid grid-cols-1 justify-center gap-8 lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                    <div className="flex flex-col gap-12">
                        <Block>
                            <div className="flex items-center justify-between">
                                <Header title="Правки" />
                                <EditFiltersModal>
                                    <Button
                                        variant="outline"
                                        className="flex lg:hidden"
                                    >
                                        <AntDesignFilterFilled /> Фільтри
                                    </Button>
                                </EditFiltersModal>
                            </div>
                            <EditList page={page as string} />
                        </Block>
                    </div>
                    <Card className="py-0 sticky top-20 order-1 hidden w-full opacity-60 transition-opacity hover:opacity-100 lg:order-2 lg:block">
                        <Filters />
                    </Card>
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default EditListPage;
