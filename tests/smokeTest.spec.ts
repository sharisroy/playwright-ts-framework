import { test } from '../utils/fixtures';
import { expect, request } from '@playwright/test';


let authToken: string;

test.beforeAll('Get Auth Token', async ({ api }) => {

    const tokenResponse = await api
        .path('/users/login')
        .body({
            "user": {
                "email": "learnerharisbd@gmail.com",
                "password": "H12345bd"
            }
        })
        .postRequest(200);

    authToken = tokenResponse.user.token;

});


test('Get Articles', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);


    expect(response.articles.length).toEqual(10);
    expect(response.articlesCount).toEqual(10);
    // console.log(response);

});

test('Get Tags', async ({ api }) => {

    const response = await api
        .path('/tags')
        .getRequest(200);


    expect(response.tags[0]).toEqual('Test');
    expect(response.tags.includes('YouTube')).toBeTruthy();

    expect(response.tags.length).toEqual(10);
    expect(response.tags.length).toBeLessThanOrEqual(10);
    // console.log(response);

});

test('Create and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .headers({ 'Authorization': `Token ${authToken}` })
        .body({
            "article": {
                "title": "New Article " + Date.now(), "description": "Article Description", "body": "Article Body", "tagList": ["Test", "API"]
            }
        })
        .postRequest(201);
    expect(createArticleResponse.article.title).toContain("New Article");
    const articleSlug = createArticleResponse.article.slug;


    const articalsResponse = await api
        .path('/articles')
        .headers({ 'Authorization': `Token ${authToken}` })
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponse.articles[0].title).toContain("New Article");

    const deleteArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .headers({ 'Authorization': `Token ${authToken}` })
        .deleteRequest(204);

    const articalsResponseCheck = await api
        .path('/articles')
        .headers({ 'Authorization': `Token ${authToken}` })
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponseCheck.articles[0].title).not.toContain("New Article");

});

test('Create Update and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .headers({ 'Authorization': `Token ${authToken}` })
        .body({
            "article": {
                "title": "New Article " + Date.now(), "description": "Article Description", "body": "Article Body", "tagList": ["Test", "API"]
            }
        })
        .postRequest(201);
    expect(createArticleResponse.article.title).toContain("New Article");
    const articleSlug = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .headers({ 'Authorization': `Token ${authToken}` })
        .body({
            "article": {
                "title": "Updated Article " + Date.now(), "description": "Updated Description", "body": "Updated Body", "tagList": ["Test", "API", "Update"]
            }
        })
        .putRequest(200);
    expect(updateArticleResponse.article.title).toContain("Updated Article");
    const updatedArticleSlug = updateArticleResponse.article.slug;

    const articalsResponse = await api
        .path('/articles')
        .headers({ 'Authorization': `Token ${authToken}` })
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponse.articles[0].title).toContain("Updated Article");


    const deleteArticleResponse = await api
        .path(`/articles/${updatedArticleSlug}`)
        .headers({ 'Authorization': `Token ${authToken}` })
        .deleteRequest(204);


    const articalsResponseCheck = await api
        .path('/articles')
        .headers({ 'Authorization': `Token ${authToken}` })
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponseCheck.articles[0].title).not.toContain("Updated Article");


});


