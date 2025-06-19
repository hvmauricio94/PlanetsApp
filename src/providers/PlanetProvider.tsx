import React, {createContext, useContext, useState} from 'react';
import localStorage from '@react-native-async-storage/async-storage';
import {InPlanetCard} from '../components/PlanetCard';

interface PlanetProviderProps {
  planetList: InPlanetCard[];
  setPlanetList: any;
  loadPlanets: (dataFromAPI: InPlanetCard[]) => Promise<void>;
  toggleFavorite: (planetId: string, isFavorite: boolean) => Promise<void>;
  getFavorites: () => InPlanetCard[];
}

// Clave de la lista de favoritos en el storage
const FAVORITES_KEY = 'favorites';
export const PlanetContext = createContext({} as PlanetProviderProps);
export const usePlanets = () => useContext(PlanetContext);

export const PlanetProvider = ({children}: any) => {
  const [planetList, setPlanetList] = useState<InPlanetCard[]>([]);

  // Leer favoritos del storage
  const loadFavorites = async () => {
    try {
      const jsonValue = await localStorage.getItem(FAVORITES_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      return [];
    }
  };

  // Guardar favoritos actualizados al storage
  const saveFavorites = async (favorites: string[]) => {
    try {
      await localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  };

  // Cargar planetas y marcar los favoritos
  const loadPlanets = async (dataFromAPI: InPlanetCard[]) => {
    const favoriteIds = await loadFavorites();

    const updatedList = dataFromAPI.map(planet => ({
      ...planet,
      isFavorite: favoriteIds.includes(planet.id),
    }));

    setPlanetList(updatedList);
  };

  // Agregar favorito por ID
  const addToFavorites = async (planetId: string, isFavorite: boolean) => {
    const favoriteIds = await loadFavorites();
    if (!isFavorite) {
      const updatedFavorites = [...favoriteIds, planetId];
      await saveFavorites(updatedFavorites);
    }

    setPlanetList(prev =>
      prev.map(p => (p.id === planetId ? {...p, isFavorite: true} : p)),
    );
  };

  // Quitar favorito por ID
  const removeFromFavorites = async (planetId: string) => {
    const favoriteIds = await loadFavorites();
    const updatedFavorites = favoriteIds.filter(
      (id: string) => id !== planetId,
    );
    await saveFavorites(updatedFavorites);

    setPlanetList(prev =>
      prev.map(p => (p.id === planetId ? {...p, isFavorite: false} : p)),
    );
  };

  // Toggle favorito
  const toggleFavorite = async (planetId: string, isFavorite: boolean) => {
    if (isFavorite) {
      await removeFromFavorites(planetId);
    } else {
      await addToFavorites(planetId, isFavorite);
    }
  };

  // Cargar lista de favoritos
  const getFavorites = () => {
    return planetList.filter(p => p.isFavorite);
  };

  return (
    <PlanetContext.Provider
      value={{
        planetList,
        setPlanetList,
        loadPlanets,
        toggleFavorite,
        getFavorites,
      }}>
      {children}
    </PlanetContext.Provider>
  );
};
