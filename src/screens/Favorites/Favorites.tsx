import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../constants/colors';
import PlanetCard from '../../components/PlanetCard';
import {useNavigation} from '@react-navigation/native';
import {usePlanets} from '../../providers/PlanetProvider';

const Favorites = () => {
  const navigation = useNavigation<any>();
  const {getFavorites, toggleFavorite} = usePlanets();
  const favorites = getFavorites();

  const emptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Looks like you haven't added any favorites yet.
        </Text>
      </View>
    );
  };

  const goToDetails = (id: string) => {
    navigation.navigate('PlanetDetails', {
      id,
    });
  };

  return (
    <SafeAreaView style={styles.baseContainer}>
      <Text style={styles.title}>{'My Favorites ❤️'}</Text>
      <FlatList
        data={favorites}
        contentContainerStyle={styles.list}
        ListEmptyComponent={emptyList()}
        renderItem={({item}) => (
          <PlanetCard
            {...item}
            onPressFavorite={() => toggleFavorite(item.id, item.isFavorite)}
            onPress={() => goToDetails(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Favorites;

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
