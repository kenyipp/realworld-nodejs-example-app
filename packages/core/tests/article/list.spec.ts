import assert from 'assert';
import { Chance } from 'chance';
import pMap from 'p-map';

import { ServiceFactory } from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';

describe('Article Repository - List Articles', () => {
  it('should be able to return a list of articles', async () => {
    const { articleService, userId } = await setup();

    await pMap(
      new Array(10),
      async (_, index) => {
        await articleService.createArticle({
          title: `title-${index}`,
          description: `description-${index}`,
          body: `body-${index}`,
          userId
        });
      },
      { concurrency: 1, stopOnError: true }
    );

    const articles = await articleService.getArticles({
      limit: 10,
      offset: 0
    });

    expect(articles.length).toBe(10);
    const count = await articleService.countArticles({});
    expect(count).toBe(10);
  });

  it('should be able to return a filtered article list by tags', async () => {
    const { articleService, userId } = await setup();

    const ids = await pMap(
      new Array(10),
      async (_, index) => {
        const id = await articleService.createArticle({
          title: `title-${index}`,
          description: `description-${index}`,
          body: `body-${index}`,
          userId
        });
        return id;
      },
      { concurrency: 1, stopOnError: true }
    );

    assert(ids[0]);

    await articleService.createArticleTags({
      articleId: ids[0],
      tagList: ['tag1', 'tag2']
    });

    const articles = await articleService.getArticles({ tags: ['tag1'] });
    expect(articles.length).toBe(1);

    const count = await articleService.countArticles({ tags: ['tag1'] });
    expect(count).toBe(1);
  });

  it("should be able to return a filtered article list by the author's name", async () => {
    const { articleService, userService, chance } = await setup();

    const usernameA = 'userA';
    const usernameB = 'userB';

    const userIdA = await userService.createUser({
      username: usernameA,
      email: chance.email(),
      password: 'Abcd1234'
    });

    const userIdB = await userService.createUser({
      username: usernameB,
      email: chance.email(),
      password: 'Abcd1234'
    });

    await articleService.createArticle({
      title: 'title-1',
      description: 'description-1',
      body: 'body-1',
      userId: userIdA
    });

    await articleService.createArticle({
      title: 'title-2',
      description: 'description-2',
      body: 'body-2',
      userId: userIdB
    });

    const articles = await articleService.getArticles({ author: usernameA });
    expect(articles.length).toBe(1);

    const count = await articleService.countArticles({ author: usernameA });
    expect(count).toBe(1);
  });

  it('should be able to return a filtered article list that is favorited by user', async () => {
    const { articleService, userService, chance } = await setup();

    const usernameA = 'userA';
    const usernameB = 'userB';

    const userIdA = await userService.createUser({
      username: usernameA,
      email: chance.email(),
      password: 'Abcd1234'
    });

    const userIdB = await userService.createUser({
      username: usernameB,
      email: chance.email(),
      password: 'Abcd1234'
    });

    const articleId = await articleService.createArticle({
      title: 'title-1',
      description: 'description-1',
      body: 'body-1',
      userId: userIdA
    });

    await articleService.favoriteArticle({
      userId: userIdB,
      articleId
    });

    const articles = await articleService.getArticles({ favorited: usernameB });
    expect(articles.length).toBe(1);

    const count = await articleService.countArticles({ favorited: usernameB });
    expect(count).toBe(1);
  });

  it('should return an empty list if no articles match the filter parameters', async () => {
    const { articleService, userId } = await setup();

    await pMap(
      new Array(10),
      async (_, index) => {
        await articleService.createArticle({
          title: `title-${index}`,
          description: `description-${index}`,
          body: `body-${index}`,
          userId
        });
      },
      { concurrency: 1, stopOnError: true }
    );

    const articles = await articleService.getArticles({
      limit: 10,
      offset: 0,
      tags: ['non-existent-tag']
    });
    expect(articles.length).toBe(0);

    const count = await articleService.countArticles({
      tags: ['non-existent-tag']
    });
    expect(count).toBe(0);
  });

  it('should be able to limit the number of articles returned', async () => {
    const { articleService, userId } = await setup();

    await pMap(
      new Array(10),
      async (_, index) => {
        await articleService.createArticle({
          title: `title-${index}`,
          description: `description-${index}`,
          body: `body-${index}`,
          userId
        });
      },
      { concurrency: 1, stopOnError: true }
    );

    const articles = await articleService.getArticles({
      limit: 5,
      offset: 0
    });
    expect(articles.length).toBe(5);
  });

  it('should be able to paginate the articles using the offset parameter', async () => {
    const { articleService, userId } = await setup();

    await pMap(
      new Array(9),
      async (_, index) => {
        await articleService.createArticle({
          title: `title-${index}`,
          description: `description-${index}`,
          body: `body-${index}`,
          userId
        });
      },
      { concurrency: 1, stopOnError: true }
    );

    const articles = await articleService.getArticles({
      limit: 5,
      offset: 0
    });
    expect(articles.length).toBe(5);

    const articles2 = await articleService.getArticles({
      limit: 5,
      offset: 1
    });
    expect(articles2.length).toBe(4);

    const articles3 = await articleService.getArticles({
      limit: 5,
      offset: 2
    });
    expect(articles3.length).toBe(0);
  });

  it('should be able to remove articles from the feed when the user unfollows another user', async () => {
    const { articleService, userService, chance } = await setup();

    const usernameA = 'userA';
    const usernameB = 'userB';

    const userIdA = await userService.createUser({
      username: usernameA,
      email: chance.email(),
      password: 'Abcd1234'
    });

    const userIdB = await userService.createUser({
      username: usernameB,
      email: chance.email(),
      password: 'Abcd1234'
    });

    await userService.followUser({
      followerId: userIdA,
      followingUsername: usernameB
    });

    await articleService.createArticle({
      title: 'title-1',
      description: 'description-1',
      body: 'body-1',
      userId: userIdB
    });

    const articles = await articleService.getArticles({ followedBy: userIdA });
    const count = await articleService.countArticles({ followedBy: userIdA });

    expect(articles.length).toBe(1);
    expect(count).toBe(1);

    await userService.unfollowUser({
      followerId: userIdA,
      followingUsername: usernameB
    });

    const articles2 = await articleService.getArticles({ followedBy: userIdA });
    const count2 = await articleService.countArticles({ followedBy: userIdA });

    expect(articles2.length).toBe(0);
    expect(count2).toBe(0);
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const serviceFactory = new ServiceFactory();

  const username = chance.word();

  const userService = serviceFactory.newUserService();

  const userId = await userService.createUser({
    username,
    email: chance.email(),
    password: 'Abcd1234'
  });

  const articleService = serviceFactory.newArticleService();

  return {
    chance,
    username,
    userService,
    articleService,
    userId
  };
};
