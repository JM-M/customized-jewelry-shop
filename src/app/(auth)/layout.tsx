import type { Metadata } from "next";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: `Sign in or create an account to access ${siteConfig.name}`,
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">{children}</div>
    </div>
  );
};
export default Layout;
