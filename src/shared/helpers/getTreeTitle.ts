


export const getTreeTitle = (lang: string , title: { [key: string]: string }) => {
    return title?.[lang] || title?.en || title?.ru || "Unknown";
};
