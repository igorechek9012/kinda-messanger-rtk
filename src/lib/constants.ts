import type { SnackbarProviderProps } from 'notistack'

export const MAX_SNACK_NOTIFY_COUNT = 3

export const SnackbarProps: SnackbarProviderProps = {
    maxSnack: MAX_SNACK_NOTIFY_COUNT,
    autoHideDuration: 4000,
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
}
