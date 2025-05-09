import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { Colors } from '../../constant/Colors';
import { UserDetailContext } from '../../context/UserdetailContext';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const { userDetail } = useContext(UserDetailContext); // Get user details from context

  const handleSubmit = async () => {
    if (!feedback) {
      Alert.alert('Error', 'Please enter your feedback.');
      return;
    }

    setLoading(true);

    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwZQGVMpU3vl08uoeFvgAuQP0BovXdyxzZ7d-JLhcyl7zBz9FH6Yeu1wd3SEEdJsp2u/exec';

      const formData = new FormData();
      formData.append('Name', userDetail?.name || 'Anonymous'); // Use name from context or default to 'Anonymous'
      formData.append('Email', userDetail?.email || 'No Email'); // Use email from context or default to 'No Email'
      formData.append('Message', feedback); // Feedback from the input field

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Thank You!', 'Your feedback has been sent successfully.');
        setFeedback(''); // Clear the feedback input
      } else {
        console.error('Error:', response);
        Alert.alert('Error', 'Failed to send feedback. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      Alert.alert('Error', 'An error occurred while sending feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback Form</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Your Feedback or Problem"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});