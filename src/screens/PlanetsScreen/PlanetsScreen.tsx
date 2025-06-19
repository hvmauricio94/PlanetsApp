/* eslint-disable react-hooks/exhaustive-deps */
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PlanetCard, { InPlanetCard } from '../../components/PlanetCard';
import { useNavigation } from '@react-navigation/native';
import { getPlanets } from '../../services/findPlanets';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../constants/colors';
import { usePlanets } from '../../providers/PlanetProvider';

const PlanetsScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [loadMore, setLoadMore] = useState(true);
  const { planetList, setPlanetList, toggleFavorite, loadPlanets } = usePlanets();

  // Componente para mostrar en caso de errores
  const emptyList = () => {
    return (
      <View style={styles.emptyContainer}>
          {
            !loading &&
            <Text style={styles.emptyText}>
              {
                search.length > 0 ? "We couldn't find any planets matching your search." :
                "We couldn't load the data. Please try again later."
              }
          </Text>
          }
      </View>
    );
  };

  // Función para cambiar el orden de la lista por nombres
  const changeOrder = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);

    const sorted = [...planetList].sort((a: InPlanetCard, b: InPlanetCard) => {
      if (newOrder === 'asc') {return a.englishName.localeCompare(b.englishName);}
      else {return b.englishName.localeCompare(a.englishName);}
    });
    setPlanetList(sorted);
  };

  // Fúnción para solicitar los datos de planetas
  const fetchPlanets = async (refresh: boolean) => {
    let _planetList = planetList;
    let _page = page;
    let _order = order;
    let _search = search;

    if (refresh) {
      setLoading(true);
      setLoadMore(true);
      _planetList = [];
      _page = 1;
      _order = order;
    }

    const response = await getPlanets(_order, _page.toString(), _search);

    if (response.length > 0) {
      const newPlanetList = [...(_planetList ?? []), ...response];
      await loadPlanets(newPlanetList);
      setPage(_page + 1);
      setOrder(_order);
      setLoadMore(true);
    } else {
      setLoadMore(false);
      if (search.length > 0 && page === 1) {
        await loadPlanets([]);
      } else {
        const newPlanetList = [...(_planetList ?? []), ...response];
        await loadPlanets(newPlanetList);
      }
    }
    setLoading(false);
  };

  // Función para navegar a la vista de detalles
  const goToDetails = (id: string) => {
      navigation.navigate('PlanetDetails', {
          id,
      });
  };

  useEffect(() => {
    fetchPlanets(false);
  }, []);

  useEffect(() => {
      fetchPlanets(true);
  }, [search]);

  return (
    <SafeAreaView style={styles.baseContainer}>
      <Text style={styles.title}>{'Planet App  🌍🚀🪐'}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {setSearch(text);}}
          value={search}
          placeholder="Search..."
          placeholderTextColor={colors.textSecondary}
          clearButtonMode="always"
          returnKeyType="search"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={()=> changeOrder()}>
          <FontAwesomeIcon name={order === 'asc' ? 'sort-alpha-asc' : 'sort-alpha-desc'} size={25} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={planetList}
        contentContainerStyle={styles.list}
        refreshControl={
            <RefreshControl refreshing={loading} onRefresh={()=> {
              fetchPlanets(true);
            }} tintColor={colors.textPrimary} />
        }
        onEndReached={() => {
          if (planetList.length > 0 && loadMore) {
            fetchPlanets(false);
          }
        }}
        ListEmptyComponent={emptyList()}
        renderItem={({item}) => (
          <PlanetCard {...item}
            onPress={() => goToDetails(item.id)}
            onPressFavorite={() => toggleFavorite(item.id, item.isFavorite)}/>
        )}
      />
    </SafeAreaView>
  );
};

export default PlanetsScreen;

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
    list: {
      padding: 14,
      backgroundColor: colors.backgroundColor,
      alignItems: 'center',
      gap: 16,
    },
  title: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.backgroundWhite,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 14,
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 20,
    textAlign: 'center',
  },
});
