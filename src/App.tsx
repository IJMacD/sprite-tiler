import { CSSProperties, useState } from 'react'
import './App.css'
import { ImagePicker } from './ImagePicker';
import { TileSetPreview } from './TileSetPreview';
import { CreateMap } from './CreateMap';
import { TileMapPreview } from './TileMapPreview';
import { TileSet, TileMap, getTileSetFromIndex, getTileIndex, addLayer, setTile, TileMapLayer } from './TileMap';
import { LayerEditor } from './LayerEditor';

function App() {
  const [ pickingImage, setPickingImage ] = useState(true);
  const [ sourceTileSets, setSourceTileSets ] = useState([] as TileSet[]);
  const [ selectedTileIndex, setSelectedTileIndex ] = useState(0);
  const [ tileMap, setTileMap ] = useState(null as TileMap|null);
  const [ selectedLayerIndex, setSelectedLayerIndex ] = useState(0);

  function handlePickImage (tileSet: TileSet) {
    setSourceTileSets(tileSets => [ ...tileSets, tileSet ]);
    setPickingImage(false);
  }

  function handleAddLayer (name: string) {
    setTileMap(tileMap => {
      if (tileMap) {
        return addLayer(tileMap, name);
      }
      return tileMap;
    });
  }

  function handleSetLayers (layers: TileMapLayer[]) {
    setTileMap(tileMap => {
      if (tileMap) {
        return { ...tileMap, layers };
      }
      return tileMap;
    });
  }

  function placeTile (tileIndex: number) {
    setTileMap(tileMap => tileMap && setTile(tileMap, selectedLayerIndex, tileIndex, selectedTileIndex));
  }

  const {
    tileSetIndex: selectedTileSetIndex,
    tileSetTileIndex: selectedTileSetTileIndex
  } = getTileSetFromIndex(selectedTileIndex);

  const selectedTileSet = sourceTileSets[selectedTileSetIndex];

  const headerStyle: CSSProperties = {
    fontSize: 16,
  };

  return (
    <>
      <section style={{flexBasis:320, padding:8, display: "flex", flexDirection: "column"}}>
        <section style={{flex: 1, overflowY: "auto"}}>
          <h1 style={headerStyle}>Tile Sets</h1>
          <button onClick={() => setPickingImage(!pickingImage)}>Add Tile Set</button>
          {
            sourceTileSets.map((tileSet, i) => {

              const imageStyle:CSSProperties = {
                width: 200,
                outline: i === selectedTileSetIndex ? "2px solid orange" : "",
              };

              const tileIndex = getTileIndex(i, 0);

              return (
                <img
                  key={i}
                  style={imageStyle}
                  onClick={() => setSelectedTileIndex(tileIndex)}
                  src={tileSet.imageURL}
                />
              );
            })
          }
        </section>
        {
          tileMap &&
          <section style={{flexBasis: 300}}>
            <h1 style={headerStyle}>Layers</h1>
            <LayerEditor layers={tileMap.layers} setLayers={handleSetLayers} addLayer={handleAddLayer} selectedLayerIndex={selectedLayerIndex} setSelectedLayerIndex={setSelectedLayerIndex} />
          </section>
        }
      </section>
      <section style={{flex: 1}}>
        <h1 style={headerStyle}>Tiles</h1>
        {
          pickingImage &&
          <ImagePicker onPickImage={handlePickImage} />
        }
        {
          !pickingImage && selectedTileSet &&
          <TileSetPreview
            imageURL={selectedTileSet.imageURL}
            tileWidth={selectedTileSet.tileWidth}
            tileHeight={selectedTileSet.tileHeight}
            selectedIndex={selectedTileSetTileIndex}
            onClickTile={(tileSetIndex: number) => {
              const tileIndex = getTileIndex(selectedTileSetIndex, tileSetIndex);
              setSelectedTileIndex(tileIndex);
            }}
          />
        }
      </section>
      <section style={{flex: 1}}>
        <h1 style={headerStyle}>Map</h1>
        {
          tileMap ?
            <TileMapPreview map={tileMap} tileSets={sourceTileSets} onClickTile={placeTile} />
          :
            <CreateMap onSave={(map: TileMap) => setTileMap(map)} />
        }
      </section>
    </>
  )
}

export default App
