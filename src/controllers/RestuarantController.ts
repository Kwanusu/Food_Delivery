import {Request, Response } from "express";
import Restuarant from "../models/Restuarant";


const searchRestaurant = async ( req: Request, res: Response) => {

    try {
        const city = req.params.city;

        const searchQuery = (req.query.searchQuery as string) || "";
        const selectedCuisines = (req.query.selectedCuisines as string) || "";
        const sortOption = (req.query.sortOption as string) || "";
        const page = parseInt(req.query.page as string) || 1;
        let query: any = {};

        query["city"] = new RegExp(city, "i");
        const cityCheck = await Restuarant.countDocuments(query);
        if (cityCheck === 0) {
            return res.status(404).json({
                data: [],
            pagination: {
                total: 0,
                page: 1,
                pages: 1,
            },
        });
        }

        if (selectedCuisines) {
            const cuisinesArray = selectedCuisines
            .split(",")
            .map((cuisine) => new RegExp(cuisine, "i"));
            query["cuisines"] = { $all: cuisinesArray};
        }

        if (searchQuery) {
            const searchRegex = RegExp(searchQuery, "i");
            query["$or"] = [
                { restuarantName: searchRegex },
                { cuisines: { $in: [searchRegex] }},
            ];
        }
        
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const restuarants = await Restuarant
            .find(query)
            .sort({ [sortOption]: 1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        const total = await Restuarant.countDocuments(query);
        
        const response = {
            data: restuarants,
            pagination: {
              total,
              page,
              pages: Math.ceil(total / pageSize), 
            },
        };
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong"})
        
    }
}

export default {
    searchRestaurant,
}