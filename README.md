# taskflow-mobile

App mobile da aplicação TaskFlow. React Native + Expo + TypeScript.

## Sobre

O front-end do TaskFlow é um aplicativo mobile desenvolvido em **React Native** com **Expo**, utilizando **TypeScript**. O app consome a API REST do TaskFlow para gerenciar as tarefas do usuário, com uma interface no estilo dark mode.

## Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- React Navigation v6 (native-stack)

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
EXPO_PUBLIC_API_URL=https://atividade-backend.vercel.app
```

> O prefixo `EXPO_PUBLIC_` é obrigatório para que a variável seja exposta ao bundle do Expo.

### 2. Instalar e rodar

```bash
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** (disponível na App Store e Google Play). Caso a rede Wi-Fi do celular e do computador não consigam se enxergar diretamente, use o modo túnel:

```bash
npx expo start --tunnel
```

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

## Funcionalidades

- Listagem de tarefas, com indicação visual de prioridade (baixa, média, alta) e status (pendente, em progresso, concluída)
- Criação e edição de tarefas através de formulário
- Exclusão de tarefas
- Comunicação com o backend hospedado no Vercel
