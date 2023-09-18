import config from '@/utils/api/config';

interface Response {
    pagination: Hikka.Pagination;
    list: {
        main: boolean;
        character: Hikka.Character;
    }[];
}

export default async function req({
    slug,
}: {
    slug: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + `/anime/${slug}/characters`, {
        method: 'get',
        ...config.config,
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}