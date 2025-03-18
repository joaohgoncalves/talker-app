import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ImageBackground, Image } from 'react-native';

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentSender, setCurrentSender] = useState('user'); // 'user' starts as Van Damme
  const [isToggled, setIsToggled] = useState(false);

  const user = {
    name: 'Van Damme',
    profilePicture: 'https://www.rbsdirect.com.br/imagesrc/24574493.jpg?w=700',
  };

  const other = {
    name: 'Sylvester Stallone',
    profilePicture: 'https://s2.glbimg.com/T23iygQtJi2gLkEgFrjEdsxI_Pg=/smart/e.glbimg.com/og/ed/f/original/2016/07/05/stallone-rambo.jpg',
  };

  const flatListRef = useRef();

  // Função para obter o horário atual no formato hora:minuto
  function getCurrentTime() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: String(messages.length + 1),
        text: message,
        sender: currentSender,
        time: getCurrentTime(),
      };

      // Adiciona a nova mensagem ao estado
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const toggleSender = () => {
    // Alterna entre o remetente
    const newSender = currentSender === 'user' ? 'other' : 'user';
    setCurrentSender(newSender);
    setIsToggled(!isToggled);
  };

  // Alterna a posição das mensagens dependendo de quem está enviando
  const getMessageStyle = (sender) => {
    if (sender === 'user') {
      return styles.userMessage;
    } else {
      return styles.otherMessage;
    }
  };

  const getMessageAlignment = (sender) => {
    if (sender === 'user') {
      return { alignSelf: 'flex-end' }; // Alinha as mensagens do 'user' à direita
    } else {
      return { alignSelf: 'flex-start' }; // Alinha as mensagens do 'other' à esquerda
    }
  };

  const currentUser = currentSender === 'user' ? user : other;

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/16/d8/df/16d8df4829e3c38aef2842c15a778305.jpg' }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: currentUser.profilePicture }}
          style={styles.profileImage}
        />
        <Text style={styles.contactName}>{currentUser.name}</Text>
        <View style={styles.callButtons}>
          <TouchableOpacity style={styles.callButton}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5085/5085054.png' }}
              style={styles.callButtonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton}>
            <Image
              source={{ uri: 'https://images.vexels.com/media/users/3/299509/isolated/preview/40051abd5a76713af8f015988fc6780e-blue-phone-icon-with-a-wave-on-it.png' }}
              style={styles.callButtonImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[styles.messageContainer, getMessageAlignment(item.sender), getMessageStyle(item.sender)]}
          >
            <Text style={[styles.messageText, item.sender === 'other' && styles.otherMessageText]}>
              {item.text}
            </Text>
            <Text
              style={[
                styles.timeText,
                item.sender === 'user' && styles.timeTextUser,
                item.sender === 'other' && styles.timeTextOther,
              ]}
            >
              {item.time}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 60 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Digite sua mensagem"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, styles.toggleButton, isToggled && styles.toggledButton]}
          onPress={toggleSender}
        >
          <Text style={styles.switchButtonText}>⇄</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#0077FF',
    fontSize: 24,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  contactName: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  callButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },
  callButton: {
    padding: 10,
  },
  callButtonImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  messageContainer: {
    padding: 12,
    margin: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#0077FF',
  },
  otherMessage: {
    backgroundColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  timeTextUser: {
    textAlign: 'right',
  },
  timeTextOther: {
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    width: '60%',
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#F1F1F1',
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#0077FF',
    padding: 12,
    borderRadius: 25,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  toggleButton: {
    backgroundColor: '#0077FF',
  },
  toggledButton: {
    backgroundColor: '#000000',
  },
  switchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
});
