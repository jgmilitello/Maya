import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userQueries } from '@/lib/db';
import { createToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/session';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username: string = body?.username?.trim() ?? '';
  const password: string = body?.password ?? '';

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  let user = userQueries.findByUsername.get(username);

  if (!user) {
    // First time: auto-register with this username/password
    const password_hash = await bcrypt.hash(password, 10);
    const email = `${username.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    userQueries.create.run({ username, email, password_hash });
    user = userQueries.findByUsername.get(username)!;
  } else {
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
  }

  const token = await createToken({ userId: user.id, username: user.username });

  const res = NextResponse.json({
    user: { id: String(user.id), name: user.username, email: user.email },
  });
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  return res;
}
