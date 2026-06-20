# Erros encontrados (com base no código atual)

> Observação: este arquivo lista erros/causas prováveis a partir dos imports e padrões encontrados no código. Para confirmar 100%, rode `npm start` / build e verifique o log do compilador/Metro/TypeScript.

## 1) Falta do módulo `../theme` (ou exports incompletos)
**Arquivos:**
- `src/screens/TaskFormScreen.tsx`
- `src/screens/TaskListScreen.tsx`

**Motivo no código:** ambos importam:
```ts
import { ... } from '../theme';
```

Se a pasta `src/theme` não existir, ou se `src/theme/index.ts` não exportar as variáveis usadas (ex.: `colors`, `spacing`, `radius`, `fontSize`, `fontWeight`, `priorityColor`, `statusColor`, `priorityLabel`, `statusLabel`, etc.), o TypeScript/Metro vai acusar erro como:
- `Cannot find module '../theme' or its corresponding type declarations`
- `Module '../theme' has no exported member ...`

## 2) Uso de `process.env.EXPO_PUBLIC_API_URL` (pode quebrar em runtime)
**Arquivo:**
- `src/services/api.ts`

**Motivo no código:**
```ts
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL) throw new Error('EXPO_PUBLIC_API_URL ...');
```

Se:
- o `.env` não existir/for ignorado,
- a variável não estiver definida com o prefixo `EXPO_PUBLIC_`,
- ou o Expo não estiver carregando o env,

então o app vai falhar em runtime com erro do tipo:
- `EXPO_PUBLIC_API_URL não definida...`

## 3) Possível erro/alerta de tipagem no `catch (err: any)` (depende do config)
**Arquivos:**
- `src/screens/TaskFormScreen.tsx`
- `src/hooks/useTasks.ts`

**Motivo no código:** uso de `err: any` e acesso `err.message`.

Dependendo de regras de tipagem/lint do projeto (TS strict + ESLint), pode aparecer warning/erro.

## 4) Type assert em `request<void>` quando `res.status === 204` (depende do config)
**Arquivo:**
- `src/services/api.ts`

**Motivo no código:**
```ts
if (res.status === 204) return undefined as unknown as T;
```

Geralmente funciona, mas com regras mais rígidas pode gerar erro de tipagem.

---

## Próximo passo para listar os ERROS reais (mensagens exatas)
Para transformar essas suspeitas em lista exata, rode e cole o output:
1. `npm start`
2. ou `npx tsc --noEmit`
3. ou `npm run lint` (se existir)

Aí eu ajusto `erros.md` com as mensagens reais do compilador/Metro.
