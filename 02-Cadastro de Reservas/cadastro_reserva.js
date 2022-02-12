
const openModal = () => document.getElementById('modal')
    .classList.add('active')
    $('#celular').mask('(00) 00000-0000');

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}



const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}

const isValidFields = () => {
var verifica   = false
var diaSemana  =  getDiaSemana(document.getElementById('diaSemana').value)
var horario  =    document.getElementById('hora').value
var arraySeman1 = ["Segunda","Terça","Quarta","Quinta","Sexta"]
var arraySeman2 = ["Sabado","Domingo"]
   

	/*if ((arraySeman1.indexOf(diaSemana) != -1 )&& (horario > 7 && horario <= 23 )){
		verifica   = true
	}
	if ((arraySeman2.indexOf(diaSemana) != -1) && (horario > 7 && horario <= 15)){
	    verifica   = true
	}*/
    if ((verificaArray(arraySeman1,diaSemana) )&& (horario > 7 && horario <= 23 )){
		verifica   = true
	}
	if ((verificaArray(arraySeman2,diaSemana) ) && (horario > 7 && horario <= 15)){
	    verifica   = true
	}
     	
	
    return verifica
}

function verificaArray (array,diaSemana){
   
    var existe = false;

    for( var posicao = 0; posicao < array.length; posicao++) {

        if( array[posicao] == diaSemana) {

            existe = true;
        }
    }

 return existe
}

function getDiaSemana(date){
	date = new Date(date).getDay()
	
	if (date==6){
		diaSemana = "Domingo"
	}else if (date==0){
		diaSemana = "Segunda"
	}else if (date==1){
		diaSemana = "Terça"
	}else if (date==2){
		diaSemana = "Quarta"
	}else if (date==3){
		diaSemana = "Quinta"
	}else if (date==4){
		diaSemana = "Sexta"
	}else if (date==5){
		diaSemana = "Sabado"
	}
	
	
	return diaSemana
}
	

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('diaSemana').dataset.index = 'new'
}

const saveClient = () => {
    debugger
    if (isValidFields()) {
        const client = {
            diaSemana: formatDate(document.getElementById('diaSemana').value),
            hora: document.getElementById('hora').value,
            empresa: document.getElementById('empresa').value,
            
        }
        const index = document.getElementById('diaSemana').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }else{
		
		alert("O restaurante não está disponivel para reserva")
	}	
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.diaSemana}</td>
        <td>${client.hora}</td>
        <td>${client.empresa}</td>
       
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('diaSemana').value = client.diaSemana
    document.getElementById('hora').value = client.hora
    document.getElementById('empresa').value = client.empresa

}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

function formatDate(xValor){
	
		var data = xValor.split("-")
	    var dia  = data[2]
	    var mes  = data[1]
	    var ano  = data[0]

	    return xValor = dia + "/" + mes + "/" + ano;
	

	
	return dataFormatada
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.diaSemana}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Events
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)