import { QueryKey } from '@tanstack/query-core'
import { useQuery } from '@tanstack/react-query'

import { apiSucursales } from '../api/sucursales.api'
import { SucursalProps } from '../interfaces/sucursal'

/**
 * Hook para listado básico de tipos de producto
 * limit 1000
 */
const useQuerySucursales = (queryKey: QueryKey = []) => {
  const {
    data: sucursales,
    isLoading: sLoading,
    isError: sIsError,
    error: sError,
  } = useQuery<SucursalProps[], Error>(
    ['sucursales', ...queryKey],
    async (): Promise<SucursalProps[]> => {
      const resp = await apiSucursales()
      if (resp.length > 0) {
        return resp
      }
      return []
    },
    {
      refetchInterval: false,
    },
  )

  return { sucursales, sLoading, sIsError, sError }
}

export default useQuerySucursales
