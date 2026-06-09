# 🔥 OrbitGuard Mobile — Global Solution

Aplicativo mobile (React Native + Expo) para **monitoramento de focos de incêndio**.
É o cliente mobile da plataforma [**OrbitGuard**](https://github.com/PietroVP0777/orbitguard),
uma API em Java + Spring Boot que cruza dados de satélite da **NASA FIRMS** com dados
climáticos da **OpenWeather** para detectar e classificar o risco de queimadas no mundo.

> **Tema da Global Solution:** monitoramento ambiental e prevenção de incêndios florestais.

---

## 🎯 Objetivo

Levar para o celular as informações de focos de incêndio expostas pela API OrbitGuard,
permitindo que o usuário **consulte focos**, **veja detalhes climáticos**, **registre novas
ocorrências** com a localização real do dispositivo (GPS) e **acompanhe seu histórico**.

---

## 🧭 Fluxo completo de uso

```
Início (panorama)
   │
   ├─► Consultar focos ──► Listagem (API OrbitGuard) ──► Detalhes do foco
   │
   └─► Registrar ocorrência ──► Captura GPS ──► Validação ──► Salvar (AsyncStorage)
                                                                   │
                                                                   ▼
                                                            Confirmação/Status
                                                                   │
                                                                   ▼
                                                          Histórico de ocorrências
```

1. **Informar uma ocorrência** → tela *Registrar* (com GPS).
2. **Consultar dados** → tela *Focos* (consome a API).
3. **Registrar uma ação** → salva localmente via AsyncStorage.
4. **Receber resposta do sistema** → tela de *Confirmação*.
5. **Visualizar histórico** → tela *Histórico*.

---

## 📱 Telas

| Tela | Arquivo | Função |
|------|---------|--------|
| Início | `src/screens/HomeScreen.js` | Panorama dos focos + atalhos do fluxo |
| Listagem | `src/screens/ListaFocosScreen.js` | Lista focos da API, com busca por país |
| Detalhes | `src/screens/DetalhesFocoScreen.js` | Dados completos de um foco |
| Cadastro/Registro | `src/screens/RegistrarOcorrenciaScreen.js` | Formulário + GPS + validação |
| Confirmação/Status | `src/screens/ConfirmacaoScreen.js` | Confirma o registro salvo |
| Histórico | `src/screens/HistoricoScreen.js` | Ocorrências salvas no dispositivo |

---

## 📲 Recurso mobile utilizado: **GPS / Localização**

O recurso nativo central é o **GPS**, via [`expo-location`](https://docs.expo.dev/versions/latest/sdk/location/).

Ao registrar uma ocorrência, o app:
1. Solicita permissão de localização (`requestForegroundPermissionsAsync`);
2. Captura as coordenadas reais do aparelho (`getCurrentPositionAsync`);
3. Faz **geocodificação reversa** (`reverseGeocodeAsync`) para sugerir cidade e país;
4. Trata o caso de **permissão negada** ou GPS indisponível com mensagem amigável.

Implementação isolada em `src/services/location.js`.

---

## 🗂️ Manipulação de dados

O app trabalha com **três fontes de dados**:

- **API externa (OrbitGuard)** — `GET /focos` e `GET /focos/{pais}` (`src/services/api.js`).
- **AsyncStorage** — persistência local das ocorrências registradas (`src/services/storage.js`).
- **JSON local (mock)** — `src/data/mockFocos.json`, usado como *fallback* quando a API
  está offline, garantindo que o app sempre funcione para demonstração.

---

## ✅ Tratamento de erros e validações

- **Campos obrigatórios** com mensagens de erro por campo (`src/utils/validation.js`).
- **Permissão de localização negada** → aviso e bloqueio do registro sem coordenadas.
- **Falha ao carregar dados** → *timeout* de requisição + *fallback* para dados simulados.
- **Registro não encontrado** → estado vazio tratado na tela de detalhes.
- **Limite de caracteres** na descrição e validação de coordenadas.

---

## 🏗️ Organização do projeto

```
orbitguard-mobile/
├── App.js                      # Ponto de entrada
├── app.json                    # Config Expo + permissões de localização
├── src/
│   ├── components/             # Componentes reutilizáveis (UI)
│   │   ├── Banner.js
│   │   ├── DangerBadge.js
│   │   ├── EmptyState.js
│   │   ├── FocoCard.js
│   │   ├── InputField.js
│   │   ├── Loading.js
│   │   └── PrimaryButton.js
│   ├── data/
│   │   └── mockFocos.json      # Dados simulados (fallback)
│   ├── navigation/             # Navegação (abas + pilha)
│   │   ├── RootNavigator.js
│   │   └── TabNavigator.js
│   ├── screens/                # Telas do app
│   ├── services/               # Regras de acesso a dados/recursos
│   │   ├── api.js              # Consumo da API OrbitGuard
│   │   ├── config.js           # URL base da API
│   │   ├── location.js         # GPS (recurso nativo)
│   │   └── storage.js          # AsyncStorage
│   ├── theme/                  # Cores, espaçamentos, tipografia
│   └── utils/                  # Formatação e validações
```

Há **separação clara entre telas, componentes e serviços**, com nomes descritivos
em português, alinhados ao domínio do projeto.

---

## ▶️ Como executar

### Pré-requisitos
- Node.js 18+
- Expo Go no celular **ou** um emulador Android/iOS
- (Opcional) API OrbitGuard rodando localmente

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o Expo
npx expo start

# 3. Abrir o app
#    - Escaneie o QR Code com o app Expo Go (Android/iOS), ou
#    - pressione "a" (Android) / "i" (iOS) para abrir no emulador
```

### Conectando à API OrbitGuard (opcional)

A URL base fica em `src/services/config.js`. Ajuste conforme o ambiente:

| Ambiente | URL |
|----------|-----|
| Emulador Android | `http://10.0.2.2:8080` (padrão) |
| Dispositivo físico | `http://SEU_IP_LOCAL:8080` |
| iOS Simulator / Web | `http://localhost:8080` |

> Sem a API no ar, o app exibe automaticamente **dados simulados** e sinaliza isso
> com um aviso na interface — então a demonstração funciona em qualquer cenário.

---

## 🛠️ Tecnologias

- **React Native** + **Expo (SDK 56)**
- **React Navigation** (abas + pilha nativa)
- **expo-location** (GPS / geocodificação)
- **@react-native-async-storage/async-storage** (persistência local)
- **@expo/vector-icons** (ícones)

---

## 🎥 Evidências de execução

> Adicione aqui o **vídeo curto** demonstrando o app funcionando (registro de ocorrência
> com GPS, listagem de focos e histórico) e/ou capturas de tela das telas principais.

- 📹 Vídeo: _(link aqui)_
- 🖼️ Screenshots: _(adicionar em `assets/` ou em uma pasta `docs/`)_

---

## 🔗 Projeto relacionado

- **Back-end (API):** https://github.com/PietroVP0777/orbitguard
- **Repositório deste app:** _(adicione o link do seu repositório git aqui)_
