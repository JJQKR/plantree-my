// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['xmrsttncmglunfluwmqd.supabase.co'] // 허용할 도메인 추가
//   }
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['xmrsttncmglunfluwmqd.supabase.co'] // 허용할 도메인 추가
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // canvas를 서버 사이드에서 제외
      config.externals = [...config.externals, 'canvas'];
    }
    return config;
  }
};

export default nextConfig;
