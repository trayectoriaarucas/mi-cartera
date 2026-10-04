# Mi Cartera — PWA Móvil Personal de Contabilidad y Gastos

**Mi Cartera** es una Progressive Web App (PWA) moderna, rápida y 100% privada diseñada para el control diario de gastos personales, gastos fijos y metas de ahorro desde el móvil, sin intermediarios ni servidores externos (sin Firebase, 100% offline con almacenamiento en tu propio dispositivo).

---

## 🚀 Características Principales

1. **📱 PWA Móvil Instalable y Offline**:
   - Funciona sin conexión a internet mediante Service Worker y Web App Manifest.
   - Instalable en la pantalla de inicio de iPhone (Safari) y Android (Chrome) como si fuera una app nativa, a pantalla completa sin barra de navegación.

2. **🚦 Medidor Visual de "Gastos Hormiga" (Tope mensual de 200 €)**:
   - Medidor semáforo en tiempo real para controlar caprichos y gastos diarios (cafés, gasolina, salidas, extras, recargas, etc.):
     - 🟢 **Verde** (< 65% gastado): Gasto bajo control y buen ritmo.
     - 🟡 **Amarillo** (65% - 85%): Advertencia y precaución.
     - 🟠 **Naranja/Rojo** (> 85%): Límite próximo.
     - 🚨 **Rojo Alerta** (>= 200 €): **Tope superado** con indicador de importe rebasado.
   - Cálculo automático del **ritmo diario recomendado** (€/día) según los días restantes del mes actual.
   - Desglose instantáneo de las principales categorías hormiga consumidas.

3. **⚡ Botón Flotante Rápido: Apuntar en 3 Toques**:
   - Botón central `(+)` siempre accesible con el pulgar.
   - **Toque 1:** Pulsar el botón `+`.
   - **Toque 2:** Tocar la categoría deseada (Café, Gasolina, Salida, etc.) con presets directos o teclado numérico touch rápido.
   - **Toque 3:** Guardar apunte.

4. **📌 Separación Clara entre Gastos Fijos y Gastos del Día a Día**:
   - **Gastos Fijos Mensuales:** Alquiler, internet, luz, seguros, suscripciones recurrentes.
   - Control de cobro del mes activo: marca con un solo toque los recibos ya pagados y revisa cuánto queda pendiente de desembolsar.
   - **Gastos del Día a Día:** Timeline organizado con filtros por categoría y buscador rápido.

5. **🎯 Módulo de Seguimiento de Ahorro y Metas (Huchas)**:
   - Tarjetas interactivas con barras de progreso y porcentaje.
   - Aportaciones rápidas (+10€, +25€, +50€) o retiros si surge un imprevisto.
   - Lluvia de confeti de celebración al completar una meta al 100%.

6. **🔒 Privacidad y Copias de Seguridad**:
   - Almacenamiento local ultrarrápido (`localStorage`).
   - Botón de **Exportar Copia de Seguridad JSON** para guardar todos tus datos en un archivo.
   - Botón de **Restaurar Copia JSON** para mover tus datos entre dispositivos.
   - Exportación a **Excel / CSV** para tus hojas de cálculo.

---

## 🛠️ Cómo Iniciar la Aplicación

### Opción 1: Con el lanzador rápido (Windows)
Haz doble clic sobre el archivo:
```
INICIAR_MI_CARTERA.bat
```

### Opción 2: Desde la terminal
```bash
cd C:\Users\crist\.gemini\antigravity\scratch\MiCartera_app
npm run dev
```

La app se abrirá en `http://localhost:5173`.

---

## 📲 Cómo Abrirla e Instalarla en tu Móvil

1. Conecta tu teléfono móvil a la **misma red Wi-Fi** que tu ordenador.
2. Al ejecutar `npm run dev`, Vite mostrará la dirección **Network**:
   ```
   ➜  Network:  http://192.168.X.X:5173/
   ```
3. Abre esa dirección en el navegador de tu móvil:
   - **En iPhone (Safari):** Pulsa el botón de Compartir `⎋` y selecciona **"Añadir a pantalla de inicio" `⊞`**.
   - **En Android (Chrome):** Pulsa los 3 puntos `⋮` y elige **"Instalar aplicación"**.
4. ¡Listo! Ya tendrás el icono de **Mi Cartera** en tu teléfono funcionando de manera nativa.
