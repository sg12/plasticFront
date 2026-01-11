export const lazyRoute = <T extends Record<string, React.ComponentType<any>>>(
  importFn: () => Promise<T>,
  componentName: keyof T,
) => ({
  lazy: async () => {
    const module = await importFn()
    return { Component: module[componentName] }
  },
})
