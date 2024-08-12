import cloudinary  from 'cloudinary';
import { Request, Response } from "express";
import Restuarant from "../models/Restuarant";
import mongoose from 'mongoose';

 const getMyRestuarant  = async (req: Request, res: Response) => {
    try {
        const restuarant = await Restuarant.findOne({ user: req.userId });

        if (!restuarant) {
            return res
            .status(404)
            .json({ message: "No restuarant exists with that name"})
        } 
        res.json(restuarant); 
    } catch (error) {
        console.log("error",error)
        res.status(500).json({ message: "Something went wrong"});  
    }
 }  
const createMyRestuarant = async (req: Request, res: Response) => {
    try {
        const existingRestuarant = await Restuarant.findOne({user: req.userId});

        if (existingRestuarant) {
            return res
            .status(409)
            .json({ message: "User restuarant already exists"})
        }
        const imageUrl = await uploadImage(req.file as Express.Multer.File)

        const restuarant = new Restuarant(req.body);
        restuarant.imageUrl = imageUrl;
        restuarant.user = new mongoose.Types.ObjectId(req.userId);
        restuarant.lastUpdated = new Date();
        await restuarant.save();

        res.status(201).send(restuarant)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong"});
    }
} 
const updateMyRestuarant = async (req: Request, res: Response) => {
    try {
        const restuarant = await Restuarant.findOne({user: req.userId});

        if (!restuarant) {
            return res
            .status(404)
            .json({ message: "No restuarant found"})
        }

        restuarant.restuarantName = req.body.restuarantName;
        restuarant.city = req.body.city;
        restuarant.country = req.body.country;
        restuarant.deliveryPrice = req.body.deliveryPrice;
        restuarant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restuarant.cuisines = req.body.cuisines;
        restuarant.menuItems = req.body.menuItems;
        restuarant.lastUpdated = new Date();
        
        if (req.file) {
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            restuarant.imageUrl = imageUrl; 
        }
        await restuarant.save();
        res.status(200).send(restuarant);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong"});
    }
} 
const uploadImage = async (file: Express.Multer.File) => {
    const image = file 
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
        return uploadResponse.url;
}

export default {
    getMyRestuarant,
    createMyRestuarant,
    updateMyRestuarant,
}