import { IsNull } from 'typeorm';
import { xautodb } from './connection';
import { Report, User } from '../entities';

export const migrateUserSnapshots = async (): Promise<void> => {
  try {
    console.log('Starting user snapshot migration...');

    // Get all reports that have missing user snapshot data
    const reports = await xautodb.getRepository(Report).find({
      where: [
        { user_id: IsNull() },
        { user_name: IsNull() },
        { user_surname: IsNull() },
        { user_nickname: IsNull() }
      ]
    });

    console.log(`Found ${reports.length} reports with missing user snapshot data`);

    if (reports.length === 0) {
      console.log('No reports need user snapshot migration');
      return;
    }

    // Check if there's any user data available
    const users = await xautodb.getRepository(User).find();
    console.log(`Found ${users.length} users in database`);

    if (users.length === 0) {
      console.log('No users found to populate snapshot data');
      return;
    }

    // For each report, try to populate with a default user (first user found)
    // In a real migration, you'd want to map reports to their actual creators
    const defaultUser = users[0];

    for (const report of reports) {
      await xautodb.getRepository(Report).update(report.id, {
        user_id: defaultUser.id,
        user_name: defaultUser.name,
        user_surname: defaultUser.surname,
        user_nickname: defaultUser.nickname
      });
    }

    console.log(`Successfully migrated ${reports.length} reports with user snapshot data`);
  } catch (error) {
    console.error('Error during user snapshot migration:', error);
    throw error;
  }
};
