const fs = require("fs");

const env = process.argv[2];

const homepageUrls = {
  bpmco: "https://icasa.bpmco.co",
  icasa_calidad: "https://sqadccorpwapp1:4430",
  development: "/",
};

if (!homepageUrls[env]) {
  console.error(`Entorno "${env}" no válido. Usa "icasa_calidad" o "bpmco".`);
  process.exit(1); // Termina el script si el entorno no es válido
}

// Lee el archivo package.json
const packageJson = JSON.parse(fs.readFileSync("package.json"));

// Cambia el valor de "homepage" en package.json
packageJson.homepage = homepageUrls[env];

// Sobrescribe package.json con el nuevo valor de homepage
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

console.log(`El "homepage" ha sido actualizado a: ${homepageUrls[env]}`);
