'use client';

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import useEdit from '@/services/hooks/edit/useEdit';
import { EDIT_STATUS } from '@/utils/constants';

interface Props {
    editId: string;
}

const EditStatus = ({ editId }: Props) => {
    const { data: edit } = useEdit({ editId: Number(editId) });

    if (!edit || !edit.status) {
        return null;
    }

    return (
        <Badge variant="status" bgColor={EDIT_STATUS[edit.status].color}>
            {EDIT_STATUS[edit.status].title_ua}
        </Badge>
    );
};

export default EditStatus;
