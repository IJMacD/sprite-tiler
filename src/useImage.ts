import { useEffect, useState } from "react";

export function useImage (url: string) {
    const [ image, setImage ] = useState(null as HTMLImageElement|null);

    useEffect(() => {
        const img = new Image();

        img.src = url;

        img.onload = () => setImage(img);
    }, [url]);

    return image;
}

export function useImages (urls: string[]) {
    const [ images, setImages ] = useState([] as HTMLImageElement[]);

    useEffect(() => {
        loadImages(urls).then(setImages);
    }, [urls]);

    return images;
}

function loadImage (url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = e => reject(e);
    });
}

function loadImages (urls: string[]) {
    return Promise.all(urls.map(loadImage));
}