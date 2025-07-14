"use client"
import * as React from "react"

export function useMount() {
  const [isMount, setIsMount] = React.useState(false)

  React.useEffect(() => {
    setIsMount(true)
  }, [])

  return isMount;
}