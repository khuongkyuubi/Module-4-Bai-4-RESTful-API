import express from "express";
import bodyParser from 'body-parser';
import axios from 'axios';

const PORT = 3000;

const app = express();
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(bodyParser.json());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const limit = +req.query.limit || 10;
        let page = +req.query.page || 0;
        let maxCount = (await axios.get("https://pokeapi.co/api/v2/pokemon")).data.count;
        if (page < 0) {
            page = 0;
            res.redirect("/?page=1")
        } else if (page > Math.ceil(maxCount / limit)) {
            page = Math.ceil(maxCount / limit)
            res.redirect("/?page=" + page)

        }
        const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page}`;
        // call api from other server by axios
        // nghĩa là đứng từ phía server của mình, call api sang 1 server khác, rồi truyền data lấy được vaò view
        const response = await axios.get(url);
        console.log(response)
        const pokemonList = response.data.results;
        console.log(pokemonList);
        if (pokemonList) {
            res.render("pokemon", {pokemonList, page: +page})
        } else {
            res.end('<h1>Error<h1>')
        }
    } catch (err) {
        res.end('<h1>Error<h1>')
    }
})

app.listen(PORT, () => {
    console.log("App running with port: " + PORT)
})
