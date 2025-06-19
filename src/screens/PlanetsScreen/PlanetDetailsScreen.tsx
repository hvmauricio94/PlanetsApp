/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {getPlanetDetails} from '../../services/findPlanets';
import {colors} from '../../constants/colors';
import planetImages from './planetImages';
import {usePlanets} from '../../providers/PlanetProvider';
import {InPlanetCard} from '../../components/PlanetCard';

export interface InPlanetDetail {
  id: string;
  name: string;
  englishName: string;
  mass: {
    massValue: number;
    massExponent: number;
  };
  gravity: number;
  meanRadius: number;
  avgTemp: number;
  moons: Array<{moon: string}>;
  semimajorAxis: number;
}

const PlanetDetailsScreen = () => {
  const {params} = useRoute();
  const query = params as any;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InPlanetDetail | null>();
  const {getFavorites, toggleFavorite} = usePlanets();

  const favoritePlanets = getFavorites();
  const isFavorite =
    (data?.id &&
      favoritePlanets.some((planet: InPlanetCard) => planet.id === data.id)) ||
    false;

  const fetchDetails = async (id: string) => {
    setLoading(true);
    const response = await getPlanetDetails(id);
    setData(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails(query.id);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.baseContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      </SafeAreaView>
    );
  }

  const errorView = () => {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {"We couldn't load the data. Please try again later."}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.baseContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {!data ? (
          errorView()
        ) : (
          <View>
            {planetImages[data.englishName] && (
              <Image
                source={{uri: planetImages[data.englishName]}}
                style={styles.image}
              />
            )}
            <Text style={styles.title}>{data.englishName}</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => toggleFavorite(data.id, isFavorite)}>
              <Text style={styles.btnText}>
                {isFavorite
                  ? 'Remove from my Favorites'
                  : 'Add to my Favorites'}
              </Text>
            </TouchableOpacity>

            <View style={styles.content}>
              <View style={styles.info}>
                <Text style={styles.bold}>{'Mass:'}</Text>
                <Text style={styles.text}>
                  {data.mass.massValue}
                  {' × 10^'}
                  {data.mass.massExponent}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.bold}>{'Gravity:'}</Text>
                <Text style={styles.text}>
                  {data.gravity}
                  {' m/s^2'}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.bold}>{'Average Temperature:'}</Text>
                <Text style={styles.text}>
                  {data.avgTemp}
                  {' °C'}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.bold}>{'Mean Radius:'}</Text>
                <Text style={styles.text}>
                  {data.meanRadius}
                  {' km'}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.bold}>{'Distance from Sun:'}</Text>
                <Text style={styles.text}>
                  {data.semimajorAxis}
                  {' km'}
                </Text>
              </View>

              <View style={styles.infoMoons}>
                <Text style={[styles.bold, styles.boldMoons]}>{'Moons:'}</Text>
                <Text style={styles.text}>
                  {data.moons?.length > 0
                    ? data.moons.map(moon => moon.moon).join(', ')
                    : 'No moons listed'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlanetDetailsScreen;

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 14,
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    backgroundColor: colors.backgroundColor,
    padding: 14,
  },
  image: {
    marginTop: 42,
    width: 120,
    height: 120,
    alignSelf: 'center',
    borderRadius: 25,
  },
  title: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 24,
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  content: {
    padding: 12,
    gap: 12,
    marginVertical: 24,
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoMoons: {
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  boldMoons: {
    marginBottom: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
  },
  btn: {
    minWidth: 180,
    marginTop: 14,
    backgroundColor: colors.backgroundWhite,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
