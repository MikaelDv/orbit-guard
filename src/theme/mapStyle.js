// Estilo de mapa escuro, alinhado às cores do app (fundo azul-marinho).
// Usado no Android (Google Maps) via prop `customMapStyle`.
// No iOS o mapa é o Apple Maps — aplicamos o modo escuro via `userInterfaceStyle`.

export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0B1120' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B1120' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9AA7BD' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#2A3A5C' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#4DA8DA' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#16213A' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#101a2e' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1F2D4D' }],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
];
