import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from '../src/config/db.js';
import Silo from '../src/models/Silo.js';
import Reading from '../src/models/Reading.js';
import Alert from '../src/models/Alert.js';

function rand(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

async function ensureSilos() {
  const count = await Silo.countDocuments();
  if (count > 0) return;
  await Silo.insertMany([
    { name: 'Silo 1', location: 'Lote A', capacityTons: 2000 },
    { name: 'Silo 2', location: 'Lote B', capacityTons: 2000 },
    { name: 'Silo 3', location: 'Lote C', capacityTons: 2000 },
  ]);
  console.log('Silos criados');
}

async function evaluateAlerts(silo, r) {
  const t = silo.thresholds || {};
  const alerts = [];
  if (r.temperature > (t.tempMax ?? 35)) alerts.push({ type: 'TEMPERATURE', threshold: t.tempMax ?? 35, value: r.temperature, message: `Temperatura alta: ${r.temperature}°C` });
  if (r.humidity > (t.humMax ?? 70)) alerts.push({ type: 'HUMIDITY', threshold: t.humMax ?? 70, value: r.humidity, message: `Umidade alta: ${r.humidity}%` });
  if (r.co2 > (t.co2Max ?? 2000)) alerts.push({ type: 'CO2', threshold: t.co2Max ?? 2000, value: r.co2, message: `CO₂ elevado: ${r.co2} ppm` });
  if (alerts.length) {
    await Alert.insertMany(alerts.map(a => ({ ...a, siloId: silo._id })));
    console.log('Alertas gerados:', alerts.map(a=>a.type).join(', '));
  }
}

async function loop() {
  await connectDB();
  await ensureSilos();
  console.log('Iniciando simulação. Pressione Ctrl+C para parar.');
  setInterval(async () => {
    const silos = await Silo.find();
    for (const silo of silos) {
      const reading = {
        siloId: silo._id,
        temperature: rand(20, 45),
        humidity: rand(40, 90),
        co2: Math.round(rand(800, 3000)),
        level: rand(20, 95)
      };
      await Reading.create(reading);
      await evaluateAlerts(silo, reading);
      process.stdout.write('.');
    }
  }, 3000);
}

loop().catch(e => { console.error(e); process.exit(1); });
