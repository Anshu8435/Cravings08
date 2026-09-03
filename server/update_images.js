import fs from "fs";
let code = fs.readFileSync("src/seeders/menu.seed.js", "utf8");

// Replace Tandoori Chicken image
code = code.replace(
  /itemName: "Tandoori Chicken \(Half\)",[\s\S]*?image: \{[\s\S]*?url: "https:\/\/images.unsplash.com\/photo-1599487405270-8e1215bc0f70\?auto=format&fit=crop&q=80&w=400"/g,
  'itemName: "Tandoori Chicken (Half)",\n      description: "Chicken marinated in yogurt and spices, roasted in a tandoor.",\n      price: 280,\n      category: "Main Course",\n      type: "Non-Vegetarian",\n      image: {\n        url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=400"',
);

// Replace Chole Bhature image
code = code.replace(
  /itemName: "Chole Bhature",[\s\S]*?image: \{[\s\S]*?url: "https:\/\/images.unsplash.com\/photo-1585937421606-afa9a38ca0b1\?auto=format&fit=crop&q=80&w=400"/g,
  'itemName: "Chole Bhature",\n      description: "Spicy chickpea curry served with two fluffy bhaturas.",\n      price: 150,\n      category: "Main Course",\n      type: "Vegetarian",\n      image: {\n        url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400"',
);

// Replace Masala Dosa image
code = code.replace(
  /itemName: "Masala Dosa",[\s\S]*?image: \{[\s\S]*?url: "https:\/\/images.unsplash.com\/photo-1589301760014-d929f39ce9b1\?auto=format&fit=crop&q=80&w=400"/g,
  'itemName: "Masala Dosa",\n      description: "Crispy rice crepe filled with spiced potato mash, served with sambar and chutney.",\n      price: 130,\n      category: "Main Course",\n      type: "Vegetarian",\n      image: {\n        url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=400"',
);

fs.writeFileSync("src/seeders/menu.seed.js", code);
console.log("menu.seed.js updated.");
