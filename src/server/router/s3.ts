import { z } from "zod";
import { createProtectedRouter } from "./context";
import { env } from "../../env/server.mjs";
import AWS from "aws-sdk";
// import { generatePreSignedPutUrl } from "../common/s3-presigned-urls";

const FileType = z.object({
  name: z.string(),
  type: z.string(),
  url: z.string().optional(),
});

type FileType = {
  name: string;
  type: string;
  url: string;
};

// Example router with queries that can only be hit if the user requesting is signed in
export const s3Router = createProtectedRouter().mutation("getPresignedUrls", {
  input: z.object({
    files: FileType.array(),
  }),
  async resolve({ ctx, input }) {
    try {
      //generatePreSignedPutUrl("REPLACE FILE NAME", "REPLACE FILE TYPE");
      let result: FileType[] = [];

      for (let i = 0; i < input.files.length; i++) {
        const f = { ...input.files[i] };

        if (!f.name || !f.type) continue;

        let preSignedUrl = await generatePreSignedPutUrl(f.name, f.type);

        if (typeof preSignedUrl !== "string") continue;

        result.push({
          name: f.name,
          type: f.type,
          url: preSignedUrl,
        });
      }

      return result;
    } catch (err) {
      console.log(err);
    }

    return "oops";
  },
});

AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: env.S3_BUCKET },
  region: env.S3_REGION,
});

export function generatePreSignedPutUrl(
  fileName: string,
  fileType: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      myBucket.getSignedUrl(
        "putObject",
        {
          Key: fileName,
          ContentType: fileType,
          Expires: parseInt(env.URL_EXPIRE_TIME),
        },
        (err, url) => {
          resolve(url);
        }
      );
    } catch (error) {
      reject("There was an issue.");
    }
  });
}
