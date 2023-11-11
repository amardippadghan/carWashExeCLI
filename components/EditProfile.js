import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  useColorScheme, ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function EditProfile({ route }) {
   const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 40,
      backgroundColor: isDarkMode ? '#1F2937' : '#E5E7EB',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      marginLeft: 6,
      color: isDarkMode ? '#FFFFFF' : '#000',
    },
    input: {
      height: 40,
      width: 300,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 10,
      color: '#000',
      paddingLeft: 10,
      fontSize: 16,
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    datePickerText: {
      height: 40,
      paddingTop: 10,
      width: 300,
      borderWidth: 1,
      borderColor: '#000',
      color: '#000',
      borderRadius: 5,
      paddingLeft: 10,
      fontSize: 16,
      backgroundColor: '#FFFFFF',
    },
    updateButton: {
      backgroundColor: '#FFD369',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    updateButtonText: {
      fontSize: 18,
      color: '#000000',
      fontWeight: 'bold',
    },
  });
  const { profileData } = route.params;
  


  const [fullName, setFullName] = useState(profileData.fullName);
  const [email, setEmail] = useState(profileData.email);
  const [contactNumber, setContactNumber] = useState(profileData.contactNumber.toString());
  const navigation = useNavigation();
  const [dateOfBirth, setDateOfBirth] = useState(new Date(profileData.dateOfBirth));
  const [address, setAddress] = useState(profileData.address);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const confirmUpdate = () => {
    Alert.alert(
      'Confirm Update',
      'Are you sure you want to update your profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: updateProfile,
        },
      ]
    );
  };

  const updateProfile = async () => {
    try {
      const formattedDOB = formatDate(dateOfBirth);

      const updatedProfile = {
        fullName,
        email,
        contactNumber,
        dateOfBirth: formattedDOB,
        address,
        password: profileData.password,
        profilePic: profileData.profilePic,
      };

      const response = await axios.patch(
        `https://car-wash-backend-api.onrender.com/api/agents/${profileData._id}`,
        updatedProfile
      );

      if (response.status === 200) {
        Alert.alert('Profile Updated', 'Your profile has been updated.');
        navigation.navigate('ProfilePage');
      } else {
        Alert.alert('Update Failed', 'Failed to update your profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Update Failed', 'An error occurred while updating your profile. Please try again.');
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Edit your name"
            placeholderTextColor="#000"
            value={fullName}
            onChangeText={text => setFullName(text)}
            keyboardType="text"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Edit your email"
            placeholderTextColor="#000"
            value={email}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Edit your contact number"
            placeholderTextColor="#000"
            value={contactNumber}
            onChangeText={text => setContactNumber(text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date Of Birth</Text>

          <TouchableOpacity onPress={showDatepicker}>
            <Text style={styles.datePickerText}>{formatDate(dateOfBirth)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateOfBirth}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Edit your address"
            placeholderTextColor="#000"
            value={address}
            onChangeText={text => setAddress(text)}
            keyboardType="text"
          />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={confirmUpdate}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


