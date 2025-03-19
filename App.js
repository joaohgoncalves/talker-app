// Importação dos hooks e componentes necessários do React e React Native
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ImageBackground, Image } from 'react-native';

// Componente principal do aplicativo
export default function App() {
  // Definindo os estados principais do aplicativo
  const [message, setMessage] = useState(''); // Armazena o texto da mensagem que o usuário está digitando
  const [messages, setMessages] = useState([]); // Armazena todas as mensagens trocadas no chat
  const [currentSender, setCurrentSender] = useState('user'); // Define quem é o remetente da mensagem (inicialmente é o usuário)
  const [isToggled, setIsToggled] = useState(false); // Define o estado de alternância entre o remetente atual

  // Definições de dados para os dois "usuários" do chat
  const user = {
    name: 'Van Damme', // Nome do usuário
    profilePicture: 'https://www.rbsdirect.com.br/imagesrc/24574493.jpg?w=700', // URL da imagem de perfil do usuário
  };

  const other = {
    name: 'Sylvester Stallone', // Nome do outro "usuário"
    profilePicture: 'https://s2.glbimg.com/T23iygQtJi2gLkEgFrjEdsxI_Pg=/smart/e.glbimg.com/og/ed/f/original/2016/07/05/stallone-rambo.jpg', // URL da imagem de perfil do outro "usuário"
  };

  const flatListRef = useRef(); // Referência para o FlatList para permitir rolar até o final automaticamente

  // Função para obter o horário atual no formato HH:MM
  function getCurrentTime() {
    const date = new Date(); // Obtém o objeto de data atual
    const hours = String(date.getHours()).padStart(2, '0'); // Obtém as horas, formatando para ter 2 dígitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Obtém os minutos, formatando para ter 2 dígitos
    return `${hours}:${minutes}`; // Retorna a string no formato HH:MM
  }

  // Função para enviar uma nova mensagem
  const sendMessage = () => {
    if (message.trim()) { // Verifica se a mensagem não está vazia
      const newMessage = {
        id: String(messages.length + 1), // Cria um ID único para cada mensagem
        text: message, // Atribui o texto da mensagem
        sender: currentSender, // Atribui quem está enviando a mensagem (user ou other)
        time: getCurrentTime(), // Obtém a hora atual para a mensagem
      };

      // Atualiza o estado de mensagens com a nova mensagem
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(''); // Limpa o campo de entrada de mensagem
    }
  };

  // Efeito que rola a lista de mensagens até o final sempre que uma nova mensagem é adicionada
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]); // O efeito é acionado sempre que o estado de mensagens muda

  // Função para alternar o remetente da mensagem (de user para other e vice-versa)
  const toggleSender = () => {
    const newSender = currentSender === 'user' ? 'other' : 'user'; // Alterna entre 'user' e 'other'
    setCurrentSender(newSender); // Atualiza o remetente
    setIsToggled(!isToggled); // Alterna o estado do toggle
  };

  // Função para definir o estilo das mensagens com base no remetente
  const getMessageStyle = (sender) => {
    if (sender === 'user') {
      return styles.userMessage; // Estilo para a mensagem do 'user'
    } else {
      return styles.otherMessage; // Estilo para a mensagem do 'other'
    }
  };

  // Função para alinhar a mensagem à esquerda ou à direita com base no remetente
  const getMessageAlignment = (sender) => {
    if (sender === 'user') {
      return { alignSelf: 'flex-end' }; // Alinha as mensagens do 'user' à direita
    } else {
      return { alignSelf: 'flex-start' }; // Alinha as mensagens do 'other' à esquerda
    }
  };

  // Seleção do usuário atual com base no estado currentSender
  const currentUser = currentSender === 'user' ? user : other;

  // Renderização do layout do aplicativo
  return (
    // Imagem de fundo para o layout do chat
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/16/d8/df/16d8df4829e3c38aef2842c15a778305.jpg' }}
      style={styles.container} // Aplica o estilo ao container
    >
      {/* Cabeçalho com nome do contato, imagem de perfil e botões de chamada */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: currentUser.profilePicture }} // Exibe a imagem de perfil do usuário atual
          style={styles.profileImage}
        />
        <Text style={styles.contactName}>{currentUser.name}</Text>
        <View style={styles.callButtons}>
          {/* Botões de chamada (de voz e vídeo) */}
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

      {/* FlatList para exibir as mensagens */}
      <FlatList
        ref={flatListRef} // Referência para rolar até o final
        data={messages} // As mensagens a serem exibidas
        renderItem={({ item }) => (
          // Renderiza cada item (mensagem) da lista
          <View
            style={[styles.messageContainer, getMessageAlignment(item.sender), getMessageStyle(item.sender)]}
          >
            {/* Exibe o texto da mensagem */}
            <Text style={[styles.messageText, item.sender === 'other' && styles.otherMessageText]}>
              {item.text}
            </Text>
            {/* Exibe o horário da mensagem */}
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
        keyExtractor={(item) => item.id} // Chave única para cada mensagem
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 60 }} // Ajusta o conteúdo da FlatList
      />

      {/* Caixa de entrada para digitar a mensagem */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message} // Valor do campo de entrada
          onChangeText={setMessage} // Atualiza o estado com o texto digitado
          placeholder="Digite sua mensagem" // Placeholder para o campo de entrada
          onSubmitEditing={sendMessage} // Envia a mensagem ao pressionar Enter
        />
        {/* Botão para enviar a mensagem */}
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>

        {/* Botão para alternar o remetente */}
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

// Estilos do aplicativo
const styles = StyleSheet.create({
  container: {
    flex: 1, // Preenche toda a tela
    paddingTop: 20, // Espaço no topo
    justifyContent: 'flex-end', // Alinha os itens ao final (parte inferior)
  },
  header: {
    flexDirection: 'row', // Exibe os itens em linha
    alignItems: 'center', // Alinha os itens verticalmente
    justifyContent: 'flex-start', // Alinha os itens à esquerda
    padding: 10, // Espaçamento interno
    backgroundColor: '#fff', // Cor de fundo do cabeçalho
    position: 'absolute', // Fixa o cabeçalho no topo
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Coloca o cabeçalho acima do conteúdo
    shadowColor: '#000', // Cor da sombra
    shadowOpacity: 0.3, // Opacidade da sombra
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    elevation: 4, // Sombra para dispositivos Android
  },
  backButton: {
    padding: 10, // Espaçamento do botão de voltar
  },
  backButtonText: {
    color: '#0077FF', // Cor do texto do botão de voltar
    fontSize: 24, // Tamanho da fonte
  },
  profileImage: {
    width: 40, // Largura da imagem de perfil
    height: 40, // Altura da imagem de perfil
    borderRadius: 20, // Deixa a imagem redonda
    marginLeft: 10, // Espaçamento à esquerda
    marginRight: 10, // Espaçamento à direita
  },
  contactName: {
    color: '#000', // Cor do nome do contato
    fontSize: 18, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
  },
  callButtons: {
    flexDirection: 'row', // Exibe os botões em linha
    justifyContent: 'flex-end', // Alinha à direita
    marginLeft: 'auto', // Espaço à esquerda para empurrar à direita
  },
  callButton: {
    padding: 10, // Espaçamento interno dos botões de chamada
  },
  callButtonImage: {
    width: 24, // Largura das imagens dos botões de chamada
    height: 24, // Altura das imagens dos botões de chamada
    resizeMode: 'contain', // Ajusta o tamanho da imagem
  },
  messageContainer: {
    padding: 12, // Espaçamento interno das mensagens
    margin: 5, // Espaçamento entre as mensagens
    borderRadius: 10, // Cantos arredondados
    maxWidth: '80%', // Limita a largura das mensagens
  },
  userMessage: {
    backgroundColor: '#0077FF', // Cor de fundo das mensagens do 'user'
  },
  otherMessage: {
    backgroundColor: '#E0E0E0', // Cor de fundo das mensagens do 'other'
  },
  messageText: {
    fontSize: 16, // Tamanho da fonte das mensagens
    color: '#fff', // Cor do texto das mensagens
  },
  otherMessageText: {
    color: '#333', // Cor do texto para as mensagens do 'other'
  },
  timeText: {
    fontSize: 12, // Tamanho da fonte do horário
    color: '#999', // Cor do horário
    marginTop: 5, // Espaço acima do horário
  },
  timeTextUser: {
    textAlign: 'right', // Alinha o horário à direita para o 'user'
  },
  timeTextOther: {
    textAlign: 'left', // Alinha o horário à esquerda para o 'other'
  },
  inputContainer: {
    flexDirection: 'row', // Exibe os itens em linha
    padding: 10, // Espaçamento interno
    alignItems: 'center', // Alinha os itens verticalmente
    justifyContent: 'space-between', // Espaça os itens igualmente
    backgroundColor: '#fff', // Cor de fundo da caixa de entrada
    borderTopLeftRadius: 20, // Canto superior esquerdo arredondado
    borderTopRightRadius: 20, // Canto superior direito arredondado
    borderBottomWidth: 1, // Adiciona borda inferior
    borderColor: '#ccc', // Cor da borda inferior
  },
  input: {
    width: '60%', // Define a largura do campo de texto
    padding: 12, // Espaçamento interno do campo de texto
    borderRadius: 25, // Cantos arredondados
    backgroundColor: '#F1F1F1', // Cor de fundo do campo de texto
    fontSize: 16, // Tamanho da fonte do campo de texto
    color: '#333', // Cor do texto do campo de texto
  },
  sendButton: {
    backgroundColor: '#0077FF', // Cor de fundo do botão de envio
    padding: 12, // Espaçamento interno do botão de envio
    borderRadius: 25, // Cantos arredondados
  },
  sendButtonText: {
    color: '#fff', // Cor do texto do botão de envio
    fontWeight: 'bold', // Negrito no texto
  },
  switchButton: {
    paddingVertical: 12, // Espaçamento vertical
    paddingHorizontal: 15, // Espaçamento horizontal
    borderRadius: 50, // Botão redondo
    width: 40, // Largura do botão
    height: 40, // Altura do botão
    justifyContent: 'center', // Alinha o conteúdo do botão no centro
    alignItems: 'center', // Alinha o conteúdo do botão no centro
    marginLeft: 10, // Espaço à esquerda do botão
  },
  toggleButton: {
    backgroundColor: '#0077FF', // Cor de fundo do botão de alternância
  },
  toggledButton: {
    backgroundColor: '#000000', // Cor de fundo quando alternado
  },
  switchButtonText: {
    color: '#fff', // Cor do texto no botão de alternância
    fontWeight: 'bold', // Negrito
    fontSize: 24, // Tamanho da fonte
  },
});
