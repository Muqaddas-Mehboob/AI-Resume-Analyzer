import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route("/upload",'routes/uploads.tsx'),
    route("/resume/:id",'routes/resume.tsx')
    ] satisfies RouteConfig;


// This is the file of React Router Configuration. This file contains all the routing to be
// loaded in your website. If you have to add more routes, you have to expand this file.