import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../../server/db/client";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodySchema = z.object({
    email: z.string().min(1).email().trim(),
    password: z.string().min(8).trim(),
  });

  try {
    const parsedBody = bodySchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: parsedBody.email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email in use" });
    }

    const newUser = await prisma.user.create({
      data: {
        email: parsedBody.email,
        //TODO: Hash passwords
        pw_hash: parsedBody.password,
      },
    });

    return res.status(200).json(newUser);
  } catch (error) {
    //Does not match schema.
    return res.status(400).json(error);
  }
}
