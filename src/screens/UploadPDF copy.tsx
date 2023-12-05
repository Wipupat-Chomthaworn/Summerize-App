import React, { useState, useEffect, useId } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Pressable, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import PdfThumbnail from "react-native-pdf-thumbnail";
import SearchByTagScreen from './SearchByTagScreen';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { useDispatch, useSelector } from 'react-redux';
import { readAsStringAsync, EncodingType } from 'expo-file-system';
import axios from 'axios';
import { storeSummarizedData } from '../redux/SumarizeSlice';
import { storeownerSummary } from '../redux/ownerSumarizeSlice';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { FIRE_STORE, storage } from '../../FirebaseConfig';
import { deleteObject, getDownloadURL, getStorage, ref, updateMetadata, uploadBytes } from 'firebase/storage';
import { Chip } from '@rneui/base';
const UploadPDF: React.FC = ({ navigation, route }: any) => {
  const tagcategories = useSelector((state: any) => state.tagcategories);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const transformedCategories = tagcategories.map((category: any, index: number) => ({
      id: index,
      value: category.tagname
    }));
    setTag(transformedCategories);
  }, [tagcategories]);

  const [name, setName] = useState<string>(route.params.item?.name || "");
  const [description, setDescription] = useState<string>(route.params.item?.description || '');
  const [tag, setTag] = useState<object[]>(route.params?.item?.tag);
  const [selected, setSelected] = useState<string[]>([]);

  // const [refresh, setRefresh] = useState<Boolean>(false);
  const [picture, setpicture] = useState(route.params.item?.img.url);
  const [picturename, setpicturename] = useState("");
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [showedit, setshowedit] = useState(true);
  const [showaddnewtag, setshowaddnewtag] = useState(false);
  const [newtag, setnewtag] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  // const refreshPage = 
  const pickDocument = async () => {

    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      const filePath = result[0].uri;
      const data2 = await PdfThumbnail.generateAllPages(filePath, 0);
      console.log(data2[0])
      setpicture(data2[0].uri);
      // const pdfFile = await fetch(result[0].uri);
      // const filepdfBlob: any = await pdfFile.blob();
      const filename = data2[0].uri.substring(data2[0].uri.lastIndexOf('/') + 1);
      setpicturename(filename);
      const filepdfBlob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new Error('uriToBlob failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', filePath, true);
        xhr.send(null);
      });

      const imgfileBlob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new Error('uriToBlob failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', data2[0].uri, true);
        xhr.send(null);
      });
      // const imgFile = await fetch(data2[0].uri);
      // const imgfileBlob:any = await imgFile.blob();
      const pdf = {
        name: result[0].name,
        type: result[0].type,
        size: result[0].size,
        uri: filepdfBlob,
        imageURL: imgfileBlob
      };
      setSelectedFile(pdf);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the file picker
        console.log("cancel pick")
      } else {
        throw err;
      }
    }
  };



  const uploadpdf = async () => {
    // Implement your upload logic here, using 'name', 'description', and 'selectedFile'
    setIsLoading(true);
    try {
      if (selectedFile != null && name != "" && selected.length != 0) {
        // สร้างอ้างอิงไปยังโฟลเดอร์ใน Firebase Storage
        const pdfStorageref = ref(storage, 'Sumarizefile/' + picturename);
        const imageStorageref = ref(storage, 'Sumarizepicture/' + picturename);

        // อัปโหลดไฟล์ PDFเเละรูป ไปยัง Firebase Storage
        const metadata = {
          contentType: 'application/pdf',
        };
        const picture = {
          contentType: 'image/jpeg',
        };
        await uploadBytes(pdfStorageref, selectedFile.uri, metadata);
        await uploadBytes(imageStorageref, selectedFile.imageURL, picture);

        // อัปเดต Firestore Document
        const tagsInAllTag = tagcategories.filter((allTagItem: any) => {
          return selected.some((tagItem) => tagItem === allTagItem.tagname);
        });


        const filePDFpublish = ref(storage, '/Sumarizefile/' + picturename);
        const picturepublish = ref(storage, '/Sumarizepicture/' + picturename);


        const imageUrl = await getDownloadURL(picturepublish);
        const fileUrl = await getDownloadURL(filePDFpublish);


        const upload = {
          name: name || route.params.item?.name,
          author: user.uid,
          tag: tagsInAllTag || route.params.item?.tag,
          description: description,
          like: [],
          file: { name: picturename, url: fileUrl }, // เส้นทางไปยังไฟล์ใน Firebase Storage
          img: { name: picturename, url: imageUrl },
        };

        const collectionRef = collection(FIRE_STORE, 'Sumarize');
        const newDocRef = await addDoc(collectionRef, upload);

        await setDoc(doc(FIRE_STORE, "view", newDocRef.id), {
          listuser: [],
          sumarize: newDocRef.id
        });
        const q2 = query(collectionRef, where("author", "==", user.uid));
        const querySnapshot2 = await getDocs(q2);

        const dataArray2: any = querySnapshot2.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
        dispatch(storeownerSummary(dataArray2));
        setIsLoading(false);

        console.log("ไฟล์ PDF อัปโหลดสำเร็จ");
        navigation.navigate("Profile");
      }
      else {
        Alert.alert("กรุณากรอกอัพโหลดไฟล์ชื่อเเละเเท็ก")
        setIsLoading(false)
      }
    } catch (error: any) {
      setIsLoading(false);
      alert("เกิดข้อผิดพลาดในการอัปโหลด PDF: " + error.message);
      console.error(error);
    }
  };

  const editpdf = async () => {
    setIsLoading(true);
    try {
      if (selectedFile == null) {
        const tagsInAllTag = tagcategories.filter((allTagItem: any) => {
          return selected.some((tagItem) => tagItem === allTagItem.tagname);
        });

        if (tagsInAllTag.length == 0) {
          const upload = {
            name: name || route.params.item?.name,
            tag: route.params.item?.tag,
            description: description || route.params.item?.description,
            file: { name: route.params.item?.file.name, url: route.params.item?.file.url }, // เส้นทางไปยังไฟล์ใน Firebase Storage
            img: { name: route.params.item?.img.name, url: route.params.item?.img.url },
          };

          const edituserData = doc(FIRE_STORE, "Sumarize", route.params.item?._id);
          await updateDoc(edituserData, upload);
          alert("success")
          setIsLoading(false);
          console.log("ไฟล์ PDF เเก้ไขสำเร็จ");
          navigation.navigate("Profile");
        }
        else{
          const upload = {
            name: name || route.params.item?.name,
            tag: tagsInAllTag,
            description: description || route.params.item?.description,
            file: { name: route.params.item?.file.name, url: route.params.item?.file.url }, // เส้นทางไปยังไฟล์ใน Firebase Storage
            img: { name: route.params.item?.img.name, url: route.params.item?.img.url },
          };

          const edituserData = doc(FIRE_STORE, "Sumarize", route.params.item?._id);
          await updateDoc(edituserData, upload);
          alert("success")
          setIsLoading(false);
          console.log("ไฟล์ PDF เเก้ไขสำเร็จ");
          navigation.navigate("Profile");
        }

      }
      else {
        // สร้างอ้างอิงไปยังโฟลเดอร์ใน Firebase Storage
        const pdfStorageref = ref(storage, 'Sumarizefile/' + picturename);
        const imageStorageref = ref(storage, 'Sumarizepicture/' + picturename);

        const desertRef = ref(storage, `/Sumarizefile/${route.params.item.file.name}`);
        const deserimgtRef = ref(storage, `/Sumarizepicture/${route.params.item.img.name}`);
        // const desertRef2 = ref(storage, `/Sumarizepicture/${route.params.item.img.name}`);
        await deleteObject(desertRef);
        await deleteObject(deserimgtRef);
        // อัปโหลดไฟล์ PDFเเละรูป ไปยัง Firebase Storage
        const metadata = {
          contentType: 'application/pdf',
        };
        const picture = {
          contentType: 'image/jpeg',
        };
        await uploadBytes(pdfStorageref, selectedFile.uri, metadata);
        await uploadBytes(imageStorageref, selectedFile.imageURL, picture);
        // await deleteObject(desertRef2);
        // อัปเดต Firestore Document
        const tagsInAllTag = tagcategories.filter((allTagItem: any) => {
          return selected.some((tagItem) => tagItem === allTagItem.tagname);
        });


        const filePDFpublish = ref(storage, '/Sumarizefile/' + picturename);
        const picturepublish = ref(storage, '/Sumarizepicture/' + picturename);


        const imageUrl = await getDownloadURL(picturepublish);
        const fileUrl = await getDownloadURL(filePDFpublish);
        console.log("adfafewrwerw")
        const upload = {
          name: name || route.params.item?.name,
          tag: tagsInAllTag || tag,
          description: description || route.params.item?.description,
          file: { name: picturename, url: fileUrl }, // เส้นทางไปยังไฟล์ใน Firebase Storage
          img: { name: picturename, url: imageUrl },
        };

        const edituserData = doc(FIRE_STORE, "Sumarize", route.params.item?._id);
        await updateDoc(edituserData, upload);
        alert("success")
        setIsLoading(false);
        console.log("ไฟล์ PDF เเก้ไขสำเร็จ");
        navigation.navigate("Profile");
      }
    } catch (error: any) {
      setIsLoading(false);
      alert("เกิดข้อผิดพลาดในการเเก้ไข PDF: " + error.message);
      console.error(error);
    }
  }

  const addnewtag = async () => {
    const addnewtagref = collection(FIRE_STORE, "Tag");
    await addDoc(addnewtagref, {
      mostsearch: 0,
      tagname: newtag
    });
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>ชื่อสรุป</Text>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="กรอกชื่อสรุป"
          style={styles.textField}
        />

        <Text style={styles.textFieldContainer}>คำอธิบายสรุป</Text>
        <View style={styles.textAreaContainer} >
          <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            placeholderTextColor="grey"
            numberOfLines={10}
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholder="กรอก คำอธืบายสรุป"
            multiline={true}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showaddnewtag}
          onRequestClose={() => {
            setshowaddnewtag(!showaddnewtag);
          }}
        >
          <Pressable style={styles.modalContainer} onPress={() => setshowaddnewtag(!showaddnewtag)}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>กรอกเเท็กที่ต้องการเพิ่ม</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Tag Name"
                onChangeText={(text) => setnewtag(text)}
              />
              <Pressable
                style={styles.ButtonETC}
                onPress={() => {
                  // Your logic here
                  addnewtag();
                  setshowaddnewtag(!showaddnewtag);
                }}
              >
                <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>เพิ่ม</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
        <View style={{ marginTop: 10 }}>
          {/* Tag view */}
          <Text style={styles.textFieldContainer}>เเท็ก</Text>
          {route.params.item?.tag == undefined && (
            <MultipleSelectList
              setSelected={(val: any) => val ? setSelected(val) : setshowaddnewtag(true)}
              notFoundText='Add new Tag'
              data={tag}
              save="key"
              label="Categories"
            />)
          }

          <View style={{ marginTop: 10 }}>
            {/* Tag view */}
            {route.params.item?.tag.length != 0 && showedit ?
              <FlatList
                style={{ margin: 10 }}
                data={route.params.item?.tag}
                scrollEnabled={false}
                numColumns={4}
                keyExtractor={(item: any, index: number) => index.toString()}
                renderItem={({ item, index }: any) => (
                  <Chip key={index} onPress={() => setshowedit(false)} title={item.tagname} containerStyle={{ marginVertical: 10, marginHorizontal: 5 }} color={"#6667AB"} titleStyle={{ color: 'white' }} />
                )}
              /> :
              <View>
                {route.params.item?.tag.length == 0 ? null : <TouchableOpacity onPress={() => setshowedit(true)}><Text style={{ textAlign: 'right', color: 'red' }}>cancel</Text></TouchableOpacity>}
                <MultipleSelectList
                  setSelected={(val: any) => val ? setSelected(val) : setshowaddnewtag(true)}
                  data={tag}
                  save="value"
                  label="Categories"
                  placeholder='Tag '
                  badgeStyles={{ backgroundColor: '#6667ab' }}
                />
              </View>
            }
          </View>
        </View>
        <Pressable style={styles.ButtonETC} onPress={() => pickDocument()}>
          <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>เลือกเอกสาร (pdf)</Text>
        </Pressable>
        {selectedFile && (
          <View>
            <Text>Selected PDF File:</Text>
            <Text>Name: {selectedFile.name}</Text>
            <Text>Size: {selectedFile.size} bytes</Text>
            <Text>Type: {selectedFile.type}</Text>
            <Image style={{ width: 300, height: 300, resizeMode: 'contain', alignSelf: 'center' }} source={{ uri: picture }}></Image>
          </View>
        )}
        {
          route.params.item?.img.url && selectedFile == null && (
            <View>
              <Text style={{ paddingBottom: 20 }}>Name: {route.params.item?.file.name}</Text>
              <Image style={{ width: 300, height: 300, resizeMode: 'contain', alignSelf: 'center' }} source={{ uri: route.params.item.img.url }}></Image>
            </View>
          )
        }
        {route.params.item ?
          <Pressable style={styles.ButtonETC} onPress={() => editpdf()}>
            <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>เเก้ไขสรุป</Text>
          </Pressable> :
          <Pressable style={styles.ButtonETC} onPress={() => uploadpdf()}>
            <Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>อัพโหลดสรุป</Text>
          </Pressable>}
        <Modal visible={isLoading} transparent={true}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="black" />
            <Text>Uploading...</Text>
          </View>
        </Modal>
      </View>
    </ScrollView>


  );
};
const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    backgroundColor: 'white'
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 150,
  },
  textFieldContainer: { marginTop: 30 },
  textField: {
    marginTop: 10,
    borderColor: "black",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  stretch: {
    width: 50,
    height: 200,
    resizeMode: 'stretch',
  },
  ButtonETC: {
    width: 230,
    height: 45,
    borderRadius: 10,
    margin: 20,
    backgroundColor: 'black',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  modalInput: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    paddingLeft: 10,
  },
  modalBox: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  textAreaContainer: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start"
  }
});

export default UploadPDF;
