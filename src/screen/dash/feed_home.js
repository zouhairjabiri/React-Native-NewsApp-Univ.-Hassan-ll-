import React, { useState, useEffect} from 'react'
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import moment from "moment";
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';


import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";


export function feed_home(props) {
  const [datainitial, setdatainitial] = useState([]);
  const [databackup, setdatabackup] = useState([]);
  const [isFetching, setisFetching] = useState(false);
  const [issearching, setisissearching] = useState(false);
  const [query, setquery] = useState('');
  const [begin, setbegin] = useState(true);

  // Get The Parent's Header : 
  const myheader = props.navigation.dangerouslyGetParent()




  function mycustomheaderTitle() {
    if (issearching) {
      return (
        <View style={styles.searchSection}>
          
          <TouchableOpacity onPress={() => { setisissearching(!issearching), setquery('') }}>
            <AntDesign name="back" size={30} style={styles.iconclose} />
          </TouchableOpacity>
          <TextInput placeholder="Recherche"
            style={styles.researchInput}
            onChangeText={text => setquery(text)}
            value={query}
            placeholderTextColor={'#d3d0d2'} />
        </View>
      )
    } else {
      return (
        <View style={{ alignContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Université Hassan II</Text>
        </View>

      )

    }
  }

  function mycustomheaderRight() {
    if (issearching) {
      return (
        <View style={styles.searchSection}>
        </View>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => { setisissearching(!issearching) }}>
          <View >
            <Ionicons name="ios-search" size={30} style={styles.icons} />
          </View>
        </TouchableOpacity>

      )

    }
  }
  function mycustomheaderLeft() {
    if (issearching) {
      return (
        <View style={styles.searchSection}>
        </View>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => { props.navigation.dispatch(DrawerActions.toggleDrawer()) }}>
          <MaterialCommunityIcons name="menu" size={30} style={styles.icons} />
        </TouchableOpacity>

      )

    }
  }
  myheader.setOptions({
    headerTitle: () => mycustomheaderTitle(),
    headerRight: () => mycustomheaderRight(),
    headerLeft: () => mycustomheaderLeft(),



    headerStyle: {
      backgroundColor: '#245591',
    },
  })


  useEffect(() => {
    const newData = databackup.filter(item => {
      const itemData = `${item.Description.toUpperCase()} ${item.Titre.toUpperCase()}`;
      const textData = query.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setdatainitial(newData)
    if (query === '') {
      setdatainitial(databackup)
    }
  }, [query])


  useEffect(() => {
    fetch('https://herokuuniv.herokuapp.com/api/Actualite/', {
      method: 'GET',
      headers: {
        Accept:
          'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token 6819607706a0d0c9702f16fb77750667e8ab684a`
      }
    }).then(res => res.json())
      .then(res => {
        setbegin(false)
        setdatainitial(res)
        setdatabackup(res)
        setisFetching(false)
      })
      .catch(error => console.log(error))
  }, [isFetching]);

  const onRefresh = () => {
    setisFetching(true)
  }

  return (
    <View>
      {begin ? 
      <Placeholder
        style={{marginTop:90}}
    Animation={Fade}
    Left={PlaceholderMedia}
    Right={PlaceholderMedia}
  >
    <PlaceholderLine width={80} />
    <PlaceholderLine style={{ backgroundColor: "#245591" }}/>
    <PlaceholderLine width={30} />
  </Placeholder>
   :  null}
      <View style={styles.container}>
        <FlatList style={styles.list}
          data={datainitial}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
          keyExtractor={(item) => {
            return item.id.toString();
          }}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator} />
            )
          }}
          renderItem={(post) => {
            const item = post.item;
            const _actualiteclicked = (actualite) => {
              setquery('')
              props.navigation.navigate('feed_detail', { actualite })
            }
            return (
              <View style={styles.container}>
                <TouchableOpacity onPress={() => _actualiteclicked(item)}>
                  <ImageBackground
                    style={styles.image}
                    source={{ uri: item.image }} >
                    <View style={styles.imageOverlay} />
                  </ImageBackground>

                  <View style={styles.textContainer}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.Categorie.Nom}</Text>
                    </View>
                    <View>
                      <Text style={styles.dateCreated}>{moment(item.DatePublication, "YYYY-MM-DD[escaped]hh-mm-ss").fromNow()}
                      </Text>
                      <Text style={styles.title}>{item.Titre}</Text>
                    </View>
                  </View>
                  <View style={styles.starContainer}>
                    <View style={styles.star}>
                      <FontAwesome
                        name='star'
                        color='#FFD700'
                        size={35} />
                      <Text style={styles.starText}>{item.avg_ratings.toFixed(1)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#fff',
    paddingTop: 1,
    paddingHorizontal: 1,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 320,

  },
  iconclose: {
    color: '#d3d0d2',
    marginLeft: 5,
    marginRight: 5,

  },
  icons: {
    color: '#d3d0d2',
    marginLeft: 13,
    marginRight: 13,

  },
  separator: {
    marginTop: 0.5,
    width: '100%',
  },
  textContainer: {
    position: 'absolute',
    top: 10,
    bottom: 20,
    left: 15,
    right: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  starContainer: {
    position: 'absolute',
    top: 8,
    bottom: 20,
    left: 15,
    right: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  star: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  starText: {
    position: 'absolute',
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    textAlign: 'justify',
    lineHeight: 20,
  },
  dateCreated: {
    color: '#ffffff',
    fontSize: 14,
  },
  badge: {
    backgroundColor: '#245591',
    opacity: 0.9,
    borderRadius: 5,
    height: 30,
    padding: 5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    height: 250,
  },
  imageOverlay: {
    backgroundColor: '#000000',
    opacity: 0.5,
    height: '100%'
  },
  textInput: {
    height: 40,
    width: '95%',
    borderBottomColor: '#d3d0d2',
    borderBottomWidth: 1,
    marginBottom: 25,
    fontSize: 15,
    color: '#ffffff',
    marginTop: 17,
    marginLeft: 20
  },
  researchInput: {
    height: 40,
    width: 320,
    borderBottomColor: '#d3d0d2',
    borderBottomWidth: 1,
    marginBottom: 25,
    fontSize: 15,
    color: '#ffffff',
    marginTop: 17,
    marginLeft: 10,
    marginRight: 10
  },
})

export default feed_home
