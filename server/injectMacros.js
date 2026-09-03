import fs from 'fs';
let code = fs.readFileSync('src/seeders/menu.seed.js', 'utf8');

if (!code.includes('macros:')) {
  code = code.replace(/status: "available",/g, () => {
      const cals = Math.floor(Math.random() * 400) + 200;
      const pro = Math.floor(Math.random() * 30) + 5;
      return `macros: { calories: ${cals}, protein: ${pro} },\n        status: "available",`;
  });
  fs.writeFileSync('src/seeders/menu.seed.js', code);
  console.log('Macros injected!');
} else {
  console.log('Macros already present.');
}
