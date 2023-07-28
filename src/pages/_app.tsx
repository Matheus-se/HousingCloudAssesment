import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { InterestProvider } from "~/contexts/interest";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <InterestProvider>
      <Component {...pageProps} />
    </InterestProvider>
  );
};

export default api.withTRPC(MyApp);
