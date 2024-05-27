import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const s3_client = new S3Client({});
const dynamodb_client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamodb_client);

export const handler = async (event) => {
  console.log("event: ", event);
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  console.log("s3: ", event.Records[0].s3.object)
  
  try {
    const get_obj_command = new GetObjectCommand({
      Bucket: bucket,
      Key:key,
    });
    const res = await s3_client.send(get_obj_command);  
    console.log("res: ", res)
    
    let file_data = {
      "file": key.split('/')[1],
      "meta_data": {
        "key": key,
        "bucket": bucket,
        "type": res['ContentType'],
        "size": res['ContentLength'],
        "modified_at": res['LastModified'].toISOString()
       },
      "created_at":  new Date().toISOString()
    }
    
    console.log("file_data: ", file_data)
    
    const put_item_command = new PutCommand({
    TableName: "serverless-poc-files",
      Item: file_data
    });
    const response = await docClient.send(put_item_command);
    console.log(response);
  
  } catch (err) {
    console.error(err);
  }

};
