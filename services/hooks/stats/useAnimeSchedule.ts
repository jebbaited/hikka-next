import { useSearchParams } from 'next/navigation';

import getAnimeSchedule from '@/services/api/stats/getAnimeSchedule';
import useAuth from '@/services/hooks/auth/useAuth';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import getCurrentSeason from '@/utils/getCurrentSeason';

const useAnimeSchedule = () => {
    const searchParams = useSearchParams();

    const only_watch = searchParams.get('only_watch') ? Boolean(searchParams.get('only_watch')) : undefined;
    const season =
        (searchParams.get('season') as API.Season) || getCurrentSeason()!;
    const year =
        searchParams.get('year') || String(new Date().getFullYear());
    const status =
        (searchParams.getAll('status').length > 0
            ? searchParams.getAll('status')
            : ['ongoing']) as API.Status[];

    const { auth } = useAuth();

    return useInfiniteList({
        queryKey: ['animeSchedule', { season, status, auth, year, only_watch }],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeSchedule({
                airing_season: [season, year],
                status,
                page: pageParam,
                auth,
                only_watch: only_watch,
            }),
    });
};

export default useAnimeSchedule;
