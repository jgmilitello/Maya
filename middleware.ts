import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/',
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/stocks/:path*', '/credit-cards/:path*', '/bonds/:path*', '/budgeting/:path*', '/settings/:path*'],
}
