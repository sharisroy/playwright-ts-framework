import { test } from '../utils/fixtures';
import { expect } from '../utils/coustom_expect';
import { createToken } from '../helpers/createToken';


let authToken: string;

test.beforeAll('Get Auth Token', async ({ api, config }) => {

    const tokenResponse = await api
        // .path('/users/login')
        // .body({
        //     "user": {
        //         "email": config.userEmail,
        //         "password": config.userPassword
        //     }
        // })
        // .postRequest(200);

    authToken = await createToken( config.userEmail, config.userPassword);

});


test('Get Articles', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);


    expect(response.articles.length).shouldBeLessThanOrEqual(15);
    expect(response.articlesCount).shouldEqual(10);
    // console.log(response);

});

test('Get Tags', async ({ api }) => {

    const response = await api
        .path('/tags')
        .getRequest(200);


    expect(response.tags[0]).shouldEqual('Test');
    expect(response.tags.includes('YouTube')).toBeTruthy();

    expect(response.tags.length).shouldEqual(10);
    expect(response.tags.length).toBeLessThanOrEqual(10);
    // console.log(response);

});

test('Create and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
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
        .headers({ 'Authorization': authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponse.articles[0].title).toContain("New Article");

    const deleteArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .headers({ 'Authorization': authToken })
        .deleteRequest(204);

    const articalsResponseCheck = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponseCheck.articles[0].title).not.toContain("New Article");

});

test('Create Update and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
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
        .headers({ 'Authorization': authToken })
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
        .headers({ 'Authorization': authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponse.articles[0].title).toContain("Updated Article");


    const deleteArticleResponse = await api
        .path(`/articles/${updatedArticleSlug}`)
        .headers({ 'Authorization': authToken })
        .deleteRequest(204);


    const articalsResponseCheck = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articalsResponseCheck.articles[0].title).not.toContain("Updated Article");


});



