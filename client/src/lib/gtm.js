let gtm;

export const getGTM = async () => {
    if (!gtm && typeof window !== "undefined") {
        const mod = await import("react-gtm-module");
        gtm = mod?.default ?? mod;
        gtm.initialize({
            gtmId: process.env.PUBLIC_GTM_ID,
        });
    }
    return gtm;
};
