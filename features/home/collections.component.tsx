'use client';

import Link from 'next/link';
import { FC } from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';

import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';

import CollectionItem from '@/features/users/user-profile/user-collections/collection-item';

import useSession from '@/services/hooks/auth/use-session';
import useCollections from '@/services/hooks/collections/use-collections';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const Collections: FC<Props> = ({ className }) => {
    const { user: loggedUser } = useSession();

    const { data: collections } = useCollections({
        sort: 'created',
        page: 1,
    });

    const filteredCollections = collections?.list?.slice(0, 3);

    return (
        <Block className={cn(className)}>
            <Header title="Колекції" href="/collections">
                {loggedUser?.username && (
                    <Button asChild size="icon-sm" variant="outline">
                        <Link href="/collections/new">
                            <MaterialSymbolsAddRounded />
                        </Link>
                    </Button>
                )}
            </Header>
            <div className="flex flex-col gap-6">
                {filteredCollections &&
                    filteredCollections.map((item) => (
                        <CollectionItem data={item} key={item.reference} />
                    ))}
            </div>
        </Block>
    );
};

export default Collections;
