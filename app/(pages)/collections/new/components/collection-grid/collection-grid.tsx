'use client';

import React from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';

import {
    DndContext,
    DragEndEvent,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from '@dnd-kit/sortable';

import SortableCard from '@/app/(pages)/collections/new/components/collection-grid/components/ui/sortable-card';
import EntryCard from '@/components/entry-card/entry-card';
import SearchModal from '@/components/modals/search-modal';
import SubHeader from '@/components/sub-header';
import {
    Group as CollectionGroup,
    Item as CollectionItem,
    useCollectionContext,
} from '@/services/providers/collection-provider';

interface Props {
    group: CollectionGroup;
}

const CollectionGrid = ({ group }: Props) => {
    const {
        groups,
        setState: setCollectionState,
        content_type,
    } = useCollectionContext();

    const items = groups.find((g) => g.id === group.id)?.items;

    if (!items) {
        return null;
    }

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeItem = items.find((item) => item.id === active.id);
        const overItem = items.find((item) => item.id === over.id);

        if (!activeItem || !overItem) {
            return;
        }

        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);

        if (activeIndex !== overIndex) {
            setCollectionState!((prev) => ({
                ...prev,
                groups: prev.groups.map((g) => {
                    if (g.id === group.id) {
                        return {
                            ...g,
                            items: arrayMove<CollectionItem>(
                                g.items,
                                activeIndex,
                                overIndex,
                            ),
                        };
                    }

                    return g;
                }),
            }));
        }
    };

    const handleAddItem = (content: API.Anime | API.Character | API.Person) => {
        if (JSON.stringify(groups).includes(content.slug)) {
            return;
        }

        setCollectionState!((prev) => ({
            ...prev,
            groups: prev.groups.map((g) => {
                if (g.id === group.id) {
                    return {
                        ...g,
                        items: [
                            ...g.items,
                            {
                                id: content.slug,
                                content: content,
                            },
                        ],
                    };
                }

                return g;
            }),
        }));
    };

    const handleRemoveItem = (id: string | number) => {
        setCollectionState!((prev) => ({
            ...prev,
            groups: prev.groups.map((g) => {
                if (g.id === group.id) {
                    return {
                        ...g,
                        items: g.items.filter((item) => item.id !== id),
                    };
                }

                return g;
            }),
        }));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <div className="flex flex-col gap-4">
                    {group.isGroup && (
                        <SubHeader
                            title={
                                group.title && group.title.trim().length > 0
                                    ? group.title
                                    : 'Нова група'
                            }
                            variant="h5"
                        />
                    )}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                        {items.map((item) => (
                            <SortableCard
                                key={item.id}
                                id={String(item.id)}
                                content={item.content}
                                onRemove={() => handleRemoveItem(item.id)}
                            />
                        ))}

                        <SearchModal
                            content_type={content_type}
                            onClick={(value) =>
                                handleAddItem(value)
                            }
                            type="button"
                        >
                            <EntryCard
                                poster={
                                    <MaterialSymbolsAddRounded className="text-4xl text-muted-foreground" />
                                }
                            />
                        </SearchModal>
                    </div>
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default CollectionGrid;
