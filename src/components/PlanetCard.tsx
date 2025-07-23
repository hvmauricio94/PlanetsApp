import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';
import planetImages from '../screens/PlanetsScreen/planetImages';
import HeartIcon from 'react-native-vector-icons/FontAwesome';

export interface InPlanet {
    id: string;
    name: string;
    englishName: string;
    bodyType: string;
    mass?: {
      massValue: number,
      massExponent: number,
    }
    gravity: number,
    isFavorite?: boolean,
    onPress?: () => void;
    onPressFavorite?: () => void;
    hideHeart?: boolean
  }

const PlanetCard: React.FC<InPlanet> = ({
    englishName, mass, gravity, isFavorite, onPress, onPressFavorite, hideHeart,
}) => {

  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      {planetImages[englishName] && (
        <Image
          source={{ uri: planetImages[englishName] }}
          style={styles.image}
        />
      )}
      <View style={styles.container}>
          <Text style={styles.bold}>{englishName}</Text>
          {
            mass &&
            <View style={styles.infoContainer}>
              <Text style={styles.info}>{'Mass: '}</Text>
              <Text style={styles.text}>{mass.massValue}{' x 10^'}{mass.massExponent}</Text>
            </View>
          }
          {
            gravity &&
            <View style={styles.infoContainer}>
              <Text style={styles.info}>{'Gravity: '}</Text>
              <Text style={styles.text}>{gravity}{' m/s^2'}</Text>
            </View>
          }
      </View>
      {
        !hideHeart &&
        <TouchableOpacity style={styles.heart} onPress={onPressFavorite}>
          <HeartIcon name={isFavorite ? 'heart' : 'heart-o'} size={25} color={colors.backgroundHeart} />
        </TouchableOpacity>
      }
    </TouchableOpacity>
  );
};

export default PlanetCard;

const styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundCard,
      width: '100%',
      height: 'auto',
      padding: 14,
      borderRadius: 12,
      elevation: 8,
    },

    image: {
      width: 80,
      height: 80,
      marginRight: 22,
      borderRadius: 12,
    },

    infoContainer: {
      marginTop: 6,
      flexDirection: 'row',
    },

    container: {
      flex: 1,
      justifyContent: 'center',
    },

    bold: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },

    text: {
      fontSize: 14,
      color: colors.textPrimary,
      fontStyle: 'italic',
    },

    info: {
      fontSize: 14,
      color: colors.textPrimary,
    },

    heart: {
      right: 0,
    },
  });
