
const openModal = () => document.getElementById('modal')
    .classList.add('active')
    $('#celular').mask('(00) 00000-0000');

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getAddress = () => {
    var cep =  $('#cep').val()
    const url = "https://viacep.com.br/ws/"+cep+"/json/";
    
    fetch(url).then(response =>{
    return response.json();
        })
    .then(data =>{
          fillfields(data);
    })
    .catch(e => console.log("Cep não encontrado!"))

}

function fillfields(data){
    
    $('#rua').val(data.logradouro) 
    $('#bairro').val(data.bairro) 
    $('#cidade').val(data.localidade) 
    $('#estado').val(data.uf) 
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
    return document.getElementById('form').reportValidity()
}


const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveClient = () => {
    debugger
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cep: document.getElementById('cep').value,
            rua: document.getElementById('rua').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cep}</td>
        <td>${client.rua}</td>
        <td>${client.bairro}</td>
        <td>${client.cidade}</td>
        <td>${client.estado}</td>
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
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cep').value = client.cep
    document.getElementById('rua').value = client.rua
    document.getElementById('bairro').value = client.bairro
    document.getElementById('cidade').value = client.cidade
    document.getElementById('estado').value = client.estado
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
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