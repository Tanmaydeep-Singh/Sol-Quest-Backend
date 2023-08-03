# Game_coaching

## API docs

https://documenter.getpostman.com/view/21649947/2s93CRMCaj

## How to start developing

Run this

`git clone https://github.com/metaverse-ventures/Gaming_marketplace-backend.git`

`yarn install`

## Dev settings

1. `.vscode` handles all vscode standard settings **(DO_NOT_EDIT)**
2. `.prettiererc` and `.prettierignore` handles standard formatting accross all editors **(DO_NOT_EDIT)**
3. `.eslintrc.js` handles all the linting rules. (Current rules mentions that unused variables starting with \_ will be ignored) **(DO_NOT_EDIT)**
4. `.npmrc` and `.nvmrc` handles a constant node version. Set to 18.x.x. **(DO_NOT_EDIT)**
5. git commit does the following actions:
    - `yarn format` on the project
    - `yarn lint` on the project
    - Checks commit message starts according to these. For more info view `commitlint.config.js`. E.g. `git commit -m "refactor: edited function descriptions for xyz component"`
        - misc: Changes that do not fall under any categories, like experimental code / temp changes / commented code
        - dev: Changes that are made as iteration to development
        - build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
        - ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
        - docs: Documentation only changes
        - feat: A new feature
        - fix: A bug fix
        - perf: A code change that improves performance
        - refactor: A code change that neither fixes a bug nor adds a feature
        - style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
        - test: Adding missing tests or correcting existing tests
    - Refer [here](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) in case of any doubts

## Backend (NestJS) project structure

-   `/src/_common`
    -   `/decorators/validation` - Includes validation decorators and classes
    -   `/exceptions` - Includes exception filers
    -   `/middleware` - Includes all guards and middlewares
    -   `/schema` - Includes all db schema, with index.js including all modelDefs in mongodb
    -   `types.global.ts` - Includes all the global objects
    -   `**/*.dto.ts` - Class defining request dtos with class-validator declarations
-   `**/*.module.ts` - NestJS module
-   `**/*.controller.ts` - Route handler for the module, which includes all the CRUD requests
-   `**/*.service.ts` - Service handler for the controller, which will contain all business logic and db calls
-   `**/*.controller.spec.ts` - unit test handler for (controller+service) using jest.
-   `/test` - end-to-end test handler using jest.
"# Sol-Quest-Backend" 
