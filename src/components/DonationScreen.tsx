import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const DonationScreen = ({ isModalVisible, toggleModal, user }: any) => {
    return (
        <Modal isVisible={isModalVisible} backdropOpacity={0.7}>
            <View style={styles.container}>
                {user.imageqr.url && user.imageqr.url ?
                    <Image style={{ width: 230, height: 266 }} source={{ uri: user.imageqr.url }} />
                    : <Text>ฟรีจ้า</Text>
                }
                <Text style={styles.modalText}>Thank you for your donation!</Text>
                <Button title="Close" onPress={toggleModal} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
    },
    image: {
        width: 230,
        height: 266,
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
});

export default DonationScreen;
