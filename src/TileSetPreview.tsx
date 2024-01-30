import { MouseEvent, useEffect, useRef } from "react";
import { useImage } from "./useImage";

interface TileSetPreviewProps {
    imageURL: string;
    tileWidth: number;
    tileHeight: number;
    selectedIndex?: number;
    onClickTile?: (tileIndex: number) => void;
}

export function TileSetPreview ({ imageURL, tileWidth, tileHeight, selectedIndex, onClickTile }: TileSetPreviewProps) {
    const canvasRef = useRef(null as HTMLCanvasElement|null);

    const image = useImage(imageURL);

    const gutter = 1;

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");

        if (image && ctx) {
            ctx.canvas.width = image.width + 2 * gutter;
            ctx.canvas.height = image.height + 2 * gutter;

            // For outline at edges
            ctx.translate(gutter, gutter);

            ctx.drawImage(image, 0, 0);

            ctx.beginPath();

            for (let x = tileWidth; x < image.width; x += tileWidth) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, image.height);
            }

            for (let y = tileHeight; y < image.height; y += tileHeight) {
                ctx.moveTo(0, y);
                ctx.lineTo(image.width, y);
            }

            ctx.stroke();

            if (typeof selectedIndex === "number") {
                const widthInTiles = Math.floor(image.width / tileWidth);
                const tileX = selectedIndex % widthInTiles;
                const tileY = Math.floor(selectedIndex / widthInTiles);
                const x = tileX * tileWidth;
                const y = tileY * tileHeight;

                ctx.lineWidth = 2;
                ctx.strokeStyle = "red";
                ctx.strokeRect(x, y, tileWidth, tileHeight);
            }
        }
    }, [image, tileWidth, tileHeight, selectedIndex]);

    function handleClick (e: MouseEvent<HTMLCanvasElement>) {
        if (onClickTile) {
            const { nativeEvent: { offsetX, offsetY }, currentTarget: { width } } = e;
            const tileX = Math.floor(offsetX / tileWidth);
            const tileY = Math.floor(offsetY / tileHeight);
            const widthInTiles = (width - 2 * gutter) / tileWidth;
            onClickTile(tileY * widthInTiles + tileX);
        }
    }

    return <canvas ref={canvasRef} onClick={handleClick} />;
}