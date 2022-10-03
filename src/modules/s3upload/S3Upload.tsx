import { signIn, useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import useFileUpload from "react-use-file-upload";
import { trpc } from "../../utils/trpc";

const Upload = () => {
  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();

  const inputRef = useRef();
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);

  const s3Mutation = trpc.useMutation(["s3.getPresignedUrls"], {
    onSuccess: (data) => {
      console.log(data);

      if (data !== "oops") {
        data.forEach((file) => {
          let actualFile = files.filter((f) => f.name === file.name)[0];

          fetch(file.url, {
            method: "PUT",
            body: actualFile,
          });
        });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setIsUploading(true);

    // const formData = createFormData();

    // console.log(formData.entries());

    let filesMapped = files.map((f) => ({
      name: f.name,
      type: f.type,
    }));

    // console.log(filesMapped);

    s3Mutation.mutate({
      files: filesMapped,
    });

    // console.log("presigned result", result);

    // try {
    //   axios.post("https://some-api.com", formData, {
    //     "content-type": "multipart/form-data",
    //   });
    // } catch (error) {
    //   console.error("Failed to submit files.");
    // }
  };

  return (
    <div className="container mx-auto mt-20 p-20">
      <h1 className="text-5xl pb-5">Upload Files</h1>

      <p className="text-lg pb-5">
        Please use the form to your right to upload any file(s) of your
        choosing.
      </p>

      <div className="flex gap-5 justify-center">
        {/* Display the files to be uploaded */}
        <div className="w-[600px] h-full min-h-[400px] bg-black text-white p-2 flex flex-col">
          <h2 className="text-xl">Files ({files.length})</h2>
          <ul className="flex-grow p-2">
            {fileNames.map((name: string) => (
              <li key={name} className="flex">
                <span className="flex-grow">{name}</span>

                <span onClick={() => removeFile(name)}>
                  <i className="fa fa-times" />X
                </span>
              </li>
            ))}
          </ul>

          {files.length > 0 && (
            <ul className="flex flex-col gap-5 p-2">
              <div>
                <li>File types found: {fileTypes.join(", ")}</li>
                <li>Total Size: {totalSize}</li>
                <li>Total Bytes: {totalSizeInBytes}</li>
              </div>

              <li>
                <button
                  className="border-2  rounded p-2 hover:border-red-600 bg-red-500"
                  onClick={() => clearAllFiles()}
                >
                  Clear All
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Provide a drop zone and an alternative button inside it to upload files. */}
        <div
          // css={DropzoneCSS}
          className="min-w-[400px] h-full min-h-[400px] bg-white text-black p-2 border-8 border-black border-dotted cursor-pointer flex flex-col justify-center items-center"
          onDragEnter={handleDragDropEvent}
          onDragOver={handleDragDropEvent}
          onDrop={(e) => {
            handleDragDropEvent(e);
            setFiles(e, "a");
          }}
          onClick={() => inputRef.current.click()}
        >
          <p>Drag and drop files here</p>

          <button>Or select files to upload</button>

          {/* Hide the crappy looking default HTML input */}
          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              setFiles(e, "a");
              inputRef.current.value = null;
            }}
          />
        </div>
      </div>

      <div className="submit flex justify-center mt-10">
        <button
          onClick={handleSubmit}
          className="border-2 bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 p-2 rounded text-white font-bold text-2xl"
          disabled={files.length < 1 || isUploading}
        >
          Submit {files.length} {files.length == 1 ? "file" : "files"}
        </button>
      </div>
    </div>
  );
};

export default Upload;
