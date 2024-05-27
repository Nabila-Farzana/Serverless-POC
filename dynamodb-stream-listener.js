import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"; 
const sqsClient = new SQSClient({ region: "ap-southeast-1" });

export const handler = async (event) => {
    console.log("event: ", event)
    console.log("item: ", event.Records[0].dynamodb)
  
    const queueUrl = "https://sqs.ap-southeast-1.amazonaws.com/385187169402/serverless-poc-send-file-data-queue";
    try{
        for (const record of event.Records) {
            if (record.eventName === "INSERT") {
                const newImage = record.dynamodb.NewImage;
                const metaData =  record.dynamodb.NewImage.meta_data.M
                const fileInfo = {
                    file: newImage.file.S,
                    meta_data: {
                        bucket:metaData.bucket.S,
                        size: metaData.size.N,
                        type: metaData.type.S,
                        modified_at: metaData.modified_at.S,
                        key: metaData.key.S
                    },
                    created_at: newImage.created_at.S
                };
                
                console.log("fileInfo: ", fileInfo)
                const params = {
                    QueueUrl: queueUrl,
                    MessageBody: JSON.stringify(fileInfo),
                };
                
                const data = await sqsClient.send(new SendMessageCommand(params));
                console.log("Success, message sent. MessageID:", data.MessageId);
                const response = {
                        statusCode: 200,
                        body: JSON.stringify('Hello from Lambda!'),
                };
                return response;
             
            }
            else {
                console.log("event type: ", record.eventName)
            }
        }
    }catch(err){
      console.log("err: ", err)
    }

};
