import { Dimensions, FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { Colors } from '../../constant/Colors'
import { UserDetailContext } from '../../context/UserdetailContext'
import { ProfileMenu } from '../../constant/Option'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import { auth } from '../../configs/firebaseConfig'
import { signOut } from 'firebase/auth';
export default function Profile() {
  const router = useRouter();
  const onButtonPress = (item) => {
    if (item.name !== 'Logout') {
      router.push(item.path);
    }
    else {
      signOut(auth).then(() => {
        // SignOut Successful
        setuserDetail(null);
        ToastAndroid.show("Logout Successfully", ToastAndroid.BOTTOM);
        router.replace('/');
      }).catch((error) => {
        ToastAndroid.show("Something went Wrong", ToastAndroid.BOTTOM);
      })
    }

  }
  const { userDetail, setuserDetail } = useContext(UserDetailContext);
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/wave.png')} style={styles.wave} />
      <Text style={styles.title}>Profile</Text>
      <Image source={require('../../assets/images/logo2.png')} style={styles.image} />

      {
        userDetail && (
          <View style={styles.userContainer}>
            <Text style={styles.name}>{userDetail.name}</Text>
            <Text style={styles.email}>{userDetail.email}</Text>
          </View>
        )
      }

      <FlatList
        style={styles.list}
        contentContainerStyle={{ marginTop: "auto" }} // Adding margin to the top
        showsVerticalScrollIndicator={false}
        data={ProfileMenu}
        renderItem={({ item, index }) => (
          <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => onButtonPress(item)}>
            <Ionicons name={item.icon} size={30} color={Colors.PRIMARY} style={styles.icon} />
            <Text style={styles.listName}>{item.name}</Text>
          </TouchableOpacity>
        )} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: Colors.WHITE
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-bold",
    color: Colors.WHITE
  },
  image: {
    width: 150,
    height: 150,
    marginTop:15,
    borderRadius: 15,
    alignSelf: "center",
  },
  wave: {
    position: 'absolute',
    height: 700,
    width: Dimensions.get('screen').width
  },
  name: {
    fontSize: 25,
    fontFamily: "outfit-bold",
    textAlign: "center",
    color: Colors.BG_GRAY
  },
  email: {
    fontSize: 18,
    fontFamily: "outfit",
    textAlign: "center",
    color: Colors.BG_GRAY
  },
  userContainer: {
  },
  list: {
    flex: 1,
    marginTop: "auto",
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 15,
    elevation: 3,
    gap: 20
  },
  icon: {
    marginLeft: 10,
    backgroundColor: Colors.BG_GRAY,
    padding: 5,
    borderRadius: 10
  },
  listName: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.GRAY
  }
})