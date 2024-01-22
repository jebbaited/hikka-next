'use client';

import { useParams } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Rating from '@/app/_components/rating';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { Progress } from '@/app/_components/ui/progress';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import addWatch from '@/utils/api/watch/addWatch';
import getWatch from '@/utils/api/watch/getWatch';
import { useAuthContext } from '@/utils/providers/auth-provider';


const Component = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const { secret } = useAuthContext();
    const { data: watch, isError: watchError } = useQuery({
        queryKey: ['watch', secret, params.slug],
        queryFn: () =>
            getWatch({ slug: String(params.slug), secret: String(secret) }),
    });
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    const { mutate: addToList, isPending: addToListLoading } = useMutation({
        mutationKey: ['addToList', secret, params.slug],
        mutationFn: (mutationParams: {
            status: Hikka.WatchStatus;
            score: number;
            episodes: number;
        }) =>
            addWatch({
                secret: String(secret),
                slug: String(params.slug),
                ...mutationParams,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['watch'] });
        },
    });

    const changeEpisodes = (action: 'increase' | 'decrease') => {
        let status = watch!.status;

        if (action === 'increase') {
            if (
                watch?.episodes &&
                watch.episodes + 1 === data?.episodes_total
            ) {
                status = 'completed';
            }

            if (!watch?.episodes && watch!.status === 'planned') {
                status = 'watching';
            }
        }

        switch (action) {
            case 'decrease':
                addToList({
                    status,
                    score: watch!.score,
                    episodes: watch?.episodes ? watch.episodes - 1 : 0,
                });
                break;
            case 'increase':
                addToList({
                    status,
                    score: watch!.score,
                    episodes: watch?.episodes ? watch.episodes + 1 : 1,
                });
                break;
        }
    };

    if (!watch || watchError || !data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4 rounded-lg border border-secondary/60 bg-secondary/30 p-4">
                <Rating
                    // className="rating-md lg:flex"
                    onChange={(value) => {
                        addToList({
                            status: watch?.status,
                            score: value * 2,
                            episodes: watch?.episodes,
                        });
                    }}
                    totalStars={5}
                    precision={0.5}
                    value={watch.score ? watch.score / 2 : 0}
                />
                <h3>
                    {watch.score}
                    <Label className="text-sm font-normal text-muted-foreground">
                        /10
                    </Label>
                </h3>
            </div>
            <div className="rounded-lg border border-secondary/60 bg-secondary/30 p-4">
                <div className="flex justify-between gap-2 overflow-hidden">
                    <Label className="min-h-[24px] overflow-hidden overflow-ellipsis">
                        Епізоди
                    </Label>
                    <div className="inline-flex">
                        <Button
                            variant="secondary"
                            size="icon-xs"
                            className="rounded-r-none"
                            onClick={() => changeEpisodes('decrease')}
                        >
                            -
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon-xs"
                            className="rounded-l-none"
                            onClick={() => changeEpisodes('increase')}
                        >
                            +
                        </Button>
                    </div>
                </div>
                <h3>
                    {watch.episodes}
                    <Label className="text-sm font-normal text-muted-foreground">
                        /{watch.anime.episodes_total || '?'}
                    </Label>
                </h3>
                <Progress
                    className="h-2 mt-2"
                    max={watch.anime.episodes_total || watch.episodes}
                    value={watch.episodes}
                />
            </div>
        </div>
    );
};

export default Component;