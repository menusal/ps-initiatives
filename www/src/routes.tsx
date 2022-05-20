import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import DefaultView from "@/components/common/DefaultView";
import React from "react";

// const Main = lazy(
//   () => import(/* webpackPrefetch: true */ '@/components/views/main/Main'),
// )
const NotFound = lazy(() => import("@/components/views/NotFound"));
const Login = lazy(() => import("@/components/views/login/Login"));
const Styleguide = lazy(() => import("@/components/views/Styleguide"));
const GeoAdvertising = lazy(
  () => import("@/components/views/geo-advertising/GeoAdvertising")
);
const Report = lazy(() => import("@/components/views/report/Report"));
// [hygen] Import views

export const ROUTE_PATHS = {
  LOGIN: "/login",
  DEFAULT: "/",
  NOT_FOUND: "404",
  STYLEGUIDE: "/styleguide",
  GEO_ADVERTISING: "/",
  AUDIENCE: "/audience",
  AUDIENCE_RESULT: "/audience/result",
  AUDIENCE_DUPLICATE: "/audience/duplicate",
  AUDIENCE_EDIT: "/audience/edit",
  REPORT: "/report",
  // [hygen] Add path routes
};

const routes = [
  {
    path: ROUTE_PATHS.DEFAULT,
    element: (
      <ProtectedRoute>
        <DefaultView>
          <Outlet />
        </DefaultView>
      </ProtectedRoute>
    ),
    children: [
      // { path: '/', element: <Navigate to='/<your default view>' /> },
      {
        path: ROUTE_PATHS.GEO_ADVERTISING,
        element: (
          <ProtectedRoute>
            <GeoAdvertising />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTE_PATHS.AUDIENCE}/:id`,
        element: (
          <ProtectedRoute>
            <GeoAdvertising />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTE_PATHS.AUDIENCE_RESULT}/:id`,
        element: (
          <ProtectedRoute>
            <GeoAdvertising result={true} />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTE_PATHS.AUDIENCE_DUPLICATE}/:id`,
        element: (
          <ProtectedRoute>
            <GeoAdvertising duplicate={true} />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTE_PATHS.AUDIENCE_EDIT}/:id`,
        element: (
          <ProtectedRoute>
            <GeoAdvertising edit={true} />
          </ProtectedRoute>
        ),
      },
      // [hygen] Add routes
    ],
  },
  { path: ROUTE_PATHS.LOGIN, element: <Login /> },
  {
    path: `${ROUTE_PATHS.REPORT}/:id`,
    element: (
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    ),
  },
  { path: ROUTE_PATHS.STYLEGUIDE, element: <Styleguide /> },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    element: (
      <DefaultView>
        <NotFound />
      </DefaultView>
    ),
  },
  { path: "*", element: <Navigate to={ROUTE_PATHS.NOT_FOUND} /> },
];

export default routes;
