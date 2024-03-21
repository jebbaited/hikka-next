import { useModalContext } from '@/services/providers/modal-provider';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EditListModal from '@/components/modals/editlist-modal';
import clsx from 'clsx';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

interface Props {
    slug: string;
    content_type: API.ContentType;
    className?: string;
}

const Component = ({ className, slug, content_type }: Props) => {
    const { openModal } = useModalContext();
    const params = useParams();

    return (
        <Button
            variant="outline"
            size="icon-xs"
            onClick={() =>
                openModal({
                    content: (
                        <EditListModal
                            content_type={content_type}
                            slug={slug}
                        />
                    ),
                    type: 'sheet',
                    title: 'Список правок',
                })
            }
            className={clsx(className)}
        >
            <MaterialSymbolsEditRounded />
        </Button>
    );
};

export default Component;