import { isUndefined } from 'lodash';

import { RecordStatus } from '../../types';
import { getObjectId } from '../../utils';
import { knex } from '../knex';
import { DbDtoProfile, DbDtoUser } from './dto';
import {
  CreateUserInput,
  CreateUserOutput,
  FollowUserInput,
  FollowUserOutput,
  GetIsUserExistsInput,
  GetIsUserExistsOutput,
  GetUserProfilesInput,
  GetUserProfilesOutput,
  GetUsersInput,
  GetUsersOutput,
  UnfollowUserInput,
  UnfollowUserOutput,
  UpdateUserByIdInput,
  UpdateUserByIdOutput
} from './types';

export class DbUser {
  async createUser({
    username,
    email,
    bio,
    image,
    hash
  }: CreateUserInput): CreateUserOutput {
    const userId = getObjectId();
    await knex
      .insert({
        user_id: userId,
        username,
        email,
        bio,
        image,
        hash
      })
      .into('user');
    return userId;
  }

  async updateUser({
    id,
    email,
    username,
    hash,
    image,
    bio
  }: UpdateUserByIdInput): UpdateUserByIdOutput {
    if (!email && !username && !hash && !image && !bio) {
      return;
    }
    const updates = {
      email,
      username,
      hash,
      image,
      bio
    };
    await knex.table('user').update(updates).where('user_id', id);
  }

  async getIsUserExists({
    userId,
    email,
    username
  }: GetIsUserExistsInput): GetIsUserExistsOutput {
    const rows = await knex
      .select({
        id: 'user_id',
        email: 'email',
        username: 'username'
      })
      .where(function () {
        this.where(function () {
          this.where('email', email).orWhere('username', username);
        });
        if (userId) {
          this.andWhere('user_id', '<>', knex.raw('?', [userId]));
        }
      })
      .from('user');
    const emailExists = rows.some((row) => row.email === email);
    const usernameExists = rows.some((row) => row.username === username);
    return {
      exists: emailExists || usernameExists,
      emailExists,
      usernameExists
    };
  }

  async getUsers({ ids, emails, usernames }: GetUsersInput): GetUsersOutput {
    // Return empty array if all ids, emails, and usernames are undefined
    if (!ids?.length && !emails?.length && !usernames?.length) {
      return [];
    }
    const query = knex
      .select({
        id: 'user_id',
        email: 'email',
        username: 'username',
        bio: 'bio',
        image: 'image',
        hash: 'hash',
        recordStatus: 'record_status',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      })
      .from('user');
    if (!isUndefined(ids)) {
      query.whereIn('user_id', ids);
    }
    if (!isUndefined(emails)) {
      query.whereIn('email', emails);
    }
    if (!isUndefined(usernames)) {
      query.whereIn('username', usernames);
    }
    return query.then((rows) => rows.map((row) => new DbDtoUser(row)));
  }

  async followUser({ followerId, followingId }: FollowUserInput): FollowUserOutput {
    await knex
      .insert({
        user_follow_id: getObjectId(),
        follower_id: followerId,
        following_id: followingId
      })
      .into('user_follow');
  }

  async unfollowUser({
    followerId,
    followingId
  }: UnfollowUserInput): UnfollowUserOutput {
    await knex
      .update({ record_status: RecordStatus.Deleted })
      .from('user_follow')
      .where('follower_id', followerId)
      .where('following_id', followingId);
  }

  async getUserProfiles({
    usernames,
    requestingUserId
  }: GetUserProfilesInput): GetUserProfilesOutput {
    const profiles = await knex
      .select({
        id: 'user_id',
        username: 'username',
        bio: 'bio',
        image: 'image',
        following: knex.raw(
          '(CASE WHEN user_follow_id IS NULL THEN FALSE ELSE TRUE END)'
        )
      })
      .from('user')
      // eslint-disable-next-line func-names
      .leftJoin('user_follow', function () {
        this.on('user_follow.following_id', '=', 'user.user_id');
        this.on(
          'user_follow.record_status',
          '=',
          knex.raw('?', [RecordStatus.Active])
        );
        if (requestingUserId) {
          this.andOn(
            'user_follow.follower_id',
            '=',
            knex.raw('?', [requestingUserId])
          );
        }
      })
      .whereIn('user.username', usernames)
      .then((docs) => docs.map((doc) => new DbDtoProfile(doc)));
    return profiles;
  }
}
