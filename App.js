import { useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Switch, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [Lista, setLista] = useState([]);
  const [Input, setInput] = useState('');
  const [FiltroTipo, setFiltroTipo] = useState('');
  const [FiltroData, setFiltroData] = useState('');
  const [SubirModal, setSubirModal] = useState(false);
//new set >remove duplicatas 
  const datasUnicas = [...new Set(Lista.map(item => item.data.split(' - ')[0]))];

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
    // ! => negação
    novaLista[index].feito = !novaLista[index].feito;
    setLista(novaLista);
    AsyncStorage.setItem('tarefas', JSON.stringify(novaLista));
  }

  function Filtrar(){
    const Upmodal = !SubirModal
    setSubirModal(Upmodal)
    
  }
  const listaFiltrada = Lista.filter(item => {
  if (FiltroTipo === 'pendentes') return !item.feito;
  if (FiltroTipo === 'concluido') return item.feito;
  if (FiltroTipo === 'data' && FiltroData) return item.data.startsWith(FiltroData);
  return true;
});


  return (
    <View style={styles.container}>
      <StatusBar style='inverted' />
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>TO DO LIST</Text>
        <TextInput
          placeholder="Digite sua tarefa"
          value={Input}
          onChangeText={(texto) => setInput(texto)}
          style={styles.input}
        />
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <TouchableOpacity style={styles.buton} onPress={armazenar}>
            <Text style={styles.textButao}>Adicionar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={Filtrar} style={{ backgroundColor: 'lightblue', borderRadius: 15}}>
            <Text style={styles.textButao}>Filtrar</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={SubirModal} animationType='fade' transparent={true}>
          <View style={styles.modal}>

            <Picker
            selectedValue={FiltroTipo}
            onValueChange={(itemValue) => {
            setFiltroTipo(itemValue);
            setFiltroData('');
            }}>
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Data" value="data" />
              <Picker.Item label="Pendentes" value="pendentes" />
              <Picker.Item label="Concluídas" value="concluido" />
            </Picker>
            {FiltroTipo === 'data' && (
              <>
              <Text style={styles.modalTitle}>Escolha a data:</Text>

              <Picker
              selectedValue={FiltroData}
              onValueChange={(itemValue) => setFiltroData(itemValue)}>
                <Picker.Item label="Selecione a data" value="" />
                  {datasUnicas.map((data, index) => (
                <Picker.Item key={index} label={data} value={data} />
                ))}
              </Picker>
              </>
              )}
     
            <TouchableOpacity onPress={Filtrar} style={styles.buttonBack}><Text style={styles.voltar}>Voltar</Text></TouchableOpacity>
          </View>
        </Modal>

      </View>

      <FlatList
        style={styles.Lista}
        data={listaFiltrada}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Switch value={item.feito} onValueChange={() => Butao(index)} />

            <View style={{flex:1}}>
              <Text style={item.feito ? styles.feito : styles.texto}>{item.texto}</Text>
              <Text style={styles.hora}>{item.data}</Text>
            </View>

            

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
    width:'80%',

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
    fontSize: 16,
    flex: 1,
    marginHorizontal: 10,
    fontWeight:'500'
  },

  feito: {
    fontWeight:'500',
    fontSize: 16,
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
    marginLeft:10,
    fontSize:12,
    color:'gray'
  },

  modal: {
    top: '50%',
    left: '50%',
    width: 250,
    height: 300,
    //mover o elemento no eixo horizontal e vertical
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    backgroundColor: 'white',
    opacity:0.93,
    borderRadius: 20,
    elevation:10,
    padding: 20,
  },

  voltar:{
    padding:5,
    backgroundColor:'lightblue',
    textAlign:'center',
    margin:30

  },

  buttonBack:{
    marginTop:100,
  },

  

});
