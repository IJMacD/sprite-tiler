import { CSSProperties, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { TileMap, TileSet, getTileSetFromIndex } from './TileMap';
import { useImages } from "./useImage";

interface TileMapPreviewProps {
    map: TileMap;
    tileSets: TileSet[];
    onClickTile: (tileSetIndex: number) => void;
}

export function TileMapPreview ({ map, tileSets, onClickTile }: TileMapPreviewProps) {
    const canvasRef = useRef(null as HTMLCanvasElement|null);
    const [ showGrid, setShowGrid ] = useState(true);

    const urls = useMemo(() => tileSets.map(ts => ts.imageURL), [tileSets]);
    const images = useImages(urls);

    console.log("Render TileMapPreview");

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");

        if (ctx) {
            const width = map.tileWidth * map.widthInTiles;
            const height = map.tileHeight * map.heightInTiles;

            ctx.canvas.width = width;
            ctx.canvas.height = height;

            const { tileWidth, tileHeight } = map;

            ctx.beginPath();

            for (let x = tileWidth; x < width; x += tileWidth) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }

            for (let y = tileHeight; y < height; y += tileHeight) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }

            ctx.strokeStyle = "rgb(240 240 240)";
            ctx.stroke();
        }

    }, [map, showGrid]);

    function handleClick (e: MouseEvent<HTMLElement>) {
        const { nativeEvent: { offsetX, offsetY } } = e;

        const tileX = Math.floor(offsetX / map.tileWidth);
        const tileY = Math.floor(offsetY / map.tileHeight);
        const tileSetIndex = tileY * map.widthInTiles + tileX;

        onClickTile(tileSetIndex);
    }

    function handleMouseMove (e: MouseEvent<HTMLElement>) {
        const { nativeEvent: { offsetX, offsetY }, buttons } = e;

        if (buttons) {
            const tileX = Math.floor(offsetX / map.tileWidth);
            const tileY = Math.floor(offsetY / map.tileHeight);
            const tileSetIndex = tileY * map.widthInTiles + tileX;

            onClickTile(tileSetIndex);
        }
    }

    return (
        <>
            <h1>{map.name}</h1>
            <label>Show Grid <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} /></label>
            <div style={{position: "relative"}} onClick={handleClick} onMouseMove={handleMouseMove}>
                {
                    map.layers.map((layer, i) => <TileMapLayer key={i} tiles={layer.tiles} tileSets={tileSets} images={images} tileWidth={map.tileWidth} tileHeight={map.tileHeight} widthInTiles={map.widthInTiles} heightInTiles={map.heightInTiles} style={{position: "absolute"}} />)
                }
                {
                    showGrid &&
                    <canvas ref={canvasRef} style={{position: "absolute"}} />
                }
            </div>
        </>
    );
}

interface TileMapLayerProps {
    tiles: Uint16Array;
    tileSets: TileSet[];
    images: HTMLImageElement[];
    tileWidth: number;
    tileHeight: number;
    widthInTiles: number;
    heightInTiles: number;
    style?: CSSProperties;
}

function TileMapLayer ({ tiles, tileSets, images, tileWidth, tileHeight, widthInTiles, heightInTiles, style }: TileMapLayerProps) {
    const canvasRef = useRef(null as HTMLCanvasElement|null);


    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");

        if (ctx) {
            console.log("Render Layer");

            const width = tileWidth * widthInTiles;
            const height = tileHeight * heightInTiles;

            ctx.canvas.width = width;
            ctx.canvas.height = height;

            for (let i = 0; i < tiles.length; i++) {
                const tileX = i % widthInTiles;
                const tileY = Math.floor(i / heightInTiles);

                const x = tileX * tileWidth;
                const y = tileY * tileHeight;

                // ctx.fillText(tiles[i].toString(), x + 5, y + 10);

                const {
                    tileSetIndex,
                    tileSetTileIndex
                } = getTileSetFromIndex(tiles[i]);

                const img = images[tileSetIndex];

                if (img) {
                    const tileSet = tileSets[tileSetIndex];
                    const sourceWidthInTiles = Math.floor(img.width / tileSet.tileWidth);
                    // const sourceHeightInTiles = Math.floor(img.height / tileSet.tileHeight);
                    const sourceTileX = tileSetTileIndex % sourceWidthInTiles;
                    const sourceTileY = Math.floor(tileSetTileIndex / sourceWidthInTiles);
                    const sx = sourceTileX * tileSet.tileWidth;
                    const sy = sourceTileY * tileSet.tileHeight;

                    ctx.drawImage(img, sx, sy, tileSet.tileWidth, tileSet.tileHeight, x, y, tileWidth, tileHeight);
                }
            }
        }

    }, [tiles, tileSets, images, tileWidth, tileHeight, widthInTiles, heightInTiles]);

    const canvasStyle: CSSProperties = {
        ...style,
    };

    return <canvas ref={canvasRef} style={canvasStyle} />;
}