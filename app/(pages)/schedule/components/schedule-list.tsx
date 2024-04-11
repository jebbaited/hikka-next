'use client';

import { getUnixTime, startOfDay } from 'date-fns';
import format from 'date-fns/format';
import * as React from 'react';

import FiltersNotFound from '@/components/filters/components/filters-not-found';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import useAnimeSchedule from '@/services/hooks/stats/useAnimeSchedule';

import ScheduleItem from './ui/schedule-item';


const ScheduleList = () => {
    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useAnimeSchedule();
    

    const sortedList = list?.reduce(
        (acc: Record<string, API.AnimeSchedule[]>, item) => {
            const day = getUnixTime(startOfDay(item.airing_at * 1000));
            if (!(day in acc)) {
                acc[day] = [];
            }

            acc[day] = [...acc[day], item];
            return acc;
        },
        {},
    );

    return (
        <div className="flex flex-col gap-12">
            {sortedList && Object.keys(sortedList).map((day) => {
                const formattedDay = format(
                    Number(day) * 1000,
                    'eeee ,d MMM',
                ).split(',');

                return (
                    <div key={day} className="flex flex-col gap-8">
                        <SubHeader
                            className="capitalize"
                            title={
                                <span>
                                    {formattedDay[0]}
                                    <span className="rounded-sm bg-primary p-1 text-primary-foreground">
                                        {formattedDay[1]}
                                    </span>
                                </span>
                            }
                        />
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {sortedList[day].map((item) => (
                                <ScheduleItem
                                    key={item.airing_at + item.anime.slug}
                                    item={item}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
            {hasNextPage && (
                <Button
                    variant="outline"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Завантажити ще
                </Button>
            )}
            {(!list || list.length === 0) && <FiltersNotFound />}
        </div>
    );
};

export default ScheduleList;
