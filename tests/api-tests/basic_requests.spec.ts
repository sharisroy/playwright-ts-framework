// Ignore for Framework, this is just to test the basic get, post, put and delete request using playwright api testing capabilities

import { test, expect } from '@playwright/test';

test('Get Test Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const tagsResponseJson = await tagsResponse.json();
  console.log(tagsResponseJson)

  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJson.tags[0]).toEqual('Test');
  expect(tagsResponseJson.tags.includes('YouTube')).toBeTruthy();

  expect(tagsResponseJson.tags.length).toEqual(10);
  expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10);

});

test('Get All Articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
  const articlesResponseJson = await articlesResponse.json();
  console.log(articlesResponseJson);

  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJson.articles.length).toEqual(10);
  expect(articlesResponseJson.articlesCount).toEqual(10);
});

test('Create New Article', async ({ request }) => {

  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "learnerharisbd@gmail.com",
        "password": "H12345bd"
      }
    }
  })
  const tokenResponseJson = await tokenResponse.json();
  console.log(tokenResponseJson);
  const token = tokenResponseJson.user.token;
  console.log(token);
});

test("Create New Article and Delete with Token", async ({ request }) => {

  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "learnerharisbd@gmail.com",
        "password": "H12345bd"
      }
    }
  })
  const tokenResponseJson = await tokenResponse.json();
  const token = tokenResponseJson.user.token;

  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    headers: {
      'Authorization': `Token ${token}`
    },
    data: {
      "article": {
        "title": "New Article " + Date.now(),
        "description": "adsgas",
        "body": "dasgas",
        "tagList": []
      }
    }
  })
  const newArticleResponseJson = await newArticleResponse.json();
  console.log(newArticleResponseJson);
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJson.article.title).toContain("New Article");
  const articleSlug = newArticleResponseJson.article.slug;

  const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  const articleResponseJson = await articleResponse.json();
  expect(articleResponse.status()).toEqual(200);
  expect(articleResponseJson.articles[0].title).toEqual(newArticleResponseJson.article.title);
  console.log(articleResponseJson.articles[0].title);


  // Update the article
  const updatedArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    headers: {    'Authorization': `Token ${token}` },
    data: {
      "article": {
        "title": "Updated Article " + Date.now(),
        "description": "adsgas",
        "body": "dasgas",
        "tagList": []
      }
    }
  });
  const updatedArticleResponseJson = await updatedArticleResponse.json();
  console.log(updatedArticleResponseJson);
  expect(updatedArticleResponse.status()).toEqual(200);
  expect(updatedArticleResponseJson.article.title).toContain("Updated Article");
  const updatedArticleSlug = updatedArticleResponseJson.article.slug;


  // Delete the article
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedArticleSlug}`, {
    headers: {    'Authorization': `Token ${token}` }
  });
  expect(deleteArticleResponse.status()).toEqual(204);    
});