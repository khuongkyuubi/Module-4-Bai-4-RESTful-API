import {AppDataSource} from "./src/data-source";
import {Blog} from "./src/entity/Blog";
import express from "express";
import bodyParser from 'body-parser';

const PORT = 3000;
// Blog app
AppDataSource.initialize().then(async connection => {
    const app = express();
    app.use(bodyParser.json());
    app.use(express.json());
    const BlogRepo = connection.getRepository(Blog);
    app.post("/blog/create", async (req, res) => {
        try {
            const blogSearch = await BlogRepo.findOneBy({tittle: req.body.tittle});
            if (blogSearch) {
                res.status(500).json({
                    mesage: "Blog đã tồn tại"
                })
            }
            const blogData = {
                tittle: req.body.tittle,
                content: req.body.content,
                author: req.body.author
            };
            const blog = await BlogRepo.save(blogData);
            if (blog) {
                res.status(200).json({
                    message: "Blog product success",
                    blog: blog
                });
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    });

    app.put("/blog/update", async (req, res) => {
        try {
            let blogSearch = await BlogRepo.findOneBy({id: req.body.id});
            if (!blogSearch) {
                res.status(500).json({
                    mesage: "Blog không tồn tại"
                })
            }
            const blog = await BlogRepo.update({id: req.body.id}, req.body);
            res.status(200).json({
                message: "Update blog success",
                blog: req.body
            });
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    });

    app.delete("/blog/delete", async (req, res) => {
        try {
            let blogSearch = await BlogRepo.findOneBy({id: req.body.id});
            if (!blogSearch) {
                res.status(500).json({
                    mesage: "Blog không tồn tại"
                })
            }
            const blog = await BlogRepo.delete({id: req.body.id});
            res.status(200).json({
                message: "Delete blog success",
                blogId: req.body.id
            });
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    });

    app.get("/blog/list", async (req, res) => {
        try {
            const blogs = await BlogRepo.find();
            if (blogs) {
                res.status(200).json({message: "Sucess", blogs: blogs})
            }
        } catch (err) {
            res.status(500).json({message: err.mesage})
        }
    });

    app.get("/blog/detail", async (req, res) => {
        try {
            let blogId = parseInt(req.query.blogId as string);
            const blog = await BlogRepo.findOneBy({id: blogId})
            if (blog) {
                res.status(200).json({message: "Sucess", blog})
            }
            res.status(400).json({message: "Blog not found", blog})
        } catch (err) {
            res.status(500).json({message: err.mesage})
        }
    });
    app.listen(PORT, () => {
        console.log("App running with port: " + PORT)
    })
});
