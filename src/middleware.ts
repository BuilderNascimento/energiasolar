import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {
    // Middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acesso à página de login
        if (req.nextUrl.pathname === "/admin/login") {
          return true
        }
        
        // Proteger rotas admin
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }
        
        // Permitir outras rotas
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}