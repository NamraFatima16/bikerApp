import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Login ({ navigation }: any){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password});
        if (error) Alert.alert('Error', error.message);
        else navigation.navigate('App');
        setLoading(false);
    };

 
    return(
        <View style = {styles.container}>
            <Text style ={styles.title}>Obsidian Routes</Text>
            <TextInput
                style = {styles.input}
                placeholder='Email'
                value = {email}
                onChangeText = {setEmail}
                keyboardType = "email-address"
            />
            <TextInput
                style = {styles.input}
                placeholder = "Password"
                value = {password}
                onChangeText = {setPassword}
                secureTextEntry            
            />
            <TouchableOpacity style = {styles.button} onPress = {handleLogin} disabled = {loading}>
                <Text style = {styles.buttonText}>{loading ? 'Logging in ...':'Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style = {styles.link}> Dont have an account? Sign up</Text>
            </TouchableOpacity>

        </View>
    )

}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#000', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#666' },
});