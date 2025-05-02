import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlanetsScreen from '../screens/PlanetsScreen/PlanetsScreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import Favorites from '../screens/Favorites/Favorites';

const Tab = createBottomTabNavigator();

const getIconTab = (name: string,focused: boolean) => {
    if (focused) {
        if (name === 'planet') {
            return <Ionicons name={name} color={'#ffffff'} size={20}/>;
        }
        if (name === 'heart') {
            return <FontAwesomeIcon name={name} color={'#ffffff'} size={20}/>;
        }
    } else {
        if (name === 'planet') {
            return <Ionicons name={name} color={'#5E768D'} size={20}/>;
        }
        if (name === 'heart') {
            return <FontAwesomeIcon name={name} color={'#5E768D'} size={20}/>;
        }
    }
};

export const TAB_CONTAINER_HEIGHT = 80;

const TabStack = () => {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarItemStyle: styles.tabItem,
            tabBarLabelStyle: styles.tabLabel,
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#FFFFFF',
            tabBarStyle: [
                styles.tabContainer,
                { height: TAB_CONTAINER_HEIGHT + insets.bottom },
            ],
        }}
        >
            <Tab.Screen
            name="Planet List"
            component={PlanetsScreen}
            options={{
                tabBarIcon: ({focused}) => (
                    getIconTab('planet', focused)
                ),
            }}
            />
            <Tab.Screen
            name="My Favorites"
            component={Favorites}
            options={{
                tabBarIcon: ({focused}) => (
                    getIconTab('heart', focused)
                ),
            }}
            />
        </Tab.Navigator>
    );
};

export default TabStack;

const styles = StyleSheet.create({
    tabContainer: {
        backgroundColor: colors.backgroundTab,
        paddingHorizontal: 10,
        paddingTop: 7,
        borderTopWidth: 0,
    },

    tabItem: {
        height: 60,
    },

    tabLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
});
