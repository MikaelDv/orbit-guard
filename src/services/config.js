// Configuração de ambiente do aplicativo.
//
// BASE_URL aponta para a API OrbitGuard (Java + Spring Boot).
// O back-end roda por padrão em http://localhost:8080 e expõe:
//   GET /focos          -> lista todos os focos de incêndio
//   GET /focos/{pais}   -> filtra focos por país
//
// IMPORTANTE (mobile): "localhost" no celular/emulador NÃO é a sua máquina.
//  - Emulador Android: use http://10.0.2.2:8080
//  - Dispositivo físico: use o IP da sua máquina na rede, ex: http://192.168.0.10:8080
//  - Web/iOS Simulator: http://localhost:8080 funciona.
//
// Caso a API esteja indisponível, o app usa dados simulados (mock) como
// fallback, garantindo que a experiência continue funcional para demonstração.

export const API_BASE_URL = 'http://10.0.2.2:8080';

// Tempo máximo (ms) de espera por uma resposta da API antes de assumir falha.
export const API_TIMEOUT = 6000;
