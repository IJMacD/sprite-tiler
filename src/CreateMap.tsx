import { CSSProperties, useState } from "react"
import { TileMap } from './TileMap';

interface CreateMapProps {
    onSave: (newMap: TileMap) => void;
}

export function CreateMap ({ onSave }: CreateMapProps) {
    const [ name, setName ] = useState("Map 1");
    const [ tileWidth, setTileWidth ] = useState(16);
    const [ tileHeight, setTileHeight ] = useState(16);
    const [ widthInTiles, setWidthInTiles ] = useState(10);
    const [ heightInTiles, setHeightInTiles ] = useState(10);


    const handleSave = () => {
        onSave({ name, tileWidth, tileHeight, widthInTiles, heightInTiles, layers: [] });
    };

    const headerStyle: CSSProperties = {
        fontSize: 20,
    };


    const labelStyle: CSSProperties = {
        display: "block",
    };

    return (
        <section>
            <h1 style={headerStyle}>Create New Map</h1>
            <label style={labelStyle}>
                Name
                <input value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label style={labelStyle}>
                Tile Width
                <input type="number" min={1} value={tileWidth} onChange={e => setTileWidth(e.target.valueAsNumber)} />
            </label>
            <label style={labelStyle}>
                Tile Height
                <input type="number" min={1} value={tileHeight} onChange={e => setTileHeight(e.target.valueAsNumber)} />
            </label>
            <label style={labelStyle}>
                Width
                <input type="number" min={1} value={widthInTiles} onChange={e => setWidthInTiles(e.target.valueAsNumber)} />
                Tiles
            </label>
            <label style={labelStyle}>
                Height
                <input type="number" min={1} value={heightInTiles} onChange={e => setHeightInTiles(e.target.valueAsNumber)} />
                Tiles
            </label>
            <button onClick={handleSave}>Create</button>
        </section>
    );
}