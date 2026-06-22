import { checkDbConnection } from './config/db.js';
import logger from './config/logger.js';

const testConnection = async () => {
  logger.info('Attempting to connect to the database...');
  const success = await checkDbConnection();

  if (success) {
    logger.info('🎉 Database connection test PASSED!');
    process.exit(0);
  } else {
    logger.error('❌ Database connection test FAILED.');
    process.exit(1);
  }
};

testConnection();
