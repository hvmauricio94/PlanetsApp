import React, { createContext, useContext, useState } from 'react';
import localStorage from '@react-native-async-storage/async-storage';
import { InPlanet } from '../components/PlanetCard';

// Clave de la lista de favoritos en el storage
const FAVORITES_KEY = 'favorites';
export const PlanetContext = createContext({} as any);
export const usePlanets = () => useContext(PlanetContext);

export const PlanetProvider = ({children}: any) => {
    const [planetList, setPlanetList] = useState<InPlanet[]>([]);

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
  const saveFavorites = async (favorites: InPlanet[]) => {
    try {
      await localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  };

  // Cargar planetas y marcar los favoritos
  const loadPlanets = async (dataFromAPI: InPlanet[]) => {
    const favorites = await loadFavorites();
    const favoriteIds = favorites.map((p: InPlanet) => p.id);

    const updatedList = dataFromAPI.map(planet => ({
      ...planet,
      isFavorite: favoriteIds.includes(planet.id),
    }));

    setPlanetList(updatedList);
  };

  // Agregar favorito
  const addToFavorites = async (planet: InPlanet) => {
    const favorites = await loadFavorites();
    const exists = favorites.some((p: InPlanet) => p.id === planet.id);
    if (!exists) {
      const updatedFavorites = [...favorites, planet];
      await saveFavorites(updatedFavorites);
    }

    setPlanetList(prev =>
      prev.map(p => p.id === planet.id ? { ...p, isFavorite: true } : p)
    );
  };

  // Quitar favorito
  const removeFromFavorites = async (planet: InPlanet) => {
    const favorites = await loadFavorites();
    const updatedFavorites = favorites.filter((p: InPlanet) => p.id !== planet.id);
    await saveFavorites(updatedFavorites);

    setPlanetList(prev =>
      prev.map(p => p.id === planet.id ? { ...p, isFavorite: false } : p)
    );
  };

  // Toggle favorito
  const toggleFavorite = async (planet: InPlanet) => {
    if (planet.isFavorite) {
      await removeFromFavorites(planet);
    } else {
      await addToFavorites(planet);
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
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        getFavorites,
      }}
    >
      {children}
    </PlanetContext.Provider>
  );
};
