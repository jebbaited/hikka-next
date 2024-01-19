import SnackbarUtils from '@/utils/snackbar-utils';
import config from '@/utils/api/config';
import getApiErrorMessage from '@/utils/getApiErrorMessage';

export interface Response {
    success: boolean;
}

export default async function req({
    overwrite,
    anime,
    secret,
}: {
    overwrite: boolean;
    anime: Record<string, any>[];
    secret: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/settings/import/watch', {
        method: 'post',
        body: JSON.stringify({ anime, overwrite }),
        ...config.config,
        headers: {
            ...config.config.headers,
            auth: secret || '',
        },
    });

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            const error: Hikka.Error = await res.json();
            const errorMessage = getApiErrorMessage(error);

            errorMessage && SnackbarUtils.error(errorMessage);
            throw error;
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
