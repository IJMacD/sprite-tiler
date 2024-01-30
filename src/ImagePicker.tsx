import { CSSProperties, FormEvent, useMemo, useState } from "react"
import { TileSetPreview } from "./TileSetPreview";
import { TileSet } from './TileMap';

interface ImagePickerProps {
    onPickImage: (tileSet: TileSet) => void;
}

export function ImagePicker ({ onPickImage }: ImagePickerProps) {
    const [ imageBlob, setImageBlob ] = useState(null as Blob|null);
    const [ tileWidth, setTileWidth ] = useState(16);
    const [ tileHeight, setTileHeight ] = useState(16);

    const imageURL = useMemo(() => {
        if (imageBlob) {
            return URL.createObjectURL(imageBlob);
        }
        return "";
    }, [imageBlob]);

    const handleSave = () => {
        onPickImage({ imageURL, tileWidth, tileHeight });
        setImageBlob(null);
        // setTileWidth(16);
        // setTileHeight(16);
    };

    const headerStyle: CSSProperties = {
        fontSize: 20,
    };

    if (imageURL) {
        return (
            <section>
                <h1 style={headerStyle}>Create New Tile Set</h1>
                <label>
                    Tile Width
                    <input type="number" min={1} value={tileWidth} onChange={e => setTileWidth(e.target.valueAsNumber)} />
                </label>
                <label>
                    Tile Height
                    <input type="number" min={1} value={tileHeight} onChange={e => setTileHeight(e.target.valueAsNumber)} />
                </label>
                <TileSetPreview imageURL={imageURL} tileWidth={tileWidth} tileHeight={tileHeight} />
                <button onClick={handleSave}>Save</button>
            </section>
        );
    }

    function handleFileChange (e: FormEvent<HTMLInputElement>) {
        const files = e.currentTarget.files;
        if (files?.length) {
            setImageBlob(files[0]);
        }
        else {
            setImageBlob(null);
        }
        e.currentTarget.value = "";
    }

    return (
        <section>
            <h1 style={headerStyle}>Create New Tile Set</h1>
            <input type="file" onChange={handleFileChange} />

        </section>
    );
}