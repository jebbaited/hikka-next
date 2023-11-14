'use client';

import { useParams, usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import getAnimeStaff from '@/utils/api/anime/getAnimeStaff';
import { useEffect, useRef } from 'react';
import useIsMobile from '@/utils/hooks/useIsMobile';

const ITEMS: {
    slug: string;
    title_ua: string;
    url: string;
}[] = [
    {
        slug: 'general',
        title_ua: 'Загальне',
        url: '',
    },
    {
        slug: 'characters',
        title_ua: 'Персонажі',
        url: '/characters',
    },
    {
        slug: 'staff',
        title_ua: 'Автори',
        url: '/staff',
    },
    {
        slug: 'media',
        title_ua: 'Медіа',
        url: '/media',
    },
    {
        slug: 'links',
        title_ua: 'Посилання',
        url: '/links',
    },
    {
        slug: 'franchise',
        title_ua: "Пов'язане",
        url: '/franchise',
    },
];

const Component = () => {
    const isMobile = useIsMobile();
    const navRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const pathname = usePathname();

    const { data: anime } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    const { data: characters } = useQuery({
        queryKey: ['characters', params.slug],
        queryFn: () => getAnimeCharacters({ slug: String(params.slug) }),
    });

    const { data: staff } = useQuery({
        queryKey: ['staff', params.slug],
        queryFn: () => getAnimeStaff({ slug: String(params.slug) }),
    });

    const filteredItems = ITEMS.filter((item) => {
        switch (item.slug) {
            case 'characters':
                return (
                    characters && characters?.list && characters.list.length > 0
                );
            case 'staff':
                return staff && staff?.list && staff.list.length > 0;
            case 'media':
                return (
                    anime &&
                    (anime?.ost || anime?.videos) &&
                    (anime?.ost.length > 0 || anime?.videos.length > 0)
                );
            case 'links':
                return anime && anime?.external && anime.external.length > 0;
            case 'franchise':
                return anime && anime.has_franchise;
            case 'general':
                return true;
        }
    });

    useEffect(() => {
        if (
            isMobile &&
            navRef.current &&
            pathname !== `/anime/${params.slug}`
        ) {
            navRef.current.scrollIntoView();
        }
    }, [pathname]);

    return (
        <div
            ref={navRef}
            className="flex gap-8 overflow-y-scroll -mx-4 md:mx-0 p-4 md:p-0"
        >
            {filteredItems.map((item) => {
                return (
                    <Link
                        href={'/anime/' + params.slug + item.url}
                        key={item.slug}
                        className={clsx(
                            'btn btn-ghost rounded-full btn-sm',
                            pathname === '/anime/' + params.slug + item.url &&
                                'btn-active',
                        )}
                    >
                        {item.title_ua}
                    </Link>
                );
            })}
        </div>
    );
};

export default Component;
