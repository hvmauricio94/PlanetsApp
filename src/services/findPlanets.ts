import axios from 'axios';
import {API_URL} from '@env';
import {InPlanetDetail} from '../screens/PlanetsScreen/PlanetDetailsScreen';

// API para obtener la lista de planetas
export const getPlanets = async (
  order: string,
  page: string,
  search: string,
) => {
  const _order = `?order=englishName,${order}`;
  const _page = `&page=${page}`;
  const isPlanet = '&filter[]=isPlanet,eq,true';
  const _search = search.length > 0 ? '&filter[]=englishName,cs,' + search : '';
  const res = await axios({
    method: 'GET',
    url: `${API_URL}${_order}${_page}${isPlanet}${_search}`,
  });

  if (Array.isArray(res.data.bodies)) {
    return res.data.bodies;
  }

  return [];
};

// API para obtener detalles de un planeta
export const getPlanetDetails = async (
  id: string,
): Promise<InPlanetDetail | null> => {
  const res = await axios({
    method: 'GET',
    url: `${API_URL}/${id}`,
  });

  if (res.data) {
    return res.data;
  } else {
    return null;
  }
};
