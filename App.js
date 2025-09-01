import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Switch, TouchableOpacity } from 'react-native';

export default function App() {
  const [Lista, setLista] = useState([{ texto: 'dormir', feito: false }]);
  const [Input, setInput] = useState('');

  function armazenar() {
    if (Input.trim() === '') {
      alert('Digite algo');
    } else {
      const novaTarefa = { texto: Input, feito: false };
      setLista([...Lista, novaTarefa]);
      setInput('');
    }
  }
//indexParameter == index atual do item selecionado
  function Deletar(indexParameter) {
    const ListaFiltrada = Lista.filter((_, index) => index !== indexParameter);
    setLista(ListaFiltrada);
  }
//index == refere-se ao index do item que deve ser selecionado
  function Butao(index) {
    const novaLista = [...Lista];
    novaLista[index].feito = !novaLista[index].feito;
    setLista(novaLista);
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
    fontSize: 16,
    flex: 1,
    marginHorizontal: 10,
  },

  feito: {
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
});
