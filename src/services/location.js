// Serviço de localização (RECURSO MOBILE NATIVO: GPS).
//
// Usa o expo-location para solicitar permissão, capturar as coordenadas do
// dispositivo e fazer a geocodificação reversa (coordenadas -> cidade/país).
// É o recurso nativo central do app: ao registrar uma ocorrência, o usuário
// captura automaticamente sua posição real.

import * as Location from 'expo-location';

/**
 * Solicita permissão e retorna a localização atual do dispositivo.
 * Em caso de permissão negada ou erro, retorna um objeto com `erro`
 * para que a tela trate a situação sem quebrar.
 *
 * @returns {Promise<{ok: boolean, erro?: string, coords?: object, endereco?: object}>}
 */
export async function obterLocalizacaoAtual() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return {
        ok: false,
        erro: 'Permissão de localização negada. Habilite o GPS nas configurações para registrar com a posição real.',
      };
    }

    const posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const coords = {
      latitude: posicao.coords.latitude,
      longitude: posicao.coords.longitude,
    };

    // Geocodificação reversa: tenta descobrir cidade e país.
    let endereco = { localidade: '', pais: '' };
    try {
      const lugares = await Location.reverseGeocodeAsync(coords);
      if (lugares && lugares.length > 0) {
        const l = lugares[0];
        endereco = {
          localidade: l.city || l.subregion || l.region || '',
          pais: l.country || '',
        };
      }
    } catch (_) {
      // Geocodificação é opcional — seguimos só com as coordenadas.
    }

    return { ok: true, coords, endereco };
  } catch (e) {
    return {
      ok: false,
      erro: 'Não foi possível obter a localização. Verifique se o GPS está ativado.',
    };
  }
}
