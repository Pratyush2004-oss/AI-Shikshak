import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constant/Colors'

export default function Button({ text, type = 'fill', onPress, loading = false }) {
  return (
    <TouchableOpacity onPress={onPress}
    disabled={loading}
      style={[styles.btn, {
        backgroundColor: type === 'fill' && Colors.PRIMARY,
        borderWidth: type === 'fill' ? 0 : 1
      }]}>
      {
        loading ? (
          <ActivityIndicator color={type === 'fill' ? Colors.WHITE : Colors.PRIMARY} />
        ) : (
          <Text style={[styles.btnTxt, {
            color: type === 'fill' ? Colors.WHITE : Colors.PRIMARY
          }]}>{text}</Text>

        )
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    width: "100%",
    borderColor: Colors.PRIMARY
  },
  btnTxt: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
})