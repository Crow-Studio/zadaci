const zIndex = ref(100)

export function useZIndex() {
  const currentZIndex = zIndex
  const nextZIndex = () => ++zIndex.value

  return {
    currentZIndex,
    nextZIndex,
  }
}
