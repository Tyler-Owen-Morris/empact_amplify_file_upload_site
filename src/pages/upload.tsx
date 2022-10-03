import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import S3Upload from "../modules/s3upload/S3Upload";

const UploadPage: NextPage = () => {
  const { status } = useSession();

  if (status == "loading") {
    return <>Loading</>;
  }

  if (status == "unauthenticated") {
    signIn();
    return <></>;
  }

  return (
    <>
      <S3Upload />
    </>
  );
};

export default UploadPage;
