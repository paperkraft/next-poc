/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
              protocol: 'https',
              hostname: 'via.placeholder.com',
              //   hostname: "**",
            },
        ],
    },
};

export default nextConfig;
