import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import api from '../../services/api';

import logo from '../../assets/logo.png';
import logout from '../../assets/logout.png';
import dislike from '../../assets/dislike.png';
import like from '../../assets/like.png';
import itsamatch from '../../assets/itsamatch.png';

export default function Main({navigation}) {
  const id = navigation.getParam('loggedDev');
  const [devs, setDevs] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('devs', {
        headers: {user: id},
      });

      setDevs(response.data);
    }

    loadDevs();
  }, [id]);

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: {user: id},
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    });
  }, [id]);

  async function handleDislike() {
    const [dev, ...rest] = devs;

    await api.post(`/devs/${dev._id}/dislikes`, null, {
      headers: {user: id},
    });

    setDevs(rest);
  }

  async function handleLike() {
    const [dev, ...rest] = devs;

    await api.post(`/devs/${dev._id}/likes`, null, {
      headers: {user: id},
    });

    setDevs(rest);
  }

  async function handleLogOut() {
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logo}>
          <Image source={logo} />
        </View>

        <View style={styles.logout}>
          <TouchableOpacity onPress={handleLogOut}>
            <Image source={logout} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        {devs.length === 0 ? (
          <Text style={styles.empty}>Acabou :(</Text>
        ) : (
          devs.map((dev, index) => (
            <View
              key={dev._id}
              style={[styles.card, {zIndex: devs.length - index}]}>
              <Image
                style={styles.avatar}
                source={{
                  uri: dev.avatar,
                }}
              />

              <View style={styles.footer}>
                <Text style={styles.name}>{dev.name}</Text>

                <Text style={styles.bio} numberOfLines={3}>
                  {dev.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDislike}>
          <Image source={dislike} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLike}>
          <Image source={like} />
        </TouchableOpacity>
      </View>

      {matchDev && (
        <View style={styles.matchContainer}>
          <Image source={itsamatch} style={styles.matchImage} />

          <Image
            style={styles.matchAvatar}
            source={{
              uri: matchDev.avatar,
            }}
          />

          <Text style={styles.matchName}>{matchDev.name}</Text>

          <Text style={styles.matchBio} numberOfLines={5}>
            {matchDev.bio}
          </Text>

          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.closeMatch}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerContainer: {
    width: '100%',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  logo: {
    alignItems: 'flex-end',
  },

  logout: {
    position: 'absolute',
    right: 30,
    top: 9,
  },

  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },

  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  avatar: {
    flex: 1,
    height: 300,
  },

  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  bio: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
    lineHeight: 18,
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  matchImage: {
    height: 60,
    resizeMode: 'contain',
  },

  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#fff',
    marginVertical: 30,
  },

  matchName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },

  matchBio: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  closeMatch: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
});
