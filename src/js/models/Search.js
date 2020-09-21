import axios from "axios";
import { proxy } from "../config";
export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResult() {
    try {
      const res = await axios(
        `${proxy}http://recipesapi.herokuapp.com/api/search?q=${this.query}`
      );
      this.result = res.data.recipes;
    } catch (e) {
      console.error(e);
    }
  }
}
