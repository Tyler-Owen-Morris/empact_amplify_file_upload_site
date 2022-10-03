import AWS from "aws-sdk";
import { env } from "../../env/server.mjs";

AWS.config.update({
  accessKeyId: env.S3_AWS_ACCESS_KEY_ID,
  secretAccessKey: env.S3_AWS_SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: env.S3_BUCKET },
  region: env.S3_REGION,
});

export function generatePreSignedPutUrl(fileName: string, fileType: string) {
  myBucket.getSignedUrl(
    "putObject",
    {
      Key: fileName,
      ContentType: fileType,
      Expires: parseInt(env.URL_EXPIRE_TIME),
    },
    (err, url) => {
      return url;
    }
  );
}
