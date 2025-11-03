import { Router } from "express";
import { middleware } from "../auth/auth.middleware.ts";
import prisma from "../utils/prisma-client.ts";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const router: Router = Router();

router.use(middleware);

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, pfp: true }
    });
    if(!foundUser){
      return res.status(404).json({message: "User not found"});
    }
    return res.status(200).json( foundUser );
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving user", error });
  }
});

router.put("/", async (req, res) => {
  try {
    const { name, email, pfp } = req.body;
    const data: {name?: string, email?: string, pfp?: string} = {};
    if (name) data['name'] = name;
    if (email) data['email'] = email;
    if (pfp) data['pfp'] = pfp;
    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: { id: true, name: true, email: true, pfp: true }
    });
    return res.status(200).json({ user: updatedUser });
  } catch (error: any | PrismaClientKnownRequestError) {
    if(error.code === 'P2002'){
      return res.status(400).json({ message: "Email or Name already in use" });
    }
    return res.status(500).json({ message: "Error updating user", error });
  }
});

export default router;
