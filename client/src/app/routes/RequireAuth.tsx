import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "../../features/account/accountApi"

export default function RequireAuth() {
  const {data: user, isLoading} = useUserInfoQuery();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to='/login' state={{from: location}} />
  }
  
  const adminRoutes = [
    "/inventory",
  ]

  if (adminRoutes.includes(location.pathname) && !user.roles.includes("Admin")) {
    return <Navigate to={'/'} replace />
  }

  return (
    <Outlet />
  )
}