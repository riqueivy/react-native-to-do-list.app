import { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Switch, TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [Lista, setLista] = useState([{ texto: 'dormir', feito: false , data:''}]);
  const [Input, setInput] = useState('');



  function armazenar() {
    //.trim   => remove espaços em branco na string
    if (Input.trim() === '') {
      alert('Digite algo');
    } else {
      const agora = new Date();
      const dia = String(agora.getDate()).padStart(2, '0');
      const mes = String(agora.getMonth() + 1).padStart(2, '0');
      const ano = agora.getFullYear();
      const hora = String(agora.getHours()).padStart(2, '0');
      const minutos = String(agora.getMinutes()).padStart(2, '0');

      const dataFormatada = `${dia}/${mes}/${ano} - ${hora}:${minutos}`;
      const novaLista = [...Lista, { texto: Input,feito:false, data: dataFormatada}];
      setLista(novaLista);
      setInput('');
      AsyncStorage.setItem('tarefas', JSON.stringify(novaLista));
    }
    
  }
  useEffect(() => {
  async function carregarLista() {
    const dados = await AsyncStorage.getItem('tarefas');
    if (dados !== null) {
      //parce = reverter 
      setLista(JSON.parse(dados));
    }
  }
  carregarLista();
}, []);

//indexParameter == index atual do item selecionado
  function Deletar(indexParameter) {
    const ListaFiltrada = Lista.filter((_, index) => index !== indexParameter);
    setLista(ListaFiltrada);
    //stringify = transformar
    AsyncStorage.setItem('tarefas', JSON.stringify(ListaFiltrada));
  }
//index == refere-se ao index do item que deve ser selecionado
  function Butao(index) {
    const novaLista = [...Lista];
    novaLista[index].feito = !novaLista[index].feito;
    setLista(novaLista);
    AsyncStorage.setItem('tarefas', JSON.stringify(novaLista));
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>TO DO LIST</Text>
        <TextInput
          placeholder="Digite sua tarefa"
          value={Input}
          onChangeText={(texto) => setInput(texto)}
          style={styles.input}
        />
        <TouchableOpacity style={styles.buton} onPress={armazenar}>
          <Text style={styles.textButao}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.Lista}
        data={Lista}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Switch value={item.feito} onValueChange={() => Butao(index)} />

            <Text style={item.feito ? styles.feito : styles.texto}>{item.texto}</Text>
            <Text style={styles.hora}>{item.data}</Text>

            <TouchableOpacity onPress={() => Deletar(index)}>
              <Text style={styles.deletar}>Deletar</Text>
            </TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },

  cabecalho: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  titulo: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  buton: {
    backgroundColor: 'lightblue',
    borderRadius: 15,
  },

  textButao: {
    textAlign: 'center',
    margin: 10,
    fontSize: 15,
  },

  Lista: {
    //empurra o item para longe das bordas laterais
    paddingHorizontal: 20,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    elevation: 3,
  },

  texto: {
    fontSize: 18,
    flex: 1,
    marginHorizontal: 10,
  },

  feito: {
    fontSize: 18,
    flex: 1,
    marginHorizontal: 10,
    color: 'gray',
    textDecorationLine: 'line-through',
  },

  deletar: {
    color: 'red',
    fontWeight: 'bold',
  },

  hora: {
    marginTop:2,
    marginRight:20,
    fontSize:12,
    color:'gray'
  }
});
