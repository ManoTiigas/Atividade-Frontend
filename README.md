# taskflow-mobile

App mobile da aplicação TaskFlow. React Native + Expo + TypeScript.

## Stack

- Expo SDK 51
- React Native 0.74
- TypeScript
- React Navigation v6

## Como rodar

### 1. Configurar a URL da API

```bash
cp .env.example .env
```

Edite o `.env` com o endereço correto do backend:

```env
# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3333

# Dispositivo físico (substitua pelo seu IP local)
EXPO_PUBLIC_API_URL=http://192.168.x.x:3333

# iOS Simulator
EXPO_PUBLIC_API_URL=http://localhost:3333

# Produção
EXPO_PUBLIC_API_URL=https://sua-api.com
```

> O prefixo `EXPO_PUBLIC_` é obrigatório para que a variável seja exposta ao bundle do Expo.

### 2. Instalar e rodar

```bash
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** (disponível na App Store e Google Play).

## Estrutura

```
src/
├── screens/
│   ├── TaskListScreen.tsx   # listagem com filtros e stats
│   └── TaskFormScreen.tsx   # criação e edição
├── components/
│   ├── TaskCard.tsx
│   └── StatusBadge.tsx
├── hooks/
│   └── useTasks.ts          # data fetching encapsulado
├── services/
│   └── api.ts               # todas as chamadas HTTP
├── types/
│   └── Task.ts              # tipos e DTOs
└── theme/
    └── index.ts             # tokens de design
```
