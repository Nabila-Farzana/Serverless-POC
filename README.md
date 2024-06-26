# Serverless-POC
AWS Multi Region Event Propagation by Serverless Framework. This was the onboarding task when I joined Craftsmen.

Task:
sS3 Event Listener in the Singapore Region:
Develop a Lambda function deployed in the Singapore region, configured as an S3 trigger. This Lambda function will capture file information and store it in DynamoDB whenever a new file is uploaded to the designated S3 bucket. The file information to be stored includes:

```json
{
  "key": "xxxxxx",
  "type": "jpeg",
  "size": "1111111",
  "storageClass": "xxxxx"
}

```

Upon successful storage, a secondary Lambda function will be triggered as a DynamoDB stream listener. This function will forward the file information to an SQS queue.
S3 Object Processor Lambda in the Tokyo Region:
Implement another Lambda function in the Tokyo region, configured to process new messages from the SQS queue. This function will create a duplicate copy of the file in a different folder within the same S3 bucket.
File Information API:
Develop a Lambda function capable of retrieving file information stored in DynamoDB. This function will expose an API endpoint via AWS API Gateway, allowing clients to query file information. Integrate a GraphQL framework to enable clients to specify the fields they require in the API response, optimizing network usage.

API Specifications:
HTTP Request Method: GET
URL: https://craftsmenltd.com/api/files
Authorization: Static Token in the request header
Development Plan:
Initially, utilize the AWS Web Console for manual setup and configuration of the above components.
Gradually transition to an automated deployment process using the Serverless framework to streamline development, deployment, management, and scaling of AWS resources.

