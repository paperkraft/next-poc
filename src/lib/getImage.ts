export const getByIdImage = async (id: string) => {
    try {
        const response = await fetch(`https://api.slingacademy.com/v1/sample-data/photos/${id}`, {
            cache: "no-store",
        });
        if (!response.ok) throw new Error(`Failed to fetch image with ID: ${id}`);
        const data = await response.json();
        return data.photo;
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
};

export const getImages = async () => {
    try {
        const response = await fetch("https://api.slingacademy.com/v1/sample-data/photos?limit=5", {
            cache: "no-store",
        });
        if (!response.ok) throw new Error(`Failed to fetch images, status: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data.photos) ? data.photos : [];
    } catch (error) {
        console.error("Error fetching images:", error);
        return null;
    }
};