import axios from "axios";
import { proxy } from "../config";
export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}http://recipesapi.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (e) {
      console.error(e);
      alert("something went wrong");
    }
  }
  calcTime() {
    const numIngredients = this.ingredients.length;
    const periods = Math.ceil(numIngredients / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "cup",
      "pounds",
      "pound",
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "oz",
      "ozs",
      "tsp",
      "tsp",
      "cup",
      "cup",
      "lbs",
      "lb",
    ];
    const units = [...unitShort, "kg", "g"];
    const newIngredients = this.ingredients.map((ele) => {
      let ingredient = ele.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });

      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el) => units.includes(el));

      let objIng;
      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    this.ingredients.forEach((ing) => {
      ing.count = ing.count * (newServings / this.servings);
    });

    this.servings = newServings;
  }
}
