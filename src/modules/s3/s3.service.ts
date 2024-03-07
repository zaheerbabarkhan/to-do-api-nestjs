import { PutObjectCommand, PutObjectCommandOutput, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import config from "../../config/config";
import {uuid} from "uuidv4";
import { S3 } from "aws-sdk";

const awsConfig = config.AWS
@Injectable()
export class S3Service {
    private readonly s3Client = new S3Client({
        credentials: {
            accessKeyId: config.AWS.ACCESS_KEY,
            secretAccessKey: config.AWS.SECRET_KEY
        },
        region: config.AWS.REGION,
    });
    private readonly v2Client = new S3({
        params: {
            Bucket: awsConfig.BUCKET_NAME
        },
        credentials: {
            accessKeyId: awsConfig.ACCESS_KEY,
            secretAccessKey: awsConfig.SECRET_KEY
        },
        region: awsConfig.REGION,
    });
    
    async upload (s3Key: string, fileData: Buffer, fileType: string) {
    
        const command = new PutObjectCommand({
            Bucket: awsConfig.BUCKET_NAME,
            Key: s3Key,
            Body: fileData,
            ContentType: fileType
          });
          const response: PutObjectCommandOutput = await this.s3Client.send(command);
          return response;
    };

    signedURL(s3Key: string) {
        return this.v2Client.getSignedUrl("getObject", { Bucket: awsConfig.BUCKET_NAME , Key: s3Key });
    }
    s3Key(fileName: string, path: string) {
        fileName = fileName.replace(/[^0-9a-z\.\-\_]+/gi, "_");
        const key = `${path}/${uuid()}-${fileName.split("/").pop()}`
        return key;
    }
}