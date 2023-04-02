import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
// import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);
  try {
    const savedRoom = await newRoom.save();

    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (error) {
      next(error);
    }
    if (savedRoom) {
      res.status(200).json(savedRoom);
    }
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (updatedRoom) {
      res.status(200).json(updatedRoom);
    }
  } catch (error) {
    next(error);
  }
};


export const updateRoomAvailability = async (req, res, next) => {
  try {
    const updatedRoomAvailability = await Room.updateOne(
      {"roomNumbers._id":req.params.id},
      {
        $push:{"roomNumbers.$.unavailableDates":req.body.dates}
      }
      )
      if(updatedRoomAvailability){
        res.status(200).json("Room status has been updated");
      }
  } catch (error) {
    next(error);
  }
}


export const deleteRoom = async ( req,res,next) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id)
    if(deletedRoom){
      res.status(200).json("Room status has been deleted");
    }
  } catch (error) {
    next(error);
  }
}


export const getRoom = async(req,res,next) => {
  try {
    const room = await Room.findById(req.params.id)
    if(room){
      res.status(200).json(room);
    }
  } catch (error) {
    next(error);
  }
}

export const getRooms = async(req,res,next) => {
  try {
    const rooms = await Room.find()
    if(rooms){
      res.status(200).json(rooms);
    }
  } catch (error) {
    next(error);
  }
}