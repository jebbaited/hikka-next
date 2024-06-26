'use client';

import { useSnackbar } from 'notistack';
import { FC, Fragment, createElement, memo } from 'react';

import { Button } from '@/components/ui/button';

import WatchEditModal from '@/features/modals/watch-edit-modal';

import useSession from '@/services/hooks/auth/use-session';
import useAddToList from '@/services/hooks/watch/use-add-to-list';
import { useModalContext } from '@/services/providers/modal-provider';
import { WATCH_STATUS } from '@/utils/constants';

interface Props {
    item: API.AnimeSchedule;
    title: string;
}

const ScheduleWatchButton: FC<Props> = ({ item, title }) => {
    const { user: loggedUser } = useSession();
    const { enqueueSnackbar } = useSnackbar();
    const { openModal } = useModalContext();
    const { mutate: addToList } = useAddToList({ slug: item.anime.slug });

    const watch = item.anime.watch.length > 0 ? item.anime.watch[0] : null;
    const watchStatus = watch ? WATCH_STATUS[watch.status] : null;

    const handleWatch = () => {
        if (watchStatus) {
            openModal({
                content: <WatchEditModal slug={item.anime.slug} />,
                className: '!max-w-xl',
                title: title,
                forceModal: true,
            });

            return;
        }

        addToList({ status: 'planned' });

        enqueueSnackbar('Аніме додано до Вашого списку', {
            variant: 'success',
        });
    };

    if (!loggedUser) return null;

    return (
        <Fragment>
            <Button
                className="hidden sm:flex"
                style={{
                    backgroundColor: watchStatus?.color,
                }}
                onClick={handleWatch}
                variant={watchStatus ? 'secondary' : 'outline'}
                size="icon-sm"
            >
                {watchStatus
                    ? createElement(watchStatus.icon!)
                    : createElement(WATCH_STATUS.planned.icon!)}
            </Button>

            <Button
                className="flex sm:hidden"
                onClick={handleWatch}
                variant={watchStatus ? 'secondary' : 'outline'}
                size="sm"
            >
                {watchStatus
                    ? createElement(watchStatus.icon!)
                    : createElement(WATCH_STATUS.planned.icon!)}
                {watchStatus ? watchStatus.title_ua : 'Додати у список'}
            </Button>
        </Fragment>
    );
};

export default memo(ScheduleWatchButton);
