import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora os erros de ESLint durante o build (não recomendado para produção)
    ignoreDuringBuilds: true,
  },
  // Podes manter outras opções de config aqui
};

export default nextConfig;
