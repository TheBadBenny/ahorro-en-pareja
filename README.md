# Ahorro en Pareja

Aplicacion web de seguimiento financiero personal para parejas, centrada en objetivos de ahorro mensuales y visualizacion del progreso.

## Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework principal |
| **TypeScript** | Tipado estricto en todo el proyecto |
| **Tailwind CSS 4** | Estilos utilitarios |
| **shadcn/ui** | Componentes UI (base-ui) |
| **Recharts** | Graficos: barras, area, dona, radial |
| **lucide-react** | Iconos |
| **Firebase Auth** | Login con Google + whitelist de emails |
| **Cloud Firestore** | Datos compartidos entre los dos, sincronizados |
| **PWA** | Instalable en movil, funciona offline |

## Como ejecutar

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto
2. Activa **Authentication** > Sign-in method > Google
3. Activa **Cloud Firestore** > Crear base de datos (modo produccion)
4. Copia las reglas de seguridad de `firestore.rules` al panel de Firestore > Rules (reemplaza los emails)
5. En Project Settings, copia la configuracion web

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Rellena `.env.local` con los valores de Firebase y los emails permitidos.

### 3. Ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Instalar como app (PWA)

En Chrome/Safari, abre la app y pulsa "Instalar" o "Anadir a pantalla de inicio".

## Funcionalidades

### Dashboard principal
- Tarjeta principal con ahorro del mes, porcentaje y estado (semaforo)
- Resumen por persona (A y B)
- Ahorro diario necesario para llegar al objetivo
- Banner de patrimonio total estimado

### Graficos
- Barra comparativa: ahorro actual vs objetivos (3.500 / 3.800 / 4.000)
- Grafico radial con porcentaje de progreso
- Dona de reparto patrimonial (boda, vivienda, colchon, indices, cripto)
- Evolucion mensual historica (area chart con linea de referencia del objetivo)

### Metricas automaticas
- Cuanto falta para cada nivel de objetivo
- Ahorro diario necesario segun dias restantes
- Semaforo visual: verde / amarillo / rojo
- Diferencia vs objetivo recomendado

### Formulario de entrada
- Campos para ahorro de cada persona, gastos extra, fondos y patrimonio
- Calculo automatico del total
- Validacion y persistencia en localStorage
- UX limpia con secciones separadas

### Historico mensual
- Lista de meses con estado, porcentaje y notas
- Grafico de evolucion
- Opcion de eliminar meses

### Diseno
- Dark mode / light mode con toggle
- Responsive (mobile-first)
- Estilo SaaS premium con buena jerarquia visual
- Colores con toque azul-violeta (no gris corporativo)

## Arquitectura

```
app/
  layout.tsx          # Layout raiz
  page.tsx            # Dashboard principal (client component)
  history/page.tsx    # Historico mensual

components/
  layout/header.tsx   # Header con nav y theme toggle
  dashboard/          # StatusCard, GoalsCard, ExtrasCard
  charts/             # GoalComparison, RadialProgress, Portfolio, History
  forms/entry-form.tsx
  ui/                 # shadcn/ui components

lib/
  calculations/       # Logica de negocio: analisis de objetivos, formateo
  providers/          # Abstraccion de data providers
  storage/            # Capa de persistencia (localStorage)
  hooks/              # useFinancialData, useTheme
  utils.ts            # cn() helper

types/
  index.ts            # Tipos del dominio: MonthlyFinancialEntry, SavingsGoals, etc.

data/
  seed.ts             # Datos de ejemplo realistas (Ene-Abr 2026)
```

### Decisiones de arquitectura

1. **Client-side only**: Sin backend ni auth por ahora. Todo vive en localStorage. Esto simplifica el despliegue y la experiencia de desarrollo.

2. **Capa de providers**: Existe una abstraccion `DataProvider` con interfaz definida en `types/index.ts`. Actualmente solo se usa `manualDataProvider`, pero hay stubs listos para Revolut y agregadores bancarios.

3. **Calculo separado de UI**: Toda la logica financiera esta en `lib/calculations/`. Los componentes solo reciben datos ya procesados.

4. **Persistencia desacoplada**: `lib/storage/` encapsula localStorage. Cuando se quiera migrar a una base de datos o API, solo hay que cambiar esta capa.

5. **Componentes granulares**: Cada card y grafico es un componente independiente con props tipadas. Facil de reordenar, quitar o anadir.

## Como anadir futuros providers bancarios

La interfaz `DataProvider` en `types/index.ts` define el contrato:

```typescript
interface DataProvider {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  fetchBalance?: () => Promise<number>;
  fetchTransactions?: () => Promise<Transaction[]>;
}
```

Para integrar Revolut u otro banco:

1. Crea un nuevo archivo en `lib/providers/` (ej: `revolut.ts`)
2. Implementa la interfaz `DataProvider` con las llamadas a la API
3. Registra el provider en `lib/providers/index.ts`
4. Actualiza la UI para permitir seleccionar el provider activo
5. Opcionalmente, combina datos manuales con datos automaticos

Los stubs en `lib/providers/index.ts` (`revolutProvider`, `bankAggregatorProvider`) marcan el camino.

## Objetivos de ahorro

| Nivel | Cantidad |
|---|---|
| Minimo | 3.500 EUR |
| Recomendado | 3.800 EUR |
| Comodo | 4.000 EUR |

Estos valores estan definidos en `types/index.ts` como `DEFAULT_GOALS` y se pueden ajustar facilmente.

## Licencia

Proyecto privado.
