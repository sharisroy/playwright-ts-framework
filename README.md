install Playwright

1. npm init playwright@latest
2. Typescript -> test -> ...
3. if package-lock.json file is missing -> npm install

How to run test
1. run all test - > npx playwright test
2. run project ->  npx playwright test --project api-testing(project Name)
3. run file -> px playwright test tests/exampleHook.spec.ts 
4. run single test -> npx playwright test -g "Get Test Tags"(Test Name)
5. run failed test -> npx playwright test --last-failed
6. run ENV test -> TEST_ENV=staging(env name) npx playwright test tests/smokeTest.spec.ts


Alignment and Text Direction -> Option + Shift + F

