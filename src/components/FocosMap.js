// Mapa em formato circular (estilo "globo") com pins dos focos de incêndio.
// Cada pin é colorido pelo nível de perigo; focos cadastrados pelo usuário
// recebem um anel branco para se destacarem dos demais.
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { colors, corDoPerigo } from '../theme';
import { darkMapStyle } from '../theme/mapStyle';

const LARGURA = Dimensions.get('window').width - 32;
const TAMANHO = Math.min(LARGURA, 340); // mantém o mapa quadrado p/ virar círculo

// Região inicial ampla, dando a sensação de "globo".
const REGIAO_MUNDO = {
  latitude: -5,
  longitude: -30,
  latitudeDelta: 120,
  longitudeDelta: 120,
};

export default function FocosMap({ focos = [], onSelecionar }) {
  const mapRef = useRef(null);
  const [rastrear, setRastrear] = useState(true);

  const coords = focos.filter(
    (f) => typeof f.latitude === 'number' && typeof f.longitude === 'number'
  );

  // Enquadra automaticamente todos os focos quando a lista muda.
  useEffect(() => {
    if (!mapRef.current || coords.length === 0) return;
    if (coords.length === 1) {
      mapRef.current.animateToRegion(
        {
          latitude: coords[0].latitude,
          longitude: coords[0].longitude,
          latitudeDelta: 40,
          longitudeDelta: 40,
        },
        600
      );
    } else {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: true,
      });
    }
    // Desativa o rastreamento dos markers após renderizar (melhora desempenho).
    const t = setTimeout(() => setRastrear(false), 1500);
    return () => clearTimeout(t);
  }, [focos.length]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.anel}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={REGIAO_MUNDO}
          customMapStyle={darkMapStyle}
          userInterfaceStyle="dark"
          showsCompass={false}
          showsPointsOfInterest={false}
          toolbarEnabled={false}
        >
          {coords.map((foco) => {
            const cor = corDoPerigo(foco.nivelPerigo);
            const local = foco.origemRegistro === 'local';
            return (
              <Marker
                key={String(foco.id)}
                coordinate={{ latitude: foco.latitude, longitude: foco.longitude }}
                onPress={() => onSelecionar && onSelecionar(foco)}
                tracksViewChanges={rastrear}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.pinWrap}>
                  <View
                    style={[
                      styles.pin,
                      { backgroundColor: cor },
                      local && styles.pinLocal,
                    ]}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginVertical: 8 },
  anel: {
    width: TAMANHO,
    height: TAMANHO,
    borderRadius: TAMANHO / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
      },
      android: { elevation: 8 },
    }),
  },
  map: { width: '100%', height: '100%' },
  pinWrap: { alignItems: 'center', justifyContent: 'center', padding: 4 },
  pin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.white,
  },
  pinLocal: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: colors.accent,
  },
});
