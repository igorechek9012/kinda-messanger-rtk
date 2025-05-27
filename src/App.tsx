import { Provider } from 'react-redux'
import './App.css'
import { CssBaseline } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { type FC, Suspense } from 'react'
import { store } from '~/store'
import { LoadingSpinner, ThemeWrapper } from '~/components'
import { SnackbarProvider } from 'notistack'
import { SnackbarProps } from '~/lib'
import { router } from '~/router.tsx'

const App: FC = () => {
    return (
        <Provider store={store}>
            <SnackbarProvider {...SnackbarProps}>
                <ThemeWrapper>
                    <CssBaseline />
                    <Suspense fallback={<LoadingSpinner />}>
                        <RouterProvider router={router} />
                    </Suspense>
                </ThemeWrapper>
            </SnackbarProvider>
        </Provider>
    )
}

export default App
