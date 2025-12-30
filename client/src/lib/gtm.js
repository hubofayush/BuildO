import gtm from "react-gtm-module";

export const getGTM = async () => {
    if (!gtm && typeof window !== "undefined") {
        gtm = await import("react-gtm-module");
        gtm.initialize({
            gtmId: process.env.PUBLIC_GTM_ID,
        });
    }
    return gtm;
};
