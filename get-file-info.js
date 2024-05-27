import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"; 
const client = new DynamoDBClient( {region: "ap-southeast-1"} );


export const handler = async (event) => {
    console.log("event: ",event )
    try{
        const file = event.args.file
        console.log("file: ", file)
        const input = {
          "Key": {
            "file": {
              "S": file
            }
          },
          "TableName": "serverless-poc-files"
        };
        const command = new GetItemCommand(input);
        const response = await client.send(command);
        console.log("response: ", response)
        let data = null
        if ('Item' in response){
            let metadata = response.Item.meta_data
            let file = response.Item.file
            let created_at = response.Item.created_at
    
            data = {
                file: file.S,
                metadata: {
                  bucket: metadata.M.bucket.S,
                  type: metadata.M.type.S,
                  size: metadata.M.size.N,
                  modified_at: metadata.M.modified_at.S,
                  key: metadata.M.key.S
                },
                created_at: created_at.S
            }
        }
        console.log("data: ", data)
        
        return {
          status: 200,
          data: data
        };
    }
    catch(err){
      console.log("err: ", err)
    }
};