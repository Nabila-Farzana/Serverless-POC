import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";
const s3_client = new S3Client({region: "ap-southeast-1"});

export const handler = async (event) => {
    console.log("event: ", event)
    console.log("event.Records[0].sns: ", event.Records[0].Sns)
    try {
      const message = JSON.parse(event.Records[0].Sns.Message);
      const file_info = JSON.parse(message.body)
      console.log("file_info: ", file_info)
      let file_name = file_info.file
     
      const command = new CopyObjectCommand({
        CopySource: `${file_info.meta_data.bucket}/${file_info.meta_data.key}`,
        Bucket: `${file_info.meta_data.bucket}`,
        Key: `copies/${file_name}`
      });
      
      const response = await s3_client.send(command);
      console.log(response);
     
      return 200;
    }
    catch (err) {
      console.log("err: ", err)
    }
  };