'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import useEditTop from '@/services/hooks/stats/edit/useEditTop';

import EditTopItem from './components/ui/edit-top-item';


const Component = () => {
    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useEditTop();

    if (!list) {
        return null;
    }

    return (
        <>
            <hr className="-mx-6 mt-4 h-px w-auto bg-border" />
            <div className="-mx-6 h-full w-auto flex-1 overflow-y-scroll">
                {list.map((stat, index) => {
                    return (
                        <EditTopItem
                            key={stat.user.reference}
                            user={stat.user}
                            rank={index + 1}
                            accepted={stat.accepted}
                            closed={stat.closed}
                            denied={stat.denied}
                        />
                    );
                })}
                {hasNextPage && (
                    <div className="px-4">
                        <Button
                            variant="secondary"
                            ref={ref}
                            disabled={isFetchingNextPage}
                            onClick={() => hasNextPage && fetchNextPage()}
                            className="w-full"
                        >
                            {isFetchingNextPage && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Завантажити ще
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Component;
