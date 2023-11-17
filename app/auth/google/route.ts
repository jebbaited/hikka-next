import loginOAuth from '@/utils/api/auth/loginOAuth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const res = await loginOAuth({
            code: String(code),
            provider: 'google',
        });

        cookies().set('secret', res.secret);

        return redirect('/anime?auth=success&provider=google');
    } catch (e) {
        if ('code' in (e as Hikka.Error)) {
            return redirect('/anime?auth=error&provider=google&error=' + (e as Hikka.Error).code);
        }
        return redirect('/anime?auth=error&provider=google');
    }
}