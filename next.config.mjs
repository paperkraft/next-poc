/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
              protocol: 'https',
              hostname: 'via.placeholder.com',
            },
        ],
    },
    // middleware: {
    //     '/': ['src/app/middleware/rbac'],
    // },
};

export default nextConfig;
