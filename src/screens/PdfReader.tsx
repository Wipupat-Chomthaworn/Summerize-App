import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Pdf from 'react-native-pdf';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PdfReader = ({navigation, route}:any) => {
  console.log("route param", route.params)
  // route param {"pdf": {"name": "CSE_Instructor_Materials_Chapter3_UpdateYearFootnote-pdf-thumbnail-0-963325325447467826.jpg", "url": "https://firebasestorage.googleapis.com/v0/b/authentication-axis-3-tool.appspot.com/o/Sumarizefile%2FCSE_Instructor_Materials_Chapter3_UpdateYearFootnote-pdf-thumbnail-0-963325325447467826.jpg?alt=media&token=21ffdb10-fd3d-4dbb-b231-264a408a38ee"}}
  return (
    <View style={styles.container}>
      {/* <Pdf trustAllCerts={false}  style={styles.pdf} source={require('../model/sample.pdf')}></Pdf> */}
      {/* real one for load real pdf */}
      <Pdf trustAllCerts={false}  style={styles.pdf} source={{uri:route.params.pdf}}></Pdf>

      <StatusBar style="auto" />
    </View>
  )
};

export default PdfReader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdf:{
    flex:1,
    width:wp('100%')
  }
});
