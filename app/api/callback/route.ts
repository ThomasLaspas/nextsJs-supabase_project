import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { IncomingMessage } from 'http'; // Import IncomingMessage type

export async function GET(request: IncomingMessage) { // Define type for request parameter
    const requestUrl = new URL(request.url!, 'http://localhost:3000');
    const code = requestUrl.searchParams.get('code');
    if (code) {
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        await supabase.auth.exchangeCodeForSession(code);
    }
    return NextResponse.redirect(`${requestUrl.origin}/protected`);
}