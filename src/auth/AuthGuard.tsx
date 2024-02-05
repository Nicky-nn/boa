import React, { FC, ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import useAuth from '../app/base/hooks/useAuth'
import { PerfilProps } from '../app/base/models/loginModel'
import { appRoutes } from '../app/routes/routes'
import { isEmptyValue } from '../app/utils/helper'
import { flat } from '../app/utils/utils'

/**
 * @description Verificamos si el usuario tiene permiso a cierto rol
 * @param pathname
 * @param user
 * @param routes
 */
const userHasPermission = (pathname: any, user: PerfilProps, routes: any) => {
  try {
    if (isEmptyValue(user)) {
      return false
    }
    const matched = routes.find((r: any) => r.path === pathname)
    return matched && matched.auth && matched.auth.length
      ? matched.auth.includes(user.tipo)
      : true
  } catch (e: any) {
    return false
  }
}

type Props = {
  children: ReactElement | ReactElement[]
}

const AuthGuard: FC<Props> = ({ children }: Props) => {
  const { pathname } = useLocation()
  try {
    const { isAuthenticated, user } = useAuth()
    const routes = flat(appRoutes)

    // tiene permisos?
    const hasPermission = userHasPermission(pathname, user, routes)
    // IF YOU NEED ROLE BASED AUTHENTICATION,
    // UNCOMMENT ABOVE TWO LINES, getUserRoleAuthStatus METHOD AND user VARIABLE
    // AND COMMENT OUT BELOW LINE
    let authenticated = isAuthenticated && hasPermission

    return (
      <>
        {isAuthenticated ? (
          children
        ) : (
          <Navigate replace to="/session/signin" state={{ from: pathname }} />
        )}
      </>
    )
  } catch (e) {
    return <Navigate replace to="/session/signin" state={{ from: pathname }} />
  }
}

export default AuthGuard
