// app/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const UNIQUE_CODE_NAME = 'uniqueCode'
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password']

export function middleware(request: NextRequest) {
  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  console.log('====================================');
  console.log("A");
  console.log('====================================');
  // Check for uniqueCode in cookies or sessionStorage (via header)
  const uniqueCode = request.cookies.get(UNIQUE_CODE_NAME)?.value
  
  // If no uniqueCode and not on a public path, redirect to login
  if (!uniqueCode && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // If user has uniqueCode and tries to access login page, redirect to home
  if (uniqueCode && request.nextUrl.pathname === '/login') {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}