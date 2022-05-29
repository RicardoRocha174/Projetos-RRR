from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth.models import User # importando o modelo para inclusão de usuário
from receitas.models import Receita         # importando o modelo para inclusão de receita
from django.contrib import auth,messages


def cadastro(request):
    """ Cadastra uma nova pessoa no sistema"""
    if request.method == 'POST':
        nome = request.POST['nome']
        email = request.POST['email']
        senha = request.POST['password']
        senha2 = request.POST['password2']
        if campo_vazio(nome):
            messages.error(request, 'O campo nome não pode estar vazio')
            return redirect('cadastro')

        if campo_vazio(nome):
            messages.error(request, 'O campo e-mail não pode estar vazio')
            return redirect('cadastro')

        if  senhas_nao_sao_iguais(senha,senha2):
            messages.error(request, 'As senhas não são iguais')
            return redirect('cadastro')

        if User.objects.filter(email = email).exists():
            messages.error(request, 'usuário já cadastrado')
            return redirect('cadastro')

        if User.objects.filter(username = nome).exists():
            messages.error(request, 'usuário já cadastrado')
            return redirect('cadastro')

        user = User.objects.create_user(username=nome,email=email,password=senha)
        user.save()
        messages.success(request, 'Usuário cadastrado com sucesso')
        return redirect('login')
    else:
        return render(request,template_name='usuarios/cadastro.html')

def login(request):
    """ Realiza o login de uma pessoa no sistema"""
    if request.method == 'POST':
        email = request.POST['email']
        senha = request.POST['senha']
        if campo_vazio(email) or campo_vazio(senha):
            messages.error(request, 'Os campos email e senha não podem ficar em branco')
            return redirect('login')
        if User.objects.filter(email=email).exists():
            name = User.objects.filter(email=email).values_list('username',flat=True).get()
            user = auth.authenticate(request, username=name, password=senha)
            if user is not None:
                auth.login(request, user)
                print("login realizado com sucesso ")
                return redirect('dashboard')
            else:
                print("Não foi possivel logar na conta do usuário ")
                ...
            print(name)
        return redirect('dashboard')
    return render(request,template_name='usuarios/login.html')

def logout(request):
    auth.logout(request)
    return redirect('index')

def dashboard(request):
    #verifica se de fato o usuário está logado, caso sim faz a rota para o link Dashboard
    if request.user.is_authenticated:
        id = request.user.id
        receitas = Receita.objects.order_by('-date_receita').filter(pessoa=id)
        dados = {
            'receitas': receitas
        }
        return render(request,'usuarios/dashboard.html',dados)

    else:
     return redirect('index')

def campo_vazio(campo):
    return not campo.strip()

def senhas_nao_sao_iguais(senha,senha2):
    return senha != senha2



