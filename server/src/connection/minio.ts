import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || '10.98.98.116',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'admin123456'
});

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'inventario-imagenes';

// Verificar conexión y crear bucket si no existe
(async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ Bucket "${BUCKET_NAME}" creado en MinIO`);
      
      // Configurar política pública para lectura
      const policy = {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
        }]
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    } else {
      console.log(`✅ Conectado a MinIO - Bucket: ${BUCKET_NAME}`);
    }
  } catch (err: any) {
    console.error('❌ Error conectando a MinIO:', err.message);
  }
})();
