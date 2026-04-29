import { test } from '../utils/fixtures';
import { expect } from '../utils/coustom_expect';
import { createToken } from '../helpers/createToken';
import { validateSchema } from '../utils/schema-validator';

test('Get Articles', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        // .clearAuth()
        .getRequest(200);
    await expect(response).shouldMatchSchema('articles', 'GET_articles');

    expect(response.articles.length).shouldBeLessThanOrEqual(15);
    expect(response.articlesCount).shouldEqual(10);
    // console.log(response);

});

test('Get Tags', async ({ api }) => {

    const response = await api
        .path('/tags')
        .getRequest(200);

    await expect(response).shouldMatchSchema('tags', 'GET_tags');
    expect(response.tags[0]).shouldEqual('Test');
    expect(response.tags.includes('YouTube')).toBeTruthy();

    expect(response.tags.length).shouldEqual(10);
    expect(response.tags.length).toBeLessThanOrEqual(10);
    // console.log(response);

});

test('Create and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .body({
            "article": {
                "title": "New Article " + Date.now(), "description": "Article Description", "body": "Article Body", "tagList": ["Test", "API"]
            }
        })
        .postRequest(201);
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article');
    expect(createArticleResponse.article.title).toContain("New Article");
    const articleSlug = createArticleResponse.article.slug;


    const articalsResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponse.articles[0].title).toContain("New Article");

    const deleteArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .deleteRequest(204);

    const articalsResponseCheck = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponseCheck.articles[0].title).not.toContain("New Article");

});

test('Create Update and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
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
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponse.articles[0].title).toContain("Updated Article");


    const deleteArticleResponse = await api
        .path(`/articles/${updatedArticleSlug}`)
        .deleteRequest(204);


    const articalsResponseCheck = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponseCheck.articles[0].title).not.toContain("Updated Article");

});



