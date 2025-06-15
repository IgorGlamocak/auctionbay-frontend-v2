import { FC, lazy, Suspense } from 'react'
import { Route, RouteProps, Routes as Switch } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'
import Register from '../pages/Landing/Register'
import ForgotPassword from '../pages/Landing/ForgotPassword'
import Profile from '../pages/Profile/MyAuctions'
import Auctions from '../pages/Auctions/Auctions'
import Bidding from '../pages/Profile/Bidding'
import Won from '../pages/Profile/Won'
import AuctionDetail from '../pages/Profile/AuctionDetail'

export enum RouteType {
    PUBLIC,
    PRIVATE,
    RESTRICTED,
}

type AppRoute = RouteProps & {
    type?: RouteType
}

/* Public routes */
const Home = lazy(() => import('../pages/Landing/Home'))
const Login = lazy(() => import('../pages/Landing/Login'))



/* Error routes */
const Page404 = lazy(() => import('../pages/Page404'))

export const AppRoutes: AppRoute[] = [
    // Restricted Routes
    {
        type: RouteType.PUBLIC,
        path: '/',
        children: <Home />,
    },
    {
        type: RouteType.PUBLIC,
        path: '/login',
        children: <Login />,
    },
    {
        type: RouteType.PUBLIC,
        path: '/signup',
        children: <Register />,
    },
    // Private Routes
    {
        type: RouteType.PRIVATE,
        path: '/profile',
        children: <Profile />,
    },
    {
        type: RouteType.PRIVATE,
        path: '/auctions',
        children: <Auctions />,
    },
    {
        type: RouteType.PRIVATE,
        path: '/bidding',
        children: <Bidding />,
    },
    {
        type: RouteType.PRIVATE,
        path: '/won',
        children: <Won />,
    },
    {
        type: RouteType.PRIVATE,
        path: '/auction/:id',
        children: <AuctionDetail />,
    },

    // Public Routes

    {
        type: RouteType.PUBLIC,
        path: '/forgotpassword',
        children: <ForgotPassword />,
    },
    // 404 Error
    {
        type: RouteType.PUBLIC,
        path: '*',
        children: <Page404 />,
    },
]

const Routes: FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                {AppRoutes.map((r) => {
                    const { type } = r
                    if (type === RouteType.PRIVATE) {
                        return (
                            <Route
                                key={`${r.path}`}
                                path={`${r.path}`}
                                element={<PrivateRoute>{r.children}</PrivateRoute>}
                            />
                        )
                    }
                    if (type === RouteType.RESTRICTED) {
                        return (
                            <Route
                                key={`${r.path}`}
                                path={`${r.path}`}
                                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
                            />
                        )
                    }

                    return (
                        <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
                    )
                })}
                <Route path="*" element={<Page404 />} />
            </Switch>
        </Suspense>
    )
}

export default Routes