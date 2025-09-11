import {useState} from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import Filtrar from '../../App'
export default function Filtros (){
    const [Filtro, setFiltro]= useState('')
    return(
    <View style={styles.modal}>        
        <TextInput placeholder='DD/MM/AA' onChangeText={setFiltro} keyboardType='numeric' textContentType='birthdateDay'/>
        <TouchableOpacity onPress={Filtrar.Filtrar}><Text style={styles.voltar}>Voltar</Text></TouchableOpacity>
    </View>

    )

}

const styles = StyleSheet.create({
    modal:{
    alignItems:'center',
    alignContent:'center',
    alignContent:'center',
    height:'50%',
    width:'50%',
    backgroundColor:'blue'

  },

  voltar:{
    padding:5,
    backgroundColor:'lightblue',
    textAlign:'center',
    margin:30
}
})