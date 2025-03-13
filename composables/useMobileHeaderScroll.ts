export function useMobileHeaderScroll() {
  const { y, directions } = useScroll(window)
  const showMobileHeader = ref<boolean>(true)
  const lastScrollY = ref<number>(0)

  watch([y, directions], ([newY, newDirections]) => {
    const diffY = Math.abs(newY - lastScrollY.value)

    if (newY <= 0) {
      showMobileHeader.value = true
      lastScrollY.value = newY
    } else if (newDirections.bottom && diffY >= 30) {
      showMobileHeader.value = false
      lastScrollY.value = newY
    } else if (newDirections.top && diffY >= 60) {
      showMobileHeader.value = true
      lastScrollY.value = newY
    }
  })

  return { showMobileHeader }
}