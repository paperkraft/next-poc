import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
              protocol: 'https',
              hostname: 'api.slingacademy.com',
            },
        ],
    },
    // middleware: {
    //     '/': ['src/app/middleware/rbac'],
    // },
};

// export default nextConfig;
export default withNextIntl(nextConfig);