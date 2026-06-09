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

## 🗺️ Mapas

- **Listagem de focos:** mapa em formato circular (estilo "globo"), com a borda
  nas cores do app e **pins coloridos por nível de perigo**. Tocar em um pin abre
  os detalhes do foco. Focos cadastrados pelo usuário ganham um anel azul para se
  destacarem dos demais.
- **Registro de ocorrência:** mini-mapa circular que mostra a posição capturada
  pelo GPS antes de salvar.

No iPhone o mapa usa o **Apple Maps** (sem necessidade de chave); no Android usa o
Google Maps. Implementado em `src/components/FocosMap.js` e `LocalMiniMap.js`.

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

## 🔌 Rodando com o back-end OrbitGuard ativo

O back-end é o repositório [PietroVP0777/orbitguard](https://github.com/PietroVP0777/orbitguard)
(Java 21 + Spring Boot + PostgreSQL).

### 1. Subir a API

```bash
git clone https://github.com/PietroVP0777/orbitguard.git
cd orbitguard
```

Edite `src/main/resources/application.properties` com seu PostgreSQL e as chaves
das APIs externas (NASA FIRMS / OpenWeather), depois rode:

```bash
./mvnw spring-boot:run      # ou: mvn spring-boot:run
```

A API sobe em `http://localhost:8080` (Swagger em `http://localhost:8080/docs`).

### 2. Apontar o app para a API

Como você testa em um **iPhone físico**, `localhost` se refere ao próprio celular,
não ao PC. Use o **IP da sua máquina na rede**:

1. Descubra o IP do PC: `ipconfig` (Windows) → "Endereço IPv4", ex.: `192.168.15.193`.
2. Em `src/services/config.js`, ajuste:
   ```js
   export const API_BASE_URL = 'http://192.168.15.193:8080';
   ```
3. Garanta que iPhone e PC estão na **mesma rede Wi-Fi**.

### 3. Ver o seu foco junto aos do exemplo

A API OrbitGuard só **lê** focos (NASA FIRMS) — ela não tem endpoint para criar
focos novos. Por isso, as ocorrências que **você cadastra ficam salvas no aparelho**
(AsyncStorage) e o app as **mescla** com os focos vindos da API. Resultado: na
listagem e no mapa, o foco que você adicionou aparece **junto aos demais** (com um
anel azul para identificá-lo). Essa junção é feita em `src/services/focosService.js`.

---

## 🛠️ Tecnologias

- **React Native** + **Expo (SDK 54)**
- **React Navigation** (abas + pilha nativa)
- **expo-location** (GPS / geocodificação)
- **react-native-maps** (mapa com pins dos focos — globo na listagem e mini-mapa no registro)
- **@react-native-async-storage/async-storage** (persistência local)
- **@expo/vector-icons** (ícones)

---

## 🎥 Evidências de execução

Vídeo curto demonstrando o app funcionando (listagem de focos no mapa, detalhes,
registro de ocorrência com GPS e histórico):

- 📹 **Vídeo:** https://youtube.com/shorts/2WO0HgDpgHs

### Recurso mobile demonstrado no vídeo

O **GPS/localização** (`expo-location`): na tela de registro de ocorrência, o app
solicita a permissão de localização, captura as coordenadas reais do dispositivo,
exibe a posição em um mini-mapa e faz a geocodificação reversa para preencher
cidade e país automaticamente.

---

## 🔗 Projeto relacionado

- **Back-end (API):** https://github.com/PietroVP0777/orbitguard
- **Repositório deste app:** https://github.com/MikaelDv/orbit-guard

---

## 👥 Integrantes do Grupo

| Nome | RM |
|------|------|
| Pietro Vitor Pezzente | RM557283 |
| Eric Darakjian | RM557082 |
| Luciano Henrique Meriato Júnior | RM554546 |
| Kauã Soares Guimarães | RM559044 |
| Enzo Mikael Sanches | RM558887 |
