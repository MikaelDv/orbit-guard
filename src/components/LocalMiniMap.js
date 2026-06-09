// Mini mapa circular (não interativo) que mostra a localização capturada.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { colors, radius } from '../theme';
import { darkMapStyle } from '../theme/mapStyle';

const ALTURA = 150;

export default function LocalMiniMap({ latitude, longitude }) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;

  const regiao = {
    latitude,
    longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.moldura}>
        <MapView
          style={styles.map}
          region={regiao}
          customMapStyle={darkMapStyle}
          userInterfaceStyle="dark"
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
          showsCompass={false}
          pointerEvents="none"
        >
          <Marker coordinate={{ latitude, longitude }} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.pin} />
          </Marker>
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 12 },
  moldura: {
    width: '100%',
    height: ALTURA,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: colors.surface,
  },
  map: { width: '100%', height: '100%' },
  pin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
  },
});
