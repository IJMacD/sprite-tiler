import { CSSProperties } from "react";
import { TileMapLayer } from "./TileMap";

interface LayerEditorProps {
    layers: TileMapLayer[];
    setLayers: (layers: TileMapLayer[]) => void;
    addLayer: (name: string) => void;
    selectedLayerIndex: number;
    setSelectedLayerIndex: (index: number) => void;
}

export function LayerEditor ({ layers, setLayers, addLayer, selectedLayerIndex, setSelectedLayerIndex }: LayerEditorProps) {
    function handleAddLayer () {
        const layerName = prompt("Enter Layer Name", `Layer ${layers.length + 1}`);
        if (layerName) {
            addLayer(layerName);
        }
    }

    function moveLayer (direction: number) {
        const newLayers = layers.slice();
        newLayers[selectedLayerIndex + direction] = layers[selectedLayerIndex];
        newLayers[selectedLayerIndex] = layers[selectedLayerIndex + direction];
        setLayers(newLayers);
        setSelectedLayerIndex(selectedLayerIndex + direction);
    }

    function handleRename () {
        const layer = layers[selectedLayerIndex];
        const name = prompt("Enter new name", layer.name);
        if (name && name !== layer.name) {
            const newLayers = layers.map((l, i) => i === selectedLayerIndex ? { ...layer, name } : l);
            setLayers(newLayers);
        }
    }

    return (
        <>
            <ul>
              {
                layers.map((layer, i) => {
                  const listItemStyle: CSSProperties = {
                    fontWeight: i === selectedLayerIndex ? "bold" : "",
                  };
                  return <li key={i} style={listItemStyle} onClick={() => setSelectedLayerIndex(i)}>{layer.name}</li>;
                })
              }
            </ul>
            <button onClick={() => moveLayer(-1)} disabled={selectedLayerIndex === 0}>Move Up</button>
            <button onClick={() => moveLayer(+1)} disabled={selectedLayerIndex === layers.length - 1}>Move Down</button>
            <button onClick={handleRename}>Rename</button>
            <button onClick={handleAddLayer}>Add Layer</button>
        </>
    );
}