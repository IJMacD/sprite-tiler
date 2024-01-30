

export interface TileMap {
  name: string;
  tileWidth: number;
  tileHeight: number;
  widthInTiles: number;
  heightInTiles: number;
  layers: TileMapLayer[];
}

export interface TileSet {
  imageURL: string;
  tileWidth: number;
  tileHeight: number;
}
interface TileMapLayer {
  name: string;
  tiles: Uint16Array;
}

const MAX_TILES_PER_LAYER = 1024;
const TILE_INDEX_OFFSET = 1024;

export function getTileIndex(tileSet: number, tileSetTileIndex: number) {
  return TILE_INDEX_OFFSET + tileSet * MAX_TILES_PER_LAYER + tileSetTileIndex;
}

export function getTileSetFromIndex(tileIndex: number) {
  const i = tileIndex - TILE_INDEX_OFFSET;
  return {
    tileSetIndex: Math.floor(i / MAX_TILES_PER_LAYER),
    tileSetTileIndex: i % MAX_TILES_PER_LAYER,
  };
}

// Immutable
export function addLayer (map: TileMap, name: string) {
  return {
    ...map,
    layers: [
      ...map.layers,
      { name, tiles: new Uint16Array(map.widthInTiles * map.heightInTiles) }
    ]
  };
}

// Immutable
export function setTile (map: TileMap, layerIndex: number, tileLayerIndex: number, tileSetTileIndex: number) {
  const layer = map?.layers[layerIndex];

  if (!layer || layer.tiles[tileLayerIndex] === tileSetTileIndex) {
    // No op
    return map;
  }

  const newLayer = {
    ...layer,
    tiles: layer.tiles.slice(0),
  };

  newLayer.tiles[tileLayerIndex] = tileSetTileIndex;

  return {
    ...map,
    layers: map.layers.map((l, i) => i === layerIndex ? newLayer : l),
  };
}