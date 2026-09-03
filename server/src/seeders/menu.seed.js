import Menu from "../models/menu.model.js";
import Restaurant from "../models/restaurant.model.js";

import { manoharDairyMenu } from "./restaurantMenus/manoharDairy.js";
import { sagarGaireMenu } from "./restaurantMenus/sagarGaire.js";
import { zamZamMenu } from "./restaurantMenus/zamZam.js";
import { sharmaVishnuMenu } from "./restaurantMenus/sharmaVishnu.js";
import { bakeNShakeMenu } from "./restaurantMenus/bakeNShake.js";

const getMenuItemsForRestaurant = (restaurantName) => {
  if (restaurantName.includes("Manohar Dairy")) {
    return manoharDairyMenu;
  } else if (restaurantName.includes("Sagar Gaire")) {
    return sagarGaireMenu;
  } else if (restaurantName.includes("Zam Zam")) {
    return zamZamMenu;
  } else if (restaurantName.includes("Sharma & Vishnu")) {
    return sharmaVishnuMenu;
  } else if (restaurantName.includes("Bake N Shake")) {
    return bakeNShakeMenu;
  }
  return [];
};

const menuSeed = async () => {
  try {
    console.log("Found 5 menus to populate...");
    const menus = await Menu.find().populate("restaurantId");
    
    for (const menu of menus) {
      if (menu.restaurantId && menu.restaurantId.restaurantName) {
        const restaurantName = menu.restaurantId.restaurantName;
        const newItems = getMenuItemsForRestaurant(restaurantName);
        
        menu.menuItems = newItems;
        await menu.save();
        console.log(`Added ${newItems.length} items for restaurant: ${restaurantName}`);
      }
    }
    console.log("Realistic Menu seeding complete!");
  } catch (error) {
    console.error("Error seeding menu:", error);
  }
};

export default menuSeed;
