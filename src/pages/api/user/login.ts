import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../../server/db/client";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const bodySchema = z.object({
    email: z.string().min(1).email().trim(),
    password: z.string().min(8).trim(),
  });

  console.log(req.body);

  try {
    const parsedBody = bodySchema.parse(req.body);

    let existingUser = await prisma.user.findFirst({
      where: {
        email: parsedBody.email,
      },
    });

    if (!existingUser) {
      return res.status(409).json({ error: "User not found" });
    }

    //TODO: HASH passwords
    if (existingUser.pw_hash != parsedBody.password) {
      res.status(200).json({ error: "Incorrect password" });
    }

    let user: Partial<User> = { ...existingUser };

    delete user.pw_hash;

    console.log(user);

    return res.status(200).json(user);
  } catch (error) {
    //Does not match schema.
    console.log("does not like this");
    return res.status(400).json(error);
  }
}
